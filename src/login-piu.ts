import puppeteer, { Browser } from "puppeteer";
import { sleep } from "./util";
import { CrawlingException } from "./exception/crawling.exception";

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
    // 가상 브라우저 실행
    // headless: false,
    args: ["--no-sandbox"],
  });

  const page = await browser.newPage();
  await page.goto("https://www.piugame.com/login.php");

  // todo 해당 흐름 제어 가능?
  // page.on("dialog", async (dialog) => {
  //   const notRegister = "가입된 이메일이 아닙니다";
  //   const notMatchPassword = "비밀번호가 잘못되었습니다";

  //   if (dialog.message().includes(notRegister)) {
  //     throw new CrawlingException("NOT_REGISTER_USER");
  //   } else if (dialog.message().includes(notMatchPassword)) {
  //     throw new CrawlingException("NOT_MATCH_PASSWORD");
  //   }
  // });

  await page.type("input[name='mb_id']", params.email);
  await page.type("input[name='mb_password']", params.password);
  await page.click("form#login_fs button[type='submit']");

  await sleep(200);
  await page.close();
  return browser;
}

export async function checkLoginState(browser: Browser) {
  const page = await browser.newPage();
  await page.goto("https://www.piugame.com");

  const btnLink =
    (await page.$eval("div.login_wrap a.loginBtn", (el) => el.href)) ?? "";

  if (!btnLink.includes("logout")) {
    throw new CrawlingException("LOGIN_FAILED");
  }

  await page.close();
}
