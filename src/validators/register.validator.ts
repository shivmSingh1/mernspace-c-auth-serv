import { checkSchema } from 'express-validator';

export default checkSchema({
    email: {
        errorMessage: 'email is missing',
        notEmpty: {
            errorMessage: 'email is missing',
            bail: true,
        },
        //sanitization of email feild
        trim: true,
        isEmail: true,
    },
    firstName: {
        errorMessage: 'firstName is missing',
        notEmpty: true,
    },
    lastName: {
        errorMessage: 'lastName is missing',
        notEmpty: true,
    },
    password: {
        errorMessage: 'password is missing',
        notEmpty: {
            errorMessage: 'password is missing',
            bail: true,
        },
        isLength: {
            options: {
                min: 8,
            },
            errorMessage: 'password length is must be greater than 8 chars.',
        },
    },
});
