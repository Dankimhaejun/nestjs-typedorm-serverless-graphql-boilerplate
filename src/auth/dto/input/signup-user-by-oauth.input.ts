import { Field, InputType } from "@nestjs/graphql";
import { IsPhoneNumber, Length } from "class-validator";

import { OauthPlatform } from "src/entities/user-signup-method.entity";

@InputType()
export class SignupUserByOauthInput {
  @Field(() => OauthPlatform)
  platform: OauthPlatform;

  @Field()
  oauthAccessToken: string;

  @Field()
  name: string;

  @IsPhoneNumber()
  @Field()
  phoneNumber: string;

  @Field()
  @Length(8, 8)
  birthDate: string;
}
