import { Injectable } from '@nestjs/common';
import { ApolloError } from 'apollo-server-express';
import Clayful from 'clayful';

import { CreateCustomerInput } from './dto/create-customer.input';
import { LoginInput } from './dto/login.input';
import { LoginOutput } from './dto/login.output';
import { UpdateUserInput } from './dto/update-user.input';

Clayful.config({
  client:
    'eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJpZCI6IjkyYzRlZjdiYmQ3ZjViNzU3ODI5NTYyZTFmZTBlYjFlNTc4MTJmMzM5MzZkYTE1MGNkMzY5YTQzMThhOWE2OTQiLCJyb2xlIjoiY2xpZW50IiwiaWF0IjoxNjcyMDM3NTM5LCJzdG9yZSI6IlpSNllHTlpHVEc4TS5SUTJVVEpBOTlCUlMiLCJzdWIiOiJFQkxSV1RORUFGQlYifQ.XkW_5CjyCSqS1_F_z4AOqBH8WIQMBMzQ5Sqp-lLv_0w',
});

const Customer = Clayful.Customer;

@Injectable()
export class CustomerService {
  async createCustomer(input: CreateCustomerInput) {
    const payload = {
      email: input.email,
      password: input.password,
    };

    try {
      const customer = await Customer.createMe(payload);
      console.log('customer', customer);
    } catch (err) {
      console.log('err', err);
    }

    return 'This action adds a new user';
  }

  findAll() {
    return `This action returns all user`;
  }

  async loginCustomer(input: LoginInput): Promise<LoginOutput> {
    const { email, password } = input;
    const payload = { email, password };

    try {
      const { data } = await Customer.authenticate(payload);

      return {
        id: data.customer,
        token: data.token,
        expiresIn: data.expiresIn,
      };
    } catch (err) {
      if (err.code === 'not-existing-customer') {
        throw new ApolloError(err, 'NOT_EXIST_CUSTOMER');
      } else if (err.code === 'invalid-password') {
        throw new ApolloError(err, 'INVALID_PASSWORD');
      }

      throw new ApolloError(err);
    }
  }

  update(id: number, updateUserInput: UpdateUserInput) {
    return `This action updates a #${id} user`;
  }

  remove(id: number) {
    return `This action removes a #${id} user`;
  }
}
