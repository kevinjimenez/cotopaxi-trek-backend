import { Args, Mutation, Query, Resolver } from '@nestjs/graphql';
import { AssignUserSeasonInput } from '../dto/assign-user-season.input';
import { UserSeason } from '../models/user-season.model';
import { UserSeasonsService } from '../services/user-seasons.service';

@Resolver(() => UserSeason)
export class UserSeasonsResolver {
  constructor(private readonly userSeasonsService: UserSeasonsService) {}

  @Mutation(() => UserSeason)
  assignUserSeason(
    @Args('assignUserSeasonInput') assignUserSeasonInput: AssignUserSeasonInput,
  ) {
    return this.userSeasonsService.assign(assignUserSeasonInput);
  }

  @Query(() => UserSeason, { name: 'userSeasons' })
  findByUserIdWithSeason(@Args('userId') userId: string) {
    return this.userSeasonsService.findByUserIdWithSeason(userId);
  }
}
