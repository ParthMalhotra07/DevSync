import { Server } from "socket.io";
import Notification from "../models/Notification.js";

let io;
const userSockets = new Map();

export const initSocket = (server) => {
  io = new Server(server, {
    cors: {
      origin: "*", // For dev
      methods: ["GET", "POST"],
    },
  });

  io.on("connection", (socket) => {
    console.log(`New client connected: ${socket.id}`);

    // User connects and sends their user ID
    socket.on("setup", (userId) => {
      userSockets.set(userId, socket.id);
      socket.join(userId);
      console.log(`User ${userId} joined their personal room`);
    });

    socket.on("disconnect", () => {
      console.log(`Client disconnected: ${socket.id}`);
      // Clean up user map
      for (const [userId, socketId] of userSockets.entries()) {
        if (socketId === socket.id) {
          userSockets.delete(userId);
          break;
        }
      }
    });
  });
};

export const sendNotification = async (
  userId,
  message,
  type,
  relatedEntity,
) => {
  try {
    // 1. Save to DB
    const notification = await Notification.create({
      user: userId,
      message,
      type,
      relatedEntity,
    });

    // 2. Emit via Socket if user is online
    if (io) {
      io.to(userId.toString()).emit("new_notification", notification);
    }
  } catch (error) {
    console.error("Error sending notification:", error);
  }
};
