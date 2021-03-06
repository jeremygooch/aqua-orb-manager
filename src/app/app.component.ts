import { Component, OnInit } from '@angular/core';
import { Location } from '@angular/common';

declare var bluetoothSerial;
declare var navigator;
declare var cordova;
// declare var FilePath;
// declare var imagePicker;

@Component({
    selector: 'app-root',
    templateUrl: './app.component.html',
    styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit {
    constructor(
        private location: Location
    ) { }
    title = 'Aqua Orb Manager';

    ngOnInit() {
        document.addEventListener("deviceready", onDeviceReady, false);

        function onDeviceReady() {
            this.bluetoothSerial = bluetoothSerial;
            this.navigator = navigator;
            this.cordova = cordova;
            // this.FilePath = FilePath;
            // this.imagePicker = imagePicker;
        }
    }
    // goBack(): void {
    //     this.location.back();
    // }
}
