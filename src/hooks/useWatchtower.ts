import { useState, useEffect, useCallback } from 'react';
import type { Container, WatchtowerStatus, UpdateLog } from '../types';
import apiService from '../services/api';
import {
  mockContainers,
  mockWatchtowerStatus,
  mockUpdateLogs,
  delay,
} from '../services/mockData';

const USE_MOCK_DATA = import.meta.env.VITE_USE_MOCK_DATA === 'true' || true;

export function useContainers() {
  const [containers, setContainers] = useState<Container[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchContainers = useCallback(async () => {
    setLoading(true);
    setError(null);

    if (USE_MOCK_DATA) {
      await delay(500);
      setContainers(mockContainers);
      setLoading(false);
      return;
    }

    const response = await apiService.getContainers();
    if (response.success && response.data) {
      setContainers(response.data);
    } else {
      setError(response.error || 'Failed to fetch containers');
    }
    setLoading(false);
  }, []);

  const updateContainer = useCallback(async (containerId: string) => {
    setContainers((prev) =>
      prev.map((c) =>
        c.id === containerId ? { ...c, isUpdating: true } : c
      )
    );

    if (USE_MOCK_DATA) {
      await delay(3000);
      setContainers((prev) =>
        prev.map((c) =>
          c.id === containerId
            ? { ...c, isUpdating: false, hasUpdate: false }
            : c
        )
      );
      return { success: true };
    }

    const response = await apiService.triggerUpdate(containerId);
    setContainers((prev) =>
      prev.map((c) =>
        c.id === containerId
          ? { ...c, isUpdating: false, hasUpdate: !response.success }
          : c
      )
    );
    return response;
  }, []);

  const updateAllContainers = useCallback(async () => {
    const containersWithUpdates = containers.filter((c) => c.hasUpdate);
    
    setContainers((prev) =>
      prev.map((c) =>
        c.hasUpdate ? { ...c, isUpdating: true } : c
      )
    );

    if (USE_MOCK_DATA) {
      await delay(5000);
      setContainers((prev) =>
        prev.map((c) => ({ ...c, isUpdating: false, hasUpdate: false }))
      );
      return { success: true };
    }

    const response = await apiService.triggerUpdateAll();
    if (response.success) {
      setContainers((prev) =>
        prev.map((c) =>
          containersWithUpdates.some((u) => u.id === c.id)
            ? { ...c, isUpdating: false, hasUpdate: false }
            : c
        )
      );
    } else {
      setContainers((prev) =>
        prev.map((c) => ({ ...c, isUpdating: false }))
      );
    }
    return response;
  }, [containers]);

  useEffect(() => {
    fetchContainers();
  }, [fetchContainers]);

  return {
    containers,
    loading,
    error,
    refetch: fetchContainers,
    updateContainer,
    updateAllContainers,
  };
}

export function useWatchtowerStatus() {
  const [status, setStatus] = useState<WatchtowerStatus | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchStatus = useCallback(async () => {
    setLoading(true);
    setError(null);

    if (USE_MOCK_DATA) {
      await delay(300);
      setStatus(mockWatchtowerStatus);
      setLoading(false);
      return;
    }

    const response = await apiService.getWatchtowerStatus();
    if (response.success && response.data) {
      setStatus(response.data);
    } else {
      setError(response.error || 'Failed to fetch Watchtower status');
    }
    setLoading(false);
  }, []);

  const forceCheck = useCallback(async () => {
    if (USE_MOCK_DATA) {
      await delay(1000);
      setStatus((prev) =>
        prev
          ? { ...prev, lastCheck: new Date().toISOString() }
          : null
      );
      return { success: true };
    }

    const response = await apiService.forceCheck();
    if (response.success) {
      await fetchStatus();
    }
    return response;
  }, [fetchStatus]);

  useEffect(() => {
    fetchStatus();
  }, [fetchStatus]);

  return {
    status,
    loading,
    error,
    refetch: fetchStatus,
    forceCheck,
  };
}

export function useUpdateLogs() {
  const [logs, setLogs] = useState<UpdateLog[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchLogs = useCallback(async (limit?: number) => {
    setLoading(true);
    setError(null);

    if (USE_MOCK_DATA) {
      await delay(400);
      setLogs(limit ? mockUpdateLogs.slice(0, limit) : mockUpdateLogs);
      setLoading(false);
      return;
    }

    const response = await apiService.getUpdateLogs(limit);
    if (response.success && response.data) {
      setLogs(response.data);
    } else {
      setError(response.error || 'Failed to fetch update logs');
    }
    setLoading(false);
  }, []);

  useEffect(() => {
    fetchLogs();
  }, [fetchLogs]);

  return {
    logs,
    loading,
    error,
    refetch: fetchLogs,
  };
}
