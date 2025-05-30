import { readFileSync } from 'fs';
import path from 'path';
import {
  resolvers as scalarResolvers,
  typeDefs as scalarTypeDefs,
} from 'graphql-scalars';
import { UserResolver } from './user/user.resolver.js';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const userTypes = readFileSync(
  path.join(__dirname, './typeDefs/user.graphql'),
  {
    encoding: 'utf-8',
  },
);

// define schema types for different models
export const typeDefs = `
    ${scalarTypeDefs}
    ${userTypes}
`;

// define resolvers
export const resolvers = {
  ...scalarResolvers,
  Query: {
    ...UserResolver.Query,
  },
  Mutation: {
    ...UserResolver.Mutation,
  },
};
