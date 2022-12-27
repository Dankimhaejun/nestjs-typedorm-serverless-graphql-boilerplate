import { Module } from '@nestjs/common';
import { ClayfulCustomerService } from 'src/api/clayful/services/customer.service';

import { UserResolver } from './user.resolver';
import { UserService } from './user.service';

@Module({
  providers: [UserResolver, UserService, ClayfulCustomerService],
})
export class UserModule {}
