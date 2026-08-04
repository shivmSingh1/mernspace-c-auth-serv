import fs from 'node:fs';
import { JwtPayload, verify } from 'jsonwebtoken';
import { Repository } from 'typeorm';

import { TokenService } from '../../services/tokenService';
import { RefreshToken } from '../../entities/RefreshToken';
import { Config } from '../../config';

jest.mock('node:fs', () => ({
    existsSync: jest.fn(),
    readFileSync: jest.fn(),
}));

describe('TokenService', () => {
    let refreshTokenRepo: {
        save: jest.Mock;
        delete: jest.Mock;
    };

    let tokenService: TokenService;

    beforeEach(() => {
        refreshTokenRepo = {
            save: jest.fn(),
            delete: jest.fn(),
        };

        tokenService = new TokenService(
            refreshTokenRepo as unknown as Repository<RefreshToken>,
        );
    });

    afterEach(() => {
        jest.restoreAllMocks();
    });

    describe('generateAccessToken', () => {
        // it('should generate an access token using Config.PRIVATE_KEY', () => {
        //     expect(Config.PRIVATE_KEY).toBeTruthy();

        //     const token = tokenService.generateAccessToken({
        //         sub: '1',
        //         role: 'customer',
        //     });

        //     expect(typeof token).toBe('string');

        //     const decoded = verify(token, Config.PRIVATE_KEY, {
        //         algorithms: ['RS256'],
        //         issuer: 'auth-service',
        //     }) as JwtPayload;

        //     expect(decoded.sub).toBe('1');
        //     expect(decoded.role).toBe('customer');
        // });

        // it('should read private key from pem file when Config.PRIVATE_KEY is empty', () => {
        //     const originalKey = Config.PRIVATE_KEY;

        //     (Config as { PRIVATE_KEY: string }).PRIVATE_KEY = '';

        //     (fs.existsSync as jest.Mock).mockReturnValue(true);
        //     (fs.readFileSync as jest.Mock).mockReturnValue(originalKey);

        //     const token = tokenService.generateAccessToken({
        //         sub: '10',
        //     });

        //     expect(fs.existsSync).toHaveBeenCalled();
        //     expect(fs.readFileSync).toHaveBeenCalled();

        //     expect(typeof token).toBe('string');

        //     (Config as { PRIVATE_KEY: string }).PRIVATE_KEY = originalKey;
        // });

        it('should throw when no private key exists', () => {
            const originalKey = Config.PRIVATE_KEY;

            (Config as { PRIVATE_KEY: string }).PRIVATE_KEY = '';

            (fs.existsSync as jest.Mock).mockReturnValue(false);

            expect(() =>
                tokenService.generateAccessToken({
                    sub: '1',
                }),
            ).toThrow('error while reading privateKey');

            (Config as { PRIVATE_KEY: string }).PRIVATE_KEY = originalKey;
        });
    });

    describe('generateRefreshToken', () => {
        it('should generate a valid refresh token', () => {
            const token = tokenService.generateRefreshToken({
                id: 1,
            });

            expect(typeof token).toBe('string');

            const decoded = verify(
                token,
                Config.REFRESH_TOKEN_SECRET,
            ) as JwtPayload;

            expect(decoded.jti).toBe('1');
        });
    });

    describe('persistRefreshToken', () => {});

    describe('deleteRefreshToken', () => {
        it('should delete refresh token', async () => {
            refreshTokenRepo.delete.mockResolvedValue({ affected: 1 });

            await tokenService.deleteRefreshToken(5);

            expect(refreshTokenRepo.delete).toHaveBeenCalledWith({
                id: 5,
            });
        });
    });
});
