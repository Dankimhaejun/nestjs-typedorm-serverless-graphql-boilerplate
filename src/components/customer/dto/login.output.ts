import { Field, Int, ObjectType } from '@nestjs/graphql';

@ObjectType()
export class LoginOutput {
  @Field({ description: '클레이풀 고유 id' })
  id: string;

  @Field({ description: '고객 인증 토큰' })
  token: string;

  @Field(() => Int, { description: '토큰 만료 기한' })
  expiresIn: number;
}
