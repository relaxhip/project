declare var System;
import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { protocolService } from '../services/service/protocol.service';

const { ipcRenderer } = System._nodeRequire('electron');
declare var $: any;

import { ElectronEventService, dbService, EmitService } from '../services/libs/electron/index';
import { GetDeviceService } from '../services/device/GetDevice.service';
import { Subscription } from "rxjs/Subscription";
import { icpEventService } from '../services/service/icpEventService.service';



let evtVar = System._nodeRequire('./backend/others/eventVariable');
let funcVar = System._nodeRequire('./backend/others/FunctionVariable');
let env = System._nodeRequire('./backend/others/env');


@Component({
    selector: 'meeting-effect',
    templateUrl: './components/effect/meeting.compo.html',
    //template: '<h1>我的第一个 Angular 应用</h1>',
    styleUrls: ['./css/first.css', './css/kbd.css', './css/meeting.css', './css/attractlight.css'],
    providers: [protocolService, dbService, icpEventService],
    inputs: ['ProfileDetail', 'ttitle', 'getGameChange', 'updatenow', 'changeProfile']
})



export class meetingComponent implements OnInit {
    constructor(private protocol: protocolService, private db: dbService, private getDeviceService: GetDeviceService, private emitService: EmitService, private icpEventService: icpEventService) {
        //console.log('meeting loading complete');
        this.subscription = this.emitService.EmitObservable.subscribe(src => {
            if (src == 'insert') {
                // //this.setAPmode();//連續下值預備動作
                // this.detectButton();
                this.plugIn();
            }
            if (src == 'remove') {
                this.goOut();
                //console.log('out');
            }
            this.fromicp = src;
            //console.log(this.fromicp.data);
            //console.log('test:' + this.fromicp.data);

            if (this.fromicp.data !== undefined) {
                if (this.fromicp.data[1] == 225 && this.fromicp.data[2] == 4 && this.fromicp.data[3] == 1) {//Fn按下
                    this.set128 = 128;
                    this.fnflag = 1;
                    //console.log('fn1111' + this.set128)
                } else {

                    if (this.fromicp.data[1] == 7 && this.fromicp.data[2] == 7 && this.fromicp.data[5] == 1) {//normalkey 按下
                        //console.log('normal1111');
                        this.keyfuncposition = this.fromicp.data[3] * 8 + this.fromicp.data[4]

                        if (this.fnflag !== 1) {
                            this.doItfunction(this.keyfuncposition);
                        } else {
                            // this.keypositionX = this.fromicp.data[3];
                            // this.keypositionY = this.fromicp.data[4];
                            //console.log('fn444' + this.set128)
                            this.keyfuncposition = this.fromicp.data[3] * 8 + this.fromicp.data[4] + this.set128;
                            //console.log('this.keyfuncposition' + this.keyfuncposition);
                            // //console.log('this.keyfuncposition get');
                            this.doItfunction(this.keyfuncposition);

                        }

                        // this.fnflag = 0;
                    }
                }
                if (this.fromicp.data[1] == 225 && this.fromicp.data[2] == 5 && this.fromicp.data[3] == 2) {//Fn放開
                    this.fnflag = 0;
                    //console.log('fn222' + this.set128)
                }

                // if (this.fnflag == 1) {
                // 	//console.log('fn333' + this.set128)
                // 	if (this.fromicp.data[1] == 7 && this.fromicp.data[2] == 7 && this.fromicp.data[5] == 1) {//normalkey 按下
                // 		// this.keypositionX = this.fromicp.data[3];
                // 		// this.keypositionY = this.fromicp.data[4];
                // 		//console.log('fn444' + this.set128)
                // 		this.keyfuncposition = this.fromicp.data[3] * 8 + this.fromicp.data[4] + this.set128;
                // 		//console.log('this.keyfuncposition' + this.keyfuncposition);
                // 		// //console.log('this.keyfuncposition get');
                // 		this.doItfunction(this.keyfuncposition);
                // 	}
                // }
            }
            if (this.fromicp.data !== undefined) {
                if (this.fromicp.data[0] == 4 && this.fromicp.data[1] == 225 && this.fromicp.data[2] == 15 && this.fromicp.data[3] == 1) {
                    //console.log("attleft");
                    this.lightBar(1);
                    this.attbtn = false;
                    this.defaultLb = true;
                }
                else if (this.fromicp.data[0] == 4 && this.fromicp.data[1] == 225 && this.fromicp.data[2] == 16 && this.fromicp.data[3] == 2) {
                    //console.log("attright");
                    this.lightBar(0);
                    this.attbtn = true;
                    this.defaultLb = false;
                }
            }
            // if (this.fromicp.data !== undefined && this.timeEventFlag == true) {
            //     this.timeEvent();
            // }
            this.attPt01();
            this.attPt02();
            this.attPt03();
            var vm = this;
            if (this.mode == 0) {
                clearTimeout(this.timeStop);
                this.mode++
                if (this.mode == 1 || this.attPt == 0) {
                    this.timeStop = setTimeout(() => {
                        vm.cleanBar();
                    }, 5000);
                    this.mode = 0
                }
            }
        })
    }
    saveapmode: boolean = false; //doapmode的執行判斷用布林值
    changeProfile: any = '2';
    keeploading: boolean = true;
    timeStop: any;
    mode: any = 0;
    fnflag: number = 0;
    nowobj: any;
    ProfileDetail: any;
    attbtn: boolean;
    defaultLb: boolean;
    // blockcss: any = "disabled";
    @Output() openFrtp: EventEmitter<any> = new EventEmitter();
    @Output() effectfinish: EventEmitter<any> = new EventEmitter();

    openFrtpfun(w) {
        //console.log('送值' + w)
        // this.openFrtp.emit(w);
        if (w == 1) {
            this.openFrtp.emit(w);
            // this.loading = true;
        }
        if (w == 0) {
            this.openFrtp.emit(w);
            // this.loading = false;
        }

    }

    attPt01() {
        if (this.data == 0) {
            if (this.attPt >= 98) {
                // for (let i = 0; i < 104; i++) {
                // this.array1[i] = this.arrayAtt[i];
                this.array1 = this.arrayAtt;
                // }
                this.attLight();
                this.cleanBar();
            }
        }
    }
    attPt02() {
        if (this.data == 0) {
            if (this.attPt >= 98) {
                // for (let i = 0; i < 104; i++) {
                // this.array1[i] = this.arrayAtt[i];
                this.array2 = this.arrayAtt;
                // }
                this.attLight();
            }
        }
    }
    attPt03() {
        if (this.data == 0) {
            if (this.attPt >= 98) {
                // for (let i = 0; i < 104; i++) {
                // this.array1[i] = this.arrayAtt[i];
                this.array3 = this.arrayAtt;
                // }
                this.attLight();
            }
        }
    }

    //檢查fn和normal key
    presstime: number = 0;//計算FUNCTION KEY按鍵次數
    pausetime: number = 0;
    openclose: number = 0;
    keypositionX: any;
    keypositionY: any;
    dofunctionName: any;
    time: any = 0;
    set128: any = 0;
    keyfuncposition: any;
    fromicp: any;
    speedhere: any = 30;
    setAp: number = 0;
    subscription: Subscription;
    savechange: number = 0;
    currentV: any;
    changeV: any;
    cuteValue: any = 0.5;
    speedValue: any = 100;
    loading: boolean;
    Effectdirection: any = 3;
    NewtimeValue: any;
    ttitle: string;


    timeValue: any = 10;
    timeCount: any;
    timewarn: boolean = false;
    @Output() outputTtile: EventEmitter<any> = new EventEmitter();

    sendTtile() {
        this.outputTtile.emit(this.ttitle);
    }

    @Output() passTime = new EventEmitter();

    @Input() attPt;

    // timeInput(e) {
    //     this.detectEffectChange();
    //     this.passTime.emit(e);
    //     this.timeCount = e
    //     var vm = this;
    //     window.addEventListener('keydown', function (e) {
    //         if (e.keyCode == 13) {
    //             if (vm.timeCount < 1 || isNaN(vm.timeCount)) {
    //                 // alert('请输入 1 ~ 9999 之数值');
    //                 vm.timeValue = 10;
    //                 vm.timewarn = true
    //                 setTimeout(() => {
    //                     vm.timewarn = false;
    //                 }, 3000);
    //             } else {
    //                 setTimeout(() => {
    //                     clearInterval(vm.getclr01);
    //                     clearInterval(vm.getclr02);
    //                     clearInterval(vm.getclr03);
    //                     vm.leave = 0;
    //                 }, vm.timeCount * 59990);
    //             }
    //             document.getElementById('time').blur();
    //         }
    //     })
    // }

    resetTime: any;
    timeInput(e) {
        this.detectEffectChange();
        this.timeValue = e;
        this.passTime.emit(this.timeValue);
        var vm = this;
        window.addEventListener('keydown', function (e) {
            if (e.keyCode == 13) {
                clearTimeout(vm.resetTime);
                if (vm.timeValue < 1 || isNaN(vm.timeValue)) {
                    vm.timeValue = 10;
                    vm.timewarn = true
                    setTimeout(() => {
                        vm.timewarn = false;
                    }, 3000);
                } else {
                    document.getElementById('time').blur();
                }
            }
        })
    }

    timeBlur() {
        if (this.timeValue == "" || this.timeValue < 1 || isNaN(this.timeValue)) {
            this.timeValue = 10;
            this.timewarn = true
            setTimeout(() => {
                this.timewarn = false;
            }, 3000);
        } else {
            return false;
        }
    }

    timeEventFlag: boolean = false;
    defaultFlag: boolean = true;
    blockTime: boolean = true;
    lightBarStatus: any;
    @Input() lightBS;
    @Output() sendStatus = new EventEmitter();

    sendLBS() {
        if (this.lightBarStatus !== undefined) {
            this.sendStatus.emit(this.lightBarStatus);
        }
    }

