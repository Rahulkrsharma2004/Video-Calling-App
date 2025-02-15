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

const rooms = {};

io.on("connection", (socket) => {
  console.log("New user connected:", socket.id);

  let userRoom = null;

  socket.on("join-room", ({ roomId, name }) => {
    userRoom = roomId;
    socket.join(roomId);

    if (!rooms[roomId]) {
      rooms[roomId] = [];
    }
    
    rooms[roomId].push({ socketId: socket.id, name });

    console.log(`${name} (${socket.id}) joined room: ${roomId}`);

    io.to(roomId).emit("user-list", rooms[roomId]);

    socket.broadcast.to(roomId).emit("user-connected", { userId: socket.id, name });
  });

  socket.on("offer", (data) => {
    socket.to(data.userId).emit("offer", { signal: data.signal, userId: socket.id });
  });

  socket.on("answer", (data) => {
    socket.to(data.userId).emit("answer", { signal: data.signal, userId: socket.id });
  });

  socket.on("candidate", (data) => {
    socket.to(data.userId).emit("candidate", data);
  });

  socket.on("disconnect", () => {
    console.log("User disconnected:", socket.id);
    if (userRoom && rooms[userRoom]) {
      rooms[userRoom] = rooms[userRoom].filter((user) => user.socketId !== socket.id);
      socket.broadcast.to(userRoom).emit("user-disconnected", socket.id);
      io.to(userRoom).emit("user-list", rooms[userRoom]);
    }
  });
});

server.listen(5000, () => console.log("Server running on port 5000"));
