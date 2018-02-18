import { Component, OnInit, NgZone } from '@angular/core';
import { Router } from '@angular/router';

import { Device } from '../device';
import { DeviceService } from '../device.service';
import { DevicesComponent } from '../devices/devices.component';
import { DiscoverService } from '../discover.service';
import TextEncoding from 'text-encoding';

declare var bluetoothSerial: any;

@Component({
    selector: 'app-discover',
    templateUrl: './discover.component.html',
    styleUrls: ['./discover.component.css']
})
export class DiscoverComponent implements OnInit {
    // Wipe devices
    db = window.localStorage;


    foundDevices;
    // noDevices;
    connectingDevice;
    noConnection:boolean = false;
    savedDev;

    debugging;


    constructor(
        private zone: NgZone,
        private discoverService: DiscoverService,
        private deviceService: DeviceService,
        private router: Router
    ) { }

    ngOnInit() {
        // this.db.removeItem('devices');
        this.establishConn();
    }

    establishConn():void {
        if (!this.discoverService.setupNew()) {
            this.noConnection = true;
        } else {
            this.discoverService.isAvailable().then(avail => {
                if (avail) {
                    this.noConnection = false;
                    this.listDevices();
                }
                else
                    this.noConnection = true;
            });
        }
    }

    mockDevices():void {
         this.foundDevices = [
            {name: "HC-05",               address: "01:01", id: "02:02", class: 7936},
            {name: "TOYOTA Corolla",      address: "03:03", id: "03:03", class: 1032},
            {name: "myplant01",           address: "04:04", id: "04:04", class: 7936},
            {name: "Daydream controller", address: "05:05", id: "05:05", class: 7936},
            {name: "HMDX Neutron",        address: "06:06", id: "07:07", class: 1028},
            {name: "abiding-aardvark",    address: "08:08", id: "09:09", class: 7936}
        ];
    }

    listDevices():void {
        this.discoverService.list().then(btd => {
            this.foundDevices = btd.filter(bt => !this.deviceService.hasDevice(bt.address));
        });
    }

    connectTo(addr: string): void {
        this.connectingDevice = addr;
        this.discoverService.queryDevice(addr).then(data => {
            data.imgPath = "" ;
            data.id = addr;
            this.deviceService.addDevice(data);
            this.goToDevices();
        }, () => {
            console.log('sad face');
        });
    }

    connectToMock(addr: string): void {
        window.setTimeout(() => {
            // this.deviceService.saveDevice(this.foundDevices.find(device => device.address === addr));
            this.goToDevices();
        }, 3000);
    }

    goToDevices(): void {
        // Hack for running ng in cordova which causes onInit to not fire by default
        this.zone.run(() => {
            this.router.navigate(['/devices']);
        });
    }

}
