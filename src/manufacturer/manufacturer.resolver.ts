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
import { ManufacturerJwtGuard } from 'src/auth/guards/jwt.guards';
import { PhoneVerificationService } from 'src/phone-verification/phone-verification.service';

@Resolver()
export class ManufacturerResolver {
  private readonly logger = new Logger(ManufacturerResolver.name, true);

  constructor(
    private readonly jwtService: JwtService,
    private manufacturerService: ManufacturerService,
    private phoneVerificationService: PhoneVerificationService,
  ) {}

  @Query(() => Boolean)
  @UseGuards(ManufacturerJwtGuard)
  isManufacturerAuthenticated() {
    return true;
  }

  @Mutation(() => Boolean)
  async manufacturerRequestLoginVerificationCode(
    @Args('phoneNumber') phoneNumber: string,
  ) {
    // validate phone number
    if (phoneNumber.trim().length !== 8) {
      throw new Error('Invalid phone number');
    }

    // check whether manufacturer with phone number exists or not
    const manufacturer = await this.manufacturerService.findManufacturerByPhoneNumber(
      phoneNumber.trim(),
    );

    // if manufacturer does not exists then throw registration error
    if (!manufacturer) {
      throw new Error('Manufacturer is not registered');
    }

    // initiate phone verification
    await this.phoneVerificationService.sendVerificationCode(
      `852${phoneNumber.trim()}`,
    );

    return true;
  }

  @Mutation(() => LoginResponseType)
  async manufacturerVerifyLoginCode(
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

    // check verification code
    await this.phoneVerificationService.verifyVerificationCode(
      `852${phoneNumber.trim()}`,
      verificationCode.trim(),
    );

    // manufacturer with phone number is authenticated
    // get manufacturer with phoneNumber
    const manufacturer = await this.manufacturerService.findManufacturerByPhoneNumber(
      phoneNumber.trim(),
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

    return {
      token: `Bearer ${jwt}`,
    };

    // if the verification code is correct
    // if (verificationCode === '1202') {
    //   // get manufacturer with phoneNumber
    //   const manufacturer = await this.manufacturerService.findManufacturerByPhoneNumber(
    //     phoneNumber,
    //   );

    //   // if manufacturer does not exists then throw registration error
    //   if (!manufacturer) {
    //     throw new Error('Manufacturer is not registered');
    //   }

    //   // create jwt
    //   const jwt = this.jwtService.sign({
    //     ...manufacturer,
    //     type: 'manufacturer',
    //   });

    //   // set cookie
    //   // res.cookie('token', `${jwt}`, {
    //   //   httpOnly: true,
    //   //   // secure: process.env.NODE_ENV !== 'development',
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
}
