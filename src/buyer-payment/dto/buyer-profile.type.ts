import { ObjectType, Field } from '@nestjs/graphql';

@ObjectType()
export class BuyerPaymentType {
  @Field()
  orderId: number;

  @Field()
  buyerId: number;

  @Field()
  orderTotalPrice: number;

  @Field()
  totalTax: number;

  @Field()
  grandTotalPrice: number;

  @Field()
  dueDate: string;

  @Field()
  paidStatus: Boolean;

  @Field()
  timestamp: string;

  @Field()
  lastModifiedTimestamp: string;
}
