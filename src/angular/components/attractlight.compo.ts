declare var System;
import { Component, OnInit, Input, EventEmitter, Output } from '@angular/core';
import { protocolService } from '../services/service/protocol.service';
import { icpEventService } from '../services/service/icpEventService.service';
// import { AttService } from './attservice.service';
import { ElectronEventService, dbService, EmitService } from '../services/libs/electron/index';
import { GetDeviceService } from '../services/device/GetDevice.service';
import { Subscription } from "rxjs/Subscription";
import { INTERNAL_BROWSER_PLATFORM_PROVIDERS } from '@angular/platform-browser/src/browser';
import { ThrowStmt } from '@angular/compiler/src/output/output_ast';


let evtVar = System._nodeRequire('./backend/others/eventVariable');
let funcVar = System._nodeRequire('./backend/others/FunctionVariable');

const { ipcRenderer } = System._nodeRequire('electron');
declare var $: any;

@Component({
    selector: 'att-app',
    templateUrl: './components/attractlight.compo.html',
    //template: '<h1>我的第一个 Angular 应用</h1>',
    styleUrls: ['./css/first.css', './css/kbd.css', './css/attractlight.css'],
    providers: [protocolService, dbService, icpEventService]

})

export class AttComponent implements OnInit {
    fromicp: any;
    subscription: Subscription;
    atthere: Subscription;

    constructor(private protocol: protocolService, private db: dbService, private getDeviceService: GetDeviceService, private emitService: EmitService, private icpEventService: icpEventService) {
        this.subscription = this.emitService.EmitObservable.subscribe(src => {
            this.fromicp = src
            this.keyStatus = this.fromicp.keyStatus
            // console.log(this.fromicp);

            //AttService
            // console.log(this.AttService.processicpTitle);
            // console.log(this.AttService.processicpContent);

            if (src == 'insert') {
                this.detectButton();
            }
            //判斷是否開啟魂立燈帶設定
            if (this.fromicp.data !== undefined) {
                if (this.fromicp.data[0] == 4 && this.fromicp.data[1] == 225 && this.fromicp.data[2] == 15 && this.fromicp.data[3] == 1) {
                    ////console.log('attLeft');
                    this.at = false;
                    this.attbtn = false;
                    this.bk700hole = false
                    this.blockcss = "disable";
                    this.modeFlag = 0;
                    this.clearBar();
                }
                else if (this.fromicp.data[0] == 4 && this.fromicp.data[1] == 225 && this.fromicp.data[2] == 16 && this.fromicp.data[3] == 2) {
                    ////console.log('attRight');
                    this.attbtn = true;
                    this.bk700hole = true
                    this.percent = 0;
                    this.pressTime = 0;
                    this.blockcss = "";
                    this.modeFlag = 1;
                }
            }

            if (this.mode == 0) {
                if (this.modeFlag == 1) {
                    this.attBar();
                    this.speedMode();
                }
            }
            else if (this.mode == 1) {
                if (this.modeFlag == 1) {
                    this.attBar();
                    this.timesMode();
                }
            }
            var vm = this
            if (this.data == 0) {
                clearTimeout(this.timeStop);
                this.data++;
                if (this.data == 1) {
                    this.timeStop = setTimeout(() => {
                        vm.pressTime = 0;
                        vm.percent = 0;
                        vm.clearBar();
                        vm.sendPercentOut();
                    }, 5000);
                    this.data = 0
                }
            }
        });


    }
    timeStop: any;
    data: any = 0;
    keyStatus: any;
    profiledetail: any;
    macrosavecick: number = 0;
    attbtn: boolean = false;
    attBL: boolean = false;
    bk700hole: boolean = false;
    blockcss: any = "disable"
    modeFlag: any = 0;
    @Output() sendPercent = new EventEmitter();
    @Input() lightBS
    sendPercentOut() {
        this.sendPercent.emit(this.percent)
    }

    ngOnInit() {
        if (this.lightBS == 0) {
            this.blockcss = "";
            this.attbtn = true;
            this.percent = 0;
            this.pressTime = 0;
            this.bk700hole = true;
            this.modeFlag = 1;
            this.attBar();
        }
        else if (this.lightBS == 1) {
            this.attbtn = false;
            this.blockcss = "disable";
            this.bk700hole = false;
            this.modeFlag = 0;
            //console.log('按鈕位置在左邊');
        }
    }

