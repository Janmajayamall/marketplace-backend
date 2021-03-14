import { Injectable, Logger } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { ProductVariationEntity } from 'src/product-variation/product-variation.entity';
import { ProductEntity } from 'src/product/product.entity';
import { convertToInt, roundToTwoPlaces } from 'src/shared/helpers';
import { Repository } from 'typeorm';
import { OrderEntity, OrderStage } from './order.entity';

@Injectable()
export class OrderService {
  private readonly logger = new Logger(OrderService.name);

  constructor(
    @InjectRepository(OrderEntity)
    private orderRepository: Repository<OrderEntity>,

    @InjectRepository(ProductVariationEntity)
    private productVariationRepository: Repository<ProductVariationEntity>,

    @InjectRepository(ProductEntity)
    private productRepository: Repository<ProductEntity>,
  ) {}

  async addNewOrder(
    productId: number,
    productVariationId: number,
    buyerId: number,
    orderQuantity: number,
  ): Promise<OrderEntity> {
    // get the product
    const product = await this.productRepository.findOne({ id: productId });
    if (!product) {
      throw new Error('Product does not exists');
    }

    // get the product variation
    const productVariation = await this.productVariationRepository.findOne({
      id: productVariationId,
      productId: productId,
    });
    if (!productVariation) {
      throw new Error('Product variation does not exits');
    }

    // calculating total price
    const totalPrice = roundToTwoPlaces(
      productVariation.price * convertToInt(orderQuantity),
    );
    const totalTax = roundToTwoPlaces(
      totalPrice * (product.taxPercentage / 100),
    );

    // creating new order
    const newOrder = this.orderRepository.create({
      // ORDER RELATED
      orderQuantity: convertToInt(orderQuantity),
      orderStage: OrderStage.NEW,
      totalPrice: totalPrice,
      totalTax: totalTax,
      buyerId: buyerId,
      manufacturerId: product.manufacturerId,
      // ORDER RELATED ENDS

      // PRODUCT DETAILS
      productId: productId,
      productName: product.name,
      productDescription: product.description,
      productClothComposition: product.clothComposition,
      productWidth: product.width,
      productGsm: product.gsm,
      productPattern: product.pattern,
      productMinOrderSize: product.minOrderSize,
      productReferenceId: product.referenceId,
      productHsnCode: product.hsnCode,
      productTaxPercentage: product.taxPercentage,
      // PRODUCT DETAILS ENDS

      // PRODUCT VARIATION DETAILS
      productVariationId: productVariationId,
      productVariationPrice: productVariation.price,
      productVariationInStock: productVariation.inStock,
      productVariationColourHexCode: productVariation.colourHexCode,
      productVariationRChannel: productVariation.rChannel,
      productVariationGChannel: productVariation.gChannel,
      productVariationBChannel: productVariation.bChannel,
      // PRODUCT VARIATION DETAILS END
    });

    return this.orderRepository.save(newOrder);
  }

  async findOrdersByManufacturerId(
    manufacturerId: number,
  ): Promise<OrderEntity[]> {
    return this.orderRepository
      .createQueryBuilder('order')
      .where('order.manufacturerId = :id', { id: manufacturerId })
      .orderBy('order.timestamp', 'DESC')
      .leftJoinAndMapOne(
        'product.buyerProfile',
        'buyer-profile',
        'buyer-profile',
        'buyer-profile.id = order.buyerId',
      )
      .leftJoinAndMapMany(
        'product.images',
        'product-image',
        'product-image',
        'product-image.productId = order.productId',
      )
      .getMany();
  }

  async findOrderDetailsById(orderId: number): Promise<OrderEntity> {
    return this.orderRepository
      .createQueryBuilder('order')
      .where('order.id = :id', { id: orderId })
      .orderBy('order.timestamp', 'DESC')
      .leftJoinAndMapOne(
        'product.buyerProfile',
        'buyer-profile',
        'buyer-profile',
        'buyer-profile.id = order.buyerId',
      )
      .leftJoinAndMapMany(
        'product.productImages',
        'product-image',
        'product-image',
        'product-image.productId = order.productId',
      )
      .getOne();
  }

  async findOrdersByBuyerId(buyerId: number) {
    return this.orderRepository
      .createQueryBuilder('order')
      .where('order.buyerId = :id', { id: buyerId })
      .orderBy('order.timestamp', 'DESC')
      .leftJoinAndMapMany(
        'product.productImages',
        'product-image',
        'product-image',
        'product-image.productId = order.productId',
      )
      .getMany();
  }
}
