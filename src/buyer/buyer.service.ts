
import { Injectable, Logger } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { BuyerEntity } from './buyer.entity';
import { BuyerAddressInput } from './buyer-address/dto/buyer-address.input';
import { BuyerAddressEntity } from './buyer-address/buyer-address.entity';
import { BuyerProfileEntity } from './buyer-profile/buyer-profile.entity';
import { BuyerProfileInput } from './buyer-profile/dto/buyer-profile.input';

@Injectable()
export class BuyerService {
  private readonly logger = new Logger(BuyerService.name, true);

  constructor(
    @InjectRepository(BuyerEntity)
    private buyerRepository: Repository<BuyerEntity>,

    @InjectRepository(BuyerProfileEntity)
    private buyerProfileRepository: Repository<BuyerProfileEntity>,
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

  async updateBuyerProfile(
    buyerId: number,
    buyerProfileInput: BuyerProfileInput,
  ): Promise<BuyerProfileEntity> {
    // check whether buyer profile exists or not
    const buyerProfile = await this.buyerProfileRepository.findOne({
      buyerId: buyerId,
    });

    // if profile exists then update other create a buyer profile
    if (buyerProfile) {
      await this.buyerProfileRepository.update(
        { buyerId: buyerId },
        {
          ...buyerProfileInput,
          gstVerified:
            buyerProfileInput.gstin === buyerProfile.gstin
              ? buyerProfile.gstVerified
              : false,
        },
      );
    } else {
      const temp = this.buyerProfileRepository.create({
        buyerId: buyerId,
        ...buyerProfileInput,
        gstVerified: false,
      });
      await this.buyerProfileRepository.save(temp);
    }

    return this.buyerProfileRepository.findOne({
      buyerId: buyerId,
    });
  }

  async findBuyerProfileById(buyerId: number): Promise<BuyerProfileEntity> {
    return this.buyerProfileRepository.findOne({ buyerId: buyerId });
  }
}
