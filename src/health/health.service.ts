import { Injectable } from '@nestjs/common';
import { envs } from 'src/common/config/envs';

@Injectable()
export class HealthService {
  checkStatus() {
    return {
      environment: envs.nodeEnv,
      message: 'api is up and running',
      port: envs.port,
    };
  }
}
