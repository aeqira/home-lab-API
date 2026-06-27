import { Hono } from "hono";
import type { Bindings } from "../src/bindings";

type ServiceBody = {
  id?: string;
  name?: string;
  status?: string;
  description?: string;
};

type ServiceStatus = "Online" | "Offline" | "Local Network Only" | "Disabled";

type DashboardService = {
  id: string;
  name: string;
  status: ServiceStatus;
  description: string;
  createdAt: string;
  updatedAt: string;
};

type DashboardState = "healthy" | "warning" | "critical";

const app = new Hono<{ Bindings: Bindings }>();

const serviceSelectSql = `
  SELECT
    Services.ID AS id,
    Services.Name AS name,
    Statuses.Description AS status,
    Services.Description AS description,
    Services.CreatedAt AS createdAt,
    Services.UpdatedAt AS updatedAt
  FROM Services
  JOIN Statuses ON Services.Status = Statuses.ID
`;

function getDashboardState(counts: {
  serviceCount: number;
  offlineCount: number;
  disabledCount: number;
}): DashboardState {
  if (counts.serviceCount === 0) {
    return "warning";
  }

  if (counts.offlineCount === counts.serviceCount) {
    return "critical";
  }

  if (counts.offlineCount > 0 || counts.disabledCount > 0) {
    return "warning";
  }

  return "healthy";
}

app.get("/api/v1/health", async (c) => {
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

app.get("/api/v2/dashboard", async (c) => {
  const generatedAt = new Date().toISOString();

  const { results: services } = await c.env.DB.prepare(
    `${serviceSelectSql} ORDER BY Services.Name ASC`,
  ).all<DashboardService>();

  const remoteCount = services.filter(
    (service) => service.status === "Online",
  ).length;

  const localOnlyCount = services.filter(
    (service) => service.status === "Local Network Only",
  ).length;

  const healthyCount = remoteCount + localOnlyCount;

  const offlineCount = services.filter(
    (service) => service.status === "Offline",
  ).length;

  const disabledCount = services.filter(
    (service) => service.status === "Disabled",
  ).length;

  const serviceCount = services.length;
  const state = getDashboardState({
    serviceCount,
    offlineCount,
    disabledCount,
  });

  return c.json({
    apiVersion: "2",
    generatedAt,
    summary: {
      state,
      counts: {
        total: serviceCount,
        healthy: healthyCount,
        remote: remoteCount,
        localOnly: localOnlyCount,
        offline: offlineCount,
        disabled: disabledCount,
      },
      lastUpdated: generatedAt,
    },
    services,
    metadata: {
      app: "home-lab",
      environment: "development",
      database: "connected",
    },
  });
});

app.get("/api/v1/services", async (c) => {
  const { results } = await c.env.DB.prepare(
    `${serviceSelectSql} ORDER BY Services.Name ASC`,
  ).all();

  return c.json({
    count: results.length,
    services: results,
  });
});

app.get("/api/v1/services/:id", async (c) => {
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

app.post("/api/v1/services", async (c) => {
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

app.put("/api/v1/services/:id", async (c) => {
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

app.delete("/api/v1/services/:id", async (c) => {
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

app.get("/api/v1/test-error", () => {
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
