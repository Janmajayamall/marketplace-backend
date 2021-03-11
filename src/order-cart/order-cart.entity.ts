// import { BuyerEntity } from 'src/buyer/buyer.entity';
// import { ManufacturerEntity } from 'src/manufacturer/manufacturer.entity';
// import { ProductVariationEntity } from 'src/product-variation/product-variation.entity';
// import { ProductEntity } from 'src/product/product.entity';
// import {
//   Entity,
//   Column,
//   PrimaryGeneratedColumn,
//   OneToMany,
//   ManyToOne,
//   JoinColumn,
// } from 'typeorm';
// import { DataEntityStatus } from './../shared/helpers';

// @Entity('order-cart')
// export class OrderCartEntity {
//   @PrimaryGeneratedColumn('uuid')
//   id: string;

//   // order specific details
//   @Column('float')
//   orderQuantitySize: number;

//   @Column('float')
//   orderTotalPrice: number;
//   // end order specific details

//   // buyer details
//   @Column()
//   buyerId: string;

//   @ManyToOne(() => BuyerEntity)
//   @JoinColumn({ name: 'buyerId' })
//   buyer: BuyerEntity;
//   // buyer details end

//   // product variation details
//   @Column('float')
//   productVariationPrice: number;

//   @Column('float')
//   productVariationFinalPrice: number;

//   @Column('bool')
//   productVariationInStock: Boolean;

//   @Column('text')
//   productVariationColourHexCode: string;

//   @Column()
//   productVariationId: string;

//   @ManyToOne(() => ProductVariationEntity)
//   @JoinColumn({ name: 'productVariationId' })
//   productVariation: ProductVariationEntity;
//   // product variation details end

//   // product details
//   @Column('text')
//   productName: string;

//   @Column('text')
//   productDescription: string;

//   @Column('text')
//   productClothComposition: string;

//   @Column('float')
//   productWidth: number;

//   @Column('float')
//   productGsm: number;

//   @Column('text')
//   productPattern: string;

//   @Column('text')
//   productReferenceImageURL: string;

//   @Column('int')
//   productMaxOrderSize: number;

//   @Column('int')
//   productMinOrderSize: number;

//   @Column('text', { nullable: true })
//   productReferenceId;

//   @Column()
//   productId: string;

//   @ManyToOne(() => ProductEntity)
//   @JoinColumn({ name: 'productId' })
//   product: ProductEntity;
//   // product details end

//   // manufacturer details
//   @Column()
//   manufacturerId: string;

//   @ManyToOne(() => ManufacturerEntity)
//   @JoinColumn({ name: 'manufacturerId' })
//   manufacturer: ManufacturerEntity;
//   // end manufacturer details

//   @Column('time without time zone', { default: () => 'CURRENT_TIMESTAMP' })
//   timestamp: Date;

//   @Column('enum', {
//     nullable: false,
//     enum: DataEntityStatus,
//     default: DataEntityStatus.ACTIVE,
//   })
//   status: DataEntityStatus;
// }
