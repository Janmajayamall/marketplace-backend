import { ObjectType, Field, InputType } from '@nestjs/graphql';

@InputType()
export class BuyerProfileInput {
  @Field()
  buyerId: number;

  @Field()
  phoneNumber: string;

  @Field()
  firstNamePOC: string;

  @Field()
  lastNamePOC: string;
}
