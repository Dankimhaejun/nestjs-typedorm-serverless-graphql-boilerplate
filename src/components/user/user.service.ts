import { Injectable } from '@nestjs/common';
import { BatchManager, WriteBatch } from '@typedorm/core';
import { ApolloError } from 'apollo-server-express';
import axios from 'axios';
import { CreateUserInput } from 'src/components/user/dto/input/create-user.input';
import { LoginInput } from 'src/components/user/dto/input/login.input';
import { SendVerificationEmailInput } from 'src/components/user/dto/input/send-verification-email.input';
import { SignupUserByOauthInput } from 'src/components/user/dto/input/signup-user-by-oauth.input';
import { VerifyEmailInput } from 'src/components/user/dto/input/verify-email.input';
import { LoginOutput } from 'src/components/user/dto/output/login.output';
import { OauthPlatform } from 'src/entities/user-signup-method.entity';
import { ClayfulCustomerService } from 'src/providers/clayful/services/clayful-customer.service';
import { UserSignupMethodRepository } from 'src/repositories/user-signup-method.repository';
import { UserRepository } from 'src/repositories/user.repository';
import { v4 as uuid } from 'uuid';

import { TestSignupInput } from './dto/input/test-signup.input';

@Injectable()
export class UserService {
  constructor(
    private readonly clayfulCustomer: ClayfulCustomerService,
    private readonly userRepository: UserRepository,
    private readonly userSignupMethodRepository: UserSignupMethodRepository,
    private readonly batchManager: BatchManager,
  ) {}

  async createCustomer(input: CreateUserInput) {
    const { email, password } = input;

    try {
      const customer = await this.clayfulCustomer.createMe(email, password);
      console.log('customer', customer);
    } catch (err) {
      throw new ApolloError(err, 'CLAYFUL_API_ERROR');
    }

    return 'This action adds a new user';
  }

  findAll() {
    return `This action returns all user`;
  }

  async signUpCustomerByOauth(input: SignupUserByOauthInput) {
    const { token, oauthPlatform } = input;

    const { token: clayfulToken } =
      await this.clayfulCustomer.authenticateBy3rdParty(oauthPlatform, token);

    return clayfulToken;
  }

  async loginCustomer(input: LoginInput): Promise<LoginOutput> {
    const { email, password } = input;

    try {
      const { data } = await this.clayfulCustomer.authenticate(email, password);

      return {
        id: data.customer,
        token: data.token,
        expiresIn: data.expiresIn,
      };
    } catch (err) {
      throw new ApolloError(err, 'CLAYFUL_API_ERROR');
    }
  }

  async sendVerificationEmailToUser(
    input: SendVerificationEmailInput,
  ): Promise<boolean> {
    const { email } = input;

    return this.clayfulCustomer.requestVerificationEmail(email);
  }

  async verifyEmailBySecret(input: VerifyEmailInput): Promise<boolean> {
    const { customerId, secret } = input;

    return this.clayfulCustomer.verify(customerId, secret);
  }

  async testSignup(input: TestSignupInput): Promise<boolean> {
    const { platform, accessToken, name, birthDate, phoneNumber } = input;
    //1. platform, accessToken를 통해 각 플랫폼에서 인증 받은 id를 받는다.
    // (에러)토큰이 유효하지 않거나 만료기한 지났으면 에러

    const key = await this.getOauthIdByPlatformAccessToken(
      platform,
      accessToken,
    );

    //2. platform, id를 통해 회원가입한 이력이 있는지 확인한다.
    // (에러)이미 회원가입한 경우 에러 처리
    const userSignupMethod = await this.userSignupMethodRepository.findOneByPk(
      platform,
      key,
    );

    if (userSignupMethod) {
      throw new ApolloError(
        '이미 회원가입한 유저입니다. 다시 로그인을 시도해주세요',
      );
    }

    //3. name, birthDate, phoneNumber를 통해 이미 가입한 User인지 확인한다. (userId)
    const { items } = await this.userRepository.findFirstByGSI1(
      name,
      phoneNumber,
      birthDate,
    );

    //4. 이미 회원가입한 유저라면 UserSignupMethod만 추가한다.
    // <<종료>>
    if (items.length) {
      const [user] = items;
      await this.userSignupMethodRepository.create(platform, key, user.id);
      return true;
    }

    //5. 신규 유저라면 User, UserSignupMethod 테이블을 신규생성한다.
    const userId = uuid();
    const newUserEntity = this.userRepository.createNewEntity(
      userId,
      name,
      phoneNumber,
      birthDate,
    );

    const newUserSignupMethodEntity =
      this.userSignupMethodRepository.createNewEntity(platform, key, userId);

    const batchToWrite = new WriteBatch()
      .addCreateItem(newUserEntity)
      .addCreateItem(newUserSignupMethodEntity);
    console.log('this.batchManager', this.batchManager);
    const batchResponse = await this.batchManager.write(batchToWrite);
    console.log('batchResponse', batchResponse);
    return true;
  }

  private async getOauthIdByPlatformAccessToken(
    platform: OauthPlatform,
    accessToken: string,
  ): Promise<string> {
    switch (platform) {
      case OauthPlatform.GOOGLE: {
        const result = await axios.get(
          `https://www.googleapis.com/oauth2/v1/tokeninfo?access_token=${accessToken}`,
        );
        return result.data.user_id;
      }

      case OauthPlatform.KAKAO: {
        const result = await axios.get(`https://kapi.kakao.com/v2/user/me`, {
          headers: {
            Authorization: `Bearer ${accessToken}`,
            'Content-Type': 'application/x-www-form-urlencoded;charset=utf-8',
          },
        });
        return result.data.id;
      }

      case OauthPlatform.NAVER: {
        const result = await axios.get(`https://openapi.naver.com/v1/nid/me`, {
          headers: {
            Authorization: `Bearer ${accessToken}`,
          },
        });
        return result.data.response.id;
      }

      case OauthPlatform.EMAIL: {
        throw new ApolloError('EMAIL은 검증 대상이 아닙니다.');
      }
    }
  }
}
