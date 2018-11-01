declare var System;
import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { protocolService } from '../services/service/protocol.service';

const { ipcRenderer } = System._nodeRequire('electron');
declare var $: any;

import { ElectronEventService, dbService, EmitService } from '../services/libs/electron/index';
import { GetDeviceService } from '../services/device/GetDevice.service';
import { Subscription } from "rxjs/Subscription";
import { icpEventService } from '../services/service/icpEventService.service';
import { METHODS } from 'http';



let evtVar = System._nodeRequire('./backend/others/eventVariable');
let funcVar = System._nodeRequire('./backend/others/FunctionVariable');
let env = System._nodeRequire('./backend/others/env');
@Component({
	selector: 'crash-effect',
	templateUrl: './components/effect/crash.compo.html',
	//template: '<h1>我的第一个 Angular 应用</h1>',
	styleUrls: ['./css/first.css', './css/kbd.css', './css/crash.css', './css/attractlight.css'],
	providers: [protocolService, dbService, icpEventService],
	inputs: ['ProfileDetail', 'ttitle', 'getGameChange', 'updatenow', 'changeProfile']
})


export class crashComponent implements OnInit {
	constructor(private protocol: protocolService, private db: dbService, private getDeviceService: GetDeviceService, private emitService: EmitService, private icpEventService: icpEventService) {
		//console.log('crash loading complete');
		this.subscription = this.emitService.EmitObservable.subscribe(src => {
			if (src == 'insert') {
				//this.setAPmode();//連續下值預備動作
				// this.detectButton();
				this.plugIn();
			}

			if (src == 'remove') {
				this.goOut();
				// //console.log('out');
			}
			this.fromicp = src;
			// //console.log(this.fromicp.data);
			// //console.log('test:' + this.fromicp.data);

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
					this.attOn();
				}
				else if (this.fromicp.data[0] == 4 && this.fromicp.data[1] == 225 && this.fromicp.data[2] == 16 && this.fromicp.data[3] == 2) {
					//console.log("attright");
					this.lightBar(0);
					this.attbtn = true;
					this.attOff();
				}
			}
			// if (this.fromicp.data !== undefined && this.timeEventFlag == true) {
			// 	this.timeEvent();
			// }
			this.getPtA();
			this.getPtB();
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
	saveGetcolorMode: boolean = false;
	changeProfile: any = '2';
	keeploading: boolean = true;
	timeStop: any;
	mode: any = 0;
	fnflag: number = 0;
	nowobj: any;
	ProfileDetail: any;
	attbtn: boolean;
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
	attPt04() {
		if (this.data == 0) {
			if (this.attPt >= 98) {
				// for (let i = 0; i < 104; i++) {
				// this.array1[i] = this.arrayAtt[i];
				this.array4 = this.arrayAtt;
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
	speedValue: any = 60;
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

	attPercent: any;
	up: any = [];

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
			this.array2 = ["esc_2", "f1_2", "f2_2", "f3_2", "f4_2", "f5_2", "f6_2", "f7_2", "f8_2", "f9_2", "f10_2", "f11_2", "f12_2", "print_2", "scroll_2", "pause_2", "perid_2", "n1_2", "n2_2", "n3_2", "n4_2", "n5_2", "n6_2", "n7_2", "n8_2", "n9_2", "n0_2", "minus_2", "plus_2", "bsp_2", "insert_2", "home_2", "pup_2", "numlock_2", "numdrawn_2", "numtimes_2", "numminus_2", "tab_2", "q_2", "w_2", "e_2", "r_2", "t_2", "y_2", "u_2", "i_2", "o_2", "p_2", "lqu_2", "rqu_2", "delete_2", "drawn_2", "end_2", "pdown_2", "num7_2", "num8_2", "num9_2", "numplus_2", "caps_2", "a_2", "s_2", "d_2", "f_2", "g_2", "h_2", "j_2", "k_2", "l_2", "sem_2", "quo_2", "enter_2", "num4_2", "num5_2", "num6_2", "lshift_2", "z_2", "x_2", "c_2", "v_2", "b_2", "n_2", "m_2", "comma_2", "dot_2", "qmark_2", "rshift_2", "up_2", "num1_2", "num2_2", "num3_2", "numenter_2", "lctrl_2", "win_2", "lalt_2", "space_2", "ralt_2", "fn_2", "book_2", "rctrl_2", "left_2", "down_2", "right_2", "num0_2", "numdot_2", "Upside1_2", "Upside2_2", "Upside3_2", "Upside4_2", "Upside5_2", "Upside6_2", "Upside7_2", "Upside8_2", "Upside9_2", "Upside10_2", "Upside11_2", "Upside12_2", "Upside13_2", "Upside14_2", "Upside15_2", "Upside16_2", "Upside17_2", "Upside18_2", "Upside19_2", "Upside20_2", "logo1_2", "logo2_2"];
			this.array3 = ["esc_3", "f1_3", "f2_3", "f3_3", "f4_3", "f5_3", "f6_3", "f7_3", "f8_3", "f9_3", "f10_3", "f11_3", "f12_3", "print_3", "scroll_3", "pause_3", "perid_3", "n1_3", "n2_3", "n3_3", "n4_3", "n5_3", "n6_3", "n7_3", "n8_3", "n9_3", "n0_3", "minus_3", "plus_3", "bsp_3", "insert_3", "home_3", "pup_3", "numlock_3", "numdrawn_3", "numtimes_3", "numminus_3", "tab_3", "q_3", "w_3", "e_3", "r_3", "t_3", "y_3", "u_3", "i_3", "o_3", "p_3", "lqu_3", "rqu_3", "delete_3", "drawn_3", "end_3", "pdown_3", "num7_3", "num8_3", "num9_3", "numplus_3", "caps_3", "a_3", "s_3", "d_3", "f_3", "g_3", "h_3", "j_3", "k_3", "l_3", "sem_3", "quo_3", "enter_3", "num4_3", "num5_3", "num6_3", "lshift_3", "z_3", "x_3", "c_3", "v_3", "b_3", "n_3", "m_3", "comma_3", "dot_3", "qmark_3", "rshift_3", "up_3", "num1_3", "num2_3", "num3_3", "numenter_3", "lctrl_3", "win_3", "lalt_3", "space_3", "ralt_3", "fn_3", "book_3", "rctrl_3", "left_3", "down_3", "right_3", "num0_3", "numdot_3", "Upside1_3", "Upside2_3", "Upside3_3", "Upside4_3", "Upside5_3", "Upside6_3", "Upside7_3", "Upside8_3", "Upside9_3", "Upside10_3", "Upside11_3", "Upside12_3", "Upside13_3", "Upside14_3", "Upside15_3", "Upside16_3", "Upside17_3", "Upside18_3", "Upside19_3", "Upside20_3", "logo1_3", "logo2_3"];
			this.array4 = ["esc_4", "f1_4", "f2_4", "f3_4", "f4_4", "f5_4", "f6_4", "f7_4", "f8_4", "f9_4", "f10_4", "f11_4", "f12_4", "print_4", "scroll_4", "pause_4", "perid_4", "n1_4", "n2_4", "n3_4", "n4_4", "n5_4", "n6_4", "n7_4", "n8_4", "n9_4", "n0_4", "minus_4", "plus_4", "bsp_4", "insert_4", "home_4", "pup_4", "numlock_4", "numdrawn_4", "numtimes_4", "numminus_4", "tab_4", "q_4", "w_4", "e_4", "r_4", "t_4", "y_4", "u_4", "i_4", "o_4", "p_4", "lqu_4", "rqu_4", "delete_4", "drawn_4", "end_4", "pdown_4", "num7_4", "num8_4", "num9_4", "numplus_4", "caps_4", "a_4", "s_4", "d_4", "f_4", "g_4", "h_4", "j_4", "k_4", "l_4", "sem_4", "quo_4", "enter_4", "num4_4", "num5_4", "num6_4", "lshift_4", "z_4", "x_4", "c_4", "v_4", "b_4", "n_4", "m_4", "comma_4", "dot_4", "qmark_4", "rshift_4", "up_4", "num1_4", "num2_4", "num3_4", "numenter_4", "lctrl_4", "win_4", "lalt_4", "space_4", "ralt_4", "fn_4", "book_4", "rctrl_4", "left_4", "down_4", "right_4", "num0_4", "numdot_4", "Upside1_4", "Upside2_4", "Upside3_4", "Upside4_4", "Upside5_4", "Upside6_4", "Upside7_4", "Upside8_4", "Upside9_4", "Upside10_4", "Upside11_4", "Upside12_4", "Upside13_4", "Upside14_4", "Upside15_4", "Upside16_4", "Upside17_4", "Upside18_4", "Upside19_4", "Upside20_4", "logo1_4", "logo2_4"];
			this.logo1_att = "";
			this.logo2_att = "";
			// this.getColorA();
			// this.getColorB();
			this.attBar(1);
			this.sendLBS();
		}
		if (x == 0) {
			this.data = 0;
			this.lightBarStatus = this.data;
			this.up = ["Upside1_att", "Upside2_att", "Upside3_att", "Upside4_att", "Upside5_att", "Upside6_att", "Upside7_att", "Upside8_att", "Upside9_att", "Upside10_att", "Upside11_att", "Upside12_att", "Upside13_att", "Upside14_att", "Upside15_att", "Upside16_att", "Upside17_att", "Upside18_att", "Upside19_att", "Upside20_att", "logo1_att", "logo2_att"];
			this.attBar(0);
			this.sendLBS();
		}
	}
	lightBarStatus: any;

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
				this.attOff();
			}
			else if (data[5] == 0) {
				//console.log('按鈕位置在左邊')
				this.lightBar(1);
				this.attbtn = false;
				this.attOn();
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

	attOn() {
		for (let i = 0; i < this.arrayLb1.length; i++) {
			document.getElementById(this.arrayLb1[i]).style.opacity = this.op;
			document.getElementById(this.arrayLb2[i]).style.opacity = this.op;
			document.getElementById(this.arrayLb3[i]).style.opacity = this.op;
			document.getElementById(this.arrayLb4[i]).style.opacity = this.op;
		}
	}

	attOff() {
		for (let i = 0; i < this.arrayLb1.length; i++) {
			document.getElementById(this.arrayLb1[i]).style.opacity = "0";
			document.getElementById(this.arrayLb2[i]).style.opacity = "0";
			document.getElementById(this.arrayLb3[i]).style.opacity = "0";
			document.getElementById(this.arrayLb4[i]).style.opacity = "0";
		}
	}

	ngOnInit() {
		this.timeValue = this.receiveTemp[3];
		this.check01 = false;
		this.CrashTemp.emit(this.crash);
		env.log('light-effect', 'crash', 'start');
		this.LEDmatrix();//找出對應按鍵;
		this.setDefault(1);
		this.readTemp();
		this.sendTimeCloseFlag.emit(false);

		if (this.lightBS == 0) {
			//console.log("from parent LBS 0 attRight", this.lightBS);
			this.lightBar(0);
			this.attbtn = true;
			setTimeout(() => {
				this.attOff();
			}, 50);
		}
		else if (this.lightBS == 1) {
			//console.log("from parent LBS 1 attLeft", this.lightBS)
			this.lightBar(1);
			this.attbtn = false;
			setTimeout(() => {
				this.attOn();
			}, 50);
		}
	}
	ngOnChanges(changes: any) {
		this.detectEffectChange()
		// changes.prop contains the old and the new value...
		for (let propName in changes) {

			this.changeV = changes[propName];
			this.currentV = JSON.stringify(this.changeV.currentValue);
			let prev = JSON.stringify(this.changeV.previousValue);
			// //console.log('getGame11111');
			// //console.log(this.savechange);
			// //console.log(this.currentV);
		}


		if (this.currentV == '"stopApmode"' && this.savechange == 0) {
			this.savechange = 1;
			this.goOut();
			// if (this.envio == 1) {
				env.log('crash', 'apmode', 'stopapmode')
			// }
			// this.savechange = 0
			// //console.log('222')
			// //console.log(this.savechange)
		}
		if (this.currentV == '"startApmode"' && this.savechange == 0) {
			this.savechange = 1;
			this.plugIn();
			this.attBar(0);
			// if (this.envio == 1) {
				env.log('crash', 'apmode', 'startapmode')
			// }
			// this.savechange = 0
			// //console.log('333')
			// //console.log(this.savechange)

		}

		if (this.currentV == '"changeProfile"') {
			//console.log('beginreloading');
			// this.keeploading = false;
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

	leave: any = 1
	firstKB: any;
	positionR: any;
	positionG: any;
	positionB: any;
	positionRarr: any = [];
	positionGarr: any = [];
	positionBarr: any = [];
	array1: any = ["esc", "f1", "f2", "f3", "f4", "f5", "f6", "f7", "f8", "f9", "f10", "f11", "f12", "print", "scroll", "pause", "perid", "n1", "n2", "n3", "n4", "n5", "n6", "n7", "n8", "n9", "n0", "minus", "plus", "bsp", "insert", "home", "pup", "numlock", "numdrawn", "numtimes", "numminus", "tab", "q", "w", "e", "r", "t", "y", "u", "i", "o", "p", "lqu", "rqu", "delete", "drawn", "end", "pdown", "num7", "num8", "num9", "numplus", "caps", "a", "s", "d", "f", "g", "h", "j", "k", "l", "sem", "quo", "enter", "num4", "num5", "num6", "lshift", "z", "x", "c", "v", "b", "n", "m", "comma", "dot", "qmark", "rshift", "up", "num1", "num2", "num3", "numenter", "lctrl", "win", "lalt", "space", "ralt", "fn", "book", "rctrl", "left", "down", "right", "num0", "numdot", "Upside1", "Upside2", "Upside3", "Upside4", "Upside5", "Upside6", "Upside7", "Upside8", "Upside9", "Upside10", "Upside11", "Upside12", "Upside13", "Upside14", "Upside15", "Upside16", "Upside17", "Upside18", "Upside19", "Upside20", "logo1", "logo2"];

	arrayLb1: any = ["Upside1", "Upside2", "Upside3", "Upside4", "Upside5", "Upside6", "Upside7", "Upside8", "Upside9", "Upside10", "Upside11", "Upside12", "Upside13", "Upside14", "Upside15", "Upside16", "Upside17", "Upside18", "Upside19", "Upside20", "logo1", "logo2"]

	array2: any = ["esc_2", "f1_2", "f2_2", "f3_2", "f4_2", "f5_2", "f6_2", "f7_2", "f8_2", "f9_2", "f10_2", "f11_2", "f12_2", "print_2", "scroll_2", "pause_2", "perid_2", "n1_2", "n2_2", "n3_2", "n4_2", "n5_2", "n6_2", "n7_2", "n8_2", "n9_2", "n0_2", "minus_2", "plus_2", "bsp_2", "insert_2", "home_2", "pup_2", "numlock_2", "numdrawn_2", "numtimes_2", "numminus_2", "tab_2", "q_2", "w_2", "e_2", "r_2", "t_2", "y_2", "u_2", "i_2", "o_2", "p_2", "lqu_2", "rqu_2", "delete_2", "drawn_2", "end_2", "pdown_2", "num7_2", "num8_2", "num9_2", "numplus_2", "caps_2", "a_2", "s_2", "d_2", "f_2", "g_2", "h_2", "j_2", "k_2", "l_2", "sem_2", "quo_2", "enter_2", "num4_2", "num5_2", "num6_2", "lshift_2", "z_2", "x_2", "c_2", "v_2", "b_2", "n_2", "m_2", "comma_2", "dot_2", "qmark_2", "rshift_2", "up_2", "num1_2", "num2_2", "num3_2", "numenter_2", "lctrl_2", "win_2", "lalt_2", "space_2", "ralt_2", "fn_2", "book_2", "rctrl_2", "left_2", "down_2", "right_2", "num0_2", "numdot_2", "Upside1_2", "Upside2_2", "Upside3_2", "Upside4_2", "Upside5_2", "Upside6_2", "Upside7_2", "Upside8_2", "Upside9_2", "Upside10_2", "Upside11_2", "Upside12_2", "Upside13_2", "Upside14_2", "Upside15_2", "Upside16_2", "Upside17_2", "Upside18_2", "Upside19_2", "Upside20_2", "logo1_2", "logo2_2"]

	arrayLb2: any = ["Upside1_2", "Upside2_2", "Upside3_2", "Upside4_2", "Upside5_2", "Upside6_2", "Upside7_2", "Upside8_2", "Upside9_2", "Upside10_2", "Upside11_2", "Upside12_2", "Upside13_2", "Upside14_2", "Upside15_2", "Upside16_2", "Upside17_2", "Upside18_2", "Upside19_2", "Upside20_2", "logo1_2", "logo2_2"]

	array3: any = ["esc_3", "f1_3", "f2_3", "f3_3", "f4_3", "f5_3", "f6_3", "f7_3", "f8_3", "f9_3", "f10_3", "f11_3", "f12_3", "print_3", "scroll_3", "pause_3", "perid_3", "n1_3", "n2_3", "n3_3", "n4_3", "n5_3", "n6_3", "n7_3", "n8_3", "n9_3", "n0_3", "minus_3", "plus_3", "bsp_3", "insert_3", "home_3", "pup_3", "numlock_3", "numdrawn_3", "numtimes_3", "numminus_3", "tab_3", "q_3", "w_3", "e_3", "r_3", "t_3", "y_3", "u_3", "i_3", "o_3", "p_3", "lqu_3", "rqu_3", "delete_3", "drawn_3", "end_3", "pdown_3", "num7_3", "num8_3", "num9_3", "numplus_3", "caps_3", "a_3", "s_3", "d_3", "f_3", "g_3", "h_3", "j_3", "k_3", "l_3", "sem_3", "quo_3", "enter_3", "num4_3", "num5_3", "num6_3", "lshift_3", "z_3", "x_3", "c_3", "v_3", "b_3", "n_3", "m_3", "comma_3", "dot_3", "qmark_3", "rshift_3", "up_3", "num1_3", "num2_3", "num3_3", "numenter_3", "lctrl_3", "win_3", "lalt_3", "space_3", "ralt_3", "fn_3", "book_3", "rctrl_3", "left_3", "down_3", "right_3", "num0_3", "numdot_3", "Upside1_3", "Upside2_3", "Upside3_3", "Upside4_3", "Upside5_3", "Upside6_3", "Upside7_3", "Upside8_3", "Upside9_3", "Upside10_3", "Upside11_3", "Upside12_3", "Upside13_3", "Upside14_3", "Upside15_3", "Upside16_3", "Upside17_3", "Upside18_3", "Upside19_3", "Upside20_3", "logo1_3", "logo2_3"]

	arrayLb3: any = ["Upside1_3", "Upside2_3", "Upside3_3", "Upside4_3", "Upside5_3", "Upside6_3", "Upside7_3", "Upside8_3", "Upside9_3", "Upside10_3", "Upside11_3", "Upside12_3", "Upside13_3", "Upside14_3", "Upside15_3", "Upside16_3", "Upside17_3", "Upside18_3", "Upside19_3", "Upside20_3", "logo1_3", "logo2_3"]

	array4: any = ["esc_4", "f1_4", "f2_4", "f3_4", "f4_4", "f5_4", "f6_4", "f7_4", "f8_4", "f9_4", "f10_4", "f11_4", "f12_4", "print_4", "scroll_4", "pause_4", "perid_4", "n1_4", "n2_4", "n3_4", "n4_4", "n5_4", "n6_4", "n7_4", "n8_4", "n9_4", "n0_4", "minus_4", "plus_4", "bsp_4", "insert_4", "home_4", "pup_4", "numlock_4", "numdrawn_4", "numtimes_4", "numminus_4", "tab_4", "q_4", "w_4", "e_4", "r_4", "t_4", "y_4", "u_4", "i_4", "o_4", "p_4", "lqu_4", "rqu_4", "delete_4", "drawn_4", "end_4", "pdown_4", "num7_4", "num8_4", "num9_4", "numplus_4", "caps_4", "a_4", "s_4", "d_4", "f_4", "g_4", "h_4", "j_4", "k_4", "l_4", "sem_4", "quo_4", "enter_4", "num4_4", "num5_4", "num6_4", "lshift_4", "z_4", "x_4", "c_4", "v_4", "b_4", "n_4", "m_4", "comma_4", "dot_4", "qmark_4", "rshift_4", "up_4", "num1_4", "num2_4", "num3_4", "numenter_4", "lctrl_4", "win_4", "lalt_4", "space_4", "ralt_4", "fn_4", "book_4", "rctrl_4", "left_4", "down_4", "right_4", "num0_4", "numdot_4", "Upside1_4", "Upside2_4", "Upside3_4", "Upside4_4", "Upside5_4", "Upside6_4", "Upside7_4", "Upside8_4", "Upside9_4", "Upside10_4", "Upside11_4", "Upside12_4", "Upside13_4", "Upside14_4", "Upside15_4", "Upside16_4", "Upside17_4", "Upside18_4", "Upside19_4", "Upside20_4", "logo1_4", "logo2_4"]

	arrayLb4: any = ["Upside1_4", "Upside2_4", "Upside3_4", "Upside4_4", "Upside5_4", "Upside6_4", "Upside7_4", "Upside8_4", "Upside9_4", "Upside10_4", "Upside11_4", "Upside12_4", "Upside13_4", "Upside14_4", "Upside15_4", "Upside16_4", "Upside17_4", "Upside18_4", "Upside19_4", "Upside20_4", "logo1_4", "logo2_4"]

	arrayKb1: any = ["esc", "f1", "f2", "f3", "f4", "f5", "f6", "f7", "f8", "f9", "f10", "f11", "f12", "print", "scroll", "pause", "perid", "n1", "n2", "n3", "n4", "n5", "n6", "n7", "n8", "n9", "n0", "minus", "plus", "bsp", "insert", "home", "pup", "numlock", "numdrawn", "numtimes", "numminus", "tab", "q", "w", "e", "r", "t", "y", "u", "i", "o", "p", "lqu", "rqu", "delete", "drawn", "end", "pdown", "num7", "num8", "num9", "numplus", "caps", "a", "s", "d", "f", "g", "h", "j", "k", "l", "sem", "quo", "enter", "num4", "num5", "num6", "lshift", "z", "x", "c", "v", "b", "n", "m", "comma", "dot", "qmark", "rshift", "up", "num1", "num2", "num3", "numenter", "lctrl", "win", "lalt", "space", "ralt", "fn", "book", "rctrl", "left", "down", "right", "num0", "numdot", "Upside1", "Upside2", "Upside3", "Upside4", "Upside5", "Upside6", "Upside7", "Upside8", "Upside9", "Upside10", "Upside11", "Upside12", "Upside13", "Upside14", "Upside15", "Upside16", "Upside17", "Upside18", "Upside19", "Upside20", "logo1", "logo2"]

	arrayKb2: any = ["esc_2", "f1_2", "f2_2", "f3_2", "f4_2", "f5_2", "f6_2", "f7_2", "f8_2", "f9_2", "f10_2", "f11_2", "f12_2", "print_2", "scroll_2", "pause_2", "perid_2", "n1_2", "n2_2", "n3_2", "n4_2", "n5_2", "n6_2", "n7_2", "n8_2", "n9_2", "n0_2", "minus_2", "plus_2", "bsp_2", "insert_2", "home_2", "pup_2", "numlock_2", "numdrawn_2", "numtimes_2", "numminus_2", "tab_2", "q_2", "w_2", "e_2", "r_2", "t_2", "y_2", "u_2", "i_2", "o_2", "p_2", "lqu_2", "rqu_2", "delete_2", "drawn_2", "end_2", "pdown_2", "num7_2", "num8_2", "num9_2", "numplus_2", "caps_2", "a_2", "s_2", "d_2", "f_2", "g_2", "h_2", "j_2", "k_2", "l_2", "sem_2", "quo_2", "enter_2", "num4_2", "num5_2", "num6_2", "lshift_2", "z_2", "x_2", "c_2", "v_2", "b_2", "n_2", "m_2", "comma_2", "dot_2", "qmark_2", "rshift_2", "up_2", "num1_2", "num2_2", "num3_2", "numenter_2", "lctrl_2", "win_2", "lalt_2", "space_2", "ralt_2", "fn_2", "book_2", "rctrl_2", "left_2", "down_2", "right_2", "num0_2", "numdot_2", "Upside1_2", "Upside2_2", "Upside3_2", "Upside4_2", "Upside5_2", "Upside6_2", "Upside7_2", "Upside8_2", "Upside9_2", "Upside10_2", "Upside11_2", "Upside12_2", "Upside13_2", "Upside14_2", "Upside15_2", "Upside16_2", "Upside17_2", "Upside18_2", "Upside19_2", "Upside20_2", "logo1_2", "logo2_2"];

	arrayKb3: any = ["esc_3", "f1_3", "f2_3", "f3_3", "f4_3", "f5_3", "f6_3", "f7_3", "f8_3", "f9_3", "f10_3", "f11_3", "f12_3", "print_3", "scroll_3", "pause_3", "perid_3", "n1_3", "n2_3", "n3_3", "n4_3", "n5_3", "n6_3", "n7_3", "n8_3", "n9_3", "n0_3", "minus_3", "plus_3", "bsp_3", "insert_3", "home_3", "pup_3", "numlock_3", "numdrawn_3", "numtimes_3", "numminus_3", "tab_3", "q_3", "w_3", "e_3", "r_3", "t_3", "y_3", "u_3", "i_3", "o_3", "p_3", "lqu_3", "rqu_3", "delete_3", "drawn_3", "end_3", "pdown_3", "num7_3", "num8_3", "num9_3", "numplus_3", "caps_3", "a_3", "s_3", "d_3", "f_3", "g_3", "h_3", "j_3", "k_3", "l_3", "sem_3", "quo_3", "enter_3", "num4_3", "num5_3", "num6_3", "lshift_3", "z_3", "x_3", "c_3", "v_3", "b_3", "n_3", "m_3", "comma_3", "dot_3", "qmark_3", "rshift_3", "up_3", "num1_3", "num2_3", "num3_3", "numenter_3", "lctrl_3", "win_3", "lalt_3", "space_3", "ralt_3", "fn_3", "book_3", "rctrl_3", "left_3", "down_3", "right_3", "num0_3", "numdot_3", , "Upside1_3", "Upside2_3", "Upside3_3", "Upside4_3", "Upside5_3", "Upside6_3", "Upside7_3", "Upside8_3", "Upside9_3", "Upside10_3", "Upside11_3", "Upside12_3", "Upside13_3", "Upside14_3", "Upside15_3", "Upside16_3", "Upside17_3", "Upside18_3", "Upside19_3", "Upside20_3", "logo1_3", "logo2_3"]

	arrayKb4: any = ["esc_4", "f1_4", "f2_4", "f3_4", "f4_4", "f5_4", "f6_4", "f7_4", "f8_4", "f9_4", "f10_4", "f11_4", "f12_4", "print_4", "scroll_4", "pause_4", "perid_4", "n1_4", "n2_4", "n3_4", "n4_4", "n5_4", "n6_4", "n7_4", "n8_4", "n9_4", "n0_4", "minus_4", "plus_4", "bsp_4", "insert_4", "home_4", "pup_4", "numlock_4", "numdrawn_4", "numtimes_4", "numminus_4", "tab_4", "q_4", "w_4", "e_4", "r_4", "t_4", "y_4", "u_4", "i_4", "o_4", "p_4", "lqu_4", "rqu_4", "delete_4", "drawn_4", "end_4", "pdown_4", "num7_4", "num8_4", "num9_4", "numplus_4", "caps_4", "a_4", "s_4", "d_4", "f_4", "g_4", "h_4", "j_4", "k_4", "l_4", "sem_4", "quo_4", "enter_4", "num4_4", "num5_4", "num6_4", "lshift_4", "z_4", "x_4", "c_4", "v_4", "b_4", "n_4", "m_4", "comma_4", "dot_4", "qmark_4", "rshift_4", "up_4", "num1_4", "num2_4", "num3_4", "numenter_4", "lctrl_4", "win_4", "lalt_4", "space_4", "ralt_4", "fn_4", "book_4", "rctrl_4", "left_4", "down_4", "right_4", "num0_4", "numdot_4", "Upside1_4", "Upside2_4", "Upside3_4", "Upside4_4", "Upside5_4", "Upside6_4", "Upside7_4", "Upside8_4", "Upside9_4", "Upside10_4", "Upside11_4", "Upside12_4", "Upside13_4", "Upside14_4", "Upside15_4", "Upside16_4", "Upside17_4", "Upside18_4", "Upside19_4", "Upside20_4", "logo1_4", "logo2_4"]

	arrayAtt: any = ["esc_att", "f1_att", "f2_att", "f3_att", "f4_att", "f5_att", "f6_att", "f7_att", "f8_att", "f9_att", "f10_att", "f11_att", "f12_att", "print_att", "scroll_att", "pause_att", "perid_att", "n1_att", "n2_att", "n3_att", "n4_att", "n5_att", "n6_att", "n7_att", "n8_att", "n9_att", "n0_att", "minus_att", "plus_att", "bsp_att", "insert_att", "home_att", "pup_att", "numlock_att", "numdrawn_att", "numtimes_att", "numminus_att", "tab_att", "q_att", "w_att", "e_att", "r_att", "t_att", "y_att", "u_att", "i_att", "o_att", "p_att", "lqu_att", "rqu_att", "delete_att", "drawn_att", "end_att", "pdown_att", "num7_att", "num8_att", "num9_att", "numplus_att", "caps_att", "a_att", "s_att", "d_att", "f_att", "g_att", "h_att", "j_att", "k_att", "l_att", "sem_att", "quo_att", "enter_att", "num4_att", "num5_att", "num6_att", "lshift_att", "z_att", "x_att", "c_att", "v_att", "b_att", "n_att", "m_att", "comma_att", "dot_att", "qmark_att", "rshift_att", "up_att", "num1_att", "num2_att", "num3_att", "numenter_att", "lctrl_att", "win_att", "lalt_att", "space_att", "ralt_att", "fn_att", "book_att", "rctrl_att", "left_att", "down_att", "right_att", "num0_att", "numdot_att", "Upside1_att", "Upside2_att", "Upside3_att", "Upside4_att", "Upside5_att", "Upside6_att", "Upside7_att", "Upside8_att", "Upside9_att", "Upside10_att", "Upside11_att", "Upside12_att", "Upside13_att", "Upside14_att", "Upside15_att", "Upside16_att", "Upside17_att", "Upside18_att", "Upside19_att", "Upside20_att", "logo1_att", "logo2_att"]

	getclr01: any;
	getclr02: any;
	getclr03: any;
	getclr04: any;

	getColorA: any;
	getColorB: any;
	getPtA: any;
	getPtB: any;
	data: any = 1;


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

	red04: any = new Buffer(new Array(126));
	green04: any = new Buffer(new Array(126));
	blue04: any = new Buffer(new Array(126));




	// worker: any;

	// workerReset() {
	// 	this.worker.terminate();
	// 	this.worker = undefined;
	// }
	getColor1() {	//RGB取值 上到下
		let vm = this;
		clearInterval(this.getclr01);
		if (this.data == 0) {
			for (let i = 0; i < 22; i++) {
				this.array1[i + 104] = this.up[i]
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
			this.up = ["Upside1", "Upside2", "Upside3", "Upside4", "Upside5", "Upside6", "Upside7", "Upside8", "Upside9", "Upside10", "Upside11", "Upside12", "Upside13", "Upside14", "Upside15", "Upside16", "Upside17", "Upside18", "Upside19", "Upside20", "logo1", "logo2"]
			for (let i = 0; i < 22; i++) {
				this.array1[i + 104] = this.up[i]
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
				this.array2[i + 104] = this.up[i]
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
			this.up = ["Upside1_2", "Upside2_2", "Upside3_2", "Upside4_2", "Upside5_2", "Upside6_2", "Upside7_2", "Upside8_2", "Upside9_2", "Upside10_2", "Upside11_2", "Upside12_2", "Upside13_2", "Upside14_2", "Upside15_2", "Upside16_2", "Upside17_2", "Upside18_2", "Upside19_2", "Upside20_2", "logo1_2", "logo2_2"]
			for (let i = 0; i < 22; i++) {
				this.array2[i + 104] = this.up[i]
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
				this.array3[i + 104] = this.up[i]
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
			this.up = ["Upside1_3", "Upside2_3", "Upside3_3", "Upside4_3", "Upside5_3", "Upside6_3", "Upside7_3", "Upside8_3", "Upside9_3", "Upside10_3", "Upside11_3", "Upside12_3", "Upside13_3", "Upside14_3", "Upside15_3", "Upside16_3", "Upside17_3", "Upside18_3", "Upside19_3", "Upside20_3", "logo1_3", "logo2_3"]
			for (let i = 0; i < 22; i++) {
				this.array3[i + 104] = this.up[i]
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


	getColor4() {     //RGB取值  內到外 外到內 右到左
		let vm = this;
		clearInterval(this.getclr04);
		if (this.data == 0) {
			for (let i = 0; i < 22; i++) {
				this.array4[i + 104] = this.up[i]
			}
			this.getclr04 = setInterval(() => {
				for (var i = 0; i < this.array1.length; i++) {
					let clrIn = window.getComputedStyle(document.getElementById(this.array4[i]), null).getPropertyValue("background-color");
					vm.red04[i] = (parseInt(vm.convertColor(clrIn)[0]));
					vm.green04[i] = (parseInt(vm.convertColor(clrIn)[1]));
					vm.blue04[i] = (parseInt(vm.convertColor(clrIn)[2]));
				}
			}, 1000 / 60);
		} else {
			this.up = ["Upside1_4", "Upside2_4", "Upside3_4", "Upside4_4", "Upside5_4", "Upside6_4", "Upside7_4", "Upside8_4", "Upside9_4", "Upside10_4", "Upside11_4", "Upside12_4", "Upside13_4", "Upside14_4", "Upside15_4", "Upside16_4", "Upside17_4", "Upside18_4", "Upside19_4", "Upside20_4", "logo1_4", "logo2_4"]
			for (let i = 0; i < 22; i++) {
				this.array4[i + 104] = this.up[i]
			}
			this.getclr04 = setInterval(() => {
				for (var i = 0; i < this.array1.length; i++) {
					let clrIn = window.getComputedStyle(document.getElementById(this.array4[i]), null).getPropertyValue("background-color");
					vm.red04[i] = (parseInt(vm.convertColor(clrIn)[0]));
					vm.green04[i] = (parseInt(vm.convertColor(clrIn)[1]));
					vm.blue04[i] = (parseInt(vm.convertColor(clrIn)[2]));
				}
			}, 1000 / 60);
		}
	}

	//取值區

	bri: any;
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
				// 	profile: '1',    //profile  0:reset, 1:Profile1 2:Profile2
				// 	mode: '0x0e', //1~15 代表不同Mode
				// 	light: '0x14',    //0~32 燈光亮度
				// }
				// let obj2 = {
				// 	Type: funcVar.FuncType.Device,
				// 	Func: funcVar.FuncName.SetCommand,
				// 	Param: setprofile
				// }
				// //console.log("setprofile:SetCommand");
				// this.protocol.RunSetFunction(obj2).then((data) => {
				// 	//console.log("Container RunSetFunction:" + data);
				this.setAp = 0;
				// });
			})
		}
	}

	LEDmatrix() {
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
				this.red[i] = this.red01[i] + this.red02[i] + this.red03[i] + this.red04[i];
				this.green[i] = this.green01[i] + this.green02[i] + this.green03[i] + this.green04[i];
				this.blue[i] = this.blue01[i] + this.blue02[i] + this.blue03[i] + this.blue04[i];
				apMode[this.positionRarr[i]] = this.red[i];
				apMode[this.positionGarr[i]] = this.green[i];
				apMode[this.positionBarr[i]] = this.blue[i];
				//  
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

	thelastEffect: any = this.ltrCrash_med;


	letsgoout: boolean = true;
	letsgoIn: boolean = false;
	plugIn() {

		clearInterval(this.getclr01);
		clearInterval(this.getclr02);
		clearInterval(this.getclr03);
		clearInterval(this.getclr04);
		// clearInterval(this.stop);
		this.saveGetcolorMode = false;
		this.leave = 0;
		// this.letsgoout = false;
		// this.letsgoIn = true;

		this.goIn();
	}

	none() {
		clearInterval(this.getclr01);
		clearInterval(this.getclr02);
		clearInterval(this.getclr03);
		clearInterval(this.getclr04);
		// clearInterval(this.stop);
		this.saveGetcolorMode = false;
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
		clearInterval(this.getclr04);
		clearInterval(this.stopAtt);
		// clearInterval(this.stop);
		this.saveGetcolorMode = false;
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

			this.array4 = ["esc_4", "f1_4", "f2_4", "f3_4", "f4_4", "f5_4", "f6_4", "f7_4", "f8_4", "f9_4", "f10_4", "f11_4", "f12_4", "print_4", "scroll_4", "pause_4", "perid_4", "n1_4", "n2_4", "n3_4", "n4_4", "n5_4", "n6_4", "n7_4", "n8_4", "n9_4", "n0_4", "minus_4", "plus_4", "bsp_4", "insert_4", "home_4", "pup_4", "numlock_4", "numdrawn_4", "numtimes_4", "numminus_4", "tab_4", "q_4", "w_4", "e_4", "r_4", "t_4", "y_4", "u_4", "i_4", "o_4", "p_4", "lqu_4", "rqu_4", "delete_4", "drawn_4", "end_4", "pdown_4", "num7_4", "num8_4", "num9_4", "numplus_4", "caps_4", "a_4", "s_4", "d_4", "f_4", "g_4", "h_4", "j_4", "k_4", "l_4", "sem_4", "quo_4", "enter_4", "num4_4", "num5_4", "num6_4", "lshift_4", "z_4", "x_4", "c_4", "v_4", "b_4", "n_4", "m_4", "comma_4", "dot_4", "qmark_4", "rshift_4", "up_4", "num1_4", "num2_4", "num3_4", "numenter_4", "lctrl_4", "win_4", "lalt_4", "space_4", "ralt_4", "fn_4", "book_4", "rctrl_4", "left_4", "down_4", "right_4", "num0_4", "numdot_4", "Upside1_att", "Upside2_att", "Upside3_att", "Upside4_att", "Upside5_att", "Upside6_att", "Upside7_att", "Upside8_att", "Upside9_att", "Upside10_att", "Upside11_att", "Upside12_att", "Upside13_att", "Upside14_att", "Upside15_att", "Upside16_att", "Upside17_att", "Upside18_att", "Upside19_att", "Upside20_att", "logo1_att", "logo2_att"]
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
			this.saveGetcolorMode = false;
			this.getColorA();
			this.getColorB();
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
			}, 50)
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

	UtoD1: any = "";
	UtoD2: any = "";
	UtoD3: any = "";
	UtoD4: any = "";
	UtoD5: any = "";
	UtoD6: any = "";
	UtoD7: any = "";
	DtoU1: any = "";
	DtoU2: any = "";
	DtoU3: any = "";
	DtoU4: any = "";
	DtoU5: any = "";
	DtoU6: any = "";
	DtoU7: any = "";
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
	RtoL11: any = "";
	RtoL12: any = "";
	RtoL13: any = "";
	RtoL14: any = "";
	RtoL15: any = "";
	RtoL16: any = "";
	RtoL17: any = "";
	RtoL18: any = "";
	RtoL19: any = "";
	RtoL20: any = "";
	RtoL21: any = "";


	clear() {
		this.UtoD1 = "";
		this.UtoD2 = "";
		this.UtoD3 = "";
		this.UtoD4 = "";
		this.UtoD5 = "";
		this.UtoD6 = "";
		this.UtoD7 = "";
		this.DtoU1 = "";
		this.DtoU2 = "";
		this.DtoU3 = "";
		this.DtoU4 = "";
		this.DtoU5 = "";
		this.DtoU6 = "";
		this.DtoU7 = "";
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
		this.RtoL1 = "";
		this.RtoL2 = "";
		this.RtoL3 = "";
		this.RtoL4 = "";
		this.RtoL5 = "";
		this.RtoL6 = "";
		this.RtoL7 = "";
		this.RtoL8 = "";
		this.RtoL9 = "";
		this.RtoL10 = "";
		this.RtoL11 = "";
		this.RtoL12 = "";
		this.RtoL13 = "";
		this.RtoL14 = "";
		this.RtoL15 = "";
		this.RtoL16 = "";
		this.RtoL17 = "";
		this.RtoL18 = "";
		this.RtoL19 = "";
		this.RtoL20 = "";
		this.RtoL21 = "";
	}

	stop: any;
	colorChange1: any = 0;
	colorChange2: any = 0;


	utdCrash_med() {     //上到下撞擊中速
		this.thelastEffect = this.utdCrash_med;
		this.clear();
		this.KBClean()
		this.getColor1();
		this.getColor2();
		this.getColorA = this.getColor1
		this.getColorB = this.getColor2
		this.getPtA = this.attPt01;
		this.getPtB = this.attPt02;
		// this.getRuleCrashudMed2();
		// var Upside1 = this.array1.indexOf('Upside_1')
		// var lctrl = this.array2.indexOf("lctrl_2")
		// var vm = this;
		// this.stop = setInterval(() => {
		// 	if (vm.red[Upside1] > 0 || vm.green[Upside1] > 0 || vm.blue[Upside1] > 0) {
		// 		vm.getRuleCrashudMed1();
		// 	}
		// 	if (vm.red[lctrl] > 0 || vm.green[lctrl] > 0 || vm.blue[lctrl] > 0) {
		// 		vm.getRuleCrashudMed1();
		// 	}
		// }, 500)
		// var Upside1 = document.getElementById('Upside_1')
		// var lctrl = document.getElementById("lctrl_2")
		// var vm = this;
		// Upside1.addEventListener('webkitAnimationIteration', function () {
		// 	vm.getRuleCrashudMed1();
		// })
		// lctrl.addEventListener('webkitAnimationIteration', function () {
		// 	vm.getRuleCrashudMed1();
		// })
		this.UtoD1 = "upback1_med";
		this.UtoD2 = "upback2_med";
		this.UtoD3 = "upback3_med";
		this.UtoD4 = "upback4_med";
		this.UtoD5 = "upback5_med";
		this.UtoD6 = "upback6_med";
		this.UtoD7 = "upback7_med";
		this.DtoU1 = "upback8_med";
		this.DtoU2 = "upback9_med";
		this.DtoU3 = "upback10_med";
		this.DtoU4 = "upback11_med";
		this.DtoU5 = "upback12_med";
		this.DtoU6 = "upback13_med";
		this.DtoU7 = "upback14_med";
	}

	utdCrash_high() {     //上到下撞擊
		this.thelastEffect = this.utdCrash_high;
		this.clear();
		this.KBClean()
		this.getColor1();
		this.getColor2();
		this.getColorA = this.getColor1
		this.getColorB = this.getColor2
		this.getPtA = this.attPt01;
		this.getPtB = this.attPt02;
		// this.getRuleCrashudMed2();
		// var Upside1 = this.array1.indexOf('Upside_1')
		// var lctrl = this.array2.indexOf("lctrl_2")
		// var vm = this;
		// this.stop = setInterval(() => {
		// 	if (vm.red[Upside1] > 0 || vm.green[Upside1] > 0 || vm.blue[Upside1] > 0) {
		// 		vm.getRuleCrashudHigh1();
		// 	}
		// 	if (vm.red[lctrl] > 0 || vm.green[lctrl] > 0 || vm.blue[lctrl] > 0) {
		// 		vm.getRuleCrashudHigh1();
		// 	}
		// }, 500)
		// var Upside1 = document.getElementById('Upside_1')
		// var lctrl = document.getElementById("lctrl_2")
		// var vm = this;
		// Upside1.addEventListener('webkitAnimationIteration', function () {
		// 	vm.getRuleCrashudHigh1();
		// })
		// lctrl.addEventListener('webkitAnimationIteration', function () {
		// 	vm.getRuleCrashudHigh1();
		// })
		this.UtoD1 = "upback1_high";
		this.UtoD2 = "upback2_high";
		this.UtoD3 = "upback3_high";
		this.UtoD4 = "upback4_high";
		this.UtoD5 = "upback5_high";
		this.UtoD6 = "upback6_high";
		this.UtoD7 = "upback7_high";
		this.DtoU1 = "upback8_high";
		this.DtoU2 = "upback9_high";
		this.DtoU3 = "upback10_high";
		this.DtoU4 = "upback11_high";
		this.DtoU5 = "upback12_high";
		this.DtoU6 = "upback13_high";
		this.DtoU7 = "upback14_high";
	}

	utdCrash_slow() {     //上到下撞擊
		this.thelastEffect = this.utdCrash_slow;
		this.clear();
		this.KBClean()
		this.getColor1();
		this.getColor2();
		this.getColorA = this.getColor1
		this.getColorB = this.getColor2
		this.getPtA = this.attPt01;
		this.getPtB = this.attPt02;
		// this.getRuleCrashudSlow2();
		// var Upside1 = this.array1.indexOf('Upside_1')
		// var lctrl = this.array2.indexOf("lctrl_2")
		// var vm = this
		// this.stop = setInterval(() => {
		// 	if (vm.red[Upside1] > 0 || vm.green[Upside1] > 0 || vm.blue[Upside1] > 0) {
		// 		vm.getRuleCrashudSlow1();
		// 	}
		// 	if (vm.red[lctrl] > 0 || vm.green[lctrl] > 0 || vm.blue[lctrl] > 0) {
		// 		vm.getRuleCrashudSlow1();
		// 	}
		// }, 500)
		// var Upside1 = document.getElementById('Upside_1')
		// var lctrl = document.getElementById("lctrl_2")
		// var vm = this;
		// Upside1.addEventListener('webkitAnimationIteration', function () {
		// 	vm.getRuleCrashudSlow1();
		// })
		// lctrl.addEventListener('webkitAnimationIteration', function () {
		// 	vm.getRuleCrashudSlow1();
		// })
		this.UtoD1 = "upback1_slow";
		this.UtoD2 = "upback2_slow";
		this.UtoD3 = "upback3_slow";
		this.UtoD4 = "upback4_slow";
		this.UtoD5 = "upback5_slow";
		this.UtoD6 = "upback6_slow";
		this.UtoD7 = "upback7_slow";
		this.DtoU1 = "upback8_slow";
		this.DtoU2 = "upback9_slow";
		this.DtoU3 = "upback10_slow";
		this.DtoU4 = "upback11_slow";
		this.DtoU5 = "upback12_slow";
		this.DtoU6 = "upback13_slow";
		this.DtoU7 = "upback14_slow";
	}

	dtuCrash_med() {     //下到上撞擊中速
		this.thelastEffect = this.dtuCrash_med;
		this.clear();
		this.KBClean()
		this.getColor1();
		this.getColor2();
		this.getColorA = this.getColor1
		this.getColorB = this.getColor2
		this.getPtA = this.attPt01;
		this.getPtB = this.attPt02;
		// this.getRuleCrashudMed2();
		// var Upside1 = this.array1.indexOf('Upside_1')
		// var lctrl = this.array2.indexOf("lctrl_2")
		// var vm = this;
		// this.stop = setInterval(() => {
		// 	if (vm.red[Upside1] > 0 || vm.green[Upside1] > 0 || vm.blue[Upside1] > 0) {
		// 		vm.getRuleCrashudMed1();
		// 	}
		// 	if (vm.red[lctrl] > 0 || vm.green[lctrl] > 0 || vm.blue[lctrl] > 0) {
		// 		vm.getRuleCrashudMed1();
		// 	}
		// }, 500)
		// var Upside1 = document.getElementById('Upside_1')
		// var lctrl = document.getElementById("lctrl_2")
		// var vm = this;
		// Upside1.addEventListener('webkitAnimationIteration', function () {
		// 	vm.getRuleCrashudMed1();
		// })
		// lctrl.addEventListener('webkitAnimationIteration', function () {
		// 	vm.getRuleCrashudMed1();
		// })
		this.DtoU1 = "upback1_med";
		this.DtoU2 = "upback2_med";
		this.DtoU3 = "upback3_med";
		this.DtoU4 = "upback4_med";
		this.DtoU5 = "upback5_med";
		this.DtoU6 = "upback6_med";
		this.DtoU7 = "upback7_med";
		this.UtoD1 = "upback8_med";
		this.UtoD2 = "upback9_med";
		this.UtoD3 = "upback10_med";
		this.UtoD4 = "upback11_med";
		this.UtoD5 = "upback12_med";
		this.UtoD6 = "upback13_med";
		this.UtoD7 = "upback14_med";
	}

	dtuCrash_high() {     //下到上撞擊高速
		this.thelastEffect = this.dtuCrash_high;
		this.clear();
		this.KBClean()
		this.getColor1();
		this.getColor2();
		this.getColorA = this.getColor1
		this.getColorB = this.getColor2
		this.getPtA = this.attPt01;
		this.getPtB = this.attPt02;
		// var Upside1 = this.array1.indexOf('Upside_1')
		// var lctrl = this.array2.indexOf("lctrl_2")
		// var vm = this;
		// this.stop = setInterval(() => {
		// 	if (vm.red[Upside1] > 0 || vm.green[Upside1] > 0 || vm.blue[Upside1] > 0) {
		// 		vm.getRuleCrashudHigh1();
		// 	}
		// 	if (vm.red[lctrl] > 0 || vm.green[lctrl] > 0 || vm.blue[lctrl] > 0) {
		// 		vm.getRuleCrashudHigh1();
		// 	}
		// }, 500)
		// var Upside1 = document.getElementById('Upside_1')
		// var lctrl = document.getElementById("lctrl_2")
		// var vm = this;
		// Upside1.addEventListener('webkitAnimationIteration', function () {
		// 	vm.getRuleCrashudHigh1();
		// })
		// lctrl.addEventListener('webkitAnimationIteration', function () {
		// 	vm.getRuleCrashudHigh1();
		// })
		this.DtoU1 = "upback1_high";
		this.DtoU2 = "upback2_high";
		this.DtoU3 = "upback3_high";
		this.DtoU4 = "upback4_high";
		this.DtoU5 = "upback5_high";
		this.DtoU6 = "upback6_high";
		this.DtoU7 = "upback7_high";
		this.UtoD1 = "upback8_high";
		this.UtoD2 = "upback9_high";
		this.UtoD3 = "upback10_high";
		this.UtoD4 = "upback11_high";
		this.UtoD5 = "upback12_high";
		this.UtoD6 = "upback13_high";
		this.UtoD7 = "upback14_high";
	}
	dtuCrash_slow() {     //下到上撞擊慢速
		this.thelastEffect = this.dtuCrash_slow;
		this.clear();
		this.KBClean()
		this.getColor1();
		this.getColor2();
		this.getColorA = this.getColor1
		this.getColorB = this.getColor2
		this.getPtA = this.attPt01;
		this.getPtB = this.attPt02;
		// this.getRuleCrashudSlow2();
		// var Upside1 = this.array1.indexOf('Upside_1')
		// var lctrl = this.array2.indexOf("lctrl_2")
		// var vm = this;
		// this.stop = setInterval(() => {
		// 	if (vm.red[Upside1] > 0 || vm.green[Upside1] > 0 || vm.blue[Upside1] > 0) {
		// 		vm.getRuleCrashudSlow1();
		// 	}
		// 	if (vm.red[lctrl] > 0 || vm.green[lctrl] > 0 || vm.blue[lctrl] > 0) {
		// 		vm.getRuleCrashudSlow1();
		// 	}
		// }, 500)
		// var Upside1 = document.getElementById('Upside_1')
		// var lctrl = document.getElementById("lctrl_2")
		// var vm = this;
		// Upside1.addEventListener('webkitAnimationIteration', function () {
		// 	vm.getRuleCrashudSlow1();
		// })
		// lctrl.addEventListener('webkitAnimationIteration', function () {
		// 	vm.getRuleCrashudSlow1();
		// })
		this.DtoU1 = "upback1_slow";
		this.DtoU2 = "upback2_slow";
		this.DtoU3 = "upback3_slow";
		this.DtoU4 = "upback4_slow";
		this.DtoU5 = "upback5_slow";
		this.DtoU6 = "upback6_slow";
		this.DtoU7 = "upback7_slow";
		this.UtoD1 = "upback8_slow";
		this.UtoD2 = "upback9_slow";
		this.UtoD3 = "upback10_slow";
		this.UtoD4 = "upback11_slow";
		this.UtoD5 = "upback12_slow";
		this.UtoD6 = "upback13_slow";
		this.UtoD7 = "upback14_slow";
	}
	ltrCrash_med() {     //左到右撞擊中速
		this.thelastEffect = this.ltrCrash_med; //存最後一個動畫效果
		this.clear();
		this.KBClean()
		this.getColor3()
		this.getColor4()
		this.getColorA = this.getColor3;
		this.getColorB = this.getColor4;
		this.getPtA = this.attPt03;
		this.getPtB = this.attPt04;
		// this.getRuleCrashlrMed2();
		// var esc = this.array3.indexOf('esc_3');
		// var numminus = this.array4.indexOf("numminus_4");
		// this.stop = setInterval(() => {
		// //console.log("esc R: " + vm.red[esc],"esc G: " + vm.green[esc], "esc B: "+ vm.blue[esc] )
		// //console.log("numminus R: " + vm.red[numminus],"numminus G: " + vm.green[numminus], "numminus B: "+ vm.blue[numminus] )
		// if (vm.red[esc] > 0 || vm.green[esc] > 0 || vm.blue[esc] > 0) {
		// vm.getRuleCrashlrMed1();
		// }
		// if (vm.red[numminus] > 0 || vm.green[numminus] > 0 || vm.blue[numminus] > 0) {
		// vm.getRuleCrashlrMed1();
		// }
		// }, 500)
		this.RtoL1 = "rtlcrash1_med";
		this.RtoL2 = "rtlcrash2_med";
		this.RtoL3 = "rtlcrash3_med";
		this.RtoL4 = "rtlcrash4_med";
		this.RtoL5 = "rtlcrash5_med";
		this.RtoL6 = "rtlcrash6_med";
		this.RtoL7 = "rtlcrash7_med";
		this.RtoL8 = "rtlcrash8_med";
		this.RtoL9 = "rtlcrash9_med";
		this.RtoL10 = "rtlcrash10_med";
		this.RtoL11 = "rtlcrash11_med";
		this.RtoL12 = "rtlcrash12_med";
		this.RtoL13 = "rtlcrash13_med";
		this.RtoL14 = "rtlcrash14_med";
		this.RtoL15 = "rtlcrash15_med";
		this.RtoL16 = "rtlcrash16_med";
		this.RtoL17 = "rtlcrash17_med";
		this.RtoL18 = "rtlcrash18_med";
		this.RtoL19 = "rtlcrash19_med";
		this.RtoL20 = "rtlcrash20_med";
		this.RtoL21 = "rtlcrash21_med";
		this.LtoR21 = "rtlcrash22_med";
		this.LtoR20 = "rtlcrash23_med";
		this.LtoR19 = "rtlcrash24_med";
		this.LtoR18 = "rtlcrash25_med";
		this.LtoR17 = "rtlcrash26_med";
		this.LtoR16 = "rtlcrash27_med";
		this.LtoR15 = "rtlcrash28_med";
		this.LtoR14 = "rtlcrash29_med";
		this.LtoR13 = "rtlcrash30_med";
		this.LtoR12 = "rtlcrash31_med";
		this.LtoR11 = "rtlcrash32_med";
		this.LtoR10 = "rtlcrash33_med";
		this.LtoR9 = "rtlcrash34_med";
		this.LtoR8 = "rtlcrash35_med";
		this.LtoR7 = "rtlcrash36_med";
		this.LtoR6 = "rtlcrash37_med";
		this.LtoR5 = "rtlcrash38_med";
		this.LtoR4 = "rtlcrash39_med";
		this.LtoR3 = "rtlcrash40_med";
		this.LtoR2 = "rtlcrash41_med";
		this.LtoR1 = "rtlcrash42_med";

	}

	ltrCrash_high() {     //左到右撞擊高速
		this.thelastEffect = this.ltrCrash_high;
		this.clear();
		this.KBClean()
		this.getColor3();
		this.getColor4();
		this.getColorA = this.getColor3;
		this.getColorB = this.getColor4;
		this.getPtA = this.attPt03;
		this.getPtB = this.attPt04;
		// this.getRuleCrashlrHigh2();
		// var esc = this.array3.indexOf('esc_3');
		// var numminus = this.array4.indexOf("numminus_4");
		// var vm = this;
		// this.stop = setInterval(() => {
		// 	if (vm.red[esc] > 0 || vm.green[esc] > 0 || vm.blue[esc] > 0) {
		// 		vm.getRuleCrashlrHigh1();
		// 	}
		// 	if (vm.red[numminus] > 0 || vm.green[numminus] > 0 || vm.blue[numminus] > 0) {
		// 		vm.getRuleCrashlrHigh1();
		// 	}
		// }, 500)
		// var esc = document.getElementById('esc_3')
		// var numminus = document.getElementById('numminus_4')
		// var vm = this
		// esc.addEventListener("webkitAnimationIteration", function () {
		// 	// vm.getRuleCrashlrHigh1();
		// 	//console.log('esc-change')
		// })
		// numminus.addEventListener('webkitAnimationIteration', function () {
		// 	// vm.getRuleCrashlrHigh1();
		// 	//console.log('numminus-change')
		// })
		this.RtoL1 = "rtlcrash1_high";
		this.RtoL2 = "rtlcrash2_high";
		this.RtoL3 = "rtlcrash3_high";
		this.RtoL4 = "rtlcrash4_high";
		this.RtoL5 = "rtlcrash5_high";
		this.RtoL6 = "rtlcrash6_high";
		this.RtoL7 = "rtlcrash7_high";
		this.RtoL8 = "rtlcrash8_high";
		this.RtoL9 = "rtlcrash9_high";
		this.RtoL10 = "rtlcrash10_high";
		this.RtoL11 = "rtlcrash11_high";
		this.RtoL12 = "rtlcrash12_high";
		this.RtoL13 = "rtlcrash13_high";
		this.RtoL14 = "rtlcrash14_high";
		this.RtoL15 = "rtlcrash15_high";
		this.RtoL16 = "rtlcrash16_high";
		this.RtoL17 = "rtlcrash17_high";
		this.RtoL18 = "rtlcrash18_high";
		this.RtoL19 = "rtlcrash19_high";
		this.RtoL20 = "rtlcrash20_high";
		this.RtoL21 = "rtlcrash21_high";
		this.LtoR21 = "rtlcrash22_high";
		this.LtoR20 = "rtlcrash23_high";
		this.LtoR19 = "rtlcrash24_high";
		this.LtoR18 = "rtlcrash25_high";
		this.LtoR17 = "rtlcrash26_high";
		this.LtoR16 = "rtlcrash27_high";
		this.LtoR15 = "rtlcrash28_high";
		this.LtoR14 = "rtlcrash29_high";
		this.LtoR13 = "rtlcrash30_high";
		this.LtoR12 = "rtlcrash31_high";
		this.LtoR11 = "rtlcrash32_high";
		this.LtoR10 = "rtlcrash33_high";
		this.LtoR9 = "rtlcrash34_high";
		this.LtoR8 = "rtlcrash35_high";
		this.LtoR7 = "rtlcrash36_high";
		this.LtoR6 = "rtlcrash37_high";
		this.LtoR5 = "rtlcrash38_high";
		this.LtoR4 = "rtlcrash39_high";
		this.LtoR3 = "rtlcrash40_high";
		this.LtoR2 = "rtlcrash41_high";
		this.LtoR1 = "rtlcrash42_high";
	}

	ltrCrash_slow() {     //左到右撞擊低速
		this.thelastEffect = this.ltrCrash_slow;
		this.clear();
		this.KBClean()
		this.getColor3();
		this.getColor4();
		this.getColorA = this.getColor3;
		this.getColorB = this.getColor4;
		this.getPtA = this.attPt03;
		this.getPtB = this.attPt04;
		// this.getRuleCrashlrSlow2();
		// var esc = this.array3.indexOf('esc_3');
		// var numminus = this.array4.indexOf("numminus_4");
		// var vm = this;
		// this.stop = setInterval(() => {
		// 	if (vm.red[esc] > 0 || vm.green[esc] > 0 || vm.blue[esc] > 0) {
		// 		vm.getRuleCrashlrSlow1();
		// 	}
		// 	if (vm.red[numminus] > 0 || vm.green[numminus] > 0 || vm.blue[numminus] > 0) {
		// 		vm.getRuleCrashlrSlow1();
		// 	}
		// }, 500)
		// var esc = document.getElementById('esc_3')
		// var numminus = document.getElementById('numminus_4')
		// var vm = this
		// esc.addEventListener("webkitAnimationIteration", function () {
		// 	vm.getRuleCrashlrSlow1();
		// })
		// numminus.addEventListener('webkitAnimationIteration', function () {
		// 	vm.getRuleCrashlrSlow1();
		// })
		this.RtoL1 = "rtlcrash1_slow";
		this.RtoL2 = "rtlcrash2_slow";
		this.RtoL3 = "rtlcrash3_slow";
		this.RtoL4 = "rtlcrash4_slow";
		this.RtoL5 = "rtlcrash5_slow";
		this.RtoL6 = "rtlcrash6_slow";
		this.RtoL7 = "rtlcrash7_slow";
		this.RtoL8 = "rtlcrash8_slow";
		this.RtoL9 = "rtlcrash9_slow";
		this.RtoL10 = "rtlcrash10_slow";
		this.RtoL11 = "rtlcrash11_slow";
		this.RtoL12 = "rtlcrash12_slow";
		this.RtoL13 = "rtlcrash13_slow";
		this.RtoL14 = "rtlcrash14_slow";
		this.RtoL15 = "rtlcrash15_slow";
		this.RtoL16 = "rtlcrash16_slow";
		this.RtoL17 = "rtlcrash17_slow";
		this.RtoL18 = "rtlcrash18_slow";
		this.RtoL19 = "rtlcrash19_slow";
		this.RtoL20 = "rtlcrash20_slow";
		this.RtoL21 = "rtlcrash21_slow";
		this.LtoR21 = "rtlcrash22_slow";
		this.LtoR20 = "rtlcrash23_slow";
		this.LtoR19 = "rtlcrash24_slow";
		this.LtoR18 = "rtlcrash25_slow";
		this.LtoR17 = "rtlcrash26_slow";
		this.LtoR16 = "rtlcrash27_slow";
		this.LtoR15 = "rtlcrash28_slow";
		this.LtoR14 = "rtlcrash29_slow";
		this.LtoR13 = "rtlcrash30_slow";
		this.LtoR12 = "rtlcrash31_slow";
		this.LtoR11 = "rtlcrash32_slow";
		this.LtoR10 = "rtlcrash33_slow";
		this.LtoR9 = "rtlcrash34_slow";
		this.LtoR8 = "rtlcrash35_slow";
		this.LtoR7 = "rtlcrash36_slow";
		this.LtoR6 = "rtlcrash37_slow";
		this.LtoR5 = "rtlcrash38_slow";
		this.LtoR4 = "rtlcrash39_slow";
		this.LtoR3 = "rtlcrash40_slow";
		this.LtoR2 = "rtlcrash41_slow";
		this.LtoR1 = "rtlcrash42_slow";
	}

	rtlCrash_med() {  //右到左撞擊中速
		this.thelastEffect = this.rtlCrash_med;
		this.clear();
		this.KBClean()
		this.getColor3();
		this.getColor4();
		this.getColorA = this.getColor3;
		this.getColorB = this.getColor4;
		this.getPtA = this.attPt03;
		this.getPtB = this.attPt04;
		// this.getRuleCrashlrMed2();
		// var esc = this.array3.indexOf('esc_3');
		// var numminus = this.array4.indexOf("numminus_4");
		// var vm = this;
		// this.stop = setInterval(() => {
		// 	if (vm.red[esc] > 0 || vm.green[esc] > 0 || vm.blue[esc] > 0) {
		// 		vm.getRuleCrashlrMed1();
		// 	}
		// 	if (vm.red[numminus] > 0 || vm.green[numminus] > 0 || vm.blue[numminus] > 0) {
		// 		vm.getRuleCrashlrMed1();
		// 	}
		// }, 500)
		// var esc = document.getElementById('esc_3')
		// var numminus = document.getElementById('numminus_4')
		// var vm = this
		// esc.addEventListener("webkitAnimationIteration", function () {
		// 	vm.getRuleCrashlrMed1();
		// })
		// numminus.addEventListener('webkitAnimationIteration', function () {
		// 	vm.getRuleCrashlrMed1();
		// })
		this.RtoL21 = "rtlcrash1_med";
		this.RtoL20 = "rtlcrash2_med";
		this.RtoL19 = "rtlcrash3_med";
		this.RtoL18 = "rtlcrash4_med";
		this.RtoL17 = "rtlcrash5_med";
		this.RtoL16 = "rtlcrash6_med";
		this.RtoL15 = "rtlcrash7_med";
		this.RtoL14 = "rtlcrash8_med";
		this.RtoL13 = "rtlcrash9_med";
		this.RtoL12 = "rtlcrash10_med";
		this.RtoL11 = "rtlcrash11_med";
		this.RtoL10 = "rtlcrash12_med";
		this.RtoL9 = "rtlcrash13_med";
		this.RtoL8 = "rtlcrash14_med";
		this.RtoL7 = "rtlcrash15_med";
		this.RtoL6 = "rtlcrash16_med";
		this.RtoL5 = "rtlcrash17_med";
		this.RtoL4 = "rtlcrash18_med";
		this.RtoL3 = "rtlcrash19_med";
		this.RtoL2 = "rtlcrash20_med";
		this.RtoL1 = "rtlcrash21_med";
		this.LtoR1 = "rtlcrash22_med";
		this.LtoR2 = "rtlcrash23_med";
		this.LtoR3 = "rtlcrash24_med";
		this.LtoR4 = "rtlcrash25_med";
		this.LtoR5 = "rtlcrash26_med";
		this.LtoR6 = "rtlcrash27_med";
		this.LtoR7 = "rtlcrash28_med";
		this.LtoR8 = "rtlcrash29_med";
		this.LtoR9 = "rtlcrash30_med";
		this.LtoR10 = "rtlcrash31_med";
		this.LtoR11 = "rtlcrash32_med";
		this.LtoR12 = "rtlcrash33_med";
		this.LtoR13 = "rtlcrash34_med";
		this.LtoR14 = "rtlcrash35_med";
		this.LtoR15 = "rtlcrash36_med";
		this.LtoR16 = "rtlcrash37_med";
		this.LtoR17 = "rtlcrash38_med";
		this.LtoR18 = "rtlcrash39_med";
		this.LtoR19 = "rtlcrash40_med";
		this.LtoR20 = "rtlcrash41_med";
		this.LtoR21 = "rtlcrash42_med";
	}

	rtlCrash_high() {  //右到左撞擊高速
		this.clear();
		this.KBClean()
		this.getColor3();
		this.getColor4();
		this.getColorA = this.getColor3;
		this.getColorB = this.getColor4;
		this.getPtA = this.attPt03;
		this.getPtB = this.attPt04;
		this.thelastEffect = this.rtlCrash_high;
		// this.getRuleCrashlrHigh2();
		// var esc = this.array3.indexOf('esc_3');
		// var numminus = this.array4.indexOf("numminus_4");
		// var vm = this;
		// this.stop = setInterval(() => {
		// 	if (vm.red[esc] > 0 || vm.green[esc] > 0 || vm.blue[esc] > 0) {
		// 		vm.getRuleCrashlrHigh1();
		// 	}
		// 	if (vm.red[numminus] > 0 || vm.green[numminus] > 0 || vm.blue[numminus] > 0) {
		// 		vm.getRuleCrashlrHigh1();
		// 	}
		// }, 500)
		// var esc = document.getElementById('esc_3')
		// var numminus = document.getElementById('numminus_4')
		// var vm = this
		// esc.addEventListener("webkitAnimationIteration", function () {
		// 	vm.getRuleCrashlrHigh1();
		// })
		// numminus.addEventListener('webkitAnimationIteration', function () {
		// 	vm.getRuleCrashlrHigh1();
		// })
		this.RtoL21 = "rtlcrash1_high";
		this.RtoL20 = "rtlcrash2_high";
		this.RtoL19 = "rtlcrash3_high";
		this.RtoL18 = "rtlcrash4_high";
		this.RtoL17 = "rtlcrash5_high";
		this.RtoL16 = "rtlcrash6_high";
		this.RtoL15 = "rtlcrash7_high";
		this.RtoL14 = "rtlcrash8_high";
		this.RtoL13 = "rtlcrash9_high";
		this.RtoL12 = "rtlcrash10_high";
		this.RtoL11 = "rtlcrash11_high";
		this.RtoL10 = "rtlcrash12_high";
		this.RtoL9 = "rtlcrash13_high";
		this.RtoL8 = "rtlcrash14_high";
		this.RtoL7 = "rtlcrash15_high";
		this.RtoL6 = "rtlcrash16_high";
		this.RtoL5 = "rtlcrash17_high";
		this.RtoL4 = "rtlcrash18_high";
		this.RtoL3 = "rtlcrash19_high";
		this.RtoL2 = "rtlcrash20_high";
		this.RtoL1 = "rtlcrash21_high";
		this.LtoR1 = "rtlcrash22_high";
		this.LtoR2 = "rtlcrash23_high";
		this.LtoR3 = "rtlcrash24_high";
		this.LtoR4 = "rtlcrash25_high";
		this.LtoR5 = "rtlcrash26_high";
		this.LtoR6 = "rtlcrash27_high";
		this.LtoR7 = "rtlcrash28_high";
		this.LtoR8 = "rtlcrash29_high";
		this.LtoR9 = "rtlcrash30_high";
		this.LtoR10 = "rtlcrash31_high";
		this.LtoR11 = "rtlcrash32_high";
		this.LtoR12 = "rtlcrash33_high";
		this.LtoR13 = "rtlcrash34_high";
		this.LtoR14 = "rtlcrash35_high";
		this.LtoR15 = "rtlcrash36_high";
		this.LtoR16 = "rtlcrash37_high";
		this.LtoR17 = "rtlcrash38_high";
		this.LtoR18 = "rtlcrash39_high";
		this.LtoR19 = "rtlcrash40_high";
		this.LtoR20 = "rtlcrash41_high";
		this.LtoR21 = "rtlcrash42_high";
	}

	rtlCrash_slow() {  //右到左撞擊慢速
		this.clear();
		this.KBClean()
		this.getColor3();
		this.getColor4();
		this.getColorA = this.getColor3;
		this.getColorB = this.getColor4;
		this.getPtA = this.attPt03;
		this.getPtB = this.attPt04;
		this.thelastEffect = this.rtlCrash_slow;
		// this.getRuleCrashlrSlow2();
		// var esc = this.array3.indexOf('esc_3');
		// var numminus = this.array4.indexOf("numminus_4");
		// var vm = this;
		// this.stop = setInterval(() => {
		// 	if (vm.red[esc] > 0 || vm.green[esc] > 0 || vm.blue[esc] > 0) {
		// 		vm.getRuleCrashlrSlow1();
		// 	}
		// 	if (vm.red[numminus] > 0 || vm.green[numminus] > 0 || vm.blue[numminus] > 0) {
		// 		vm.getRuleCrashlrSlow1();
		// 	}
		// }, 500)
		// var esc = document.getElementById('esc_3')
		// var numminus = document.getElementById('numminus_4')
		// var vm = this
		// esc.addEventListener("webkitAnimationIteration", function () {
		// 	vm.getRuleCrashlrSlow1();
		// })
		// numminus.addEventListener('webkitAnimationIteration', function () {
		// 	vm.getRuleCrashlrSlow1();
		// })
		this.RtoL21 = "rtlcrash1_slow";
		this.RtoL20 = "rtlcrash2_slow";
		this.RtoL19 = "rtlcrash3_slow";
		this.RtoL18 = "rtlcrash4_slow";
		this.RtoL17 = "rtlcrash5_slow";
		this.RtoL16 = "rtlcrash6_slow";
		this.RtoL15 = "rtlcrash7_slow";
		this.RtoL14 = "rtlcrash8_slow";
		this.RtoL13 = "rtlcrash9_slow";
		this.RtoL12 = "rtlcrash10_slow";
		this.RtoL11 = "rtlcrash11_slow";
		this.RtoL10 = "rtlcrash12_slow";
		this.RtoL9 = "rtlcrash13_slow";
		this.RtoL8 = "rtlcrash14_slow";
		this.RtoL7 = "rtlcrash15_slow";
		this.RtoL6 = "rtlcrash16_slow";
		this.RtoL5 = "rtlcrash17_slow";
		this.RtoL4 = "rtlcrash18_slow";
		this.RtoL3 = "rtlcrash19_slow";
		this.RtoL2 = "rtlcrash20_slow";
		this.RtoL1 = "rtlcrash21_slow";
		this.LtoR1 = "rtlcrash22_slow";
		this.LtoR2 = "rtlcrash23_slow";
		this.LtoR3 = "rtlcrash24_slow";
		this.LtoR4 = "rtlcrash25_slow";
		this.LtoR5 = "rtlcrash26_slow";
		this.LtoR6 = "rtlcrash27_slow";
		this.LtoR7 = "rtlcrash28_slow";
		this.LtoR8 = "rtlcrash29_slow";
		this.LtoR9 = "rtlcrash30_slow";
		this.LtoR10 = "rtlcrash31_slow";
		this.LtoR11 = "rtlcrash32_slow";
		this.LtoR12 = "rtlcrash33_slow";
		this.LtoR13 = "rtlcrash34_slow";
		this.LtoR14 = "rtlcrash35_slow";
		this.LtoR15 = "rtlcrash36_slow";
		this.LtoR16 = "rtlcrash37_slow";
		this.LtoR17 = "rtlcrash38_slow";
		this.LtoR18 = "rtlcrash39_slow";
		this.LtoR19 = "rtlcrash40_slow";
		this.LtoR20 = "rtlcrash41_slow";
		this.LtoR21 = "rtlcrash42_slow";
	}

	//小方框設定
	default: boolean = true;
	default02: boolean = false;

	setDefault(w) {
		document.getElementById('colorgp').style.display = "none";
		this.default = false;
		this.default02 = false;
		if (w == 1) {
			this.default = true;
			document.getElementById('colorgp').style.display = "none";
			this.getRuleCrashlrMed1();
			this.getRuleCrashlrHigh1();
			this.getRuleCrashlrSlow1();
			this.getRuleCrashudSlow1();
			this.getRuleCrashudMed1();
			this.getRuleCrashudHigh1();
			this.detectEffectChange();
		}
		if (w == 2) {
			this.default02 = true;
			document.getElementById('colorgp').style.display = "block";
			this.getRuleCrashlrMed2();
			this.getRuleCrashlrHigh2();
			this.getRuleCrashlrSlow2();
			this.getRuleCrashudSlow2();
			this.getRuleCrashudMed2();
			this.getRuleCrashudHigh2();
			this.detectEffectChange();
			// clearInterval(this.stop)
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
		R: "ff",
		G: "3f",
		B: "00"
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
			this.getRuleCrashlrMed2();
			this.getRuleCrashlrHigh2();
			this.getRuleCrashlrSlow2();
			this.getRuleCrashudSlow2();
			this.getRuleCrashudMed2();
			this.getRuleCrashudHigh2();
		}
		if (whichcolor == 2) {
			this.desideclrCss = {
				R: "ff",
				G: "3f",
				B: "00"
			};
			// this.pure_orange();
			this.defaultclr = "#" + (this.desideclrCss.R + this.desideclrCss.G + this.desideclrCss.B);
			this.getRuleCrashlrMed2();
			this.getRuleCrashlrHigh2();
			this.getRuleCrashlrSlow2();
			this.getRuleCrashudSlow2();
			this.getRuleCrashudMed2();
			this.getRuleCrashudHigh2();
		}
		if (whichcolor == 3) {
			this.desideclrCss = {
				R: "ff",
				G: "bf",
				B: "00"
			};
			// this.pure_yellow();
			this.defaultclr = "#" + (this.desideclrCss.R + this.desideclrCss.G + this.desideclrCss.B);
			this.getRuleCrashlrMed2();
			this.getRuleCrashlrHigh2();
			this.getRuleCrashlrSlow2();
			this.getRuleCrashudSlow2();
			this.getRuleCrashudMed2();
			this.getRuleCrashudHigh2();
		}

		if (whichcolor == 4) {
			this.desideclrCss = {
				R: "7f",
				G: "ff",
				B: "00"
			};
			// this.pure_green();
			this.defaultclr = "#" + (this.desideclrCss.R + this.desideclrCss.G + this.desideclrCss.B);
			this.getRuleCrashlrMed2();
			this.getRuleCrashlrHigh2();
			this.getRuleCrashlrSlow2();
			this.getRuleCrashudSlow2();
			this.getRuleCrashudMed2();
			this.getRuleCrashudHigh2();
		}
		if (whichcolor == 5) {
			this.desideclrCss = {
				R: "00",
				G: "ff",
				B: "ff"
			};
			// this.pure_lightblue();
			this.defaultclr = "#" + (this.desideclrCss.R + this.desideclrCss.G + this.desideclrCss.B);
			this.getRuleCrashlrMed2();
			this.getRuleCrashlrHigh2();
			this.getRuleCrashlrSlow2();
			this.getRuleCrashudSlow2();
			this.getRuleCrashudMed2();
			this.getRuleCrashudHigh2();
		}
		if (whichcolor == 6) {
			this.desideclrCss = {
				R: "00",
				G: "7f",
				B: "ff"
			};
			// this.pure_blue();
			this.defaultclr = "#" + (this.desideclrCss.R + this.desideclrCss.G + this.desideclrCss.B);
			this.getRuleCrashlrMed2();
			this.getRuleCrashlrHigh2();
			this.getRuleCrashlrSlow2();
			this.getRuleCrashudSlow2();
			this.getRuleCrashudMed2();
			this.getRuleCrashudHigh2();
		}
		if (whichcolor == 7) {
			this.desideclrCss = {
				R: "64",
				G: "00",
				B: "ff"
			};
			// this.pure_darkblue();
			this.defaultclr = "#" + (this.desideclrCss.R + this.desideclrCss.G + this.desideclrCss.B);
			this.getRuleCrashlrMed2();
			this.getRuleCrashlrHigh2();
			this.getRuleCrashlrSlow2();
			this.getRuleCrashudSlow2();
			this.getRuleCrashudMed2();
			this.getRuleCrashudHigh2();
		}
		if (whichcolor == 8) {
			this.desideclrCss = {
				R: "af",
				G: "26",
				B: "ff"
			};
			// this.pure_purple();
			this.defaultclr = "#" + (this.desideclrCss.R + this.desideclrCss.G + this.desideclrCss.B);
			this.getRuleCrashlrMed2();
			this.getRuleCrashlrHigh2();
			this.getRuleCrashlrSlow2();
			this.getRuleCrashudSlow2();
			this.getRuleCrashudMed2();
			this.getRuleCrashudHigh2();
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
			this.getRuleCrashlrMed2();
			this.getRuleCrashlrHigh2();
			this.getRuleCrashlrSlow2();
			this.getRuleCrashudSlow2();
			this.getRuleCrashudMed2();
			this.getRuleCrashudHigh2();
		}
		if (whichcolor == 2) {
			this.desideclrCss02 = {
				R: "ff",
				G: "3f",
				B: "00"
			};
			// this.pure_orange();
			this.defaultclr02 = "#" + (this.desideclrCss02.R + this.desideclrCss02.G + this.desideclrCss02.B);
			this.getRuleCrashlrMed2();
			this.getRuleCrashlrHigh2();
			this.getRuleCrashlrSlow2();
			this.getRuleCrashudSlow2();
			this.getRuleCrashudMed2();
			this.getRuleCrashudHigh2();
		}
		if (whichcolor == 3) {
			this.desideclrCss02 = {
				R: "ff",
				G: "bf",
				B: "00"
			};
			// this.pure_yellow();
			this.defaultclr02 = "#" + (this.desideclrCss02.R + this.desideclrCss02.G + this.desideclrCss02.B);
			this.getRuleCrashlrMed2();
			this.getRuleCrashlrHigh2();
			this.getRuleCrashlrSlow2();
			this.getRuleCrashudSlow2();
			this.getRuleCrashudMed2();
			this.getRuleCrashudHigh2();
		}

		if (whichcolor == 4) {
			this.desideclrCss02 = {
				R: "7f",
				G: "ff",
				B: "00"
			};
			// this.pure_green();
			this.defaultclr02 = "#" + (this.desideclrCss02.R + this.desideclrCss02.G + this.desideclrCss02.B);
			this.getRuleCrashlrMed2();
			this.getRuleCrashlrHigh2();
			this.getRuleCrashlrSlow2();
			this.getRuleCrashudSlow2();
			this.getRuleCrashudMed2();
			this.getRuleCrashudHigh2();
		}
		if (whichcolor == 5) {
			this.desideclrCss02 = {
				R: "00",
				G: "ff",
				B: "ff"
			};
			// this.pure_lightblue();
			this.defaultclr02 = "#" + (this.desideclrCss02.R + this.desideclrCss02.G + this.desideclrCss02.B);

			this.getRuleCrashlrMed2();
			this.getRuleCrashlrHigh2();
			this.getRuleCrashlrSlow2();
			this.getRuleCrashudSlow2();
			this.getRuleCrashudMed2();
			this.getRuleCrashudHigh2();
		}
		if (whichcolor == 6) {
			this.desideclrCss02 = {
				R: "00",
				G: "7f",
				B: "ff"
			};
			// this.pure_blue();
			this.defaultclr02 = "#" + (this.desideclrCss02.R + this.desideclrCss02.G + this.desideclrCss02.B);
			this.getRuleCrashlrMed2();
			this.getRuleCrashlrHigh2();
			this.getRuleCrashlrSlow2();
			this.getRuleCrashudSlow2();
			this.getRuleCrashudMed2();
			this.getRuleCrashudHigh2();
		}
		if (whichcolor == 7) {
			this.desideclrCss02 = {
				R: "64",
				G: "00",
				B: "ff"
			};
			// this.pure_darkblue();
			this.defaultclr02 = "#" + (this.desideclrCss02.R + this.desideclrCss02.G + this.desideclrCss02.B);
			this.getRuleCrashlrMed2();
			this.getRuleCrashlrHigh2();
			this.getRuleCrashlrSlow2();
			this.getRuleCrashudSlow2();
			this.getRuleCrashudMed2();
			this.getRuleCrashudHigh2();
		}
		if (whichcolor == 8) {
			this.desideclrCss02 = {
				R: "af",
				G: "26",
				B: "ff"
			};
			// this.pure_purple();
			this.defaultclr02 = "#" + (this.desideclrCss02.R + this.desideclrCss02.G + this.desideclrCss02.B);
			this.getRuleCrashlrMed2();
			this.getRuleCrashlrHigh2();
			this.getRuleCrashlrSlow2();
			this.getRuleCrashudSlow2();
			this.getRuleCrashudMed2();
			this.getRuleCrashudHigh2();
		}
	}

	//UI亮度調整
	op: any = "0.5";
	bright: any = "0.5";
	attOp: any;
	onInput(value) {
		this.detectEffectChange();
		this.op = value;
		let vm = this;
		if (this.getDeviceService.dataObj.status == 1) {
			vm.bright = value;
		}
		if (this.lightBS == 1) {
			this.attOp = this.op;
		}
	}

	sp: any = "60";
	SpeedInput(value) {
		//preview
		this.detectEffectChange();
		this.sp = value;
		this.speedMethod(value);
		let vm = this;
	}



	slowFun: any = this.ltrCrash_slow;
	medFun: any = this.ltrCrash_med;
	fastFun: any = this.ltrCrash_high;

	// dir: any = '0x00';
	speed: any = '60';

	//最先決定速度類型

	KBClean() { //把apmode下值的array清掉
		for (let i = 0; i < this.array1.length; i++) {
			this.red01[i] = 0;
			this.green01[i] = 0;
			this.blue01[i] = 0;
			this.red02[i] = 0;
			this.green02[i] = 0;
			this.blue02[i] = 0;
			this.red03[i] = 0;
			this.green03[i] = 0;
			this.blue03[i] = 0;
			this.red04[i] = 0;
			this.green04[i] = 0;
			this.blue04[i] = 0;
		}
	}
	stopDoAp: any;
	apFlag: any;
	effectDeside(w) {
		// this.detectEffectChange();
		let vm = this;
		if (w !== this.apFlag) {
			this.clear();
			this.KBClean();
			if(this.default == true){
				this.setDefault(1);
			}
			this.leave = 0;
			clearTimeout(this.stopDoAp);
			this.stopDoAp = setTimeout(() => {
				vm.leave = 1;
				vm.doApmode01();
			}, 200);
			clearInterval(this.getclr01);
			clearInterval(this.getclr02);
			clearInterval(this.getclr03);
			clearInterval(this.getclr04);
			// clearInterval(this.stop);
			this.saveGetcolorMode = false;
			if (w == 0) {
				//下到上
				this.Effectdirection = w;
				this.apFlag = w;
				this.detectEffectChange();
				this.slowFun = this.dtuCrash_slow;
				this.medFun = this.dtuCrash_med;
				this.fastFun = this.dtuCrash_high;
				// this.dir = '0x03';
				switch (true) {
					case this.sp == 100:
						this.slowFun();
						break;
					case this.sp == 60:
						this.medFun();
						break;
					case this.sp == 20:
						this.fastFun();
					default:
						break;
				}
			}
			if (w == 1) {
				//上到下
				this.Effectdirection = w;
				this.apFlag = w;
				this.detectEffectChange();
				this.slowFun = this.utdCrash_slow;
				this.medFun = this.utdCrash_med;
				this.fastFun = this.utdCrash_high;
				// this.dir = '0x02';
				switch (true) {
					case this.sp == 100:
						this.slowFun();
						break;
					case this.sp == 60:
						this.medFun();
						break;
					case this.sp == 20:
						this.fastFun();
					default:
						break;
				}
			}
			if (w == 2) {
				//右到左
				this.Effectdirection = w;
				this.apFlag = w;
				this.detectEffectChange();
				this.slowFun = this.rtlCrash_slow;
				this.medFun = this.rtlCrash_med;
				this.fastFun = this.rtlCrash_high;
				// this.dir = '0x01'
				switch (true) {
					case this.sp == 100:
						this.slowFun();
						break;
					case this.sp == 60:
						this.medFun();
						break;
					case this.sp == 20:
						this.fastFun();
					default:
						break;
				}
			}
			if (w == 3) {
				//左到右
				this.Effectdirection = w
				this.apFlag = w;
				this.detectEffectChange();
				this.slowFun = this.ltrCrash_slow;
				this.medFun = this.ltrCrash_med;
				this.fastFun = this.ltrCrash_high;
				// this.dir = '0x00'
				switch (true) {
					case this.sp == 100:
						this.slowFun();
						break;
					case this.sp == 60:
						this.medFun();
						break;
					case this.sp == 20:
						this.fastFun();
					default:
						break;
				}
			}
		}
	}



	speedMethod(s) {
		if(this.default == true){
			this.setDefault(1);
		}
		clearInterval(this.getclr01);
		clearInterval(this.getclr02);
		clearInterval(this.getclr03);
		clearInterval(this.getclr04);
		// clearInterval(this.stop);
		this.saveGetcolorMode = false;
		this.clear();
		this.KBClean();
		let vm = this;
		vm.speed = s;
		if (s == 20) {
			vm.fastFun();
		}
		if (s == 60) {
			vm.medFun();
		}
		if (s == 100) {
			vm.slowFun();
		} else {
			return false;
		}
	}

	color1: any = ["#E9004C", "#FF3F00", "#FFBF00", "#7FFF00", "#00FFFF", "#007FFF", "#6400FF", "#AF26FF"]
	color2: any = ["#E9004C", "#FF3F00", "#FFBF00", "#7FFF00", "#00FFFF", "#007FFF", "#6400FF", "#AF26FF"]
	cssRule: any = ""

	getRuleCrashlrMed1() {
		var rule;
		var ss = document.styleSheets;
		for (var i = 0; i < ss.length; i++) {
			for (var x = 0; x < ss[i]['cssRules'].length; x++) {
				rule = ss[i]['cssRules'][x];
				if (rule.name == "crashlrMed" && rule.type == rule.KEYFRAMES_RULE) {
					this.cssRule = rule;
				}
			}
		}
		var ran1 = Math.floor(Math.random() * 7)
		var ran2 = Math.floor(Math.random() * 7)
		this.cssRule.appendRule(`0% { background-color: ${this.color1[ran1]}}`);
		this.cssRule.appendRule(`4.5% { background-color: ${this.color2[ran2]}}`);
	}

	getRuleCrashlrMed2() {
		var rule;
		var ss = document.styleSheets;
		for (var i = 0; i < ss.length; i++) {
			for (var x = 0; x < ss[i]['cssRules'].length; x++) {
				rule = ss[i]['cssRules'][x];
				if (rule.name == "crashlrMed" && rule.type == rule.KEYFRAMES_RULE) {
					this.cssRule = rule;
				}
			}
		}
		this.cssRule.appendRule(`0% { background-color: ${this.defaultclr}}`);
		this.cssRule.appendRule(`4.5% { background-color: ${this.defaultclr02}}`);
		this.detectEffectChange();
	}

	getRuleCrashlrHigh1() {
		var rule;
		var ss = document.styleSheets;
		for (var i = 0; i < ss.length; i++) {
			for (var x = 0; x < ss[i]['cssRules'].length; x++) {
				rule = ss[i]['cssRules'][x];
				if (rule.name == "crashlrHigh" && rule.type == rule.KEYFRAMES_RULE) {
					this.cssRule = rule;
				}
			}
		}
		var ran1 = Math.floor(Math.random() * 7)
		var ran2 = Math.floor(Math.random() * 7)
		this.cssRule.appendRule(`0% { background-color: ${this.color1[ran1]}}`);
		this.cssRule.appendRule(`3.5% { background-color: ${this.color2[ran2]}}`);
	}

	getRuleCrashlrHigh2() {
		var rule;
		var ss = document.styleSheets;
		for (var i = 0; i < ss.length; i++) {
			for (var x = 0; x < ss[i]['cssRules'].length; x++) {
				rule = ss[i]['cssRules'][x];
				if (rule.name == "crashlrHigh" && rule.type == rule.KEYFRAMES_RULE) {
					this.cssRule = rule;
				}
			}
		}
		this.cssRule.appendRule(`0% { background-color: ${this.defaultclr}}`);
		this.cssRule.appendRule(`3.5% { background-color: ${this.defaultclr02}}`);
		this.detectEffectChange();
	}

	getRuleCrashlrSlow1() {
		var rule;
		var ss = document.styleSheets;
		for (var i = 0; i < ss.length; i++) {
			for (var x = 0; x < ss[i]['cssRules'].length; x++) {
				rule = ss[i]['cssRules'][x];
				if (rule.name == "crashlrSlow" && rule.type == rule.KEYFRAMES_RULE) {
					this.cssRule = rule;
				}
			}
		}
		var ran1 = Math.floor(Math.random() * 7)
		var ran2 = Math.floor(Math.random() * 7)
		this.cssRule.appendRule(`0% { background-color: ${this.color1[ran1]}}`);
		this.cssRule.appendRule(`5% { background-color: ${this.color2[ran2]}}`);
	}

	getRuleCrashlrSlow2() {
		var rule;
		var ss = document.styleSheets;
		for (var i = 0; i < ss.length; i++) {
			for (var x = 0; x < ss[i]['cssRules'].length; x++) {
				rule = ss[i]['cssRules'][x];
				if (rule.name == "crashlrSlow" && rule.type == rule.KEYFRAMES_RULE) {
					this.cssRule = rule;
				}
			}
		}
		this.cssRule.appendRule(`0% { background-color: ${this.defaultclr}}`);
		this.cssRule.appendRule(`5% { background-color: ${this.defaultclr02}}`);
		this.detectEffectChange();
	}
	getRuleCrashudSlow1() {
		var rule;
		var ss = document.styleSheets;
		for (var i = 0; i < ss.length; i++) {
			for (var x = 0; x < ss[i]['cssRules'].length; x++) {
				rule = ss[i]['cssRules'][x];
				if (rule.name == "crashudSlow" && rule.type == rule.KEYFRAMES_RULE) {
					this.cssRule = rule;
				}
			}
		}
		var ran1 = Math.floor(Math.random() * 7)
		var ran2 = Math.floor(Math.random() * 7)
		this.cssRule.appendRule(`0% { background-color: ${this.color1[ran1]}}`);
		this.cssRule.appendRule(`5% { background-color: ${this.color2[ran2]}}`);
	}

	getRuleCrashudSlow2() {
		var rule;
		var ss = document.styleSheets;
		for (var i = 0; i < ss.length; i++) {
			for (var x = 0; x < ss[i]['cssRules'].length; x++) {
				rule = ss[i]['cssRules'][x];
				if (rule.name == "crashudSlow" && rule.type == rule.KEYFRAMES_RULE) {
					this.cssRule = rule;
				}
			}
		}
		this.cssRule.appendRule(`0% { background-color: ${this.defaultclr}}`);
		this.cssRule.appendRule(`5% { background-color: ${this.defaultclr02}}`);
		this.detectEffectChange();
	}
	getRuleCrashudMed1() {
		var rule;
		var ss = document.styleSheets;
		for (var i = 0; i < ss.length; i++) {
			for (var x = 0; x < ss[i]['cssRules'].length; x++) {
				rule = ss[i]['cssRules'][x];
				if (rule.name == "crashudMed" && rule.type == rule.KEYFRAMES_RULE) {
					this.cssRule = rule;
				}
			}
		}
		var ran1 = Math.floor(Math.random() * 7)
		var ran2 = Math.floor(Math.random() * 7)
		this.cssRule.appendRule(`0% { background-color: ${this.color1[ran1]}}`);
		this.cssRule.appendRule(`4% { background-color: ${this.color2[ran2]}}`);

	}

	getRuleCrashudMed2() {
		var rule;
		var ss = document.styleSheets;
		for (var i = 0; i < ss.length; i++) {
			for (var x = 0; x < ss[i]['cssRules'].length; x++) {
				rule = ss[i]['cssRules'][x];
				if (rule.name == "crashudMed" && rule.type == rule.KEYFRAMES_RULE) {
					this.cssRule = rule;
				}
			}
		}
		this.cssRule.appendRule(`0% { background-color: ${this.defaultclr}}`);
		this.cssRule.appendRule(`4% { background-color: ${this.defaultclr02}}`);
		this.detectEffectChange();
	}
	getRuleCrashudHigh1() {
		var rule;
		var ss = document.styleSheets;
		for (var i = 0; i < ss.length; i++) {
			for (var x = 0; x < ss[i]['cssRules'].length; x++) {
				rule = ss[i]['cssRules'][x];
				if (rule.name == "crashudHigh" && rule.type == rule.KEYFRAMES_RULE) {
					this.cssRule = rule;
				}
			}
		}
		var ran1 = Math.floor(Math.random() * 7)
		var ran2 = Math.floor(Math.random() * 7)
		this.cssRule.appendRule(`0% { background-color: ${this.color1[ran1]}}`);
		this.cssRule.appendRule(`3% { background-color: ${this.color2[ran2]}}`);
	}

	getRuleCrashudHigh2() {
		var rule;
		var ss = document.styleSheets;
		for (var i = 0; i < ss.length; i++) {
			for (var x = 0; x < ss[i]['cssRules'].length; x++) {
				rule = ss[i]['cssRules'][x];
				if (rule.name == "crashudHigh" && rule.type == rule.KEYFRAMES_RULE) {
					this.cssRule = rule;
				}
			}
		}
		this.cssRule.appendRule(`0% { background-color: ${this.defaultclr}}`);
		this.cssRule.appendRule(`3% { background-color: ${this.defaultclr02}}`);
		this.detectEffectChange();
	}

	ranlrMed1() {
		var rule;
		var ss = document.styleSheets;
		for (var i = 0; i < ss.length; i++) {
			for (var x = 0; x < ss[i]['cssRules'].length; x++) {
				rule = ss[i]['cssRules'][x];
				if (rule.name == "crashlrMed" && rule.type == rule.KEYFRAMES_RULE) {
					this.cssRule = rule;
				}
			}
		}
		this.cssRule.appendRule(`0% { background-color: ${this.color1[0]}}`);
		this.cssRule.appendRule(`4.5% { background-color: ${this.color2[1]}}`);
	}
	ranlrMed2() {
		var rule;
		var ss = document.styleSheets;
		for (var i = 0; i < ss.length; i++) {
			for (var x = 0; x < ss[i]['cssRules'].length; x++) {
				rule = ss[i]['cssRules'][x];
				if (rule.name == "crashlrMed" && rule.type == rule.KEYFRAMES_RULE) {
					this.cssRule = rule;
				}
			}
		}
		this.cssRule.appendRule(`0% { background-color: ${this.color1[1]}}`);
		this.cssRule.appendRule(`4.5% { background-color: ${this.color2[2]}}`);
	}
	ranlrMed3() {
		var rule;
		var ss = document.styleSheets;
		for (var i = 0; i < ss.length; i++) {
			for (var x = 0; x < ss[i]['cssRules'].length; x++) {
				rule = ss[i]['cssRules'][x];
				if (rule.name == "crashlrMed" && rule.type == rule.KEYFRAMES_RULE) {
					this.cssRule = rule;
				}
			}
		}
		this.cssRule.appendRule(`0% { background-color: ${this.color1[2]}}`);
		this.cssRule.appendRule(`4.5% { background-color: ${this.color2[3]}}`);
	}
	ranlrMed4() {
		var rule;
		var ss = document.styleSheets;
		for (var i = 0; i < ss.length; i++) {
			for (var x = 0; x < ss[i]['cssRules'].length; x++) {
				rule = ss[i]['cssRules'][x];
				if (rule.name == "crashlrMed" && rule.type == rule.KEYFRAMES_RULE) {
					this.cssRule = rule;
				}
			}
		}
		this.cssRule.appendRule(`0% { background-color: ${this.color1[3]}}`);
		this.cssRule.appendRule(`4.5% { background-color: ${this.color2[4]}}`);
	}
	ranlrMed5() {
		var rule;
		var ss = document.styleSheets;
		for (var i = 0; i < ss.length; i++) {
			for (var x = 0; x < ss[i]['cssRules'].length; x++) {
				rule = ss[i]['cssRules'][x];
				if (rule.name == "crashlrMed" && rule.type == rule.KEYFRAMES_RULE) {
					this.cssRule = rule;
				}
			}
		}
		this.cssRule.appendRule(`0% { background-color: ${this.color1[4]}}`);
		this.cssRule.appendRule(`4.5% { background-color: ${this.color2[5]}}`);
	}
	ranlrMed6() {
		var rule;
		var ss = document.styleSheets;
		for (var i = 0; i < ss.length; i++) {
			for (var x = 0; x < ss[i]['cssRules'].length; x++) {
				rule = ss[i]['cssRules'][x];
				if (rule.name == "crashlrMed" && rule.type == rule.KEYFRAMES_RULE) {
					this.cssRule = rule;
				}
			}
		}
		this.cssRule.appendRule(`0% { background-color: ${this.color1[5]}}`);
		this.cssRule.appendRule(`4.5% { background-color: ${this.color2[6]}}`);
	}
	ranlrMed7() {
		var rule;
		var ss = document.styleSheets;
		for (var i = 0; i < ss.length; i++) {
			for (var x = 0; x < ss[i]['cssRules'].length; x++) {
				rule = ss[i]['cssRules'][x];
				if (rule.name == "crashlrMed" && rule.type == rule.KEYFRAMES_RULE) {
					this.cssRule = rule;
				}
			}
		}
		this.cssRule.appendRule(`0% { background-color: ${this.color1[6]}}`);
		this.cssRule.appendRule(`4.5% { background-color: ${this.color2[7]}}`);
	}
	ranlrMed8() {
		var rule;
		var ss = document.styleSheets;
		for (var i = 0; i < ss.length; i++) {
			for (var x = 0; x < ss[i]['cssRules'].length; x++) {
				rule = ss[i]['cssRules'][x];
				if (rule.name == "crashlrMed" && rule.type == rule.KEYFRAMES_RULE) {
					this.cssRule = rule;
				}
			}
		}
		this.cssRule.appendRule(`0% { background-color: ${this.color1[7]}}`);
		this.cssRule.appendRule(`4.5% { background-color: ${this.color2[0]}}`);
	}
	ranlrMed9() {
		var rule;
		var ss = document.styleSheets;
		for (var i = 0; i < ss.length; i++) {
			for (var x = 0; x < ss[i]['cssRules'].length; x++) {
				rule = ss[i]['cssRules'][x];
				if (rule.name == "crashlrMed" && rule.type == rule.KEYFRAMES_RULE) {
					this.cssRule = rule;
				}
			}
		}
		this.cssRule.appendRule(`0% { background-color: ${this.color1[3]}}`);
		this.cssRule.appendRule(`4.5% { background-color: ${this.color2[6]}}`);
	}
	ranlrMed10() {
		var rule;
		var ss = document.styleSheets;
		for (var i = 0; i < ss.length; i++) {
			for (var x = 0; x < ss[i]['cssRules'].length; x++) {
				rule = ss[i]['cssRules'][x];
				if (rule.name == "crashlrMed" && rule.type == rule.KEYFRAMES_RULE) {
					this.cssRule = rule;
				}
			}
		}
		this.cssRule.appendRule(`0% { background-color: ${this.color1[4]}}`);
		this.cssRule.appendRule(`4.5% { background-color: ${this.color2[0]}}`);

	}


	//速度
	FastSpeed: any = 20;
	MedSpeed: any = 60;
	SlowSpeed: any = 100;

	timerFlag: any = 0;
	@Input() sendFlag;
	@Input() profileName;
	doItfunction(position) {
		// //console.log('doit:' + position);
		// this.time++;計次
		// if (this.sendFlag == 1) {
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
						} else if (this.sp == this.MedSpeed) {
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
						} else if (this.sp == this.MedSpeed) {
							this.speedMethod(this.SlowSpeed);
							this.sp = this.SlowSpeed;
							this.speedhere = this.SlowSpeed;
							//console.log(this.sp);
						} else if (this.sp == this.SlowSpeed) {
							// alert('速度已調整為最慢');
							// //console.log(this.sp);
						}
					}

					if (doc[0].Light.Mode[position] == "Up_Left_Outside") {   //方向上左外

						this.presstime++;
						// //console.log('pressdtime:' + this.presstime);
						if (this.presstime == 1) { //上
							this.effectDeside(0)
							// //console.log("向上")
							// //console.log('pressdtime會是1');
						}
						else if (this.presstime == 2) {//左
							this.effectDeside(2);
							// //console.log("向左")
						}
						else if (this.presstime == 3) {
							this.effectDeside(0);
							this.presstime = 1;
						}
					}

					if (doc[0].Light.Mode[position] == "Down_Right_Inner") {   //方向下右內
						this.presstime++;
						// //console.log('pressdtime:' + this.presstime);
						if (this.presstime == 1) { //下
							this.effectDeside(1);
							// //console.log("向下")
						}
						else if (this.presstime == 2) {//右
							this.effectDeside(3);
							// //console.log("向左")
						}
						else if (this.presstime == 3) {
							this.effectDeside(1);
							this.presstime = 1;
						}
					}
					if (doc[0].Light.Mode[position] == "Open_CloseEffect") {
						// //console.log('stop');
						this.openclose++
						if (this.openclose == 1) {
							this.none();
						} else if (this.openclose == 2) {
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
					// //console.log("func名稱:"+ eval(doc[arrorder].Key.keyFunctionArr[position]));
					// eval(doc[arrorder].Key.keyFunctionArr[position]());

					// //console.log("func名稱:"+doc[this.arrorder].Key.keyFunctionArr);
				})
				this.timerFlag = 0;
			}, 1000);
		}
		// }
	}
	setIntoDB() {
		// this.openFrtpfun(1);

		this.nowobj.Light.LightSetting.LSbrightness[3] = this.op;
		this.nowobj.Light.LightSetting.LSspeed[3] = this.sp;
		this.nowobj.Light.LightSetting.LSdirection[3] = this.Effectdirection;
		this.nowobj.Light.LightSetting.changeTime[3] = this.timeValue;

		//console.log(this.timeValue);
		this.nowobj.Light.LightSetting.changeMode[3] = this.ttitle;



		// this.nowobj.Key.marcroContent[this.myKey] = this.setMacroarr;
		// //console.log(this.nowobj);


		this.db.UpdateProfile(this.nowobj.id, this.nowobj).then((doc: any) => {
			//console.log('setIntoDB success');
			//console.log(this.nowobj);
			this.openFrtpfun(0);

			// //console.log(doc[0]);
		});
	}

	clearAllInterval() {
		var highestIntervalId = setInterval(";");
		for (var i = 0; i < highestIntervalId; i++) {
			clearInterval(i);
		}
	}
	// clearAllTimeout(){
	// 	var highestTimeoutId = setTimeout(";");
	// 	for (var i = 0; i < highestTimeoutId; i++) {
	// 		clearTimeout(i);
	// 	}
	// }
	ngOnDestroy(): void {
		env.log('light-effect', 'crash', 'end');
		this.subscription.unsubscribe();
		//this.clearAllInterval();
		this.goOut();
	}

	@Output() sendTimeCloseFlag = new EventEmitter();
	@Input() check01;
	@Input() timeEffect;
	@Input() receiveTemp;
	@Output() CrashTemp = new EventEmitter();
	@Output() LightEffect = new EventEmitter();
	@Output() applyStatus = new EventEmitter();
	applyFlag: any = 1;
	lightEffect: any = 3;
	crash: any;
	crashObj() {
		this.crash = {
			'LightEffect': 3,
			'LSbrightness': this.op,
			'LSspeed': this.sp,
			'LSdirection': this.Effectdirection,
			'changeTime': this.timeValue,
			'ttitle': '撞击',
			'changeStatus': this.check01,
			'changeEffect': this.timeEffect,
			'ColorMode': this.default,
			'Color': {
				'defaultclr': this.defaultclr,
				'defaultclr02': this.defaultclr02,
			}
		}
		// this.CrashTemp.emit(this.crash);
		// this.LightEffect.emit(this.crash.LightEffect)
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
			// this.speedMethod(this.sp);
		} else if (this.speedValue == null || this.speedValue == undefined || this.speedValue == "") {
			this.sp = 60;
			// this.speedMethod(this.sp);
		}
		if (this.Effectdirection !== undefined && this.Effectdirection !== null && this.Effectdirection !== "") {
			this.effectDeside(this.Effectdirection);
			// console.log('crash effectdirection 111')
		} else {
			// this.Effectdirection = 3; //預設
			this.effectDeside(3);
			// console.log('crash effectdirection 111')
		}
		if (this.NewtimeValue !== undefined && this.NewtimeValue !== null && this.NewtimeValue !== "") {
			this.timeValue = this.NewtimeValue;
		}
		// else {
		// 	this.timeValue = 10;
		// }
		if (this.ttitle !== undefined && this.ttitle !== null && this.ttitle !== "") {
			this.sendTtile();
		} else {
			this.ttitle = '撞击';
		}

		if (this.default == true) {
			this.setDefault(1);
		} else {
			this.setDefault(2);
		}
	}
	sendApply() {
		if (this.timeEffect !== 3) {
			this.crashObj();
			setTimeout(() => {
				this.sendTimeCloseFlag.emit(this.check01);
				this.CrashTemp.emit(this.crash);
				this.LightEffect.emit(this.crash.LightEffect)
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
	// 	let pause = 19;
	// 	let insert = 45;
	// 	let ctrl = 17;
	// 	let d = 68;
	// 	let b = 66;
	// 	let g = 71;
	// 	let vm = this;
	// 	window.addEventListener('keydown', (e) => {
	// 		if (e.ctrlKey && e.keyCode == insert) {
	// 			vm.ek1 = 1;
	// 			window.addEventListener('keyup', (e) => {
	// 				if (e.keyCode == ctrl || e.keyCode == insert) {
	// 					if (vm.ek1 == 1) {
	// 						vm.ek1 = 0;
	// 						console.log('cancel debug')
	// 						return false
	// 					}
	// 				}
	// 			})
	// 		}

	// 		else if (e.shiftKey && e.keyCode == pause) {
	// 			vm.ek1 = 0;
	// 			vm.ek2 = 0;
	// 			vm.ek3 = 0;
	// 			vm.envio = 0;
	// 			console.log('close debug mode')
	// 			env.log('in rainbow', '關閉偵錯模式', 'close debug mode');
	// 		}

	// 		window.addEventListener('keydown', (e) => {
	// 			if (e.keyCode == d) {
	// 				if (vm.ek1 == 1) {
	// 					vm.ek2 = 1;
	// 				}
	// 			}
	// 		})
	// 		window.addEventListener('keydown', (e) => {
	// 			if (e.keyCode == b) {
	// 				if (vm.ek1 == 1 && vm.ek2 == 1) {
	// 					vm.ek3 = 1;
	// 				}
	// 			}
	// 		})
	// 		window.addEventListener('keydown', (e) => {
	// 			if (e.keyCode == g) {
	// 				if (vm.ek1 == 1 && vm.ek2 == 1 && vm.ek3 == 1) {
	// 					vm.envio = 1;
	// 					console.log('in debug mode')
	// 					env.log('in rainbow', '開啟偵錯模式', 'in debug mode');
	// 				}
	// 			}
	// 		})
	// 	})
	// }

}