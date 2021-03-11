import {
  Resolver,
  Query,
  Mutation,
  Args,
  Int,
  ResolveField,
  Parent,
  Context,
  GraphQLExecutionContext,
} from '@nestjs/graphql';
import { Logger, UnauthorizedException, UseGuards } from '@nestjs/common';
import { ManufacturerService } from './manufacturer.service';
import { ManufacturerInput } from './dto/manufacturer.input';
import { ManufacturerType } from './dto/manufacturer.type';
import { AuthGuard } from '@nestjs/passport';
import * as bcrypt from 'bcrypt';
import { JwtService } from '@nestjs/jwt';
import { LoginResponseType } from './../shared/dto/login-response.type';
import { Response } from 'express';
import { ResGql } from 'src/shared/decorator';
import { serialize } from 'cookie';

@Resolver()
export class ManufacturerResolver {
  private readonly logger = new Logger(ManufacturerResolver.name, true);

  constructor(
    private readonly jwtService: JwtService,
    private manufacturerService: ManufacturerService,
  ) {}

  @Mutation(() => Boolean)
  async manufacturerRequestLoginVerificationCode(
    @Args('phoneNumber') phoneNumber: string,
  ) {
    // get manufacturer with phoneNumber
    const manufacturer = await this.manufacturerService.findManufacturerByPhoneNumber(
      phoneNumber,
    );

    // if manufacturer does not exists then throw registration error
    if (!manufacturer) {
      throw new Error('Manufacturer is not registered');
    }

    // send the verification code
    return true;
  }

  @Mutation(() => LoginResponseType)
  async manufacturerVerifyLoginCode(
    @Args('phoneNumber') phoneNumber: string,
    @Args('verificationCode') verificationCode: string,
    @ResGql()
    res: Response,
  ) {
    // check verification code

    // if the verification code is correct
    if (verificationCode === '1202') {
      // get manufacturer with phoneNumber
      const manufacturer = await this.manufacturerService.findManufacturerByPhoneNumber(
        phoneNumber,
      );

      // if manufacturer does not exists then throw registration error
      if (!manufacturer) {
        throw new Error('Manufacturer is not registered');
      }

      // create jwt
      const jwt = this.jwtService.sign({
        ...manufacturer,
        type: 'manufacturer',
      });

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
}
