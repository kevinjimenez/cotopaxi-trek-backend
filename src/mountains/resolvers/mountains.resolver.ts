import { Args, Mutation, Query, Resolver } from '@nestjs/graphql';
import { CreateMountainInput } from '../dto/create-mountain.input';
import { Mountain } from '../models/mountain.model';
import { MountainsService } from '../services/mountains.service';

@Resolver(() => Mountain)
export class MountainsResolver {
  constructor(private readonly mountainsService: MountainsService) {}

  @Mutation(() => Mountain)
  createMountain(
    @Args('createMountainInput') createMountainInput: CreateMountainInput,
  ) {
    return this.mountainsService.create(createMountainInput);
  }

  @Query(() => [Mountain], { name: 'mountains' })
  findAll() {
    return this.mountainsService.findAll();
  }
}
