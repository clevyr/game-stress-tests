const puppeteer = require('puppeteer')
const config = require('./config')

const REGISTER_URL = `${process.env.URL}/register`;

(async () => {
  const browser = await puppeteer.launch({
    headless: false,
  })
  const page = await browser.newPage()
  await page.setViewport({
    width: 1000,
    height: 800,
    deviceScaleFactor: 1
  })

  const { users } = config
  const user = users[0];

  await page.goto(REGISTER_URL, { waitUntil: 'networkidle2' })

  await page.type('input[placeholder^="First"]', user.firstName)
  await page.type('input[placeholder^="Last"]', user.lastName)
  await page.type('input[placeholder^="Email"]', user.email)
  await page.type('input[placeholder^="Password"]', user.password)
  await page.type('input[placeholder^="Re-enter"]', user.password)
  await page.type('input[placeholder^="Company"]', user.company)
  await page.type('input[placeholder^="Title"]', user.title)
  await page.click('[class^="Checkbox__StyledCheckbox"]');

  await page.click('form [type="submit"]')

  await page.waitForNavigation({ waitUntil: 'networkidle2' })

  await page.waitForTimeout(5000)
  await page.click('button') // 'I am ready' avatar selection button

  await page.waitForTimeout(12000)

  // Skip through the "Get Started" navigation
  await page.click('[class^="Modal"] [class^="CloseButton"]');
  await page.waitForTimeout(100)
  await page.click('[class^="Modal"] [class^="CloseButton"]');
  await page.waitForTimeout(100)
  await page.click('[class^="Modal"] [class^="CloseButton"]');
  await page.waitForTimeout(100)

  await page.keyboard.down('ArrowUp');

  await page.waitForTimeout(1000000)

  await page.screenshot({ path: 'example.png' })

  await browser.close()
})()
