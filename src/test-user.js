const puppeteer = require('puppeteer');
const opts = require('./options');

async function waitForSelectorAndClick(page, selector) {
  await page.waitForSelector(selector);
  await page.click(selector);
}

async function waitForSelectorAndType(page, selector, text) {
  await page.waitForSelector(selector);
  await page.type(selector, text);
}

async function waitForXAndClick(page, expression) {
  await page.waitForXPath(expression);
  const [elem] = await page.$x(expression);
  await elem.click();
}

async function openChat(page) {
  // eslint-disable-next-line no-constant-condition
  while (true) {
    try {
      await waitForSelectorAndClick(page, '[class^=styles__StyledChatButton]');
      break;
    } catch (error) {
      await page.waitForTimeout(500);
    }
  }
}

async function run(user) {
  const browser = await puppeteer.launch({
    headless: opts.headless,
  });

  const page = (await browser.pages())[0];

  await page.setViewport({
    width: 1000,
    height: 800,
    deviceScaleFactor: 1,
  });
  page.setDefaultTimeout(60000);

  try {
    // Login to the site
    await page.goto(opts.url, { waitUntil: 'domcontentloaded' });

    // Disable 3D
    await page.evaluate(() => {
      window.localStorage.setItem('live_debug_1_DISABLED_3D', 'true');
    });

    await waitForSelectorAndClick(page, '[class^=IntroModal__] [class^=CloseButton__]');
    await openChat(page);
    await waitForSelectorAndClick(page, '[class^=RegistrationModal__] button');
    await waitForXAndClick(page, '//button[contains(., "Login")]');

    await waitForSelectorAndType(page, 'input[placeholder^="Email"]', user.email);
    await waitForSelectorAndType(page, 'input[placeholder^="Password"]', user.password);
    await waitForSelectorAndClick(page, 'form [type="submit"]');
    await page.waitForNavigation({ waitUntil: 'domcontentloaded' });
    await page.waitForTimeout(5000);

    await openChat(page);
    await page.waitForTimeout(250);
    await waitForSelectorAndClick(page, '[class^=ChatSelector__StyledChatRoom-]');

    for (let i = 0; i < opts.iterations; i++) {
      await waitForSelectorAndType(page, 'textarea', (new Date()).toUTCString());
      await page.click('#chatInputForm button');
      await page.waitForTimeout(opts.sendEvery);
    }
  } catch (e) {
    await page.screenshot({ path: `errors/${user.firstName}.png` });
    console.error(e);
  } finally {
    await browser.close();
  }
}

module.exports = run;
