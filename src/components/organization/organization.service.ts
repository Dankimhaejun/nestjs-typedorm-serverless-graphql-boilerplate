import { Injectable } from '@nestjs/common';
import { OrganizationRepository } from 'src/components/organization/organization.repository';
import { Organization } from 'src/entities/organization.entity';

import { CreateOrganizationInput } from './dto/create-organization.input';
import { UpdateOrganizationInput } from './dto/update-organization.input';

@Injectable()
export class OrganizationService {
  constructor(
    private readonly organizationRepository: OrganizationRepository,
  ) {}
  create(input: CreateOrganizationInput): Promise<Organization> {
    return this.organizationRepository.createOne(input.name, input.status);
  }

  findAll() {
    return `This action returns all organization`;
  }

  findOne(id: string) {
    return this.organizationRepository.findOne(id);
  }

  update(id: number, updateOrganizationInput: UpdateOrganizationInput) {
    return `This action updates a #${id} organization`;
  }

  remove(id: number) {
    return `This action removes a #${id} organization`;
  }
}
