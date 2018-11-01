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
    selector: 'side04-app',
    templateUrl: './components/pages/side04.compo.html',
    //template: '<h1>我的第一个 Angular 应用</h1>',
    styleUrls: ['./css/first.css'],
    providers: [protocolService, dbService],
    inputs: ['myKey', 'mutiobj']
})

export class side04Component implements OnInit {
    constructor(private protocol: protocolService, private db: dbService, private getDeviceService: GetDeviceService, private emitService: EmitService) {
        //console.log('side01 loading complete');
    }

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
    cancelPage() {
        this.outputEvent.emit(4);
    }

    keywasSet() {
        this.Keyhasbeenset.emit(this.myKey);
    }


    readdb() { //讀取db
        //console.log('readdbMacr1111');
        //console.log(this.mutiobj);
        if(this.mutiobj.ProfileName == '' || this.mutiobj.ProfileName == undefined || this.mutiobj.ProfileName == null) {
            this.mutiobj.ProfileName =='游戏模式';
        }

        //console.log(this.mutiobj.ProfileName);
        if(this.mutiobj.ProfileName=='游戏模式'){
            this.changeprofile='2';
        }else{
            this.changeprofile='1';
        }
        this.db.UpdateProfile(this.mutiobj.id, this.mutiobj).then((doc: any) => {//更新db對應位置


            //console.log(this.mutiobj);
            // //console.log(this.mutiobj);


            if (this.mutiobj.Key.options.OPshelf01[3] !== undefined) {
                //console.log('readdbMacr222');
                
                this.clickOnitem(this.mutiobj.Key.options.OPshelf01[3]);
            }

        });
    }


    ngOnInit() {
        this.readdb();
    }

    changeprofile:any='2';
    myKey: string;
    setfunctionkey: any;
    mutiobj: any = {};
    finalclick: number;
    check01: boolean = false;
    check02: boolean = false;
    check03: boolean = false;
    check04: boolean = false;
    check05: boolean = false;
    check06: boolean = false;
    check07: boolean = false;
    check08: boolean = false;
    check09: boolean = false;
    check10: boolean = false;
    saveclick: number = 0;
    clickOnitem(w) {

       
        this.finalclick = w;
        this.check01 = false;
        this.check02 = false;
        this.check03 = false;
        this.check04 = false;
        this.check05 = false;
        this.check06 = false;
        this.check07 = false;
        this.check08 = false;
        this.check09 = false;
        this.check10 = false;


        if (w === 0) { //单击左键
            this.setfunctionkey = '0xCE';
            this.check01 = true;


        }

        if (w === 1) { //单击右键
            this.setfunctionkey = '0xCF';

            this.check02 = true;

        }
        if (w === 2) { //左键双击
            this.setfunctionkey = '0xD5';

            this.check03 = true;

        }

        if (w === 3) { //单击中建
            //console.log('readdbMacr333');
            this.setfunctionkey = '0xD0';

            this.check04 = true;

        }
        if (w === 4) {
            //前進
            this.setfunctionkey = '0xD4';

            this.check05 = true;

        }
        if (w === 5) {
            //返回
            this.setfunctionkey = '0xD3';

            this.check06 = true;

        }
        if (w === 6) {
            this.setfunctionkey = '0xD2';

            this.check07 = true;

        }
        if (w === 7) {
            this.setfunctionkey = '0xD1';

            this.check08 = true;

        }

        if (w === 8) {
            //向左滚动
            this.setfunctionkey = '0xF2';

            this.check09 = true;
        }

        if (w === 9) {
            //向右滚动
            this.setfunctionkey = '0xF1';

            this.check10 = true;
        }

        else {

            return false;
        }


    }

    setIntoDB() {
        //functinKey決定已經選定在選項時

        //本頁啟動時產生的mutiobj更新內容
        this.mutiobj.KeyDataValue[this.myKey] = this.setfunctionkey;
        // this.mutiobj.shelf01 = this.LastarrayindexArr;
        this.mutiobj.Key.options.OPshelf01[3] = this.finalclick;

        this.db.UpdateProfile(this.mutiobj.id, this.mutiobj).then((doc: any) => {
            //console.log('update success');
            //console.log(this.mutiobj.id);

            // //console.log(this.mutiobj.Key.options.OPshelf01[3]);

        });
    }




    functionkeysetIn() {
       
        // this.savecick++;
        if (this.saveclick == 0) {
            this.saveclick=1;
            this.gamemoment="stopApmode";
            this.outputGame()
            this.loading(1);
            this.setIntoDB()
            // this.keywasSet();

           


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


                data[this.myKey] = this.setfunctionkey;
                //console.log('mykey' + this.myKey);
                //console.log('setfunctionKey' + this.setfunctionkey);

                let obj3={
                    'ProfileName': this.mutiobj.ProfileName
                }
                this.db.getProfile(obj3).then((doc: any) => {
                    doc[0].KeyDataValue=data;
                    //console.log('儲存');
                    //console.log(doc[0].KeyDataValue);
                    this.db.UpdateProfile(doc[0].id,doc[0]).then((doc: any) => {
                        //console.log('read222讀取完成')
                    })
                })


                // //console.log(data[7]);
                // //console.log(data);

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
                    this.gamemoment = 'startApmode';
                    this.outputGame()
                    this.saveclick = 0;  
                    this.loading(0);
                    this.keywasSet();
                   }, 3000);
                  

                })



            })
        }
    }
}