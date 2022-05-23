import type { Browser } from 'playwright';
import { chromium, webkit, firefox } from 'playwright';

export async function testPage(url: string) {
  const browser = await chromium.launch({ headless: true });
  const webki = await webkit.launch({ headless: true });
  const ff = await firefox.launch({ headless: true });

  return await Promise.all([
    run('chromium', browser, url),
    run('webkit', webki, url),
    run('firefox', ff, url),
  ]);
}

/**
 * Need to emit message on test PASS or FAIL. Listening to console.log's does not work well (firefox only runs 1 script)
 */
async function run(name: string, browser: Browser, url: string) {
  const page = await browser.newPage({});

  const errorLogs: string[] = [];
  const goodLogs: string[] = [];

  page.on('console', (message) => {
    if (message.type() === 'error') {
      const is404 = message.text().includes('Failed to load resource');
      if (is404) {
        return;
      }
      errorLogs.push(message.text());
    }
    goodLogs.push(message.text());
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
  console.error('FAIL', errorLogs);
}
