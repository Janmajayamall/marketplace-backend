import { Injectable, Logger } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { BuyerEntity } from './buyer.entity';
import { BuyerAddressInput } from './buyer-address/dto/buyer-address.input';
import { BuyerAddressEntity } from './buyer-address/buyer-address.entity';

@Injectable()
export class BuyerService {
  private readonly logger = new Logger(BuyerService.name, true);

  constructor(
    @InjectRepository(BuyerEntity)
    private buyerRepository: Repository<BuyerEntity>,

    @InjectRepository(BuyerAddressEntity)
    private buyerAddressRepository: Repository<BuyerAddressEntity>,
  ) {}

  async findBuyerByPhoneNumber(phoneNumber: string): Promise<BuyerEntity> {
    return this.buyerRepository.findOne({ phoneNumber: phoneNumber });
  }

  async createBuyer(phoneNumber: string): Promise<BuyerEntity> {
    const buyerEntity = this.buyerRepository.create({
      phoneNumber: phoneNumber,
    });
    return this.buyerRepository.save(buyerEntity);
  }

  async findBuyerById(id: number): Promise<BuyerEntity> {
    return this.buyerRepository.findOne({ id: id });
  }

  async updateAddress(
    buyerId: number,
    addressInput: BuyerAddressInput,
  ): Promise<any> {
    // check if address for buyer exists
    const addressCheck = await this.buyerAddressRepository.findOne({
      buyerId: buyerId,
    });

    // if address is null then create new one
    if (!addressCheck) {
      const tempCreate = this.buyerAddressRepository.create({
        ...addressInput,
        buyerId: buyerId,
      });
      return this.buyerAddressRepository.save(tempCreate);
    }
    // else update the existing address
    else {
      return this.buyerAddressRepository.update(
        {
          buyerId: buyerId,
        },
        {
          ...addressInput,
        },
      );
    }
  }

  async findBuyerAddressesByBuyerId(
    buyerId: number,
  ): Promise<BuyerAddressEntity[]> {
    return this.buyerAddressRepository.find({ where: { buyerId: buyerId } });
  }
}
