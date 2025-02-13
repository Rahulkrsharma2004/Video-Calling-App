import io from "socket.io-client";

const socket = io("http://localhost:5000"); // Replace with your backend URL

export const joinRoom = (roomId) => {
  socket.emit("join-room", roomId);
};

export const onUserConnected = (callback) => {
  socket.on("user-connected", callback);
};

export const onSignal = (callback) => {
  socket.on("signal", callback);
};

export const onUserDisconnected = (callback) => {
  socket.on("user-disconnected", callback);
};

export const sendSignal = (userId, signal) => {
  socket.emit("signal", userId, signal);
};