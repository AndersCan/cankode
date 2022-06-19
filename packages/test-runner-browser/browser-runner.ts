import type { Browser } from 'playwright';
/**
 * TODO: These function should also return the test results
 */
export async function testPageInChromium(url: string) {
  const { chromium } = await import('playwright');
  const chromeBrowser = await chromium.launch({ headless: true });
  return run('chromium', chromeBrowser, url);
}

export async function testPageInWebkit(url: string) {
  const { webkit } = await import('playwright');
  const webkitBrowser = await webkit.launch({ headless: true });
  return run('webkit', webkitBrowser, url);
}

export async function testPageInFirefox(url: string) {
  const { firefox } = await import('playwright');
  const firefoxBrowser = await firefox.launch({ headless: true });
  return run('firefox', firefoxBrowser, url);
}

/**
 * Need to emit message on test PASS or FAIL. Listening to console.log's does not work well (firefox only runs 1 script)
 */
async function run(name: string, browser: Browser, url: string) {
  const page = await browser.newPage({});

  const errorLogs: string[] = [];
  const goodLogs: string[] = [];

  page.on('console', (message) => {
    const good = '✅';
    const bad = '❌';

    const text = message.text();
    if (text.includes(good)) {
      goodLogs.push(text);
    } else if (text.includes(bad)) {
      errorLogs.push(text);
    }
  });
  await Promise.all([
    page.goto(url),
    page.waitForNavigation({ waitUntil: 'load' }),
  ]);
  // shrug
  await page.waitForTimeout(2_000);
  await browser.close();

  if (errorLogs.length === 0) {
    console.log(name, browser.version(), 'OK!');
    console.log(`${goodLogs.length} tests passed`);
    return;
  }

  process.exitCode = 1;
  console.log(`
  ${name}${browser.version()}  
    ${errorLogs.map((err) => err.trim())}
  `);
}
