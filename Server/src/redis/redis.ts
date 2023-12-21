
import { RedisCommandArgument } from '@redis/client/dist/lib/commands/index.js'
import { Types } from 'mongoose';
import * as redis from 'redis';

import Event from '../types/event.js';
import RequestError from '../types/errors/RequestError.js';
import STATUS_CODES from '../utils/StatusCodes.js';

const redisClient = redis.createClient({ url: 'redis://localhost:6379' })

const DEFAULT_EXPIRATION = 3600

const getOrSetCache = (
    key: RedisCommandArgument,
    cd: () => Promise<any>,
    redisOperation?: () => Promise<any>
    ) => {

    redisClient.connect()
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
                redisOperation ? 
                await redisOperation()
                :
                await redisClient.SETEX(key, DEFAULT_EXPIRATION, JSON.stringify(freshData));
                resolve(freshData);
            }
        } catch (error) {
            reject(error);
        } finally {
            redisClient.quit();
        }
    });

};

const processEvent = async (
    key: Types.ObjectId,
    event: Event
): Promise<any> => {

    try {
        await redisClient.rPush(key.toString(), JSON.stringify(event));
    } catch (error) {
        throw new RequestError(
            error as unknown as string,
            STATUS_CODES.INTERNAL_SERVER_ERROR
        )
    }


}

const Redis = {
    redisClient,
    getOrSetCache,
    processEvent
}

export default Redis