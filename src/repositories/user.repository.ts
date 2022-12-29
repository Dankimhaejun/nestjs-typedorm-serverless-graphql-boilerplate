import { Injectable } from "@nestjs/common";
import { EntityManager } from "@typedorm/core";

import { GSI1 } from "src/databases/typedorm.constants";
import { User } from "src/entities/user.entity";

@Injectable()
export class UserRepository {
  constructor(private entityManager: EntityManager) {}

  createNewEntity(
    id: string,
    name: string,
    phoneNumber: string,
    birthDate: string
  ): User {
    const newEntity = new User();
    newEntity.id = id;
    newEntity.name = name;
    newEntity.phoneNumber = phoneNumber;
    newEntity.birthDate = birthDate;

    return newEntity;
  }

  async create(
    id: string,
    name: string,
    phoneNumber: string,
    birthDate: string
  ) {
    const newEntity = this.createNewEntity(id, name, phoneNumber, birthDate);

    return this.entityManager.create<User>(newEntity);
  }

  async findFirstByGSI1(name: string, phoneNumber: string, birthDate: string) {
    return this.entityManager.find<User>(
      User,
      {
        name,
        phoneNumber,
        birthDate,
      },
      { queryIndex: GSI1, limit: 1 }
    );
  }
}
