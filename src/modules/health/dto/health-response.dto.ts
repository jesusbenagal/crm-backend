export type HealthStatus = 'ok' | 'error';

export interface HealthDependencyStatus {
  status: HealthStatus;
  latencyMs?: number;
  message?: string;
}

export interface HealthResponseDto {
  status: HealthStatus;
  timestamp: string;
  uptime: number;
  environment: string;
  dependencies?: {
    database: HealthDependencyStatus;
  };
}
