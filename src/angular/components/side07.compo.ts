declare var System;
import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { protocolService } from '../services/service/protocol.service';
import { icpEventService } from '../services/service/icpEventService.service'

let evtVar = System._nodeRequire('./backend/others/eventVariable');
let funcVar = System._nodeRequire('./backend/others/FunctionVariable');
let env = System._nodeRequire('./backend/others/env');
let remote = System._nodeRequire('electron').remote;
let { dialog } = remote;
let win = remote.getGlobal('MainWindow').win;



const { ipcRenderer } = System._nodeRequire('electron');
declare var $: any;

import { ElectronEventService, dbService, EmitService } from '../services/libs/electron/index';
import { GetDeviceService } from '../services/device/GetDevice.service';
import { Subscription } from "rxjs/Subscription";
@Component({
    selector: 'side07-app',
    templateUrl: './components/pages/side07.compo.html',
    //template: '<h1>我的第一个 Angular 应用</h1>',
    styleUrls: ['./css/first.css'],
    providers: [protocolService, dbService, icpEventService],
    inputs: ['myKey', 'mutiobj']
})

export class side07Component implements OnInit {
    constructor(private protocol: protocolService, private db: dbService, private emitService: EmitService, private icpEventService: icpEventService) {
        //console.log('side01 loading complete');
        this.subscription = this.emitService.EmitObservable.subscribe(src => {
            
        })
    }
    changeprofile:any='2';
    mutiobj: any = {};
    VID: string = "";
    PID: string = "";
    Status: string = "";
    DeviceName: string = "";
    DeviceObj: any = []
    Device: any = {};
    TempData: any;
    subscription: Subscription;
    disabletextbox: boolean = true;
    setfunctionkey: any;
    myKey: string;
    keyfunction: any = [];
    Path: any;
    t: number = 0;
    switch: any = "disabled";
    saveclick: number = 0;

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
        this.outputEvent.emit(7);
    }

    keywasSet() {
        this.Keyhasbeenset.emit(this.myKey);
    }

    finalclick: number;
    readdb() { //讀取db
        //console.log('readdbMacr1111');
        //console.log(this.mutiobj);
        //console.log(this.mutiobj.ProfileName);

        if(this.mutiobj.ProfileName == '' || this.mutiobj.ProfileName == undefined || this.mutiobj.ProfileName == null) {
            this.mutiobj.ProfileName =='游戏模式';
        }
        
        if(this.mutiobj.ProfileName=='游戏模式'){
            this.changeprofile='2';
        }else{
            this.changeprofile='1';
        }
        this.db.UpdateProfile(this.mutiobj.id, this.mutiobj).then((doc: any) => {//更新db對應位置
            //console.log(this.mutiobj);
            // //console.log(this.mutiobj);
            if (this.mutiobj.Key.options.OPshelf01[6] !== undefined) {
                //console.log('readdbMacr222');
                this.clickOnitem(this.mutiobj.Key.options.OPshelf01[6]);
            }
        });
    }

    ngOnInit() {
        this.readdb();
        document.getElementById('btna').classList.add("disabled");
    }
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
    check11: boolean = false;
    check12: boolean = false;
    check13: boolean = false;
    check14: boolean = false;

    // functionarr:any =['openCalculator'];
    // openCalculator(){
    //     let where = "C:\\WINDOWS\\system32\\calc.exe"
    //     window.location.href = "sp://" + where;
    // }

    // OpenPath(openFile){
    //     alert(window.URL.createObjectURL(openFile.files[0]));
    // }
    
    setIntoDB() {
        //console.log('setIntoDB1111')
        //functinKey決定已經選定在選項時
        //本頁啟動時產生的mutiobj更新內容
        this.mutiobj.Light.Mode[this.myKey]=0; 
        this.mutiobj.Light.Speed[this.myKey]=0; 
        this.mutiobj.Key.keyFunctionArr[this.myKey] = this.keyfunction[this.myKey];
        this.mutiobj.Key.Path[this.myKey] = this.Path;  //20180806 AKO
        // this.mutiobj.Key.marcroContent[this.myKey] = this.setMacroarr;
        // //console.log(this.mutiobj);
        this.mutiobj.Key.options.OPshelf01[6] = this.finalclick;
        this.db.UpdateProfile(this.mutiobj.id, this.mutiobj).then((doc: any) => {
            //console.log('setIntoDB success');
            //console.log(this.mutiobj);
        });
    }



    clickOnitem(w) {
        this.finalclick = w;
        this.check01 = false;
        this.check02 = false;
        this.check03 = false;
        this.check04 = false;
        this.disabletextbox = true;

        if (w == 0) {
            this.check01 = true;
            this.keyfunction[this.myKey] = "OpenBrowser";
            // //console.log('111'+ this.keyfunction[this.myKey]);
            // //console.log('222'+ this.keyfunction[12])
            document.getElementById('btna').classList.add("disabled");
            document.getElementById('btna').style.cursor = "default";
        }
        if (w == 1) {
            // this.setfunctionkey=0xB3;
            // this.functionkeysetIn();
            this.check02 = true;
            this.keyfunction[this.myKey] = "OpenPlayer";
            document.getElementById('btna').classList.add("disabled");
            document.getElementById('btna').style.cursor = "default";
        }
        if (w == 2) {
            this.check03 = true;
            this.keyfunction[this.myKey] = "OpenCalculator";
            document.getElementById('btna').classList.add("disabled");
            document.getElementById('btna').style.cursor = "default";
        }
        if (w == 3) {
            this.disabletextbox = false;
            this.check04 = true;
            this.keyfunction[this.myKey] = "selfdefinePath";
            document.getElementById('btna').classList.remove("disabled");
            document.getElementById('btna').style.cursor = "pointer";
        } else {
            return false;
        }
    }


    functionkeysetIn() {
        if (this.saveclick == 0) {
            this.gamemoment = "stopApmode";
            this.outputGame();
            this.saveclick = 1;
            this.loading(1);
            this.setIntoDB();
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
                data[this.myKey] = 0xB3;
                // //console.log(data[7]);
                // //console.log(data);
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
                        this.keywasSet();
                    }, 3000);
                })
            })
        }
    }

    openApp() {
        let options = null;
        if (env.isWindows) {
            options = {
                filters:
                    [{
                        name: "App",
                        extensions: ['exe']
                    }],
                properties: ['openFile']
            }
        } else {
            options = {
                defaultPath: "/Applications",
                filters:
                    [{
                        name: "App",
                        extensions: ["app"]
                    }]
            };
        }
        dialog.showOpenDialog(win, options, (fns) => {
            let appPath = fns[0];
            //console.log('000:' + appPath);
            // document.getElementById("textfield").focus();
            this.Path = appPath;
            // let obj1 = {
            //     Type: funcVar.FuncType.Device,
            //     Func: funcVar.FuncName.RunApplication,
            //     Param: appPath
            // }
            // this.protocol.RunSetFunction(obj1).then((data) => {
            // })
        });
    }
}