import { Resolver, Mutation, Args, Query } from '@nestjs/graphql';
import { Logger, UseGuards, UseInterceptors } from '@nestjs/common';
import { OrderCartService } from './order-cart.service';
import { CurrentUser } from 'src/shared/decorator';
import { BuyerEntity } from 'src/buyer/buyer.entity';
import { ProductService } from 'src/product/product.service';
import { ManufacturerService } from 'src/manufacturer/manufacturer.service';
import { ProductVariationService } from 'src/product-variation/product-variation.service';
import { roundToTwoPlaces } from 'src/shared/helpers';
import { OrderCartEntity } from './order-cart.entity';
import { OrderCartType } from './dto/order-cart.type';

@Resolver()
export class OrderCartResolver {
  private readonly logger = new Logger(OrderCartResolver.name, true);

  constructor(
    private orderCartService: OrderCartService,
    private productService: ProductService,
    private manufacturerService: ManufacturerService,
    private productVariationService: ProductVariationService,
  ) {}

  @Mutation(() => Boolean)
  async addItemToOrderCart(
    // @CurrentUser()
    // currentUser: BuyerEntity,
    @Args('productId')
    productId: string,
    @Args('productVariationId')
    productVariationId: string,
    @Args('orderQuantitySize')
    orderQuantitySize: number,
  ) {
    // get the product
    const product = await this.productService.findOneById(productId);
    if (!product) {
      throw new Error('Product does not exists');
    }

    // get the manufacturer
    const manufacturer = await this.manufacturerService.findOneById(
      product.manufacturerId,
    );

    // get the product variation
    const productVariation = await this.productVariationService.findOneById(
      productVariationId,
    );
    if (!productVariation) {
      throw new Error('Product Variation does not exists');
    }
    // verify product variation belongs to the product
    if (productVariation.productId !== product.id) {
      throw new Error('Product Variation does not belongs to the Product');
    }

    // add item to cart
    const roundedOrderQuantity = roundToTwoPlaces(orderQuantitySize);
    const roundedFinalPricePerUnit = roundToTwoPlaces(
      productVariation.getFinalPrice(),
    );
    // throw error if roundedOrderQuantity is lesser than MOQ
    if (roundedOrderQuantity < product.minOrderSize) {
      throw new Error('Order quantity size is smaller than minimum order size');
    }
    const orderTotalPrice = roundToTwoPlaces(
      roundedOrderQuantity * roundedFinalPricePerUnit,
    );

    // create and save order in cart
    // @ts-ignore
    const orderCartItem: OrderCartEntity = {
      // order specific
      orderQuantitySize: roundedOrderQuantity,
      orderTotalPrice: orderTotalPrice,

      // buyer details
      //   buyerId: currentUser.id,
      buyerId: 'a8322b42-8aee-42e9-bbe3-672795ba84ed',

      // product variation details
      productVariationPrice: productVariation.price,
      productVariationFinalPrice: roundedFinalPricePerUnit,
      productVariationInStock: productVariation.inStock,
      productVariationColourId: productVariation.colourId,
      productVariationColourHex: productVariation.colour.hexValue,
      productVariationColourName: productVariation.colour.name,
      productVariationId: productVariation.id,

      // product details
      productName: product.name,
      productDescription: product.description,
      productClothComposition: product.clothComposition,
      productWidth: product.width,
      productGsm: product.gsm,
      productPattern: product.pattern,
      productReferenceImageURL: product.referenceImageURL,
      productMaxOrderSize: product.maxOrderSize,
      productMinOrderSize: product.minOrderSize,
      productReferenceId: product.referenceId,
      productId: product.id,

      // manufacturer details
      manufacturerId: manufacturer.id,
    };
    await this.orderCartService.addItemToOrderCart(orderCartItem);

    return true;
  }

  @Query(() => [OrderCartType])
  async getBuyerOrderCartItems(@CurrentUser() currentUser: BuyerEntity) {
    return await this.orderCartService.getOrderCartsByBuyerId(
      'a8322b42-8aee-42e9-bbe3-672795ba84ed',
    );
  }
}
