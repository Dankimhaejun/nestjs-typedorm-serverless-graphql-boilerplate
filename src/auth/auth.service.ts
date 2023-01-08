import { Injectable } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import { JwtService } from "@nestjs/jwt";
import { BatchManager, WriteBatch } from "@typedorm/core";
import { ApolloError } from "apollo-server-express";
import axios from "axios";
import bcrypt from "bcrypt";
import { v4 as uuid } from "uuid";

import { CheckUserAlreadySignupInput } from "src/auth/dto/input/check-user-already-signup.input";
import { SigninUserByEmailInput } from "src/auth/dto/input/signin-user-by-email.input";
import { SigninUserByOauthInput } from "src/auth/dto/input/signin-user-by-oauth.input";
import { SignupUserByEmailInput } from "src/auth/dto/input/signup-user-by-email.input";
import { SignupUserByOauthInput } from "src/auth/dto/input/signup-user-by-oauth.input";
import { TokenOutput } from "src/auth/dto/output/token.output";
import { IPayload } from "src/auth/interfaces/payload.interface";
import { User, UserStatus } from "src/entities/user.entity";
import { OauthPlatform } from "src/entities/user-signup-method.entity";
import { CLAYFUL_API_ERROR } from "src/providers/clayful";
import { ClayfulCustomerService } from "src/providers/clayful/services/clayful-customer.service";
import { UserRepository } from "src/repositories/user.repository";
import { UserSignupMethodRepository } from "src/repositories/user-signup-method.repository";

@Injectable()
export class AuthService {
  constructor(
    private readonly configService: ConfigService,
    private readonly jwtService: JwtService,
    private readonly batchManager: BatchManager,
    private readonly clayfulCustomerService: ClayfulCustomerService,
    private readonly userRepository: UserRepository,
    private readonly userSignupMethodRepository: UserSignupMethodRepository
  ) {}

  async signupUserByEmail(input: SignupUserByEmailInput): Promise<User> {
    const { email, password, name, phoneNumber, birthDate } = input;

    const alreadySignup: boolean = await this.checkUserAlreadySignup({
      platform: OauthPlatform.EMAIL,
      emailOrOauthAccessToken: email,
    });

    if (alreadySignup) {
      throw new ApolloError("이미 가입한 유저입니다.", "ALREADY_SIGNUP");
    }

    //3. name, birthDate, phoneNumber를 통해 이미 가입한 User인지 확인한다. (userId)
    const { items } = await this.userRepository.findFirstByGSI1(
      name,
      phoneNumber,
      birthDate
    );

    //4. 이미 회원가입한 유저라면 UserSignupMethod만 추가한다.
    // <<종료>>
    const hashPassword = await this.hashPassword(password);

    if (items.length) {
      const [user] = items;

      await this.userSignupMethodRepository.create(
        OauthPlatform.EMAIL,
        email,
        user.id,
        hashPassword
      );

      return this.userRepository.findOneByPk(user.id);
    }

    //5. 신규 유저라면 User, UserSignupMethod, UserEmail 테이블을 신규생성한다.

    //5-1. clayful에 신규 유저를 생성한다.
    const clayfulId = this.generateClayfulId();
    const clayfulPassword = this.configService.get<string>("CLAYFUL_PASSWORD");

    try {
      await this.clayfulCustomerService.createMe(clayfulId, clayfulPassword);
    } catch (err) {
      throw new ApolloError(err, CLAYFUL_API_ERROR);
    }

    const userId = uuid();
    const newUserEntity = this.userRepository.createNewEntity(
      userId,
      name,
      phoneNumber,
      birthDate,
      clayfulId,
      UserStatus.ACTIVE,
      email
    );

    const newUserSignupMethodEntity =
      this.userSignupMethodRepository.createNewEntity(
        OauthPlatform.EMAIL,
        email,
        userId,
        hashPassword
      );

    const batchToWrite = new WriteBatch()
      .addCreateItem(newUserEntity)
      .addCreateItem(newUserSignupMethodEntity);

    console.log("batchToWrite", batchToWrite);
    const batchResponse = await this.batchManager.write(batchToWrite);
    console.log("batchResponse", batchResponse);

    return this.userRepository.findOneByPk(userId);
  }

  async signupUserByOauth(input: SignupUserByOauthInput): Promise<User> {
    const { platform, oauthAccessToken, name, phoneNumber, birthDate } = input;

    if (platform === OauthPlatform.EMAIL) {
      throw new ApolloError("이메일은 허용되지 않습니다.");
    }

    const key = await this.getOauthIdByPlatformAccessToken(
      platform,
      oauthAccessToken
    );

    const userSignupMethod = await this.userSignupMethodRepository.findOneByPk(
      platform,
      key
    );

    if (userSignupMethod) {
      throw new ApolloError("이미 가입한 유저입니다.", "ALREADY_SIGNUP");
    }

    const { items } = await this.userRepository.findFirstByGSI1(
      name,
      phoneNumber,
      birthDate
    );

    if (items.length) {
      const [user] = items;

      await this.userSignupMethodRepository.create(platform, key, user.id);

      return this.userRepository.findOneByPk(user.id);
    }

    //5. 신규 유저라면 User, UserSignupMethod 테이블을 신규생성한다.
    //5-1. clayful에 신규 유저를 생성한다.
    const clayfulId = this.generateClayfulId();
    const clayfulPassword = this.configService.get<string>("CLAYFUL_PASSWORD");

    try {
      await this.clayfulCustomerService.createMe(clayfulId, clayfulPassword);
    } catch (err) {
      throw new ApolloError(err, CLAYFUL_API_ERROR);
    }

    const userId = uuid();
    const newUserEntity = this.userRepository.createNewEntity(
      userId,
      name,
      phoneNumber,
      birthDate,
      clayfulId,
      UserStatus.ACTIVE
    );

    const newUserSignupMethodEntity =
      this.userSignupMethodRepository.createNewEntity(platform, key, userId);

    const batchToWrite = new WriteBatch()
      .addCreateItem(newUserEntity)
      .addCreateItem(newUserSignupMethodEntity);

    const batchResponse = await this.batchManager.write(batchToWrite);
    console.log("batchResponse", batchResponse);

    return this.userRepository.findOneByPk(userId);
  }

