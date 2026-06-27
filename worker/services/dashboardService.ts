import { getDashboardState } from "../models/dashboard";
import type { DashboardService } from "../models/service";
import { listDashboardServices } from "../repositories/serviceRepository";

export async function getDashboard(db: D1Database) {
  const generatedAt = new Date().toISOString();
  const services = await listDashboardServices(db);

  const remoteCount = services.filter(
    (service: DashboardService) => service.status === "Online",
  ).length;

  const localOnlyCount = services.filter(
    (service: DashboardService) => service.status === "Local Network Only",
  ).length;

  const healthyCount = remoteCount + localOnlyCount;

  const offlineCount = services.filter(
    (service: DashboardService) => service.status === "Offline",
  ).length;

  const disabledCount = services.filter(
    (service: DashboardService) => service.status === "Disabled",
  ).length;

  const serviceCount = services.length;

  const state = getDashboardState({
    serviceCount,
    offlineCount,
    disabledCount,
  });

  return {
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
  };
}
