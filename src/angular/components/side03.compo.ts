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
    selector: 'side03-app',
    templateUrl: './components/pages/side03.compo.html',
    //template: '<h1>我的第一个 Angular 应用</h1>',
    styleUrls: ['./css/first.css'],
    inputs: ['myKey', 'mutiobj']
})

export class side03Component implements OnInit {
    constructor(private protocol: protocolService, private db: dbService, private getDeviceService: GetDeviceService, private emitService: EmitService) {
        //console.log('side03 loading complete');
    }
    changeprofile:any='2';
    saveclick: number = 0;
    keycodeContent: any = "输入按键（可能包括Shift、Ctrl、Alt)";
    setMacroarr: any = [];
    macrosavecick: number = 0;
    mutiobj: any = {};
    myKey: string;
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
    @Output() outputEvent: EventEmitter<any> = new EventEmitter();

    @Output() Keyhasbeenset: EventEmitter<any> = new EventEmitter();
    @Output() nowloading: EventEmitter<any> = new EventEmitter();
    @Output() outputGameEvent: EventEmitter<any> = new EventEmitter();



    ngOnInit() {
        //this.mutiobj.Key.marcroContent[this.myKey]
        //console.log('in side 03 oninit')
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
            //console.log('db.getProfile')
            if (doc[0].Key.marcroContent[this.myKey][6] !== undefined || doc[0].Key.marcroContent[this.myKey][6] !== null) {
                if(isNaN(doc[0].Key.marcroContent[this.myKey][6])){
                    //console.log('keycodeContent',doc[0]);
                    this.keycodeContent = doc[0].Key.marcroContent[this.myKey][6];

                }else{
                    //console.log('keycodeContent is undefind')
                    this.keycodeContent =  "输入按键（可能包括Shift、Ctrl、Alt)"
                }
            }
        })
    }

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
        this.outputEvent.emit(3);
    }

    keywasSet() {
        //console.log('ke11111');
        // //console.log(this.mutiobj);
        //console.log(this.MarcroMap.indexOf(this.keycodeContent.toLowerCase()));

        let keyset = this.MarcroMap.indexOf(this.keycodeContent.toLowerCase());

        this.setMacroarr[0] = 0x80;
        this.setMacroarr[1] = 0x01;
        this.setMacroarr[2] = keyset;
        this.setMacroarr[3] = 0x00;
        this.setMacroarr[4] = 0x01;
        this.setMacroarr[5] = keyset;

        // this.setMacroarr[6] = 0x80;
        // this.setMacroarr[7] = 0x01;
        // this.setMacroarr[8] = 0x3A;
        // this.setMacroarr[9] = 0x00;
        // this.setMacroarr[10] = 0x01;
        // this.setMacroarr[11] = 0x3A;



        //console.log('ke222222');
        //console.log(this.setMacroarr);
        // this.setIntoDB();
        this.Keyhasbeenset.emit(this.myKey);
    }

    keycodeGet(event) {
        let char = event.code;
        this.keycodeContent = char; //對應keycode儲存
        this.setMacroarr[6] = this.keycodeContent
        // //console.log("key:"+this.keycodeContent);
    }


    setIntoDB() {
        //console.log('SB1111');
        //functinKey決定已經選定在選項時

        //本頁啟動時產生的mutiobj更新內容
        this.mutiobj.KeyDataValue[this.myKey] = 0xB2;
        this.mutiobj.Key.marcroContent[this.myKey] = this.setMacroarr;

        // this.mutiobj.shelf01 = this.LastarrayindexArr;
        //console.log(this.mutiobj);//不要刪
        this.db.UpdateProfile(this.mutiobj.id, this.mutiobj).then((doc: any) => {
            //console.log('SB222');

            //console.log('update success');
            //console.log(this.setMacroarr);
            // //console.log(doc[0]);
            //console.log(this.mutiobj.id);
            // this.MacrosetIn();
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




    //this.MarcroMap.indexOf(rewordstring)

    MacrosetIn() {
        if (this.macrosavecick == 0) {
            //console.log('setMatrix ended0000');
            //console.log(this.setMacroarr);


            this.macrosavecick = 1;
            this.loading(1);
            this.gamemoment = "stopApmode";
            this.outputGame();
            // this.setIntoDB();
            this.keywasSet();
            //console.log('ke3333');
            // this.setInArr();
            // this.macrosavecick++;

            // if (this.macrosavecick == 1) {
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

                //console.log('setMatrix ended1111');
                //console.log(this.setMacroarr);


                data[this.myKey] = 0xB2;
                //console.log('thiskeyshow:' + this.myKey);

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


                //console.log('setMatrix ended2222');
                //console.log(this.setMacroarr);

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
                    //console.log('setMatrix ended5555');
                    //console.log(this.setMacroarr);

                    setTimeout(() => {


                        var marcoarr = [];
                        for (let i = 0; i < this.setMacroarr.length; i++) {

                            marcoarr[i] = this.setMacroarr[i]; //排進arr
                            //console.log('seeMac:' + this.setMacroarr);

                        }




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

                        this.protocol.RunSetFunction(obj3).then((data) => {
                            //console.log("Container RunSetFunction:" + data);
                            //console.log('dfdfd');

                        });
                        setTimeout(() => {
                            this.setIntoDB();
                            this.gamemoment = 'startApmode';
                            this.outputGame();
                            this.macrosavecick = 0;
                            this.loading(0);
                            // this.keywasSet();
                        }, 3000);


                    }, 200);

                })

            })
        }
    }

}

