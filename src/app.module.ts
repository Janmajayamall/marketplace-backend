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
import { ConfigModule, ConfigService } from '@nestjs/config';
import { OrderModule } from './order/order.module';
import { BuyerPaymentModule } from './buyer-payment/buyer-payment.module';
import { PhoneVerificationModule } from './phone-verification/phone-verification.module';
import { RequestController } from './request/request.controller';
import { RequestModule } from './request/request.module';

console.log('\n\n\n\n\n\n\n\n\n\n\n\n\n\n');
console.log(
  `**************************** CONNECTED TO ${process.env.NODE_ENV.toUpperCase()} DATABASE ****************************`,
);
console.log('\n\n\n\n\n\n\n\n\n\n\n\n\n\n');

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
    TypeOrmModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: async (configService: ConfigService) => {
        return {
          type: 'postgres',
          host: configService.get('DB_HOST'),
          port: configService.get('DB_PORT'),
          username: configService.get('DB_USERNAME'),
          password: configService.get('DB_PASSWORD'),
          database: configService.get('DB_DATABASE'),
          entities: ['dist/**/*.entity{.ts,.js}'],
          synchronize: true,
          logging: true,
        };
      },
    }),
    ConfigModule.forRoot({
      envFilePath: [`.${process.env.NODE_ENV}.env`],
      isGlobal: true,
    }),
    RequestModule,
    // ManufacturerModule,
    // ProductModule,
    // ProductVariationModule,
    // AuthModule,
    // BuyerModule,
    // OrderModule,
    // BuyerPaymentModule,
    // PhoneVerificationModule,
  ],
  controllers: [AppController, RequestController],
  providers: [AppService],
})
export class AppModule {}
