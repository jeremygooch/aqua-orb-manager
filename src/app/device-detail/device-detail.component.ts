import { ActivatedRoute } from '@angular/router';
import { Location } from '@angular/common';

import { DeviceService }  from '../device.service';

import { Component, OnInit, Input, NgZone } from '@angular/core';
import { Device } from '../device';
import { DiscoverService } from '../discover.service';

declare var navigator: any;
declare var cordova: any;
declare var window: any;


@Component({
    selector: 'app-device-detail',
    templateUrl: './device-detail.component.html',
    styleUrls: ['./device-detail.component.css']
})
export class DeviceDetailComponent implements OnInit {

    @Input() device: Device;

    private noConnection;

    constructor(
        private zone: NgZone,
        private route: ActivatedRoute,
        private discoverService: DiscoverService,
        private deviceService: DeviceService,
        private location: Location
    ) {}

    ngOnInit(): void {
        console.dir(navigator.camera);

        this.getDeviceDefault();
        if (!this.discoverService.setupNew()) {
            this.noConnection = true;
        } else {
            console.dir(this.discoverService.isAvailable);
            this.discoverService.isAvailable().then(avail => {
                if (avail)
                    this.queryDevice();
                else
                    console.log('Update the UI to let the user know to turn on their bt');
            });
        }
    }

    queryDevice(): void {
        //TODO: Show old info on screen (from db) with content grayed out and loading ux...
        this.discoverService.queryDevice(this.device.id).then(data => {
            data.imgPath = this.device.imgPath || "" ; // Image path not stored on device
            data.id = this.device.id; // ID/address not stored on device
            this.device = data;
            console.log('device updated to this:');
            console.dir(data);
        }, () => {
            console.log('sad face');
        });
    }

    getDeviceDefault(): void {
        const id = this.route.snapshot.paramMap.get('id');
        this.device = this.deviceService.getDevice(id);;
    }

    goBack(): void {
        this.location.back();
    }

    updateImage(path): void {
        this.zone.run(() => {
            this.device.imgPath = path;
        });
    }

    openCamera(): void {

        var srcType = navigator.camera.PictureSourceType.CAMERA;
        var options = this.setOptions(srcType);

        navigator.camera.getPicture(imageUri => {
            this.updateImage(imageUri);
        }, function cameraError(error) {
            console.debug("Unable to obtain picture: " + error, "app");

        }, options);
    }

    choosePic(): void {
        console.log('TBD...');
    }

    setOptions(srcType): {}{
        return {
            // Some common settings are 20, 50, and 100
            quality: 50,
            destinationType: navigator.camera.DestinationType.FILE_URI,
            // In this app, dynamically set the picture source, Camera or photo gallery
            sourceType: srcType,
            encodingType: navigator.camera.EncodingType.JPEG,
            mediaType: navigator.camera.MediaType.PICTURE,
            allowEdit: true,
            correctOrientation: true,  //Corrects Android orientation quirks
            targetHeight: 200,
            targetWidth: 200
        }
    }

    save():void {
        console.log('save to storage and update bluetooth...');
        // Use this: bluetoothSerial.setName to change the device name
    }
}

