import { ObjectType, Field, InputType } from '@nestjs/graphql';
import { FILE } from 'dns';

@InputType()
export class BuyerInput {
  @Field()
  phoneNumber: string;

  @Field()
  password: string;

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
