import { ProductCategory } from './product-category';

export class Product {
    id: number;
    category : ProductCategory ;
    sku: string;
    name: string;
    description: string;
    unitPrice: number;
    imageUrl: string;
    active: boolean;
    unitsInStock: number;
    dateCreated: Date;
    lastUpdate: Date;
}
