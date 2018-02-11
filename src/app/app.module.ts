// import { OnsenModule } from 'ngx-onsenui';

import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';

import { FormsModule } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';

import { AppComponent } from './app.component';
import { DeviceService } from './device.service';
import { DiscoverService } from './discover.service';
import { DevicesComponent } from './devices/devices.component';
import { DeviceDetailComponent } from './device-detail/device-detail.component';
import { AppRoutingModule } from './/app-routing.module';
import { WelcomeComponent } from './welcome/welcome.component';
import { DiscoverComponent } from './discover/discover.component';


@NgModule({
    declarations: [
        AppComponent,
        DevicesComponent,
        DeviceDetailComponent,
        WelcomeComponent,
        DiscoverComponent
    ],
    imports: [
        BrowserModule,
        HttpClientModule,
        // OnsenModule,
        FormsModule,
        AppRoutingModule,
    ],
    schemas: [
        CUSTOM_ELEMENTS_SCHEMA
    ],
    providers: [ DeviceService, DiscoverService ],
    bootstrap: [AppComponent]
})
export class AppModule { }
