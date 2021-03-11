import { Injectable } from '@nestjs/common';
import { ManufacturerService } from 'src/manufacturer/manufacturer.service';
import * as bcrypt from 'bcrypt';
import { ManufacturerEntity } from 'src/manufacturer/manufacturer.entity';

@Injectable()
export class AuthService {
  constructor(private manufacturerService: ManufacturerService) {}

  // async validateManufacturer(
  //   phoneNumber: string,
  //   password: string,
  // ): Promise<ManufacturerEntity | null> {
  //   const user = await this.manufacturerService.findOneByNumber(phoneNumber);

  //   if (user && (await bcrypt.compare(password, user.passwordHash))) {
  //     return user;
  //   }
  //   return null;
  // }
}
