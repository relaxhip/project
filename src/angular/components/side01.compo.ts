declare var System;
import { Component, OnInit, Input, Output, EventEmitter, HostListener } from '@angular/core';

import { protocolService } from '../services/service/protocol.service';
let remote = System._nodeRequire('electron').remote;
let { dialog } = remote;

let evtVar = System._nodeRequire('./backend/others/eventVariable');
let funcVar = System._nodeRequire('./backend/others/FunctionVariable');
let env = System._nodeRequire('./backend/others/env');

const { ipcRenderer } = System._nodeRequire('electron');
declare var $: any;

import { ElectronEventService, dbService, EmitService } from '../services/libs/electron/index';
import { GetDeviceService } from '../services/device/GetDevice.service';
import { Subscription } from "rxjs/Subscription";
import { format } from 'url';
import { boomComponent } from './boom.compo';


@Component({
    selector: 'side01-app',
    templateUrl: './components/pages/side01.compo.html',
    //template: '<h1>我的第一个 Angular 应用</h1>',
    styleUrls: ['./css/first.css'],
    providers: [protocolService, dbService],
    inputs: ['myKey', 'mutiobj', 'ProfileDetail']
})



export class side01Component implements OnInit {
    alerttime:number=3000;
    alerttext:string;
    alertcoming:boolean=false;
    EnterText:any=10;
    testng:boolean=true;
    setdistantT: boolean = false;
    changeprofile: any = '2';
    firstOrder: number = 0;
    recordready: boolean = false;
    keyupflag: boolean = true;
    importmore: boolean;
    mutiobj: any = {};
    myKey: string;
    macrotake: boolean = true;
    LastarrayindexArr: any = [];
    constructor(private protocol: protocolService, private db: dbService, private getDeviceService: GetDeviceService, private emitService: EmitService) {
        //console.log('side01 loading complete');

    }

    @Output() outputEvent: EventEmitter<any> = new EventEmitter();
    @Output() Keyhasbeenset: EventEmitter<any> = new EventEmitter();
    @Output() nowloading: EventEmitter<any> = new EventEmitter();
    @Output() outputGameEvent: EventEmitter<any> = new EventEmitter();
    @Output() resetpage: EventEmitter<any> = new EventEmitter();


    gamemoment: any;

    outputGame() {
        this.outputGameEvent.emit(this.gamemoment);
    }

    loading(w) {
        if (w == 1) {
            //console.log('side01 01');
            this.nowloading.emit(1);
        }



        if (w == 2) {

            //console.log('side01 01');
            this.nowloading.emit(2);
        }


        if (w == 3) {

            //console.log('side01 01');
            this.nowloading.emit(3);
        }

        if (w == 0) {
            //console.log('side01 02');
            this.nowloading.emit(0);
        }
    }

    cancelPage() {
        this.outputEvent.emit(1);
    }

    reserPage() {
        this.resetpage.emit(1);
    }


    keywasSet() {
        this.Keyhasbeenset.emit(this.myKey);
    }

    MarcroMap: any = [
        '0', '', '', '',
        'keya', 'keyb', 'keyc', 'keyd', 'keye', 'keyf', 'keyg', 'keyh', 'keyi', 'keyj', 'keyk', 'keyl', 'keym', 'keyn',
        'keyo', 'keyp', 'keyq', 'keyr', 'keys', 'keyt', 'keyu', 'keyv', 'keyw', 'keyx', 'keyy', 'keyz', 'digit1', 'digit2',
        'digit3', 'digit4', 'digit5', 'digit6', 'digit7', 'digit8', 'digit9', 'digit0',
        'enter', 'escape', 'backspace', 'tab', 'space',
        'minus', 'equal', 'bracketleft', 'bracketright', 'backslash', 'europe 1 (note 2)', 'semicolon', 'quote', 'backquote', 'comma', 'period', 'slash', 'capslock',
        'f1', 'f2', 'f3', 'f4', 'f5', 'f6', 'f7', 'f8', 'f9', 'f10', 'f11', 'f12',
        'print screen (note 1)',
        'scrolllock', 'break (ctrl-pause)', 'insert', 'home', 'pageup',
        'delete', 'end', 'pagedown', 'arrowright', 'arrowleft',
        'arrowdown', 'arrowup', 'numlock', 'numpaddivide', 'numpadmultiply', 'numpadsubtract',
        'numpadadd', 'numpadenter', 'numpad1', 'numpad2', 'numpad3', 'numpad4',
        'numpad5', 'numpad6', 'numpad7', 'numpad8', 'numpad9', 'numpad0',
        'numpaddecimal', 'europe 2 (note 2)', 'contextmenu', 'keyboard power', 'keypad =', 'f13', 'f14', 'f15',
        'f16', 'f17', 'f18', 'f19', 'f20', 'f21', 'f22', 'f23', 'f24', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', 'keypad',
        'keyboard int', 'keyboard intl2', 'keyboard intl 2', '¥', 'keyboard intl 4', 'keyboard intl 5', '', '', '', '', 'keyboard lang 1',
        , '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', 'stop', 'scan previous track', 'play/ pause', 'scan next track',
        'mute', 'volume down', 'volume up', 'fn', '', '', '', 'gamemode', 'winlock',
        'macro', 'lanuch', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', 'leftclick', 'rightclick', 'wheelclick', 'scrolldown',
        'scrollup', 'backward', 'forward', 'doubleclick', 'intensity_up',
        'intensity_down', 'intensity_sw', 'led_mode_up', 'led_mode_down', 'led_mode_sw',
        'led_dir_s_z_w', 'led_dir_x_y_n', 'led_speed_jia ', 'led_speed_jian', 'controlleft', 'shiftleft', 'altleft', 'metaleft', 'controlright', 'shiftright', 'altright', 'metaright', '', '', '', '', '', '', '', '', 'led_coustom_mode',
        'volume_mode '
    ];
    checkMacroOrd() {
        for (let index = 0; index < this.MarcroMap.length; index++) {
            //console.log(this.MarcroMap[index] + ':' + index.toString(16));
        }
    }

    ngOnInit() {
        // alert('啟動side01');
        //

        //
        // //console.log("names array", this.names);


        // let obj2 = { 
        //     "ProfileName": this.ProfileDetail,
        // }

        // this.db.getProfile(obj2).then((doc: any) => {

        // })
        //
        // //console.log('readdbMacr000');
        // //console.log(this.mutiobj);
        // //console.log(this.myKey);
        // //console.log(this.mutiobj.Key.marcroChoose[this.myKey]);
        // if (this.mutiobj.Key.marcroChoose[this.myKey] !== undefined && this.mutiobj.Key.marcroChoose[this.myKey] !== null) { //找之前選取哪一個
        //     let content = this.mutiobj.Key.marcroChoose[this.myKey];
        //     if (this.names.indexOf(content) !== undefined && this.names.indexOf(content) !== null) {
        //         this.callName(this.names.indexOf(content));
        //         //console.log('callname111');
        //         //console.log(this.names.indexOf(content));

        //         //console.log('choosename');
        //         //console.log(content);
        //     } else {
        //         //console.log('宏命令讀取錯誤')showmorebox
        //     }
        // } else {
        //     this.callName(0);
        //     //console.log('callname第一個');
        // }


        // this.FileinMacro();
        document.getElementById('btnarea').classList.add('disabled');
        document.getElementById('showmorebox').classList.add("disabled");
        (<HTMLInputElement>document.getElementById('contInput')).disabled = true;


        // this.readdbMacro();


        let obj = { //製作暫存
            "ProfileName": "MacroList",
        }

        this.db.getProfile(obj).then((doc: any) => {
            this.names = doc[0].macrolistNames;

            //
            //console.log('readdbMacr000');
            //console.log(this.mutiobj);
            if (this.mutiobj.ProfileName == '' || this.mutiobj.ProfileName == undefined || this.mutiobj.ProfileName == null) {
                this.mutiobj.ProfileName == '游戏模式';
            }


            if (this.mutiobj.ProfileName == '游戏模式') {
                this.changeprofile = '2';
            } else {
                this.changeprofile = '1';
            }
            //console.log(this.myKey);
            //console.log(this.mutiobj.Key.marcroChoose[this.myKey]);
            if (this.mutiobj.Key.marcroChoose[this.myKey] !== undefined && this.mutiobj.Key.marcroChoose[this.myKey] !== null) { //找之前選取哪一個
                let content = this.mutiobj.Key.marcroChoose[this.myKey];
                if (this.names.indexOf(content) !== undefined && this.names.indexOf(content) !== null) {
                    this.callName(this.names.indexOf(content));
                    //console.log('callname111');
                    //console.log(this.names.indexOf(content));
                    this.firstOrder = this.names.indexOf(content);
                    //console.log('choosename');
                    //console.log(content);
                } else {
                    //console.log('宏命令讀取錯誤')
                }
            } else {
                this.callName(0);
                //console.log('callname第一個');
            }
            //




            this.tempMacrolist.ProfileName = doc[0].ProfileName;
            this.tempMacrolist.macrolistNames = doc[0].macrolistNames;
            this.tempMacrolist.macrolistArr = doc[0].macrolistArr;
            this.tempMacrolist.id = doc[0].id;
            //console.log('thiscoose');
            //console.log(this.choosename);
            // this.choosename = doc[0].macrolistNames[0];
            // this.choosename = doc[0].macrolistNames[doc[0].macrolistNames[0].length-1];
            // this.choosename=doc[0].macrolistNames[0];
            // //console.log('選項藍');
            // //console.log(doc[0].macrolistNames[0]);

            //
            let countarr = [];
            for (let index = 0; index < this.tempMacrolist.macrolistNames.length; index++) {
                if (this.tempMacrolist.macrolistNames[index].indexOf('专案名称') == 0) {
                    countarr.push(parseInt(this.tempMacrolist.macrolistNames[index].slice(4)));
                }

                if (index == this.tempMacrolist.macrolistNames.length - 1) {
                    countarr.sort(function (a, b) { return a - b });
                    this.count = countarr.length;
                    //console.log('get count');
                    //console.log(this.count);
                    this.beginsetting();
                    //console.log(this.names);
                }
            }
            //console.log('完成tempmacrolist');
            //console.log('thiscoose');
            //console.log(this.choosename);
            //console.log('MUTIOBJ');
            //console.log(this.mutiobj);

            //console.log('firstOrder');
            //console.log(this.firstOrder);
            this.callName(this.firstOrder);

        })
        // this.macrobox.length = 240;
    }

    lookpoint: number = 0;
    markmorebox: number = 0;
    clearOpt: boolean = false;
    getMacrolist: boolean;
    MacroContent: any;
    MacrolistPick: boolean = false;
    continueKey: number = 0;
    sameKeyblock: boolean = false;
    ImportMacro: boolean = false;
    KBarr: any = ["esc", "f1", "f2", "f3", "f4", "f5", "f6", "f7", "f8", "f9", "f10", "f11", "f12", "PRINT", "SCROLL", "PAUSE", "`~", "1!", "2@", "3#", "4$", "5%", "6^", "7&", "8*", "9(", "0)", "-_", "=+", "BACK SPACE", "INSERT", "HOME", "PAGE UP", "NUM LOCK", "NUM/", "NUM*", "NUM-", "TAB", "Q", "W", "E", "R", "T", "Y", "U", "I", "O", "P", "[{", "]}", "\\|", "DELETE", "END", "PAGE DOWN", "NUM7", "NUM8", "NUM9", "NUM+", "CAPS", "A", "S", "D", "F", "G", "H", "J", "K", "L", ";:", "'\"", "ENTER", "NUM4", "NUM5", "NUM6", "SHIFT", "Z", "X", "C", "V", "B", "N", "M", ",<", ".>", "/?", "SHIFT", "↑", "NUM1", "NUM2", "NUM3", "NUM ENTER", "CTRL", "WINDOWS", "ALT", "SPACE", "ALT", "APP", "CTRL", "←", "↓", "→", "NUM0", "NUM."]
    eventCodeArr: any = ["Escape", "F1", "F2", "F3", "F4", "F5", "F6", "F7", "F8", "F9", "F10", "F11", "F12", "PrintScreen", "ScrollLock", "Pause", "Backquote", "Digit1", "Digit2", "Digit3", "Digit4", "Digit5", "Digit6", "Digit7", "Digit8", "Digit9", "Digit0", "Minus", "Equal", "Backspace", "Insert", "Home", "PageUp", "NumLock", "NumpadDivide", "NumpadMultiply", "NumpadSubtract", "Tab", "KeyQ", "KeyW", "KeyE", "KeyR", "KeyT", "KeyY", "KeyU", "KeyI", "KeyO", "KeyP", "BracketLeft", "BracketRight", "Backslash", "Delete", "End", "PageDown", "Numpad7", "Numpad8", "Numpad9", "NumpadAdd", "CapsLock", "KeyA", "KeyS", "KeyD", "KeyF", "KeyG", "KeyH", "KeyJ", "KeyK", "KeyL", "Semicolon", "Quote", "Enter", "Numpad4", "Numpad5", "Numpad6", "ShiftLeft", "KeyZ", "KeyX", "KeyC", "KeyV", "KeyB", "KeyN", "KeyM", "Comma", "Period", "Slash", "ShiftRight", "ArrowUp", "Numpad1", "Numpad2", "Numpad3", "NumpadEnter", "ControlLeft", "MetaLeft", "AltLeft", "Space", "AltRight", "ContextMenu", "ControlRight", "ArrowLeft", "ArrowDown", "ArrowRight", "Numpad0", "NumpadDecimal"]
    eventCodeArrlowerCase: any = ["escape", "f1", "f2", "f3", "f4", "f5", "f6", "f7", "f8", "f9", "f10", "f11", "f12", "printscreen", "scrolllock", "pause", "backquote", "digit1", "digit2", "digit3", "digit4", "digit5", "digit6", "digit7", "digit8", "digit9", "digit0", "minus", "equal", "backspace", "insert", "home", "pageup", "numlock", "numpaddivide", "numpadmultiply", "numpadsubtract", "tab", "keyq", "keyw", "keye", "keyr", "keyt", "keyy", "keyu", "keyi", "keyo", "keyp", "bracketleft", "bracketright", "backslash", "delete", "end", "pagedown", "numpad7", "numpad8", "numpad9", "numpadadd", "capslock", "keya", "keys", "keyd", "keyf", "keyg", "keyh", "keyj", "keyk", "keyl", "semicolon", "quote", "enter", "numpad4", "numpad5", "numpad6", "shiftleft", "keyz", "keyx", "keyc", "keyv", "keyb", "keyn", "keym", "comma", "period", "slash", "shiftright", "arrowup", "numpad1", "numpad2", "numpad3", "numpadenter", "controlleft", "metaleft", "altleft", "space", "altright", "contextmenu", "controlright", "arrowleft", "arrowdown", "arrowright", "numpad0", "numpaddecimal"]
    timeIf: boolean;
    pressIf: boolean;
    releaseIf: boolean;



    confirmTime: number;
    Timevalue: any = "请输入时间";
    pressvalue: any;
    releasevalue: any;


    importmacroContent: any;
    timeremain: any;
    fstPress: boolean = true;
    thefstTimeStamp: any = [];
    theScdTimeStamp: any = [];
    recordOff: boolean = false;
    blockcss: any = "";
    closerecord: any;

    keydownWaitkeyUp: boolean = false;
    keydownkeycodearr: any = [];
    checkFirstKeydown: number = 0;
    checkKeyUP: any = false;
    choosename: string = '专案名称1';
    nameindex: any = 0;
    addDefaultName: any = "专案名称";
    names: any = [];
    count: number = 1;

    temp: any;

    //macro time get 
    nowtimeblock: any = 0;
    nowtime: any;

    finaldistantTime: any = [];
    distantTime: any = [];
    keytype: any = [];
    keycontent: any = [];


    pressboolean: boolean = true;
    releaseboolean: boolean = true;

    theTimeword: any = [];
    Rewordnum: any = [];
    wordnum: any = [];
    thepressword: any = [];
    theReleaseword: any = [];
    editKeyBoolean: boolean = true;
    arrnames: any = 0;
    keycodeContent: any = "请按键盘按键";
    arrindex: any;//選定內容的序數
    macrobox: any = [];//內容
    editcontent: boolean = false;
    showedit: any = "none";
    editItemConfirm: any;//暫存editItem的值
    tempmacro: any;
    tempvalue: any = "请输入名称";
    copybox: any;
    red: any = "red";
    num: any = 1;//流水號
    newWords: any = "新专案"
    name: any = this.newWords;

    getfocustimes: any = 0;  //控制macro錄製圖片
    setMacroarrOrder: number = 0;//控制macro錄製array位置



    savebox: any = [];
    finalclick: number;
    setdistantTime: any = 10;//inputvalue
    setTempdT: any = 10;//收到的變化值
    macrosavecick: number = 0;


    setintoDBMacro: any;
    tempMacrolist: any = {
        "ProfileName": "MacroList",
        "macrolistNames": ['专案名称1'],
        "macrolistArr": [],
        "id": ""
    };


    check01: boolean = true;
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








