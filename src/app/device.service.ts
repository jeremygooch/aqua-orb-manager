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

    addDevice(dev:Device[]):boolean {
        if (!this.hasDevices()) {
            console.log('no previous devices');
            this.db.setItem('devices', JSON.stringify([dev]));
        } else {
            this.curDevices = this.getDevices();
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

    deleteDevice(id): boolean {
        let devices = this.getDevices().filter(device => device.id != id);
        this.db.setItem('devices', JSON.stringify(devices));
        return true;
    }

}
