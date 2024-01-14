import { Router } from 'express';
import { UserController } from '../controllers/user.controller.js';

const router = Router();
const userController = new UserController();

router.get('/', userController.getUsers);
router.get('/scans', userController.getAllScans);
router.post('/', userController.createUser);
router.put('/:id', userController.updateUser);

export default router;