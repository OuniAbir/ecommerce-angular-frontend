import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Purchase } from '../common/purchase';

@Injectable({
  providedIn: 'root'
})
export class CheckoutServiceService {

  private baseUrl ="http://localhost:8080/spring-mvc-ecommerce/api/checkout/purchase"

  constructor( private httpClient : HttpClient) { }

  placeOrder(purchase : Purchase ): Observable<any>{

    return this.httpClient.post(this.baseUrl, purchase);
  }

}
