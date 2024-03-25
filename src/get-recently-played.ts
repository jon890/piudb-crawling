import { Browser, Page } from "puppeteer";
import { getPageWithNotImage } from "./puppeteer/ready-browser";
import { sleep } from "./util";

export type Type = "SINGLE" | "DOUBLE" | "Unknown";

export type Grade =
  | "SSS_PLUS"
  | "SSS"
  | "SS_PLUS"
  | "SS"
  | "S_PLUS"
  | "S"
  | "AAA_PLUS"
  | "AAA"
  | "AA_PLUS"
  | "AA"
  | "A_PLUS"
  | "A"
  | "B"
  | "C"
  | "D"
  | "F";

export type Plate =
  | "ROUGH_GAME"
  | "FAIR_GAME"
  | "TALENTED_GAME"
  | "MARVELOUS_GAME"
  | "SUPERB_GAME"
  | "EXTREME_GAME"
  | "ULTIMATE_GAME"
  | "PERFECT_GAME"
  | null;

export type RecentlyPlayed = {
  type: Type;
  level: string;
  grade: Grade;
  plate: Plate;
  isBreakOff: boolean;
  songName: string;
  score: number;
  perfect: number;
  great: number;
  good: number;
  bad: number;
  miss: number;
  playedTime: string;
};

/**
 * 최근 플레이 기록 가져오기
 * 로그인 된 페이지가 필요하다
 */
export default async function getRecentlyPlayed(browser: Browser) {
  const URL = "https://www.piugame.com/my_page/recently_played.php";
  const page = await getPageWithNotImage(browser);
  await page.goto(URL);

  await sleep(100); // 페이지 로드를 기다린다

  const noContents = await page.$("div.no_con");
  if (noContents) {
    return [];
  }

  return getRecentlyPlayedPage(page);
}

async function getRecentlyPlayedPage(page: Page) {
  const data: RecentlyPlayed[] = await page.$$eval(
    "ul.recently_playeList > li",
    (list) =>
      list
        .map((it) => {
          // Single or Double
          const typeEl = it.querySelector("div.tw img"); // single or double
          const typeSrc = (typeEl as HTMLImageElement)?.src ?? "";

          let type: Type;
          if (typeSrc.includes("s_text.png")) {
            type = "SINGLE";
          } else if (typeSrc.includes("d_text.png")) {
            type = "DOUBLE";
          } else {
            type = "Unknown";
          }

          // Level
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

          // Grade
          const gradeSrc =
            (it.querySelector("div.li_in.ac img") as HTMLImageElement)?.src ??
            "";
          let gradeFileName = gradeSrc.substring(gradeSrc.lastIndexOf("/") + 1); // aa.png
          console.log("1", gradeFileName);

          const isBreakOff = gradeFileName.startsWith("x_");
          if (isBreakOff) {
            gradeFileName = gradeFileName.substring(2); // x_ 제거
          }

          gradeFileName = gradeFileName.substring(
            0,
            gradeFileName.lastIndexOf(".")
          ); // .png 제거

          const plus = gradeFileName.endsWith("_p");
          if (plus) {
            gradeFileName = gradeFileName.substring(
              0,
              gradeFileName.lastIndexOf("_")
            );
          }
          const grade = gradeFileName.toUpperCase() + (plus ? "_PLUS" : "");

          // Plate
          const plateSrc =
            (it.querySelector("div.li_in.st1 img") as HTMLImageElement)?.src ??
            "";
          let plate: Plate = null;
          if (plateSrc.includes("rg.png")) {
            plate = "ROUGH_GAME";
          } else if (plateSrc.includes("fg.png")) {
            plate = "FAIR_GAME";
          } else if (plateSrc.includes("tg.png")) {
            plate = "TALENTED_GAME";
          } else if (plateSrc.includes("mg.png")) {
            plate = "MARVELOUS_GAME";
          } else if (plateSrc.includes("sg.png")) {
            plate = "SUPERB_GAME";
          } else if (plateSrc.includes("eg.png")) {
            plate = "EXTREME_GAME";
          } else if (plateSrc.includes("ug.png")) {
            plate = "ULTIMATE_GAME";
          } else if (plateSrc.includes("pg.png")) {
            plate = "PERFECT_GAME";
          }

          const songName =
            it.querySelector("div.song_name p")?.textContent ?? "";
          const score =
            it.querySelector("div.li_in.ac i.tx")?.textContent ?? "";
          const playedTime =
            it.querySelector("p.recently_date_tt")?.textContent ?? "";

          // Judge
          const judgeTable = it.querySelector(
            "table.board_st.ac.recently_play"
          );
          const perfect =
            judgeTable?.querySelector("td[data-th='PERFECT'] div.tx")
              ?.textContent ?? "0";
          const great =
            judgeTable?.querySelector("td[data-th='GREAT'] div.tx")
              ?.textContent ?? "0";
          const good =
            judgeTable?.querySelector("td[data-th='GOOD'] div.tx")
              ?.textContent ?? "0";
          const bad =
            judgeTable?.querySelector("td[data-th='BAD'] div.tx")
              ?.textContent ?? "0";
          const miss =
            judgeTable?.querySelector("td[data-th='MISS'] div.tx")
              ?.textContent ?? "0";

          return {
            type,
            level,
            songName,
            grade: grade as Grade,
            plate,
            isBreakOff,
            score: score !== "" ? Number(score.replaceAll(",", "")) : 0,
            perfect: Number(perfect.replaceAll(",", "")),
            great: Number(great.replaceAll(",", "")),
            good: Number(good.replaceAll(",", "")),
            bad: Number(bad.replaceAll(",", "")),
            miss: Number(miss.replaceAll(",", "")),
            playedTime,
          };
        })
        .filter((it) => Boolean(it.score)) // stage break 무시
    // .filter((it) => it.plate != null) // break off 무시
  );
  return data;
}
