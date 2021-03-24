import { Injectable, Logger } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { ProductEntity } from './product.entity';
import { ProductInput } from './dto/product.input';
import { ManufacturerEntity } from 'src/manufacturer/manufacturer.entity';
import { v2 as cloudinary } from 'cloudinary';
import { UploadProductImageSignType } from './productImage/dto/upload-product-image-sign.type';
import { ProductImageEntity } from './productImage/product-image.entity';
import {
  convertToInt,
  DataEntityStatus,
  roundToTwoPlaces,
  sanitizeProductTags,
} from 'src/shared/helpers';

@Injectable()
export class ProductService {
  private readonly logger = new Logger(ProductService.name);

  constructor(
    @InjectRepository(ProductEntity)
    private productRepository: Repository<ProductEntity>,

    @InjectRepository(ManufacturerEntity)
    private manufacturerRepository: Repository<ManufacturerEntity>,

    @InjectRepository(ProductImageEntity)
    private productImageRepository: Repository<ProductImageEntity>,
  ) {
    // configuring cloudinary
    cloudinary.config({
      cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
      api_key: process.env.CLOUDINARY_API_KEY,
      api_secret: process.env.CLOUDINARY_SECRET,
    });
  }

  async addProduct(
    productInput: ProductInput,
    manufacturerId: number,
  ): Promise<ProductEntity> {
    const product = this.productRepository.create({
      ...productInput,
      manufacturerId: manufacturerId,
      minOrderSize: convertToInt(productInput.minOrderSize),
      width: roundToTwoPlaces(productInput.width),
      gsm: roundToTwoPlaces(productInput.gsm),
      taxPercentage: roundToTwoPlaces(productInput.taxPercentage),
      tags: sanitizeProductTags(productInput.tags),
    });
    return this.productRepository.save(product);
  }

  async updateProduct(
    productId: number,
    productInput: ProductInput,
  ): Promise<any> {
    return this.productRepository.update(
      { id: productId },
      {
        ...productInput,
        minOrderSize: convertToInt(productInput.minOrderSize),
        width: roundToTwoPlaces(productInput.width),
        gsm: roundToTwoPlaces(productInput.gsm),
        taxPercentage: roundToTwoPlaces(productInput.taxPercentage),
        tags: sanitizeProductTags(productInput.tags),
      },
    );
  }

  async checkOwnership(
    productId: number,
    manufacturerId: number,
  ): Promise<Boolean> {
    const product = await this.productRepository.findOne({
      id: productId,
      manufacturerId: manufacturerId,
    });
    return !!product;
  }

  async findOneById(productId: number): Promise<ProductEntity> {
    return this.productRepository
      .createQueryBuilder('product')
      .where('product.id = :id AND product.status = :status', {
        id: productId,
        status: DataEntityStatus.ACTIVE,
      })
      .orderBy('product.timestamp', 'ASC')
      .leftJoinAndMapMany(
        'product.images',
        'product-image',
        'product-image',
        'product-image.productId = product.id',
      )
      .leftJoinAndMapMany(
        'product.variations',
        'product-variation',
        'product-variation',
        'product-variation.productId = product.id',
      )
      .getOne();
  }

  async findProductsByManufacturer(manufacturerId: number) {
    return this.productRepository
      .createQueryBuilder('product')
      .where('product.manufacturerId = :id AND product.status = :status', {
        id: manufacturerId,
        status: DataEntityStatus.ACTIVE,
      })
      .orderBy('product.timestamp', 'ASC')
      .leftJoinAndMapMany(
        'product.images',
        'product-image',
        'product-image',
        'product-image.productId = product.id',
      )
      .leftJoinAndMapMany(
        'product.variations',
        'product-variation',
        'product-variation',
        'product-variation.productId = product.id',
      )
      .getMany();
  }

  generateUploadProductImageSignature(): UploadProductImageSignType {
    // Get the timestamp in seconds
    const timestamp = Math.round(new Date().getTime() / 1000);

    // Get the signature using the Node.js SDK method api_sign_request
    const signature = cloudinary.utils.api_sign_request(
      {
        timestamp: timestamp,
      },
      process.env.CLOUDINARY_SECRET,
    );

    return { signature: signature, timestamp: timestamp };
  }

  async deleteProductImage(productImageId: number): Promise<any> {
    const productImage = await this.productImageRepository.findOne({
      id: productImageId,
    });

    await cloudinary.uploader.destroy(productImage.publicId);

    return this.productImageRepository.delete({ id: productImageId });
  }

  async addProductImage(
    productId: number,
    imagePublicId: string,
  ): Promise<ProductImageEntity> {
    const productImage = this.productImageRepository.create({
      productId: productId,
      publicId: imagePublicId,
    });
    return this.productImageRepository.save(productImage);
  }

  async getAllProductsBySearchPhrase(
    searchPhrase: string,
  ): Promise<ProductEntity[]> {
    return this.productRepository
      .createQueryBuilder('product')
      .where(`array_to_string(product.tags, ', ') ILIKE :searchPhrase`, {
        searchPhrase: `%${searchPhrase.trim().toLowerCase()}%`,
      })
      .andWhere('product.status = :status', { status: DataEntityStatus.ACTIVE })
      .leftJoinAndMapMany(
        'product.images',
        'product-image',
        'product-image',
        'product-image.productId = product.id',
      )
      .leftJoinAndMapMany(
        'product.variations',
        'product-variation',
        'product-variation',
        'product-variation.productId = product.id',
      )
      .orderBy('product.timestamp', 'ASC')
      .getMany();
  }

  async findOneProductImageById(
    productImageId: number,
  ): Promise<ProductImageEntity> {
    return this.productImageRepository.findOne({ id: productImageId });
  }
}
