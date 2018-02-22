import { Component, OnInit, NgZone } from '@angular/core';
import { Location } from '@angular/common';
import { Router } from '@angular/router';
import { Device } from '../device';

import { DeviceService } from '../device.service';

@Component({
    selector: 'app-devices',
    templateUrl: './devices.component.html',
    styleUrls: ['./devices.component.css']
})
export class DevicesComponent implements OnInit {

    devices: Device[];

    constructor(
        private zone: NgZone,
        private router: Router,
        private location: Location,
        private deviceService: DeviceService
    ) { }

    ngOnInit() {
        if (this.deviceService.hasDevices()) {
            this.getDevices();
        } else {
            this.zone.run(() => { this.router.navigate(['/welcome']); });
        }
    }

    getDevices(): void {
        this.devices = this.deviceService.getDevices();
        console.dir(this.devices);
        console.log(this.devices);
        if (this.devices.length > 0) {} else {
            // alert('no devices. redirect to discover screen....');
            this.zone.run(() => {
                this.router.navigate(['/welcome']);
            });
        }
    }

    dumpdb() {
        // Wipe devices
        var db = window.localStorage;
        console.log('gonna dump db');
        console.dir(db);
        db.removeItem('devices');
        this.location.back();
    }



    // showDefaultImage(dev): boolean {
    //     console.dir(dev);
    //     return dev.imgPath === '' ? true : false;
    // }
}
