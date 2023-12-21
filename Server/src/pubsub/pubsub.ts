import { RedisPubSub } from "graphql-redis-subscriptions";

const pubsub = new RedisPubSub({
    connection: {
        host: 'localhost',
        port: 6379,
    }
});

export default pubsub;