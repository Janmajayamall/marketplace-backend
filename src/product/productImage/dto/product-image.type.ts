import { ObjectType, Field, InputType } from '@nestjs/graphql';

@ObjectType()
export class ProductImageType {
  @Field()
  id: number;

  @Field()
  productId: number;

  @Field()
  publicId: string;

  @Field()
  timestamp: string;
}
