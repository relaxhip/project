declare var System;
import { Component, OnInit, Input } from '@angular/core';
import { protocolService } from '../services/service/protocol.service';
import { icpEventService } from '../services/service/icpEventService.service'

import { ElectronEventService, dbService, EmitService } from '../services/libs/electron/index';
import { Subscription } from "rxjs/Subscription";
const { ipcRenderer } = System._nodeRequire('electron');
let evtVar = System._nodeRequire('./backend/others/eventVariable');
let funcVar = System._nodeRequire('./backend/others/FunctionVariable');
let env = System._nodeRequire('./backend/others/env');
let remote = System._nodeRequire('electron').remote;
let { dialog } = remote;
let win = remote.getGlobal('MainWindow').win;





@Component({
    selector: 'sm-app',
    templateUrl: './components/app.component.html',
    //template: '<h1>我的第一个 Angular 应用</h1>',
    styleUrls: ['./components/app.component.css'],
    providers: [protocolService, dbService, icpEventService]

})

export class AppComponent implements OnInit {
    
    Hd: boolean = false;
    KCTarr: any = [72, 165, 167, 168, 228, 166, 224, 62, 20, 43, 4, 41, 29, 145, 53, 30, 26, 57, 22, 100, 27, 138, 58, 31, 8, 60, 7, 61, 6, 144, 59, 32, 21, 23, 9, 10, 25, 5, 34, 33, 24, 28, 13, 11, 16, 17, 35, 36, 12, 48, 14, 63, 54, 135, 46, 37, 18, 64, 15, 137, 55, 101, 65, 38, 19, 47, 51, 52, 50, 56, 45, 39, 71, 0, 170, 226, 171, 230, 0, 70, 0, 42, 49, 68, 40, 69, 66, 67, 95, 92, 89, 44, 83, 81, 76, 179, 96, 93, 90, 98, 84, 79, 73, 176, 97, 94, 91, 99, 85, 86, 75, 78, 87, 133, 88, 82, 103, 80, 74, 77, 231, 225, 229, 139, 227, 172, 136, 0, 72, 165, 167, 168, 228, 166, 224, 62, 20, 43, 4, 0, 29, 145, 53, 30, 26, 57, 22, 100, 27, 138, 58, 31, 8, 60, 7, 61, 6, 144, 59, 32, 21, 23, 9, 10, 25, 5, 34, 33, 24, 28, 13, 11, 16, 17, 35, 36, 12, 48, 14, 63, 54, 135, 46, 37, 18, 64, 15, 137, 55, 101, 65, 38, 19, 47, 51, 52, 50, 56, 45, 39, 219, 0, 170, 226, 171, 230, 0, 216, 0, 42, 49, 68, 240, 176, 66, 67, 95, 92, 89, 44, 83, 81, 217, 179, 96, 93, 90, 98, 84, 79, 218, 176, 97, 94, 91, 99, 85, 86, 223, 222, 87, 133, 88, 82, 103, 80, 220, 221, 0, 225, 229, 139, 177, 172, 136, 0];
    keypositionX: any;
    keypositionY: any;
    dofunctionName: any;
    time: any = 0;
    set128: any = 0;
    subscription: Subscription;
    profileName: any ='游戏模式';
    DeviceName: string = "";
    DeviceStatus: number = 0;

