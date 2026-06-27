export type DashboardState = "healthy" | "warning" | "critical";

export type DashboardCounts = {
  serviceCount: number;
  offlineCount: number;
  disabledCount: number;
};

export function getDashboardState(counts: DashboardCounts): DashboardState {
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
