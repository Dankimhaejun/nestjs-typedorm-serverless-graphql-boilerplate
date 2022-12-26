import { Resolver, Query, Mutation, Args, Int } from '@nestjs/graphql';
import { LoginOutput } from 'src/components/customer/dto/login.output';

import { CustomerService } from './customer.service';
import { CreateCustomerInput } from './dto/create-customer.input';
import { LoginInput } from './dto/login.input';
import { UpdateUserInput } from './dto/update-user.input';
import { User } from './entities/user.entity';

@Resolver(() => User)
export class CustomerResolver {
  constructor(private readonly customerService: CustomerService) {}

  @Mutation(() => User, { name: 'createCustomer' })
  createCustomer(@Args('input') input: CreateCustomerInput) {
    return this.customerService.createCustomer(input);
  }

  @Query(() => [User], { name: 'users' })
  findAll() {
    return this.customerService.findAll();
  }

  @Query(() => LoginOutput, { name: 'login' })
  login(@Args('input') input: LoginInput): Promise<LoginOutput> {
    return this.customerService.loginCustomer(input);
  }

  @Mutation(() => User)
  updateUser(@Args('updateUserInput') updateUserInput: UpdateUserInput) {
    return this.customerService.update(updateUserInput.id, updateUserInput);
  }

  @Mutation(() => User)
  removeUser(@Args('id', { type: () => Int }) id: number) {
    return this.customerService.remove(id);
  }
}
