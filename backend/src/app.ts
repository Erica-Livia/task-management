import express, { Express } from 'express';
import welcomeRoutes from "./routes/welcome.routes"; welcomeRoutes

const app: Express = express();


app.use('/', welcomeRoutes);

// Start the server
const startServer = async () => {
    try {
        // Start Express server
        app.listen( () => {
            console.log(`Server running on http://127.0.0.1:8000`);
        });
    } catch (error) {
        console.error('Failed to start server:', error);
        process.exit(1);
    }
};

// Run the server
startServer();