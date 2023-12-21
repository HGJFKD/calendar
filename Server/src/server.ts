

import express from 'express';
import cors from 'cors'
import morgan from "morgan";
import http from 'http';
import { config } from 'dotenv';

import { ApolloServer } from '@apollo/server';
import { expressMiddleware } from '@apollo/server/express4';
import { ApolloServerPluginDrainHttpServer } from '@apollo/server/plugin/drainHttpServer';
import { ApolloServerErrorCode } from '@apollo/server/errors';
import { makeExecutableSchema } from "@graphql-tools/schema";

import { WebSocketServer } from "ws";
import { useServer } from "graphql-ws/lib/use/ws";
import bodyParser from 'body-parser';

import { getMessageFromKafka } from "./kafka/consumer.js";
import sendKafkaMessage from "./kafka/utils.js";
import kafka from "./kafka/kafkaInstance.js";
import producer from "./kafka/producer.js";

import { typeDefs } from './graphql/schema.js';
import { resolvers } from './graphql/resolves.js';
import connectToMongoDb from './configs/connectToMongoDB.js';

const app = express();

config();

console.log(process.env.SERVER_PORT);

const port = process.env.SERVER_PORT || 4000;

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cors<cors.CorsRequest>());
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
    path: "/calendar",
});

const wsServerCleanup = useServer({ schema }, wsServer);


(async function () {
    await apolloServer.start();
    connectToMongoDb();
    app.use("/calendar", bodyParser.json(), expressMiddleware(apolloServer));




})();

httpServer.listen(port, () => {
    console.log(`🚀 Query endpoint ready at http://localhost:${port}/calendar`);
    console.log(
        `🚀 Subscription endpoint ready at ws://localhost:${port}/subscriptions`
    );

    sendKafkaMessage(producer, "test-topic", "Hello KafkaJS user!")
        .then(() => {
            console.log(`Connected Successful To Kafka`);
            getMessageFromKafka(kafka, "test-group", "test-topic")
        })
        .catch((err) => console.log(`GetMessageFromKafka Error: ${err.message}`))
        .catch((error) => console.log(`Connect To Kafka Error: ${error}`))
})
