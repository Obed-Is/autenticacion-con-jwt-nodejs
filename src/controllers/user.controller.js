import path from 'node:path';
import { createAccesToken, createRefreshToken, getPayload } from '../helpers/token.helper.js';
import { createHash } from 'node:crypto';
import { cookieConfig } from '../../config.js';
import { UsersDb } from '../dbSqlServer.js';

const __dirname = import.meta.dirname;
const usersDb = new UsersDb();

const controllHome = async (req, res) => {
    if (!req.user) return res.render(path.join(__dirname, "../views/home.ejs"), { session: false, username: null });

    const { username } = req.user;
    res.render(path.join(__dirname, "../views/home.ejs"), { session: true, username });
}

const controllRegister = (req, res) => {
    res.render(path.join(__dirname, '../views/register.ejs'));
};

const controllNewUser = async (req, res) => {
    try {
        const { name, username, password } = req.body;

        if (!name || !username || !password) {
            return res.status(400).json({ success: false, message: 'Todos los campos son obligatorios.' });
        }

        if (name.length < 3 || !/^[a-zA-Z\s]+$/.test(name)) {
            return res.status(400).json({ success: false, message: 'Nombre invalido: debe tener al menos 3 caracteres (letras y espacios).' });
        }

        if (username.length < 4 || !/^[a-zA-Z0-9_]+$/.test(username)) {
            return res.status(400).json({ success: false, message: 'Usuario invalido: debe tener al menos 4 caracteres (solo letras, números y guiones bajos).' });
        }

        if (password.length < 4) {
            return res.status(400).json({ success: false, message: 'Contraseña insuficiente: debe tener al menos 4 caracteres.' });
        }

        const userDuplicateDb = await usersDb.findUser(username);
        if (userDuplicateDb)
            return res
                .status(409)
                .json({ success: false, message: 'El nombre de usuario ya ha sido tomado, ingrese uno distinto' });

        const hashPassword = await createHash('sha256').update(password).digest('hex');

        const userIdDb = await usersDb.createUser(name, username, hashPassword);

        const accessToken = createAccesToken(userIdDb, username);
        const refreshToken = createRefreshToken(userIdDb, username);

        const hashRefresh = await createHash('sha256').update(refreshToken).digest('hex');

        const existTokenUser = await usersDb.existTokenUser(userIdDb);
        if (existTokenUser) {
            await usersDb.updateTokenUser(userIdDb, hashRefresh);
        } else {
            await usersDb.createTokenUser(userIdDb, hashRefresh);
        }
        return res.status(201)
            .cookie('refreshToken', refreshToken, {
                ...cookieConfig
            })
            .cookie('accessToken', accessToken, {
                ...cookieConfig
            })
            .json({ success: true, message: 'Accediendo...', tokensDuration: { accessToken: 1000 * 60, refreshToken: 1000 * 60 * 5 } });
    } catch (error) {
        return res.status(500).json({ success: false, message: 'Ocurrió un error al intentar crear el usuario.' });
    }
};

const controllLogin = (req, res) => {
    res.render(path.join(__dirname, '../views/login.ejs'), { msgFalta: null });
};

/**
 * Crea una sesion de usuario y devuelve la duracion de los tokens para el control(en caso de cambiar la duracion se debe modificar la respuesta)
 * @param {express.Request} req Request de la peticion
 * @param {express.Response} res Response de la peticion
 * @returns {Promise<express.Response>} Se debe devolver un json con success, message y durationToken(estos son la duracion de los tokens)
 */
const createSesion = async (req, res) => {
    try {
        const { username, pass } = req.body;

        if (!username || !pass) {
            return res.status(400).json({ success: false, message: 'Faltan credenciales.' });
        }

        if (username.length < 4 || !/^[a-zA-Z0-9_]+$/.test(username)) {
            return res.status(400).json({ success: false, message: 'Formato de usuario inválido.' });
        }

        if (pass.length < 4) {
            return res.status(400).json({ success: false, message: 'Formato de contraseña inválido.' });
        }

        const user = await usersDb.findUser(username);
        if (!user) {
            return res
                .status(401)
                .json({ success: false, message: 'Credenciales incorrectas' });

        }

        const hashPassword = await createHash('sha256').update(pass).digest('hex');
        if (hashPassword !== user.password_hash)
            return res
                .status(401)
                .json({ success: false, message: 'Credenciales incorrectas' });

        const refreshToken = createRefreshToken(user.id, user.username);
        const hashRefresh = createHash('sha256').update(refreshToken).digest('hex');

        const existTokenUser = await usersDb.existTokenUser(user.id);
        if (existTokenUser) {
            await usersDb.updateTokenUser(user.id, hashRefresh);
        } else {
            await usersDb.createTokenUser(user.id, hashRefresh);
        }

        return res
            .cookie('accessToken', createAccesToken(user.id, user.username), {
                ...cookieConfig
            })
            .cookie('refreshToken', refreshToken, {
                ...cookieConfig
            })
            .json({ success: true, message: 'Accediendo...', tokensDuration: { accessToken: 1000 * 60, refreshToken: 1000 * 60 * 5 } });
    } catch (error) {
        return res.status(500).json({ success: false, message: 'Ocurrió un error al intentar iniciar la sesion.' });
    }
};

const logout = (req, res) => {
    res.clearCookie('accessToken');
    res.clearCookie('refreshToken');
    res.json({ success: true, message: 'Sesion cerrada correctamente' });
}

// ESTO SOLO RETORNA UN NUEVO TIEMPO AL FINALIZAR UN TOKEN DE ACCESO
const timerToken = async (req, res) => {
    const accessToken = req.currentAccessToken;
    const { refreshToken } = req.cookies;
    const { exp: expRefreshToken } = await getPayload(refreshToken);
    const { exp: expAccessToken } = await getPayload(accessToken);
    const tiempoRestanteAccessToken = (expAccessToken * 1000) - Date.now();
    const tiempoRestanteRefreshToken = (expRefreshToken * 1000) - Date.now();

    return res.json({ success: true, durationAccessToken: tiempoRestanteAccessToken, durationRefreshToken: tiempoRestanteRefreshToken });
}

const controllerProtected = (req, res) => {
    const { username } = req.user;

    res.render(path.join(__dirname, '../views/protected.ejs'), { username })
}

const userControllers = {
    controllHome,
    controllRegister,
    controllNewUser,
    controllLogin,
    createSesion,
    controllerProtected,
    logout,
    timerToken
}

export default userControllers;