    DeviceObj: any = null;
    keyfuncposition: any;
    fromicp: any;
    Path:any;
    constructor(private protocol: protocolService, private icpEventService: icpEventService, private db: dbService, private emitService: EmitService) {
        //開啟App時通知Electron 將系統icon load起來
        let langObj = []; langObj.push('打開BK700'); langObj.push('退出BK700');
        ipcRenderer.send("OpenBK700", langObj);
        icpEventService.event();
        // this.subscription = this.emitService.EmitObservable.subscribe(src => //console.log(src))
        this.subscription = this.emitService.EmitObservable.subscribe(src => {



            this.fromicp = src;
            //console.log(this.fromicp.data);
            //console.log('test:' + this.fromicp.data);

            // if (this.fromicp.data !== undefined) {

            //     if (this.fromicp.data[1] == 7 && this.fromicp.data[2] == 7 && this.fromicp.data[5] == 1) {//normalkey 按下
            //         //console.log('yes');

            //         this.keypositionX = this.fromicp.data[3];
            //         this.keypositionY = this.fromicp.data[4];
            //         this.keyfuncposition = this.fromicp.data[3] * 8 + this.fromicp.data[4] + this.set128;

            //         //console.log('normalKEYPOSITION:' + this.keyfuncposition);
            //         // this.keyfuncposition = this.keyfuncposition + 128;

            //         // this.keyfuncposition = this.keyfuncposition + 128;
            //         // if(this.time==0){
            //         this.doItfunction(this.keyfuncposition);
            //         // }
            //     } else if (this.fromicp.data[1] == 225 && this.fromicp.data[2] == 4 && this.fromicp.data[3] == 1) {//Fn按下
            //         //console.log('KEYPOSITION:' + this.keyfuncposition);
            //         this.set128 = 128;

            //         //console.log('fnKEYPOSITION:' + this.keyfuncposition)
            //         this.doItfunction(this.keyfuncposition);



            //     } else if (this.fromicp.data[1] == 225 && this.fromicp.data[2] == 5 && this.fromicp.data[3] == 2) {// Fn放開

            //         this.set128 = 0;
            //     } else if (this.fromicp.data[1] == 7 && this.fromicp.data[2] == 7 && this.fromicp.data[5] == 0) {//normalkey 放開
            //         this.keyfuncposition = 0; //reset;
            //         // this.time=0;
            //     }
            // }

            //     if (this.fromicp.data !== undefined) {
            //         // this.findFunction();

            //         //[4,225,4,1,0]; Fn按下
            //         //[4,225,5,2,0]; Fn放開
            //         //[4,7,7,1,0,1]; normalkey 按下
            //         //[4,7,7,1,0,0]; normalkey 放開

            //     if (this.fromicp.data[1] == 225 && this.fromicp.data[2]==5 && this.fromicp.data[3]==2) {//Fn



            //             this.findFunction(1);


            //     } else if(this.fromicp.data[1]==7 && this.fromicp.data[2]==7 && this.fromicp.data[5]==1){ //normalkey 按下




            //             this.findFunction(2);


            //     }else if(this.fromicp.data[1]==7 && this.fromicp.data[2]==7 && this.fromicp.data[5]==0){

            //         this.time==0;

            //         }
            // }

            // //console.log('test5:'+this.fromicp.data[5]);


            // if (this.fromicp.data[5] == 0) {
            //     //console.log('yes');
            //     // this.keypositionX = this.fromicp.data[3];
            //     // this.keypositionY = this.fromicp.data[4];
            //     // this.keyfuncposition = this.fromicp.data[3] * 8 + this.fromicp.data[4];
            //     // this.doItfunction(this.keyfuncposition);
            // }
            // // //console.log('KEYPOSITION:'+this.keyfuncposition);
            // this.doItfunction(this.keyfuncposition);
        })

    }

    // ngOnChanges(changes: any) {
    //     //console.log('hanges111111')
    //     //console.log(changes);

    // }


    profileget(event:any){
        //console.log('pro1111');
        // //console.log('${event}');
        // //console.log(event);
        this.profileName=event;
        //console.log(event);
        
    }

    deviceReady: string;
    callbackFunc: any;
    
    // title = "app";

    // OpenCalculator() {
    //     // 「C:\Documents and Settings\All Users\「開始」功能表\程式集\附屬應用程式」
    //     let where = "C:\\WINDOWS\\system32\\calc.exe"
    //     let obj1 = {
    //         Type: funcVar.FuncType.Device,
    //         Func: funcVar.FuncName.RunApplication,
    //         Param: where

    //     }
    //     this.protocol.RunSetFunction(obj1).then((data) => {
    //     })
    // }
    // OpenBrowser() {
    //     let where = "C:\\Program Files (x86)\\Google\\Chrome\\Application\\chrome.exe"
    //     let obj1 = {
    //         Type: funcVar.FuncType.Device,
    //         Func: funcVar.FuncName.RunApplication,
    //         Param: where

    //     }
    //     this.protocol.RunSetFunction(obj1).then((data) => {
    //     })
    // }

    // OpenPlayer() {
    //     let where = "C:\\Program Files (x86)\\Windows Media Player\\wmplayer.exe"
    //     let obj1 = {
    //         Type: funcVar.FuncType.Device,
    //         Func: funcVar.FuncName.RunApplication,
    //         Param: where

    //     }
    //     this.protocol.RunSetFunction(obj1).then((data) => {
    //     })

    // }




    // OpenMyComputer() {
    //     let where = "C:\\"
    //     let obj1 = {
    //         Type: funcVar.FuncType.Device,
    //         Func: funcVar.FuncName.RunApplication,
    //         Param: where

    //     }
    //     this.protocol.RunSetFunction(obj1).then((data) => {
    //     })

    // }

    // selfdefinePath() {
    //     //console.log('自定义效果11111');
    //     //console.log(this.Path);
    //     let where = this.Path;
    //     let obj1 = {
    //         Type: funcVar.FuncType.Device,
    //         Func: funcVar.FuncName.RunApplication,
    //         Param: where

