import path from 'node:path';
import { UsersData } from '../database.js'
import { createAccesToken, createRefreshToken } from '../helpers/token.helper.js';

const __dirname = import.meta.dirname;

const controllRegister = (req, res) => {
    res.render(path.join(__dirname, '../views/register.ejs'));
};

const controllNewUser = async (req, res) => {
    try {
        const { name, lastName, username, password } = req.body;
        const userId = await UsersData.createUser(name, lastName, username, password);

        if (userId === "duplicate") return res.status(409).json({ success: false, message: 'El nombre de usuario ya ha sido tomado, ingrese uno distinto' });

        const accessToken = createAccesToken(userId, username);
        const refreshToken = createRefreshToken(userId, username);


        return res.status(201)
            .cookie('refreshToken', refreshToken, {
                httpOnly: true,
                // sameSite: 'strict',
            })
            .cookie('accessToken', accessToken)
            .json({ success: true, message: 'Accediendo...', accessToken });
    } catch (error) {
        console.log(error)
        return res.status(500).json({ success: false, message: 'Ocurrió un error al intentar crear el usuario.', error: error });
    }
};

const controllLogin = (req, res) => {
    // console.log(req);

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
    controllRegister,
    controllNewUser,
    controllLogin,
    controllLoginUser,
    controllerProtected
}

export default userControllers;