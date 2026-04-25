import { Controller, Get } from '@nestjs/common';

import { HealthResponseDto } from './dto/health-response.dto';
import { HealthService } from './health.service';

@Controller('health')
export class HealthController {
  constructor(private readonly healthService: HealthService) {}

  @Get('live')
  getLiveness(): HealthResponseDto {
    return this.healthService.getLiveness();
  }

  @Get('ready')
  getReadiness(): Promise<HealthResponseDto> {
    return this.healthService.getReadiness();
  }

  @Get()
  getHealth(): Promise<HealthResponseDto> {
    return this.healthService.getFullHealth();
  }
}
