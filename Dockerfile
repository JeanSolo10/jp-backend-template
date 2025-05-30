# --- Build Stage ---
FROM node:22.14.0-alpine AS build
# set working directory
WORKDIR /usr/app_name
# Add the SSL symlink fix for Prisma [https://github.com/nodejs/docker-node/issues/2175#issuecomment-2530130523]
# will be resolved in prisma v6
RUN ln -s /usr/lib/libssl.so.3 /lib/libssl.so.3
# copy .json files for installation
COPY package*.json .
COPY server/package*.json ./server/
# copy prisma directory - can be removed if using other ORMs
COPY server/prisma ./server/prisma
# install dependencies
RUN npm install
# copy all files to workdir
COPY . .
# build source code
RUN npm run server:build

# --- Production Stage ---
FROM node:22.14.0-alpine AS production
# argument for environment (ARG - available during build process | ENV - available in the container)
ARG NODE_ENV=production 
ENV NODE_ENV=${NODE_ENV}

WORKDIR /usr/app_name

COPY package*.json .
COPY server/package*.json ./server/

RUN npm ci --only=production

# copy dist files from build step
COPY --from=build /usr/app_name/server/dist ./server/dist

HEALTHCHECK --interval=5m --timeout=3s \
  CMD curl -f http://localhost:3000/health-check || exit 1

CMD ["node", "server/dist/server.js"]
