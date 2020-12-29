import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Product } from '../common/product';

@Injectable({
  providedIn: 'root'
})
export class ProductService {
  private baseUrl = "http://localhost:8080/api/";
  constructor( private httpClient: HttpClient) { }

  /*
  getProductList() : Observable<any> {

    return this.httpClient.get(`${this.baseUrl}/products`);  

  } 
  */
 
  getProductList(theCategoryId : number) : Observable<any> {

    console.log(`${this.baseUrl}/products/search/findByCategoryid?Categoryid=${theCategoryId}`); 
    return this.httpClient.get(`${this.baseUrl}/products/search/findByCategoryid?Categoryid=${theCategoryId}`);  

  }
  getProductCategories(): Observable<any>{
    console.log(`${this.baseUrl}/product-category`);    
    return this.httpClient.get(`${this.baseUrl}/product-category`);
  }
}
