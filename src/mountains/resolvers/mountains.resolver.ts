import { Args, Mutation, Query, Resolver } from '@nestjs/graphql';
import { CreateMountainInput } from '../dto/create-mountain.input';
import { MountainParamsDto } from '../dto/mountain-params.dto';
import { Mountain } from '../models/mountain.model';
import { MountainsService } from '../services/mountains.service';

@Resolver(() => Mountain)
export class MountainsResolver {
  constructor(private readonly mountainsService: MountainsService) {}

  @Query(() => [Mountain], { name: 'mountains' })
  findAll(@Args('params', { nullable: true }) params: MountainParamsDto) {
    return this.mountainsService.findAll(params);
  }

  @Mutation(() => Mountain)
  createMountain(
    @Args('createMountainInput') createMountainInput: CreateMountainInput,
  ) {
    return this.mountainsService.create(createMountainInput);
  }
}
