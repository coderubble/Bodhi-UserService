const request = require("supertest");
const app = require("../src/app");
const models = require("../src/models")
const { PATIENT } = require("../src/constants/constants");
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

const patientUpdate = {
  email_id: "patient@bodhi.com",
  first_name: "Patient",
  last_name: "Trump",
  user_type: PATIENT,
  contact_no: "+9198172398712",
  dob: "1950-10-10",
  address: "White house, USA"
}

const patientUpdatePassword = {
  email_id: "patient@bodhi.com",
  password: "p123",
  first_name: "Donald",
  last_name: "Trump",
  user_type: PATIENT,
  contact_no: "+9198172398712",
  dob: "1950-10-10",
  address: "White house, USA"
}


describe("Patient Flow", () => {
  afterAll(async () => {
    await models.sequelize.close();
    await app.close;
  });

  it("Login Failure::User not found", async () => {
    const res = await request(app)
      .post(`${process.env.API_PREFIX}/user/login`)
      .send({ "email_id": patient.email_id, "password": patient.password });
    expect(res.statusCode).toEqual(500);
    expect(res.text).toEqual("{\"error\":\"No such user or Incorrect Password\"}");
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

  it("Update Patient Without Password Success", async () => {
    const res = await request(app)
      .post(`${process.env.API_PREFIX}/user/login`)
      .send({ "email_id": patient.email_id, "password": patient.password })
      .then(async (response) => {
        const token = JSON.parse(response.text).token;
        const res = await request(app)
          .put(`${process.env.API_PREFIX}/user`)
          .set("authorization", token)
          .send(patientUpdate);
        console.log(`Response:${JSON.stringify(res)}`);
        expect(res.statusCode).toEqual(201);
        const get_response = await request(app)
          .get(`${process.env.API_PREFIX}/user/patient@bodhi.com`)
          .set("authorization", token);
        console.log(`Get response:${JSON.stringify(get_response)}`);
        expect(get_response.statusCode).toEqual(200);
      });
  });

  it("Update Patient With Password Success", async () => {
    const res = await request(app)
      .post(`${process.env.API_PREFIX}/user/login`)
      .send({ "email_id": patient.email_id, "password": patient.password })
      .then(async (response) => {
        const token = JSON.parse(response.text).token;
        const res = await request(app)
          .put(`${process.env.API_PREFIX}/user`)
          .set("authorization", token)
          .send(patientUpdatePassword);
        console.log(`Response:${JSON.stringify(res)}`);
        expect(res.statusCode).toEqual(201);
        const get_response = await request(app)
          .get(`${process.env.API_PREFIX}/user/patient@bodhi.com`)
          .set("authorization", token);
        console.log(`Get response:${JSON.stringify(get_response)}`);
        expect(get_response.statusCode).toEqual(200);
      });
  });

  it("Login Failure", async () => {
    const res = await request(app)
      .post(`${process.env.API_PREFIX}/user/login`)
      .send({ email_id: patient.email_id, password: "wrongpassword" });
    expect(res.statusCode).toEqual(500);
    expect(res.text).toEqual("{\"error\":\"No such user or Incorrect Password\"}");
  });
});
