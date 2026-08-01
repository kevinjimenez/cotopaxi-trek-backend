import { Args, Mutation, Query, Resolver } from '@nestjs/graphql';
import { CreateSeasonInput } from '../dto/create-season.input';
import { UpdateSeasonInput } from '../dto/update-season.input';
import { Season } from '../models/season.model';
import { SeasonsService } from '../services/seasons.service';

@Resolver(() => Season)
export class SeasonsResolver {
  constructor(private readonly seasonsService: SeasonsService) {}

  @Mutation(() => Season)
  createSeason(
    @Args('createSeasonInput') createSeasonInput: CreateSeasonInput,
  ) {
    return this.seasonsService.create(createSeasonInput);
  }

  @Query(() => [Season], { name: 'seasons' })
  findAll() {
    return this.seasonsService.findAll();
  }

  @Mutation(() => Season)
  updateSeason(
    @Args('updateSeasonInput') updateSeasonInput: UpdateSeasonInput,
  ) {
    return this.seasonsService.update(updateSeasonInput);
  }

  // @Query(() => Season, { name: 'season' })
  // findOne(@Args('id', { type: () => Int }) id: number) {
  //   return this.seasonsService.findOne(id);
  // }

  // @Mutation(() => Season)
  // removeSeason(@Args('id', { type: () => Int }) id: number) {
  //   return this.seasonsService.remove(id);
  // }
}
