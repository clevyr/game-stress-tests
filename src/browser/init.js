const puppeteer = require('puppeteer')
const config = require('../../config')

const { users } = config
const REGISTER_URL = 'https://dev.onelambda.clevyr.on-livi.com/register'

users.forEach((user) => {
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

    // Register the users
    await page.goto(REGISTER_URL, { waitUntil: 'networkidle2' })

    await page.type('input[placeholder^="First"]', user.firstName)
    await page.type('input[placeholder^="Last"]', user.lastName)
    await page.type('input[placeholder^="Email"]', user.email)
    await page.type('input[placeholder^="Password"]', user.password)
    await page.type('input[placeholder^="Re-enter"]', user.password)
    await page.type('input[placeholder^="Company"]', user.company)
    await page.type('input[placeholder^="Title"]', user.title)
    await page.click('[class^="Checkbox__StyledCheckbox"]')

    await page.click('form [type="submit"]')
    console.log('Submitted form');

    // Wait for the registration logic to run

    await page.waitForNavigation({ waitUntil: 'networkidle2' })

    await page.waitForTimeout(10000)
    await page.click('button') // 'I am ready' avatar selection button

    console.log('Clicked I Am Ready');

    // Let any extra requests finish up
    await page.waitForTimeout(5000)

    await browser.close()
  })()
})
