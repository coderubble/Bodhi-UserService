const { userLogin, userGetByEmail } = require("../src/service/user.service");
const sandbox = require('sinon').createSandbox();
const UserFactory = require("../src/repository/user_repository");
const { expect } = require("chai");
let User = { findOne: function () { }, generateAuthToken: function () { } };
const email_id = "trump@usa.com"
let user_detail = {
  email_id,
  "password": "trump123",
  "first_name": "Donald",
  "last_name": "Trump",
  "user_type": "S",
  "contact_no": "+9198172398712",
  "dob": "10-10-1950",
  "address": "White house, USA"
};
describe("Check User Login", () => {
  beforeEach(function () {
    sandbox.stub(User, 'findOne').withArgs({
      where: { email_id }
    }).returns(Promise.resolve({
      email_id,
      "password": "$2a$10$I.Q77XsVod7SqASqnyd2IOo4ZMjNTps4OQSGJmcSCG4shan2bbEjC",
      "user_type": "P"
    }));
    sandbox.stub(UserFactory, "getUser").returns(User);
  });

  afterEach(function () {
    sandbox.restore();
  });

  it('should Passwords match', (done) => {
    const email_id = "trump@usa.com";
    const password = "trump123";
    sandbox.stub(User, 'generateAuthToken').returns("some token");
    userLogin({ email_id, password }, function (error, result) {
      if (result) {
        done();
      }
    });
  });

  it('should throw a mismatch', (done) => {
    const email_id = "trump@usa.com";
    const password = "trump1234";
    userLogin({ email_id, password }, function (error, result) {
      if (error) {
        expect(error).equal("Incorrect Username or Password");
        done();
      }
    });
  });
})

describe("Check View User by email-id", () => {
  afterEach(function () {
    sandbox.restore();
  });

  it("Should return Details of given email-id", (done) => {
    sandbox.stub(User, 'findOne').withArgs({
      where: { email_id }
    }).returns(Promise.resolve(Object.assign({}, user_detail)));
    sandbox.stub(UserFactory, "getUser").returns(User);

    userGetByEmail({ email_id }, function (error, result) {
      if (result) {
        expect(result).to.eql(user_detail);
        done();
      } else {
        console.log(`Error: ${error}`);
      }
    });
  })
});