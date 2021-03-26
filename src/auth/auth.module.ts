import { Module } from '@nestjs/common';
import { PassportModule } from '@nestjs/passport';
import { ManufacturerModule } from 'src/manufacturer/manufacturer.module';
import { AuthService } from './auth.service';
import { JwtModule } from '@nestjs/jwt';
import {
  BuyerJwtStrategy,
  ManufacturerJwtStrategy,
} from './strategies/jwt.strategies';
import { BuyerModule } from 'src/buyer/buyer.module';
import { ConfigModule, ConfigService } from '@nestjs/config';

@Module({
  imports: [
    ManufacturerModule,
    BuyerModule,
    PassportModule,
    JwtModule.registerAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: async (configService: ConfigService) => {
        return {
          secret: configService.get<string>('JWT_SECRET'),
          signOptions: {
            expiresIn: '7d',
          },
        };
      },
    }),
  ],
  providers: [AuthService, ManufacturerJwtStrategy, BuyerJwtStrategy],
})
export class AuthModule {}
