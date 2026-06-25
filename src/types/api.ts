export type HealthOverview = {
  ok: boolean;
  app: string;
  stack: string[];
  serviceCount?: number;
  statuses?: {
    status: string;
    count: number;
  }[];
};
export type HealthOverviewProps = {
  overview: HealthOverview | null;
  fallbackServiceCount: number;
};
export type HeaderProps = {
  onRefresh: () => void;
};
export type Service = {
  id: string;
  name: string;
  status: string;
  description: string;
};
export type ServiceResponse = {
  count: number;
  services: Service[];
};
export type ServiceTableProps = {
  services: Service[];
  loading: boolean;
  error: string | null;
  onSelect: (id: string) => void;
};
export type ServiceDetailsProps = {
  service: Service | null;
};
export type ServiceFormProps = {
  onCreate: (service: Service) => Promise<void>;
};
