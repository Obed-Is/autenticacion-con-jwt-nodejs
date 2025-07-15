import jwt from 'jsonwebtoken';

export function createAccesToken(_id, username) {
    return jwt.sign(
        { _id, username },
        process.env.SECRET_KEY_JWT,
        { expiresIn: "5m" }
    );
}

export function createRefreshToken(_id, username) {
    return jwt.sign(
        { _id, username, typeToken: "refresh" },
        process.env.SECRET_KEY_JWT,
        { expiresIn: "15m" }
    );
}