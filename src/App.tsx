import { useEffect } from "react";
import "./App.css";

import HealthOverviewStatus from "./components/Dashboard/HealthOverview";
import Header from "./components/Layout/Header";
import ServiceDetails from "./components/Services/ServiceDetails";
import ServiceForm from "./components/Services/ServiceForm";
import ServiceTable from "./components/Services/ServiceTable";

import { useServices } from "./hooks/useServices";
import { useDashboard } from "./hooks/useDashboard";

function App() {
  const dashboardV2 = useDashboard();
  const dashboard = useServices({
    onServicesChanged: dashboardV2.loadDashboard,
  });

  useEffect(() => {
    void dashboard.loadServices();
    void dashboardV2.loadDashboard();
  }, [dashboard.loadServices, dashboardV2.loadDashboard]);

  return (
    <main className="dashboard">
      <Header
        onRefresh={dashboardV2.loadDashboard}
        onCreate={dashboard.openCreateForm}
        isRefreshing={dashboardV2.loading}
        summary={dashboardV2.dashboard?.summary}
      />

      <HealthOverviewStatus
        summary={dashboardV2.dashboard?.summary}
        loading={dashboardV2.loading}
        error={dashboardV2.error}
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
          services={dashboardV2.dashboard?.services ?? dashboard.services}
          loading={dashboardV2.loading || dashboard.loading}
          error={dashboardV2.error ?? dashboard.error}
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
