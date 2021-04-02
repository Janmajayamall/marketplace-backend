import { ObjectType, Field, InputType } from '@nestjs/graphql';
import { ProductImageType } from '../productImage/dto/product-image.type';
import { ProductVariationType } from './../../product-variation/dto/product-variation.type';
@ObjectType()
export class ProductType {
  @Field()
  id: number;

  @Field()
  name: string;

  @Field()
  description: string;

  @Field()
  clothComposition: string;

  @Field()
  width: string;

  @Field()
  gsm: string;

  @Field()
  pattern: string;

  @Field()
  minOrderSize: number;

  @Field({ nullable: true })
  referenceId: string;

  @Field()
  hsnCode: string;

  @Field()
  taxPercentage: number;

  @Field((type) => [ProductVariationType])
  variations: ProductVariationType[];

  @Field((type) => [ProductImageType])
  images: ProductImageType[];

  @Field((type) => [String])
  tags: string[];

  @Field()
  usage: string;

  @Field()
  timestamp: string;

  @Field()
  manufacturerId: number;
}
