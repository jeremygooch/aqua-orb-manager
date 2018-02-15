import { ActivatedRoute } from '@angular/router';
import { Location } from '@angular/common';
import { Component, OnInit, Input, NgZone } from '@angular/core';

import { DeviceService }  from '../device.service';

import { Device } from '../device';
import { DiscoverService } from '../discover.service';
import { CloseSchedule } from './close-schedule';

declare var navigator: any;
declare var cordova: any;
declare var window: any;


@Component({
    selector: 'app-device-detail',
    templateUrl: './device-detail.component.html',
    styleUrls: ['./device-detail.component.css']
})
export class DeviceDetailComponent implements OnInit {

    deviceFetched: boolean;
    wateringForm;

    schedOpts = {
        howOften: [ 'monthly', 'weekly', 'daily', 'hourly', 'minutes', 'seconds' ],
        months:   [ 0, 1, 2, 3 ],
        weeks:    [ 0, 1, 2, 3 ],
        days:     [ 0, 1, 2, 3, 4, 5, 6  ],
        hours:    Array.apply(null, Array(24)).map(function (x, i) { return i; }),
        minutes:  Array.apply(null, Array(60)).map(function (x, i) { return i; }),
        seconds:  Array.apply(null, Array(60)).map(function (x, i) { return i; })
    };

    sched = {howOften:'hourly', months:0, weeks:0, days:0, hours:0, minutes:0, seconds:0};
    openSched= {
        seconds: 0,
        minutes: 0
    }


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
        console.log('[NOTE: Need to see if I should fetch previous value from db and offer to apply - resave previous.]')
        console.log('[NOTE: BT Not connected??, remind - saved changes can be reapplied at a later time]');
        this.deviceFetched = false;
        this.getDeviceDefault();
        if (!this.discoverService.setupNew()) {
            this.noConnection = true;
        } else {
            this.discoverService.isAvailable().then(avail => {
                if (avail)
                    this.queryDevice();
                else
                    console.log('Update the UI to let the user know to turn on their bt');
            });
        }
    }

    updateSchedule(f:number, init:boolean): void {
        let oneMonth:number = 2592000,
        oneWeek:number  = 604800,
        oneDay:number   = 86400,
        oneHour:number  = 3600;

        this.sched.months  = Math.floor(f / oneMonth);
        this.sched.weeks   = Math.floor((f - (this.sched.months * oneMonth)) / oneWeek);
        this.sched.days    = Math.floor((f - ((this.sched.months * oneMonth) + (this.sched.weeks * oneWeek))) / oneDay);
        this.sched.hours   = Math.floor((f - ((this.sched.months * oneMonth) + (this.sched.weeks * oneWeek) + (this.sched.days * oneDay))) / oneHour);
        this.sched.minutes = Math.floor((f - ((this.sched.months * oneMonth) + (this.sched.weeks * oneWeek) + (this.sched.days * oneDay) + (this.sched.hours * oneHour))) / 60);

        this.sched.seconds = Math.floor((f - ((this.sched.months * oneMonth) + (this.sched.weeks * oneWeek) + (this.sched.days * oneDay) + (this.sched.hours * oneHour) + (this.sched.minutes * 60))));

        if (init) {
            if (this.sched.months > 0) {
                this.sched.howOften = 'monthly';
            } else if (this.sched.weeks > 0) {
                this.sched.howOften = 'weekly';
            } else if (this.sched.days > 0) {
                this.sched.howOften = 'daily';
            } else if (this.sched.hours > 0) {
                this.sched.howOften = 'hourly';
            } else if (this.sched.minutes > 0) {
                this.sched.howOften = 'minutes';
            } else {
                this.sched.howOften = 'seconds';
            }
        }
    }

    updateOpenSchedule(t: number): void {
        this.openSched.minutes = t > 60 ? Math.floor(t / 60) : 0;
        this.openSched.seconds = t - (this.openSched.minutes * 60);
    }

    queryDevice(): void {
        //TODO: Show old info on screen (from db) with content grayed out and loading ux...
        this.discoverService.queryDevice(this.device.id).then(data => {
            data.imgPath = this.device.imgPath || "" ; // Image path not stored on device
            data.id = this.device.id; // ID/address not stored on device
            this.device = data;
            this.deviceFetched = true;
            this.updateSchedule(this.device.frequency, true);
            this.updateOpenSchedule(this.device.timeOpen);
        }, () => {
            console.log('sad face');
        });
    }

    onSubmit(): void {
        //TODO: Validate form better!
        if (!this.device.name || this.device.name == "") {
            alert('please give your plant a name');
        } else {
            let aquaMessage: string;

            aquaMessage = `f=${this.device.frequency}-t=${this.device.timeOpen}-o=${this.device.servoOpen}-c=${this.device.servoClose}-n=${this.device.name}`;
        }

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

