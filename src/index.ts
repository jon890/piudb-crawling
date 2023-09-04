import * as functions from "@google-cloud/functions-framework";
import { isBlank } from "./util";

// functions.http("helloHttp", (req, res) => {
//   res.send(`Hello ${req.query.name || req.body.name || "World"}!`);
// });

functions.http("crawling", (req, res) => {
  const { email, password } = req.body;

  console.log(req.body);

  if (isBlank(email)) {
    res.status(400).send("email is required");
    return;
  }

  if (isBlank(password)) {
    res.status(400).send("password is required");
    return;
  }

  res.send(`Your emails is ${email}`);
});
