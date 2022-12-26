import { InputType, Field, Int, PartialType } from '@nestjs/graphql';

import { CreateCustomerInput } from './create-customer.input';

@InputType()
export class UpdateUserInput extends PartialType(CreateCustomerInput) {
  @Field(() => Int)
  id: number;
}
