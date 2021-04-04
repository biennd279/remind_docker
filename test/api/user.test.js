const request = require("supertest");
const app = require("../../app");
const knex = require("../../databases/knex");
const auth = require("../../config/auth");

const API_USER_AUTH = "/api/user/auth";
// Create `test_remind_clone` database before runnign the tests.

describe("POST /user/auth/login", () => {
  test("Log the right user in", async () => {
    const res = await sendValidLoginRequest();

    const expectedResponse = {
      status: 200,
      body: {
        data: {
          token: expect.any(String),
          user: expect.any(Object),
        },
      },
    };
    expect(res).toMatchObject(expectedResponse);
  });

  test("Keep the wrong users out", async () => {
    const res = await sendInvalidLoginRequest();

    const expectedResponse = {
      status: 401,
      body: {
        error: expect.any(Object),
      },
    };
    expect(res).toMatchObject(expectedResponse);
  });

  describe("Access to protected resources", () => {
    let validToken = null;
    beforeAll(() => {
      app.get("/test/protected", auth.jwtAuth(), (req, res) => {
        return res.status(200).json({ data: "OK" });
      });
      return sendValidLoginRequest().then((res) => {
        validToken = res.body.data.token;
      });
    });

    test("Authenticated user can access protected resource", async () => {
      const res = await request(app)
        .get("/test/protected")
        .set("Authorization", `Bearer ${validToken}`);

      expect(res.status).toBe(200);
      expect(res.body.data).toBe("OK");
    });

    test("Unauthenticated user can't access protected resource", async () => {
      const res = await request(app)
        .get("/test/protected")
        .set("Authorization", `Bearer fake-token`);

      expect(res.status).toBe(401);
    });

    test("GET /user/profile", async () => {
      const res = await request(app)
        .get(`/api/user/profile`)
        .set("Authorization", `Bearer ${validToken}`);

      expect(res.body.data).toMatchObject({
        id: expect.any(Number),
        name: expect.any(String),
        email: expect.any(String),
        role: expect.any(String),
      });
    });

    test("PUT /user/password", async () => {
      const res = await request(app).put("/api/user/password").send({
        currentPass: "password",
        updatePass: "newPassword",
      });

      expect(res.body).toEqual({});
    });
  });
});

describe("POST /user/auth/register", () => {
  test("Can register user", async () => {
    const res = await request(app).post(`${API_USER_AUTH}/register`).send({
      name: "Rick Sanchez",
      email: "rickboi@email.com",
      password: "password",
      role_id: 1,
    });

    const expectedData = {
      id: expect.any(Number),
      name: "Rick Sanchez",
      email: "rickboi@email.com",
      role_id: 1,
    };

    expect(res.status).toBe(201);
    expect(res.body.data).toEqual(expectedData);
  });
});

function sendValidLoginRequest() {
  return request(app).post(`${API_USER_AUTH}/login`).send({
    email: "nagisa@gmail.com",
    password: "password",
  });
}

function sendInvalidLoginRequest() {
  return request(app).post(`${API_USER_AUTH}/login`).send({
    email: "definitely.wrong.email@gmail.com",
    password: "incorrectpassword",
  });
}

function sendLoginRequest(email, password) {
  return request(app).post(`${API_USER_AUTH}/login`).send({
    email,
    password,
  });
}
