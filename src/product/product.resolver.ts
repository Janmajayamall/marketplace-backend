import {
  Resolver,
  Query,
  Mutation,
  Args,
  Int,
  ResolveField,
  Parent,
} from '@nestjs/graphql';
import { Logger, UseGuards, UseInterceptors } from '@nestjs/common';
import { ProductService } from './product.service';
import { ProductInput } from './dto/product.input';
import { ProductType } from './dto/product.type';
import { ProductVariationService } from 'src/product-variation/product-variation.service';
import { ProductVariationType } from './../product-variation/dto/product-variation.type';
import { JwtGuard } from 'src/auth/guards/jwt.guard';
import { CurrentUser } from 'src/shared/decorator';
import { ManufacturerEntity } from 'src/manufacturer/manufacturer.entity';
import { ProductVariationInput } from 'src/product-variation/dto/product-variation.input';
import { ProductCategoryType } from './productCategory/dto/product-category.type';
import { UploadProductImageSignType } from './productImage/dto/upload-product-image-sign.type';
import { ProductImageType } from './productImage/dto/product-image.type';
import { ColourType } from './colour/dto/colour.type';

@Resolver((of) => ProductType)
export class ProductResolver {
  private readonly logger = new Logger(ProductResolver.name, true);

  constructor(
    private productService: ProductService,
    private productVariationService: ProductVariationService,
  ) {}
  @Query(() => [ProductType])
  @UseGuards(JwtGuard)
  async getManufacturerProducts(
    @CurrentUser()
    currentUser: ManufacturerEntity,
  ) {
    return await this.productService.findProductsByManufacturer(currentUser.id);
  }

  @Query(() => ProductType)
  // @UseGuards(JwtGuard)
  async getProductDetails(
    @Args('productId')
    productId: string,
  ) {
    // removed ownership check since buyer will be able to view product details anyway
    // const ownershipCheck = await this.productService.checkOwnership(
    //   productId,
    //   currentUser.id,
    // );
    // if (ownershipCheck == false) {
    //   throw new Error('Manufacturer does not owns the product');
    // }
    return await this.productService.findOneById(productId);
  }

  @Mutation(() => String)
  @UseGuards(JwtGuard)
  async addProduct(
    @CurrentUser()
    currentUser: ManufacturerEntity,
    @Args('productInput')
    productInput: ProductInput,
  ) {
    // create new product
    const product = await this.productService.addProduct(
      productInput,
      currentUser.id,
    );

    // update product category relations
    await this.productService.updateProductCategoryRelations(
      productInput.productCategoryIds,
      product.id,
    );

    return product.id;
  }

  @Mutation(() => Boolean)
  @UseGuards(JwtGuard)
  async updateProduct(
    @CurrentUser()
    currentUser: ManufacturerEntity,
    @Args('productId')
    productId: string,
    @Args('productInput')
    productInput: ProductInput,
  ) {
    const ownershipCheck = await this.productService.checkOwnership(
      productId,
      currentUser.id,
    );
    if (ownershipCheck == false) {
      throw new Error('Manufacturer does not owns the product');
    }

    // update product details
    await this.productService.updateProduct(productId, productInput);

    // update product category relations
    await this.productService.updateProductCategoryRelations(
      productInput.productCategoryIds,
      productId,
    );

    return true;
  }

  @Mutation(() => [ProductVariationType])
  @UseGuards(JwtGuard)
  async addProductVariations(
    @CurrentUser()
    currentUser: ManufacturerEntity,
    @Args('productVariations', { type: () => [ProductVariationInput] })
    productVariations: [ProductVariationInput],
    @Args('productId')
    productId: string,
  ) {
    const ownershipCheck = await this.productService.checkOwnership(
      productId,
      currentUser.id,
    );
    if (ownershipCheck == false) {
      throw new Error('Manufacturer does not owns the product');
    }

    await this.productVariationService.addMultiple(
      productVariations,
      productId,
    );

    return await this.productVariationService.findAllByProductId(productId);
  }

  @Mutation(() => Boolean)
  @UseGuards(JwtGuard)
  async updateProductVariation(
    @CurrentUser()
    currentUser: ManufacturerEntity,
    @Args('productVariationInput')
    productVariationInput: ProductVariationInput,
    @Args('productVariationId')
    productVariationId: string,
  ) {
    // get the associated product to check ownership
    const { product } = await this.productVariationService.findOneById(
      productVariationId,
    );
    const productId = product.id;
    const ownershipCheck = await this.productService.checkOwnership(
      productId,
      currentUser.id,
    );
    if (ownershipCheck == false) {
      throw new Error('Manufacturer does not owns the product');
    }

    // update the product variation
    await this.productVariationService.updateProductVariationById(
      productVariationId,
      productVariationInput,
    );

    return true;
  }

  @Query(() => [ProductCategoryType])
  @UseGuards(JwtGuard)
  async getProductCategories() {
    return await this.productService.findAllAvProductCategories();
  }

  @Query(() => [ColourType])
  @UseGuards(JwtGuard)
  async getAllColours() {
    return await this.productService.findAllAvColours();
  }

  @Query(() => UploadProductImageSignType)
  @UseGuards(JwtGuard)
  getUploadProductImageSignature() {
    return this.productService.generateUploadProductImageSignature();
  }

  @Mutation(() => String)
  @UseGuards(JwtGuard)
  async deleteProductImage(
    @CurrentUser() currentUser: ManufacturerEntity,
    @Args('productId') productId: string,
    @Args('productImageId') productImageId: string,
  ) {
    // check product ownership
    const ownershipCheck = await this.productService.checkOwnership(
      productId,
      currentUser.id,
    );
    if (!ownershipCheck) {
      throw new Error('Manufacturer does not owns the product');
    }

    // check productImage ownership by product
    const productImage = await this.productService.findOneProductImageById(
      productImageId,
    );
    if (productImage.productId !== productId) {
      throw new Error(
        'Product image does not belongs to the specified product',
      );
    }

    // delete the product
    const deleteRes = await this.productService.deleteProductImage(
      productImageId,
    );
    this.logger.debug(deleteRes);

    return productImageId;
  }

  @Mutation(() => ProductImageType)
  @UseGuards(JwtGuard)
  async addProductImage(
    @CurrentUser()
    currentUser: ManufacturerEntity,
    @Args('productId')
    productId: string,
    @Args('imagePublicId')
    imagePublicId: string,
  ) {
    // check ownership
    const ownershipCheck = await this.productService.checkOwnership(
      productId,
      currentUser.id,
    );
    if (ownershipCheck == false) {
      throw new Error('Manufacturer does not owns the product');
    }

    // add product image & return
    return await this.productService.addProductImage(productId, imagePublicId);
  }

  @Query(() => [ProductType])
  async getCategoryProductsForBuyers(
    @Args('categoryId', { type: () => Int })
    categoryId: number,
  ) {
    return await this.productService.getAllProductsOfCategory(categoryId);
  }

  @ResolveField(() => [ProductVariationType])
  async variations(@Parent() product: ProductType) {
    return await this.productVariationService.findAllByProductId(product.id);
  }
}
