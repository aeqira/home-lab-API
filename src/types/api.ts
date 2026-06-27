import type { ReactNode } from "react";

type ResponseMetadata = {
  app: string;
  environment: string;
  database: string;
};

type ServiceCount = {
  total: number;
  healthy: number;
  remote: number;
  localOnly: number;
  offline: number;
  disabled: number;
};

export type DashboardSummary = {
  state: DashboardState;
  counts: ServiceCount;
  lastUpdated: string;
};

export type DashboardState = "healthy" | "warning" | "critical";

export type DashboardResponse = {
  apiVersion: "2";
  generatedAt: string;
  summary: DashboardSummary;
  services: Service[];
  metadata: ResponseMetadata;
};

export type Service = {
  id: string;
  name: string;
  status: string;
  description: string;
  createdAt?: string;
  updatedAt?: string;
};

export type UseServicesOptions = {
  onServicesChanged?: () => Promise<void> | void;
};

export type ServiceResponse = {
  count: number;
  services: Service[];
};

export type CreateServiceInput = Service;

export type UpdateServiceInput = Service;

export type DeleteServiceResponse = {
  deleted: boolean;
  service: Service;
};

export type HealthStatusCount = {
  status: string;
  count: number;
};

export type HeaderProps = {
  onRefresh: () => void | Promise<void>;
  onCreate: () => void;
  isRefreshing: boolean;
  summary?: DashboardSummary;
};

export type OverviewCardProps = {
  title: string;
  value: string | number;
  icon?: ReactNode;
};

export type ServiceTableProps = {
  services: Service[];
  loading: boolean;
  error: string | null;
  onSelect: (id: string) => void;
  onEdit: (service: Service) => void;
  onDelete: (id: string) => void;
};

export type ServiceDetailsProps = {
  service: Service | null;
};

export type ServiceFormProps = {
  service?: Service | null;
  onCreate: (service: CreateServiceInput) => Promise<void>;
  onUpdate: (service: UpdateServiceInput) => Promise<void>;
  onCancel: () => void;
};
