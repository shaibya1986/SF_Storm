import { Component, OnInit, ViewChild, HostListener, AfterViewInit, ChangeDetectorRef, EventEmitter, Output, ElementRef } from '@angular/core';
import { MdbTablePaginationComponent, MdbTableDirective } from 'angular-bootstrap-md';
import { StatsCardComponent } from './stats-card/stats-card.component';
import { ToastrService } from 'ngx-toastr';
import { StormserviceService } from './stormservice.service';


@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit, AfterViewInit {
  title = 'SF-Strom';
  @ViewChild(MdbTablePaginationComponent, { static: true }) mdbTablePagination: MdbTablePaginationComponent;
  @ViewChild(MdbTableDirective, { static: true }) mdbTable: MdbTableDirective
  allelements: any = [];
  elements: any = [];
  previous: any = [];
  isRegionApproved: boolean;
  headElements = ['meter Id', 'location', 'meter Name', 'health'];
  searchText: string = '';
  searchRegion: string = '';
  defaultSelectedRegion = "Arkansas";
  @ViewChild(StatsCardComponent,null) statCard: StatsCardComponent;
  @ViewChild('searchRegiontemp',null) searchRegiontemp: ElementRef;

  @HostListener('input')
  oninput() {
    if (event.target["type"] == 'text') {
      this.searchItems();
    }else if(event.target["type"] == 'search'){
      this.SearchRegion();
    }
  }

  constructor(private cdRef: ChangeDetectorRef,private toastr: ToastrService, private stormService : StormserviceService ) { }

  ngOnInit() {
    this.bindMeterAgainstSelectedRegion(this.defaultSelectedRegion); 
    this.toastr.success(`Default selected region is: ${this.defaultSelectedRegion}`, '', {
      timeOut: 1500 
    });

   
  }

  private bindMeterAgainstSelectedRegion(regionName) {
      this.stormService.getMeterForRegion(regionName).subscribe(data => {
        this.elements = data;
        this.mdbTable.setDataSource(this.elements);
        this.previous = this.mdbTable.getDataSource();
      }, (error) => {
        console.log(error.message);
      });
   
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
    if(region){
      this.bindMeterAgainstSelectedRegion(region)
    }
    else{
      this.bindMeterAgainstSelectedRegion(this.defaultSelectedRegion); 
      this.toastr.success(`Default selected region is: ${this.defaultSelectedRegion}`, '', {
        timeOut: 1500
      });
    }
  }

  getMessage(message: string) {
    this.filterMeterData(message)
  }

  getIsApproved(IsApproved: boolean) {
    this.isRegionApproved = IsApproved;
  }

  SearchRegion(){
    
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

  toggle(event,element){
    let onOff = event.checked ? 1 : 0;
    let onOffmessage = event.checked ? 'On' : 'Off';

    this.stormService.setMeterOnOff(onOff,element).subscribe((response)=>{
      if(response.apiStatus==='success'){
        this.toastr.info(`Selected meter is set turn: ${onOffmessage}`, '', {
          timeOut: 1500
        });
      }else{
        this.toastr.error(`Unable to set meter: ${onOffmessage}`, '', {
          timeOut: 1000
        });
      }
    },()=>{
      this.toastr.error(`Unable to set meter: ${onOffmessage}`, '', {
        timeOut: 1000
      });
    })

  }

}
