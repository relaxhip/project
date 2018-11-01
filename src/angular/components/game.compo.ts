declare var System;
import { Component, OnInit, Output, EventEmitter } from '@angular/core';
import { protocolService } from '../services/service/protocol.service';

const { ipcRenderer } = System._nodeRequire('electron');
declare var $: any;

import { ElectronEventService, dbService, EmitService } from '../services/libs/electron/index';
import { GetDeviceService } from '../services/device/GetDevice.service';
import { Subscription } from "rxjs/Subscription";



let evtVar = System._nodeRequire('./backend/others/eventVariable');
let funcVar = System._nodeRequire('./backend/others/FunctionVariable');
let env = System._nodeRequire('./backend/others/env');

@Component({
    selector: 'game-app',
    templateUrl: './components/game.compo.html',
    //template: '<h1>我的第一个 Angular 应用</h1>',
    styleUrls: ['./css/first.css'],
    providers: [protocolService, dbService],

})



export class GameComponent implements OnInit {
    constructor(private protocol: protocolService, private db: dbService, private getDeviceService: GetDeviceService, private emitService: EmitService) {
        // //console.log('rainbow loading complete');
        // this.subscription = this.emitService.EmitObservable.subscribe(src=>console.log(src)

    }
    @Output() outputGameEvent: EventEmitter<any> = new EventEmitter();
    @Output() UpdateEvent: EventEmitter<any> = new EventEmitter();
    gamemoment: any;
    saveclick: number = 0;
    check01: boolean = false;
    check02: boolean = false;
    check03: boolean = false;
    check04: boolean = false;

    AltF4: any = '0';
    AltTab: any = '0';
    ShiftTab: any = '0';
    gameModeSave: any;
    informft: number = 0;
    myTimer: any;
    select1Lock: boolean = true;
    select2Lock: boolean = true;
    select3Lock: boolean = true;



    //傳值告訴燈效暫停apmode下值
    outputGame() {

        this.outputGameEvent.emit(this.gamemoment);

    }

    UpdateGame() {

        this.UpdateEvent.emit('updatenow');

    }

    ngOnInit() {


        // this.UpdateGame();
        let obj = {
            'ProfileName': '游戏模式'
        }
        this.db.getProfile(obj).then((doc: any) => {
            //console.log('test:')
            //console.log(doc);
            this.gameModeSave = doc;

            // //console.log(this.gameModeSave[0].GameMode[0]);
            // //console.log(this.gameModeSave[0].GameMode[1]);
            // //console.log(this.gameModeSave[0].GameMode[2]);
            this.AltF4 = this.gameModeSave[0].GameMode[0];
            this.AltTab = this.gameModeSave[0].GameMode[1];
            this.ShiftTab = this.gameModeSave[0].GameMode[2];
            this.checkedOrNot();

        })


        setTimeout(() => {
            this.kbSetting();
            //console.log('上次紀錄的下值')
        }, 100);
    }



    checkedOrNot() { //進入頁面時讀取上次的紀錄

        if (this.AltTab == 0) {
            this.check01 = false;
        } else {
            this.check01 = true;
        }

        if (this.AltF4 == 0) {
            this.check02 = false;
        } else {
            this.check02 = true;
        }


        if (this.ShiftTab == 0) {
            this.check03 = false;
        } else {
            this.check03 = true;
        }

    }

    select1() { //按鈕
        
      
        if (this.select1Lock) {
            this.select1Lock=false;
            this.check01 = !this.check01
            
                if (this.check01) {
                    this.AltTab = "1";
                    //console.log(this.AltF4);
                } else {
                    this.AltTab = "0";
                }
                this.kbSetting();
    
        } else {
            return false;
        }
    }
    select2() {
    
        if (this.select2Lock) {
            this.select2Lock=false;
            this.check02 = !this.check02
    
            
                if (this.check02) {
                    this.AltF4 = "1";
                } else {
                    this.AltF4 = "0";
                }

                this.kbSetting();
        
        } else {
            return false;
        }
    }

