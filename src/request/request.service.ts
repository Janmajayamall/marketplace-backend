import { Injectable, Logger } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { RequestInputType } from './dto/request.input';
import { RequestEntity } from './request.entity';

@Injectable()
export class RequestService {
    private readonly logger = new Logger(RequestService.name)

    constructor(
        @InjectRepository(RequestEntity)
        private requestRepository: Repository<RequestEntity>
    ){}

    async addNewRequest(requestInput: RequestInputType): Promise<RequestEntity>{
        const request = await this.requestRepository.create({
            ...requestInput
        })

        return this.requestRepository.save(request)
    }
}