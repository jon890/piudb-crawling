import puppeteer, { Browser } from "puppeteer";
import { sleep } from "./util";

export type LoginParams = {
  email: string;
  password: string;
};

/**
 * 펌프 잇업에 로그인
 * @param params
 */
export default async function loginToPIU(params: LoginParams) {
  const browser = await puppeteer.launch({
    headless: "new",
    // headless: false,
    args: ["--no-sandbox"],
  });

  const page = await browser.newPage();
  await page.goto("https://www.piugame.com/login.php");

  const idElement = await page.waitForSelector("input[name='mb_id']");
  const passwordElement = await page.waitForSelector(
    "input[name='mb_password']"
  );
  const loginBtnElement = await page.waitForSelector(
    "form#login_fs button[type='submit']"
  );

  if (!idElement || !passwordElement || !loginBtnElement) {
    throw Error("LoginError: input elements not found");
  }

  await idElement.type(params.email);
  await passwordElement.type(params.password);
  await loginBtnElement.click();

  await sleep(200);
  await page.close();
  return browser;
}

/**
 * 로그인 상태를 체크한다
 *
 * @param browser
 */
export async function loginCheck(browser: Browser) {
  try {
    const page = await browser.newPage();
    await page.goto("https://www.piugame.com");

    const btnLink =
      (await page.$eval("div.login_wrap a.loginBtn", (el) => el.href)) ?? "";

    if (!btnLink.includes("logout")) {
      console.log("LoginFailed with btnLink", btnLink);
      throw Error("Login Failed");
    }

    await page.close();
  } catch (e) {
    console.error(e);
    throw Error("Login Failed");
  }
}
