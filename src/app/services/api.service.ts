import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { IEpaUltraviolet } from '../models/iEpaUltraviolet';
import { Observable } from 'rxjs';
import { IEpaUvForecast } from '../models/iEpaUvForecast';
import { INwsRoot } from '../models/nws/iNwsRoot';

@Injectable({
  providedIn: 'root'
})
export class ApiService {

  constructor(private http: HttpClient) { }

  /**
   * Get you current UV Index data from the EPA.  This doesn't seem like it's published, but YOLO.
   * TODO:  There's another API that seems to contain an array of these objects that predict index over a short period of time.
   * @param zipCode 5 digit ZIP code
   * @returns Object containing current UV index and UV alert for the ZIP code
   */
  public getTodayMaxUv(zipCode: number): Observable<IEpaUltraviolet[]> {
    return this.http.get<IEpaUltraviolet[]>("https://data.epa.gov/efservice/getEnvirofactsUVDaily/ZIP/" + zipCode + "/JSON");
  }

  public getTodayHourlyUv(zipCode: number): Observable<IEpaUvForecast[]> {
    return this.http.get<IEpaUvForecast[]>("https://data.epa.gov/efservice/getEnvirofactsUVHOURLY/ZIP/" + zipCode + "/JSON");
  }

  public getWeatherAlerts(zoneCode: string): Observable<INwsRoot> {
    return this.http.get<INwsRoot>("https://api.weather.gov/alerts/active/zone/" + zoneCode);
  }

  public getStationsForZone(zoneCode: string, stationLimit: number): Observable<INwsRoot> {
    return this.http.get<INwsRoot>("https://api.weather.gov/zones/forecast/" + zoneCode + "/stations?limit=" + stationLimit);
  }

  public getLatestStationObservation(stationId: string): Observable<INwsRoot> {
    return this.http.get<INwsRoot>("https://api.weather.gov/stations/" + stationId + "/observations/latest?require_qc=false");
  }
}
