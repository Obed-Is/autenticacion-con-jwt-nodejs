import path from 'node:path';
import { UsersData } from '../database.js'
import { createAccesToken, createRefreshToken, getPayload } from '../helpers/token.helper.js';
import { createHash } from 'node:crypto';

const __dirname = import.meta.dirname;

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

        const userDuplicate = await UsersData.findUser(username);
        if (userDuplicate)
            return res
                .status(409)
                .json({ success: false, message: 'El nombre de usuario ya ha sido tomado, ingrese uno distinto' });

        const hashPassword = await createHash('sha256').update(password).digest('hex');
        const userId = await UsersData.createUser(name, username, hashPassword);

        const accessToken = createAccesToken(userId, username);
        const refreshToken = createRefreshToken(userId, username);

        const hashRefresh = await createHash('sha256').update(refreshToken).digest('hex');

        await UsersData.updateTokenUser(userId, hashRefresh);

        return res.status(201)
            .cookie('refreshToken', refreshToken, {
                httpOnly: true,
            })
            .cookie('accessToken', accessToken, {
                httpOnly: true,
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
            return res.status(400).json({ success: false, message: 'Faltan credenciales' });
        }

        const user = await UsersData.findUser(username);
        if (!user) {
            return res
                .status(401)
                .json({ success: false, message: 'Credenciales incorrectas' });

        }

        const hashPassword = await createHash('sha256').update(pass).digest('hex');
        if (hashPassword !== user.hashPassword)
            return res
                .status(401)
                .json({ success: false, message: 'Credenciales incorrectas' });

        const refreshToken = createRefreshToken(user._id, user.username);
        const hashRefresh = createHash('sha256').update(refreshToken).digest('hex');

        await UsersData.updateTokenUser(user._id, hashRefresh);

        return res
            .cookie('accessToken', createAccesToken(user._id, user.username), {
                httpOnly: true,
            })
            .cookie('refreshToken', refreshToken, {
                httpOnly: true,
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
    const { exp } = await getPayload(accessToken);
    const tiempoRestante = (exp * 1000) - Date.now();

    return res.json({ success: true, durationAccessToken: tiempoRestante });
}

const controllerProtected = (req, res) => {
    const username = req.username;


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