import type { ServiceTableProps } from "../../types/api";

export default function ServiceTable({
  services,
  loading,
  error,
  onSelect,
}: ServiceTableProps) {
  return (
    <section>
      <h2>Services</h2>

      {loading && <p>Loading Services...</p>}
      {error && <p>{error}</p>}

      {!loading && services.length === 0 && <p>No Services Found</p>}

      {services.map((service) => (
        <article key={service.id}>
          <h3>{service.name}</h3>

          <p>{service.description}</p>

          <p>
            <strong>Status:</strong> {service.status}
          </p>

          <button type="button" onClick={() => onSelect(service.id)}>
            View Details
          </button>
        </article>
      ))}
    </section>
  );
}
