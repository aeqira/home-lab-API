import type { ServiceDetailsProps } from "../../types/api";

export default function ServiceDetails({ service }: ServiceDetailsProps) {
  return (
    <aside className="service-details">
      <h2>Service Details</h2>

      {!service && (
        <p className="empty-state">Select a service to view details.</p>
      )}

      {service && (
        <article className="service-details-card">
          <h3>{service.name}</h3>

          <dl>
            <div>
              <dt>ID</dt>
              <dd>{service.id}</dd>
            </div>

            <div>
              <dt>Status</dt>
              <dd>{service.status}</dd>
            </div>

            <div>
              <dt>Description</dt>
              <dd>{service.description}</dd>
            </div>
          </dl>
        </article>
      )}
    </aside>
  );
}
