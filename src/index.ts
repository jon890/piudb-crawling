import * as functions from "@google-cloud/functions-framework";
import loadGameIds from "./load-gameid";
import loginToPIU from "./login-piu";
import { isBlank } from "./util";
import loadBestScore from "./load-best-score";

// functions.http("helloHttp", (req, res) => {
//   res.send(`Hello ${req.query.name || req.body.name || "World"}!`);
// });

functions.http("crawling", async (req, res) => {
  const { email, password } = req.body;

  if (isBlank(email)) {
    res.status(200).send("email is required");
    return;
  }

  if (isBlank(password)) {
    res.status(200).send("password is required");
    return;
  }

  const logginSessionPage = await loginToPIU({ email, password });
  const gameIds = await loadGameIds(logginSessionPage);
  const bestScore = await loadBestScore(logginSessionPage);

  logginSessionPage.close();
  logginSessionPage.browser().close();

  res.send({ gameIds, bestScore });
});
