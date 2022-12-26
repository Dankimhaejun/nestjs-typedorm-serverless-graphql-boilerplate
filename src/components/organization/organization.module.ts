import { Module } from '@nestjs/common';
import { OrganizationRepository } from 'src/components/organization/organization.repository';

import { OrganizationResolver } from './organization.resolver';
import { OrganizationService } from './organization.service';

@Module({
  providers: [
    OrganizationResolver,
    OrganizationService,
    OrganizationRepository,
  ],
})
export class OrganizationModule {}
