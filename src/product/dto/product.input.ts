import { ObjectType, Field, InputType } from '@nestjs/graphql';
import { ProductVariationInput } from './../../product-variation/dto/product-variation.input';
@InputType()
export class ProductInput {
  @Field()
  name: string;

  @Field()
  description: string;

  @Field()
  clothComposition: string;

  @Field()
  width: number;

  @Field()
  gsm: number;

  @Field()
  pattern: string;

  @Field()
  referenceImageURL: string;

  @Field()
  maxOrderSize: number;

  @Field()
  minOrderSize: number;

  @Field({ nullable: true })
  referenceId: string;

  @Field((type) => [Number])
  productCategoryIds: number[];
}
