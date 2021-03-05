import { ObjectType, Field, InputType } from '@nestjs/graphql';

@InputType()
export class ProductVariationInput {
  @Field()
  price: number;

  @Field()
  inStock: Boolean;

  @Field()
  colourId: number;
}
