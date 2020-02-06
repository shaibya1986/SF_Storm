import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable, forkJoin } from 'rxjs';
import { Injectable } from '@angular/core';
import { shareReplay } from 'rxjs/operators';
import { IRegion, IMeter } from './sfstorm.interface';

const CACHE_SIZE = 1;

@Injectable()
export class StormserviceService {
  requestHeaders
  private cacheRegion$: Observable<IRegion[]>;
  private cacheMeterForRegion$: Observable<IMeter>[] = [];
  private salesforceURL = "https://ap15.salesforce.com/services/data/v42.0/query/?";
  private piURL = "https://192.168.43.192:81";
 

  constructor(private http: HttpClient) {
    this.requestHeaders = new HttpHeaders().set('Content-Type', 'application/json')
      .append('Authorization', `Bearer ${sessionStorage.getItem('AccToken')}`)
  }

  public getRegionFromServer(): Observable<any[]> {
    let meterURL = `${this.salesforceURL}q=SELECT+Id,Location__c+FROM+Meter__c`;
    let regionURL = `${this.salesforceURL}q=SELECT+Id,Region__c,StormAlert__c,Description__c,CurrentTemp__c+FROM+WeatherInfo__c`
    return forkJoin([
      this.http.get(`${regionURL}`, { headers: this.requestHeaders }),
      this.http.get(`${meterURL}`, { headers: this.requestHeaders })
    ]);
  }
  public getRegion() {
    if (!this.cacheRegion$) {
      this.cacheRegion$ = this.getRegionFromServer().pipe(
        shareReplay(CACHE_SIZE)
      );
    }
    return this.cacheRegion$;
  }

  public getMeterForRegion(regionName) {
    if (!this.cacheMeterForRegion$[regionName]) {
      this.cacheMeterForRegion$[regionName] = this.getMeterOfSelectedRegion(regionName).pipe(
        shareReplay(CACHE_SIZE)
      );
    }
    return this.cacheMeterForRegion$[regionName];
  }

  public getMeterOfSelectedRegion(regionName): Observable<any> {
    return this.http.get<any>(`
    ${this.salesforceURL}q=SELECT+Id,OwnerId,Name,Status__c,Health__c,Location__c+FROM+Meter__c+WHERE+Location__c='${regionName}'`, { headers: this.requestHeaders })
  }

  public setMeterOnOff(position, element): Observable<IMeter> {
    return this.http.post(`${piURL}/api/v1/updateMeter`, {
      "region": element.location,
      "isMeterOn": position,
      "meterId": element.meterId
    },{
      headers: new HttpHeaders({ 'Content-Type': 'application/json' })
    });
  }

  getSessionBearerToken() {
    return sessionStorage.getItem('AccToken')
  }
}