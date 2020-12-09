const puppeteer = require('puppeteer')
const { Command } = require('commander');

const config = require('../../config')

const { users } = config
const LOGIN_URL = `${process.env.URL}/join`
const program = new Command();

const run = async () => {
  program
    .option('-l, --limit <limit>', 'Max number of users for stress testing', 1)
    .option('-o, --offset <offset>', 'Use users after nth offset', 0)
    .option('-h, --headless', 'Run the test in headless mode', false)

  program.parse(process.argv)

  const startUser = parseInt(program.offset, 10)
  const endUser = startUser + parseInt(program.limit)

  console.log(`Starting at user ${startUser}`);
  console.log(`Running tests for ${program.limit} users`);
  console.log(`Headless mode: ${program.headless}`);

  const filteredUsers = users.slice(startUser, endUser)

  filteredUsers.forEach((user) => {
    (async () => {
      const browser = await puppeteer.launch({
        headless: program.headless
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

      // Skip through the "Get Started" navigation
      if (!program.headless) {
        console.log('Running non-headless: waiting for modal to close');
        const closeButtonSelector = '[class^="Modal"] [class^="CloseButton"]';
        await page.waitForSelector(closeButtonSelector);

        // Close it 3 times
        await page.click(closeButtonSelector)
        await page.waitForSelector(closeButtonSelector);
        await page.click(closeButtonSelector)
        await page.waitForSelector(closeButtonSelector);
        await page.click(closeButtonSelector)

        console.log('Modal closed');
      } else {
        await page.waitForTimeout(15000)
      }

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
