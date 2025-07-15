import path from 'node:path';
import jwt from 'jsonwebtoken';
import { createAccesToken } from '../helpers/token.helper.js';

const __dirname = import.meta.dirname;

export function validAccessToken(req, res, next) {
    const accessToken = req.cookies.accessToken;

    if (!accessToken) {
        return res.render(path.join(__dirname, '../views/login.ejs'), { msgFalta: "Inicia sesion para poder acceder" });
    }

    const secretKey = process.env.SECRET_KEY_JWT;

    try {
        const payload = jwt.verify(accessToken, secretKey);
        req.username = payload.username;
        next()
    } catch (error) {
        console.log("error al validar el token: ", error.message);
        if (error.message === "jwt expired") {
            return renovAccessToken(req, res, next);
        }
        return res.render(path.join(__dirname, '../views/login.ejs'), { msgFalta: "No se pudo recuperar la sesion, ingresa tus credenciales" });
    }
}

function renovAccessToken(req, res, next) {
    const refreshToken = req.cookies.refreshToken;
    const secretKey = process.env.SECRET_KEY_JWT;

    try {
        const payload = jwt.verify(refreshToken, secretKey);
        if (payload.typeToken) {
            const username = payload.username;
            const id = payload._id;
            const newAccessToken = createAccesToken(id, username);
            req.username = username;
            res.cookie("accessToken", newAccessToken);
            next();
        }
    } catch (error) {
        if (error.message === "jwt expired") {
            return res.render(path.join(__dirname, '../views/login.ejs'), { msgFalta: null });
        }
        return res.render(path.join(__dirname, '../views/login.ejs'), { msgFalta: "Ocurrio un error al intentar recuperar la sesion, vuelve a ingresar tus credenciales" });
    }
}