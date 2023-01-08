import { Module } from "@nestjs/common";
import { JwtModule } from "@nestjs/jwt";
import { PassportModule } from "@nestjs/passport";

import { AuthResolver } from "src/auth/auth.resolver";
import { AuthService } from "src/auth/auth.service";
import { JwtStrategy } from "src/auth/strategies/jwt.strategy";
import { ClayfulCustomerService } from "src/providers/clayful/services/clayful-customer.service";
import { UserRepository } from "src/repositories/user.repository";
import { UserSignupMethodRepository } from "src/repositories/user-signup-method.repository";

@Module({
  imports: [
    PassportModule.register({ defaultStrategy: "jwt", session: false }),
    JwtModule.register({}),
  ],
  providers: [
    AuthResolver,
    AuthService,
    JwtStrategy,
    ClayfulCustomerService,
    UserRepository,
    UserSignupMethodRepository,
  ],
})
export class AuthModule {}
