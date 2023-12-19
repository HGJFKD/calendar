
import { RedisCommandArgument } from '@redis/client/dist/lib/commands/index.js'
import redis from 'redis'
import { config } from "dotenv"
;
config()

const redisClient = redis.createClient()

const DEFAULT_EXPIRATION = 3600

const getOrSetCache = (key: RedisCommandArgument, cd: () => Promise<any>) => {
    return new Promise(async (resolve, reject) => {
        try {
            const [redisData, freshData] = await Promise.all([
                redisClient.GET(key),
                cd()
            ]);
            if (redisData != null) {
                console.log("redis"); // log
                resolve(JSON.parse(redisData));
            } else {
                console.log("mongoose"); // log
                await redisClient.SETEX(key, DEFAULT_EXPIRATION, JSON.stringify(freshData));
                resolve(freshData);
            }
        } catch (error) {
            reject(error);
        }
    });
};


const Redis = {
    redisClient,
    getOrSetCache
}

export default Redis