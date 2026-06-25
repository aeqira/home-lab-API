import { useCallback, useEffect, useState } from "react";
import "./App.css";

import {
  createService,
  getHealthOverview,
  getService,
  getServices,
} from "./api/services";
import type { HealthOverview, Service } from "./types/api";

import HealthOverviewStatus from "./components/Dashboard/HealthOverview";
import Header from "./components/Layout/Header";
import ServiceDetails from "./components/Services/ServiceDetails";
import ServiceTable from "./components/Services/ServiceTable";
import ServiceForm from "./components/Services/ServiceForm";

function App() {
  const [services, setServices] = useState<Service[]>([]);
  const [selectedService, setSelectedService] = useState<Service | null>(null);
  const [healthOverview, setHealthOverview] = useState<HealthOverview | null>(
    null,
  );

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const loadHealthOverview = useCallback(async () => {
    const data = await getHealthOverview();
    setHealthOverview(data);
  }, []);

  const loadServices = useCallback(async () => {
    setLoading(true);
    setError(null);

    try {
      const data = await getServices();
      setServices(data.services);
      await loadHealthOverview();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Unknown error");
    } finally {
      setLoading(false);
    }
  }, [loadHealthOverview]);

  const loadServiceDetails = useCallback(async (id: string) => {
    setSelectedService(null);
    setError(null);

    try {
      const data = await getService(id);
      setSelectedService(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Unknown error");
    }
  }, []);

  async function handleCreateService(service: Service) {
    setError(null);

    try {
      await createService(service);
      await loadServices();
      await loadHealthOverview();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Unknown error");
    }
  }

  useEffect(() => {
    async function loadInitialData() {
      await loadServices();
    }

    void loadInitialData();
  }, [loadServices]);

  return (
    <main className="dashboard">
      <Header onRefresh={loadServices} />
      <HealthOverviewStatus
        overview={healthOverview}
        fallbackServiceCount={services.length}
      />
      <ServiceForm onCreate={handleCreateService} />
      <ServiceTable
        services={services}
        loading={loading}
        error={error}
        onSelect={loadServiceDetails}
      />
      <ServiceDetails service={selectedService} />
    </main>
  );
}

export default App;
