const puppeteer = require('puppeteer')
const config = require('../../config')

const { users } = config
const LOGIN_URL = `${process.env.URL}/join`

exports.run = async () => {
  const lastArg = process.argv[process.argv.length - 1];
  const limit = parseInt(lastArg); // Will be NaN if lastArg isn't a number

  const filteredUsers = limit ? users.slice(0, limit) : users;

  filteredUsers.forEach((user) => {
    (async () => {
      const browser = await puppeteer.launch({
        headless: false
      })
      const page = await browser.newPage()
      await page.setViewport({
        width: 1000,
        height: 800,
        deviceScaleFactor: 1
      })

      await page.goto(LOGIN_URL, { waitUntil: 'networkidle2' })

      await page.type('input[placeholder^="Email"]', user.email)
      await page.type('input[placeholder^="Password"]', user.password)
      await page.click('form [type="submit"]')

      await page.waitForTimeout(15000)

      // Skip through the "Get Started" navigation
      await page.click('[class^="Modal"] [class^="CloseButton"]')
      await page.waitForTimeout(100)
      await page.click('[class^="Modal"] [class^="CloseButton"]')
      await page.waitForTimeout(100)
      await page.click('[class^="Modal"] [class^="CloseButton"]')
      await page.waitForTimeout(100)

      // Run forward. Forever.
      await page.keyboard.down('ArrowUp')

      // await page.screenshot({ path: 'example.png' })
      await page.waitForTimeout(1000000)

      await browser.close()
    })()
  })
}
