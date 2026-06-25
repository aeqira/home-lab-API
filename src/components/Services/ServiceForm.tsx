import React, { useState } from "react";
import type { ServiceFormProps } from "../../types/api";

export default function ServiceForm({ onCreate }: ServiceFormProps) {
  const [id, setId] = useState("");
  const [name, setName] = useState("");
  const [status, setStatus] = useState("Local Network Only");
  const [description, setDescription] = useState("");
  const [submitting, setSubmitting] = useState(false);

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setSubmitting(true);

    try {
      await onCreate({
        id,
        name,
        status,
        description: description,
      });

      setId("");
      setName("");
      setStatus("");
      setDescription("");
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <section>
      <h2>Create Service</h2>

      <form onSubmit={handleSubmit}>
        <label>
          Name
          <input
            value={name}
            onChange={(event) => setName(event.target.value)}
          />
        </label>
        <label>
          ID
          <input
            value={id}
            onChange={(event) => {
              const newName = event.target.value;

              setName(newName);

              setId(newName.trim().toLowerCase().replace(/\s+/g, ""));
            }}
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

        <button type="submit" disabled={submitting}>
          {submitting ? "Creating..." : "Create Service"}
        </button>
      </form>
    </section>
  );
}
