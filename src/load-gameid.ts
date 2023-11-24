import { Browser } from "puppeteer";
import { loginCheck } from "./login-piu";

export type GameId = {
  title: string;
  nickname: string;
  latestLoginDate: string;
  latestGameCenter: string;
};

/**
 * 펌프 잇업 아이디 목록 조회
 * 로그인 이후에 처리해야한다
 */
export default async function loadGameIds(browser: Browser) {
  await loginCheck(browser);

  const page = await browser.newPage();
  await page.goto("https://www.piugame.com/my_page/game_id_information.php");

  const data = await page.$$eval(
    "div.subDoc ul.game_id_informationList > li",
    (list) =>
      list.map((it) => {
        const title = it.querySelector("p.t1")?.textContent ?? "";
        const nickname = it.querySelector("p.t2")?.textContent ?? "";

        // ex: 최근 접속일 : 2023-10-02 17:57:29
        const latestLoginDate =
          it.querySelector(
            "div.profile_name div.time_w ul.list li:first-child i.tt"
          )?.textContent ?? "";

        // ex: 최근 접속 게임장 : 모란 스트레스자판기
        const latestGameCenter =
          it.querySelector(
            "div.profile_name div.time_w ul.list li:nth-child(2) i.tt"
          )?.textContent ?? "";

        return {
          title,
          nickname,
          latestLoginDate: latestLoginDate.substring(
            latestLoginDate.indexOf(":") ? latestLoginDate.indexOf(":") + 2 : 0
          ),
          latestGameCenter: latestGameCenter.substring(
            latestGameCenter.indexOf(":")
              ? latestGameCenter.indexOf(":") + 2
              : 0
          ),
        } as GameId;
      })
  );

  return data;
}
