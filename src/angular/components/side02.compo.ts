declare var System;
import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { protocolService } from '../services/service/protocol.service';


let evtVar = System._nodeRequire('./backend/others/eventVariable');
let funcVar = System._nodeRequire('./backend/others/FunctionVariable');
let env = System._nodeRequire('./backend/others/env');
const { ipcRenderer } = System._nodeRequire('electron');
declare var $: any;

import { ElectronEventService, dbService, EmitService } from '../services/libs/electron/index';
import { GetDeviceService } from '../services/device/GetDevice.service';
import { Subscription } from "rxjs/Subscription";

@Component({
    selector: 'side02-app',
    templateUrl: './components/pages/side02.compo.html',
    //template: '<h1>我的第一个 Angular 应用</h1>',
    styleUrls: ['./css/first.css'],
    inputs: ['myKey', 'mutiobj']
})

export class side02Component implements OnInit {
    constructor(private protocol: protocolService, private db: dbService, private getDeviceService: GetDeviceService, private emitService: EmitService) {
        //console.log('side02 loading complete');
    }
    changeprofile:any='2';
    saveclick: number = 0;
    myKey: string;
    textout: string = "单击中键";
    textcontent: string;
    mutiobj: any = {};
    @Output() outputEvent: EventEmitter<any> = new EventEmitter();

    @Output() Keyhasbeenset: EventEmitter<any> = new EventEmitter();
    @Output() nowloading: EventEmitter<any> = new EventEmitter();
    @Output() outputGameEvent: EventEmitter<any> = new EventEmitter();




    gamemoment: any;


    outputGame() {

        this.outputGameEvent.emit(this.gamemoment);

    }
    loading(w) {

        if (w == 1) {

            //console.log('side01 01');
            this.nowloading.emit(1);
        }


        if (w == 0) {
            //console.log('side01 02');
            this.nowloading.emit(0);
        }
    }

    cleartextbox() {
        this.textcontent = "";
    }

    // setIntoDB(){

    //    this.db.UpdateProfile(this.mutiobj.id, this.mutiobj).then((doc: any) => {
    //        //console.log('update success');
    //     //    //console.log(this.mutiobj.id);
    //    });
    // }
    ngOnInit() {
        // this.gopress();
        //this.mutiobj.Key.keyCopy
        console.log('0000',this.mutiobj.ProfileName);
        if(this.mutiobj.ProfileName == '' || this.mutiobj.ProfileName == undefined || this.mutiobj.ProfileName == null) {
            this.mutiobj.ProfileName =='游戏模式';
        }
       
        let obj = {
            'ProfileName': this.mutiobj.ProfileName
        }

        // if(this.mutiobj.ProfileName == '' || this.mutiobj.ProfileName == undefined || this.mutiobj.ProfileName == null) {
        //     this.mutiobj.ProfileName =='游戏模式';
        // }
        
        if(this.mutiobj.ProfileName=='游戏模式'){
            this.changeprofile='2';
        }else{
            this.changeprofile='1';
        }

        this.db.getProfile(obj).then((doc: any) => {
            console.log('11211', doc[0]);
            if (doc[0].Key.keyCopy[this.myKey] !== undefined || doc[0].Key.keyCopy[this.myKey] !== null ||doc[0].Key.keyCopy[this.myKey] !== "") {
                console.log('112222')
                console.log(this.myKey)
                this.textcontent = doc[0].Key.keyCopy[this.myKey];
                console.log(this.textcontent)
            } else {
                //console.log('this.textcontent is undefinded');
            }
        })
    }

    cancelPage() {
        this.outputEvent.emit(2);
    }

    // gopress() {
    //     let vm=this;
    //     window.addEventListener('keydown', function (e) {
    //         if (e.keyCode == 81) {
    //             vm.testpaste();
    //             //console.log('testpress11111');
    //         }
    //     })
    // }


    // testpaste(){


    //     // var ta = document.getElementById('clip');
    //     // ta.focus();
    //     // (ta as HTMLTextAreaElement).select();
    //     let obj={
    //         ModifyKey : 0x11,
    //         VirtualKey :0x56
    //     }

    //     let obj2 = {
    //         Type: funcVar.FuncType.System,
    //         Func: funcVar.FuncName.SendKey,
    //         Param: obj
    //     }

    //     	// 
    // 			this.protocol.RunSetFunction(obj2).then((data) => {
    // 				//console.log('test2222');
    // 				// //console.log("Container RunSetFunction:" + data);

    // 			});
    // }


    keywasSet() {
        // this.Keyhasbeenset.emit(this.myKey);

        if (this.saveclick == 0) {
            this.gamemoment = "stopApmode";
            this.outputGame();
            this.saveclick = 1;
            this.loading(1);

            var ta = document.getElementById('clip');
            ta.focus();
            (ta as HTMLTextAreaElement).select();
            //console.log(document.execCommand('copy'));


            //console.log('key111111');
            //console.log(this.textcontent);
            //console.log('key222');
            //console.log(this.myKey);
            this.mutiobj.Key.keyCopy[this.myKey] = this.textcontent;
            this.mutiobj.KeyDataValue[this.myKey] = 0xB3;

            console.log('v');
            //console.log(this.mutiobj.id);
            console.log(this.mutiobj);
            //console.log(this.mutiobj);
            // this.loading(0);

            // this.db.UpdateProfile(this.mutiobj.id, this.mutiobj).then((doc: any) => {
                this.db.UpdateProfile(this.mutiobj.id,this.mutiobj).then((doc: any) => {
                    // env.log('文本', '0000', 'start');
                //console.log('update success222');
                //console.log('update success333');
                //console.log(doc);

                setTimeout(() => {
                    this.functionkeysetIn();
                    //console.log('update test4444');
                }, 200);


                //    //console.log(this.mutiobj.id);
            });
            // //console.log(this.mutiobj.id);
            // //console.log(this.mutiobj);
        }
    }


    functionkeysetIn() {
        //console.log('update success444');
        let data = {
            profile: this.changeprofile
        }
        let obj1 = {
            Type: funcVar.FuncType.Device,
            Func: funcVar.FuncName.GetKeyMatrix,
            Param: data
        }
        this.protocol.RunSetFunction(obj1).then((data) => {

            //console.log("Container RunSetFunction:" + data);
            data[this.myKey] = 0xB3;

            let obj3 = {
                'ProfileName': this.mutiobj.ProfileName
            }

            this.db.getProfile(obj3).then((doc: any) => {
                doc[0].KeyDataValue = data;
                //console.log('儲存');
                //console.log(doc[0].KeyDataValue);
                this.db.UpdateProfile(doc[0].id, doc[0]).then((doc: any) => {
                    //console.log('read222讀取完成')
                })
            })

            setTimeout(() => {
                let content = {
                    profile: this.changeprofile,
                    KeyData: data
                }
                let obj2 = {
                    Type: funcVar.FuncType.Device,
                    Func: funcVar.FuncName.SetKeyMatrix,
                    Param: content
                }
                this.protocol.RunSetFunction(obj2).then((data) => {
                    //console.log("Container RunSetFunction:" + data);
                    //console.log('setMatrix ended');

                    setTimeout(() => {
                        this.gamemoment = "startApmode";
                        this.outputGame();
                        this.saveclick = 0;

                        this.loading(0);
                    }, 3000);

                    //console.log('testfunctionkeyIN');
                    this.Keyhasbeenset.emit(this.myKey);
                    // this.keywasSet();
                    // this.saveclick = 0;
                    // this.loading(0);
                })
            }, 1000);


            // //console.log(data[7]);
            // //console.log(data);
        })
    }





}