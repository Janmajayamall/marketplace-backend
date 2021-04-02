import { ObjectType, Field } from '@nestjs/graphql';
import { FILE } from 'node:dns';
import { BuyerProfileType } from 'src/buyer/buyer-profile/dto/buyer-profile.type';
import { ProductImageType } from 'src/product/productImage/dto/product-image.type';

@ObjectType()
export class OrderType {
  @Field()
  id: number;

  // ORDER RELATED
  @Field()
  orderQuantity: number;

  @Field()
  orderStage: string;

  @Field()
  orderTotalPrice: number;

  @Field()
  totalTax: number;

  @Field()
  grandTotalPrice: number;

  @Field({ nullable: true })
  deliveryCharges: number;

  @Field()
  buyerId: number;

  @Field()
  manufacturerId: number;

  @Field()
  timestamp: string;
  // ORDER RELATED END

  // PRODUCT DETAILS
  @Field()
  productId: number;

  @Field()
  productName: string;

  @Field()
  productDescription: string;

  @Field()
  productClothComposition: string;

  @Field()
  productWidth: string;

  @Field()
  productGsm: string;

  @Field()
  productPattern: string;

  @Field()
  productMinOrderSize: number;

  @Field()
  productReferenceId: string;

  @Field()
  productHsnCode: string;

  @Field()
  productTaxPercentage: number;

  @Field((type) => [ProductImageType])
  productImages: ProductImageType[];
  // PRODUCT DETAILS END

  // PRODUCT VARIATION DETAILS
  @Field()
  productVariationId: number;

  @Field()
  productVariationPrice: number;

  @Field()
  productVariationInStock: boolean;

  @Field()
  productVariationColourHexCode: string;

  @Field()
  productVariationRChannel: number;

  @Field()
  productVariationGChannel: number;

  @Field()
  productVariationBChannel: number;
  // PRODUCT VARIATION DETAILS END
}

@ObjectType()
export class OrderTypeWithBuyerProfile {
  @Field((type) => OrderType)
  order: OrderType;

  @Field((type) => BuyerProfileType, { nullable: true })
  buyerProfile: BuyerProfileType;
}
