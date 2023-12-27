import express from "express";

import ping_router from "./routers/ping.router.js";
import { ENV } from "./utils/env.js";
import { logger } from "./utils/logger.js";

const app = express();
app.use(express.json());

app.get("/", (req, res) => {
  res.send("Hello World!");
});

app.use("/ping", ping_router);

app.listen(ENV.PORT, () => {
  logger.info(`Server started on port ${ENV.PORT}`);
});
