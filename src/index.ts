import "reflect-metadata";
import { ApolloServerPluginDrainHttpServer } from "apollo-server-core";
import { ApolloServer } from "apollo-server-express";
import express from "express";
import { buildSchema } from "type-graphql";
import * as http from "http";
import { TaskResolver } from "./resolvers/task";
import { Task } from "./entities/Task";
import { createConnection } from "typeorm";

const CONTAINER_PORT = 8080;
const main = async () => {
  const conn = createConnection({
    type: "postgres",
    host: "localhost",
    port: 5432,
    database: "postgres",
    username: "postgres",
    password: "postgres",
    logging: true,
    synchronize: true,
    entities: [Task],
  });

  await (
    await conn
  ).runMigrations;

  const app = express();
  const httpServer = http.createServer(app);
  const apolloServer = new ApolloServer({
    plugins: [ApolloServerPluginDrainHttpServer({ httpServer })],
    schema: await buildSchema({
      resolvers: [TaskResolver],
      validate: false,
    }),
  });

  await apolloServer.start();

  apolloServer.applyMiddleware({ app });

  await new Promise<void>((resolve) =>
    httpServer.listen({ port: CONTAINER_PORT }, resolve)
  );

  console.log(
    `🚀 Server ready at http://localhost:${CONTAINER_PORT}${apolloServer.graphqlPath}`
  );

  return { apolloServer, app };
};

main().catch((err) => {
  console.error(err);
});
