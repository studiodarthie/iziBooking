const puppeteer = require('puppeteer');
const fs = require('fs');

(async () => {
  const browser = await puppeteer.launch();
  const page = await browser.newPage();
  
  page.on('console', msg => console.log('PAGE LOG:', msg.text()));
  page.on('pageerror', error => console.log('PAGE ERROR:', error.message));
  
  try {
    console.log("Navigating to calendar...");
    await page.goto('http://localhost:3000/dashboard/calendar', { waitUntil: 'networkidle2' });
    await page.screenshot({ path: 'calendar.png' });
    console.log("Done.");
  } catch (error) {
    console.error(error);
  } finally {
    await browser.close();
  }
})();
