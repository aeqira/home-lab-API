import type { DashboardService } from "../models/service";
import { serviceSelectSql } from "../sql/services";

export async function listDashboardServices(
  db: D1Database,
): Promise<DashboardService[]> {
  const { results } = await db
    .prepare(`${serviceSelectSql} ORDER BY Services.Name ASC`)
    .all<DashboardService>();

  return results;
}
