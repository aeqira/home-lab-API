import type { OverviewCardProps } from "../../types/api";

export default function OverviewCard({
  title,
  value,
  icon,
}: OverviewCardProps) {
  return (
    <article className="overview-card">
      <header className="overview-card-header">
        <h3>{title}</h3>
      </header>

      <div className="overview-card-body">
        {icon && <span className="overview-card-icon">{icon}</span>}

        <span className="overview-card-value">{value}</span>
      </div>
    </article>
  );
}
