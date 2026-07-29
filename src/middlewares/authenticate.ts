import { expressjwt } from 'express-jwt';
import * as jwksClient from 'jwks-rsa';
import { Config } from '../config';
import { Request, RequestHandler } from 'express';
import { decode, JwtPayload } from 'jsonwebtoken';
import createHttpError from 'http-errors';
import { AuthRequest } from '../types';

type AuthTokenPayload = JwtPayload & {
    sub: string;
    role: string;
};

const getToken = (req: Request) => {
    const authHeader = req.headers.authorization;

    if (authHeader && authHeader.split(' ')[1] !== undefined) {
        const token = authHeader.split(' ')[1];
        if (token) {
            console.log('auth header', token);
            return token;
        }
    }

    type authCookie = {
        accessToken: string;
    };

    const { accessToken } = req.cookies as authCookie;
    console.log('cookie token', accessToken);
    return accessToken;
};

const testAuthenticate: RequestHandler = (req, res, next) => {
    const token = getToken(req);

    if (!token) {
        next(createHttpError(401, 'No authorization token was found'));
        return;
    }

    const decoded = decode(token, { complete: true });

    if (!decoded || typeof decoded === 'string' || !decoded.payload) {
        next(createHttpError(401, 'Invalid token'));
        return;
    }

    const authRequest = req as AuthRequest;
    authRequest.auth = decoded.payload as AuthTokenPayload;
    return next();
};

const productionAuthenticate = expressjwt({
    secret: jwksClient.expressJwtSecret({
        jwksUri: Config.JWKS_URI,
        rateLimit: true,
        cache: true,
    }),
    algorithms: ['RS256'],
    getToken,
});

export default process.env.NODE_ENV === 'test'
    ? testAuthenticate
    : productionAuthenticate;
