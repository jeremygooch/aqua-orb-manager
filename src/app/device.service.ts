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
        if (out) {
            out.frequency = out.frequency || 0;
            out.timeOpen = out.timeOpen || 0;
            out.servoOpen = out.servoOpen || 0;
            out.servoClose = out.servoClose || 0;
        }
        return out;
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
                    imgPath: '',
                    frequency: 0,
                    timeOpen: 0,
                    servoOpen: 0,
                    servoClose: 0
                }]));
            } else {
                this.curDevices = this.getDevices();
                this.curDevices.push({
                    id: dev.address,
                    name: dev.name,
                    imgPath: '',
                    frequency: 0,
                    timeOpen: 0,
                    servoOpen: 0,
                    servoClose: 0
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

    getDevice(id): { id: string, name: string, imgPath: string, frequency: number, timeOpen: number, servoOpen: number, servoClose: number } {
        return this.getDevices().find(dev => dev.id === id);
    }

    hasDevice(id): boolean {
        return this.hasDevices() ? !!this.getDevices().find(device => device.id === id) : false;
    }

}
