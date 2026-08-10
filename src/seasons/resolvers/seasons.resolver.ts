import { Args, Mutation, Query, Resolver } from '@nestjs/graphql';
import { QueryParamsDto } from 'src/common/dtos/query-params.dto';
import { CreateSeasonInput } from '../dto/create-season.input';
import { Season } from '../models/season.model';
import { SeasonsService } from '../services/seasons.service';

@Resolver(() => Season)
export class SeasonsResolver {
  constructor(private readonly seasonsService: SeasonsService) {}

  @Query(() => [Season], { name: 'seasonsWithMountains' })
  findAllWithMountains(
    @Args('params', { nullable: true }) params: QueryParamsDto,
  ) {
    return this.seasonsService.findAllWithMountains(params);
  }

  @Query(() => Season, { name: 'season', nullable: true })
  findOne(@Args('params', { nullable: true }) params: QueryParamsDto) {
    return this.seasonsService.findOne(params);
  }

  @Mutation(() => Season)
  createSeason(
    @Args('createSeasonInput') createSeasonInput: CreateSeasonInput,
  ) {
    return this.seasonsService.create(createSeasonInput);
  }

  // @Mutation(() => Season)
  // updateSeason(
  //   @Args('updateSeasonInput') updateSeasonInput: UpdateSeasonInput,
  // ) {
  //   return this.seasonsService.update(updateSeasonInput);
  // }

  // @Query(() => Season, { name: 'season' })
  // findOne(@Args('id', { type: () => Int }) id: number) {
  //   return this.seasonsService.findOne(id);
  // }

  // @Mutation(() => Season)
  // removeSeason(@Args('id', { type: () => Int }) id: number) {
  //   return this.seasonsService.remove(id);
  // }
}