    readdbMacro() { //讀取db

        //讀太快
        //console.log('readdbMacr1111');
        //console.log(this.mutiobj);
        //console.log(this.mutiobj.ProfileName);
        this.db.UpdateProfile(this.mutiobj.id, this.mutiobj).then((doc: any) => {//更新db對應位置
            //console.log(this.mutiobj);
            // //console.log(this.mutiobj);
            //console.log('ImportMacro');
            //console.log(this.ImportMacro);
            //console.log(this.myKey);

            if (this.MacrolistPick && this.MacroContent.length !== 0) { //讀入专案名称
                //console.log('callname')
                let marcroinDB;
                // //console.log('匯入的importmacroContent');
                // //console.log(this.importmacroContent);

                marcroinDB = this.MacroContent;

                //console.log('處理的匯入');
                //console.log(marcroinDB);
                //
                let nowKey = this.eventCodeArrlowerCase.indexOf(this.MarcroMap[marcroinDB[2]]);
                let printKey = this.KBarr[nowKey];

                // this.macrobox[0] = "👇🏻按下：" + this.MarcroMap[marcroinDB[2]];
                // this.macrobox[1] = "⏰计时：" + marcroinDB[1] + "毫秒";
                // this.macrobox[2] = "🖐🏻放开：" + this.MarcroMap[marcroinDB[2]];


                this.macrobox[0] = "👇🏻按下：" + printKey;
                this.macrobox[1] = "⏰计时：" + marcroinDB[1] * 10 + "毫秒";
                // this.macrobox[2] = "🖐🏻放开：" + printKey;
                for (let i = 3; i < marcroinDB.length; i++) {
                    if (i % 3 == 0) {
                        if (marcroinDB[i] == 128) {
                            this.macrobox.push("👇🏻按下：" + this.KBarr[this.eventCodeArrlowerCase.indexOf(this.MarcroMap[marcroinDB[i + 2]])]);
                            this.macrobox.push("⏰计时：" + marcroinDB[i + 1] * 10 + "毫秒");
                        } else {
                            this.macrobox.push("🖐🏻放开：" + this.KBarr[this.eventCodeArrlowerCase.indexOf(this.MarcroMap[marcroinDB[i + 2]])]);
                            this.macrobox.push("⏰计时：" + marcroinDB[i + 1] * 10 + "毫秒");
                        }
                    }


                    if (i == marcroinDB.length - 1) {
                        //console.log('去除最後放开的時間');
                        //console.log(this.macrobox);
                        this.macrobox.splice(this.macrobox.length - 1, 1); //去除最後放开的時間
                        //console.log(this.macrobox);
                        this.UndefindedCheck();
                    }
                }
                //console.log('readdbMacr3333');
                //console.log(this.macrobox);
                this.MacrolistPick = false;
            }




            if (this.ImportMacro) { //匯入macro時
                //console.log('callname')
                let marcroinDB;
                // //console.log('匯入的importmacroContent');
                // //console.log(this.importmacroContent);

                marcroinDB = this.MacroContent;

                //console.log('處理的匯入');
                //console.log(marcroinDB);
                //
                let nowKey = this.eventCodeArrlowerCase.indexOf(this.MarcroMap[marcroinDB[2]]);
                let printKey = this.KBarr[nowKey];

                // this.macrobox[0] = "👇🏻按下：" + this.MarcroMap[marcroinDB[2]];
                // this.macrobox[1] = "⏰计时：" + marcroinDB[1] + "毫秒";
                // this.macrobox[2] = "🖐🏻放开：" + this.MarcroMap[marcroinDB[2]];


                this.macrobox[0] = "👇🏻按下：" + printKey;
                this.macrobox[1] = "⏰计时：" + marcroinDB[1] * 10 + "毫秒";
                // this.macrobox[2] = "🖐🏻放开：" + printKey;
                for (let i = 3; i < marcroinDB.length; i++) {
                    if (i % 3 == 0) {
                        if (marcroinDB[i] == 128) {
                            this.macrobox.push("👇🏻按下：" + this.KBarr[this.eventCodeArrlowerCase.indexOf(this.MarcroMap[marcroinDB[i + 2]])]);
                            this.macrobox.push("⏰计时：" + marcroinDB[i + 1] * 10 + "毫秒");
                        } else {
                            this.macrobox.push("🖐🏻放开：" + this.KBarr[this.eventCodeArrlowerCase.indexOf(this.MarcroMap[marcroinDB[i + 2]])]);
                            this.macrobox.push("⏰计时：" + marcroinDB[i + 1] * 10 + "毫秒");
                        }
                    }


                    if (i == marcroinDB.length - 1) {
                        //console.log('去除最後放开的時間');
                        //console.log(this.macrobox);
                        this.macrobox.splice(this.macrobox.length - 1, 1); //去除最後放开的時間
                        //console.log(this.macrobox);
                        this.UndefindedCheck();
                        let vm = this;
                        setTimeout(() => {
                            vm.reserPage();
                            vm.callitem(0);
                        }, 200);
                    }
                }
                //console.log('readdbMacr3333');
                //console.log(this.macrobox);
                this.ImportMacro = false;


            }
            // //console.log(this.mutiobj.Key.marcroContent[8]);
            // //console.log(this.mutiobj.Key.marcroContent[this.myKey]);
            if (this.mutiobj.Key.marcroContent[this.myKey].length !== 0 && this.macrobox.length == 0) {
                //console.log('啟動時的讀入');
                //console.log('長度');
                //console.log(this.macrobox.length);
                //console.log('readdbMacr2222');
                //console.log(this.mutiobj.Key.marcroContent[this.myKey]);
                let marcroinDB = this.mutiobj.Key.marcroContent[this.myKey];
                //
                let nowKey = this.eventCodeArrlowerCase.indexOf(this.MarcroMap[marcroinDB[2]]);
                let printKey = this.KBarr[nowKey];

                // this.macrobox[0] = "👇🏻按下：" + this.MarcroMap[marcroinDB[2]];
                // this.macrobox[1] = "⏰计时：" + marcroinDB[1] + "毫秒";
                // this.macrobox[2] = "🖐🏻放开：" + this.MarcroMap[marcroinDB[2]];
                this.macrobox[0] = "👇🏻按下：" + printKey;
                this.macrobox[1] = "⏰计时：" + marcroinDB[1] * 10 + "毫秒";
                // this.macrobox[2] = "🖐🏻放开：" + printKey;
                for (let i = 3; i < marcroinDB.length; i++) {
                    if (i % 3 == 0) {
                        if (marcroinDB[i] == 128) {
                            this.macrobox.push("👇🏻按下：" + this.KBarr[this.eventCodeArrlowerCase.indexOf(this.MarcroMap[marcroinDB[i + 2]])]);
                            this.macrobox.push("⏰计时：" + marcroinDB[i + 1] * 10 + "毫秒");
                        } else {
                            this.macrobox.push("🖐🏻放开：" + this.KBarr[this.eventCodeArrlowerCase.indexOf(this.MarcroMap[marcroinDB[i + 2]])]);
                            this.macrobox.push("⏰计时：" + marcroinDB[i + 1] * 10 + "毫秒");
                        }

                    }

                    if (i == marcroinDB.length - 1) {
                        //console.log('去除最後放开的時間');
                        //console.log(this.macrobox);
                        this.macrobox.splice(this.macrobox.length - 1, 1); //去除最後放开的時間
                        //console.log(this.macrobox);
                        this.UndefindedCheck();
                    }

                }


                //console.log('readdbMacr3333');
                //console.log(this.macrobox);
                //
            }


            if (this.mutiobj.Key.options.OPshelf01[0][0] !== undefined) {
                this.clickOnitem(this.mutiobj.Key.options.OPshelf01[0][0]);
            }
            if (this.mutiobj.Key.options.OPshelf01[0][1] !== undefined) {
                this.setdistantTime = this.mutiobj.Key.options.OPshelf01[0][1];
            }
        });
    }



    UndefindedCheck() {

        if (this.macrobox.length !== 0) {
            for (let index = 0; index < this.macrobox.length; index++) {
                if (this.macrobox[index] == undefined || this.macrobox[index] == null || this.macrobox[index] == "") {
                    //console.log('UndefindedCheck');
                    this.macrobox.splice(index, this.macrobox.length - index);
                }

            }
        }
    }


    clickOnitem(w) {
        this.finalclick = w;
        if (w == 0) {
            this.check01 = true;
            this.check02 = false;
            this.check03 = false;
            this.check04 = false;
            this.check05 = false;
            this.check06 = false;
            this.check07 = false;
            this.check08 = false;
            this.check09 = false;
            this.check10 = false;
            this.check11 = false;
            this.check12 = false;
            this.check13 = false;
            this.nowtimeblock = 0; //點選時重啟
            (<HTMLInputElement>document.getElementById('contInput')).disabled = true;
            document.getElementById('contInput').blur();
            document.getElementById('contInput').style.animation = "none";
            document.getElementById('contInput').style.border = "none"
            this.contBorder = false;

        }
        if (w == 1) {
            this.distantT(10);
            this.check01 = false;
            this.check02 = true;
            this.check03 = false;
            this.check04 = false;
            this.check05 = false;
            this.check06 = false;
            this.check07 = false;
            this.check08 = false;
            this.check09 = false;
            this.check10 = false;
            this.check11 = false;
            this.check12 = false;
            this.check13 = false;
            (<HTMLInputElement>document.getElementById('contInput')).disabled = false;
        }
        if (w == 2) {
            this.check01 = false;
            this.check02 = false;
            this.check03 = true;
            this.check04 = false;
            this.check05 = false;
            this.check06 = false;
            this.check07 = false;
            this.check08 = false;
            this.check09 = false;
            this.check10 = false;
            this.check11 = false;
            this.check12 = false;
            this.check13 = false;
            (<HTMLInputElement>document.getElementById('contInput')).disabled = true;
            document.getElementById('contInput').blur();
            document.getElementById('contInput').style.animation = "none";
            document.getElementById('contInput').style.border = "none"
            this.contBorder = false;

        }
        if (w == 3) {
            this.check01 = false;
            this.check02 = false;
            this.check03 = false;
            this.check04 = true;
            this.check05 = false;
            this.check06 = false;
            this.check07 = false;
            this.check08 = false;
            this.check09 = false;
            this.check10 = false;
            this.check11 = false;
            this.check12 = false;
            this.check13 = false;
        }
        if (w == 4) {
            this.check01 = false;
            this.check02 = false;
            this.check03 = false;
            this.check04 = false;
            this.check05 = true;
            this.check06 = false;
            this.check07 = false;
            this.check08 = false;
            this.check09 = false;
            this.check10 = false;
            this.check11 = false;
            this.check12 = false;
            this.check13 = false;
        }
        if (w == 5) {
            this.check01 = false;
            this.check02 = false;
            this.check03 = false;
            this.check04 = false;
            this.check05 = false;
            this.check06 = true;
            this.check07 = false;
            this.check08 = false;
            this.check09 = false;
            this.check10 = false;
            this.check11 = false;
            this.check12 = false;
            this.check13 = false;
        }
        if (w == 6) {
            this.check01 = false;
            this.check02 = false;
            this.check03 = false;
            this.check04 = false;
            this.check05 = false;
            this.check06 = false;
            this.check07 = true;
            this.check08 = false;
            this.check09 = false;
            this.check10 = false;
            this.check11 = false;
            this.check12 = false;
            this.check13 = false;
        }
        if (w == 7) {
            this.check01 = false;
            this.check02 = false;
            this.check03 = false;
            this.check04 = false;
            this.check05 = false;
            this.check06 = false;
            this.check07 = false;
            this.check08 = true;
            this.check09 = false;
            this.check10 = false;
            this.check11 = false;
            this.check12 = false;
            this.check13 = false;
        }
        if (w == 8) {
            this.check01 = false;
            this.check02 = false;
            this.check03 = false;
            this.check04 = false;
            this.check05 = false;
            this.check06 = false;
            this.check07 = false;
            this.check08 = false;
            this.check09 = true;
            this.check10 = false;
            this.check11 = false;
            this.check12 = false;
            this.check13 = false;
        }
        if (w == 9) {
            this.check01 = false;
            this.check02 = false;
            this.check03 = false;
            this.check04 = false;
            this.check05 = false;
            this.check06 = false;
            this.check07 = false;
            this.check08 = false;
            this.check09 = false;
            this.check10 = true;
            this.check11 = false;
            this.check12 = false;
            this.check13 = false;
        }
        if (w == 10) {
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
            this.check11 = true;
            this.check12 = false;
            this.check13 = false;
        }
        if (w == 11) {
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
            this.check11 = false;
            this.check12 = true;
            this.check13 = false;
        }
        if (w == 12) {
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
            this.check11 = false;
            this.check12 = false;
            this.check13 = true;
        }
        if (w == 13) {
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
            this.check11 = false;
            this.check12 = false;
            this.check13 = false;
            this.check14 = true;
        }
        else {
            return false;
        }


    }

    record: boolean = false;
    showfn: any = "block";
    showinput: boolean = false;
    editinput: boolean = false;

    editname: string = "";
    fnbtn: boolean = false;
    ftltbox: boolean = false;
    macrovalue: string;
    macrovalue02: string;
    frtDatearr: any = [];
    frtDate: any;
    scdDate: any;
    timeget: any;

    test: any;
    etitle: any;
    callindex: any;
    setMacroarr: any = [];
    autoenter: any = 0;

    autoenterSet() {
    }

    //建立专案名称

    beginsetting() { // 選擇項目顯示名稱
        // //console.log(this.names);
        // this.choosename=this.names[this.names.length-1];

        this.MacrolistPick = true;
        let obj = {
            "ProfileName": "MacroList"
        }
        this.db.getProfile(obj).then((doc: any) => {
            //console.log('MacroListArr')
            //console.log(doc[0])
            this.MacroContent = doc[0].macrolistArr[doc[0].macrolistArr.length - 1];
            // this.choosename = doc[0].macrolistNames[doc[0].macrolistNames.length - 1];
            //console.log('doc[0].macrolistArr[this.nameindex].length0')
            //console.log(doc[0].macrolistArr.length);

            if (doc[0].macrolistArr[doc[0].macrolistArr.length - 1].length !== 0) {
                this.readdbMacro();
            }


        })
        // this.etitle = this.names[index];
        // this.arrnames = index;
        // this.callindex = index;
        // this.ftltbox = false;//收起
        // this.names[index]要做的事情
        // this.arrindex = index;
    }

    //

    callName(index) { // 選擇項目顯示名稱
        this.macrotake = true;

        this.macrobox.length = 0;
        this.MacrolistPick = true;
        this.choosename = this.names[index];//設定資料夾名稱
        this.nameindex = index;//設定item order
        this.editItemConfirm = this.names[this.nameindex];
        this.ftltbox = !this.ftltbox
        this.fnbtn = false;
        let obj = {
            "ProfileName": "MacroList"
        }
        this.db.getProfile(obj).then((doc: any) => {
            //console.log('MacroListArr');
            //console.log(doc[0]);
            this.MacroContent = doc[0].macrolistArr[this.nameindex];
            //console.log('doc[0].macrolistArr[this.nameindex].length0')
            //console.log(doc[0].macrolistArr[this.nameindex].length);

            if (doc[0].macrolistArr[this.nameindex].length !== 0) {
                this.readdbMacro();
            }


        })
        // this.etitle = this.names[index];
        // this.arrnames = index;
        // this.callindex = index;
        // this.ftltbox = false;//收起
        // this.names[index]要做的事情
        // this.arrindex = index;

        this.ftltbox = false;

    }

    // editName(event) {
    //     let char = event.key;
    //     if (char == "Enter") {
    //         this.names[this.callindex] = this.etitle;
    //         this.showfn = "block";
    //         this.editinput = false;
    //     }
    // }

    macroName(event) { //確定专案名称改變

        let char = event.key;
        // if (char == "Enter") 
        //console.log(char);

        if (char == "Enter") {
            //console.log('Enter')
            this.showinput = !this.showinput; //轉換為確定方框
            this.ftltbox = false;
            // value = this.choosename;
            // //console.log("pressEnter")
            if (this.tempvalue == "") {
                this.showfn = "block";
                this.showinput = false;
                this.ftltbox = false;
                this.fnbtn = false;
               

                this.alertRemind("名称不可为空白");

                this.names[this.nameindex] = this.editItemConfirm; //放入按下加入鍵預設的值
                this.choosename = this.editItemConfirm;
                //
                // let listposition = this.tempMacrolist.macrolistNames.indexOf(this.choosename);
                // //console.log('找之前的choosename');
                // //console.log(listposition);
                // this.tempMacrolist.macrolistNames.splice(listposition,0,this.editItemConfirm);

                // this.choosename = this.editItemConfirm;
                // //console.log('調整的macro');
                // //console.log(this.editItemConfirm);
                // //console.log(this.tempMacrolist);

                // this.db.UpdateProfile(this.tempMacrolist.id,this.tempMacrolist).then((doc: any) => {
                //     //console.log('儲存名稱更新')
                //     // //console.log(doc[0])

                // })


            }
            else {
                //console.log('按enter')
                //console.log('找之前的choosename');
                //console.log(this.names[this.nameindex]);

                let listposition = this.tempMacrolist.macrolistNames.indexOf(this.names[this.nameindex]);
                //console.log('找之前的choosename位置');
                //console.log(listposition);
                if (listposition !== -1) {
                    this.tempMacrolist.macrolistNames.splice(listposition, 1, this.tempvalue);
                }



                //console.log('調整的macro');
                // //console.log(this.editItemConfirm);
                //console.log(this.tempMacrolist);

                this.db.UpdateProfile(this.tempMacrolist.id, this.tempMacrolist).then((doc: any) => {
                    //console.log('儲存名稱更新')
                    // //console.log(doc[0])
                    this.names[this.nameindex] = this.tempvalue;
                })
            }
        } else {
            //console.log('不是Enter')
        }

    }

