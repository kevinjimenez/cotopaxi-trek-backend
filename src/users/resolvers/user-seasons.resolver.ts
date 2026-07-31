import { Args, Mutation, Query, Resolver } from '@nestjs/graphql';
import { CreateUserSeasonInput } from '../dto/create-user-season.input';
import { UserSeason } from '../models/user-season.model';
import { UserSeasonsService } from '../services/user-seasons.service';

@Resolver(() => UserSeason)
export class UserSeasonsResolver {
  constructor(private readonly userSeasonsService: UserSeasonsService) {}

  @Mutation(() => UserSeason)
  createUserSeason(
    @Args('createUserSeasonInput') createUserSeasonInput: CreateUserSeasonInput,
  ) {
    return this.userSeasonsService.create(createUserSeasonInput);
  }

  @Query(() => [UserSeason], { name: 'userSeasons' })
  findAll() {
    return this.userSeasonsService.findAll();
  }
}
