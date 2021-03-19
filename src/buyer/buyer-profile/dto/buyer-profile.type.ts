import { ObjectType, Field, InputType } from '@nestjs/graphql';
import { FILE } from 'dns';

@ObjectType()
export class BuyerProfileType {
  @Field()
  buyerId: number;

  @Field()
  firstNamePOC: string;

  @Field()
  lastNamePOC: string;

  @Field()
  address: string;

  @Field()
  city: string;

  @Field()
  state: string;

  @Field()
  pincode: string;

  @Field()
  gstin: string;

  @Field()
  gstVerified: Boolean;

  @Field()
  timestamp: string;

  @Field()
  lastModifiedTimestamp: string;
}
