import * as functions from "@google-cloud/functions-framework";
import changeGameId from "./change-gameid";
import { CrawlingException } from "./exception/crawling.exception";
import getRecentlyPlayed from "./get-recently-played";
import loadGameIds from "./load-gameid";
import loginToPIU, { loginCheck } from "./login-piu";
import { isBlank } from "./util";
import { CrawlingResponse } from "./crawling.response";

functions.http("crawling", async (req, res) => {
  const { email, password, nickname } = req.body;

  try {
    if (isBlank(email)) throw new CrawlingException("EMAIL_REQUIRED");
    if (isBlank(password)) throw new CrawlingException("PASSWORD_REQUIRED");

    const browser = await loginToPIU({ email, password });
    await loginCheck(browser);

    if (nickname) {
      await changeGameId(browser, nickname);
      const recentlyPlayed = await getRecentlyPlayed(browser);

      await browser.close();
      res.send({ recentlyPlayed });
      return;
    } else {
      const gameIds = await loadGameIds(browser);

      await browser.close();
      res.send({ gameIds });
    }
  } catch (e) {
    console.log(e);
    if (e instanceof CrawlingException) {
      res
        .status(e.httpStatus)
        .send(CrawlingResponse.error(e.errorCode, e.message));
    } else {
      res
        .status(500)
        .send(CrawlingResponse.error("UNKNOWN", (e as Error).message));
    }
  }
});

function handleCors(req: functions.Request, res: functions.Response) {
  res.set("Access-Control-Allow-Origin", "*");

  if (req.method === "OPTIONS") {
    res.set("Access-Control-Allow-Methods", "GET");
    res.set("Access-Control-Allow-Headers", "Content-Type");
    res.set("Access-Control-Max-Age", "3600");
    res.status(204).send("");
  }
}
