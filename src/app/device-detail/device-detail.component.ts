import { ActivatedRoute } from '@angular/router';
import { Location } from '@angular/common';

import { DeviceService }  from '../device.service';

import { Component, OnInit, Input } from '@angular/core';
import { Device } from '../device';

declare var navigator: any;

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
        console.log('oninitting...');
        console.dir(navigator.camera);
        this.getDevice();
    }

    getDevice(): void {
        const id = this.route.snapshot.paramMap.get('id');
        this.device = this.deviceService.getDevice(id);
    }

    goBack(): void {
        this.location.back();
    }














    test(): void {}

    openCamera(): void {

        var srcType = navigator.camera.PictureSourceType.CAMERA;
        var options = this.setOptions(srcType);

        navigator.camera.getPicture(function cameraSuccess(imageUri) {

            alert(imageUri);
            // displayImage(imageUri);
            // // You may choose to copy the picture, save it somewhere, or upload.
            // func(imageUri);

        }, function cameraError(error) {
            console.debug("Unable to obtain picture: " + error, "app");

        }, options);
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
            correctOrientation: true  //Corrects Android orientation quirks
        }
    }


}

