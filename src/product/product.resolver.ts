import { Resolver, Query, Mutation, Args, Int } from '@nestjs/graphql';
import { Logger, UseGuards, UseInterceptors } from '@nestjs/common';
import { ProductService } from './product.service';
import { ProductInput } from './dto/product.input';
import { ProductType } from './dto/product.type';
import { ProductVariationService } from 'src/product-variation/product-variation.service';
import { ProductVariationType } from './../product-variation/dto/product-variation.type';
import { ManufacturerJwtGuard } from 'src/auth/guards/jwt.guards';
import { CurrentUser } from 'src/shared/decorator';
import { ManufacturerEntity } from 'src/manufacturer/manufacturer.entity';
import { ProductVariationInput } from 'src/product-variation/dto/product-variation.input';
import { UploadProductImageSignType } from './productImage/dto/upload-product-image-sign.type';
import { ProductImageType } from './productImage/dto/product-image.type';
import { DataEntityStatus, sanitizeProductTags } from 'src/shared/helpers';
import { ProductEntity } from './product.entity';
import { AdminGuard } from 'src/auth/guards/other.guards';

@Resolver((of) => ProductType)
export class ProductResolver {
  private readonly logger = new Logger(ProductResolver.name, true);

  constructor(
    private productService: ProductService,
    private productVariationService: ProductVariationService,
  ) {}

  @Query(() => [ProductType])
  @UseGuards(ManufacturerJwtGuard)
  async getManufacturerProducts(
    @CurrentUser()
    currentUser: ManufacturerEntity,
  ) {
    return await this.productService.findProductsByManufacturer(currentUser.id);
  }

  @Query(() => ProductType)
  async getProductDetails(
    @Args('productId', { type: () => Int })
    productId: number,
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

  @Query(() => [ProductType])
  async getProductsBySearchPhraseForBuyers(
    @Args('searchPhrase')
    searchPhrase: string,
  ) {
    let res: ProductEntity[] = [];
    const searchWords = searchPhrase.split(' ').filter((word) => word !== '');

    // no search words then return everything
    if (searchWords.length === 0) {
      return await this.productService.getAllProductsBySearchPhrase('');
    }

    for (let i = 0; i < searchWords.length; i++) {
      const temp = await this.productService.getAllProductsBySearchPhrase(
        searchWords[i].trim().toLowerCase(),
      );
      res = res.concat(temp);
    }
    return res;
  }

  // ALL ADMIN GUARDS

  @Mutation(() => String)
  @UseGuards(AdminGuard)
  async addProductAdmin(
    @Args('manufacturerId', { type: () => Int })
    manufacturerId: number,
    @Args('productInput')
    productInput: ProductInput,
  ) {
    // create new product
    const product = await this.productService.addProduct(
      productInput,
      manufacturerId,
    );
    return product.id;
  }

  @Mutation(() => Boolean)
  @UseGuards(AdminGuard)
  async updateProductAdmin(
    @Args('productId', { type: () => Int })
    productId: number,
    @Args('productInput')
    productInput: ProductInput,
  ) {
    // const ownershipCheck = await this.productService.checkOwnership(
    //   productId,
    //   currentUser.id,
    // );
    // if (ownershipCheck == false) {
    //   throw new Error('Manufacturer does not owns the product');
    // }

    // update product details
    await this.productService.updateProduct(productId, productInput);

    return true;
  }

  @Mutation(() => [ProductVariationType])
  @UseGuards(AdminGuard)
  async addProductVariationsAdmin(
    @Args('productVariations', { type: () => [ProductVariationInput] })
    productVariations: [ProductVariationInput],
    @Args('productId', { type: () => Int })
    productId: number,
  ) {
    // const ownershipCheck = await this.productService.checkOwnership(
    //   productId,
    //   currentUser.id,
    // );
    // if (ownershipCheck == false) {
    //   throw new Error('Manufacturer does not owns the product');
    // }

    await this.productVariationService.addMultiple(
      productVariations,
      productId,
    );

    return await this.productVariationService.findAllByProductId(productId);
  }

  @Mutation(() => [ProductVariationType])
  @UseGuards(AdminGuard)
  async updateProductVariationAdmin(
    @Args('productVariationInput')
    productVariationInput: ProductVariationInput,
    @Args('productVariationId', { type: () => Int })
    productVariationId: number,
  ) {
    // // get the associated product to check ownership
    // const { productId } = await this.productVariationService.findOneById(
    //   productVariationId,
    // );
    // const ownershipCheck = await this.productService.checkOwnership(
    //   productId,
    //   currentUser.id,
    // );
    // if (ownershipCheck == false) {
    //   throw new Error('Manufacturer does not owns the product');
    // }
    const { productId } = await this.productVariationService.findOneById(
      productVariationId,
    );

    // update the product variation
    await this.productVariationService.updateProductVariationById(
      productVariationId,
      productVariationInput,
    );

    return await this.productVariationService.findAllByProductId(productId);
  }

  @Mutation(() => [ProductVariationType])
  @UseGuards(AdminGuard)
  async deleteProductVariationAdmin(
    @Args('productVariationId', { type: () => Int })
    productVariationId: number,
  ) {
    // // get the associated product to check ownership
    // const { productId } = await this.productVariationService.findOneById(
    //   productVariationId,
    // );
    // this.logger.debug(productId);
    // const ownershipCheck = await this.productService.checkOwnership(
    //   productId,
    //   currentUser.id,
    // );
    // if (ownershipCheck == false) {
    //   throw new Error('Manufacturer does not owns the product');
    // }

    const { productId } = await this.productVariationService.findOneById(
      productVariationId,
    );

    // delete the product variation
    await this.productVariationService.changeProductVariationStatus(
      productVariationId,
      DataEntityStatus.DELETED,
    );

    return await this.productVariationService.findAllByProductId(productId);
  }

  @Query(() => UploadProductImageSignType)
  @UseGuards(AdminGuard)
  getUploadProductImageSignatureAdmin() {
    return this.productService.generateUploadProductImageSignature();
  }

  @Mutation(() => Int)
  @UseGuards(AdminGuard)
  async deleteProductImageAdmin(
    @Args('productId', { type: () => Int }) productId: number,
    @Args('productImageId', { type: () => Int }) productImageId: number,
  ) {
    // // check product ownership
    // const ownershipCheck = await this.productService.checkOwnership(
    //   productId,
    //   currentUser.id,
    // );
    // if (!ownershipCheck) {
    //   throw new Error('Manufacturer does not owns the product');
    // }

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
  @UseGuards(AdminGuard)
  async addProductImageAdmin(
    @Args('productId', { type: () => Int })
    productId: number,
    @Args('imagePublicId')
    imagePublicId: string,
  ) {
    // // check ownership
    // const ownershipCheck = await this.productService.checkOwnership(
    //   productId,
    //   currentUser.id,
    // );
    // if (ownershipCheck == false) {
    //   throw new Error('Manufacturer does not owns the product');
    // }

    // add product image & return
    return await this.productService.addProductImage(productId, imagePublicId);
  }

  @Query(() => [ProductType])
  @UseGuards(AdminGuard)
  async getManufacturerProductsAdmin(
    @Args('manufacturerId', { type: () => Int })
    manufacturerId: number,
  ) {
    return await this.productService.findProductsByManufacturer(manufacturerId);
  }
}
