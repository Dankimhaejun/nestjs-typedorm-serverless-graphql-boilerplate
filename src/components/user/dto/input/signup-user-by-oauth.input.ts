import { InputType, Field } from '@nestjs/graphql';
import { OauthPlatform } from 'src/entities/user-signup-method.entity';

@InputType()
export class SignupUserByOauthInput {
  @Field()
  token: string;

  @Field(() => OauthPlatform)
  oauthPlatform: OauthPlatform;
}
