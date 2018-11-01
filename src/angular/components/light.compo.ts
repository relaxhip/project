declare var System;

import { protocolService } from '../services/service/protocol.service';
import { Component, OnInit, Output, EventEmitter } from '@angular/core';
import { ElectronEventService, dbService, EmitService } from '../services/libs/electron/index';
import { GetDeviceService } from '../services/device/GetDevice.service';
import { Subscription } from "rxjs/Subscription";



let evtVar = System._nodeRequire('./backend/others/eventVariable');
let funcVar = System._nodeRequire('./backend/others/FunctionVariable');
let env = System._nodeRequire('./backend/others/env');





const { ipcRenderer } = System._nodeRequire('electron');
declare var $: any;

@Component({
    selector: 'lt-app',
    templateUrl: './components/light.compo.html',
    //template: '<h1>我的第一个 Angular 应用</h1>',
    styleUrls: ['./css/first.css', './css/kbd.css'],
    providers: [protocolService, dbService]
})



export class LightComponent implements OnInit {


    keypositionX: any;
    keypositionY: any;
    dofunctionName: any;
    time: any = 0;
    set128: any = 0;
    keyfuncposition: any;
    fromicp: any;
    speedhere: any = 30;
    presstime: number = 0;//計算FUNCTION KEY按鍵次數
    pausetime: number = 0;
    openclose: number = 0;
    subscription: Subscription;


    pageOn: boolean = false;
    VID: string = "";
    PID: string = "";
    Status: string = "";
    DeviceName: string = "";
    DeviceObj: any = []
    Device: any = {};
    TempData: any;



    constructor(private protocol: protocolService, private db: dbService, private getDeviceService: GetDeviceService, private emitService: EmitService) {
        console.log('light loading complete');
        this.subscription = this.emitService.EmitObservable.subscribe(src => {
            this.fromicp = src;
            console.log(this.fromicp.data);
            console.log('test:' + this.fromicp.data);

            if (this.fromicp.data !== undefined) {

                if (this.fromicp.data[1] == 7 && this.fromicp.data[2] == 7 && this.fromicp.data[5] == 1) {//normalkey 按下
                    console.log('yes');

                    this.keypositionX = this.fromicp.data[3];
                    this.keypositionY = this.fromicp.data[4];
                    this.keyfuncposition = this.fromicp.data[3] * 8 + this.fromicp.data[4] + this.set128;

                    console.log('normalKEYPOSITION:' + this.keyfuncposition);
                    // this.keyfuncposition = this.keyfuncposition + 128;

                    // this.keyfuncposition = this.keyfuncposition + 128;
                    // if(this.time==0){
                    this.doItfunction(this.keyfuncposition);
                    // }
                } else if (this.fromicp.data[1] == 225 && this.fromicp.data[2] == 4 && this.fromicp.data[3] == 1) {//Fn按下
                    console.log('KEYPOSITION:' + this.keyfuncposition);
                    this.set128 = 128;

                    console.log('fnKEYPOSITION:' + this.keyfuncposition)
                    this.doItfunction(this.keyfuncposition);



                } else if (this.fromicp.data[1] == 225 && this.fromicp.data[2] == 5 && this.fromicp.data[3] == 2) {// Fn放開

                    this.set128 = 0;
                } else if (this.fromicp.data[1] == 7 && this.fromicp.data[2] == 7 && this.fromicp.data[5] == 0) {//normalkey 放開
                    this.keyfuncposition = 0; //reset;
                    // this.time=0;
                }
            }
        })
        // this.subscription = this.emitService.EmitObservable.subscribe(src=> {if(src==="insert"){this.pageOn=true;}else{this.pageOn=false;}})


    }

    ngOnInit() {
        //    let abc = this.getDeviceService.getDevice();
        //    console.log('裝置狀態:'+JSON.stringify(abc)); 
        console.log('裝置狀態:' + this.getDeviceService.dataObj.status);

        // if(this.getDeviceService.dataObj.status==1){
        //     this.pageOn=true;
        // }
    }

    ngOnDestroy() {
        this.subscription.unsubscribe();
    }

    //


