import { Injectable } from '@angular/core';
import { Device } from './device';
import { DEVICES } from './mock-devices';


@Injectable()
export class DeviceService {
    db = window.localStorage;
    curDevices = [];

    constructor() { }

    hasDevices():boolean {
        return !!this.getDevices();
    }

    getDevices(): Device[] {
        return JSON.parse(this.db.getItem('devices'));
    }

    saveDevice(dev):boolean {
        if (!dev) {
            console.log('no device to save');
            return false;
        } else {
            if (!this.hasDevices()) {
                this.db.setItem('devices', JSON.stringify([{
                    id: dev.address,
                    name: dev.name,
                    imgPath: ''
                }]));
            } else {
                this.curDevices = this.getDevices();
                this.curDevices.push({
                    id: dev.address,
                    name: dev.name,
                    imgPath: ''
                });
                this.db.setItem('devices', JSON.stringify(this.curDevices));
            }
            // Wipe devices
            // this.db.removeItem('devices');
            return true;
        }
    }

    getDevice(id): { id: string, name: string, imgPath: string } {
        // alert('under construction')
        console.log('or this find');
        return this.getDevices().find(device => device.id === id);
    }

    hasDevice(id): boolean {
        return this.hasDevices() ? !!this.getDevices().find(device => device.id === id) : false;
        // return this.hasDevices() ?  : false;
    }

}
