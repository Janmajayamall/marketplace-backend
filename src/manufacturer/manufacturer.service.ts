import { Injectable, Logger } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { ManufacturerInput } from './dto/manufacturer.input';
import { ManufacturerEntity } from './manufacturer.entity';
import * as bcrypt from 'bcrypt';

@Injectable()
export class ManufacturerService {
  private readonly logger = new Logger(ManufacturerService.name, true);

  constructor(
    @InjectRepository(ManufacturerEntity)
    private manufacturerRepository: Repository<ManufacturerEntity>,
  ) {}

  async create(
    manufacturerInput: ManufacturerInput,
  ): Promise<ManufacturerEntity> {
    const passwordHash = await bcrypt.hash(manufacturerInput.password, 10);
    this.logger.debug(passwordHash);
    const manufacturerEntity = this.manufacturerRepository.create({
      ...manufacturerInput,
      passwordHash: passwordHash,
    });
    return this.manufacturerRepository.save(manufacturerEntity);
  }

  async findOneByNumber(phoneNumber: string): Promise<ManufacturerEntity> {
    return this.manufacturerRepository.findOne({
      phoneNumber: phoneNumber,
    });
  }

  async findOneById(id: string): Promise<ManufacturerEntity> {
    return this.manufacturerRepository.findOne({
      id: id,
    });
  }
}
