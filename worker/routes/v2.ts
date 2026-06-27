import { Hono } from "hono";

import type { Bindings } from "../models/bindings";
import { getDashboard } from "../services/dashboardService";

export const v2Routes = new Hono<{ Bindings: Bindings }>();

v2Routes.get("/dashboard", async (c) => {
  const dashboard = await getDashboard(c.env.DB);
  return c.json(dashboard);
});
