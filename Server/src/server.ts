import express from 'express';
import cors from 'cors'
import morgan from "morgan";
import http from 'http';

import { ApolloServer } from '@apollo/server';
import { expressMiddleware } from '@apollo/server/express4';
import { ApolloServerPluginDrainHttpServer } from '@apollo/server/plugin/drainHttpServer';
import { ApolloServerErrorCode } from '@apollo/server/errors';

import { typeDefs } from './graphql/schema.js';
import { resolvers } from './graphql/resolves.js';
import connectToMongoDb from './configs/connectToMongoDB.js';

const app = express();

app.use(express.json());
app.use(cors({}));
app.use(morgan('dev'));

const httpServer = http.createServer(app);

const server = new ApolloServer(
    {
        typeDefs,
        resolvers,

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
            ApolloServerPluginDrainHttpServer({ httpServer })
            
        ],
    },

);
server.start().then(async () => {

    await connectToMongoDb();
    app.use(
        '/calendar', expressMiddleware(server)
    );
});

const port = 4000;

httpServer.listen(port, () => {
    console.log(`🚀 Query endpoint ready at http://localhost:${port}/calendar`);
});

