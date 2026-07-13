import express, {
    type NextFunction,
    type Request,
    type Response,
} from 'express';
import type { HttpError } from 'http-errors';
// import createHttpError from 'http-errors';

const app = express();

app.get('/', (req, res) => {
    // const err = createHttpError(401, "you can't access this route rn.")
    // throw err
    res.send('Auth service is working');
});

//global error handler
app.use((err: HttpError, req: Request, res: Response, next: NextFunction) => {
    const statusCode = err.statusCode || 500;
    res.status(statusCode).json({
        errors: [
            {
                type: err.name,
                msg: err.message,
                path: '',
                location: '',
            },
        ],
    });
    next();
});

export default app;
