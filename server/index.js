import express from "express";
import mongoose from "mongoose";
import cors from "cors";
import dotenv from "dotenv";
import cookieParser from "cookie-parser";
import { Server } from "socket.io";
import http from "http";
import authRoutes from "./routes/auth.routes.js";
import userRoutes from "./routes/user.routes.js";
import gigRoutes from "./routes/gig.routes.js";
import bidRoutes from "./routes/bid.routes.js";

dotenv.config();

const app = express();
const server = http.createServer(app);

const allowedOrigins = [
    "http://localhost:5173", "http://localhost:5174", "http://localhost:5175",
    "http://localhost:5176", "http://localhost:5177", "http://localhost:5178",
    "http://localhost:5179", "http://localhost:5180", "http://localhost:5181",
    "http://localhost:5182", "http://localhost:5183", "http://localhost:5184"
];

// Socket.io Setup
const io = new Server(server, {
    cors: {
        origin: allowedOrigins,
        methods: ["GET", "POST"],
        credentials: true,
    },
});

// Global Online Users Map
global.onlineUsers = new Map();

io.on("connection", (socket) => {
    console.log("A user connected:", socket.id);

    // Add user to online map
    socket.on("addUser", (userId) => {
        global.onlineUsers.set(userId, socket.id);
        console.log(`User ${userId} is online with socket ${socket.id}`);
    });

    socket.on("disconnect", () => {
        // Remove user from map (optional: O(N) search or keep a reverse map)
        for (const [userId, socketId] of global.onlineUsers.entries()) {
            if (socketId === socket.id) {
                global.onlineUsers.delete(userId);
                break;
            }
        }
        console.log("A user disconnected");
    });
});

app.use(express.json());
app.use(cookieParser());
app.use(cors({
    origin: allowedOrigins,
    credentials: true,
}));

// Make io accessible in routes
app.use((req, res, next) => {
    req.io = io;
    next();
});

app.use("/api/auth", authRoutes);
app.use("/api/users", userRoutes);
app.use("/api/gigs", gigRoutes);
app.use("/api/bids", bidRoutes);


const PORT = process.env.PORT || 8800;

app.get("/", (req, res) => {
    res.send("GigFlow API is running!");
});

const connect = async () => {
    try {
        await mongoose.connect(process.env.MONGO_URI);
        console.log("Connected to MongoDB");
    } catch (error) {
        console.log(error);
    }
};

// Listen on server, not app
server.listen(PORT, () => {
    connect();
    console.log(`Server running on port ${PORT}`);
});
