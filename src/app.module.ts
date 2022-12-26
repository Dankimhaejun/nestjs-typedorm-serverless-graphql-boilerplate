import { Module, ValidationPipe } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { OrganizationModule } from './components/organization/organization.module';
import { GraphQLModule } from '@nestjs/graphql';
import { ApolloDriver, ApolloDriverConfig } from '@nestjs/apollo';
import { Organization } from 'src/entities/organization.entity';
import { TypeDormModule, masterTable } from 'src/databases';
import { UserModule } from './components/customer/customer.module';
import { APP_PIPE } from '@nestjs/core';

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
      useFactory: async (configService: ConfigService) => {
        const region = configService.get<string>('REGION');

        return {
          table: masterTable,
          entities: [Organization],
          region,
        };
      },
    }),
    UserModule,
    OrganizationModule,
  ],
  controllers: [AppController],
  providers: [AppService, { provide: APP_PIPE, useClass: ValidationPipe }],
})
export class AppModule {}
