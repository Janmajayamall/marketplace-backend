import { ObjectType, Field, InputType } from '@nestjs/graphql';
import { ColourType } from 'src/product/colour/dto/colour.type';

@ObjectType()
export class ProductVariationType {
  @Field()
  id: string;

  @Field()
  colourId: number;

  @Field()
  price: number;

  @Field()
  inStock: Boolean;

  @Field((type) => ColourType)
  colour: ColourType;

  @Field()
  finalPrice: number;
}
