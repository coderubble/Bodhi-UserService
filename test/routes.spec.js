const request = require("supertest");
const db = require("../src/db/database")
const sinon = require("sinon");
const { Sequelize } = require("sequelize");
sinon.stub(db, "sequelize").returns(new Sequelize('sqlite::memory:'));
const app = require("../src/app"); // This line must be after the sequalize stub creation.
const { CLINIC_ADMIN, CLINIC_USER, SYSTEM_ADMIN, PATIENT } = require("../src/constants/constants");

describe("User Service", () => {
  const systemAdmin = {
    email_id: "system_admin@bodhi.com",
    password: "sysAdmin123",
    first_name: "Steve",
    last_name: "Anderson",
    user_type: SYSTEM_ADMIN,
    contact_no: "+9198172398712",
    dob: "1950-10-10",
    address: "White house, Australia"
  };
  const clinicAdmin = {
    email_id: "clinic_admin@bodhi.com",
    password: "clinicAdmin123",
    first_name: "Charlie",
    last_name: "Ambrose",
    user_type: CLINIC_ADMIN,
    contact_no: "+9198172398712",
    dob: "1950-10-10",
    address: "White house, USA"
  }
  const clinicUser = {
    email_id: "clinic_user@bodhi.com",
    password: "C",
    first_name: "U",
    last_name: "Trump",
    user_type: CLINIC_USER,
    contact_no: "+9198172398712",
    dob: "1950-10-10",
    address: "White house, USA"
  }
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
  let server;
  beforeAll((done) => {
    server = app.listen(() => {
      global.agent = request.agent(server);
      done();
    });
  });

  afterAll(async () => {
    await server.close();
  });

  test("Login Failure", async (done) => {
    const res = await request(app)
      .post("/user/login")
      .send({ email_id: systemAdmin.email_id, password: "wrongpassword" });
    expect(res.statusCode).toEqual(500);
    done();
  });

  // test("Login Successfully", async () => {
  //   const res = await request(app)
  //     .post("/user/login")
  //     .send({ email_id: systemAdmin.email_id, password: systemAdmin.password });
  //   expect(res.statusCode).toEqual(500);
  // });

  // test("Create User", async () => {
  //   const res = await request(app)
  //     .post("/user")
  //     .send(systemAdmin);
  //   expect(res.statusCode).toEqual(201);
  // }, 30000);

  // test("Login Failure", async () => {
  //   const res = await request(app)
  //     .post("/user/login")
  //     .send({ "email_id": "scott@bodhi.com", "password": "wrongpassword" });
  //   expect(res.statusCode).toEqual(500);
  // });

  // test("Login Success", async () => {
  //   const res = await request(app)
  //     .post("/user/login")
  //     .send({ "email_id": "scott@bodhi.com", "password": "scott123" });
  //   expect(res.statusCode).toEqual(200);
  // });
});
