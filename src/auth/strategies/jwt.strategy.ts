import { ExtractJwt, Strategy } from 'passport-jwt';
import { PassportStrategy } from '@nestjs/passport';
import { Injectable, Logger, UnauthorizedException } from '@nestjs/common';
import { ManufacturerService } from 'src/manufacturer/manufacturer.service';
import { BuyerService } from 'src/buyer/buyer.service';

const cookieExtractor = (req: any): string | null => {
  let token = null;
  if (req && req.cookies) {
    token = req.cookies.token;
  }
  console.log(token, 'this is token');
  return token;
};

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy, 'jwt.strategy') {
  private readonly logger = new Logger(JwtStrategy.name, true);

  constructor(
    private manufacturerService: ManufacturerService,
    private buyerService: BuyerService,
  ) {
    super({
      jwtFromRequest: cookieExtractor,
      ignoreExpiration: true,
      secretOrKey: 'process.env.JWT_SECRET',
    });
  }

  async validate(payload: any) {
    const { type } = payload;
    console.log(payload, 'this is payload');
    if (!type) {
      throw new UnauthorizedException();
    }

    if (type === 'manufacturer') {
      const manufacturer = await this.manufacturerService.findOneById(
        payload.id,
      );
      if (!manufacturer) {
        throw new UnauthorizedException();
      }
      return payload;
    } else if (type === 'buyer') {
      const buyer = await this.buyerService.findOneById(payload.id);
      if (!buyer) {
        throw new UnauthorizedException();
      }
      return payload;
    }

    throw new UnauthorizedException();
  }
}
