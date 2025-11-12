/// <reference path="./deno.d.ts" />

import { Hono } from "npm:hono@4.10.5";
import { cors } from "npm:hono@4.10.5/cors";
import { logger } from "npm:hono@4.10.5/logger";
// KV store utilities available if needed
// import * as kv from "./kv_store.ts";

const app = new Hono();

// Enable logger
app.use("*", logger());

// Enable CORS for all routes and methods
app.use(
  "/*",
  cors({
    origin: "*",
    allowHeaders: ["Content-Type", "Authorization"],
    allowMethods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
    exposeHeaders: ["Content-Length"],
    maxAge: 600,
  }),
);

// Health check endpoint
app.get("/health", (c) => {
  return c.json({ status: "ok" });
});

Deno.serve(app.fetch);

