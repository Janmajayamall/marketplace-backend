import { ObjectType, Field, InputType, Int } from '@nestjs/graphql';
import { ColourType } from 'src/product/colour/dto/colour.type';

@ObjectType()
export class ProductVariationType {
  @Field()
  id: number;

  @Field()
  colourHexCode: string;

  @Field()
  price: number;

  @Field()
  inStock: Boolean;

  @Field((type) => Int)
  rChannel: number;

  @Field((type) => Int)
  gChannel: number;

  @Field((type) => Int)
  bChannel: number;

  @Field()
  timestamp: string;
}
