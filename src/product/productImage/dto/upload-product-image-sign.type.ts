import { ObjectType, Field, InputType } from '@nestjs/graphql';

@ObjectType()
export class UploadProductImageSignType {
  @Field()
  signature: string;

  @Field()
  timestamp: number;
}
