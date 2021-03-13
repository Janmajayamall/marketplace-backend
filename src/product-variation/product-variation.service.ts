import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { ProductVariationEntity } from './product-variation.entity';
import { ProductVariationInput } from './dto/product-variation.input';
import { ProductEntity } from 'src/product/product.entity';
import { DataEntityStatus, roundToTwoPlaces } from 'src/shared/helpers';

@Injectable()
export class ProductVariationService {
  constructor(
    @InjectRepository(ProductVariationEntity)
    private productVariationRepository: Repository<ProductVariationEntity>,
  ) {}

  async addMultiple(
    productVariationInputs: ProductVariationInput[],
    productId: number,
  ): Promise<ProductVariationEntity[]> {
    const variationEntities = [];
    // convert to entities
    for (let i = 0; i < productVariationInputs.length; i++) {
      variationEntities.push(
        this.productVariationRepository.create({
          ...productVariationInputs[i],
          productId,
          price: roundToTwoPlaces(productVariationInputs[i].price),
        }),
      );
    }
    return this.productVariationRepository.save(variationEntities);
  }

  async findAllByProductId(
    productId: number,
  ): Promise<ProductVariationEntity[]> {
    return this.productVariationRepository.find({
      where: {
        productId,
        status: DataEntityStatus.ACTIVE,
      },
      order: {
        timestamp: 'DESC',
      },
    });
  }

  async findOneById(
    productVariationId: number,
  ): Promise<ProductVariationEntity> {
    return this.productVariationRepository.findOne({
      id: productVariationId,
      status: DataEntityStatus.ACTIVE,
    });
  }

  async updateProductVariationById(
    productVariationId: number,
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

  async changeProductVariationStatus(
    productVariationId: number,
    toStatus: DataEntityStatus,
  ) {
    return this.productVariationRepository.update(
      {
        id: productVariationId,
      },
      {
        status: toStatus,
      },
    );
  }
}
