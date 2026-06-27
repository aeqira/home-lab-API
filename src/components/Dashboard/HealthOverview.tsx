import {
  CheckmarkCircle24Regular,
  Server24Regular,
  Warning24Regular,
} from "@fluentui/react-icons";

import OverviewCard from "./OverviewCard";
import type { DashboardSummary } from "../../types/api";

type HealthOverviewStatusProps = {
  summary?: DashboardSummary;
  loading: boolean;
  error: string | null;
};

export default function HealthOverviewStatus({
  summary,
  loading,
  error,
}: HealthOverviewStatusProps) {
  if (loading) {
    return (
      <section className="overview">
        <h2>Health Overview</h2>
        <p>Loading dashboard...</p>
      </section>
    );
  }

  if (error) {
    return (
      <section className="overview">
        <h2>Health Overview</h2>
        <p>{error}</p>
      </section>
    );
  }

  if (!summary) {
    return (
      <section className="overview">
        <h2>Health Overview</h2>
        <p>No dashboard data available.</p>
      </section>
    );
  }

  const stateLabel =
    summary.state === "healthy"
      ? "Healthy"
      : summary.state === "critical"
        ? "Critical"
        : "Attention";

  const stateIcon =
    summary.state === "healthy" ? (
      <CheckmarkCircle24Regular />
    ) : (
      <Warning24Regular />
    );

  return (
    <section className="overview">
      <h2>Health Overview</h2>

      <div className="overview-grid">
        <OverviewCard
          title="System Health"
          value={stateLabel}
          icon={stateIcon}
        />

        <OverviewCard
          title="Services"
          value={summary.counts.total}
          icon={<Server24Regular />}
        />

        <OverviewCard
          title="Healthy"
          value={summary.counts.healthy}
          icon={<CheckmarkCircle24Regular />}
        />

        <OverviewCard
          title="Remote"
          value={summary.counts.remote}
          icon={<Server24Regular />}
        />

        <OverviewCard
          title="Local Only"
          value={summary.counts.localOnly}
          icon={<Server24Regular />}
        />

        <OverviewCard
          title="Offline"
          value={summary.counts.offline}
          icon={<Warning24Regular />}
        />
      </div>
    </section>
  );
}
