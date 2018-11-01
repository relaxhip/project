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
    selector: 'side05-app',
    templateUrl: './components/pages/side05.compo.html',
    //template: '<h1>我的第一个 Angular 应用</h1>',
    styleUrls: ['./css/first.css'],
    providers: [protocolService, dbService],
    inputs: ['myKey', 'mutiobj']
})

export class side05Component implements OnInit {
    constructor(private protocol: protocolService, private db: dbService, private getDeviceService: GetDeviceService, private emitService: EmitService) {
        //console.log('side05 loading complete');
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
        this.outputEvent.emit(5);
    }

    keywasSet() {
        this.Keyhasbeenset.emit(this.myKey);
    }
    changeprofile:any='2';
    myKey: string;
    MarcroMap: any = [
        '0', '', '', '',
        'keya', 'keyb', 'keyc', 'keyd', 'keye', 'keyf', 'keyg', 'keyh', 'keyi', 'keyj', 'keyk', 'keyl', 'keym', 'keyn',
        'keyo', 'keyp', 'keyq', 'keyr', 'keys', 'keyt', 'keyu', 'keyv', 'keyw', 'keyx', 'keyy', 'keyz', 'digit1', 'digit2',
        'digit3', 'digit4', 'digit5', 'digit6', 'digit7', 'digit8', 'digit9', 'digit0',
        'enter', 'escape', 'backspace', 'tab', 'space',
        'Minus', 'Equal', 'BracketLeft', 'BracketRight', 'Backslash', 'europe 1 (note 2)', 'Semicolon', 'Quote', 'Backquote', 'Comma', 'Period', 'Slash', 'CapsLock',
        'f1', 'f2', 'f3', 'f4', 'f5', 'f6', 'f7', 'f8', 'f9', 'f10', 'f11', 'f12',
        'print screen (note 1)',
        'ScrollLock', 'break (ctrl-pause)', 'Insert', 'Home', 'PageUp',
        'Delete', 'end', 'pagedown', 'ArrowRight', 'ArrowLeft',
        'ArrowDown', 'ArrowUp', 'NumLock', 'NumpadDivide', 'NumpadMultiply', 'NumpadSubtract',
        'NumpadAdd', 'NumpadEnter', 'Numpad1', 'Numpad2', 'Numpad3', 'Numpad4',
        'Numpad5', 'Numpad6', 'Numpad7', 'Numpad8', 'Numpad9', 'Numpad0',
        'NumpadDecimal', 'europe 2 (note 2)', 'ContextMenu', 'keyboard power', 'keypad =', 'f13', 'f14', 'f15',
        'f16', 'f17', 'f18', 'f19', 'f20', 'f21', 'f22', 'f23', 'f24', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', 'keypad',
        'keyboard int', 'keyboard intl2', 'keyboard intl 2', '¥', 'keyboard intl 4', 'keyboard intl 5', '', '', '', '', 'keyboard lang 1',
        , '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', 'stop', 'scan previous track', 'play/ pause', 'scan next track',
        'mute', 'volume down', 'volume up', 'fn', '', '', '', 'gamemode', 'winlock',
        'macro', 'lanuch', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', 'leftclick', 'rightclick', 'wheelclick', 'scrolldown',
        'scrollup', 'backward', 'forward', 'doubleclick', 'intensity_up',
        'intensity_down', 'intensity_sw', 'led_mode_up', 'led_mode_down', 'led_mode_sw',
        'led_dir_s_z_w', 'led_dir_x_y_n', 'led_speed_jia ', 'led_speed_jian', 'ControlLeft', 'ShiftLeft', 'AltLeft', 'MetaLeft', 'ControlRight', 'ShiftRight', 'AltRight', 'MetaRight', '', '', '', '', '', '', '', '', 'led_coustom_mode',
        'volume_mode '

    ];
    setMacroarr: any = [];
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
    saveclick: number = 0;
    mutiobj: any = {};
    finalclick: number;
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


