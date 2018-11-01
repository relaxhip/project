declare var System;
import { Component, OnInit, Output, Input, EventEmitter } from '@angular/core';
import { protocolService } from '../services/service/protocol.service';
import { icpEventService } from '../services/service/icpEventService.service'
let evtVar = System._nodeRequire('./backend/others/eventVariable');
let funcVar = System._nodeRequire('./backend/others/FunctionVariable');
let env = System._nodeRequire('./backend/others/env');
const { ipcRenderer } = System._nodeRequire('electron');
declare var $: any;
import { ElectronEventService, dbService, EmitService } from '../services/libs/electron/index';
import { Subscription } from "rxjs/Subscription";
import { FORMERR } from 'dns';
@Component({
    selector: 'self02-app',
    templateUrl: './components/selfdf02.compo.html',
    //template: '<h1>我的第一个 Angular 应用</h1>',
    styleUrls: ['./css/first.css', './css/kbd.css', './css/kbd_selfdf.css'],
    providers: [protocolService, dbService, icpEventService],
    inputs: ['ProfileDetail']
})



export class Selfdf02Component implements OnInit {
    constructor(private protocol: protocolService, private db: dbService, private icpEventService: icpEventService, private emitService: EmitService) {
        //console.log('selfdf02 loading complete');
        this.subscription = this.emitService.EmitObservable.subscribe(src => {
            this.fromicp = src;
            if (this.fromicp.data !== undefined) {
                if (this.fromicp.data[0] == 4 && this.fromicp.data[1] == 225 && this.fromicp.data[2] == 15 && this.fromicp.data[3] == 1) {
                    // console.log("attleft");
                    // this.attbtn = false;
                }
                else if (this.fromicp.data[0] == 4 && this.fromicp.data[1] == 225 && this.fromicp.data[2] == 16 && this.fromicp.data[3] == 2) {
                    // console.log("attright");
                    // this.attbtn = true;
                }
            }
        })

    }

    //流程: 找到key後 得到keyData fnkey的位置=>db儲存=>硬體下值
    @Output() outputGameEvent: EventEmitter<any> = new EventEmitter();
    @Output() openFrtp: EventEmitter<any> = new EventEmitter();
    @Output() resetEvent: EventEmitter<any> = new EventEmitter();
    resetsave: boolean = true;
    changeprofile: any = "2";
    fromicp: any;
    attbtn: boolean;
    blockthispage: any;
    ProfileDetail: any = {
        "ProfileName": '游戏模式'
    };
    array1: any = ["esc", "f1", "f2", "f3", "f4", "f5", "f6", "f7", "f8", "f9", "f10", "f11", "f12", "print", "scroll", "pause", "perid", "n1", "n2", "n3", "n4", "n5", "n6", "n7", "n8", "n9", "n0", "minus", "plus", "bsp", "insert", "home", "pup", "numlock", "numdrawn", "numtimes", "numminus", "tab", "q", "w", "e", "r", "t", "y", "u", "i", "o", "p", "lqu", "rqu", "drawn", "delete", "end", "pdown", "num7", "num8", "num9", "numplus", "caps", "a", "s", "d", "f", "g", "h", "j", "k", "l", "sem", "quo", "enter", "num4", "num5", "num6", "lshift", "z", "x", "c", "v", "b", "n", "m", "comma", "dot", "qmark", "rshift", "up", "num1", "num2", "num3", "numenter", "lctrl", "win", "lalt", "space", "ralt", "fn", "book", "rctrl", "left", "down", "right", "num0", "numdot"]
    KCTarr: any = [72, 165, 167, 168, 228, 166, 224, 62, 20, 43, 4, 41, 29, 145, 53, 30, 26, 57, 22, 100, 27, 138, 58, 31, 8, 60, 7, 61, 6, 144, 59, 32, 21, 23, 9, 10, 25, 5, 34, 33, 24, 28, 13, 11, 16, 17, 35, 36, 12, 48, 14, 63, 54, 135, 46, 37, 18, 64, 15, 137, 55, 101, 65, 38, 19, 47, 51, 52, 50, 56, 45, 39, 71, 0, 170, 226, 171, 230, 0, 70, 0, 42, 49, 68, 40, 69, 66, 67, 95, 92, 89, 44, 83, 81, 76, 179, 96, 93, 90, 98, 84, 79, 73, 176, 97, 94, 91, 99, 85, 86, 75, 78, 87, 133, 88, 82, 103, 80, 74, 77, 231, 225, 229, 139, 227, 172, 136, 0, 72, 165, 167, 168, 228, 166, 224, 62, 20, 43, 4, 0, 29, 145, 53, 30, 26, 57, 22, 100, 27, 138, 58, 31, 8, 60, 7, 61, 6, 144, 59, 32, 21, 23, 9, 10, 25, 5, 34, 33, 24, 28, 13, 11, 16, 17, 35, 36, 12, 48, 14, 63, 54, 135, 46, 37, 18, 64, 15, 137, 55, 101, 65, 38, 19, 47, 51, 52, 50, 56, 45, 39, 219, 0, 170, 226, 171, 230, 0, 216, 0, 42, 49, 68, 240, 176, 66, 67, 95, 92, 89, 44, 83, 81, 217, 179, 96, 93, 90, 98, 84, 79, 218, 176, 97, 94, 91, 99, 85, 86, 223, 222, 87, 133, 88, 82, 103, 80, 220, 221, 0, 225, 229, 139, 177, 172, 136, 0];
    loading: boolean = false;
    keyMatrixMap: any = [];
    block: number;
    subscription: Subscription;
    firstarr: any = ["esc", "f1", "f2", "f3", "f4", "f5", "f6", "f7", "f8", "f9", "f10", "f11", "f12", "print", "scroll", "pause", "perid", "n1", "n2", "n3", "n4", "n5", "n6", "n7", "n8", "n9", "n0", "minus", "plus", "bsp", "insert", "home", "pup", "numlock", "numdrawn", "numtimes", "numminus", "tab", "q", "w", "e", "r", "t", "y", "u", "i", "o", "p", "lqu", "rqu", "drawn", "delete", "end", "pdown", "num7", "num8", "num9", "numplus", "caps", "a", "s", "d", "f", "g", "h", "j", "k", "l", "sem", "quo", "enter", "num4", "num5", "num6", "lshift", "z", "x", "c", "v", "b", "n", "m", "comma", "dot", "qmark", "rshift", "up", "num1", "num2", "num3", "numenter", "lctrl", "win", "lalt", "space", "ralt", "fn", "book", "rctrl", "left", "down", "right", "num0", "numdot",]

    pickFnKey: any;
    theFnKey: any;
    theFunctionKey: any = "0xA7";
    t: number = 0;

    selfdf: any = 'none';
    fnbtn: boolean = false;
    check01: boolean = false;
    check02: boolean = false;
    check03: boolean = false;
    check04: boolean = false;
    check05: boolean = false;
    check06: boolean = false;
    check07: boolean = false;
    check08: boolean = false;
    check09: boolean = false;
    fncontent01: boolean = true;
    fncontent02: boolean = false;
    fncontent03: boolean = false;
    fncontent04: boolean = false;
    fncontent05: boolean = false;
    etitle: any = "多媒体";
    gamemoment: any;
    check: boolean = false;
    saveclick: number = 0;
    checkarr = ['check01', 'check02', 'check03', 'check04', 'check05'];
    fnopt: any = ['01', '02', '03', '04', '05'];
    keyfunction: any = [];
    thisarrayindex: number;
    mutiobj: any = {};
    FindDbCtProfile: any = '游戏模式';
    LastarrayindexArr: any = []; //所有已設定的按鍵

    finalclick00: number;
    finalclick01: number;
    finalclick02: number;
    finalclick03: number;

    //讀取shelf02=>更新

    detectButton() {
        let obj3 = {
            Type: funcVar.FuncType.Device,
            Func: funcVar.FuncName.GetProfieAndFirmwareVer,
            Param: ""
        }
        // //console.log('next apmode');
        // //console.log('next apmode');
        this.protocol.RunSetFunction(obj3).then((data) => {
            // //console.log('detectButton1111');	
            // //console.log(data);
            if (data[5] == 1) {
                console.log('按鈕位置在右邊')
                this.attbtn = true;
            }
            else if (data[5] == 0) {
                console.log('按鈕位置在左邊')
                this.attbtn = false;
            }
        })
    }

