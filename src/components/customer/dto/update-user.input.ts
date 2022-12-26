import { CreateCustomerInput } from './create-customer.input';
import { InputType, Field, Int, PartialType } from '@nestjs/graphql';

@InputType()
export class UpdateUserInput extends PartialType(CreateCustomerInput) {
  @Field(() => Int)
  id: number;
}
