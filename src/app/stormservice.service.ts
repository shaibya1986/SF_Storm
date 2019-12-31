import { HttpClient } from '@angular/common/http';
import { Observable, from, of } from 'rxjs';
import { Injectable } from '@angular/core';
import { shareReplay, map, debounceTime } from 'rxjs/operators';

const CACHE_SIZE = 1;

@Injectable()
export class StormserviceService {
  private cacheRegion$: Observable<any>;
  private cacheMeterForRegion$: Observable<any>[] = [];

  constructor(private http: HttpClient) { }
  
  public getRegionFromServer(): Observable<any> {
    return this.http.get("assets/Region.JSON");
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
      this.cacheMeterForRegion$[regionName] =  this.getMeterOfSelectedRegion(regionName).pipe(
        shareReplay(CACHE_SIZE)
      );
    }
    return   this.cacheMeterForRegion$[regionName];
  }

  public getMeterOfSelectedRegion(regionName): Observable<any> {
    return this.http.get("assets/Meter.JSON")
      .pipe(debounceTime(3000),
        map(result =>
          result["filter"](reg => reg.Region === regionName)
        )
      )
  }
  public setMeterOnOff(position): Observable<any> {
    console.log(position);
    return of(true);
  }
}