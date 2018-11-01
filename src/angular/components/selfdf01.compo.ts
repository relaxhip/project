declare var System;
import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { protocolService } from '../services/service/protocol.service';
import { Subscription } from "rxjs/Subscription";

let evtVar = System._nodeRequire('./backend/others/eventVariable');
let funcVar = System._nodeRequire('./backend/others/FunctionVariable');
let env = System._nodeRequire('./backend/others/env');
const { ipcRenderer } = System._nodeRequire('electron');
declare var $: any;
import { ElectronEventService, dbService, EmitService } from '../services/libs/electron/index';
@Component({
    selector: 'self01-app',
    templateUrl: './components/selfdf01.compo.html',
    //template: '<h1>我的第一个 Angular 应用</h1>',
    styleUrls: ['./css/first.css', './css/kbd.css', './css/kbd_selfdf.css'],
    providers: [protocolService, dbService],
    inputs: ['ProfileDetail']
})



export class Selfdf01Component implements OnInit {
    constructor(private protocol: protocolService, private db: dbService, private emitService: EmitService) {
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
        //console.log('自定义 loading complete');
        // this.readDB();


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
        //drawn
        //book
        //rctrl
    }
    @Output() outputGameEvent: EventEmitter<any> = new EventEmitter();
    @Output() openFrtp: EventEmitter<any> = new EventEmitter();
    @Output() resetEvent: EventEmitter<any> = new EventEmitter();
    resetsave: boolean = true;
    subscription: Subscription;
    fromicp: any;
    attbtn: boolean;
    changeprofile: any = "2";
    shelf01block: any;
    firstOpencallself: boolean = false;
    blockthispage: any;
    newKBarr: any = ["esc", "f1", "f2", "f3", "f4", "f5", "f6", "f7", "f8", "f9", "f10", "f11", "f12", "PRINT", "SCROLL", "PAUSE", "`~", "1!", "2@", "3#", "4$", "5%", "6^", "7&", "8*", "9(", "0)", "-_", "=+", "BACK SPACE", "INSERT", "HOME", "PAGE UP", "NUM LOCK", "NUM/", "NUM*", "NUM-", "TAB", "Q", "W", "E", "R", "T", "Y", "U", "I", "O", "P", "[{", "]}", "\\|", "DELETE", "END", "PAGE DOWN", "NUM7", "NUM8", "NUM9", "NUM+", "CAPS", "A", "S", "D", "F", "G", "H", "J", "K", "L", ";:", "\"'", "ENTER", "NUM4", "NUM5", "NUM6", "SHIFT", "Z", "X", "C", "V", "B", "N", "M", ",<", ".>", "/?", "SHIFT", "↑", "NUM1", "NUM2", "NUM3", "NUM ENTER", "CTRL", "WINDOWS", "ALT", "SPACE", "ALT", "Fn", "APP", "CTRL", "←", "↓", "→", "NUM0", "NUM."];
    array1: any = ["esc", "f1", "f2", "f3", "f4", "f5", "f6", "f7", "f8", "f9", "f10", "f11", "f12", "print", "scroll", "pause", "perid", "n1", "n2", "n3", "n4", "n5", "n6", "n7", "n8", "n9", "n0", "minus", "plus", "bsp", "insert", "home", "pup", "numlock", "numdrawn", "numtimes", "numminus", "tab", "q", "w", "e", "r", "t", "y", "u", "i", "o", "p", "lqu", "rqu", "drawn", "delete", "end", "pdown", "num7", "num8", "num9", "numplus", "caps", "a", "s", "d", "f", "g", "h", "j", "k", "l", "sem", "quo", "enter", "num4", "num5", "num6", "lshift", "z", "x", "c", "v", "b", "n", "m", "comma", "dot", "qmark", "rshift", "up", "num1", "num2", "num3", "numenter", "lctrl", "win", "lalt", "space", "ralt", "fn", "book", "rctrl", "left", "down", "right", "num0", "numdot"];
    KCTarr: any = [72, 165, 167, 168, 228, 166, 224, 62, 20, 43, 4, 41, 29, 145, 53, 30, 26, 57, 22, 100, 27, 138, 58, 31, 8, 60, 7, 61, 6, 144, 59, 32, 21, 23, 9, 10, 25, 5, 34, 33, 24, 28, 13, 11, 16, 17, 35, 36, 12, 48, 14, 63, 54, 135, 46, 37, 18, 64, 15, 137, 55, 101, 65, 38, 19, 47, 51, 52, 50, 56, 45, 39, 71, 0, 170, 226, 171, 230, 0, 70, 0, 42, 49, 68, 40, 69, 66, 67, 95, 92, 89, 44, 83, 81, 76, 179, 96, 93, 90, 98, 84, 79, 73, 176, 97, 94, 91, 99, 85, 86, 75, 78, 87, 133, 88, 82, 103, 80, 74, 77, 231, 225, 229, 139, 227, 172, 136, 0, 72, 165, 167, 168, 228, 166, 224, 62, 20, 43, 4, 0, 29, 145, 53, 30, 26, 57, 22, 100, 27, 138, 58, 31, 8, 60, 7, 61, 6, 144, 59, 32, 21, 23, 9, 10, 25, 5, 34, 33, 24, 28, 13, 11, 16, 17, 35, 36, 12, 48, 14, 63, 54, 135, 46, 37, 18, 64, 15, 137, 55, 101, 65, 38, 19, 47, 51, 52, 50, 56, 45, 39, 219, 0, 170, 226, 171, 230, 0, 216, 0, 42, 49, 68, 240, 176, 66, 67, 95, 92, 89, 44, 83, 81, 217, 179, 96, 93, 90, 98, 84, 79, 218, 176, 97, 94, 91, 99, 85, 86, 223, 222, 87, 133, 88, 82, 103, 80, 220, 221, 0, 225, 229, 139, 177, 172, 136, 0];
    gamemoment: any;
    keyMatrixMap: any = [];
    loading: boolean = false;
    side01: boolean = false;
    side02: boolean = false;
    side03: boolean = false;
    side04: boolean = false;
    side05: boolean = false;
    side06: boolean = false;
    side07: boolean = false;
    block: number;
    ProfileDetail: any = '游戏模式';
    chng: any;
    cur: any;
    prev: any;
    mutiobj: any = {};
    LastarrayindexArr: any = []; //所有已設定的按鍵
    savechange: number = 0;
    currentV: any;
    changeV: any;


