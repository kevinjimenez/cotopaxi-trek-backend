import { Args, Mutation, Query, Resolver } from '@nestjs/graphql';
import { AssignUserSeasonInput } from '../dto/assign-user-season.input';
import { UserSeason } from '../models/user-season.model';
import { UserSeasonsService } from '../services/user-seasons.service';

@Resolver(() => UserSeason)
export class UserSeasonsResolver {
  constructor(private readonly userSeasonsService: UserSeasonsService) {}

  @Mutation(() => UserSeason)
  assignUserSeason(
    @Args('ssignUserSeasonInput') assignUserSeasonInput: AssignUserSeasonInput,
  ) {
    return this.userSeasonsService.asisgn(assignUserSeasonInput);
  }

  @Query(() => UserSeason, { name: 'userSeasons' })
  findbyUserIdWithSeason(@Args('userId') userId: string) {
    return this.userSeasonsService.findbyUserIdWithSeason(userId);
  }
}