    // let char = event.code;
    // // //console.log('Name:' + this.num);
    // // //console.log('thisName:' + this.name);
    // if (char == "Enter" || char == "NumpadEnter") {
    //     // //console.log('name:' + this.name);
    //     //
    //     this.showfn = "block";
    //     this.showinput = false;//隱藏輸入文字框
    //     this.ftltbox = false;//收起選項列
    //     //檢查後再更改
    //     for (let i = 0; i < this.names.length; i++) {
    //         //console.log("當前value值:" + this.tempvalue);
    //         //如果輸入值重複之前的
    //         if (this.tempvalue == this.name[i]) {
    //             //console.log('editcon:' + this.editItemConfirm); 
    //         //    this.names[this.arrnames] = this.editItemConfirm;
    //         this.etitle= this.editItemConfirm;
    //         }
    //     }
    // }

    edit() {
        this.getfocus();
        this.showinput = !this.showinput;
        this.ftltbox = false;

        //

    }


    importadd() {
        let addWord = this.addDefaultName + this.count;
        let countarr = [];
        for (let i = 0; i < this.names.length; i++) {
            if (this.names[i] == addWord) {
                //console.log('等同且' + this.count)
                this.count++;
                // let content = this.names[i].substring(this.names[i].indexOf('稱')+1, this.names[i].length);
                // countarr.push(content);
            }
            for (let i = 0; i < this.names.length; i++) {
                if (this.names.indexOf('專') == 0) {
                    countarr.push(this.names[i].substring(this.names[i].indexOf('稱') + 1, this.names[i].length));
                }
            }
            //console.log('countarr:' + countarr);
            countarr.sort();
            //console.log('countarr:' + countarr);
        }
        //console.log(this.count);
        // this.names.push(this.addDefaultName + this.count);

        //

        //console.log('儲存名稱');
        //console.log(this.addDefaultName + this.count);
        this.choosename = this.addDefaultName + this.count;
        this.tempMacrolist.macrolistNames.push(this.addDefaultName + this.count);
        this.tempMacrolist.macrolistArr.push([]);

        this.db.UpdateProfile(this.tempMacrolist.id, this.tempMacrolist).then((doc: any) => {


        })
    }

    add() {
        this.getfocus();
        setTimeout(() => {
            this.recordready = false;
            let addWord = this.addDefaultName + this.count;
            let countarr = [];
            for (let i = 0; i < this.names.length; i++) {
                if (this.names[i] == addWord) {
                    //console.log('等同且' + this.count)
                    this.count++;
                    // let content = this.names[i].substring(this.names[i].indexOf('稱')+1, this.names[i].length);
                    // countarr.push(content);
                }
                for (let i = 0; i < this.names.length; i++) {
                    if (this.names.indexOf('專') == 0) {
                        countarr.push(this.names[i].substring(this.names[i].indexOf('稱') + 1, this.names[i].length));
                    }
                }
                //console.log('countarr:' + countarr);
                countarr.sort();
                //console.log('countarr:' + countarr);
            }
            //console.log(this.count);
            // this.names.push(this.addDefaultName + this.count);

            //
            // this.count=this.count+1;

            //console.log('儲存名稱');
            //console.log(this.addDefaultName + this.count);
            this.choosename = this.addDefaultName + this.count;




            // let obj = {
            //     "ProfileName": "MacroList",
            // }

            // this.db.getProfile(obj).then((doc: any) => {
            //     // let obj2 = {
            // 	"ProfileName": "MacroList",
            // 	"macrolistNames":['test1'],
            // 	"11macrolistArr":[]
            // }
            // "macrolistNames":['test1'],

            this.tempMacrolist.macrolistNames.push(this.addDefaultName + this.count);
            this.tempMacrolist.macrolistArr.push([]);

            //console.log('存入的obj')
            //console.log(this.tempMacrolist);


            this.db.UpdateProfile(this.tempMacrolist.id, this.tempMacrolist).then((doc: any) => {
                //console.log('儲存名稱更新')

                // let position=this.tempMacrolist.macrolistNames.indexOf(this.addDefaultName + this.count);
                // //console.log('儲存名稱更新222');
                // //console.log(position);
                this.openOpt();

                setTimeout(() => {
                    //console.log('33333333');
                    //console.log(this.tempMacrolist.macrolistNames);
                    this.callName(this.tempMacrolist.macrolistNames.length - 1);
                }, 1000);





            })
            // })
        }, 200);

    }


    delete() {
        this.getfocus();
        setTimeout(() => {
            this.callName(this.nameindex - 1);

            this.MacrolistPick = true;

            // this.names.splice(this.nameindex, 1);
            // // this.Openobbox=false;
            // this.choosename = this.names[0];
            // if (this.nameindex == 0) {
            //     this.names.splice(0, 0, this.addDefaultName + 1);
            // }

            // let obj = {
            //     "ProfileName": this.choosename
            // }
            // // "macrolistNames":['test1'],
            let listposition = this.tempMacrolist.macrolistNames.indexOf(this.names[this.nameindex + 1]);
            this.tempMacrolist.macrolistNames.splice(listposition, 1);
            this.tempMacrolist.macrolistArr.splice(listposition, 1);

            this.db.UpdateProfile(this.tempMacrolist.id, this.tempMacrolist).then((doc: any) => {
                //console.log('刪除id名稱更新');
                // this.openOpt();
                this.ftltbox = false;
                this.fnbtn = false;

            })

            //
            let obj = {
                "ProfileName": "MacroList"
            }
            this.db.getProfile(obj).then((doc: any) => {
                // //console.log('MacroListArr')
                // //console.log(doc[0])
                //console.log(this.names[0]);
                let position = doc[0].macrolistNames.indexOf(this.names[0]);

                this.MacroContent = doc[0].macrolistArr[position];
                //console.log('doc[0].macrolistArr[this.nameindex].length0')
                //console.log(this.MacroContent.length);
                //console.log(this.MacroContent);

                if (this.MacroContent.length !== 0) {
                    //console.log('出現');
                    this.readdbMacro();


                }
            })

            if (this.names.length - 1 == 0) { //若刪到剩下最後一個， this.count=1;
                this.count = 1;
            }
            let vm = this;
            setTimeout(() => {
                this.blurClose = 1;
                clearInterval(this.stopScroll);
                this.macroBorder = false;
                // this.everysinglemacro = 0;
                // this.frtDatearr[0] = this.frtDate.getTime(); //回復預設時間
                document.getElementById("myAnchor").blur();
                document.getElementById("writeMacro").classList.remove('disabled');
                this.thefstTimeStamp.length = 0;
                this.theScdTimeStamp.length = 0;
                // if(this.thefstTimeStamp.length==0 || this.theScdTimeStamp.length==0){
                //     alert('有清空時間動作')
                // }
                // document.getElementById("writeMacro").style.border = "1px solid transparent";
                this.record = false;
                //console.log(this.record);

                this.pressboolean = true;
                this.releaseboolean = true;
                this.showedit = 'none';

                //
                let obj = {
                    "ProfileName": "MacroList"
                }
                this.db.getProfile(obj).then((doc: any) => {
                    //console.log('MacroList')
                    //console.log(doc[0]);
                    this.names = doc[0].macrolistNames;
                    this.choosename = this.names[0];
                    this.clearOpt = true;
                    console.log('nameindex:', this.nameindex);
                    if (this.nameindex == -1) {
                        this.choosename = "请选择专案名称"
                    }
                    // this.macrotake = false;
                    //console.log('checkBerforeSend');
                    // this.checkBerforeSend();
                    // setTimeout(() => {
                    //     this.macrotake = true;
                    // }, 5000);
                })
            }, 100);
        }, 200);

    }
    // //console.log(this.count);
    // this.names.push(this.addDefaultName + this.count);
    // //
    // this.editItemConfirm = this.names[this.arrnames];
    // this.showfn = "none";
    // this.showinput = true;
    // this.ftltbox = true;
    // this.fnbtn = false;
    // //console.log('newWords' + this.newWords + this.num);
    // //console.log('num:' + this.num);
    // this.names.push(this.newWords + this.num);
    // for (let i = 0; i < this.names.length; i++) {
    //     for (let i = 0; i < this.names.length; i++) {
    //         if (this.names[i] == this.newWords + this.num) {
    //             this.num++
    //             //console.log(this.num);
    //         }
    //         // else{
    //         //     this.num++
    //         //     this.names.push(this.newWords);
    //         // }
    //     }
    // }
    copyMacro() {

        this.loading(2);
        let obj = {
            "ProfileName": "MacroList"
        }
        this.db.getProfile(obj).then((doc: any) => {
            //console.log('MacroList')
            //console.log(doc[0]);
            this.names = doc[0].macrolistNames;
            // this.choosename = doc[0].macrolistNames[0];
            this.clearOpt = true;

            this.macrotake = false;
            //console.log('checkBerforeSend');
            this.checkBerforeSend();
            setTimeout(() => {
                this.macrotake = true;
            }, 5000);
        })

        // this.Macroforimport();
        document.getElementById('showmorebox').classList.add("disabled");
        document.getElementById('showmorebox').style.opacity = "0";

        this.ftltbox = false;
        this.fnbtn = false;
        this.MacrolistPick = true;
        // let tempDbdata=this.setintoDBMacro;
        setTimeout(() => {
            let addWord = this.addDefaultName + this.count;
            let countarr = [];
            for (let i = 0; i < this.names.length; i++) {
                if (this.names[i] == addWord) {
                    //console.log('等同且' + this.count)
                    this.count++;
                    // let content = this.names[i].substring(this.names[i].indexOf('稱')+1, this.names[i].length);
                    // countarr.push(content);
                }
                for (let i = 0; i < this.names.length; i++) {
                    if (this.names.indexOf('專') == 0) {
                        countarr.push(this.names[i].substring(this.names[i].indexOf('稱') + 1, this.names[i].length));
                    }
                }
                //console.log('countarr:' + countarr);
                countarr.sort();
                //console.log('countarr:' + countarr);
            }
            //console.log(this.count);
            // this.names.push(this.addDefaultName + this.count);

            //

            //console.log('儲存名稱');
            //console.log(this.addDefaultName + this.count);
            this.choosename = this.addDefaultName + this.count;

            // let obj = {
            //     "ProfileName": "MacroList",
            // }

            // this.db.getProfile(obj).then((doc: any) => {
            //     // let obj2 = {
            // 	"ProfileName": "MacroList",
            // 	"macrolistNames":['test1'],
            // 	"11macrolistArr":[]
            // }
            // "macrolistNames":['test1'],

            this.tempMacrolist.macrolistNames.push(this.addDefaultName + this.count);
            this.tempMacrolist.macrolistArr.push(this.setintoDBMacro);
            // this.tempMacrolist.macrolistArr[this.tempMacrolist.macrolistArr.length-2]=this.setintoDBMacro;//蓋回原本內容

            //console.log('存入的obj')
            //console.log(this.tempMacrolist.macrolistArr.length - 2);
            //console.log(this.setintoDBMacro);
            // this.tempMacrolist.macrolistArr[0]=tempDbdata;
            //console.log(this.tempMacrolist);

            // this.openOpt();


            this.db.UpdateProfile(this.tempMacrolist.id, this.tempMacrolist).then((doc: any) => {
                // this.openOpt();
                let obj = {
                    "ProfileName": "MacroList"
                }
                this.db.getProfile(obj).then((doc: any) => {
                    //console.log('MacroList')
                    //console.log(doc[0]);
                    this.names = doc[0].macrolistNames;
                    this.loading(3);
                    // this.choosename = doc[0].macrolistNames[0];
                    // this.clearOpt = true;

                    // this.macrotake = false;
                    // //console.log('checkBerforeSend');
                    // // this.checkBerforeSend();
                    // setTimeout(() => {
                    //     this.macrotake = true;
                    // }, 5000);
                })
            })
        }, 2000);

        //     //console.log('儲存名稱更新')
        //     this.openOpt();

        //     // //console.log(doc[0])

        //     let position = this.tempMacrolist.macrolistNames.indexOf(this.addDefaultName + this.count);
        //     //console.log('位置');
        //     //console.log(position);
        //     this.MacroContent = this.tempMacrolist.macrolistArr[position];
        //     //console.log('cp=opy')
        //     //console.log(this.MacroContent.length);
        //     //console.log(this.MacroContent);

        //     if (this.MacroContent.length !== 0) {
        //         //console.log('出現');
        //         this.readdbMacro();
        //     }

        // })
    }

    proName(value) { //編輯a內容
        // this.name = value;
        // //console.log('thisname:' + this.name)
        // window.addEventListener('keydown', (e) => {

        // })
        this.tempvalue = value;
    }


    //macro內容
    editItemKeyUp(event) { //確認調整macro內容
        //console.log('毫秒111')
        //console.log(this.macrobox[this.arrindex].indexOf('：'));
        //console.log(this.macrobox[this.arrindex].length);
        let char = event.key;
        let keycode = event.code;

        if (char == "Enter") {
            //console.log('毫秒222')
            //console.log(this.macrobox[this.arrindex].indexOf('：'));
            //console.log(this.macrobox[this.arrindex].length);

            this.showedit = "none"; //修改input透明度
            document.getElementById('btnarea').classList.add('disabled'); //屏蔽btn 直到使用者選定item

            for (let i = 0; i < this.macrobox.length; i++) {
                document.getElementsByClassName('test')[i].classList.remove("disabled");
            }

            if (this.macrobox[this.arrindex].indexOf('⏰') == 0) {
                // //console.log(this.macrobox[this.arrindex].indexOf("毫秒")); this.macrobox[this.arrindex].indexOf("毫秒")
                if (this.macrobox[this.arrindex].indexOf("毫秒") === -1) {

                    this.macrobox[this.arrindex] = this.macrobox[this.arrindex] + "毫秒"; //檢查是否有加毫秒

                    //console.log('毫秒333')
                    //console.log(this.macrobox[this.arrindex].indexOf('：'));
                    //console.log(this.macrobox[this.arrindex].length);


                    if (this.macrobox[this.arrindex].indexOf('：') + 3 == this.macrobox[this.arrindex].length) {
                        //console.log('是0')
                        // this.macrobox[this.arrindex] = this.macrobox[this.arrindex].substring(0, 4) + 0 + '毫秒';
                        let nowdata = this.macrobox[this.arrindex];
                        let timeprint = parseFloat(nowdata);
                        let insertplace = nowdata.indexOf('：') + 1;
                        let inserend = nowdata.indexOf('毫秒');
                        this.macrobox[this.arrindex] = nowdata.substr(0, insertplace) + 0 + nowdata.substr(inserend, nowdata.length);
                    }
                    // if (this.macrobox[this.arrindex].indexOf(':') + 1 !== "") {
                    //     this.macrobox[this.arrindex] = this.macrobox[this.arrindex].substring(0, 4) + 0 + '毫秒';
                    //     //console.log('毫秒222');
                    //     //console.log(this.macrobox[this.arrindex].substring(0, 6))
                    // //console.log('毫秒33');
                    //     //console.log(this.macrobox[this.arrindex].substring(0, 4));
                    // }
                } else {


                    if (this.macrobox[this.arrindex].indexOf('：') + 3 == this.macrobox[this.arrindex].length) {
                        //console.log('是0')
                        // this.macrobox[this.arrindex] = this.macrobox[this.arrindex].substring(0, 4) + 0 + '毫秒';
                        let nowdata = this.macrobox[this.arrindex];
                        let timeprint = parseFloat(nowdata);
                        let insertplace = nowdata.indexOf('：') + 1;
                        let inserend = nowdata.indexOf('毫秒');
                        this.macrobox[this.arrindex] = nowdata.substr(0, insertplace) + 0 + nowdata.substr(inserend, nowdata.length);

                    }

                }
                // else{
                //     // v.substring(0, v.indexOf('秒'));
                //     this.macrobox[this.arrindex] = this.macrobox[this.arrindex]+0+ "毫秒"; //檢查是否有內容 
                //     //console.log('毫秒222') 
                // }
            }
            //     if (this.macrobox[this.arrindex].indexOf('👇🏻') == 0) {
            //         //console.log('atkey:' + this.keycodeContent);
            //         this.macrobox[this.arrindex] = this.macrobox[this.arrindex] + this.keycodeContent;
            //     }
            //     if (this.macrobox[this.arrindex].indexOf('🖐🏻') == 0) {
            //         //console.log('atkey:' + this.keycodeContent);
            //         this.macrobox[this.arrindex] = this.macrobox[this.arrindex] + this.keycodeContent;
            //     }
            //     for (let i = 0; i < this.macrobox.length; i++) {//阻擋選取其他item
            //         document.getElementsByClassName('test')[i].classList.remove("disabled");
            //     }
        }
    }


    keycodeGet(event) {
        let char = event.code;

        let keyplace = this.eventCodeArr.indexOf(char);

        char = this.KBarr[keyplace];
        this.keycodeContent = char;
        //console.log(char); //對應keycode儲存
        // //console.log("key:"+this.keycodeContent);
    }

