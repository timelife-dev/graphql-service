import "reflect-metadata";
import * as http from "http";
import { ApolloServerPluginDrainHttpServer } from "apollo-server-core";
import { ApolloServer } from "apollo-server-express";
import { buildSchema } from "type-graphql";
import { createConnection } from "typeorm";
import { MyContext } from "./types";
import { TaskResolver } from "./resolvers/task";
import { Task } from "./entities/Task";
import { UserResolver } from "./resolvers/user";
import { User } from "./entities/User";
import express from "express";
import Redis from "ioredis";
import session from "express-session";
import connectRedis from "connect-redis";

const main = async () => {
  
  const HOST = "localhost";
  const CONTAINER_PORT = 8080;
  const DB_NAME = "postgres";
  const DB_USER = "postgres";
  const DB_PASSWORD = "postgres";
  const DB_PORT = 5432;
  const REDIS_URL = "127.0.0.1:6379";
  const REDIS_SECRET = "eYVX7EwVmmxKPCDmwMtyKVge8oLd2t81";

  const conn = createConnection({
    type: "postgres",
    host: HOST,
    port: DB_PORT,
    database: DB_NAME,
    username: DB_USER,
    password: DB_PASSWORD,
    logging: true,
    synchronize: false,
    entities: [Task, User],
  });

  await (
    await conn
  ).runMigrations;

  const app = express();

  const RedisStore = connectRedis(session);
  const redisClient = new Redis(REDIS_URL);

  app.set("trust proxy", 1);
  // app.use(
  //   cors({
  //     origin:"http://localhost8080",
  //     credentials: true
  //   })
  // )
  app.set('trust proxy', true)
  app.use(
    session({
      name: "qid",
      store: new RedisStore({
        client: redisClient,
        disableTouch: true,
      }),
      cookie: {
        maxAge: 1000 * 60 * 60 * 24 * 30,
        httpOnly: true,
        sameSite: "none",
        secure: true,
      },
      secret: REDIS_SECRET,
      saveUninitialized: false,
      resave: false,
    })
  );

  const httpServer = http.createServer(app);

  const apolloServer = new ApolloServer({
    plugins: [ApolloServerPluginDrainHttpServer({ httpServer })],
    schema: await buildSchema({
      resolvers: [TaskResolver, UserResolver],
      validate: false,
    }),
    context: ({ req, res }): MyContext => ({ req, res }),
  });


  await apolloServer.start();

  const corsOptions = {
    origin: "https://studio.apollographql.com",
    credentials: true,
  };

  apolloServer.applyMiddleware({
    app,
    cors: corsOptions,
  });

  await new Promise<void>((resolve) =>
    httpServer.listen({ port: CONTAINER_PORT }, resolve)
  );

  console.log(
    `🚀 Server ready at http://${HOST}:${CONTAINER_PORT}${apolloServer.graphqlPath}`
  );

  return { apolloServer, app };
};

main().catch((err) => {
  console.error(err);
});
