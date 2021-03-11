import { ObjectType, Field, InputType, Int } from '@nestjs/graphql';

@InputType()
export class ProductVariationInput {
  @Field()
  price: number;

  @Field()
  inStock: Boolean;

  @Field()
  colourHexCode: string;

  @Field((type) => Int)
  rChannel: number;

  @Field((type) => Int)
  gChannel: number;

  @Field((type) => Int)
  bChannel: number;
}
