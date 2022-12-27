import { InputType, Field, registerEnumType } from '@nestjs/graphql';

export enum OauthPlatform {
  KAKAO = 'kakao',
  NAVER = 'naver',
  GOOGLE = 'google',
}

registerEnumType(OauthPlatform, {
  name: 'OauthPlatform',
  description: '현재 지원하는 소셜 로그인 플랫폼',
});

@InputType()
export class SignupUserByOauthInput {
  @Field()
  token: string;

  @Field(() => OauthPlatform)
  oauthPlatform: OauthPlatform;
}
