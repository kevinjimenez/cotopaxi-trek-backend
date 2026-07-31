import { Args, Mutation, Query, Resolver } from '@nestjs/graphql';
import { CreateSeasonMountainInput } from '../dto/create-season-mountain.input';
import { SeasonMountain } from '../models/season-mountain.model';
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
}
