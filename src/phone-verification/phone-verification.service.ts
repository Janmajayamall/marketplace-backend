import { Injectable, Logger, Param } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, RepositoryNotTreeError } from 'typeorm';
import { PhoneVerificationEntity } from './phone-verification.entity';
import initMB from 'messagebird';

@Injectable()
export class PhoneVerificationService {
  private readonly logger = new Logger(PhoneVerificationService.name, true);
  private messagebird = initMB(process.env.MESSAGEBIRD_API_KEY);
  constructor(
    @InjectRepository(PhoneVerificationEntity)
    private phoneVerificationRepository: Repository<PhoneVerificationEntity>,
  ) {}

  async sendVerificationCode(phoneNumber: string) {
    // check whether verification request breaches 3 minutes interval rule
    const existingRecord = await this.phoneVerificationRepository
      .createQueryBuilder('phone-verification')
      .where("phone-verification.timestamp >= NOW() - INTERVAL '3 minutes'")
      .andWhere('phone-verification.phoneNumber = :phoneNumber', {
        phoneNumber: phoneNumber,
      })
      .getMany();
    if (existingRecord.length !== 0) {
      return;
    }

    // send the verification code
    // REMOVE THIS (false)
    const sendResponse: any =
      process.env.NODE_ENV === 'production' && false
        ? await new Promise((resolve, rejects) => {
            this.messagebird.verify.create(
              phoneNumber,
              {
                originator: 'OneStop',
                type: 'sms',
                template:
                  'Your login code is: %token. Valid for next 3 minutes',
                timeout: 180,
                tokenLength: 6,
              },
              function (err, response) {
                if (err) {
                  rejects(err);
                  return;
                }
                resolve(response);
              },
            );
          })
        : {
            id: 'dev_fake_one',
          };

    // delete rows with phoneNumber
    await this.phoneVerificationRepository.delete({
      phoneNumber: phoneNumber,
    });

    // save response
    const createObj = this.phoneVerificationRepository.create({
      verificationId: sendResponse.id,
      phoneNumber: phoneNumber,
    });
    await this.phoneVerificationRepository.save(createObj);
  }

  async verifyVerificationCode(phoneNumber: string, verificationToken: string) {
    // get verification id
    const phoneVerificationObject = await this.phoneVerificationRepository
      .createQueryBuilder('phone-verification')
      //   .where("phone-verification.timestamp >= NOW() - INTERVAL '3 minutes'")
      .andWhere('phone-verification.phoneNumber = :phoneNumber', {
        phoneNumber: phoneNumber,
      })
      .orderBy('phone-verification.timestamp', 'DESC')
      .getOne();

    if (phoneVerificationObject == undefined) {
      throw new Error('Invalid verification code');
    }

    // if in dev then don't need to verify token
    // REMOVE THIS (true)
    if (process.env.NODE_ENV === 'development' || true) {
      return;
    }

    // verify token
    await new Promise((resolve, rejects) => {
      this.messagebird.verify.verify(
        phoneVerificationObject.verificationId,
        verificationToken,
        function (err, response) {
          if (err) {
            console.log(err);
            rejects(err);
            return;
          }
          resolve(response);
        },
      );
    });
  }
}
