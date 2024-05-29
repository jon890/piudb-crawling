import { Browser } from "puppeteer";
import { CrawlingException } from "./exception/crawling.exception";
import { getBrowser, getPageWithNotImage } from "./puppeteer/ready-browser";
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
  const browser = await getBrowser();
  const page = await getPageWithNotImage(browser);
  await page.goto("https://www.piugame.com/login.php");

  await page.type("input[name='mb_id']", params.email);
  await page.type("input[name='mb_password']", params.password);
  await page.click("form#login_fs button[type='submit']");

  await sleep(200);
  await page.close();
  return browser;
}

export async function checkLoginState(browser: Browser) {
  const page = await getPageWithNotImage(browser);
  await page.goto("https://www.piugame.com");

  const btnLink =
    (await page.$eval("div.login_wrap a.loginBtn", (el) => el.href)) ?? "";

  if (!btnLink.includes("logout")) {
    throw new CrawlingException(
      "LOGIN_FAILED",
      "아이디 혹은 비밀번호가 일치하지 않습니다"
    );
  }

  await page.close();
}
