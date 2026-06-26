import type {
  CreateServiceInput,
  DeleteServiceResponse,
  HealthOverview,
  Service,
  ServiceResponse,
  UpdateServiceInput,
} from "../types/api";

type ApiError = {
  error?: string;
  message?: string;
};

async function parseResponse<T>(response: Response): Promise<T> {
  if (response.ok) {
    return response.json() as Promise<T>;
  }

  let body: ApiError | null = null;

  try {
    body = (await response.json()) as ApiError;
  } catch {
    // Ignore invalid JSON responses.
  }

  throw new Error(
    body?.message ??
      body?.error ??
      `Request failed with status ${response.status}`,
  );
}

export async function getHealthOverview(): Promise<HealthOverview> {
  const response = await fetch("/api/v1/health");
  return parseResponse<HealthOverview>(response);
}

export async function getServices(): Promise<ServiceResponse> {
  const response = await fetch("/api/v1/services");
  return parseResponse<ServiceResponse>(response);
}

export async function getService(id: string): Promise<Service> {
  const response = await fetch(`/api/v1/services/${id}`);
  return parseResponse<Service>(response);
}

export async function createService(
  service: CreateServiceInput,
): Promise<Service> {
  const response = await fetch("/api/v1/services", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(service),
  });

  return parseResponse<Service>(response);
}

export async function updateService(
  id: string,
  service: UpdateServiceInput,
): Promise<Service> {
  const response = await fetch(`/api/v1/services/${id}`, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(service),
  });

  return parseResponse<Service>(response);
}

export async function deleteService(
  id: string,
): Promise<DeleteServiceResponse> {
  const response = await fetch(`/api/v1/services/${id}`, {
    method: "DELETE",
  });

  return parseResponse<DeleteServiceResponse>(response);
}
