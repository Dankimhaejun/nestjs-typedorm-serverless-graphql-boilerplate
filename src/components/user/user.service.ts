import { Injectable } from "@nestjs/common";
import { BatchManager, WriteBatch } from "@typedorm/core";
import { ApolloError } from "apollo-server-express";
import axios from "axios";
import { v4 as uuid } from "uuid";

import { CreateUserInput } from "src/components/user/dto/input/create-user.input";
import { LoginInput } from "src/components/user/dto/input/login.input";
import { SendVerificationEmailInput } from "src/components/user/dto/input/send-verification-email.input";
import { SignupUserByOauthInput } from "src/components/user/dto/input/signup-user-by-oauth.input";
import { TestSignupInput } from "src/components/user/dto/input/test-signup.input";
import { VerifyEmailInput } from "src/components/user/dto/input/verify-email.input";
import { LoginOutput } from "src/components/user/dto/output/login.output";
import { OauthPlatform } from "src/entities/user-signup-method.entity";
import { ClayfulCustomerService } from "src/providers/clayful/services/clayful-customer.service";
import { UserRepository } from "src/repositories/user.repository";
import { UserSignupMethodRepository } from "src/repositories/user-signup-method.repository";

@Injectable()
export class UserService {
  constructor(
    private readonly clayfulCustomer: ClayfulCustomerService,
    private readonly userRepository: UserRepository,
    private readonly userSignupMethodRepository: UserSignupMethodRepository,
    private readonly batchManager: BatchManager
  ) {}

  async createCustomer(input: CreateUserInput) {
    const { email, password } = input;

    try {
      const customer = await this.clayfulCustomer.createMe(email, password);
      console.log("customer", customer);
    } catch (err) {
      throw new ApolloError(err, "CLAYFUL_API_ERROR");
    }

    return "This action adds a new user";
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
      throw new ApolloError(err, "CLAYFUL_API_ERROR");
    }
  }

  async sendVerificationEmailToUser(
    input: SendVerificationEmailInput
  ): Promise<boolean> {
    const { email } = input;

    return this.clayfulCustomer.requestVerificationEmail(email);
  }

  async verifyEmailBySecret(input: VerifyEmailInput): Promise<boolean> {
    const { customerId, secret } = input;

    return this.clayfulCustomer.verify(customerId, secret);
  }
}
