import { Field, InputType } from "@nestjs/graphql";

@InputType()
export class VerifyEmailInput {
  @Field({ description: "이메일 인증시 받은 클레이풀 고유 유저 아이디" })
  customerId: string;

  @Field({ description: "이메일 인증시 받은 비밀키" })
  secret: string;
}
