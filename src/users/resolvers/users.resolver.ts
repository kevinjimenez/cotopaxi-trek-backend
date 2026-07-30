import { UseGuards } from '@nestjs/common';
import { Args, Mutation, Query, Resolver } from '@nestjs/graphql';
import { RoleProtected } from 'src/auth/decorators/role-protected.decorator';
import { GqlAuthGuard } from 'src/auth/guards/gql-auth.guard';
import { UserRoleGuard } from 'src/auth/guards/user-role.guard';
import { RoleType } from 'src/databases/generated/prisma/enums';
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

  @RoleProtected(RoleType.superadmin, RoleType.admin)
  @UseGuards(GqlAuthGuard, UserRoleGuard)
  @Query(() => [User], { name: 'users' })
  findAll() {
    return this.usersService.findAll();
  }

  @RoleProtected(RoleType.superadmin, RoleType.admin)
  @UseGuards(GqlAuthGuard, UserRoleGuard)
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
