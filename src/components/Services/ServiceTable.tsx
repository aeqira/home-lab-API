import type { ServiceTableProps } from "../../types/api";

export default function ServiceTable({
  services,
  loading,
  error,
  onSelect,
  onEdit,
  onDelete,
}: ServiceTableProps) {
  if (loading) {
    return (
      <section className="service-table-section">
        <h2>Services</h2>
        <p>Loading services...</p>
      </section>
    );
  }

  if (error) {
    return (
      <section className="service-table-section">
        <h2>Services</h2>
        <p className="error-message">{error}</p>
      </section>
    );
  }

  if (services.length === 0) {
    return (
      <section className="service-table-section">
        <h2>Services</h2>
        <p>No services found.</p>
      </section>
    );
  }

  return (
    <section className="service-table-section">
      <h2>Services</h2>

      <table className="service-table">
        <thead>
          <tr>
            <th>Name</th>
            <th>Status</th>
            <th>Description</th>
            <th className="actions-column">Actions</th>
          </tr>
        </thead>

        <tbody>
          {services.map((service) => (
            <tr key={service.id}>
              <td>{service.name}</td>
              <td>{service.status}</td>
              <td>{service.description || "—"}</td>

              <td className="service-actions">
                <button type="button" onClick={() => onSelect(service.id)}>
                  View
                </button>

                <button type="button" onClick={() => onEdit(service)}>
                  Edit
                </button>

                <button type="button" onClick={() => onDelete(service.id)}>
                  Delete
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </section>
  );
}
