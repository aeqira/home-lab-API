import type { HeaderProps } from "../../types/api";
import { AddRegular, ArrowClockwiseRegular } from "@fluentui/react-icons";

export default function Header({
  onRefresh,
  onCreate,
  isRefreshing,
  systemStatus,
  serviceCount,
  healthyCount,
  offlineCount,
}: HeaderProps) {
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
          <span className="status-pill">{systemStatus}</span>

          <span className="status-metric">
            <strong>{serviceCount}</strong>
            <small>Services</small>
          </span>

          <span className="status-metric">
            <strong>{healthyCount}</strong>
            <small>Healthy</small>
          </span>

          <span className="status-metric">
            <strong>{offlineCount}</strong>
            <small>Offline</small>
          </span>
        </div>
      </div>

      <div className="app-header-actions">
        <button
          type="button"
          onClick={onRefresh}
          className="header-button header-button--secondary"
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
          onClick={onCreate}
          className="header-button header-button--primary"
        >
          <AddRegular fontSize={18} />
          <span>New Service</span>
        </button>
      </div>
    </header>
  );
}
