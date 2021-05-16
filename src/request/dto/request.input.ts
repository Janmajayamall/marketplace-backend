import { ObjectType, Field , InputType} from '@nestjs/graphql';

@InputType()
export class RequestInputType {
  @Field()
  details: string

  @Field()
  phoneNumber: string
}
