import { Browser, Page } from "puppeteer";
import { getPageWithNotImage } from "./puppeteer/ready-browser";

export type GameId = {
  title: string;
  nickname: string;
  latestLoginDate: string;
  latestGameCenter: string;
};

/**
 * 펌프 잇업 계정 전환
 * 로그인 이후에 처리해야한다
 */
export default async function changeGameId(browser: Browser, nickname: string) {
  const page = await getPageWithNotImage(browser);
  await page.goto("https://www.piugame.com/my_page/play_data.php", {
    waitUntil: "domcontentloaded",
  });
  // 한국어로 변경
  await page.click("a.langBtn[data-lang='kr']");

  const current = await getCurrentNickname(page);
  if (current === nickname) {
    await page.close();
    return;
  }

  let retryCount = 3;
  for (let i = 0; i < retryCount; i++) {
    await _changeGameId(page, nickname);

    const current = await getCurrentNickname(page);
    if (current === nickname) {
      await page.close();
      break;
    }
  }
}

async function _changeGameId(page: Page, nickname: string) {
  await page.click("a[href='#profile_modal']");

  const profiles = await page.$$eval(
    "div#profile_modal ul.game_id_informationList > li",
    (list) =>
      list.map((li) => {
        const inputElement = li.querySelector(
          "input[type='radio'][name='sub_profile']"
        );
        const nickname = li.querySelector(
          "div.profile_name div.name_w p.t2.en"
        )?.textContent;

        return {
          value: (inputElement as HTMLInputElement)?.value,
          nickname,
        };
      })
  );

  const exist = profiles.find((it) => it.nickname === nickname);
  if (!exist) {
    throw Error(
      `ChangeGameIdError: 닉네임이 일치하는지 다시 확인해주세요, ${nickname}`
    );
  }

  await Promise.all([
    page.waitForNavigation({
      timeout: 5000,
      waitUntil: "load",
    }),
    page.click(
      `input[type='radio'][name='sub_profile'][value='${exist.value}']`
    ),
  ]);
}

async function getCurrentNickname(page: Page) {
  return await page.$eval(`div.in_profile p.t2`, (el) => {
    return el.textContent;
  });
}