    // firstarr: any = ["esc", "f1", "f2", "f3", "f4", "f5", "f6", "f7", "f8", "f9", "f10", "f11", "f12", "print", "scroll", "pause", "perid", "n1", "n2", "n3", "n4", "n5", "n6", "n7", "n8", "n9", "n0", "minus", "plus", "bsp", "insert", "home", "pup", "numlock", "numdrawn", "numtimes", "numminus", "tab", "q", "w", "e", "r", "t", "y", "u", "i", "o", "p", "lqu", "rqu", "delete", "drawn", "end", "pdown", "num7", "num8", "num9", "numplus", "caps", "a", "s", "d", "f", "g", "h", "j", "k", "l", "sem", "quo", "enter", "num4", "num5", "num6", "lshift", "z", "x", "c", "v", "b", "n", "m", "comma", "dot", "qmark", "rshift", "up", "num1", "num2", "num3", "numenter", "lctrl", "win", "lalt", "space", "ralt", "fn", "book", "rctrl", "left", "down", "right", "num0", "numdot",]
    // firstarr2: any = ["esc_2", "f1_2", "f2_2", "f3_2", "f4_2", "f5_2", "f6_2", "f7_2", "f8_2", "f9_2", "f10_2", "f11_2", "f12_2", "print_2", "scroll_2", "pause_2", "perid_2", "n1_2", "n2_2", "n3_2", "n4_2", "n5_2", "n6_2", "n7_2", "n8_2", "n9_2", "n0_2", "minus_2", "plus_2", "bsp_2", "insert_2", "home_2", "pup_2", "numlock_2", "numdrawn_2", "numtimes_2", "numminus_2", "tab_2", "q_2", "w_2", "e_2", "r_2", "t_2", "y_2", "u_2", "i_2", "o_2", "p_2", "lqu_2", "rqu_2", "delete_2", "drawn_2", "end_2", "pdown_2", "num7_2", "num8_2", "num9_2", "numplus_2", "caps_2", "a_2", "s_2", "d_2", "f_2", "g_2", "h_2", "j_2", "k_2", "l_2", "sem_2", "quo_2", "enter_2", "num4_2", "num5_2", "num6_2", "lshift_2", "z_2", "x_2", "c_2", "v_2", "b_2", "n_2", "m_2", "comma_2", "dot_2", "qmark_2", "rshift_2", "up_2", "num1_2", "num2_2", "num3_2", "numenter_2", "lctrl_2", "win_2", "lalt_2", "space_2", "ralt_2", "fn_2", "book_2", "rctrl_2", "left_2", "down_2", "right_2", "num0_2", "numdot_2",]

    cancelftng: boolean = false;
    frtp: boolean = true;
    ftltbox: boolean = false;
    etitle: string = "流光";
    fnbtn: boolean = false;
    in: any = false;
    see: any = false;

    showsd: boolean = false;
    css01: any = "";
    css02: any = "";
    css03: any = "";
    css04: any = "";

    
    // wantStop(){ 
    //     console.log('wantStop');
    //     for(var i = 0; i < this.firstarr.length; i++){ 

    //         document.getElementById(this.firstarr[i]).className = " "; 
    //         document.getElementById(this.firstarr2[i]).className = " "; 

    // }

    // }

    cancelft() {
        this.cancelftng = false;
        this.fnbtn = !this.fnbtn;
        this.ftltbox = !this.ftltbox;
    }

    openOpt() {
        this.cancelftng = true;
        this.fnbtn = !this.fnbtn;
        this.ftltbox = !this.ftltbox;
    }




    pick01() {
        this.css01 = "white";
        this.css02 = "";
        this.css03 = "";
        this.css04 = "";
    };
    pick02() {
        this.css01 = "";
        this.css02 = "white";
        this.css03 = "";
        this.css04 = "";
    };
    pick03() {
        this.css01 = "";
        this.css02 = "";
        this.css03 = "white";
        this.css04 = "";
    };

    pick04() {
        this.css01 = "";
        this.css02 = "";
        this.css03 = "";
        this.css04 = "white";
    };


    cleanApmode() {
        // console.log("apmode")
        var apMode = new Buffer(new Array(480));
        var vm = this
        for (let i = 0; i < 480; i++) {
            apMode[i] = 0;

        }
    }

