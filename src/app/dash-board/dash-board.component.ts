import { Component, OnInit, ViewChild, HostListener, AfterViewInit, ChangeDetectorRef, EventEmitter, Output, ElementRef } from '@angular/core';
import { MdbTablePaginationComponent, MdbTableDirective } from 'angular-bootstrap-md';
import { ToastrService } from 'ngx-toastr';
import { Router } from '@angular/router';
import { StatsCardComponent } from '../stats-card/stats-card.component';
import { StormserviceService } from '../stormservice.service';
import { timer, from } from 'rxjs'
import { map, concatMap } from 'rxjs/operators' 
import { setTimeout } from 'timers';


@Component({
  selector: 'app-dash-board',
  templateUrl: './dash-board.component.html',
  styleUrls: ['./dash-board.component.css']
})
export class DashBoardComponent implements OnInit, AfterViewInit {
  hasNewMeterData: boolean;
  @ViewChild(MdbTablePaginationComponent, { static: true }) mdbTablePagination: MdbTablePaginationComponent;
  @ViewChild(MdbTableDirective, { static: true }) mdbTable: MdbTableDirective
  allelements: any = [];
  elements: any = [];
  previous: any = [];
  isRegionApproved: boolean;
  headElements = ['meter Id', 'location', 'meter Name', 'health', 'meter On/Off'];
  searchText: string = '';
  searchRegion: string = '';
  defaultSelectedRegion = "Arkansas";
  @ViewChild(StatsCardComponent, null) statCard: StatsCardComponent;
  @ViewChild('searchRegiontemp', null) searchRegiontemp: ElementRef;

  @HostListener('input')
  oninput() {
    if (event.target["type"] == 'text') {
      this.searchItems();
    } else if (event.target["type"] == 'search') {
      this.SearchRegion();
    }
  }

  constructor(
    private router: Router, 
    private cdRef: ChangeDetectorRef, 
    private toastr: ToastrService, 
    private stormService: StormserviceService) { }

  ngOnInit() {
    this.hasNewMeterData = false
    this.bindMeterAgainstSelectedRegion(this.defaultSelectedRegion);
    this.toastr.success(`Default selected region is: ${this.defaultSelectedRegion}`, '', {
      timeOut: 1500
    });

  
  }
  getRegularMeterUpdateOfSelectedRegion() {

    this.stormService.getMeterOfSelectedRegion(this.defaultSelectedRegion).subscribe((data)=>{
      this.elements = this.getMeterObjects(data);
      this.mdbTable.setDataSource(this.elements);
      this.previous = this.mdbTable.getDataSource();
      console.log('got new data for ' + this.defaultSelectedRegion);
      setTimeout(this.getRegularMeterUpdateOfSelectedRegion,5000);
    });

    

  }

  private bindMeterAgainstSelectedRegion(regionName) {
    this.stormService.getMeterForRegion(regionName).subscribe(data => {
      this.hasNewMeterData = true;
      this.elements = this.getMeterObjects(data);
      this.mdbTable.setDataSource(this.elements);
      this.previous = this.mdbTable.getDataSource();
      this.getRegularMeterUpdateOfSelectedRegion()
    }, (error) => {
      console.log(error.message);
    });

  }
  getMeterObjects(data): any {
    return data.records.map((meter)=>({
      "meterId": meter["Id"],
      "location": meter["Location__c"],
      "meterName": meter["Name"],
      "health": meter["Health__c"],
      "region": meter["Name"],
      "isApproved": true,
      "isMeterOn": meter["Status__c"],
      "isToggling": false 
    }))
  }

  ngAfterViewInit() {
    this.mdbTablePagination.setMaxVisibleItemsNumberTo(5);
    this.mdbTablePagination.calculateFirstItemIndex();
    this.mdbTablePagination.calculateLastItemIndex();
    this.cdRef.detectChanges();
  }

  searchItems() {
    const prev = this.mdbTable.getDataSource();
    if (!this.searchText) {
      this.mdbTable.setDataSource(this.previous);
      this.elements = this.mdbTable.getDataSource();
    }
    if (this.searchText) {
      this.elements = this.mdbTable.searchLocalDataBy(this.searchText);
      this.mdbTable.setDataSource(prev);
    }
  }
  filterMeterData(region: string) {
    this.hasNewMeterData = false;
    if (region) {
      this.bindMeterAgainstSelectedRegion(region)
    }
    else {
      this.bindMeterAgainstSelectedRegion(this.defaultSelectedRegion);
      this.toastr.success(`Default selected region is: ${this.defaultSelectedRegion}`, '', {
        timeOut: 1500
      });
    }
  }

  getMessage(message: string) {
    this.defaultSelectedRegion = message;
    this.filterMeterData(message)
  } 
  getIsApproved(IsApproved: boolean) {
    this.isRegionApproved = IsApproved;
  }

  SearchRegion() {

    // fromEvent(this.searchRegiontemp.nativeElement, 'keyup').pipe(
    //   map((event: any) => {
    //     return event.target.value;
    //   })
    //   ,filter(res => res.length > 2)
    //   ,debounceTime(1000)        
    //   ,distinctUntilChanged()
    //   ).subscribe((text: string) => {
    //     // this.statCard.filterRegion(this.searchRegion)
    //     // this.filterMeterData(this.searchRegion);
    //     this.statCard.filterRegion(text)
    //     this.filterMeterData(text);
    //   });

    this.statCard.filterRegion(this.searchRegion)
    this.filterMeterData(this.searchRegion);
  }

  toggle(event, element) {
    element.isToggling = true;
    let ischecked = event.checked;
    let onOff = ischecked ? 1 : 0;
    let onOffmessage = ischecked ? 'On' : 'Off';
    event.source.setDisabledState(true);
    this.stormService.setMeterOnOff(onOff, element).subscribe((response) => {
      event.source.setDisabledState(false);
      element.isToggling = false;
      if (response.apiStatus === 'success') {
        this.toastr.info(`Selected meter is set turn: ${onOffmessage}`, '', {
          timeOut: 1500
        });
      } else {
        this.toastr.error(`Unable to set meter: ${onOffmessage}`, '', {
          timeOut: 1000
        });
      }
    }, () => {
      event.source.setDisabledState(false);
      event.source.checked = !ischecked
      element.isMeterOn = !onOff;
      element.isToggling = false;
      this.toastr.error(`Unable to set meter: ${onOffmessage}`, '', {
        timeOut: 1000
      });
    })

  }

}
