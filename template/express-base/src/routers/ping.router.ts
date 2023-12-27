import express from "express";

const ping_router = express.Router();

ping_router.get("/", (_req, res) => {
  res.send("pong");
});

export default ping_router;
