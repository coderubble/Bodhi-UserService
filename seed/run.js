const axios = require("axios");

for (let i = 1; i < 2000; i++) {
  const user_name = `User${i}`;
  axios.post("http://localhost:3000/user", {
    "user_name": `Seed_${user_name}`,
    "user_type": "C",
    "email_id": `Seed_${user_name}@gmail.com`,
    "contact_no": "+919876543210"
  }).then(() => {
    console.log(`inserted ${user_name}`);
  }).catch(error => {
    console.error(error.message);
  })
}