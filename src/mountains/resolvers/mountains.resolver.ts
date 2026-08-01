import { Args, Mutation, Query, Resolver } from '@nestjs/graphql';
import { CreateMountainInput } from '../dto/create-mountain.input';
import { UpdateMountainInput } from '../dto/update-mountain.input';
import { Mountain } from '../models/mountain.model';
import { MountainsService } from '../services/mountains.service';

@Resolver(() => Mountain)
export class MountainsResolver {
  constructor(private readonly mountainsService: MountainsService) {}

  @Query(() => [Mountain], { name: 'mountains' })
  findAll() {
    return this.mountainsService.findAll();
  }

  @Mutation(() => Mountain)
  createMountain(
    @Args('createMountainInput') createMountainInput: CreateMountainInput,
  ) {
    return this.mountainsService.create(createMountainInput);
  }

  @Mutation(() => Mountain)
  updateMountain(
    @Args('updateMountainInput') updateMountainInput: UpdateMountainInput,
  ) {
    return this.mountainsService.update(updateMountainInput);
  }
}