    //     }
    //     this.protocol.RunSetFunction(obj1).then((data) => {
    //     })

    // }





    // //特色功能
    // blockWindowsKey() {
    //     let data = {
    //         profile: '1'

    //     }

    //     let obj1 = {
    //         Type: funcVar.FuncType.Device,
    //         Func: funcVar.FuncName.GetKeyMatrix,
    //         Param: data

    //     }
    //     this.protocol.RunSetFunction(obj1).then((data) => {


    //         //reset Keycodetable



    //         //console.log("Container RunSetFunction:" + data);

    //         //set new key

    //         data[124] = 0xB3; //L-win;

    //         // //console.log(data[7]);
    //         // //console.log(data);

    //         let content = {
    //             profile: '1',
    //             KeyData: data
    //         }

    //         let obj2 = {
    //             Type: funcVar.FuncType.Device,
    //             Func: funcVar.FuncName.SetKeyMatrix,
    //             Param: content

    //         }

    //         this.protocol.RunSetFunction(obj2).then((data) => {
    //             //console.log("Container RunSetFunction:" + data);
    //             //console.log('setMatrix ended');



    //         })



    //     })

    // }


    // resetkey() {
    //     let data = {
    //         profile: '1'

    //     }

    //     let obj1 = {
    //         Type: funcVar.FuncType.Device,
    //         Func: funcVar.FuncName.GetKeyMatrix,
    //         Param: data

    //     }
    //     this.protocol.RunSetFunction(obj1).then((data) => {


    //         //reset Keycodetable



    //         //console.log("Container RunSetFunction:" + data);

    //         //set new key
    //         for (let index = 0; index < this.KCTarr.length; index++) {
    //             data[index] = this.KCTarr[index];
    //         }


    //         // //console.log(data[7]);
    //         // //console.log(data);

    //         let content = {
    //             profile: '1',
    //             KeyData: data
    //         }

    //         let obj2 = {
    //             Type: funcVar.FuncType.Device,
    //             Func: funcVar.FuncName.SetKeyMatrix,
    //             Param: content

    //         }

    //         this.protocol.RunSetFunction(obj2).then((data) => {
    //             //console.log("Container RunSetFunction:" + data);
    //             //console.log('app 11111');

            
    //                 let obj = {
    //                     "ProfileName": this.profileName.profile,
    //                     "Key": {
    //                         "keyFunctionArr": [],
    //                         "marcroContent": [],
    //                         "Path": "",
    //                     },
    //                     "shelf01": [],
    //                     "shelf02": [],
    //                     "KeyDataValue": [],
    //                     "Light": {
    //                         "LightEffect": "",
    //                         "Mode": [],
    //                         "Speed": [],
    //                         "Color": [],
    //                         "Time": "",
    //                         "Into": ""
    //                     },
    //                     "AttLight": {
    //                         "effect": "",
    //                         "time": ""
    //                     },
    //                     "GameMode": [0, 0, 0]
    //                 }
                    
    //                 this.db.UpdateProfile(this.profileName.id,obj).then((doc: any) => {
    //                     //console.log('reset done');
    //                     this.profileName=doc[0];
    //                 })
    //             })
            
              


    //     })

    // }

  

    // CtrltoCaps() {
    //     let data = {
    //         profile: '1'

    //     }

    //     let obj1 = {
    //         Type: funcVar.FuncType.Device,
    //         Func: funcVar.FuncName.GetKeyMatrix,
    //         Param: data

    //     }
    //     this.protocol.RunSetFunction(obj1).then((data) => {


    //         //reset Keycodetable



    //         //console.log("Container RunSetFunction:" + data);

    //         //set new key

    //         data[6] = 0x39; //L-win;

    //         // //console.log(data[7]);
    //         // //console.log(data);

    //         let content = {
    //             profile: '1',
    //             KeyData: data
    //         }

    //         let obj2 = {
    //             Type: funcVar.FuncType.Device,
    //             Func: funcVar.FuncName.SetKeyMatrix,
    //             Param: content

    //         }

    //         this.protocol.RunSetFunction(obj2).then((data) => {
    //             //console.log("Container RunSetFunction:" + data);
    //             //console.log('setMatrix ended');



    //         })



    //     })

    // }



    // doItfunction(position) {

    //     this.time++;
    //     let obj={
    //         'ProfileName':this.profileName.ProfileName
    //     }
    //     this.db.getProfile(obj).then((doc: any) => {
    //         //console.log('q11111');
    //         //console.log(doc[0]);
    //         this.Path=doc[0].Key.Path;
    //         // //console.log('getallprogfile'+JSON.stringify(doc));
    //         // //console.log('getallprogfile'+doc);
    //         // //console.log("matrix紀錄的位置:"+position);

