import { InputType, Field } from '@nestjs/graphql';
import { IsEmail, MinLength } from 'class-validator';

@InputType()
export class CreateCustomerInput {
  // @Field()
  // userId: string;

  @Field()
  @IsEmail()
  email: string;

  @Field()
  @MinLength(8)
  password: string;
}
