import { Elysia } from "elysia";

const ping_router = new Elysia({ prefix: "ping" });

ping_router.get("/", (ctx) => {
  return "pong";
});

export default ping_router;
