import type { ServiceDetailsProps } from "../../types/api";

export default function ServiceDetails({ service }: ServiceDetailsProps) {
  return (
    <aside>
      <h2>Service Details</h2>

      {!service && <p>Select a service to view details.</p>}

      {service && (
        <article>
          <h3>{service.name}</h3>
          <p>ID: {service.name}</p>
          <p>Status: {service.status}</p>
          <p>{service.description}</p>
        </article>
      )}
    </aside>
  );
}
