import { Component, OnInit, NgZone } from '@angular/core';
import { Device } from '../device';
import { Router } from '@angular/router';

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
        if (this.devices.length > 0) {} else {
            alert('no devices. redirect to discover screen....');
        }
    }
}