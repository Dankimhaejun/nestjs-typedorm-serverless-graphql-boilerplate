import { ExecutionContext, Injectable } from "@nestjs/common";
import { Reflector } from "@nestjs/core";
import { GqlExecutionContext } from "@nestjs/graphql";
import { AuthGuard } from "@nestjs/passport";
import { ApolloError } from "apollo-server-express";

import { PUBLIC_KEY } from "src/auth/decorators/public.decorator";

@Injectable()
export class JwtGqlAuthGuard extends AuthGuard("jwt") {
  constructor(private reflector: Reflector) {
    super();
  }

  getRequest(context: ExecutionContext) {
    const ctx = GqlExecutionContext.create(context);

    return ctx.getContext().req;
  }

  handleRequest(err: any, user: any, info: any, context: any, status: any) {
    if (err || !user) {
      throw new ApolloError(
        "액세스 토큰이 유효하지 않습니다",
        "INVALID_ACCESS_TOKEN"
      );
    }

    return super.handleRequest(err, user, info, context, status);
  } // jwt.strategy.ts 내 super에서 검증 실패 시 에러 리턴

  canActivate(context: ExecutionContext) {
    const isPublic = this.reflector.getAllAndOverride<boolean>(PUBLIC_KEY, [
      context.getHandler(),
      context.getClass(),
    ]);

    if (isPublic) {
      return true;
    }

    return super.canActivate(context);
  }
}
