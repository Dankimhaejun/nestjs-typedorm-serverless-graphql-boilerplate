import { Injectable } from '@nestjs/common';
import { ApolloError } from 'apollo-server-express';
import { ClayfulCustomerService } from 'src/api/clayful/services/customer.service';
import { CreateUserInput } from 'src/components/user/dto/input/create-user.input';
import { LoginInput } from 'src/components/user/dto/input/login.input';
import { SendVerificationEmailInput } from 'src/components/user/dto/input/send-verification-email.input';
import { SignupUserByOauthInput } from 'src/components/user/dto/input/signup-user-by-oauth.input';
import { VerifyEmailInput } from 'src/components/user/dto/input/verify-email.input';
import { LoginOutput } from 'src/components/user/dto/output/login.output';

@Injectable()
export class UserService {
  constructor(private readonly clayfulCustomer: ClayfulCustomerService) {}

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

    try {
      const { data } = await this.clayfulCustomer.authenticateBy3rdParty(
        oauthPlatform,
        token,
      );

      console.log('data', data);
      console.log('data.action', data.action);
    } catch (err) {
      console.log('err', err);
      throw new ApolloError(err, 'CLAYFUL_API_ERROR');
    }

    return 'hello';
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

    try {
      await this.clayfulCustomer.requestVerificationEmail(email);
    } catch (err) {
      throw new ApolloError(err, 'CLAYFUL_API_ERROR');
    }

    return true;
  }

  async verifyEmailBySecret(input: VerifyEmailInput): Promise<boolean> {
    const { customerId, secret } = input;

    return this.clayfulCustomer.verify(customerId, secret);
  }
}
