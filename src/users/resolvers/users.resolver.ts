import { Args, Mutation, Query, Resolver } from '@nestjs/graphql';
import { CreateUserInput } from '../dto/create-user.input';
import { User } from '../models/user.model';
import { UsersService } from '../services/users.service';

@Resolver(() => User)
export class UsersResolver {
  constructor(private readonly usersService: UsersService) {}

  // @RoleProtected(RoleType.superadmin, RoleType.admin)
  // @UseGuards(GqlAuthGuard, UserRoleGuard)
  @Mutation(() => User)
  createUser(@Args('createUserInput') createUserInput: CreateUserInput) {
    return this.usersService.create(createUserInput);
  }

  // @RoleProtected(RoleType.superadmin, RoleType.admin)
  // @UseGuards(GqlAuthGuard, UserRoleGuard)
  @Query(() => [User], { name: 'users' })
  findAll() {
    return this.usersService.findAll();
  }

  // @RoleProtected(RoleType.superadmin, RoleType.admin)
  // @UseGuards(GqlAuthGuard, UserRoleGuard)
  @Query(() => User, { name: 'user' })
  findByIdWithCredential(@Args('id') id: string) {
    return this.usersService.findByIdWithCredential(id);
  }

  // @Mutation(() => User)
  // updateUser(@Args('updateUserInput') updateUserInput: UpdateUserInput) {
  //   return this.usersService.update(updateUserInput.id, updateUserInput);
  // }

  // @Mutation(() => User)
  // removeUser(@Args('id', { type: () => Int }) id: number) {
  //   return this.usersService.remove(id);
  // }
}
