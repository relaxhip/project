declare var System;
import { Injectable, EventEmitter } from '@angular/core';
import { ElectronEventService, EmitService } from '../libs/electron/index';
import { GetDeviceService } from '../device/GetDevice.service'

let evtVar = System._nodeRequire('./backend/others/eventVariable');
let funcVar = System._nodeRequire('./backend/others/FunctionVariable');
let env = window['System']._nodeRequire('./backend/others/env');

@Injectable()
export class icpEventService {
    status: number;
    constructor(private getDeviceService: GetDeviceService, private emitService: EmitService) {
        // ElectronEventService.on('icpEvent').subscribe((e: any) => {
        //     var obj = JSON.parse(e.detail);
        //     if (obj.Func === evtVar.EventTypes.RefreshDevice) {
        //         if(obj.Param == 1){
        //             this.insert();          
        //         }
        //         else if(obj.Param == 0){
        //             this.remove()
        //         }
        //     }
        // });
    }
    keyMatrixMap: any = [];
    keypositionX: number;
    keypositionY: number;

 

    // this.keyMatrixMap[0] = ['pausebreak', 'stop', 'play/pause', 'next', 'previous', 'none', 'l-ctrl', 'f5'];
    // this.keyMatrixMap[1] = ['q', 'tab', 'a', 'esc', 'z', 'k150', '~', '!1'];
    // this.keyMatrixMap[2] = ['w', 'cap_lock', 's', 'k45', 'x', 'k132', 'f1', '@2'];
    // this.keyMatrixMap[3] = ['e', 'f3', 'd', 'f4', 'c', 'k151', 'f2', '#3'];
    // this.keyMatrixMap[4] = ['r', 't', 'f', 'g', 'v', 'b', '%5', '$4'];
    // this.keyMatrixMap[5] = ['u', 'y', 'j', 'h', 'm', 'n', '6', '7'];
    // this.keyMatrixMap[6] = ['i', ']}', 'k', 'f6', ',', 'k56', '=+', '8'];
    // this.keyMatrixMap[7] = ['o', 'f7', 'l', 'k14', '.>', 'app', 'f8', '(9'];
    // this.keyMatrixMap[8] = ['p', '{[', ':;', '"', 'k42', '?/', '_-', ')0'];
    // this.keyMatrixMap[9] = ['scr_lock', 'media select', 'v-', 'l-alt', 'v+', 'r-alt', 'mute', 'print'];
    // this.keyMatrixMap[10] = ['none', 'back-space', '104', 'f11', 'enter', 'f12', 'f9', 'f10'];
    // this.keyMatrixMap[11] = ['num-7', 'num-4', 'num-1', 'space', 'num-lock', 'down', 'del', 'imc'];
    // this.keyMatrixMap[12] = ['num-8', 'num-5', 'num-2', 'num-0', 'num/', 'right', 'insert', 'g', 'mode'];
    // this.keyMatrixMap[13] = ['num-9', 'num-6', 'num-3', 'num-.', 'num_*', 'num_-', 'page-up', 'page-down'];
    // this.keyMatrixMap[14] = ['num-+', '巴葡', 'enter', 'up', 'none', 'left', 'home', 'end'];
    // this.keyMatrixMap[15] = ['none', 'l-shift', 'r-shift', 'k131', 'l-win', 'fn key', 'k133', 'none'];


    event() {
        ElectronEventService.on('icpEvent').subscribe((e: any) => {
            try{
                var obj = JSON.parse(e.detail);
                if(obj.Func === evtVar.EventTypes.HIDEP2Data){
                    // env.log('icpEventService','icp',JSON.stringify(obj))
                }
                if (obj.Func === evtVar.EventTypes.RefreshDevice) {
                    if (obj.Param == 1) {
                        this.insert();
            
                    }
                    else if (obj.Param == 0) {
                        this.remove()
                    }
                }
                else{ 

                //  console.log('Func:'+obj.Func);
                //  console.log('Param:'+obj.Param);
                //  console.log('data:'+obj.Param.data);
                //  this.emitService.emitTitle(obj.func);
                    this.emitService.emitTitle(obj.Param);
                }


                // if(obj.Func === evtVar.EventTypes.ExitApp){
                //     this.Exitready();
                // }
            }catch(e){
                env.log('Error','icpEventService',e);
            }


            // else if (obj.Func === evtVar.EventTypes.HIDEP2Data) {


            //     this.keypositionX = obj.Param.data[3];
            //     this.keypositionY = obj.Param.data[4];

            //     let position = this.searchMap(this.keypositionX, this.keypositionY);
            //     // console.log('icpx:'+this.keypositionX);
            //     // console.log('icpY:'+this.keypositionY);
            //     console.log(obj.Param);


         
           
            // }
            // else if(obj.Func === evtVar.EventTypes.UpdateApp){
            //     console.log('UpdateApp');
            //     this.emitService.emitTitle('UpdateApp');
            // }
            // else if(obj.Func === evtVar.EventTypes.UpdateFW){
            //     console.log('UpdateFW');
            //     this.emitService.emitTitle('UpdateFW');
            // }
            // else if(obj.Func === evtVar.EventTypes.HIDEP2Data){
            //     console.log('HIDEP2Data');
            //     this.emitService.emitTitle('HIDEP2Data');
            // }
        });
    }

    insert() {
        console.log('Device 插入 ');
        this.status = 1;
        // this.getDeviceService.setStatus(1);
        this.getDeviceService.dataObj.status = 1;
        this.emitService.emitTitle('insert');
    };

    remove() {
        console.log('Device 移除 ');
        this.status = 0;
        // this.getDeviceService.setStatus(0);
        this.getDeviceService.dataObj.status = 0;
        this.emitService.emitTitle('remove');
    }

    getStatus() {
        return this.status;
    }


    // Exitready(){
    //     this.emitService.emitTitle('Exitapp');
    // }

}