import { Resolver, Mutation, Args, Query, Int } from '@nestjs/graphql';
import { Logger, UseGuards, UseInterceptors } from '@nestjs/common';
import { RequestService } from './request.service';
import { RequestInputType } from './dto/request.input';

@Resolver()
export class RequestResolver {
  private readonly logger = new Logger(RequestResolver.name);

  constructor(
    private requestService: RequestService,
  ) {}

  @Mutation(()=>Boolean)
  async addRequest(
    @Args('requestInput', {type:()=>RequestInputType})
    requestInput: RequestInputType
  ){
    await this.requestService.addNewRequest(requestInput)
    return true
  }

  @Query(()=>Boolean)
  async helloWorld(){
    return true
  }

}