    confirminput() {
        for (let i = 0; i < document.getElementsByClassName("standbtn").length; i++) {
            document.getElementsByClassName("standbtn")[i].classList.remove("disabled");
            //console.log('disable');
        }
        // this.showedit = "none";//回到macrobox
        this.macrobox[this.arrindex] = this.macrobox[this.arrindex] + this.keycodeContent;
    }

    confirm(event) { //確定keycode的值
        let char = event.code;
        this.editKeyBoolean = true;//輸入input reset
        // if (char == "Enter" || char == "NumpadEnter") {
        //     this.confirminput()
        //     document.getElementById('btnarea').classList.remove('disabled');
        // }
        for (let i = 0; i < this.macrobox.length; i++) {//阻擋選取其他item
            document.getElementsByClassName('test')[i].classList.remove("disabled");
        }
    }

    checkpattern(v) {
        if (v.indexOf('⏰') == 0 && v.indexOf("毫") !== -1) {
            this.macrobox[this.arrindex] = v.substring(0, v.indexOf('秒'));
            this.macrobox[this.arrindex] = v.substring(0, v.indexOf('毫'));
        }
        if (v.indexOf('👇🏻') == 0 && v.indexOf("：") !== -1) {
            this.macrobox[this.arrindex] = v.substring(0, 7);
            this.editKeyBoolean = false;
            document.getElementById("keycode").focus();
            document.getElementById('btnarea').classList.add('disabled');
            //把值帶入input
        }
        if (v.indexOf('🖐🏻') == 0 && v.indexOf("：") !== -1) {
            this.macrobox[this.arrindex] = v.substring(0, 7);
            this.editKeyBoolean = false;
            document.getElementById("keycode").focus();
            document.getElementById('btnarea').classList.add('disabled');
            //把值帶入input
        }
        //     if (v.indexOf('毫') == -1 && v.indexOf('秒') == -1 ) {
        //         this.macrobox[this.arrindex] = this.tempmacro + "毫秒";
        // }
    }

    editItem(value) {
        //console.log('editItem')
        if (value == "👇🏻按下") {
            this.macrobox[this.arrindex] = this.tempmacro;
        } else if (value == "⏰计时") {
            this.macrobox[this.arrindex] = this.tempmacro;
        } else if (value == "🖐🏻放开") {
            this.macrobox[this.arrindex] = this.tempmacro;
        }
        this.checkpattern(value);
    }


    editItemContent() {
        document.getElementById('btnarea').classList.add('disabled');
        this.showChangeInput(this.EnterText,'Tinput')
        document.getElementById('showeditItem').classList.remove('disabled');
        // this.record=false;
        // document.getElementById("writeMacro").style.border="1px solid transparent";
        // this.getfocustimes=1;
        // this.getfocus();
        //console.log('editconfirmm');
        //    選定調整內容時禁止點選其他item
        for (let i = 0; i < this.macrobox.length; i++) {
            document.getElementsByClassName('test')[i].classList.add("disabled");
        }
        //顯示調整框
        if (this.macrobox[this.arrindex]) {//如果有選定內容才出現
            // //console.log(this.macrobox[this.arrindex]);
            // this.showedit = "block";
            document.getElementById('showeditItem').style.opacity="1";
            //input margintop移到調整位置
            document.getElementById('showeditItem').style.marginTop = -(this.macrobox.length - this.arrindex) * 30 + "px";
            // document.getElementById('showeditItem').style.marginTop = -(this.macrobox.length - this.arrindex) * 30 + "px";
        }
        if (this.pressIf == true || this.releaseIf == true) {
            document.getElementById("keycode").focus();
            this.blurChangeInput(this.EnterText,'Tinput');
            // document.getElementById('showeditItem').classList.remove('disabled');
        }
        //啟動後禁止點選其他item
    }


    deletAll() {
        this.macrobox.length = 0;
    }

    deletItem() {
        this.macrobox.splice(this.arrindex, 1);
    }

    CopyItem() {
        this.copybox = this.macrobox[this.arrindex];
    }

    PasteItem() {
        if (this.copybox) {//如果有選定內容才做
            this.macrobox.splice(this.arrindex, "0", this.copybox);
        }
        //點選到任一位置貼上
    }

    additem() {
        let nowmove = this.macrobox[this.arrindex];//選定的位置
        this.macrobox.splice(this.arrindex, "0", this.macrobox[this.arrindex]);
    }

    moveUp() {
        if (this.arrindex >= 1) {
            let nowmove = this.macrobox[this.arrindex];//選定的位置
            let previous = this.macrobox[this.arrindex - 1];//選定的位置
            this.macrobox[this.arrindex] = previous;
            this.macrobox[this.arrindex - 1] = nowmove;
            this.arrindex--;
        } else {
            this.alertRemind('已經為最上層');
        }
        //console.log('macrobox' + this.macrobox);

        //  else if (this.arrindex == this.names.length) {
        //     this.names[this.names.length] = nowmove;
        //     this.names[this.names.length-1] = previous;
        //     alert('已經為最下層');

        // }
    }

    moveDown() {
        if (this.arrindex < this.macrobox.length - 1) {
            let nowmove = this.macrobox[this.arrindex];//選定的位置
            let next = this.macrobox[this.arrindex + 1];//選定的位置
            this.macrobox[this.arrindex] = next;//執行加一的位置
            this.macrobox[this.arrindex + 1] = nowmove;//加一的位置
            this.arrindex++;
        } else {
            this.alertRemind('已經為最下層');
            
        }
    }


    timetoZero() {
        //console.log('timetoZero');
        //console.log(this.macrobox);
        for (let index = 0; index < this.macrobox.length; index++) {
            if (this.macrobox[index].indexOf('⏰') == 0) {
                let nowdata = this.macrobox[index];
                let timeprint = parseFloat(nowdata);
                let insertplace = nowdata.indexOf('：') + 1;
                let inserend = nowdata.indexOf('毫秒');
                this.macrobox[index] = nowdata.substr(0, insertplace) + 0 + nowdata.substr(inserend, nowdata.length);
                //    //console.log(nowdata.substr(0, insertplace));
                // //console.log(nowdata.replace(timeprint, 0));
                //console.log(this.macrobox[index]);
            }

        }
    }

    timeOff: boolean = false;
    confirmInput() {
        let nowitem = this.macrobox[this.arrindex];
        if (nowitem.indexOf('⏰') == 0) {
            if (this.Timevalue !== undefined && this.Timevalue !== "请输入时间") {
                if (this.Timevalue < 0 || this.Timevalue > 327670 || isNaN(this.Timevalue)) {
                    this.Timevalue = 10;
                    this.timeOff = true;
                    setTimeout(() => {
                        this.timeOff = false;
                    }, 3000);
                }
                this.confirmTime = this.Timevalue;
                this.macrobox[this.arrindex] = "⏰计时：" + this.confirmTime + "毫秒";

            } else {
                this.macrobox[this.arrindex] = this.macrobox[this.arrindex];
            }
            //console.log('是毫秒');



        }

        if (nowitem.indexOf('👇🏻') == 0) {
            //console.log(this.keycodeContent);
            if (this.keycodeContent !== undefined && this.keycodeContent !== "请按键盘按键") {
                this.confirmTime = this.keycodeContent;
                this.macrobox[this.arrindex] = "👇🏻按下：" + this.confirmTime;
            }

            //console.log('是按下');
        }

        if (nowitem.indexOf('🖐🏻') == 0) {
            //console.log(this.keycodeContent);
            if (this.keycodeContent !== undefined && this.keycodeContent !== "请按键盘按键") {
                this.confirmTime = this.keycodeContent;
                this.macrobox[this.arrindex] = "🖐🏻放开：" + this.confirmTime;
            }

            //console.log('是放开');
        }


        //
        // this.macrobox[this.arrindex] = "⏰计时：" + this.confirmTime + "毫秒"

        // this.editKeyBoolean=false;
        this.showedit = "none";


        document.getElementById('btnarea').classList.remove('disabled');
        // this.record=false;
        // document.getElementById("writeMacro").style.border="1px solid transparent";
        // this.getfocustimes=1;
        // this.getfocus();
        //console.log('editconfirmm');
        //    選定調整內容時禁止點選其他item
        for (let i = 0; i < this.macrobox.length; i++) {
            document.getElementsByClassName('test')[i].classList.remove("disabled");
        }

    document.getElementById('showeditItem').style.opacity="0";
    document.getElementById('showeditItem').classList.add('disabled');
    
    


    }

    editTimeremain(event) {
        let char = event.key;
        if (char == "Enter" || char == "NumpadEnter") {

        if(this.pressIf==false && this.releaseIf==false){
            if (this.Timevalue < 0 || this.Timevalue > 327670 || isNaN(this.Timevalue)) {
                this.Timevalue = 10;
                this.timeOff = true;
                setTimeout(() => {
                    this.timeOff = false;
                }, 3000);
            }
        }
            //console.log('按下enter');
            //console.log(this.Timevalue);
            this.confirmInput()
            // this.confirmTime = this.Timevalue;
            //macrobox裡面的內容更新
            // let nowitem = this.macrobox[this.arrindex];
            // if (nowitem.indexOf('⏰') == 0) {
            //     this.confirmTime = this.Timevalue;
            //     this.macrobox[this.arrindex] = "⏰计时：" + this.confirmTime + "毫秒";
            //     //console.log('是毫秒');



            // }

            // if (nowitem.indexOf('👇🏻') == 0) {
            //     //console.log(this.keycodeContent);
            //     if (this.keycodeContent !== undefined) {
            //         this.confirmTime = this.keycodeContent;
            //         this.macrobox[this.arrindex] = "👇🏻按下：" + this.confirmTime;
            //     }

            //     //console.log('是按下');
            // }

            // if (nowitem.indexOf('🖐🏻') == 0) {
            //     //console.log(this.keycodeContent);
            //     if (this.keycodeContent !== undefined) {
            //         this.confirmTime = this.keycodeContent;
            //         this.macrobox[this.arrindex] = "🖐🏻放开：" + this.confirmTime;
            //     }

            //     //console.log('是放开');
            // }


            // //
            // // this.macrobox[this.arrindex] = "⏰计时：" + this.confirmTime + "毫秒"

            // // this.editKeyBoolean=false;
            // this.showedit = "none";


            // document.getElementById('btnarea').classList.remove('disabled');
            // // this.record=false;
            // // document.getElementById("writeMacro").style.border="1px solid transparent";
            // // this.getfocustimes=1;
            // // this.getfocus();
            // //console.log('editconfirmm');
            // //    選定調整內容時禁止點選其他item
            // for (let i = 0; i < this.macrobox.length; i++) {
            //     document.getElementsByClassName('test')[i].classList.remove("disabled");
            // }

        }

    }

    editTimeContent(event) {
        let char = event.key;



    }

    callitem(index) { // 選擇項目顯示名稱
        this.timeIf = false;
        this.pressIf = false;
        this.releaseIf = false;


        this.record = false;
        document.getElementById("writeMacro").style.border = "1px solid transparent";
        document.getElementById('btnarea').classList.remove('disabled');
        this.tempmacro = this.macrobox[index]//為點選的該值，選定item存入
        this.showedit = false;//關閉調整內容框

        for (let i = 0; i < this.macrobox.length; i++) {
            document.getElementsByClassName('test')[i].classList.remove("redBG");
            // if(i==index){
            //     //console.log(index);
            // }
        }

        this.ftltbox = false;//收起
        //css顯示文字
        this.arrindex = index;
        document.getElementsByClassName('test')[index].classList.add("redBG");

        //判斷是item內容是按下、放开、毫秒
        let nowitem = this.macrobox[this.arrindex];
        if (nowitem.indexOf('⏰') == 0) {
            this.timeIf = true;
            let head = this.macrobox[this.arrindex].indexOf('：') + 1;
            let timestring = this.macrobox[this.arrindex].substring(head, this.macrobox[this.arrindex].length - 2).toLowerCase();
            this.EnterText = timestring ;
            if(this.EnterText==undefined || this.EnterText=="" || this.EnterText==null){
                this.EnterText=10;
            }
            //console.log('是毫秒');

        }

        if (nowitem.indexOf('👇🏻') == 0) {
            this.pressIf = true;

            let head = this.macrobox[this.arrindex].indexOf('：') + 1;
            let wordstring = this.macrobox[this.arrindex].substring(head, this.macrobox[this.arrindex].length)
            this.keycodeContent = wordstring;
            if(this.keycodeContent==undefined || this.keycodeContent=="" || this.keycodeContent==null){
                this.keycodeContent='请按键盘按键';
            }
            // this.blurChangeInput(this.EnterText,'Tinput');
            //console.log('是按下');
        }

        if (nowitem.indexOf('🖐🏻') == 0) {
            this.releaseIf = true;
            let head = this.macrobox[this.arrindex].indexOf('：') + 1;
            let wordstring = this.macrobox[this.arrindex].substring(head, this.macrobox[this.arrindex].length);
            this.keycodeContent = wordstring;
            if(this.keycodeContent==undefined || this.keycodeContent=="" || this.keycodeContent==null){
                this.keycodeContent='请按键盘按键';
            }
            // this.blurChangeInput(this.EnterText,'Tinput');
            //console.log('是放开');
        }


        //



    }


    afterPush() {
        this.num++;
        //console.log('num:' + this.num);
    }


    WhichMacroItem() { // 選定後要做的事
        //console.log(this.names);
    }

    //檢查並補齊下給硬體的格式

