import { Injectable } from "@nestjs/common";
import { EntityManager } from "@typedorm/core";

import { GSI1 } from "src/databases";
import {
  OauthPlatform,
  UserSignupMethod,
} from "src/entities/user-signup-method.entity";

@Injectable()
export class UserSignupMethodRepository {
  constructor(private entityManager: EntityManager) {}

  createNewEntity(platform: OauthPlatform, key: string, userId: string) {
    const newEntity = new UserSignupMethod();
    newEntity.platform = platform;
    newEntity.key = key;
    newEntity.userId = userId;

    return newEntity;
  }

  async create(platform: OauthPlatform, key: string, userId: string) {
    const newEntity = this.createNewEntity(platform, key, userId);

    return this.entityManager.create<UserSignupMethod>(newEntity);
  }

  async findOneByPk(platform: OauthPlatform, key: string) {
    return this.entityManager.findOne<UserSignupMethod>(UserSignupMethod, {
      platform,
      key,
    });
  }

  async findManyByUserId(userId: string, limit?: number, cursor?: string) {
    let parsedCursor;
    if (cursor) {
      parsedCursor = JSON.parse(cursor);
    }

    return this.entityManager.find<UserSignupMethod>(
      UserSignupMethod,
      {
        userId: userId,
      },
      { queryIndex: GSI1, cursor: parsedCursor, limit }
    );
  }
}
