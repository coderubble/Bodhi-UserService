const { userLogin, userGetByEmail, userInsert, userGetAll, userUpdate, userDelete } = require("../src/service/user.service");
const sandbox = require("sinon").createSandbox();
const UserRepository = require("../src/repository/user.repository");
const { expect } = require("chai");
let User = { findOne: function () { }, generateAuthToken: function () { }, create: function () { }, findAndCountAll: function () { } };
const trumps_email_id = "trump@usa.com";
const obamas_email_id = "trump@usa.com";
const trumps_password = "trump123";
const trump = {
  email_id: trumps_email_id,
  "password": "trump123",
  "first_name": "Donald",
  "last_name": "Trump",
  "user_type": "S",
  "contact_no": "+9198172398712",
  "dob": "10-10-1950",
  "address": "White house, USA"
};

const obama = {
  email_id: obamas_email_id,
  "password": "trump123",
  "first_name": "Donald",
  "last_name": "Trump",
  "user_type": "S",
  "contact_no": "+9198172398712",
  "dob": "10-10-1950",
  "address": "White house, USA"
};

const maskedTrump = maskPwd(trump);
const maskedObama = maskPwd(obama);
const seqedTrump = seqed(maskedTrump);
const seqedObama = seqed(maskedObama);
const users = { rows: [seqedTrump, seqedObama] };

describe("Check User Login", () => {
  beforeEach(function () {
    sandbox.stub(User, "findOne").returns(Promise.resolve({
      email_id: trumps_email_id,
      "password": "$2a$10$I.Q77XsVod7SqASqnyd2IOo4ZMjNTps4OQSGJmcSCG4shan2bbEjC",
      "user_type": "P"
    }));
    sandbox.stub(UserRepository, "getUser").returns(User);
  });

  afterEach(function () {
    sandbox.restore();
  });

  it("should Passwords match", (done) => {
    sandbox.stub(User, "generateAuthToken").returns("some token");
    userLogin({ email_id: trumps_email_id, password: trumps_password }, function (error, result) {
      if (result) {
        done();
      }
    });
  });

  it("should throw a mismatch", (done) => {
    userLogin({ email_id: trumps_email_id, password: "trump1234" }, function (error) {
      if (error) {
        expect(error).equal("Incorrect Username or Password");
        done();
      }
    });
  });
});

describe("Check for User Login(User does not exist)", () => {
  afterEach(function () {
    sandbox.restore();
  });

  it("should throw User not found error", (done) => {
    sandbox.stub(User, "findOne").withArgs({
      where: { email_id: trumps_email_id }
    }).returns(Promise.reject());
    sandbox.stub(UserRepository, "getUser").returns(User);

    userLogin({ email_id: trumps_email_id, password: trumps_password }, function (error) {
      if (error) {
        expect(error).to.equals("User not found");
        done();
      }
    });
  });
});

describe("Check View User by email-id", () => {
  afterEach(function () {
    sandbox.restore();
  });

  it("Should return Details of given email-id", (done) => {
    sandbox.stub(User, "findOne").withArgs({
      where: { email_id: trumps_email_id }
    }).returns(Promise.resolve(Object.assign({}, seqed(trump))));
    sandbox.stub(UserRepository, "getUser").returns(User);

    userGetByEmail({ email_id: trumps_email_id }, function (error, result) {
      if (result) {
        expect(result).to.eql([maskedTrump]);
        done();
      } else {
        console.log(`Error: ${error}`);
      }
    });
  });
});

describe("Check View All Users", () => {
  afterEach(function () {
    sandbox.restore();
  });
  it("Should return Details of all users", (done) => {
    sandbox.stub(User, "findAndCountAll").returns(Promise.resolve(Object.assign({}, users)));
    sandbox.stub(UserRepository, "getUser").returns(User);
    const from = 0;
    const to = 10;
    userGetAll({ from, to }, function (error, result) {
      if (result) {
        expect(result).to.eql(users.rows.map(user => user.toJSON()));
        done();
      }
      else {
        console.log(`Error: ${error}`);
      }
    });
  });
});

describe("Check hashed password", () => {
  afterEach(function () {
    sandbox.restore();
  });

  it("Should insert hashed password", (done) => {
    sandbox.stub(User, "create")
      .returns(Promise.resolve({ email_id: trumps_email_id }));
    sandbox.stub(UserRepository, "getUser").returns(User);

    userInsert(trump, function (error, result) {
      if (result) {
        expect(result).to.eql({ message: "Created Record: trump@usa.com" });
        done();
      } else {
        console.log(`Error: ${error}`);
      }
    });
  });
});

function maskPwd(user) {
  return {
    ...user,
    "password": "******"
  };
}
// Converts user into sequelized user
function seqed(user) {
  return { toJSON: () => user };
}
