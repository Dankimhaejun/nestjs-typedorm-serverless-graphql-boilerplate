import { Field, InputType, PickType } from "@nestjs/graphql";

import { SignupUserByOauthInput } from "src/auth/dto/input/signup-user-by-oauth.input";

@InputType()
export class SigninUserByOauthInput extends PickType(SignupUserByOauthInput, [
  "platform",
] as const) {
  @Field({ description: "Oauth 로그인 방식을 통해 얻은 액세스 토큰" })
  oauthAccessToken: string;
}