    outputGame() {

        this.outputGameEvent.emit(this.gamemoment);

    }
    readDb() {
        if (this.ProfileDetail.ProfileName == '' || this.ProfileDetail.ProfileName == undefined || this.ProfileDetail.ProfileName == null) {
            this.ProfileDetail.ProfileName == '游戏模式';
        }

        let obj = {
            "ProfileName": this.ProfileDetail.ProfileName
        }

        if (this.ProfileDetail.ProfileName == '游戏模式') {
            this.changeprofile = '2';
        } else {
            this.changeprofile = '1';
        }
        this.db.getProfile(obj).then((see: any) => {

            //console.log('profile content' + see);
            for (let index = 0; index < see.length; index++) {
                //console.log(see[index]);
                // //console.log(see[index].Light);
                this.mutiobj = see[index];


            }
            //console.log('test');
            //console.log(this.mutiobj);

            //畫面上給有設定的鍵加入紅色三角形

            for (let i = 0; i < this.mutiobj.shelf02.length; i++) {
                if (this.mutiobj.shelf02[i] !== null && this.mutiobj.shelf02[i] !== undefined && this.mutiobj.shelf02[i] !== "") {
                    this.LastarrayindexArr[i] = this.mutiobj.shelf02[i]; //所有已設定的按鍵

                    document.getElementById(this.LastarrayindexArr[i]).style.backgroundImage = "url('./image/hasset.png')";
                    document.getElementById(this.LastarrayindexArr[i]).style.backgroundRepeat = "no-repeat";
                }
            }

            for (let i = 0; i < this.mutiobj.shelfblock02.length; i++) {
                if (this.mutiobj.shelfblock02[i] !== null && this.mutiobj.shelfblock02[i] !== undefined && this.mutiobj.shelfblock02[i] !== "") {
                    let tt = this.mutiobj.shelfblock02[i];
                    document.getElementById(tt).style.backgroundColor = "transparent";//改色
                    document.getElementById(tt).style.backgroundImage = "none";


                    let aa = this.mutiobj.shelfblock02[i];
                    document.getElementById(aa).style.backgroundColor = "#2C2C2C";//改色
                    document.getElementById(aa).style.opacity = "0.7";
                }

            }


        })



        //    //console.log('readdbMacr1111');





    }
    // @Input() lightBS;
    ngOnInit() {
        // setTimeout(() => {
        // this.detectButton();
        // }, 50);
        if (this.ProfileDetail == undefined) { //避免profile還未寫入值，一直讀取到有值
            this.ngOnInit();
        } else {
            //console.log('find profile')
            this.readDb();
            setTimeout(() => {
                document.getElementById("fn_css01").classList.add("disabled");
                document.getElementById("esc_css01").classList.add("disabled");
            }, 50);

            // return false;
        }
        //現象如果在頁面未讀取ProfileDetail之前進入，顯示ProfileName of undefined
        //作法:先給游戏模式，2秒後再給ProfileDetail.ProfileName
        // this.readDb();
        // setTimeout(() => {
        //     this.FindDbCtProfile=this.ProfileDetail.ProfileName;
        //     this.readDb();
        // }, 2000);
        // //console.log(this.ProfileDetail.ProfileName);
        // let obj={
        //     "ProfileName":this.ProfileDetail.ProfileName//this.ProfileDetail.ProfileName
        // }
        // this.db.getProfile(obj).then((see: any) => {

        //     //console.log('profile content'+see);
        //     for (let index = 0; index < see.length; index++) {
        //     //console.log(see[index]);
        //     // //console.log(see[index].Light);
        //     this.mutiobj=see[index];
        //     }
        //     //console.log('test');
        //     //console.log(this.mutiobj);
        // })
        // if (this.lightBS == 0) {
        // 	//console.log("from parent LBS 0 attRight", this.lightBS);
        // 	this.attbtn = true;
        // }
        // else if (this.lightBS == 1) {
        // 	//console.log("from parent LBS 1 attLeft", this.lightBS)
        // 	this.attbtn = false;
        // }
    }

    ngOnChanges(anyChange: any) {
        //console.log('testchange');
        //console.log(anyChange);
        //console.log(anyChange.ProfileDetail.currentValue);

        let obj = {
            "ProfileName": anyChange.ProfileDetail.currentValue.ProfileName
        }
        this.db.getProfile(obj).then((see: any) => {

            //console.log('profile content' + see);
            for (let index = 0; index < see.length; index++) {
                //console.log(see[index]);
                // //console.log(see[index].Light);
                this.mutiobj = see[index];
            }
            //console.log('new_mutiobj');
            //console.log(this.mutiobj);


            //
            for (let index = 0; index < this.array1.length; index++) {
                // //console.log(this.array1[index] + "_2_css01");
                document.getElementById(this.array1[index] + "_css01").style.backgroundImage = "none";
                document.getElementById(this.array1[index] + "_css01").style.backgroundColor = "transparent";//改色

            }

            // this.readDb();

            // if (this.mutiobj.Key.options.OPshelf02[0] !== undefined) {
            //     //console.log('readdbMacr222');
            //     //console.log(this.mutiobj.Key.options.OPshelf01[0]);
            //     this.clickOnMedia(this.mutiobj.Key.options.OPshelf01[0]);
            // }

            // if (this.mutiobj.Key.options.OPshelf02[1] !== undefined) {
            //     //console.log('readdbMacr4444');

            //     this.clickOnLight(this.mutiobj.Key.options.OPshelf01[1]);
            // }


            // if (this.mutiobj.Key.options.OPshelf02[2] !== undefined) {
            //     //console.log('readdbMacr333');

            //     // this.clickOnOpen(this.mutiobj.Key.options.OPshelf01[2]);
            // this.clickOnOpen(1);
            // }




            // if (this.mutiobj.Key.options.OPshelf02[3] !== undefined) {
            //     //console.log('readdbMacr222');

            //     this.clickOnFeature(this.mutiobj.Key.options.OPshelf01[3]);
            // }


        })
    }


    resetEventfun() {
        this.resetEvent.emit('resetUI');
    }

    loadingbegin(e) {

        if (e == 1) {
            //console.log('hd 11111');
            // this.loading = true;
            this.openFrtp.emit(e);
        }

        if (e == 2) {

            //console.log('side01 01');
            this.openFrtp.emit(e);
        }


        if (e == 3) {

            //console.log('side01 01');
            this.openFrtp.emit(e);
        }

        if (e == 0) {
            //console.log('hd 222');
            // this.loading = false;
            this.openFrtp.emit(e);
        }
    }

