import { Resolver, Query, Mutation, Args } from '@nestjs/graphql';
import { SendVerificationEmailInput } from 'src/components/user/dto/input/send-verification-email.input';
import { SignupUserByOauthInput } from 'src/components/user/dto/input/signup-user-by-oauth.input';
import { VerifyEmailInput } from 'src/components/user/dto/input/verify-email.input';
import { LoginOutput } from 'src/components/user/dto/output/login.output';

import { CreateUserInput } from './dto/input/create-user.input';
import { LoginInput } from './dto/input/login.input';
import { User } from './entities/user.entity';
import { UserService } from './user.service';

@Resolver(() => User)
export class UserResolver {
  constructor(private readonly userService: UserService) {}

  @Query(() => LoginOutput, {
    name: 'login',
    description: '일반 로그인',
  })
  login(@Args('input') input: LoginInput): Promise<LoginOutput> {
    return this.userService.loginCustomer(input);
  }

  @Mutation(() => User, {
    name: 'createCustomer',
    description: '일반 회원가입',
  })
  createCustomer(@Args('input') input: CreateUserInput) {
    return this.userService.createCustomer(input);
  }

  @Mutation(() => String, {
    name: 'signUpCustomerByOauth',
    description: `고객을 외부 서비스(소셜) 계정을 통해 로그인 / 가입시킵니다.\nhttps://dev.clayful.io/ko/node/apis/customer/authenticate-by-3rd-party`,
  })
  signUpCustomerByOauth(@Args('input') input: SignupUserByOauthInput) {
    return this.userService.signUpCustomerByOauth(input);
  }

  @Query(() => Boolean, {
    name: 'sendVerificationEmail',
    description: `고객 인증용 이메일을 발송 요청합니다.\nhttps://dev.clayful.io/ko/node/apis/customer/request-verification-email`,
  })
  sendVerificationEmail(
    @Args('input') input: SendVerificationEmailInput,
  ): Promise<boolean> {
    return this.userService.sendVerificationEmailToUser(input);
  }

  @Mutation(() => Boolean, {
    name: 'verifyEmail',
    description: `고객의 인증코드를 확인합니다.\nhttps://dev.clayful.io/ko/node/apis/customer/verify`,
  })
  verifyEmail(@Args('input') input: VerifyEmailInput): Promise<boolean> {
    return this.userService.verifyEmailBySecret(input);
  }
}
