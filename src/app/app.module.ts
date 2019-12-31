import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { MDBBootstrapModule } from 'angular-bootstrap-md';
import { StatsCardComponent } from './stats-card/stats-card.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { DemoMaterialModule } from './material-module';
import {BrowserAnimationsModule} from '@angular/platform-browser/animations';
import { HttpClientModule } from '@angular/common/http';
import { MatNativeDateModule } from '@angular/material/core';
import { ToastrModule } from 'ngx-toastr';
import { StormserviceService } from './stormservice.service';
@NgModule({
  declarations: [
    AppComponent,
    StatsCardComponent
  ],
  imports: [
    FormsModule,
    BrowserModule,
    AppRoutingModule,
    DemoMaterialModule,
    BrowserModule,
    BrowserAnimationsModule,
    ToastrModule.forRoot(), // ToastrModule added
    FormsModule,
    HttpClientModule,
    DemoMaterialModule,
    MatNativeDateModule,
    ReactiveFormsModule,
    MDBBootstrapModule.forRoot()
  ],
  providers: [StormserviceService],
  bootstrap: [AppComponent]
})
export class AppModule { }
