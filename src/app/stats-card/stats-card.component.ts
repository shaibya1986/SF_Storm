import { Component, OnInit, EventEmitter, Output, Input } from '@angular/core';
import { ToastrService } from 'ngx-toastr';
import { StormserviceService } from '../stormservice.service';
import { IRegion } from '../sfstorm.interface';
@Component({
  selector: 'app-stats-card',
  templateUrl: './stats-card.component.html',
  styleUrls: ['./stats-card.component.css']
})
export class StatsCardComponent implements OnInit {

  constructor(private toastr: ToastrService, private stormService : StormserviceService ) { }
  isApproved = true;
  hasRegionData:boolean
  isNotApproved = false;
  defaultElevation = 12;
  raisedElevation = 18;
  noRecord:boolean=false;
  @Output() messageToEmit = new EventEmitter<string>();
  @Output() isApprovedEmit = new EventEmitter<boolean>();
   
  allRegions : IRegion[]=[];
  cards=[];
  regions:IRegion[]=[];

  slides: any = [[]]; 
  chunk(arr, chunkSize) {
    let R = [];
    for (let i = 0, len = arr.length; i < len; i += chunkSize) {
      R.push(arr.slice(i, i + chunkSize));
    }
    return R;
  }
  ngOnInit() {
    this.hasRegionData = false;
    this.stormService.getRegion().subscribe(data => {
      this.hasRegionData = true;
      this.regions = this.getIRegionObjects(data);
      this.allRegions = [...this.regions];
    });
    this.slides = this.chunk(this.cards, 3);
  }
  getIRegionObjects(data: any[]): IRegion[] {
     return data.map((reg,index) => ({ 
        "region" : reg["Region__c"],
        "noOfMeter":0 ,
        "regionId":reg["Id"],
        "imagePath": this.getImagePath(reg["Region__c"]),
        "stromPath": "../../assets/tenor.gif",
        "isStromPredicted": reg["StormAlert__c"],
        "isApproved": index%2 == 0 ? true : false,
        "isRequestRaised": true,
        "isRejected": false,
        "severity": 89,
        "severityPercentage": "75%",
        "forecast":reg["Description__c"],
        "temp":reg["CurrentTemp__c"] 
      }));
  }

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
  showSelectedRegion(region: string) {
    this.toastr.info(`Selected region : ${region}`, '', {
      timeOut: 1000
    });
  }

  sendMessageToParent(message: string,isApproved:boolean) {
    this.showSelectedRegion(message);
    this.messageToEmit.emit(message);
    this.isApprovedEmit.emit(isApproved);
  }
  sendShutDownrequest(region: any){
 
    this.toastr.success(`Request has been raised for power shut down for ${region.Title} region`, '', {
      timeOut: 3000
    });
    region.isRequestRaised = true;
    region.isApproved= false;

  }

  filterRegion(regionName) {
    this.regions = [...this.allRegions];
    if(regionName)
      this.regions = this.regions.filter((reg)=>{
        return reg.region.toLocaleLowerCase().search(regionName.toLowerCase())>=0;
      });
     this.noRecord = this.regions.length > 0 ? false : true;
  }
   

}
