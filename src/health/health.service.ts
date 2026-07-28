import { Injectable } from '@nestjs/common';

@Injectable()
export class HealthService {
  checkStatus() {
    return {
      environment: 'envs.nodeEnv',
      message: 'api paradeisos is up and running',
      port: 3000,
    };
  }
}
