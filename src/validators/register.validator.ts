import { checkSchema } from 'express-validator';

export default checkSchema({
    email: {
        errorMessage: 'email is missing',
        notEmpty: true,
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
        notEmpty: true,
    },
});
