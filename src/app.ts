import 'reflect-metadata';
import express from 'express';
import router from './routes/auth';
import cookieParser from 'cookie-parser';
import tenantRouter from './routes/tenant';
import cors from 'cors';
import userRouter from './routes/user';
import { globalErrorHandler } from './middlewares/globalErrorhandler';

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
app.use(
    express.static('./public', {
        dotfiles: 'allow',
    }),
);
app.use(cookieParser());
app.use(express.json());
app.use('/auth', router);
app.use('/tenants', tenantRouter);
app.use('/users', userRouter);

//global error handler
app.use(globalErrorHandler);

export default app;
