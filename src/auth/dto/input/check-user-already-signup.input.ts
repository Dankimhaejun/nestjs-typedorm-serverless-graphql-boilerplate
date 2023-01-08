import { Field, InputType } from "@nestjs/graphql";

import { OauthPlatform } from "src/entities/user-signup-method.entity";

@InputType()
export class CheckUserAlreadySignupInput {
  @Field(() => OauthPlatform)
  platform: OauthPlatform;

  @Field()
  emailOrOauthAccessToken: string;
}
