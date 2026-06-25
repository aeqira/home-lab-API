import { useCallback, useState } from "react";

import {
  createService,
  deleteService,
  getService,
  getServices,
  updateService,
} from "../api/services";

import type { UseServicesOptions, Service } from "../types/api";

export function useServices({ onServicesChanged }: UseServicesOptions = {}) {
  const [services, setServices] = useState<Service[]>([]);
  const [selectedService, setSelectedService] = useState<Service | null>(null);
  const [editingService, setEditingService] = useState<Service | null>(null);

  const [isServiceFormOpen, setIsServiceFormOpen] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const loadServices = useCallback(async () => {
    setLoading(true);
    setError(null);

    try {
      const data = await getServices();
      setServices(data.services);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Unknown error");
    } finally {
      setLoading(false);
    }
  }, []);

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

  const refreshAfterMutation = useCallback(async () => {
    await loadServices();
    await onServicesChanged?.();
  }, [loadServices, onServicesChanged]);

  const openCreateForm = useCallback(() => {
    setEditingService(null);
    setIsServiceFormOpen(true);
  }, []);

  const openEditForm = useCallback((service: Service) => {
    setEditingService(service);
    setIsServiceFormOpen(true);
  }, []);

  const closeServiceForm = useCallback(() => {
    setEditingService(null);
    setIsServiceFormOpen(false);
  }, []);

  const handleCreateService = useCallback(
    async (service: Service) => {
      setError(null);

      try {
        await createService(service);
        await refreshAfterMutation();
        closeServiceForm();
      } catch (err) {
        setError(err instanceof Error ? err.message : "Unknown error");
      }
    },
    [refreshAfterMutation, closeServiceForm],
  );

  const handleUpdateService = useCallback(
    async (service: Service) => {
      setError(null);

      try {
        await updateService(service.id, service);
        setSelectedService(null);
        await refreshAfterMutation();
        closeServiceForm();
      } catch (err) {
        setError(err instanceof Error ? err.message : "Unknown error");
      }
    },
    [refreshAfterMutation, closeServiceForm],
  );

  const handleDeleteService = useCallback(
    async (id: string) => {
      const confirmed = window.confirm(`Delete "${id}"?`);

      if (!confirmed) return;

      setError(null);

      try {
        await deleteService(id);

        setSelectedService(null);

        await refreshAfterMutation();
      } catch (err) {
        setError(err instanceof Error ? err.message : "Unknown error");
      }
    },
    [refreshAfterMutation],
  );

  return {
    services,
    selectedService,
    editingService,

    loading,
    error,
    isServiceFormOpen,

    loadServices,
    loadServiceDetails,

    handleCreateService,
    handleUpdateService,
    handleDeleteService,

    openCreateForm,
    openEditForm,
    closeServiceForm,
  };
}
