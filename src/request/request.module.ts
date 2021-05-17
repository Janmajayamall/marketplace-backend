import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { RequestController } from './request.controller';
import { RequestEntity } from './request.entity_new';
import { RequestResolver } from './request.resolver';
import { RequestService } from './request.service';

@Module({
  imports:[
    TypeOrmModule.forFeature([
      RequestEntity
    ])
  ],
  controllers:[RequestController],
  providers: [RequestResolver, RequestService],
  exports:[RequestService]
})
export class RequestModule {}
