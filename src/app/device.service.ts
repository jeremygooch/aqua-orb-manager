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
            return true;
        }
    }

    updateDevice(dev):boolean {
        if (!dev) {
            console.log('no device to save');
            return false;
        } else {
            if (!this.hasDevices()) {
                console.log('The database is empty');
                return false;
            }
            this.curDevices = this.getDevices();
            for (let i = 0; i<this.curDevices.length; i++) {
                if (this.curDevices[i].id === dev.id) { this.curDevices[i] = dev; }
            }
            this.db.setItem('devices', JSON.stringify(this.curDevices));
        }
    }

    getDevice(id): { id: string, name: string, imgPath: string } {
        return this.getDevices().find(device => device.id === id);
    }

    hasDevice(id): boolean {
        return this.hasDevices() ? !!this.getDevices().find(device => device.id === id) : false;
    }

}
