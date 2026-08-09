import { expressjwt } from 'express-jwt';
import { Config } from '../config';
import { Request } from 'express';
import { authCookie, IRefreshTokenPayload } from '../types';
import { AppDataSource } from '../config/data-source';
import logger from '../config/logger';
import { RefreshToken } from '../entities/RefreshToken';

export default expressjwt({
    secret: Config.REFRESH_TOKEN_SECRET,
    algorithms: ['HS256'],
    getToken(req: Request) {
        const { refreshToken } = req.cookies as authCookie;
        return refreshToken;
    },
    async isRevoked(request: Request, token) {
        try {
            const refreshTokenRepo = AppDataSource.getRepository(RefreshToken);
            const tokenPayload = token?.payload as IRefreshTokenPayload & {
                sub?: string;
            };
            const refreshToken = await refreshTokenRepo.findOne({
                where: {
                    id: Number(tokenPayload?.id ?? 0),
                    user: { id: Number(tokenPayload?.sub ?? 0) },
                },
            });
            return refreshToken === null;
        } catch {
            logger.error('Error while getting the refresh token', {
                id: Number((token?.payload as IRefreshTokenPayload).id ?? 0),
            });
        }
        return true;
    },
});

/*

Request
   │
   ▼
getToken()
   │
   ├── Token nahi mila
   │       │
   │       ▼
   │   401 Unauthorized
   │   ("No authorization token was found")
   │
   └── Token mil gaya
           │
           ▼
     JWT Verify
           │
           ├── Invalid / Expired
           │       │
           │       ▼
           │   401 Unauthorized
           │
           └── Valid
                   │
                   ▼
             isRevoked()
                   │
                   ├── true
                   │      ▼
                   │   401 Unauthorized
                   │
                   └── false
                          ▼
                     Controller 
                     
                     */
