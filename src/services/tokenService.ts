import fs from 'fs';
import createHttpError from 'http-errors';
import { JwtPayload, sign } from 'jsonwebtoken';
import path from 'path';
import { Config } from '../config';
import { User } from '../entities/User';
import { Repository } from 'typeorm';
import { RefreshToken } from '../entities/RefreshToken';

export class TokenService {
    refreshTokenRepo: Repository<RefreshToken>;

    constructor(refreshTokenRepo: Repository<RefreshToken>) {
        this.refreshTokenRepo = refreshTokenRepo;
    }

    genrateAccessToken(payload: JwtPayload) {
        let privateKey: Buffer;
        try {
            privateKey = fs.readFileSync(
                path.join(__dirname, '../../certs/privateKey.pem'),
            );
        } catch {
            const err = createHttpError(500, 'error while reading privateKey');
            throw err;
        }

        const accessToken = sign(payload, privateKey, {
            algorithm: 'RS256',
            expiresIn: '1h',
            issuer: 'auth-service',
        });

        return accessToken;
    }

    genrateRefreshToken(payload: JwtPayload) {
        const refreshToken = sign(payload, Config.REFRESH_TOKEN_SECRET, {
            algorithm: 'HS256',
            expiresIn: '1y',
            issuer: 'auth-service',
            jwtid: String(payload.id),
        });
        return refreshToken;
    }

    async persistRefreshToken(user: User) {
        const MS_IN_Y = 1000 * 60 * 60 * 24 * 365;
        // const refreshTokenRepo = AppDataSource.getRepository(RefreshToken);
        const newRefreshToken = await this.refreshTokenRepo.save({
            user: user,
            expiresAt: new Date(Date.now() + MS_IN_Y),
        });

        return newRefreshToken;
    }
}
