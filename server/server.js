import app from "./app.js";
import connectDB from "./config/db.js";
import dotenv from "dotenv";
import http from "http";
import { initSocket } from "./socket/index.js";

dotenv.config();

const PORT = process.env.PORT || 5000;

// Connect to MongoDB
connectDB();

const server = http.createServer(app);

// Initialize Socket.io
initSocket(server);

server.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
