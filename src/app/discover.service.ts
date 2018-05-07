import { Injectable } from '@angular/core';
import { Observable } from 'rxjs/Observable';
import { of } from 'rxjs/observable/of';

import { Device } from './device';

declare var bluetoothSerial: any;

@Injectable()
export class DiscoverService {

    private connected = false;
    private debugging = false;
    private device = Device;

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
            } else { return false }
        } else { return true }
    }

    isAvailable(): Promise<boolean> {
        if (!this.debugging) {
            return new Promise(resolve => {
                bluetoothSerial.isEnabled(() => {
                    resolve(true);
                }, () => {
                    resolve(false);
                });
            });
        } else {
            return new Promise(resolve => {
                setTimeout(() => {
                    resolve(true);
                }, 1500);
            });
        }
    }

    write(msg: string, id: string): Promise<any> {
        if (!this.debugging) {
            return new Promise(resolve => {
                bluetoothSerial.isConnected(() => {
                    bluetoothSerial.disconnect(() => {
                        bluetoothSerial.connect(id, () => { writeMsg(); });
                    });
                }, () => {
                    bluetoothSerial.connect(id, () => { writeMsg(); });
                });
                function writeMsg() {
                    bluetoothSerial.write(msg, d => {
                        resolve(d);
                    });
                }
            });
        }
    }

    list(): Promise<any> {
        if (!this.debugging) {
            return new Promise(resolve => {
                bluetoothSerial.list(btd => { resolve(btd); });
            });
        } else {
            return new Promise(resolve => {
                window.setTimeout(() => {
                    resolve([
                        { name: "HC-05", address: "01:01", id: "02:02", class: 7936 },
                        { name: "TOYOTA Corolla", address: "03:03", id: "03:03", class: 1032 },
                        { name: "myplant01", address: "04:04", id: "04:04", class: 7936 },
                        { name: "Daydream controller", address: "05:05", id: "05:05", class: 7936 },
                        { name: "HMDX Neutron", address: "06:06", id: "07:07", class: 1028 },
                        { name: "abiding-aardvark", address: "08:08", id: "09:09", class: 7936 }
                    ]);
                }, 1000);
            })
        }
    }

    // queryDevice(id): Observable<Device> {
    queryDevice(id: string): Promise<any> {
        // Device mapping:
        // n: name
        // f: frequency / time closed
        // t: time open
        // o: servo open value
        // c: servo closed value

        // TODO: Set a timer up to ensure super long delays dont happen...
        // Determining connection status... if not connected, connect &&& otherwise just start querieng
        if (!this.debugging) {
            return new Promise(resolve => {
                bluetoothSerial.isConnected(() => {
                    // Until we can tell if we're connected to the right one, better to disconnect and reconnect
                    bluetoothSerial.disconnect(() => {
                        bluetoothSerial.connect(id, () => {
                            writeMsg();
                        });
                    });
                }, () => {
                    bluetoothSerial.connect(id, () => {
                        writeMsg();
                    });
                });
                function writeMsg() {
                    bluetoothSerial.write("[q]", () => { }, e => { resolve({ error: true, message: 'Could not query device' }) });
                    bluetoothSerial.subscribe('}', btData => {
                        console.dir("btData");
                        console.dir(btData);
                        let out: Object;
                        try {
                            out = JSON.parse(btData)
                        } catch (e) {
                            out = {
                                error: true,
                                message: 'Could not parse json from device',
                                code: e
                            };
                        }

                        resolve(out);
                    }, e => {
                        resolve({
                            error: true,
                            message: 'Could not subscribe to bluetooth',
                            code: e
                        })
                        console.log(e);
                    });
                }
            });
        } else {
            return new Promise(resolve => {
                window.setTimeout(() => {
                    resolve({
                        name: "My Amazing Plant",
                        frequency: 4150928,
                        // frequency: 3601,
                        timeOpen: 128,
                        servoOpen: 0,
                        servoClose: 100
                    });
                }, 1500);
            });
        }
    }
}
