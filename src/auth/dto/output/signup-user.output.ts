import { Field, ObjectType } from "@nestjs/graphql";

@ObjectType()
export class SignupUserOutput {
  @Field()
  accessToken: string;

  @Field()
  refreshToken: string;
}
