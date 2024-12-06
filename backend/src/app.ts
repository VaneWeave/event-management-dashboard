import express, { Request, Response, NextFunction } from "express";
import { json } from "body-parser";
import dotenv from "dotenv";
import cors from "cors";
import userRoutes from "./routes/userRoutes";
import eventRoutes from "./routes/eventRoutes";
import registrationRoutes from "./routes/registrationRoutes";

dotenv.config();

const app = express();

// CORS configuration
const clientPort = process.env.CLIENT_PORT || 3000;

export function corsOptions(clientPort: number) {
    const corsOptions = {
        origin: `http://localhost:${clientPort}`,
        credentials: true,
    };

    return app.use(cors(corsOptions));
}

// Middleware for parsing JSON requests
app.use(json());

// Root route
app.get("/", (req: Request, res: Response) => {
    res.status(200).json({ message: "Connection successful" });
});

// User routes
app.use("/api/users", userRoutes);

// Event routes
app.use("/api/events", eventRoutes);

// Registration routes
app.use("/api/registrations", registrationRoutes);

// 404 handler for unmatched routes
app.use((req: Request, res: Response, next: NextFunction) => {
    res.status(404).json({ message: "Route not found" });
});

export default app;
