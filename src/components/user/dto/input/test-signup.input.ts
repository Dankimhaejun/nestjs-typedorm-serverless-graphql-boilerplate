import { InputType, Field } from "@nestjs/graphql";
import { IsPhoneNumber, Length } from "class-validator";
import { OauthPlatform } from "src/entities/user-signup-method.entity";

@InputType()
export class TestSignupInput {
  @Field(() => OauthPlatform)
  platform: OauthPlatform;

  @Field({ description: "플랫폼 별 로그인시 발급 받는 토큰" })
  accessToken: string;

  @Field()
  name: string;

  @IsPhoneNumber()
  @Field()
  phoneNumber: string;

  @Field()
  @Length(8, 8)
  birthDate: string;
}
