import { Hono } from "hono";

import type { Bindings } from "../models/bindings";
import type { ServiceBody } from "../models/service";
import { serviceSelectSql } from "../sql/services";

export const v1Routes = new Hono<{ Bindings: Bindings }>();

v1Routes.get("/health", async (c) => {
  const serviceCountRow = await c.env.DB.prepare(
    "SELECT COUNT(*) AS count FROM Services",
  ).first<{ count: number }>();

  const { results: statuses } = await c.env.DB.prepare(
    `
      SELECT
        Statuses.Description AS status,
        COUNT(Services.ID) AS count
      FROM Statuses
      LEFT JOIN Services ON Services.Status = Statuses.ID
      GROUP BY Statuses.ID, Statuses.Description
      ORDER BY Statuses.ID
    `,
  ).all<{ status: string; count: number }>();

  return c.json({
    ok: true,
    app: "home-lab",
    stack: ["Cloudflare Workers", "D1", "Hono", "React", "Vite"],
    serviceCount: serviceCountRow?.count ?? 0,
    statuses,
  });
});

v1Routes.get("/services", async (c) => {
  const { results } = await c.env.DB.prepare(
    `${serviceSelectSql} ORDER BY Services.Name ASC`,
  ).all();

  return c.json({
    count: results.length,
    services: results,
  });
});

v1Routes.get("/services/:id", async (c) => {
  const id = c.req.param("id");

  const service = await c.env.DB.prepare(
    `${serviceSelectSql} WHERE Services.ID = ?`,
  )
    .bind(id)
    .first();

  if (!service) {
    return c.json({ error: "Service not found", id }, 404);
  }

  return c.json(service);
});

v1Routes.post("/services", async (c) => {
  const body = await c.req.json<ServiceBody>();

  if (!body.id || !body.name) {
    return c.json(
      {
        error: "Validation failed",
        required: ["id", "name"],
      },
      400,
    );
  }

  const status = body.status ?? "Local Network Only";
  const description = body.description ?? "";

  const statusRow = await c.env.DB.prepare(
    "SELECT ID AS id FROM Statuses WHERE Description = ?",
  )
    .bind(status)
    .first<{ id: number }>();

  if (!statusRow) {
    return c.json(
      {
        error: "Invalid status",
        received: status,
        allowed: ["Offline", "Online", "Local Network Only", "Disabled"],
      },
      400,
    );
  }

  const existingService = await c.env.DB.prepare(
    "SELECT ID AS id FROM Services WHERE ID = ?",
  )
    .bind(body.id)
    .first<{ id: string }>();

  if (existingService) {
    return c.json(
      {
        error: "Service already exists",
        id: body.id,
      },
      409,
    );
  }

  await c.env.DB.prepare(
    `
        INSERT INTO Services (ID, Name, Status, Description)
        VALUES (?, ?, ?, ?)
      `,
  )
    .bind(body.id, body.name, statusRow.id, description)
    .run();

  return c.json(
    {
      id: body.id,
      name: body.name,
      status,
      description,
    },
    201,
  );
});

v1Routes.put("/services/:id", async (c) => {
  const id = c.req.param("id");
  const body = await c.req.json<ServiceBody>();

  if (!body.name) {
    return c.json(
      {
        error: "Validation failed",
        required: ["name"],
      },
      400,
    );
  }

  const status = body.status ?? "Local Network Only";
  const description = body.description ?? "";

  const statusRow = await c.env.DB.prepare(
    "SELECT ID AS id FROM Statuses WHERE Description = ?",
  )
    .bind(status)
    .first<{ id: number }>();

  if (!statusRow) {
    return c.json(
      {
        error: "Invalid status",
        received: status,
        allowed: ["Offline", "Online", "Local Network Only", "Disabled"],
      },
      400,
    );
  }

  const existingService = await c.env.DB.prepare(
    "SELECT ID AS id FROM Services WHERE ID = ?",
  )
    .bind(id)
    .first<{ id: string }>();

  if (!existingService) {
    return c.json({ error: "Service not found", id }, 404);
  }

  await c.env.DB.prepare(
    `
        UPDATE Services
        SET
          Name = ?,
          Status = ?,
          Description = ?,
          UpdatedAt = CURRENT_TIMESTAMP
        WHERE ID = ?
      `,
  )
    .bind(body.name, statusRow.id, description, id)
    .run();

  const updatedService = await c.env.DB.prepare(
    `${serviceSelectSql} WHERE Services.ID = ?`,
  )
    .bind(id)
    .first();

  return c.json(updatedService);
});

v1Routes.delete("/services/:id", async (c) => {
  const id = c.req.param("id");

  const existingService = await c.env.DB.prepare(
    `${serviceSelectSql} WHERE Services.ID = ?`,
  )
    .bind(id)
    .first();

  if (!existingService) {
    return c.json({ error: "Service not found", id }, 404);
  }

  await c.env.DB.prepare("DELETE FROM Services WHERE ID = ?").bind(id).run();

  return c.json({
    deleted: true,
    service: existingService,
  });
});

v1Routes.get("/test-error", () => {
  throw new Error("This is a test error");
});
