import { Args, Int, Mutation, Query, Resolver } from '@nestjs/graphql';
import { CreateUserCredentialInput } from './dto/create-user-credential.input';
import { UpdateUserCredentialInput } from './dto/update-user-credential.input';
import { UserCredential } from './entities/user-credential.entity';
import { UserCredentialsService } from './user-credentials.service';

@Resolver(() => UserCredential)
export class UserCredentialsResolver {
  constructor(
    private readonly userCredentialsService: UserCredentialsService,
  ) {}

  @Mutation(() => UserCredential)
  createUserCredential(
    @Args('createUserCredentialInput')
    createUserCredentialInput: CreateUserCredentialInput,
  ) {
    return this.userCredentialsService.create(createUserCredentialInput);
  }

  @Query(() => [UserCredential], { name: 'userCredentials' })
  findAll() {
    return this.userCredentialsService.findAll();
  }

  @Query(() => UserCredential, { name: 'userCredential' })
  findOne(@Args('id', { type: () => Int }) id: number) {
    return this.userCredentialsService.findOne(id);
  }

  @Mutation(() => UserCredential)
  updateUserCredential(
    @Args('updateUserCredentialInput')
    updateUserCredentialInput: UpdateUserCredentialInput,
  ) {
    return this.userCredentialsService.update(
      updateUserCredentialInput.id,
      updateUserCredentialInput,
    );
  }

  @Mutation(() => UserCredential)
  removeUserCredential(@Args('id', { type: () => Int }) id: number) {
    return this.userCredentialsService.remove(id);
  }
}
