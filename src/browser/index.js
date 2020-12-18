const puppeteer = require('puppeteer')
const { Command } = require('commander')

const config = require('../../config')

const { users } = config
const program = new Command()

const run = async () => {
  program
    .requiredOption('-u, --url <url>', 'Url to use for testing')
    .option('-l, --limit <limit>', 'Max number of users for stress testing', 1)
    .option('-o, --offset <offset>', 'Use users after nth offset', 0)
    .option('-h, --headless', 'Run the test in headless mode', false)
    .option('-i, --iterations <iterations>', 'Run a given number of iterations', Number.MAX_SAFE_INTEGER)
    .option('-e, --emotes', 'Run with emote reactions', false)
    .option('--messages', 'Run with message sending', false)

  program.parse(process.argv)

  const startUser = parseInt(program.offset, 10)
  const endUser = startUser + parseInt(program.limit)
  const iterationLog = program.iterations !== Number.MAX_SAFE_INTEGER

  console.log(`Starting at user ${startUser}`)
  console.log(`Running tests for ${program.limit} users`)
  console.log(`Headless mode: ${program.headless}`)
  console.log(`Showing Messages: ${program.messages}`)
  console.log(`Showing Emotes: ${program.emotes}`)
  console.log(`Running ${iterationLog ? program.iterations : 'infinite'} iterations`)
  console.log('---')

  const filteredUsers = users.slice(startUser, endUser)

  if (filteredUsers.length > process.getMaxListeners()) {
    process.setMaxListeners(filteredUsers.length)
  }

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

      let pageLoaded = false;

      try {
        // Login to the site
        while (pageLoaded === false) {
          await page.goto(program.url, { waitUntil: 'networkidle2' })

          await page.evaluate(() => {
            window.localStorage.setItem('live_debug_1_DISABLED_3D', 'true')
          })

          try {
            await page.waitForSelector('input[placeholder^="Email"]')
            console.log('Page loaded!');
            pageLoaded = true;
          } catch (_error) {
            console.log('Page not loaded. Refreshing page...');
          }
        }

        await page.type('input[placeholder^="Email"]', user.email)
        await page.type('input[placeholder^="Password"]', user.password)
        await page.click('form [type="submit"]')

        console.log('Successful login')

        await page.waitForTimeout(10000)

        const [button] = await page.$x("//button[contains(., 'I am ready')]");
        if (button) {
          await button.click();
          console.log('Clicked a button')
        }

        console.log('Waiting for modal to close...')

        const closeButtonSelector = '[class^="Modal"] [class^="CloseButton"]'
        await page.waitForSelector(closeButtonSelector)

        // Close it 3 times
        await page.click(closeButtonSelector)
        await page.waitForSelector(closeButtonSelector)
        await page.click(closeButtonSelector)
        await page.waitForSelector(closeButtonSelector)
        await page.click(closeButtonSelector)

        console.log('Modal closed')

        // Run in a circle. Forever.
        await page.keyboard.down('ArrowUp')
        await page.keyboard.down('ArrowRight')

        console.log('Running')

        await page.waitForSelector('[class^="styles__StyledChatButton"]')
        await page.click('[class^="styles__StyledChatButton"]') // Open Chat
        await page.waitForTimeout(1000)
        await page.waitForSelector('[class^="ChatSelector__Container"]')
        await page.click('[class^="ChatSelector__Container"]') // Open Chat
        await page.waitForSelector('[class^="style__TextArea"]')

        // Send messages every 3 seconds. Forever.
        for (let i = 0; i < program.iterations; i++) {
          if (iterationLog) {
            console.log(`Iteration ${i}`)
          }

          try {
            if (program.messages && page.$('[class^="style__TextArea"]')) {
              await page.type('[class^="style__TextArea"]', i.toString()) // Type chat
              await page.click('#inputForm button') // Click Chat Submit
            }

            if (program.emotes && page.$('[class^="ChatEmotes__EmoteButton"]')) {
              await page.evaluate(() => {
                document.querySelector('[class^="ChatEmotes__EmoteButton"]').click()
              })
            }
          } catch (e) {
            console.warn(e)
          }

          await page.waitForTimeout(1000)
        }
      } catch (e) {
        console.error(e)
      } finally {
        await browser.close()
      }
    })()
  })
}

exports.run = run

// If called directly via CLI, instead of via module
if (require.main === module) {
  run()
}
