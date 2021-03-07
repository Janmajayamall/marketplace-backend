import { Field, InputType } from '@nestjs/graphql';

@InputType()
export class BuyerAddressInput {
  @Field()
  line1: string;

  @Field()
  pincode: string;

  @Field()
  city: string;

  @Field()
  state: string;
}
