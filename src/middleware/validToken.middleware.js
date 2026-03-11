import path from 'node:path';
import jwt from 'jsonwebtoken';
import { createAccesToken, getPayload, verifyAccessToken, verifyRefreshToken } from '../helpers/token.helper.js';
import { cookieConfig } from '../../config.js';

const __dirname = import.meta.dirname;

/**
 * Valida si el usuario tiene una sesion activa mediante los tokens
 * @param {import('express').Request} req request de la peticion
 * @param {import('express').Response} res response de la peticion
 * @param {import('express').NextFunction} next next de la peticion para continuarss
 * @returns {Promise<void>}
 */
export const sessionMiddle = async (req, res, next) => {
    try {
        const { accessToken, refreshToken } = req.cookies;

        if (!accessToken || !refreshToken)
            return res
                .clearCookie("accessToken")
                .clearCookie("refreshToken")
                .render(path.join(__dirname, '../views/home.ejs'), { session: false, success: false, username: null });

        const payload = await getPayload(accessToken);

        if (!verifyAccessToken(accessToken)) {
            const validRefreshToken = await verifyRefreshToken(refreshToken, payload.username);

            if (validRefreshToken) {
                const newAccessToken = createAccesToken(validRefreshToken._id, validRefreshToken.username);
                //si el token de refresco es valido, se crea un nuevo token de acceso y se envia al cliente
                res.cookie("accessToken", newAccessToken, {
                    ...cookieConfig
                });
            } else {
                return res
                    .clearCookie("accessToken")
                    .clearCookie("refreshToken")
                    .render(path.join(__dirname, '../views/home.ejs'), { session: false, success: false, username: null });
            }
        }

        //por ultimo si todo es correcto se envia la peticion al controlador con la informacion del usuario
        req.user = payload;
        next();
    } catch (error) {
        console.error('error en sessionMiddle:', error.message);
        return res
            .clearCookie("accessToken")
            .clearCookie("refreshToken")
            .render(path.join(__dirname, '../views/home.ejs'), { session: false, username: null });
    }
}

/**
 * Valida si el usuario tiene una sesion activa y lo redirije a la pagina de inicio
 * @param {import('express').Request} req request de la peticion
 * @param {import('express').Response} res response de la peticion
 * @param {import('express').NextFunction} next next de la peticion para continuarss
 * @returns {Promise<void>}
 */
export const redirectMiddle = async (req, res, next) => {
    try {
        const { accessToken, refreshToken } = req.cookies;

        if (!accessToken || !refreshToken) {
            return next();
        }

        return res.redirect('/home');
    } catch (error) {
        return res
            .clearCookie("accessToken")
            .clearCookie("refreshToken")
            .render(path.join(__dirname, '../views/home.ejs'), { session: false, username: null });
    }
}

export const timerMiddle = async (req, res, next) => {
    try {
        const { accessToken, refreshToken } = req.cookies;

        if (!accessToken || !refreshToken) {
            return res
                .clearCookie("accessToken")
                .clearCookie("refreshToken")
                .render(path.join(__dirname, '../views/home.ejs'), { session: false, success: false, username: null });
        }

        if (!verifyAccessToken(accessToken)) {
            const payload = await getPayload(accessToken);
            const newToken = createAccesToken(payload._id, payload.username);
            res.cookie('accessToken', newToken, {
                ...cookieConfig
            })
            req.currentAccessToken = newToken;
        } else {
            req.currentAccessToken = accessToken;
        }

        next();
    } catch (error) {
        return res
            .clearCookie("accessToken")
            .clearCookie("refreshToken")
            .render(path.join(__dirname, '../views/home.ejs'), { session: false, success: false, username: null });
    }
}

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