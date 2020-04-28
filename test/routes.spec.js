const request = require("supertest");
const db = require("../src/db/database")
const sinon = require("sinon");
const { Sequelize } = require("sequelize");
sinon.stub(db, "sequelize").returns(new Sequelize('sqlite::memory:'));
const app = require("../src/app"); // This line must be after the sequalize stub creation.

describe("User Service", () => {
  let server;
  beforeAll(async (done) => {
    server = app.listen(4500, () => {
      global.agent = request.agent(server);
      done();
    });
  });

  afterAll(async () => {
    await server.close();
  });

  test("Create User", async () => {
    const res = await request(app)
      .post("/user")
      .send({
        "email_id": "scott@usa.com",
        "password": "scott123",
        "first_name": "Donald",
        "last_name": "Trump",
        "user_type": "S",
        "contact_no": "+9198172398712",
        "dob": "1950-10-10",
        "address": "White house, USA"
      });
    expect(res.statusCode).toEqual(201);
  }, 30000);

  test("Login Failure", async () => {
    const res = await request(app)
      .post("/user/login")
      .send({ "email_id": "scott@usa.com", "password": "wrongpassword" });
    expect(res.statusCode).toEqual(500);
  });

  test("Login Success", async () => {
    const res = await request(app)
      .post("/user/login")
      .send({ "email_id": "scott@usa.com", "password": "scott123" });
    expect(res.statusCode).toEqual(200);
  });
});
