import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ManufacturerEntity } from './manufacturer.entity';
import { ManufacturerResolver } from './manufacturer.resolver';
import { ManufacturerService } from './manufacturer.service';

@Module({
  imports: [
    TypeOrmModule.forFeature([ManufacturerEntity]),
    JwtModule.register({
      secret: 'process.env.JWT_SECRET',
      signOptions: {
        expiresIn: '7d',
      },
    }),
  ],
  providers: [ManufacturerService, ManufacturerResolver],
  exports: [ManufacturerService],
})
export class ManufacturerModule {}
