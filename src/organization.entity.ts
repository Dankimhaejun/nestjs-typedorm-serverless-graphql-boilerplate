import {
  AutoGenerateAttribute,
  AUTO_GENERATE_ATTRIBUTE_STRATEGY,
  Entity,
  Attribute,
} from '@typedorm/common';
import { masterTable } from './main';

@Entity({
  table: masterTable,
  name: 'organization',
  primaryKey: {
    partitionKey: 'ORG',
    sortKey: '{{orgId}}',
  },
})
export class Organization {
  @AutoGenerateAttribute({
    strategy: AUTO_GENERATE_ATTRIBUTE_STRATEGY.UUID4,
  })
  orgId: string;
  @Attribute()
  name: string;
  @Attribute()
  street: string;
  @Attribute()
  city: string;
  @Attribute()
  zip: string;
  @Attribute()
  country: string;
  @AutoGenerateAttribute({
    strategy: AUTO_GENERATE_ATTRIBUTE_STRATEGY.ISO_DATE,
    autoUpdate: true,
  })
  updatedAt: number;
}
