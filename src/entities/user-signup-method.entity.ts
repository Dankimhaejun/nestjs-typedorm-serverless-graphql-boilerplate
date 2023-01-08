import { Field, ObjectType, registerEnumType } from "@nestjs/graphql";
import {
  Attribute,
  AUTO_GENERATE_ATTRIBUTE_STRATEGY,
  AutoGenerateAttribute,
  Entity,
  INDEX_TYPE,
} from "@typedorm/common";
import { IsUUID } from "class-validator";

import { masterTable } from "src/databases";
import { USER_SIGNUP_METHOD } from "src/entities/common/entity.constants";

export enum OauthPlatform {
  EMAIL = "email",
  KAKAO = "kakao",
  NAVER = "naver",
  GOOGLE = "google",
}

registerEnumType(OauthPlatform, {
  name: "OauthPlatform",
  description: "현재 지원하는 소셜 로그인 플랫폼",
});

@Entity<UserSignupMethod>({
  name: "UserSignupMethod",
  table: masterTable,
  primaryKey: {
    partitionKey: `${USER_SIGNUP_METHOD}#{{platform}}#{{key}}`,
    sortKey: `${USER_SIGNUP_METHOD}`,
  },
  indexes: {
    // specify GSI1 key - "GSI1" named global secondary index needs to exist in above table declaration
    GSI1: {
      type: INDEX_TYPE.GSI,
      partitionKey: `${USER_SIGNUP_METHOD}#{{userId}}`,
      sortKey: `{{createdAt}}`,
    },
  },
})
@ObjectType()
export class UserSignupMethod {
  @Attribute()
  @Field(() => OauthPlatform)
  platform: OauthPlatform;

  @Attribute()
  @Field({
    description: `platform이 email일 경우: email\n platform 이 email 이 아닐 경우: OauthId`,
  })
  key: string;

  @Attribute()
  @Field({
    nullable: true,
    description: `platform이 email일 경우 반드시 필요함`,
  })
  password?: string;

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
