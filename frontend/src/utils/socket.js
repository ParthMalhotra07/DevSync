import { io } from "socket.io-client";

const URL = "http://localhost:5000"; // Match backend port
const socket = io(URL, { autoConnect: false });

export default socket;
