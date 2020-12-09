const puppeteer = require('puppeteer')
const { Command } = require('commander');

const config = require('../../config')

const { users } = config
const LOGIN_URL = 'https://dev.onelambda.clevyr.on-livi.com/join'
const program = new Command();

const run = async () => {
  program
    .option('-l, --limit <limit>', 'Max number of users for stress testing', 10)
    .option('-o, --offset <offset>', 'Use users after nth offset', 0)

  program.parse(process.argv)

  const startUser = parseInt(program.offset, 10)
  const endUser = startUser + parseInt(program.limit)

  console.log(`Starting at user ${startUser}`);
  console.log(`Creating ${program.limit} users`);

  const filteredUsers = users.slice(startUser, endUser)

  filteredUsers.forEach((user) => {
    (async () => {
      const browser = await puppeteer.launch({
        headless: true
      })
      const page = await browser.newPage()
      await page.setViewport({
        width: 1000,
        height: 800,
        deviceScaleFactor: 1
      })

      // Login to the site
      await page.goto(LOGIN_URL, { waitUntil: 'networkidle2' })

      await page.type('input[placeholder^="Email"]', user.email)
      await page.type('input[placeholder^="Password"]', user.password)
      await page.click('form [type="submit"]')

      console.log('Successful login');

      // Let the login action run
      await page.waitForTimeout(15000)

      // Skip through the "Get Started" navigation
      // await page.click('[class^="Modal"] [class^="CloseButton"]')
      // await page.waitForTimeout(100)
      // await page.click('[class^="Modal"] [class^="CloseButton"]')
      // await page.waitForTimeout(100)
      // await page.click('[class^="Modal"] [class^="CloseButton"]')
      // await page.waitForTimeout(100)

      console.log('Modal closes');

      // Run in a circle. Forever.
      await page.keyboard.down('ArrowUp')
      await page.keyboard.down('ArrowLeft')

      console.log('Running');

      // await page.screenshot({ path: 'example.png' })

      // Keep the browser up for a long time
      await page.waitForTimeout(1000000)

      await browser.close()
    })()
  })
}

exports.run = run;

// If called directly via CLI, instead of via module
if (require.main === module) {
  run()
}
