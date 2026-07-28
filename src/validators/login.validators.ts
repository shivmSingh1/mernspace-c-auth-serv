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
    password: {
        errorMessage: 'password is missing',
        notEmpty: {
            errorMessage: 'password is missing',
            bail: true,
        },
    },
});
