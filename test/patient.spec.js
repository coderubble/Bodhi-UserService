const request = require("supertest");
const db = require("../src/db/database")
const sinon = require("sinon");
const { Sequelize } = require("sequelize");
sinon.stub(db, "sequelize").returns(new Sequelize('sqlite::memory:'));
const app = require("../src/app"); // This line must be after the sequalize stub creation.
const { CLINIC_ADMIN, CLINIC_USER, SYSTEM_ADMIN, PATIENT } = require("../src/constants/constants");
const bcrypt = require("bcryptjs");
const User = require("../src/models/user.model");
const patient = {
  email_id: "patient@bodhi.com",
  password: "trump123",
  first_name: "Donald",
  last_name: "Trump",
  user_type: PATIENT,
  contact_no: "+9198172398712",
  dob: "1950-10-10",
  address: "White house, USA"
}
describe("Patient Flow", () => {
  let server;
  beforeAll((done) => {
    User.sync().then(() => {
      server = app.listen(async () => {
        global.agent = request.agent(server);
        done();
      });
    })
  });

  afterAll(async () => {
    await server.close();
  });

  test("Create Patient", async () => {
    const res = await request(app)
      .post("/user")
      .send(patient);
    expect(res.statusCode).toEqual(201);
  });

  test("Login Success", async () => {
    const res = await request(app)
      .post("/user/login")
      .send({ "email_id": patient.email_id, "password": patient.password });
    expect(res.statusCode).toEqual(200);
  });
  
  test("Login Failure", async (done) => {
    const res = await request(app)
      .post("/user/login")
      .send({ email_id: patient.email_id, password: "wrongpassword" });
    expect(res.statusCode).toEqual(500);
    expect(res.text).toEqual("Incorrect Username or Password");
    done();
  });
});
