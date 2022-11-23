import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { DocumentClientV3 } from '@typedorm/document-client';
import { DynamoDBClient } from '@aws-sdk/client-dynamodb';
import { Organization } from './organization.entity';
import { config } from 'aws-sdk';
import { Table } from '@typedorm/common';
import {
  createConnection,
  EntityManager,
  getEntityManager,
} from '@typedorm/core';

const documentClient = new DocumentClientV3(new DynamoDBClient({}));

export const masterTable = new Table({
  name: 'master',
  partitionKey: 'PK',
  sortKey: 'SK',
});

export let entityManager: EntityManager = null;

async function bootstrap() {
  config.update({
    region: '--',
    accessKeyId: '--',
    secretAccessKey: '--',
    signatureVersion: '--',
  });

  createConnection({
    table: masterTable,
    name: 'default',
    entities: [Organization],
    documentClient,
  });

  entityManager = getEntityManager();

  const app = await NestFactory.create(AppModule);
  await app.listen(3000);
}

bootstrap();
