import 'reflect-metadata';
import express, {
    type NextFunction,
    type Request,
    type Response,
} from 'express';
import type { HttpError } from 'http-errors';
import router from './routes/auth';
import logger from './config/logger';
import cookieParser from 'cookie-parser';
import tenantRouter from './routes/tenant';
import cors from 'cors';
// import createHttpError from 'http-errors';

const app = express();

app.get('/', (req, res) => {
    // const err = createHttpError(401, "you can't access this route rn.")
    // throw err
    res.send('Auth service is working');
});

app.use(
    cors({
        origin: 'http://localhost:5173',
        credentials: true,
    }),
);
app.use(express.static('public'));
app.use(cookieParser());
app.use(express.json());
app.use('/auth', router);
app.use('/tenant', tenantRouter);

//global error handler
app.use((err: HttpError, req: Request, res: Response, next: NextFunction) => {
    logger.error(err.message);
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
