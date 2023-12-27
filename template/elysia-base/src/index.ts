import { Elysia } from "elysia";
import ping_router from "./routers/ping.router";
import { ENV } from "./utils/env";

const app = new Elysia();

app.get("/", (ctx) => {
  return "Hello World!";
});

app.use(ping_router);

app.listen(ENV.PORT, () => {
  console.log("🦊 Elysia is listening on port", ENV.PORT);
});
