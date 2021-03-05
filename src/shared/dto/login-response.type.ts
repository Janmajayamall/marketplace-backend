import { ObjectType, Field } from '@nestjs/graphql';
@ObjectType()
export class LoginResponseType {
  @Field()
  token: string;
}
