import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { GraphQLModule } from '@nestjs/graphql';
import { join } from 'path';
import { ManufacturerModule } from './manufacturer/manufacturer.module';
import { ProductModule } from './product/product.module';
import { ProductVariationModule } from './product-variation/product-variation.module';
import { AuthService } from './auth/auth.service';
import { AuthModule } from './auth/auth.module';
import { BuyerModule } from './buyer/buyer.module';
import { ConfigModule } from '@nestjs/config';
import { OrderCartModule } from './order-cart/order-cart.module';

@Module({
  imports: [
    GraphQLModule.forRoot({
      autoSchemaFile: join(process.cwd(), 'src/schema.gql'),
      sortSchema: true,
      cors: {
        origin: true,
        credentials: true,
      },
      context: ({ req, res }) => ({ req, res }),
    }),
    TypeOrmModule.forRoot(),
    ManufacturerModule,
    ProductModule,
    ProductVariationModule,
    AuthModule,
    BuyerModule,
    ConfigModule.forRoot({ isGlobal: true }),
    OrderCartModule,
  ],
  controllers: [AppController],
  providers: [AppService, AuthService],
})
export class AppModule {}
