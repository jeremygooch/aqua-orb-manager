import { Injectable } from '@angular/core';
import { Device } from './device';

@Injectable()
export class DeviceService {
    db = window.localStorage;
    curDevices = [];

    constructor() { }

    hasDevices():boolean {
        return !!this.getDevices();
    }

    getDevices(): Device[] {
        const out = JSON.parse(this.db.getItem('devices'));
        return out;
    }

    // saveDevice(dev):boolean {
    //     if (!dev) {
    //         return false;
    //     } else {
    //         if (!this.hasDevices()) {
    //             this.db.setItem('devices', JSON.stringify([{
    //                 id: dev.address,
    //                 name: dev.name,
    //                 imgPath: '',
    //                 frequency: 0,
    //                 timeOpen: 0,
    //                 servoOpen: 0,
    //                 servoClose: 0
    //             }]));
    //         } else {
    //             this.curDevices = this.getDevices();
    //             this.curDevices.push({
    //                 id: dev.address,
    //                 name: dev.name,
    //                 imgPath: '',
    //                 frequency: 0,
    //                 timeOpen: 0,
    //                 servoOpen: 0,
    //                 servoClose: 0
    //             });
    //             this.db.setItem('devices', JSON.stringify(this.curDevices));
    //         }
    //         return true;
    //     }
    // }

    addDevice(dev:Device[]):boolean {
        if (!this.hasDevices()) {
            console.log('no previous devices');
            this.db.setItem('devices', JSON.stringify([dev]));
        } else {
            console.log('i has previous devices');
            this.curDevices = this.getDevices();
            console.dir(this.curDevices)
            this.curDevices.push(dev);
            this.db.setItem('devices', JSON.stringify(this.curDevices));
        }
        return true;
    }

    updateDevice(dev):boolean {
        if (!dev) {
            return false;
        } else {
            if (!this.hasDevices()) {
                return false;
            }
            this.curDevices = this.getDevices();
            for (let i = 0; i<this.curDevices.length; i++) {
                if (this.curDevices[i].id === dev.id) { this.curDevices[i] = dev; }
            }
            this.db.setItem('devices', JSON.stringify(this.curDevices));
        }
    }

    getDevice(id): { id: string, name: string, imgPath: string, frequency: number, timeOpen: number, servoOpen: number, servoClose: number } {
        return this.getDevices().find(dev => dev.id === id);
    }

    hasDevice(id): boolean {
        return this.hasDevices() ? !!this.getDevices().find(device => device.id === id) : false;
    }

}
