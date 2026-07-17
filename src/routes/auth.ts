import express from 'express';
import { AuthController } from '../controllers/AuthController';
import { UserService } from '../services/userService';
import { AppDataSource } from '../config/data-source';
import { User } from '../entities/User';
const router = express.Router();

//dependency injection

const userRepository = AppDataSource.getRepository(User); //caling getRepository method of AppDataSocure (DataSource) obj

const userService = new UserService(userRepository); //creating obj of userservice
const authController = new AuthController(userService); // injecting dependency (obj) to auth controller

router.post('/register', async (req, res) => {
    await authController.register(req, res);
});

export default router;
