import { Injectable } from '@nestjs/common';
import { EntityManager } from '@typedorm/core';
import { Organization } from 'src/entities/organization.entity';

@Injectable()
export class OrganizationRepository {
  constructor(private entityManager: EntityManager) {}

  async createOne(name: string, status: string): Promise<Organization> {
    const organisation = new Organization();
    organisation.name = name;
    organisation.status = status;

    return this.entityManager.create(organisation);
  }

  async findOne(id): Promise<Organization> {
    try {
      const result = await this.entityManager.findOne(Organization, { id });
      return result;
    } catch (err) {
      throw new Error(err);
    }
  }
}
