import { ObjectType, Field, InputType } from '@nestjs/graphql';
import { FILE } from 'dns';

@ObjectType()
export class BuyerProfileType {
  @Field()
  id: number;

  @Field()
  phoneNumber: string;

  @Field()
  firstNamePOC: string;

  @Field()
  lastNamePOC: string;

  @Field()
  timestamp: string;
}
