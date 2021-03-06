// import { Injectable, Logger } from '@nestjs/common';
// import { InjectRepository } from '@nestjs/typeorm';
// import { DataEntityStatus } from 'src/shared/helpers';
// import { Repository } from 'typeorm';
// import { OrderCartEntity } from './order-cart.entity';

// @Injectable()
// export class OrderCartService {
//   private readonly logger = new Logger(OrderCartService.name, true);

//   constructor(
//     @InjectRepository(OrderCartEntity)
//     private orderCartRepository: Repository<OrderCartEntity>,
//   ) {}

//   async addItemToOrderCart(item: OrderCartEntity): Promise<OrderCartEntity> {
//     const temp = this.orderCartRepository.create(item);
//     return this.orderCartRepository.save(temp);
//   }

//   async findOrderCartsByBuyerId(buyerId: string): Promise<OrderCartEntity[]> {
//     return (
//       this.orderCartRepository
//         .createQueryBuilder('order-cart')
//         .where('order-cart.buyerId = :id', { id: buyerId })
//         .where('order-cart.status = :value', { value: DataEntityStatus.ACTIVE })
//         .orderBy('order-cart.timestamp', 'ASC')
//         // .leftJoinAndSelect('order-cart.manufacturerId', 'manufacturer')
//         .getMany()
//     );
//   }

//   async findOrderCartItemById(id: string): Promise<OrderCartEntity> {
//     return this.orderCartRepository.findOne({ id: id });
//   }

//   async changeStatusOfOrderCartItemById(
//     id: string,
//     toStatus: DataEntityStatus,
//   ): Promise<any> {
//     return this.orderCartRepository.update(
//       {
//         id: id,
//       },
//       {
//         status: toStatus,
//       },
//     );
//   }
// }
