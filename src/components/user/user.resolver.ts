import { UseGuards } from "@nestjs/common";
import { Args, Mutation, Query, Resolver } from "@nestjs/graphql";

import { AuthUser } from "src/auth/decorators/auth-user.decorator";
import { JwtGqlAuthGuard } from "src/auth/guards/jwt-gql-auth.guard";
import { SendVerificationEmailInput } from "src/components/user/dto/input/send-verification-email.input";
import { VerifyEmailInput } from "src/components/user/dto/input/verify-email.input";
import { UserService } from "src/components/user/user.service";
import { User } from "src/entities/user.entity";

@Resolver(() => User)
export class UserResolver {
  constructor(private readonly userService: UserService) {}

  @UseGuards(JwtGqlAuthGuard)
  @Query(() => User, {
    name: "user",
    description: "액세스 토큰으로 유저 조회",
  })
  user(@AuthUser() user: User): User {
    console.log("user", user);
    return user;
  }

  @Query(() => Boolean, {
    name: "sendVerificationEmail",
    description: `고객 인증용 이메일을 발송 요청합니다.\nhttps://dev.clayful.io/ko/node/apis/customer/request-verification-email`,
  })
  sendVerificationEmail(
    @Args("input") input: SendVerificationEmailInput
  ): Promise<boolean> {
    return this.userService.sendVerificationEmailToUser(input);
  }

  @Mutation(() => Boolean, {
    name: "verifyEmail",
    description: `고객의 인증코드를 확인합니다.\nhttps://dev.clayful.io/ko/node/apis/customer/verify`,
  })
  verifyEmail(@Args("input") input: VerifyEmailInput): Promise<boolean> {
    return this.userService.verifyEmailBySecret(input);
  }
}
