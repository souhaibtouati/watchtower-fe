export interface Container {
  id: string;
  name: string;
  image: string;
  imageId: string;
  status: ContainerStatus;
  state: string;
  created: string;
  ports: Port[];
  labels: Record<string, string>;
  hasUpdate: boolean;
  latestImageId?: string;
  isUpdating?: boolean;
}

export type ContainerStatus = 'running' | 'stopped' | 'paused' | 'restarting' | 'exited';

export interface Port {
  privatePort: number;
  publicPort?: number;
  type: string;
}

export interface WatchtowerStatus {
  isRunning: boolean;
  containerId?: string;
  lastCheck?: string;
  nextCheck?: string;
  schedule?: string;
  monitoredContainers: number;
  containersWithUpdates: number;
}

export interface UpdateLog {
  id: string;
  timestamp: string;
  containerName: string;
  oldImage: string;
  newImage: string;
  status: 'success' | 'failed' | 'in-progress';
  message?: string;
}

export interface ApiResponse<T> {
  success: boolean;
  data?: T;
  error?: string;
}

export interface WatchtowerConfig {
  schedule: string;
  cleanup: boolean;
  includeRestarting: boolean;
  includeStopped: boolean;
  revivesStopped: boolean;
  pollInterval: number;
  labelEnable: boolean;
  monitorOnly: boolean;
  notificationsEnabled: boolean;
}