    detectButton() {
        let obj3 = {
            Type: funcVar.FuncType.Device,
            Func: funcVar.FuncName.GetProfieAndFirmwareVer,
            Param: ""
        }
        setTimeout(() => {
            this.protocol.RunSetFunction(obj3).then((data) => {
                setTimeout(() => {
                    if (data[5] == 1) {
                        this.blockcss = "";
                        this.attbtn = true;
                        this.percent = 0;
                        this.pressTime = 0;
                        this.bk700hole = true;
                        this.modeFlag = 1;
                        this.attBar();
                        //console.log('按鈕位置在右邊');
                    }
                    else if (data[5] == 0) {
                        this.attbtn = false;
                        this.blockcss = "disable";
                        this.bk700hole = false;
                        this.modeFlag = 0;
                        //console.log('按鈕位置在左邊');
                    }
                }, 20);
            })
        }, 20);
    }

    attKb: any = ["esc_attlight", "f1_attlight", "f2_attlight", "f3_attlight", "f4_attlight", "f5_attlight", "f6_attlight", "f7_attlight", "f8_attlight", "f9_attlight", "f10_attlight", "f11_attlight", "f12_attlight", "print_attlight", "scroll_attlight", "pause_attlight", "perid_attlight", "n1_attlight", "n2_attlight", "n3_attlight", "n4_attlight", "n5_attlight", "n6_attlight", "n7_attlight", "n8_attlight", "n9_attlight", "n0_attlight", "minus_attlight", "plus_attlight", "bsp_attlight", "insert_attlight", "home_attlight", "pup_attlight", "numlock_attlight", "numdrawn_attlight", "numtimes_attlight", "numminus_attlight", "tab_attlight", "q_attlight", "w_attlight", "e_attlight", "r_attlight", "t_attlight", "y_attlight", "u_attlight", "i_attlight", "o_attlight", "p_attlight", "lqu_attlight", "rqu_attlight", "delete_attlight", "drawn_attlight", "end_attlight", "pdown_attlight", "num7_attlight", "num8_attlight", "num9_attlight", "numplus_attlight", "caps_attlight", "a_attlight", "s_attlight", "d_attlight", "f_attlight", "g_attlight", "h_attlight", "j_attlight", "k_attlight", "l_attlight", "sem_attlight", "quo_attlight", "enter_attlight", "num4_attlight", "num5_attlight", "num6_attlight", "lshift_attlight", "z_attlight", "x_attlight", "c_attlight", "v_attlight", "b_attlight", "n_attlight", "m_attlight", "comma_attlight", "dot_attlight", "qmark_attlight", "rshift_attlight", "up_attlight", "num1_attlight", "num2_attlight", "num3_attlight", "numenter_attlight", "lctrl_attlight", "win_attlight", "lalt_attlight", "space_attlight", "ralt_attlight", "fn_attlight", "book_attlight", "rctrl_attlight", "left_attlight", "down_attlight", "right_attlight", "num0_attlight", "numdot_attlight"];

    attArray: any = ["Upside1_attlight", "Upside2_attlight", "Upside3_attlight", "Upside4_attlight", "Upside5_attlight", "Upside6_attlight", "Upside7_attlight", "Upside8_attlight", "Upside9_attlight", "Upside10_attlight", "logo1_attlight", "Upside11_attlight", "Upside12_attlight", "Upside13_attlight", "Upside14_attlight", "Upside15_attlight", "Upside16_attlight", "Upside17_attlight", "Upside18_attlight", "Upside19_attlight", "Upside20_attlight", "logo1_attlight", "logo2_attlight"];

    getclr1: any;
    getclr2: any;