            if (this.mutiobj.Key.options.OPshelf01[4] !== undefined) {
                //console.log('readdbMacr222');

                this.clickOnitem(this.mutiobj.Key.options.OPshelf01[4]);
            }

        });
    }


    ngOnInit() {
        this.readdb()
    }

    clickOnitem(w) {

        this.finalclick = w;
        this.setMacroarr.length = 0;

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
        this.check14 = false;


        if (w == 0) {

            this.setMacroarr[0] = 0x80;
            this.setMacroarr[1] = 0x01;
            this.setMacroarr[2] = 0xE2;
            this.setMacroarr[3] = 0x80;
            this.setMacroarr[4] = 0x01;
            this.setMacroarr[5] = 0x3D;
            this.setMacroarr[6] = 0x00;
            this.setMacroarr[7] = 0x01;
            this.setMacroarr[8] = 0xE2;
            this.setMacroarr[9] = 0x00;
            this.setMacroarr[10] = 0x01;
            this.setMacroarr[11] = 0x3D;

            this.check01 = true;


        }
        if (w == 1) {
            this.setMacroarr[0] = 0x80;
            this.setMacroarr[1] = 0x01;
            this.setMacroarr[2] = 0xE2;
            this.setMacroarr[3] = 0x80;
            this.setMacroarr[4] = 0x01;
            this.setMacroarr[5] = 0x2C;
            this.setMacroarr[6] = 0x80;
            this.setMacroarr[7] = 0x01;
            this.setMacroarr[8] = 0x1B;
            this.setMacroarr[9] = 0x00;
            this.setMacroarr[10] = 0x01;
            this.setMacroarr[11] = 0xE2;
            this.setMacroarr[12] = 0x00;
            this.setMacroarr[13] = 0x01;
            this.setMacroarr[14] = 0x2C;
            this.setMacroarr[15] = 0x00;
            this.setMacroarr[16] = 0x01;
            this.setMacroarr[17] = 0x1B;
            // this.setMacroarr[0] = 0x80;
            // this.setMacroarr[1] = 0x02;
            // this.setMacroarr[2] = 0xE2;
            // this.setMacroarr[3] = 0x00;
            // this.setMacroarr[4] = 0x02;
            // this.setMacroarr[5] = 0xE2;
            // this.setMacroarr[6] = 0x80;
            // this.setMacroarr[7] = 0x02;
            // this.setMacroarr[8] = 0x2A;
            // this.setMacroarr[9] = 0x00;
            // this.setMacroarr[10] =0x02;
            // this.setMacroarr[11] =0x2A;
            // this.setMacroarr[12] =0x00;
            // this.setMacroarr[13] =0x03;
            // this.setMacroarr[14] =0x1B;
            // this.setMacroarr[15] =0x00;
            // this.setMacroarr[16] =0x03;
            // this.setMacroarr[17] =0x1B;


            this.check02 = true;



        }
        if (w == 2) {
            this.setMacroarr[0] = 0x80;
            this.setMacroarr[1] = 0x01;
            this.setMacroarr[2] = 0xE2;
            this.setMacroarr[3] = 0x80;
            this.setMacroarr[4] = 0x01;
            this.setMacroarr[5] = 0x2C;
            this.setMacroarr[6] = 0x80;
            this.setMacroarr[7] = 0x01;
            this.setMacroarr[8] = 0x11;
            this.setMacroarr[9] = 0x00;
            this.setMacroarr[10] = 0x01;
            this.setMacroarr[11] = 0xE2;
            this.setMacroarr[12] = 0x00;
            this.setMacroarr[13] = 0x01;
            this.setMacroarr[14] = 0x2C;
            this.setMacroarr[15] = 0x00;
            this.setMacroarr[16] = 0x01;
            this.setMacroarr[17] = 0x11;


            this.check03 = true;



        }

        if (w == 3) {
            //显示桌面（Windows键+D）

            this.setMacroarr[0] = 0x80;
            this.setMacroarr[1] = 0x01;
            this.setMacroarr[2] = 0xE3;
            this.setMacroarr[3] = 0x80;
            this.setMacroarr[4] = 0x01;
            this.setMacroarr[5] = 0x07;
            this.setMacroarr[6] = 0x00;
            this.setMacroarr[7] = 0x01;
            this.setMacroarr[8] = 0xE3;
            this.setMacroarr[9] = 0x00;
            this.setMacroarr[10] = 0x01;
            this.setMacroarr[11] = 0x07;

            this.check04 = true;



        }
        if (w == 4) {
            this.setMacroarr[0] = 0x80;
            this.setMacroarr[1] = 0x01;
            this.setMacroarr[2] = 0xE0;
            this.setMacroarr[3] = 0x80;
            this.setMacroarr[4] = 0x01;
            this.setMacroarr[5] = 0x2B;
            this.setMacroarr[6] = 0x00;
            this.setMacroarr[7] = 0x01;
            this.setMacroarr[8] = 0xE0;
            this.setMacroarr[9] = 0x00;
            this.setMacroarr[10] = 0x01;
            this.setMacroarr[11] = 0x2B;


            this.check05 = true;

        }
        if (w == 5) {
            this.setMacroarr[0] = 0x80;
            this.setMacroarr[1] = 0x01;
            this.setMacroarr[2] = 0xE0;
            this.setMacroarr[3] = 0x80;
            this.setMacroarr[4] = 0x01;
            this.setMacroarr[5] = 0xE1;
            this.setMacroarr[6] = 0x80;
            this.setMacroarr[7] = 0x01;
            this.setMacroarr[8] = 0x2B;
            this.setMacroarr[9] = 0x00;
            this.setMacroarr[10] = 0x01;
            this.setMacroarr[11] = 0xE0;
            this.setMacroarr[12] = 0x00;
            this.setMacroarr[13] = 0x01;
            this.setMacroarr[14] = 0xE1;
            this.setMacroarr[15] = 0x00;
            this.setMacroarr[16] = 0x01;
            this.setMacroarr[17] = 0x2B;

            this.check06 = true;


        }
        if (w == 6) {
            this.setMacroarr[0] = 0x80;
            this.setMacroarr[1] = 0x02;
            this.setMacroarr[2] = 0xE0;
            this.setMacroarr[3] = 0x80;
            this.setMacroarr[4] = 0x02;
            this.setMacroarr[5] = 0xC0;
            this.setMacroarr[6] = 0x00;
            this.setMacroarr[7] = 0x02;
            this.setMacroarr[8] = 0xC0;
            this.setMacroarr[6] = 0x00;
            this.setMacroarr[7] = 0x02;
            this.setMacroarr[8] = 0xE0;
            // this.setMacroarr[6] = 0x00;
            // this.setMacroarr[7] = 0x08;
            // this.setMacroarr[8] = 0xE0;

            this.check07 = true;



        }
        if (w == 7) {
            this.setMacroarr[0] = 0x80;
            this.setMacroarr[1] = 0x02;
            this.setMacroarr[2] = 0xE0;
            this.setMacroarr[3] = 0x80;
            this.setMacroarr[4] = 0x02;
            this.setMacroarr[5] = 0xC1;
            this.setMacroarr[6] = 0x00;
            this.setMacroarr[7] = 0x02;
            this.setMacroarr[8] = 0xC1;
            this.setMacroarr[6] = 0x00;
            this.setMacroarr[7] = 0x02;
            this.setMacroarr[8] = 0xE0;


            this.check08 = true;


        }
        if (w == 8) {
            this.setMacroarr[0] = 0x80;
            this.setMacroarr[1] = 0x02;
            this.setMacroarr[2] = 0xE0;
            this.setMacroarr[3] = 0x80;
            this.setMacroarr[4] = 0x02;
            this.setMacroarr[5] = 0x27;
            this.setMacroarr[6] = 0x00;
            this.setMacroarr[7] = 0x02;
            this.setMacroarr[8] = 0x27;
            this.setMacroarr[6] = 0x00;
            this.setMacroarr[7] = 0x02;
            this.setMacroarr[8] = 0xE0;


            this.check09 = true;


        }
        if (w == 9) {
            this.setMacroarr[0] = 0x80;
            this.setMacroarr[1] = 0x01;
            this.setMacroarr[2] = 0xE0;
            this.setMacroarr[3] = 0x80;
            this.setMacroarr[4] = 0x01;
            this.setMacroarr[5] = 0x06;
            this.setMacroarr[6] = 0x00;
            this.setMacroarr[7] = 0x01;
            this.setMacroarr[8] = 0xE0;
            this.setMacroarr[9] = 0x00;
            this.setMacroarr[10] = 0x01;
            this.setMacroarr[11] = 0x06;

            this.check10 = true;


        }
        if (w == 10) {
            this.setMacroarr[0] = 0x80;
            this.setMacroarr[1] = 0x01;
            this.setMacroarr[2] = 0xE0;
            this.setMacroarr[3] = 0x80;
            this.setMacroarr[4] = 0x01;
            this.setMacroarr[5] = 0x1B;
            this.setMacroarr[6] = 0x00;
            this.setMacroarr[7] = 0x01;
            this.setMacroarr[8] = 0xE0;
            this.setMacroarr[9] = 0x00;
            this.setMacroarr[10] = 0x01;
            this.setMacroarr[11] = 0x1B;

            this.check11 = true;


        }
        if (w == 11) {
            this.setMacroarr[0] = 0x80;
            this.setMacroarr[1] = 0x01;
            this.setMacroarr[2] = 0xE0;
            this.setMacroarr[3] = 0x80;
            this.setMacroarr[4] = 0x01;
            this.setMacroarr[5] = 0x19;
            this.setMacroarr[6] = 0x00;
            this.setMacroarr[7] = 0x01;
            this.setMacroarr[8] = 0xE0;
            this.setMacroarr[9] = 0x00;
            this.setMacroarr[10] = 0x01;
            this.setMacroarr[11] = 0x19;

            this.check12 = true;

        }
        if (w == 12) {
            this.setMacroarr[0] = 0x80;
            this.setMacroarr[1] = 0x01;
            this.setMacroarr[2] = 0xE0;
            this.setMacroarr[3] = 0x80;
            this.setMacroarr[4] = 0x01;
            this.setMacroarr[5] = 0x1D;
            this.setMacroarr[6] = 0x00;
            this.setMacroarr[7] = 0x01;
            this.setMacroarr[8] = 0xE0;
            this.setMacroarr[9] = 0x00;
            this.setMacroarr[10] = 0x01;
            this.setMacroarr[11] = 0x1D;

            this.check13 = true;


        }
        if (w == 13) {
            this.setMacroarr[0] = 0x80;
            this.setMacroarr[1] = 0x01;
            this.setMacroarr[2] = 0xE0;
            this.setMacroarr[3] = 0x80;
            this.setMacroarr[4] = 0x01;
            this.setMacroarr[5] = 0x1C;
            this.setMacroarr[6] = 0x00;
            this.setMacroarr[7] = 0x01;
            this.setMacroarr[8] = 0xE0;
            this.setMacroarr[9] = 0x00;
            this.setMacroarr[10] = 0x01;
            this.setMacroarr[11] = 0x1C;

            this.check14 = true;


        }
        else {
            return false;
        }


    }
    setIntoDB() {
        //console.log('setIntoDB1111')

        //functinKey決定已經選定在選項時

        //本頁啟動時產生的mutiobj更新內容
        this.mutiobj.KeyDataValue[this.myKey] = 0xB2;

        this.mutiobj.Key.marcroContent[this.myKey] = this.setMacroarr;
        //console.log(this.mutiobj);
        this.mutiobj.Key.options.OPshelf01[4] = this.finalclick;

        this.db.UpdateProfile(this.mutiobj.id, this.mutiobj).then((doc: any) => {
            //console.log('setIntoDB success');
            //console.log(this.mutiobj);
        });
    }
    MacrosetIn() {


        // this.saveclick++;
        if (this.saveclick == 0) {
            //console.log('setIntoDB222')
            this.saveclick = 1
            this.gamemoment = "stopApmode";
            this.outputGame()
            this.loading(1);
            this.setIntoDB();
            // this.keywasSet()
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
                        //console.log(this.setMacroarr);
                        var marcoarr = [];
                        for (let i = 0; i < this.setMacroarr.length; i++) {
                            marcoarr[i] = this.setMacroarr[i]; //排進arr
                        }





                        // marcoarr[0] = 0x80;
                        // marcoarr[1] = 0x01;
                        // marcoarr[2] = 0x06;
                        // marcoarr[3] = 0x00;
                        // marcoarr[4] = 0x01;
                        // marcoarr[5] = 0x06;



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
                        });
                        setTimeout(() => {
                            this.gamemoment = "startApmode";
                            this.outputGame();
                            this.saveclick = 0;
                            this.loading(0);
                            this.keywasSet();
                        }, 3000);

                    }, 150);
                })
            });

        }
    }
}