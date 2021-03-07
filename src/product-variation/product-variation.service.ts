import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { ProductVariationEntity } from './product-variation.entity';
import { ProductVariationInput } from './dto/product-variation.input';
import { ProductEntity } from 'src/product/product.entity';
import { roundToTwoPlaces } from 'src/shared/helpers';

@Injectable()
export class ProductVariationService {
  constructor(
    @InjectRepository(ProductVariationEntity)
    private productVariationRepository: Repository<ProductVariationEntity>,
  ) {}

  async addMultiple(
    productVariationInputs: ProductVariationInput[],
    productId: string,
  ): Promise<ProductVariationEntity[]> {
    const variationEntities = [];
    // convert to entities
    for (let i = 0; i < productVariationInputs.length; i++) {
      const variation = await this.productVariationRepository.findOne({
        colourId: productVariationInputs[i].colourId,
        productId: productId,
      });

      if (!variation) {
        variationEntities.push(
          this.productVariationRepository.create({
            ...productVariationInputs[i],
            productId,
            price: roundToTwoPlaces(productVariationInputs[i].price),
          }),
        );
      }
    }
    return this.productVariationRepository.save(variationEntities);
  }

  async findAllByProductId(
    productId: string,
  ): Promise<ProductVariationEntity[]> {
    return this.productVariationRepository.find({
      where: {
        productId,
      },
      order: {
        timestamp: 'ASC',
      },
    });
  }

  async findOneById(
    productVariationId: string,
  ): Promise<ProductVariationEntity> {
    return this.productVariationRepository.findOne({
      id: productVariationId,
    });
  }

  async updateProductVariationById(
    productVariationId: string,
    productVariationInput: ProductVariationInput,
  ): Promise<any> {
    return this.productVariationRepository.update(
      {
        id: productVariationId,
      },
      {
        ...productVariationInput,
        price: roundToTwoPlaces(productVariationInput.price),
      },
    );
  }
}
