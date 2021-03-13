import { Injectable, Logger } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { ProductEntity } from './product.entity';
import { ProductInput } from './dto/product.input';
import { ProductVariationEntity } from './../product-variation/product-variation.entity';
import { ManufacturerEntity } from 'src/manufacturer/manufacturer.entity';
import { ProductCategoryEntity } from './productCategory/product-category.entity';
import { ProductProductCategoryRelation } from './productCategory/product-product-category-relation.entity';
import { v2 as cloudinary } from 'cloudinary';
import { UploadProductImageSignType } from './productImage/dto/upload-product-image-sign.type';
import { ProductImageEntity } from './productImage/product-image.entity';
import { ColourEntity } from './colour/colour.entity';
import { Int } from '@nestjs/graphql';
import {
  convertToInt,
  DataEntityStatus,
  roundToTwoPlaces,
} from 'src/shared/helpers';

@Injectable()
export class ProductService {
  private readonly logger = new Logger(ProductService.name);

  constructor(
    @InjectRepository(ProductEntity)
    private productRepository: Repository<ProductEntity>,

    @InjectRepository(ManufacturerEntity)
    private manufacturerRepository: Repository<ManufacturerEntity>,

    @InjectRepository(ProductCategoryEntity)
    private productCategoryRepository: Repository<ProductCategoryEntity>,

    @InjectRepository(ProductProductCategoryRelation)
    private productProductCategoryRelation: Repository<ProductProductCategoryRelation>,

    @InjectRepository(ProductImageEntity)
    private productImageRepository: Repository<ProductImageEntity>,
  ) {
    // configuring cloudinary
    cloudinary.config({
      cloud_name: 'jayeet',
      api_key: '636161499961969',
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
    });
    return this.productRepository.save(product);
  }

  async updateProduct(
    productId: number,
    productInput: ProductInput,
  ): Promise<any> {
    const modProductInput = { ...productInput };
    delete modProductInput.productCategoryIds;

    return this.productRepository.update(
      { id: productId },
      {
        ...modProductInput,
        minOrderSize: convertToInt(productInput.minOrderSize),
        width: roundToTwoPlaces(productInput.width),
        gsm: roundToTwoPlaces(productInput.gsm),
        taxPercentage: roundToTwoPlaces(productInput.taxPercentage),
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
        'product.categories',
        'product-product-category-relation',
        'product-product-category-relation',
        'product-product-category-relation.productId = product.id',
      )
      .leftJoinAndMapOne(
        'product-product-category-relation.category',
        'product-category',
        'product-category',
        'product-category.id = product-product-category-relation.productCategoryId',
      )
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
        'product.categories',
        'product-product-category-relation',
        'product-product-category-relation',
        'product-product-category-relation.productId = product.id',
      )
      .leftJoinAndMapOne(
        'product-product-category-relation.category',
        'product-category',
        'product-category',
        'product-category.id = product-product-category-relation.productCategoryId',
      )
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

  async findAllAvProductCategories(): Promise<ProductCategoryEntity[]> {
    return this.productCategoryRepository.find({
      status: DataEntityStatus.ACTIVE,
    });
  }

  async updateProductCategoryRelations(
    productCategoryIds: number[],
    productId: number,
  ) {
    // delete existing product relations
    await this.productProductCategoryRelation.delete({ productId: productId });

    // define new relations
    const newRelations: ProductProductCategoryRelation[] = productCategoryIds.map(
      (categoryId) => {
        return this.productProductCategoryRelation.create({
          productId: productId,
          productCategoryId: categoryId,
        });
      },
    );

    // save
    return this.productProductCategoryRelation.save(newRelations);
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

  async getAllProductsOfCategoryName(
    categoryName: string,
  ): Promise<ProductEntity[]> {
    return this.productRepository
      .createQueryBuilder('product')
      .where((qb) => {
        const productIdsSubQuery = qb
          .subQuery()
          .select('product-product-category-relation.productId')
          .from(
            ProductProductCategoryRelation,
            'product-product-category-relation',
          )
          // .where('product-product-category-relation.productCategoryId = :id', {
          //   id: categoryId,
          // })
          .where((cqp) => {
            const productCategorySubquery = cqp
              .subQuery()
              .select('product-category.id')
              .from(ProductCategoryEntity, 'product-category')
              .where('product-category.name ILIKE :searchTerm', {
                searchTerm: `%${categoryName}%`,
              })
              .getQuery();

            return (
              'product-product-category-relation.productCategoryId IN' +
              productCategorySubquery
            );
          })
          .andWhere('product.status = :status', {
            status: DataEntityStatus.ACTIVE,
          })
          .getQuery();

        return 'product.id IN ' + productIdsSubQuery;
      })
      .leftJoinAndMapMany(
        'product.categories',
        'product-product-category-relation',
        'product-product-category-relation',
        'product-product-category-relation.productId = product.id',
      )
      .leftJoinAndMapOne(
        'product-product-category-relation.category',
        'product-category',
        'product-category',
        'product-category.id = product-product-category-relation.productCategoryId',
      )
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
