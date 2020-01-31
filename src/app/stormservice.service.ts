import { HttpClient, HttpRequest, HttpResponse, HttpHeaders } from '@angular/common/http';
import { Observable, from, of, forkJoin } from 'rxjs';
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

  public getRegionFromServer(): Observable<any[]> {
    //return this.http.get<IRegion[]>("https://api.myjson.com/bins/1cyzei");
    // return this.http.get<IRegion[]>("http://192.168.43.192:81/api/v1/getMeterStatus/bvc");
    let salesForceURL = "https://ap15.salesforce.com/services/data/v20.0/sobjects/WeatherInfo__c";
    let Louisiana$ = "a0A2v00000vSiZYEA0";
    let Texas$ = "a0A2v00000vSiYpEAK";
    let Mississippi$ ="a0A2v00000vSiYaEAK" ;
    let Arkansas$="a0A2v00000vSiZyEAK";

    return forkJoin([ 
    this.http.get(`${salesForceURL}/${Louisiana$}`, { headers: this.requestHeaders}),
    this.http.get(`${salesForceURL}/${Texas$}`, { headers: this.requestHeaders}),
    this.http.get(`${salesForceURL}/${Mississippi$}`, { headers: this.requestHeaders}),
    this.http.get(`${salesForceURL}/${Arkansas$}`, { headers: this.requestHeaders})
      ]);
      
  }
    //   .pipe(map(reg => ([{ 
    //   "region" : reg["Region__c"],
    //   "regionId" : reg["Id"],
    //   "noOfMeter":0 ,
    //   "imagePath": this.getImagePath(reg["Region__c"]),
    //   "stromPath": "../../assets/tenor.gif",
    //   "isStromPredicted": reg["StormAlert__c"],
    //   "isApproved": false,
    //   "isRequestRaised": true,
    //   "isRejected": false,
    //   "severity": 89,
    //   "severityPercentage": "75%",
    //   "forecast":reg["Description__c"],
    //   "temp":reg["CurrentTemp__c"]
    // }])));;

    // return this.http.get<IRegion[]>(`https://ap15.salesforce.com/services/data/v20.0/sobjects/WeatherInfo__c/${regionId}`)
    // .pipe(map(reg => ([{ "region" : reg["Region__c"],
    //                     "noOfMeter":0 ,
    //                     "imagePath": this.getImagePath(reg["Region__c"]),
    //                     "stromPath": "../../assets/tenor.gif",
    //                     "isStromPredicted": reg["StormAlert__c"],
    //                     "isApproved": false,
    //                     "isRequestRaised": true,
    //                     "isRejected": false,
    //                     "severity": 89,
    //                     "severityPercentage": "75%",
    //                     "forecast":reg["Description__c"],
    //                     "temp":reg["CurrentTemp__c"]
    //                   }])));
  //}
  getImagePath(region: any): any {
    let imagePath = "";
    switch (region) {
      case "Arkansas":
      imagePath="../../assets/state-icon-ar.png"
      break;
      case "Louisiana":
      imagePath="../../assets/state-icon-la.png"

      break;
      case "Mississippi":
        imagePath="../../assets/state-icon-ms.png"

      break;
      case "Texas":
      imagePath="./../assets/state-icon-tx.png"

      break;
      default:

      break;
    }
    return imagePath;
  }

  public getRegion() {
    if (!this.cacheRegion$) {
      this.cacheRegion$ = this.getRegionFromServer().pipe(
        shareReplay(CACHE_SIZE)
      );
    }
    return this.cacheRegion$;
  }

  public getMeterForRegion(regionId) {
    if (!this.cacheMeterForRegion$[regionId]) {
      this.cacheMeterForRegion$[regionId] = this.getMeterOfSelectedRegion(regionId).pipe(
        shareReplay(CACHE_SIZE)
      );
    }
    return this.cacheMeterForRegion$[regionId];
  }

  public getMeterOfSelectedRegion(regionId): Observable<IMeter> {
    // return this.http.get<IMeter>("https://api.myjson.com/bins/11kbga")
    //   .pipe(map(result => result["filter"](reg => reg.region === regionName)))
    return this.http.get<IMeter>(`https://ap15.salesforce.com/services/data/v20.0/sobjects/Meter__c/${regionId}`, { headers: this.requestHeaders})
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


  // getSalesForceData(bearerToken):Observable<any>{
  //   // return this.http.get(`${this.getSet.salesForceURL}`)
  //   // .pipe(  map(response => response["records"]));
  //   return this.http.get<any[]>('https://sapient-shaibya-dev-ed--c.visualforce.com/services/data/v42.0/query/?q=SELECT+position__c,category__c,date_posted__c,body__c,Name+FROM+Post__c', { headers: this.requestHeaders})
  //   .pipe(
  //   map(response => response["records"])
  //   );
  // }


}