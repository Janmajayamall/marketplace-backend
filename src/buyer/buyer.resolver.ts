import { Resolver, Mutation, Args, Query } from '@nestjs/graphql';
import { Logger, UnauthorizedException, UseGuards } from '@nestjs/common';
import * as bcrypt from 'bcrypt';
import { JwtService } from '@nestjs/jwt';
import { LoginResponseType } from './../shared/dto/login-response.type';
import { BuyerService } from './buyer.service';
import { CurrentUser, ResGql } from 'src/shared/decorator';
import { Response } from 'express';
import { BuyerAddressInput } from './buyer-address/dto/buyer-address.input';
import { BuyerEntity } from './buyer.entity';
import { BuyerAddressType } from './buyer-address/dto/buyer-address.type';
import { BuyerJwtGuard } from 'src/auth/guards/jwt.guards';
import { BuyerProfileType } from './buyer-profile/dto/buyer-profile.type';
import { AuthGuard } from '@nestjs/passport';
import { BuyerProfileInput } from './buyer-profile/dto/buyer-profile.input';
import { PhoneVerificationService } from 'src/phone-verification/phone-verification.service';

@Resolver()
export class BuyerResolver {
  private readonly logger = new Logger(BuyerResolver.name, true);

  constructor(
    private readonly jwtService: JwtService,
    private buyerService: BuyerService,
    private phoneVerificationService: PhoneVerificationService,
  ) {}

  @Query(() => Boolean)
  @UseGuards(BuyerJwtGuard)
  isBuyerAuthenticated() {
    return true;
  }

  @Mutation(() => Boolean)
  async buyerRequestLoginVerificationCode(
    @Args('phoneNumber') phoneNumber: string,
  ) {
    // validate phone number
    if (phoneNumber.trim().length !== 8) {
      throw new Error('Invalid phone number');
    }

    // initiate phone verification
    await this.phoneVerificationService.sendVerificationCode(
      `852${phoneNumber}`,
    );

    return true;
  }

  @Mutation(() => LoginResponseType)
  async buyerVerifyLoginCode(
    @Args('phoneNumber') phoneNumber: string,
    @Args('verificationCode') verificationCode: string,
    @ResGql()
    res: Response,
  ) {
    // validate phone number
    if (phoneNumber.trim().length !== 8) {
      throw new Error('Invalid phone number');
    }

    // validate verification code
    if (verificationCode.trim().length !== 6) {
      throw new Error('Invalid verification code');
    }

    // check the verification code
    await this.phoneVerificationService.verifyVerificationCode(
      `852${phoneNumber.trim()}`,
      verificationCode.trim(),
    );

    // get buyer with phoneNumber
    let buyer = await this.buyerService.findBuyerByPhoneNumber(phoneNumber);

    // if buyer does not exists by phoneNumber, then create a new buyer
    if (!buyer) {
      buyer = await this.buyerService.createBuyer(phoneNumber);
    }

    // create jwt
    const jwt = this.jwtService.sign({ ...buyer, type: 'buyer' });

    return {
      token: `Bearer ${jwt}`,
    };

    // // if the verification code is correct
    // if (verificationCode === '1202') {
    //   // get buyer with phoneNumber
    //   let buyer = await this.buyerService.findBuyerByPhoneNumber(phoneNumber);

    //   // if buyer does not exists by phoneNumber, then create a new buyer
    //   if (!buyer) {
    //     buyer = await this.buyerService.createBuyer(phoneNumber);
    //   }

    //   // create jwt
    //   const jwt = this.jwtService.sign({ ...buyer, type: 'buyer' });

    //   // set cookie
    //   // res.cookie('token', `${jwt}`, {
    //   //   httpOnly: true,
    //   //   secure: process.env.NODE_ENV !== 'development',
    //   //   sameSite: 'none',
    //   //   maxAge: 100000000,
    //   //   path: '/',
    //   // });

    //   return {
    //     token: `Bearer ${jwt}`,
    //   };
    // } else {
    //   // throw unauthorized error
    //   throw new UnauthorizedException();
    // }
  }

  @Mutation(() => BuyerProfileType)
  @UseGuards(BuyerJwtGuard)
  async updateBuyerProfile(
    @CurrentUser() currentUser: BuyerEntity,
    @Args('buyerProfileInput') buyerProfileInput: BuyerProfileInput,
  ) {
    return await this.buyerService.updateBuyerProfile(
      currentUser.id,
      buyerProfileInput,
    );
  }

  @Query(() => BuyerProfileType, { nullable: true })
  @UseGuards(BuyerJwtGuard)
  async getBuyerProfile(@CurrentUser() currentUser: BuyerEntity) {
    return await this.buyerService.findBuyerProfileById(currentUser.id);
  }
}
