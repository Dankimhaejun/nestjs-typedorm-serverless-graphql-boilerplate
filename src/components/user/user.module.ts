import { Module } from "@nestjs/common";

import { ClayfulCustomerService } from "src/providers/clayful/services/clayful-customer.service";
import { UserRepository } from "src/repositories/user.repository";
import { UserSignupMethodRepository } from "src/repositories/user-signup-method.repository";

import { UserResolver } from "./user.resolver";
import { UserService } from "./user.service";

@Module({
  providers: [
    UserResolver,
    UserService,
    UserRepository,
    UserSignupMethodRepository,
    ClayfulCustomerService,
  ],
})
export class UserModule {}
