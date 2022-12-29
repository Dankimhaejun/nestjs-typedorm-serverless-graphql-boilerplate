import { InputType, PickType } from "@nestjs/graphql";
import { CreateUserInput } from "src/components/user/dto/input/create-user.input";

@InputType()
export class SendVerificationEmailInput extends PickType(CreateUserInput, [
  "email",
] as const) {}
