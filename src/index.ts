import * as functions from "@google-cloud/functions-framework";
import changeGameId from "./change-gameid";
import getRecentlyPlayed from "./get-recently-played";
import loadGameIds from "./load-gameid";
import loginToPIU, { loginCheck } from "./login-piu";
import { isBlank } from "./util";

// functions.http("helloHttp", (req, res) => {
//   res.send(`Hello ${req.query.name || req.body.name || "World"}!`);
// });

functions.http("crawling", async (req, res) => {
  const { email, password, nickname } = req.body;
  // console.log("Request!!!", req.headers, req.body, email, password, nickname);

  handleCors(req, res);

  if (isBlank(email)) {
    res.status(400).send({ error: "email is required" });
    return;
  }

  if (isBlank(password)) {
    res.status(400).send({ error: "password is required" });
    return;
  }

  try {
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
    res.status(400).send({ error: (e as Error)?.message ?? "Unknown Error" });
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
