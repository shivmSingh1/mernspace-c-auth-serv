import { checkSchema } from 'express-validator';

export default checkSchema({
    name: {
        errorMessage: 'name is missing',
        //sanitization of email feild
        trim: true,
        notEmpty: {
            errorMessage: 'name is missing',
            bail: true,
        },
    },
    address: {
        errorMessage: 'password is missing',
        trim: true,
        notEmpty: {
            errorMessage: 'password is missing',
            bail: true,
        },
    },
});
