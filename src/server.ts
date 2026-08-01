import 'reflect-metadata';
import app from './app';
import { AppDataSource } from './config/data-source';
import { Config } from './config/index';
import logger from './config/logger';

const startServer = async () => {
    const PORT = Config.PORT;
    try {
        await AppDataSource.initialize();
        logger.info('database connected successfully');
        logger.info(Config.DB_NAME);
        app.listen(PORT, () => {
            // logger.error('testing error log');
            logger.info('server is running.', { PORT });
        });
    } catch (error) {
        console.error(error);
        process.exit(1);
    }
};

void startServer();