    //         // //console.log("func名稱:"+doc[1].Key.matrixkeyArr12);
    //         // for (let i = 0; i < doc.length; i++) { //找profile
    //         //     if (doc[i].ProfileName == "profile 1") {
    //         //         //console.log('1111');
    //         //         let arrorder = i;
    //         //         //console.log(position);
    //         //         //console.log(arrorder);
    //                 // //console.log(doc[arrorder]);
    //                 // //console.log(doc[arrorder].Key);
    //                 // //console.log("func名稱:"+doc[arrorder].Key.keyFunctionArr[10]);
    //                 // //console.log("func名稱:"+doc[arrorder].Key.keyFunctionArr[position]);

    //                 if (doc[0].Key.keyFunctionArr[position] == "OpenBrowser") {
    //                     this.OpenBrowser();
    //                     //console.log('OpenBrowser');
    //                 }

    //                 if (doc[0].Key.keyFunctionArr[position] == "OpenCalculator") {
    //                     this.OpenCalculator();
    //                     //console.log('222');
    //                 }

    //                 if (doc[0].Key.keyFunctionArr[position] == "OpenPlayer") {
    //                     this.OpenPlayer();
    //                 }


    //                 if (doc[0].Key.keyFunctionArr[position] == "OpenMyComputer") {
    //                     this.OpenMyComputer();
    //                 }
    //                 if (doc[0].Key.keyFunctionArr[position] == "selfdefinePath") {
    //                     this.selfdefinePath();
    //                 }
    //                 //特色功能
    //                 if (doc[0].Key.keyFunctionArr[position] == "changeMode") {
    //                     // this.OpenMyComputer();
    //                 }

    //                 if (doc[0].Key.keyFunctionArr[position] == "blockWindowsKey") {
    //                     this.blockWindowsKey();
    //                 }

    //                 if (doc[0].Key.keyFunctionArr[position] == "resetkey") {
    //                     this.resetkey();
    //                 }

    //                 if (doc[0].Key.keyFunctionArr[position] == "CtrltoCaps") {
    //                     this.CtrltoCaps();
    //                 }


    //                 // //console.log("func名稱:"+ eval(doc[arrorder].Key.keyFunctionArr[position]));

    //                 // eval(doc[arrorder].Key.keyFunctionArr[position]());
    //         //     }
    //         // }

    //         // //console.log("func名稱:"+doc[this.arrorder].Key.keyFunctionArr);



    //     })


    // }


    







    DataChange(data: any) {
        this.DeviceName = data.DeviceName;
        if (data.PlugType == 1)
            this.DeviceStatus = 1
        else
            this.DeviceStatus = 0
        //console.log('app: ' + JSON.stringify(data));
    }

    StatusChange(data: any) {
        this.DeviceObj = data;
    }

    ngOnInit() {
    }

    ngAfterViewInit() {
        // //console.log('device111');

        let obj = {
            Type: funcVar.FuncType.System,
            Func: funcVar.FuncName.InitDevice,
            Param: null
        }
        this.protocol.RunSetFunction(obj).then((data) => {
            // //console.log('deviceeeeee222');
            // this.deviceReady='deviceGet';

        });
    }


    //
//     clearpposition() {
//         this.keyfuncposition = 0;
//     }
//     findFunction(w) {
//         // this.keyfuncposition = 0; //reset;
//         //    this.time++




//         if (this.fromicp.data[5] == 0) {
//             //console.log('yes');
//             //console.log('normalKEYPOSITION:' + this.keyfuncposition);
//             this.keypositionX = this.fromicp.data[3];
//             this.keypositionY = this.fromicp.data[4];
//             this.keyfuncposition = this.fromicp.data[3] * 8 + this.fromicp.data[4];

//             if (w == 1) { //有沒有Fn鍵
//                 //console.log('222')

//                 this.keyfuncposition = this.keyfuncposition + 128;
//                 //console.log('FnKEYPOSITION:' + this.keyfuncposition);
//             }
//             // this.keyfuncposition = this.keyfuncposition + 128;
//             this.doItfunction(this.keyfuncposition);

//         }

//         //進來的值是不是255


//         // else if (this.fromicp.data[5] == 0) {
//         //     //console.log('yes');
//         //     this.keypositionX = this.fromicp.data[3];
//         //     this.keypositionY = this.fromicp.data[4];
//         //     this.keyfuncposition = this.fromicp.data[3] * 8 + this.fromicp.data[4];
//         //     this.doItfunction(this.keyfuncposition);
//         // }
//     }
}