    Upside1: any = ""
    Upside2: any = ""
    Upside3: any = ""
    Upside4: any = ""
    Upside5: any = ""
    Upside6: any = ""
    Upside7: any = ""
    Upside8: any = ""
    Upside9: any = ""
    Upside10: any = ""
    Upside11: any = ""
    Upside12: any = ""
    Upside13: any = ""
    Upside14: any = ""
    Upside15: any = ""
    Upside16: any = ""
    Upside17: any = ""
    Upside18: any = ""
    Upside19: any = ""
    Upside20: any = ""
    LtoR1: any = "";
    LtoR2: any = "";
    LtoR3: any = "";
    LtoR4: any = "";
    LtoR5: any = "";
    LtoR6: any = "";
    LtoR7: any = "";
    LtoR8: any = "";
    LtoR9: any = "";
    LtoR10: any = "";
    LtoR11: any = "";
    LtoR12: any = "";
    LtoR13: any = "";
    LtoR14: any = "";
    LtoR15: any = "";
    LtoR16: any = "";
    LtoR17: any = "";
    LtoR18: any = "";
    LtoR19: any = "";
    LtoR20: any = "";
    LtoR21: any = "";

    clear() {
        this.LtoR1 = "";
        this.LtoR2 = "";
        this.LtoR3 = "";
        this.LtoR4 = "";
        this.LtoR5 = "";
        this.LtoR6 = "";
        this.LtoR7 = "";
        this.LtoR8 = "";
        this.LtoR9 = "";
        this.LtoR10 = "";
        this.LtoR11 = "";
        this.LtoR12 = "";
        this.LtoR13 = "";
        this.LtoR14 = "";
        this.LtoR15 = "";
        this.LtoR16 = "";
        this.LtoR17 = "";
        this.LtoR18 = "";
        this.LtoR19 = "";
        this.LtoR20 = "";
        this.LtoR21 = "";
    }

    // 選擇框區域
    at: boolean = false;
    showat() {
        this.at = !this.at;
    }

    ltitle: string = "竟速模式";
    speed: boolean = true;
    times: boolean = false;
    cancellight: boolean = false;
    ltbtn: boolean = false;
    lightbox: boolean = false;

    cancellt() {
        this.cancellight = false
        this.ltbtn = !this.ltbtn;
        this.lightbox = !this.lightbox;
    }
    ltopen() {
        this.cancellight = true
        this.ltbtn = !this.ltbtn;
        this.lightbox = !this.lightbox;
    }
    ltclose() {
        this.ltbtn = false;
        this.lightbox = false;
    }
    //

    //模式判斷區域
    speedValue: any = 100;
    timesValue: any = 1000;
    pressTime: any = 0;
    percent: any = 0;
    mode: any = 0;
    timer: any = 60000;
    stopTimer: any;
    speedwarn: boolean = false;
    timeswarn: boolean = false;

    speedfocus() {
        document.getElementById('speedText').focus();
        (<HTMLInputElement>document.getElementById('speedText')).select();
    }
    timesfocus() {
        document.getElementById('timesText').focus();
        (<HTMLInputElement>document.getElementById('speedText')).select();
    }

    speedMd(value) {
        var vm = this
        this.speedValue = value;
        this.pressTime = 0;
        window.addEventListener('keydown', function (e) {
            if (e.keyCode == 13) {
                if (vm.speedValue < 50 || vm.speedValue > 1000 || isNaN(vm.speedValue)) {
                    vm.speedwarn = true;
                    vm.speedValue = 100;
                    vm.timer = 60000;
                    vm.pressTime = 0;
                    vm.percent = 0;
                    setTimeout(() => {
                        vm.speedwarn = false;
                    }, 3000);
                } else {
                    vm.timer = 60000
                }
                document.getElementById('speedText').blur();
            }
        })
    }

    timesMd(value) {
        this.timesValue = value;
        this.pressTime = 0;
        var vm = this;
        window.addEventListener('keydown', function (e) {
            if (e.keyCode == 13) {
                if (vm.timesValue < 100 || vm.timesValue > 99999 || isNaN(vm.timesValue)) {
                    vm.timeswarn = true;
                    vm.timesValue = 1000;
                    vm.percent = 0;
                    vm.pressTime = 0;
                    setTimeout(() => {
                        vm.timeswarn = false;
                    }, 3000);
                }
                document.getElementById('timesText').blur();
            }
        });
    }

