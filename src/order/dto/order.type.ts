import { ObjectType, Field } from '@nestjs/graphql';
import { BuyerProfileType } from 'src/buyer/buyer-profile/dto/buyer-profile.type';

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
  totalPrice: number;

  @Field()
  totalTax: number;

  @Field()
  buyerId: number;

  @Field({ nullable: true })
  buyerProfile: BuyerProfileType;

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
  productWidth: number;

  @Field()
  productGsm: number;

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
