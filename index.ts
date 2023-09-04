import * as functions from "@google-cloud/functions-framework";

functions.http("helloHttp", (req, res) => {
  res.send(`Hello ${req.query.name || req.body.name || "World"}!`);
});
