import { Field, ObjectType } from '@nestjs/graphql';
import {
  Attribute,
  Entity,
  AutoGenerateAttribute,
  AUTO_GENERATE_ATTRIBUTE_STRATEGY,
} from '@typedorm/common';
import { IsEmail, IsUUID } from 'class-validator';
import { masterTable } from 'src/databases';
import { USER_EMAIL } from 'src/entities/entity.constants';

@Entity({
  name: 'UserEmail',
  table: masterTable,
  primaryKey: {
    partitionKey: `${USER_EMAIL}#USER_ID#{{userId}}#EMAIL#{{email}}`,
    sortKey: USER_EMAIL,
  },
})
@ObjectType()
export class UserEmail {
  @Attribute()
  @IsEmail()
  @Field()
  email: string;

  @Attribute()
  @IsUUID()
  @Field()
  userId: string;

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
