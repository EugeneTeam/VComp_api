import jwt, {JwtPayload, VerifyErrors} from 'jsonwebtoken';
import bcrypt from 'bcrypt';
import randToken from "rand-token";

import {prisma} from '../config/prismaClient';
import {
    PASSWORD_SALT,
    AUTHORIZATION_TOKEN_EXPIRE_REMEMBER,
    AUTHORIZATION_TOKEN_SECRET,
    AUTHORIZATION_TOKEN_EXPIRE, ACTIVATION_TOKEN_EXPIRED, AUTHORIZATION_TOKEN_SIZE
} from '../config/constants'

export const decryptPassword = (password: string, passwordHash: string | undefined): Promise<boolean> | false => {
    if (passwordHash) {
        return bcrypt.compare(password, passwordHash);
    }
    return false;
}

export const encryptPassword = (password: string): Promise<string> => {
    return bcrypt.hash(password, PASSWORD_SALT);
}

export const login = (rememberMe: boolean, passwordHash: string | undefined): string | null => {
    if (passwordHash) {
        return jwt.sign({data: passwordHash}, AUTHORIZATION_TOKEN_SECRET, {expiresIn: rememberMe ? AUTHORIZATION_TOKEN_EXPIRE_REMEMBER : AUTHORIZATION_TOKEN_EXPIRE});
    }
    return null;
}

export const getUserByToken = (token: string): Promise<any> => {
    return new Promise((resolve) => {
        jwt.verify(token, AUTHORIZATION_TOKEN_SECRET, async (error: VerifyErrors | null, data: JwtPayload | undefined) => {
            if (error) {
                return resolve(null);
            }

            const user: any | null = await prisma.user.findFirst({
                where: {
                    passwordHash: data?.data || ' ',
                },
                include: {
                    role: true,
                },
            });

            if (!user) {
                return resolve(null);
            }

            return resolve(user);
        })
    });
}

export const generateActivationToken = (): string => {
    const date: Date = new Date();
    date.setMinutes(date.getMinutes() + ACTIVATION_TOKEN_EXPIRED);
    return `${randToken.generate(AUTHORIZATION_TOKEN_SIZE)}_${date.getTime()}`;
}

export const checkEmail = async (email: string): Promise<void> => {
    if (email) {
        const checkEmail = await prisma.user.findUnique({
            where: {email},
        });

        if (checkEmail) {
            throw new Error('Email is used');
        }
    }
}