    speedMode() {
        // //console.log("speedModeReady")
        // this.attBar();
        if (this.keyStatus == 0) {
            this.pressTime++;
            this.percent = Math.floor((this.pressTime / this.speedValue) * 100);
            // if(this.checkPress == this.pressTime)
            this.sendPercentOut();
            if (this.pressTime == 1) {
                this.stopTimer = setTimeout(() => {
                    this.pressTime = 0;
                    this.percent = 0;
                    this.clearBar();
                }, this.timer);
            }
            if (this.pressTime == this.speedValue) {
                this.attLight();
                this.clearBar();
                this.pressTime = 0;
                this.percent = 0
                clearTimeout(this.stopTimer);
            }
            // if (this.pressTime == 0) {
            // }
            if (this.pressTime >= this.speedValue - 10) {
                this.clear();
            }
        }
    }

    timesMode() {
        // //console.log("timesModeReady");
        // this.attBar();
        clearTimeout(this.stopTimer);
        if (this.keyStatus == 0) {
            this.pressTime++;
            this.percent = Math.floor((this.pressTime / this.timesValue) * 100);
            this.sendPercentOut();
            if (this.pressTime >= this.timesValue) {
                this.pressTime = 0;
                this.percent = 0;
                this.attLight();
                this.clearBar();
            }
            if (this.pressTime >= this.timesValue - 10) {
                this.clear();
            }
        }
    }

    attLight() {
        this.LtoR11 = "att1";
        this.LtoR10 = "att2";
        this.LtoR9 = "att3";
        this.LtoR8 = "att4";
        this.LtoR7 = "att5";
        this.LtoR6 = "att6";
        this.LtoR5 = "att7";
        this.LtoR4 = "att8";
        this.LtoR3 = "att9";
        this.LtoR2 = "att10";
        this.LtoR1 = "att11";
        this.LtoR12 = "att2";
        this.LtoR13 = "att3";
        this.LtoR14 = "att4";
        this.LtoR15 = "att5";
        this.LtoR16 = "att6";
        this.LtoR17 = "att7";
        this.LtoR18 = "att8";
        this.LtoR19 = "att9";
        this.LtoR20 = "att10";
        this.LtoR21 = "att11";
    }

