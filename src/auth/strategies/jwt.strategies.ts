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
  return token;
};

@Injectable()
export class ManufacturerJwtStrategy extends PassportStrategy(
  Strategy,
  'jwt.manufacturer.strategy',
) {
  private readonly logger = new Logger(ManufacturerJwtStrategy.name, true);

  constructor(private manufacturerService: ManufacturerService) {
    super({
      jwtFromRequest: cookieExtractor,
      ignoreExpiration: true,
      secretOrKey: process.env.JWT_SECRET,
    });
  }

  async validate(payload: any) {
    const { type } = payload;

    if (!type || type !== 'manufacturer') {
      throw new UnauthorizedException();
    }

    const manufacturer = await this.manufacturerService.findManufacturerById(
      payload.id,
    );
    this.logger.debug(JSON.stringify(manufacturer));
    if (!manufacturer) {
      throw new UnauthorizedException();
    }
    return payload;
  }
}
@Injectable()
export class BuyerJwtStrategy extends PassportStrategy(
  Strategy,
  'jwt.buyer.strategy',
) {
  private readonly logger = new Logger(BuyerJwtStrategy.name, true);

  constructor(private buyerService: BuyerService) {
    super({
      jwtFromRequest: cookieExtractor,
      ignoreExpiration: true,
      secretOrKey: process.env.JWT_SECRET,
    });
  }

  async validate(payload: any) {
    const { type } = payload;

    if (!type || type !== 'buyer') {
      throw new UnauthorizedException();
    }

    const buyer = await this.buyerService.findBuyerById(payload.id);
    this.logger.debug(JSON.stringify(buyer));
    if (!buyer) {
      throw new UnauthorizedException();
    }
    return payload;
  }
}
