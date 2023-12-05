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
});
