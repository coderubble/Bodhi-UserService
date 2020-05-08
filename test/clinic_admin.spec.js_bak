const request = require("supertest");
const db = require("../src/db/database")
const sinon = require("sinon");
const { Sequelize } = require("sequelize");
const sequalize = new Sequelize('sqlite::memory:');
sinon.stub(db, "sequelize").returns(sequalize);
const app = require("../src/app"); // This line must be after the sequalize stub creation.
const { CLINIC_ADMIN, CLINIC_USER, SYSTEM_ADMIN, PATIENT } = require("../src/constants/constants");
const bcrypt = require("bcryptjs");
const User = require("../src/models/user.model");

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
const clinicAdminUpdate = {
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
  password: "C",
  first_name: "U",
  last_name: "Trump",
  clinic_id: "1234567",
  user_type: CLINIC_USER,
  contact_no: "+9198172398712",
  dob: "1950-10-10",
  address: "White house, USA"
}
const clinicUserUpdate = {
  email_id: "clinic_user@bodhi.com",
  password: "C",
  first_name: "User",
  last_name: "Trump",
  clinic_id: "1234567",
  user_type: CLINIC_USER,
  contact_no: "+9198172398712",
  dob: "1950-10-10",
  address: "White house, USA"
}
const clinicUser1 = {
  email_id: "clinic_user1@bodhi.com",
  password: "C1",
  first_name: "U1",
  last_name: "Trump",
  clinic_id: "1234567",
  user_type: CLINIC_USER,
  contact_no: "+9198172398712",
  dob: "1950-10-10",
  address: "White house, USA"
}
const clinicUser2 = {
  email_id: "clinic_user2@bodhi.com",
  password: "C2",
  first_name: "U2",
  last_name: "Trump",
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
describe("Clinic Admin Flow", () => {
  let server;
  beforeAll((done) => {
    User.sync().then(() => {
      server = app.listen(async () => {
        global.agent = request.agent(server);
        done();
      });
    }).then(() => {
      bcrypt.hash(systemAdmin.password, Number(process.env.SALT), async function (err, hash) {
        if (hash) {
          User.create({ ...systemAdmin, password: hash });
        }
      });
    })
  });

  afterAll(async () => {
    await server.close();
    await sequalize.close();
  });

  test("System Admin Login & Create Clinic Admin", async () => {
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
      });
  });

  test("Login Failure", async () => {
    const res = await request(app)
      .post(`${process.env.API_PREFIX}/user/login`)
      .send({ email_id: clinicAdmin.email_id, password: "wrongpassword" });
    expect(res.text).toEqual("Incorrect Username or Password");
    expect(res.statusCode).toEqual(500);
  });

  test("Login as Clinic Admin,Can Create Clinic User & Patient::Not authorised to create Clinic Admin", async () => {
    //Login as Clinic Admin & created 3 Clinic Users and One Patient
    await request(app).post(`${process.env.API_PREFIX}/user/login`)
      .send({ email_id: clinicAdmin.email_id, password: clinicAdmin.password })
      .then(async (response) => {
        const token = response.text;
        const clinic_user_response = await request(app)
          .post(`${process.env.API_PREFIX}/user`)
          .set("authorization", token)
          .send(clinicUser);
        expect(clinic_user_response.statusCode).toEqual(201);

        const clinic_user1_response = await request(app)
          .post(`${process.env.API_PREFIX}/user`)
          .set("authorization", token)
          .send(clinicUser1);
        expect(clinic_user1_response.statusCode).toEqual(201);

        const clinic_user2_response = await request(app)
          .post(`${process.env.API_PREFIX}/user`)
          .set("authorization", token)
          .send(clinicUser2);
        expect(clinic_user2_response.statusCode).toEqual(201);

        const patient_response = await request(app)
          .post(`${process.env.API_PREFIX}/user`)
          .set("authorization", token)
          .send(patient);
        expect(patient_response.statusCode).toEqual(201);

        //Failed to create Clinic Admin 
        const clinic_admin_response = await request(app)
          .post(`${process.env.API_PREFIX}/user`)
          .set("authorization", token)
          .send(clinicAdmin);
        expect(clinic_admin_response.statusCode).toEqual(403);

        //Failed to update System Admin,Clinic User,Patient
        const update_response = await request(app)
          .put(`${process.env.API_PREFIX}/user`)
          .set("authorization", token)
          .send(systemAdmin_updated);
        expect(update_response.statusCode).toEqual(403);

        const update_clinicuser_response = await request(app)
          .put(`${process.env.API_PREFIX}/user`)
          .set("authorization", token)
          .send(clinicUserUpdate);
        expect(update_clinicuser_response.statusCode).toEqual(403);

        const update_patient_response = await request(app)
          .put(`${process.env.API_PREFIX}/user`)
          .set("authorization", token)
          .send(patientUpdated);
        expect(update_patient_response.statusCode).toEqual(403);

        //Get all users in the clinic
        const getall_response = await request(app)
          .get(`${process.env.API_PREFIX}/user?from=0&to=20`)
          .set("authorization", token);
        const users = JSON.parse(getall_response.text) || []
        result = users.map(user => {
          return user.email_id;
        })
        expect(result).toEqual(expect.not.arrayContaining([systemAdmin.email_id, patient.email_id, clinicAdmin.email_id]));
      })
  })
});