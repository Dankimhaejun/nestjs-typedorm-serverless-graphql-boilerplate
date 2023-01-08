import { Args, Mutation, Query, Resolver } from "@nestjs/graphql";

import { AuthService } from "src/auth/auth.service";
import { Public } from "src/auth/decorators/public.decorator";
import { CheckUserAlreadySignupInput } from "src/auth/dto/input/check-user-already-signup.input";
import { SigninUserByEmailInput } from "src/auth/dto/input/signin-user-by-email.input";
import { SigninUserByOauthInput } from "src/auth/dto/input/signin-user-by-oauth.input";
import { SignupUserByEmailInput } from "src/auth/dto/input/signup-user-by-email.input";
import { SignupUserByOauthInput } from "src/auth/dto/input/signup-user-by-oauth.input";
import { TokenOutput } from "src/auth/dto/output/token.output";
import { User } from "src/entities/user.entity";

@Public()
@Resolver()
export class AuthResolver {
  constructor(private readonly authService: AuthService) {}

  @Public()
  @Mutation(() => User, {
    name: "signupUserByEmail",
    description: "email기반 회원가입",
  })
  async signupUserByEmail(
    @Args("input") input: SignupUserByEmailInput
  ): Promise<User> {
    return this.authService.signupUserByEmail(input);
  }

  @Public()
  @Mutation(() => User, {
    name: "signupUserByOauth",
    description: "Oauth 기반 회원가입",
  })
  async signupUserByOauth(
    @Args("input") input: SignupUserByOauthInput
  ): Promise<User> {
    return this.authService.signupUserByOauth(input);
  }

  @Public()
  @Query(() => TokenOutput, {
    name: "signinUserByEmail",
    description: "email 로그인",
  })
  async signinUserByEmail(
    @Args("input") input: SigninUserByEmailInput
  ): Promise<TokenOutput> {
    return this.authService.signinUserByEmail(input);
  }

  @Public()
  @Query(() => TokenOutput, {
    name: "signinUserByOauth",
    description: "Oauth 로그인",
  })
  async signinUserByOauth(
    @Args("input") input: SigninUserByOauthInput
  ): Promise<TokenOutput> {
    return this.authService.signinUserByOauth(input);
  }

  @Public()
  @Query(() => String, {
    name: "checkUserAlreadySignup",
    description: "회원가입 여부 확인",
  })
  async checkUserAlreadySignup(
    @Args("input") input: CheckUserAlreadySignupInput
  ): Promise<string> {
    this.authService.checkUserAlreadySignup(input);
    return "hello";
  }
}
