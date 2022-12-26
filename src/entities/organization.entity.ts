import { Field, ObjectType } from '@nestjs/graphql';
import {
  Attribute,
  Entity,
  AutoGenerateAttribute,
  INDEX_TYPE,
} from '@typedorm/common';
import { AUTO_GENERATE_ATTRIBUTE_STRATEGY } from '@typedorm/common';
import { masterTable } from 'src/databases/common/master.table';

@Entity({
  name: 'organization',
  table: masterTable,
  primaryKey: {
    partitionKey: 'ORG#{{id}}',
    sortKey: 'ORG#{{id}}',
  },
  indexes: {
    // specify GSI1 key - "GSI1" named global secondary index needs to exist in above table declaration
    GSI1: {
      partitionKey: 'ORG#{{id}}#STATUS#{{status}}',
      sortKey: 'ORG#{{id}}#ACTIVE#{{active}}',
      type: INDEX_TYPE.GSI,
    },
    // specify LSI1 key
    LSI1: {
      sortKey: 'TICKETS#CREATED_AT#{{createdAt}}',
      type: INDEX_TYPE.LSI,
    },
  },
})
@ObjectType()
export class Organization {
  @AutoGenerateAttribute({
    strategy: AUTO_GENERATE_ATTRIBUTE_STRATEGY.UUID4,
  })
  @Field()
  id: string;

  @Attribute()
  @Field()
  name: string;

  @Attribute()
  @Field()
  status: string;

  @Attribute({ default: true })
  @Field(() => Boolean)
  active: boolean;

  @AutoGenerateAttribute({
    strategy: AUTO_GENERATE_ATTRIBUTE_STRATEGY.EPOCH_DATE,
  })
  createdAt: number;

  @AutoGenerateAttribute({
    strategy: AUTO_GENERATE_ATTRIBUTE_STRATEGY.EPOCH_DATE,
    autoUpdate: true, // this will make this attribute and any indexes referencing it auto update for any write operation
  })
  updatedAt: number;
}
