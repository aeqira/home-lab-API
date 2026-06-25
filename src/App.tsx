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

  useEffect(() => {
    void dashboard.loadServices();
  }, [dashboard.loadServices]);

  return (
    <main className="dashboard">
      <Header
        onRefresh={dashboard.loadServices}
        onCreate={dashboard.openCreateForm}
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
