import { Resolver, Query, Mutation, Args, Int } from '@nestjs/graphql';
import { UserSeasonsService } from './user-seasons.service';
import { UserSeason } from './entities/user-season.entity';
import { CreateUserSeasonInput } from './dto/create-user-season.input';
import { UpdateUserSeasonInput } from './dto/update-user-season.input';

@Resolver(() => UserSeason)
export class UserSeasonsResolver {
  constructor(private readonly userSeasonsService: UserSeasonsService) {}

  @Mutation(() => UserSeason)
  createUserSeason(@Args('createUserSeasonInput') createUserSeasonInput: CreateUserSeasonInput) {
    return this.userSeasonsService.create(createUserSeasonInput);
  }

  @Query(() => [UserSeason], { name: 'userSeasons' })
  findAll() {
    return this.userSeasonsService.findAll();
  }

  @Query(() => UserSeason, { name: 'userSeason' })
  findOne(@Args('id', { type: () => Int }) id: number) {
    return this.userSeasonsService.findOne(id);
  }

  @Mutation(() => UserSeason)
  updateUserSeason(@Args('updateUserSeasonInput') updateUserSeasonInput: UpdateUserSeasonInput) {
    return this.userSeasonsService.update(updateUserSeasonInput.id, updateUserSeasonInput);
  }

  @Mutation(() => UserSeason)
  removeUserSeason(@Args('id', { type: () => Int }) id: number) {
    return this.userSeasonsService.remove(id);
  }
}