    select3() {
       
        
        if (this.select3Lock) {
            this.select3Lock=false;
            this.check03 = !this.check03
                if (this.check03) {
                    this.ShiftTab = "1";
                } else {
                    this.ShiftTab = "0";
                }

                this.kbSetting();
    
        } else {
            return false;
        }
    }
    // select4() {
    //     this.check04 = !this.check04
    // }

    kbSetting() {//下值
    console.log('kbsetting');
    if (this.saveclick == 0) {
            // this.gamemoment = 'loadingStart';
            // this.outputGame();
            //console.log('game111' + this.saveclick);
            this.saveclick++;
            //console.log('game2222' + this.saveclick);


            // if (this.informAp == 0) {
            //console.log('stopApmode go');
            this.gamemoment = '';
            this.outputGame();
            setTimeout(() => {
                this.gamemoment = 'stopApmode';
                this.outputGame();
            }, 20);


            // }

            setTimeout(() => {
                // clearTimeout(this.myTimer);

                // console.log('下值')
                // console.log('AltF4:' + this.AltF4);
                // console.log('AltTab:' + this.AltTab);
                // console.log('ShiftTab:' + this.ShiftTab)

                let data = {
                    profile: '2',
                }
                let obj1 = {
                    Type: funcVar.FuncType.Device,
                    Func: funcVar.FuncName.SetProfie,
                    Param: data
                }
                this.protocol.RunSetFunction(obj1).then((data) => {
                    // //console.log("Container RunSetFunction:" + data);
                    //console.log('test1111');
                    let data2 = {
                        profile: '2',    //profile  0:reset, 1:Profile1 2:Profile2
                        AltTabFun: this.AltTab,
                        AltF4Fun: this.AltF4,
                        ShiftTabFun: this.ShiftTab,
                        mode: '0x0e', //1~15 代表不同Mode
                        light: '0x14',    //0~32 燈光亮度


                    }
                    //console.log('下值後')
                    //console.log('AltF4:' + this.AltF4);
                    //console.log('AltTab:' + this.AltTab);
                    //console.log('ShiftTab:' + this.ShiftTab)

                    let obj2 = {
                        Type: funcVar.FuncType.Device,
                        Func: funcVar.FuncName.SetCommand,
                        Param: data2
                    }
                    this.protocol.RunSetFunction(obj2).then((data2) => {
                        //console.log("Container RunSetFunction:" + data2);

                        this.setintoDb();

                        // //console.log('startApmode go');
                        // // this.gamemoment = 'startApmode';
                        // // this.informAp = 1;

                        // this.informft++;

                        //console.log(this.informft);
                        // this.myTimer =setTimeout(() => {
                        //     this.informft = 0
                        //     if (this.informft == 0) {
                        //         this.outputGame();
                        //     }
                        // }, 200);

                        //

                        //

                    });
                });
            }, 500);

        }
    }


    setintoDb() {

        //console.log('setintoDb');
        //console.log('AltF4111');
        //console.log(this.AltF4);
        //console.log('AltTab1111');
        //console.log(this.AltTab);
        //console.log('ShiftTab111');
        //console.log(this.ShiftTab);

        let obj = {
            'ProfileName': '游戏模式'
        }
        this.db.getProfile(obj).then((doc: any) => {
            //console.log('profilecontent');

            //console.log(doc[0]);

            //console.log('id');
            //console.log(doc[0].id);

            //console.log('obj1');
            doc[0].GameMode = [this.AltF4, this.AltTab, this.ShiftTab];
            //console.log('new obj1');
            //console.log(doc[0]);

            this.db.UpdateProfile(2, doc[0]).then((doc: any) => {
                //console.log('update success');
                // this.UpdateGame();
                this.gamemoment = 'startApmode';
                this.outputGame();
                this.select1Lock=true;
                this.select2Lock=true;
                this.select3Lock=true;
                // this.gamemoment = 'loadingEnded';
                // this.outputGame();
                this.saveclick = 0;

            });

        })



        // let obj = {

        //     "GameMode": [this.AltF4, this.AltTab, this.ShiftTab]
        // }

        // this.db.UpdateProfile(2, obj).then((doc: any) => {
        //     //console.log('update success');
        // });

    }
}