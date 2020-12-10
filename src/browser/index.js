const puppeteer = require('puppeteer')
const { Command } = require('commander');

const config = require('../../config')

const { users } = config
const LOGIN_URL = 'https://dev.onelambda.clevyr.on-livi.com/join'
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
      console.log('Waiting for modal to close...');

      const closeButtonSelector = '[class^="Modal"] [class^="CloseButton"]';
      await page.waitForSelector(closeButtonSelector);

      // Close it 3 times
      await page.click(closeButtonSelector)
      await page.waitForSelector(closeButtonSelector);
      await page.click(closeButtonSelector)
      await page.waitForSelector(closeButtonSelector);
      await page.click(closeButtonSelector)

      console.log('Modal closed');

      // Run in a circle. Forever.
      await page.keyboard.down('ArrowUp')
      await page.keyboard.down('ArrowLeft')

      console.log('Running');

      await page.waitForSelector('[class^="styles__StyledChatButton"]');
      await page.click('[class^="styles__StyledChatButton"]') // Open Chat
      await page.waitForTimeout(1000)
      await page.waitForSelector('[class^="ChatSelector__Container"]');
      await page.click('[class^="ChatSelector__Container"]') // Open Chat
      await page.waitForSelector('[class^="style__TextArea"]');

      // Send messages every 3 seconds. Forever.
      let messageCount = 0;
      while (true) {
        messageCount++
        await page.type('[class^="style__TextArea"]', messageCount.toString()); // Type chat
        await page.click('#inputForm button') // Click Chat Submit
        await page.waitForTimeout(3000)
      }

      await browser.close()
    })()
  })
}

exports.run = run;

// If called directly via CLI, instead of via module
if (require.main === module) {
  run()
}
