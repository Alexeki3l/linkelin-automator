import { chromium } from "playwright";

export const test = async () => {
  try {
    const browser = await chromium.launch({ headless: false });
    const page = await browser.newPage();
    await page.goto("https://www.linkedin.com");

    await page.waitForTimeout(10000);

    await browser.close();
  } catch (error) {
    console.log(error.message);
  }
};
