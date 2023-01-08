import { Field, InputType } from "@nestjs/graphql";
import { IsEmail, IsPhoneNumber, Length } from "class-validator";

@InputType()
export class SignupUserByEmailInput {
  @IsEmail()
  @Field()
  email: string;

  @Field()
  password: string;

  @Field()
  name: string;

  @IsPhoneNumber()
  @Field()
  phoneNumber: string;

  @Field()
  @Length(8, 8)
  birthDate: string;
}
