import { Hono } from "hono";

import type { Bindings } from "./models/bindings";

import { v2Routes } from "./routes/v2";
import { v1Routes } from "./routes/v1";

const app = new Hono<{ Bindings: Bindings }>();

app.route("/api/v1", v1Routes);
app.route("/api/v2", v2Routes);

app.notFound((c) => {
  return c.json(
    {
      error: "Not found",
      path: c.req.path,
    },
    404,
  );
});

app.onError((err, c) => {
  console.error(err);

  return c.json(
    {
      error: "Internal Server Error",
      message: err.message,
    },
    500,
  );
});

export default app;
