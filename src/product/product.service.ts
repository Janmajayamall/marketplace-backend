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
import { convertToInt, roundToTwoPlaces } from 'src/shared/helpers';

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

    @InjectRepository(ColourEntity)
    private colourEntityRepository: Repository<ColourEntity>,
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
    manufacturerId: string,
  ): Promise<ProductEntity> {
    const product = this.productRepository.create({
      ...productInput,
      manufacturerId: manufacturerId,
      minOrderSize: convertToInt(productInput.minOrderSize),
      maxOrderSize: convertToInt(productInput.maxOrderSize),
      width: roundToTwoPlaces(productInput.width),
      gsm: roundToTwoPlaces(productInput.gsm),
    });
    return this.productRepository.save(product);
  }

  async updateProduct(
    productId: string,
    productInput: ProductInput,
  ): Promise<any> {
    const modProductInput = { ...productInput };
    delete modProductInput.productCategoryIds;

    return this.productRepository.update(
      { id: productId },
      {
        ...modProductInput,
        minOrderSize: convertToInt(productInput.minOrderSize),
        maxOrderSize: convertToInt(productInput.maxOrderSize),
        width: roundToTwoPlaces(productInput.width),
        gsm: roundToTwoPlaces(productInput.gsm),
      },
    );
  }

  async checkOwnership(
    productId: string,
    manufacturerId: string,
  ): Promise<Boolean> {
    const product = await this.productRepository.findOne({
      id: productId,
      manufacturerId: manufacturerId,
    });
    return !!product;
  }

  async findOneById(productId: string): Promise<ProductEntity> {
    return this.productRepository
      .createQueryBuilder('product')
      .where('product.id = :id', { id: productId })
      .orderBy('product.timestamp', 'ASC')
      .leftJoinAndSelect(
        'product.productCategoryRelations',
        'product-product-category-relation',
      )
      .leftJoinAndSelect(
        'product-product-category-relation.productCategory',
        'product-category',
      )
      .leftJoinAndSelect('product.productImages', 'product-image')
      .getOne();
  }

  async findProductsByManufacturer(manufacturerId: string) {
    return this.productRepository
      .createQueryBuilder('product')
      .where('product.manufacturerId = :id', { id: manufacturerId })
      .orderBy('product.timestamp', 'ASC')
      .leftJoinAndSelect(
        'product.productCategoryRelations',
        'product-product-category-relation',
      )
      .leftJoinAndSelect(
        'product-product-category-relation.productCategory',
        'product-category',
      )
      .leftJoinAndSelect('product.productImages', 'product-image')
      .getMany();
  }

  async findAllAvProductCategories(): Promise<ProductCategoryEntity[]> {
    return this.productCategoryRepository.find({});
  }

  async findAllAvColours(): Promise<ColourEntity[]> {
    return this.colourEntityRepository.find({});
  }

  async updateProductCategoryRelations(
    productCategoryIds: number[],
    productId: string,
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

  async deleteProductImage(productImageId: string): Promise<any> {
    const productImage = await this.productImageRepository.findOne({
      id: productImageId,
    });

    await cloudinary.uploader.destroy(productImage.publicId);

    return this.productImageRepository.delete({ id: productImageId });
  }

  async addProductImage(
    productId: string,
    imagePublicId: string,
  ): Promise<ProductImageEntity> {
    const productImage = this.productImageRepository.create({
      productId: productId,
      publicId: imagePublicId,
    });
    return this.productImageRepository.save(productImage);
  }

  async getAllProductsOfCategory(categoryId: number): Promise<ProductEntity[]> {
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
          .where('product-product-category-relation.productCategoryId = :id', {
            id: categoryId,
          })
          .getQuery();

        return 'product.id IN ' + productIdsSubQuery;
      })
      .leftJoinAndSelect('product.productImages', 'product-image')
      .leftJoinAndSelect('product.variations', 'product-variation')
      .leftJoinAndSelect('product-variation.colour', 'colour')
      .getMany();
  }

  async findOneProductImageById(
    productImageId: string,
  ): Promise<ProductImageEntity> {
    return this.productImageRepository.findOne({ id: productImageId });
  }
}
