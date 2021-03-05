import { Resolver, Query, Mutation, Args, Int } from '@nestjs/graphql';
import { Logger } from '@nestjs/common';
import { ProductVariationService } from './product-variation.service';
import { ProductVariationType } from './dto/product-variation.type';
import { ProductVariationInput } from './dto/product-variation.input';

@Resolver()
export class ProductVariationResolver {
  private readonly logger = new Logger(ProductVariationResolver.name, true);

  constructor(private productVariationService: ProductVariationService) {}

  // @Mutation(() => [ProductVariationType])
  // async addVariations(
  //   @Args('productVariations')
  //   productVariations: ProductVariationInput[],
  //   @Args('productId')
  //   productId: string,
  // ) {
  //   return await this.productVariationService.addMultiple(
  //     productVariations,

  //   );
  // }
}
