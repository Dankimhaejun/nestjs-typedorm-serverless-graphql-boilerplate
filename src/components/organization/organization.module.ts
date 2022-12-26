import { Module } from '@nestjs/common';
import { OrganizationService } from './organization.service';
import { OrganizationResolver } from './organization.resolver';
import { OrganizationRepository } from 'src/components/organization/organization.repository';

@Module({
  providers: [
    OrganizationResolver,
    OrganizationService,
    OrganizationRepository,
  ],
})
export class OrganizationModule {}
