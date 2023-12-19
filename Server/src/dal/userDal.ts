import RequestError from "../types/errors/RequestError.js";
import STATUS_CODES from "../utils/StatusCodes.js";
import eventModel from '../models/eventModel.js';
import User, { userEvents } from '../types/user.js';
import { Types } from 'mongoose';

const addUser = async (newUser: User)
    : Promise<userEvents | null> => {
    const res = await eventModel.create(newUser);
    if (!res) {
        throw new RequestError(
            `Error adding User: ${newUser.first_name}, ${newUser.last_name}`,
            STATUS_CODES.INTERNAL_SERVER_ERROR
        )
    }
    return res;
}

// Find User By Id
const findUserById = async (userId: Types.ObjectId)
    : Promise<boolean> => {
    const res = await eventModel.findById(userId);
    if (!res) {
        throw new RequestError(
            'User not found',
            STATUS_CODES.NOT_FOUND
        );
    }
    return res ? true : false
}

// login
const getUserByEmail = async (email: string) => {

    const result = await eventModel.findOne({ email }).exec();
    if (!result) {
        throw new RequestError("Error while getting user by email:",
            STATUS_CODES.INTERNAL_SERVER_ERROR);
    }
    return result
};


const deleteUser = async (userId: Types.ObjectId) => {

    const deleteUser = await eventModel.findByIdAndDelete(userId)
        .exec()
        .then((deletedDocument) => {
            if (deleteUser) {
                return `User with ID ${userId} deleted successfully`;
            } else {
                throw new RequestError("User not found", STATUS_CODES.NOT_FOUND);
            }
        })
        .catch((error) => {
            throw new RequestError(
                `Error deleting User: ${error}`,
                STATUS_CODES.INTERNAL_SERVER_ERROR
            )
        })
};


const userDal = {
    addUser,
    getUserByEmail,
    findUserById,
    deleteUser,
}

export default userDal