/// <reference path="../process-env.d.ts" />

import express from 'express';
import cors from 'cors'
import morgan from "morgan";
import http from 'http';
import dotenv from 'dotenv';

import { ApolloServer } from '@apollo/server';
import { expressMiddleware } from '@apollo/server/express4';
import { ApolloServerPluginDrainHttpServer } from '@apollo/server/plugin/drainHttpServer';
import { ApolloServerErrorCode } from '@apollo/server/errors';
import { makeExecutableSchema } from "@graphql-tools/schema";

import { WebSocketServer } from "ws";
import { useServer } from "graphql-ws/lib/use/ws";
import bodyParser from 'body-parser';

import { typeDefs } from './graphql/schema.js';
import { resolvers } from './graphql/resolves.js';
import connectToMongoDb from './configs/connectToMongoDB.js';


const app = express();

dotenv.config();

app.use(express.json());
app.use(cors({}));
app.use(morgan('dev'));

const httpServer = http.createServer(app);

const schema = makeExecutableSchema({ typeDefs, resolvers });

const apolloServer = new ApolloServer({

    schema,

    formatError: (formattedError, error) => {
        if (
            formattedError.extensions?.code ===
            ApolloServerErrorCode.GRAPHQL_VALIDATION_FAILED
        ) {
            return {
                ...formattedError,
                message: "Your query doesn't match the schema. Try double-checking it!",
            };
        }
        return formattedError;
    },

    plugins: [
        ApolloServerPluginDrainHttpServer({ httpServer }),

        {
            async serverWillStart() {
                return {
                    async drainServer() {
                        await wsServerCleanup.dispose();
                    },
                };
            },
        },

    ],
});

const wsServer = new WebSocketServer({
    server: httpServer,
    path: "/graphql",
});

const wsServerCleanup = useServer({ schema }, wsServer);

(async function () {

    await apolloServer.start();
    await connectToMongoDb();
    app.use("/calendar", bodyParser.json(), expressMiddleware(apolloServer));

})();


const port = process.env.SERVER_PORT || 4000;

httpServer.listen(port, () => {
    console.log(`🚀 Query endpoint ready at http://localhost:${port}/calendar`);
    console.log(
        `🚀 Subscription endpoint ready at ws://localhost:${port}/subscriptions`
    );
});
