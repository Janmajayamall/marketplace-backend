import { ObjectType, Field, InputType } from '@nestjs/graphql';

@ObjectType()
export class BuyerType {
  @Field()
  id: number;

  @Field()
  phoneNumber: string;

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
}
