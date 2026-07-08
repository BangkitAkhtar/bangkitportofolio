const { chromium } = require('playwright');
const { exec } = require('child_process');

(async () => {
  console.log("Starting dev server...");
  const server = exec('npm run dev', { cwd: 'c:\\laragon\\www\\bangkitportofolio-main' });
  
  await new Promise(r => setTimeout(r, 3000)); // wait for server to start

  const browser = await chromium.launch();
  const page = await browser.newPage();
  
  page.on('console', msg => console.log('BROWSER CONSOLE:', msg.type(), msg.text()));
  page.on('pageerror', err => console.log('BROWSER ERROR:', err.message, err.stack));

  console.log("Navigating to localhost...");
  await page.goto('http://localhost:5173', { waitUntil: 'networkidle' });

  await browser.close();
  server.kill();
})();