    lightBar(x) {
        if (x == 1) {
            this.data = 1;
            this.lightBarStatus = this.data;
            this.array1 = this.arrayKb1;
            this.array2 = this.arrayKb2;
            this.array3 = this.arrayKb3;
            this.logo1_att = "";
            this.logo2_att = "";
            // this.getColor1();
            // this.getColor2();
            // this.getColor3();
            this.attBar(1);
            this.sendLBS();
        }
        else if (x == 0) {
            this.data = 0;
            this.lightBarStatus = this.data;
            this.upAtt = ["Upside1_att", "Upside2_att", "Upside3_att", "Upside4_att", "Upside5_att", "Upside6_att", "Upside7_att", "Upside8_att", "Upside9_att", "Upside10_att", "Upside11_att", "Upside12_att", "Upside13_att", "Upside14_att", "Upside15_att", "Upside16_att", "Upside17_att", "Upside18_att", "Upside19_att", "Upside20_att", "logo1_att", "logo2_att"];
            this.attBar(0);
            this.sendLBS();
        }
    }

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
                //console.log('按鈕位置在右邊')
                this.lightBar(0);
                this.attbtn = true;
                this.defaultLb = false;
            }
            else if (data[5] == 0) {
                //console.log('按鈕位置在左邊')
                this.lightBar(1);
                this.attbtn = false;
                this.defaultLb = true;
            }
        })
    }

    attPercent: any;
    upAtt: any = [];
    getkeymatrixKB() {
        let data = {
            Flag: '1'
        }

        let obj1 = {
            Type: funcVar.FuncType.Device,
            Func: funcVar.FuncName.GetDefaultKeyMatrix,
            Param: data
        }

        this.protocol.RunSetFunction(obj1).then((data) => {
            //console.log('do getkeymatrixKB');
        });
    }

    ngOnInit() {
        this.timeValue = 10;
        env.log('light-effect', 'meeting', 'start');
        this.LEDmatrix();//找出對應按鍵;
        this.setDefault(1);
        this.readTemp();
        this.sendTimeCloseFlag.emit(false);
        setTimeout(() => {
            this.doApmode01();
        }, 500);

        if (this.lightBS == 0) {
            //console.log("from parent LBS 0 attRight", this.lightBS);
            this.lightBar(0);
            this.attbtn = true;
            this.defaultLb = false;
        }
        else if (this.lightBS == 1) {
            //console.log("from parent LBS 1 attLeft", this.lightBS)
            this.lightBar(1);
            this.attbtn = false;
            this.defaultLb = true;
        }
    }

    ngOnChanges(changes: any) {
        this.detectEffectChange()
        // changes.prop contains the old and the new value...
        for (let propName in changes) {

            this.changeV = changes[propName];
            this.currentV = JSON.stringify(this.changeV.currentValue);
            let prev = JSON.stringify(this.changeV.previousValue);
            //console.log('getGame11111');
            //console.log(this.savechange);
            //console.log(this.currentV);
        }


        if (this.currentV == '"stopApmode"' && this.savechange == 0) {
            this.savechange = 1;
            this.goOut();
            // if (this.envio == 1) {
                env.log('meeting', 'apmode', 'stopapmode')
            // }
            // this.savechange = 0
            //console.log('222')
            // //console.log(this.savechange)
        }
        if (this.currentV == '"startApmode"' && this.savechange == 0) {
            this.savechange = 1;
            this.plugIn();
            this.attBar(0);
            // if (this.envio == 1) {
                env.log('meeting', 'apmode', 'startapmode')
            // }
            // this.savechange = 0
            //console.log('333')
            // //console.log(this.savechange)

        }

        if (this.currentV == '"changeProfile"') {
            //console.log('beginreloading');
            this.keeploading = false;
            // this.subscription.unsubscribe();
            this.goOut();

            let vm = this;
            setTimeout(() => {
                this.leave = 1;
                vm.ngOnInit();
            }, 200);

        }

        if (this.currentV == '"changePage"') {
            //console.log('beginreloading');
            this.keeploading = false;
            // this.subscription.unsubscribe();
            this.goOut();

            let vm = this;
            setTimeout(() => {
                this.leave = 1;
                vm.ngOnInit();
            }, 200);

        }

        // //console.log(prev);
        if (this.currentV == '"updatenow"') {
            //console.log('beginreloading');
            this.keeploading = true;
            // this.subscription.unsubscribe();
            this.goOut();

            let vm = this;
            setTimeout(() => {
                this.leave = 1;
                vm.ngOnInit();
            }, 200);

        }

        if (this.currentV == '"setintoDB"') {
            //console.log('beginSetinDb');

            // this.subscription.unsubscribe();
            setTimeout(() => {
                this.setIntoDB();
            }, 6000)
        }

        if (this.currentV == '"setTime"') {
            this.timeBlur();
        }

        if (this.check01 == true) {
            this.blockTime = false;
        } else {
            this.blockTime = true;
        }
    }


    //取值區

    leave: any = 1;
    firstKB: any;
    positionR: any;
    positionG: any;
    positionB: any;
    positionRarr: any = [];
    positionGarr: any = [];
    positionBarr: any = [];

    array1: any = ["esc", "f1", "f2", "f3", "f4", "f5", "f6", "f7", "f8", "f9", "f10", "f11", "f12", "print", "scroll", "pause", "perid", "n1", "n2", "n3", "n4", "n5", "n6", "n7", "n8", "n9", "n0", "minus", "plus", "bsp", "insert", "home", "pup", "numlock", "numdrawn", "numtimes", "numminus", "tab", "q", "w", "e", "r", "t", "y", "u", "i", "o", "p", "lqu", "rqu", "delete", "drawn", "end", "pdown", "num7", "num8", "num9", "numplus", "caps", "a", "s", "d", "f", "g", "h", "j", "k", "l", "sem", "quo", "enter", "num4", "num5", "num6", "lshift", "z", "x", "c", "v", "b", "n", "m", "comma", "dot", "qmark", "rshift", "up", "num1", "num2", "num3", "numenter", "lctrl", "win", "lalt", "space", "ralt", "fn", "book", "rctrl", "left", "down", "right", "num0", "numdot", "Upside1", "Upside2", "Upside3", "Upside4", "Upside5", "Upside6", "Upside7", "Upside8", "Upside9", "Upside10", "Upside11", "Upside12", "Upside13", "Upside14", "Upside15", "Upside16", "Upside17", "Upside18", "Upside19", "Upside20", "logo1", "logo2"];

    array2: any = ["esc_2", "f1_2", "f2_2", "f3_2", "f4_2", "f5_2", "f6_2", "f7_2", "f8_2", "f9_2", "f10_2", "f11_2", "f12_2", "print_2", "scroll_2", "pause_2", "perid_2", "n1_2", "n2_2", "n3_2", "n4_2", "n5_2", "n6_2", "n7_2", "n8_2", "n9_2", "n0_2", "minus_2", "plus_2", "bsp_2", "insert_2", "home_2", "pup_2", "numlock_2", "numdrawn_2", "numtimes_2", "numminus_2", "tab_2", "q_2", "w_2", "e_2", "r_2", "t_2", "y_2", "u_2", "i_2", "o_2", "p_2", "lqu_2", "rqu_2", "delete_2", "drawn_2", "end_2", "pdown_2", "num7_2", "num8_2", "num9_2", "numplus_2", "caps_2", "a_2", "s_2", "d_2", "f_2", "g_2", "h_2", "j_2", "k_2", "l_2", "sem_2", "quo_2", "enter_2", "num4_2", "num5_2", "num6_2", "lshift_2", "z_2", "x_2", "c_2", "v_2", "b_2", "n_2", "m_2", "comma_2", "dot_2", "qmark_2", "rshift_2", "up_2", "num1_2", "num2_2", "num3_2", "numenter_2", "lctrl_2", "win_2", "lalt_2", "space_2", "ralt_2", "fn_2", "book_2", "rctrl_2", "left_2", "down_2", "right_2", "num0_2", "numdot_2", "Upside1_2", "Upside2_2", "Upside3_2", "Upside4_2", "Upside5_2", "Upside6_2", "Upside7_2", "Upside8_2", "Upside9_2", "Upside10_2", "Upside11_2", "Upside12_2", "Upside13_2", "Upside14_2", "Upside15_2", "Upside16_2", "Upside17_2", "Upside18_2", "Upside19_2", "Upside20_2", "logo1_2", "logo2_2"]

    array3: any = ["esc_3", "f1_3", "f2_3", "f3_3", "f4_3", "f5_3", "f6_3", "f7_3", "f8_3", "f9_3", "f10_3", "f11_3", "f12_3", "print_3", "scroll_3", "pause_3", "perid_3", "n1_3", "n2_3", "n3_3", "n4_3", "n5_3", "n6_3", "n7_3", "n8_3", "n9_3", "n0_3", "minus_3", "plus_3", "bsp_3", "insert_3", "home_3", "pup_3", "numlock_3", "numdrawn_3", "numtimes_3", "numminus_3", "tab_3", "q_3", "w_3", "e_3", "r_3", "t_3", "y_3", "u_3", "i_3", "o_3", "p_3", "lqu_3", "rqu_3", "delete_3", "drawn_3", "end_3", "pdown_3", "num7_3", "num8_3", "num9_3", "numplus_3", "caps_3", "a_3", "s_3", "d_3", "f_3", "g_3", "h_3", "j_3", "k_3", "l_3", "sem_3", "quo_3", "enter_3", "num4_3", "num5_3", "num6_3", "lshift_3", "z_3", "x_3", "c_3", "v_3", "b_3", "n_3", "m_3", "comma_3", "dot_3", "qmark_3", "rshift_3", "up_3", "num1_3", "num2_3", "num3_3", "numenter_3", "lctrl_3", "win_3", "lalt_3", "space_3", "ralt_3", "fn_3", "book_3", "rctrl_3", "left_3", "down_3", "right_3", "num0_3", "numdot_3", "Upside1_3", "Upside2_3", "Upside3_3", "Upside4_3", "Upside5_3", "Upside6_3", "Upside7_3", "Upside8_3", "Upside9_3", "Upside10_3", "Upside11_3", "Upside12_3", "Upside13_3", "Upside14_3", "Upside15_3", "Upside16_3", "Upside17_3", "Upside18_3", "Upside19_3", "Upside20_3", "logo1_3", "logo2_3"]

    arrayKb1: any = ["esc", "f1", "f2", "f3", "f4", "f5", "f6", "f7", "f8", "f9", "f10", "f11", "f12", "print", "scroll", "pause", "perid", "n1", "n2", "n3", "n4", "n5", "n6", "n7", "n8", "n9", "n0", "minus", "plus", "bsp", "insert", "home", "pup", "numlock", "numdrawn", "numtimes", "numminus", "tab", "q", "w", "e", "r", "t", "y", "u", "i", "o", "p", "lqu", "rqu", "delete", "drawn", "end", "pdown", "num7", "num8", "num9", "numplus", "caps", "a", "s", "d", "f", "g", "h", "j", "k", "l", "sem", "quo", "enter", "num4", "num5", "num6", "lshift", "z", "x", "c", "v", "b", "n", "m", "comma", "dot", "qmark", "rshift", "up", "num1", "num2", "num3", "numenter", "lctrl", "win", "lalt", "space", "ralt", "fn", "book", "rctrl", "left", "down", "right", "num0", "numdot", "Upside1", "Upside2", "Upside3", "Upside4", "Upside5", "Upside6", "Upside7", "Upside8", "Upside9", "Upside10", "Upside11", "Upside12", "Upside13", "Upside14", "Upside15", "Upside16", "Upside17", "Upside18", "Upside19", "Upside20", "logo1", "logo2"]

    arrayKb2: any = ["esc_2", "f1_2", "f2_2", "f3_2", "f4_2", "f5_2", "f6_2", "f7_2", "f8_2", "f9_2", "f10_2", "f11_2", "f12_2", "print_2", "scroll_2", "pause_2", "perid_2", "n1_2", "n2_2", "n3_2", "n4_2", "n5_2", "n6_2", "n7_2", "n8_2", "n9_2", "n0_2", "minus_2", "plus_2", "bsp_2", "insert_2", "home_2", "pup_2", "numlock_2", "numdrawn_2", "numtimes_2", "numminus_2", "tab_2", "q_2", "w_2", "e_2", "r_2", "t_2", "y_2", "u_2", "i_2", "o_2", "p_2", "lqu_2", "rqu_2", "delete_2", "drawn_2", "end_2", "pdown_2", "num7_2", "num8_2", "num9_2", "numplus_2", "caps_2", "a_2", "s_2", "d_2", "f_2", "g_2", "h_2", "j_2", "k_2", "l_2", "sem_2", "quo_2", "enter_2", "num4_2", "num5_2", "num6_2", "lshift_2", "z_2", "x_2", "c_2", "v_2", "b_2", "n_2", "m_2", "comma_2", "dot_2", "qmark_2", "rshift_2", "up_2", "num1_2", "num2_2", "num3_2", "numenter_2", "lctrl_2", "win_2", "lalt_2", "space_2", "ralt_2", "fn_2", "book_2", "rctrl_2", "left_2", "down_2", "right_2", "num0_2", "numdot_2", "Upside1_2", "Upside2_2", "Upside3_2", "Upside4_2", "Upside5_2", "Upside6_2", "Upside7_2", "Upside8_2", "Upside9_2", "Upside10_2", "Upside11_2", "Upside12_2", "Upside13_2", "Upside14_2", "Upside15_2", "Upside16_2", "Upside17_2", "Upside18_2", "Upside19_2", "Upside20_2", "logo1_2", "logo2_2"];

    arrayKb3: any = ["esc_3", "f1_3", "f2_3", "f3_3", "f4_3", "f5_3", "f6_3", "f7_3", "f8_3", "f9_3", "f10_3", "f11_3", "f12_3", "print_3", "scroll_3", "pause_3", "perid_3", "n1_3", "n2_3", "n3_3", "n4_3", "n5_3", "n6_3", "n7_3", "n8_3", "n9_3", "n0_3", "minus_3", "plus_3", "bsp_3", "insert_3", "home_3", "pup_3", "numlock_3", "numdrawn_3", "numtimes_3", "numminus_3", "tab_3", "q_3", "w_3", "e_3", "r_3", "t_3", "y_3", "u_3", "i_3", "o_3", "p_3", "lqu_3", "rqu_3", "delete_3", "drawn_3", "end_3", "pdown_3", "num7_3", "num8_3", "num9_3", "numplus_3", "caps_3", "a_3", "s_3", "d_3", "f_3", "g_3", "h_3", "j_3", "k_3", "l_3", "sem_3", "quo_3", "enter_3", "num4_3", "num5_3", "num6_3", "lshift_3", "z_3", "x_3", "c_3", "v_3", "b_3", "n_3", "m_3", "comma_3", "dot_3", "qmark_3", "rshift_3", "up_3", "num1_3", "num2_3", "num3_3", "numenter_3", "lctrl_3", "win_3", "lalt_3", "space_3", "ralt_3", "fn_3", "book_3", "rctrl_3", "left_3", "down_3", "right_3", "num0_3", "numdot_3", , "Upside1_3", "Upside2_3", "Upside3_3", "Upside4_3", "Upside5_3", "Upside6_3", "Upside7_3", "Upside8_3", "Upside9_3", "Upside10_3", "Upside11_3", "Upside12_3", "Upside13_3", "Upside14_3", "Upside15_3", "Upside16_3", "Upside17_3", "Upside18_3", "Upside19_3", "Upside20_3", "logo1_3", "logo2_3"]

    arrayAtt: any = ["esc_att", "f1_att", "f2_att", "f3_att", "f4_att", "f5_att", "f6_att", "f7_att", "f8_att", "f9_att", "f10_att", "f11_att", "f12_att", "print_att", "scroll_att", "pause_att", "perid_att", "n1_att", "n2_att", "n3_att", "n4_att", "n5_att", "n6_att", "n7_att", "n8_att", "n9_att", "n0_att", "minus_att", "plus_att", "bsp_att", "insert_att", "home_att", "pup_att", "numlock_att", "numdrawn_att", "numtimes_att", "numminus_att", "tab_att", "q_att", "w_att", "e_att", "r_att", "t_att", "y_att", "u_att", "i_att", "o_att", "p_att", "lqu_att", "rqu_att", "delete_att", "drawn_att", "end_att", "pdown_att", "num7_att", "num8_att", "num9_att", "numplus_att", "caps_att", "a_att", "s_att", "d_att", "f_att", "g_att", "h_att", "j_att", "k_att", "l_att", "sem_att", "quo_att", "enter_att", "num4_att", "num5_att", "num6_att", "lshift_att", "z_att", "x_att", "c_att", "v_att", "b_att", "n_att", "m_att", "comma_att", "dot_att", "qmark_att", "rshift_att", "up_att", "num1_att", "num2_att", "num3_att", "numenter_att", "lctrl_att", "win_att", "lalt_att", "space_att", "ralt_att", "fn_att", "book_att", "rctrl_att", "left_att", "down_att", "right_att", "num0_att", "numdot_att", "Upside1_att", "Upside2_att", "Upside3_att", "Upside4_att", "Upside5_att", "Upside6_att", "Upside7_att", "Upside8_att", "Upside9_att", "Upside10_att", "Upside11_att", "Upside12_att", "Upside13_att", "Upside14_att", "Upside15_att", "Upside16_att", "Upside17_att", "Upside18_att", "Upside19_att", "Upside20_att", "logo1_att", "logo2_att"]

    red: any = new Buffer(new Array(126));
    green: any = new Buffer(new Array(126));
    blue: any = new Buffer(new Array(126));

    red01: any = new Buffer(new Array(126));
    green01: any = new Buffer(new Array(126));
    blue01: any = new Buffer(new Array(126));

    red02: any = new Buffer(new Array(126));
    green02: any = new Buffer(new Array(126));
    blue02: any = new Buffer(new Array(126));

    red03: any = new Buffer(new Array(126));
    green03: any = new Buffer(new Array(126));
    blue03: any = new Buffer(new Array(126));


    getclr01: any;
    getclr02: any;
    getclr03: any;
    getclr04: any;

    getColor: any;
    getPt: any;
    data: any = 1;

    getColor1() {	//RGB取值 上到下
        let vm = this;
        clearInterval(this.getclr01);
        if (this.data == 0) {
            for (let i = 0; i < 22; i++) {
                this.array1[i + 104] = this.upAtt[i]
            }
            this.getclr01 = setInterval(() => {
                for (var i = 0; i < this.array1.length; i++) {
                    let clrIn = window.getComputedStyle(document.getElementById(this.array1[i]), null).getPropertyValue("background-color");
                    vm.red01[i] = (parseInt(vm.convertColor(clrIn)[0]));
                    vm.green01[i] = (parseInt(vm.convertColor(clrIn)[1]));
                    vm.blue01[i] = (parseInt(vm.convertColor(clrIn)[2]));
                }
            }, 1000 / 60);
        } else {
            this.upAtt = ["Upside1", "Upside2", "Upside3", "Upside4", "Upside5", "Upside6", "Upside7", "Upside8", "Upside9", "Upside10", "Upside11", "Upside12", "Upside13", "Upside14", "Upside15", "Upside16", "Upside17", "Upside18", "Upside19", "Upside20", "logo1", "logo2"]
            for (let i = 0; i < 22; i++) {
                this.array1[i + 104] = this.upAtt[i]
            }
            this.getclr01 = setInterval(() => {
                for (var i = 0; i < this.array1.length; i++) {
                    let clrIn = window.getComputedStyle(document.getElementById(this.array1[i]), null).getPropertyValue("background-color");
                    vm.red01[i] = (parseInt(vm.convertColor(clrIn)[0]));
                    vm.green01[i] = (parseInt(vm.convertColor(clrIn)[1]));
                    vm.blue01[i] = (parseInt(vm.convertColor(clrIn)[2]));
                }
            }, 1000 / 60);
        }
    }

    getColor2() {     //RGB取值 下到上
        let vm = this;
        clearInterval(this.getclr02);
        if (this.data == 0) {
            for (let i = 0; i < 22; i++) {
                this.array2[i + 104] = this.upAtt[i]
            }
            this.getclr02 = setInterval(() => {
                for (var i = 0; i < this.array1.length; i++) {
                    let clrIn = window.getComputedStyle(document.getElementById(this.array2[i]), null).getPropertyValue("background-color");
                    vm.red02[i] = (parseInt(vm.convertColor(clrIn)[0]));
                    vm.green02[i] = (parseInt(vm.convertColor(clrIn)[1]));
                    vm.blue02[i] = (parseInt(vm.convertColor(clrIn)[2]));
                }
            }, 1000 / 60);
        } else {
            this.upAtt = ["Upside1_2", "Upside2_2", "Upside3_2", "Upside4_2", "Upside5_2", "Upside6_2", "Upside7_2", "Upside8_2", "Upside9_2", "Upside10_2", "Upside11_2", "Upside12_2", "Upside13_2", "Upside14_2", "Upside15_2", "Upside16_2", "Upside17_2", "Upside18_2", "Upside19_2", "Upside20_2", "logo1_2", "logo2_2"]
            for (let i = 0; i < 22; i++) {
                this.array2[i + 104] = this.upAtt[i]
            }
            this.getclr02 = setInterval(() => {
                for (var i = 0; i < this.array1.length; i++) {
                    let clrIn = window.getComputedStyle(document.getElementById(this.array2[i]), null).getPropertyValue("background-color");
                    vm.red02[i] = (parseInt(vm.convertColor(clrIn)[0]));
                    vm.green02[i] = (parseInt(vm.convertColor(clrIn)[1]));
                    vm.blue02[i] = (parseInt(vm.convertColor(clrIn)[2]));
                }
            }, 1000 / 60);
        }
    }


    getColor3() {     //RGB取值 左到右
        let vm = this;
        clearInterval(this.getclr03);
        if (this.data == 0) {
            for (let i = 0; i < 22; i++) {
                this.array3[i + 104] = this.upAtt[i]
            }
            this.getclr03 = setInterval(() => {
                for (var i = 0; i < vm.array1.length; i++) {
                    let clrIn = window.getComputedStyle(document.getElementById(vm.array3[i]), null).getPropertyValue("background-color");
                    vm.red03[i] = (parseInt(vm.convertColor(clrIn)[0]));
                    vm.green03[i] = (parseInt(vm.convertColor(clrIn)[1]));
                    vm.blue03[i] = (parseInt(vm.convertColor(clrIn)[2]));
                }
            }, 1000 / 60);
        } else {
            this.upAtt = ["Upside1_3", "Upside2_3", "Upside3_3", "Upside4_3", "Upside5_3", "Upside6_3", "Upside7_3", "Upside8_3", "Upside9_3", "Upside10_3", "Upside11_3", "Upside12_3", "Upside13_3", "Upside14_3", "Upside15_3", "Upside16_3", "Upside17_3", "Upside18_3", "Upside19_3", "Upside20_3", "logo1_3", "logo2_3"]
            for (let i = 0; i < 22; i++) {
                this.array3[i + 104] = this.upAtt[i]
            }
            this.getclr03 = setInterval(() => {
                for (var i = 0; i < vm.array1.length; i++) {
                    let clrIn = window.getComputedStyle(document.getElementById(vm.array3[i]), null).getPropertyValue("background-color");
                    vm.red03[i] = (parseInt(vm.convertColor(clrIn)[0]));
                    vm.green03[i] = (parseInt(vm.convertColor(clrIn)[1]));
                    vm.blue03[i] = (parseInt(vm.convertColor(clrIn)[2]));
                }
            }, 1000 / 60);
        }
    }


    //取值區


    bri: any;
    seeresult() {
        //console.log('red');
        //console.log(this.red);
        //console.log('green');
        //console.log(this.green);
        //console.log('blue');
        //console.log(this.blue);
        //console.log(this.positionRarr);
        //console.log(this.positionGarr);
        //console.log(this.positionBarr);
    }
    convertColor(color) {
        var rgbColors = new Object();
        ///////////////////////////////////
        // Handle rgb(redValue, greenValue, blueValue) format
        //////////////////////////////////
        if (color[0] == 'r') {
            // Find the index of the redValue.  Using subscring function to 
            // get rid off "rgb(" and ")" part.  
            // The indexOf function returns the index of the "(" and ")" which we 
            // then use to get inner content.  
            color = color.substring(color.indexOf('(') + 1, color.indexOf(')'));
            // Notice here that we don't know how many digits are in each value,
            // but we know that every value is separated by a comma.
            // So split the three values using comma as the separator.
            // The split function returns an object.
            rgbColors = color.split(',', 4);
            this.bri = (parseFloat(rgbColors[3])).toFixed(3);
            if (isNaN(this.bri)) {
                this.bri = 1;
            }
            // Convert redValue to integer
            // rgbColors[0] = parseInt(rgbColors[0]) * this.bri * this.op;//當下R值 * A透明度值 * 鍵盤透明度
            // rgbColors[0] = parseInt(rgbColors[0]);
            // Convert greenValue to integer
            // rgbColors[1] = parseInt(rgbColors[1]) * this.bri * this.op;//當下G值 * A透明度值 * 鍵盤透明度
            // rgbColors[1] = parseInt(rgbColors[1]);
            // Convert blueValue to integer
            // rgbColors[2] = parseInt(rgbColors[2]) * this.bri * this.op;//當下B值 * A透明度值 * 鍵盤透明度
            // rgbColors[2] = parseInt(rgbColors[2]);
            // Convert AphaValue to integer
            var x = this.bri * 1000 / 3.9  //x 對應硬體亮度為255階 超過255已255計算
            if (x > 255) {
                x = 255;
            }
            rgbColors[0] = Math.round((parseInt(rgbColors[0]) * x) / 255) * this.op;//當下R值 * x透明度值 * 鍵盤透明度
            rgbColors[1] = Math.round((parseInt(rgbColors[1]) * x) / 255) * this.op;//當下G值 * x透明度值 * 鍵盤透明度
            rgbColors[2] = Math.round((parseInt(rgbColors[2]) * x) / 255) * this.op;//當下B值 * x透明度值 * 鍵盤透明度
            // //console.log(rgbColors) 
        }
        ////////////////////////////////
        // Handle the #RRGGBB' format
        ////////////////////////////////
        else if (color.substring(0, 1) == "#") {
            // This is simples because we know that every values is two 
            // hexadecimal digits.
            rgbColors[0] = color.substring(1, 3);  // redValue
            rgbColors[1] = color.substring(3, 5);  // greenValue
            rgbColors[2] = color.substring(5, 7);  // blueValue
            rgbColors[3] = color.substring(7, 9);
            // We need to convert the value into integers, 
            //   but the value is in hex (base 16)!
            // Fortunately, the parseInt function takes a second parameter 
            // signifying the base we're converting from.  
            // rgbColors[0] = parseInt(rgbColors[0], 16);
            // rgbColors[1] = parseInt(rgbColors[1], 16);
            // rgbColors[2] = parseInt(rgbColors[2], 16);
        }
        return rgbColors;
    }
    //
    cleanApmode() {
        //console.log("cleanapmode");
        var apMode = new Buffer(new Array(480));
        var vm = this
        for (let i = 0; i < 480; i++) {
            apMode[i] = 0;
            // //console.log("cleanapmode");
        }
        // apMode[45] = 0xff;
        // apMode[205] = 0xff;
        // apMode[365] = 0xff;
        // apMode[100] = 0xff;
        // apMode[260] = 0xff;
        // apMode[420] = 0xff;
        let apmodesetting = {
            profile: this.changeProfile,    //profile  0:reset, 1:Profile1 2:Profile2
            RGBData: apMode
        }
        let obj3 = {
            Type: funcVar.FuncType.Device,
            Func: funcVar.FuncName.APMode,
            Param: apmodesetting
        }
        this.protocol.RunSetFunction(obj3).then((data) => {
            // //console.log("Container RunSetFunction:" + data);
            // //console.log('data:' + data);
            //  if(data==1){
        })
        // //console.log('next apmode');
    }

    setAPmode() {
        if (this.setAp == 0) {
            this.setAp = 1;
            // //console.log('setapmode');
            let data = {
                profile: this.changeProfile,
            }
            let obj1 = {
                Type: funcVar.FuncType.Device,
                Func: funcVar.FuncName.SetProfie,
                Param: data
            }
            this.protocol.RunSetFunction(obj1).then((data) => {
                // //console.log("Container RunSetFunction:" + data);
                // //
                // let setprofile = {
                //     profile: '1',    //profile  0:reset, 1:Profile1 2:Profile2
                //     mode: '0x0e', //1~15 代表不同Mode
                //     light: '0x14',    //0~32 燈光亮度
                // }
                // let obj2 = {
                //     Type: funcVar.FuncType.Device,
                //     Func: funcVar.FuncName.SetCommand,
                //     Param: setprofile
                // }
                // //console.log("setprofile:SetCommand");
                // this.protocol.RunSetFunction(obj2).then((data) => {
                //     //console.log("Container RunSetFunction:" + data);
                this.setAp = 0;
                // });
            })
        }
    }

    LEDmatrix() {
        // //console.log('LED1111');
        var s = [];//找Marixtable
        s[0] = ['f5', 'n6', 'y', 'h', 'n', 'f6', 'n7', 'k132', 'Upside6', ''];
        s[1] = ['f3', 'n4', 'r', 'g', 'b', 'f4', 'n5', 't', 'Upside5', ''];
        s[2] = ['f2', 'n3', 'e', 'd', 'v', 'space', 'c', 'f', 'Upside4', ''];
        s[3] = ['f1', 'n2', 'w', 's', 'z', 'lalt', 'x', 'K131', 'Upside3', ''];
        s[4] = ['L-Up', 'n1', 'q', 'a', 'K45', 'win', 'logo1', 'L-Down', 'Upside2', ''];
        s[5] = ['esc', 'perid', 'tab', 'caps', 'lshift', 'lctrl', 'logo2', '', 'Upside1', ''];
        s[6] = ['f12', 'K14', 'drawn', 'K42', 'enter', 'print', 'bsp', 'insert', '', 'Upside15'];
        s[7] = ['f10', 'plus', 'lqu', 'quo', 'rctrl', 'f11', 'rqu', 'rshift', 'Upside10', 'Upside12'];
        s[8] = ['minus', 'p', 'sem', 'K56', 'qmark', 'f9', 'book', 'fn', 'Upside9', 'Upside11'];
        s[9] = ['n0', 'i', 'k', 'l', 'comma', 'dot', 'o', 'ralt', 'Upside7', 'Upside14'];
        s[10] = ['f7', 'n8', 'u', 'j', 'm', 'f8', 'n9', 'K133', 'Upside8', 'Upside13'];
        s[11] = ['scroll', 'pdown', 'delete', 'numlock', 'end', 'pause', 'home', 'pup', '', 'Upside17'];
        s[12] = ['', 'num2', 'numdrawn', '', 'num5', 'D123', 'D121', 'num8', '', 'Upside18'];
        s[13] = ['', 'R-Up', 'numminus', 'R-Down', 'numenter', 'D122', '', 'numplus', '', 'Upside20'];
        s[14] = ['', 'num3', 'numtimes', '', 'num6', '', 'numdot', 'num9', '', 'Upside19'];
        s[15] = ['up', 'num1', 'down', 'right', 'num4', 'left', 'num0', 'num7', '', 'Upside16'];

        // //console.log('字尾'+this.suffix);
        // //console.log('array'+this.arrayoption);
        //_3
        // for (let w = 0; w < 16; w++) {

        //     for (let n = 0; n < s[w].length; n++) {
        //         s[w][n] = s[w][n] + this.suffix;
        //     }
        // }
        // //console.log(s);

        for (var t = 0; t < this.array1.length; t++) {
            // //console.log('here!');
            let word = this.array1[t];
            for (let i = 0; i < 16; i++) {
                if (s[i].indexOf(word) !== -1) {
                    let x = i;
                    let y = s[i].indexOf(word);
                    this.positionR = x * 10 + y;
                    this.positionG = x * 10 + y + 160;
                    this.positionB = x * 10 + y + 320;
                    // //console.log('x:' + x + 'y:' + y)
                    this.positionRarr.push(this.positionR);
                    this.positionGarr.push(this.positionG);
                    this.positionBarr.push(this.positionB);

                    // //console.log('total_pr' + this.positionR)
                    // //console.log('total_pr' + this.positionG)
                    // //console.log('total_pr' + this.positionB)

                }
            }
        }
    }

    doApmode01() {
        // //console.log('R'+this.positionR);
        // //console.log('G'+this.positionG);
        // //console.log('B'+this.positionB);

        // //console.log('apmode');
        if (this.saveapmode === false) { //設定一個布林值決定是否要執行下面的程式碼
            this.saveapmode = true;//一進入程式後就把判斷通道關閉，代表同一個時間，不會有兩個doapmode執行
            var apMode = new Buffer(new Array(480));
            for (let i = 0; i < this.array1.length; i++) {
                this.red[i] = (this.red01[i] + this.red02[i] + this.red03[i]) / 3;
                this.green[i] = (this.green01[i] + this.green02[i] + this.green03[i]) / 3;
                this.blue[i] = (this.blue01[i] + this.blue02[i] + this.blue03[i]) / 3;
                apMode[this.positionRarr[i]] = this.red[i];
                apMode[this.positionGarr[i]] = this.green[i];
                apMode[this.positionBarr[i]] = this.blue[i];
            }
            // apMode[45] = 0xff;
            // apMode[205] = 0xff;
            // apMode[365] = 0xff;
            // apMode[100] = 0xff;
            // apMode[260] = 0xff;
            // apMode[420] = 0xff;

            let apmodesetting = {
                profile: this.changeProfile,    //profile  0:reset, 1:Profile1 2:Profile2
                RGBData: apMode
            }
            let obj3 = {
                Type: funcVar.FuncType.Device,
                Func: funcVar.FuncName.APMode,
                Param: apmodesetting
            }
            // //console.log('next apmode');
            this.saveapmode = false;
            if (this.leave == 1) {
                // //console.log('next apmode');
                this.protocol.RunSetFunction(obj3).then((data) => {
                    // //console.log("Container RunSetFunction:" + data);
                    // //console.log('data:' + data);
                    //  if(data==1){
                    // this.saveapmode=false;
                    this.doApmode01();

                    //
                })
            }

        } else {
            console.log('有重複的apmode');//當判斷到有第二個doapmode要執行的要求，直接關閉此要求，結果就是剩下一個doapmode執行
            this.leave == 0;
        }
    }

    thelastEffect: any = this.meeting_med;

    letsgoout: boolean = true;
    letsgoIn: boolean = false;
    plugIn() {
        clearInterval(this.getclr01);
        clearInterval(this.getclr02);
        clearInterval(this.getclr03);
        this.leave = 0;
        // this.letsgoout = false;
        // this.letsgoIn = true;

        this.goIn();
    }

    none() {
        clearInterval(this.getclr01);
        clearInterval(this.getclr02);
        clearInterval(this.getclr03);
        // clearInterval(this.getclr04);
        this.leave = 0;
        // this.letsgoout = false;
        // this.letsgoIn = true;

        this.cleanApmode();


        this.savechange = 0;

    }

    goOut() {
        clearInterval(this.getclr01);
        clearInterval(this.getclr02);
        clearInterval(this.getclr03);
        clearInterval(this.stopAtt);
        this.leave = 0;
        this.letsgoout = false;
        this.letsgoIn = true;
        this.savechange = 0;
    }

    goIn() {
        // //this.setAPmode();//連續下值預備動作
        // this.LEDmatrix()//找出對應按鍵;
        // this.setDefault(1);
        // if (this.getDeviceService.dataObj.status == 1) {
        this.thelastEffect();
        this.leave = 1;
        this.doApmode01();  //每200毫秒放入硬體
        this.letsgoout = true;
        this.letsgoIn = false;
        this.savechange = 0;
        // this.detectButton();        
    }


    //Att set area
    Upside1_att: any = "";
    Upside2_att: any = "";
    Upside3_att: any = "";
    Upside4_att: any = "";
    Upside5_att: any = "";
    Upside6_att: any = "";
    Upside7_att: any = "";
    Upside8_att: any = "";
    Upside9_att: any = "";
    Upside10_att: any = "";
    Upside11_att: any = "";
    Upside12_att: any = "";
    Upside13_att: any = "";
    Upside14_att: any = "";
    Upside15_att: any = "";
    Upside16_att: any = "";
    Upside17_att: any = "";
    Upside18_att: any = "";
    Upside19_att: any = "";
    Upside20_att: any = "";
    logo1_att: any = "";
    logo2_att: any = "";

    LtoR1_att: any = "";
    LtoR2_att: any = "";
    LtoR3_att: any = "";
    LtoR4_att: any = "";
    LtoR5_att: any = "";
    LtoR6_att: any = "";
    LtoR7_att: any = "";
    LtoR8_att: any = "";
    LtoR9_att: any = "";
    LtoR10_att: any = "";
    LtoR11_att: any = "";
    LtoR12_att: any = "";
    LtoR13_att: any = "";
    LtoR14_att: any = "";
    LtoR15_att: any = "";
    LtoR16_att: any = "";
    LtoR17_att: any = "";
    LtoR18_att: any = "";
    LtoR19_att: any = "";
    LtoR20_att: any = "";
    LtoR21_att: any = "";

    attLight() {
        this.LtoR1_att = "att11";
        this.LtoR2_att = "att10";
        this.LtoR3_att = "att9";
        this.LtoR4_att = "att8";
        this.LtoR5_att = "att7";
        this.LtoR6_att = "att6";
        this.LtoR7_att = "att5";
        this.LtoR8_att = "att4";
        this.LtoR9_att = "att3";
        this.LtoR10_att = "att2";
        this.LtoR11_att = "att1";
        this.LtoR12_att = "att2";
        this.LtoR13_att = "att3";
        this.LtoR14_att = "att4";
        this.LtoR15_att = "att5";
        this.LtoR16_att = "att6";
        this.LtoR17_att = "att7";
        this.LtoR18_att = "att8";
        this.LtoR19_att = "att9";
        this.LtoR20_att = "att10";
        this.LtoR21_att = "att11";
        setTimeout(() => {
            this.array1 = ["esc", "f1", "f2", "f3", "f4", "f5", "f6", "f7", "f8", "f9", "f10", "f11", "f12", "print", "scroll", "pause", "perid", "n1", "n2", "n3", "n4", "n5", "n6", "n7", "n8", "n9", "n0", "minus", "plus", "bsp", "insert", "home", "pup", "numlock", "numdrawn", "numtimes", "numminus", "tab", "q", "w", "e", "r", "t", "y", "u", "i", "o", "p", "lqu", "rqu", "delete", "drawn", "end", "pdown", "num7", "num8", "num9", "numplus", "caps", "a", "s", "d", "f", "g", "h", "j", "k", "l", "sem", "quo", "enter", "num4", "num5", "num6", "lshift", "z", "x", "c", "v", "b", "n", "m", "comma", "dot", "qmark", "rshift", "up", "num1", "num2", "num3", "numenter", "lctrl", "win", "lalt", "space", "ralt", "fn", "book", "rctrl", "left", "down", "right", "num0", "numdot", "Upside1_att", "Upside2_att", "Upside3_att", "Upside4_att", "Upside5_att", "Upside6_att", "Upside7_att", "Upside8_att", "Upside9_att", "Upside10_att", "Upside11_att", "Upside12_att", "Upside13_att", "Upside14_att", "Upside15_att", "Upside16_att", "Upside17_att", "Upside18_att", "Upside19_att", "Upside20_att", "logo1_att", "logo2_att"]

            this.array2 = ["esc_2", "f1_2", "f2_2", "f3_2", "f4_2", "f5_2", "f6_2", "f7_2", "f8_2", "f9_2", "f10_2", "f11_2", "f12_2", "print_2", "scroll_2", "pause_2", "perid_2", "n1_2", "n2_2", "n3_2", "n4_2", "n5_2", "n6_2", "n7_2", "n8_2", "n9_2", "n0_2", "minus_2", "plus_2", "bsp_2", "insert_2", "home_2", "pup_2", "numlock_2", "numdrawn_2", "numtimes_2", "numminus_2", "tab_2", "q_2", "w_2", "e_2", "r_2", "t_2", "y_2", "u_2", "i_2", "o_2", "p_2", "lqu_2", "rqu_2", "delete_2", "drawn_2", "end_2", "pdown_2", "num7_2", "num8_2", "num9_2", "numplus_2", "caps_2", "a_2", "s_2", "d_2", "f_2", "g_2", "h_2", "j_2", "k_2", "l_2", "sem_2", "quo_2", "enter_2", "num4_2", "num5_2", "num6_2", "lshift_2", "z_2", "x_2", "c_2", "v_2", "b_2", "n_2", "m_2", "comma_2", "dot_2", "qmark_2", "rshift_2", "up_2", "num1_2", "num2_2", "num3_2", "numenter_2", "lctrl_2", "win_2", "lalt_2", "space_2", "ralt_2", "fn_2", "book_2", "rctrl_2", "left_2", "down_2", "right_2", "num0_2", "numdot_2", "Upside1_att", "Upside2_att", "Upside3_att", "Upside4_att", "Upside5_att", "Upside6_att", "Upside7_att", "Upside8_att", "Upside9_att", "Upside10_att", "Upside11_att", "Upside12_att", "Upside13_att", "Upside14_att", "Upside15_att", "Upside16_att", "Upside17_att", "Upside18_att", "Upside19_att", "Upside20_att", "logo1_att", "logo2_att"]

            this.array3 = ["esc_3", "f1_3", "f2_3", "f3_3", "f4_3", "f5_3", "f6_3", "f7_3", "f8_3", "f9_3", "f10_3", "f11_3", "f12_3", "print_3", "scroll_3", "pause_3", "perid_3", "n1_3", "n2_3", "n3_3", "n4_3", "n5_3", "n6_3", "n7_3", "n8_3", "n9_3", "n0_3", "minus_3", "plus_3", "bsp_3", "insert_3", "home_3", "pup_3", "numlock_3", "numdrawn_3", "numtimes_3", "numminus_3", "tab_3", "q_3", "w_3", "e_3", "r_3", "t_3", "y_3", "u_3", "i_3", "o_3", "p_3", "lqu_3", "rqu_3", "delete_3", "drawn_3", "end_3", "pdown_3", "num7_3", "num8_3", "num9_3", "numplus_3", "caps_3", "a_3", "s_3", "d_3", "f_3", "g_3", "h_3", "j_3", "k_3", "l_3", "sem_3", "quo_3", "enter_3", "num4_3", "num5_3", "num6_3", "lshift_3", "z_3", "x_3", "c_3", "v_3", "b_3", "n_3", "m_3", "comma_3", "dot_3", "qmark_3", "rshift_3", "up_3", "num1_3", "num2_3", "num3_3", "numenter_3", "lctrl_3", "win_3", "lalt_3", "space_3", "ralt_3", "fn_3", "book_3", "rctrl_3", "left_3", "down_3", "right_3", "num0_3", "numdot_3", "Upside1_att", "Upside2_att", "Upside3_att", "Upside4_att", "Upside5_att", "Upside6_att", "Upside7_att", "Upside8_att", "Upside9_att", "Upside10_att", "Upside11_att", "Upside12_att", "Upside13_att", "Upside14_att", "Upside15_att", "Upside16_att", "Upside17_att", "Upside18_att", "Upside19_att", "Upside20_att", "logo1_att", "logo2_att"]
        }, 2000);
    }

    cleanAttLight() {
        // //console.log("cleanAtt complete 2222")
        this.LtoR1_att = "";
        this.LtoR2_att = "";
        this.LtoR3_att = "";
        this.LtoR4_att = "";
        this.LtoR5_att = "";
        this.LtoR6_att = "";
        this.LtoR7_att = "";
        this.LtoR8_att = "";
        this.LtoR9_att = "";
        this.LtoR10_att = "";
        this.LtoR11_att = "";
        this.LtoR12_att = "";
        this.LtoR13_att = "";
        this.LtoR14_att = "";
        this.LtoR15_att = "";
        this.LtoR16_att = "";
        this.LtoR17_att = "";
        this.LtoR18_att = "";
        this.LtoR19_att = "";
        this.LtoR20_att = "";
        this.LtoR21_att = "";
    }

    defaultBar() {
        this.Upside1_att = "";
        this.Upside2_att = "";
        this.Upside3_att = "";
        this.Upside4_att = "";
        this.Upside5_att = "";
        this.Upside6_att = "";
        this.Upside7_att = "";
        this.Upside8_att = "";
        this.Upside9_att = "";
        this.Upside11_att = "";
        this.Upside10_att = "";
        this.Upside12_att = "";
        this.Upside13_att = "";
        this.Upside14_att = "";
        this.Upside15_att = "";
        this.Upside16_att = "";
        this.Upside17_att = "";
        this.Upside18_att = "";
        this.Upside19_att = "";
        this.Upside20_att = "";
    }
    stopAtt: any;
    attBar(w) {
        if (w == 0) {
            this.getColor1();
            this.getColor2();
            this.getColor3();
            this.logo1_att = "red";
            this.logo2_att = "red";
            this.stopAtt = setInterval(() => {
                if (this.attPt < 1 || this.attPt >= 99 || this.attPt == undefined || isNaN(this.attPt)) {
                    this.cleanBar();
                }
                else if (this.attPt >= 98) {
                    this.Upside10_att = "bar1";
                    this.Upside11_att = "bar1";
                    this.Upside9_att = "bar2";
                    this.Upside12_att = "bar2";
                    this.Upside8_att = "bar3";
                    this.Upside13_att = "bar3";
                    this.Upside7_att = "bar4";
                    this.Upside14_att = "bar4";
                    this.Upside6_att = "bar5";
                    this.Upside15_att = "bar5";
                    this.Upside5_att = "bar6";
                    this.Upside16_att = "bar6";
                    this.Upside4_att = "bar7";
                    this.Upside17_att = "bar7";
                    this.Upside3_att = "bar8";
                    this.Upside18_att = "bar8";
                    this.Upside2_att = "bar9";
                    this.Upside19_att = "bar9";
                    this.Upside1_att = "bar10";
                    this.Upside20_att = "bar10";
                }
                else if (this.attPt >= 79) {
                    this.Upside10_att = "bar1";
                    this.Upside11_att = "bar1";
                    this.Upside9_att = "bar2";
                    this.Upside12_att = "bar2";
                    this.Upside8_att = "bar3";
                    this.Upside13_att = "bar3";
                    this.Upside7_att = "bar4";
                    this.Upside14_att = "bar4";
                    this.Upside6_att = "bar5";
                    this.Upside15_att = "bar5";
                    this.Upside5_att = "bar6";
                    this.Upside16_att = "bar6";
                    this.Upside4_att = "bar7";
                    this.Upside17_att = "bar7";
                    this.Upside3_att = "bar8";
                    this.Upside18_att = "bar8";
                    this.Upside2_att = "bar9";
                    this.Upside19_att = "bar9";
                }
                else if (this.attPt >= 60) {
                    this.Upside10_att = "bar1";
                    this.Upside11_att = "bar1";
                    this.Upside9_att = "bar2";
                    this.Upside12_att = "bar2";
                    this.Upside8_att = "bar3";
                    this.Upside13_att = "bar3";
                    this.Upside7_att = "bar4";
                    this.Upside14_att = "bar4";
                    this.Upside6_att = "bar5";
                    this.Upside15_att = "bar5";
                    this.Upside5_att = "bar6";
                    this.Upside16_att = "bar6";
                    this.Upside4_att = "bar7";
                    this.Upside17_att = "bar7";
                    this.Upside3_att = "bar8";
                    this.Upside18_att = "bar8";
                    this.cleanAttLight();
                }
                else if (this.attPt >= 45) {
                    this.Upside10_att = "bar1";
                    this.Upside11_att = "bar1";
                    this.Upside9_att = "bar2";
                    this.Upside12_att = "bar2";
                    this.Upside8_att = "bar3";
                    this.Upside13_att = "bar3";
                    this.Upside7_att = "bar4";
                    this.Upside14_att = "bar4";
                    this.Upside6_att = "bar5";
                    this.Upside15_att = "bar5";
                    this.Upside5_att = "bar6";
                    this.Upside16_att = "bar6";
                    this.Upside4_att = "bar7";
                    this.Upside17_att = "bar7";
                }
                else if (this.attPt >= 30) {
                    this.Upside10_att = "bar1";
                    this.Upside11_att = "bar1";
                    this.Upside9_att = "bar2";
                    this.Upside12_att = "bar2";
                    this.Upside8_att = "bar3";
                    this.Upside13_att = "bar3";
                    this.Upside7_att = "bar4";
                    this.Upside14_att = "bar4";
                    this.Upside6_att = "bar5";
                    this.Upside15_att = "bar5";
                    this.Upside5_att = "bar6";
                    this.Upside16_att = "bar6";
                }
                else if (this.attPt >= 20) {
                    this.Upside10_att = "bar1";
                    this.Upside11_att = "bar1";
                    this.Upside9_att = "bar2";
                    this.Upside12_att = "bar2";
                    this.Upside8_att = "bar3";
                    this.Upside13_att = "bar3";
                    this.Upside7_att = "bar4";
                    this.Upside14_att = "bar4";
                    this.Upside6_att = "bar5";
                    this.Upside15_att = "bar5";
                }
                else if (this.attPt >= 13) {
                    this.Upside10_att = "bar1";
                    this.Upside11_att = "bar1";
                    this.Upside9_att = "bar2";
                    this.Upside12_att = "bar2";
                    this.Upside8_att = "bar3";
                    this.Upside13_att = "bar3";
                    this.Upside7_att = "bar4";
                    this.Upside14_att = "bar4";
                }
                else if (this.attPt >= 7) {
                    this.Upside10_att = "bar1";
                    this.Upside11_att = "bar1";
                    this.Upside9_att = "bar2";
                    this.Upside12_att = "bar2";
                    this.Upside8_att = "bar3";
                    this.Upside13_att = "bar3";
                }
                else if (this.attPt >= 3) {
                    this.Upside10_att = "bar1";
                    this.Upside11_att = "bar1";
                    this.Upside9_att = "bar2";
                    this.Upside12_att = "bar2";
                }
                else if (this.attPt >= 1) {
                    this.Upside10_att = "bar1";
                    this.Upside11_att = "bar1";
                }
            }, 1)
        }
        else if (w == 1) {
            clearInterval(this.stopAtt);
            this.defaultBar();
        }
    }
    cleanBar() {
        setTimeout(() => {
            this.Upside1_att = "";
            this.Upside20_att = "";
        }, 20);
        setTimeout(() => {
            this.Upside2_att = "";
            this.Upside19_att = "";
        }, 40);
        setTimeout(() => {
            this.Upside3_att = "";
            this.Upside18_att = "";
        }, 60);
        setTimeout(() => {
            this.Upside4_att = "";
            this.Upside17_att = "";
        }, 80);
        setTimeout(() => {
            this.Upside5_att = "";
            this.Upside16_att = "";
        }, 100);
        setTimeout(() => {
            this.Upside6_att = "";
            this.Upside15_att = "";
        }, 120);
        setTimeout(() => {
            this.Upside7_att = "";
            this.Upside14_att = "";
        }, 140);
        setTimeout(() => {
            this.Upside8_att = "";
            this.Upside13_att = "";
        }, 160);
        setTimeout(() => {
            this.Upside9_att = "";
            this.Upside12_att = "";
        }, 180);
        setTimeout(() => {
            this.Upside10_att = "";
            this.Upside11_att = "";
        }, 200);
    }

    //


    //

    esc: any = "";
    f1: any = "";
    f2: any = "";
    f3: any = "";
    f4: any = "";
    f5: any = "";
    f6: any = "";
    f7: any = "";
    f8: any = "";
    f9: any = "";
    f10: any = "";
    f11: any = "";
    f12: any = "";
    print: any = "";
    scroll: any = "";
    pause: any = "";
    perid: any = "";
    n1: any = "";
    n2: any = "";
    n3: any = "";
    n4: any = "";
    n5: any = "";
    n6: any = "";
    n7: any = "";
    n8: any = "";
    n9: any = "";
    n0: any = "";
    minus: any = "";
    plus: any = "";
    bsp: any = "";
    insert: any = "";
    home: any = "";
    pup: any = "";
    numlock: any = "";
    numdrawn: any = "";
    numtimes: any = "";
    numminus: any = "";
    tab: any = "";
    q: any = "";
    w: any = "";
    e: any = "";
    r: any = "";
    t: any = "";
    y: any = "";
    u: any = "";
    i: any = "";
    o: any = "";
    p: any = "";
    lqu: any = "";
    rqu: any = "";
    delete: any = "";
    drawn: any = "";
    end: any = "";
    pdown: any = "";
    num7: any = "";
    num8: any = "";
    num9: any = "";
    numplus: any = "";
    caps: any = "";
    a: any = "";
    s: any = "";
    d: any = "";
    f: any = "";
    g: any = "";
    h: any = "";
    j: any = "";
    k: any = "";
    l: any = "";
    sem: any = "";
    quo: any = "";
    enter: any = "";
    num4: any = "";
    num5: any = "";
    num6: any = "";
    lshift: any = "";
    z: any = "";
    x: any = "";
    c: any = "";
    v: any = "";
    b: any = "";
    n: any = "";
    m: any = "";
    comma: any = "";
    dot: any = "";
    qmark: any = "";
    rshift: any = "";
    up: any = "";
    num1: any = "";
    num2: any = "";
    num3: any = "";
    numenter: any = "";
    lctrl: any = "";
    win: any = "";
    lalt: any = "";
    space: any = "";
    ralt: any = "";
    fn: any = "";
    book: any = "";
    rctrl: any = "";
    left: any = "";
    down: any = "";
    right: any = "";
    num0: any = "";
    numdot: any = "";
    meeting1: any = "";
    meeting2: any = "";
    meeting3: any = "";
    meeting4: any = "";
    meeting5: any = "";
    meeting6: any = "";
    meeting7: any = "";
    meeting8: any = "";
    meeting9: any = "";
    meeting10: any = "";
    RtoL1: any = "";
    RtoL2: any = "";
    RtoL3: any = "";
    RtoL4: any = "";
    RtoL5: any = "";
    RtoL6: any = "";
    RtoL7: any = "";
    RtoL8: any = "";
    RtoL9: any = "";
    RtoL10: any = "";
    comma_2: any = "";
    k_2: any = "";
    i_2: any = "";
    n0_2: any = "";
    minus_2: any = "";
    lqu_2: any = "";
    quo_2: any = "";
    dot_2: any = "";
    comma_3: any = "";

    meetingStop() {
        this.meeting1 = "";
        this.meeting2 = "";
        this.meeting3 = "";
        this.meeting4 = "";
        this.meeting5 = "";
        this.meeting6 = "";
        this.meeting7 = "";
        this.meeting8 = "";
        this.meeting9 = "";
        this.meeting1 = "";
        this.n0 = "";
        this.minus = "";
        this.lqu = "";
        this.quo = "";
        this.qmark = "";
        this.dot = "";
        this.comma = "";
        this.k = "";
        this.i = "";
        this.o = "";
        this.p = "";
        this.sem = "";
        this.comma_2 = "";
        this.k_2 = "";
        this.i_2 = "";
        this.n8 = "";
        this.n9 = "";
        this.n0_2 = "";
        this.minus_2 = "";
        this.lqu_2 = "";
        this.quo_2 = "";
        this.qmark = "";
        this.dot_2 = "";
        this.comma_3 = "";
        this.l = "";
        this.RtoL5 = "";
        this.RtoL6 = "";
        this.RtoL4 = "";
        this.RtoL7 = "";
        this.RtoL3 = "";
        this.RtoL8 = "";
        this.RtoL2 = "";
        this.RtoL9 = "";
        this.RtoL1 = "";
        this.RtoL10 = "";
    }

    meeting_med() {              //邂逅
        //console.log("meeting start 1111111")
        this.meetingStop();
        this.getColor1();
        this.getColor2();
        this.getColor3();
        this.thelastEffect = this.meeting_med;
        this.meeting1 = "meeting1_med";
        this.meeting2 = "meeting2_med";
        this.meeting3 = "meeting3_med";
        this.meeting4 = "meeting4_med";
        this.meeting5 = "meeting5_med";
        this.meeting6 = "meeting6_med";
        this.meeting7 = "meeting7_med";
        this.meeting8 = "meeting8_med";
        this.meeting9 = "meeting9_med";
        this.meeting10 = "meeting10_med";
        this.n0 = "meeting11_med";
        this.minus = "meeting12_med";
        this.lqu = "meeting13_med";
        this.quo = "meeting14_med";
        this.qmark = "meeting15_med";
        this.dot = "meeting16_med";
        this.comma = "meeting17_med";
        this.k = "meeting18_med";
        this.i = "meeting19_med";
        this.o = "meeting20_med";
        this.p = "meeting21_med";
        this.sem = "meeting22_med";
        this.comma_2 = "meeting11_med";
        this.k_2 = "meeting12_med";
        this.i_2 = "meeting13_med";
        this.n8 = "meeting14_med";
        this.n9 = "meeting15_med";
        this.n0_2 = "meeting16_med";
        this.minus_2 = "meeting17_med";
        this.lqu_2 = "meeting18_med";
        this.quo_2 = "meeting19_med";
        this.qmark = "meeting20_med";
        this.dot_2 = "meeting21_med";
        this.comma_3 = "meeting22_med";
        this.l = "meeting23_med";
        this.RtoL5 = "meeting_1_med";
        this.RtoL6 = "meeting_1_med";
        this.RtoL4 = "meeting_2_med";
        this.RtoL7 = "meeting_2_med";
        this.RtoL3 = "meeting_3_med";
        this.RtoL8 = "meeting_3_med";
        this.RtoL2 = "meeting_4_med";
        this.RtoL9 = "meeting_4_med";
        this.RtoL1 = "meeting_5_med";
        this.RtoL10 = "meeting_5_med";

    }

    meeting_slow() {              //邂逅
        this.meetingStop();
        this.getColor1();
        this.getColor2();
        this.getColor3();
        this.thelastEffect = this.meeting_slow;
        this.meeting1 = "meeting1_slow";
        this.meeting2 = "meeting2_slow";
        this.meeting3 = "meeting3_slow";
        this.meeting4 = "meeting4_slow";
        this.meeting5 = "meeting5_slow";
        this.meeting6 = "meeting6_slow";
        this.meeting7 = "meeting7_slow";
        this.meeting8 = "meeting8_slow";
        this.meeting9 = "meeting9_slow";
        this.meeting10 = "meeting10_slow";
        this.n0 = "meeting11_slow";
        this.minus = "meeting12_slow";
        this.lqu = "meeting13_slow";
        this.quo = "meeting14_slow";
        this.qmark = "meeting15_slow";
        this.dot = "meeting16_slow";
        this.comma = "meeting17_slow";
        this.k = "meeting18_slow";
        this.i = "meeting19_slow";
        this.o = "meeting20_slow";
        this.p = "meeting21_slow";
        this.sem = "meeting22_slow";
        this.comma_2 = "meeting11_slow";
        this.k_2 = "meeting12_slow";
        this.i_2 = "meeting13_slow";
        this.n8 = "meeting14_slow";
        this.n9 = "meeting15_slow";
        this.n0_2 = "meeting16_slow";
        this.minus_2 = "meeting17_slow";
        this.lqu_2 = "meeting18_slow";
        this.quo_2 = "meeting19_slow";
        this.qmark = "meeting20_slow";
        this.dot_2 = "meeting21_slow";
        this.comma_3 = "meeting22_slow";
        this.l = "meeting23_slow";
        this.RtoL5 = "meeting_1_slow";
        this.RtoL6 = "meeting_1_slow";
        this.RtoL4 = "meeting_2_slow";
        this.RtoL7 = "meeting_2_slow";
        this.RtoL3 = "meeting_3_slow";
        this.RtoL8 = "meeting_3_slow";
        this.RtoL2 = "meeting_4_slow";
        this.RtoL9 = "meeting_4_slow";
        this.RtoL1 = "meeting_5_slow";
        this.RtoL10 = "meeting_5_slow";

    }
    meeting_high() {               //邂逅
        this.meetingStop();
        this.getColor1();
        this.getColor2();
        this.getColor3();
        this.thelastEffect = this.meeting_high;
        this.meeting1 = "meeting1_high";
        this.meeting2 = "meeting2_high";
        this.meeting3 = "meeting3_high";
        this.meeting4 = "meeting4_high";
        this.meeting5 = "meeting5_high";
        this.meeting6 = "meeting6_high";
        this.meeting7 = "meeting7_high";
        this.meeting8 = "meeting8_high";
        this.meeting9 = "meeting9_high";
        this.meeting10 = "meeting10_high";
        this.n0 = "meeting11_high";
        this.minus = "meeting12_high";
        this.lqu = "meeting13_high";
        this.quo = "meeting14_high";
        this.qmark = "meeting15_high";
        this.dot = "meeting16_high";
        this.comma = "meeting17_high";
        this.k = "meeting18_high";
        this.i = "meeting19_high";
        this.o = "meeting20_high";
        this.p = "meeting21_high";
        this.sem = "meeting22_high";
        this.comma_2 = "meeting11_high";
        this.k_2 = "meeting12_high";
        this.i_2 = "meeting13_high";
        this.n8 = "meeting14_high";
        this.n9 = "meeting15_high";
        this.n0_2 = "meeting16_high";
        this.minus_2 = "meeting17_high";
        this.lqu_2 = "meeting18_high";
        this.quo_2 = "meeting19_high";
        this.qmark = "meeting20_high";
        this.dot_2 = "meeting21_high";
        this.comma_3 = "meeting22_high";
        this.l = "meeting23_high";
        this.RtoL5 = "meeting_1_high";
        this.RtoL6 = "meeting_1_high";
        this.RtoL4 = "meeting_2_high";
        this.RtoL7 = "meeting_2_high";
        this.RtoL3 = "meeting_3_high";
        this.RtoL8 = "meeting_3_high";
        this.RtoL2 = "meeting_4_high";
        this.RtoL9 = "meeting_4_high";
        this.RtoL1 = "meeting_5_high";
        this.RtoL10 = "meeting_5_high";

    }


    //小方框設定
    default: boolean = true;
    default02: boolean = false;
    setDefault(w) {
        // 
        document.getElementById('colorgp').style.display = "none";
        this.default = false;
        this.default02 = false;
        if (w == 1) {
            this.default = true;
            this.modeswitch = "1";
            document.getElementById('colorgp').style.display = "none";
            this.getRuleRandom();
            this.detectEffectChange();
        }
        if (w == 2) {
            this.default02 = true;
            this.modeswitch = "0";
            document.getElementById('colorgp').style.display = "block";
            this.getRule1();
            this.getRule2();
            this.detectEffectChange();
        } else {
            return false;
        }

    }
    //

    frtp: boolean = true;
    ftltbox: boolean = false;
    etitle: string = "";
    fnbtn: boolean = false;
    in: any = false;
    see: any = false;

    showsd: boolean = false;
    css01: any = "";
    css02: any = "";
    css03: any = "";
    css04: any = "";





    openOpt() {

        this.fnbtn = !this.fnbtn;
        this.ftltbox = !this.ftltbox;


    }
    desideclrCss: any = {
        R: "e9",
        G: "00",
        B: "4c"
    };

    desideclrCss02: any = {
        R: "00",
        G: "7f",
        B: "ff"
    };

    //顯示給UI介面
    defaultclr: any = "#" + (this.desideclrCss.R + this.desideclrCss.G + this.desideclrCss.B).toUpperCase();
    defaultclr02: any = "#" + (this.desideclrCss02.R + this.desideclrCss02.G + this.desideclrCss02.B).toUpperCase();

    modeswitch = "1";
    selectborder: any;
    selectborder02: any;
    clropt: boolean = true;
    //選定色
    selectclr(w) {
        if (w == 1) {
            this.selectborder = "1px solid white";
            this.selectborder02 = " ";
            this.clropt = true;
        }
        if (w == 2) {
            this.selectborder = " ";
            this.selectborder02 = "1px solid white";
            this.clropt = false;
        }

    }



    //選色器
    PickClr(whichcolor) {
        if (whichcolor == 1) {
            this.desideclrCss = {
                R: "e9",
                G: "00",
                B: "4c"
            };
            // this.pure_red();

            this.defaultclr = "#" + (this.desideclrCss.R + this.desideclrCss.G + this.desideclrCss.B);
            this.getRule1();
        }
        if (whichcolor == 2) {
            this.desideclrCss = {
                R: "ff",
                G: "3f",
                B: "00"
            };
            // this.pure_orange();
            this.defaultclr = "#" + (this.desideclrCss.R + this.desideclrCss.G + this.desideclrCss.B);
            this.getRule1();
        }
        if (whichcolor == 3) {
            this.desideclrCss = {
                R: "ff",
                G: "bf",
                B: "00"
            };
            // this.pure_yellow();
            this.defaultclr = "#" + (this.desideclrCss.R + this.desideclrCss.G + this.desideclrCss.B);
            this.getRule1();
        }

        if (whichcolor == 4) {
            this.desideclrCss = {
                R: "7f",
                G: "ff",
                B: "00"
            };
            // this.pure_green();
            this.defaultclr = "#" + (this.desideclrCss.R + this.desideclrCss.G + this.desideclrCss.B);
            this.getRule1();
        }
        if (whichcolor == 5) {
            this.desideclrCss = {
                R: "00",
                G: "ff",
                B: "ff"
            };
            // this.pure_lightblue();
            this.defaultclr = "#" + (this.desideclrCss.R + this.desideclrCss.G + this.desideclrCss.B);
            this.getRule1();
        }
        if (whichcolor == 6) {
            this.desideclrCss = {
                R: "00",
                G: "7f",
                B: "ff"
            };
            // this.pure_blue();
            this.defaultclr = "#" + (this.desideclrCss.R + this.desideclrCss.G + this.desideclrCss.B);
            this.getRule1();
        }
        if (whichcolor == 7) {
            this.desideclrCss = {
                R: "64",
                G: "00",
                B: "ff"
            };
            // this.pure_darkblue();
            this.defaultclr = "#" + (this.desideclrCss.R + this.desideclrCss.G + this.desideclrCss.B);
            this.getRule1();
        }
        if (whichcolor == 8) {
            this.desideclrCss = {
                R: "af",
                G: "26",
                B: "ff"
            };
            // this.pure_purple();
            this.defaultclr = "#" + (this.desideclrCss.R + this.desideclrCss.G + this.desideclrCss.B);
            this.getRule1();
        }
    }


    PickClr02(whichcolor) {
        if (whichcolor == 1) {
            this.desideclrCss02 = {
                R: "e9",
                G: "00",
                B: "4c"
            };
            // this.pure_red();

            this.defaultclr02 = "#" + (this.desideclrCss02.R + this.desideclrCss02.G + this.desideclrCss02.B);
            this.getRule2();
        }
        if (whichcolor == 2) {
            this.desideclrCss02 = {
                R: "ff",
                G: "3f",
                B: "00"
            };
            // this.pure_orange();
            this.defaultclr02 = "#" + (this.desideclrCss02.R + this.desideclrCss02.G + this.desideclrCss02.B);
            this.getRule2();
        }
        if (whichcolor == 3) {
            this.desideclrCss02 = {
                R: "ff",
                G: "bf",
                B: "00"
            };
            // this.pure_yellow();
            this.defaultclr02 = "#" + (this.desideclrCss02.R + this.desideclrCss02.G + this.desideclrCss02.B);
            this.getRule2();
        }

        if (whichcolor == 4) {
            this.desideclrCss02 = {
                R: "7f",
                G: "ff",
                B: "00"
            };
            // this.pure_green();
            this.defaultclr02 = "#" + (this.desideclrCss02.R + this.desideclrCss02.G + this.desideclrCss02.B);
            this.getRule2();
        }
        if (whichcolor == 5) {
            this.desideclrCss02 = {
                R: "00",
                G: "ff",
                B: "ff"
            };
            // this.pure_lightblue();
            this.defaultclr02 = "#" + (this.desideclrCss02.R + this.desideclrCss02.G + this.desideclrCss02.B);
            this.getRule2();
        }
        if (whichcolor == 6) {
            this.desideclrCss02 = {
                R: "00",
                G: "7f",
                B: "ff"
            };
            // this.pure_blue();
            this.defaultclr02 = "#" + (this.desideclrCss02.R + this.desideclrCss02.G + this.desideclrCss02.B);
            this.getRule2();
        }
        if (whichcolor == 7) {
            this.desideclrCss02 = {
                R: "64",
                G: "00",
                B: "ff"
            };
            // this.pure_darkblue();
            this.defaultclr02 = "#" + (this.desideclrCss02.R + this.desideclrCss02.G + this.desideclrCss02.B);
            this.getRule2();
        }
        if (whichcolor == 8) {
            this.desideclrCss02 = {
                R: "af",
                G: "26",
                B: "ff"
            };
            // this.pure_purple();
            this.defaultclr02 = "#" + (this.desideclrCss02.R + this.desideclrCss02.G + this.desideclrCss02.B);
            this.getRule2();
        }
    }




    //UI亮度調整
    op: any = "0.5";
    bright: any = "0.5";
    onInput(value) {
        this.detectEffectChange();
        this.op = value;
        let vm = this;
        if (this.getDeviceService.dataObj.status == 1) {
            vm.bright = value;
        }
    }

    //

    sp: any = 100;
    SpeedInput(value) {
        this.detectEffectChange();
        let vm = this;
        this.sp = value;
        setTimeout(() => {
            vm.speedMethod(value);
        }, 1000);
    }




    slowFun: any = this.meeting_slow;
    medFun: any = this.meeting_med;
    fastFun: any = this.meeting_high;
    speed: any = '100';

    speedMethod(s) {
        clearInterval(this.getclr01);
        clearInterval(this.getclr02);
        clearInterval(this.getclr03);
        let vm = this;
        vm.speed = s;
        if (s == 150) {
            this.meetingStop()
            vm.slowFun();
        }
        if (s == 100) {
            this.meetingStop()
            vm.medFun();
        }
        if (s == 50) {
            this.meetingStop()
            vm.fastFun();
        } else {
            return false;
        }
    }

    cssRule: any = "";

    getRule1() {
        var rule;
        var ss = document.styleSheets;
        for (var i = 0; i < ss.length; i++) {
            for (var x = 0; x < ss[i]['cssRules'].length; x++) {
                rule = ss[i]['cssRules'][x];
                if (rule.name == "meeting" && rule.type == rule.KEYFRAMES_RULE) {
                    this.cssRule = rule;
                }
            }
        }
        this.cssRule.appendRule(`0% {background-color:${this.defaultclr}}`);
        this.detectEffectChange();
    }
    getRule2() {
        var rule;
        var ss = document.styleSheets;
        for (var i = 0; i < ss.length; i++) {
            for (var x = 0; x < ss[i]['cssRules'].length; x++) {
                rule = ss[i]['cssRules'][x];
                if (rule.name == "meeting" && rule.type == rule.KEYFRAMES_RULE) {
                    this.cssRule = rule;
                }
            }
        }
        this.cssRule.appendRule(`25% {background-color:${this.defaultclr02}}`);
        this.detectEffectChange();
    }

    color1: any = ["#E9004C", "#FF3F00", "#FFBF00", "#7FFF00"]
    color2: any = ["#00FFFF", "#007FFF", "#6400FF", "#AF26FF"]
    getRuleRandom() {
        var rule;
        var ss = document.styleSheets;
        for (var i = 0; i < ss.length; i++) {
            for (var x = 0; x < ss[i]['cssRules'].length; x++) {
                rule = ss[i]['cssRules'][x];
                if (rule.name == "meeting" && rule.type == rule.KEYFRAMES_RULE) {
                    this.cssRule = rule;
                }
            }
        }
        var ran1 = Math.round(Math.random() * 3)
        var ran2 = Math.round(Math.random() * 3)
        this.cssRule.appendRule(`0% {background-color:${this.color1[ran1]}}`);
        this.cssRule.appendRule(`25% {background-color:${this.color2[ran2]}}`);
    }

    //速度
    FastSpeed: any = 50;
    MedSpeed: any = 100;
    SlowSpeed: any = 150;
    //

    timerFlag: any = 0;
    @Input() sendFlag;
    @Input() profileName;
    doItfunction(position) {
        let obj = {
            'ProfileName': this.profileName
        }
        if (this.timerFlag == 0) {
            this.timerFlag = 1;
            setTimeout(() => {
                this.db.getProfile(obj).then((doc: any) => {

                    if (doc[0].Light.Speed[position] == "Speedup") {   //按鍵燈效加快

                        if (this.sp == this.SlowSpeed) {
                            this.speedMethod(this.MedSpeed);
                            this.sp = this.MedSpeed;
                            this.speedhere = this.MedSpeed;
                            //console.log(this.sp);
                        }
                        else if (this.sp == this.MedSpeed) {
                            this.speedMethod(this.FastSpeed);
                            this.sp = this.FastSpeed;
                            this.speedhere = this.FastSpeed;

                            //console.log(this.sp);
                        } else if (this.sp == this.FastSpeed) {
                            // alert('速度已調整為最快');
                            // //console.log(this.sp);
                        }
                    }

                    if (doc[0].Light.Speed[position] == "Slowdown") {   //按鍵燈效減速
                        //console.log('function did');
                        if (this.sp == this.FastSpeed) {
                            this.speedMethod(this.MedSpeed);
                            this.sp = this.MedSpeed;
                            this.speedhere = this.MedSpeed;
                            //console.log(this.sp);
                        }
                        else if (this.sp == this.MedSpeed) {
                            this.speedMethod(this.SlowSpeed);
                            this.sp = this.SlowSpeed;
                            this.speedhere = this.SlowSpeed;
                            //console.log(this.sp);
                        }
                        else if (this.sp == this.SlowSpeed) {
                            // alert('速度已調整為最慢');
                            // //console.log(this.sp);
                        }
                    }

                    if (doc[0].Light.Mode[position] == "Open_CloseEffect") {
                        // //console.log('stop');
                        this.openclose++
                        if (this.openclose == 1) {
                            this.goOut();
                            //this.setAPmode();
                            this.cleanApmode();
                        }
                        else if (this.openclose == 2) {
                            this.goOut();
                            setTimeout(() => {
                                this.goIn();
                                this.openclose = 0;
                            }, 100)
                        }
                    }

                    if (doc[0].Light.Mode[position] == "pauseEffect") {
                        // //console.log('stop');
                        this.pausetime++
                        if (this.pausetime == 1) {
                            this.goOut();
                        }
                        else if (this.pausetime == 2) {
                            this.goOut();
                            setTimeout(() => {
                                this.goIn();
                                this.pausetime = 0;
                            }, 100)
                        }
                    }
                })
                this.timerFlag = 0;
            }, 1000);
        }
        // }
    }
    setIntoDB() {
        // this.openFrtpfun(1);

        this.nowobj.Light.LightSetting.LSbrightness[6] = this.op;
        this.nowobj.Light.LightSetting.LSspeed[6] = this.sp;
        this.nowobj.Light.LightSetting.LSdirection[6] = this.Effectdirection;
        this.nowobj.Light.LightSetting.changeTime[6] = this.timeValue;

        //console.log(this.timeValue);
        this.nowobj.Light.LightSetting.changeMode[6] = this.ttitle;



        // this.nowobj.Key.marcroContent[this.myKey] = this.setMacroarr;
        // //console.log(this.nowobj);


        this.db.UpdateProfile(this.nowobj.id, this.nowobj).then((doc: any) => {
            //console.log('setIntoDB success');
            //console.log(this.nowobj);
            this.openFrtpfun(0);

            // //console.log(doc[0]);
        });
    }

    ngOnDestroy(): void {
        env.log('light-effect', 'meeting', 'end');
        this.subscription.unsubscribe();
        this.goOut();
    }

    @Output() sendTimeCloseFlag = new EventEmitter();
    @Input() check01;
    @Input() timeEffect;
    @Input() receiveTemp;
    @Output() MeetingTemp = new EventEmitter();
    @Output() LightEffect = new EventEmitter();
    @Output() applyStatus = new EventEmitter();
    applyFlag: any = 1;
    lightEffect: any = 6;
    meeting: any;
    meetingObj() {
        this.meeting = {
            'LightEffect': 6,
            'LSbrightness': this.op,
            'LSspeed': this.sp,
            'LSdirection': this.Effectdirection,
            'changeTime': this.timeValue,
            'ttitle': '邂逅',
            'changeStatus': this.check01,
            'changeEffect': this.timeEffect,
            'ColorMode': this.default,
            'Color': {
                'defaultclr': this.defaultclr,
                'defaultclr02': this.defaultclr02,
            },
        }
    }
    readTemp() {
        this.effectfinish.emit();
        this.cuteValue = this.receiveTemp[0];
        this.speedValue = this.receiveTemp[1];
        this.NewtimeValue = this.receiveTemp[3];
        this.ttitle = this.receiveTemp[4];
        this.default = this.receiveTemp[8]
        this.defaultclr = this.receiveTemp[9].defaultclr;
        this.defaultclr02 = this.receiveTemp[9].defaultclr02;

        if (this.cuteValue !== undefined && this.cuteValue !== null && this.cuteValue !== "") {
            this.op = this.cuteValue;
        }

        if (this.speedValue !== undefined && this.speedValue !== null && this.speedValue !== "") {
            this.sp = this.speedValue;
            this.speedMethod(this.sp);
        } else {
            this.sp = 100;
            this.speedMethod(this.sp);
        }

        if (this.NewtimeValue !== undefined && this.NewtimeValue !== null && this.NewtimeValue !== "") {
            this.timeValue = this.NewtimeValue;
        }

        if (this.ttitle !== undefined && this.ttitle !== null && this.ttitle !== "") {
            this.sendTtile();
        } else {
            this.ttitle = '邂逅';
        }

        if (this.default == true) {
            this.setDefault(1);
        } else {
            this.setDefault(2);
        }
    }

    sendApply() {
        if (this.timeEffect !== 6) {
            this.meetingObj();
            setTimeout(() => {
                this.sendTimeCloseFlag.emit(this.check01);
                this.MeetingTemp.emit(this.meeting);
                this.LightEffect.emit(this.meeting.LightEffect)
                this.passTime.emit(this.timeValue);
                setTimeout(() => {
                    this.applyStatus.emit(this.applyFlag);
                    setTimeout(() => {
                        this.sendTimeCloseFlag.emit(this.check01);
                        this.detectEffectChange()
                    }, 500);
                }, 500);
            }, 500);
        } else {
            console.log('apply false');
            return false;
        }
    }
    detectEffectChange() {
        let apply = document.getElementById('apply');
        if (this.op != this.receiveTemp[0] || this.sp != this.receiveTemp[1] || this.timeValue != this.receiveTemp[3] || this.lightEffect != this.receiveTemp[5] || this.timeEffect != this.receiveTemp[7] || this.default != this.receiveTemp[8] || this.defaultclr != this.receiveTemp[9].defaultclr || this.defaultclr02 != this.receiveTemp[9].defaultclr02) {
            apply.style.animationName = "effectApply";
            apply.style.animationDuration = "3s";
            apply.style.animationIterationCount = "infinite";
        } else {
            apply.style.animationName = "";
            apply.style.animationDuration = "";
            apply.style.animationIterationCount = "";
        }
    }

    // ek1: any = 0;
    // ek2: any = 0;
    // ek3: any = 0;
    // envio: any = 0;

    // debug() {
    //     let pause = 19;
    //     let insert = 45;
    //     let ctrl = 17;
    //     let d = 68;
    //     let b = 66;
    //     let g = 71;
    //     let vm = this;
    //     window.addEventListener('keydown', (e) => {
    //         if (e.ctrlKey && e.keyCode == insert) {
    //             vm.ek1 = 1;
    //             window.addEventListener('keyup', (e) => {
    //                 if (e.keyCode == ctrl || e.keyCode == insert) {
    //                     if (vm.ek1 == 1) {
    //                         vm.ek1 = 0;
    //                         console.log('cancel debug')
    //                         return false
    //                     }
    //                 }
    //             })
    //         }

    //         else if (e.shiftKey && e.keyCode == pause) {
    //             vm.ek1 = 0;
    //             vm.ek2 = 0;
    //             vm.ek3 = 0;
    //             vm.envio = 0;
    //             console.log('close debug mode')
    //             env.log('in rainbow', '關閉偵錯模式', 'close debug mode');
    //         }

    //         window.addEventListener('keydown', (e) => {
    //             if (e.keyCode == d) {
    //                 if (vm.ek1 == 1) {
    //                     vm.ek2 = 1;
    //                 }
    //             }
    //         })
    //         window.addEventListener('keydown', (e) => {
    //             if (e.keyCode == b) {
    //                 if (vm.ek1 == 1 && vm.ek2 == 1) {
    //                     vm.ek3 = 1;
    //                 }
    //             }
    //         })
    //         window.addEventListener('keydown', (e) => {
    //             if (e.keyCode == g) {
    //                 if (vm.ek1 == 1 && vm.ek2 == 1 && vm.ek3 == 1) {
    //                     vm.envio = 1;
    //                     console.log('in debug mode')
    //                     env.log('in rainbow', '開啟偵錯模式', 'in debug mode');
    //                 }
    //             }
    //         })
    //     })
    // }

}