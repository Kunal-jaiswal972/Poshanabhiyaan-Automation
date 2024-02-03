import puppeteer from "puppeteer";
import dotenv from "dotenv";
import { delay } from "./lib/delay.js";
import { getRandomNumber } from "./lib/random.js";
dotenv.config();

async function login(username, password) {
  const browser = await puppeteer.launch({
    headless: false,
    // userDataDir: "./user-data",
    defaultViewport: null,
    // product: "firefox",
    dumpio: true,
  });
  const page = await browser.newPage();
  await page.goto("https://poshanabhiyaan.gov.in/login");
  await delay(3000);

  await page.type('input[name="username"]', username);
  await page.type('input[name="password"]', password);
  await page.waitForSelector('button[type="submit"]', { visible: true });
  await page.click('button[type="submit"]');

  await page.waitForNavigation({ waitUntil: "networkidle2" });

  // theme --------------------------------
  const selectElem1 = await page.waitForSelector('select[name="SelectTheme"]', {
    visible: true,
  });
  await delay(1000);
  const themeContent = await page.evaluate(() => {
    const options = Array.from(
      document.querySelectorAll('select[name="SelectTheme"] option')
    );
    return options.map((option) => option.getAttribute("value"));
  });
  const randomIndex = getRandomNumber(1, themeContent.length - 1);
  await selectElem1.focus();
  await delay(100);
  await selectElem1.select(themeContent[randomIndex]);

  //level - awc ----------------------------------------------------------------
  await delay(1000);
  const selectElem2 = await page.waitForSelector('select[name="SelectLevel"]', {
    visible: true,
  });
  await selectElem2.focus();
  await delay(100);
  await selectElem2.select("5");

  //awc_center ----------------------------------------------------------------
  await delay(1000);
  const selectElem3 = await page.waitForSelector('select[name="awc_center"]', {
    visible: true,
  });
  await selectElem3.focus();
  await delay(100);
  await selectElem3.select("358407");

  //activity ----------------------------------------------------------------
  await delay(1000);
  const selectElem4 = await page.waitForSelector(
    'select[name="SelectActivity"]',
    {
      visible: true,
    }
  );
  await delay(1000);
  const activityContent = await page.evaluate(() => {
    const options = Array.from(
      document.querySelectorAll('select[name="SelectActivity"] option')
    );
    return options.map((option) => option.getAttribute("value"));
  });
  const randomIndex2 = getRandomNumber(1, activityContent.length - 1);
  await selectElem4.focus();
  await delay(100);
  await selectElem4.select(activityContent[randomIndex2]);

  //date pickers ---------------------------------
  try {
    const dateInput = await page.waitForSelector(
      "input[name='SelectDateFrom']",
      {
        visible: true,
      }
    );

    await delay(300);
    await dateInput.evaluate((input) => {
      input.setAttribute("value", "2023-10-30");
      input.value = "2023-10-30";
    }, dateInput);
    await delay(300);
  } catch (error) {
    console.log("fuck");
  }

  try {
    const dateInput = await page.waitForSelector("input[name='SelectDateTo']", {
      visible: true,
    });

    await delay(300);
    await dateInput.evaluate((input) => {
      input.removeAttribute("disabled");
      input.setAttribute("value", "2023-10-30");
      input.value = "2023-10-30";
    }, dateInput);
    await delay(300);
  } catch (error) {
    console.log("fuck2");
  }

  //inputs ----------------------------------------------------------------
  await delay(200);
  await page.type(
    'input[name="CountAdultMale"]',
    getRandomNumber(5, 15).toString()
  );

  await delay(200);
  await page.type(
    'input[name="CountAdultFemale"]',
    getRandomNumber(5, 15).toString()
  );

  await delay(200);
  await page.type(
    'input[name="CountChildMale"]',
    getRandomNumber(5, 15).toString()
  );

  await delay(200);
  await page.type(
    'input[name="CountChildFemale"]',
    getRandomNumber(5, 15).toString()
  );

  const submitBtn = await page.waitForSelector("button[type='submit']");
  await delay(400);
  try {
    await submitBtn.click();
  } catch (error) {
    console.log("fuckkkk");
  }
}

(async () => {
  const username = process.env.CRED;
  const password = process.env.CRED;

  await login(username, password);
})();
