import { Injectable } from '@angular/core';
import { Observable } from 'rxjs/Observable';

declare var bluetoothSerial: any;

@Injectable()
export class DiscoverService {

    private connected = false;
    private debugging = false;

    constructor() { }

    setup(): boolean {
        if (typeof bluetoothSerial === 'undefined') {
            // If we're in a browser spin up some fake devices
            if (typeof window === 'undefined') return false;
            this.debugging = true;

            return true;
        }
    }

    setupNew(): boolean {
        if (typeof bluetoothSerial === 'undefined') {
            if (typeof window !== 'undefined') {
                this.debugging = true;
                return true;
            } else { return false}
        } else { return true }
    }

    // queryDevice(): Observable
}
