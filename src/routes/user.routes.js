import { Router } from 'express';
import userControllers from '../controllers/user.controller.js';
import { sessionMiddle, validAccessToken, redirectMiddle } from '../middleware/validToken.middleware.js';

const router = Router();

router.get('/register', redirectMiddle, userControllers.controllRegister);

router.get('/home', sessionMiddle, userControllers.controllHome);

router.get('/login', redirectMiddle, userControllers.controllLogin);

router.post('/logout', userControllers.logout);

router.post('/register', userControllers.controllNewUser)

router.post('/login', userControllers.createSesion)

router.get('/protected', validAccessToken, userControllers.controllerProtected)

export default router;