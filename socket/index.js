const { Server } = require("socket.io");
const MessageNsp = require("./message");
const { socketAuth } = require("../config/auth");

/**
 *
 * @param {import("../app")} httpServer
 */
exports.listen = (httpServer) => {
  const io = new Server(httpServer, {
    upgrade: false,
    transports: [
        'websocket'
    ]
  });

  io.on("connection", (socket) => {
    socket.emit("Hello world")
    socket.send("socket.io setup success");

    socket.on("echo", (message) => {
      socket.emit("echo", message);
    });
  });

  const messageNsp = io.of("/message");

  messageNsp.use(socketAuth);

  messageNsp.on("connection", (socket) => {
    MessageNsp.handleEvents(socket, messageNsp);
  });
};

/**
 * TESTING PURPOSE ONLY
 */
exports.get = () => {
  return io;
}