const to_n = (s) => s.charCodeAt(0);
const to_s = (n) => String.fromCharCode(n)
const axios = require('axios')

run(3).forEach((data) => {
    axios.post('http://localhost:3000/user', {
        "user_name": `${data}`,
        "user_type": "C",
        "email_id": `${data}@gmail.com`,
        "contact_no": "+919876543210"
    }).then(res => {
        console.log(`inserted ${data}`)
    }).catch(error => {
        console.error(error.message);
    })
});

function run(len) {
    const output = [];
    const n = to_n('a');
    const fn = (prefix, n) => {
        if (prefix.length == len) {
            output.push(prefix);
        } else {
            for (let i = n; i <= to_n('z'); i++) {
                const word = prefix + to_s(i);
                fn(prefix + to_s(i), i + 1);
            }
        }
    }
    fn('', to_n('a'));
    return output;
}
