import { Injectable } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import { PassportStrategy } from "@nestjs/passport";
import { ApolloError } from "apollo-server-express";
import { ExtractJwt, Strategy } from "passport-jwt";

import { UserRepository } from "src/repositories/user.repository";

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor(
    configService: ConfigService,
    private userRepository: UserRepository
  ) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: true, // 아래 validate에서 exp 비교하기 위함
      secretOrKey: configService.get("JWT_ACCESS_TOKEN_SECRET"),
    });
  }

  async validate(payload: any) {
    const { sub, exp } = payload;
    const now = Math.floor(Date.now() / 1000);

    if (exp < now) {
      throw new ApolloError(
        "액세스 토큰의 유효기한이 만료되었습니다.",
        "ACCESS_TOKEN_EXPIRED"
      );
    }

    const user = await this.userRepository.findOneByPk(sub);

    if (!user) {
      throw new ApolloError("인증되지 않은 유저입니다.", "UNAUTHORIZED");
    }

    return user;
  }
}
