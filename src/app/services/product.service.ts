import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Product } from '../common/product';
import { ProductCategory } from '../common/product-category';
import { map } from 'rxjs/operators';


@Injectable({
  providedIn: 'root'
})
export class ProductService {

  private baseUrl = "http://localhost:8080/spring-mvc-ecommerce/api";
  constructor(private httpClient: HttpClient) { }

  /*
  getProductList() : Observable<any> {

    return this.httpClient.get(`${this.baseUrl}/products`);

  }
  */
  getProductsByNameContaining(theKeyWord: string): Observable<any> {

    console.log(`${this.baseUrl}/products/search/findByNameContaining?name=${theKeyWord}`);
    //return this.httpClient.get(`http://localhost:8080/spring-mvc-ecommerce/api/products/search/findByNameContaining?name=${theKeyWord}`)
    return this.httpClient.get<GetResponseProducts>(`${this.baseUrl}/products/search/findByNameContaining?name=${theKeyWord}`)
    .pipe(map(response => response._embedded.products));
  }
  getProductList(theCategoryId: number): Observable<any> {

    console.log(`${this.baseUrl}/products/search/findByCategoryId?id=${theCategoryId}`);
    //return this.httpClient.get(`${this.baseUrl}/products/search/findByCategoryid?Categoryid=${theCategoryId}`);
    return this.httpClient.get<GetResponseProducts>(`${this.baseUrl}/products/search/findByCategoryId?id=${theCategoryId}`)
    .pipe(map(response => response._embedded.products));

  }
  getProductCategories(): Observable<any> {
    console.log(`${this.baseUrl}/product-category`);
    //return this.httpClient.get(`${this.baseUrl}/product-category`);

    return this.httpClient.get<GetResponseProductCategory>(`${this.baseUrl}/product-category`)
    .pipe(map(response => response._embedded.productCategory));
  }

  getProductById(id: number): Observable<any> {
    console.log(`${this.baseUrl}/product/${id}`);
    //return this.httpClient.get(`${this.baseUrl}/products/${id}`);
    return this.httpClient.get<GetResponseProducts>(`${this.baseUrl}/products/${id}`)
    .pipe(map(response => response._embedded.products));
  }
}


interface GetResponseProducts {
  _embedded: {
    products: Product[];
  }
}

interface GetResponseProductCategory {
  _embedded: {
    productCategory: ProductCategory[];
  }
}
