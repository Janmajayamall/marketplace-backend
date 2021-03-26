import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { JwtModule } from '@nestjs/jwt';
import { TypeOrmModule } from '@nestjs/typeorm';
import { BuyerAddressEntity } from './buyer-address/buyer-address.entity';
import { BuyerProfileEntity } from './buyer-profile/buyer-profile.entity';
import { BuyerEntity } from './buyer.entity';
import { BuyerResolver } from './buyer.resolver';
import { BuyerService } from './buyer.service';
@Module({
  imports: [
    TypeOrmModule.forFeature([
      BuyerEntity,
      BuyerAddressEntity,
      BuyerProfileEntity,
    ]),
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
  providers: [BuyerService, BuyerResolver],
  exports: [BuyerService],
})
export class BuyerModule {}
