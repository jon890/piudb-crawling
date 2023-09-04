import puppeteer, { Page } from "puppeteer";

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
    headless: true,
    args: ["--no-sandbox"],
  });

  const page = await browser.newPage();
  await page.goto("https://www.piugame.com/");

  const idElement = await page.waitForSelector("input[name='mb_id']");
  const passwordElement = await page.waitForSelector(
    "input[name='mb_password']"
  );
  const loginBtnElement = await page.waitForSelector("button.btn.st1");

  await idElement?.type(params.email);
  await passwordElement?.type(params.password);
  await loginBtnElement?.click();

  return page;
}

export async function loginCheck(page: Page) {
  try {
    const loginCheck = await page.waitForSelector("div.login_wrap a.loginBtn", {
      timeout: 3000,
    });
    const btnText = await loginCheck?.$eval("i.tt", (el) => el.textContent);
    if (btnText !== "로그아웃") {
      throw Error("Login Failed");
    }
  } catch (e) {
    console.error(e);
    throw Error("Login Failed");
  }
}
