import dotenv from 'dotenv';
import app, { corsOptions } from './app';

// Load Environment Variables
dotenv.config();

// Handle Uncaught Exceptions
process.on("uncaughtException", err => {
    console.log(`Error: ${err.message}`);
    console.log("Shutting down the server due to Uncaught Exception");
    process.exit(1);
})

const serverPort = process.env.SERVER_PORT || 8000;
const clientPort = Number(process.env.CLIENT_PORT) || 3000;


const server = app.listen(serverPort, () => {
    console.log(`server started at http://127.0.0.1:${serverPort}`);
})

corsOptions(clientPort);

// Unhandled Promise Rejection
process.on("unhandledRejection", (err: unknown) => {
    if (err instanceof Error) {
        console.log(`Error: ${err.message}`);
    } else {
        console.log(`Error: ${String(err)}`);
    }
    console.log("Shutting down the server due to Unhandled Promise Rejection");
    server.close(() => {
        process.exit(1);
    });
})
