import { ApolloDriver, ApolloDriverConfig } from "@nestjs/apollo";
import { Module, ValidationPipe } from "@nestjs/common";
import { ConfigModule, ConfigService } from "@nestjs/config";
import { APP_PIPE } from "@nestjs/core";
import { GraphQLModule } from "@nestjs/graphql";

import { masterTable, TypeDormModule } from "src/databases";
import { User } from "src/entities/user.entity";
import { UserEmail } from "src/entities/user-email.entity";
import { UserSignupMethod } from "src/entities/user-signup-method.entity";

import { UserModule } from "./components/user/user.module";
import { ClayfulModule } from "./providers/clayful/clayful.module";
import { AppController } from "./app.controller";
import { AppService } from "./app.service";

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
          entities: [User, UserSignupMethod, UserEmail],
          region,
          endpoint,
        };
      },
    }),
    ClayfulModule.forRoot({
      clientKey: process.env.CLAYFUL_CLIENT_KEY,
    }),
    UserModule,
  ],
  controllers: [AppController],
  providers: [AppService, { provide: APP_PIPE, useClass: ValidationPipe }],
})
export class AppModule {}
