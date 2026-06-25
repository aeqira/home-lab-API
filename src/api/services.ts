import type { HealthOverview, Service, ServiceResponse } from "../types/api";

export async function getHealthOverview(): Promise<HealthOverview> {
  const response = await fetch("/api/health");

  if (!response.ok) {
    throw new Error(`Health API failed with status ${response.status}`);
  }

  return response.json();
}

export async function getServices(): Promise<ServiceResponse> {
  const response = await fetch("/api/services");

  if (!response.ok) {
    throw new Error(`Services API failed with status ${response.status}`);
  }

  return response.json();
}

export async function getService(id: string): Promise<Service> {
  const response = await fetch(`/api/services/${id}`);

  if (!response.ok) {
    throw new Error(`Service API failed with status ${response.status}`);
  }

  return response.json();
}

export async function createService(
  service: Omit<Service, "status"> & { status: string },
) {
  const response = await fetch("/api/services", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(service),
  });

  if (!response.ok) {
    throw new Error(`Create failed with status ${response.status}`);
  }

  return response.json();
}

export async function deleteService(
  id: string,
): Promise<{ deleted: boolean; service: Service }> {
  const response = await fetch(`/api/services/${id}`, {
    method: "DELETE",
  });

  if (!response.ok) {
    throw new Error(`Delete failed with status ${response.status}`);
  }

  return response.json();
}
