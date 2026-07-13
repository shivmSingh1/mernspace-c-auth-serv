import app from './app.js';
import { Config } from './config/index.js';

console.log('hyy');

const startServer = () => {
    const PORT = Config.PORT;
    try {
        app.listen(PORT, () =>
            console.log(`Server is listeninggg on PORt
			 ${PORT}`),
        );
    } catch (error) {
        console.error(error);
        process.exit(1);
    }
};

startServer();
