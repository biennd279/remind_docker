const app = require("../../app");
const http = require("http");
const io = require("../../socket");
const ioClient = require("socket.io-client");

let httpServer;
let socket;
let instance;

beforeAll((done) => {
  httpServer = http.createServer(app);
  io.listen(httpServer);
  instance = io.get();
  httpServer.listen(3002, () => {
    socket = ioClient("http://localhost:3002/");
    done();
  });
});

afterAll((done) => {
  httpServer.close();
  socket.close();
  done();
});

describe("Basic Connection", () => {
  test("connection", (done) => {
    socket.connect();
    socket.on("connect", () => {
      done();
    });
  });

  test("handle event", (done) => {
    socket.once("TEST_MESSAGE", (message) => {
      expect(message).toBe("TEST");
      done();
    });
    instance.emit("TEST_MESSAGE", "TEST");
  });
});