    clearBar() {
        setTimeout(() => {
            this.Upside1 = "";
            this.Upside20 = "";
        }, 20);
        setTimeout(() => {
            this.Upside2 = "";
            this.Upside19 = "";
        }, 40);
        setTimeout(() => {
            this.Upside3 = "";
            this.Upside18 = "";
        }, 60);
        setTimeout(() => {
            this.Upside4 = "";
            this.Upside17 = "";
        }, 80);
        setTimeout(() => {
            this.Upside5 = "";
            this.Upside16 = "";
        }, 100);
        setTimeout(() => {
            this.Upside6 = "";
            this.Upside15 = "";
        }, 120);
        setTimeout(() => {
            this.Upside7 = "";
            this.Upside14 = "";
        }, 140);
        setTimeout(() => {
            this.Upside8 = "";
            this.Upside13 = "";
        }, 160);
        setTimeout(() => {
            this.Upside9 = "";
            this.Upside12 = "";
        }, 180);
        setTimeout(() => {
            this.Upside10 = "";
            this.Upside11 = "";
        }, 200);
    }
    attBar() {
        if (this.percent == 0 || this.percent == 100 || this.percent == undefined || isNaN(this.percent) || this.pressTime == 0) {
            this.clearBar();
        }
        else if (this.percent >= 98) {
            this.Upside10 = "bar1";
            this.Upside11 = "bar1";
            this.Upside9 = "bar2";
            this.Upside12 = "bar2";
            this.Upside8 = "bar3";
            this.Upside13 = "bar3";
            this.Upside7 = "bar4";
            this.Upside14 = "bar4";
            this.Upside6 = "bar5";
            this.Upside15 = "bar5";
            this.Upside5 = "bar6";
            this.Upside16 = "bar6";
            this.Upside4 = "bar7";
            this.Upside17 = "bar7";
            this.Upside3 = "bar8";
            this.Upside18 = "bar8";
            this.Upside2 = "bar9";
            this.Upside19 = "bar9";
            this.Upside1 = "bar10";
            this.Upside20 = "bar10";
        }
        else if (this.percent >= 79) {
            this.Upside10 = "bar1";
            this.Upside11 = "bar1";
            this.Upside9 = "bar2";
            this.Upside12 = "bar2";
            this.Upside8 = "bar3";
            this.Upside13 = "bar3";
            this.Upside7 = "bar4";
            this.Upside14 = "bar4";
            this.Upside6 = "bar5";
            this.Upside15 = "bar5";
            this.Upside5 = "bar6";
            this.Upside16 = "bar6";
            this.Upside4 = "bar7";
            this.Upside17 = "bar7";
            this.Upside3 = "bar8";
            this.Upside18 = "bar8";
            this.Upside2 = "bar9";
            this.Upside19 = "bar9";
        }
        else if (this.percent >= 60) {
            this.Upside10 = "bar1";
            this.Upside11 = "bar1";
            this.Upside9 = "bar2";
            this.Upside12 = "bar2";
            this.Upside8 = "bar3";
            this.Upside13 = "bar3";
            this.Upside7 = "bar4";
            this.Upside14 = "bar4";
            this.Upside6 = "bar5";
            this.Upside15 = "bar5";
            this.Upside5 = "bar6";
            this.Upside16 = "bar6";
            this.Upside4 = "bar7";
            this.Upside17 = "bar7";
            this.Upside3 = "bar8";
            this.Upside18 = "bar8";
        }
        else if (this.percent >= 45) {
            this.Upside10 = "bar1";
            this.Upside11 = "bar1";
            this.Upside9 = "bar2";
            this.Upside12 = "bar2";
            this.Upside8 = "bar3";
            this.Upside13 = "bar3";
            this.Upside7 = "bar4";
            this.Upside14 = "bar4";
            this.Upside6 = "bar5";
            this.Upside15 = "bar5";
            this.Upside5 = "bar6";
            this.Upside16 = "bar6";
            this.Upside4 = "bar7";
            this.Upside17 = "bar7";
        }
        else if (this.percent >= 30) {
            this.Upside10 = "bar1";
            this.Upside11 = "bar1";
            this.Upside9 = "bar2";
            this.Upside12 = "bar2";
            this.Upside8 = "bar3";
            this.Upside13 = "bar3";
            this.Upside7 = "bar4";
            this.Upside14 = "bar4";
            this.Upside6 = "bar5";
            this.Upside15 = "bar5";
            this.Upside5 = "bar6";
            this.Upside16 = "bar6";
        }
        else if (this.percent >= 20) {
            this.Upside10 = "bar1";
            this.Upside11 = "bar1";
            this.Upside9 = "bar2";
            this.Upside12 = "bar2";
            this.Upside8 = "bar3";
            this.Upside13 = "bar3";
            this.Upside7 = "bar4";
            this.Upside14 = "bar4";
            this.Upside6 = "bar5";
            this.Upside15 = "bar5";
        }
        else if (this.percent >= 13) {
            this.Upside10 = "bar1";
            this.Upside11 = "bar1";
            this.Upside9 = "bar2";
            this.Upside12 = "bar2";
            this.Upside8 = "bar3";
            this.Upside13 = "bar3";
            this.Upside7 = "bar4";
            this.Upside14 = "bar4";
        }
        else if (this.percent >= 7) {
            this.Upside10 = "bar1";
            this.Upside11 = "bar1";
            this.Upside9 = "bar2";
            this.Upside12 = "bar2";
            this.Upside8 = "bar3";
            this.Upside13 = "bar3";
        }
        else if (this.percent >= 3) {
            this.Upside10 = "bar1";
            this.Upside11 = "bar1";
            this.Upside9 = "bar2";
            this.Upside12 = "bar2";
        }
        else if (this.percent >= 1) {
            this.Upside10 = "bar1";
            this.Upside11 = "bar1";
        }
    }

    lightMode(w) {
        this.speed = false;
        this.times = false;
        document.getElementById("lightbox").style.display = "none";
        clearTimeout(this.stopTimer);
        this.pressTime = 0;
        this.clearBar();
        if (w == 0) {
            this.mode = 0
            this.speed = true
            this.ltitle = "竟速模式";
        }
        if (w == 1) {
            this.mode = 1;
            this.times = true
            this.ltitle = "竟数模式";
        }
    }
}