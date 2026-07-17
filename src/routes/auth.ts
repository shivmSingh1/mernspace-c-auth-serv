import express from 'express';
import { AuthController } from '../controllers/AuthController';
import { UserService } from '../services/userService';
import { AppDataSource } from '../config/data-source';
import { User } from '../entities/User';
import logger from '../config/logger';
const router = express.Router();

//dependency injection

const userRepository = AppDataSource.getRepository(User); //caling getRepository method of AppDataSocure (DataSource) obj

const userService = new UserService(userRepository); //creating obj of userservice
const authController = new AuthController(userService, logger); // injecting dependency (obj) to auth controller

router.post('/register', async (req, res, next) => {
    await authController.register(req, res, next);
});

export default router;
