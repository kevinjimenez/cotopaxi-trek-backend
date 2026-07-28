import { Query, Resolver } from '@nestjs/graphql';
import { HealthService } from './health.service';
import { Health } from './model/health.model';

@Resolver(() => Health)
export class HealthResolver {
  constructor(private readonly healthService: HealthService) {}

  @Query(() => Health)
  checkHealth() {
    return this.healthService.checkStatus();
  }
}
