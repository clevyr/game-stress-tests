const axios = require('axios');

const config = require('./config')

const { users } = config;

let callCount = 0;
async function runRequest(user) {
  async function runPage() {
    try {
      await axios({
        method: 'POST',
        url: 'https://dev.admin.onelambda.clevyr.on-livi.com/auth/local/register',
        data: {
          forename: user.firstName,
          surname: user.lastName,
          email: user.email,
          password: user.password,
          company: user.company,
          title: user.company,
        },
      });
      console.log('created');
    } catch (e) {
      console.log(e.message);
    }
    callCount++;
  }

  await runPage();
}

// setInterval(() => {
//   console.log(callCount);
//   callCount = 0;
// }, 1000);

async function start() {
  for (let i = 900; i < 1000; i++) {
    runRequest(users[i]);
  }
}

(async () => {
  await start();
})();