    detectButton() {
        let obj3 = {
            Type: funcVar.FuncType.Device,
            Func: funcVar.FuncName.GetProfieAndFirmwareVer,
            Param: ""
        }
        this.protocol.RunSetFunction(obj3).then((data) => {
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

    getGameoptions(e) {
        //console.log('getGame1111');
        //console.log(e);
        this.gamemoment = e;
        this.outputGame();
    }

    resetEventfun() {
        this.resetEvent.emit('resetUI');
    }

    resetside01page(event) {
        //console.log('resetside01page');
        this.loading = true;
        this.side01 = false;
        setTimeout(() => {
            this.side01 = true;
            this.loading = false;
        }, 300);
    }

    outputGame() {

        this.outputGameEvent.emit(this.gamemoment);

    }

    readDB() {
        //console.log('read1111');
        //console.log(this.cur);

        if (this.cur !== undefined) {
            let obj = {
                "ProfileName": this.cur.ProfileName
            }

            if (this.cur.ProfileName == '游戏模式') {
                this.changeprofile = '2';
            } else {
                this.changeprofile = '1';
            }

            this.db.getProfile(obj).then((see: any) => {
                //console.log('profileread111')
                this.mutiobj = see[0];
                //console.log('testread');
                //console.log(this.mutiobj);
                // 畫面上給有設定的鍵加入紅色三角形

                for (let i = 0; i < this.mutiobj.shelf01.length; i++) {
                    //console.log('clean333');
                    if (this.mutiobj.shelf01[i] !== null && this.mutiobj.shelf01[i] !== undefined && this.mutiobj.shelf01[i] !== "") {
                        this.LastarrayindexArr[i] = this.mutiobj.shelf01[i]; //所有已設定的按鍵
                        document.getElementById(this.LastarrayindexArr[i]).style.backgroundImage = "url('./image/hasset.png')";
                        document.getElementById(this.LastarrayindexArr[i]).style.backgroundRepeat = "no-repeat";
                        document.getElementById(this.LastarrayindexArr[i]).style.backgroundPosition = "bottom left";
                    }
                }

                for (let i = 0; i < this.mutiobj.shelfblock01.length; i++) {
                    if (this.mutiobj.shelfblock01[i] !== null && this.mutiobj.shelfblock01[i] !== undefined && this.mutiobj.shelfblock01[i] !== "") {
                        let tt = this.mutiobj.shelfblock01[i]
                        document.getElementById(tt).style.backgroundColor = "transparent";//改色
                        document.getElementById(tt).style.backgroundImage = "none";



                        let aa = this.mutiobj.shelfblock01[i];
                        document.getElementById(aa).style.backgroundColor = "#2C2C2C";//改色
                        document.getElementById(aa).style.opacity = "0.7";
                    }


                }


                //讀入
            })


        }
        // else{
        //     //console.log('un2222');
        //     //console.log(this.ProfileDetail);

        //     let obj = {
        //         "ProfileName": this.ProfileDetail.ProfileName
        //     }
        //     this.db.getProfile(obj).then((see: any) => {
        //         //console.log('profileread2222')
        //         this.mutiobj = see[0];
        //         //console.log('testread2222');
        //         //console.log(this.mutiobj);
        //         // 畫面上給有設定的鍵加入紅色三角形

        //         for (let i = 0; i < this.mutiobj.shelf01.length; i++) {
        //             //console.log('clean333');
        //             this.LastarrayindexArr[i] = this.mutiobj.shelf01[i]; //所有已設定的按鍵
        //             document.getElementById(this.LastarrayindexArr[i]).style.backgroundImage = "url('./image/hasset.png')";
        //             document.getElementById(this.LastarrayindexArr[i]).style.backgroundRepeat = "no-repeat";
        //         }


        //         //讀入
        //     })
        // }
        // let obj = {
        //     "ProfileName": this.cur.ProfileName
        // }
        // this.db.getProfile(obj).then((see: any) => {

        //     //console.log('profile content' + see);
        //     for (let index = 0; index < see.length; index++) {
        //         //console.log(see[index]);
        //         // //console.log(see[index].Light);
        //         this.mutiobj = see[index];
        //     }
        //     //console.log('test');
        //     //console.log(this.mutiobj);

        //     //畫面上給有設定的鍵加入紅色三角形

        //     for (let i = 0; i < this.mutiobj.shelf02.length; i++) {

        //         this.LastarrayindexArr[i] = this.mutiobj.shelf02[i]; //所有已設定的按鍵
        //         document.getElementById(this.LastarrayindexArr[i]).style.backgroundImage = "url('./image/hasset.png')";
        //     }

        // })
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
    // @Input() lightBS;
    ngOnInit() {
        this.readDB();
        //左側選項列顯示side01
        this.onClick(0);
        setTimeout(() => {
            document.getElementById("fn_css01").classList.add("disabled");
        }, 50);
        // setTimeout(() => {
        // this.detectButton();
        // }, 50);

        // if (this.lightBS == 0) {
        // 	//console.log("from parent LBS 0 attRight", this.lightBS);
        // 	this.attbtn = true;
        // }
        // else if (this.lightBS == 1) {
        // 	//console.log("from parent LBS 1 attLeft", this.lightBS)
        // 	this.attbtn = false;
        // }

        // document.getElementById("myDIV").removeEventListener("mousemove"
    }



    ngOnChanges(changes: any) {

        for (let propName in changes) {

            this.chng = changes[propName];
            this.cur = this.chng.currentValue;
            this.prev = this.chng.previousValue;
        }

        //console.log('change1111');
        //console.log(this.cur);
        // for (let index = 0; index < this.array1.length; index++) {
        //     //console.log('clean222');
        //     // //console.log(this.array1[index] + "_2_css01");
        //     // document.getElementById(this.array1[index] + "_css01").style.backgroundImage = "none";
        //     // document.getElementById(this.array1[index] + "_css01").style.backgroundColor = "transparent";//改色
        //     //console.log(this.array1[index] + "_css01");
        // }

        this.readDB();
    }



    resetThiskey(i) {
        this.blockthispage = "disabled";
        this.loadingbegin(1);

        setTimeout(() => {
            this.gamemoment = "";
            this.gamemoment = 'stopApmode';
            this.outputGame();

            let aa = this.array1[i] + "_css01"
            document.getElementById(aa).style.backgroundColor = "transparent";//改色

            document.getElementById(aa).style.backgroundImage = "none";

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



                data[this.block] = this.KCTarr[this.block];



                //console.log('thiskeydata:' + this.KCTarr);




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


                    //console.log('resetsetlast')
                    //console.log(this.mutiobj)
                    for (let resetindex = 0; resetindex < this.mutiobj.shelf01.length; resetindex++) {
                        if (this.mutiobj.shelf01[resetindex] == aa) {
                            this.mutiobj.shelf01[resetindex] = null

                        }

                    }

                    //console.log('resetsetlast after save')
                    //console.log(this.mutiobj);

                    setTimeout(() => {
                        this.db.UpdateProfile(this.mutiobj.id, this.mutiobj).then((see: any) => {
                            //console.log('resetsetlast after save success');
                            this.loadingbegin(0);
                            this.gamemoment = 'startApmode';
                            this.outputGame();
                            this.blockthispage = " ";
                        })
                    }, 50);



                    //
                    // this.gamemoment = 'startApmode';
                    // this.outputGame();
                    // this.loadingbegin(0);


                });


            });
        }, 100);


    }

