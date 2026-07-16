const express = require("express");
const http = require("http");
const { Server } = require("socket.io");

const app = express();

const server = http.createServer(app);

const io = new Server(server, {
  cors: {
    origin: "http://localhost:5173",
    methods: ["GET", "POST"],
  },
});

let canvas = [];

io.on("connection", (socket) => {
  console.log("Connected:", socket.id);
  socket.emit("connected", "Welcome");

  // send new user current canvas
  socket.emit("cur_stages", canvas);

  socket.on("canvas_stages", (shapes) => {
    canvas = shapes;
    console.log(canvas);
    
    // send to all users
    io.emit("cur_stages", canvas);
  });

  socket.on("disconnect", () => {
    console.log(socket.id, "Disconnected");
  });
});

module.exports = { app, server };

