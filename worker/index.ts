import { Hono } from "hono";
import type { Bindings } from "../src/bindings";
import type { Service } from "../src/types";

const services: Service[] = [];

const app = new Hono<{ Bindings: Bindings }>();

app.get("api/health", (c) => {
  return c.json({
    ok: true,
    app: "home-lab",
    stack: ["React", "Vite", "Hono", "Cloudflare Workers"],
  });
});

app.get("/api/services", async (c) => {
  const { results } = await c.env.DB.prepare(
    `
    SELECT
      Services.ID,
      Services.Name,
      Statuses.Description AS Status,
      Services.Description
    FROM Services
    JOIN Statuses ON Services.Status = Statuses.ID
    ORDER BY services.Name ASC
    `,
  ).all();

  return c.json({
    count: results.length,
    services: results,
  });
});

app.get("/api/services/:id", (c) => {
  const id = c.req.param("id");
  const service = services.find((item) => item.id === id);

  if (!service) {
    return c.json(
      {
        error: "Service not found",
        id,
      },
      404,
    );
  }

  return c.json(service);
});

app.post("/api/services", async (c) => {
  const body = await c.req.json();
  console.log("POST /api/services body:", body);

  if (!body.id || !body.name) {
    return c.json(
      {
        error: "Validation failed",
        required: ["id", "name"],
      },
      400,
    );
  }

  const statusRow = await c.env.DB.prepare(
    "SELECT ID FROM Statuses WHERE Description = ?",
  )
    .bind(body.id, body.name, statusRow?.ID, description)
    .first<{ ID: number }>();

  if (!statusRow) {
    return c.json(
      {
        error: "Invalid status",
        allowed: ["Offline", "Online", "Local Network Only", "Disabled"],
      },
      400,
    );
  }

  await c.env.DB.prepare(
    "INSERT INTO Services (ID, Name, Status, Description) VALUES (?, ?, ?, ?)",
  )
    .bind(
      body.ID,
      body.Name,
      statusRow.ID,
      body.Description ?? "No description provided",
    )
    .run();

  return c.json(
    {
      id: body.ID,
      name: body.Name,
      status: body.Status ?? "Local Network Only",
      description: body.Description ?? "No description provided",
    },
    201,
  );
});

app.delete("/api/services/:id", (c) => {
  const id = c.req.param("id");
  const index = services.findIndex((item) => item.id === id);

  if (index === -1) {
    return c.json(
      {
        error: "Service not found",
        id,
      },
      404,
    );
  }

  const deletedService = services.splice(index, 1)[0];

  return c.json({
    deleted: true,
    service: deletedService,
  });
});

app.get("/api/test-error", () => {
  throw new Error("This is a test error");
});

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
