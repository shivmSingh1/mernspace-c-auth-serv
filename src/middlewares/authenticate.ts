// import fs from 'fs';
// import path from 'path';
// import { expressjwt } from 'express-jwt';
// import { Request, RequestHandler } from 'express';
// import { decode, JwtPayload } from 'jsonwebtoken';
// import createHttpError from 'http-errors';
// import { authCookie, AuthRequest } from '../types';

// type AuthTokenPayload = JwtPayload & {
//     sub: string;
//     role: string;
// };

// const publicKeyPath = path.join(__dirname, '../../certs/publicKey.pem');
// let publicKey = process.env.PUBLIC_KEY || '';

// if (!publicKey && process.env.NODE_ENV !== 'test') {
//     try {
//         publicKey = fs.readFileSync(publicKeyPath, 'utf8');
//     } catch {
//         const err = createHttpError(
//             500,
//             `Unable to load public key from ${publicKeyPath}`,
//         );
//         throw err;
//     }
// }
// //comment
// const getToken = (req: Request) => {
//     const authHeader = req.headers.authorization;

//     if (authHeader && authHeader.split(' ')[1] !== undefined) {
//         const token = authHeader.split(' ')[1];
//         if (token) {
//             console.log('auth header', token);
//             return token;
//         }
//     }

//     const { accessToken } = req.cookies as authCookie;
//     // console.log('cookie token', accessToken);
//     return accessToken;
// };

// const testAuthenticate: RequestHandler = (req, res, next) => {
//     const token = getToken(req);

//     if (!token) {
//         next(createHttpError(401, 'No authorization token was found'));
//         return;
//     }

//     const decoded = decode(token, { complete: true });

//     if (!decoded || typeof decoded === 'string' || !decoded.payload) {
//         next(createHttpError(401, 'Invalid token'));
//         return;
//     }

//     const authRequest = req as AuthRequest;
//     authRequest.auth = decoded.payload as AuthTokenPayload;
//     return next();
// };

// const productionAuthenticate = expressjwt({
//     secret: () => publicKey,
//     algorithms: ['RS256'],
//     getToken,
// });

// export default process.env.NODE_ENV === 'test'
//     ? testAuthenticate
//     : productionAuthenticate;

import { expressjwt, GetVerificationKey } from 'express-jwt';
import { Request } from 'express';
import jwksClient from 'jwks-rsa';
import { Config } from '../config';
import { authCookie } from '../types';

export default expressjwt({
    secret: jwksClient.expressJwtSecret({
        jwksUri: Config.JWKS_URI,
        cache: true,
        rateLimit: true,
    }) as GetVerificationKey,
    algorithms: ['RS256'],
    getToken(req: Request) {
        const authHeader = req.headers.authorization;

        // Bearer eyjllsdjfljlasdjfljlsadjfljlsdf
        if (authHeader && authHeader.split(' ')[1] !== 'undefined') {
            const token = authHeader.split(' ')[1];
            if (token) {
                return token;
            }
        }

        const { accessToken } = req.cookies as authCookie;
        return accessToken;
    },
});
