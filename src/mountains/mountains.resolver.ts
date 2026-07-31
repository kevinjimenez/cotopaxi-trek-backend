import { Resolver, Query, Mutation, Args, Int } from '@nestjs/graphql';
import { MountainsService } from './mountains.service';
import { Mountain } from './entities/mountain.entity';
import { CreateMountainInput } from './dto/create-mountain.input';
import { UpdateMountainInput } from './dto/update-mountain.input';

@Resolver(() => Mountain)
export class MountainsResolver {
  constructor(private readonly mountainsService: MountainsService) {}

  @Mutation(() => Mountain)
  createMountain(@Args('createMountainInput') createMountainInput: CreateMountainInput) {
    return this.mountainsService.create(createMountainInput);
  }

  @Query(() => [Mountain], { name: 'mountains' })
  findAll() {
    return this.mountainsService.findAll();
  }

  @Query(() => Mountain, { name: 'mountain' })
  findOne(@Args('id', { type: () => Int }) id: number) {
    return this.mountainsService.findOne(id);
  }

  @Mutation(() => Mountain)
  updateMountain(@Args('updateMountainInput') updateMountainInput: UpdateMountainInput) {
    return this.mountainsService.update(updateMountainInput.id, updateMountainInput);
  }

  @Mutation(() => Mountain)
  removeMountain(@Args('id', { type: () => Int }) id: number) {
    return this.mountainsService.remove(id);
  }
}
