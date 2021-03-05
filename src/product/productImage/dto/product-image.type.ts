import { ObjectType, Field, InputType } from '@nestjs/graphql';

@ObjectType()
export class ProductImageType {
  @Field()
  id: string;

  @Field()
  productId: string;

  @Field()
  publicId: string;
}
