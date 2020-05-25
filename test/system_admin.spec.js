const request = require("supertest");
const app = require("../src/app"); 
const { CLINIC_ADMIN, CLINIC_USER, SYSTEM_ADMIN, PATIENT } = require("../src/constants/constants");
const bcrypt = require("bcryptjs");
const models = require("../src/models")
const User = models.user
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
const systemAdmin_updated = {
  email_id: "system_admin@bodhi.com",
  password: "sysAdmin123",
  first_name: "Steven",
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
  clinic_id: "1234567",
  contact_no: "+9198172398712",
  dob: "1950-10-10",
  address: "White house, USA"
}
const clinicAdmin_updated = {
  email_id: "clinic_admin@bodhi.com",
  password: "clinicAdmin123",
  first_name: "Charly",
  last_name: "Ambrose",
  user_type: CLINIC_ADMIN,
  clinic_id: "1234567",
  contact_no: "+9198172398712",
  dob: "1950-10-10",
  address: "White house, USA"
}
const clinicUser = {
  email_id: "clinic_user@bodhi.com",
  password: "c123",
  first_name: "U",
  last_name: "Trump",
  clinic_id: "1234567",
  user_type: CLINIC_USER,
  contact_no: "+9198172398712",
  dob: "1950-10-10",
  address: "White house, USA"
}
const clinicUser_updated = {
  email_id: "clinic_user@bodhi.com",
  password: "C",
  first_name: "User",
  last_name: "U",
  clinic_id: "1234567",
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
const patientUpdated = {
  email_id: "patient@bodhi.com",
  password: "trump123",
  first_name: "Donald",
  last_name: "Davis",
  user_type: PATIENT,
  contact_no: "+9198172398712",
  dob: "1950-10-10",
  address: "White house, USA"
}
describe("System Admin Flow", () => {
  let server;
  beforeAll(async (done) => {
    bcrypt.hash(systemAdmin.password, Number(process.env.SALT), async function (err, hash) {
      User.create({ ...systemAdmin, password: hash }).then(() => { done() });
    });
  });

  afterAll(async () => {
    await models.sequelize.close();
    await app.close;
  });

  test("Login Successfully", async () => {
    const res = await request(app)
      .post(`${process.env.API_PREFIX}/user/login`)
      .send({ email_id: systemAdmin.email_id, password: systemAdmin.password });
    expect(res.statusCode).toEqual(200);
  });

  test("Login Failure", async () => {
    const res = await request(app)
      .post(`${process.env.API_PREFIX}/user/login`)
      .send({ email_id: systemAdmin.email_id, password: "wrongpassword" });
    expect(res.text).toEqual("{\"error\":\"No such user or Incorrect Password\"}");
    expect(res.statusCode).toEqual(500);
  });

  test("Create Patient,Clinic Admin & Clinic User,Also Update the same by  System Admin", async () => {
    await request(app)
      .post(`${process.env.API_PREFIX}/user/login`)
      .send({ email_id: systemAdmin.email_id, password: systemAdmin.password })
      .then(async (response) => {
        const token = response.text;
        const clinic_admin_response = await request(app)
          .post(`${process.env.API_PREFIX}/user`)
          .set("authorization", token)
          .send(clinicAdmin);
        expect(clinic_admin_response.statusCode).toEqual(201);

        const patient_response = await request(app)
          .post(`${process.env.API_PREFIX}/user`)
          .set("authorization", token)
          .send(patient);
        expect(patient_response.statusCode).toEqual(201);

        const clinic_user_response = await request(app)
          .post(`${process.env.API_PREFIX}/user`)
          .set("authorization", token)
          .send(clinicUser);
        expect(clinic_user_response.statusCode).toEqual(201);

        const update_response = await request(app)
          .put(`${process.env.API_PREFIX}/user`)
          .set("authorization", token)
          .send(systemAdmin_updated);
        expect(update_response.statusCode).toEqual(201);

        const update_clinicadmin_response = await request(app)
          .put(`${process.env.API_PREFIX}/user`)
          .set("authorization", token)
          .send(clinicAdmin_updated);
        expect(update_clinicadmin_response.statusCode).toEqual(201);

        const update_clinicuser_response = await request(app)
          .put(`${process.env.API_PREFIX}/user`)
          .set("authorization", token)
          .send(clinicUser_updated);
        expect(update_clinicuser_response.statusCode).toEqual(201);

        const update_patient_response = await request(app)
          .put(`${process.env.API_PREFIX}/user`)
          .set("authorization", token)
          .send(patientUpdated);
        expect(update_patient_response.statusCode).toEqual(201);
      
        const get_all_user_response = await request(app)
          .get(`${process.env.API_PREFIX}/user?from=0&to=20`)
          .set("authorization", token);
        const users = JSON.parse(get_all_user_response.text)
        result = users.map(user => {
          return user.email_id;
        })
        console.log(`Result:${JSON.stringify(users)}`);

        expect(result).toEqual(expect.arrayContaining([systemAdmin.email_id, clinicAdmin.email_id, patient.email_id]));

      });
  });
  // TODO: scenarios to write tests for:
  // 
});
