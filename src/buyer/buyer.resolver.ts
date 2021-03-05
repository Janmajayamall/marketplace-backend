import { Resolver, Mutation, Args, Query } from '@nestjs/graphql';
import { Logger, UnauthorizedException, UseGuards } from '@nestjs/common';
import * as bcrypt from 'bcrypt';
import { JwtService } from '@nestjs/jwt';
import { LoginResponseType } from './../shared/dto/login-response.type';
import { BuyerService } from './buyer.service';
import { BuyerType } from './buyer.type';
import { BuyerInput } from './buyer.input';
import { JwtGuard } from 'src/auth/guards/jwt.guard';
import { ResGql } from 'src/shared/decorator';
import { Response } from 'express';

@Resolver()
export class BuyerResolver {
  private readonly logger = new Logger(BuyerResolver.name, true);

  constructor(
    private readonly jwt: JwtService,
    private buyerService: BuyerService,
  ) {}

  @Query(() => String)
  @UseGuards(JwtGuard)
  sayHelloBuyer() {
    return 'dawdaw';
  }

  @Mutation(() => BuyerType)
  async createBuyer(
    @Args('buyerInput')
    buyerInput: BuyerInput,
  ) {
    return await this.buyerService.create(buyerInput);
  }

  @Mutation(() => LoginResponseType)
  async loginBuyer(
    @Args('phoneNumber')
    phoneNumber: string,
    @Args('password')
    password: string,
    @ResGql()
    res: Response,
  ) {
    const buyer = await this.buyerService.findOneByNumber(phoneNumber);
    this.logger.debug(buyer);
    if (buyer && (await bcrypt.compare(password, buyer.passwordHash))) {
      buyer.passwordHash = null;
      const jwt = this.jwt.sign({ ...buyer, type: 'buyer' });

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
    }

    throw new UnauthorizedException();
  }
}
