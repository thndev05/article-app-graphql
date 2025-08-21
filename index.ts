import express, { Express, Request, Response } from 'express';
import * as database from './config/database'
import dotenv from 'dotenv';
import { ApolloServer } from "@apollo/server";
import { startStandaloneServer } from "@apollo/server/standalone";
import { typeDefs } from './typeDefs';
import { resolvers } from './resolvers';

const startServer = async () => {
  dotenv.config();

  database.connect();

  const app: Express = express();
  const port: any = process.env.PORT || 3000;

  // GraphQL
  const apolloServer = new ApolloServer({ typeDefs, resolvers });

  // Khởi động GraphQL server riêng biệt  
  const { url } = await startStandaloneServer(apolloServer, {
    listen: { 
      port: port 
    } 
  });

  console.log(`🎯 GraphQL server ready at ${url}`);

  app.listen(port, () => {
    console.log(`🚀 Server is running on http://localhost:${port}`);
    console.log(`🎯 GraphQL available at http://localhost:${port}/graphql`);
  });
};

startServer();