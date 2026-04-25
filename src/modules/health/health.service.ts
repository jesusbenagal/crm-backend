import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';

import { PrismaService } from '../../prisma/prisma.service';
import {
  HealthDependencyStatus,
  HealthResponseDto,
  HealthStatus,
} from './dto/health-response.dto';

@Injectable()
export class HealthService {
  constructor(
    private readonly configService: ConfigService,
    private readonly prismaService: PrismaService,
  ) {}

  getLiveness(): HealthResponseDto {
    return {
      status: 'ok',
      timestamp: new Date().toISOString(),
      uptime: process.uptime(),
      environment: this.getEnvironment(),
    };
  }

  async getReadiness(): Promise<HealthResponseDto> {
    const databaseStatus = await this.checkDatabase();

    const status: HealthStatus =
      databaseStatus.status === 'ok' ? 'ok' : 'error';

    return {
      status,
      timestamp: new Date().toISOString(),
      uptime: process.uptime(),
      environment: this.getEnvironment(),
      dependencies: {
        database: databaseStatus,
      },
    };
  }

  async getFullHealth(): Promise<HealthResponseDto> {
    return this.getReadiness();
  }

  private getEnvironment(): string {
    return this.configService.get<string>('app.nodeEnv', 'development');
  }

  private async checkDatabase(): Promise<HealthDependencyStatus> {
    const startTime = Date.now();

    try {
      await this.prismaService.$queryRaw`SELECT 1`;

      return {
        status: 'ok',
        latencyMs: Date.now() - startTime,
      };
    } catch (error) {
      return {
        status: 'error',
        latencyMs: Date.now() - startTime,
        message:
          error instanceof Error
            ? error.message
            : 'Unknown database connection error',
      };
    }
  }
}
