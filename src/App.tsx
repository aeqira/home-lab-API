import { useEffect } from "react";
import "./App.css";

import HealthOverviewStatus from "./components/Dashboard/HealthOverview";
import Header from "./components/Layout/Header";
import ServiceDetails from "./components/Services/ServiceDetails";
import ServiceForm from "./components/Services/ServiceForm";
import ServiceTable from "./components/Services/ServiceTable";

import { useServices } from "./hooks/useServices";
import { useHealth } from "./hooks/useHealth";

function App() {
  const { healthOverview, healthLoading, healthError, loadHealthOverview } =
    useHealth();
  const dashboard = useServices({ onServicesChanged: loadHealthOverview });

  const isRefreshing = dashboard.loading || healthLoading;
  const serviceCount =
    healthOverview?.serviceCount ?? dashboard.services.length;
  const healthyCount =
    healthOverview?.statuses?.find((item) => item.status === "online")?.count ??
    dashboard.services.filter((service) => service.status === "online").length;
  const offlineCount = Math.max(serviceCount - healthyCount, 0);
  const systemStatus =
    healthOverview?.ok === false || offlineCount > 0
      ? "Attention needed"
      : "System healthy";

  useEffect(() => {
    void dashboard.loadServices();
    void loadHealthOverview();
  }, [dashboard.loadServices, loadHealthOverview]);

  return (
    <main className="dashboard">
      <Header
        onRefresh={dashboard.loadServices}
        onCreate={dashboard.openCreateForm}
        isRefreshing={isRefreshing}
        systemStatus={systemStatus}
        serviceCount={serviceCount}
        healthyCount={healthyCount}
        offlineCount={offlineCount}
      />

      <HealthOverviewStatus
        overview={healthOverview}
        fallbackServiceCount={dashboard.services.length}
        loading={healthLoading}
        error={healthError}
      />

      {dashboard.isServiceFormOpen && (
        <div className="modal-backdrop">
          <div className="modal">
            <ServiceForm
              key={dashboard.editingService?.id ?? "create"}
              service={dashboard.editingService}
              onCreate={dashboard.handleCreateService}
              onUpdate={dashboard.handleUpdateService}
              onCancel={dashboard.closeServiceForm}
            />
          </div>
        </div>
      )}

      <div className="dashboard-grid">
        <ServiceTable
          services={dashboard.services}
          loading={dashboard.loading}
          error={dashboard.error}
          onSelect={dashboard.loadServiceDetails}
          onEdit={dashboard.openEditForm}
          onDelete={dashboard.handleDeleteService}
        />

        <ServiceDetails service={dashboard.selectedService} />
      </div>
    </main>
  );
}

export default App;
