import { Router } from 'express';
import userControllers from '../controllers/user.controller.js';
import { sessionMiddle, validAccessToken } from '../middleware/validToken.middleware.js';

const router = Router();

router.get('/register', userControllers.controllRegister);

router.get('/home', sessionMiddle, userControllers.controllHome);

router.post('/register', userControllers.controllNewUser)

router.get('/login', userControllers.controllLogin);

router.post('/login/user', userControllers.controllLoginUser)

router.get('/protected', validAccessToken, userControllers.controllerProtected)

export default router;