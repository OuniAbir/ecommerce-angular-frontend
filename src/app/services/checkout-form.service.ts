import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class CheckoutFormService {

  private baseUrl = "http://localhost:8080/spring-mvc-ecommerce/api/";
  constructor( private httpClient: HttpClient) { }
  getCountries():Observable<any>{
    return this.httpClient.get(`${this.baseUrl}countries`)
  }
  getStatesByCountryCode(code : string): Observable<any>{
    return this.httpClient.get(`${this.baseUrl}states/search/findByCountryCode?code=${code}`);
  }
}