    resetThiskey(i) {

        this.blockthispage = "disabled";
        this.loadingbegin(1);

        setTimeout(() => {
            this.gamemoment = ""
            this.gamemoment = 'stopApmode';
            this.outputGame();
            let aa = this.array1[i] + "_css01"
            document.getElementById(aa).style.backgroundColor = "transparent";//改色
            document.getElementById(aa).style.backgroundImage = "none";
            //console.log('aa');
            //console.log(aa);
            // for (let index = 0; index < 16; index++) {
            //     if (this.keyMatrixMap[index].indexOf(this.array1[i]) !== -1) {
            //         let x = index;
            //         let y = this.keyMatrixMap[index].indexOf(this.array1[i]);
            //         this.block = x * 8 + y;
            //         //console.log('thekey:' + this.block);
            //         //console.log('x:' + x + 'y:' + y)
            //         //keymatrix 找 xy
            //     }
            // }

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



                data[this.theFnKey] = this.KCTarr[this.theFnKey];
                data[this.block + 128] = this.KCTarr[this.block + 128];



                // //console.log('thiskeydata:' + this.KCTarr);




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
                    // "Light": {
                    //     "LightEffect": "",
                    //     "Mode": [],
                    //     "Speed": [],
                    //     "Color": [],
                    //     "Time": "",
                    //     "Into": ""
                    // },
                    this.mutiobj.Key.keyFunctionArr[this.theFnKey] = null;
                    this.mutiobj.KeyDataValue[this.theFnKey] = null;
                    this.mutiobj.Light.Mode[this.theFnKey] = null;
                    this.mutiobj.Light.Speed[this.theFnKey] = null;
                    // this.mutiobj.shelf02.length = 0;
                    // this.LastarrayindexArr.length = 0;
                    //console.log('before save');
                    //console.log(this.mutiobj);


                    setTimeout(() => {
                        for (let resetindex = 0; resetindex < this.mutiobj.shelf02.length; resetindex++) {

                            if (this.mutiobj.shelf02[resetindex] == aa) {
                                //console.log('aa');
                                //console.log(aa);
                                //console.log('this.mutiobj.shelf02[resetindex]');
                                //console.log(this.mutiobj.shelf02[resetindex]);
                                this.mutiobj.shelf02[resetindex] = null;
                            }
                        }


                        setTimeout(() => {
                            this.db.UpdateProfile(this.mutiobj.id, this.mutiobj).then((doc: any) => {


                                //console.log('update success');
                                //console.log(this.mutiobj.id);

                                setTimeout(() => {

                                    this.gamemoment = 'startApmode';
                                    this.outputGame();
                                    this.blockthispage = " ";
                                    this.loadingbegin(0);
                                }, 200);

                            });
                        }, 100);
                    }, 50);



                    // if (resetindex = this.mutiobj.shelf02.length - 1) {
                    //     //console.log('after save');
                    //     //console.log(this.mutiobj);

                });
            });
        }, 50);
    }

    resetbutton() { // 恢复默认设置
        if (this.resetsave) {
            this.resetsave = false;
            this.blockthispage = 'disabled';
            this.loadingbegin(1);
            //暫停apmode

            setTimeout(() => {
                this.gamemoment = ""
                this.gamemoment = 'stopApmode';
                this.outputGame();


                // //清除DB
                // let obj = {
                //     "ProfileName": this.mutiobj.ProfileName
                // }
                // //console.log('resetbutton');
                // //console.log(this.mutiobj.ProfileName);
                // this.db.getProfile(obj).then((see: any) => {
                //     let obj2 = {
                //         "ProfileName": this.mutiobj.ProfileName,
                //         "Key": {
                //             "keyFunctionArr": [],
                //             "marcroContent": [],
                //             "Path": [],
                //             "keyCopy": [],
                //             "options": {
                //                 "OPshelf01": [],//內容/選單
                //                 "OPshelf02": []
                //             }
                //         },
                //         "shelf01": [],
                //         "shelf02": [],
                //         "shelfblock01": [],
                //         "shelfblock02": [],
                //         "KeyDataValue": [],
                //         "Light": {
                //             "LightEffect": "",
                //             "LightSetting": {
                //                 "LSbrightness": [],
                //                 "LSspeed": [],
                //                 "LSdirection": [],
                //                 "changeMode": [],
                //                 "changeTime": [],
                //             },
                //             "Mode": [],
                //             "Speed": [],
                //             "Color": [],
                //             "Time": "",
                //             "Into": ""
                //         },
                //         "AttLight": {
                //             "effect": "",
                //             "time": ""
                //         },
                //         "GameMode": [0, 0, 0]
                //     }

                //     //console.log('obj2');
                //     //console.log(obj2);

                //     //console.log('see[0].id');
                //     //console.log(see[0].id);

                //     this.db.UpdateProfile(see[0].id, obj2).then((doc: any) => {
                //         //console.log('resetbutton1111');
                //         //console.log(doc);
                //     })
                // })



                for (let index = 0; index < this.array1.length; index++) {
                    // //console.log(this.array1[index] + "_2_css01");
                    document.getElementById(this.array1[index] + "_css01").style.backgroundImage = "none";
                    document.getElementById(this.array1[index] + "_css01").style.backgroundColor = "transparent";//改色

                }



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

                    for (let index = 0; index < this.KCTarr.length; index++) {

                        data[index] = this.KCTarr[index];

                    }

                    data[222] = 0x00;
                    data[230] = 0x00;
                    data[213] = 0xB3;
                    data[200] = 0xB3;
                    //console.log('thiskeydata:' + this.KCTarr);

                    if (this.changeprofile == '2') {
                        data[124] = 0x00;
                    } else {
                        data[124] = 227;
                    }


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

                        //清除所有db內容

                        let obj = {
                            "ProfileName": this.ProfileDetail.ProfileName,
                            "Key": {
                                "winstatus": "",
                                "capsstatus": "",
                                "keyFunctionArr": [],
                                "marcroContent": [],
                                "marcroChoose": [],
                                "Path": [],
                                "keyCopy": [],
                                "options": {
                                    "OPshelf01": [],//內容/選單
                                    "OPshelf02": []
                                }
                            },
                            "shelf01": [],
                            "shelf02": [],
                            "shelfblock01": [],
                            "shelfblock02": [],
                            "KeyDataValue": [],
                            "Light": {
                                "LightEffect": "",
                                "LightSetting": {
                                    "LSbrightness": [],
                                    "LSspeed": [],
                                    "LSdirection": [],
                                    "changeMode": [],
                                    "changeTime": [],
                                    "changeStatus": [],
                                    "changeEffect": [],
                                },
                                "Mode": [],
                                "ColorMode": [],
                                "Speed": [],
                                "Color": [],
                                "Time": "",
                                "Into": ""
                            },
                            "AttLight": {
                                "effect": "",
                                "time": ""
                            },
                            "GameMode": [0, 0, 0]
                        }


                        this.db.UpdateProfile(this.mutiobj.id, obj).then((doc: any) => {
                            //console.log('update success');
                            // //console.log(this.mutiobj.id);
                            setTimeout(() => {
                                this.gamemoment = 'startApmode';
                                this.outputGame();
                                this.blockthispage = " ";
                                // this.loadingbegin(0);
                                console.log('0000:', this.mutiobj);
                                this.ngOnInit();
                                setTimeout(() => {
                                    this.resetsave = true;
                                    // this.loadingbegin(0);
                                    this.resetEventfun();
                                }, 1000);
                                // this.mutiobj = {
                                //     "ProfileName": this.ProfileDetail.ProfileName,
                                //     "Key": {
                                //         "keyFunctionArr": [],
                                //         "marcroContent": [],
                                //         "marcroChoose": [],
                                //         "Path": [],
                                //         "keyCopy": [],
                                //         "options": {
                                //             "OPshelf01": [],//內容/選單
                                //             "OPshelf02": []
                                //         }
                                //     },
                                //     "shelf01": [],
                                //     "shelf02": [],
                                //     "shelfblock01": [],
                                //     "shelfblock02": [],
                                //     "KeyDataValue": [],
                                //     "Light": {
                                //         "LightEffect": "",
                                //         "LightSetting": {
                                //             "LSbrightness": [],
                                //             "LSspeed": [],
                                //             "LSdirection": [],
                                //             "changeMode": [],
                                //             "changeTime": [],
                                //         },
                                //         "Mode": [],
                                //         "Speed": [],
                                //         "Color": [],
                                //         "Time": "",
                                //         "Into": ""
                                //     },
                                //     "AttLight": {
                                //         "effect": "",
                                //         "time": ""
                                //     },
                                //     "GameMode": [0, 0, 0] 
                                // }

                            }, 200);

                        });

                    });

                });
            }, 100);

        }
    }

    cleanAllRightOp() {

        for (let index = 0; index < this.array1.length; index++) {
            // //console.log(this.array1[index] + "_2_css01");
            document.getElementById(this.array1[index] + "_2_css01").style.display = "none";

        }

    }


    onRightClick(i) {
        //先清除所有的右鍵options
        this.thisarrayindex = i;

        this.keyMatrixMap[0] = ['pause', 'stop', 'play/pause', 'next', 'rctrl', 'previous', 'lctrl', 'f5'];
        this.keyMatrixMap[1] = ['q', 'tab', 'a', 'esc', 'z', 'k150', 'perid', 'n1'];
        this.keyMatrixMap[2] = ['w', 'caps', 's', 'k45', 'x', 'k132', 'f1', 'n2'];
        this.keyMatrixMap[3] = ['e', 'f3', 'd', 'f4', 'c', 'k151', 'f2', 'n3'];
        this.keyMatrixMap[4] = ['r', 't', 'f', 'g', 'v', 'b', 'n5', 'n4'];
        this.keyMatrixMap[5] = ['u', 'y', 'j', 'h', 'm', 'n', 'n6', 'n7'];
        this.keyMatrixMap[6] = ['i', 'rqu', 'k', 'f6', 'comma', 'k56', 'plus', 'n8'];
        this.keyMatrixMap[7] = ['o', 'f7', 'l', 'k14', 'dot', 'book', 'f8', 'n9'];
        this.keyMatrixMap[8] = ['p', 'lqu', 'sem', 'quo', 'k42', 'qmark', 'minus', 'n0'];
        this.keyMatrixMap[9] = ['scroll', 'media select', 'v-', 'lalt', 'v+', 'ralt', 'mute', 'print'];
        this.keyMatrixMap[10] = ['none', 'bsp', 'drawn', 'f11', 'enter', 'f12', 'f9', 'f10'];
        this.keyMatrixMap[11] = ['num7', 'num4', 'num1', 'space', 'numlock', 'down', 'delete', 'imc'];
        this.keyMatrixMap[12] = ['num8', 'num5', 'num2', 'num0', 'numdrawn', 'right', 'insert', 'g mode'];
        this.keyMatrixMap[13] = ['num9', 'num6', 'num3', 'numdot', 'numtimes', 'numminus', 'pup', 'pdown'];
        this.keyMatrixMap[14] = ['numplus', '巴葡', 'numenter', 'up', 'none', 'left', 'home', 'end'];
        this.keyMatrixMap[15] = ['none', 'lshift', 'rshift', 'k131', 'win', 'fn', 'k133', 'drawn'];
        //delete
        //drawn
        //book
        //rctrl

        // this.selfdf = 'block';
        let t = this.firstarr[i];

        this.pickFnKey = t.toUpperCase();

        for (let i = 0; i < 16; i++) {
            if (this.keyMatrixMap[i].indexOf(t) !== -1) {
                let x = i;
                let y = this.keyMatrixMap[i].indexOf(t);
                this.theFnKey = x * 8 + y + 128;
                //console.log('theFnkey:' + this.theFnKey);
                //console.log('x:' + x + 'y:' + y)

            }
        }

        this.cleanAllRightOp();


        //1:先找出位置 2.ob右鍵選項列改為block
        // //console.log('rightclick' + i);
        let aa = this.array1[i] + "_css01"
        let ob = this.array1[i] + "_2_css01";
        this.thisarrayindex = i;
        let x = document.getElementById(aa).offsetLeft - 50;
        let y = document.getElementById(aa).offsetTop;
        //console.log(ob);
        document.getElementById(ob).style.display = "block";
        document.getElementById(ob).style.top = "'" + y + "px'";
        document.getElementById(ob).style.left = "'" + x + "px'";
        //console.log("x:" + x);
        //console.log('Y:' + y);
    }

    blockKey(i) {
        this.loadingbegin(1);
        this.blockthispage = "disabled";

        //暫停apmode

        setTimeout(() => {
            this.gamemoment = ""
            this.gamemoment = 'stopApmode';
            this.outputGame();
            for (let index = 0; index < 16; index++) {
                if (this.keyMatrixMap[index].indexOf(this.array1[i]) !== -1) {
                    let x = index;
                    let y = this.keyMatrixMap[index].indexOf(this.array1[i]);
                    this.block = x * 8 + y;
                    //console.log('thekey:' + this.block);
                    //console.log('x:' + x + 'y:' + y)
                    //keymatrix 找 xy
                }
            }

            let tt = this.array1[i] + "_css01"
            document.getElementById(tt).style.backgroundColor = "transparent";//改色
            document.getElementById(tt).style.backgroundImage = "none";


            let aa = this.array1[i] + "_css01"
            document.getElementById(aa).style.backgroundColor = "#2C2C2C";//改色
            document.getElementById(aa).style.opacity = "0.7";
            //console.log(aa);

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


                data[this.block + 128] = 0; //+fnkey
                //console.log('thiskeyshow:' + this.block + 128);




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



                    let obj = {
                        "ProfileName": this.ProfileDetail.ProfileName
                    }

                    this.db.getProfile(obj).then((see: any) => {
                        //console.log('blockkey profile2:');

                        see[0].shelfblock02.push(this.array1[i] + "_css01");
                        //console.log(see[0]);

                        for (let resetindex = 0; resetindex < see[0].shelf02.length; resetindex++) {
                            if (see[0].shelf02[resetindex] == this.array1[i] + "_css01") {
                                see[0].shelf02[resetindex] = null;

                            }
                        }

                        see[0].KeyDataValue[this.block+128]=0;
                        setTimeout(() => {
                            this.db.UpdateProfile(see[0].id, see[0]).then((see: any) => {
                                setTimeout(() => {
                                    this.gamemoment = 'startApmode';
                                    this.outputGame();
                                    this.blockthispage = " ";
                                    this.loadingbegin(0);
                                }, 200);
                            })
                        }, 50);
                    })
                });
            });
        }, 50);
    }
    clickfunctiontime: number = 0;
    testKeyinfile() {


        this.clickfunctiontime++
        if (this.clickfunctiontime == 1) {//因為按下而產生選項列
            let Y = document.getElementById("f1_2_css01").offsetTop;
            let X = document.getElementById("f1_2_css01").offsetLeft - 550;

            //console.log('x:' + X);
            //console.log('Y:' + Y);
            // document.getElementById("f1_2_css01").innerHTML += "<div id='currentoption' style='color:white;width:100px; height:50px;background:red;margin-left:10px;margin-top:5px;'><a>编辑功能</a><a>恢复默认功能</a><a>禁用功能</a></div>";//change appearance;
            document.getElementById("f1_2_css01").innerHTML = "<div id='currentoption' style='color:white;width:80px; height:50px;background:red;'><a style='display:block;width:100%; height:20px; background:yellow;'>编辑功能</a><a>恢复默认功能</a><a>禁用功能</a></div>";//change appearance;    

            // document.getElementById('currentoption').style.left= "'"+X+"'";
            // document.getElementById('currentoption').style.top= "'"+Y+"'";
        }
    }


    openOpt() {

        document.getElementById('fnbox').style.display = "block";
        this.fnbtn = true;
    }




    colseSelfdf() {
        this.selfdf = 'none';

    };


    //存入DB內容

    clickOnMedia(w) {//多媒體 選項設定 //達到效果要做Keydata位置更改data值

        this.finalclick00 = w;
        this.check01 = false;
        this.check02 = false;
        this.check03 = false;
        this.check04 = false;
        this.check05 = false;
        if (w == 0) {

            this.check01 = true;
            this.theFunctionKey = 0xA7;
            //console.log('w==0:' + this.theFunctionKey);
        }

        if (w == 1) {
            this.check02 = true;
            this.theFunctionKey = 0xA5;

        }


        if (w == 2) {
            this.check03 = true;

            this.theFunctionKey = 0xA6;
        }


        if (w == 3) {
            this.check04 = true;
            this.theFunctionKey = 0xA8;
        }



        if (w == 4) {
            this.check05 = true;
            this.theFunctionKey = 0xA9;
        }



    }


    clickOnOpen(w) { //快速啟動
        this.finalclick02 = w;
        // this.check01 = false;
        this.check02 = false;
        this.check03 = false;
        this.check04 = false;
        this.check05 = false;
        this.check06 = false;
        // if (w == 0) {

        //     this.check01 = true;

        //     this.keyfunction[this.theFnKey] = "OpenBrowser";

        // }

        if (w == 0) {
            this.check02 = true;
            this.keyfunction[this.theFnKey] = "OpenMyComputer";
        }


        if (w == 1) {
            this.check03 = true;
            this.keyfunction[this.theFnKey] = "OpenSearch";
        }


        if (w == 2) {
            this.check04 = true;
            this.keyfunction[this.theFnKey] = "OpenCalculator";
        }



        if (w == 3) {
            //console.log('op1111');
            this.check05 = true;
            this.keyfunction[this.theFnKey] = "OpenPlayer";
        }

        if (w == 4) {
            this.check06 = true;
            this.keyfunction[this.theFnKey] = "OpenBrowser";
        }

    }

    clickOnLight(w) {//燈校控制
        this.finalclick01 = w;
        this.check01 = false;
        this.check02 = false;
        this.check03 = false;
        this.check04 = false;
        this.check05 = false;
        this.check06 = false;
        this.check07 = false;
        this.check08 = false;
        this.check09 = false;


        if (w == 0) {
            this.check01 = true;
            this.keyfunction[this.theFnKey] = "PreviousEffect";

        }

        if (w == 1) {
            this.check02 = true;
            this.keyfunction[this.theFnKey] = "NextEffect";

        }


        if (w == 2) {
            this.check03 = true;
            this.keyfunction[this.theFnKey] = "Up_Left_Outside";

        }


        if (w == 3) {
            this.check04 = true;
            this.keyfunction[this.theFnKey] = "Down_Right_Inner";
        }



        if (w == 4) {
            this.check05 = true;
            this.keyfunction[this.theFnKey] = "Speedup";
        }

        if (w == 5) {
            this.check06 = true;
            this.keyfunction[this.theFnKey] = "Slowdown";
        }

        if (w == 6) {
            this.check07 = true;
            this.keyfunction[this.theFnKey] = "editEffect";
        }



        if (w == 7) {
            this.check08 = true;
            this.keyfunction[this.theFnKey] = "Open_CloseEffect";
        }

        if (w == 8) {
            this.check09 = true;
            this.keyfunction[this.theFnKey] = "pauseEffect";
        }

    }

    clickOnFeature(w) {
        this.finalclick03 = w;
        this.check01 = false;
        this.check02 = false;
        this.check03 = false;
        this.check04 = false;
        this.check05 = false;
        this.check06 = false;

        if (w == 0) { //标准/游戏模式切换

            this.check01 = true;

            this.keyfunction[this.theFnKey] = "changeMode";

        }

        if (w == 1) {
            this.check02 = true;
            this.keyfunction[this.theFnKey] = "blockWindowsKey";

        }


        if (w == 2) {
            this.check03 = true;
            this.keyfunction[this.theFnKey] = "resetkey";

        }


        // if (w == 3) {
        //     this.check04 = true;
        //     this.keyfunction[this.theFnKey] = "OpenCalculator";
        // }



        if (w == 4) {
            this.check05 = true;
            this.keyfunction[this.theFnKey] = "CtrltoCaps";
        }

        // if (w == 5) {
        //     this.check06 = true;
        //     this.keyfunction[this.theFnKey] = "OpenBrowser";
        // }

    }



    //存入DB動作
    MediaControl() {
        // this.loading=true;
        // setTimeout(() => {
        //     this.loading=false;
        // }, 1000);
        if (this.saveclick == 0) {
            this.saveclick = 1;
            this.loadingbegin(1);
            this.gamemoment = ""
            this.gamemoment = 'stopApmode';
            this.outputGame();
            //建立紅色三角形確認圖示
            let aa = this.array1[this.thisarrayindex] + "_css01"
            //console.log(aa);
            document.getElementById(aa).style.backgroundColor = "transparent";//改色
            document.getElementById(aa).style.backgroundImage = "none";
            setTimeout(() => {
                document.getElementById(aa).style.backgroundImage = "url('./image/hasset.png')";
                document.getElementById(aa).style.backgroundRepeat = "no-repeat"
                document.getElementById(aa).style.backgroundPosition = "bottom left";
            }, 500);
            this.LastarrayindexArr.push(aa);//記住三角形
            this.clearblockKey(this.mutiobj,aa);
            //console.log('this.LastarrayindexArr UPdate');
            //console.log(this.LastarrayindexArr);

            //functinKey決定已經選定在選項時

            //本頁啟動時產生的mutiobj更新內容
            //

            setTimeout(() => {

                this.mutiobj.Light.Mode[this.theFnKey] = 0;
                this.mutiobj.Light.Speed[this.theFnKey] = 0;
                this.mutiobj.Key.keyFunctionArr[this.theFnKey] = 0;
                //
                this.mutiobj.KeyDataValue[this.theFnKey] = this.theFunctionKey;
                this.mutiobj.shelf02 = this.LastarrayindexArr;

                setTimeout(() => {
                    this.db.UpdateProfile(this.mutiobj.id, this.mutiobj).then((doc: any) => {
                        //console.log('update success');
                        //console.log(this.mutiobj.id);
                        setTimeout(() => {
                            this.functionkeysetIn();
                        }, 200);
                    });
                }, 100);

            }, 1000);





            // this.db.getProfile(this.mutiobj).then((see: any) => {
            //     //console.log("afteradd:" + see);
            //     for (let i = 0; i < see.length; i++) { //找profile
            //         //console.log('getPersific:' + see[i].ProfileName + '//id:' + see[i].id + '//keyFunctionArr:');
            //         //console.log(see[i].Light.Speed);
            //         //console.log('getPersific:' + see[i].ProfileName + '//id:' + see[i].id + '//keyFunctionArr:');
            //         //console.log(see[i].Light.Mode);

            //     }
            // });




        }

    }

    lightControl() { //執行燈效控制
        // this.blockthispage = "disabled";
        this.loadingbegin(1);
        this.gamemoment = ""
        this.gamemoment = 'stopApmode';
        this.outputGame();
        // let aa = this.array1[i] + "_css01"
        // document.getElementById(aa).style.backgroundColor = "transparent";//改色
        // document.getElementById(aa).style.backgroundImage = "none";

        // for (let index = 0; index < 16; index++) {
        //     if (this.keyMatrixMap[index].indexOf(this.array1[i]) !== -1) {
        //         let x = index;
        //         let y = this.keyMatrixMap[index].indexOf(this.array1[i]);
        //         this.block = x * 8 + y;
        //         //console.log('thekey:' + this.block);
        //         //console.log('x:' + x + 'y:' + y)
        //         //keymatrix 找 xy
        //     }
        // }

        setTimeout(() => {
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

                setTimeout(() => {
                    data[this.block + 128] = 0;



                    // //console.log('thiskeydata:' + this.KCTarr);




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
                        // "Light": {
                        //     "LightEffect": "",
                        //     "Mode": [],
                        //     "Speed": [],
                        //     "Color": [],
                        //     "Time": "",
                        //     "Into": ""
                        // },
                        this.mutiobj.Key.keyFunctionArr[this.theFnKey] = null;
                        // this.mutiobj.KeyDataValue[this.theFnKey] = null;
                        this.mutiobj.Light.Mode[this.theFnKey] = null;
                        this.mutiobj.Light.Speed[this.theFnKey] = null;
                        // this.mutiobj.shelf02.length = 0;
                        // this.LastarrayindexArr.length = 0;


                        // this.db.UpdateProfile(this.mutiobj.id, this.mutiobj).then((doc: any) => {
                        //console.log('準備完成');

                        setTimeout(() => {
                            if (this.saveclick == 0) {
                                //console.log('light control');
                                this.saveclick = 1;
                                // this.loadingbegin(1);
                                // this.gamemoment = 'stopApmode';
                                // this.outputGame();
                                let aa = this.array1[this.thisarrayindex] + "_css01"
                                //console.log(aa);
                                document.getElementById(aa).style.backgroundColor = "transparent";//改色
                                document.getElementById(aa).style.backgroundImage = "none";
                                setTimeout(() => {
                                    document.getElementById(aa).style.backgroundImage = "url('./image/hasset.png')";
                                    document.getElementById(aa).style.backgroundRepeat = "no-repeat"
                                    document.getElementById(aa).style.backgroundPosition = "bottom left";
                                }, 500);
                                this.LastarrayindexArr.push(aa);//記住三角形
                                this.clearblockKey(this.mutiobj,aa);
                                this.theFunctionKey = 0xB3;



                                // for (let index = 0; index < 256; index++) { //256bit裡面都是0
                                //     obj.Light.Speed[index] = "0";
                                // }
                                //console.log('this.theFnKey:');
                                //console.log(this.theFnKey);

                                if (this.check09 == true) {
                                    //console.log('this.keyfunction[this.theFnKey]:');
                                    //console.log(this.keyfunction[this.theFnKey]);
                                    this.mutiobj.Light.Mode[this.theFnKey] = this.keyfunction[this.theFnKey];
                                    this.mutiobj.shelf02 = this.LastarrayindexArr;
                                }
                                else if (this.check08 == true) {
                                    //console.log('this.keyfunction[this.theFnKey]:');
                                    //console.log(this.keyfunction[this.theFnKey]);
                                    //
                                    this.mutiobj.Light.Mode[this.theFnKey] = 0;
                                    this.mutiobj.Light.Speed[this.theFnKey] = 0;
                                    this.mutiobj.Key.keyFunctionArr[this.theFnKey] = 0;
                                    //
                                    this.mutiobj.Light.Mode[this.theFnKey] = this.keyfunction[this.theFnKey];
                                    this.mutiobj.shelf02 = this.LastarrayindexArr;
                                }
                                else if (this.check01 == true) {
                                    //console.log('this.keyfunction[this.theFnKey]:');
                                    //console.log(this.keyfunction[this.theFnKey]);
                                    //
                                    this.mutiobj.Light.Mode[this.theFnKey] = 0;
                                    this.mutiobj.Light.Speed[this.theFnKey] = 0;
                                    this.mutiobj.Key.keyFunctionArr[this.theFnKey] = 0;
                                    //
                                    this.mutiobj.Light.Mode[this.theFnKey] = this.keyfunction[this.theFnKey];
                                    this.mutiobj.shelf02 = this.LastarrayindexArr;
                                }
                                else if (this.check02 == true) {
                                    //console.log('this.keyfunction[this.theFnKey]:');
                                    //console.log(this.keyfunction[this.theFnKey]);
                                    //
                                    this.mutiobj.Light.Mode[this.theFnKey] = 0;
                                    this.mutiobj.Light.Speed[this.theFnKey] = 0;
                                    this.mutiobj.Key.keyFunctionArr[this.theFnKey] = 0;
                                    //
                                    this.mutiobj.Light.Mode[this.theFnKey] = this.keyfunction[this.theFnKey];
                                    this.mutiobj.shelf02 = this.LastarrayindexArr;
                                }
                                else if (this.check03 == true) {
                                    //console.log('this.keyfunction[this.theFnKey]:');
                                    //console.log(this.keyfunction[this.theFnKey]);
                                    //
                                    this.mutiobj.Light.Mode[this.theFnKey] = 0;
                                    this.mutiobj.Light.Speed[this.theFnKey] = 0;
                                    this.mutiobj.Key.keyFunctionArr[this.theFnKey] = 0;
                                    //
                                    this.mutiobj.Light.Mode[this.theFnKey] = this.keyfunction[this.theFnKey];
                                    this.mutiobj.shelf02 = this.LastarrayindexArr;
                                }
                                else if (this.check04 == true) {
                                    //console.log('this.keyfunction[this.theFnKey]:');
                                    //console.log(this.keyfunction[this.theFnKey]);
                                    //
                                    this.mutiobj.Light.Mode[this.theFnKey] = 0;
                                    this.mutiobj.Light.Speed[this.theFnKey] = 0;
                                    this.mutiobj.Key.keyFunctionArr[this.theFnKey] = 0;
                                    //
                                    this.mutiobj.Light.Mode[this.theFnKey] = this.keyfunction[this.theFnKey];
                                    this.mutiobj.shelf02 = this.LastarrayindexArr;
                                }
                                else {
                                    //console.log('this.keyfunction[this.theFnKey]:');
                                    //console.log(this.keyfunction[this.theFnKey]);
                                    //
                                    this.mutiobj.Light.Mode[this.theFnKey] = 0;
                                    this.mutiobj.Light.Speed[this.theFnKey] = 0;
                                    this.mutiobj.Key.keyFunctionArr[this.theFnKey] = 0;
                                    //
                                    this.mutiobj.Light.Speed[this.theFnKey] = this.keyfunction[this.theFnKey];
                                    this.mutiobj.shelf02 = this.LastarrayindexArr;
                                }
                                //console.log('after:');
                                //console.log(this.mutiobj);
                                // this.db.AddProfile(obj).then((doc: any) => {
                                //     this.db.getAllProfile().then((doc: any) => {
                                //         //console.log('speedup:' + JSON.stringify(doc));

                                //     })

                                // });
                                // let getItem = {
                                //     "ProfileName": "profile 1",
                                // }
                                //1
                                // this.db.AddProfile(obj).then((doc: any) => {
                                //     this.db.getAllProfile().then((doc: any) => {
                                //         //console.log('speedup:' + JSON.stringify(doc));

                                //     })

                                // });


                                //2 add和update的判斷
                                setTimeout(() => {
                                    this.db.UpdateProfile(this.mutiobj.id, this.mutiobj).then((doc: any) => {
                                        //console.log('update success');
                                        //console.log(this.mutiobj.id);
                                        setTimeout(() => {
                                            this.functionkeysetIn();
                                        }, 200);
                                    });
                                }, 100);



                                // this.db.getProfile(this.mutiobj).then((see: any) => {
                                //     //console.log("afteradd:" + see);
                                //     for (let i = 0; i < see.length; i++) { //找profile
                                //         //console.log('getPersific:' + see[i].ProfileName + '//id:' + see[i].id + '//keyFunctionArr:');
                                //         //console.log(see[i].Light.Speed);
                                //         //console.log('getPersific:' + see[i].ProfileName + '//id:' + see[i].id + '//keyFunctionArr:');
                                //         //console.log(see[i].Light.Mode);

                                //     }
                                // });




                            }
                        }, 1000);

                        // });

                    });

                }, 20);

                // data[this.theFnKey] = this.KCTarr[this.theFnKey];


            });

        }, 200);




    }



    launchTest() { //執行快速啟動
        this.loadingbegin(1);
        this.gamemoment = ""
        this.gamemoment = 'stopApmode';
        this.outputGame();
        // let aa = this.array1[i] + "_css01"
        // document.getElementById(aa).style.backgroundColor = "transparent";//改色
        // document.getElementById(aa).style.backgroundImage = "none";

        // for (let index = 0; index < 16; index++) {
        //     if (this.keyMatrixMap[index].indexOf(this.array1[i]) !== -1) {
        //         let x = index;
        //         let y = this.keyMatrixMap[index].indexOf(this.array1[i]);
        //         this.block = x * 8 + y;
        //         //console.log('thekey:' + this.block);
        //         //console.log('x:' + x + 'y:' + y)
        //         //keymatrix 找 xy
        //     }
        // }
        setTimeout(() => {
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

                setTimeout(() => {

                    // data[this.theFnKey] = this.KCTarr[this.theFnKey];
                    data[this.block + 128] = 0;



                    // //console.log('thiskeydata:' + this.KCTarr);




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
                        // "Light": {
                        //     "LightEffect": "",
                        //     "Mode": [],
                        //     "Speed": [],
                        //     "Color": [],
                        //     "Time": "",
                        //     "Into": ""
                        // },
                        this.mutiobj.Key.keyFunctionArr[this.theFnKey] = null;
                        // this.mutiobj.KeyDataValue[this.theFnKey] = null;
                        this.mutiobj.Light.Mode[this.theFnKey] = null;
                        this.mutiobj.Light.Speed[this.theFnKey] = null;
                        // this.mutiobj.shelf02.length = 0;
                        // this.LastarrayindexArr.length = 0;


                        // this.db.UpdateProfile(this.mutiobj.id, this.mutiobj).then((doc: any) => {
                        //console.log('準備完成');

                        setTimeout(() => {
                            if (this.saveclick == 0) {
                                this.saveclick = 1;
                                this.loadingbegin(1);
                                // this.gamemoment = 'stopApmode';
                                // this.outputGame();
                                let aa = this.array1[this.thisarrayindex] + "_css01"
                                //console.log(aa);
                                document.getElementById(aa).style.backgroundColor = "transparent";//改色
                                document.getElementById(aa).style.backgroundImage = "none";
                                setTimeout(() => {
                                    document.getElementById(aa).style.backgroundImage = "url('./image/hasset.png')";
                                    document.getElementById(aa).style.backgroundRepeat = "no-repeat"
                                    document.getElementById(aa).style.backgroundPosition = "bottom left";
                                }, 500);
                                this.LastarrayindexArr.push(aa);//記住三角形
                                this.clearblockKey(this.mutiobj,aa);
                                this.theFunctionKey = 0xB3;
                                // //console.log('yes')


                                // //console.log(this.icpEventService.keypositionX);
                                // //console.log(this.icpEventService.keypositionX);



                                // obj.Key.keyFunctionArr[10]=this.keyfunction[this.myKey];
                                // for (let index = 0; index < 256; index++) { //256bit裡面都是0
                                //     obj.Key.keyFunctionArr[index] = 0;

                                // }
                                // //console.log(obj.Key.keyFunctionArr);
                                this.mutiobj.Light.Mode[this.theFnKey] = 0;
                                this.mutiobj.Light.Speed[this.theFnKey] = 0;
                                this.mutiobj.Key.keyFunctionArr[this.theFnKey] = this.keyfunction[this.theFnKey];
                                this.mutiobj.shelf02 = this.LastarrayindexArr;
                                //console.log('keyfunction:' + this.keyfunction);
                                //console.log('keyfunction:' + this.theFnKey);
                                //console.log('obj.Key.keyFunctionArr' + this.mutiobj.Key.keyFunctionArr);

                                // this.db.AddProfile(obj).then((doc: any) => {
                                //     this.db.getAllProfile().then((doc: any) => {
                                //         //console.log('testest: ' + JSON.stringify(doc));

                                //     })

                                // })



                                // //console.log('no match');
                                setTimeout(() => {
                                    this.db.UpdateProfile(this.mutiobj.id, this.mutiobj).then((doc: any) => {
                                        //console.log('update success');
                                        setTimeout(() => {
                                            this.functionkeysetIn()
                                        }, 200);

                                    });
                                }, 100);


                                // let getItem = {
                                //     "ProfileName": "profile 1",
                                // }

                                // this.db.getProfile(getItem).then((see: any) => {
                                //     //console.log("afteradd:" + see);
                                //     for (let i = 0; i < see.length; i++) { //找profile
                                //         //console.log('getPersific:' + see[i].ProfileName + '//id:' + see[i].id)

                                //     }
                                // });




                            }
                        }, 1000);
                    });
                }, 20);
            });

        }, 200);


        // });
    }


    specialfunc() {
        this.loadingbegin(1);
        this.gamemoment = ""
        this.gamemoment = 'stopApmode';
        this.outputGame();
        // let aa = this.array1[i] + "_css01"
        // document.getElementById(aa).style.backgroundColor = "transparent";//改色
        // document.getElementById(aa).style.backgroundImage = "none";

        // for (let index = 0; index < 16; index++) {
        //     if (this.keyMatrixMap[index].indexOf(this.array1[i]) !== -1) {
        //         let x = index;
        //         let y = this.keyMatrixMap[index].indexOf(this.array1[i]);
        //         this.block = x * 8 + y;
        //         //console.log('thekey:' + this.block);
        //         //console.log('x:' + x + 'y:' + y)
        //         //keymatrix 找 xy
        //     }
        // }
        setTimeout(() => {
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



                // data[this.theFnKey] = this.KCTarr[this.theFnKey];
                data[this.block + 128] = 0;



                // //console.log('thiskeydata:' + this.KCTarr);




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
                    // "Light": {
                    //     "LightEffect": "",
                    //     "Mode": [],
                    //     "Speed": [],
                    //     "Color": [],
                    //     "Time": "",
                    //     "Into": ""
                    // },
                    this.mutiobj.Key.keyFunctionArr[this.theFnKey] = null;
                    // this.mutiobj.KeyDataValue[this.theFnKey] = null;
                    this.mutiobj.Light.Mode[this.theFnKey] = null;
                    this.mutiobj.Light.Speed[this.theFnKey] = null;
                    // this.mutiobj.shelf02.length = 0;
                    // this.LastarrayindexArr.length = 0;


                    // this.db.UpdateProfile(this.mutiobj.id, this.mutiobj).then((doc: any) => {
                    //console.log('準備完成');
                    // this.loading=true;
                    // setTimeout(() => {
                    //     this.loading=false;
                    // }, 1000);
                    setTimeout(() => {
                        if (this.saveclick == 0) {
                            this.saveclick = 1;
                            this.loadingbegin(1);
                            // this.gamemoment = 'stopApmode';
                            // this.outputGame();
                            let aa = this.array1[this.thisarrayindex] + "_css01"
                            //console.log(aa);
                            document.getElementById(aa).style.backgroundColor = "transparent";//改色
                            document.getElementById(aa).style.backgroundImage = "none";
                            setTimeout(() => {
                                document.getElementById(aa).style.backgroundImage = "url('./image/hasset.png')";
                                document.getElementById(aa).style.backgroundRepeat = "no-repeat"
                                document.getElementById(aa).style.backgroundPosition = "bottom left";
                            }, 500);

                            this.LastarrayindexArr.push(aa);//記住三角形
                            this.clearblockKey(this.mutiobj,aa);
                            this.theFunctionKey = 0xB3;
                            // //console.log('yes')


                            // //console.log(this.icpEventService.keypositionX);
                            // //console.log(this.icpEventService.keypositionX);


                            // obj.Key.keyFunctionArr[10]=this.keyfunction[this.myKey];
                            // for (let index = 0; index < 256; index++) { //256bit裡面都是0
                            //     obj.Key.keyFunctionArr[index] = 0;

                            // }
                            // //console.log(obj.Key.keyFunctionArr);
                            this.mutiobj.Light.Mode[this.theFnKey] = 0;
                            this.mutiobj.Light.Speed[this.theFnKey] = 0;
                            this.mutiobj.Key.keyFunctionArr[this.theFnKey] = this.keyfunction[this.theFnKey];
                            this.mutiobj.shelf02 = this.LastarrayindexArr;
                            //console.log('keyfunction:' + this.keyfunction);
                            //console.log('keyfunction:' + this.theFnKey);
                            //console.log(this.mutiobj.Key.keyFunctionArr);

                            // this.db.AddProfile(obj).then((doc: any) => {
                            //     this.db.getAllProfile().then((doc: any) => {
                            //         //console.log('testest: ' + JSON.stringify(doc));

                            //     })

                            // })



                            // //console.log('no match');
                            // let id = "2"
                            setTimeout(() => {
                                this.db.UpdateProfile(this.mutiobj.id, this.mutiobj).then((doc: any) => {
                                    //console.log('update success');
                                    setTimeout(() => {
                                        this.functionkeysetIn()
                                    }, 200);

                                });
                            }, 100);


                            // let getItem = {
                            //     "ProfileName": "profile 1",
                            // }

                            // this.db.getProfile(getItem).then((see: any) => {
                            //     //console.log("afteradd:" + see);
                            //     for (let i = 0; i < see.length; i++) { //找profile
                            //         //console.log('getPersific:' + see[i].ProfileName + '//id:' + see[i].id)

                            //     }
                            // });



                        }
                    }, 1000);
                });

            });

        }, 200);


        // });
    }






    clickOnpage(w) {
        this.check01 = false;
        this.check02 = false;
        this.check03 = false;
        this.check04 = false;
        this.check05 = false;
        this.check06 = false;
        this.check07 = false;
        this.check08 = false;
        //console.log('page1111111');
        //    if (this.mutiobj.Key.options.OPshelf02[0] !== undefined) {
        //     //console.log('readdbMacr222');

        //     this.clickOnMedia(this.mutiobj.Key.options.OPshelf02[0]);
        // }

        // if (this.mutiobj.Key.options.OPshelf02[1] !== undefined) {
        //     //console.log('readdbMacr4444');

        //     this.clickOnLight(this.mutiobj.Key.options.OPshelf02[1]);
        // }


        // if (this.mutiobj.Key.options.OPshelf02[2] !== undefined) {
        //     //console.log('readdbMacr333');

        //     this.clickOnOpen(this.mutiobj.Key.options.OPshelf02[2]);

        // }




        // if (this.mutiobj.Key.options.OPshelf02[3] !== undefined) {
        //     //console.log('readdbMacr555');

        //     this.clickOnFeature(this.mutiobj.Key.options.OPshelf02[3]);
        // }

        document.getElementById('fnbox').style.display = "none";
        this.fnbtn = false;
        this.fncontent01 = false;
        this.fncontent02 = false;
        this.fncontent03 = false;
        this.fncontent04 = false;
        this.fncontent05 = false;

        if (w === 0) {
            //
            if (this.mutiobj.Key.options.OPshelf02[0] !== undefined) {
                //console.log('readdbMacr222');

                this.clickOnMedia(this.mutiobj.Key.options.OPshelf02[0]);

                //避免沒有點選動作
                let contentarr = [0xA7, 0xA5, 0xA6, 0xA8, 0xA9];
                this.keyfunction[this.theFnKey] = contentarr[this.mutiobj.Key.options.OPshelf02[0]];

            }

            //
            this.etitle = "多媒体"
            //console.log(this.etitle);
            this.fncontent01 = true;
            this.fncontent02 = false;
            this.fncontent03 = false;
            this.fncontent04 = false;
            this.fncontent05 = false;

        }

        if (w === 1) {
            //
            if (this.mutiobj.Key.options.OPshelf02[1] !== undefined) {
                //console.log('readdbMacr4444111');

                this.clickOnLight(this.mutiobj.Key.options.OPshelf02[1]);
                //console.log('this.mutiobj.Key.options.OPshelf02[1]');
                //console.log(this.mutiobj.Key.options.OPshelf02[1]);

                //避免沒有點選動作
                let contentarr = ["PreviousEffect", "NextEffect", "Up_Left_Outside", "Down_Right_Inner", "Speedup", "Slowdown", "editEffect", "Open_CloseEffect", "pauseEffect"];
                this.keyfunction[this.theFnKey] = contentarr[this.mutiobj.Key.options.OPshelf02[1]];
            }

            //
            this.etitle = "灯效控制"
            this.fncontent01 = false;
            this.fncontent02 = true;
            this.fncontent03 = false;
            this.fncontent04 = false;
            this.fncontent05 = false;
        }
        if (w === 2) {
            //
            if (this.mutiobj.Key.options.OPshelf02[2] !== undefined) {
                //console.log('readdbMacr333');

                this.clickOnOpen(this.mutiobj.Key.options.OPshelf02[2]);
                //避免沒有點選動作
                let contentarr = ["OpenMyComputer", "OpenSearch", "OpenCalculator", "OpenPlayer", "OpenBrowser"];
                this.keyfunction[this.theFnKey] = contentarr[this.mutiobj.Key.options.OPshelf02[2]];


            }
            //

            this.etitle = "快速启动"
            this.fncontent01 = false;
            this.fncontent02 = false;
            this.fncontent03 = true;
            this.fncontent04 = false;
            this.fncontent05 = false;

        }

        if (w === 3) {
            this.etitle = "切换配置文件"
            this.fncontent01 = false;
            this.fncontent02 = false;
            this.fncontent03 = false;
            this.fncontent04 = true;
            this.fncontent05 = false;

        }
        if (w === 4) {

            //
            if (this.mutiobj.Key.options.OPshelf02[3] !== undefined) {
                //console.log('readdbMacr555');

                this.clickOnFeature(this.mutiobj.Key.options.OPshelf02[3]);
                //避免沒有點選動作
                let contentarr = ["changeMode", "blockWindowsKey", "resetkey", "CtrltoCaps"];
                this.keyfunction[this.theFnKey] = contentarr[this.mutiobj.Key.options.OPshelf02[3]];
            }

            //
            this.etitle = "特色功能"
            this.fncontent01 = false;
            this.fncontent02 = false;
            this.fncontent03 = false;
            this.fncontent04 = false;
            this.fncontent05 = true;
        }
        else {

            return false;
        }


    }

    callSelfdf(r) {
        //每次點選fn組合都回到第一頁 
        this.clickOnpage(0);
        // if (this.mutiobj.Key.options.OPshelf02[0] !== undefined) {
        //     //console.log('readdbMacr222');

        //     this.clickOnMedia(this.mutiobj.Key.options.OPshelf02[0]);
        // }

        this.thisarrayindex = r;

        this.keyMatrixMap[0] = ['pause', 'stop', 'play/pause', 'next', 'rctrl', 'previous', 'lctrl', 'f5'];
        this.keyMatrixMap[1] = ['q', 'tab', 'a', 'esc', 'z', 'k150', 'perid', 'n1'];
        this.keyMatrixMap[2] = ['w', 'caps', 's', 'k45', 'x', 'k132', 'f1', 'n2'];
        this.keyMatrixMap[3] = ['e', 'f3', 'd', 'f4', 'c', 'k151', 'f2', 'n3'];
        this.keyMatrixMap[4] = ['r', 't', 'f', 'g', 'v', 'b', 'n5', 'n4'];
        this.keyMatrixMap[5] = ['u', 'y', 'j', 'h', 'm', 'n', 'n6', 'n7'];
        this.keyMatrixMap[6] = ['i', 'lqu', 'k', 'f6', 'comma', 'k56', 'plus', 'n8'];
        this.keyMatrixMap[7] = ['o', 'f7', 'l', 'k14', 'dot', 'book', 'f8', 'n9'];
        this.keyMatrixMap[8] = ['p', 'rqu', 'sem', 'quo', 'k42', 'qmark', 'minus', 'n0'];
        this.keyMatrixMap[9] = ['scroll', 'media select', 'v-', 'lalt', 'v+', 'ralt', 'mute', 'print'];
        this.keyMatrixMap[10] = ['none', 'bsp', 'drawn', 'f11', 'enter', 'f12', 'f9', 'f10'];
        this.keyMatrixMap[11] = ['num7', 'num4', 'num1', 'space', 'numlock', 'down', 'delete', 'imc'];
        this.keyMatrixMap[12] = ['num8', 'num5', 'num2', 'num0', 'numdrawn', 'right', 'insert', 'g mode'];
        this.keyMatrixMap[13] = ['num9', 'num6', 'num3', 'numdot', 'numtimes', 'numminus', 'pup', 'pdown'];
        this.keyMatrixMap[14] = ['numplus', '巴葡', 'numenter', 'up', 'none', 'left', 'home', 'end'];
        this.keyMatrixMap[15] = ['none', 'lshift', 'rshift', 'k131', 'win', 'fn', 'k133', 'none'];
        //delete
        //drawn
        //book
        //rctrl


        this.selfdf = 'block';
        let t = this.firstarr[r];

        this.pickFnKey = t.toUpperCase();

        for (let i = 0; i < 16; i++) {
            if (this.keyMatrixMap[i].indexOf(t) !== -1) {
                let x = i;
                let y = this.keyMatrixMap[i].indexOf(t);
                this.theFnKey = x * 8 + y + 128;
                //console.log('theFnkey:' + this.theFnKey);
                //console.log('x:' + x + 'y:' + y)

            }
        }


    };

    // seefunctionkey() {
    //     //console.log('seekey:' + this.theFunctionKey);
    // }


    setIntoDB() {
        //console.log('setIntoDB1111')

        //functinKey決定已經選定在選項時

        //本頁啟動時產生的mutiobj更新內容

        //console.log(this.mutiobj);
        this.mutiobj.Key.options.OPshelf02[0] = this.finalclick00;
        this.mutiobj.Key.options.OPshelf02[1] = this.finalclick01;
        this.mutiobj.Key.options.OPshelf02[2] = this.finalclick02;
        this.mutiobj.Key.options.OPshelf02[3] = this.finalclick03;


        this.db.UpdateProfile(this.mutiobj.id, this.mutiobj).then((doc: any) => {
            //console.log('setIntoDB success');
            //console.log(this.mutiobj);

            setTimeout(() => {
                this.gamemoment = 'startApmode';
                this.outputGame()
                this.saveclick = 0;
                this.loadingbegin(0);
            }, 5000);

        });
    }




    functionkeysetIn() {
        // this.loading=true;
        // setTimeout(() => {
        //     this.loading=false;
        // }, 1000);




        let data = {
            profile: this.changeprofile

        }

        let obj1 = {
            Type: funcVar.FuncType.Device,
            Func: funcVar.FuncName.GetKeyMatrix,
            Param: data

        }
        this.protocol.RunSetFunction(obj1).then((data) => {


            //reset Keycodetable
            setTimeout(() => {
                //set new key
                let thefinalkey = this.theFnKey;
                data[thefinalkey] = this.theFunctionKey;
                //console.log('mykey' + thefinalkey);
                //console.log('setfunctionKey' + this.theFunctionKey);

                let obj3 = {
                    'ProfileName': this.ProfileDetail.ProfileName
                }


                this.db.getProfile(obj3).then((doc: any) => {
                    doc[0].KeyDataValue = data;
                    // console.log('儲存');
                    // console.log(doc[0].KeyDataValue);

                    // console.log(doc[0]);


                    setTimeout(() => {
                        this.db.UpdateProfile(doc[0].id, doc[0]).then((see: any) => {
                            // console.log('upadate read222讀取完成')

                            console.log(doc[0].id);
                            console.log(doc[0]);
                            console.log(see);

                        })
                    }, 5000);

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
                    //console.log('setMatrix ended setfunctionkey');

                    //console.log('mykey' + thefinalkey);
                    //console.log('setfunctionKey' + this.theFunctionKey);
                    this.setIntoDB();



                })

            }, 200);


            // //console.log("Container RunSetFunction:" + data);


        })

    }


    keyhasBeenSet(key) {
        //console.log(key);
        let X = Math.floor(key / 8);
        let Y = key % 8;

        //console.log('findthis:' + this.keyMatrixMap[X][Y])

        let aa = this.keyMatrixMap[X][Y] + "_css01";
        document.getElementById(aa).style.backgroundColor = "transparent";//改色
        document.getElementById(aa).style.backgroundImage = "none";
        setTimeout(() => {
            document.getElementById(aa).style.backgroundImage = "url('./image/hasset.png')";
            document.getElementById(aa).style.backgroundRepeat = "no-repeat"
            document.getElementById(aa).style.backgroundPosition = "bottom left";
        }, 500);

    }


    clearblockKey(obj,keyID){
        for (let resetindex = 0; resetindex < obj.shelfblock02.length; resetindex++) {
            if (obj.shelfblock02[resetindex] == keyID) {
                obj.shelfblock02[resetindex] = null;

            }
        }
    }
}