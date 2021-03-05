import { ObjectType, Field, InputType } from '@nestjs/graphql';
import { FILE } from 'dns';

@ObjectType()
export class BuyerType {
  @Field()
  id: string;

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
