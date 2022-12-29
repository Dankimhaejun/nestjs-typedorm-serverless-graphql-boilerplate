import { Field, ObjectType } from '@nestjs/graphql';
import {
  Attribute,
  Entity,
  AutoGenerateAttribute,
  INDEX_TYPE,
  AUTO_GENERATE_ATTRIBUTE_STRATEGY,
} from '@typedorm/common';
import { IsPhoneNumber, Length } from 'class-validator';
import { masterTable } from 'src/databases';
import { USER } from 'src/entities/entity.constants';

@Entity({
  name: 'User',
  table: masterTable,
  primaryKey: {
    partitionKey: `${USER}#{{id}}`,
    sortKey: USER,
  },
  indexes: {
    // specify GSI1 key - "GSI1" named global secondary index needs to exist in above table declaration
    GSI1: {
      partitionKey: `${USER}#NAME#{{name}}#PHONE_NUMBER#{{phoneNumber}}#BIRTH_DATE#{{birthDate}}`,
      sortKey: USER,
      type: INDEX_TYPE.GSI,
    },
  },
})
@ObjectType()
export class User {
  @Attribute()
  @Field()
  id: string;

  @Attribute()
  @Field()
  name: string;

  @Attribute()
  @IsPhoneNumber()
  @Field()
  phoneNumber: string;

  @Attribute()
  @Length(8, 8)
  @Field()
  birthDate: string;

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
