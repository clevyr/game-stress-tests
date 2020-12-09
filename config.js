const company = 'Clevyr'
const title = 'Dev'

const generateBotConfig = (name) => {
  return {
    firstName: name,
    lastName: 'bot',
    email: `${name}@botbotbot.com`,
    password: 'password',
    company,
    title
  }
}

const baseNames = ['aaron', 'gabe', 'tony', 'grant', 'jake']
const users = []

for (let i = 0; i < 100; i++) {
  baseNames.forEach((name) => {
    users.push(generateBotConfig(name + i))
  })
}

const config = {
  users
}

module.exports = config
