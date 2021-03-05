import { ObjectType, Field, InputType } from '@nestjs/graphql';

@InputType()
export class ManufacturerInput {
  @Field()
  companyName: string;

  @Field()
  description: string;

  @Field()
  phoneNumber: string;

  @Field()
  password: string;

  @Field()
  firstNamePOC: string;

  @Field()
  lastNamePOC: string;
}
