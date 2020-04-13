const axios = require("axios");

for (let i = 1; i < 2; i++) {
  const name = `seed_user${i}`;
  axios.post("http://localhost:3000/user", {
    "email_id": `${name}@gmail.com`,
    "password":"123456789",
    "first_name": name,
    "last_name": "xxx",
    "user_type": "C",
    "contact_no": "+9198172398712",
    "dob": "10-10-1950",
    "address": "White house, USA"
  }).then(() => {
    console.log(`inserted ${name}`);
  }).catch(error => {
    console.error(error.message);
  })
}
