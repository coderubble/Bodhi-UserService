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
describe("Patient AuthToken Check", () => {
  afterAll(async () => {
    await models.sequelize.close();
    await app.close;
  });

  it("Create Patient", async () => {
    const res = await request(app)
      .post(`${process.env.API_PREFIX}/user`)
      .send(patient);
    expect(res.statusCode).toEqual(201);
  });

  it("Get All User Should Fail for Patient", async (done) => {
    const res = await request(app)
      .post(`${process.env.API_PREFIX}/user/login`)
      .send({ "email_id": patient.email_id, "password": patient.password })
      .then(async (response) => {
        const token = JSON.parse(response.text).token;
        const getUserInfoResponse = await request(app)
          .get(`${process.env.API_PREFIX}/user`)
          .set("authorization", token)
        expect(getUserInfoResponse.statusCode).toEqual(401);
        // const result = JSON.parse(getUserInfoResponse.text)
        // console.log(`Result:${JSON.stringify(result)}`);
        // expect(result).toEqual(patient.email_id, patient.user_type, null);
      })
    done();
  });
});