    checkBerforeSend() {

        let Parr=[];
        let Rarr=[];
        let Tarr=[];
        //console.log('testmacrotake0000');
        //console.log(this.macrotake);
        //console.log('this.macrosavecick');
        //console.log(this.macrosavecick)
        //按保存
        let obj = {
            "ProfileName": "MacroList"
        }
        this.db.getProfile(obj).then((doc: any) => {
            //console.log('MacroList')
            //console.log(doc[0]);
            this.names = doc[0].macrolistNames;
        })
        //
        clearInterval(this.stopScroll);
        this.showedit = 'none';
        if (this.macrobox.length == 0) {
            if (this.macrotake) {
                this.alertRemind('请输入内容');
            }
            // this.pressboolean = false;
            // this.thepressword.length=0;

            this.macrosavecick = 1;
            // this.loading(0);
        } else {
            this.macrosavecick = 0;
        }
        //console.log('checkBerforeSend');
        if (this.macrosavecick == 0) {



            this.gamemoment = "stopApmode";
            this.outputGame();
            this.macrosavecick = 1;
            this.loading(1);
            this.record = false;
            this.macroBorder = false;
            document.getElementById("writeMacro").style.border = "1px solid transparent";
            // this.cancelPage()
            //console.log('yes');

            this.theTimeword.length = 0;
            this.thepressword.length = 0;
            this.theReleaseword.length = 0;
            this.keycontent.length = 0;
            this.Rewordnum.length = 0;
            // this.setMacroarr.length = 0;


            for (let i = 0; i < this.macrobox.length; i++) {

                // if (this.macrobox[i].indexOf('🖐🏻') == 0) {
                //     if(this.macrobox[i+1].indexOf('⏰')==0){
                //         //console.log('多餘延遲時間');
                //         this.macrobox.splice(i+1,1);
                //     }

                // }
                if (this.macrobox[i] == '-可继续往下录製-') {
                    this.macrobox[i] = "⏰计时：1毫秒"
                }

                if (this.macrobox[this.macrobox.length - 1] == '-可继续往下录製-') {
                    this.macrobox.pop();
                }

                if (this.macrobox[i].indexOf('👇🏻') == 0) {

                    Parr.push(this.macrobox[i]);

                    let head = this.macrobox[i].indexOf('：') + 1;
                    let wordstring = this.macrobox[i].substring(head, this.macrobox[i].length)
                    // wordstring = wordstring.toLowerCase();

                    this.thepressword.push(wordstring); //所有按下的值

                    let keyplace = this.KBarr.indexOf(wordstring);
                    // this.eventCodeArr[keyplace];

                    this.keycontent.push(this.MarcroMap.indexOf(this.eventCodeArr[keyplace].toLowerCase())); //keycontent
                    //console.log(wordstring);
                    //console.log(this.keycontent);

                    // this.keytype.push(0x80);
                    this.setMacroarr[i] = 0x80;
                    // this.setMacroarr[i+2]=this.MarcroMap.indexOf(wordstring);
                    //console.log('press111');
                    //console.log(this.setMacroarr);

                }
                // //console.log('thispress:'+this.wordnum);


                // for (let RE = 0; RE < this.theReleaseword.length; RE++) {//檢查放开鍵
                //     let REorder = this.theReleaseword.indexOf(wordstring);//在REleaseword中的位置;
                //     this.Rewordnum = this.theReleaseword[REorder];
                //     // this.setMacroarr[this.setMacroarrOrder + 2] = Rewordnum; //下值放开的鍵;
                // }


                // //console.log(this.theword); 
                // //console.log('head:'+head);
                // //console.log('所有按下：'+theword);
                // 所有按下的鍵the word
                // theReleaseword


                if (this.macrobox[i].indexOf('🖐🏻') == 0) {

                    Rarr.push(this.macrobox[i]);

                    let head = this.macrobox[i].indexOf('：') + 1;
                    let rewordstring = this.macrobox[i].substring(head, this.macrobox[i].length)
                    // if (rewordstring == "") {
                    //     rewordstring = 0;
                    // }
                    let keyplace = this.KBarr.indexOf(rewordstring);


                    this.theReleaseword.push(rewordstring);
                    // //console.log('reword:' + rewordstring);
                    this.keycontent.push(this.MarcroMap.indexOf(this.eventCodeArr[keyplace].toLowerCase()));//keycontent



                    // this.keytype.push(0x00);
                    this.setMacroarr[i] = 0x00;
                    // this.setMacroarr[i+2]=this.MarcroMap.indexOf(rewordstring);
                    //console.log('release111');
                    //console.log(this.setMacroarr);
                    // //console.log(this.theword); 
                    // //console.log('head:'+head);
                    // //console.log('所有按下：'+theword);
                    // 所有按下的鍵the word
                    // theReleaseword
                }

                if (this.macrobox[i].indexOf('⏰') == 0) {
                    Tarr.push(this.macrobox[i]);

                    let head = this.macrobox[i].indexOf('：') + 1;
                    let timestring = this.macrobox[i].substring(head, this.macrobox[i].length - 2).toLowerCase();
                    // this.distantTime.push(timestring);
                    // this.setMacroarr[i] = parseInt(timestring);
                    if (timestring > 327670) {
                        timestring = 327670
                    }
                    this.setMacroarr[i] = Math.round(parseInt(timestring) / 10);
                    //console.log('clock1111');
                    //console.log(this.setMacroarr);
                    // //console.log(this.theword); 
                    // //console.log('head:'+head);
                    // //console.log('所有按下：'+theword);
                    // 所有按下的鍵the word
                    // theReleaseword

                }


                if(i==this.macrobox.length-1){
                    if(Parr.length !== Rarr.length){
                        this.alertRemind('發現不正常錄製行為，請重新錄製');
                        this.pressboolean = false;
                        this.releaseboolean = false;
                        // this.thepressword.length=0;

                        this.macrosavecick = 0
                        this.loading(0);
                    
                        
                    }

                    if(Tarr.length >= (Rarr.length + Parr.length)){
                        this.alertRemind('發現不正常錄製行為，請重新錄製');
                        this.pressboolean = false;
                        this.releaseboolean = false;
                        // this.thepressword.length=0;

                        this.macrosavecick = 0
                        this.loading(0);
                    }
        
                }


                // if (i == this.macrobox.length - 1) {
                //     // this.setMacroarr[1].splice(0,0,0)
                //     //console.log('看arr');
                //     let checkarr = [];
                //     let basic = 1;

                //     //console.log(this.setMacroarr);
                //     for (let index = 0; index < this.setMacroarr.length; index++) {
                //         //console.log('看arr222');

                //         checkarr.push(basic + (index) * 2); //要改的毫秒放進
                //         //console.log(this.setMacroarr);
                //         // //console.log('全部');
                //         // //console.log(checkarr);
                //         // //console.log('流程');
                //         // //console.log(basic + (index) * 2);


                //         if (index == this.setMacroarr.length - 1) {//結束的時候
                //             //console.log('結束的時候')
                //             //console.log(checkarr);
                //             //console.log(this.setMacroarr);

                //             for (let i = 0; i < checkarr.length; i++) {//1,3,5...
                //                 //console.log('測試');
                //                 //console.log(checkarr[i]);

                //             //     this.setMacroarr[checkarr[i]+2] = this.setMacroarr[checkarr[i]];



                //             //     // if(i==checkarr.length-1){
                //             //     //     //console.log('改第一個毫秒')
                //             //     //     this.setMacroarr[1] = 1;
                //             //     // }
                //             }


                //         }
                //         //     this.setMacroarr[index+3]=this.setMacroarr[index];
                //         //     //console.log('調整時間');
                //         //     //console.log(this.setMacroarr);

                //     }
                //     // fruits.splice(2, 0, "Lemon", "Kiwi");
                // }
            }




            // //console.log(this.wordnum);
            // //console.log(this.Rewordnum);


            // //console.log(this.thepressword);
            // //console.log(this.theReleaseword);

            // this.setMacroarr[1] = 1;//初始時間;
            this.setInArr();

            //console.log('setMacroarr:');
            //console.log(this.setMacroarr);

            // //console.log('press:' + this.thepressword);
            // //console.log('release:' + this.theReleaseword);

            // for (let i = 0; i <this.thepressword.length; i++){ //
            //     let press=this.thepressword[i]
            //     let order=this.theReleaseword.indexOf(press)

            //     for (let or = 0; or <this.thepressword.length; or++){ //
            //         this.macrobox[or]=press
            //     }

            // }
            if (this.macrobox[0].indexOf("👇🏻") == -1) {
                this.alertRemind('请重新输入');
                // this.pressboolean = false;
                // // this.thepressword.length=0;
                // this.macrobox.length = 0;
                // this.macrosavecick = 0;
                this.reserPage();
            }

            if (this.macrobox[0].indexOf("👇🏻") == -1) {
                this.alertRemind('请重新输入');
            
                this.reserPage();
            }

            // if (this.macrobox.length == 0) {
            //     alert('請輸入內容');
            //     this.pressboolean = false;
            //     // this.thepressword.length=0;

            //     this.macrosavecick = 0
            //     this.loading(0);
            // }


            for (let i = 0; i < this.thepressword.length; i++) { //補上未放开的按鍵
                if (this.theReleaseword.indexOf(this.thepressword[i]) == -1) {
                    // this.theReleaseword.push(this.thepressword[i]);
                    // alert("提醒:尚未加入對應按下鍵，可能鍵盤使用錯誤")
                    let c = confirm('提醒:尚未加入' + this.thepressword[i] + '对应按下键，可能造成键盘使用错误，是否确定存取?');
                    if (c) {
                        this.pressboolean = true;
                    } else {
                        this.alertRemind("此动作已经被取消");
                        this.pressboolean = false;
                        // this.thepressword.length=0;

                        this.macrosavecick = 0
                        this.loading(0);
                    }
                }
            }

            for (let i = 0; i < this.theReleaseword.length; i++) { //補上未放开的按鍵
                if (this.thepressword.indexOf(this.theReleaseword[i]) == -1) {
                    // this.thepressword.push(this.theReleaseword[i]);
                    // alert("提醒:尚未加入對應放开鍵，可能鍵盤使用錯誤")
                    let c = confirm('提醒:尚未加入' + this.theReleaseword[i] + '对应按下键，可能造成键盘使用错误，是否确定存取?');
                    if (c) {
                        this.releaseboolean = true;
                    } else {
                        this.alertRemind("此动作已经被取消");
                        this.releaseboolean = false;
                        // this.theReleaseword.length=0;
                        this.macrosavecick = 0;
                        this.loading(0);
                    }
                }
            }
            // if(confirm('您即將進入酷必網，確定嗎﹖'))
            // {
            //     this.MacrosetIn();
            // }
            // else
            // {
            // alert("此動作已經被取消");
            // window.event.returnValue=false;
            // }
            //console.log('checkp1111');
            if (this.pressboolean && this.releaseboolean) {

                //console.log('執行222');
                if (this.macrotake) {
                    var marcoarr = [];
                    for (let i = 0; i < this.setMacroarr.length; i++) {
                        marcoarr[i] = this.setMacroarr[i]; //排進arr
                    }
                    //console.log('MacroIN:')
                    //console.log(marcoarr);
                    marcoarr.splice(marcoarr.length - 1, 0, 1);
                    //console.log(marcoarr);
                    this.setintoDBMacro = marcoarr;

                    this.setIntoDB();
                    this.setIntoMacroLIst();
                    //再下值

                    setTimeout(() => {
                        this.MacrosetIn();
                    }, 1000);

                } else {
                    var marcoarr = [];
                    for (let i = 0; i < this.setMacroarr.length; i++) {
                        marcoarr[i] = this.setMacroarr[i]; //排進arr
                    }
                    //console.log('MacroIN:')
                    //console.log(marcoarr);
                    marcoarr.splice(marcoarr.length - 1, 0, 1);
                    //console.log(marcoarr);
                    this.setintoDBMacro = marcoarr;

                    this.setIntoDB();
                    this.setIntoMacroLIst();
                }
                // this.readyforDb();
                //console.log('setMacroarr:88888');
                //console.log(this.setMacroarr);
            }
        }
    }



    Macroforimport() {
        let Parr=[];
        let Rarr=[];
        let Tarr=[];

        this.gamemoment = "stopApmode";
        this.outputGame();
        this.macrosavecick = 1;
        this.loading(1);
        this.record = false;
        this.macroBorder = false;
        document.getElementById("writeMacro").style.border = "1px solid transparent";
        // this.cancelPage()
        //console.log('yes');
        // this.keywasSet();
        this.theTimeword.length = 0;
        this.thepressword.length = 0;
        this.theReleaseword.length = 0;
        this.keycontent.length = 0;
        this.Rewordnum.length = 0;
        // this.setMacroarr.length = 0;


        for (let i = 0; i < this.macrobox.length; i++) {

            // if (this.macrobox[i].indexOf('🖐🏻') == 0) {
            //     if(this.macrobox[i+1].indexOf('⏰')==0){
            //         //console.log('多餘延遲時間');
            //         this.macrobox.splice(i+1,1);
            //     }

            // }
            if (this.macrobox[i] == '-可繼續往下錄製-') {
                this.macrobox[i] = "⏰计时：1毫秒"
            }

            if (this.macrobox[this.macrobox.length - 1] == '-可繼續往下錄製-') {
                this.macrobox.pop();
            }

            if (this.macrobox[i].indexOf('👇🏻') == 0) {
                let head = this.macrobox[i].indexOf('：') + 1;
                let wordstring = this.macrobox[i].substring(head, this.macrobox[i].length)
                // wordstring = wordstring.toLowerCase();

                this.thepressword.push(wordstring); //所有按下的值

                let keyplace = this.KBarr.indexOf(wordstring);
                // this.eventCodeArr[keyplace];

                this.keycontent.push(this.MarcroMap.indexOf(this.eventCodeArr[keyplace].toLowerCase())); //keycontent
                //console.log(wordstring);
                //console.log(this.keycontent);

                // this.keytype.push(0x80);
                this.setMacroarr[i] = 0x80;
                // this.setMacroarr[i+2]=this.MarcroMap.indexOf(wordstring);
                //console.log('press111');
                //console.log(this.setMacroarr);

            }
            // //console.log('thispress:'+this.wordnum);


            // for (let RE = 0; RE < this.theReleaseword.length; RE++) {//檢查放开鍵
            //     let REorder = this.theReleaseword.indexOf(wordstring);//在REleaseword中的位置;
            //     this.Rewordnum = this.theReleaseword[REorder];
            //     // this.setMacroarr[this.setMacroarrOrder + 2] = Rewordnum; //下值放开的鍵;
            // }


            // //console.log(this.theword); 
            // //console.log('head:'+head);
            // //console.log('所有按下：'+theword);
            // 所有按下的鍵the word
            // theReleaseword


            if (this.macrobox[i].indexOf('🖐🏻') == 0) {
                let head = this.macrobox[i].indexOf('：') + 1;
                let rewordstring = this.macrobox[i].substring(head, this.macrobox[i].length)
                // if (rewordstring == "") {
                //     rewordstring = 0;
                // }
                let keyplace = this.KBarr.indexOf(rewordstring);


                this.theReleaseword.push(rewordstring);
                // //console.log('reword:' + rewordstring);
                this.keycontent.push(this.MarcroMap.indexOf(this.eventCodeArr[keyplace].toLowerCase()));//keycontent



                // this.keytype.push(0x00);
                this.setMacroarr[i] = 0x00;
                // this.setMacroarr[i+2]=this.MarcroMap.indexOf(rewordstring);
                //console.log('release111');
                //console.log(this.setMacroarr);
                // //console.log(this.theword); 
                // //console.log('head:'+head);
                // //console.log('所有按下：'+theword);
                // 所有按下的鍵the word
                // theReleaseword
            }

            if (this.macrobox[i].indexOf('⏰') == 0) {
                let head = this.macrobox[i].indexOf('：') + 1;
                let timestring = this.macrobox[i].substring(head, this.macrobox[i].length - 2).toLowerCase();
                // this.distantTime.push(timestring);
                // this.setMacroarr[i] = parseInt(timestring);
                if (timestring > 327670) {
                    timestring = 327670
                }

                this.setMacroarr[i] = Math.round(parseInt(timestring) / 10);

                //console.log('clock1111');
                //console.log(this.setMacroarr);
                // //console.log(this.theword); 
                // //console.log('head:'+head);
                // //console.log('所有按下：'+theword);
                // 所有按下的鍵the word
                // theReleaseword

            }

           


        }


        this.setInArr();

        //console.log('setMacroarr:00000');
        //console.log(this.setMacroarr);


        for (let i = 0; i < this.thepressword.length; i++) { //補上未放开的按鍵
            if (this.theReleaseword.indexOf(this.thepressword[i]) == -1) {
                // this.theReleaseword.push(this.thepressword[i]);
                // alert("提醒:尚未加入對應按下鍵，可能鍵盤使用錯誤")
                let c = confirm('提醒:尚未加入' + this.thepressword[i] + '對應按下鍵，可能造成鍵盤使用錯誤，是否確定存取?');
                if (c) {
                    this.pressboolean = true;
                } else {
                    this.alertRemind("此動作已經被取消");
                    this.pressboolean = false;
                    // this.thepressword.length=0;

                    this.macrosavecick = 0
                    this.loading(0);
                }
            }
        }

        for (let i = 0; i < this.theReleaseword.length; i++) { //補上未放开的按鍵
            if (this.thepressword.indexOf(this.theReleaseword[i]) == -1) {
                // this.thepressword.push(this.theReleaseword[i]);
                // alert("提醒:尚未加入對應放开鍵，可能鍵盤使用錯誤")
                let c = confirm('提醒:尚未加入' + this.theReleaseword[i] + '對應按下鍵，可能造成鍵盤使用錯誤，是否確定存取?');
                if (c) {
                    this.releaseboolean = true;
                } else {
                    this.alertRemind("此動作已經被取消");
                    this.releaseboolean = false;
                    // this.theReleaseword.length=0;
                    this.macrosavecick = 0;
                    this.loading(0);
                }
            }
        }

        
        // if(confirm('您即將進入酷必網，確定嗎﹖'))
        // {
        //     this.MacrosetIn();
        // }
        // else
        // {
        // alert("此動作已經被取消");
        // window.event.returnValue=false;
        // }
        //console.log('checkp1111');
        if (this.pressboolean && this.releaseboolean) {

            //console.log('執行222');

            // this.readyforDb();

            var marcoarr = [];
            for (let i = 0; i < this.setMacroarr.length; i++) {
                marcoarr[i] = this.setMacroarr[i]; //排進arr
            }
            //console.log('setMacroarr:out');
            marcoarr.splice(marcoarr.length - 1, 0, 1);
            //console.log(marcoarr);
            this.setintoDBMacro = marcoarr;
            //console.log('importready0000');
            this.loading(0);
            this.macrosavecick = 0;
            // this.UpdateMacroprofile();
        }
    }

    UpdateMacroprofile() {
        this.tempMacrolist.macrolistNames.push(this.choosename);
        this.tempMacrolist.macrolistArr.push(this.setintoDBMacro);

        //console.log('UpdateMacroprofile的obj')
        //console.log(this.tempMacrolist);


        this.db.UpdateProfile(this.tempMacrolist.id, this.tempMacrolist).then((doc: any) => {
            //console.log('UpdateMacroprofile名稱更新')
        })
    }


