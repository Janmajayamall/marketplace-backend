import { Injectable, Logger } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { OrderCartEntity } from './order-cart.entity';

@Injectable()
export class OrderCartService {
  private readonly logger = new Logger(OrderCartService.name, true);

  constructor(
    @InjectRepository(OrderCartEntity)
    private orderCartRepository: Repository<OrderCartEntity>,
  ) {}

  async addItemToOrderCart(item: OrderCartEntity): Promise<OrderCartEntity> {
    const temp = this.orderCartRepository.create(item);
    return this.orderCartRepository.save(temp);
  }

  async getOrderCartsByBuyerId(buyerId: string): Promise<OrderCartEntity[]> {
    return this.orderCartRepository
      .createQueryBuilder('order-cart')
      .where('order-cart.buyerId = :id', { id: buyerId })
      .orderBy('order-cart.timestamp', 'ASC')
      .leftJoinAndSelect('order-cart.manufacturerId', 'manufacturer')
      .getMany();
  }
}
