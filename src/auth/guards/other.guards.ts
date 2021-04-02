import {
  ExecutionContext,
  Inject,
  Injectable,
  CanActivate,
} from '@nestjs/common';

@Injectable()
export class AdminGuard implements CanActivate {
  canActivate(context: ExecutionContext): boolean {
    console.log(process.env.ADMIN);
    return process.env.ADMIN === 'true';
  }
}
