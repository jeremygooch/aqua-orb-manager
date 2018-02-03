import { ActivatedRoute } from '@angular/router';
import { Location } from '@angular/common';

import { DeviceService }  from '../device.service';

import { Component, OnInit, Input } from '@angular/core';
import { Device } from '../device';

@Component({
    selector: 'app-device-detail',
    templateUrl: './device-detail.component.html',
    styleUrls: ['./device-detail.component.css']
})
export class DeviceDetailComponent implements OnInit {

    @Input() device: Device


    constructor(
        private route: ActivatedRoute,
        private deviceService: DeviceService,
        private location: Location
    ) {}

    ngOnInit(): void {
        this.getDevice();
    }

    getDevice(): void {
        const id = +this.route.snapshot.paramMap.get('id');
        this.device = this.deviceService.getDevice(id);
        console.log('ive got this device');
        console.dir(this.device);
    }

    goBack(): void {
        this.location.back();
    }

}

