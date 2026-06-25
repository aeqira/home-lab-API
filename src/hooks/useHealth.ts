import { useCallback, useEffect, useState } from "react";

import { getHealthOverview } from "../api/services";
import type { HealthOverview } from "../types/api";

export function useHealth() {
  const [healthOverview, setHealthOverview] = useState<HealthOverview | null>(
    null,
  );
  const [healthLoading, setHealthLoading] = useState(true);
  const [healthError, setHealthError] = useState<string | null>(null);

  const loadHealthOverview = useCallback(async () => {
    setHealthLoading(true);
    setHealthError(null);

    try {
      const data = await getHealthOverview();
      setHealthOverview(data);
    } catch (err) {
      setHealthError(err instanceof Error ? err.message : "Unknown error");
    } finally {
      setHealthLoading(false);
    }
  }, []);

  useEffect(() => {
    void loadHealthOverview();
  }, [loadHealthOverview]);

  return {
    healthOverview,
    healthLoading,
    healthError,
    loadHealthOverview,
  };
}
