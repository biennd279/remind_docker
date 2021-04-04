const app = require("../../app");
const http = require("http");
const io = require("../../socket");
const ioClient = require("socket.io-client");
const event = require("../../config/index").SocketIOEvent.message;
const request = require("supertest");

let httpServer;
let socket;
let instance;

let validJWTToken;

beforeAll(async (done) => {
  httpServer = http.createServer(app);
  io.listen(httpServer);
  instance = io.get().of("/message");
  const res = await request(app).post("/api/user/auth/login").send({
    email: "nagisa@gmail.com",
    password: "password",
  });

  validJWTToken = res.body.data.token;

  httpServer.listen(3002, () => {
    socket = ioClient("http://localhost:3002/message", {
      query: {
        token: validJWTToken,
      },
    });
    done();
  });
});

afterAll(() => {
  httpServer.close();
  socket.close();
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

describe("NEW_MESSAGE", () => {
  let message;

  beforeAll(() => {
    message = {
      sender: {
        id: 1,
        name: "Koro",
      },
      conversation: {
        id: 1,
      },
      message: {
        text: "Hello",
      },
    };
  });

  // test("handle text-only", (done) => {
  //   socket.emit(event.NEW_MESSAGE, message, (ack) => {
  //     expect(ack).toBeDefined();
  //     done();
  //   });
  // });

  test("get broadcast message", (done) => {
    socket.on(event.NEW_MESSAGE, (message) => {
      expect(message).toBeDefined();
      done();
    });
    socket.emit(event.NEW_MESSAGE, message, (ack) => {});
  });
});

describe("NEW_GROUP_MESSAGE", () => {
  let message;
  beforeAll(() => {
    message = {
      sender: {
        id: 1,
        name: "Koro",
      },
      classroomId: 1,
      receiverIds: [2, 3],
      message: {
        text: "Hello",
      },
    };
  });
  test("create group conversation", (done) => {
    socket.on(event.NEW_MESSAGE, (message) => {
      expect(message).toBeDefined();
      expect(message.id).toBeDefined();
      done();
    });
    socket.emit(event.NEW_GROUP_CONVERSATION, message, (err) => {
      if (err) {
        done(err);
      }
    });
  });
});