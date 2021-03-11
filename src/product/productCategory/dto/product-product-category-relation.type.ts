import { ObjectType, Field, InputType } from '@nestjs/graphql';
import { ProductType } from 'src/product/dto/product.type';
import { ProductCategoryType } from './product-category.type';

@ObjectType()
export class ProductProductCategoryRelationType {
  @Field()
  productId: number;

  @Field()
  productCategoryId: number;

  @Field((type) => ProductCategoryType, { nullable: true })
  productCategory: ProductCategoryType;

  @Field((type) => ProductType, { nullable: true })
  product: ProductType;
}
