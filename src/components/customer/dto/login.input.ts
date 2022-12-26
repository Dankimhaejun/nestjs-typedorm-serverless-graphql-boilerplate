import { InputType, PickType } from '@nestjs/graphql';
import { CreateCustomerInput } from 'src/components/customer/dto/create-customer.input';

@InputType()
export class LoginInput extends PickType(CreateCustomerInput, [
  'email',
  'password',
] as const) {}
