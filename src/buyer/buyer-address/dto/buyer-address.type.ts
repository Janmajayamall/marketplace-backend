import { Field, ObjectType } from '@nestjs/graphql';

@ObjectType()
export class BuyerAddressType {
  @Field()
  id: number;

  @Field()
  line1: string;

  @Field()
  pincode: string;

  @Field()
  city: string;

  @Field()
  state: string;

  @Field()
  buyerId: number;

  @Field()
  timestamp: string;
}
