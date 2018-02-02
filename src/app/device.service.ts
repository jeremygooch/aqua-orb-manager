import { Injectable } from '@angular/core';
import { Device } from './device';
import { DEVICES } from './mock-devices';


@Injectable()
export class DeviceService {

    constructor() { }

    getDevices(): Device[] {
        return DEVICES;
    }

    getDevice(id): { id: number, name: string } {
        return DEVICES.find(device => device.id === id);
    }

}
