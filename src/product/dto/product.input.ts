import { ObjectType, Field, InputType } from '@nestjs/graphql';
import { FILE } from 'node:dns';
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
  minOrderSize: number;

  @Field({ nullable: true })
  referenceId: string;

  @Field()
  hsnCode: string;

  @Field()
  taxPercentage: number;

  @Field((type) => [String])
  tags: string[];
}
