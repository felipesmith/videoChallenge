const express = require("express");
const app = express();
const port = process.env.PORT || 3000;
const server = app.listen(port, () => {
  console.log(`Listening at http://localhost:${port}`);
});
const io = require("socket.io").listen(server);
let clients = [];

app.use(express.static(__dirname + "/"));

app.get("/", (req, res) => {
  res.sendFile(__dirname + "/index.html");
});

io.on("connect", (socket) => {
  clients.push(socket);
  console.log(
    "Connection succeeded for client: " +
      socket.id +
      " A.K.A: " +
      clients.length
  );
  socket.on("disconnect", () => {
    console.log(clients.indexOf(socket));
    if (clients.indexOf(socket) != -1) {
      clients.splice(clients.indexOf(socket), 1);
    }
    console.log("Connections Remaining: " + clients.length);
  });

  socket.on("play", () => {
    console.log("The user " + socket.id + " requested to play the video");
    socket.broadcast.emit("play");
  });

  socket.on("pause", () => {
    console.log("The user " + socket.id + " requested to pause the video");
    socket.broadcast.emit("pause");
  });
});
