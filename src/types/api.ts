import type { ReactNode } from "react";

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

export type HealthOverview = {
  ok: boolean;
  app: string;
  stack: string[];
  serviceCount?: number;
  statuses?: HealthStatusCount[];
};

export type HeaderProps = {
  onRefresh: () => void;
  onCreate: () => void;
};

export type HealthOverviewProps = {
  overview: HealthOverview | null;
  fallbackServiceCount: number;
  loading: boolean;
  error: string | null;
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
