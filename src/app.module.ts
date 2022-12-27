import { ApolloDriver, ApolloDriverConfig } from '@nestjs/apollo';
import { Module, ValidationPipe } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { APP_PIPE } from '@nestjs/core';
import { GraphQLModule } from '@nestjs/graphql';
import { TypeDormModule, masterTable } from 'src/databases';
import { Organization } from 'src/entities/organization.entity';

import { ClayfulModule } from './api/clayful/clayful.module';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { OrganizationModule } from './components/organization/organization.module';
import { UserModule } from './components/user/user.module';

@Module({
  imports: [
    GraphQLModule.forRoot<ApolloDriverConfig>({
      driver: ApolloDriver,
      debug: true,
      playground: true,
      autoSchemaFile: true,
    }),
    ConfigModule.forRoot({ isGlobal: true }),
    TypeDormModule.forRootAsync({
      name: 'default',
      inject: [ConfigService],
      useFactory: (configService: ConfigService) => {
        const region = configService.get<string>('REGION');

        return {
          table: masterTable,
          entities: [Organization],
          region,
        };
      },
    }),
    ClayfulModule.forRoot({
      clientKey: process.env.CLAYFUL_CLIENT_KEY,
    }),
    UserModule,
    OrganizationModule,
  ],
  controllers: [AppController],
  providers: [AppService, { provide: APP_PIPE, useClass: ValidationPipe }],
})
export class AppModule {}
