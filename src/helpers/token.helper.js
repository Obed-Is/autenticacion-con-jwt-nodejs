import jwt from 'jsonwebtoken';
import { UsersData } from '../database.js';
import { createHash } from 'node:crypto';

export function createAccesToken(_id, username) {
    return jwt.sign(
        { _id, username },
        process.env.SECRET_KEY_JWT,
        { expiresIn: "1m" }
    );
}

export function createRefreshToken(_id, username) {
    return jwt.sign(
        { _id, username, typeToken: "refresh" },
        process.env.SECRET_KEY_JWT_REFRESH,
        { expiresIn: "5m" }
    );
}

export async function getPayload(token) {
    return jwt.decode(token);
}

export function verifyAccessToken(token) {
    try {
        return jwt.verify(token, process.env.SECRET_KEY_JWT);
    } catch (error) {
        return null;
    }
}

/**
 * Verifica el token de refresco hasheandolo y comparandolo con el hash almacenado en la base de datos
 * @param {string} token - Token de refresco
 * @param {string} username - Nombre de usuario
 * @returns {Promise<Object|null>} - Payload del token si es valido, null si no
 */
export async function verifyRefreshToken(token, username) {
    try {
        const hashedToken = createHash('sha256').update(token).digest('hex');
        const user = await UsersData.findUser(username);
        //comparamos si el hasheado en nuestros datos es el mismo que el token que recibimos del cliente
        if (user.hashRefresh !== hashedToken) return null;

        //si es el mismo solo verificamos que el token no haya expirado
        return jwt.verify(token, process.env.SECRET_KEY_JWT_REFRESH);
    } catch (error) {
        return null;
    }
}