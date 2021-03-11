import { ObjectType, Field, InputType } from '@nestjs/graphql';

@ObjectType()
export class ProductCategoryType {
  @Field()
  id: number;

  @Field()
  name: string;

  @Field()
  timestamp: string;
}
