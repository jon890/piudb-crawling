import * as functions from "@google-cloud/functions-framework";
import changeGameId from "./change-gameid";
import loadGameIds from "./load-gameid";
import loginToPIU, { loginCheck } from "./login-piu";
import { isBlank } from "./util";
import loadBestScore from "./load-best-score";

// functions.http("helloHttp", (req, res) => {
//   res.send(`Hello ${req.query.name || req.body.name || "World"}!`);
// });

functions.http("crawling", async (req, res) => {
  const { email, password, nickname } = req.body;

  if (isBlank(email)) {
    res.status(200).send("email is required");
    return;
  }

  if (isBlank(password)) {
    res.status(200).send("password is required");
    return;
  }

  const browser = await loginToPIU({ email, password });
  await loginCheck(browser);
  const gameIds = await loadGameIds(browser);

  if (nickname) {
    await changeGameId(browser, nickname);
    const bestScore = await loadBestScore(browser);

    await browser.close();
    res.send({ gameIds, bestScore });
    return;
  } else {
    await browser.close();
    res.send({ gameIds });
  }
});
