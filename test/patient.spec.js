const request = require("supertest");
const sinon = require("sinon");
const { Sequelize } = require("sequelize");
const app = require("../src/app");
const { PATIENT } = require("../src/constants/constants");
const bcrypt = require("bcryptjs");
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

it("Login Failure::User not found", async () => {
  const res = await request(app)
    .post(`${process.env.API_PREFIX}/user/login`)
    .send({ "email_id": patient.email_id, "password": patient.password });
  expect(res.statusCode).toEqual(500);
  expect(res.text).toEqual("User not found");
});

it("Create Patient", async () => {
    const res = await request(app)
      .post(`${process.env.API_PREFIX}/user`)
      .send(patient);
    expect(res.statusCode).toEqual(201);
  });

  it("Login Success", async () => {
    const res = await request(app)
      .post(`${process.env.API_PREFIX}/user/login`)
      .send({ "email_id": patient.email_id, "password": patient.password });
    expect(res.statusCode).toEqual(200);
  });

  it("Login Failure", async () => {
    const res = await request(app)
      .post(`${process.env.API_PREFIX}/user/login`)
      .send({ email_id: patient.email_id, password: "wrongpassword" });
    expect(res.statusCode).toEqual(500);
    expect(res.text).toEqual("Incorrect Username or Password");
  });
});
