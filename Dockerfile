# --- Base Stage ---
# Contains common setup for all other stages
FROM node:22.14.0-alpine AS base
# set working directory
WORKDIR /usr/app_name
# Add the SSL symlink fix for Prisma [https://github.com/nodejs/docker-node/issues/2175#issuecomment-2530130523]
# will be resolved in prisma v6
RUN ln -s /usr/lib/libssl.so.3 /lib/libssl.so.3

# --- Development Stage ---
# TARGETED BY: your docker-compose.dev.yml
FROM base AS development
# copy .json files for installation
COPY package*.json .
COPY server/package*.json ./server/
# copy prisma directory - can be removed if using other ORMs
COPY server/prisma ./server/prisma
# install dependencies
RUN npm install


# --- Builder Stage ---
# USED BY: The final `production` stage.
FROM development AS builder
# copy all files to workdir
COPY . .
# build source code
RUN npm run server:build


# --- Production Stage ---
# TARGETED BY: your docker-compose.prod.yml
FROM base AS production
# argument for environment (ARG - available during build process | ENV - available in the container)
ENV NODE_ENV=production

COPY package*.json .
COPY server/package.json ./server/

# Copy all necessary artifacts from the builder stage
COPY --from=builder /usr/app_name/node_modules ./node_modules
COPY --from=builder /usr/app_name/server/dist ./server/dist
COPY --from=builder /usr/app_name/server/src/graphql ./server/dist/graphql
COPY --from=builder /usr/app_name/server/prisma ./server/prisma

RUN npm ci --only=production

# copy dist files from build step
COPY --from=builder /usr/app_name/server/dist ./server/dist

HEALTHCHECK --interval=5m --timeout=3s \
  CMD curl -f http://localhost:3000/health-check || exit 1

CMD ["sh", "-c", "npm run server:deploy:migrate && npm run server:start"]
