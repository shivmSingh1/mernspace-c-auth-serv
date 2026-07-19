import { checkSchema } from 'express-validator';

export default checkSchema({
    email: {
        errorMessage: 'Invalid username',
        notEmpty: true,
    },
});
