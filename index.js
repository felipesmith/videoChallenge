const express = require("express");
const path = require("path");
const app = express();
const port = process.env.PORT || 3000;
const server = app.listen(port, () => {
  console.log(`Listening at http://localhost:${port}`);
});
const io = require("socket.io").listen(server);
let clients = [];

app.use(express.static(__dirname + "/"));

app.get("/", (req, res) => {
  res.sendFile(path.join(__dirname, "/index.html"));
});

io.on("connect", (socket) => {
  clients.push(socket);
  socket.on("disconnect", () => {
    console.log(clients.indexOf(socket));
    if (clients.indexOf(socket) != -1) {
      clients.splice(clients.indexOf(socket), 1);
    }
  });

  socket.on("play", (data) => {
    socket.broadcast.emit("play", {
      time: data.time,
    });
  });

  socket.on("pause", (data) => {
    socket.broadcast.emit("pause", {
      time: data.time,
    });
  });
});
