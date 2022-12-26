import { ArgsType, Field } from '@nestjs/graphql';

@ArgsType()
export class IdArgs {
  @Field()
  id: string;
}