    resetbutton() { // 恢复默认设置
        this.gamemoment = ""
        if (this.resetsave) {
            this.resetsave = false;
            console.log('reset0000-0000', this.mutiobj);
            this.blockthispage = "disabled";
            this.loadingbegin(1);
            //暫停apmode
            setTimeout(() => {
                this.gamemoment = 'stopApmode';
                this.outputGame();
                // this.mutiobj={};
                //清除DB
                let obj = {
                    "ProfileName": this.cur.ProfileName
                }
                console.log('reset0000', this.cur.ProfileName);

                this.db.getProfile(obj).then((see: any) => {
                    //console.log('reset111');


                    let obj2 = {
                        "ProfileName": this.cur.ProfileName,
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

                    this.db.UpdateProfile(see[0].id, obj2).then((see: any) => {
                        //console.log('reset222');
                        //console.log('resetbutton1111');
                        //console.log(see[0]);
                        //清除三角形
                        for (let index = 0; index < this.array1.length; index++) {
                            // //console.log(this.array1[index] + "_2_css01");
                            document.getElementById(this.array1[index] + "_css01").style.backgroundImage = "none";
                            document.getElementById(this.array1[index] + "_css01").style.backgroundColor = "transparent"

                        }

                        // this.blockthispage = " ";
                        // this.loading = false;
                    })
                })
            })
            //清除三角形
            // for (let index = 0; index < this.array1.length; index++) {
            //     // //console.log(this.array1[index] + "_2_css01");
            //     document.getElementById(this.array1[index] + "_css01").style.backgroundImage = "none";
            //     document.getElementById(this.array1[index] + "_css01").style.backgroundColor = "transparent"

            // }
            console.log('01chnageprofile:', this.changeprofile);
            let data = {
                profile: this.changeprofile

            }

            let obj1 = {
                Type: funcVar.FuncType.Device,
                Func: funcVar.FuncName.GetKeyMatrix,
                Param: data

            }
            this.protocol.RunSetFunction(obj1).then((data) => {
                console.log('reset333');
                //console.log("Container RunSetFunction:" + data);

                for (let index = 0; index < this.KCTarr.length; index++) {

                    data[index] = this.KCTarr[index];

                }

                data[222] = 0x00;
                data[230] = 0x00;
                data[213] = 0xB3;
                data[200] = 0xB3;

                if (this.changeprofile == '2') {
                    data[124] = 0x00;
                } else {
                    data[124] = 227;
                }
                //console.log('thiskeydata:' + this.KCTarr);

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

                setTimeout(() => {
                    this.protocol.RunSetFunction(obj2).then((data) => {
                        console.log('reset444');
                        //console.log("Container RunSetFunction:" + data);
                        //console.log('setMatrix ended');
                        setTimeout(() => {
                            this.gamemoment = 'startApmode';
                            this.outputGame();
                            this.blockthispage = " ";
                            // this.loading = false;
                            this.ngOnInit();
                            setTimeout(() => {

                                this.resetsave = true;
                                // this.loadingbegin(0);
                                this.resetEventfun();
                            }, 1000);
                            // this.mutiobj={
                            //                         "ProfileName": this.cur.ProfileName,
                            //                         "Key": {
                            //                             "keyFunctionArr": [],
                            //                             "marcroContent": [],
                            //                             "marcroChoose": [],
                            //                             "Path": [],
                            //                             "keyCopy": [],
                            //                             "options": {
                            //                                 "OPshelf01": [],//內容/選單
                            //                                 "OPshelf02": []
                            //                             }
                            //                         },
                            //                         "shelf01": [],
                            //                         "shelf02": [],
                            //                         "shelfblock01": [],
                            //                         "shelfblock02": [],
                            //                         "KeyDataValue": [],
                            //                         "Light": {
                            //                             "LightEffect": "",
                            //                             "LightSetting": {
                            //                                 "LSbrightness": [],
                            //                                 "LSspeed": [],
                            //                                 "LSdirection": [],
                            //                                 "changeMode": [],
                            //                                 "changeTime": [],
                            //                             },
                            //                             "Mode": [],
                            //                             "Speed": [],
                            //                             "Color": [],
                            //                             "Time": "",
                            //                             "Into": ""
                            //                         },
                            //                         "AttLight": {
                            //                             "effect": "",
                            //                             "time": ""
                            //                         },
                            //                         "GameMode": [0, 0, 0]
                            //                     }
                            //                     console.log(this.mutiobj);
                        }, 20);

                    });
                }, 50);

            });


            //             setTimeout(() => {
            //                 let vm=this;
            //                 this.gamemoment = 'startApmode';
            //                 this.outputGame();
            //                 this.blockthispage = " ";

            //                 this.loading = false;


            //                 vm.mutiobj={
            //                     "ProfileName": this.cur.ProfileName,
            //                     "Key": {
            //                         "keyFunctionArr": [],
            //                         "marcroContent": [],
            //                         "marcroChoose": [],
            //                         "Path": [],
            //                         "keyCopy": [],
            //                         "options": {
            //                             "OPshelf01": [],//內容/選單
            //                             "OPshelf02": []
            //                         }
            //                     },
            //                     "shelf01": [],
            //                     "shelf02": [],
            //                     "shelfblock01": [],
            //                     "shelfblock02": [],
            //                     "KeyDataValue": [],
            //                     "Light": {
            //                         "LightEffect": "",
            //                         "LightSetting": {
            //                             "LSbrightness": [],
            //                             "LSspeed": [],
            //                             "LSdirection": [],
            //                             "changeMode": [],
            //                             "changeTime": [],
            //                         },
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
            //                 console.log(vm.mutiobj);
            //             }, 200);


            //             for (let index = 0; index < this.array1.length; index++) {
            //                 // //console.log(this.array1[index] + "_2_css01");
            //                 document.getElementById(this.array1[index] + "_css01").style.backgroundImage = "none";
            //                 document.getElementById(this.array1[index] + "_css01").style.backgroundColor = "transparent"

            //             }

            //         });
            //     });

            // }, 50);
        }
    }

    clickfunctiontime: number = 0;

    cleanAllRightOp() {

        for (let index = 0; index < this.array1.length; index++) {
            // //console.log(this.array1[index] + "_2_css01");
            document.getElementById(this.array1[index] + "_2_css01").style.display = "none";

        }

    }


    onRightClick(i) {
        //先清除所有的右鍵options

        this.cleanAllRightOp();


        //1:先找出位置 2.ob右鍵選項列改為block
        // //console.log('rightclick' + i);
        let aa = this.array1[i] + "_css01"
        let ob = this.array1[i] + "_2_css01";
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
        this.blockthispage = "disabled";
        this.loading = true;
        //暫停apmode
        setTimeout(() => {
            this.gamemoment = ""
            this.gamemoment = 'stopApmode';
            this.outputGame();
            //console.log('block key')
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


                data[this.block] = 0;
                //console.log('thiskeyshow:' + this.block);




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

                    this.gamemoment = 'startApmode';
                    this.outputGame();
                    this.loading = false;
                    this.blockthispage = " ";

                    let obj = {
                        "ProfileName": this.cur.ProfileName
                    }

                    this.db.getProfile(obj).then((see: any) => {
                        //console.log('blockkey profile:');

                        see[0].shelfblock01.push(this.array1[i] + "_css01");
                        //console.log(see[0]);

                        for (let resetindex = 0; resetindex < see[0].shelf01.length; resetindex++) {
                            if (see[0].shelf01[resetindex] == this.array1[i] + "_css01") {
                                see[0].shelf01[resetindex] = null;

                            }
                        }

                        see[0].KeyDataValue[this.block]=0;

                        setTimeout(() => {
                            this.db.UpdateProfile(see[0].id, see[0]).then((see: any) => {

                            })
                        }, 50);


                    })
                });
            });
        }, 50);

    }

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



    checkKeyinfile() {
        // this.setInArr();
        //console.log('checked');
        let data = {
            profile: this.changeprofile

        }

        let obj1 = {
            Type: funcVar.FuncType.Device,
            Func: funcVar.FuncName.GetKeyMatrix,
            Param: data

        }
        this.protocol.RunSetFunction(obj1).then((data) => {
            //console.log("Container RunSetFunction:get" + data);

            if (Array.isArray(data)) {
                for (let index = 0; index < data.length; index++) {
                    if (data[index] == 0xB2) {
                        //console.log(index + "is macro");
                    }

                }
            }
            // data[this.myKey] = 0xB2;
            // //console.log('thiskeyshow:' + this.myKey);




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

            // this.protocol.RunSetFunction(obj2).then((data) => {
            //     //console.log("Container RunSetFunction:set" + data);
            //     //console.log('setMatrix ended');

            //     setTimeout(() => {
            //         var marcoarr = [];
            //         for (let i = 0; i < this.setMacroarr.length; i++) {

            //             marcoarr[i] = this.setMacroarr[i]; //排進arr
            //             //console.log('seeMac:' + this.setMacroarr);

            //         }





            //         // marcoarr[0] = 0x80;
            //         // marcoarr[1] = 0x01;
            //         // marcoarr[2] = 0x06;
            //         // marcoarr[3] = 0x00;
            //         // marcoarr[4] = 0x01;
            //         // marcoarr[5] = 0x06;



            //         //  marcoarr=[
            //         //             "0x80",
            //         //             "0x01",
            //         //             "0x06",
            //         //             "0x00",
            //         //             "0x01",
            //         //             "0x06"
            //         //         ]

            //         let set = {
            //             key: this.myKey,
            //             repeat: "1",
            //             data: marcoarr

            //         }


            //         let obj3 = {
            //             Type: funcVar.FuncType.Device,
            //             Func: funcVar.FuncName.SetMacroKey,
            //             Param: set
            //         }

            //         this.protocol.RunSetFunction(obj3).then((data) => {
            //             //console.log("Container RunSetFunction:" + data);

            //         });


            //         this.setMacroarr.length = 0;
            //         this.keytype.length = 0;
            //         this.finaldistantTime = 0;
            //         this.distantTime.length = 0;
            //         //console.log('keytypeOut:' + this.keytype);
            //         //console.log('finaltimeOut:' + this.finaldistantTime);
            //         //console.log('seeMacOut:' + this.setMacroarr);
            //     }, 150);
            // })
        });

    }


    // ngOnInit(){
    //    //console.log("ngOnInit");
    // }

    // ngAfterContentChecked(){
    //     //console.log("ngAfterContentChecked");
    //     let vm=this;
    //     setInterval(vm.checkKeyinfile,200);
    // }

    CancelPage(message) {
        //console.log(message);
        this.selfdf = 'none';

        //只要取消clickarea下次點選回到side01
        this.onClick(0)
        this.pageshow(1);
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
            document.getElementById(aa).style.backgroundRepeat = "no-repeat";
            document.getElementById(aa).style.backgroundPosition = "bottom left";
        }, 500);

        this.LastarrayindexArr.push(aa);
        if (this.cur !== undefined) {
            let obj = {
                "ProfileName": this.cur.ProfileName
            }
            this.db.getProfile(obj).then((see: any) => {
                //console.log('profileread111')
                this.mutiobj = see[0];
                //console.log('testread');
                //console.log(this.mutiobj);
                // 畫面上給有設定的鍵加入紅色三角形

                this.mutiobj.shelf01 = this.LastarrayindexArr;
                this.clearblockKey(this.mutiobj,aa)
                //console.log('testread1111');
                //console.log(this.mutiobj);


                setTimeout(() => {
                    this.db.UpdateProfile(this.mutiobj.id, this.mutiobj).then((see: any) => {
                        //console.log('update2222')

                        //console.log('testread333');
                        //console.log(this.mutiobj);
                    })
                }, 50);
                // this.db.UpdateProfile(this.mutiobj.id, this.mutiobj).then((see: any) => {
                //     //讀入
                //     //console.log('key update success');
                // });
            });
        };

    }

    pageshow(w) {
        this.side01 = false;
        this.side02 = false;
        this.side03 = false;
        this.side04 = false;
        this.side05 = false;
        this.side06 = false;
        this.side07 = false;
        if (w == 1) {
            this.side01 = true;

        }
        if (w == 2) {

            this.side02 = true;


        }
        if (w == 3) {

            this.side03 = true;

        }
        if (w == 4) {

            this.side04 = true;


        }
        if (w == 5) {

            this.side05 = true;

        }
        if (w == 6) {

            this.side06 = true;


        }
        if (w == 7) {

            this.side07 = true;
        }
    }


    selfdf: any = 'none';
    showsd: boolean = false;


    ckcss: any = {
        color: "white",
        "background-color": "rgba(233,0,76,0.5)",
        "border": "1px solid #E7004C",

    };

    loopNum: any = ['opta01', 'opta02', 'opta03', 'opta04', 'opta05', 'opta06', 'opta07'];
    loopImg: any = ['optimg01', 'optimg02', 'optimg03', 'optimg04', 'optimg05', 'optimg06', 'optimg07'];

    lecss01 = "";
    lecss02 = "";
    lecss03 = "";
    lecss04 = "";
    lecss05 = "";
    lecss06 = "";
    lecss07 = "";

    becss: any = {};



    onClick(w) {
        this.showsd = true;
        //圖片部分
        for (var i = 0; i < this.loopImg.length; i++) {
            var g = this.loopImg[w];
            document.getElementById(this.loopImg[i]).style.opacity = "";

            if (i === w) {
                document.getElementById(g).style.opacity = "1";

            }

        }
        //文字部分
        for (var i = 0; i < this.loopNum.length; i++) {
            var a = this.loopNum[w];
            document.getElementById(this.loopNum[i]).style.color = "";
            document.getElementById(this.loopNum[i]).style.backgroundColor = "";
            document.getElementById(this.loopNum[i]).style.border = "";
            if (i === w) {
                document.getElementById(a).style.color = "white";
                document.getElementById(a).style.backgroundColor = "rgba(233,0,76,0.5)";
                document.getElementById(a).style.border = "1px solid #E7004C";
            }

        }



    };

    theKey: string;
    istitle: any = "here";
    firstarr: any = ["esc", "f1", "f2", "f3", "f4", "f5", "f6", "f7", "f8", "f9", "f10", "f11", "f12", "print", "scroll", "pause", "perid", "n1", "n2", "n3", "n4", "n5", "n6", "n7", "n8", "n9", "n0", "minus", "plus", "bsp", "insert", "home", "pup", "numlock", "numdrawn", "numtimes", "numminus", "tab", "q", "w", "e", "r", "t", "y", "u", "i", "o", "p", "lqu", "rqu", "drawn", "delete", "end", "pdown", "num7", "num8", "num9", "numplus", "caps", "a", "s", "d", "f", "g", "h", "j", "k", "l", "sem", "quo", "enter", "num4", "num5", "num6", "lshift", "z", "x", "c", "v", "b", "n", "m", "comma", "dot", "qmark", "rshift", "up", "num1", "num2", "num3", "numenter", "lctrl", "win", "lalt", "space", "ralt", "fn", "book", "rctrl", "left", "down", "right", "num0", "numdot",]




    //打開clickarea
    callSelfdf(r) {
        this.shelf01block = 'disabled';
        this.side01 = false;
        this.loadingbegin(1);

        // this.keyMatrixMap[0] = ['pause break', 'stop', 'play/pause', 'next', 'previous', 'none', 'l-ctrl', 'f5'];
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


        this.selfdf = 'block';

        setTimeout(() => {
            this.side01 = true;
            this.loadingbegin(0);
            this.shelf01block = ' ';
        }, 1000);


        let t = this.firstarr[r];


        // //console.log(this.theKey);
        // //console.log(r)

        for (let i = 0; i < 16; i++) {
            if (this.keyMatrixMap[i].indexOf(t) !== -1) {
                let x = i;
                let y = this.keyMatrixMap[i].indexOf(t);
                this.theKey = x * 8 + y;
                //console.log('thekey:' + this.theKey);
                //console.log('x:' + x + 'y:' + y)
                //keymatrix 找 xy
            }
        }

        //換圖

        if (r == 13 || r == 14 || r == 15 || r == 16) {
            document.getElementById('istitle').style.backgroundImage = "url('image/istitle2.png')";
        } else {
            document.getElementById('istitle').style.backgroundImage = "url('image/istitle.png')";
        }

        t = this.newKBarr[r];
        this.istitle = t.toUpperCase();


    };

    colseSelfdf() {

        this.selfdf = 'none';

    };

    clearblockKey(obj,keyID){
        for (let resetindex = 0; resetindex < obj.shelfblock01.length; resetindex++) {
            if (obj.shelfblock01[resetindex] == keyID) {
                obj.shelfblock01[resetindex] = null;

            }
        }
    }

}