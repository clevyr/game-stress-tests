const puppeteer = require('puppeteer')
const { Command } = require('commander')

const config = require('../../config')

const { users } = config
const program = new Command()

program
  .requiredOption('-u, --url <url>', 'Url to use for testing')
  .option('-l, --limit <limit>', 'Max number of users for stress testing', 10)
  .option('-o, --offset <offset>', 'Use users after nth offset', 0)

program.parse(process.argv)

const startUser = parseInt(program.offset, 10)
const endUser = startUser + parseInt(program.limit)
const url = `${process.url}/register`

console.log(`Starting at user ${startUser}`)
console.log(`Creating ${program.limit} users`)

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

    // Register the users
    await page.goto(url, { waitUntil: 'networkidle2' })

    await page.type('input[placeholder^="First"]', user.firstName)
    await page.type('input[placeholder^="Last"]', user.lastName)
    await page.type('input[placeholder^="Email"]', user.email)
    await page.type('input[placeholder^="Password"]', user.password)
    await page.type('input[placeholder^="Re-enter"]', user.password)
    await page.type('input[placeholder^="Company"]', user.company)
    await page.type('input[placeholder^="Title"]', user.title)
    await page.click('[class^="Checkbox__StyledCheckbox"]')

    await page.click('form [type="submit"]')
    console.log('Submitted form')

    // Wait for the registration logic to run

    await page.waitForNavigation({ waitUntil: 'networkidle2' })

    await page.waitForTimeout(10000)
    await page.click('button') // 'I am ready' avatar selection button

    console.log('Clicked I Am Ready')

    // Let any extra requests finish up
    await page.waitForTimeout(3000)

    await browser.close()
  })()
})
