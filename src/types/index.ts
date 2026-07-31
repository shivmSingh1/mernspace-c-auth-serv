import { Request } from 'express';

export interface UserData {
    firstName: string;
    lastName: string;
    email: string;
    password: string;
}

export interface RegisterUserInterface extends Request {
    body: UserData;
}

export interface AuthRequest extends Request {
    auth: {
        sub: string;
        role: string;
        id?: string;
        tenant?: string;
        firstName?: string;
        lastName?: string;
        email?: string;
    };
}

export type authCookie = {
    accessToken: string;
    refreshToken: string;
};

export type IRefreshTokenPayload = {
    id: string;
};

export type TenantData = {
    name: string;
    address: string;
};

export interface ITenantRequest extends Request {
    body: TenantData;
}
