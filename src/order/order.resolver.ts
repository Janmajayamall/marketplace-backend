import { Resolver, Mutation, Args, Query, Int } from '@nestjs/graphql';
import { Logger, UseGuards, UseInterceptors } from '@nestjs/common';
import { OrderService } from './order.service';
import { JwtGuard } from 'src/auth/guards/jwt.guard';
import { CurrentUser } from 'src/shared/decorator';
import { BuyerEntity } from 'src/buyer/buyer.entity';
import { ManufacturerEntity } from 'src/manufacturer/manufacturer.entity';
import { OrderType } from './dto/order.type';

@Resolver()
export class OrderResolver {
  private readonly logger = new Logger(OrderResolver.name);

  constructor(private orderService: OrderService) {}

  @Mutation(() => Boolean)
  @UseGuards(JwtGuard)
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

  @Query(() => Boolean)
  @UseGuards(JwtGuard)
  async getOrderListForManufacturer(
    @CurrentUser() currentUser: ManufacturerEntity,
  ) {
    return await this.orderService.findOrdersByManufacturerId(currentUser.id);
  }

  @Query(() => [OrderType])
  @UseGuards(JwtGuard)
  async getOrderListForBuyer(@CurrentUser() currentUser: BuyerEntity) {
    return await this.orderService.findOrdersByBuyerId(currentUser.id);
  }
}
