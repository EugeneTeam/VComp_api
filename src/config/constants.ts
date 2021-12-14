import dotEnv from 'dotenv';
dotEnv.config();

export const PASSWORD_SALT: number = 13;
export const AUTHORIZATION_TOKEN_SECRET: string = process.env.AUTHORIZATION_TOKEN_SECRET || 'gf8g7AR6f8d7h5shFdsf';
export const AUTHORIZATION_TOKEN_EXPIRE_REMEMBER: number = 30 * 24 * 60 * 60;
export const AUTHORIZATION_TOKEN_EXPIRE: number = 24 * 60 * 60;
export const ACTIVATION_TOKEN_EXPIRED: number = 60 * 30;
export const AUTHORIZATION_TOKEN_SIZE: number = 10;
