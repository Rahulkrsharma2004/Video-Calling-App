import { io } from "socket.io-client";

const socket = io("https://video-calling-app-brown.vercel.app");

export default socket;
