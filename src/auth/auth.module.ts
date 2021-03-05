import { Module } from '@nestjs/common';
import { PassportModule } from '@nestjs/passport';
import { ManufacturerModule } from 'src/manufacturer/manufacturer.module';
import { AuthService } from './auth.service';
import { JwtModule } from '@nestjs/jwt';
import { JwtStrategy } from './strategies/jwt.strategy';
import { BuyerModule } from 'src/buyer/buyer.module';

@Module({
  imports: [
    ManufacturerModule,
    BuyerModule,
    PassportModule,
    JwtModule.register({
      secret: 'process.env.JWT_SECRET',
      signOptions: {
        expiresIn: '7d',
      },
    }),
  ],
  providers: [AuthService, JwtStrategy],
})
export class AuthModule {}
