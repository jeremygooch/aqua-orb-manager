import { Component, OnInit } from '@angular/core';
import { Device } from '../device';

import { DeviceService } from '../device.service';

@Component({
    selector: 'app-devices',
    templateUrl: './devices.component.html',
    styleUrls: ['./devices.component.css']
})
export class DevicesComponent implements OnInit {

    devices: Device[];

    constructor(private deviceService: DeviceService) { }


    ngOnInit() {
        this.getDevices();
    }

    getDevices(): void {
        this.devices = this.deviceService.getDevices();
    }
}
