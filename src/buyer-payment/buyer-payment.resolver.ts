import { Resolver, Mutation, Args, Query } from '@nestjs/graphql';
import { Logger, UnauthorizedException, UseGuards } from '@nestjs/common';
import { BuyerPaymentService } from './buyer-payment.service';
import { BuyerPaymentType } from './dto/buyer-profile.type';
import { BuyerJwtGuard } from 'src/auth/guards/jwt.guards';
import { CurrentUser } from 'src/shared/decorator';
import { BuyerEntity } from 'src/buyer/buyer.entity';

@Resolver()
export class BuyerPaymentResolver {
  private readonly logger = new Logger(BuyerPaymentResolver.name, true);

  constructor(private readonly buyerPaymentService: BuyerPaymentService) {}

  @Query(() => [BuyerPaymentType])
  @UseGuards(BuyerJwtGuard)
  async getBuyerPayments(@CurrentUser() currentUser: BuyerEntity) {
    return await this.buyerPaymentService.getBuyerOrderPayments(currentUser.id);
  }
}
