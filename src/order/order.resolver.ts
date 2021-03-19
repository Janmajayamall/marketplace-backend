import { Resolver, Mutation, Args, Query, Int } from '@nestjs/graphql';
import { Logger, UseGuards, UseInterceptors } from '@nestjs/common';
import { OrderService } from './order.service';
import {
  BuyerJwtGuard,
  ManufacturerJwtGuard,
} from 'src/auth/guards/jwt.guards';
import { CurrentUser } from 'src/shared/decorator';
import { BuyerEntity } from 'src/buyer/buyer.entity';
import { ManufacturerEntity } from 'src/manufacturer/manufacturer.entity';
import { OrderType, OrderTypeWithBuyerProfile } from './dto/order.type';

@Resolver()
export class OrderResolver {
  private readonly logger = new Logger(OrderResolver.name);

  constructor(private orderService: OrderService) {}

  @Mutation(() => Boolean)
  @UseGuards(BuyerJwtGuard)
  async placeNewOrder(
    @CurrentUser()
    currentUser: BuyerEntity,
    @Args('productId', { type: () => Int })
    productId: number,
    @Args('productVariationId', { type: () => Int })
    productVariationId: number,
    @Args('orderQuantity', { type: () => Int })
    orderQuantity: number,
  ) {
    // create new order
    await this.orderService.addNewOrder(
      productId,
      productVariationId,
      currentUser.id,
      orderQuantity,
    );

    return true;
  }

  @Query(() => [OrderType])
  @UseGuards(ManufacturerJwtGuard)
  async getOrderListForManufacturer(
    @CurrentUser() currentUser: ManufacturerEntity,
  ) {
    return await this.orderService.findOrdersByManufacturerId(currentUser.id);
  }

  @Query(() => OrderTypeWithBuyerProfile)
  @UseGuards(ManufacturerJwtGuard)
  async getOrderDetailsByIdForManufacturer(
    @CurrentUser() currentUser: ManufacturerEntity,
    @Args('orderId', { type: () => Int }) orderId: number,
  ) {
    // get order details
    const order = await this.orderService.findOrderDetailsById(orderId);

    // if manufacturer id does not matches current user id then throw error
    if (order.manufacturerId !== currentUser.id) {
      throw new Error('Order does not belongs to Manufacturer.');
    }

    // get buyer profile
    const buyerProfile = null;

    return {
      order: order,
      buyerProfile: buyerProfile,
    };
  }

  @Query(() => [OrderType])
  @UseGuards(BuyerJwtGuard)
  async getOrderListForBuyer(@CurrentUser() currentUser: BuyerEntity) {
    return await this.orderService.findOrdersByBuyerId(currentUser.id);
  }
}
