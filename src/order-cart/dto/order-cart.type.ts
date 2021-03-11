// import { ObjectType, Field, InputType } from '@nestjs/graphql';
// import { FILE } from 'node:dns';
// import { ManufacturerType } from 'src/manufacturer/dto/manufacturer.type';

// @ObjectType()
// export class OrderCartType {
//   @Field()
//   id: string;

//   // order specific details
//   @Field()
//   orderQuantitySize: number;

//   @Field()
//   orderTotalPrice: number;
//   // end order specific details

//   // buyer details
//   @Field()
//   buyerId: string;
//   // end buyer details

//   // product variation details
//   @Field()
//   productVariationPrice: number;

//   @Field()
//   productVariationFinalPrice: number;

//   @Field()
//   productVariationInStock: Boolean;

//   @Field()
//   productVariationColourHexCode: string;

//   @Field()
//   productVariationId: string;
//   // end product variations details

//   // product details
//   @Field()
//   productName: string;

//   @Field()
//   productDescription: string;

//   @Field()
//   productClothComposition: string;

//   @Field()
//   productWidth: number;

//   @Field()
//   productGsm: number;

//   @Field()
//   productPattern: string;

//   @Field()
//   productReferenceImageURL: string;

//   @Field()
//   productMaxOrderSize: number;

//   @Field()
//   productMinOrderSize: number;

//   @Field({ nullable: true })
//   productReferenceId: string;

//   @Field()
//   productId: string;
//   // end product details

//   // manufacturer details
//   @Field()
//   manufacturerId: string;

//   @Field((type) => ManufacturerType)
//   manufacturer: ManufacturerType;
//   // end manufacturer details

//   @Field()
//   timestamp: string;
// }
