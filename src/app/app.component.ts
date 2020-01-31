import { Component, OnInit } from '@angular/core';
import { ToastrService } from 'ngx-toastr';
import { StormserviceService } from './stormservice.service';
import { Router } from '@angular/router';
import { IBearertoken } from './sfstorm.interface';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit {
  title = 'SF-Strom';
  AccessDenied = false;
  isAuthenticating = false;
  isAuthenticated = false;
  constructor(private router: Router, private toastr: ToastrService, private stormService: StormserviceService) { }

  ngOnInit() {
    this.isAuthenticating = true;
    let bToken = this.stormService.getSessionBearerToken();
    if (bToken) {
      this.isAuthenticating = false;
      this.isAuthenticated = true;
      this.AccessDenied = false;
      this.toastr.success(`Successfully logged in.`, '', {
        timeOut: 1500
      });
      // this.stormService.getSalesForceData(bToken).subscribe((res) => {
      //   alert(res);
      // },(err)=>{
      //   alert(err);
      // });


    } else {
      // var code = this.stormService.getAuthorizedCode();
      // if (code) {
      //   this.stormService.getBearerToken(code);
        // this.stormService.getBearerToken(code).subscribe((res) => {
        //   if (res) {
        //     sessionStorage.setItem('bearerToken', res.access_token);
        //   }
        //   this.isAuthenticating = false;
        //   this.isAuthenticated = true;
        //   this.AccessDenied = false;
        //   this.toastr.success(`Successfully logged in.`, '', {
        //     timeOut: 1500
        //   });
        // }, (err) => {
        //   this.toastr.error(`Unauthorized Access !!`, '', {
        //     timeOut: 1000
        //   });
        //   this.isAuthenticated = false;
        //   this.AccessDenied = true;
        //   this.isAuthenticating = false;
        // });
      }
    }
 // }

}
