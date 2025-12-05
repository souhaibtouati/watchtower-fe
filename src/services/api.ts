import axios, { type AxiosInstance } from 'axios';
import type {
  Container,
  WatchtowerStatus,
  UpdateLog,
  ApiResponse,
  WatchtowerConfig,
} from '../types';

class ApiService {
  private client: AxiosInstance;
  private baseUrl: string;

  constructor() {
    this.baseUrl = import.meta.env.VITE_API_URL || '/api';
    this.client = axios.create({
      baseURL: this.baseUrl,
      timeout: 30000,
      headers: {
        'Content-Type': 'application/json',
      },
    });
  }

  // Container endpoints
  async getContainers(): Promise<ApiResponse<Container[]>> {
    try {
      const response = await this.client.get('/containers');
      return { success: true, data: response.data };
    } catch (error) {
      return this.handleError(error);
    }
  }

  async getContainer(id: string): Promise<ApiResponse<Container>> {
    try {
      const response = await this.client.get(`/containers/${id}`);
      return { success: true, data: response.data };
    } catch (error) {
      return this.handleError(error);
    }
  }

  async checkContainerUpdates(): Promise<ApiResponse<Container[]>> {
    try {
      const response = await this.client.get('/containers/updates');
      return { success: true, data: response.data };
    } catch (error) {
      return this.handleError(error);
    }
  }

  // Update endpoints
  async triggerUpdate(containerId: string): Promise<ApiResponse<UpdateLog>> {
    try {
      const response = await this.client.post(`/update/${containerId}`);
      return { success: true, data: response.data };
    } catch (error) {
      return this.handleError(error);
    }
  }

  async triggerUpdateAll(): Promise<ApiResponse<UpdateLog[]>> {
    try {
      const response = await this.client.post('/update/all');
      return { success: true, data: response.data };
    } catch (error) {
      return this.handleError(error);
    }
  }

  // Watchtower status endpoints
  async getWatchtowerStatus(): Promise<ApiResponse<WatchtowerStatus>> {
    try {
      const response = await this.client.get('/watchtower/status');
      return { success: true, data: response.data };
    } catch (error) {
      return this.handleError(error);
    }
  }

  async getWatchtowerConfig(): Promise<ApiResponse<WatchtowerConfig>> {
    try {
      const response = await this.client.get('/watchtower/config');
      return { success: true, data: response.data };
    } catch (error) {
      return this.handleError(error);
    }
  }

  async updateWatchtowerConfig(
    config: Partial<WatchtowerConfig>
  ): Promise<ApiResponse<WatchtowerConfig>> {
    try {
      const response = await this.client.put('/watchtower/config', config);
      return { success: true, data: response.data };
    } catch (error) {
      return this.handleError(error);
    }
  }

  // Update logs
  async getUpdateLogs(limit?: number): Promise<ApiResponse<UpdateLog[]>> {
    try {
      const response = await this.client.get('/logs', {
        params: { limit },
      });
      return { success: true, data: response.data };
    } catch (error) {
      return this.handleError(error);
    }
  }

  // Force run watchtower check
  async forceCheck(): Promise<ApiResponse<{ message: string }>> {
    try {
      const response = await this.client.post('/watchtower/run');
      return { success: true, data: response.data };
    } catch (error) {
      return this.handleError(error);
    }
  }

  private handleError(error: unknown): ApiResponse<never> {
    if (axios.isAxiosError(error)) {
      return {
        success: false,
        error: error.response?.data?.message || error.message,
      };
    }
    return {
      success: false,
      error: 'An unexpected error occurred',
    };
  }
}

export const apiService = new ApiService();
export default apiService;
