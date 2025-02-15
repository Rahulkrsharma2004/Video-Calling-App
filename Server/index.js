const express = require("express");
const http = require("http");
const { Server } = require("socket.io");
const cors = require("cors");

const app = express();
const server = http.createServer(app);
const io = new Server(server, {
  cors: {
    origin: "*",
    methods: ["GET", "POST"],
  },
});

app.use(cors());

io.on("connection", (socket) => {
  console.log("New user connected:", socket.id);

  // Store user-room mapping
  let userRoom = null;

  // Listen for a user joining a room
  socket.on("join-room", ({ roomId, name }) => {
    userRoom = roomId; // Store room ID for disconnect handling
    socket.join(roomId);
    console.log(`${name} (${socket.id}) joined room: ${roomId}`);

    // Notify other users in the room
    socket.broadcast.to(roomId).emit("user-connected", { userId: socket.id, name });

    // Handle WebRTC signaling between peers
    socket.on("signal", (data) => {
      io.to(data.userId).emit("signal", { signal: data.signal, userId: socket.id });
    });
  });

  // Listen for user disconnections (should be outside `join-room`)
  socket.on("disconnect", () => {
    console.log("User disconnected:", socket.id);
    if (userRoom) {
      socket.broadcast.to(userRoom).emit("user-disconnected", socket.id);
    }
  });
});

// Start the server
server.listen(5000, () => console.log("Server running on port 5000"));
