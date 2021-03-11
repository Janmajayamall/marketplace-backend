import { Injectable, Logger } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { ManufacturerInput } from './dto/manufacturer.input';
import { ManufacturerEntity } from './manufacturer.entity';

@Injectable()
export class ManufacturerService {
  private readonly logger = new Logger(ManufacturerService.name, true);

  constructor(
    @InjectRepository(ManufacturerEntity)
    private manufacturerRepository: Repository<ManufacturerEntity>,
  ) {}

  async createBuyer(phoneNumber: string): Promise<ManufacturerEntity> {
    const manufacturerEntity = this.manufacturerRepository.create({
      phoneNumber: phoneNumber,
    });
    return this.manufacturerRepository.save(manufacturerEntity);
  }

  async findManufacturerByPhoneNumber(
    phoneNumber: string,
  ): Promise<ManufacturerEntity> {
    return this.manufacturerRepository.findOne({ phoneNumber: phoneNumber });
  }

  async findManufacturerById(id: number): Promise<ManufacturerEntity> {
    return this.manufacturerRepository.findOne({
      id: id,
    });
  }
}
