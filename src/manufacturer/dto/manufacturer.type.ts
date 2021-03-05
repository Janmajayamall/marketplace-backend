import { ObjectType, Field, InputType } from '@nestjs/graphql';

@ObjectType()
export class ManufacturerType {
  @Field()
  id: string;

  @Field()
  companyName: string;

  @Field()
  description: string;

  @Field()
  phoneNumber: string;

  @Field()
  firstNamePOC: string;

  @Field()
  lastNamePOC: string;
}
