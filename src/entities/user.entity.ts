import { Field, ObjectType, registerEnumType } from "@nestjs/graphql";
import {
  Attribute,
  AUTO_GENERATE_ATTRIBUTE_STRATEGY,
  AutoGenerateAttribute,
  Entity,
  INDEX_TYPE,
} from "@typedorm/common";
import { IsEmail, IsPhoneNumber, IsUUID, Length } from "class-validator";

import { masterTable } from "src/databases";
import { USER } from "src/entities/common/entity.constants";

export enum UserStatus {
  ACTIVE = "ACTIVE",
}

registerEnumType(UserStatus, { name: "UserStatus" });

@Entity<User>({
  name: "User",
  table: masterTable,
  primaryKey: {
    partitionKey: `${USER}#{{id}}`,
    sortKey: `${USER}`,
  },
  indexes: {
    // specify GSI1 key - "GSI1" named global secondary index needs to exist in above table declaration
    GSI1: {
      type: INDEX_TYPE.GSI,
      partitionKey: `${USER}#{{name}}#{{phoneNumber}}#{{birthDate}}`,
      sortKey: `${USER}`,
    },
  },
})
@ObjectType()
export class User {
  @Attribute()
  @Field()
  @IsUUID()
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

  @Attribute()
  @IsUUID()
  @Field()
  clayfulId: string;

  @Attribute()
  @Field(() => UserStatus, { name: "UserStatus" })
  status: UserStatus;

  @Attribute()
  @IsEmail()
  @Field({ nullable: true })
  email?: string;

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