  async signinUserByEmail(input: SigninUserByEmailInput): Promise<TokenOutput> {
    const { email, password } = input;

    const userSignupMethod = await this.userSignupMethodRepository.findOneByPk(
      OauthPlatform.EMAIL,
      email
    );

    if (!userSignupMethod) {
      throw new ApolloError("가입하지 않은 유저입니다.");
    }

    const isValidPassword = await this.isValidPassword(
      password,
      userSignupMethod.password
    );

    if (!isValidPassword) {
      throw new ApolloError("비밀번호가 불일치합니다.", "INVALID_PASSWORD");
    }

    const payload = { sub: userSignupMethod.userId };
    const accessToken = this.signAccessToken(payload);
    const refreshToken = this.signRefreshToken(payload);

    return { accessToken, refreshToken };
  }

  async signinUserByOauth(input: SigninUserByOauthInput): Promise<TokenOutput> {
    const { platform, oauthAccessToken } = input;

    const key = await this.getOauthIdByPlatformAccessToken(
      platform,
      oauthAccessToken
    );

    const userSignupMethod = await this.userSignupMethodRepository.findOneByPk(
      platform,
      key
    );

    if (!userSignupMethod) {
      throw new ApolloError("가입하지 않은 유저입니다.");
    }

    const payload = { sub: userSignupMethod.userId };
    const accessToken = this.signAccessToken(payload);
    const refreshToken = this.signRefreshToken(payload);

    return { accessToken, refreshToken };
  }

  async checkUserAlreadySignup(
    input: CheckUserAlreadySignupInput
  ): Promise<boolean> {
    const { platform, emailOrOauthAccessToken } = input;

    if (platform === OauthPlatform.EMAIL) {
      const userSignupMethod =
        await this.userSignupMethodRepository.findOneByPk(
          platform,
          emailOrOauthAccessToken
        );

      if (userSignupMethod) {
        return true;
      }

      return false;
    }

    const key = await this.getOauthIdByPlatformAccessToken(
      platform,
      emailOrOauthAccessToken
    );

    const userSignupMethod = await this.userSignupMethodRepository.findOneByPk(
      platform,
      key
    );

    if (userSignupMethod) {
      return true;
    }

    return false;
  }

  private generateClayfulId(): string {
    return uuid().split("-").join("");
  }

  private async hashPassword(password: string): Promise<string> {
    const saltRounds = Number(this.configService.get<string>("SALT_ROUNDS"));
    return bcrypt.hash(password, saltRounds);
  }

  private signAccessToken(payload: IPayload): string {
    return this.jwtService.sign(payload, {
      secret: this.configService.get("JWT_ACCESS_TOKEN_SECRET"),
      expiresIn: this.configService.get("JWT_ACCESS_TOKEN_EXPIRES_IN"),
    });
  }

  private signRefreshToken(payload: IPayload): string {
    return this.jwtService.sign(payload, {
      secret: this.configService.get("JWT_REFRESH_TOKEN_SECRET"),
      expiresIn: this.configService.get("JWT_REFRESH_TOKEN_EXPIRES_IN"),
    });
  }

  private async isValidPassword(
    password: string,
    hashPassword: string
  ): Promise<boolean> {
    return bcrypt.compare(password, hashPassword);
  }

  private async getOauthIdByPlatformAccessToken(
    platform: OauthPlatform,
    accessToken: string
  ): Promise<string> {
    switch (platform) {
      case OauthPlatform.GOOGLE: {
        try {
          const result = await axios.get(
            `https://www.googleapis.com/oauth2/v1/tokeninfo?access_token=${accessToken}`
          );

          return result.data.user_id;
        } catch (err) {
          throw new ApolloError(err, "AXIOS_CALL_ERROR");
        }
      }

      case OauthPlatform.KAKAO: {
        try {
          const result = await axios.get(`https://kapi.kakao.com/v2/user/me`, {
            headers: {
              Authorization: `Bearer ${accessToken}`,
              "Content-Type": "application/x-www-form-urlencoded;charset=utf-8",
            },
          });
          return result.data.id;
        } catch (err) {
          throw new ApolloError(err, "AXIOS_CALL_ERROR");
        }
      }

      case OauthPlatform.NAVER: {
        try {
          const result = await axios.get(
            `https://openapi.naver.com/v1/nid/me`,
            {
              headers: {
                Authorization: `Bearer ${accessToken}`,
              },
            }
          );

          return result.data.response.id;
        } catch (err) {
          throw new ApolloError(err, "AXIOS_CALL_ERROR");
        }
      }

      case OauthPlatform.EMAIL: {
        throw new ApolloError("EMAIL은 검증 대상이 아닙니다.");
      }

      default: {
        throw new ApolloError("유효하지 않은 요청입니다.", "INVALID_INPUT");
      }
    }
  }
}
