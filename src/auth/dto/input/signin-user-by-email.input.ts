import { InputType, PickType } from "@nestjs/graphql";

import { SignupUserByEmailInput } from "src/auth/dto/input/signup-user-by-email.input";

@InputType()
export class SigninUserByEmailInput extends PickType(SignupUserByEmailInput, [
  "email",
  "password",
] as const) {}
