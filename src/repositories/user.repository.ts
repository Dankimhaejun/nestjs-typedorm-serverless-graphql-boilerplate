import { Injectable } from "@nestjs/common";
import { EntityManager } from "@typedorm/core";

import { GSI1 } from "src/databases";
import { User, UserStatus } from "src/entities/user.entity";

@Injectable()
export class UserRepository {
  constructor(private entityManager: EntityManager) {}

  createNewEntity(
    id: string,
    name: string,
    phoneNumber: string,
    birthDate: string,
    clayfulId: string,
    status: UserStatus,
    email?: string
  ): User {
    const newEntity = new User();
    newEntity.id = id;
    newEntity.name = name;
    newEntity.phoneNumber = phoneNumber;
    newEntity.birthDate = birthDate;
    newEntity.clayfulId = clayfulId;
    newEntity.status = status;

    if (email) {
      newEntity.email = email;
    }

    return newEntity;
  }

  async create(
    id: string,
    name: string,
    phoneNumber: string,
    birthDate: string,
    clayfulId: string,
    status: UserStatus,
    email?: string
  ) {
    const newEntity = this.createNewEntity(
      id,
      name,
      phoneNumber,
      birthDate,
      clayfulId,
      status,
      email
    );

    return this.entityManager.create<User>(newEntity);
  }

  async findOneByPk(id: string): Promise<User> {
    return this.entityManager.findOne(User, { id });
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
