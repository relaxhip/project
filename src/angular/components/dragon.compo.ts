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
    selector: 'dragon-effect',
    templateUrl: './components/effect/dragon.compo.html',
    //template: '<h1>我的第一个 Angular 应用</h1>',
    styleUrls: ['./css/first.css', './css/kbd.css', './css/dragon.css', './css/attractlight.css'],
    providers: [protocolService, dbService, icpEventService],
    inputs: ['ProfileDetail', 'ttitle', 'getGameChange', 'updatenow', 'changeProfile']
})



export class dragonComponent implements OnInit {
    constructor(private protocol: protocolService, private db: dbService, private getDeviceService: GetDeviceService, private emitService: EmitService, private icpEventService: icpEventService) {
        //console.log('dragon loading complete');
        this.subscription = this.emitService.EmitObservable.subscribe(src => {
            if (src == 'insert') {
                //this.setAPmode();//連續下值預備動作
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
                    this.lightBar(1)
                    this.attbtn = false;
                    this.defaultLb = true;
                }
                else if (this.fromicp.data[0] == 4 && this.fromicp.data[1] == 225 && this.fromicp.data[2] == 16 && this.fromicp.data[3] == 2) {
                    //console.log("attright");
                    this.lightBar(0)
                    this.attbtn = true;
                    this.defaultLb = false;
                }
            }
            // if (this.fromicp.data !== undefined && this.timeEventFlag == true) {
            //     this.timeEvent();
            // }
            this.attPt01();
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
    getGameChange: any;
    savechange: number = 0;
    currentV: any;
    changeV: any;
    cuteValue: any = 0.5;
    speedValue: any = 100;
    loading: boolean;
    Effectdirection: any = 1;
    NewtimeValue: any = 10;
    ttitle: string;
    timeValue: any = 10;
    timewarn: boolean = false;
    @Output() outputTtile: EventEmitter<any> = new EventEmitter();

    sendTtile() {
        this.outputTtile.emit(this.ttitle);
    }
    0;
    timeCount: any;

    @Output() passTime = new EventEmitter();

    @Input() attPt;
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
            this.array1 = ["esc", "f1", "f2", "f3", "f4", "f5", "f6", "f7", "f8", "f9", "f10", "f11", "f12", "print", "scroll", "pause", "perid", "n1", "n2", "n3", "n4", "n5", "n6", "n7", "n8", "n9", "n0", "minus", "plus", "bsp", "insert", "home", "pup", "numlock", "numdrawn", "numtimes", "numminus", "tab", "q", "w", "e", "r", "t", "y", "u", "i", "o", "p", "lqu", "rqu", "delete", "drawn", "end", "pdown", "num7", "num8", "num9", "numplus", "caps", "a", "s", "d", "f", "g", "h", "j", "k", "l", "sem", "quo", "enter", "num4", "num5", "num6", "lshift", "z", "x", "c", "v", "b", "n", "m", "comma", "dot", "qmark", "rshift", "up", "num1", "num2", "num3", "numenter", "lctrl", "win", "lalt", "space", "ralt", "fn", "book", "rctrl", "left", "down", "right", "num0", "numdot", "Upside1", "Upside2", "Upside3", "Upside4", "Upside5", "Upside6", "Upside7", "Upside8", "Upside9", "Upside10", "Upside11", "Upside12", "Upside13", "Upside14", "Upside15", "Upside16", "Upside17", "Upside18", "Upside19", "Upside20", "logo1", "logo2"];
            this.logo1_att = "";
            this.logo2_att = "";
            // this.getColor1();
            this.attBar(1);
            this.sendLBS();
        }
        else if (x == 0) {
            this.data = 0;
            this.lightBarStatus = this.data;
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

    // ngDoCheck() {
    // 	this.detectEffectChange()
    // }

    ngOnInit() {       //龍騰
        this.timeValue = this.receiveTemp[3];
        this.check01 = false;
        this.DragonTemp.emit(this.dragon);
        env.log('light-effect', 'dragon', 'start');
        //this.setAPmode();//連續下值預備動作
        this.LEDmatrix();//找出對應按鍵;
        this.setDefault(1);
        // this.dragonRight_med();
        this.readTemp();
        this.sendTimeCloseFlag.emit(false);

        if (this.lightBS == 0) {
            //console.log("from parent LBS 0 attRight", this.lightBS);
            this.lightBar(0);
            this.attbtn = true;
            this.defaultLb = false;
        }
        else if (this.lightBS == 1) {
            //console.log("from parent LBS 1 attLeft", this.lightBS)
            this.lightBar(1)
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
        }


        if (this.currentV == '"stopApmode"' && this.savechange == 0) {
            this.savechange = 1;
            this.goOut();
            // if (this.envio == 1) {
                env.log('dragon', 'apmode', 'stopapmode')
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
                env.log('dragon', 'apmode', 'startapmode')
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

    leave: any = 1;
    firstKB: any;
    positionR: any;
    positionG: any;
    positionB: any;
    positionRarr: any = [];
    positionGarr: any = [];
    positionBarr: any = [];
    // blockcss: any = "disabled";
    array1: any = ["esc", "f1", "f2", "f3", "f4", "f5", "f6", "f7", "f8", "f9", "f10", "f11", "f12", "print", "scroll", "pause", "perid", "n1", "n2", "n3", "n4", "n5", "n6", "n7", "n8", "n9", "n0", "minus", "plus", "bsp", "insert", "home", "pup", "numlock", "numdrawn", "numtimes", "numminus", "tab", "q", "w", "e", "r", "t", "y", "u", "i", "o", "p", "lqu", "rqu", "delete", "drawn", "end", "pdown", "num7", "num8", "num9", "numplus", "caps", "a", "s", "d", "f", "g", "h", "j", "k", "l", "sem", "quo", "enter", "num4", "num5", "num6", "lshift", "z", "x", "c", "v", "b", "n", "m", "comma", "dot", "qmark", "rshift", "up", "num1", "num2", "num3", "numenter", "lctrl", "win", "lalt", "space", "ralt", "fn", "book", "rctrl", "left", "down", "right", "num0", "numdot", "Upside1", "Upside2", "Upside3", "Upside4", "Upside5", "Upside6", "Upside7", "Upside8", "Upside9", "Upside10", "Upside11", "Upside12", "Upside13", "Upside14", "Upside15", "Upside16", "Upside17", "Upside18", "Upside19", "Upside20", "logo1", "logo2"];


    arrayAtt: any = ["esc_att", "f1_att", "f2_att", "f3_att", "f4_att", "f5_att", "f6_att", "f7_att", "f8_att", "f9_att", "f10_att", "f11_att", "f12_att", "print_att", "scroll_att", "pause_att", "perid_att", "n1_att", "n2_att", "n3_att", "n4_att", "n5_att", "n6_att", "n7_att", "n8_att", "n9_att", "n0_att", "minus_att", "plus_att", "bsp_att", "insert_att", "home_att", "pup_att", "numlock_att", "numdrawn_att", "numtimes_att", "numminus_att", "tab_att", "q_att", "w_att", "e_att", "r_att", "t_att", "y_att", "u_att", "i_att", "o_att", "p_att", "lqu_att", "rqu_att", "delete_att", "drawn_att", "end_att", "pdown_att", "num7_att", "num8_att", "num9_att", "numplus_att", "caps_att", "a_att", "s_att", "d_att", "f_att", "g_att", "h_att", "j_att", "k_att", "l_att", "sem_att", "quo_att", "enter_att", "num4_att", "num5_att", "num6_att", "lshift_att", "z_att", "x_att", "c_att", "v_att", "b_att", "n_att", "m_att", "comma_att", "dot_att", "qmark_att", "rshift_att", "up_att", "num1_att", "num2_att", "num3_att", "numenter_att", "lctrl_att", "win_att", "lalt_att", "space_att", "ralt_att", "fn_att", "book_att", "rctrl_att", "left_att", "down_att", "right_att", "num0_att", "numdot_att", "Upside1_att", "Upside2_att", "Upside3_att", "Upside4_att", "Upside5_att", "Upside6_att", "Upside7_att", "Upside8_att", "Upside9_att", "Upside10_att", "Upside11_att", "Upside12_att", "Upside13_att", "Upside14_att", "Upside15_att", "Upside16_att", "Upside17_att", "Upside18_att", "Upside19_att", "Upside20_att", "logo1_att", "logo2_att"]

    getclr01: any;
    getPt: any;
    data: any = 1;
    upAtt: any = []

    getColor1() {	//RGB取值 上到下
        let vm = this;
        clearInterval(this.getclr01);
        if (this.data == 0) {
            this.upAtt = ["Upside1_att", "Upside2_att", "Upside3_att", "Upside4_att", "Upside5_att", "Upside6_att", "Upside7_att", "Upside8_att", "Upside9_att", "Upside10_att", "Upside11_att", "Upside12_att", "Upside13_att", "Upside14_att", "Upside15_att", "Upside16_att", "Upside17_att", "Upside18_att", "Upside19_att", "Upside20_att", "logo1_att", "logo2_att"];
            for (let i = 0; i < 22; i++) {
                this.array1[i + 104] = this.upAtt[i]
            }
            this.getclr01 = setInterval(() => {
                for (var i = 0; i < this.array1.length; i++) {
                    let clrIn = window.getComputedStyle(document.getElementById(this.array1[i]), null).getPropertyValue("background-color");
                    vm.red[i] = (parseInt(vm.convertColor(clrIn)[0]));
                    vm.green[i] = (parseInt(vm.convertColor(clrIn)[1]));
                    vm.blue[i] = (parseInt(vm.convertColor(clrIn)[2]));
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
                    vm.red[i] = (parseInt(vm.convertColor(clrIn)[0]));
                    vm.green[i] = (parseInt(vm.convertColor(clrIn)[1]));
                    vm.blue[i] = (parseInt(vm.convertColor(clrIn)[2]));
                }
            }, 1000 / 60);
        }
    }


    //取值區

    red: any = new Buffer(new Array(126));
    green: any = new Buffer(new Array(126));
    blue: any = new Buffer(new Array(126));
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
            //console.log('setapmode');
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
        //console.log('LED1111');
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
            let word = this.array1[t];
            for (let i = 0; i < 16; i++) {
                if (s[i].indexOf(word) !== -1) {
                    let x = i;
                    let y = s[i].indexOf(word);
                    this.positionR = x * 10 + y;
                    this.positionG = x * 10 + y + 160;
                    this.positionB = x * 10 + y + 320;

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
        // if(this.getGameChange='stopApmode'){
        // 	this.goOut();
        // }
        // //console.log('R'+this.positionR);
        // //console.log('G'+this.positionG);
        // //console.log('B'+this.positionB);
        if (this.saveapmode === false) { //設定一個布林值決定是否要執行下面的程式碼
            this.saveapmode = true;//一進入程式後就把判斷通道關閉，代表同一個時間，不會有兩個doapmode執行

            var apMode = new Buffer(new Array(480));
            for (let i = 0; i < this.array1.length; i++) {
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

    thelastEffect: any = this.dragonRight_med;

    KBClean() {
        for (let i = 0; i < this.array1.length; i++) {
            this.red[i] = 0;
            this.green[i] = 0;
            this.blue[i] = 0;
        }
    }
    letsgoout: boolean = true;
    letsgoIn: boolean = false;
    plugIn() {

        clearInterval(this.getclr01);

        this.leave = 0;
        // this.letsgoout = false;
        // this.letsgoIn = true;

        this.goIn();
    }
    none() {
        clearInterval(this.getclr01);

        this.leave = 0;
        // this.letsgoout = false;
        // this.letsgoIn = true;
        this.cleanApmode();
        this.savechange = 0;
    }

    goOut() {
        clearInterval(this.getclr01);
        clearInterval(this.stopAtt);

        this.leave = 0;
        this.letsgoout = false;
        this.letsgoIn = true;
        this.savechange = 0;

    }
    goIn() {
        //this.setAPmode();//連續下值預備動作
        // this.LEDmatrix()//找出對應按鍵;
        // this.setDefault(1);
        // if (this.getDeviceService.dataObj.status == 1) {
        this.thelastEffect();
        this.leave = 1;
        setTimeout(() => {
            this.doApmode01();
        }, 200);
        this.letsgoout = true;
        this.letsgoIn = false;
        this.savechange = 0;
        // this.detectButton();
    }






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

    clear() {
        this.esc = "";
        this.f1 = "";
        this.f2 = "";
        this.f3 = "";
        this.f4 = "";
        this.f5 = "";
        this.f6 = "";
        this.f7 = "";
        this.f8 = "";
        this.f9 = "";
        this.f10 = "";
        this.f11 = "";
        this.f12 = "";
        this.print = "";
        this.scroll = "";
        this.pause = "";
        this.perid = "";
        this.n1 = "";
        this.n2 = "";
        this.n3 = "";
        this.n4 = "";
        this.n5 = "";
        this.n6 = "";
        this.n7 = "";
        this.n8 = "";
        this.n9 = "";
        this.n0 = "";
        this.minus = "";
        this.plus = "";
        this.bsp = "";
        this.insert = "";
        this.home = "";
        this.pup = "";
        this.numlock = "";
        this.numdrawn = "";
        this.numtimes = "";
        this.numminus = "";
        this.tab = "";
        this.q = "";
        this.w = "";
        this.e = "";
        this.r = "";
        this.t = "";
        this.y = "";
        this.u = "";
        this.i = "";
        this.o = "";
        this.p = "";
        this.lqu = "";
        this.rqu = "";
        this.delete = "";
        this.drawn = "";
        this.end = "";
        this.pdown = "";
        this.num7 = "";
        this.num8 = "";
        this.num9 = "";
        this.numplus = "";
        this.caps = "";
        this.a = "";
        this.s = "";
        this.d = "";
        this.f = "";
        this.g = "";
        this.h = "";
        this.j = "";
        this.k = "";
        this.l = "";
        this.sem = "";
        this.quo = "";
        this.enter = "";
        this.num4 = "";
        this.num5 = "";
        this.num6 = "";
        this.lshift = "";
        this.z = "";
        this.x = "";
        this.c = "";
        this.v = "";
        this.b = "";
        this.n = "";
        this.m = "";
        this.comma = "";
        this.dot = "";
        this.qmark = "";
        this.rshift = "";
        this.up = "";
        this.num1 = "";
        this.num2 = "";
        this.num3 = "";
        this.numenter = "";
        this.lctrl = "";
        this.win = "";
        this.lalt = "";
        this.space = "";
        this.ralt = "";
        this.fn = "";
        this.book = "";
        this.rctrl = "";
        this.left = "";
        this.down = "";
        this.right = "";
        this.num0 = "";
        this.numdot = "";
    }

    dragonRight_med() {       //龍騰中速
        this.thelastEffect = this.dragonRight_med;
        this.getColor1();
        this.clear();
        this.esc = "dragonUp1_med";
        this.perid = "dragonUp1_med";
        this.n1 = "dragonUp1_med";
        this.f1 = "dragonUp2_med";
        this.n2 = "dragonUp2_med";
        this.n3 = "dragonUp3_med";
        this.w = "dragonUp3_med";
        this.e = "dragonUp4_med";
        this.d = "dragonUp5_med";
        this.c = "dragonUp5_med";
        this.space = "dragonUp5_med";
        this.f = "dragonUp6_med";
        this.v = "dragonUp6_med";
        this.b = "dragonUp7_med";
        this.n = "dragonUp8_med";
        this.m = "dragonUp9_med";
        this.comma = "dragonUp10_med";
        this.dot = "dragonUp10_med";
        this.l = "dragonUp11_med";
        this.sem = "dragonUp11_med";
        this.p = "dragonUp12_med";
        this.lqu = "dragonUp12_med";
        this.minus = "dragonUp13_med";
        this.plus = "dragonUp13_med";
        this.f10 = "dragonUp14_med";
        this.f11 = "dragonUp15_med";
        this.bsp = "dragonUp15_med";
        this.f12 = "dragonUp16_med";
        this.print = "dragonUp17_med";
        this.insert = "dragonUp17_med";
        this.scroll = "dragonUp18_med";
        this.home = "dragonUp18_med";
        this.pause = "dragonUp19_med";
        this.pup = "dragonUp19_med";
        this.numlock = "dragonUp19_med";
        this.pdown = "dragonUp20_med";
        this.num7 = "dragonUp21_med";
        this.num8 = "dragonUp22_med";
        this.num5 = "dragonUp23_med";
        this.num6 = "dragonUp23_med";
        this.num2 = "dragonUp24_med";
        this.num3 = "dragonUp24_med";
        this.numdot = "dragonUp25_med";
        this.numenter = "dragonUp25_med";
        this.lctrl = "dragonDown1_med";
        this.lshift = "dragonDown1_med";
        this.z = "dragonDown2_med";
        this.a = "dragonDown2_med";
        this.s = "dragonDown3_med";
        this.f3 = "dragonDown4_med";
        this.n4 = "dragonDown4_med";
        this.f4 = "dragonDown5_med";
        this.n5 = "dragonDown5_med";
        this.n6 = "dragonDown6_med";
        this.f5 = "dragonDown7_med";
        this.n7 = "dragonDown7_med";
        this.f6 = "dragonDown8_med";
        this.n8 = "dragonDown8_med";
        this.i = "dragonDown9_med";
        this.n9 = "dragonDown10_med";
        this.o = "dragonDown11_med";
        this.quo = "dragonDown13_med";
        this.qmark = "dragonDown13_med";
        this.rshift = "dragonDown14_med";
        this.book = "dragonDown14_med";
        this.rctrl = "dragonDown15_med";
        this.left = "dragonDown16_med";
        this.up = "dragonDown17_med";
        this.down = "dragonDown17_med";
        this.right = "dragonDown18_med";
        this.num1 = "dragonDown19_med";
        this.num4 = "dragonDown19_med";
        this.numdrawn = "dragonDown20_med";
        this.numtimes = "dragonDown21_med";
        this.num9 = "dragonDown21_med";
        this.numminus = "dragonDown22_med";
    }

    dragonRight_high() {       //龍騰高速
        this.thelastEffect = this.dragonRight_high;
        this.getColor1();
        this.clear();
        this.esc = "dragonUp1_high";
        this.perid = "dragonUp1_high";
        this.n1 = "dragonUp1_high";
        this.f1 = "dragonUp2_high";
        this.n2 = "dragonUp2_high";
        this.n3 = "dragonUp3_high";
        this.w = "dragonUp3_high";
        this.e = "dragonUp4_high";
        this.d = "dragonUp5_high";
        this.c = "dragonUp5_high";
        this.space = "dragonUp5_high";
        this.f = "dragonUp6_high";
        this.v = "dragonUp6_high";
        this.b = "dragonUp7_high";
        this.n = "dragonUp8_high";
        this.m = "dragonUp9_high";
        this.comma = "dragonUp10_high";
        this.dot = "dragonUp10_high";
        this.l = "dragonUp11_high";
        this.sem = "dragonUp11_high";
        this.p = "dragonUp12_high";
        this.lqu = "dragonUp12_high";
        this.minus = "dragonUp13_high";
        this.plus = "dragonUp13_high";
        this.f10 = "dragonUp14_high";
        this.f11 = "dragonUp15_high";
        this.bsp = "dragonUp15_high";
        this.f12 = "dragonUp16_high";
        this.print = "dragonUp17_high";
        this.insert = "dragonUp17_high";
        this.scroll = "dragonUp18_high";
        this.home = "dragonUp18_high";
        this.pause = "dragonUp19_high";
        this.pup = "dragonUp19_high";
        this.numlock = "dragonUp19_high";
        this.pdown = "dragonUp20_high";
        this.num7 = "dragonUp21_high";
        this.num8 = "dragonUp22_high";
        this.num5 = "dragonUp23_high";
        this.num6 = "dragonUp23_high";
        this.num2 = "dragonUp24_high";
        this.num3 = "dragonUp24_high";
        this.numdot = "dragonUp25_high";
        this.numenter = "dragonUp25_high";
        this.lctrl = "dragonDown1_high";
        this.lshift = "dragonDown1_high";
        this.z = "dragonDown2_high";
        this.a = "dragonDown2_high";
        this.s = "dragonDown3_high";
        this.f3 = "dragonDown4_high";
        this.n4 = "dragonDown4_high";
        this.f4 = "dragonDown5_high";
        this.n5 = "dragonDown5_high";
        this.n6 = "dragonDown6_high";
        this.f5 = "dragonDown7_high";
        this.n7 = "dragonDown7_high";
        this.f6 = "dragonDown8_high";
        this.n8 = "dragonDown8_high";
        this.i = "dragonDown9_high";
        this.n9 = "dragonDown10_high";
        this.o = "dragonDown11_high";
        this.quo = "dragonDown13_high";
        this.qmark = "dragonDown13_high";
        this.rshift = "dragonDown14_high";
        this.book = "dragonDown14_high";
        this.rctrl = "dragonDown15_high";
        this.left = "dragonDown16_high";
        this.up = "dragonDown17_high";
        this.down = "dragonDown17_high";
        this.right = "dragonDown18_high";
        this.num1 = "dragonDown19_high";
        this.num4 = "dragonDown19_high";
        this.numdrawn = "dragonDown20_high";
        this.numtimes = "dragonDown21_high";
        this.num9 = "dragonDown21_high";
        this.numminus = "dragonDown22_high";
    }

    dragonRight_slow() {       //向右龍騰慢速
        this.thelastEffect = this.dragonRight_slow;
        this.getColor1();
        this.clear();
        this.esc = "dragonUp1_slow";
        this.perid = "dragonUp1_slow";
        this.n1 = "dragonUp1_slow";
        this.f1 = "dragonUp2_slow";
        this.n2 = "dragonUp2_slow";
        this.n3 = "dragonUp3_slow";
        this.w = "dragonUp3_slow";
        this.e = "dragonUp4_slow";
        this.d = "dragonUp5_slow";
        this.c = "dragonUp5_slow";
        this.space = "dragonUp5_slow";
        this.f = "dragonUp6_slow";
        this.v = "dragonUp6_slow";
        this.b = "dragonUp7_slow";
        this.n = "dragonUp8_slow";
        this.m = "dragonUp9_slow";
        this.comma = "dragonUp10_slow";
        this.dot = "dragonUp10_slow";
        this.l = "dragonUp11_slow";
        this.sem = "dragonUp11_slow";
        this.p = "dragonUp12_slow";
        this.lqu = "dragonUp12_slow";
        this.minus = "dragonUp13_slow";
        this.plus = "dragonUp13_slow";
        this.f10 = "dragonUp14_slow";
        this.f11 = "dragonUp15_slow";
        this.bsp = "dragonUp15_slow";
        this.f12 = "dragonUp16_slow";
        this.print = "dragonUp17_slow";
        this.insert = "dragonUp17_slow";
        this.scroll = "dragonUp18_slow";
        this.home = "dragonUp18_slow";
        this.pause = "dragonUp19_slow";
        this.pup = "dragonUp19_slow";
        this.numlock = "dragonUp19_slow";
        this.pdown = "dragonUp20_slow";
        this.num7 = "dragonUp21_slow";
        this.num8 = "dragonUp22_slow";
        this.num5 = "dragonUp23_slow";
        this.num6 = "dragonUp23_slow";
        this.num2 = "dragonUp24_slow";
        this.num3 = "dragonUp24_slow";
        this.numdot = "dragonUp25_slow";
        this.numenter = "dragonUp25_slow";
        this.lctrl = "dragonDown1_slow";
        this.lshift = "dragonDown1_slow";
        this.z = "dragonDown2_slow";
        this.a = "dragonDown2_slow";
        this.s = "dragonDown3_slow";
        this.f3 = "dragonDown4_slow";
        this.n4 = "dragonDown4_slow";
        this.f4 = "dragonDown5_slow";
        this.n5 = "dragonDown5_slow";
        this.n6 = "dragonDown6_slow";
        this.f5 = "dragonDown7_slow";
        this.n7 = "dragonDown7_slow";
        this.f6 = "dragonDown8_slow";
        this.n8 = "dragonDown8_slow";
        this.i = "dragonDown9_slow";
        this.n9 = "dragonDown10_slow";
        this.o = "dragonDown11_slow";
        this.quo = "dragonDown13_slow";
        this.qmark = "dragonDown13_slow";
        this.rshift = "dragonDown14_slow";
        this.book = "dragonDown14_slow";
        this.rctrl = "dragonDown15_slow";
        this.left = "dragonDown16_slow";
        this.up = "dragonDown17_slow";
        this.down = "dragonDown17_slow";
        this.right = "dragonDown18_slow";
        this.num1 = "dragonDown19_slow";
        this.num4 = "dragonDown19_slow";
        this.numdrawn = "dragonDown20_slow";
        this.numtimes = "dragonDown21_slow";
        this.num9 = "dragonDown21_slow";
        this.numminus = "dragonDown22_slow";
    }
    dragonLeft_high() {       //向左龍騰高速
        this.thelastEffect = this.dragonLeft_high;
        this.getColor1();
        this.clear();
        this.esc = "dragonUp25_high";
        this.perid = "dragonUp25_high";
        this.n1 = "dragonUp25_high";
        this.f1 = "dragonUp24_high";
        this.n2 = "dragonUp24_high";
        this.n3 = "dragonUp23_high";
        this.w = "dragonUp23_high";
        this.e = "dragonUp22_high";
        this.d = "dragonUp21_high";
        this.c = "dragonUp21_high";
        this.space = "dragonUp21_high";
        this.f = "dragonUp20_high";
        this.v = "dragonUp20_high";
        this.b = "dragonUp19_high";
        this.n = "dragonUp18_high";
        this.m = "dragonUp17_high";
        this.comma = "dragonUp16_high";
        this.dot = "dragonUp16_high";
        this.l = "dragonUp15_high";
        this.sem = "dragonUp15_high";
        this.p = "dragonUp14_high";
        this.lqu = "dragonUp14_high";
        this.minus = "dragonUp13_high";
        this.plus = "dragonUp13_high";
        this.f10 = "dragonUp12_high";
        this.f11 = "dragonUp11_high";
        this.bsp = "dragonUp11_high";
        this.f12 = "dragonUp10_high";
        this.print = "dragonUp9_high";
        this.insert = "dragonUp9_high";
        this.scroll = "dragonUp8_high";
        this.home = "dragonUp8_high";
        this.pause = "dragonUp7_high";
        this.pup = "dragonUp7_high";
        this.numlock = "dragonUp7_high";
        this.pdown = "dragonUp6_high";
        this.num7 = "dragonUp5_high";
        this.num8 = "dragonUp4_high";
        this.num5 = "dragonUp3_high";
        this.num6 = "dragonUp3_high";
        this.num2 = "dragonUp2_high";
        this.num3 = "dragonUp2_high";
        this.numdot = "dragonUp1_high";
        this.numenter = "dragonUp1_high";
        this.lctrl = "dragonDown22_high";
        this.lshift = "dragonDown22_high";
        this.z = "dragonDown21_high";
        this.a = "dragonDown21_high";
        this.s = "dragonDown20_high";
        this.f3 = "dragonDown19_high";
        this.n4 = "dragonDown19_high";
        this.f4 = "dragonDown18_high";
        this.n5 = "dragonDown18_high";
        this.n6 = "dragonDown17_high";
        this.f5 = "dragonDown16_high";
        this.n7 = "dragonDown16_high";
        this.f6 = "dragonDown15_high";
        this.n8 = "dragonDown15_high";
        this.i = "dragonDown14_high";
        this.n9 = "dragonDown13_high";
        this.o = "dragonDown12_high";
        this.quo = "dragonDown11_high";
        this.qmark = "dragonDown11_high";
        this.rshift = "dragonDown9_high";
        this.book = "dragonDown9_high";
        this.rctrl = "dragonDown8_high";
        this.left = "dragonDown7_high";
        this.up = "dragonDown6_high";
        this.down = "dragonDown6_high";
        this.right = "dragonDown5_high";
        this.num1 = "dragonDown4_high";
        this.num4 = "dragonDown4_high";
        this.numdrawn = "dragonDown3_high";
        this.numtimes = "dragonDown2_high";
        this.num9 = "dragonDown2_high";
        this.numminus = "dragonDown1_high";
    }




    dragonLeft_med() {       //向左龍騰高速
        this.thelastEffect = this.dragonLeft_med;
        this.getColor1();
        this.clear();
        this.esc = "dragonUp25_med";
        this.perid = "dragonUp25_med";
        this.n1 = "dragonUp25_med";
        this.f1 = "dragonUp24_med";
        this.n2 = "dragonUp24_med";
        this.n3 = "dragonUp23_med";
        this.w = "dragonUp23_med";
        this.e = "dragonUp22_med";
        this.d = "dragonUp21_med";
        this.c = "dragonUp21_med";
        this.space = "dragonUp21_med";
        this.f = "dragonUp20_med";
        this.v = "dragonUp20_med";
        this.b = "dragonUp19_med";
        this.n = "dragonUp18_med";
        this.m = "dragonUp17_med";
        this.comma = "dragonUp16_med";
        this.dot = "dragonUp16_med";
        this.l = "dragonUp15_med";
        this.sem = "dragonUp15_med";
        this.p = "dragonUp14_med";
        this.lqu = "dragonUp14_med";
        this.minus = "dragonUp13_med";
        this.plus = "dragonUp13_med";
        this.f10 = "dragonUp12_med";
        this.f11 = "dragonUp11_med";
        this.bsp = "dragonUp11_med";
        this.f12 = "dragonUp10_med";
        this.print = "dragonUp9_med";
        this.insert = "dragonUp9_med";
        this.scroll = "dragonUp8_med";
        this.home = "dragonUp8_med";
        this.pause = "dragonUp7_med";
        this.pup = "dragonUp7_med";
        this.numlock = "dragonUp7_med";
        this.pdown = "dragonUp6_med";
        this.num7 = "dragonUp5_med";
        this.num8 = "dragonUp4_med";
        this.num5 = "dragonUp3_med";
        this.num6 = "dragonUp3_med";
        this.num2 = "dragonUp2_med";
        this.num3 = "dragonUp2_med";
        this.numdot = "dragonUp1_med";
        this.numenter = "dragonUp1_med";
        this.lctrl = "dragonDown22_med";
        this.lshift = "dragonDown22_med";
        this.z = "dragonDown21_med";
        this.a = "dragonDown21_med";
        this.s = "dragonDown20_med";
        this.f3 = "dragonDown19_med";
        this.n4 = "dragonDown19_med";
        this.f4 = "dragonDown18_med";
        this.n5 = "dragonDown18_med";
        this.n6 = "dragonDown17_med";
        this.f5 = "dragonDown16_med";
        this.n7 = "dragonDown16_med";
        this.f6 = "dragonDown15_med";
        this.n8 = "dragonDown15_med";
        this.i = "dragonDown14_med";
        this.n9 = "dragonDown13_med";
        this.o = "dragonDown12_med";
        this.quo = "dragonDown11_med";
        this.qmark = "dragonDown11_med";
        this.rshift = "dragonDown9_med";
        this.book = "dragonDown9_med";
        this.rctrl = "dragonDown8_med";
        this.left = "dragonDown7_med";
        this.up = "dragonDown6_med";
        this.down = "dragonDown6_med";
        this.right = "dragonDown5_med";
        this.num1 = "dragonDown4_med";
        this.num4 = "dragonDown4_med";
        this.numdrawn = "dragonDown3_med";
        this.numtimes = "dragonDown2_med";
        this.num9 = "dragonDown2_med";
        this.numminus = "dragonDown1_med";
    }




    dragonLeft_slow() {       //向左龍騰高速
        this.thelastEffect = this.dragonLeft_slow;
        this.getColor1();
        this.clear();
        this.esc = "dragonUp25_slow";
        this.perid = "dragonUp25_slow";
        this.n1 = "dragonUp25_slow";
        this.f1 = "dragonUp24_slow";
        this.n2 = "dragonUp24_slow";
        this.n3 = "dragonUp23_slow";
        this.w = "dragonUp23_slow";
        this.e = "dragonUp22_slow";
        this.d = "dragonUp21_slow";
        this.c = "dragonUp21_slow";
        this.space = "dragonUp21_slow";
        this.f = "dragonUp20_slow";
        this.v = "dragonUp20_slow";
        this.b = "dragonUp19_slow";
        this.n = "dragonUp18_slow";
        this.m = "dragonUp17_slow";
        this.comma = "dragonUp16_slow";
        this.dot = "dragonUp16_slow";
        this.l = "dragonUp15_slow";
        this.sem = "dragonUp15_slow";
        this.p = "dragonUp14_slow";
        this.lqu = "dragonUp14_slow";
        this.minus = "dragonUp13_slow";
        this.plus = "dragonUp13_slow";
        this.f10 = "dragonUp12_slow";
        this.f11 = "dragonUp11_slow";
        this.bsp = "dragonUp11_slow";
        this.f12 = "dragonUp10_slow";
        this.print = "dragonUp9_slow";
        this.insert = "dragonUp9_slow";
        this.scroll = "dragonUp8_slow";
        this.home = "dragonUp8_slow";
        this.pause = "dragonUp7_slow";
        this.pup = "dragonUp7_slow";
        this.numlock = "dragonUp7_slow";
        this.pdown = "dragonUp6_slow";
        this.num7 = "dragonUp5_slow";
        this.num8 = "dragonUp4_slow";
        this.num5 = "dragonUp3_slow";
        this.num6 = "dragonUp3_slow";
        this.num2 = "dragonUp2_slow";
        this.num3 = "dragonUp2_slow";
        this.numdot = "dragonUp1_slow";
        this.numenter = "dragonUp1_slow";
        this.lctrl = "dragonDown22_slow";
        this.lshift = "dragonDown22_slow";
        this.z = "dragonDown21_slow";
        this.a = "dragonDown21_slow";
        this.s = "dragonDown20_slow";
        this.f3 = "dragonDown19_slow";
        this.n4 = "dragonDown19_slow";
        this.f4 = "dragonDown18_slow";
        this.n5 = "dragonDown18_slow";
        this.n6 = "dragonDown17_slow";
        this.f5 = "dragonDown16_slow";
        this.n7 = "dragonDown16_slow";
        this.f6 = "dragonDown15_slow";
        this.n8 = "dragonDown15_slow";
        this.i = "dragonDown14_slow";
        this.n9 = "dragonDown13_slow";
        this.o = "dragonDown12_slow";
        this.quo = "dragonDown11_slow";
        this.qmark = "dragonDown11_slow";
        this.rshift = "dragonDown9_slow";
        this.book = "dragonDown9_slow";
        this.rctrl = "dragonDown8_slow";
        this.left = "dragonDown7_slow";
        this.up = "dragonDown6_slow";
        this.down = "dragonDown6_slow";
        this.right = "dragonDown5_slow";
        this.num1 = "dragonDown4_slow";
        this.num4 = "dragonDown4_slow";
        this.numdrawn = "dragonDown3_slow";
        this.numtimes = "dragonDown2_slow";
        this.num9 = "dragonDown2_slow";
        this.numminus = "dragonDown1_slow";
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
            document.getElementById('colorgp').style.display = "none";
            this.getRule1();
            this.getRule2();
        }
        if (w == 2) {
            this.default02 = true;
            document.getElementById('colorgp').style.display = "block";
            this.getRuleUp();
            this.getRuleDown();
            this.detectEffectChange();
        } else {
            return false;
        }

    }

    frtp: boolean = true;
    ftltbox: boolean = false;
    etitle: string = "";
    fnbtn: boolean = false;
    in: any = false;
    see: any = false;
    showsd: boolean = false;

    openOpt() {
        this.fnbtn = !this.fnbtn;
        this.ftltbox = !this.ftltbox;
    }

    desideclrCss: any = {
        R: "ff",
        G: "ff",
        B: "ff"
    };
    desideclrCss02: any = {
        R: "00",
        G: "7f",
        B: "ff"
    };
    //顯示給UI介面
    defaultclr: any = "#" + (this.desideclrCss.R + this.desideclrCss.G + this.desideclrCss.B);
    defaultclr02: any = "#" + (this.desideclrCss02.R + this.desideclrCss02.G + this.desideclrCss02.B);

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
            this.getRuleUp()
        }
        if (whichcolor == 2) {
            this.desideclrCss = {
                R: "ff",
                G: "3f",
                B: "00"
            };

            // this.pure_orange();
            this.defaultclr = "#" + (this.desideclrCss.R + this.desideclrCss.G + this.desideclrCss.B);
            this.getRuleUp()
        }
        if (whichcolor == 3) {
            this.desideclrCss = {
                R: "ff",
                G: "bf",
                B: "00"
            };

            // this.pure_yellow();
            this.defaultclr = "#" + (this.desideclrCss.R + this.desideclrCss.G + this.desideclrCss.B);
            this.getRuleUp()
        }

        if (whichcolor == 4) {
            this.desideclrCss = {
                R: "7f",
                G: "ff",
                B: "00"
            };

            // this.pure_green();
            this.defaultclr = "#" + (this.desideclrCss.R + this.desideclrCss.G + this.desideclrCss.B);
            this.getRuleUp()
        }
        if (whichcolor == 5) {
            this.desideclrCss = {
                R: "00",
                G: "ff",
                B: "ff"
            };

            // this.pure_lightblue();
            this.defaultclr = "#" + (this.desideclrCss.R + this.desideclrCss.G + this.desideclrCss.B);
            this.getRuleUp()
        }
        if (whichcolor == 6) {
            this.desideclrCss = {
                R: "00",
                G: "7f",
                B: "ff"
            };

            // this.pure_blue();
            this.defaultclr = "#" + (this.desideclrCss.R + this.desideclrCss.G + this.desideclrCss.B);
            this.getRuleUp()
        }
        if (whichcolor == 7) {
            this.desideclrCss = {
                R: "64",
                G: "00",
                B: "ff"
            };

            // this.pure_darkblue();
            this.defaultclr = "#" + (this.desideclrCss.R + this.desideclrCss.G + this.desideclrCss.B);
            this.getRuleUp()
        }
        if (whichcolor == 8) {
            this.desideclrCss = {
                R: "af",
                G: "26",
                B: "ff"
            };

            // this.pure_purple();
            this.defaultclr = "#" + (this.desideclrCss.R + this.desideclrCss.G + this.desideclrCss.B);
            this.getRuleUp()
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
            this.getRuleDown()
        }
        if (whichcolor == 2) {
            this.desideclrCss02 = {
                R: "ff",
                G: "3f",
                B: "00"
            };

            // this.pure_orange();
            this.defaultclr02 = "#" + (this.desideclrCss02.R + this.desideclrCss02.G + this.desideclrCss02.B);
            this.getRuleDown()
        }
        if (whichcolor == 3) {
            this.desideclrCss02 = {
                R: "ff",
                G: "bf",
                B: "00"
            };

            // this.pure_yellow();
            this.defaultclr02 = "#" + (this.desideclrCss02.R + this.desideclrCss02.G + this.desideclrCss02.B);
            this.getRuleDown()
        }

        if (whichcolor == 4) {
            this.desideclrCss02 = {
                R: "7f",
                G: "ff",
                B: "00"
            };

            // this.pure_green();
            this.defaultclr02 = "#" + (this.desideclrCss02.R + this.desideclrCss02.G + this.desideclrCss02.B);
            this.getRuleDown()
        }
        if (whichcolor == 5) {
            this.desideclrCss02 = {
                R: "00",
                G: "ff",
                B: "ff"
            };

            // this.pure_lightblue();
            this.defaultclr02 = "#" + (this.desideclrCss02.R + this.desideclrCss02.G + this.desideclrCss02.B);
            this.getRuleDown()
        }
        if (whichcolor == 6) {
            this.desideclrCss02 = {
                R: "00",
                G: "7f",
                B: "ff"
            };

            // this.pure_blue();
            this.defaultclr02 = "#" + (this.desideclrCss02.R + this.desideclrCss02.G + this.desideclrCss02.B);
            this.getRuleDown()
        }
        if (whichcolor == 7) {
            this.desideclrCss02 = {
                R: "64",
                G: "00",
                B: "ff"
            };

            // this.pure_darkblue();
            this.defaultclr02 = "#" + (this.desideclrCss02.R + this.desideclrCss02.G + this.desideclrCss02.B);
            this.getRuleDown()
        }
        if (whichcolor == 8) {
            this.desideclrCss02 = {
                R: "af",
                G: "26",
                B: "ff"
            };

            // this.pure_purple();
            this.defaultclr02 = "#" + (this.desideclrCss02.R + this.desideclrCss02.G + this.desideclrCss02.B);
            this.getRuleDown()
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


    slowFun: any = this.dragonRight_slow;
    medFun: any = this.dragonRight_med;
    fastFun: any = this.dragonRight_high;

    speed: any = '100';
    apFlag: any;

    effectDeside(w) {
        let vm = this;
        if (w !== this.apFlag) {
            this.KBClean();
            this.clear();
            clearInterval(this.getclr01);

            this.leave = 0;
            setTimeout(() => {
                vm.leave = 1;
                vm.doApmode01();
            }, 200);
            if (w == 0) {
                //向左
                this.Effectdirection = w;
                this.apFlag = w;
                this.detectEffectChange();
                this.slowFun = this.dragonLeft_slow;
                this.medFun = this.dragonLeft_med;
                this.fastFun = this.dragonLeft_high;
                switch (true) {
                    case this.sp == 50:
                        this.fastFun();
                        break;
                    case this.sp == 100:
                        this.medFun();
                        break;
                    case this.sp == 150:
                        this.slowFun();
                    default:
                        break;
                }
            }
            if (w == 1) {
                //向右
                this.Effectdirection = w;
                this.apFlag = w;
                this.detectEffectChange();
                this.slowFun = this.dragonRight_slow;
                this.medFun = this.dragonRight_med;
                this.fastFun = this.dragonRight_high;
                switch (true) {
                    case this.sp == 50:
                        this.fastFun();
                        break;
                    case this.sp == 100:
                        this.medFun();
                        break;
                    case this.sp == 150:
                        this.slowFun();
                    default:
                        break;
                }
            }
        }
    }


    // //最先決定速度類型
    speedMethod(s) {
        let vm = this;
        vm.speed = s;
        clearInterval(this.getclr01);

        if (s == 50) {
            vm.fastFun();
        }
        if (s == 100) {
            vm.medFun();
        }
        if (s == 150) {
            vm.slowFun();
        } else {
            return false;
        }
    }





    cssRule: any = "";

    getRuleUp() {
        var rule;
        var ss = document.styleSheets;
        for (var i = 0; i < ss.length; i++) {
            for (var x = 0; x < ss[i]['cssRules'].length; x++) {
                rule = ss[i]['cssRules'][x];
                if (rule.name == "dragon1" && rule.type == rule.KEYFRAMES_RULE) {
                    this.cssRule = rule;
                }
            }
        }
        this.cssRule.appendRule(`25% {background-color:${this.defaultclr}}`);
        this.detectEffectChange();
    }
    getRuleDown() {
        var rule;
        var ss = document.styleSheets;
        for (var i = 0; i < ss.length; i++) {
            for (var x = 0; x < ss[i]['cssRules'].length; x++) {
                rule = ss[i]['cssRules'][x];
                if (rule.name == "dragon2" && rule.type == rule.KEYFRAMES_RULE) {
                    this.cssRule = rule;
                }
            }
        }
        this.cssRule.appendRule(`25% {background-color:${this.defaultclr02}}`);
        this.detectEffectChange();
    }
    getRule1() {
        var rule;
        var ss = document.styleSheets;
        for (var i = 0; i < ss.length; i++) {
            for (var x = 0; x < ss[i]['cssRules'].length; x++) {
                rule = ss[i]['cssRules'][x];
                if (rule.name == "dragon1" && rule.type == rule.KEYFRAMES_RULE) {
                    this.cssRule = rule;
                }
            }
        }
        this.cssRule.appendRule(`25% {background-color:rgb(255, 255, 255)}`);
    }
    getRule2() {
        var rule;
        var ss = document.styleSheets;
        for (var i = 0; i < ss.length; i++) {
            for (var x = 0; x < ss[i]['cssRules'].length; x++) {
                rule = ss[i]['cssRules'][x];
                if (rule.name == "dragon2" && rule.type == rule.KEYFRAMES_RULE) {
                    this.cssRule = rule;
                }
            }
        }
        this.cssRule.appendRule(`25% {background-color:rgb(0, 0, 255)}`);
    }


    //速度
    FastSpeed: any = 50;
    MedSpeed: any = 100;
    SlowSpeed: any = 150;

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
                        }
                        else if (this.sp == this.FastSpeed) {
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

                    if (doc[0].Light.Mode[position] == "Up_Left_Outside") {   //方向上左外
                        this.presstime = 1
                        if (this.presstime == 1) { //左
                            this.effectDeside(0);
                            // //console.log("向左")
                        }
                    }


                    if (doc[0].Light.Mode[position] == "Down_Right_Inner") {   //方向下右內
                        this.presstime = 1;
                        // //console.log('pressdtime:' + this.presstime);
                        if (this.presstime == 1) {//右
                            this.effectDeside(1);
                            // //console.log("向右")
                        }

                    }
                    if (doc[0].Light.Mode[position] == "Open_CloseEffect") {
                        // //console.log('stop');
                        this.openclose++
                        if (this.openclose == 1) {
                            this.none();
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

        this.nowobj.Light.LightSetting.LSbrightness[5] = this.op;
        this.nowobj.Light.LightSetting.LSspeed[5] = this.sp;
        this.nowobj.Light.LightSetting.LSdirection[5] = this.Effectdirection;
        this.nowobj.Light.LightSetting.changeTime[5] = this.timeValue;

        //console.log(this.timeValue);
        this.nowobj.Light.LightSetting.changeMode[5] = this.ttitle;



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
        env.log('light-effect', 'dragon', 'end');
        this.subscription.unsubscribe();
        this.goOut();
    }
    @Output() sendTimeCloseFlag = new EventEmitter();
    @Input() check01;
    @Input() timeEffect;
    @Input() receiveTemp;
    @Output() DragonTemp = new EventEmitter();
    @Output() LightEffect = new EventEmitter();
    @Output() applyStatus = new EventEmitter();
    applyFlag: any = 1;
    lightEffect: any = 5;
    dragon: any;
    dragonObj() {
        this.dragon = {
            'LightEffect': 5,
            'LSbrightness': this.op,
            'LSspeed': this.sp,
            'LSdirection': this.Effectdirection,
            'changeTime': this.timeValue,
            'ttitle': '龙腾',
            'changeStatus': this.check01,
            'changeEffect': this.timeEffect,
            'ColorMode': this.default,
            'Color': {
                'defaultclr': this.defaultclr,
                'defaultclr02': this.defaultclr02,
            },
        }
        // this.DragonTemp.emit(this.dragon);
        // this.LightEffect.emit(this.dragon.LightEffect)
    }
    readTemp() {
        this.effectfinish.emit();
        this.cuteValue = this.receiveTemp[0];
        this.speedValue = this.receiveTemp[1];
        this.Effectdirection = this.receiveTemp[2];
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
        } else {
            this.sp = 100;
        }

        if (this.Effectdirection !== undefined && this.Effectdirection !== null && this.Effectdirection !== "") {
            this.effectDeside(this.Effectdirection);
        } else {
            this.Effectdirection = 1; //預設
            this.effectDeside(this.Effectdirection);
        }

        if (this.NewtimeValue !== undefined && this.NewtimeValue !== null && this.NewtimeValue !== "") {
            this.timeValue = this.NewtimeValue;
        }

        if (this.ttitle !== undefined && this.ttitle !== null && this.ttitle !== "") {
            this.sendTtile();
        } else {
            this.ttitle = '龙腾';
        }

        if (this.default == true) {
            this.setDefault(1);
        } else {
            this.setDefault(2);
        }
    }

    sendApply() {
        if (this.timeEffect !== 5) {
            this.dragonObj();
            // this.timeEvent();
            setTimeout(() => {
                this.sendTimeCloseFlag.emit(this.check01);
                this.DragonTemp.emit(this.dragon);
                this.LightEffect.emit(this.dragon.LightEffect)
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
        if (this.op != this.receiveTemp[0] || this.sp != this.receiveTemp[1] || this.Effectdirection != this.receiveTemp[2] || this.timeValue != this.receiveTemp[3] || this.lightEffect != this.receiveTemp[5] || this.check01 != this.receiveTemp[6] || this.timeEffect != this.receiveTemp[7] || this.default != this.receiveTemp[8] || this.defaultclr != this.receiveTemp[9].defaultclr || this.defaultclr02 != this.receiveTemp[9].defaultclr02) {
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