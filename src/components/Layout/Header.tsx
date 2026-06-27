import { AddRegular, ArrowClockwiseRegular } from "@fluentui/react-icons";
import type { HeaderProps } from "../../types/api";

export default function Header({
  onRefresh,
  onCreate,
  isRefreshing,
  summary,
}: HeaderProps) {
  const statusLabel =
    summary?.state === "healthy"
      ? "System healthy"
      : summary?.state === "critical"
        ? "Critical"
        : "Attention needed";

  const counts = summary?.counts;

  return (
    <header className="app-header">
      <div className="app-header-content">
        <span className="app-header-eyebrow">AEQIRA HOME LAB</span>

        <h1>Infrastructure Dashboard</h1>

        <p>
          Monitor services, infrastructure health, and operational status from a
          single dashboard.
        </p>

        <div className="app-header-status">
          <span className="status-pill">{statusLabel}</span>

          <span className="status-metric">
            <strong>{counts?.total ?? 0}</strong>
            <small>Services</small>
          </span>

          <span className="status-metric">
            <strong>{counts?.healthy ?? 0}</strong>
            <small>Healthy</small>
          </span>

          <span className="status-metric">
            <strong>{counts?.remote ?? 0}</strong>
            <small>Remote</small>
          </span>

          <span className="status-metric">
            <strong>{counts?.localOnly ?? 0}</strong>
            <small>Local</small>
          </span>

          <span className="status-metric">
            <strong>{counts?.offline ?? 0}</strong>
            <small>Offline</small>
          </span>
        </div>
      </div>

      <div className="app-header-actions">
        <button
          type="button"
          className="header-button header-button--secondary"
          onClick={onRefresh}
          disabled={isRefreshing}
        >
          <ArrowClockwiseRegular
            className={
              isRefreshing ? "header-button-icon--spinning" : undefined
            }
            fontSize={18}
          />
          <span>{isRefreshing ? "Refreshing" : "Refresh"}</span>
        </button>

        <button
          type="button"
          className="header-button header-button--primary"
          onClick={onCreate}
        >
          <AddRegular fontSize={18} />
          <span>New Service</span>
        </button>
      </div>
    </header>
  );
}
