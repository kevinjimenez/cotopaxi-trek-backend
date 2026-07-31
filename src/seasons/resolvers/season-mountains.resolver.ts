import { Args, Int, Mutation, Query, Resolver } from '@nestjs/graphql';
import { SeasonMountain } from '../../season-mountains/entities/season-mountain.entity';
import { CreateSeasonMountainInput } from '../dto/create-season-mountain.input';
import { UpdateSeasonMountainInput } from '../dto/update-season-mountain.input';
import { SeasonMountainsService } from '../services/season-mountains.service';

@Resolver(() => SeasonMountain)
export class SeasonMountainsResolver {
  constructor(
    private readonly seasonMountainsService: SeasonMountainsService,
  ) {}

  @Mutation(() => SeasonMountain)
  createSeasonMountain(
    @Args('createSeasonMountainInput')
    createSeasonMountainInput: CreateSeasonMountainInput,
  ) {
    return this.seasonMountainsService.create(createSeasonMountainInput);
  }

  @Query(() => [SeasonMountain], { name: 'seasonMountains' })
  findAll() {
    return this.seasonMountainsService.findAll();
  }

  @Query(() => SeasonMountain, { name: 'seasonMountain' })
  findOne(@Args('id', { type: () => Int }) id: number) {
    return this.seasonMountainsService.findOne(id);
  }

  @Mutation(() => SeasonMountain)
  updateSeasonMountain(
    @Args('updateSeasonMountainInput')
    updateSeasonMountainInput: UpdateSeasonMountainInput,
  ) {
    return this.seasonMountainsService.update(
      updateSeasonMountainInput.id,
      updateSeasonMountainInput,
    );
  }

  @Mutation(() => SeasonMountain)
  removeSeasonMountain(@Args('id', { type: () => Int }) id: number) {
    return this.seasonMountainsService.remove(id);
  }
}
