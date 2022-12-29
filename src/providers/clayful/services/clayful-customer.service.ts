import { Inject, Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { ApolloError } from 'apollo-server-express';
import { OauthPlatform } from 'src/entities/user-signup-method.entity';
import {
  CLAYFUL_API_ERROR,
  CLAYFUL_CUSTOMER,
  VERIFICATION_EMAIL_EXPIRES_IN,
} from 'src/providers/clayful/clayful.constants';
import { IClayfulCustomer } from 'src/providers/clayful/interfaces';

@Injectable()
export class ClayfulCustomerService {
  constructor(
    @Inject(CLAYFUL_CUSTOMER)
    private readonly customerService: IClayfulCustomer,
    private readonly configService: ConfigService,
  ) {}

  async authenticate(email: string, password: string) {
    const payload = { email, password };
    return this.customerService.authenticate(payload);
  }

  async authenticateBy3rdParty(oauthPlatform: OauthPlatform, token: string) {
    const payload = { token };

    try {
      const { data } = await this.customerService.authenticateBy3rdParty(
        oauthPlatform,
        payload,
      );

      return data;
    } catch (err) {
      console.log('err', err);
      throw new ApolloError(err, CLAYFUL_API_ERROR);
    }
  }

  async createMe(email: string, password: string) {
    const payload = { email, password };
    return this.customerService.createMe(payload);
  }

  async requestVerificationEmail(email: string): Promise<boolean> {
    const expiresIn = this.configService.getOrThrow<number>(
      VERIFICATION_EMAIL_EXPIRES_IN,
    );

    const payload = {
      email,
      expiresIn,
      scope: 'verification' as const,
    };

    try {
      await this.customerService.requestVerificationEmail(payload);

      return true;
    } catch (err) {
      console.log('err', err);
      throw new ApolloError(err, CLAYFUL_API_ERROR);
    }
  }

  async verify(customerId: string, secret: string): Promise<boolean> {
    const payload = { secret };

    try {
      const { data } = await this.customerService.verify(customerId, payload);
      return data.verified;
    } catch (err) {
      const status = err.status;

      if (status === 400) {
        throw new ApolloError(err, CLAYFUL_API_ERROR, {
          detailCode: 'INVALID_INPUT',
        });
      }

      if (status === 401) {
        throw new ApolloError(err, CLAYFUL_API_ERROR, {
          detailCode: 'EXPIRED_VERIFICATION',
        });
      }

      throw new ApolloError(err, CLAYFUL_API_ERROR);
    }
  }
}
