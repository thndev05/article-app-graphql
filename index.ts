import express, { Express, Request } from 'express';
import * as database from './config/database'
import dotenv from 'dotenv';
import { ApolloServer } from "@apollo/server";
import { expressMiddleware } from '@as-integrations/express5';
// import { startStandaloneServer } from "@apollo/server/standalone";
import { typeDefs } from './typeDefs/index.typeDefs';
import { resolvers } from './resolvers/index.resolvers';
import { extractUserFromToken } from './middlewares/auth.middleware';

const startServer = async () => {
  dotenv.config();

  database.connect();

  const app: Express = express();
  const port: any = process.env.PORT || 3000;

  app.use(express.json());

  // GraphQL
  const apolloServer = new ApolloServer({ 
    typeDefs: typeDefs, 
    resolvers: resolvers,
    introspection: true
  });
  await apolloServer.start();

  // Cách 1: Khởi động GraphQL server riêng biệt  
  // const { url } = await startStandaloneServer(apolloServer, {
  //   listen: { 
  //     port: port 
  //   }
  // });

  // Cách 2: Khởi động GraphQL server với expressMiddleware from '@as-integrations/express5'
  app.use('/graphql', 
    expressMiddleware(apolloServer, {
      context: async ({ req }: { req: Request }) => {
        const user = await extractUserFromToken(req);
        return { 
          user: user,
          req: req
        }
      }
    })
  );

  app.listen(port, () => {
    console.log(`🚀 Server is running on http://localhost:${port}`);
    console.log(`🎯 GraphQL available at http://localhost:${port}/graphql`);
  });
};

startServer();