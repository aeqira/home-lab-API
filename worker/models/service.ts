export type ServiceStatus =
  | "Online"
  | "Offline"
  | "Local Network Only"
  | "Disabled";

export type ServiceBody = {
  id?: string;
  name?: string;
  status?: string;
  description?: string;
};

export type DashboardService = {
  id: string;
  name: string;
  status: ServiceStatus;
  description: string;
  createdAt: string;
  updatedAt: string;
};
