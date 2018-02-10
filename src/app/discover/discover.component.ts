import { Component, OnInit, NgZone } from '@angular/core';
import { Router } from '@angular/router';

import { DeviceService } from '../device.service';
import TextEncoding from 'text-encoding';

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
        // API:
        // n: name
        // f: frequency / time closed
        // t: time open
        // o: servo open value
        // c: servo closed value
        this.connectingDevice = addr;
        bluetoothSerial.connect(addr, () => {
            console.log('Established connection. Sending Status Query.');
            bluetoothSerial.write("[qn]", e => {

                bluetoothSerial.subscribe(']', function (data) {
                    console.log('received regular message');
                    console.log(data);

                    console.log('reg msg length: ' + data.length);
                    console.log('reg msg type: ' + typeof data);

                },function(e){console.log(e);});


                bluetoothSerial.subscribeRawData(function (data) {
                }, function(error) {
                    console.log('error');
                    console.log(error);
                });

            },  e => {
                console.log('write fail cb ');
                console.log(e);
            });




            // this.deviceService.saveDevice(this.foundDevices.find(device => device.address === addr));

            // Hack for running ng in cordova which causes onInit to not fire by default
            // this.zone.run(() => {
            //     this.router.navigate(['/devices']);
            // });
        }, (e) => {
            console.log('do\'h');
            console.dir(e);
        });
    }

}
