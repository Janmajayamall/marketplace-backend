import { Resolver, Mutation, Args, Query } from '@nestjs/graphql';
import { Logger, UnauthorizedException, UseGuards } from '@nestjs/common';
import * as bcrypt from 'bcrypt';
import { JwtService } from '@nestjs/jwt';
import { LoginResponseType } from './../shared/dto/login-response.type';
import { BuyerService } from './buyer.service';
import { JwtGuard } from 'src/auth/guards/jwt.guard';
import { CurrentUser, ResGql } from 'src/shared/decorator';
import { Response } from 'express';
import { BuyerAddressEntity } from './buyer-address/buyer-address.entity';
import { BuyerAddressInput } from './buyer-address/dto/buyer-address.input';
import { BuyerEntity } from './buyer.entity';
import { BuyerAddressType } from './buyer-address/dto/buyer-address.type';

@Resolver()
export class BuyerResolver {
  private readonly logger = new Logger(BuyerResolver.name, true);

  constructor(
    private readonly jwtService: JwtService,
    private buyerService: BuyerService,
  ) {}

  @Query(() => Boolean)
  @UseGuards(JwtGuard)
  isBuyerAuthenticated() {
    return true;
  }

  @Mutation(() => Boolean)
  async buyerRequestLoginVerificationCode(
    @Args('phoneNumber') phoneNumber: string,
  ) {
    // send the verification code to phone number

    return true;
  }

  @Mutation(() => LoginResponseType)
  async buyerVerifyLoginCode(
    @Args('phoneNumber') phoneNumber: string,
    @Args('verificationCode') verificationCode: string,
    @ResGql()
    res: Response,
  ) {
    // check the verification code
    // if the verification code is correct
    if (verificationCode === '1202') {
      // get buyer with phoneNumber
      let buyer = await this.buyerService.findBuyerByPhoneNumber(phoneNumber);

      // if buyer does not exists by phoneNumber, then create a new buyer
      if (!buyer) {
        buyer = await this.buyerService.createBuyer(phoneNumber);
      }

      // create jwt
      const jwt = this.jwtService.sign({ ...buyer, type: 'buyer' });

      // set cookie
      res.cookie('token', `${jwt}`, {
        httpOnly: true,
        // secure: process.env.NODE_ENV !== 'development',
        sameSite: 'none',
        maxAge: 100000000,
        path: '/',
      });

      return {
        token: `Bearer ${jwt}`,
      };
    } else {
      // throw unauthorized error
      throw new UnauthorizedException();
    }
  }

  @Mutation(() => Boolean)
  async updateBuyerAddress(
    @CurrentUser() currentUser: BuyerEntity,
    @Args('buyerAddressInput') buyerAddressInput: BuyerAddressInput,
  ) {
    // for temp
    const buyerId = 1;

    await this.buyerService.updateAddress(buyerId, buyerAddressInput);
    return true;
  }

  @Query(() => [BuyerAddressType])
  async getBuyerAddresses(@CurrentUser() currentUser: BuyerEntity) {
    // for temp
    const buyerId = 1;
    return await this.buyerService.findBuyerAddressesByBuyerId(buyerId);
  }
}
