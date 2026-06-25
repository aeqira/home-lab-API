import { useState, type FormEvent } from "react";
import type { ServiceFormProps } from "../../types/api";

const DEFAULT_STATUS = "Local Network Only";

function generateServiceId(name: string) {
  return name
    .trim()
    .toLowerCase()
    .replace(/[^a-z0-9\s-]/g, "")
    .replace(/\s+/g, "");
}

export default function ServiceForm({
  service,
  onCreate,
  onUpdate,
  onCancel,
}: ServiceFormProps) {
  const isEditing = Boolean(service);

  const [name, setName] = useState(service?.name ?? "");
  const [status, setStatus] = useState(service?.status ?? DEFAULT_STATUS);
  const [description, setDescription] = useState(service?.description ?? "");
  const [submitting, setSubmitting] = useState(false);
  const [formError, setFormError] = useState<string | null>(null);

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    const trimmedName = name.trim();
    const generatedId = generateServiceId(trimmedName);

    if (!trimmedName) {
      setFormError("Service name is required.");
      return;
    }

    if (!generatedId) {
      setFormError("Service name must include at least one letter or number.");
      return;
    }

    setFormError(null);
    setSubmitting(true);

    try {
      const payload = {
        id: service?.id ?? generatedId,
        name: trimmedName,
        status,
        description: description.trim(),
      };

      if (service) {
        await onUpdate(payload);
      } else {
        await onCreate(payload);
      }
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <section className="service-form">
      <h2>{isEditing ? "Update Service" : "Create Service"}</h2>

      {formError && <p className="form-error">{formError}</p>}

      <form onSubmit={handleSubmit}>
        <label>
          Name
          <input
            value={name}
            onChange={(event) => setName(event.target.value)}
          />
        </label>

        <label>
          Status
          <select
            value={status}
            onChange={(event) => setStatus(event.target.value)}
          >
            <option>Offline</option>
            <option>Online</option>
            <option>Local Network Only</option>
            <option>Disabled</option>
          </select>
        </label>

        <label>
          Description
          <textarea
            value={description}
            onChange={(event) => setDescription(event.target.value)}
          />
        </label>

        <div className="form-actions">
          <button type="submit" disabled={submitting}>
            {submitting
              ? isEditing
                ? "Updating..."
                : "Creating..."
              : isEditing
                ? "Update Service"
                : "Create Service"}
          </button>

          <button type="button" onClick={onCancel} disabled={submitting}>
            Cancel
          </button>
        </div>
      </form>
    </section>
  );
}
