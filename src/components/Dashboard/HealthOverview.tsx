import type { HealthOverviewProps } from "../../types/api";

export default function HealthOverviewStatus({
  overview,
  fallbackServiceCount,
}: HealthOverviewProps) {
  return (
    <section>
      <h2>Health Overview</h2>

      {!overview && <p>Loading Health Overview...</p>}

      {overview && (
        <>
          <p>Status: {overview.ok ? "Healthy" : "Unhealthy"}</p>
          <p>App: {overview.app}</p>
          <p>Service Count: {overview.serviceCount ?? fallbackServiceCount}</p>

          <h3>Status Breakdown</h3>

          {overview.statuses?.map((status) => (
            <article key={status.status}>
              <strong>{status.status}</strong>: {status.count}
            </article>
          ))}
        </>
      )}
    </section>
  );
}
