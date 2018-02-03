import { Component, OnInit, NgZone } from '@angular/core';
import { Router } from '@angular/router';

import { DeviceService } from '../device.service';

declare var bluetoothSerial: any;

@Component({
    selector: 'app-discover',
    templateUrl: './discover.component.html',
    styleUrls: ['./discover.component.css']
})
export class DiscoverComponent implements OnInit {

    foundDevices;
    noDevices;
    connectingDevice;

    constructor(
        private zone: NgZone,
        private deviceService: DeviceService,
        private router: Router
    ) { }

    ngOnInit() {
        bluetoothSerial.isEnabled(this.listDevices.bind(this), this.bluetoothDisabled.bind(this));
    }

    listDevices():void {
        bluetoothSerial.list(btd => {
            this.foundDevices = btd.filter(bt => !this.deviceService.hasDevice(bt.address));
        });
    }

    bluetoothDisabled():void {
        this.noDevices = true;
    }

    connectTo(addr):void {
        this.connectingDevice = addr;
        bluetoothSerial.connect(addr, () => {
            this.deviceService.saveDevice(this.foundDevices.find(device => device.address === addr));

            // Hack for running ng in cordova which causes onInit to not fire by default
            this.zone.run(() => {
                this.router.navigate(['/devices']);
            });
        }, () => {
            console.log('do\'h');
        });
    }

}
