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
            } else { return false}
        } else { return true }
    }

    isAvailable(): Promise<boolean>{
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
            console.log('going to send this message');
            console.log(msg);
            return new Promise(resolve => {
                bluetoothSerial.isConnected(() => {
                    console.log('youre ALREADY connected');
                    writeMsg();
                }, () => {
                    console.log('youre not connected so imma try to connect you.. one sec..');



                    bluetoothSerial.connect(id, () => {
                        writeMsg();
                    });
                });
                function writeMsg() {
                    console.log('writing message...');
                    // var test = "[f:0000015|t:0003|o:000|c:100|n:asdf-ggg-two-thre,]";
                    // console.log('test: ', test);
                    console.log('msg : ', msg);
                    bluetoothSerial.write(msg, d => {
                        console.log('got this back after writing the new schedule');
                        console.log(d);
                    });
                }
            });
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
                    console.log('youre connected');
                }, () => {
                    console.log('youre not connected so imma try to connect you.. one sec..');
                    bluetoothSerial.connect(id, () => {
                        bluetoothSerial.write("[q]", () => { }, e => { resolve({ error: true, message: 'Could not query device' }) });
                        bluetoothSerial.subscribe('}', btData => {
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
                    }, () => {
                        resolve({
                            error: true,
                            message: 'Could not establish connection with bluetooth device'
                        });
                    })
                });
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
