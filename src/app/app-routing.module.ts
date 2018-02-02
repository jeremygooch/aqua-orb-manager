import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { WelcomeComponent }   from './welcome/welcome.component';
import { DevicesComponent } from './devices/devices.component';
import { DeviceDetailComponent }  from './device-detail/device-detail.component';


const routes: Routes = [
    { path: '', redirectTo: '/welcome', pathMatch: 'full' },
    { path: 'welcome', component: WelcomeComponent },
    { path: 'devices', component: DevicesComponent },
    { path: 'detail/:id', component: DeviceDetailComponent },
];

@NgModule({
    imports: [ RouterModule.forRoot(routes) ],
    exports: [ RouterModule ]
})
export class AppRoutingModule { }
