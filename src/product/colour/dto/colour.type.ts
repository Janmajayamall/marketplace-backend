import { ObjectType, Field } from '@nestjs/graphql';

@ObjectType()
export class ColourType {
  @Field()
  id: number;

  @Field()
  name: string;

  @Field()
  hexValue: string;
}
