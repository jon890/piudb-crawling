import { Browser, Page } from "puppeteer";
import { loginCheck } from "./login-piu";

export type BestScore = {
  isDouble: boolean;
  isSingle: boolean;
  level: string;
  songName: string;
  score: string;
};

/**
 * 베스트 스코어 가져오기
 * 로그인 된 페이지가 필요하다
 */
export default async function loadBestScore(browser: Browser) {
  await loginCheck(browser);
  const page = await browser.newPage();
  await page.goto("https://www.piugame.com/my_page/my_best_score.php");

  const data = await page.$$eval("ul.my_best_scoreList > li", (lis) =>
    lis.map((it) => {
      const type = it.querySelector("div.tw img"); // single or double
      const isDouble = (type as HTMLImageElement)?.src?.includes("d_text.png");
      const isSingle = (type as HTMLImageElement)?.src?.includes("s_text.png");

      const levelBalls = it.querySelectorAll("div.numw div.imG img");
      const level = Array.from(levelBalls)
        .map((it) => {
          const img = it as HTMLImageElement;
          const src = img?.src;
          const splits = src.split("/");
          const png = splits[splits.length - 1];
          const [ball] = png.split(".");
          const ballSplits = ball.split("_");
          return ballSplits[ballSplits.length - 1];
        })
        .join("");

      const songName = it.querySelector("div.song_name p")?.textContent;
      const score = it.querySelector(
        "div.li_in div.txt_v span.num"
      )?.textContent;

      return { isDouble, isSingle, level, songName, score } as BestScore;
    })
  );

  return data;
}
