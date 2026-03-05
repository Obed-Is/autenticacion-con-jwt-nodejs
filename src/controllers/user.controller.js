import path from 'node:path';
import { UsersData } from '../database.js'
import { createAccesToken, createRefreshToken, verifyAccessToken, getPayload, verifyRefreshToken } from '../helpers/token.helper.js';
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
            .json({ session: true, message: 'Accediendo...' });
    } catch (error) {
        return res.status(500).json({ success: false, message: 'Ocurrió un error al intentar crear el usuario.' });
    }
};

const controllLogin = (req, res) => {

    res.render(path.join(__dirname, '../views/login.ejs'), { msgFalta: null });
};

const controllLoginUser = (req, res) => {
    const accessToken = req.cookies.accessToken;

    if (!accessToken) {

    }
    // console.log(req.cookies)
    res.json({ message: 'hola' })
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
    controllLoginUser,
    controllerProtected
}

export default userControllers;