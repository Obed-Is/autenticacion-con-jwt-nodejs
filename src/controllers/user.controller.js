import path from 'node:path';
import { UsersData } from '../database.js'
import { createAccesToken, createRefreshToken } from '../helpers/token.helper.js';
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
            .json({ success: true, message: 'Accediendo...' });
    } catch (error) {
        return res.status(500).json({ success: false, message: 'Ocurrió un error al intentar crear el usuario.' });
    }
};

const controllLogin = (req, res) => {
    res.render(path.join(__dirname, '../views/login.ejs'), { msgFalta: null });
};

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
            .json({ success: true, message: 'Accediendo...' });
    } catch (error) {
        return res.status(500).json({ success: false, message: 'Ocurrió un error al intentar iniciar la sesion.' });
    }
};

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
    controllerProtected
}

export default userControllers;