import createHttpError from 'http-errors';
import { JwtPayload, sign } from 'jsonwebtoken';
import fs from 'node:fs';
import path from 'node:path';
import { Config } from '../config';
import { User } from '../entities/User';
import { Repository } from 'typeorm';
import { RefreshToken } from '../entities/RefreshToken';
import dotenv from 'dotenv';
dotenv.config({});

export class TokenService {
    refreshTokenRepo: Repository<RefreshToken>;

    constructor(refreshTokenRepo: Repository<RefreshToken>) {
        this.refreshTokenRepo = refreshTokenRepo;
    }

    generateAccessToken(payload: JwtPayload) {
        let privateKey = Config.PRIVATE_KEY;

        if (!privateKey) {
            const pemPath = path.join(__dirname, '../../certs/privateKey.pem');
            if (fs.existsSync(pemPath)) {
                privateKey = fs.readFileSync(pemPath, 'utf8');
            }
        }

        if (!privateKey) {
            throw createHttpError(500, 'error while reading privateKey');
        }

        const accessToken = sign(payload, privateKey, {
            algorithm: 'RS256',
            expiresIn: '1h',
            issuer: 'auth-service',
        });

        return accessToken;
    }

    generateRefreshToken(payload: JwtPayload) {
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
        const newRefreshToken = await this.refreshTokenRepo.save({
            user: user,
            expiresAt: new Date(Date.now() + MS_IN_Y),
        });

        return newRefreshToken;
    }

    async deleteRefreshToken(id: number) {
        await this.refreshTokenRepo.delete({ id });
    }
}
