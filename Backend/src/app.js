const express = require("express");
const http = require("http");
const { Server } = require("socket.io")
const app = express();

const server = http.createServer(app);

const io = new Server(server, {
    cors: {
        origin: "http://localhost:5173",
        methods: ["GET", "POST"],
    },
})


io.on("connection",(socket)=> {
  console.log("User connected:", socket.id);

  socket.emit("connected","Welcome from server!");

})


module.exports = app