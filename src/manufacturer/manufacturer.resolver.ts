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
    private readonly jwt: JwtService,
    private manufacturerService: ManufacturerService,
  ) {}

  @Mutation(() => ManufacturerType)
  async createManufacturer(
    @Args('manufacturerInput')
    manufacturerInput: ManufacturerInput,
  ) {
    return await this.manufacturerService.create(manufacturerInput);
  }

  @Mutation(() => LoginResponseType)
  async loginManufacturer(
    @Args('phoneNumber')
    phoneNumber: string,
    @Args('password')
    password: string,
    @ResGql()
    res: Response,
  ) {
    const manufacturer = await this.manufacturerService.findOneByNumber(
      phoneNumber,
    );

    if (
      manufacturer &&
      (await bcrypt.compare(password, manufacturer.passwordHash))
    ) {
      manufacturer.passwordHash = null;
      const jwt = this.jwt.sign({ ...manufacturer, type: 'manufacturer' });

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