    readyforDb() {
        for (let index = 0; index < this.setMacroarr.length; index++) {
            // //console.log("順序"+index);
            // //console.log('checkp333');
            // //console.log(this.mutiobj.Key.marcroContent[this.myKey].length - 1);
            this.setMacroarr[index] = parseInt(this.setMacroarr[index]);

            if (index == this.setMacroarr.length - 1) {　//執行完改為數字後
                //console.log('checkp333222');
                // this.MacrosetIn();
                //console.log(this.setMacroarr);
                this.setIntoDB();
                // }
            }
        }
    }
    // focusMacro() {
    //     if (this.record) {
    //         document.getElementById("myAnchor").focus();
    //     }
    // }
    macroBorder: boolean = false;
    stopScroll: any;
    blurfocus() {
        document.getElementById('showeditItem').style.opacity="0";
        console.log('this.setTempdT', this.setTempdT);
        console.log('setdistantTime', this.setdistantTime);

        if (this.setdistantT) {
            if (this.setTempdT < 0 || this.setTempdT > 327670 || isNaN(this.setTempdT) || this.setTempdT == null || this.setTempdT == undefined || this.setTempdT == "") {
                console.log('enter :有錯誤');
                this.setTempdT = 10;
                this.setdistantTime = 10;


                this.timeOff = true;
                setTimeout(() => {
                    this.timeOff = false;
                }, 3000);

            }
            else if (this.setTempdT.indexOf("0") == 0) {
                console.log('enter :有錯誤2222');
                this.setTempdT = 0;
                this.setdistantTime = 0;
                this.timeOff = true;
                setTimeout(() => {
                    this.timeOff = false;
                }, 3000);
            } else {
                console.log('else in');
                //
                document.getElementById('contInput').blur();
                document.getElementById('contInput').style.animation = "none";
                document.getElementById('contInput').style.border = "none";
                if (this.names.length !== 0) {
                    console.log('else in 1111');
                    this.recordready = false;
                    this.ftltbox = false;
                    this.blurClose = 0;
                    this.nowtimeblock = 0;
                    this.macroBorder = true;
                    // this.macrobox.splice(0, 240);
                    this.macrobox.length = 0;
                    this.stopScroll = setInterval(() => {
                        this.scrollMacroList();
                    }, 100)
                    document.getElementById('btnarea').classList.add('disabled');
                    document.getElementById("myAnchor").focus();
                    document.getElementById("writeMacro").classList.add('disabled');
                    // document.getElementById("writeMacro").style.border = "1px solid yellow";
                    this.record = true;
                    //console.log(this.record);
                } else {
                    this.recordready = true;
                    setTimeout(() => {
                        this.recordready = false;
                    }, 1000);
                }
            }
        } else {

            document.getElementById('contInput').blur();
            document.getElementById('contInput').style.animation = "none";
            document.getElementById('contInput').style.border = "none";
            if (this.names.length !== 0) {
                console.log('else in 1111');
                this.recordready = false;
                this.ftltbox = false;
                this.blurClose = 0;
                this.nowtimeblock = 0;
                this.macroBorder = true;
                // this.macrobox.splice(0, 240);
                this.macrobox.length = 0;
                this.stopScroll = setInterval(() => {
                    this.scrollMacroList();
                }, 100)
                document.getElementById('btnarea').classList.add('disabled');
                document.getElementById("myAnchor").focus();
                document.getElementById("writeMacro").classList.add('disabled');
                // document.getElementById("writeMacro").style.border = "1px solid yellow";
                this.record = true;
                //console.log(this.record);
            } else {
                this.recordready = true;
                setTimeout(() => {
                    this.recordready = false;
                }, 1000);
            }

        }

    }

    blurClose: any;

    whenAnchorBlur() {
        if (this.blurClose == 0) {
            document.getElementById("myAnchor").focus();
        }
        else if (this.blurClose == 1) {
            document.getElementById("myAnchor").blur();
        }
    }

    @HostListener('window:blur', ['$event'])
    onBlur(event: any): void {
        this.ClickotherWindow();
    }

    ClickotherWindow() {
        this.blurClose = 1;
        clearInterval(this.stopScroll);
        this.macroBorder = false;
        // this.everysinglemacro = 0;
        // this.frtDatearr[0] = this.frtDate.getTime(); //回復預設時間
        document.getElementById("myAnchor").blur();
        document.getElementById("writeMacro").classList.remove('disabled');
        this.thefstTimeStamp.length = 0;
        this.theScdTimeStamp.length = 0;
        // if(this.thefstTimeStamp.length==0 || this.theScdTimeStamp.length==0){
        //     alert('有清空時間動作')
        // }
        // document.getElementById("writeMacro").style.border = "1px solid transparent";
        this.record = false;
        //console.log(this.record);

        this.pressboolean = true;
        this.releaseboolean = true;
        this.showedit = 'none';
    }

    getfocus() {
        // for (let i = 0; i < document.getElementsByClassName("standbtn").length; i++) {
        //     document.getElementsByClassName("standbtn")[i].classList.add("disabled");
        //     //console.log('disable');
        // }
        document.getElementById('contInput').blur();
        document.getElementById('contInput').style.animation = "none";
        document.getElementById('contInput').style.border = "none"
        this.blurClose = 1;
        clearInterval(this.stopScroll);
        this.macroBorder = false;
        // this.everysinglemacro = 0;
        // this.frtDatearr[0] = this.frtDate.getTime(); //回復預設時間
        document.getElementById("myAnchor").blur();
        document.getElementById("writeMacro").classList.remove('disabled');
        this.thefstTimeStamp.length = 0;
        this.theScdTimeStamp.length = 0;
        // if(this.thefstTimeStamp.length==0 || this.theScdTimeStamp.length==0){
        //     alert('有清空時間動作')
        // }
        // document.getElementById("writeMacro").style.border = "1px solid transparent";
        this.record = false;
        //console.log(this.record);

        this.pressboolean = true;
        this.releaseboolean = true;
        this.showedit = 'none';

        //
        let obj = {
            "ProfileName": "MacroList"
        }
        this.db.getProfile(obj).then((doc: any) => {
            //console.log('MacroList')
            //console.log(doc[0]);
            this.names = doc[0].macrolistNames;
            // this.choosename = doc[0].macrolistNames[0];
            this.clearOpt = true;

            this.macrotake = false;
            //console.log('checkBerforeSend');
            this.checkBerforeSend();
            setTimeout(() => {
                this.macrotake = true;
            }, 5000);
        })
    }




    //macro攔值
    //透過array相對應的字串找到排序(16進位)
    keydownValue(event) {
        // this.nowtimeblock++
        // if (this.nowtimeblock == 1) {
        //     this.nowtime = new Date().getTime();
        // }
        // setInterval(()=>{
        //     this.scrollMacroList();
        // },200)
        let char = event.code;
        let keyplace = this.eventCodeArr.indexOf(char);
        char = this.KBarr[keyplace];
        //console.log(char);
        //
        //console.log('Down:sameKeyblock == false')

        if (this.sameKeyblock == false) {
            //console.log('按下動作');
            if (this.macrobox.length < 158) {

                this.macrovalue = char;
                this.macrobox.push("👇🏻按下：" + this.macrovalue);
                //建立時間點
                // this.TimerRecord();
                if (this.thefstTimeStamp.length == 0) { //
                    this.thefstTimeStamp.push(new Date().getTime());
                    //console.log('第一次時間');
                    //console.log(this.thefstTimeStamp);
                } else {
                    this.theScdTimeStamp.push(new Date().getTime());
                    //console.log('第二次時間');
                    //console.log(this.theScdTimeStamp);
                }
                if (this.theScdTimeStamp.length !== 0) {
                    //console.log('觸發延遲時間');

                    this.timeremain = this.theScdTimeStamp[0] - this.thefstTimeStamp[0];
                    //console.log(this.timeremain);
                    this.TimerRecord();
                    this.thefstTimeStamp[0] = this.theScdTimeStamp[0];
                    this.theScdTimeStamp.length = 0;
                }

            } else if (this.macrobox.length >= 158) {

                // alert('录制已达最大值');
                this.recordOff = true;
                this.blockcss = "disable";
                this.closerecord = setTimeout(() => {
                    this.recordOff = false;
                    this.blockcss = "";
                    // clearTimeout(this.closerecord);
                }, 1000);
                // clearTimeout(this.closerecord);
            }
        }




        if (this.macrovalue == char) { //第二次相同鍵不執行按下 
            //console.log('Down:sameKeyblock == false 1000')
            this.continueKey++;
            //console.log('連送')
            //console.log(this.continueKey);

            if (this.continueKey == 1) {
                //console.log('一樣');
                this.sameKeyblock = true;
                this.continueKey = 0;
            }
        } else {
            //console.log('不一樣');
            this.sameKeyblock = false;
            if (this.macrobox.length < 158) {

                this.macrovalue = char;
                this.macrobox.push("👇🏻按下：" + this.macrovalue);
                //建立時間點
                // this.TimerRecord();
                if (this.thefstTimeStamp.length == 0) { //
                    this.thefstTimeStamp.push(new Date().getTime());
                    //console.log('第一次時間');
                    //console.log(this.thefstTimeStamp);
                } else {
                    this.theScdTimeStamp.push(new Date().getTime());
                    //console.log('第二次時間');
                    //console.log(this.theScdTimeStamp);
                }
                if (this.theScdTimeStamp.length !== 0) {
                    //console.log('觸發延遲時間');

                    this.timeremain = this.theScdTimeStamp[0] - this.thefstTimeStamp[0];
                    //console.log(this.timeremain);
                    this.TimerRecord();
                    this.thefstTimeStamp[0] = this.theScdTimeStamp[0];
                    this.theScdTimeStamp.length = 0;
                }

            } else if (this.macrobox.length >= 158) {

                // alert('录制已达最大值');
                this.recordOff = true;
                this.blockcss = "disable";
                this.closerecord = setTimeout(() => {
                    this.recordOff = false;
                    this.blockcss = "";
                    // clearTimeout(this.closerecord);
                }, 1000);
                // clearTimeout(this.closerecord);
            }
        }
        //

    }
    // this.changePosition++;
    // //console.log('changePosition');
    // //console.log(this.changePosition);

    // if (this.nowtimeblock == 0) {
    //     this.nowtime = new Date().getTime();
    // }
    // this.nowtimeblock = 1;
    // var char = event.code;
    // if (this.macrobox.length < 240) {
    //     this.macrovalue = char;


    //     if (this.checkFirstKeydown >= 1) {
    //         //console.log('第二次的進入點')





    //         if (this.checkKeyUP) {



    //             //有放开的時候
    //             //console.log('have released')
    //             this.macrobox.push("👇🏻按下：" + this.macrovalue);
    //             this.checkKeyUP = false;
    //             // this.TimerRecord();
    //             this.checkFirstKeydown++;
    //             this.keydownkeycodearr.push(char);


    //         }
    //         else if (this.keydownkeycodearr.indexOf(this.macrovalue) == -1) {
    //             //前面沒有一樣的
    //             //console.log('not frist run and didnt show before')

    //             this.macrobox.push("👇🏻按下：" + this.macrovalue);
    //             this.checkKeyUP = false;
    //             this.TimerRecord();
    //             this.checkFirstKeydown++;
    //             this.keydownWaitkeyUp = true;

    //         }

    //     } else {
    //         //console.log('first run');
    //         //第一次按下的時候
    //         this.macrobox.push("👇🏻按下：" + this.macrovalue);
    //         this.TimerRecord();
    //         this.checkFirstKeydown++;
    //         this.keydownkeycodearr.push(char);
    //         //     if(this.macrobox.indexOf(this.macrovalue) == -1){

    //         //         //前面沒有一樣的
    //         //         //console.log('frist run and didnt show before')
    //         //         this.macrobox.push("👇🏻按下：" + this.macrovalue);
    //         //         this.checkKeyUP = false;
    //         //         this.TimerRecord();
    //         //         this.checkFirstKeydown++;


    //         // }
    //     }
    //     // for (let i = 0; i < this.MarcroMap.length; i++) {
    //     //     if(this.MarcroMap[i] == char.toLowerCase()){
    //     //         this.keycontent.push(i);
    //     //         this.keytype.push(0x80);
    //     //     }
    //     // }

    // }
    // else if (this.macrobox.length >= 240) {
    //     // alert('录制已达最大值');
    //     this.recordOff = true;
    //     this.blockcss = "disable";
    //     this.closerecord = setTimeout(() => {
    //         this.recordOff = false;
    //         this.blockcss = "";
    //         // clearTimeout(this.closerecord);
    //     }, 1000);
    //     clearTimeout(this.closerecord);

    // }


    // //console.log('keydwondate:' + this.frtDate.getTime());
    // //console.log('keydown:' + this.frtDatearr);
    // for (let i = 0; i < this.MarcroMap.length; i++) {
    //     //console.log(char.toLowerCase());
    //     if (this.MarcroMap[i] == char.toLowerCase()) { //按下即做好下值準備
    //         this.setMacroarr[this.setMacroarrOrder] = 0x80;
    //         this.setMacroarr[this.setMacroarrOrder + 2] = i;
    //         this.setMacroarr[this.setMacroarrOrder + 5] = i;
    //         // this.setMacroarr[0] = 0x80;
    //         // this.setMacroarr[2] = i;
    //         // this.setMacroarr[5] = i;
    //         // this.setMacroarr[this.setMacroarrOrder] = i;
    //     }
    // }

    keyupValue(event) {
        // setInterval(()=>{
        //     this.scrollMacroList();
        // },200)
        let char = event.code;
        let keyplace = this.eventCodeArr.indexOf(char);
        char = this.KBarr[keyplace];
        //console.log(char);
        //
        //console.log('UP:sameKeyblock == false')
        if (this.macrovalue02 == char) { //第二次相同鍵不執行按下 
            //console.log('UP:0;this.sameKeyblock=false;');
            this.continueKey = 0;
            this.sameKeyblock = false;
            this.macrovalue = "0";
            this.macrovalue02 = "1";
        } else {
            this.sameKeyblock = false;
        }
        //
        if (this.sameKeyblock == false) {
            if (this.macrobox.length < 158) {
                this.keyupflag = true;
                this.macrovalue02 = char;
                this.macrobox.push("🖐🏻放开：" + this.macrovalue02);
                //建立時間點
                // this.TimerRecord();
                if (this.thefstTimeStamp.length == 0) { //
                    this.thefstTimeStamp.push(new Date().getTime());
                    //console.log('第一次時間');
                    //console.log(this.thefstTimeStamp);

                } else {
                    this.theScdTimeStamp.push(new Date().getTime());
                    //console.log('第二次時間');
                    //console.log(this.theScdTimeStamp);
                }

                if (this.theScdTimeStamp.length !== 0) {

                    //console.log('觸發延遲時間');
                    this.timeremain = this.theScdTimeStamp[0] - this.thefstTimeStamp[0];
                    //console.log(this.timeremain);
                    this.TimerRecord();
                    this.thefstTimeStamp[0] = this.theScdTimeStamp[0];
                    this.theScdTimeStamp.length = 0;
                }
                this.keyupflag = false;
            } else if (this.macrobox.length >= 158) {

                // alert('录制已达最大值');
                this.recordOff = true;
                this.blockcss = "disable";
                this.closerecord = setTimeout(() => {
                    this.recordOff = false;
                    this.blockcss = "";
                    // clearTimeout(this.closerecord);
                }, 1000);
                // clearTimeout(this.closerecord);
            }
        }
    }
    // this.keyUptime++;


    // this.checkKeyUP = true;
    // var char = event.code;
    // if (this.macrobox.length < 240) {
    //     this.macrovalue02 = char;
    //     this.macrobox.push("🖐🏻放开：" + this.macrovalue02);
    //     // for (let i = 0; i < this.MarcroMap.length; i++) {
    //     //     if (this.MarcroMap[i] == char.toLowerCase()) {
    //     //         this.keycontent.push(i);
    //     //         this.keytype.push(0x00);
    //     //     }
    //     // }
    //     this.TimerRecord();
    //     this.changeTimeposition();
    //     this.keydownkeycodearr.length = 0;



    //     if (this.keyUptime == 2) {
    //         this.changePosition = 0;
    //         this.keyUptime = 0;

    //     } else {
    //         //console.log('單顆按鍵');
    //         // setTimeout(() => {
    //         // if (this.changePosition == 0) {

    //         //     this.macrobox[this.macrobox.length - 3] = this.macrobox[this.macrobox.length - 1]
    //         //     this.macrobox.pop();
    //         // }
    //         // }, 5000);
    //     }


    //     // document.getElementById('writeMacro').scrollBy(0, 100);

    //     // //console.log('keyupdate:' + this.scdDate.getTime());
    //     // //console.log('keydown:' + this.frtDatearr);
    //     // this.TimerRecord(function () { vm.frtDatearr.length = 0; });
    // }
    // else if (this.macrobox.length >= 240) {
    //     // alert('录制已达最大值');
    //     this.recordOff = true;
    //     this.blockcss = "disable";
    //     setTimeout(() => {
    //         this.recordOff = false;
    //         this.blockcss = "";
    //     }, 1000);
    //     clearTimeout(this.closerecord); 7

    // }

    contBorder: boolean = false;

    contOn() {
        // this.contBorder = true;
        this.getfocus();
        (<HTMLInputElement>document.getElementById('contInput')).select();
        document.getElementById('contInput').focus();
        document.getElementById('contInput').style.animation = "macros 2s infinite";
        document.getElementById('contInput').style.border = "1px solid yellow"
        window.addEventListener('keydown', (e) => {
            if (e.keyCode == 13) {
                document.getElementById('contInput').blur();
                document.getElementById('contInput').style.animation = "none";
                document.getElementById('contInput').style.border = "none"
            }
        })
    }




    distantT(value) {
        var vm = this;
        if(value!==10){
            this.setdistantT = true;
        }
        this.setTempdT = value;
        this.setdistantTime = value;

        window.addEventListener('keydown', (e) => {
            if (e.keyCode == 13) {
                
                // //console.log('vm.setTempdT');
                // //console.log(vm.setTempdT);
                if (vm.setTempdT < 0 || vm.setTempdT > 327670 || isNaN(vm.setTempdT) || vm.setTempdT == null || vm.setTempdT == undefined || vm.setTempdT == "") {
                    console.log('enter :有錯誤');
                    vm.setTempdT = 10;
                    vm.setdistantTime = 10;
                    vm.setIntoDB();

                    vm.timeOff = true;
                    setTimeout(() => {
                        vm.timeOff = false;
                        vm.reserPage();

                    }, 3000);

                  
                }
                else if (vm.setTempdT.indexOf("0") == 0) {
                    console.log('enter :有錯誤2222');
                    vm.setTempdT = 0;
                    vm.setdistantTime = 0;
                    vm.timeOff = true;
                    vm.setIntoDB();
                    setTimeout(() => {
                        vm.timeOff = false;
                        vm.reserPage();
                    }, 3000);
                }

            }
            // else if (this.blurClose == 0) {
            //     console.log('enter :有錯誤2222');
            //     if (vm.setTempdT < 0 || vm.setTempdT > 327670 || isNaN(vm.setTempdT) || vm.setTempdT == null || vm.setTempdT == undefined) {
            //         vm.setTempdT = 10;
            //         vm.setdistantTime = 10;


            //         vm.timeOff = true;
            //         setTimeout(() => {
            //             vm.timeOff = false;
            //         }, 3000);

            //     }
            //     else if (vm.setTempdT.indexOf("0") == 0) {
            //         vm.setTempdT = 0;
            //         vm.setdistantTime = 0;
            //         vm.timeOff = true;
            //         setTimeout(() => {
            //             vm.timeOff = false;
            //         }, 3000);
            //     }

            //     this.getfocus();
            //     setTimeout(() => {
            //         this.blurfocus();
            //     }, 200);
            // }
        })
        // else if (value >= 1 && value <= 327670) {
        // }
    }

