import { HttpClient, HttpRequest, HttpResponse, HttpHeaders } from '@angular/common/http';
import { Observable, from, of } from 'rxjs';
import { Injectable } from '@angular/core';
import { shareReplay, map, debounceTime, tap } from 'rxjs/operators';
import { IRegion, IMeter, IBearertoken } from './sfstorm.interface';
import { GetterSetter } from './getter-setter';

const CACHE_SIZE = 1;

@Injectable()
export class StormserviceService {
  requestHeaders
  private cacheRegion$: Observable<IRegion[]>;
  private cacheMeterForRegion$: Observable<IMeter>[] = [];
  private getSet = new GetterSetter();

  constructor(private http: HttpClient) {

    this.requestHeaders = new HttpHeaders().set('Content-Type', 'application/json')
    .append('Authorization', `Bearer ${sessionStorage.getItem('AccToken')}`)
    

   }

  public getRegionFromServer(): Observable<IRegion[]> {
    return this.http.get<IRegion[]>("https://api.myjson.com/bins/1cyzei");
    // return this.http.get<IRegion[]>("http://192.168.43.192:81/api/v1/getMeterStatus/bvc");
  }

  get getRegion() {
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

  public getMeterOfSelectedRegion(regionName): Observable<IMeter> {
    return this.http.get<IMeter>("https://jsonblob.com/aaea99ea-4408-11ea-9fc2-f544aa18ecbd")
      .pipe(debounceTime(3000),
        map(result =>
          result["filter"](reg => reg.region === regionName)
        )
      )
  }


  // public getMeterOfSelectedRegion(regionName): Observable<any> {
  //   return this.http.get(`http://127.125.40.160/getMeterStatus/${regionName}`)
  //   .pipe(map(result=>{

  //   }));
  // }

  public setMeterOnOff(position, element): Observable<IMeter> {
    return this.http.post('https://192.168.43.192:81/api/v1/updateMeter', {
      "region": element.region,
      "isMeterOn": position,
      "meterId": element.meterId
    });
  }
 
 
  getSessionBearerToken(){
    return sessionStorage.getItem('AccToken')
  }


  getSalesForceData(bearerToken):Observable<any>{
    // return this.http.get(`${this.getSet.salesForceURL}`)
    // .pipe(  map(response => response["records"]));
    return this.http.get<any[]>('https://sapient-shaibya-dev-ed--c.visualforce.com/services/data/v42.0/query/?q=SELECT+position__c,category__c,date_posted__c,body__c,Name+FROM+Post__c', { headers: this.requestHeaders})
    .pipe(
    map(response => response["records"])
    );
  }


}