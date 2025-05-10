import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { IEpaUltraviolet } from '../models/iEpaUltraviolet';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ApiService {

  constructor(private http: HttpClient) { }

  public getCurrentUv(zipCode: number): Observable<IEpaUltraviolet> {
    return this.http.get<IEpaUltraviolet>("https://data.epa.gov/efservice/getEnvirofactsUVDaily/ZIP/" + zipCode + "/JSON");
  }
}
