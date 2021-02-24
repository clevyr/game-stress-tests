const generateBot = (suffix) => ({
  firstName: `Test-${suffix}`,
  lastName: 'Bot',
  email: `test-${suffix}@botbotbot.com`,
  password: 'Password1234?',
  compant: '',
  title: '',
  country: '',
  state: '',
});

module.exports = generateBot;
