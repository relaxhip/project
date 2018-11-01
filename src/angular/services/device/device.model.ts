import { KeyboardModel } from './keyboard/keyboard.model';
import {Injectable,EventEmitter,OnInit} from '@angular/core';  

export interface DeviceModelProduct {
    device: KeyboardModel;
}

// @Injectable()
// export class DeviceModelProduct{
//     status:number;
//     // constructor(
//     //     public status:number
//     // ){}
// }