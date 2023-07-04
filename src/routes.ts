import {Router} from 'express';
import { UserController } from './controllers/UserController';
import { AuthController } from './controllers/AuthController';
import { AuthMiddleware } from './middlewares/auth';

const userController = new UserController();
const authController = new AuthController();

export const routes = Router();

routes.post('/create', userController.store);
routes.get('/users', AuthMiddleware, userController.index);
routes.post('/auth', authController.authenticate);
routes.put('/update/:id', AuthMiddleware, userController.update);
routes.delete('/delete/:id', AuthMiddleware, userController.delete);