import bcrypt from 'bcrypt';
import RequestError from "../types/errors/RequestError.js";
import STATUS_CODES from "./StatusCodes.js";
import userDal from '../dal/userDal.js';

const validateEmail = (email: string) => {
    const emailRegex = /^[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,}$/;
    if (!emailRegex.test(email)) {
        throw new RequestError('Invalid Email', STATUS_CODES.BAD_REQUEST);
    }
};

const hashPassword = async (password: any) => {
    const salt = await bcrypt.genSalt();
    return bcrypt.hash(password, salt);
};

const validatePassword = async (password: string, hashedPassword: string) => {

    const bcryptPassword = await bcrypt.compare(password, hashedPassword);
    if (!bcryptPassword) {
        throw new RequestError("Error while validating password:", STATUS_CODES.INTERNAL_SERVER_ERROR);
    }
    return bcryptPassword

};

// const validateLogin = async (email: string, password: string) => {
//     const user: any = await userDal.getUserByEmailService(email);
//     if (!user) {
//         throw new RequestError('User not found', STATUS_CODES.BAD_REQUEST);
//     }
//     const hash = user[0]
//     const isPasswordValid = await userDal.validatePasswordService(password, hash.password)
//     if (!isPasswordValid) {
//         throw new RequestError('Invalid password', STATUS_CODES.BAD_REQUEST);

//     }
//     return user;
// }

export const validate = {
    validateEmail,
    hashPassword,
    validatePassword,
    // validateLogin
}