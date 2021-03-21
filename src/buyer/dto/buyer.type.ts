import { ObjectType, Field, InputType } from '@nestjs/graphql';
import { FILE } from 'node:dns';

@ObjectType()
export class BuyerType {
  @Field()
  id: number;

  @Field()
  firstNamePOC: string;

  @Field()
  lastNamePOC: string;

  @Field()
  city: string;

  @Field()
  state: string;

  @Field()
  address: string;

  @Field()
  pincode: string;

  @Field()
  gstin: string;

  @Field()
  gstVerified: boolean;
}