    TimerRecord() {
        // this.frtDatearr[0] = new Date().getTime(); //記錄第一次時間
        // this.frtDatearr[0] = new Date().getTime(); //記錄第二次時間


        // this.distantTime.push(this.frtDatearr[0] - this.nowtime);
        if (this.check01) {
            // this.macrobox.push("⏰计时：" + this.timeremain+ "毫秒");
            this.macrobox.splice(this.macrobox.length - 1, 0, "⏰计时：" + this.timeremain + "毫秒");
        } else if (this.check02) {
            // this.macrobox.push("⏰计时：" + this.setTempdT + "毫秒");
            this.macrobox.splice(this.macrobox.length - 1, 0, "⏰计时：" + this.setTempdT + "毫秒");
        } else if (this.check03) {
            // this.macrobox.push("⏰计时：" + 0 + "毫秒");
            this.macrobox.splice(this.macrobox.length - 1, 0, "⏰计时：" + 0 + "毫秒");
        }

        //     // this.timeget = this.scdDate.getTime() - this.frtDatearr[0].getTime();
        //     // //console.log(3333);
        //     // //console.log('time:' + this.timeget);
        //     // this.setMacroarr[this.setMacroarrOrder + 1] = Math.floor(this.timeget / 10); //除以 10  取整數
        //     // this.setMacroarr[this.setMacroarrOrder + 4] = Math.floor(this.timeget / 10); //除以 10  取整數
        //     // //console.log('macroarr:' + this.setMacroarr);//看array內容
        //     // this.setMacroarr[1] = this.timeget;
        //     // this.setMacroarr[1 + 3] = this.timeget;
        // }
        // callback();//清空
        // this.MacroAct(); //輸出
        // this.setMacroarrOrder = this.setMacroarrOrder + 6;//一組完成後+1
        // //console.log(this.setMacroarrOrder);
    }



    // changeTimeposition() {
    //     // //console.log('時間000');
    //     for (let index = 0; index < this.macrobox.length; index++) {
    //         //console.log('時間111');

    //         if (index == this.macrobox.length - 1) {
    //             //console.log('時間222');
    //             if (this.macrobox[index].indexOf('⏰') !== -1) {

    //                 if (this.keydownWaitkeyUp) {
    //                     // //console.log('等待最後一個放开');
    //                     // //console.log('loading')



    //                     // // this.macrobox[index - 2] = this.macrobox[index];
    //                     // // this.macrobox.pop();
    //                     // // //console.log(index - 2);
    //                     // // //console.log(index);
    //                     this.keydownWaitkeyUp = false;

    //                 } else {
    //                     //console.log('最後已經放开111');
    //                     // if(this.changePosition=0){


    //                     if (this.changePosition == 2) {

    //                         //console.log('最後已經放开222');

    //                         if(this.nextmove){
    //                             this.nextmove=false;
    //                             // this.loading(1);
    //                             document.getElementById("myAnchor").blur();

    //                         for (let index = 0; index < this.macrobox.length; index++) {


    //                             if (this.macrobox[index].indexOf('⏰') !== -1) {
    //                                 this.macrobox[index - 2] = this.macrobox[index];

    //                                 if (index == this.macrobox.length - 1) {
    //                                     this.macrobox.pop();
    //                                     this.changePosition = 0;

    //                                     setTimeout(() => {
    //                                         this.nextmove=true;
    //                                         // this.loading(0);
    //                                         document.getElementById("myAnchor").focus();
    //                                     }, 800);

    //                                 }

    //                             }
    //                         }
    //                     }

    //                     } else {

    //                         //console.log('s1111');
    //                         // //console.log(this.macrobox.length-2);
    //                         // //console.log(this.macrobox.length);

    //                         // setTimeout(() => {
    //                         //     if(this.changePosition==1){
    //                         //         //console.log('現在再換')
    //                         //     }
    //                         // }, 1000);
    //                         if(this.nextmove){
    //                             this.nextmove=false;
    //                             // this.loading(1);
    //                             document.getElementById("myAnchor").blur();
    //                             //console.log('s2222');
    //                         if(this.everysinglemacro==0){
    //                             this.macrobox[this.macrobox.length - 3] = this.macrobox[this.macrobox.length - 1]
    //                             this.macrobox[this.macrobox.length - 1] = '-可繼續往下錄製-';

    //                         }else{
    //                             this.macrobox[this.macrobox.length - 5] = this.macrobox[this.macrobox.length - 3];
    //                             this.macrobox[this.macrobox.length - 3] = this.macrobox[this.macrobox.length - 1];
    //                             this.macrobox[this.macrobox.length - 1] = '-可繼續往下錄製-';


    //                         }
    //                             setTimeout(() => {
    //                                 this.nextmove=true;
    //                                 // this.loading(0);
    //                                 document.getElementById("myAnchor").focus();
    //                                 this.everysinglemacro++;
    //                             }, 800);

    //                         }
    //                         this.changePosition = 0;




    //                     }


    //                     // this.macrobox[index - 2] = this.macrobox[index];
    //                     // this.macrobox.pop();
    //                     // //console.log(index - 2);
    //                     // //console.log(index);

    //                     // this.keydownWaitkeyUp=false;

    //                 }

    //                 // }
    //             }
    //         }

    //     }


    // }

    // setInfirstTime(){
    //     //console.log('setInTime11111');


    //     //console.log('setInTime222');
    // }


    setInArr() {
        //console.log('setInArr11111');
        //console.log(this.setMacroarr);
        //console.log(this.keycontent);
        for (let i = 1; i < this.keycontent.length + 1; i++) {
            this.setMacroarr.splice((i * 2) + (i - 1), 0, this.keycontent[i - 1])
            // // //console.log(this.setMacroarr);
            // if(i==this.keycontent.length){　//結束的時候
            //     //console.log('setInArr333');
            //     //console.log(this.setMacroarr);
            //     this.setMacroarr[1+3]=this.setMacroarr[1];
            //     //console.log(this.setMacroarr);
            // }
        }
        // this.setMacroarr.length
        // for (let i = 0; i < this.distantTime.length; i++) {
        //     this.finaldistantTime[i] = parseFloat(this.distantTime[i]) / 10;
        //     if (this.finaldistantTime[i] < 1) {
        //         this.finaldistantTime[i] = 1;
        //     }
        //     this.setMacroarr[i * 3] = this.keytype[i];
        //     this.setMacroarr[i * 3 + 1] = this.finaldistantTime[i].toFixed(0);
        //     this.setMacroarr[i * 3 + 2] = this.keycontent[i];
        //     //console.log('SArr:1111');
        //     //console.log(this.setMacroarr);
        //     if (i == this.distantTime.length - 1) {
        //         //console.log('SArr2222:');
        //         // this.setMacroarr;
        //         this.temp = [];
        //         for (let i = 0; i < this.setMacroarr.length; i++) {
        //             this.temp[i] = 0;
        //         }
        //         //console.log(this.temp);
        //         this.temptoSetMacro()
        // this.temptoSetMacro();
        //console.log(this.setMacroarr);
    }

    // let temp = new Buffer(new Array(this.setMacroarr.length));
    //         let temp = [];
    //         for (let i = 0; i < this.setMacroarr.length; i++) {
    //             temp[i] = 0;
    //             //console.log('temp');
    //             //console.log(temp);
    //             if (temp.length == this.setMacroarr.length) {
    //                 //console.log('temp2222');
    //                 for (let index = 0; index < temp.length; index++) {
    //                     //console.log('temp333');
    //                     temp[index] = this.setMacroarr[index];
    //                     //console.log('SArr3333:');
    //                     //console.log(temp);
    //                     if (index == temp.length - 1) { //setMacroarr轉換成有長度
    //                         this.setMacroarr = temp;
    //                     }
    //                 }
    //                 //
    //             }
    //     }
    // }
    //     }
    // }

    temptoSetMacro() {
        for (let i = 0; i < this.temp.length; i++) {
            this.temp[i] = this.setMacroarr[i];
            //console.log('temp' + i)
            //console.log(this.setMacroarr);
        }
        // if (this.temp.length == this.setMacroarr.length) {
        //     for (let index = 0; index < this.temp.length; index++) {
        //         //console.log('temp333');
        //         this.temp[index] = this.setMacroarr[index];
        //         //console.log('SArr3333:');
        //         //console.log(this.temp);
        //         if (index == this.temp.length - 1) { //setMacroarr轉換成有長度
        //             this.setMacroarr = this.temp;
        //             //console.log('SArr444:');
        //             //console.log(this.temp);
        //         }
        //     }
        // }else{
        //     this.temptoSetMacro();
        // }
    }


    setIntoMacroLIst() {
        //console.log(' setIntoMacrolist1111');
        this.tempMacrolist.macrolistArr[this.nameindex] = this.setintoDBMacro;
        this.db.UpdateProfile(this.tempMacrolist.id, this.tempMacrolist).then((doc: any) => {
        })
    }
    scrollMacroList() {
        var elemt = document.getElementById("writeMacro");
        // if (elemt.offsetTop > 270) {
        elemt.scrollTop = 10000;
        // }
    }

