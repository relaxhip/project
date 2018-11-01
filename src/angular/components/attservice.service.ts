declare var System;
import {Injectable,EventEmitter} from '@angular/core';  
const { ipcRenderer } = System._nodeRequire('electron');
declare var $: any;

import { ElectronEventService, dbService, EmitService } from '../services/libs/electron/index';
import { GetDeviceService } from '../services/device/GetDevice.service';
import { Subscription } from "rxjs/Subscription";
import { icpEventService } from '../services/service/icpEventService.service';


@Injectable()
export class AttService {
    subscription: Subscription;
    processicpTitle : any;
    processicpContent : any;
    seedata:any;
    constructor(private emitService: EmitService) {
        this.subscription = this.emitService.EmitObservable.subscribe(src => {
            this.seedata=src;

            //舉例:
            this.processicpTitle = '來自attservice:';//顯示名稱
            this.processicpContent= this.seedata.data;//可運算用的內容
            
        })
        
    }
  

    // processShow() {
    //     console.log('attservice go');
    
    //     this.fromicp;
    // };
}


