import {
  CheckmarkCircle24Regular,
  Server24Regular,
  Warning24Regular,
} from "@fluentui/react-icons";

import OverviewCard from "./OverviewCard";
import type { HealthOverviewProps } from "../../types/api";

function getStatusIcon(status: string) {
  switch (status.toLowerCase()) {
    case "online":
      return <CheckmarkCircle24Regular />;

    case "offline":
      return <Warning24Regular />;

    default:
      return <Server24Regular />;
  }
}

export default function HealthOverviewStatus({
  overview,
  fallbackServiceCount,
  loading,
  error,
}: HealthOverviewProps) {
  if (!overview) {
    return (
      <section className="overview">
        <h2>Health Overview</h2>
        <p>Loading dashboard...</p>
      </section>
    );
  }

  const serviceCount = overview.serviceCount ?? fallbackServiceCount;

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

  return (
    <section className="overview">
      <h2>Health Overview</h2>

      <div className="overview-grid">
        <OverviewCard
          title="System Health"
          value={overview.ok ? "Healthy" : "Unhealthy"}
          icon={getStatusIcon(overview.ok ? "online" : "offline")}
        />

        <OverviewCard
          title="Services"
          value={serviceCount}
          icon={<Server24Regular />}
        />

        {overview.statuses?.map(({ status, count }) => (
          <OverviewCard
            key={status}
            title={status}
            value={count}
            icon={getStatusIcon(status)}
          />
        ))}
      </div>
    </section>
  );
}
