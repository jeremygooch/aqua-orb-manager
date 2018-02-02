// import { OnsenModule } from 'ngx-onsenui';

import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';

import { FormsModule } from '@angular/forms';


import { AppComponent } from './app.component';
import { DeviceService } from './device.service';
import { DevicesComponent } from './devices/devices.component';
import { DeviceDetailComponent } from './device-detail/device-detail.component';
import { AppRoutingModule } from './/app-routing.module';
import { WelcomeComponent } from './welcome/welcome.component';


@NgModule({
    declarations: [
        AppComponent,
        DevicesComponent,
        DeviceDetailComponent,
        WelcomeComponent
    ],
    imports: [
        BrowserModule,
        // OnsenModule,
        FormsModule,
        AppRoutingModule,
    ],
    schemas: [
        CUSTOM_ELEMENTS_SCHEMA
    ],
    providers: [ DeviceService ],
    bootstrap: [AppComponent]
})
export class AppModule { }
