import { ObjectType, Field, InputType } from '@nestjs/graphql';

@InputType()
export class BuyerProfileInput {
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
}
