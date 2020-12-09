const puppeteer = require('puppeteer')
const config = require('./config')

const { users } = config
const LOGIN_URL = 'https://dev.onelambda.clevyr.on-livi.com/join'

users.forEach((user) => {
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

    await page.waitForTimeout(12000)

    // Skip through the "Get Started" navigation
    await page.click('[class^="Modal"] [class^="CloseButton"]')
    await page.waitForTimeout(100)
    await page.click('[class^="Modal"] [class^="CloseButton"]')
    await page.waitForTimeout(100)
    await page.click('[class^="Modal"] [class^="CloseButton"]')
    await page.waitForTimeout(100)

    await page.keyboard.down('ArrowUp')

    await page.waitForTimeout(1000000)

    // await page.screenshot({ path: 'example.png' })
    await page.waitForTimeout(1000000)

    await browser.close()
  })()
})
