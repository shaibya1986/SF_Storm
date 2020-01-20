import { HttpClient, HttpRequest, HttpResponse, HttpHeaders } from '@angular/common/http';
import { Observable, from, of } from 'rxjs';
import { Injectable } from '@angular/core';
import { shareReplay, map, debounceTime, tap } from 'rxjs/operators';
import { IRegion, IMeter, IBearertoken } from './sfstorm.interface';
import { GetterSetter } from './getter-setter';

const CACHE_SIZE = 1;

@Injectable()
export class StormserviceService {
  private cacheRegion$: Observable<IRegion[]>;
  private cacheMeterForRegion$: Observable<IMeter>[] = [];
  private getSet = new GetterSetter();

  constructor(private http: HttpClient) { }

  public getRegionFromServer(): Observable<IRegion[]> {
    return this.http.get<IRegion[]>("https://api.myjson.com/bins/16z8f4");
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
    return this.http.get<IMeter>("https://jsonblob.com/api/jsonBlob/a049ffe3-2deb-11ea-ac3c-2bd8564a3c3e")
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
    return this.http.post('http://127.125.40.160/updateMeter/', {
      "region": element.region,
      "isMeterOn": position,
      "meterId": element.meterId
    });
  }
  getAuthorizedCode() {
    const queryString = window.location.search;
    const urlParams = new URLSearchParams(queryString);
    const code = urlParams.get('code');
    if (code) 
      return code;
    else 
      window.location.href = `${this.getSet.sfdcURL}?client_id=${this.getSet.clientId}&redirect_uri= ${this.getSet.callbackURL}&response_type=code`;
  }
  getBearerToken(code):Observable<IBearertoken> {
    var endPointURL = `${this.getSet.endpoint}?client_id=${this.getSet.clientId}&redirect_uri=${this.getSet.callbackURL}&grant_type=authorization_code&code=${code}&client_secret=${this.getSet.ClientSecret}`
    return this.http.post<IBearertoken>(endPointURL, null);
  }
  getSessionBearerToken(){
    return sessionStorage.getItem('bearerToken')
  }


  getSalesForceData(bearerToken):Observable<any>{
    return this.http.post(`${this.getSet.salesForceURL}`,null)
    //.pipe(  map(response => response["records"]));
  }


}