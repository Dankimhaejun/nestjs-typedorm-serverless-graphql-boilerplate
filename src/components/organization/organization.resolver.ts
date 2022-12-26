import { Resolver, Query, Mutation, Args, Int } from '@nestjs/graphql';
import { OrganizationService } from './organization.service';

import { CreateOrganizationInput } from './dto/create-organization.input';
import { UpdateOrganizationInput } from './dto/update-organization.input';
import { Organization } from 'src/entities/organization.entity';
import { IdArgs } from 'src/common/dto/id.args';

@Resolver(() => Organization)
export class OrganizationResolver {
  constructor(private readonly organizationService: OrganizationService) { }

  @Mutation(() => Organization, { name: "createOrganization" })
  createOrganization(@Args('input') input: CreateOrganizationInput) {
    return this.organizationService.create(input);
  }

  @Query(() => [Organization], { name: 'organizations' })
  findAll() {
    return this.organizationService.findAll();
  }

  @Query(() => Organization, { name: 'organization' })
  organization(@Args() idArgs: IdArgs) {
    const { id } = idArgs
    return this.organizationService.findOne(id);
  }

  @Mutation(() => Organization)
  updateOrganization(@Args('updateOrganizationInput') updateOrganizationInput: UpdateOrganizationInput) {
    return this.organizationService.update(updateOrganizationInput.id, updateOrganizationInput);
  }

  @Mutation(() => Organization)
  removeOrganization(@Args('id', { type: () => Int }) id: number) {
    return this.organizationService.remove(id);
  }
}
