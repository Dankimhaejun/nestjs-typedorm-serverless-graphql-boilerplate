import { ApolloDriver, ApolloDriverConfig } from "@nestjs/apollo";
import { Module, ValidationPipe } from "@nestjs/common";
import { ConfigModule, ConfigService } from "@nestjs/config";
import { APP_GUARD, APP_PIPE } from "@nestjs/core";
import { GraphQLModule } from "@nestjs/graphql";

import { JwtGqlAuthGuard } from "src/auth/guards/jwt-gql-auth.guard";
import { UserModule } from "src/components/user/user.module";
import { masterTable, TypeDormModule } from "src/databases";
import { User } from "src/entities/user.entity";
import { UserSignupMethod } from "src/entities/user-signup-method.entity";
import { ClayfulModule } from "src/providers/clayful/clayful.module";

import { AuthModule } from "./auth/auth.module";

@Module({
  imports: [
    GraphQLModule.forRoot<ApolloDriverConfig>({
      driver: ApolloDriver,
      debug: true,
      playground: true,
      autoSchemaFile: true,
      introspection: true,
    }),
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: `.env.${process.env.SERVERLESS_ENV}`,
    }),

    TypeDormModule.forRootAsync({
      name: "default",
      inject: [ConfigService],
      useFactory: (configService: ConfigService) => {
        const region = configService.get<string>("REGION");
        const endpoint = configService.get<string>("ENDPOINT");

        return {
          table: masterTable,
          entities: [User, UserSignupMethod],
          region,
          endpoint,
        };
      },
    }),
    ClayfulModule.forRoot({
      clientKey: process.env.CLAYFUL_CLIENT_KEY,
    }),
    UserModule,
    AuthModule,
  ],
  providers: [
    { provide: APP_PIPE, useClass: ValidationPipe },
    { provide: APP_GUARD, useClass: JwtGqlAuthGuard }, // 전역에 인증 활성화, @Public() 데코레이터로 비활성화 가능
  ],
})
export class AppModule {}
