import express from "express";
import { ApolloServer } from "@apollo/server";
import { expressMiddleware } from "@apollo/server/express4";
import { makeExecutableSchema } from "@graphql-tools/schema";
import { createServer } from "http";
import bodyParser from "body-parser";
import cors from "cors";
import { WebSocketServer } from "ws";
import { useServer } from "graphql-ws/lib/use/ws";
import { ApolloServerPluginDrainHttpServer } from "@apollo/server/plugin/drainHttpServer";
import { RedisPubSub } from "graphql-redis-subscriptions";

import typeDefs from "./schema/index.js";
import resolvers from "./resolvers/index.js";

const pubsub = new RedisPubSub({
  connection:
    "redis://default:testredis@redis-17288.c294.ap-northeast-1-2.ec2.cloud.redislabs.com:17288",
});
const PORT = 4000;

const context = (props) => ({ ...props, pubsub });

const app = express();
const httpServer = createServer(app);
const wsServer = new WebSocketServer({
  server: httpServer,
  path: "/subscription",
});
const schema = makeExecutableSchema({ typeDefs, resolvers });
const wsServerGraphql = useServer({ schema, context }, wsServer);
const server = new ApolloServer({
  schema,
  plugins: [
    ApolloServerPluginDrainHttpServer({ httpServer }),
    {
      async serverWillStart() {
        return {
          async drainServer() {
            await wsServerGraphql.dispose();
          },
        };
      },
    },
  ],
});
await server.start();
app.use("/graphql", cors(), bodyParser.json(), expressMiddleware(server, { context }));

httpServer.listen(PORT, () => {
  console.log("Listening on localhost:" + PORT);
});
