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

let onlineUsers = []; 
let pair = null;     
let canvas = [];

function broadcastUsers() {
  io.emit("online_users", { onlineUsers, pair });
}

io.on("connection", (socket) => {
  console.log("Connected:", socket.id);

  onlineUsers.push(socket.id);
  broadcastUsers();


  socket.emit("cur_stages", canvas);

  //send request target  
  socket.on("send_request", (targetId) => {
    if (pair) return; // already pair connected request n't allow 
    io.to(targetId).emit("incoming_request", socket.id);
  });

  // accept target user
  socket.on("accept_request", (fromId) => {
    if (pair) return;
    pair = { user1: fromId, user2: socket.id };
    io.to(fromId).emit("request_accepted", socket.id);
    io.to(socket.id).emit("request_accepted", fromId);
    broadcastUsers();
  });

  // canvas only paired users sync 
  socket.on("canvas_stages", (shapes) => {
    if (!pair) return;
    if (pair.user1 !== socket.id && pair.user2 !== socket.id) return;

    canvas = shapes;
    const partnerId = pair.user1 === socket.id ? pair.user2 : pair.user1;
    io.to(partnerId).emit("cur_stages", canvas);
  });

  // disconnect button 
  socket.on("disconnect_pair", () => {
    if (pair && (pair.user1 === socket.id || pair.user2 === socket.id)) {
      const otherId = pair.user1 === socket.id ? pair.user2 : pair.user1;
      io.to(otherId).emit("pair_disconnected");
      pair = null;
      canvas = [];
      broadcastUsers();
    }
  });

  socket.on("disconnect", () => {
    console.log(socket.id, "Disconnected");
    onlineUsers = onlineUsers.filter((id) => id !== socket.id);

    if (pair && (pair.user1 === socket.id || pair.user2 === socket.id)) {
      const otherId = pair.user1 === socket.id ? pair.user2 : pair.user1;
      io.to(otherId).emit("pair_disconnected");
      pair = null;
      canvas = [];
    }

    broadcastUsers();
  });
});

module.exports = { app, server };