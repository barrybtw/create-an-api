import express from "express";

import ping_router from "./routers/ping.router.js";
import { ENV } from "./utils/env.js";
import { logger } from "./utils/logger.js";

const app = express();
app.use(express.json());

app.use(ping_router);

app.listen(ENV.PORT, () => {
  logger.info(`Server started on port ${ENV.PORT}`);
});