    setIntoDB() {
        //console.log(' setIntoDB1111')
        //functinKey決定已經選定在選項時
        //本頁啟動時產生的mutiobj更新內容
        // let s = [1, 2, 4, 5, 6, 6, 7];
        // //console.log('自訂s：');
        // //console.log(s);
        // //console.log('macro array:');
        //console.log(this.setintoDBMacro);
        // s= [128, 1, 23, 128, 8, 28, 0, 13, 28, 128, 3, 7, 128, 6, 5, 0, 1, 23, 0, 1, 5, 128, 2, 21, 128, 7, 28, 0, 1, 7, 128, 1, 5, 0, 2, 21, 0, 6, 28, 0, 8, 5, 128, 1, 8, 128, 4, 21, 0, 1, 21, 128, 2, 28, 0, 2, 8, 0, 3, 28];
        // s = this.setMacroarr;
        // //console.log('存完的macro array')
        // //console.log(this.setMacroarr);
        // //console.log('存完的s');
        // //console.log(s);
        //  //console.log(s);
        //console.log('checkp');
        //console.log(this.mutiobj.Key);

        //console.log('checkp333');
        //console.log(this.myKey);
        this.mutiobj.KeyDataValue[this.myKey] = 0xB2;
        // this.mutiobj.Key.marcroContent[this.myKey] = this.setMacroarr;
        this.mutiobj.Key.marcroContent[this.myKey] = this.setintoDBMacro;
        //console.log(' setIntoDBMacroContent');

        //console.log(this.MacroContent);
        //console.log(' setIntoDBchoosename');

        //console.log(this.choosename);
        this.mutiobj.Key.marcroChoose[this.myKey] = this.choosename;

        //console.log('checkpSetin');
        //console.log(this.mutiobj.Key.marcroContent[this.myKey])
        // //console.log(this.mutiobj.Key.marcroContent[this.myKey]);
        //console.log('checkp4444');
        // this.mutiobj.Key.marcroContent[this.myKey] = s;
        //console.log(this.mutiobj);
        // //console.log('SETdb1111:' + this.setMacroarr);
        this.savebox[0] = this.finalclick;
        this.savebox[1] = this.setdistantTime;
        this.mutiobj.Key.options.OPshelf01[0] = this.savebox;
        // this.mutiobj.Key.options.OPshelf01[0] =this.finalclick;
        // this.mutiobj.Key.options.OPshelf01[0] =this.setdistantTime;
        //console.log(this.finalclick);
        // this.mutiobj.shelf01 = this.LastarrayindexArr;
        // //console.log(this.mutiobj.Key.marcroContent[this.myKey]);
        // // //console.log(this.mutiobj.Key.marcroContent);
        // //console.log(this.mutiobj.Key.marcroContent[this.myKey]);
        // //console.log(this.mutiobj.Key.marcroContent[8]);
        // //console.log(this.mutiobj.Key.marcroContent);//奇怪的地方
        // //console.log(this.mutiobj.Key);
        //console.log(this.mutiobj);
        //console.log('readyforupdate');
        this.db.UpdateProfile(this.mutiobj.id, this.mutiobj).then((doc: any) => {
            //console.log('update success');
            //console.log('update success doc');
            // //console.log('SETdb222:' + this.setMacroarr);
            // this.loading(0);

            if (this.macrotake == false) {
                this.setMacroarr.length = 0;
            } else {
                //console.log('ready for MacroSetin');
            }

            this.keytype.length = 0;
            this.finaldistantTime.length = 0;
            this.distantTime.length = 0;
            //console.log('keytypeOut:' + this.keytype);
            //console.log('finaltimeOut:' + this.finaldistantTime);

            if (this.macrotake) {
                this.keywasSet();
            } else {
                this.loading(0);
            }
            // //console.log('seeMacOut:' + this.setMacroarr);
            // this.gamemoment = "startApmode";
            // this.outputGame();
            //console.log(doc[0]);//要留著
            // setTimeout(() => {
            //     this.gamemoment = 'startApmode';
            //     this.outputGame()
            //     this.macrosavecick = 0;
            //     this.loading(0);
            // }, 3000);
            //console.log(doc[0]);//要留著
            //存檔完清除所有暫存
        });




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






    MacrosetIn() {
        //console.log('testmacrotake');
        //console.log(this.macrotake);
        // this.setInArr();
        // this.readyforDb();
        // this.setIntoDB();
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
            data[this.myKey] = 0xB2;
            //console.log('thiskeyshow:' + this.myKey);
            // //console.log(data[7]);
            // //console.log(data);
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
                //console.log('MacroIN1111:')
                //console.log(this.setMacroarr);

                var marcoarr = [];
                for (let i = 0; i < this.setMacroarr.length; i++) {
                    marcoarr[i] = this.setMacroarr[i]; //排進arr
                }
                //console.log('MacroIN:')
                //console.log(marcoarr);
                marcoarr.splice(marcoarr.length - 1, 0, 1);
                //console.log(marcoarr);
                this.setintoDBMacro = marcoarr;
                //
                //console.log('marcoarr[1] tostring = ', marcoarr[1].toString(16));
                //console.log('marcoarr[1] front 2 digit = ', marcoarr[1].toString(16).substring(0, 2));
                //console.log('marcoarr[1] HEX = ', parseInt(marcoarr[1].toString(16).substring(0, 2), 16))
                var marcoLen = marcoarr.length;
                var tempMacroarr = [];

                for (var t = 0; t < Math.ceil(marcoLen / 6); t++) {
                    tempMacroarr.push(marcoarr[6 * t + 1], marcoarr[6 * t + 4]);
                    marcoarr[6 * t + 1] = tempMacroarr[2 * t - 1]
                    marcoarr[6 * t + 4] = tempMacroarr[2 * t - 0]
                    marcoarr[1] = 0x00;
                    //console.log("tempMacroarr : ", tempMacroarr);
                    //console.log("tempMacroarr2222 : ", marcoarr);

                    if (parseInt(marcoarr[6 * t + 1].toString(16), 16) >= 0x0100) {
                        // 0x81~0xff
                        marcoarr[6 * t + 0] = 0x80 | parseInt(marcoarr[6 * t + 1].toString(16).substring(0, 2), 16)
                        marcoarr[6 * t + 1] = parseInt(marcoarr[6 * t + 1].toString(16).substring(2), 16)
                        //console.log('marcoarr[1] - hex > 0xff && hex <= 0xfff = ', "0x" + marcoarr[1].toString(16));
                    }

                    if (parseInt(marcoarr[6 * t + 4].toString(16), 16) >= 0x0100) {
                        // 0x01~0x7f
                        marcoarr[6 * t + 3] = parseInt(marcoarr[6 * t + 4].toString(16).substring(0, 2), 16)
                        marcoarr[6 * t + 4] = parseInt(marcoarr[6 * t + 4].toString(16).substring(2), 16)
                        //console.log('marcoarr[4] - hex > 0xff && hex <= 0xfff = ', "0x" + marcoarr[4].toString(16));
                    }
                }

                setTimeout(() => {


                    //   //console.log('MacroIN2222:')
                    //   //console.log(this.setMacroarr);
                    // for (let index = 0; index < 40; index++) {
                    //     marcoarr[6 * index + 0] = 0x80;
                    //     marcoarr[6 * index + 1] = 0x01;
                    //     marcoarr[6 * index + 2] = 0x08;
                    //     marcoarr[6 * index + 3] = 0x00;
                    //     marcoarr[6 * index + 4] = 0x01;
                    //     marcoarr[6 * index + 5] = 0x08;
                    //     //console.log("index",index)
                    //     //console.log(0x80, 0x01, 0x08, 0x00, 0x01, 0x08)
                    // }
                    // //console.log("macroInArr",marcoarr);
                    //  marcoarr=[
                    //             "0x80",
                    //             "0x01",
                    //             "0x06",
                    //             "0x00",
                    //             "0x01",
                    //             "0x06"
                    //         ]
                    let set = {
                        key: this.myKey,
                        repeat: "1",
                        data: marcoarr
                    }
                    let obj3 = {
                        Type: funcVar.FuncType.Device,
                        Func: funcVar.FuncName.SetMacroKey,
                        Param: set
                    }


                    //console.log('執行setmacro')
                    this.protocol.RunSetFunction(obj3).then((data) => {
                        //console.log("Container RunSetFunction:" + data);
                        //沒有回傳
                    });

                    // //console.log('seeMac22222:' + this.setMacroarr);
                    //console.log('seeMac22222:');
                    //console.log(this.setMacroarr);
                    //console.log('seeMac3333:');
                    //console.log(marcoarr);
                    // this.setintoDBMacro = marcoarr;
                    // this.setMacroarr=marcoarr;
                    // //console.log('seeMac4444:');
                    // //console.log(this.setMacroarr);\

                    // this.setIntoDB();
                    setTimeout(() => {
                        this.gamemoment = 'startApmode';
                        this.outputGame()
                        this.macrosavecick = 0;
                        setTimeout(() => {
                            this.loading(0);
                        }, 2000);

                        this.setMacroarr.length = 0;
                    }, 8000);
                }, 150);
            })
        });
    }


    testmacrotake() {
        //console.log(this.macrotake);
    }
    //     let marcoarr=[
    //         "0x80",
    //         "0x01",
    //         "0x05",
    //         "0x00",
    //         "0x01",
    //         "0x05"
    //     ]
    //     let data = {
    //       key:"7",
    //     repeat:"0x05",
    //     data:marcoarr

    //     }

    //     let obj1 = {
    //         Type : funcVar.FuncType.Device,
    //         Func:funcVar.FuncName.SetMacroKey,
    //         Param:data
    //     }
    //     this.protocol.RunSetFunction(obj1).then((data) => {
    //         //console.log("Container RunSetFunction:" + data);
    //     });
    // }

    closeOpt() {
        // this.showfn = "none";
        // this.showinput = true;
        this.fnbtn = false;
        this.ftltbox = false;
    }

    seemacrolist() {
        clearInterval(this.stopScroll);
        this.macroBorder = false;
        // this.everysinglemacro = 0;
        // this.frtDatearr[0] = this.frtDate.getTime(); //回復預設時間
        document.getElementById("myAnchor").blur();
        document.getElementById("writeMacro").classList.remove('disabled');
        this.thefstTimeStamp.length = 0;
        this.theScdTimeStamp.length = 0;
        // if(this.thefstTimeStamp.length==0 || this.theScdTimeStamp.length==0){
        //     alert('有清空時間動作')
        // }
        // document.getElementById("writeMacro").style.border = "1px solid transparent";
        this.record = false;
        //console.log(this.record);

        this.pressboolean = true;
        this.releaseboolean = true;
        this.showedit = 'none';
        this.ftltbox = true;
        this.fnbtn = true;
    }

    openOpt() {
        // this.getfocus();
        this.blurClose = 1;
        clearInterval(this.stopScroll);
        this.macroBorder = false;
        // this.everysinglemacro = 0;
        // this.frtDatearr[0] = this.frtDate.getTime(); //回復預設時間
        document.getElementById("myAnchor").blur();
        document.getElementById("writeMacro").classList.remove('disabled');
        this.thefstTimeStamp.length = 0;
        this.theScdTimeStamp.length = 0;
        // if(this.thefstTimeStamp.length==0 || this.theScdTimeStamp.length==0){
        //     alert('有清空時間動作')
        // }
        // document.getElementById("writeMacro").style.border = "1px solid transparent";
        this.record = false;
        //console.log(this.record);

        this.pressboolean = true;
        this.releaseboolean = true;
        this.showedit = 'none';
        //

        // this.ftltbox = true;
        // this.fnbtn = true;
        //console.log('打開name選項藍');
        let obj = {
            "ProfileName": "MacroList"
        }
        this.db.getProfile(obj).then((doc: any) => {
            //console.log('MacroList')
            //console.log(doc[0]);
            this.names = doc[0].macrolistNames;
            // this.choosename = doc[0].macrolistNames[0];
            this.clearOpt = true;

            this.macrotake = false;
            //console.log('checkBerforeSend');
            this.checkBerforeSend();
            setTimeout(() => {
                this.macrotake = true;
            }, 5000);
        })


    }

    clearOptbox() {
        //console.log('clicked');
        this.ftltbox = false;

        document.getElementById('showmorebox').classList.add("disabled");
        document.getElementById('showmorebox').style.opacity = "0";
    }

    cleanMacrobox() {
        this.setMacroarr.length = 0;
        //console.log('callback' + this.setMacroarr);
    }

    selectNone() {
        document.getElementById('selectUp').style.display = "none";
        document.getElementById('selectDown').style.display = "none";
        document.getElementById('selectAdd').style.display = "none";
        document.getElementById('selectEdit').style.display = "none";
        document.getElementById('selectDeleteAll').style.display = "none";
        document.getElementById('selectDeleteItem').style.display = "none";
        document.getElementById('selectCopy').style.display = "none";
        document.getElementById('selectPaste').style.display = "none";
        document.getElementById('selectDeleteAllDelay').style.display = "none";
        document.getElementById('selectMacro').style.display = "none";
    }
    selectDisplay(w) {
        if (w == 0) {
            document.getElementById('selectUp').style.display = "block";
        }
        else if (w == 1) {
            document.getElementById('selectDown').style.display = "block";
        }
        else if (w == 2) {
            document.getElementById('selectAdd').style.display = "block";
        }
        else if (w == 3) {
            document.getElementById('selectEdit').style.display = "block";
        }
        else if (w == 4) {
            document.getElementById('selectDeleteAll').style.display = "block";
        }
        else if (w == 5) {
            document.getElementById('selectDeleteItem').style.display = "block";
        }
        else if (w == 6) {
            document.getElementById('selectCopy').style.display = "block";
        }
        else if (w == 7) {
            document.getElementById('selectPaste').style.display = "block";
        }
        else if (w == 8) {
            document.getElementById('selectDeleteAllDelay').style.display = "block";
        }
        else if (w == 9) {
            document.getElementById('selectMacro').style.display = "block";
        }
    }



    FileinMacro() {
        let here = this;
        // setTimeout(() => {
        //     here.lookpoint=0;
        // }, 1000);
        //console.log("inputtext222")
        // const input = document.querySelector('input[type="file"]')
        const input = <HTMLInputElement>document.getElementById('myMacro');

        let vm = this;
        input.addEventListener('change', function (e) {
            //console.log('處理次數');
            vm.lookpoint++;
            if (vm.lookpoint == 1) {
                document.getElementById('showmorebox').classList.add("disabled");
                document.getElementById('showmorebox').style.opacity = "0";

                //console.log("FileinMacro333");

                // //console.log(input.files);
                const reader = new FileReader();
                reader.onload = function () {
                    // //console.log(reader.result);
                    let resultfile = JSON.parse(reader.result);
                    //console.log(resultfile);//讀取的內容

                    vm.importmacroContent = resultfile;
                    // vm.MacrolistPick = true;
                    vm.ImportMacro = true;
                    //console.log('count1111');
                    //console.log(vm.count);
                    vm.count = vm.count + 1; //紀錄每一個尾數
                    // vm.Macroforimport();
                    let savename = vm.addDefaultName + vm.count;
                    vm.choosename = savename;
                    //console.log('count222');
                    //console.log(vm.count);
                    //console.log('savename');
                    //console.log(savename);
                    vm.tempMacrolist.macrolistNames.push(savename);
                    if (vm.importmacroContent.importMacro !== undefined && vm.importmacroContent.importMacro !== null && vm.importmacroContent.importMacro !== "") {
                        vm.tempMacrolist.macrolistArr.push(vm.importmacroContent.importMacro);
                    } else {
                        vm.loading(0);
                        vm.alertRemind('檔案內容格式不符');
                        vm.choosename = "";
                        vm.names.length = 0;
                        return false;
                    }
                    //console.log('存入的obj')
                    //console.log(vm.tempMacrolist);
                    vm.db.UpdateProfile(vm.tempMacrolist.id, vm.tempMacrolist).then((doc: any) => {
                        //console.log('儲存名稱更新')
                        // vm.openOpt();
                        // //console.log(doc[0])
                        let position = vm.tempMacrolist.macrolistNames.indexOf(savename);
                        //console.log('位置');
                        //console.log(position);
                        vm.MacroContent = vm.tempMacrolist.macrolistArr[position];
                        //console.log('importMacro2222')
                        //console.log(vm.MacroContent.length);
                        //console.log(vm.MacroContent);
                        if (vm.MacroContent.length !== 0) {
                            //console.log('出現');
                            vm.macrobox.length = 0;
                            vm.readdbMacro();
                        }
                    })
                    // //console.log(vm.choosename);//沒有動
                    //
                    // //console.log('啟動時的讀入');
                    // //console.log('長度');
                    // //console.log(vm.macrobox.length);
                    // //console.log('readdbMacr2222');
                    // //console.log(vm.mutiobj.Key.marcroContent[vm.myKey]);
                    // let marcroinDB = vm.importmacroContent.importMacro
                    // //
                    // let nowKey = vm.eventCodeArrlowerCase.indexOf(vm.MarcroMap[marcroinDB[2]]);
                    // let printKey = vm.KBarr[nowKey];

                    // // vm.macrobox[0] = "👇🏻按下：" + vm.MarcroMap[marcroinDB[2]];
                    // // vm.macrobox[1] = "⏰计时：" + marcroinDB[1] + "毫秒";
                    // // vm.macrobox[2] = "🖐🏻放开：" + vm.MarcroMap[marcroinDB[2]];
                    // vm.macrobox[0] = "👇🏻按下：" + printKey;
                    // vm.macrobox[1] = "⏰计时：" + marcroinDB[1] * 10 + "毫秒";
                    // // vm.macrobox[2] = "🖐🏻放开：" + printKey;
                    // for (let i = 3; i < marcroinDB.length; i++) {
                    //     if (i % 3 == 0) {
                    //         if (marcroinDB[i] == 128) {
                    //             vm.macrobox.push("👇🏻按下：" + vm.KBarr[vm.eventCodeArrlowerCase.indexOf(vm.MarcroMap[marcroinDB[i + 2]])]);
                    //             vm.macrobox.push("⏰计时：" + marcroinDB[i + 1] * 10 + "毫秒");
                    //         } else {
                    //             vm.macrobox.push("🖐🏻放开：" + vm.KBarr[vm.eventCodeArrlowerCase.indexOf(vm.MarcroMap[marcroinDB[i + 2]])]);
                    //             vm.macrobox.push("⏰计时：" + marcroinDB[i + 1] * 10 + "毫秒");
                    //         }
                    //     }
                    // }
                    // //console.log('readdbMacr3333');
                    // //console.log(vm.macrobox);
                    //
                    // setTimeout(() => {
                    //     vm.readdbMacro();
                    // }, 3000);
                    // //console.log('舊choosename')
                    // //console.log(vm.choosename);
                    // vm.Macroforimport();
                    // vm.tempMacrolist.macrolistArr.push(vm.setintoDBMacro);
                    // //console.log('存入的obj')
                    // //console.log(vm.tempMacrolist);
                    // vm.db.UpdateProfile(vm.tempMacrolist.id, vm.tempMacrolist).then((doc: any) => {
                    //     //console.log('儲存名稱更新')
                    //     vm.openOpt();
                    // })
                    // vm.add();
                    // //對應的profileName，進行點選profile動作
                    // for (let i = 0; i < vm.names.length; i++) {
                    // 	if (vm.names[i] == resultfile.ProfileName) {
                    // 		// //console.log(vm.names[i]);
                    // 		// vm.callName(i);
                    // 	}
                    // }
                }
                reader.readAsText(input.files[0]);
            } else {
                setTimeout(() => {
                    here.lookpoint = 0;
                }, 1000);
            }
        })
    }

    openmorebox() {
        this.getfocus();
        setTimeout(() => {
            this.markmorebox++
            this.FileinMacro();
            if (this.markmorebox % 2 == 0) {
                document.getElementById('showmorebox').classList.add("disabled");
                document.getElementById('showmorebox').style.opacity = "0";
            } else {
                document.getElementById('showmorebox').classList.remove("disabled");
                document.getElementById('showmorebox').style.opacity = "1";
            }
        }, 200);

    }


    closeShowmoreBox() {
        document.getElementById('showmorebox').classList.add("disabled");
        document.getElementById('showmorebox').style.opacity = "0";
    }


    SaveFile() {
        document.getElementById('showmorebox').classList.add("disabled");
        document.getElementById('showmorebox').style.opacity = "0";
        dialog.showSaveDialog(null, { defaultPath: 'export', filters: [{ name: 'Json File', extensions: ['json'] }] }, (fns) => {
            if (fns != undefined) {
                //console.log('11111:' + fns);
                // let data = {"VID":"0x0458","PID":"0x6005","DeviceName":"K10","DeviceType":"0x01","status":"0","_id":"yCXd2ZJ4bWesrIGK"}
                this.Macroforimport();
                //console.log('11111:');
                let obj1 = {
                    "importMacro": this.setintoDBMacro
                }
                let data = obj1;
                let obj = {
                    Path: fns,
                    Data: data
                }
                let obj2 = {
                    Type: funcVar.FuncType.System,
                    Func: funcVar.FuncName.ExportProfile,
                    Param: obj
                }
                this.protocol.RunSetFunction(obj2).then((data) => {
                });
            }
        })
    }

    DecidetoSave() {
        this.macrotake = true;
        this.checkBerforeSend();
    }


  showChangeInput(value,Id){
    // let content2;
   
    // this.testcotent=content2;
        value="";
        let ta = document.getElementById(Id);
        ta.focus();
        (ta as HTMLTextAreaElement).select();
        ta.style.opacity='1';
        ta.classList.remove("disabled");
    
        // (ta as HTMLTextAreaElement).select();
  }

  blurChangeInput(value,Id){

    value="";
    let ta = document.getElementById(Id);
    ta.blur();
    ta.style.opacity='0';
    ta.classList.add("disabled");
    // let content2;
    
    // this.testcotent=content2;
    // this.testcontent="";
    // let ta = document.getElementById('inputchange');
    //     ta.blur();
        // (ta as HTMLTextAreaElement).select();
  }

  EnterTextInput(event){ //保持focus
    let char = event.key;
    if (char == "Enter" || char == "NumpadEnter") {
        this.Timevalue=this.EnterText;
        this.blurChangeInput(this.EnterText,'Tinput');
      //
      if (this.Timevalue < 0 || this.Timevalue > 327670 || isNaN(this.Timevalue)) {
        this.Timevalue = 10;
        this.timeOff = true;
        setTimeout(() => {
            this.timeOff = false;
        }, 3000);
        this.showChangeInput(this.EnterText,'Tinput')
    }else if(this.Timevalue==null || this.Timevalue==undefined || this.Timevalue=="" ){
       

        let head = this.macrobox[this.arrindex].indexOf('：') + 1;
        let timestring = this.macrobox[this.arrindex].substring(head, this.macrobox[this.arrindex].length - 2).toLowerCase();
        this.EnterText = timestring ;
       
        if(this.EnterText==undefined || this.EnterText=="" || this.EnterText==null){
            this.EnterText=10;
        }
        this.Timevalue=this.EnterText;

        // console.log('最後：',this.EnterText);
    }

    //console.log('按下enter');
    //console.log(this.Timevalue);
    this.confirmInput();
        }
  }

alertRemind(text){
    this.alerttext=text;
    this.alertcoming=true;
    setTimeout(() => {
        this.alertcoming=false;
    }, this.alerttime);
}
    // testfun(){
    //     console.log('get');
    //     // this.blurChangeInput(this.EnterText,'Tinput');
    //     this.confirmInput()
    // }

    takeNow(){

         this.Timevalue=this.EnterText;
        this.blurChangeInput(this.EnterText,'Tinput');
      //
      if (this.Timevalue < 0 || this.Timevalue > 327670 || isNaN(this.Timevalue)) {
        this.Timevalue = 10;
        this.timeOff = true;
        setTimeout(() => {
            this.timeOff = false;
        }, 3000);
        this.showChangeInput(this.EnterText,'Tinput')
    }else if(this.Timevalue==null || this.Timevalue==undefined || this.Timevalue=="" ){
       

        let head = this.macrobox[this.arrindex].indexOf('：') + 1;
        let timestring = this.macrobox[this.arrindex].substring(head, this.macrobox[this.arrindex].length - 2).toLowerCase();
        this.EnterText = timestring ;
       
        if(this.EnterText==undefined || this.EnterText=="" || this.EnterText==null){
            this.EnterText=10;
        }
        this.Timevalue=this.EnterText;

        // console.log('最後：',this.EnterText);
    }

    //console.log('按下enter');
    //console.log(this.Timevalue);
    this.confirmInput();
    }

}