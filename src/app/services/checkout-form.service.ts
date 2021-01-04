import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Country } from '../common/country';
import { map } from 'rxjs/operators';
import { State } from '../common/state';


@Injectable({
  providedIn: 'root'
})
export class CheckoutFormService {

  private baseUrl = "http://localhost:8080/spring-mvc-ecommerce/api";
  constructor( private httpClient: HttpClient) { }
  getCountries():Observable<any>{
    console.log(`${this.baseUrl}countries`);
    return this.httpClient.get<GetResponseCountries>(`${this.baseUrl}/countries`)
    .pipe(map(response => response._embedded.countries));
  }
  getStatesByCountryCode(code : string): Observable<any>{
    console.log(`${this.baseUrl}/states/search/findByCountryCode?code=${code}`);
    return this.httpClient.get<GetResponseStates>(`${this.baseUrl}/states/search/findByCountryCode?code=${code}`)
    .pipe(map(response => response._embedded.states));
  }
}

interface GetResponseCountries {
  _embedded: {
    countries: Country[];
  }
}

interface GetResponseStates {
  _embedded: {
    states: State[];
  }
}
