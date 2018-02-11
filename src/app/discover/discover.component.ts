import { Component, OnInit, NgZone } from '@angular/core';
import { Router } from '@angular/router';

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
    noDevices;
    connectingDevice;
    savedDev;

    debugging;

    constructor(
        private zone: NgZone,
        private discoverService: DiscoverService,
        private deviceService: DeviceService,
        private router: Router
    ) { }

    ngOnInit() {
        this.db.removeItem('devices');
        if (this.discoverService.setup()) {
            //TODO: Build out services for bluetooth connection
            if (typeof bluetoothSerial === 'undefined') { this.debugging = true; }
        } else {
            console.log('turning on disabled bt message here...');
            this.bluetoothDisabled();
        }


        if (!this.debugging) bluetoothSerial.isEnabled(this.listDevices.bind(this), this.bluetoothDisabled.bind(this));
        else this.mockDevices();
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
        bluetoothSerial.list(btd => {
            this.foundDevices = btd.filter(bt => !this.deviceService.hasDevice(bt.address));
        });
    }

    bluetoothDisabled():void {
        this.noDevices = true;
    }

    connectTo(addr: string): void {
        if (!this.debugging) this.connectToBT(addr);
        else this.connectToMock(addr);
    }

    connectToMock(addr: string): void {
        window.setTimeout(() => {
            this.saveDevice(addr);
            this.goToDevices();
        }, 3000);
    }

    saveDevice(addr: string) {
        this.deviceService.saveDevice(this.foundDevices.find(device => device.address === addr));
    }

    connectToBT(addr: string):void {
        // Device mapping:
        // n: name
        // f: frequency / time closed
        // t: time open
        // o: servo open value
        // c: servo closed value
        this.connectingDevice = addr;
        bluetoothSerial.connect(addr, () => {
            this.saveDevice(addr);
            bluetoothSerial.write("[qn]", e => {

                bluetoothSerial.subscribe(']', (data) => {
                    // Need to update the device in the database....
                    this.savedDev = this.foundDevices.find(device => device.address === addr);
                    this.savedDev.name = data.replace(/\[|\]/g, '');

                    this.deviceService.updateDevice(this.savedDev);
                    this.goToDevices();

                },function(e){console.log(e);});


                bluetoothSerial.subscribeRawData((data) => {
                }, function(error) {
                    console.log('error');
                    console.log(error);
                });

            },  e => {
                console.log('write fail cb ');
                console.log(e);
            });
        }, (e) => {
            console.log('do\'h');
            console.dir(e);
        });
    }

    goToDevices(): void {
        // Hack for running ng in cordova which causes onInit to not fire by default
        this.zone.run(() => {
            this.router.navigate(['/devices']);
        });
    }

}