    // //點開效果視窗關閉
    CloseFtltbox() {
        this.fnbtn = false;
        this.ftltbox = false;
    }
    seerainbow: any = true;
    seebreath: any = false;
    seelighten: any = false;
    seecrash: any = false;
    seestarlight: any = false;
    seedragon: any = false;
    seemeeting: any = false;
    seeboom: any = false;
    seecross: any = false;
    seefloat: any = false;
    seewaves: any = false;
    seeround: any = false;
    seegameeffect: any = false;
    seepure: any = false;
    seelightrain: any = false;
    seeblasoul: any = false
    changeIn() {
        this.in = !this.in;
    }


    frtpClose(w) {


        this.frtp = false;
        this.seerainbow = false;
        this.seebreath = false;
        this.seelighten = false;
        this.seecrash = false;
        this.seestarlight = false;
        this.seedragon = false;
        this.seemeeting = false;
        this.seeboom = false;
        this.seecross = false;
        this.seefloat = false;
        this.seewaves = false;
        this.seeround = false;
        this.seegameeffect = false;
        this.seepure = false;
        this.seelightrain = false;
        this.seeblasoul = false;

        document.getElementById('ftltbox').style.display = "none";

        document.getElementById('rbway').style.display = "none";
        document.getElementById('crashway').style.display = "none";
        document.getElementById('colorbar').style.display = "none";
        document.getElementById('blasoul').style.display = "none";
        document.getElementById('defaultset').style.display = "none";

        if (w == 0) {
            this.etitle = "流光";
            this.seerainbow = true;
        }
        if (w == 1) {
            this.etitle = "呼吸";
            this.seebreath = true;


        }
        if (w == 2) {
            this.etitle = "光谱";
            this.seelighten = true;
        }
        if (w == 3) {
            this.etitle = "撞击";
            this.seecrash = true;

        }
        if (w == 4) {
            this.etitle = "繁星";
            this.seestarlight = true;
        }
        if (w == 5) {
            this.etitle = "龙腾";
            this.seedragon = true;
        }
        if (w == 6) {
            this.etitle = "邂逅";
            this.seemeeting = true;
        }
        if (w == 7) {
            this.etitle = "光雨";
            this.seelightrain = true;
        }
        if (w == 8) {
            this.etitle = "脉冲";
            this.seeboom = true;
        }
        if (w == 9) {
            this.etitle = "纵横";
            this.seecross = true;
        }
        if (w == 10) {
            this.etitle = "飘痕";
            this.seefloat = true;
        }
        if (w == 11) {
            this.etitle = "涟漪";
            this.seewaves = true;
        }
        if (w == 12) {
            this.etitle = "绽放";
            this.seeround = true;
        }
        if (w == 13) {
            this.etitle = "游戏模式";
            this.seegameeffect = true;
        }
        if (w == 14) {
            this.etitle = "纯色";
            this.seepure = true;
        }
        if (w == 15) {
            this.etitle = "Blasoul";
            this.seeblasoul = true;
        }
    }

    //UI亮度調整
    op: any = "";
    onInput(value) {
        this.op = value;
        console.log(value);
    }
    doItfunction(position) {
        console.log('doit:' + position);
        // this.time++;計次

        this.db.getAllProfile().then((doc: any) => {
            // console.log('getallprogfile'+JSON.stringify(doc));
            // console.log('getallprogfile'+doc);
            // console.log("matrix紀錄的位置:"+position);

            // console.log("func名稱:"+doc[1].Key.matrixkeyArr12);
            for (let i = 0; i < doc.length; i++) { //找profile
                if (doc[i].ProfileName == "profile 1") {
                    let arrorder = i;
                    console.log(doc[arrorder].Light.Speed[position]);
                    // console.log(doc[arrorder]);
                    // console.log(doc[arrorder].Key);
                    // console.log("func名稱:"+doc[arrorder].Key.keyFunctionArr[10]);
                    // console.log("func名稱:"+doc[arrorder].Key.keyFunctionArr[position]);


                    // console.log("func名稱:"+ eval(doc[arrorder].Key.keyFunctionArr[position]));

                    // eval(doc[arrorder].Key.keyFunctionArr[position]());
                }
            }

            // console.log("func名稱:"+doc[this.arrorder].Key.keyFunctionArr);
        })


    }

}