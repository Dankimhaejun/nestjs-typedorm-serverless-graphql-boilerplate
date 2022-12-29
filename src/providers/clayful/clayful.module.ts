import {
  DynamicModule,
  Global,
  Logger,
  Module,
  OnModuleInit,
} from "@nestjs/common";
import { ApolloError } from "apollo-server-express";
import Clayful from "clayful";

import { CLAYFUL_CUSTOMER } from "src/providers/clayful";
import { ClayfulCustomerService } from "src/providers/clayful/services/clayful-customer.service";

export interface ConnectionOptions {
  /**
   * 클레이풀 비공개 클라이언트 키
   */
  clientKey: string;
}

// TODO: ConfigModule 사용가능한 dynamic module 구현하기 (현재는 process.env에서 바로 받아오고 있음)
@Global()
@Module({
  providers: [ClayfulCustomerService],
})
export class ClayfulModule implements OnModuleInit {
  private readonly logger = new Logger("ClayfulModule");

  static forRoot(options: ConnectionOptions): DynamicModule {
    const { clientKey } = options;

    if (!clientKey) {
      throw new ApolloError("클레이풀 클라이언트키 없음");
    }

    Clayful.config({
      client: clientKey,
    });

    const customerProvider = {
      provide: CLAYFUL_CUSTOMER,
      useValue: Clayful.Customer,
    };

    return {
      module: ClayfulModule,
      providers: [customerProvider],
      exports: [customerProvider],
    };
  }

  onModuleInit() {
    this.logger.log("The module has been initialized.");
  }
}
