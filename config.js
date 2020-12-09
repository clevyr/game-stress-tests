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

const config = {
  users: [
    generateBotConfig('aaron'),
    generateBotConfig('gabe'),
    generateBotConfig('tony'),
    generateBotConfig('grant'),
    generateBotConfig('jake'),
  ]
}

module.exports = config
