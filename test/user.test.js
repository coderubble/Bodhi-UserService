const { userLogin } = require("../src/service/user");
const sandbox = require('sinon').createSandbox();
const UserFactory = require("../src/repository/user_repository");
const { expect } = require("chai");
let User = { findOne: function () { }, generateAuthToken: function () { } };
describe("Check User Login", () => {
  beforeEach(function () {
    sandbox.stub(User, 'findOne').returns(Promise.resolve({
      "email_id": "trump@usa.com",
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
