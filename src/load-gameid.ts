import { Page } from "puppeteer";
import { loginCheck } from "./login-piu";

export type GameId = {
  title: string;
  nickname: string;
};

/**
 * 펌프 잇업 아이디 목록 조회
 * 로그인 이후에 처리해야한다
 */
export default async function loadGameIds(page: Page) {
  await loginCheck(page);

  await page.goto("https://www.piugame.com/my_page/game_id_information.php");

  const data = await page.$$eval(
    "div.subDoc ul.game_id_informationList > li",
    (list) =>
      list.map((it) => {
        const title = it.querySelector("p.t1")?.textContent;
        const nickname = it.querySelector("p.t2")?.textContent;

        return { title, nickname } as GameId;
      })
  );

  return data;
}
