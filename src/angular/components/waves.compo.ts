declare var System;
import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { protocolService } from '../services/service/protocol.service';
import { icpEventService } from '../services/service/icpEventService.service'

const { ipcRenderer } = System._nodeRequire('electron');
declare var $: any;

import { ElectronEventService, dbService, EmitService } from '../services/libs/electron/index';
import { GetDeviceService } from '../services/device/GetDevice.service';
import { Subscription } from "rxjs/Subscription";
import { ValueUnwrapper } from '@angular/compiler/src/private_import_core';



let evtVar = System._nodeRequire('./backend/others/eventVariable');
let funcVar = System._nodeRequire('./backend/others/FunctionVariable');
let env = System._nodeRequire('./backend/others/env');
@Component({
	selector: 'waves-effect',
	templateUrl: './components/effect/waves.compo.html',
	//template: '<h1>我的第一个 Angular 应用</h1>',
	styleUrls: ['./css/first.css', './css/kbd.css', "./css/waves.css", './css/attractlight.css'],
	providers: [protocolService, dbService, icpEventService],
	inputs: ['ProfileDetail', 'ttitle', 'getGameChange', 'updatenow', 'changeProfile']
})



export class wavesComponent implements OnInit {
	constructor(private protocol: protocolService, private db: dbService, private getDeviceService: GetDeviceService, private emitService: EmitService, private icpEventService: icpEventService) {
		// //console.log('float loading complete');
		this.keyMatrixMap[0] = ['19', 'stop', 'play/pause', 'next', 'r17', 'previous', 'l17', '116'];
		this.keyMatrixMap[1] = ['81', '9', '65', '27', '90', 'k150', '192', '49'];
		this.keyMatrixMap[2] = ['87', '20', '83', 'k45', '88', 'k132', '112', '50'];
		this.keyMatrixMap[3] = ['69', '114', '68', '115', '67', 'k151', '113', '51'];
		this.keyMatrixMap[4] = ['82', '84', '70', '71', '86', '66', '53', '52'];
		this.keyMatrixMap[5] = ['85', '89', '74', '72', '77', '78', '54', '55'];
		this.keyMatrixMap[6] = ['73', '221', '75', '117', '188', 'k56', '187', '56'];
		this.keyMatrixMap[7] = ['79', '118', '76', 'k14', '190', '93', '119', '57'];
		this.keyMatrixMap[8] = ['80', '219', '186', '222', 'k42', '191', '189', '48'];
		this.keyMatrixMap[9] = ['145', 'media select', 'v-', 'l18', 'v+', 'r18', 'mute', '44'];
		this.keyMatrixMap[10] = ['none', '8', '220', '122', '13', '123', '120', '121'];
		this.keyMatrixMap[11] = ['103', '100', '97', '32', '144', '40', '46', 'imc'];
		this.keyMatrixMap[12] = ['104', '101', '98', '96', '111', '39', '45', 'g mode'];
		this.keyMatrixMap[13] = ['105', '102', '99', '110', '106', '109', '33', '34'];
		this.keyMatrixMap[14] = ['107', '巴葡', 'num13', '38', 'none', '37', '36', '35'];
		this.keyMatrixMap[15] = ['none', 'l16', 'r16', 'k131', '91', 'fn', 'k133', 'none'];
		//data在這裡取得 icp emit過來的值 ↓↓
		this.subscription = this.emitService.EmitObservable.subscribe(src => {
			if (src == 'insert') {
				// this.setAPmode();//連續下值預備動作
				// this.detectButton();
				this.plugIn();
			}

			if (src == 'remove') {
				this.goOut();
				//console.log('out');
			}
			// //console.log(src);
			this.key = src;
			// this.vKey = this.key.vKey;
			// this.keyStatus = this.key.keyStatus;
			// this.Flag = this.key.Flag;
			// this.MakeMode = this.key.MakeMode
			this.Data = this.key.data
			if (this.Data !== undefined) {
				this.vKey = this.keyMatrixMap[this.Data[3]][this.Data[4]];
				this.keyStatus = this.Data[5];
				// //console.log('對應arr', this.Data[3]);
				// //console.log('vkey',this.vKey);
				// //console.log('Status', this.keyStatus);
				this.funcInIcp();
			}
			// //console.log("icp " + this.vKey);
			// //console.log("Mmode: " + this.MakeMode);
			// //console.log("Flag: " + this.Flag);
			// this.testKey();
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
					this.lightBar(0);
					this.attbtn = true;
					this.defaultLb = false;
				}
			}

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
	keyMatrixMap: any = []
	attbtn: boolean;
	defaultLb: boolean;
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
	timer: any = 0;
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
	key: any;
	vKey: any;
	keyStatus: any;
	MakeMode: any;
	Flag: any;
	Data: any;
	savechange: number = 0;
	currentV: any;
	changeV: any;

	timeValue: any = 10;
	timeCount: any;
	fnflag: number = 0;
	nowobj: any;
	ProfileDetail: any;
	// blockcss: any = "disabled";
	cuteValue: any = 0.5;
	speedValue: any = 50;
	loading: boolean;
	Effectdirection: any = 4;
	NewtimeValue: any = 10;
	ttitle: string;
	timewarn: boolean = false;
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

	@Output() outputTtile: EventEmitter<any> = new EventEmitter();

	sendTtile() {
		this.outputTtile.emit(this.ttitle);
	}

	@Output() passTime = new EventEmitter();

	@Input() attPt;

	// timeInput(e) {
	// 	this.detectEffectChange();
	// 	this.passTime.emit(e);
	// 	this.timeCount = e
	// 	var vm = this;
	// 	window.addEventListener('keydown', function (e) {
	// 		if (e.keyCode == 13) {
	// 			if (vm.timeCount < 1 || isNaN(vm.timeCount)) {
	// 				// alert('请输入 1 ~ 9999 之数值');
	// 				vm.timeValue = 10;
	// 				vm.timewarn = true
	// 				setTimeout(() => {
	// 					vm.timewarn = false;
	// 				}, 3000);
	// 			} else {
	// 				setTimeout(() => {
	// 					clearInterval(vm.getclr01);
	// 					vm.leave = 0;
	// 				}, vm.timeCount * 59990);
	// 			}
	// 			document.getElementById('time').blur();
	// 		}
	// 	})
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
			this.array1 = ["esc", "f1", "f2", "f3", "f4", "f5", "f6", "f7", "f8", "f9", "f10", "f11", "f12", "print", "scroll", "pause", "perid", "n1", "n2", "n3", "n4", "n5", "n6", "n7", "n8", "n9", "n0", "minus", "plus", "bsp", "insert", "home", "pup", "numlock", "numdrawn", "numtimes", "numminus", "tab", "q", "w", "e", "r", "t", "y", "u", "i", "o", "p", "lqu", "rqu", "delete", "drawn", "end", "pdown", "num7", "num8", "num9", "numplus", "caps", "a", "s", "d", "f", "g", "h", "j", "k", "l", "sem", "quo", "enter", "num4", "num5", "num6", "lshift", "z", "x", "c", "v", "b", "n", "m", "comma", "dot", "qmark", "rshift", "up", "num1", "num2", "num3", "numenter", "lctrl", "win", "lalt", "space", "ralt", "fn", "book", "rctrl", "left", "down", "right", "num0", "numdot", "Upside1", "Upside2", "Upside3", "Upside4", "Upside5", "Upside6", "Upside7", "Upside8", "Upside9", "Upside10", "Upside11", "Upside12", "Upside13", "Upside14", "Upside15", "Upside16", "Upside17", "Upside18", "Upside19", "Upside20", "logo1", "logo2"];
			this.logo1_att = "";
			this.logo2_att = "";
			// this.getColor1();
			this.attBar(1);
			this.sendLBS()
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
		this.protocol.RunSetFunction(obj3).then((data) => {
			// //console.log('detectButton1111');	
			// //console.log(data);
			if (data[5] == 1) {
				//console.log('按鈕位置在右邊')
				this.lightBar(0);
				this.attbtn = true;
				this.defaultLb = false;
			}
			else if (data[2] == 0) {
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

	ngOnInit() {
		env.log('light-effect', 'waves', 'start');
		this.timeValue = this.receiveTemp[3];
		this.check01 = false;
		this.WavesTemp.emit(this.waves);
		this.LEDmatrix();//找出對應按鍵;
		this.setDefault(1);
		this.readTemp();
		this.sendTimeCloseFlag.emit(false);

		if (this.lightBS == 0) {
			// //console.log("from parent LBS 0 attRight", this.lightBS);
			this.lightBar(0);
			this.attbtn = true;
			this.defaultLb = false;
		}
		else if (this.lightBS == 1) {
			// //console.log("from parent LBS 1 attLeft", this.lightBS)
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
			//if (this.envio == 1) {
				env.log('waves', 'apmode', 'stopapmode')
			//}
			// this.savechange = 0
			//console.log('222')
			// //console.log(this.savechange)
		}
		if (this.currentV == '"startApmode"' && this.savechange == 0) {
			this.savechange = 1;
			this.plugIn();
			this.attBar(0);
			//if (this.envio == 1) {
				env.log('waves', 'apmode', 'stopapmode')
			//}
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

	array1: any = ["esc", "f1", "f2", "f3", "f4", "f5", "f6", "f7", "f8", "f9", "f10", "f11", "f12", "print", "scroll", "pause", "perid", "n1", "n2", "n3", "n4", "n5", "n6", "n7", "n8", "n9", "n0", "minus", "plus", "bsp", "insert", "home", "pup", "numlock", "numdrawn", "numtimes", "numminus", "tab", "q", "w", "e", "r", "t", "y", "u", "i", "o", "p", "lqu", "rqu", "delete", "drawn", "end", "pdown", "num7", "num8", "num9", "numplus", "caps", "a", "s", "d", "f", "g", "h", "j", "k", "l", "sem", "quo", "enter", "num4", "num5", "num6", "lshift", "z", "x", "c", "v", "b", "n", "m", "comma", "dot", "qmark", "rshift", "up", "num1", "num2", "num3", "numenter", "lctrl", "win", "lalt", "space", "ralt", "fn", "book", "rctrl", "left", "down", "right", "num0", "numdot", "Upside1", "Upside2", "Upside3", "Upside4", "Upside5", "Upside6", "Upside7", "Upside8", "Upside9", "Upside10", "Upside11", "Upside12", "Upside13", "Upside14", "Upside15", "Upside16", "Upside17", "Upside18", "Upside19", "Upside20", "logo1", "logo2"];

	array2: any = ["esc_2", "f1_2", "f2_2", "f3_2", "f4_2", "f5_2", "f6_2", "f7_2", "f8_2", "f9_2", "f10_2", "f11_2", "f12_2", "print_2", "scroll_2", "pause_2", "perid_2", "n1_2", "n2_2", "n3_2", "n4_2", "n5_2", "n6_2", "n7_2", "n8_2", "n9_2", "n0_2", "minus_2", "plus_2", "bsp_2", "insert_2", "home_2", "pup_2", "numlock_2", "numdrawn_2", "numtimes_2", "numminus_2", "tab_2", "q_2", "w_2", "e_2", "r_2", "t_2", "y_2", "u_2", "i_2", "o_2", "p_2", "lqu_2", "rqu_2", "delete_2", "drawn_2", "end_2", "pdown_2", "num7_2", "num8_2", "num9_2", "numplus_2", "caps_2", "a_2", "s_2", "d_2", "f_2", "g_2", "h_2", "j_2", "k_2", "l_2", "sem_2", "quo_2", "enter_2", "num4_2", "num5_2", "num6_2", "lshift_2", "z_2", "x_2", "c_2", "v_2", "b_2", "n_2", "m_2", "comma_2", "dot_2", "qmark_2", "rshift_2", "up_2", "num1_2", "num2_2", "num3_2", "numenter_2", "lctrl_2", "win_2", "lalt_2", "space_2", "ralt_2", "fn_2", "book_2", "rctrl_2", "left_2", "down_2", "right_2", "num0_2", "numdot_2", "Upside1_2", "Upside2_2", "Upside3_2", "Upside4_2", "Upside5_2", "Upside6_2", "Upside7_2", "Upside8_2", "Upside9_2", "Upside10_2", "Upside11_2", "Upside12_2", "Upside13_2", "Upside14_2", "Upside15_2", "Upside16_2", "Upside17_2", "Upside18_2", "Upside19_2", "Upside20_2", "logo1_2", "logo2_2"];

	arrayKb1: any = ["esc", "f1", "f2", "f3", "f4", "f5", "f6", "f7", "f8", "f9", "f10", "f11", "f12", "print", "scroll", "pause", "perid", "n1", "n2", "n3", "n4", "n5", "n6", "n7", "n8", "n9", "n0", "minus", "plus", "bsp", "insert", "home", "pup", "numlock", "numdrawn", "numtimes", "numminus", "tab", "q", "w", "e", "r", "t", "y", "u", "i", "o", "p", "lqu", "rqu", "delete", "drawn", "end", "pdown", "num7", "num8", "num9", "numplus", "caps", "a", "s", "d", "f", "g", "h", "j", "k", "l", "sem", "quo", "enter", "num4", "num5", "num6", "lshift", "z", "x", "c", "v", "b", "n", "m", "comma", "dot", "qmark", "rshift", "up", "num1", "num2", "num3", "numenter", "lctrl", "win", "lalt", "space", "ralt", "fn", "book", "rctrl", "left", "down", "right", "num0", "numdot", "Upside1", "Upside2", "Upside3", "Upside4", "Upside5", "Upside6", "Upside7", "Upside8", "Upside9", "Upside10", "Upside11", "Upside12", "Upside13", "Upside14", "Upside15", "Upside16", "Upside17", "Upside18", "Upside19", "Upside20", "logo1", "logo2"]

	arrayAtt: any = ["esc_att", "f1_att", "f2_att", "f3_att", "f4_att", "f5_att", "f6_att", "f7_att", "f8_att", "f9_att", "f10_att", "f11_att", "f12_att", "print_att", "scroll_att", "pause_att", "perid_att", "n1_att", "n2_att", "n3_att", "n4_att", "n5_att", "n6_att", "n7_att", "n8_att", "n9_att", "n0_att", "minus_att", "plus_att", "bsp_att", "insert_att", "home_att", "pup_att", "numlock_att", "numdrawn_att", "numtimes_att", "numminus_att", "tab_att", "q_att", "w_att", "e_att", "r_att", "t_att", "y_att", "u_att", "i_att", "o_att", "p_att", "lqu_att", "rqu_att", "delete_att", "drawn_att", "end_att", "pdown_att", "num7_att", "num8_att", "num9_att", "numplus_att", "caps_att", "a_att", "s_att", "d_att", "f_att", "g_att", "h_att", "j_att", "k_att", "l_att", "sem_att", "quo_att", "enter_att", "num4_att", "num5_att", "num6_att", "lshift_att", "z_att", "x_att", "c_att", "v_att", "b_att", "n_att", "m_att", "comma_att", "dot_att", "qmark_att", "rshift_att", "up_att", "num1_att", "num2_att", "num3_att", "numenter_att", "lctrl_att", "win_att", "lalt_att", "space_att", "ralt_att", "fn_att", "book_att", "rctrl_att", "left_att", "down_att", "right_att", "num0_att", "numdot_att", "Upside1_att", "Upside2_att", "Upside3_att", "Upside4_att", "Upside5_att", "Upside6_att", "Upside7_att", "Upside8_att", "Upside9_att", "Upside10_att", "Upside11_att", "Upside12_att", "Upside13_att", "Upside14_att", "Upside15_att", "Upside16_att", "Upside17_att", "Upside18_att", "Upside19_att", "Upside20_att", "logo1_att", "logo2_att"]

	getclr01: any;
	getclr02: any;
	getPt: any;
	data: any = 1;
	upAtt: any = []

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

	getColor2() {
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
		} else if (this.data == 1) {
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

	//取值區

	red: any = new Buffer(new Array(126));
	green: any = new Buffer(new Array(126));
	blue: any = new Buffer(new Array(126));

	red01: any = new Buffer(new Array(126));
	green01: any = new Buffer(new Array(126));
	blue01: any = new Buffer(new Array(126));

	red02: any = new Buffer(new Array(126));
	green02: any = new Buffer(new Array(126));
	blue02: any = new Buffer(new Array(126));
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
		// //console.log('R'+this.positionR);
		// //console.log('G'+this.positionG);
		// //console.log('B'+this.positionB);

		if (this.saveapmode === false) { //設定一個布林值決定是否要執行下面的程式碼
			this.saveapmode = true;//一進入程式後就把判斷通道關閉，代表同一個時間，不會有兩個doapmode執行
			var apMode = new Buffer(new Array(480));
			if (this.data == 1) {
				for (let i = 0; i < this.array1.length; i++) {
					this.red[i] = ((this.red01[i] * 0.5 * 0.5 + this.red02[i] * 0.5) / 1 - 0.25);
					this.green[i] = ((this.green01[i] * 0.5 * 0.5 + this.green02[i] * 0.5) / 1 - 0.25);
					this.blue[i] = ((this.blue01[i] * 0.5 * 0.5 + this.blue02[i] * 0.5) / 1 - 0.25);
					apMode[this.positionRarr[i]] = this.red[i];
					apMode[this.positionGarr[i]] = this.green[i];
					apMode[this.positionBarr[i]] = this.blue[i];
				}
			}
			else if (this.data == 0) {
				for (let i = 0; i < this.array1.length - 22; i++) {
					this.red[i] = ((this.red01[i] * 0.5 * 0.5 + this.red02[i] * 0.5) / 1 - 0.25);
					this.green[i] = ((this.green01[i] * 0.5 * 0.5 + this.green02[i] * 0.5) / 1 - 0.25);
					this.blue[i] = ((this.blue01[i] * 0.5 * 0.5 + this.blue02[i] * 0.5) / 1 - 0.25);
					apMode[this.positionRarr[i]] = this.red[i];
					apMode[this.positionGarr[i]] = this.green[i];
					apMode[this.positionBarr[i]] = this.blue[i];
				}
				for (let j = 0; j < 22; j++) {
					this.red[j + 104] = this.red01[j + 104]
					this.green[j + 104] = this.green01[j + 104]
					this.blue[j + 104] = this.blue01[j + 104]
					apMode[this.positionRarr[j + 104]] = this.red[j + 104];
					apMode[this.positionGarr[j + 104]] = this.green[j + 104];
					apMode[this.positionBarr[j + 104]] = this.blue[j + 104];
				}

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

	thelastEffect: any = this.wavesOut_med;


	letsgoout: boolean = true;
	letsgoIn: boolean = false;
	plugIn() {
		clearInterval(this.getclr01);
		clearInterval(this.getclr02)
		this.leave = 0;
		// this.letsgoout = false;
		// this.letsgoIn = true;

		this.goIn();
	}

	none() {
		clearInterval(this.getclr01);
		clearInterval(this.getclr02)
		this.leave = 0;
		// this.letsgoout = false;
		// this.letsgoIn = true;
		this.cleanApmode();
		this.savechange = 0;
	}

	goOut() {
		clearInterval(this.getclr01);
		clearInterval(this.getclr02)
		clearInterval(this.stopAtt)
		this.leave = 0;
		this.letsgoout = false;
		this.letsgoIn = true;
		this.savechange = 0;

	}
	goIn() {
		// this.setAPmode();//連續下值預備動作
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

	esc_2: any = "";
	f1_2: any = "";
	f2_2: any = "";
	f3_2: any = "";
	f4_2: any = "";
	f5_2: any = "";
	f6_2: any = "";
	f7_2: any = "";
	f8_2: any = "";
	f9_2: any = "";
	f10_2: any = "";
	f11_2: any = "";
	f12_2: any = "";
	print_2: any = "";
	scroll_2: any = "";
	pause_2: any = "";
	perid_2: any = "";
	n1_2: any = "";
	n2_2: any = "";
	n3_2: any = "";
	n4_2: any = "";
	n5_2: any = "";
	n6_2: any = "";
	n7_2: any = "";
	n8_2: any = "";
	n9_2: any = "";
	n0_2: any = "";
	minus_2: any = "";
	plus_2: any = "";
	bsp_2: any = "";
	insert_2: any = "";
	home_2: any = "";
	pup_2: any = "";
	numlock_2: any = "";
	numdrawn_2: any = "";
	numtimes_2: any = "";
	numminus_2: any = "";
	tab_2: any = "";
	q_2: any = "";
	w_2: any = "";
	e_2: any = "";
	r_2: any = "";
	t_2: any = "";
	y_2: any = "";
	u_2: any = "";
	i_2: any = "";
	o_2: any = "";
	p_2: any = "";
	lqu_2: any = "";
	rqu_2: any = "";
	delete_2: any = "";
	drawn_2: any = "";
	end_2: any = "";
	pdown_2: any = "";
	num7_2: any = "";
	num8_2: any = "";
	num9_2: any = "";
	numplus_2: any = "";
	caps_2: any = "";
	a_2: any = "";
	s_2: any = "";
	d_2: any = "";
	f_2: any = "";
	g_2: any = "";
	h_2: any = "";
	j_2: any = "";
	k_2: any = "";
	l_2: any = "";
	sem_2: any = "";
	quo_2: any = "";
	enter_2: any = "";
	num4_2: any = "";
	num5_2: any = "";
	num6_2: any = "";
	lshift_2: any = "";
	z_2: any = "";
	x_2: any = "";
	c_2: any = "";
	v_2: any = "";
	b_2: any = "";
	n_2: any = "";
	m_2: any = "";
	comma_2: any = "";
	dot_2: any = "";
	qmark_2: any = "";
	rshift_2: any = "";
	up_2: any = "";
	num1_2: any = "";
	num2_2: any = "";
	num3_2: any = "";
	numenter_2: any = "";
	lctrl_2: any = "";
	win_2: any = "";
	lalt_2: any = "";
	space_2: any = "";
	ralt_2: any = "";
	fn_2: any = "";
	book_2: any = "";
	rctrl_2: any = "";
	left_2: any = "";
	down_2: any = "";
	right_2: any = "";
	num0_2: any = "";
	numdot_2: any = "";

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

	LtoR1_2: any = "";
	LtoR2_2: any = "";
	LtoR3_2: any = "";
	LtoR4_2: any = "";
	LtoR5_2: any = "";
	LtoR6_2: any = "";
	LtoR7_2: any = "";
	LtoR8_2: any = "";
	LtoR9_2: any = "";
	LtoR10_2: any = "";

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
	}

	clear2() {
		this.esc_2 = "";
		this.f1_2 = "";
		this.f2_2 = "";
		this.f3_2 = "";
		this.f4_2 = "";
		this.f5_2 = "";
		this.f6_2 = "";
		this.f7_2 = "";
		this.f8_2 = "";
		this.f9_2 = "";
		this.f10_2 = "";
		this.f11_2 = "";
		this.f12_2 = "";
		this.print_2 = "";
		this.scroll_2 = "";
		this.pause_2 = "";
		this.perid_2 = "";
		this.n1_2 = "";
		this.n2_2 = "";
		this.n3_2 = "";
		this.n4_2 = "";
		this.n5_2 = "";
		this.n6_2 = "";
		this.n7_2 = "";
		this.n8_2 = "";
		this.n9_2 = "";
		this.n0_2 = "";
		this.minus_2 = "";
		this.plus_2 = "";
		this.bsp_2 = "";
		this.insert_2 = "";
		this.home_2 = "";
		this.pup_2 = "";
		this.numlock_2 = "";
		this.numdrawn_2 = "";
		this.numtimes_2 = "";
		this.numminus_2 = "";
		this.tab_2 = "";
		this.q_2 = "";
		this.w_2 = "";
		this.e_2 = "";
		this.r_2 = "";
		this.t_2 = "";
		this.y_2 = "";
		this.u_2 = "";
		this.i_2 = "";
		this.o_2 = "";
		this.p_2 = "";
		this.lqu_2 = "";
		this.rqu_2 = "";
		this.delete_2 = "";
		this.drawn_2 = "";
		this.end_2 = "";
		this.pdown_2 = "";
		this.num7_2 = "";
		this.num8_2 = "";
		this.num9_2 = "";
		this.numplus_2 = "";
		this.caps_2 = "";
		this.a_2 = "";
		this.s_2 = "";
		this.d_2 = "";
		this.f_2 = "";
		this.g_2 = "";
		this.h_2 = "";
		this.j_2 = "";
		this.k_2 = "";
		this.l_2 = "";
		this.sem_2 = "";
		this.quo_2 = "";
		this.enter_2 = "";
		this.num4_2 = "";
		this.num5_2 = "";
		this.num6_2 = "";
		this.lshift_2 = "";
		this.z_2 = "";
		this.x_2 = "";
		this.c_2 = "";
		this.v_2 = "";
		this.b_2 = "";
		this.n_2 = "";
		this.m_2 = "";
		this.comma_2 = "";
		this.dot_2 = "";
		this.qmark_2 = "";
		this.rshift_2 = "";
		this.up_2 = "";
		this.num1_2 = "";
		this.num2_2 = "";
		this.num3_2 = "";
		this.numenter_2 = "";
		this.lctrl_2 = "";
		this.win_2 = "";
		this.lalt_2 = "";
		this.space_2 = "";
		this.ralt_2 = "";
		this.fn_2 = "";
		this.book_2 = "";
		this.rctrl_2 = "";
		this.left_2 = "";
		this.down_2 = "";
		this.right_2 = "";
		this.num0_2 = "";
		this.numdot_2 = "";
		this.LtoR1_2 = "";
		this.LtoR2_2 = "";
		this.LtoR3_2 = "";
		this.LtoR4_2 = "";
		this.LtoR5_2 = "";
		this.LtoR6_2 = "";
		this.LtoR7_2 = "";
		this.LtoR8_2 = "";
		this.LtoR9_2 = "";
		this.LtoR10_2 = "";
	}

	num: any = 0;
	funcSet = "_med"

	funcInIcp() {
		switch (true) {
			case this.vKey == 27 && this.keyStatus == 1: //esc
				if (this.num == 0) {
					this.clear();
					setTimeout(() => {
						this.esc = "waves1_1" + this.funcSet;
						this.LtoR1 = "waves2_1" + this.funcSet;
						this.LtoR2 = "waves3_1" + this.funcSet;
						this.LtoR3 = "waves4_1" + this.funcSet;
						this.LtoR4 = "waves5_1" + this.funcSet;
						this.LtoR5 = "waves6_1" + this.funcSet;
						this.LtoR6 = "waves7_1" + this.funcSet;
						this.LtoR7 = "waves8_1" + this.funcSet;
						this.LtoR8 = "waves9_1" + this.funcSet;
						this.LtoR9 = "waves10_1" + this.funcSet;
						this.LtoR10 = "waves11_1" + this.funcSet;
					}, 10);
					this.num = 1
				}
				else if (this.num == 1) {
					this.clear2();
					setTimeout(() => {
						this.esc_2 = "waves1_2" + this.funcSet;
						this.LtoR1_2 = "waves2_2" + this.funcSet;
						this.LtoR2_2 = "waves3_2" + this.funcSet;
						this.LtoR3_2 = "waves4_2" + this.funcSet;
						this.LtoR4_2 = "waves5_2" + this.funcSet;
						this.LtoR5_2 = "waves6_2" + this.funcSet;
						this.LtoR6_2 = "waves7_2" + this.funcSet;
						this.LtoR7_2 = "waves8_2" + this.funcSet;
						this.LtoR8_2 = "waves9_2" + this.funcSet;
						this.LtoR9_2 = "waves10_2" + this.funcSet;
						this.LtoR10_2 = "waves11_2" + this.funcSet;
					}, 10)
					this.num = 0
				}
				break;

			case this.vKey == 112 && this.keyStatus == 1: //f1
				if (this.num == 0) {
					this.clear();
					setTimeout(() => {
						this.f1 = "waves1_1" + this.funcSet;
						this.LtoR1 = "waves3_1" + this.funcSet;
						this.LtoR2 = "waves2_1" + this.funcSet;
						this.LtoR3 = "waves3_1" + this.funcSet;
						this.LtoR4 = "waves4_1" + this.funcSet;
						this.LtoR5 = "waves5_1" + this.funcSet;
						this.LtoR6 = "waves6_1" + this.funcSet;
						this.LtoR7 = "waves7_1" + this.funcSet;
						this.LtoR8 = "waves8_1" + this.funcSet;
						this.LtoR9 = "waves9_1" + this.funcSet;
						this.LtoR10 = "waves10_1" + this.funcSet;
					}, 10);
					this.num = 1
				}
				else if (this.num == 1) {
					this.clear2();
					setTimeout(() => {
						this.f1_2 = "waves1_2" + this.funcSet;
						this.LtoR1_2 = "waves3_2" + this.funcSet;
						this.LtoR2_2 = "waves2_2" + this.funcSet;
						this.LtoR3_2 = "waves3_2" + this.funcSet;
						this.LtoR4_2 = "waves4_2" + this.funcSet;
						this.LtoR5_2 = "waves5_2" + this.funcSet;
						this.LtoR6_2 = "waves6_2" + this.funcSet;
						this.LtoR7_2 = "waves7_2" + this.funcSet;
						this.LtoR8_2 = "waves8_2" + this.funcSet;
						this.LtoR9_2 = "waves9_2" + this.funcSet;
						this.LtoR10_2 = "waves10_2" + this.funcSet;
					}, 10)
					this.num = 0
				}
				break;

			case this.vKey == 113 && this.keyStatus == 1: //f2
				if (this.num == 0) {
					this.clear();
					setTimeout(() => {
						this.f2 = "waves1_1" + this.funcSet;
						this.LtoR1 = "waves3_1" + this.funcSet;
						this.LtoR2 = "waves2_1" + this.funcSet;
						this.LtoR3 = "waves3_1" + this.funcSet;
						this.LtoR4 = "waves4_1" + this.funcSet;
						this.LtoR5 = "waves5_1" + this.funcSet;
						this.LtoR6 = "waves6_1" + this.funcSet;
						this.LtoR7 = "waves7_1" + this.funcSet;
						this.LtoR8 = "waves8_1" + this.funcSet;
						this.LtoR9 = "waves9_1" + this.funcSet;
						this.LtoR10 = "waves10_1" + this.funcSet;
					}, 10);
					this.num = 1
				}
				else if (this.num == 1) {
					this.clear2();
					setTimeout(() => {
						this.f2_2 = "waves1_2" + this.funcSet;
						this.LtoR1_2 = "waves3_2" + this.funcSet;
						this.LtoR2_2 = "waves2_2" + this.funcSet;
						this.LtoR3_2 = "waves3_2" + this.funcSet;
						this.LtoR4_2 = "waves4_2" + this.funcSet;
						this.LtoR5_2 = "waves5_2" + this.funcSet;
						this.LtoR6_2 = "waves6_2" + this.funcSet;
						this.LtoR7_2 = "waves7_2" + this.funcSet;
						this.LtoR8_2 = "waves8_2" + this.funcSet;
						this.LtoR9_2 = "waves9_2" + this.funcSet;
						this.LtoR10_2 = "waves10_2" + this.funcSet;
					}, 10)
					this.num = 0
				}
				break;

			case this.vKey == 114 && this.keyStatus == 1: //f3
				if (this.num == 0) {
					this.clear();
					setTimeout(() => {
						this.f3 = "waves1_1" + this.funcSet;
						this.LtoR1 = "waves4_1" + this.funcSet;
						this.LtoR2 = "waves3_1" + this.funcSet;
						this.LtoR3 = "waves2_1" + this.funcSet;
						this.LtoR4 = "waves3_1" + this.funcSet;
						this.LtoR5 = "waves4_1" + this.funcSet;
						this.LtoR6 = "waves5_1" + this.funcSet;
						this.LtoR7 = "waves6_1" + this.funcSet;
						this.LtoR8 = "waves7_1" + this.funcSet;
						this.LtoR9 = "waves8_1" + this.funcSet;
						this.LtoR10 = "waves9_1" + this.funcSet;
					}, 10);
					this.num = 1
				}
				else if (this.num == 1) {
					this.clear2();
					setTimeout(() => {
						this.f3_2 = "waves1_2" + this.funcSet;
						this.LtoR1_2 = "waves4_2" + this.funcSet;
						this.LtoR2_2 = "waves3_2" + this.funcSet;
						this.LtoR3_2 = "waves2_2" + this.funcSet;
						this.LtoR4_2 = "waves3_2" + this.funcSet;
						this.LtoR5_2 = "waves4_2" + this.funcSet;
						this.LtoR6_2 = "waves5_2" + this.funcSet;
						this.LtoR7_2 = "waves6_2" + this.funcSet;
						this.LtoR8_2 = "waves7_2" + this.funcSet;
						this.LtoR9_2 = "waves8_2" + this.funcSet;
						this.LtoR10_2 = "waves9_2" + this.funcSet;
					}, 10)
					this.num = 0
				}
				break;

			case this.vKey == 115 && this.keyStatus == 1: //f4
				if (this.num == 0) {
					this.clear();
					setTimeout(() => {
						this.f4 = "waves1_1" + this.funcSet;
						this.LtoR1 = "waves4_1" + this.funcSet;
						this.LtoR2 = "waves3_1" + this.funcSet;
						this.LtoR3 = "waves2_1" + this.funcSet;
						this.LtoR4 = "waves3_1" + this.funcSet;
						this.LtoR5 = "waves4_1" + this.funcSet;
						this.LtoR6 = "waves5_1" + this.funcSet;
						this.LtoR7 = "waves6_1" + this.funcSet;
						this.LtoR8 = "waves7_1" + this.funcSet;
						this.LtoR9 = "waves8_1" + this.funcSet;
						this.LtoR10 = "waves9_1" + this.funcSet;
					}, 10);
					this.num = 1
				}
				else if (this.num == 1) {
					this.clear2();
					setTimeout(() => {
						this.f4_2 = "waves1_2" + this.funcSet;
						this.LtoR1_2 = "waves4_2" + this.funcSet;
						this.LtoR2_2 = "waves3_2" + this.funcSet;
						this.LtoR3_2 = "waves2_2" + this.funcSet;
						this.LtoR4_2 = "waves3_2" + this.funcSet;
						this.LtoR5_2 = "waves4_2" + this.funcSet;
						this.LtoR6_2 = "waves5_2" + this.funcSet;
						this.LtoR7_2 = "waves6_2" + this.funcSet;
						this.LtoR8_2 = "waves7_2" + this.funcSet;
						this.LtoR9_2 = "waves8_2" + this.funcSet;
						this.LtoR10_2 = "waves9_2" + this.funcSet;
					}, 10)
					this.num = 0
				}
				break;

			case this.vKey == 116 && this.keyStatus == 1: //f5
				if (this.num == 0) {
					this.clear();
					setTimeout(() => {
						this.f5 = "waves1_1" + this.funcSet;
						this.LtoR1 = "waves5_1" + this.funcSet;
						this.LtoR2 = "waves4_1" + this.funcSet;
						this.LtoR3 = "waves3_1" + this.funcSet;
						this.LtoR4 = "waves2_1" + this.funcSet;
						this.LtoR5 = "waves3_1" + this.funcSet;
						this.LtoR6 = "waves4_1" + this.funcSet;
						this.LtoR7 = "waves5_1" + this.funcSet;
						this.LtoR8 = "waves6_1" + this.funcSet;
						this.LtoR9 = "waves7_1" + this.funcSet;
						this.LtoR10 = "waves8_1" + this.funcSet;
					}, 10);
					this.num = 1
				}
				else if (this.num == 1) {
					this.clear2();
					setTimeout(() => {
						this.f5_2 = "waves1_2" + this.funcSet;
						this.LtoR1_2 = "waves5_2" + this.funcSet;
						this.LtoR2_2 = "waves4_2" + this.funcSet;
						this.LtoR3_2 = "waves3_2" + this.funcSet;
						this.LtoR4_2 = "waves2_2" + this.funcSet;
						this.LtoR5_2 = "waves3_2" + this.funcSet;
						this.LtoR6_2 = "waves4_2" + this.funcSet;
						this.LtoR7_2 = "waves5_2" + this.funcSet;
						this.LtoR8_2 = "waves6_2" + this.funcSet;
						this.LtoR9_2 = "waves7_2" + this.funcSet;
						this.LtoR10_2 = "waves8_2" + this.funcSet;
					}, 10)
					this.num = 0
				}
				break;

			case this.vKey == 117 && this.keyStatus == 1: //f6
				if (this.num == 0) {
					this.clear();
					setTimeout(() => {
						this.f6 = "waves1_1" + this.funcSet;
						this.LtoR1 = "waves5_1" + this.funcSet;
						this.LtoR2 = "waves4_1" + this.funcSet;
						this.LtoR3 = "waves3_1" + this.funcSet;
						this.LtoR4 = "waves2_1" + this.funcSet;
						this.LtoR5 = "waves3_1" + this.funcSet;
						this.LtoR6 = "waves4_1" + this.funcSet;
						this.LtoR7 = "waves5_1" + this.funcSet;
						this.LtoR8 = "waves6_1" + this.funcSet;
						this.LtoR9 = "waves7_1" + this.funcSet;
						this.LtoR10 = "waves8_1" + this.funcSet;
					}, 10);
					this.num = 1
				}
				else if (this.num == 1) {
					this.clear2();
					setTimeout(() => {
						this.f6_2 = "waves1_2" + this.funcSet;
						this.LtoR1_2 = "waves5_2" + this.funcSet;
						this.LtoR2_2 = "waves4_2" + this.funcSet;
						this.LtoR3_2 = "waves3_2" + this.funcSet;
						this.LtoR4_2 = "waves2_2" + this.funcSet;
						this.LtoR5_2 = "waves3_2" + this.funcSet;
						this.LtoR6_2 = "waves4_2" + this.funcSet;
						this.LtoR7_2 = "waves5_2" + this.funcSet;
						this.LtoR8_2 = "waves6_2" + this.funcSet;
						this.LtoR9_2 = "waves7_2" + this.funcSet;
						this.LtoR10_2 = "waves8_2" + this.funcSet;
					}, 10)
					this.num = 0
				}
				break;

			case this.vKey == 118 && this.keyStatus == 1: //f7
				if (this.num == 0) {
					this.clear();
					setTimeout(() => {
						this.f7 = "waves1_1" + this.funcSet;
						this.LtoR1 = "waves6_1" + this.funcSet;
						this.LtoR2 = "waves5_1" + this.funcSet;
						this.LtoR3 = "waves4_1" + this.funcSet;
						this.LtoR4 = "waves3_1" + this.funcSet;
						this.LtoR5 = "waves2_1" + this.funcSet;
						this.LtoR6 = "waves3_1" + this.funcSet;
						this.LtoR7 = "waves4_1" + this.funcSet;
						this.LtoR8 = "waves5_1" + this.funcSet;
						this.LtoR9 = "waves6_1" + this.funcSet;
						this.LtoR10 = "waves7_1" + this.funcSet;
					}, 10);
					this.num = 1
				}
				else if (this.num == 1) {
					this.clear2();
					setTimeout(() => {
						this.f7 = "waves1_1" + this.funcSet;
						this.LtoR1_2 = "waves6_2" + this.funcSet;
						this.LtoR2_2 = "waves5_2" + this.funcSet;
						this.LtoR3_2 = "waves4_2" + this.funcSet;
						this.LtoR4_2 = "waves3_2" + this.funcSet;
						this.LtoR5_2 = "waves2_2" + this.funcSet;
						this.LtoR6_2 = "waves3_2" + this.funcSet;
						this.LtoR7_2 = "waves4_2" + this.funcSet;
						this.LtoR8_2 = "waves5_2" + this.funcSet;
						this.LtoR9_2 = "waves6_2" + this.funcSet;
						this.LtoR10_2 = "waves7_2" + this.funcSet;
					}, 10)
					this.num = 0
				}
				break;

			case this.vKey == 119 && this.keyStatus == 1: //f8
				if (this.num == 0) {
					this.clear();
					setTimeout(() => {
						this.f8 = "waves1_1" + this.funcSet;
						this.LtoR1 = "waves6_1" + this.funcSet;
						this.LtoR2 = "waves5_1" + this.funcSet;
						this.LtoR3 = "waves4_1" + this.funcSet;
						this.LtoR4 = "waves3_1" + this.funcSet;
						this.LtoR5 = "waves2_1" + this.funcSet;
						this.LtoR6 = "waves3_1" + this.funcSet;
						this.LtoR7 = "waves4_1" + this.funcSet;
						this.LtoR8 = "waves5_1" + this.funcSet;
						this.LtoR9 = "waves6_1" + this.funcSet;
						this.LtoR10 = "waves7_1" + this.funcSet;
					}, 10);
					this.num = 1
				}
				else if (this.num == 1) {
					this.clear2();
					setTimeout(() => {
						this.f8_2 = "waves1_2" + this.funcSet;
						this.LtoR1_2 = "waves6_2" + this.funcSet;
						this.LtoR2_2 = "waves5_2" + this.funcSet;
						this.LtoR3_2 = "waves4_2" + this.funcSet;
						this.LtoR4_2 = "waves3_2" + this.funcSet;
						this.LtoR5_2 = "waves2_2" + this.funcSet;
						this.LtoR6_2 = "waves3_2" + this.funcSet;
						this.LtoR7_2 = "waves4_2" + this.funcSet;
						this.LtoR8_2 = "waves5_2" + this.funcSet;
						this.LtoR9_2 = "waves6_2" + this.funcSet;
						this.LtoR10_2 = "waves7_2" + this.funcSet;
					}, 10)
					this.num = 0
				}
				break;

			case this.vKey == 120 && this.keyStatus == 1: //f9
				if (this.num == 0) {
					this.clear();
					setTimeout(() => {
						this.f9 = "waves1_1" + this.funcSet;
						this.LtoR1 = "waves7_1" + this.funcSet;
						this.LtoR2 = "waves6_1" + this.funcSet;
						this.LtoR3 = "waves5_1" + this.funcSet;
						this.LtoR4 = "waves4_1" + this.funcSet;
						this.LtoR5 = "waves3_1" + this.funcSet;
						this.LtoR6 = "waves2_1" + this.funcSet;
						this.LtoR7 = "waves3_1" + this.funcSet;
						this.LtoR8 = "waves4_1" + this.funcSet;
						this.LtoR9 = "waves5_1" + this.funcSet;
						this.LtoR10 = "waves6_1" + this.funcSet;
					}, 10);
					this.num = 1
				}
				else if (this.num == 1) {
					this.clear2();
					setTimeout(() => {
						this.f9_2 = "waves1_2" + this.funcSet;
						this.LtoR1_2 = "waves7_2" + this.funcSet;
						this.LtoR2_2 = "waves6_2" + this.funcSet;
						this.LtoR3_2 = "waves5_2" + this.funcSet;
						this.LtoR4_2 = "waves4_2" + this.funcSet;
						this.LtoR5_2 = "waves3_2" + this.funcSet;
						this.LtoR6_2 = "waves2_2" + this.funcSet;
						this.LtoR7_2 = "waves3_2" + this.funcSet;
						this.LtoR8_2 = "waves4_2" + this.funcSet;
						this.LtoR9_2 = "waves5_2" + this.funcSet;
						this.LtoR10_2 = "waves6_2" + this.funcSet;
					}, 10)
					this.num = 0
				}
				break;

			case this.vKey == 121 && this.keyStatus == 1: //f10
				if (this.num == 0) {
					this.clear();
					setTimeout(() => {
						this.f10 = "waves1_1" + this.funcSet;
						this.LtoR1 = "waves7_1" + this.funcSet;
						this.LtoR2 = "waves6_1" + this.funcSet;
						this.LtoR3 = "waves5_1" + this.funcSet;
						this.LtoR4 = "waves4_1" + this.funcSet;
						this.LtoR5 = "waves3_1" + this.funcSet;
						this.LtoR6 = "waves2_1" + this.funcSet;
						this.LtoR7 = "waves3_1" + this.funcSet;
						this.LtoR8 = "waves4_1" + this.funcSet;
						this.LtoR9 = "waves5_1" + this.funcSet;
						this.LtoR10 = "waves6_1" + this.funcSet;
					}, 10);
					this.num = 1
				}
				else if (this.num == 1) {
					this.clear2();
					setTimeout(() => {
						this.f10_2 = "waves1_2" + this.funcSet;
						this.LtoR1_2 = "waves7_2" + this.funcSet;
						this.LtoR2_2 = "waves6_2" + this.funcSet;
						this.LtoR3_2 = "waves5_2" + this.funcSet;
						this.LtoR4_2 = "waves4_2" + this.funcSet;
						this.LtoR5_2 = "waves3_2" + this.funcSet;
						this.LtoR6_2 = "waves2_2" + this.funcSet;
						this.LtoR7_2 = "waves3_2" + this.funcSet;
						this.LtoR8_2 = "waves4_2" + this.funcSet;
						this.LtoR9_2 = "waves5_2" + this.funcSet;
						this.LtoR10_2 = "waves6_2" + this.funcSet;
					}, 10)
					this.num = 0
				}
				break;

			case this.vKey == 122 && this.keyStatus == 1: //f11
				if (this.num == 0) {
					this.clear();
					setTimeout(() => {
						this.f11 = "waves1_1" + this.funcSet;
						this.LtoR1 = "waves8_1" + this.funcSet;
						this.LtoR2 = "waves7_1" + this.funcSet;
						this.LtoR3 = "waves6_1" + this.funcSet;
						this.LtoR4 = "waves5_1" + this.funcSet;
						this.LtoR5 = "waves4_1" + this.funcSet;
						this.LtoR6 = "waves3_1" + this.funcSet;
						this.LtoR7 = "waves2_1" + this.funcSet;
						this.LtoR8 = "waves3_1" + this.funcSet;
						this.LtoR9 = "waves4_1" + this.funcSet;
						this.LtoR10 = "waves5_1" + this.funcSet;
					}, 10);
					this.num = 1
				}
				else if (this.num == 1) {
					this.clear2();
					setTimeout(() => {
						this.f11_2 = "waves1_2" + this.funcSet;
						this.LtoR1_2 = "waves8_2" + this.funcSet;
						this.LtoR2_2 = "waves7_2" + this.funcSet;
						this.LtoR3_2 = "waves6_2" + this.funcSet;
						this.LtoR4_2 = "waves5_2" + this.funcSet;
						this.LtoR5_2 = "waves4_2" + this.funcSet;
						this.LtoR6_2 = "waves3_2" + this.funcSet;
						this.LtoR7_2 = "waves2_2" + this.funcSet;
						this.LtoR8_2 = "waves3_2" + this.funcSet;
						this.LtoR9_2 = "waves4_2" + this.funcSet;
						this.LtoR10_2 = "waves5_2" + this.funcSet;
					}, 10)
					this.num = 0
				}
				break;

			case this.vKey == 123 && this.keyStatus == 1: //f12
				if (this.num == 0) {
					this.clear();
					setTimeout(() => {
						this.f12 = "waves1_1" + this.funcSet;
						this.LtoR1 = "waves8_1" + this.funcSet;
						this.LtoR2 = "waves7_1" + this.funcSet;
						this.LtoR3 = "waves6_1" + this.funcSet;
						this.LtoR4 = "waves5_1" + this.funcSet;
						this.LtoR5 = "waves4_1" + this.funcSet;
						this.LtoR6 = "waves3_1" + this.funcSet;
						this.LtoR7 = "waves2_1" + this.funcSet;
						this.LtoR8 = "waves3_1" + this.funcSet;
						this.LtoR9 = "waves4_1" + this.funcSet;
						this.LtoR10 = "waves5_1" + this.funcSet;
					}, 10);
					this.num = 1
				}
				else if (this.num == 1) {
					this.clear2();
					setTimeout(() => {
						this.f12_2 = "waves1_2" + this.funcSet;
						this.LtoR1_2 = "waves8_2" + this.funcSet;
						this.LtoR2_2 = "waves7_2" + this.funcSet;
						this.LtoR3_2 = "waves6_2" + this.funcSet;
						this.LtoR4_2 = "waves5_2" + this.funcSet;
						this.LtoR5_2 = "waves4_2" + this.funcSet;
						this.LtoR6_2 = "waves3_2" + this.funcSet;
						this.LtoR7_2 = "waves2_2" + this.funcSet;
						this.LtoR8_2 = "waves3_2" + this.funcSet;
						this.LtoR9_2 = "waves4_2" + this.funcSet;
						this.LtoR10_2 = "waves5_2" + this.funcSet;
					}, 10)
					this.num = 0
				}
				break;

			case this.vKey == 145 && this.keyStatus == 1: //scroll
				if (this.num == 0) {
					this.clear();
					setTimeout(() => {
						this.scroll = "waves1_1" + this.funcSet;
						this.LtoR1 = "waves9_1" + this.funcSet;
						this.LtoR2 = "waves8_1" + this.funcSet;
						this.LtoR3 = "waves7_1" + this.funcSet;
						this.LtoR4 = "waves6_1" + this.funcSet;
						this.LtoR5 = "waves5_1" + this.funcSet;
						this.LtoR6 = "waves4_1" + this.funcSet;
						this.LtoR7 = "waves3_1" + this.funcSet;
						this.LtoR8 = "waves2_1" + this.funcSet;
						this.LtoR9 = "waves3_1" + this.funcSet;
						this.LtoR10 = "waves4_1" + this.funcSet;
					}, 10);
					this.num = 1
				}
				else if (this.num == 1) {
					this.clear2();
					setTimeout(() => {
						this.scroll_2 = "waves1_2" + this.funcSet;
						this.LtoR1_2 = "waves9_2" + this.funcSet;
						this.LtoR2_2 = "waves8_2" + this.funcSet;
						this.LtoR3_2 = "waves7_2" + this.funcSet;
						this.LtoR4_2 = "waves6_2" + this.funcSet;
						this.LtoR5_2 = "waves5_2" + this.funcSet;
						this.LtoR6_2 = "waves4_2" + this.funcSet;
						this.LtoR7_2 = "waves3_2" + this.funcSet;
						this.LtoR8_2 = "waves2_2" + this.funcSet;
						this.LtoR9_2 = "waves3_2" + this.funcSet;
						this.LtoR10_2 = "waves4_2" + this.funcSet;
					}, 10)
					this.num = 0
				}
				break;

			case this.vKey == 19 && this.keyStatus == 1: //pause
				if (this.num == 0) {
					this.clear();
					setTimeout(() => {
						this.pause = "waves1_1" + this.funcSet;
						this.LtoR1 = "waves2_1" + this.funcSet;
						this.LtoR2 = "waves3_1" + this.funcSet;
						this.LtoR3 = "waves4_1" + this.funcSet;
						this.LtoR4 = "waves5_1" + this.funcSet;
						this.LtoR5 = "waves6_1" + this.funcSet;
						this.LtoR6 = "waves7_1" + this.funcSet;
						this.LtoR7 = "waves8_1" + this.funcSet;
						this.LtoR8 = "waves9_1" + this.funcSet;
						this.LtoR9 = "waves8_1" + this.funcSet;
						this.LtoR10 = "waves7_1" + this.funcSet;
					}, 10);
					this.num = 1
				}
				else if (this.num == 1) {
					this.clear2();
					setTimeout(() => {
						this.pause_2 = "waves1_2" + this.funcSet;
						this.LtoR1_2 = "waves2_2" + this.funcSet;
						this.LtoR2_2 = "waves3_2" + this.funcSet;
						this.LtoR3_2 = "waves4_2" + this.funcSet;
						this.LtoR4_2 = "waves5_2" + this.funcSet;
						this.LtoR5_2 = "waves6_2" + this.funcSet;
						this.LtoR6_2 = "waves7_2" + this.funcSet;
						this.LtoR7_2 = "waves8_2" + this.funcSet;
						this.LtoR8_2 = "waves9_2" + this.funcSet;
						this.LtoR9_2 = "waves8_2" + this.funcSet;
						this.LtoR10_2 = "waves7_2" + this.funcSet;
					}, 10)
					this.num = 0
				}
				break;

			case this.vKey == 192 && this.keyStatus == 1: //perid
				if (this.num == 0) {
					this.clear();
					setTimeout(() => {
						this.perid = "waves1_1" + this.funcSet;
						this.LtoR1 = "waves2_1" + this.funcSet;
						this.LtoR2 = "waves3_1" + this.funcSet;
						this.LtoR3 = "waves4_1" + this.funcSet;
						this.LtoR4 = "waves5_1" + this.funcSet;
						this.LtoR5 = "waves6_1" + this.funcSet;
						this.LtoR6 = "waves7_1" + this.funcSet;
						this.LtoR7 = "waves8_1" + this.funcSet;
						this.LtoR8 = "waves9_1" + this.funcSet;
						this.LtoR9 = "waves10_1" + this.funcSet;
						this.LtoR10 = "waves11_1" + this.funcSet;
					}, 10);
					this.num = 1
				}
				else if (this.num == 1) {
					this.clear2();
					setTimeout(() => {
						this.perid_2 = "waves1_2" + this.funcSet;
						this.LtoR1_2 = "waves2_2" + this.funcSet;
						this.LtoR2_2 = "waves3_2" + this.funcSet;
						this.LtoR3_2 = "waves4_2" + this.funcSet;
						this.LtoR4_2 = "waves5_2" + this.funcSet;
						this.LtoR5_2 = "waves6_2" + this.funcSet;
						this.LtoR6_2 = "waves7_2" + this.funcSet;
						this.LtoR7_2 = "waves8_2" + this.funcSet;
						this.LtoR8_2 = "waves9_2" + this.funcSet;
						this.LtoR9_2 = "waves10_2" + this.funcSet;
						this.LtoR10_2 = "waves11_2" + this.funcSet;
					}, 10)
					this.num = 0
				}
				break;

			case this.vKey == 49 && this.keyStatus == 1: //n1
				if (this.num == 0) {
					this.clear();
					setTimeout(() => {
						this.n1 = "waves1_1" + this.funcSet;
						this.LtoR1 = "waves2_1" + this.funcSet;
						this.LtoR2 = "waves3_1" + this.funcSet;
						this.LtoR3 = "waves4_1" + this.funcSet;
						this.LtoR4 = "waves5_1" + this.funcSet;
						this.LtoR5 = "waves6_1" + this.funcSet;
						this.LtoR6 = "waves7_1" + this.funcSet;
						this.LtoR7 = "waves8_1" + this.funcSet;
						this.LtoR8 = "waves9_1" + this.funcSet;
						this.LtoR9 = "waves10_1" + this.funcSet;
						this.LtoR10 = "waves11_1" + this.funcSet;
					}, 10);
					this.num = 1
				}
				else if (this.num == 1) {
					this.clear2();
					setTimeout(() => {
						this.n1 = "waves1_1" + this.funcSet;
						this.LtoR1_2 = "waves2_2" + this.funcSet;
						this.LtoR2_2 = "waves3_2" + this.funcSet;
						this.LtoR3_2 = "waves4_2" + this.funcSet;
						this.LtoR4_2 = "waves5_2" + this.funcSet;
						this.LtoR5_2 = "waves6_2" + this.funcSet;
						this.LtoR6_2 = "waves7_2" + this.funcSet;
						this.LtoR7_2 = "waves8_2" + this.funcSet;
						this.LtoR8_2 = "waves9_2" + this.funcSet;
						this.LtoR9_2 = "waves10_2" + this.funcSet;
						this.LtoR10_2 = "waves11_2" + this.funcSet;
					}, 10)
					this.num = 0
				}
				break;

			case this.vKey == 50 && this.keyStatus == 1: //n2
				if (this.num == 0) {
					this.clear();
					setTimeout(() => {
						this.n2 = "waves1_1" + this.funcSet;
						this.LtoR1 = "waves3_1" + this.funcSet;
						this.LtoR2 = "waves2_1" + this.funcSet;
						this.LtoR3 = "waves3_1" + this.funcSet;
						this.LtoR4 = "waves4_1" + this.funcSet;
						this.LtoR5 = "waves5_1" + this.funcSet;
						this.LtoR6 = "waves6_1" + this.funcSet;
						this.LtoR7 = "waves7_1" + this.funcSet;
						this.LtoR8 = "waves8_1" + this.funcSet;
						this.LtoR9 = "waves9_1" + this.funcSet;
						this.LtoR10 = "waves10_1" + this.funcSet;
					}, 10);
					this.num = 1
				}
				else if (this.num == 1) {
					this.clear2();
					setTimeout(() => {
						this.n2_2 = "waves1_2" + this.funcSet;
						this.LtoR1_2 = "waves3_2" + this.funcSet;
						this.LtoR2_2 = "waves2_2" + this.funcSet;
						this.LtoR3_2 = "waves3_2" + this.funcSet;
						this.LtoR4_2 = "waves4_2" + this.funcSet;
						this.LtoR5_2 = "waves5_2" + this.funcSet;
						this.LtoR6_2 = "waves6_2" + this.funcSet;
						this.LtoR7_2 = "waves7_2" + this.funcSet;
						this.LtoR8_2 = "waves8_2" + this.funcSet;
						this.LtoR9_2 = "waves9_2" + this.funcSet;
						this.LtoR10_2 = "waves10_2" + this.funcSet;
					}, 10)
					this.num = 0
				}
				break;

			case this.vKey == 51 && this.keyStatus == 1: //n3
				if (this.num == 0) {
					this.clear();
					setTimeout(() => {
						this.n3 = "waves1_1" + this.funcSet;
						this.LtoR1 = "waves4_1" + this.funcSet;
						this.LtoR2 = "waves3_1" + this.funcSet;
						this.LtoR3 = "waves2_1" + this.funcSet;
						this.LtoR4 = "waves3_1" + this.funcSet;
						this.LtoR5 = "waves4_1" + this.funcSet;
						this.LtoR6 = "waves5_1" + this.funcSet;
						this.LtoR7 = "waves6_1" + this.funcSet;
						this.LtoR8 = "waves7_1" + this.funcSet;
						this.LtoR9 = "waves8_1" + this.funcSet;
						this.LtoR10 = "waves9_1" + this.funcSet;
					}, 10);
					this.num = 1
				}
				else if (this.num == 1) {
					this.clear2();
					setTimeout(() => {
						this.n3_2 = "waves1_2" + this.funcSet;
						this.LtoR1_2 = "waves4_2" + this.funcSet;
						this.LtoR2_2 = "waves3_2" + this.funcSet;
						this.LtoR3_2 = "waves2_2" + this.funcSet;
						this.LtoR4_2 = "waves3_2" + this.funcSet;
						this.LtoR5_2 = "waves4_2" + this.funcSet;
						this.LtoR6_2 = "waves5_2" + this.funcSet;
						this.LtoR7_2 = "waves6_2" + this.funcSet;
						this.LtoR8_2 = "waves7_2" + this.funcSet;
						this.LtoR9_2 = "waves8_2" + this.funcSet;
						this.LtoR10_2 = "waves9_2" + this.funcSet;
					}, 10)
					this.num = 0
				}
				break;

			case this.vKey == 52 && this.keyStatus == 1: //n4
				if (this.num == 0) {
					this.clear();
					setTimeout(() => {
						this.n4 = "waves1_1" + this.funcSet;
						this.LtoR1 = "waves4_1" + this.funcSet;
						this.LtoR2 = "waves3_1" + this.funcSet;
						this.LtoR3 = "waves2_1" + this.funcSet;
						this.LtoR4 = "waves3_1" + this.funcSet;
						this.LtoR5 = "waves4_1" + this.funcSet;
						this.LtoR6 = "waves5_1" + this.funcSet;
						this.LtoR7 = "waves6_1" + this.funcSet;
						this.LtoR8 = "waves7_1" + this.funcSet;
						this.LtoR9 = "waves8_1" + this.funcSet;
						this.LtoR10 = "waves9_1" + this.funcSet;
					}, 10);
					this.num = 1
				}
				else if (this.num == 1) {
					this.clear2();
					setTimeout(() => {
						this.n4_2 = "waves1_2" + this.funcSet;
						this.LtoR1_2 = "waves4_2" + this.funcSet;
						this.LtoR2_2 = "waves3_2" + this.funcSet;
						this.LtoR3_2 = "waves2_2" + this.funcSet;
						this.LtoR4_2 = "waves3_2" + this.funcSet;
						this.LtoR5_2 = "waves4_2" + this.funcSet;
						this.LtoR6_2 = "waves5_2" + this.funcSet;
						this.LtoR7_2 = "waves6_2" + this.funcSet;
						this.LtoR8_2 = "waves7_2" + this.funcSet;
						this.LtoR9_2 = "waves8_2" + this.funcSet;
						this.LtoR10_2 = "waves9_2" + this.funcSet;
					}, 10)
					this.num = 0
				}
				break;

			case this.vKey == 53 && this.keyStatus == 1: //n5
				if (this.num == 0) {
					this.clear();
					setTimeout(() => {
						this.n5 = "waves1_1" + this.funcSet;
						this.LtoR1 = "waves5_1" + this.funcSet;
						this.LtoR2 = "waves4_1" + this.funcSet;
						this.LtoR3 = "waves3_1" + this.funcSet;
						this.LtoR4 = "waves2_1" + this.funcSet;
						this.LtoR5 = "waves3_1" + this.funcSet;
						this.LtoR6 = "waves4_1" + this.funcSet;
						this.LtoR7 = "waves5_1" + this.funcSet;
						this.LtoR8 = "waves6_1" + this.funcSet;
						this.LtoR9 = "waves7_1" + this.funcSet;
						this.LtoR10 = "waves8_1" + this.funcSet;
					}, 10);
					this.num = 1
				}
				else if (this.num == 1) {
					this.clear2();
					setTimeout(() => {
						this.n5_2 = "waves1_2" + this.funcSet;
						this.LtoR1_2 = "waves5_2" + this.funcSet;
						this.LtoR2_2 = "waves4_2" + this.funcSet;
						this.LtoR3_2 = "waves3_2" + this.funcSet;
						this.LtoR4_2 = "waves2_2" + this.funcSet;
						this.LtoR5_2 = "waves3_2" + this.funcSet;
						this.LtoR6_2 = "waves4_2" + this.funcSet;
						this.LtoR7_2 = "waves5_2" + this.funcSet;
						this.LtoR8_2 = "waves6_2" + this.funcSet;
						this.LtoR9_2 = "waves7_2" + this.funcSet;
						this.LtoR10_2 = "waves8_2" + this.funcSet;
					}, 10)
					this.num = 0
				}
				break;

			case this.vKey == 54 && this.keyStatus == 1: //n6
				if (this.num == 0) {
					this.clear();
					setTimeout(() => {
						this.n6 = "waves1_1" + this.funcSet;
						this.LtoR1 = "waves5_1" + this.funcSet;
						this.LtoR2 = "waves4_1" + this.funcSet;
						this.LtoR3 = "waves3_1" + this.funcSet;
						this.LtoR4 = "waves2_1" + this.funcSet;
						this.LtoR5 = "waves3_1" + this.funcSet;
						this.LtoR6 = "waves4_1" + this.funcSet;
						this.LtoR7 = "waves5_1" + this.funcSet;
						this.LtoR8 = "waves6_1" + this.funcSet;
						this.LtoR9 = "waves7_1" + this.funcSet;
						this.LtoR10 = "waves8_1" + this.funcSet;
					}, 10);
					this.num = 1
				}
				else if (this.num == 1) {
					this.clear2();
					setTimeout(() => {
						this.n6_2 = "waves1_2" + this.funcSet;
						this.LtoR1_2 = "waves5_2" + this.funcSet;
						this.LtoR2_2 = "waves4_2" + this.funcSet;
						this.LtoR3_2 = "waves3_2" + this.funcSet;
						this.LtoR4_2 = "waves2_2" + this.funcSet;
						this.LtoR5_2 = "waves3_2" + this.funcSet;
						this.LtoR6_2 = "waves4_2" + this.funcSet;
						this.LtoR7_2 = "waves5_2" + this.funcSet;
						this.LtoR8_2 = "waves6_2" + this.funcSet;
						this.LtoR9_2 = "waves7_2" + this.funcSet;
						this.LtoR10_2 = "waves8_2" + this.funcSet;
					}, 10)
					this.num = 0
				}
				break;

			case this.vKey == 55 && this.keyStatus == 1: //n7
				if (this.num == 0) {
					this.clear();
					setTimeout(() => {
						this.n7 = "waves1_1" + this.funcSet;
						this.LtoR1 = "waves6_1" + this.funcSet;
						this.LtoR2 = "waves5_1" + this.funcSet;
						this.LtoR3 = "waves4_1" + this.funcSet;
						this.LtoR4 = "waves3_1" + this.funcSet;
						this.LtoR5 = "waves2_1" + this.funcSet;
						this.LtoR6 = "waves3_1" + this.funcSet;
						this.LtoR7 = "waves4_1" + this.funcSet;
						this.LtoR8 = "waves5_1" + this.funcSet;
						this.LtoR9 = "waves6_1" + this.funcSet;
						this.LtoR10 = "waves7_1" + this.funcSet;
					}, 10);
					this.num = 1
				}
				else if (this.num == 1) {
					this.clear2();
					setTimeout(() => {
						this.n7_2 = "waves1_2" + this.funcSet;
						this.LtoR1_2 = "waves6_2" + this.funcSet;
						this.LtoR2_2 = "waves5_2" + this.funcSet;
						this.LtoR3_2 = "waves4_2" + this.funcSet;
						this.LtoR4_2 = "waves3_2" + this.funcSet;
						this.LtoR5_2 = "waves2_2" + this.funcSet;
						this.LtoR6_2 = "waves3_2" + this.funcSet;
						this.LtoR7_2 = "waves4_2" + this.funcSet;
						this.LtoR8_2 = "waves5_2" + this.funcSet;
						this.LtoR9_2 = "waves6_2" + this.funcSet;
						this.LtoR10_2 = "waves7_2" + this.funcSet;
					}, 10)
					this.num = 0
				}
				break;

			case this.vKey == 56 && this.keyStatus == 1: //n8
				if (this.num == 0) {
					this.clear();
					setTimeout(() => {
						this.n8 = "waves1_1" + this.funcSet;
						this.LtoR1 = "waves6_1" + this.funcSet;
						this.LtoR2 = "waves5_1" + this.funcSet;
						this.LtoR3 = "waves4_1" + this.funcSet;
						this.LtoR4 = "waves3_1" + this.funcSet;
						this.LtoR5 = "waves2_1" + this.funcSet;
						this.LtoR6 = "waves3_1" + this.funcSet;
						this.LtoR7 = "waves4_1" + this.funcSet;
						this.LtoR8 = "waves5_1" + this.funcSet;
						this.LtoR9 = "waves6_1" + this.funcSet;
						this.LtoR10 = "waves7_1" + this.funcSet;
					}, 10);
					this.num = 1
				}
				else if (this.num == 1) {
					this.clear2();
					setTimeout(() => {
						this.n8_2 = "waves1_2" + this.funcSet;
						this.LtoR1_2 = "waves6_2" + this.funcSet;
						this.LtoR2_2 = "waves5_2" + this.funcSet;
						this.LtoR3_2 = "waves4_2" + this.funcSet;
						this.LtoR4_2 = "waves3_2" + this.funcSet;
						this.LtoR5_2 = "waves2_2" + this.funcSet;
						this.LtoR6_2 = "waves3_2" + this.funcSet;
						this.LtoR7_2 = "waves4_2" + this.funcSet;
						this.LtoR8_2 = "waves5_2" + this.funcSet;
						this.LtoR9_2 = "waves6_2" + this.funcSet;
						this.LtoR10_2 = "waves7_2" + this.funcSet;
					}, 10)
					this.num = 0
				}
				break;

			case this.vKey == 57 && this.keyStatus == 1: //n9
				if (this.num == 0) {
					this.clear();
					setTimeout(() => {
						this.n9 = "waves1_1" + this.funcSet;
						this.LtoR1 = "waves7_1" + this.funcSet;
						this.LtoR2 = "waves6_1" + this.funcSet;
						this.LtoR3 = "waves5_1" + this.funcSet;
						this.LtoR4 = "waves4_1" + this.funcSet;
						this.LtoR5 = "waves3_1" + this.funcSet;
						this.LtoR6 = "waves2_1" + this.funcSet;
						this.LtoR7 = "waves3_1" + this.funcSet;
						this.LtoR8 = "waves4_1" + this.funcSet;
						this.LtoR9 = "waves5_1" + this.funcSet;
						this.LtoR10 = "waves6_1" + this.funcSet;
					}, 10);
					this.num = 1
				}
				else if (this.num == 1) {
					this.clear2();
					setTimeout(() => {
						this.n9_2 = "waves1_2" + this.funcSet;
						this.LtoR1_2 = "waves7_2" + this.funcSet;
						this.LtoR2_2 = "waves6_2" + this.funcSet;
						this.LtoR3_2 = "waves5_2" + this.funcSet;
						this.LtoR4_2 = "waves4_2" + this.funcSet;
						this.LtoR5_2 = "waves3_2" + this.funcSet;
						this.LtoR6_2 = "waves2_2" + this.funcSet;
						this.LtoR7_2 = "waves3_2" + this.funcSet;
						this.LtoR8_2 = "waves4_2" + this.funcSet;
						this.LtoR9_2 = "waves5_2" + this.funcSet;
						this.LtoR10_2 = "waves6_2" + this.funcSet;
					}, 10)
					this.num = 0
				}
				break;

			case this.vKey == 48 && this.keyStatus == 1: //n0
				if (this.num == 0) {
					this.clear();
					setTimeout(() => {
						this.n0 = "waves1_1" + this.funcSet;
						this.LtoR1 = "waves7_1" + this.funcSet;
						this.LtoR2 = "waves6_1" + this.funcSet;
						this.LtoR3 = "waves5_1" + this.funcSet;
						this.LtoR4 = "waves4_1" + this.funcSet;
						this.LtoR5 = "waves3_1" + this.funcSet;
						this.LtoR6 = "waves2_1" + this.funcSet;
						this.LtoR7 = "waves3_1" + this.funcSet;
						this.LtoR8 = "waves4_1" + this.funcSet;
						this.LtoR9 = "waves5_1" + this.funcSet;
						this.LtoR10 = "waves6_1" + this.funcSet;
					}, 10);
					this.num = 1
				}
				else if (this.num == 1) {
					this.clear2();
					setTimeout(() => {
						this.n0_2 = "waves1_2" + this.funcSet;
						this.LtoR1_2 = "waves7_2" + this.funcSet;
						this.LtoR2_2 = "waves6_2" + this.funcSet;
						this.LtoR3_2 = "waves5_2" + this.funcSet;
						this.LtoR4_2 = "waves4_2" + this.funcSet;
						this.LtoR5_2 = "waves3_2" + this.funcSet;
						this.LtoR6_2 = "waves2_2" + this.funcSet;
						this.LtoR7_2 = "waves3_2" + this.funcSet;
						this.LtoR8_2 = "waves4_2" + this.funcSet;
						this.LtoR9_2 = "waves5_2" + this.funcSet;
						this.LtoR10_2 = "waves6_2" + this.funcSet;
					}, 10)
					this.num = 0
				}
				break;

			case this.vKey == 189 && this.keyStatus == 1: //minus
				if (this.num == 0) {
					this.clear();
					setTimeout(() => {
						this.minus = "waves1_1" + this.funcSet;
						this.LtoR1 = "waves8_1" + this.funcSet;
						this.LtoR2 = "waves7_1" + this.funcSet;
						this.LtoR3 = "waves6_1" + this.funcSet;
						this.LtoR4 = "waves5_1" + this.funcSet;
						this.LtoR5 = "waves4_1" + this.funcSet;
						this.LtoR6 = "waves3_1" + this.funcSet;
						this.LtoR7 = "waves2_1" + this.funcSet;
						this.LtoR8 = "waves3_1" + this.funcSet;
						this.LtoR9 = "waves4_1" + this.funcSet;
						this.LtoR10 = "waves5_1" + this.funcSet;
					}, 10);
					this.num = 1
				}
				else if (this.num == 1) {
					this.clear2();
					setTimeout(() => {
						this.minus_2 = "waves1_2" + this.funcSet;
						this.LtoR1_2 = "waves8_2" + this.funcSet;
						this.LtoR2_2 = "waves7_2" + this.funcSet;
						this.LtoR3_2 = "waves6_2" + this.funcSet;
						this.LtoR4_2 = "waves5_2" + this.funcSet;
						this.LtoR5_2 = "waves4_2" + this.funcSet;
						this.LtoR6_2 = "waves3_2" + this.funcSet;
						this.LtoR7_2 = "waves2_2" + this.funcSet;
						this.LtoR8_2 = "waves3_2" + this.funcSet;
						this.LtoR9_2 = "waves4_2" + this.funcSet;
						this.LtoR10_2 = "waves5_2" + this.funcSet;
					}, 10)
					this.num = 0
				}
				break;

			case this.vKey == 187 && this.keyStatus == 1: //plus
				if (this.num == 0) {
					this.clear();
					setTimeout(() => {
						this.plus = "waves1_1" + this.funcSet;
						this.LtoR1 = "waves8_1" + this.funcSet;
						this.LtoR2 = "waves7_1" + this.funcSet;
						this.LtoR3 = "waves6_1" + this.funcSet;
						this.LtoR4 = "waves5_1" + this.funcSet;
						this.LtoR5 = "waves4_1" + this.funcSet;
						this.LtoR6 = "waves3_1" + this.funcSet;
						this.LtoR7 = "waves2_1" + this.funcSet;
						this.LtoR8 = "waves3_1" + this.funcSet;
						this.LtoR9 = "waves4_1" + this.funcSet;
						this.LtoR10 = "waves5_1" + this.funcSet;
					}, 10);
					this.num = 1
				}
				else if (this.num == 1) {
					this.clear2();
					setTimeout(() => {
						this.plus_2 = "waves1_2" + this.funcSet;
						this.LtoR1_2 = "waves8_2" + this.funcSet;
						this.LtoR2_2 = "waves7_2" + this.funcSet;
						this.LtoR3_2 = "waves6_2" + this.funcSet;
						this.LtoR4_2 = "waves5_2" + this.funcSet;
						this.LtoR5_2 = "waves4_2" + this.funcSet;
						this.LtoR6_2 = "waves3_2" + this.funcSet;
						this.LtoR7_2 = "waves2_2" + this.funcSet;
						this.LtoR8_2 = "waves3_2" + this.funcSet;
						this.LtoR9_2 = "waves4_2" + this.funcSet;
						this.LtoR10_2 = "waves5_2" + this.funcSet;
					}, 10)
					this.num = 0
				}
				break;

			case this.vKey == 8 && this.keyStatus == 1: //bsp
				if (this.num == 0) {
					this.clear();
					setTimeout(() => {
						this.bsp = "waves1_1" + this.funcSet;
						this.LtoR1 = "waves9_1" + this.funcSet;
						this.LtoR2 = "waves8_1" + this.funcSet;
						this.LtoR3 = "waves7_1" + this.funcSet;
						this.LtoR4 = "waves6_1" + this.funcSet;
						this.LtoR5 = "waves5_1" + this.funcSet;
						this.LtoR6 = "waves4_1" + this.funcSet;
						this.LtoR7 = "waves3_1" + this.funcSet;
						this.LtoR8 = "waves2_1" + this.funcSet;
						this.LtoR9 = "waves3_1" + this.funcSet;
						this.LtoR10 = "waves4_1" + this.funcSet;
					}, 10);
					this.num = 1
				}
				else if (this.num == 1) {
					this.clear2();
					setTimeout(() => {
						this.bsp_2 = "waves1_2" + this.funcSet;
						this.LtoR1_2 = "waves9_2" + this.funcSet;
						this.LtoR2_2 = "waves8_2" + this.funcSet;
						this.LtoR3_2 = "waves7_2" + this.funcSet;
						this.LtoR4_2 = "waves6_2" + this.funcSet;
						this.LtoR5_2 = "waves5_2" + this.funcSet;
						this.LtoR6_2 = "waves4_2" + this.funcSet;
						this.LtoR7_2 = "waves3_2" + this.funcSet;
						this.LtoR8_2 = "waves2_2" + this.funcSet;
						this.LtoR9_2 = "waves3_2" + this.funcSet;
						this.LtoR10_2 = "waves4_2" + this.funcSet;
					}, 10)
					this.num = 0
				}
				break;

			case this.vKey == 45 && this.keyStatus == 1: //insert
				if (this.num == 0) {
					this.clear();
					setTimeout(() => {
						this.insert = "waves1_1" + this.funcSet;
						this.LtoR1 = "waves9_1" + this.funcSet;
						this.LtoR2 = "waves8_1" + this.funcSet;
						this.LtoR3 = "waves7_1" + this.funcSet;
						this.LtoR4 = "waves6_1" + this.funcSet;
						this.LtoR5 = "waves5_1" + this.funcSet;
						this.LtoR6 = "waves4_1" + this.funcSet;
						this.LtoR7 = "waves3_1" + this.funcSet;
						this.LtoR8 = "waves2_1" + this.funcSet;
						this.LtoR9 = "waves3_1" + this.funcSet;
						this.LtoR10 = "waves4_1" + this.funcSet;
					}, 10);
					this.num = 1
				}
				else if (this.num == 1) {
					this.clear2();
					setTimeout(() => {
						this.insert_2 = "waves1_2" + this.funcSet;
						this.LtoR1_2 = "waves9_2" + this.funcSet;
						this.LtoR2_2 = "waves8_2" + this.funcSet;
						this.LtoR3_2 = "waves7_2" + this.funcSet;
						this.LtoR4_2 = "waves6_2" + this.funcSet;
						this.LtoR5_2 = "waves5_2" + this.funcSet;
						this.LtoR6_2 = "waves4_2" + this.funcSet;
						this.LtoR7_2 = "waves3_2" + this.funcSet;
						this.LtoR8_2 = "waves2_2" + this.funcSet;
						this.LtoR9_2 = "waves3_2" + this.funcSet;
						this.LtoR10_2 = "waves4_2" + this.funcSet;
					}, 10)
					this.num = 0
				}
				break;

			case this.vKey == 36 && this.keyStatus == 1: //home
				if (this.num == 0) {
					this.clear();
					setTimeout(() => {
						this.home = "waves1_1" + this.funcSet;
						this.LtoR1 = "waves9_1" + this.funcSet;
						this.LtoR2 = "waves8_1" + this.funcSet;
						this.LtoR3 = "waves7_1" + this.funcSet;
						this.LtoR4 = "waves6_1" + this.funcSet;
						this.LtoR5 = "waves5_1" + this.funcSet;
						this.LtoR6 = "waves4_1" + this.funcSet;
						this.LtoR7 = "waves3_1" + this.funcSet;
						this.LtoR8 = "waves2_1" + this.funcSet;
						this.LtoR9 = "waves3_1" + this.funcSet;
						this.LtoR10 = "waves4_1" + this.funcSet;
					}, 10);
					this.num = 1
				}
				else if (this.num == 1) {
					this.clear2();
					setTimeout(() => {
						this.home_2 = "waves1_2" + this.funcSet;
						this.LtoR1_2 = "waves9_2" + this.funcSet;
						this.LtoR2_2 = "waves8_2" + this.funcSet;
						this.LtoR3_2 = "waves7_2" + this.funcSet;
						this.LtoR4_2 = "waves6_2" + this.funcSet;
						this.LtoR5_2 = "waves5_2" + this.funcSet;
						this.LtoR6_2 = "waves4_2" + this.funcSet;
						this.LtoR7_2 = "waves3_2" + this.funcSet;
						this.LtoR8_2 = "waves2_2" + this.funcSet;
						this.LtoR9_2 = "waves3_2" + this.funcSet;
						this.LtoR10_2 = "waves4_2" + this.funcSet;
					}, 10)
					this.num = 0
				}
				break;

			case this.vKey == 33 && this.keyStatus == 1: //pup
				if (this.num == 0) {
					this.clear();
					setTimeout(() => {
						this.pup = "waves1_1" + this.funcSet;
						this.LtoR1 = "waves9_1" + this.funcSet;
						this.LtoR2 = "waves8_1" + this.funcSet;
						this.LtoR3 = "waves7_1" + this.funcSet;
						this.LtoR4 = "waves6_1" + this.funcSet;
						this.LtoR5 = "waves5_1" + this.funcSet;
						this.LtoR6 = "waves4_1" + this.funcSet;
						this.LtoR7 = "waves3_1" + this.funcSet;
						this.LtoR8 = "waves2_1" + this.funcSet;
						this.LtoR9 = "waves3_1" + this.funcSet;
						this.LtoR10 = "waves4_1" + this.funcSet;
					}, 10);
					this.num = 1
				}
				else if (this.num == 1) {
					this.clear2();
					setTimeout(() => {
						this.pup_2 = "waves1_2" + this.funcSet;
						this.LtoR1_2 = "waves9_2" + this.funcSet;
						this.LtoR2_2 = "waves8_2" + this.funcSet;
						this.LtoR3_2 = "waves7_2" + this.funcSet;
						this.LtoR4_2 = "waves6_2" + this.funcSet;
						this.LtoR5_2 = "waves5_2" + this.funcSet;
						this.LtoR6_2 = "waves4_2" + this.funcSet;
						this.LtoR7_2 = "waves3_2" + this.funcSet;
						this.LtoR8_2 = "waves2_2" + this.funcSet;
						this.LtoR9_2 = "waves3_2" + this.funcSet;
						this.LtoR10_2 = "waves4_2" + this.funcSet;
					}, 10)
					this.num = 0
				}
				break;

			case this.vKey == 144 && this.keyStatus == 1: //numlock
				if (this.num == 0) {
					this.clear();
					setTimeout(() => {
						this.numlock = "waves1_1" + this.funcSet;
						this.LtoR1 = "waves10_1" + this.funcSet;
						this.LtoR2 = "waves9_1" + this.funcSet;
						this.LtoR3 = "waves8_1" + this.funcSet;
						this.LtoR4 = "waves7_1" + this.funcSet;
						this.LtoR5 = "waves6_1" + this.funcSet;
						this.LtoR6 = "waves5_1" + this.funcSet;
						this.LtoR7 = "waves4_1" + this.funcSet;
						this.LtoR8 = "waves3_1" + this.funcSet;
						this.LtoR9 = "waves2_1" + this.funcSet;
						this.LtoR10 = "waves3_1" + this.funcSet;
					}, 10);
					this.num = 1
				}
				else if (this.num == 1) {
					this.clear2();
					setTimeout(() => {
						this.numlock_2 = "waves1_2" + this.funcSet;
						this.LtoR1_2 = "waves10_2" + this.funcSet;
						this.LtoR2_2 = "waves9_2" + this.funcSet;
						this.LtoR3_2 = "waves8_2" + this.funcSet;
						this.LtoR4_2 = "waves7_2" + this.funcSet;
						this.LtoR5_2 = "waves6_2" + this.funcSet;
						this.LtoR6_2 = "waves5_2" + this.funcSet;
						this.LtoR7_2 = "waves4_2" + this.funcSet;
						this.LtoR8_2 = "waves3_2" + this.funcSet;
						this.LtoR9_2 = "waves2_2" + this.funcSet;
						this.LtoR10_2 = "waves3_2" + this.funcSet;
					}, 10)
					this.num = 0
				}
				break;

			case this.vKey == 111 && this.keyStatus == 1: //numdrawn
				if (this.num == 0) {
					this.clear();
					setTimeout(() => {
						this.numdrawn = "waves1_1" + this.funcSet;
						this.LtoR1 = "waves10_1" + this.funcSet;
						this.LtoR2 = "waves9_1" + this.funcSet;
						this.LtoR3 = "waves8_1" + this.funcSet;
						this.LtoR4 = "waves7_1" + this.funcSet;
						this.LtoR5 = "waves6_1" + this.funcSet;
						this.LtoR6 = "waves5_1" + this.funcSet;
						this.LtoR7 = "waves4_1" + this.funcSet;
						this.LtoR8 = "waves3_1" + this.funcSet;
						this.LtoR9 = "waves2_1" + this.funcSet;
						this.LtoR10 = "waves3_1" + this.funcSet;
					}, 10);
					this.num = 1
				}
				else if (this.num == 1) {
					this.clear2();
					setTimeout(() => {
						this.numdrawn_2 = "waves1_2" + this.funcSet;
						this.LtoR1_2 = "waves10_2" + this.funcSet;
						this.LtoR2_2 = "waves9_2" + this.funcSet;
						this.LtoR3_2 = "waves8_2" + this.funcSet;
						this.LtoR4_2 = "waves7_2" + this.funcSet;
						this.LtoR5_2 = "waves6_2" + this.funcSet;
						this.LtoR6_2 = "waves5_2" + this.funcSet;
						this.LtoR7_2 = "waves4_2" + this.funcSet;
						this.LtoR8_2 = "waves3_2" + this.funcSet;
						this.LtoR9_2 = "waves2_2" + this.funcSet;
						this.LtoR10_2 = "waves3_2" + this.funcSet;
					}, 10)
					this.num = 0
				}
				break;

			case this.vKey == 106 && this.keyStatus == 1: //numtimes
				if (this.num == 0) {
					this.clear();
					setTimeout(() => {
						this.numtimes = "waves1_1" + this.funcSet;
						this.LtoR1 = "waves11_1" + this.funcSet;
						this.LtoR2 = "waves10_1" + this.funcSet;
						this.LtoR3 = "waves9_1" + this.funcSet;
						this.LtoR4 = "waves8_1" + this.funcSet;
						this.LtoR5 = "waves7_1" + this.funcSet;
						this.LtoR6 = "waves6_1" + this.funcSet;
						this.LtoR7 = "waves5_1" + this.funcSet;
						this.LtoR8 = "waves4_1" + this.funcSet;
						this.LtoR9 = "waves3_1" + this.funcSet;
						this.LtoR10 = "waves2_1" + this.funcSet;
					}, 10);
					this.num = 1
				}
				else if (this.num == 1) {
					this.clear2();
					setTimeout(() => {
						this.numtimes_2 = "waves1_2" + this.funcSet;
						this.LtoR1_2 = "waves11_2" + this.funcSet;
						this.LtoR2_2 = "waves10_2" + this.funcSet;
						this.LtoR3_2 = "waves9_2" + this.funcSet;
						this.LtoR4_2 = "waves8_2" + this.funcSet;
						this.LtoR5_2 = "waves7_2" + this.funcSet;
						this.LtoR6_2 = "waves6_2" + this.funcSet;
						this.LtoR7_2 = "waves5_2" + this.funcSet;
						this.LtoR8_2 = "waves4_2" + this.funcSet;
						this.LtoR9_2 = "waves3_2" + this.funcSet;
						this.LtoR10_2 = "waves2_2" + this.funcSet;
					}, 10)
					this.num = 0
				}
				break;

			case this.vKey == 109 && this.keyStatus == 1: //numminus
				if (this.num == 0) {
					this.clear();
					setTimeout(() => {
						this.numminus = "waves1_1" + this.funcSet;
						this.LtoR1 = "waves11_1" + this.funcSet;
						this.LtoR2 = "waves10_1" + this.funcSet;
						this.LtoR3 = "waves9_1" + this.funcSet;
						this.LtoR4 = "waves8_1" + this.funcSet;
						this.LtoR5 = "waves7_1" + this.funcSet;
						this.LtoR6 = "waves6_1" + this.funcSet;
						this.LtoR7 = "waves5_1" + this.funcSet;
						this.LtoR8 = "waves4_1" + this.funcSet;
						this.LtoR9 = "waves3_1" + this.funcSet;
						this.LtoR10 = "waves2_1" + this.funcSet;
					}, 10);
					this.num = 1
				}
				else if (this.num == 1) {
					this.clear2();
					setTimeout(() => {
						this.numminus_2 = "waves1_2" + this.funcSet;
						this.LtoR1_2 = "waves11_2" + this.funcSet;
						this.LtoR2_2 = "waves10_2" + this.funcSet;
						this.LtoR3_2 = "waves9_2" + this.funcSet;
						this.LtoR4_2 = "waves8_2" + this.funcSet;
						this.LtoR5_2 = "waves7_2" + this.funcSet;
						this.LtoR6_2 = "waves6_2" + this.funcSet;
						this.LtoR7_2 = "waves5_2" + this.funcSet;
						this.LtoR8_2 = "waves4_2" + this.funcSet;
						this.LtoR9_2 = "waves3_2" + this.funcSet;
						this.LtoR10_2 = "waves2_2" + this.funcSet;
					}, 10)
					this.num = 0
				}
				break;

			case this.vKey == 9 && this.keyStatus == 1: //tab
				if (this.num == 0) {
					this.clear();
					setTimeout(() => {
						this.tab = "waves1_1" + this.funcSet;
						this.LtoR1 = "waves2_1" + this.funcSet;
						this.LtoR2 = "waves3_1" + this.funcSet;
						this.LtoR3 = "waves4_1" + this.funcSet;
						this.LtoR4 = "waves5_1" + this.funcSet;
						this.LtoR5 = "waves6_1" + this.funcSet;
						this.LtoR6 = "waves7_1" + this.funcSet;
						this.LtoR7 = "waves8_1" + this.funcSet;
						this.LtoR8 = "waves9_1" + this.funcSet;
						this.LtoR9 = "waves10_1" + this.funcSet;
						this.LtoR10 = "waves11_1" + this.funcSet;
					}, 10);
					this.num = 1
				}
				else if (this.num == 1) {
					this.clear2();
					setTimeout(() => {
						this.tab_2 = "waves1_2" + this.funcSet;
						this.LtoR1_2 = "waves2_2" + this.funcSet;
						this.LtoR2_2 = "waves3_2" + this.funcSet;
						this.LtoR3_2 = "waves4_2" + this.funcSet;
						this.LtoR4_2 = "waves5_2" + this.funcSet;
						this.LtoR5_2 = "waves6_2" + this.funcSet;
						this.LtoR6_2 = "waves7_2" + this.funcSet;
						this.LtoR7_2 = "waves8_2" + this.funcSet;
						this.LtoR8_2 = "waves9_2" + this.funcSet;
						this.LtoR9_2 = "waves10_2" + this.funcSet;
						this.LtoR10_2 = "waves11_2" + this.funcSet;
					}, 10)
					this.num = 0
				}
				break;

			case this.vKey == 81 && this.keyStatus == 1: //q
				if (this.num == 0) {
					this.clear();
					setTimeout(() => {
						this.q = "waves1_1" + this.funcSet;
						this.LtoR1 = "waves2_1" + this.funcSet;
						this.LtoR2 = "waves3_1" + this.funcSet;
						this.LtoR3 = "waves4_1" + this.funcSet;
						this.LtoR4 = "waves5_1" + this.funcSet;
						this.LtoR5 = "waves6_1" + this.funcSet;
						this.LtoR6 = "waves7_1" + this.funcSet;
						this.LtoR7 = "waves8_1" + this.funcSet;
						this.LtoR8 = "waves9_1" + this.funcSet;
						this.LtoR9 = "waves10_1" + this.funcSet;
						this.LtoR10 = "waves11_1" + this.funcSet;
					}, 10);
					this.num = 1
				}
				else if (this.num == 1) {
					this.clear2();
					setTimeout(() => {
						this.q_2 = "waves1_2" + this.funcSet;
						this.LtoR1_2 = "waves2_2" + this.funcSet;
						this.LtoR2_2 = "waves3_2" + this.funcSet;
						this.LtoR3_2 = "waves4_2" + this.funcSet;
						this.LtoR4_2 = "waves5_2" + this.funcSet;
						this.LtoR5_2 = "waves6_2" + this.funcSet;
						this.LtoR6_2 = "waves7_2" + this.funcSet;
						this.LtoR7_2 = "waves8_2" + this.funcSet;
						this.LtoR8_2 = "waves9_2" + this.funcSet;
						this.LtoR9_2 = "waves10_2" + this.funcSet;
						this.LtoR10_2 = "waves11_2" + this.funcSet;
					}, 10)
					this.num = 0
				}
				break;

			case this.vKey == 87 && this.keyStatus == 1: //w
				if (this.num == 0) {
					this.clear();
					setTimeout(() => {
						this.w = "waves1_1" + this.funcSet;
						this.LtoR2 = "waves2_1" + this.funcSet;
						this.LtoR1 = "waves3_1" + this.funcSet;
						this.LtoR3 = "waves3_1" + this.funcSet;
						this.LtoR4 = "waves4_1" + this.funcSet;
						this.LtoR5 = "waves5_1" + this.funcSet;
						this.LtoR6 = "waves6_1" + this.funcSet;
						this.LtoR7 = "waves7_1" + this.funcSet;
						this.LtoR8 = "waves8_1" + this.funcSet;
						this.LtoR9 = "waves9_1" + this.funcSet;
						this.LtoR10 = "waves10_1" + this.funcSet;
					}, 10);
					this.num = 1
				}
				else if (this.num == 1) {
					this.clear2();
					setTimeout(() => {
						this.w_2 = "waves1_2" + this.funcSet;
						this.LtoR2_2 = "waves2_2" + this.funcSet;
						this.LtoR1_2 = "waves3_2" + this.funcSet;
						this.LtoR3_2 = "waves3_2" + this.funcSet;
						this.LtoR4_2 = "waves4_2" + this.funcSet;
						this.LtoR5_2 = "waves5_2" + this.funcSet;
						this.LtoR6_2 = "waves6_2" + this.funcSet;
						this.LtoR7_2 = "waves7_2" + this.funcSet;
						this.LtoR8_2 = "waves8_2" + this.funcSet;
						this.LtoR9_2 = "waves9_2" + this.funcSet;
						this.LtoR10_2 = "waves10_2" + this.funcSet;
					}, 10)
					this.num = 0
				}
				break;

			case this.vKey == 69 && this.keyStatus == 1: //E
				if (this.num == 0) {
					this.clear();
					setTimeout(() => {
						this.e = "waves1_1" + this.funcSet;
						this.LtoR2 = "waves2_1" + this.funcSet;
						this.LtoR1 = "waves3_1" + this.funcSet;
						this.LtoR3 = "waves3_1" + this.funcSet;
						this.LtoR4 = "waves4_1" + this.funcSet;
						this.LtoR5 = "waves5_1" + this.funcSet;
						this.LtoR6 = "waves6_1" + this.funcSet;
						this.LtoR7 = "waves7_1" + this.funcSet;
						this.LtoR8 = "waves8_1" + this.funcSet;
						this.LtoR9 = "waves9_1" + this.funcSet;
						this.LtoR10 = "waves10_1" + this.funcSet;
					}, 10);
					this.num = 1
				}
				else if (this.num == 1) {
					this.clear2();
					setTimeout(() => {
						this.e_2 = "waves1_2" + this.funcSet;
						this.LtoR2_2 = "waves2_2" + this.funcSet;
						this.LtoR1_2 = "waves3_2" + this.funcSet;
						this.LtoR3_2 = "waves3_2" + this.funcSet;
						this.LtoR4_2 = "waves4_2" + this.funcSet;
						this.LtoR5_2 = "waves5_2" + this.funcSet;
						this.LtoR6_2 = "waves6_2" + this.funcSet;
						this.LtoR7_2 = "waves7_2" + this.funcSet;
						this.LtoR8_2 = "waves8_2" + this.funcSet;
						this.LtoR9_2 = "waves9_2" + this.funcSet;
						this.LtoR10_2 = "waves10_2" + this.funcSet;
					}, 10)
					this.num = 0
				}
				break;

			case this.vKey == 82 && this.keyStatus == 1: //R
				if (this.num == 0) {
					this.clear();
					setTimeout(() => {
						this.r = "waves1_1" + this.funcSet;
						this.LtoR1 = "waves4_1" + this.funcSet;
						this.LtoR2 = "waves3_1" + this.funcSet;
						this.LtoR3 = "waves2_1" + this.funcSet;
						this.LtoR4 = "waves3_1" + this.funcSet;
						this.LtoR5 = "waves4_1" + this.funcSet;
						this.LtoR6 = "waves5_1" + this.funcSet;
						this.LtoR7 = "waves6_1" + this.funcSet;
						this.LtoR8 = "waves7_1" + this.funcSet;
						this.LtoR9 = "waves8_1" + this.funcSet;
						this.LtoR10 = "waves9_1" + this.funcSet;
					}, 10);
					this.num = 1
				}
				else if (this.num == 1) {
					this.clear2();
					setTimeout(() => {
						this.r_2 = "waves1_2" + this.funcSet;
						this.LtoR1_2 = "waves4_2" + this.funcSet;
						this.LtoR2_2 = "waves3_2" + this.funcSet;
						this.LtoR3_2 = "waves2_2" + this.funcSet;
						this.LtoR4_2 = "waves3_2" + this.funcSet;
						this.LtoR5_2 = "waves4_2" + this.funcSet;
						this.LtoR6_2 = "waves5_2" + this.funcSet;
						this.LtoR7_2 = "waves6_2" + this.funcSet;
						this.LtoR8_2 = "waves7_2" + this.funcSet;
						this.LtoR9_2 = "waves8_2" + this.funcSet;
						this.LtoR10_2 = "waves9_2" + this.funcSet;
					}, 10)
					this.num = 0
				}
				break;

			case this.vKey == 84 && this.keyStatus == 1: //T
				if (this.num == 0) {
					this.clear();
					setTimeout(() => {
						this.t = "waves1_1" + this.funcSet;
						this.LtoR1 = "waves4_1" + this.funcSet;
						this.LtoR2 = "waves3_1" + this.funcSet;
						this.LtoR3 = "waves2_1" + this.funcSet;
						this.LtoR4 = "waves3_1" + this.funcSet;
						this.LtoR5 = "waves4_1" + this.funcSet;
						this.LtoR6 = "waves5_1" + this.funcSet;
						this.LtoR7 = "waves6_1" + this.funcSet;
						this.LtoR8 = "waves7_1" + this.funcSet;
						this.LtoR9 = "waves8_1" + this.funcSet;
						this.LtoR10 = "waves9_1" + this.funcSet;
					}, 10);
					this.num = 1
				}
				else if (this.num == 1) {
					this.clear2();
					setTimeout(() => {
						this.t_2 = "waves1_2" + this.funcSet;
						this.LtoR1_2 = "waves4_2" + this.funcSet;
						this.LtoR2_2 = "waves3_2" + this.funcSet;
						this.LtoR3_2 = "waves2_2" + this.funcSet;
						this.LtoR4_2 = "waves3_2" + this.funcSet;
						this.LtoR5_2 = "waves4_2" + this.funcSet;
						this.LtoR6_2 = "waves5_2" + this.funcSet;
						this.LtoR7_2 = "waves6_2" + this.funcSet;
						this.LtoR8_2 = "waves7_2" + this.funcSet;
						this.LtoR9_2 = "waves8_2" + this.funcSet;
						this.LtoR10_2 = "waves9_2" + this.funcSet;
					}, 10)
					this.num = 0
				}
				break;

			case this.vKey == 89 && this.keyStatus == 1: //Y
				if (this.num == 0) {
					this.clear();
					setTimeout(() => {
						this.y = "waves1_1" + this.funcSet;
						this.LtoR1 = "waves5_1" + this.funcSet;
						this.LtoR2 = "waves4_1" + this.funcSet;
						this.LtoR3 = "waves3_1" + this.funcSet;
						this.LtoR4 = "waves2_1" + this.funcSet;
						this.LtoR5 = "waves3_1" + this.funcSet;
						this.LtoR6 = "waves4_1" + this.funcSet;
						this.LtoR7 = "waves5_1" + this.funcSet;
						this.LtoR8 = "waves6_1" + this.funcSet;
						this.LtoR9 = "waves7_1" + this.funcSet;
						this.LtoR10 = "waves8_1" + this.funcSet;
					}, 10);
					this.num = 1
				}
				else if (this.num == 1) {
					this.clear2();
					setTimeout(() => {
						this.y_2 = "waves1_2" + this.funcSet;
						this.LtoR1_2 = "waves5_2" + this.funcSet;
						this.LtoR2_2 = "waves4_2" + this.funcSet;
						this.LtoR3_2 = "waves3_2" + this.funcSet;
						this.LtoR4_2 = "waves2_2" + this.funcSet;
						this.LtoR5_2 = "waves3_2" + this.funcSet;
						this.LtoR6_2 = "waves4_2" + this.funcSet;
						this.LtoR7_2 = "waves5_2" + this.funcSet;
						this.LtoR8_2 = "waves6_2" + this.funcSet;
						this.LtoR9_2 = "waves7_2" + this.funcSet;
						this.LtoR10_2 = "waves8_2" + this.funcSet;
					}, 10)
					this.num = 0
				}
				break;

			case this.vKey == 85 && this.keyStatus == 1: //U
				if (this.num == 0) {
					this.clear();
					setTimeout(() => {
						this.u = "waves1_1" + this.funcSet;
						this.LtoR1 = "waves5_1" + this.funcSet;
						this.LtoR2 = "waves4_1" + this.funcSet;
						this.LtoR3 = "waves3_1" + this.funcSet;
						this.LtoR4 = "waves2_1" + this.funcSet;
						this.LtoR5 = "waves3_1" + this.funcSet;
						this.LtoR6 = "waves4_1" + this.funcSet;
						this.LtoR7 = "waves5_1" + this.funcSet;
						this.LtoR8 = "waves6_1" + this.funcSet;
						this.LtoR9 = "waves7_1" + this.funcSet;
						this.LtoR10 = "waves8_1" + this.funcSet;
					}, 10);
					this.num = 1
				}
				else if (this.num == 1) {
					this.clear2();
					setTimeout(() => {
						this.u_2 = "waves1_2" + this.funcSet;
						this.LtoR1_2 = "waves5_2" + this.funcSet;
						this.LtoR2_2 = "waves4_2" + this.funcSet;
						this.LtoR3_2 = "waves3_2" + this.funcSet;
						this.LtoR4_2 = "waves2_2" + this.funcSet;
						this.LtoR5_2 = "waves3_2" + this.funcSet;
						this.LtoR6_2 = "waves4_2" + this.funcSet;
						this.LtoR7_2 = "waves5_2" + this.funcSet;
						this.LtoR8_2 = "waves6_2" + this.funcSet;
						this.LtoR9_2 = "waves7_2" + this.funcSet;
						this.LtoR10_2 = "waves8_2" + this.funcSet;
					}, 10)
					this.num = 0
				}
				break;

			case this.vKey == 73 && this.keyStatus == 1: //I
				if (this.num == 0) {
					this.clear();
					setTimeout(() => {
						this.i = "waves1_1" + this.funcSet;
						this.LtoR1 = "waves6_1" + this.funcSet;
						this.LtoR2 = "waves5_1" + this.funcSet;
						this.LtoR3 = "waves4_1" + this.funcSet;
						this.LtoR4 = "waves3_1" + this.funcSet;
						this.LtoR5 = "waves2_1" + this.funcSet;
						this.LtoR6 = "waves3_1" + this.funcSet;
						this.LtoR7 = "waves4_1" + this.funcSet;
						this.LtoR8 = "waves5_1" + this.funcSet;
						this.LtoR9 = "waves6_1" + this.funcSet;
						this.LtoR10 = "waves7_1" + this.funcSet;
					}, 10);
					this.num = 1
				}
				else if (this.num == 1) {
					this.clear2();
					setTimeout(() => {
						this.i_2 = "waves1_2" + this.funcSet;
						this.LtoR1_2 = "waves6_2" + this.funcSet;
						this.LtoR2_2 = "waves5_2" + this.funcSet;
						this.LtoR3_2 = "waves4_2" + this.funcSet;
						this.LtoR4_2 = "waves3_2" + this.funcSet;
						this.LtoR5_2 = "waves2_2" + this.funcSet;
						this.LtoR6_2 = "waves3_2" + this.funcSet;
						this.LtoR7_2 = "waves4_2" + this.funcSet;
						this.LtoR8_2 = "waves5_2" + this.funcSet;
						this.LtoR9_2 = "waves6_2" + this.funcSet;
						this.LtoR10_2 = "waves7_2" + this.funcSet;
					}, 10)
					this.num = 0
				}
				break;

			case this.vKey == 79 && this.keyStatus == 1: //O
				if (this.num == 0) {
					this.clear();
					setTimeout(() => {
						this.o = "waves1_1" + this.funcSet;
						this.LtoR1 = "waves6_1" + this.funcSet;
						this.LtoR2 = "waves5_1" + this.funcSet;
						this.LtoR3 = "waves4_1" + this.funcSet;
						this.LtoR4 = "waves3_1" + this.funcSet;
						this.LtoR5 = "waves2_1" + this.funcSet;
						this.LtoR6 = "waves3_1" + this.funcSet;
						this.LtoR7 = "waves4_1" + this.funcSet;
						this.LtoR8 = "waves5_1" + this.funcSet;
						this.LtoR9 = "waves6_1" + this.funcSet;
						this.LtoR10 = "waves7_1" + this.funcSet;
					}, 10);
					this.num = 1
				}
				else if (this.num == 1) {
					this.clear2();
					setTimeout(() => {
						this.o_2 = "waves1_2" + this.funcSet;
						this.LtoR1_2 = "waves6_2" + this.funcSet;
						this.LtoR2_2 = "waves5_2" + this.funcSet;
						this.LtoR3_2 = "waves4_2" + this.funcSet;
						this.LtoR4_2 = "waves3_2" + this.funcSet;
						this.LtoR5_2 = "waves2_2" + this.funcSet;
						this.LtoR6_2 = "waves3_2" + this.funcSet;
						this.LtoR7_2 = "waves4_2" + this.funcSet;
						this.LtoR8_2 = "waves5_2" + this.funcSet;
						this.LtoR9_2 = "waves6_2" + this.funcSet;
						this.LtoR10_2 = "waves7_2" + this.funcSet;
					}, 10)
					this.num = 0
				}
				break;

			case this.vKey == 80 && this.keyStatus == 1: //P
				if (this.num == 0) {
					this.clear();
					setTimeout(() => {
						this.p = "waves1_1" + this.funcSet;
						this.LtoR1 = "waves7_1" + this.funcSet;
						this.LtoR2 = "waves6_1" + this.funcSet;
						this.LtoR3 = "waves5_1" + this.funcSet;
						this.LtoR4 = "waves4_1" + this.funcSet;
						this.LtoR5 = "waves3_1" + this.funcSet;
						this.LtoR6 = "waves2_1" + this.funcSet;
						this.LtoR7 = "waves3_1" + this.funcSet;
						this.LtoR8 = "waves4_1" + this.funcSet;
						this.LtoR9 = "waves5_1" + this.funcSet;
						this.LtoR10 = "waves6_1" + this.funcSet;
					}, 10);
					this.num = 1
				}
				else if (this.num == 1) {
					this.clear2();
					setTimeout(() => {
						this.p_2 = "waves1_2" + this.funcSet;
						this.LtoR1_2 = "waves7_2" + this.funcSet;
						this.LtoR2_2 = "waves6_2" + this.funcSet;
						this.LtoR3_2 = "waves5_2" + this.funcSet;
						this.LtoR4_2 = "waves4_2" + this.funcSet;
						this.LtoR5_2 = "waves3_2" + this.funcSet;
						this.LtoR6_2 = "waves2_2" + this.funcSet;
						this.LtoR7_2 = "waves3_2" + this.funcSet;
						this.LtoR8_2 = "waves4_2" + this.funcSet;
						this.LtoR9_2 = "waves5_2" + this.funcSet;
						this.LtoR10_2 = "waves6_2" + this.funcSet;
					}, 10)
					this.num = 0
				}
				break;

			case this.vKey == 219 && this.keyStatus == 1: //lqu
				if (this.num == 0) {
					this.clear();
					setTimeout(() => {
						this.lqu = "waves1_1" + this.funcSet;
						this.LtoR1 = "waves7_1" + this.funcSet;
						this.LtoR2 = "waves6_1" + this.funcSet;
						this.LtoR3 = "waves5_1" + this.funcSet;
						this.LtoR4 = "waves4_1" + this.funcSet;
						this.LtoR5 = "waves3_1" + this.funcSet;
						this.LtoR6 = "waves2_1" + this.funcSet;
						this.LtoR7 = "waves3_1" + this.funcSet;
						this.LtoR8 = "waves4_1" + this.funcSet;
						this.LtoR9 = "waves5_1" + this.funcSet;
						this.LtoR10 = "waves6_1" + this.funcSet;
					}, 10);
					this.num = 1
				}
				else if (this.num == 1) {
					this.clear2();
					setTimeout(() => {
						this.lqu_2 = "waves1_2" + this.funcSet;
						this.LtoR1_2 = "waves7_2" + this.funcSet;
						this.LtoR2_2 = "waves6_2" + this.funcSet;
						this.LtoR3_2 = "waves5_2" + this.funcSet;
						this.LtoR4_2 = "waves4_2" + this.funcSet;
						this.LtoR5_2 = "waves3_2" + this.funcSet;
						this.LtoR6_2 = "waves2_2" + this.funcSet;
						this.LtoR7_2 = "waves3_2" + this.funcSet;
						this.LtoR8_2 = "waves4_2" + this.funcSet;
						this.LtoR9_2 = "waves5_2" + this.funcSet;
						this.LtoR10_2 = "waves6_2" + this.funcSet;
					}, 10)
					this.num = 0
				}
				break;

			case this.vKey == 221 && this.keyStatus == 1: //rqu 
				if (this.num == 0) {
					this.clear();
					setTimeout(() => {
						this.rqu = "waves1_1" + this.funcSet;
						this.LtoR1 = "waves8_1" + this.funcSet;
						this.LtoR2 = "waves7_1" + this.funcSet;
						this.LtoR3 = "waves6_1" + this.funcSet;
						this.LtoR4 = "waves5_1" + this.funcSet;
						this.LtoR5 = "waves4_1" + this.funcSet;
						this.LtoR6 = "waves3_1" + this.funcSet;
						this.LtoR7 = "waves2_1" + this.funcSet;
						this.LtoR8 = "waves3_1" + this.funcSet;
						this.LtoR9 = "waves4_1" + this.funcSet;
						this.LtoR10 = "waves5_1" + this.funcSet;
					}, 10);
					this.num = 1
				}
				else if (this.num == 1) {
					this.clear2();
					setTimeout(() => {
						this.rqu_2 = "waves1_2" + this.funcSet;
						this.LtoR1_2 = "waves8_2" + this.funcSet;
						this.LtoR2_2 = "waves7_2" + this.funcSet;
						this.LtoR3_2 = "waves6_2" + this.funcSet;
						this.LtoR4_2 = "waves5_2" + this.funcSet;
						this.LtoR5_2 = "waves4_2" + this.funcSet;
						this.LtoR6_2 = "waves3_2" + this.funcSet;
						this.LtoR7_2 = "waves2_2" + this.funcSet;
						this.LtoR8_2 = "waves3_2" + this.funcSet;
						this.LtoR9_2 = "waves4_2" + this.funcSet;
						this.LtoR10_2 = "waves5_2" + this.funcSet;
					}, 10)
					this.num = 0
				}
				break;

			case this.vKey == 220 && this.keyStatus == 1: //drawn
				if (this.num == 0) {
					this.clear();
					setTimeout(() => {
						this.drawn = "waves1_1" + this.funcSet;
						this.LtoR1 = "waves8_1" + this.funcSet;
						this.LtoR2 = "waves7_1" + this.funcSet;
						this.LtoR3 = "waves6_1" + this.funcSet;
						this.LtoR4 = "waves5_1" + this.funcSet;
						this.LtoR5 = "waves4_1" + this.funcSet;
						this.LtoR6 = "waves3_1" + this.funcSet;
						this.LtoR7 = "waves2_1" + this.funcSet;
						this.LtoR8 = "waves3_1" + this.funcSet;
						this.LtoR9 = "waves4_1" + this.funcSet;
						this.LtoR10 = "waves5_1" + this.funcSet;
					}, 10);
					this.num = 1
				}
				else if (this.num == 1) {
					this.clear2();
					setTimeout(() => {
						this.drawn_2 = "waves1_2" + this.funcSet;
						this.LtoR1_2 = "waves8_2" + this.funcSet;
						this.LtoR2_2 = "waves7_2" + this.funcSet;
						this.LtoR3_2 = "waves6_2" + this.funcSet;
						this.LtoR4_2 = "waves5_2" + this.funcSet;
						this.LtoR5_2 = "waves4_2" + this.funcSet;
						this.LtoR6_2 = "waves3_2" + this.funcSet;
						this.LtoR7_2 = "waves2_2" + this.funcSet;
						this.LtoR8_2 = "waves3_2" + this.funcSet;
						this.LtoR9_2 = "waves4_2" + this.funcSet;
						this.LtoR10_2 = "waves5_2" + this.funcSet;
					}, 10)
					this.num = 0
				}
				break;

			case this.vKey == 46 && this.keyStatus == 1: //delete
				if (this.num == 0) {
					this.clear();
					setTimeout(() => {
						this.delete = "waves1_1" + this.funcSet;
						this.LtoR1 = "waves9_1" + this.funcSet;
						this.LtoR2 = "waves8_1" + this.funcSet;
						this.LtoR3 = "waves7_1" + this.funcSet;
						this.LtoR4 = "waves6_1" + this.funcSet;
						this.LtoR5 = "waves5_1" + this.funcSet;
						this.LtoR6 = "waves4_1" + this.funcSet;
						this.LtoR7 = "waves3_1" + this.funcSet;
						this.LtoR8 = "waves2_1" + this.funcSet;
						this.LtoR9 = "waves3_1" + this.funcSet;
						this.LtoR10 = "waves4_1" + this.funcSet;
					}, 10);
					this.num = 1
				}
				else if (this.num == 1) {
					this.clear2();
					setTimeout(() => {
						this.delete_2 = "waves1_2" + this.funcSet;
						this.LtoR1_2 = "waves9_2" + this.funcSet;
						this.LtoR2_2 = "waves8_2" + this.funcSet;
						this.LtoR3_2 = "waves7_2" + this.funcSet;
						this.LtoR4_2 = "waves6_2" + this.funcSet;
						this.LtoR5_2 = "waves5_2" + this.funcSet;
						this.LtoR6_2 = "waves4_2" + this.funcSet;
						this.LtoR7_2 = "waves3_2" + this.funcSet;
						this.LtoR8_2 = "waves2_2" + this.funcSet;
						this.LtoR9_2 = "waves3_2" + this.funcSet;
						this.LtoR10_2 = "waves4_2" + this.funcSet;
					}, 10)
					this.num = 0
				}
				break;

			case this.vKey == 35 && this.keyStatus == 1: //end
				if (this.num == 0) {
					this.clear();
					setTimeout(() => {
						this.end = "waves1_1" + this.funcSet;
						this.LtoR1 = "waves9_1" + this.funcSet;
						this.LtoR2 = "waves8_1" + this.funcSet;
						this.LtoR3 = "waves7_1" + this.funcSet;
						this.LtoR4 = "waves6_1" + this.funcSet;
						this.LtoR5 = "waves5_1" + this.funcSet;
						this.LtoR6 = "waves4_1" + this.funcSet;
						this.LtoR7 = "waves3_1" + this.funcSet;
						this.LtoR8 = "waves2_1" + this.funcSet;
						this.LtoR9 = "waves3_1" + this.funcSet;
						this.LtoR10 = "waves4_1" + this.funcSet;
					}, 10);
					this.num = 1
				}
				else if (this.num == 1) {
					this.clear2();
					setTimeout(() => {
						this.end_2 = "waves1_2" + this.funcSet;
						this.LtoR1_2 = "waves9_2" + this.funcSet;
						this.LtoR2_2 = "waves8_2" + this.funcSet;
						this.LtoR3_2 = "waves7_2" + this.funcSet;
						this.LtoR4_2 = "waves6_2" + this.funcSet;
						this.LtoR5_2 = "waves5_2" + this.funcSet;
						this.LtoR6_2 = "waves4_2" + this.funcSet;
						this.LtoR7_2 = "waves3_2" + this.funcSet;
						this.LtoR8_2 = "waves2_2" + this.funcSet;
						this.LtoR9_2 = "waves3_2" + this.funcSet;
						this.LtoR10_2 = "waves4_2" + this.funcSet;
					}, 10)
					this.num = 0
				}
				break;

			case this.vKey == 34 && this.keyStatus == 1: //pdown
				if (this.num == 0) {
					this.clear();
					setTimeout(() => {
						this.pdown = "waves1_1" + this.funcSet;
						this.LtoR1 = "waves9_1" + this.funcSet;
						this.LtoR2 = "waves8_1" + this.funcSet;
						this.LtoR3 = "waves7_1" + this.funcSet;
						this.LtoR4 = "waves6_1" + this.funcSet;
						this.LtoR5 = "waves5_1" + this.funcSet;
						this.LtoR6 = "waves4_1" + this.funcSet;
						this.LtoR7 = "waves3_1" + this.funcSet;
						this.LtoR8 = "waves2_1" + this.funcSet;
						this.LtoR9 = "waves3_1" + this.funcSet;
						this.LtoR10 = "waves4_1" + this.funcSet;
					}, 10);
					this.num = 1
				}
				else if (this.num == 1) {
					this.clear2();
					setTimeout(() => {
						this.pdown_2 = "waves1_2" + this.funcSet;
						this.LtoR1_2 = "waves9_2" + this.funcSet;
						this.LtoR2_2 = "waves8_2" + this.funcSet;
						this.LtoR3_2 = "waves7_2" + this.funcSet;
						this.LtoR4_2 = "waves6_2" + this.funcSet;
						this.LtoR5_2 = "waves5_2" + this.funcSet;
						this.LtoR6_2 = "waves4_2" + this.funcSet;
						this.LtoR7_2 = "waves3_2" + this.funcSet;
						this.LtoR8_2 = "waves2_2" + this.funcSet;
						this.LtoR9_2 = "waves3_2" + this.funcSet;
						this.LtoR10_2 = "waves4_2" + this.funcSet;
					}, 10)
					this.num = 0
				}
				break;

			case this.vKey == 103 && this.keyStatus == 1: //num7
				if (this.num == 0) {
					this.clear();
					setTimeout(() => {
						this.num7 = "waves1_1" + this.funcSet;
						this.LtoR1 = "waves10_1" + this.funcSet;
						this.LtoR2 = "waves9_1" + this.funcSet;
						this.LtoR3 = "waves8_1" + this.funcSet;
						this.LtoR4 = "waves7_1" + this.funcSet;
						this.LtoR5 = "waves6_1" + this.funcSet;
						this.LtoR6 = "waves5_1" + this.funcSet;
						this.LtoR7 = "waves4_1" + this.funcSet;
						this.LtoR8 = "waves3_1" + this.funcSet;
						this.LtoR9 = "waves2_1" + this.funcSet;
						this.LtoR10 = "waves3_1" + this.funcSet;
					}, 10);
					this.num = 1
				}
				else if (this.num == 1) {
					this.clear2();
					setTimeout(() => {
						this.num7_2 = "waves1_2" + this.funcSet;
						this.LtoR1_2 = "waves10_2" + this.funcSet;
						this.LtoR2_2 = "waves9_2" + this.funcSet;
						this.LtoR3_2 = "waves8_2" + this.funcSet;
						this.LtoR4_2 = "waves7_2" + this.funcSet;
						this.LtoR5_2 = "waves6_2" + this.funcSet;
						this.LtoR6_2 = "waves5_2" + this.funcSet;
						this.LtoR7_2 = "waves4_2" + this.funcSet;
						this.LtoR8_2 = "waves3_2" + this.funcSet;
						this.LtoR9_2 = "waves2_2" + this.funcSet;
						this.LtoR10_2 = "waves3_2" + this.funcSet;
					}, 10)
					this.num = 0
				}
				break;

			case this.vKey == 104 && this.keyStatus == 1: //num8
				if (this.num == 0) {
					this.clear();
					setTimeout(() => {
						this.num8 = "waves1_1" + this.funcSet;
						this.LtoR1 = "waves10_1" + this.funcSet;
						this.LtoR2 = "waves9_1" + this.funcSet;
						this.LtoR3 = "waves8_1" + this.funcSet;
						this.LtoR4 = "waves7_1" + this.funcSet;
						this.LtoR5 = "waves6_1" + this.funcSet;
						this.LtoR6 = "waves5_1" + this.funcSet;
						this.LtoR7 = "waves4_1" + this.funcSet;
						this.LtoR8 = "waves3_1" + this.funcSet;
						this.LtoR9 = "waves2_1" + this.funcSet;
						this.LtoR10 = "waves3_1" + this.funcSet;
					}, 10);
					this.num = 1
				}
				else if (this.num == 1) {
					this.clear2();
					setTimeout(() => {
						this.num8_2 = "waves1_2" + this.funcSet;
						this.LtoR1_2 = "waves10_2" + this.funcSet;
						this.LtoR2_2 = "waves9_2" + this.funcSet;
						this.LtoR3_2 = "waves8_2" + this.funcSet;
						this.LtoR4_2 = "waves7_2" + this.funcSet;
						this.LtoR5_2 = "waves6_2" + this.funcSet;
						this.LtoR6_2 = "waves5_2" + this.funcSet;
						this.LtoR7_2 = "waves4_2" + this.funcSet;
						this.LtoR8_2 = "waves3_2" + this.funcSet;
						this.LtoR9_2 = "waves2_2" + this.funcSet;
						this.LtoR10_2 = "waves3_2" + this.funcSet;
					}, 10)
					this.num = 0
				}
				break;

			case this.vKey == 105 && this.keyStatus == 1: //num9
				if (this.num == 0) {
					this.clear();
					setTimeout(() => {
						this.num9 = "waves1_1" + this.funcSet;
						this.LtoR1 = "waves11_1" + this.funcSet;
						this.LtoR2 = "waves10_1" + this.funcSet;
						this.LtoR3 = "waves9_1" + this.funcSet;
						this.LtoR4 = "waves8_1" + this.funcSet;
						this.LtoR5 = "waves7_1" + this.funcSet;
						this.LtoR6 = "waves6_1" + this.funcSet;
						this.LtoR7 = "waves5_1" + this.funcSet;
						this.LtoR8 = "waves4_1" + this.funcSet;
						this.LtoR9 = "waves3_1" + this.funcSet;
						this.LtoR10 = "waves2_1" + this.funcSet;
					}, 10);
					this.num = 1
				}
				else if (this.num == 1) {
					this.clear2();
					setTimeout(() => {
						this.num9_2 = "waves1_2" + this.funcSet;
						this.LtoR1_2 = "waves11_2" + this.funcSet;
						this.LtoR2_2 = "waves10_2" + this.funcSet;
						this.LtoR3_2 = "waves9_2" + this.funcSet;
						this.LtoR4_2 = "waves8_2" + this.funcSet;
						this.LtoR5_2 = "waves7_2" + this.funcSet;
						this.LtoR6_2 = "waves6_2" + this.funcSet;
						this.LtoR7_2 = "waves5_2" + this.funcSet;
						this.LtoR8_2 = "waves4_2" + this.funcSet;
						this.LtoR9_2 = "waves3_2" + this.funcSet;
						this.LtoR10_2 = "waves2_2" + this.funcSet;
					}, 10)
					this.num = 0
				}
				break;

			case this.vKey == 107 && this.keyStatus == 1: //numplus
				if (this.num == 0) {
					this.clear();
					setTimeout(() => {
						this.numplus = "waves1_1" + this.funcSet;
						this.LtoR1 = "waves11_1" + this.funcSet;
						this.LtoR2 = "waves10_1" + this.funcSet;
						this.LtoR3 = "waves9_1" + this.funcSet;
						this.LtoR4 = "waves8_1" + this.funcSet;
						this.LtoR5 = "waves7_1" + this.funcSet;
						this.LtoR6 = "waves6_1" + this.funcSet;
						this.LtoR7 = "waves5_1" + this.funcSet;
						this.LtoR8 = "waves4_1" + this.funcSet;
						this.LtoR9 = "waves3_1" + this.funcSet;
						this.LtoR10 = "waves2_1" + this.funcSet;
					}, 10);
					this.num = 1
				}
				else if (this.num == 1) {
					this.clear2();
					setTimeout(() => {
						this.numplus_2 = "waves1_2" + this.funcSet;
						this.LtoR1_2 = "waves11_2" + this.funcSet;
						this.LtoR2_2 = "waves10_2" + this.funcSet;
						this.LtoR3_2 = "waves9_2" + this.funcSet;
						this.LtoR4_2 = "waves8_2" + this.funcSet;
						this.LtoR5_2 = "waves7_2" + this.funcSet;
						this.LtoR6_2 = "waves6_2" + this.funcSet;
						this.LtoR7_2 = "waves5_2" + this.funcSet;
						this.LtoR8_2 = "waves4_2" + this.funcSet;
						this.LtoR9_2 = "waves3_2" + this.funcSet;
						this.LtoR10_2 = "waves2_2" + this.funcSet;
					}, 10)
					this.num = 0
				}
				break;

			case this.vKey == 20 && this.keyStatus == 1: //caps
				if (this.num == 0) {
					this.clear();
					setTimeout(() => {
						this.caps = "waves1_1" + this.funcSet;
						this.LtoR1 = "waves2_1" + this.funcSet;
						this.LtoR2 = "waves3_1" + this.funcSet;
						this.LtoR3 = "waves4_1" + this.funcSet;
						this.LtoR4 = "waves5_1" + this.funcSet;
						this.LtoR5 = "waves6_1" + this.funcSet;
						this.LtoR6 = "waves7_1" + this.funcSet;
						this.LtoR7 = "waves8_1" + this.funcSet;
						this.LtoR8 = "waves9_1" + this.funcSet;
						this.LtoR9 = "waves10_1" + this.funcSet;
						this.LtoR10 = "waves11_1" + this.funcSet;
					}, 10);
					this.num = 1
				}
				else if (this.num == 1) {
					this.clear2();
					setTimeout(() => {
						this.caps_2 = "waves1_2" + this.funcSet;
						this.LtoR1_2 = "waves2_2" + this.funcSet;
						this.LtoR2_2 = "waves3_2" + this.funcSet;
						this.LtoR3_2 = "waves4_2" + this.funcSet;
						this.LtoR4_2 = "waves5_2" + this.funcSet;
						this.LtoR5_2 = "waves6_2" + this.funcSet;
						this.LtoR6_2 = "waves7_2" + this.funcSet;
						this.LtoR7_2 = "waves8_2" + this.funcSet;
						this.LtoR8_2 = "waves9_2" + this.funcSet;
						this.LtoR9_2 = "waves10_2" + this.funcSet;
						this.LtoR10_2 = "waves11_2" + this.funcSet;
					}, 10)
					this.num = 0
				}
				break;

			case this.vKey == 65 && this.keyStatus == 1: //A
				if (this.num == 0) {
					this.clear();
					setTimeout(() => {
						this.a = "waves1_1" + this.funcSet;
						this.LtoR1 = "waves2_1" + this.funcSet;
						this.LtoR2 = "waves3_1" + this.funcSet;
						this.LtoR3 = "waves4_1" + this.funcSet;
						this.LtoR4 = "waves5_1" + this.funcSet;
						this.LtoR5 = "waves6_1" + this.funcSet;
						this.LtoR6 = "waves7_1" + this.funcSet;
						this.LtoR7 = "waves8_1" + this.funcSet;
						this.LtoR8 = "waves9_1" + this.funcSet;
						this.LtoR9 = "waves10_1" + this.funcSet;
						this.LtoR10 = "waves11_1" + this.funcSet;
					}, 10);
					this.num = 1
				}
				else if (this.num == 1) {
					this.clear2();
					setTimeout(() => {
						this.a_2 = "waves1_2" + this.funcSet;
						this.LtoR1_2 = "waves2_2" + this.funcSet;
						this.LtoR2_2 = "waves3_2" + this.funcSet;
						this.LtoR3_2 = "waves4_2" + this.funcSet;
						this.LtoR4_2 = "waves5_2" + this.funcSet;
						this.LtoR5_2 = "waves6_2" + this.funcSet;
						this.LtoR6_2 = "waves7_2" + this.funcSet;
						this.LtoR7_2 = "waves8_2" + this.funcSet;
						this.LtoR8_2 = "waves9_2" + this.funcSet;
						this.LtoR9_2 = "waves10_2" + this.funcSet;
						this.LtoR10_2 = "waves11_2" + this.funcSet;
					}, 10)
					this.num = 0
				}
				break;

			case this.vKey == 83 && this.keyStatus == 1: //s
				if (this.num == 0) {
					this.clear();
					setTimeout(() => {
						this.s = "waves1_1" + this.funcSet;
						this.LtoR1 = "waves3_1" + this.funcSet;
						this.LtoR2 = "waves2_1" + this.funcSet;
						this.LtoR3 = "waves3_1" + this.funcSet;
						this.LtoR4 = "waves4_1" + this.funcSet;
						this.LtoR5 = "waves5_1" + this.funcSet;
						this.LtoR6 = "waves6_1" + this.funcSet;
						this.LtoR7 = "waves7_1" + this.funcSet;
						this.LtoR8 = "waves8_1" + this.funcSet;
						this.LtoR9 = "waves9_1" + this.funcSet;
						this.LtoR10 = "waves10_1" + this.funcSet;
					}, 10);
					this.num = 1
				}
				else if (this.num == 1) {
					this.clear2();
					setTimeout(() => {
						this.s_2 = "waves1_2" + this.funcSet;
						this.LtoR1_2 = "waves3_2" + this.funcSet;
						this.LtoR2_2 = "waves2_2" + this.funcSet;
						this.LtoR3_2 = "waves3_2" + this.funcSet;
						this.LtoR4_2 = "waves4_2" + this.funcSet;
						this.LtoR5_2 = "waves5_2" + this.funcSet;
						this.LtoR6_2 = "waves6_2" + this.funcSet;
						this.LtoR7_2 = "waves7_2" + this.funcSet;
						this.LtoR8_2 = "waves8_2" + this.funcSet;
						this.LtoR9_2 = "waves9_2" + this.funcSet;
						this.LtoR10_2 = "waves10_2" + this.funcSet;
					}, 10)
					this.num = 0
				}
				break;

			case this.vKey == 68 && this.keyStatus == 1: //d
				if (this.num == 0) {
					this.clear();
					setTimeout(() => {
						this.d = "waves1_1" + this.funcSet;
						this.LtoR1 = "waves3_1" + this.funcSet;
						this.LtoR2 = "waves2_1" + this.funcSet;
						this.LtoR3 = "waves3_1" + this.funcSet;
						this.LtoR4 = "waves4_1" + this.funcSet;
						this.LtoR5 = "waves5_1" + this.funcSet;
						this.LtoR6 = "waves6_1" + this.funcSet;
						this.LtoR7 = "waves7_1" + this.funcSet;
						this.LtoR8 = "waves8_1" + this.funcSet;
						this.LtoR9 = "waves9_1" + this.funcSet;
						this.LtoR10 = "waves10_1" + this.funcSet;
					}, 10);
					this.num = 1
				}
				else if (this.num == 1) {
					this.clear2();
					setTimeout(() => {
						this.d_2 = "waves1_2" + this.funcSet;
						this.LtoR1_2 = "waves3_2" + this.funcSet;
						this.LtoR2_2 = "waves2_2" + this.funcSet;
						this.LtoR3_2 = "waves3_2" + this.funcSet;
						this.LtoR4_2 = "waves4_2" + this.funcSet;
						this.LtoR5_2 = "waves5_2" + this.funcSet;
						this.LtoR6_2 = "waves6_2" + this.funcSet;
						this.LtoR7_2 = "waves7_2" + this.funcSet;
						this.LtoR8_2 = "waves8_2" + this.funcSet;
						this.LtoR9_2 = "waves9_2" + this.funcSet;
						this.LtoR10_2 = "waves10_2" + this.funcSet;
					}, 10)
					this.num = 0
				}
				break;

			case this.vKey == 70 && this.keyStatus == 1: //f
				if (this.num == 0) {
					this.clear();
					setTimeout(() => {
						this.f = "waves1_1" + this.funcSet;
						this.LtoR1 = "waves4_1" + this.funcSet;
						this.LtoR2 = "waves3_1" + this.funcSet;
						this.LtoR3 = "waves2_1" + this.funcSet;
						this.LtoR4 = "waves3_1" + this.funcSet;
						this.LtoR5 = "waves4_1" + this.funcSet;
						this.LtoR6 = "waves5_1" + this.funcSet;
						this.LtoR7 = "waves6_1" + this.funcSet;
						this.LtoR8 = "waves7_1" + this.funcSet;
						this.LtoR9 = "waves8_1" + this.funcSet;
						this.LtoR10 = "waves9_1" + this.funcSet;
					}, 10);
					this.num = 1
				}
				else if (this.num == 1) {
					this.clear2();
					setTimeout(() => {
						this.f_2 = "waves1_2" + this.funcSet;
						this.LtoR1_2 = "waves4_2" + this.funcSet;
						this.LtoR2_2 = "waves3_2" + this.funcSet;
						this.LtoR3_2 = "waves2_2" + this.funcSet;
						this.LtoR4_2 = "waves3_2" + this.funcSet;
						this.LtoR5_2 = "waves4_2" + this.funcSet;
						this.LtoR6_2 = "waves5_2" + this.funcSet;
						this.LtoR7_2 = "waves6_2" + this.funcSet;
						this.LtoR8_2 = "waves7_2" + this.funcSet;
						this.LtoR9_2 = "waves8_2" + this.funcSet;
						this.LtoR10_2 = "waves9_2" + this.funcSet;
					}, 10)
					this.num = 0
				}
				break;

			case this.vKey == 71 && this.keyStatus == 1: //g
				if (this.num == 0) {
					this.clear();
					setTimeout(() => {
						this.g = "waves1_1" + this.funcSet;
						this.LtoR1 = "waves4_1" + this.funcSet;
						this.LtoR2 = "waves3_1" + this.funcSet;
						this.LtoR3 = "waves2_1" + this.funcSet;
						this.LtoR4 = "waves3_1" + this.funcSet;
						this.LtoR5 = "waves4_1" + this.funcSet;
						this.LtoR6 = "waves5_1" + this.funcSet;
						this.LtoR7 = "waves6_1" + this.funcSet;
						this.LtoR8 = "waves7_1" + this.funcSet;
						this.LtoR9 = "waves8_1" + this.funcSet;
						this.LtoR10 = "waves9_1" + this.funcSet;
					}, 10);
					this.num = 1
				}
				else if (this.num == 1) {
					this.clear2();
					setTimeout(() => {
						this.g_2 = "waves1_2" + this.funcSet;
						this.LtoR1_2 = "waves4_2" + this.funcSet;
						this.LtoR2_2 = "waves3_2" + this.funcSet;
						this.LtoR3_2 = "waves2_2" + this.funcSet;
						this.LtoR4_2 = "waves3_2" + this.funcSet;
						this.LtoR5_2 = "waves4_2" + this.funcSet;
						this.LtoR6_2 = "waves5_2" + this.funcSet;
						this.LtoR7_2 = "waves6_2" + this.funcSet;
						this.LtoR8_2 = "waves7_2" + this.funcSet;
						this.LtoR9_2 = "waves8_2" + this.funcSet;
						this.LtoR10_2 = "waves9_2" + this.funcSet;
					}, 10)
					this.num = 0
				}

				break;

			case this.vKey == 72 && this.keyStatus == 1: //h
				if (this.num == 0) {
					this.clear();
					setTimeout(() => {
						this.h = "waves1_1" + this.funcSet;
						this.LtoR1 = "waves5_1" + this.funcSet;
						this.LtoR2 = "waves4_1" + this.funcSet;
						this.LtoR3 = "waves3_1" + this.funcSet;
						this.LtoR4 = "waves2_1" + this.funcSet;
						this.LtoR5 = "waves3_1" + this.funcSet;
						this.LtoR6 = "waves4_1" + this.funcSet;
						this.LtoR7 = "waves5_1" + this.funcSet;
						this.LtoR8 = "waves6_1" + this.funcSet;
						this.LtoR9 = "waves7_1" + this.funcSet;
						this.LtoR10 = "waves8_1" + this.funcSet;
					}, 10);
					this.num = 1
				}
				else if (this.num == 1) {
					this.clear2();
					setTimeout(() => {
						this.h_2 = "waves1_2" + this.funcSet;
						this.LtoR1_2 = "waves5_2" + this.funcSet;
						this.LtoR2_2 = "waves4_2" + this.funcSet;
						this.LtoR3_2 = "waves3_2" + this.funcSet;
						this.LtoR4_2 = "waves2_2" + this.funcSet;
						this.LtoR5_2 = "waves3_2" + this.funcSet;
						this.LtoR6_2 = "waves4_2" + this.funcSet;
						this.LtoR7_2 = "waves5_2" + this.funcSet;
						this.LtoR8_2 = "waves6_2" + this.funcSet;
						this.LtoR9_2 = "waves7_2" + this.funcSet;
						this.LtoR10_2 = "waves8_2" + this.funcSet;
					}, 10)
					this.num = 0
				}
				break;

			case this.vKey == 74 && this.keyStatus == 1: //j
				if (this.num == 0) {
					this.clear();
					setTimeout(() => {
						this.j = "waves1_1" + this.funcSet;
						this.LtoR1 = "waves5_1" + this.funcSet;
						this.LtoR2 = "waves4_1" + this.funcSet;
						this.LtoR3 = "waves3_1" + this.funcSet;
						this.LtoR4 = "waves2_1" + this.funcSet;
						this.LtoR5 = "waves3_1" + this.funcSet;
						this.LtoR6 = "waves4_1" + this.funcSet;
						this.LtoR7 = "waves5_1" + this.funcSet;
						this.LtoR8 = "waves6_1" + this.funcSet;
						this.LtoR9 = "waves7_1" + this.funcSet;
						this.LtoR10 = "waves8_1" + this.funcSet;
					}, 10);
					this.num = 1
				}
				else if (this.num == 1) {
					this.clear2();
					setTimeout(() => {
						this.j_2 = "waves1_2" + this.funcSet;
						this.LtoR1_2 = "waves5_2" + this.funcSet;
						this.LtoR2_2 = "waves4_2" + this.funcSet;
						this.LtoR3_2 = "waves3_2" + this.funcSet;
						this.LtoR4_2 = "waves2_2" + this.funcSet;
						this.LtoR5_2 = "waves3_2" + this.funcSet;
						this.LtoR6_2 = "waves4_2" + this.funcSet;
						this.LtoR7_2 = "waves5_2" + this.funcSet;
						this.LtoR8_2 = "waves6_2" + this.funcSet;
						this.LtoR9_2 = "waves7_2" + this.funcSet;
						this.LtoR10_2 = "waves8_2" + this.funcSet;
					}, 10)
					this.num = 0
				}
				break;

			case this.vKey == 75 && this.keyStatus == 1: //k 
				if (this.num == 0) {
					this.clear();
					setTimeout(() => {
						this.k = "waves1_1" + this.funcSet;
						this.LtoR1 = "waves6_1" + this.funcSet;
						this.LtoR2 = "waves5_1" + this.funcSet;
						this.LtoR3 = "waves4_1" + this.funcSet;
						this.LtoR4 = "waves3_1" + this.funcSet;
						this.LtoR5 = "waves2_1" + this.funcSet;
						this.LtoR6 = "waves3_1" + this.funcSet;
						this.LtoR7 = "waves4_1" + this.funcSet;
						this.LtoR8 = "waves5_1" + this.funcSet;
						this.LtoR9 = "waves6_1" + this.funcSet;
						this.LtoR10 = "waves7_1" + this.funcSet;
					}, 10);
					this.num = 1
				}
				else if (this.num == 1) {
					this.clear2();
					setTimeout(() => {
						this.k_2 = "waves1_2" + this.funcSet;
						this.LtoR1_2 = "waves6_2" + this.funcSet;
						this.LtoR2_2 = "waves5_2" + this.funcSet;
						this.LtoR3_2 = "waves4_2" + this.funcSet;
						this.LtoR4_2 = "waves3_2" + this.funcSet;
						this.LtoR5_2 = "waves2_2" + this.funcSet;
						this.LtoR6_2 = "waves3_2" + this.funcSet;
						this.LtoR7_2 = "waves4_2" + this.funcSet;
						this.LtoR8_2 = "waves5_2" + this.funcSet;
						this.LtoR9_2 = "waves6_2" + this.funcSet;
						this.LtoR10_2 = "waves7_2" + this.funcSet;
					}, 10)
					this.num = 0
				}
				break;

			case this.vKey == 76 && this.keyStatus == 1: //l
				if (this.num == 0) {
					this.clear();
					setTimeout(() => {
						this.l = "waves1_1" + this.funcSet;
						this.LtoR1 = "waves6_1" + this.funcSet;
						this.LtoR2 = "waves5_1" + this.funcSet;
						this.LtoR3 = "waves4_1" + this.funcSet;
						this.LtoR4 = "waves3_1" + this.funcSet;
						this.LtoR5 = "waves2_1" + this.funcSet;
						this.LtoR6 = "waves3_1" + this.funcSet;
						this.LtoR7 = "waves4_1" + this.funcSet;
						this.LtoR8 = "waves5_1" + this.funcSet;
						this.LtoR9 = "waves6_1" + this.funcSet;
						this.LtoR10 = "waves7_1" + this.funcSet;
					}, 10);
					this.num = 1
				}
				else if (this.num == 1) {
					this.clear2();
					setTimeout(() => {
						this.l_2 = "waves1_2" + this.funcSet;
						this.LtoR1_2 = "waves6_2" + this.funcSet;
						this.LtoR2_2 = "waves5_2" + this.funcSet;
						this.LtoR3_2 = "waves4_2" + this.funcSet;
						this.LtoR4_2 = "waves3_2" + this.funcSet;
						this.LtoR5_2 = "waves2_2" + this.funcSet;
						this.LtoR6_2 = "waves3_2" + this.funcSet;
						this.LtoR7_2 = "waves4_2" + this.funcSet;
						this.LtoR8_2 = "waves5_2" + this.funcSet;
						this.LtoR9_2 = "waves6_2" + this.funcSet;
						this.LtoR10_2 = "waves7_2" + this.funcSet;
					}, 10)
					this.num = 0
				}
				break;

			case this.vKey == 186 && this.keyStatus == 1: //sem
				if (this.num == 0) {
					this.clear();
					setTimeout(() => {
						this.sem = "waves1_1" + this.funcSet;
						this.LtoR1 = "waves7_1" + this.funcSet;
						this.LtoR2 = "waves6_1" + this.funcSet;
						this.LtoR3 = "waves5_1" + this.funcSet;
						this.LtoR4 = "waves4_1" + this.funcSet;
						this.LtoR5 = "waves3_1" + this.funcSet;
						this.LtoR6 = "waves2_1" + this.funcSet;
						this.LtoR7 = "waves3_1" + this.funcSet;
						this.LtoR8 = "waves4_1" + this.funcSet;
						this.LtoR9 = "waves5_1" + this.funcSet;
						this.LtoR10 = "waves6_1" + this.funcSet;
					}, 10);
					this.num = 1
				}
				else if (this.num == 1) {
					this.clear2();
					setTimeout(() => {
						this.sem_2 = "waves1_2" + this.funcSet;
						this.LtoR1_2 = "waves7_2" + this.funcSet;
						this.LtoR2_2 = "waves6_2" + this.funcSet;
						this.LtoR3_2 = "waves5_2" + this.funcSet;
						this.LtoR4_2 = "waves4_2" + this.funcSet;
						this.LtoR5_2 = "waves3_2" + this.funcSet;
						this.LtoR6_2 = "waves2_2" + this.funcSet;
						this.LtoR7_2 = "waves3_2" + this.funcSet;
						this.LtoR8_2 = "waves4_2" + this.funcSet;
						this.LtoR9_2 = "waves5_2" + this.funcSet;
						this.LtoR10_2 = "waves6_2" + this.funcSet;
					}, 10)
					this.num = 0
				}
				break;

			case this.vKey == 222 && this.keyStatus == 1: //quo
				if (this.num == 0) {
					this.clear();
					setTimeout(() => {
						this.quo = "waves1_1" + this.funcSet;
						this.LtoR1 = "waves7_1" + this.funcSet;
						this.LtoR2 = "waves6_1" + this.funcSet;
						this.LtoR3 = "waves5_1" + this.funcSet;
						this.LtoR4 = "waves4_1" + this.funcSet;
						this.LtoR5 = "waves3_1" + this.funcSet;
						this.LtoR6 = "waves2_1" + this.funcSet;
						this.LtoR7 = "waves3_1" + this.funcSet;
						this.LtoR8 = "waves4_1" + this.funcSet;
						this.LtoR9 = "waves5_1" + this.funcSet;
						this.LtoR10 = "waves6_1" + this.funcSet;
					}, 10);
					this.num = 1
				}
				else if (this.num == 1) {
					this.clear2();
					setTimeout(() => {
						this.quo_2 = "waves1_2" + this.funcSet;
						this.LtoR1_2 = "waves7_2" + this.funcSet;
						this.LtoR2_2 = "waves6_2" + this.funcSet;
						this.LtoR3_2 = "waves5_2" + this.funcSet;
						this.LtoR4_2 = "waves4_2" + this.funcSet;
						this.LtoR5_2 = "waves3_2" + this.funcSet;
						this.LtoR6_2 = "waves2_2" + this.funcSet;
						this.LtoR7_2 = "waves3_2" + this.funcSet;
						this.LtoR8_2 = "waves4_2" + this.funcSet;
						this.LtoR9_2 = "waves5_2" + this.funcSet;
						this.LtoR10_2 = "waves6_2" + this.funcSet;
					}, 10)
					this.num = 0
				}
				break;
			case this.vKey == 13 && this.keyStatus == 1: //enter
				if (this.num == 0) {
					this.clear();
					setTimeout(() => {
						this.enter = "waves1_1" + this.funcSet;
						this.LtoR1 = "waves8_1" + this.funcSet;
						this.LtoR2 = "waves7_1" + this.funcSet;
						this.LtoR3 = "waves6_1" + this.funcSet;
						this.LtoR4 = "waves5_1" + this.funcSet;
						this.LtoR5 = "waves4_1" + this.funcSet;
						this.LtoR6 = "waves3_1" + this.funcSet;
						this.LtoR7 = "waves2_1" + this.funcSet;
						this.LtoR8 = "waves3_1" + this.funcSet;
						this.LtoR9 = "waves4_1" + this.funcSet;
						this.LtoR10 = "waves5_1" + this.funcSet;
					}, 10);
					this.num = 1
				}
				else if (this.num == 1) {
					this.clear2();
					setTimeout(() => {
						this.enter_2 = "waves1_2" + this.funcSet;
						this.LtoR1_2 = "waves8_2" + this.funcSet;
						this.LtoR2_2 = "waves7_2" + this.funcSet;
						this.LtoR3_2 = "waves6_2" + this.funcSet;
						this.LtoR4_2 = "waves5_2" + this.funcSet;
						this.LtoR5_2 = "waves4_2" + this.funcSet;
						this.LtoR6_2 = "waves3_2" + this.funcSet;
						this.LtoR7_2 = "waves2_2" + this.funcSet;
						this.LtoR8_2 = "waves3_2" + this.funcSet;
						this.LtoR9_2 = "waves4_2" + this.funcSet;
						this.LtoR10_2 = "waves5_2" + this.funcSet;
					}, 10)
					this.num = 0
				}
				break;

			case this.vKey == 100 && this.keyStatus == 1: //num4
				if (this.num == 0) {
					this.clear();
					setTimeout(() => {
						this.num4 = "waves1_1" + this.funcSet;
						this.LtoR1 = "waves10_1" + this.funcSet;
						this.LtoR2 = "waves9_1" + this.funcSet;
						this.LtoR3 = "waves8_1" + this.funcSet;
						this.LtoR4 = "waves7_1" + this.funcSet;
						this.LtoR5 = "waves6_1" + this.funcSet;
						this.LtoR6 = "waves5_1" + this.funcSet;
						this.LtoR7 = "waves4_1" + this.funcSet;
						this.LtoR8 = "waves3_1" + this.funcSet;
						this.LtoR9 = "waves2_1" + this.funcSet;
						this.LtoR10 = "waves3_1" + this.funcSet;
					}, 10);
					this.num = 1
				}
				else if (this.num == 1) {
					this.clear2();
					setTimeout(() => {
						this.num4_2 = "waves1_2" + this.funcSet;
						this.LtoR1_2 = "waves10_2" + this.funcSet;
						this.LtoR2_2 = "waves9_2" + this.funcSet;
						this.LtoR3_2 = "waves8_2" + this.funcSet;
						this.LtoR4_2 = "waves7_2" + this.funcSet;
						this.LtoR5_2 = "waves6_2" + this.funcSet;
						this.LtoR6_2 = "waves5_2" + this.funcSet;
						this.LtoR7_2 = "waves4_2" + this.funcSet;
						this.LtoR8_2 = "waves3_2" + this.funcSet;
						this.LtoR9_2 = "waves2_2" + this.funcSet;
						this.LtoR10_2 = "waves3_2" + this.funcSet;
					}, 10)
					this.num = 0
				}
				break;

			case this.vKey == 101 && this.keyStatus == 1: //num5
				if (this.num == 0) {
					this.clear();
					setTimeout(() => {
						this.num5 = "waves1_1" + this.funcSet;
						this.LtoR1 = "waves10_1" + this.funcSet;
						this.LtoR2 = "waves9_1" + this.funcSet;
						this.LtoR3 = "waves8_1" + this.funcSet;
						this.LtoR4 = "waves7_1" + this.funcSet;
						this.LtoR5 = "waves6_1" + this.funcSet;
						this.LtoR6 = "waves5_1" + this.funcSet;
						this.LtoR7 = "waves4_1" + this.funcSet;
						this.LtoR8 = "waves3_1" + this.funcSet;
						this.LtoR9 = "waves2_1" + this.funcSet;
						this.LtoR10 = "waves3_1" + this.funcSet;
					}, 10);
					this.num = 1
				}
				else if (this.num == 1) {
					this.clear2();
					setTimeout(() => {
						this.num5_2 = "waves1_2" + this.funcSet;
						this.LtoR1_2 = "waves10_2" + this.funcSet;
						this.LtoR2_2 = "waves9_2" + this.funcSet;
						this.LtoR3_2 = "waves8_2" + this.funcSet;
						this.LtoR4_2 = "waves7_2" + this.funcSet;
						this.LtoR5_2 = "waves6_2" + this.funcSet;
						this.LtoR6_2 = "waves5_2" + this.funcSet;
						this.LtoR7_2 = "waves4_2" + this.funcSet;
						this.LtoR8_2 = "waves3_2" + this.funcSet;
						this.LtoR9_2 = "waves2_2" + this.funcSet;
						this.LtoR10_2 = "waves3_2" + this.funcSet;
					}, 10)
					this.num = 0
				}
				break;

			case this.vKey == 102 && this.keyStatus == 1: //num6
				if (this.num == 0) {
					this.clear();
					setTimeout(() => {
						this.num6 = "waves1_1" + this.funcSet;
						this.LtoR1 = "waves11_1" + this.funcSet;
						this.LtoR2 = "waves10_1" + this.funcSet;
						this.LtoR3 = "waves9_1" + this.funcSet;
						this.LtoR4 = "waves8_1" + this.funcSet;
						this.LtoR5 = "waves7_1" + this.funcSet;
						this.LtoR6 = "waves6_1" + this.funcSet;
						this.LtoR7 = "waves5_1" + this.funcSet;
						this.LtoR8 = "waves4_1" + this.funcSet;
						this.LtoR9 = "waves3_1" + this.funcSet;
						this.LtoR10 = "waves2_1" + this.funcSet;
					}, 10);
					this.num = 1
				}
				else if (this.num == 1) {
					this.clear2();
					setTimeout(() => {
						this.num6_2 = "waves1_2" + this.funcSet;
						this.LtoR1_2 = "waves11_2" + this.funcSet;
						this.LtoR2_2 = "waves10_2" + this.funcSet;
						this.LtoR3_2 = "waves9_2" + this.funcSet;
						this.LtoR4_2 = "waves8_2" + this.funcSet;
						this.LtoR5_2 = "waves7_2" + this.funcSet;
						this.LtoR6_2 = "waves6_2" + this.funcSet;
						this.LtoR7_2 = "waves5_2" + this.funcSet;
						this.LtoR8_2 = "waves4_2" + this.funcSet;
						this.LtoR9_2 = "waves3_2" + this.funcSet;
						this.LtoR10_2 = "waves2_2" + this.funcSet;
					}, 10)
					this.num = 0
				}
				break;
			case this.vKey == 'l16' && this.keyStatus == 1: //lshift
				if (this.num == 0) {
					this.clear();
					setTimeout(() => {
						this.lshift = "waves1_1" + this.funcSet;
						this.LtoR1 = "waves2_1" + this.funcSet;
						this.LtoR2 = "waves3_1" + this.funcSet;
						this.LtoR3 = "waves4_1" + this.funcSet;
						this.LtoR4 = "waves5_1" + this.funcSet;
						this.LtoR5 = "waves6_1" + this.funcSet;
						this.LtoR6 = "waves7_1" + this.funcSet;
						this.LtoR7 = "waves8_1" + this.funcSet;
						this.LtoR8 = "waves9_1" + this.funcSet;
						this.LtoR9 = "waves10_1" + this.funcSet;
						this.LtoR10 = "waves11_1" + this.funcSet;
					}, 10);
					this.num = 1
				}
				else if (this.num == 1) {
					this.clear2();
					setTimeout(() => {
						this.lshift_2 = "waves1_2" + this.funcSet;
						this.LtoR1_2 = "waves2_2" + this.funcSet;
						this.LtoR2_2 = "waves3_2" + this.funcSet;
						this.LtoR3_2 = "waves4_2" + this.funcSet;
						this.LtoR4_2 = "waves5_2" + this.funcSet;
						this.LtoR5_2 = "waves6_2" + this.funcSet;
						this.LtoR6_2 = "waves7_2" + this.funcSet;
						this.LtoR7_2 = "waves8_2" + this.funcSet;
						this.LtoR8_2 = "waves9_2" + this.funcSet;
						this.LtoR9_2 = "waves10_2" + this.funcSet;
						this.LtoR10_2 = "waves11_2" + this.funcSet;
					}, 10)
					this.num = 0
				}
				break;

			case this.vKey == 90 && this.keyStatus == 1: //z
				if (this.num == 0) {
					this.clear();
					setTimeout(() => {
						this.z = "waves1_1" + this.funcSet;
						this.LtoR1 = "waves3_1" + this.funcSet;
						this.LtoR2 = "waves2_1" + this.funcSet;
						this.LtoR3 = "waves3_1" + this.funcSet;
						this.LtoR4 = "waves4_1" + this.funcSet;
						this.LtoR5 = "waves5_1" + this.funcSet;
						this.LtoR6 = "waves6_1" + this.funcSet;
						this.LtoR7 = "waves7_1" + this.funcSet;
						this.LtoR8 = "waves8_1" + this.funcSet;
						this.LtoR9 = "waves9_1" + this.funcSet;
						this.LtoR10 = "waves10_1" + this.funcSet;
					}, 10);
					this.num = 1
				}
				else if (this.num == 1) {
					this.clear2();
					setTimeout(() => {
						this.z_2 = "waves1_2" + this.funcSet;
						this.LtoR1_2 = "waves3_2" + this.funcSet;
						this.LtoR2_2 = "waves2_2" + this.funcSet;
						this.LtoR3_2 = "waves3_2" + this.funcSet;
						this.LtoR4_2 = "waves4_2" + this.funcSet;
						this.LtoR5_2 = "waves5_2" + this.funcSet;
						this.LtoR6_2 = "waves6_2" + this.funcSet;
						this.LtoR7_2 = "waves7_2" + this.funcSet;
						this.LtoR8_2 = "waves8_2" + this.funcSet;
						this.LtoR9_2 = "waves9_2" + this.funcSet;
						this.LtoR10_2 = "waves10_2" + this.funcSet;
					}, 10)
					this.num = 0
				}
				break;

			case this.vKey == 88 && this.keyStatus == 1: //x
				if (this.num == 0) {
					this.clear();
					setTimeout(() => {
						this.x = "waves1_1" + this.funcSet;
						this.LtoR1 = "waves3_1" + this.funcSet;
						this.LtoR2 = "waves2_1" + this.funcSet;
						this.LtoR3 = "waves3_1" + this.funcSet;
						this.LtoR4 = "waves4_1" + this.funcSet;
						this.LtoR5 = "waves5_1" + this.funcSet;
						this.LtoR6 = "waves6_1" + this.funcSet;
						this.LtoR7 = "waves7_1" + this.funcSet;
						this.LtoR8 = "waves8_1" + this.funcSet;
						this.LtoR9 = "waves9_1" + this.funcSet;
						this.LtoR10 = "waves10_1" + this.funcSet;
					}, 10);
					this.num = 1
				}
				else if (this.num == 1) {
					this.clear2();
					setTimeout(() => {
						this.x_2 = "waves1_2" + this.funcSet;
						this.LtoR1_2 = "waves3_2" + this.funcSet;
						this.LtoR2_2 = "waves2_2" + this.funcSet;
						this.LtoR3_2 = "waves3_2" + this.funcSet;
						this.LtoR4_2 = "waves4_2" + this.funcSet;
						this.LtoR5_2 = "waves5_2" + this.funcSet;
						this.LtoR6_2 = "waves6_2" + this.funcSet;
						this.LtoR7_2 = "waves7_2" + this.funcSet;
						this.LtoR8_2 = "waves8_2" + this.funcSet;
						this.LtoR9_2 = "waves9_2" + this.funcSet;
						this.LtoR10_2 = "waves10_2" + this.funcSet;
					}, 10)
					this.num = 0
				}
				break;

			case this.vKey == 67 && this.keyStatus == 1: //c
				if (this.num == 0) {
					this.clear();
					setTimeout(() => {
						this.c = "waves1_1" + this.funcSet;
						this.LtoR1 = "waves4_1" + this.funcSet;
						this.LtoR2 = "waves3_1" + this.funcSet;
						this.LtoR3 = "waves2_1" + this.funcSet;
						this.LtoR4 = "waves3_1" + this.funcSet;
						this.LtoR5 = "waves4_1" + this.funcSet;
						this.LtoR6 = "waves5_1" + this.funcSet;
						this.LtoR7 = "waves6_1" + this.funcSet;
						this.LtoR8 = "waves7_1" + this.funcSet;
						this.LtoR9 = "waves8_1" + this.funcSet;
						this.LtoR10 = "waves9_1" + this.funcSet;
					}, 10);
					this.num = 1
				}
				else if (this.num == 1) {
					this.clear2();
					setTimeout(() => {
						this.c_2 = "waves1_2" + this.funcSet;
						this.LtoR1_2 = "waves4_2" + this.funcSet;
						this.LtoR2_2 = "waves3_2" + this.funcSet;
						this.LtoR3_2 = "waves2_2" + this.funcSet;
						this.LtoR4_2 = "waves3_2" + this.funcSet;
						this.LtoR5_2 = "waves4_2" + this.funcSet;
						this.LtoR6_2 = "waves5_2" + this.funcSet;
						this.LtoR7_2 = "waves6_2" + this.funcSet;
						this.LtoR8_2 = "waves7_2" + this.funcSet;
						this.LtoR9_2 = "waves8_2" + this.funcSet;
						this.LtoR10_2 = "waves9_2" + this.funcSet;
					}, 10)
					this.num = 0
				}
				break;

			case this.vKey == 86 && this.keyStatus == 1: //v
				if (this.num == 0) {
					this.clear();
					setTimeout(() => {
						this.v = "waves1_1" + this.funcSet;
						this.LtoR1 = "waves4_1" + this.funcSet;
						this.LtoR2 = "waves3_1" + this.funcSet;
						this.LtoR3 = "waves2_1" + this.funcSet;
						this.LtoR4 = "waves3_1" + this.funcSet;
						this.LtoR5 = "waves4_1" + this.funcSet;
						this.LtoR6 = "waves5_1" + this.funcSet;
						this.LtoR7 = "waves6_1" + this.funcSet;
						this.LtoR8 = "waves7_1" + this.funcSet;
						this.LtoR9 = "waves8_1" + this.funcSet;
						this.LtoR10 = "waves9_1" + this.funcSet;
					}, 10);
					this.num = 1
				}
				else if (this.num == 1) {
					this.clear2();
					setTimeout(() => {
						this.v_2 = "waves1_2" + this.funcSet;
						this.LtoR1_2 = "waves4_2" + this.funcSet;
						this.LtoR2_2 = "waves3_2" + this.funcSet;
						this.LtoR3_2 = "waves2_2" + this.funcSet;
						this.LtoR4_2 = "waves3_2" + this.funcSet;
						this.LtoR5_2 = "waves4_2" + this.funcSet;
						this.LtoR6_2 = "waves5_2" + this.funcSet;
						this.LtoR7_2 = "waves6_2" + this.funcSet;
						this.LtoR8_2 = "waves7_2" + this.funcSet;
						this.LtoR9_2 = "waves8_2" + this.funcSet;
						this.LtoR10_2 = "waves9_2" + this.funcSet;
					}, 10)
					this.num = 0
				}
				break;

			case this.vKey == 66 && this.keyStatus == 1: //b
				if (this.num == 0) {
					this.clear();
					setTimeout(() => {
						this.b = "waves1_1" + this.funcSet;
						this.LtoR1 = "waves5_1" + this.funcSet;
						this.LtoR2 = "waves4_1" + this.funcSet;
						this.LtoR3 = "waves3_1" + this.funcSet;
						this.LtoR4 = "waves2_1" + this.funcSet;
						this.LtoR5 = "waves3_1" + this.funcSet;
						this.LtoR6 = "waves4_1" + this.funcSet;
						this.LtoR7 = "waves5_1" + this.funcSet;
						this.LtoR8 = "waves6_1" + this.funcSet;
						this.LtoR9 = "waves7_1" + this.funcSet;
						this.LtoR10 = "waves8_1" + this.funcSet;
					}, 10);
					this.num = 1
				}
				else if (this.num == 1) {
					this.clear2();
					setTimeout(() => {
						this.b_2 = "waves1_2" + this.funcSet;
						this.LtoR1_2 = "waves5_2" + this.funcSet;
						this.LtoR2_2 = "waves4_2" + this.funcSet;
						this.LtoR3_2 = "waves3_2" + this.funcSet;
						this.LtoR4_2 = "waves2_2" + this.funcSet;
						this.LtoR5_2 = "waves3_2" + this.funcSet;
						this.LtoR6_2 = "waves4_2" + this.funcSet;
						this.LtoR7_2 = "waves5_2" + this.funcSet;
						this.LtoR8_2 = "waves6_2" + this.funcSet;
						this.LtoR9_2 = "waves7_2" + this.funcSet;
						this.LtoR10_2 = "waves8_2" + this.funcSet;
					}, 10)
					this.num = 0
				}
				break;

			case this.vKey == 78 && this.keyStatus == 1: //n
				if (this.num == 0) {
					this.clear();
					setTimeout(() => {
						this.n = "waves1_1" + this.funcSet;
						this.LtoR1 = "waves5_1" + this.funcSet;
						this.LtoR2 = "waves4_1" + this.funcSet;
						this.LtoR3 = "waves3_1" + this.funcSet;
						this.LtoR4 = "waves2_1" + this.funcSet;
						this.LtoR5 = "waves3_1" + this.funcSet;
						this.LtoR6 = "waves4_1" + this.funcSet;
						this.LtoR7 = "waves5_1" + this.funcSet;
						this.LtoR8 = "waves6_1" + this.funcSet;
						this.LtoR9 = "waves7_1" + this.funcSet;
						this.LtoR10 = "waves8_1" + this.funcSet;
					}, 10);
					this.num = 1
				}
				else if (this.num == 1) {
					this.clear2();
					setTimeout(() => {
						this.n_2 = "waves1_2" + this.funcSet;
						this.LtoR1_2 = "waves5_2" + this.funcSet;
						this.LtoR2_2 = "waves4_2" + this.funcSet;
						this.LtoR3_2 = "waves3_2" + this.funcSet;
						this.LtoR4_2 = "waves2_2" + this.funcSet;
						this.LtoR5_2 = "waves3_2" + this.funcSet;
						this.LtoR6_2 = "waves4_2" + this.funcSet;
						this.LtoR7_2 = "waves5_2" + this.funcSet;
						this.LtoR8_2 = "waves6_2" + this.funcSet;
						this.LtoR9_2 = "waves7_2" + this.funcSet;
						this.LtoR10_2 = "waves8_2" + this.funcSet;
					}, 10)
					this.num = 0
				}
				break;

			case this.vKey == 77 && this.keyStatus == 1: //m
				if (this.num == 0) {
					this.clear();
					setTimeout(() => {
						this.m = "waves1_1" + this.funcSet;
						this.LtoR1 = "waves6_1" + this.funcSet;
						this.LtoR2 = "waves5_1" + this.funcSet;
						this.LtoR3 = "waves4_1" + this.funcSet;
						this.LtoR4 = "waves3_1" + this.funcSet;
						this.LtoR5 = "waves2_1" + this.funcSet;
						this.LtoR6 = "waves3_1" + this.funcSet;
						this.LtoR7 = "waves4_1" + this.funcSet;
						this.LtoR8 = "waves5_1" + this.funcSet;
						this.LtoR9 = "waves6_1" + this.funcSet;
						this.LtoR10 = "waves7_1" + this.funcSet;
					}, 10);
					this.num = 1
				}
				else if (this.num == 1) {
					this.clear2();
					setTimeout(() => {
						this.m_2 = "waves1_2" + this.funcSet;
						this.LtoR1_2 = "waves6_2" + this.funcSet;
						this.LtoR2_2 = "waves5_2" + this.funcSet;
						this.LtoR3_2 = "waves4_2" + this.funcSet;
						this.LtoR4_2 = "waves3_2" + this.funcSet;
						this.LtoR5_2 = "waves2_2" + this.funcSet;
						this.LtoR6_2 = "waves3_2" + this.funcSet;
						this.LtoR7_2 = "waves4_2" + this.funcSet;
						this.LtoR8_2 = "waves5_2" + this.funcSet;
						this.LtoR9_2 = "waves6_2" + this.funcSet;
						this.LtoR10_2 = "waves7_2" + this.funcSet;
					}, 10)
					this.num = 0
				}
				break;

			case this.vKey == 188 && this.keyStatus == 1: //comma
				if (this.num == 0) {
					this.clear();
					setTimeout(() => {
						this.comma = "waves1_1" + this.funcSet;
						this.LtoR1 = "waves6_1" + this.funcSet;
						this.LtoR2 = "waves5_1" + this.funcSet;
						this.LtoR3 = "waves4_1" + this.funcSet;
						this.LtoR4 = "waves3_1" + this.funcSet;
						this.LtoR5 = "waves2_1" + this.funcSet;
						this.LtoR6 = "waves3_1" + this.funcSet;
						this.LtoR7 = "waves4_1" + this.funcSet;
						this.LtoR8 = "waves5_1" + this.funcSet;
						this.LtoR9 = "waves6_1" + this.funcSet;
						this.LtoR10 = "waves7_1" + this.funcSet;
					}, 10);
					this.num = 1
				}
				else if (this.num == 1) {
					this.clear2();
					setTimeout(() => {
						this.comma_2 = "waves1_2" + this.funcSet;
						this.LtoR1_2 = "waves6_2" + this.funcSet;
						this.LtoR2_2 = "waves5_2" + this.funcSet;
						this.LtoR3_2 = "waves4_2" + this.funcSet;
						this.LtoR4_2 = "waves3_2" + this.funcSet;
						this.LtoR5_2 = "waves2_2" + this.funcSet;
						this.LtoR6_2 = "waves3_2" + this.funcSet;
						this.LtoR7_2 = "waves4_2" + this.funcSet;
						this.LtoR8_2 = "waves5_2" + this.funcSet;
						this.LtoR9_2 = "waves6_2" + this.funcSet;
						this.LtoR10_2 = "waves7_2" + this.funcSet;
					}, 10)
					this.num = 0
				}
				break;

			case this.vKey == 190 && this.keyStatus == 1: //dot
				if (this.num == 0) {
					this.clear();
					setTimeout(() => {
						this.dot = "waves1_1" + this.funcSet;
						this.LtoR1 = "waves7_1" + this.funcSet;
						this.LtoR2 = "waves6_1" + this.funcSet;
						this.LtoR3 = "waves5_1" + this.funcSet;
						this.LtoR4 = "waves4_1" + this.funcSet;
						this.LtoR5 = "waves3_1" + this.funcSet;
						this.LtoR6 = "waves2_1" + this.funcSet;
						this.LtoR7 = "waves3_1" + this.funcSet;
						this.LtoR8 = "waves4_1" + this.funcSet;
						this.LtoR9 = "waves5_1" + this.funcSet;
						this.LtoR10 = "waves6_1" + this.funcSet;
					}, 10);
					this.num = 1
				}
				else if (this.num == 1) {
					this.clear2();
					setTimeout(() => {
						this.dot_2 = "waves1_2" + this.funcSet;
						this.LtoR1_2 = "waves7_2" + this.funcSet;
						this.LtoR2_2 = "waves6_2" + this.funcSet;
						this.LtoR3_2 = "waves5_2" + this.funcSet;
						this.LtoR4_2 = "waves4_2" + this.funcSet;
						this.LtoR5_2 = "waves3_2" + this.funcSet;
						this.LtoR6_2 = "waves2_2" + this.funcSet;
						this.LtoR7_2 = "waves3_2" + this.funcSet;
						this.LtoR8_2 = "waves4_2" + this.funcSet;
						this.LtoR9_2 = "waves5_2" + this.funcSet;
						this.LtoR10_2 = "waves6_2" + this.funcSet;
					}, 10)
					this.num = 0
				}
				break;

			case this.vKey == 191 && this.keyStatus == 1: //qmark
				if (this.num == 0) {
					this.clear();
					setTimeout(() => {
						this.qmark = "waves1_1" + this.funcSet;
						this.LtoR1 = "waves7_1" + this.funcSet;
						this.LtoR2 = "waves6_1" + this.funcSet;
						this.LtoR3 = "waves5_1" + this.funcSet;
						this.LtoR4 = "waves4_1" + this.funcSet;
						this.LtoR5 = "waves3_1" + this.funcSet;
						this.LtoR6 = "waves2_1" + this.funcSet;
						this.LtoR7 = "waves3_1" + this.funcSet;
						this.LtoR8 = "waves4_1" + this.funcSet;
						this.LtoR9 = "waves5_1" + this.funcSet;
						this.LtoR10 = "waves6_1" + this.funcSet;
					}, 10);
					this.num = 1
				}
				else if (this.num == 1) {
					this.clear2();
					setTimeout(() => {
						this.qmark_2 = "waves1_2" + this.funcSet;
						this.LtoR1_2 = "waves7_2" + this.funcSet;
						this.LtoR2_2 = "waves6_2" + this.funcSet;
						this.LtoR3_2 = "waves5_2" + this.funcSet;
						this.LtoR4_2 = "waves4_2" + this.funcSet;
						this.LtoR5_2 = "waves3_2" + this.funcSet;
						this.LtoR6_2 = "waves2_2" + this.funcSet;
						this.LtoR7_2 = "waves3_2" + this.funcSet;
						this.LtoR8_2 = "waves4_2" + this.funcSet;
						this.LtoR9_2 = "waves5_2" + this.funcSet;
						this.LtoR10_2 = "waves6_2" + this.funcSet;
					}, 10)
					this.num = 0
				}
				break;

			case this.vKey == "r16" && this.keyStatus == 1: //rshift
				if (this.num == 0) {
					this.clear();
					setTimeout(() => {
						this.rshift = "waves1_1" + this.funcSet;
						this.LtoR1 = "waves8_1" + this.funcSet;
						this.LtoR2 = "waves7_1" + this.funcSet;
						this.LtoR3 = "waves6_1" + this.funcSet;
						this.LtoR4 = "waves5_1" + this.funcSet;
						this.LtoR5 = "waves4_1" + this.funcSet;
						this.LtoR6 = "waves3_1" + this.funcSet;
						this.LtoR7 = "waves2_1" + this.funcSet;
						this.LtoR8 = "waves3_1" + this.funcSet;
						this.LtoR9 = "waves4_1" + this.funcSet;
						this.LtoR10 = "waves5_1" + this.funcSet;
					}, 10);
					this.num = 1
				}
				else if (this.num == 1) {
					this.clear2();
					setTimeout(() => {
						this.rshift_2 = "waves1_2" + this.funcSet;
						this.LtoR1_2 = "waves8_2" + this.funcSet;
						this.LtoR2_2 = "waves7_2" + this.funcSet;
						this.LtoR3_2 = "waves6_2" + this.funcSet;
						this.LtoR4_2 = "waves5_2" + this.funcSet;
						this.LtoR5_2 = "waves4_2" + this.funcSet;
						this.LtoR6_2 = "waves3_2" + this.funcSet;
						this.LtoR7_2 = "waves2_2" + this.funcSet;
						this.LtoR8_2 = "waves3_2" + this.funcSet;
						this.LtoR9_2 = "waves4_2" + this.funcSet;
						this.LtoR10_2 = "waves5_2" + this.funcSet;
					}, 10)
					this.num = 0
				}
				break;

			case this.vKey == 38 && this.keyStatus == 1: //up
				if (this.num == 0) {
					this.clear();
					setTimeout(() => {
						this.up = "waves1_1" + this.funcSet;
						this.LtoR1 = "waves9_1" + this.funcSet;
						this.LtoR2 = "waves8_1" + this.funcSet;
						this.LtoR3 = "waves7_1" + this.funcSet;
						this.LtoR4 = "waves6_1" + this.funcSet;
						this.LtoR5 = "waves5_1" + this.funcSet;
						this.LtoR6 = "waves4_1" + this.funcSet;
						this.LtoR7 = "waves3_1" + this.funcSet;
						this.LtoR8 = "waves2_1" + this.funcSet;
						this.LtoR9 = "waves3_1" + this.funcSet;
						this.LtoR10 = "waves4_1" + this.funcSet;
					}, 10);
					this.num = 1
				}
				else if (this.num == 1) {
					this.clear2();
					setTimeout(() => {
						this.up_2 = "waves1_2" + this.funcSet;
						this.LtoR1_2 = "waves9_2" + this.funcSet;
						this.LtoR2_2 = "waves8_2" + this.funcSet;
						this.LtoR3_2 = "waves7_2" + this.funcSet;
						this.LtoR4_2 = "waves6_2" + this.funcSet;
						this.LtoR5_2 = "waves5_2" + this.funcSet;
						this.LtoR6_2 = "waves4_2" + this.funcSet;
						this.LtoR7_2 = "waves3_2" + this.funcSet;
						this.LtoR8_2 = "waves2_2" + this.funcSet;
						this.LtoR9_2 = "waves3_2" + this.funcSet;
						this.LtoR10_2 = "waves4_2" + this.funcSet;
					}, 10)
					this.num = 0
				}
				break;

			case this.vKey == 97 && this.keyStatus == 1: //num1
				if (this.num == 0) {
					this.clear();
					setTimeout(() => {
						this.num1 = "waves1_1" + this.funcSet;
						this.LtoR1 = "waves10_1" + this.funcSet;
						this.LtoR2 = "waves9_1" + this.funcSet;
						this.LtoR3 = "waves8_1" + this.funcSet;
						this.LtoR4 = "waves7_1" + this.funcSet;
						this.LtoR5 = "waves6_1" + this.funcSet;
						this.LtoR6 = "waves5_1" + this.funcSet;
						this.LtoR7 = "waves4_1" + this.funcSet;
						this.LtoR8 = "waves3_1" + this.funcSet;
						this.LtoR9 = "waves2_1" + this.funcSet;
						this.LtoR10 = "waves3_1" + this.funcSet;
					}, 10);
					this.num = 1
				}
				else if (this.num == 1) {
					this.clear2();
					setTimeout(() => {
						this.num1_2 = "waves1_2" + this.funcSet;
						this.LtoR1_2 = "waves10_2" + this.funcSet;
						this.LtoR2_2 = "waves9_2" + this.funcSet;
						this.LtoR3_2 = "waves8_2" + this.funcSet;
						this.LtoR4_2 = "waves7_2" + this.funcSet;
						this.LtoR5_2 = "waves6_2" + this.funcSet;
						this.LtoR6_2 = "waves5_2" + this.funcSet;
						this.LtoR7_2 = "waves4_2" + this.funcSet;
						this.LtoR8_2 = "waves3_2" + this.funcSet;
						this.LtoR9_2 = "waves2_2" + this.funcSet;
						this.LtoR10_2 = "waves3_2" + this.funcSet;
					}, 10)
					this.num = 0
				}
				break;

			case this.vKey == 98 && this.keyStatus == 1: //num2
				if (this.num == 0) {
					this.clear();
					setTimeout(() => {
						this.num2 = "waves1_1" + this.funcSet;
						this.LtoR1 = "waves10_1" + this.funcSet;
						this.LtoR2 = "waves9_1" + this.funcSet;
						this.LtoR3 = "waves8_1" + this.funcSet;
						this.LtoR4 = "waves7_1" + this.funcSet;
						this.LtoR5 = "waves6_1" + this.funcSet;
						this.LtoR6 = "waves5_1" + this.funcSet;
						this.LtoR7 = "waves4_1" + this.funcSet;
						this.LtoR8 = "waves3_1" + this.funcSet;
						this.LtoR9 = "waves2_1" + this.funcSet;
						this.LtoR10 = "waves3_1" + this.funcSet;
					}, 10);
					this.num = 1
				}
				else if (this.num == 1) {
					this.clear2();
					setTimeout(() => {
						this.num2_2 = "waves1_2" + this.funcSet;
						this.LtoR1_2 = "waves10_2" + this.funcSet;
						this.LtoR2_2 = "waves9_2" + this.funcSet;
						this.LtoR3_2 = "waves8_2" + this.funcSet;
						this.LtoR4_2 = "waves7_2" + this.funcSet;
						this.LtoR5_2 = "waves6_2" + this.funcSet;
						this.LtoR6_2 = "waves5_2" + this.funcSet;
						this.LtoR7_2 = "waves4_2" + this.funcSet;
						this.LtoR8_2 = "waves3_2" + this.funcSet;
						this.LtoR9_2 = "waves2_2" + this.funcSet;
						this.LtoR10_2 = "waves3_2" + this.funcSet;
					}, 10)
					this.num = 0
				}
				break;

			case this.vKey == 99 && this.keyStatus == 1: //num3
				if (this.num == 0) {
					this.clear();
					setTimeout(() => {
						this.num3 = "waves1_1" + this.funcSet;
						this.LtoR1 = "waves11_1" + this.funcSet;
						this.LtoR2 = "waves10_1" + this.funcSet;
						this.LtoR3 = "waves9_1" + this.funcSet;
						this.LtoR4 = "waves8_1" + this.funcSet;
						this.LtoR5 = "waves7_1" + this.funcSet;
						this.LtoR6 = "waves6_1" + this.funcSet;
						this.LtoR7 = "waves5_1" + this.funcSet;
						this.LtoR8 = "waves4_1" + this.funcSet;
						this.LtoR9 = "waves3_1" + this.funcSet;
						this.LtoR10 = "waves2_1" + this.funcSet;
					}, 10);
					this.num = 1
				}
				else if (this.num == 1) {
					this.clear2();
					setTimeout(() => {
						this.num3_2 = "waves1_2" + this.funcSet;
						this.LtoR1_2 = "waves11_2" + this.funcSet;
						this.LtoR2_2 = "waves10_2" + this.funcSet;
						this.LtoR3_2 = "waves9_2" + this.funcSet;
						this.LtoR4_2 = "waves8_2" + this.funcSet;
						this.LtoR5_2 = "waves7_2" + this.funcSet;
						this.LtoR6_2 = "waves6_2" + this.funcSet;
						this.LtoR7_2 = "waves5_2" + this.funcSet;
						this.LtoR8_2 = "waves4_2" + this.funcSet;
						this.LtoR9_2 = "waves3_2" + this.funcSet;
						this.LtoR10_2 = "waves2_2" + this.funcSet;
					}, 10)
					this.num = 0
				}
				break;

			case this.vKey == 'num13' && this.keyStatus == 1: //numenter
				if (this.num == 0) {
					this.clear();
					setTimeout(() => {
						this.numenter = "waves1_1" + this.funcSet;
						this.LtoR1 = "waves11_1" + this.funcSet;
						this.LtoR2 = "waves10_1" + this.funcSet;
						this.LtoR3 = "waves9_1" + this.funcSet;
						this.LtoR4 = "waves8_1" + this.funcSet;
						this.LtoR5 = "waves7_1" + this.funcSet;
						this.LtoR6 = "waves6_1" + this.funcSet;
						this.LtoR7 = "waves5_1" + this.funcSet;
						this.LtoR8 = "waves4_1" + this.funcSet;
						this.LtoR9 = "waves3_1" + this.funcSet;
						this.LtoR10 = "waves2_1" + this.funcSet;
					}, 10);
					this.num = 1
				}
				else if (this.num == 1) {
					this.clear2();
					setTimeout(() => {
						this.numenter_2 = "waves1_2" + this.funcSet;
						this.LtoR1_2 = "waves11_2" + this.funcSet;
						this.LtoR2_2 = "waves10_2" + this.funcSet;
						this.LtoR3_2 = "waves9_2" + this.funcSet;
						this.LtoR4_2 = "waves8_2" + this.funcSet;
						this.LtoR5_2 = "waves7_2" + this.funcSet;
						this.LtoR6_2 = "waves6_2" + this.funcSet;
						this.LtoR7_2 = "waves5_2" + this.funcSet;
						this.LtoR8_2 = "waves4_2" + this.funcSet;
						this.LtoR9_2 = "waves3_2" + this.funcSet;
						this.LtoR10_2 = "waves2_2" + this.funcSet;
					}, 10)
					this.num = 0
				}
				break;

			case this.vKey == 'l17' && this.keyStatus == 1: //lctrl
				if (this.num == 0) {
					this.clear();
					setTimeout(() => {
						this.lctrl = "waves1_1" + this.funcSet;
						this.LtoR1 = "waves2_1" + this.funcSet;
						this.LtoR2 = "waves3_1" + this.funcSet;
						this.LtoR3 = "waves4_1" + this.funcSet;
						this.LtoR4 = "waves5_1" + this.funcSet;
						this.LtoR5 = "waves6_1" + this.funcSet;
						this.LtoR6 = "waves7_1" + this.funcSet;
						this.LtoR7 = "waves8_1" + this.funcSet;
						this.LtoR8 = "waves9_1" + this.funcSet;
						this.LtoR9 = "waves10_1" + this.funcSet;
						this.LtoR10 = "waves11_1" + this.funcSet;
					}, 10);
					this.num = 1
				}
				else if (this.num == 1) {
					this.clear2();
					setTimeout(() => {
						this.lctrl_2 = "waves1_2" + this.funcSet;
						this.LtoR1_2 = "waves2_2" + this.funcSet;
						this.LtoR2_2 = "waves3_2" + this.funcSet;
						this.LtoR3_2 = "waves4_2" + this.funcSet;
						this.LtoR4_2 = "waves5_2" + this.funcSet;
						this.LtoR5_2 = "waves6_2" + this.funcSet;
						this.LtoR6_2 = "waves7_2" + this.funcSet;
						this.LtoR7_2 = "waves8_2" + this.funcSet;
						this.LtoR8_2 = "waves9_2" + this.funcSet;
						this.LtoR9_2 = "waves10_2" + this.funcSet;
						this.LtoR10_2 = "waves11_2" + this.funcSet;
					}, 10)
					this.num = 0
				}
				break;

			case this.vKey == 91 && this.keyStatus == 1: //win
				if (this.num == 0) {
					this.clear();
					setTimeout(() => {
						this.win = "waves1_1" + this.funcSet;
						this.LtoR1 = "waves2_1" + this.funcSet;
						this.LtoR2 = "waves3_1" + this.funcSet;
						this.LtoR3 = "waves4_1" + this.funcSet;
						this.LtoR4 = "waves5_1" + this.funcSet;
						this.LtoR5 = "waves6_1" + this.funcSet;
						this.LtoR6 = "waves7_1" + this.funcSet;
						this.LtoR7 = "waves8_1" + this.funcSet;
						this.LtoR8 = "waves9_1" + this.funcSet;
						this.LtoR9 = "waves10_1" + this.funcSet;
						this.LtoR10 = "waves11_1" + this.funcSet;
					}, 10);
					this.num = 1
				}
				else if (this.num == 1) {
					this.clear2();
					setTimeout(() => {
						this.win_2 = "waves1_2" + this.funcSet;
						this.LtoR1_2 = "waves2_2" + this.funcSet;
						this.LtoR2_2 = "waves3_2" + this.funcSet;
						this.LtoR3_2 = "waves4_2" + this.funcSet;
						this.LtoR4_2 = "waves5_2" + this.funcSet;
						this.LtoR5_2 = "waves6_2" + this.funcSet;
						this.LtoR6_2 = "waves7_2" + this.funcSet;
						this.LtoR7_2 = "waves8_2" + this.funcSet;
						this.LtoR8_2 = "waves9_2" + this.funcSet;
						this.LtoR9_2 = "waves10_2" + this.funcSet;
						this.LtoR10_2 = "waves11_2" + this.funcSet;
					}, 10)
					this.num = 0
				}
				break;

			case this.vKey == 'l18' && this.keyStatus == 1: //lalt
				if (this.num == 0) {
					this.clear();
					setTimeout(() => {
						this.lalt = "waves1_1" + this.funcSet;
						this.LtoR1 = "waves3_1" + this.funcSet;
						this.LtoR2 = "waves2_1" + this.funcSet;
						this.LtoR3 = "waves3_1" + this.funcSet;
						this.LtoR4 = "waves4_1" + this.funcSet;
						this.LtoR5 = "waves5_1" + this.funcSet;
						this.LtoR6 = "waves6_1" + this.funcSet;
						this.LtoR7 = "waves7_1" + this.funcSet;
						this.LtoR8 = "waves8_1" + this.funcSet;
						this.LtoR9 = "waves9_1" + this.funcSet;
						this.LtoR10 = "waves10_1" + this.funcSet;
					}, 10);
					this.num = 1
				}
				else if (this.num == 1) {
					this.clear2();
					setTimeout(() => {
						this.lalt_2 = "waves1_2" + this.funcSet;
						this.LtoR1_2 = "waves3_2" + this.funcSet;
						this.LtoR2_2 = "waves2_2" + this.funcSet;
						this.LtoR3_2 = "waves3_2" + this.funcSet;
						this.LtoR4_2 = "waves4_2" + this.funcSet;
						this.LtoR5_2 = "waves5_2" + this.funcSet;
						this.LtoR6_2 = "waves6_2" + this.funcSet;
						this.LtoR7_2 = "waves7_2" + this.funcSet;
						this.LtoR8_2 = "waves8_2" + this.funcSet;
						this.LtoR9_2 = "waves9_2" + this.funcSet;
						this.LtoR10_2 = "waves10_2" + this.funcSet;
					}, 10)
					this.num = 0
				}
				break;

			case this.vKey == 32 && this.keyStatus == 1: //space
				if (this.num == 0) {
					this.clear();
					setTimeout(() => {
						this.space = "waves1_1" + this.funcSet;
						this.LtoR1 = "waves5_1" + this.funcSet;
						this.LtoR2 = "waves4_1" + this.funcSet;
						this.LtoR3 = "waves3_1" + this.funcSet;
						this.LtoR4 = "waves2_1" + this.funcSet;
						this.LtoR5 = "waves3_1" + this.funcSet;
						this.LtoR6 = "waves4_1" + this.funcSet;
						this.LtoR7 = "waves5_1" + this.funcSet;
						this.LtoR8 = "waves6_1" + this.funcSet;
						this.LtoR9 = "waves7_1" + this.funcSet;
						this.LtoR10 = "waves8_1" + this.funcSet;
					}, 10);
					this.num = 1
				}
				else if (this.num == 1) {
					this.clear2();
					setTimeout(() => {
						this.space_2 = "waves1_2" + this.funcSet;
						this.LtoR1_2 = "waves5_2" + this.funcSet;
						this.LtoR2_2 = "waves4_2" + this.funcSet;
						this.LtoR3_2 = "waves3_2" + this.funcSet;
						this.LtoR4_2 = "waves2_2" + this.funcSet;
						this.LtoR5_2 = "waves3_2" + this.funcSet;
						this.LtoR6_2 = "waves4_2" + this.funcSet;
						this.LtoR7_2 = "waves5_2" + this.funcSet;
						this.LtoR8_2 = "waves6_2" + this.funcSet;
						this.LtoR9_2 = "waves7_2" + this.funcSet;
						this.LtoR10_2 = "waves8_2" + this.funcSet;
					}, 10)
					this.num = 0
				}
				break;

			case this.vKey == 'r18' && this.keyStatus == 1: //ralt
				if (this.num == 0) {
					this.clear();
					setTimeout(() => {
						this.ralt = "waves1_1" + this.funcSet;
						this.LtoR1 = "waves7_1" + this.funcSet;
						this.LtoR2 = "waves6_1" + this.funcSet;
						this.LtoR3 = "waves5_1" + this.funcSet;
						this.LtoR4 = "waves4_1" + this.funcSet;
						this.LtoR5 = "waves3_1" + this.funcSet;
						this.LtoR6 = "waves2_1" + this.funcSet;
						this.LtoR7 = "waves3_1" + this.funcSet;
						this.LtoR8 = "waves4_1" + this.funcSet;
						this.LtoR9 = "waves5_1" + this.funcSet;
						this.LtoR10 = "waves6_1" + this.funcSet;
					}, 10);
					this.num = 1
				}
				else if (this.num == 1) {
					this.clear2();
					setTimeout(() => {
						this.ralt_2 = "waves1_2" + this.funcSet;
						this.LtoR1_2 = "waves7_2" + this.funcSet;
						this.LtoR2_2 = "waves6_2" + this.funcSet;
						this.LtoR3_2 = "waves5_2" + this.funcSet;
						this.LtoR4_2 = "waves4_2" + this.funcSet;
						this.LtoR5_2 = "waves3_2" + this.funcSet;
						this.LtoR6_2 = "waves2_2" + this.funcSet;
						this.LtoR7_2 = "waves3_2" + this.funcSet;
						this.LtoR8_2 = "waves4_2" + this.funcSet;
						this.LtoR9_2 = "waves5_2" + this.funcSet;
						this.LtoR10_2 = "waves6_2" + this.funcSet;
					}, 10)
					this.num = 0
				}
				break;

			case this.vKey == 93 && this.keyStatus == 1: //book
				if (this.num == 0) {
					this.clear();
					setTimeout(() => {
						this.book = "waves1_1" + this.funcSet;
						this.LtoR1 = "waves7_1" + this.funcSet;
						this.LtoR2 = "waves6_1" + this.funcSet;
						this.LtoR3 = "waves5_1" + this.funcSet;
						this.LtoR4 = "waves4_1" + this.funcSet;
						this.LtoR5 = "waves3_1" + this.funcSet;
						this.LtoR6 = "waves2_1" + this.funcSet;
						this.LtoR7 = "waves3_1" + this.funcSet;
						this.LtoR8 = "waves4_1" + this.funcSet;
						this.LtoR9 = "waves5_1" + this.funcSet;
						this.LtoR10 = "waves6_1" + this.funcSet;
					}, 10);
					this.num = 1
				}
				else if (this.num == 1) {
					this.clear2();
					setTimeout(() => {
						this.book_2 = "waves1_2" + this.funcSet;
						this.LtoR1_2 = "waves7_2" + this.funcSet;
						this.LtoR2_2 = "waves6_2" + this.funcSet;
						this.LtoR3_2 = "waves5_2" + this.funcSet;
						this.LtoR4_2 = "waves4_2" + this.funcSet;
						this.LtoR5_2 = "waves3_2" + this.funcSet;
						this.LtoR6_2 = "waves2_2" + this.funcSet;
						this.LtoR7_2 = "waves3_2" + this.funcSet;
						this.LtoR8_2 = "waves4_2" + this.funcSet;
						this.LtoR9_2 = "waves5_2" + this.funcSet;
						this.LtoR10_2 = "waves6_2" + this.funcSet;
					}, 10)
					this.num = 0
				}
				break;

			case this.vKey == 'r17' && this.keyStatus == 1: //rctrl
				if (this.num == 0) {
					this.clear();
					setTimeout(() => {
						this.rctrl = "waves1_1" + this.funcSet;
						this.LtoR1 = "waves9_1" + this.funcSet;
						this.LtoR2 = "waves8_1" + this.funcSet;
						this.LtoR3 = "waves7_1" + this.funcSet;
						this.LtoR4 = "waves6_1" + this.funcSet;
						this.LtoR5 = "waves5_1" + this.funcSet;
						this.LtoR6 = "waves4_1" + this.funcSet;
						this.LtoR7 = "waves3_1" + this.funcSet;
						this.LtoR8 = "waves2_1" + this.funcSet;
						this.LtoR9 = "waves3_1" + this.funcSet;
						this.LtoR10 = "waves4_1" + this.funcSet;
					}, 10);
					this.num = 1
				}
				else if (this.num == 1) {
					this.clear2();
					setTimeout(() => {
						this.rctrl_2 = "waves1_2" + this.funcSet;
						this.LtoR1_2 = "waves9_2" + this.funcSet;
						this.LtoR2_2 = "waves8_2" + this.funcSet;
						this.LtoR3_2 = "waves7_2" + this.funcSet;
						this.LtoR4_2 = "waves6_2" + this.funcSet;
						this.LtoR5_2 = "waves5_2" + this.funcSet;
						this.LtoR6_2 = "waves4_2" + this.funcSet;
						this.LtoR7_2 = "waves3_2" + this.funcSet;
						this.LtoR8_2 = "waves2_2" + this.funcSet;
						this.LtoR9_2 = "waves3_2" + this.funcSet;
						this.LtoR10_2 = "waves4_2" + this.funcSet;
					}, 10)
					this.num = 0
				}
				break;

			case this.vKey == 37 && this.keyStatus == 1: //left
				if (this.num == 0) {
					this.clear();
					setTimeout(() => {
						this.left = "waves1_1" + this.funcSet;
						this.LtoR1 = "waves9_1" + this.funcSet;
						this.LtoR2 = "waves8_1" + this.funcSet;
						this.LtoR3 = "waves7_1" + this.funcSet;
						this.LtoR4 = "waves6_1" + this.funcSet;
						this.LtoR5 = "waves5_1" + this.funcSet;
						this.LtoR6 = "waves4_1" + this.funcSet;
						this.LtoR7 = "waves3_1" + this.funcSet;
						this.LtoR8 = "waves2_1" + this.funcSet;
						this.LtoR9 = "waves3_1" + this.funcSet;
						this.LtoR10 = "waves4_1" + this.funcSet;
					}, 10);
					this.num = 1
				}
				else if (this.num == 1) {
					this.clear2();
					setTimeout(() => {
						this.left_2 = "waves1_2" + this.funcSet;
						this.LtoR1_2 = "waves9_2" + this.funcSet;
						this.LtoR2_2 = "waves8_2" + this.funcSet;
						this.LtoR3_2 = "waves7_2" + this.funcSet;
						this.LtoR4_2 = "waves6_2" + this.funcSet;
						this.LtoR5_2 = "waves5_2" + this.funcSet;
						this.LtoR6_2 = "waves4_2" + this.funcSet;
						this.LtoR7_2 = "waves3_2" + this.funcSet;
						this.LtoR8_2 = "waves2_2" + this.funcSet;
						this.LtoR9_2 = "waves3_2" + this.funcSet;
						this.LtoR10_2 = "waves4_2" + this.funcSet;
					}, 10)
					this.num = 0
				}
				break;

			case this.vKey == 40 && this.keyStatus == 1: //down
				if (this.num == 0) {
					this.clear();
					setTimeout(() => {
						this.down = "waves1_1" + this.funcSet;
						this.LtoR1 = "waves9_1" + this.funcSet;
						this.LtoR2 = "waves8_1" + this.funcSet;
						this.LtoR3 = "waves7_1" + this.funcSet;
						this.LtoR4 = "waves6_1" + this.funcSet;
						this.LtoR5 = "waves5_1" + this.funcSet;
						this.LtoR6 = "waves4_1" + this.funcSet;
						this.LtoR7 = "waves3_1" + this.funcSet;
						this.LtoR8 = "waves2_1" + this.funcSet;
						this.LtoR9 = "waves3_1" + this.funcSet;
						this.LtoR10 = "waves4_1" + this.funcSet;
					}, 10);
					this.num = 1
				}
				else if (this.num == 1) {
					this.clear2();
					setTimeout(() => {
						this.down_2 = "waves1_2" + this.funcSet;
						this.LtoR1_2 = "waves9_2" + this.funcSet;
						this.LtoR2_2 = "waves8_2" + this.funcSet;
						this.LtoR3_2 = "waves7_2" + this.funcSet;
						this.LtoR4_2 = "waves6_2" + this.funcSet;
						this.LtoR5_2 = "waves5_2" + this.funcSet;
						this.LtoR6_2 = "waves4_2" + this.funcSet;
						this.LtoR7_2 = "waves3_2" + this.funcSet;
						this.LtoR8_2 = "waves2_2" + this.funcSet;
						this.LtoR9_2 = "waves3_2" + this.funcSet;
						this.LtoR10_2 = "waves4_2" + this.funcSet;
					}, 10)
					this.num = 0
				}
				break;

			case this.vKey == 39 && this.keyStatus == 1: //right
				if (this.num == 0) {
					this.clear();
					setTimeout(() => {
						this.right = "waves1_1" + this.funcSet;
						this.LtoR1 = "waves9_1" + this.funcSet;
						this.LtoR2 = "waves8_1" + this.funcSet;
						this.LtoR3 = "waves7_1" + this.funcSet;
						this.LtoR4 = "waves6_1" + this.funcSet;
						this.LtoR5 = "waves5_1" + this.funcSet;
						this.LtoR6 = "waves4_1" + this.funcSet;
						this.LtoR7 = "waves3_1" + this.funcSet;
						this.LtoR8 = "waves2_1" + this.funcSet;
						this.LtoR9 = "waves3_1" + this.funcSet;
						this.LtoR10 = "waves4_1" + this.funcSet;
					}, 10);
					this.num = 1
				}
				else if (this.num == 1) {
					this.clear2();
					setTimeout(() => {
						this.right_2 = "waves1_2" + this.funcSet;
						this.LtoR1_2 = "waves9_2" + this.funcSet;
						this.LtoR2_2 = "waves8_2" + this.funcSet;
						this.LtoR3_2 = "waves7_2" + this.funcSet;
						this.LtoR4_2 = "waves6_2" + this.funcSet;
						this.LtoR5_2 = "waves5_2" + this.funcSet;
						this.LtoR6_2 = "waves4_2" + this.funcSet;
						this.LtoR7_2 = "waves3_2" + this.funcSet;
						this.LtoR8_2 = "waves2_2" + this.funcSet;
						this.LtoR9_2 = "waves3_2" + this.funcSet;
						this.LtoR10_2 = "waves4_2" + this.funcSet;
					}, 10)
					this.num = 0
				}
				break;

			case this.vKey == 96 && this.keyStatus == 1: //num0
				if (this.num == 0) {
					this.clear();
					setTimeout(() => {
						this.num0 = "waves1_1" + this.funcSet;
						this.LtoR1 = "waves10_1" + this.funcSet;
						this.LtoR2 = "waves9_1" + this.funcSet;
						this.LtoR3 = "waves8_1" + this.funcSet;
						this.LtoR4 = "waves7_1" + this.funcSet;
						this.LtoR5 = "waves6_1" + this.funcSet;
						this.LtoR6 = "waves5_1" + this.funcSet;
						this.LtoR7 = "waves4_1" + this.funcSet;
						this.LtoR8 = "waves3_1" + this.funcSet;
						this.LtoR9 = "waves2_1" + this.funcSet;
						this.LtoR10 = "waves3_1" + this.funcSet;
					}, 10);
					this.num = 1
				}
				else if (this.num == 1) {
					this.clear2();
					setTimeout(() => {
						this.num0_2 = "waves1_2" + this.funcSet;
						this.LtoR1_2 = "waves10_2" + this.funcSet;
						this.LtoR2_2 = "waves9_2" + this.funcSet;
						this.LtoR3_2 = "waves8_2" + this.funcSet;
						this.LtoR4_2 = "waves7_2" + this.funcSet;
						this.LtoR5_2 = "waves6_2" + this.funcSet;
						this.LtoR6_2 = "waves5_2" + this.funcSet;
						this.LtoR7_2 = "waves4_2" + this.funcSet;
						this.LtoR8_2 = "waves3_2" + this.funcSet;
						this.LtoR9_2 = "waves2_2" + this.funcSet;
						this.LtoR10_2 = "waves3_2" + this.funcSet;
					}, 10)
					this.num = 0
				}
				break;

			case this.vKey == 110 && this.keyStatus == 1: //numdot
				if (this.num == 0) {
					this.clear();
					setTimeout(() => {
						this.numdot = "waves1_1" + this.funcSet;
						this.LtoR1 = "waves11_1" + this.funcSet;
						this.LtoR2 = "waves10_1" + this.funcSet;
						this.LtoR3 = "waves9_1" + this.funcSet;
						this.LtoR4 = "waves8_1" + this.funcSet;
						this.LtoR5 = "waves7_1" + this.funcSet;
						this.LtoR6 = "waves6_1" + this.funcSet;
						this.LtoR7 = "waves5_1" + this.funcSet;
						this.LtoR8 = "waves4_1" + this.funcSet;
						this.LtoR9 = "waves3_1" + this.funcSet;
						this.LtoR10 = "waves2_1" + this.funcSet;
					}, 10);
					this.num = 1
				}
				else if (this.num == 1) {
					this.clear2();
					setTimeout(() => {
						this.numdot_2 = "waves1_2" + this.funcSet;
						this.LtoR1_2 = "waves11_2" + this.funcSet;
						this.LtoR2_2 = "waves10_2" + this.funcSet;
						this.LtoR3_2 = "waves9_2" + this.funcSet;
						this.LtoR4_2 = "waves8_2" + this.funcSet;
						this.LtoR5_2 = "waves7_2" + this.funcSet;
						this.LtoR6_2 = "waves6_2" + this.funcSet;
						this.LtoR7_2 = "waves5_2" + this.funcSet;
						this.LtoR8_2 = "waves4_2" + this.funcSet;
						this.LtoR9_2 = "waves3_2" + this.funcSet;
						this.LtoR10_2 = "waves2_2" + this.funcSet;
					}, 10)
				}
				break;
			case this.vKey == 44 && this.keyStatus == 1: //print
				if (this.num == 0) {
					this.clear();
					setTimeout(() => {
						this.print = "waves1_1" + this.funcSet;
						this.LtoR1 = "waves9_1" + this.funcSet;
						this.LtoR2 = "waves8_1" + this.funcSet;
						this.LtoR3 = "waves7_1" + this.funcSet;
						this.LtoR4 = "waves6_1" + this.funcSet;
						this.LtoR5 = "waves5_1" + this.funcSet;
						this.LtoR6 = "waves4_1" + this.funcSet;
						this.LtoR7 = "waves3_1" + this.funcSet;
						this.LtoR8 = "waves2_1" + this.funcSet;
						this.LtoR9 = "waves3_1" + this.funcSet;
						this.LtoR10 = "waves4_1" + this.funcSet;
					}, 10);
					this.num = 1
				}
				else if (this.num == 1) {
					this.clear2();
					setTimeout(() => {
						this.print_2 = "waves1_2" + this.funcSet;
						this.LtoR1_2 = "waves9_2" + this.funcSet;
						this.LtoR2_2 = "waves8_2" + this.funcSet;
						this.LtoR3_2 = "waves7_2" + this.funcSet;
						this.LtoR4_2 = "waves6_2" + this.funcSet;
						this.LtoR5_2 = "waves5_2" + this.funcSet;
						this.LtoR6_2 = "waves4_2" + this.funcSet;
						this.LtoR7_2 = "waves3_2" + this.funcSet;
						this.LtoR8_2 = "waves2_2" + this.funcSet;
						this.LtoR9_2 = "waves3_2" + this.funcSet;
						this.LtoR10_2 = "waves4_2" + this.funcSet;
					}, 10)
					this.num = 0;
				}
				break;
			default:
				break;
		}
		//以上為向外







		//以下為向內
		switch (true) {
			case this.vKey == 27 && this.keyStatus == 1: //esc
				//console.log("111")
				if (this.num == 2) {
					//console.log("222")
					this.clear();
					setTimeout(() => {
						this.esc = "waves1_1" + this.funcSet;
						this.LtoR1 = "waves11_1" + this.funcSet;
						this.LtoR2 = "waves10_1" + this.funcSet;
						this.LtoR3 = "waves9_1" + this.funcSet;
						this.LtoR4 = "waves8_1" + this.funcSet;
						this.LtoR5 = "waves7_1" + this.funcSet;
						this.LtoR6 = "waves6_1" + this.funcSet;
						this.LtoR7 = "waves5_1" + this.funcSet;
						this.LtoR8 = "waves4_1" + this.funcSet;
						this.LtoR9 = "waves3_1" + this.funcSet;
						this.LtoR10 = "waves2_1" + this.funcSet;
					}, 10);
					this.num = 3
				}
				else if (this.num == 3) {
					this.clear2();
					setTimeout(() => {
						this.esc_2 = "waves1_2" + this.funcSet;
						this.LtoR1_2 = "waves11_2" + this.funcSet;
						this.LtoR2_2 = "waves10_2" + this.funcSet;
						this.LtoR3_2 = "waves9_2" + this.funcSet;
						this.LtoR4_2 = "waves8_2" + this.funcSet;
						this.LtoR5_2 = "waves7_2" + this.funcSet;
						this.LtoR6_2 = "waves6_2" + this.funcSet;
						this.LtoR7_2 = "waves5_2" + this.funcSet;
						this.LtoR8_2 = "waves4_2" + this.funcSet;
						this.LtoR9_2 = "waves3_2" + this.funcSet;
						this.LtoR10_2 = "waves2_2" + this.funcSet;
					}, 10)
					this.num = 2
				}
				break;

			case this.vKey == 112 && this.keyStatus == 1: //f1
				if (this.num == 2) {
					this.clear();
					setTimeout(() => {
						this.f1 = "waves1_1" + this.funcSet;
						this.LtoR1 = "waves9_1" + this.funcSet;
						this.LtoR2 = "waves10_1" + this.funcSet;
						this.LtoR3 = "waves9_1" + this.funcSet;
						this.LtoR4 = "waves8_1" + this.funcSet;
						this.LtoR5 = "waves7_1" + this.funcSet;
						this.LtoR6 = "waves6_1" + this.funcSet;
						this.LtoR7 = "waves5_1" + this.funcSet;
						this.LtoR8 = "waves4_1" + this.funcSet;
						this.LtoR9 = "waves3_1" + this.funcSet;
						this.LtoR10 = "waves2_1" + this.funcSet;
					}, 10);
					this.num = 3
				}
				else if (this.num == 3) {
					this.clear2();
					setTimeout(() => {
						this.f1_2 = "waves1_2" + this.funcSet;
						this.LtoR1_2 = "waves9_2" + this.funcSet;
						this.LtoR2_2 = "waves10_2" + this.funcSet;
						this.LtoR3_2 = "waves9_2" + this.funcSet;
						this.LtoR4_2 = "waves8_2" + this.funcSet;
						this.LtoR5_2 = "waves7_2" + this.funcSet;
						this.LtoR6_2 = "waves6_2" + this.funcSet;
						this.LtoR7_2 = "waves5_2" + this.funcSet;
						this.LtoR8_2 = "waves4_2" + this.funcSet;
						this.LtoR9_2 = "waves3_2" + this.funcSet;
						this.LtoR10_2 = "waves2_2" + this.funcSet;
					}, 10)
					this.num = 2
				}
				break;

			case this.vKey == 113 && this.keyStatus == 1: //f2
				if (this.num == 2) {
					this.clear();
					setTimeout(() => {
						this.f2 = "waves1_1" + this.funcSet;
						this.LtoR1 = "waves9_1" + this.funcSet;
						this.LtoR2 = "waves10_1" + this.funcSet;
						this.LtoR3 = "waves9_1" + this.funcSet;
						this.LtoR4 = "waves8_1" + this.funcSet;
						this.LtoR5 = "waves7_1" + this.funcSet;
						this.LtoR6 = "waves6_1" + this.funcSet;
						this.LtoR7 = "waves5_1" + this.funcSet;
						this.LtoR8 = "waves4_1" + this.funcSet;
						this.LtoR9 = "waves3_1" + this.funcSet;
						this.LtoR10 = "waves2_1" + this.funcSet;
					}, 10);
					this.num = 3
				}
				else if (this.num == 3) {
					this.clear2();
					setTimeout(() => {
						this.f2_2 = "waves1_2" + this.funcSet;
						this.LtoR1_2 = "waves9_2" + this.funcSet;
						this.LtoR2_2 = "waves10_2" + this.funcSet;
						this.LtoR3_2 = "waves9_2" + this.funcSet;
						this.LtoR4_2 = "waves8_2" + this.funcSet;
						this.LtoR5_2 = "waves7_2" + this.funcSet;
						this.LtoR6_2 = "waves6_2" + this.funcSet;
						this.LtoR7_2 = "waves5_2" + this.funcSet;
						this.LtoR8_2 = "waves4_2" + this.funcSet;
						this.LtoR9_2 = "waves3_2" + this.funcSet;
						this.LtoR10_2 = "waves2_2" + this.funcSet;
					}, 10)
					this.num = 2
				}
				break;

			case this.vKey == 114 && this.keyStatus == 1: //f3
				if (this.num == 2) {
					this.clear();
					setTimeout(() => {
						this.f3 = "waves1_1" + this.funcSet;
						this.LtoR1 = "waves7_1" + this.funcSet;
						this.LtoR2 = "waves8_1" + this.funcSet;
						this.LtoR3 = "waves9_1" + this.funcSet;
						this.LtoR4 = "waves8_1" + this.funcSet;
						this.LtoR5 = "waves7_1" + this.funcSet;
						this.LtoR6 = "waves6_1" + this.funcSet;
						this.LtoR7 = "waves5_1" + this.funcSet;
						this.LtoR8 = "waves4_1" + this.funcSet;
						this.LtoR9 = "waves3_1" + this.funcSet;
						this.LtoR10 = "waves2_1" + this.funcSet;
					}, 10);
					this.num = 3
				}
				else if (this.num == 3) {
					this.clear2();
					setTimeout(() => {
						this.f3_2 = "waves1_2" + this.funcSet;
						this.LtoR1_2 = "waves7_2" + this.funcSet;
						this.LtoR2_2 = "waves8_2" + this.funcSet;
						this.LtoR3_2 = "waves9_2" + this.funcSet;
						this.LtoR4_2 = "waves8_2" + this.funcSet;
						this.LtoR5_2 = "waves7_2" + this.funcSet;
						this.LtoR6_2 = "waves6_2" + this.funcSet;
						this.LtoR7_2 = "waves5_2" + this.funcSet;
						this.LtoR8_2 = "waves4_2" + this.funcSet;
						this.LtoR9_2 = "waves3_2" + this.funcSet;
						this.LtoR10_2 = "waves2_2" + this.funcSet;
					}, 10)
					this.num = 2
				}
				break;

			case this.vKey == 115 && this.keyStatus == 1: //f4
				if (this.num == 2) {
					this.clear();
					setTimeout(() => {
						this.f4 = "waves1_1" + this.funcSet;
						this.LtoR1 = "waves7_1" + this.funcSet;
						this.LtoR2 = "waves8_1" + this.funcSet;
						this.LtoR3 = "waves9_1" + this.funcSet;
						this.LtoR4 = "waves8_1" + this.funcSet;
						this.LtoR5 = "waves7_1" + this.funcSet;
						this.LtoR6 = "waves6_1" + this.funcSet;
						this.LtoR7 = "waves5_1" + this.funcSet;
						this.LtoR8 = "waves4_1" + this.funcSet;
						this.LtoR9 = "waves3_1" + this.funcSet;
						this.LtoR10 = "waves2_1" + this.funcSet;
					}, 10);
					this.num = 3
				}
				else if (this.num == 3) {
					this.clear2();
					setTimeout(() => {
						this.f4_2 = "waves1_2" + this.funcSet;
						this.LtoR1_2 = "waves7_2" + this.funcSet;
						this.LtoR2_2 = "waves8_2" + this.funcSet;
						this.LtoR3_2 = "waves9_2" + this.funcSet;
						this.LtoR4_2 = "waves8_2" + this.funcSet;
						this.LtoR5_2 = "waves7_2" + this.funcSet;
						this.LtoR6_2 = "waves6_2" + this.funcSet;
						this.LtoR7_2 = "waves5_2" + this.funcSet;
						this.LtoR8_2 = "waves4_2" + this.funcSet;
						this.LtoR9_2 = "waves3_2" + this.funcSet;
						this.LtoR10_2 = "waves2_2" + this.funcSet;
					}, 10)
					this.num = 2
				}
				break;

			case this.vKey == 116 && this.keyStatus == 1: //f5
				if (this.num == 2) {
					this.clear();
					setTimeout(() => {
						this.f5 = "waves1_1" + this.funcSet;
						this.LtoR1 = "waves5_1" + this.funcSet;
						this.LtoR2 = "waves6_1" + this.funcSet;
						this.LtoR3 = "waves7_1" + this.funcSet;
						this.LtoR4 = "waves8_1" + this.funcSet;
						this.LtoR5 = "waves7_1" + this.funcSet;
						this.LtoR6 = "waves6_1" + this.funcSet;
						this.LtoR7 = "waves5_1" + this.funcSet;
						this.LtoR8 = "waves4_1" + this.funcSet;
						this.LtoR9 = "waves3_1" + this.funcSet;
						this.LtoR10 = "waves2_1" + this.funcSet;
					}, 10);
					this.num = 3
				}
				else if (this.num == 3) {
					this.clear2();
					setTimeout(() => {
						this.f5_2 = "waves1_2" + this.funcSet;
						this.LtoR1_2 = "waves5_2" + this.funcSet;
						this.LtoR2_2 = "waves6_2" + this.funcSet;
						this.LtoR3_2 = "waves7_2" + this.funcSet;
						this.LtoR4_2 = "waves8_2" + this.funcSet;
						this.LtoR5_2 = "waves7_2" + this.funcSet;
						this.LtoR6_2 = "waves6_2" + this.funcSet;
						this.LtoR7_2 = "waves5_2" + this.funcSet;
						this.LtoR8_2 = "waves4_2" + this.funcSet;
						this.LtoR9_2 = "waves3_2" + this.funcSet;
						this.LtoR10_2 = "waves2_2" + this.funcSet;
					}, 10)
					this.num = 2
				}
				break;

			case this.vKey == 117 && this.keyStatus == 1: //f6
				if (this.num == 2) {
					this.clear();
					setTimeout(() => {
						this.f6 = "waves1_1" + this.funcSet;
						this.LtoR1 = "waves5_1" + this.funcSet;
						this.LtoR2 = "waves6_1" + this.funcSet;
						this.LtoR3 = "waves7_1" + this.funcSet;
						this.LtoR4 = "waves8_1" + this.funcSet;
						this.LtoR5 = "waves7_1" + this.funcSet;
						this.LtoR6 = "waves6_1" + this.funcSet;
						this.LtoR7 = "waves5_1" + this.funcSet;
						this.LtoR8 = "waves4_1" + this.funcSet;
						this.LtoR9 = "waves3_1" + this.funcSet;
						this.LtoR10 = "waves2_1" + this.funcSet;
					}, 10);
					this.num = 3
				}
				else if (this.num == 3) {
					this.clear2();
					setTimeout(() => {
						this.f6_2 = "waves1_2" + this.funcSet;
						this.LtoR1_2 = "waves5_2" + this.funcSet;
						this.LtoR2_2 = "waves6_2" + this.funcSet;
						this.LtoR3_2 = "waves7_2" + this.funcSet;
						this.LtoR4_2 = "waves8_2" + this.funcSet;
						this.LtoR5_2 = "waves7_2" + this.funcSet;
						this.LtoR6_2 = "waves6_2" + this.funcSet;
						this.LtoR7_2 = "waves5_2" + this.funcSet;
						this.LtoR8_2 = "waves4_2" + this.funcSet;
						this.LtoR9_2 = "waves3_2" + this.funcSet;
						this.LtoR10_2 = "waves2_2" + this.funcSet;
					}, 10)
					this.num = 2
				}
				break;

			case this.vKey == 118 && this.keyStatus == 1: //f7
				if (this.num == 2) {
					this.clear();
					setTimeout(() => {
						this.f7 = "waves1_1" + this.funcSet;
						this.LtoR1 = "waves3_1" + this.funcSet;
						this.LtoR2 = "waves4_1" + this.funcSet;
						this.LtoR3 = "waves5_1" + this.funcSet;
						this.LtoR4 = "waves6_1" + this.funcSet;
						this.LtoR5 = "waves7_1" + this.funcSet;
						this.LtoR6 = "waves6_1" + this.funcSet;
						this.LtoR7 = "waves5_1" + this.funcSet;
						this.LtoR8 = "waves4_1" + this.funcSet;
						this.LtoR9 = "waves3_1" + this.funcSet;
						this.LtoR10 = "waves2_1" + this.funcSet;
					}, 10);
					this.num = 3
				}
				else if (this.num == 3) {
					this.clear2();
					setTimeout(() => {
						this.f7_2 = "waves1_2" + this.funcSet;
						this.LtoR1_2 = "waves3_2" + this.funcSet;
						this.LtoR2_2 = "waves4_2" + this.funcSet;
						this.LtoR3_2 = "waves5_2" + this.funcSet;
						this.LtoR4_2 = "waves6_2" + this.funcSet;
						this.LtoR5_2 = "waves7_2" + this.funcSet;
						this.LtoR6_2 = "waves6_2" + this.funcSet;
						this.LtoR7_2 = "waves5_2" + this.funcSet;
						this.LtoR8_2 = "waves4_2" + this.funcSet;
						this.LtoR9_2 = "waves3_2" + this.funcSet;
						this.LtoR10_2 = "waves2_2" + this.funcSet;
					}, 10)
					this.num = 2
				}
				break;

			case this.vKey == 119 && this.keyStatus == 1: //f8
				if (this.num == 2) {
					this.clear();
					setTimeout(() => {
						this.f8 = "waves1_1" + this.funcSet;
						this.LtoR1 = "waves3_1" + this.funcSet;
						this.LtoR2 = "waves4_1" + this.funcSet;
						this.LtoR3 = "waves5_1" + this.funcSet;
						this.LtoR4 = "waves6_1" + this.funcSet;
						this.LtoR5 = "waves7_1" + this.funcSet;
						this.LtoR6 = "waves6_1" + this.funcSet;
						this.LtoR7 = "waves5_1" + this.funcSet;
						this.LtoR8 = "waves4_1" + this.funcSet;
						this.LtoR9 = "waves3_1" + this.funcSet;
						this.LtoR10 = "waves2_1" + this.funcSet;
					}, 10);
					this.num = 3
				}
				else if (this.num == 3) {
					this.clear2();
					setTimeout(() => {
						this.f8_2 = "waves1_2" + this.funcSet;
						this.LtoR1_2 = "waves3_2" + this.funcSet;
						this.LtoR2_2 = "waves4_2" + this.funcSet;
						this.LtoR3_2 = "waves5_2" + this.funcSet;
						this.LtoR4_2 = "waves6_2" + this.funcSet;
						this.LtoR5_2 = "waves7_2" + this.funcSet;
						this.LtoR6_2 = "waves6_2" + this.funcSet;
						this.LtoR7_2 = "waves5_2" + this.funcSet;
						this.LtoR8_2 = "waves4_2" + this.funcSet;
						this.LtoR9_2 = "waves3_2" + this.funcSet;
						this.LtoR10_2 = "waves2_2" + this.funcSet;
					}, 10)
					this.num = 2
				}
				break;

			case this.vKey == 120 && this.keyStatus == 1: //f9
				if (this.num == 2) {
					this.clear();
					setTimeout(() => {
						this.f9 = "waves1_1" + this.funcSet;
						this.LtoR1 = "waves2_1" + this.funcSet;
						this.LtoR2 = "waves3_1" + this.funcSet;
						this.LtoR3 = "waves4_1" + this.funcSet;
						this.LtoR4 = "waves5_1" + this.funcSet;
						this.LtoR5 = "waves6_1" + this.funcSet;
						this.LtoR6 = "waves7_1" + this.funcSet;
						this.LtoR7 = "waves6_1" + this.funcSet;
						this.LtoR8 = "waves5_1" + this.funcSet;
						this.LtoR9 = "waves4_1" + this.funcSet;
						this.LtoR10 = "waves3_1" + this.funcSet;
					}, 10);
					this.num = 3
				}
				else if (this.num == 3) {
					this.clear2();
					setTimeout(() => {
						this.f9 = "waves1_1" + this.funcSet;
						this.LtoR1_2 = "waves2_2" + this.funcSet;
						this.LtoR2_2 = "waves3_2" + this.funcSet;
						this.LtoR3_2 = "waves4_2" + this.funcSet;
						this.LtoR4_2 = "waves5_2" + this.funcSet;
						this.LtoR5_2 = "waves6_2" + this.funcSet;
						this.LtoR6_2 = "waves7_2" + this.funcSet;
						this.LtoR7_2 = "waves6_2" + this.funcSet;
						this.LtoR8_2 = "waves5_2" + this.funcSet;
						this.LtoR9_2 = "waves4_2" + this.funcSet;
						this.LtoR10_2 = "waves3_2" + this.funcSet;
					}, 10)
					this.num = 2
				}
				break;

			case this.vKey == 121 && this.keyStatus == 1: //f10
				if (this.num == 2) {
					this.clear();
					setTimeout(() => {
						this.f10 = "waves1_1" + this.funcSet;
						this.LtoR1 = "waves2_1" + this.funcSet;
						this.LtoR2 = "waves3_1" + this.funcSet;
						this.LtoR3 = "waves4_1" + this.funcSet;
						this.LtoR4 = "waves5_1" + this.funcSet;
						this.LtoR5 = "waves6_1" + this.funcSet;
						this.LtoR6 = "waves7_1" + this.funcSet;
						this.LtoR7 = "waves6_1" + this.funcSet;
						this.LtoR8 = "waves5_1" + this.funcSet;
						this.LtoR9 = "waves4_1" + this.funcSet;
						this.LtoR10 = "waves3_1" + this.funcSet;
					}, 10);
					this.num = 3
				}
				else if (this.num == 3) {
					this.clear2();
					setTimeout(() => {
						this.f10_2 = "waves1_2" + this.funcSet;
						this.LtoR1_2 = "wave2_2" + this.funcSet
						this.LtoR2_2 = "waves3_2" + this.funcSet;
						this.LtoR3_2 = "waves4_2" + this.funcSet;
						this.LtoR4_2 = "waves5_2" + this.funcSet;
						this.LtoR5_2 = "waves6_2" + this.funcSet;
						this.LtoR6_2 = "waves7_2" + this.funcSet;
						this.LtoR7_2 = "waves6_2" + this.funcSet;
						this.LtoR8_2 = "waves5_2" + this.funcSet;
						this.LtoR9_2 = "waves4_2" + this.funcSet;
						this.LtoR10_2 = "waves3_2" + this.funcSet;
					}, 10)
					this.num = 2
				}
				break;

			case this.vKey == 122 && this.keyStatus == 1: //f11
				if (this.num == 2) {
					this.clear();
					setTimeout(() => {
						this.f11 = "waves1_1" + this.funcSet;
						this.LtoR1 = "waves2_1" + this.funcSet;
						this.LtoR2 = "waves3_1" + this.funcSet;
						this.LtoR3 = "waves4_1" + this.funcSet;
						this.LtoR4 = "waves5_1" + this.funcSet;
						this.LtoR5 = "waves6_1" + this.funcSet;
						this.LtoR6 = "waves7_1" + this.funcSet;
						this.LtoR7 = "waves8_1" + this.funcSet;
						this.LtoR8 = "waves7_1" + this.funcSet;
						this.LtoR9 = "waves6_1" + this.funcSet;
						this.LtoR10 = "waves5_1" + this.funcSet;
					}, 10);
					this.num = 3
				}
				else if (this.num == 3) {
					this.clear2();
					setTimeout(() => {
						this.f11_2 = "waves1_2" + this.funcSet;
						this.LtoR1_2 = "waves2_2" + this.funcSet;
						this.LtoR2_2 = "waves3_2" + this.funcSet;
						this.LtoR3_2 = "waves4_2" + this.funcSet;
						this.LtoR4_2 = "waves5_2" + this.funcSet;
						this.LtoR5_2 = "waves6_2" + this.funcSet;
						this.LtoR6_2 = "waves7_2" + this.funcSet;
						this.LtoR7_2 = "waves8_2" + this.funcSet;
						this.LtoR8_2 = "waves7_2" + this.funcSet;
						this.LtoR9_2 = "waves6_2" + this.funcSet;
						this.LtoR10_2 = "waves5_2" + this.funcSet;
					}, 10)
					this.num = 2
				}
				break;

			case this.vKey == 123 && this.keyStatus == 1: //f12
				if (this.num == 2) {
					this.clear();
					setTimeout(() => {
						this.f12 = "waves1_1" + this.funcSet;
						this.LtoR1 = "waves2_1" + this.funcSet;
						this.LtoR2 = "waves3_1" + this.funcSet;
						this.LtoR3 = "waves4_1" + this.funcSet;
						this.LtoR4 = "waves5_1" + this.funcSet;
						this.LtoR5 = "waves6_1" + this.funcSet;
						this.LtoR6 = "waves7_1" + this.funcSet;
						this.LtoR7 = "waves8_1" + this.funcSet;
						this.LtoR8 = "waves7_1" + this.funcSet;
						this.LtoR9 = "waves6_1" + this.funcSet;
						this.LtoR10 = "waves5_1" + this.funcSet;
					}, 10);
					this.num = 3
				}
				else if (this.num == 3) {
					this.clear2();
					setTimeout(() => {
						this.f12_2 = "waves1_2" + this.funcSet;
						this.LtoR1_2 = "waves2_2" + this.funcSet;
						this.LtoR2_2 = "waves3_2" + this.funcSet;
						this.LtoR3_2 = "waves4_2" + this.funcSet;
						this.LtoR4_2 = "waves5_2" + this.funcSet;
						this.LtoR5_2 = "waves6_2" + this.funcSet;
						this.LtoR6_2 = "waves7_2" + this.funcSet;
						this.LtoR7_2 = "waves8_2" + this.funcSet;
						this.LtoR8_2 = "waves7_2" + this.funcSet;
						this.LtoR9_2 = "waves6_2" + this.funcSet;
						this.LtoR10_2 = "waves5_2" + this.funcSet;
					}, 10)
					this.num = 2
				}
				break;

			case this.vKey == 145 && this.keyStatus == 1: //scroll
				if (this.num == 2) {
					this.clear();
					setTimeout(() => {
						this.scroll = "waves1_1" + this.funcSet;
						this.LtoR1 = "waves2_1" + this.funcSet;
						this.LtoR2 = "waves3_1" + this.funcSet;
						this.LtoR3 = "waves4_1" + this.funcSet;
						this.LtoR4 = "waves5_1" + this.funcSet;
						this.LtoR5 = "waves6_1" + this.funcSet;
						this.LtoR6 = "waves7_1" + this.funcSet;
						this.LtoR7 = "waves8_1" + this.funcSet;
						this.LtoR8 = "waves9_1" + this.funcSet;
						this.LtoR9 = "waves8_1" + this.funcSet;
						this.LtoR10 = "waves7_1" + this.funcSet;
					}, 10);
					this.num = 3
				}
				else if (this.num == 3) {
					this.clear2();
					setTimeout(() => {
						this.scroll_2 = "waves1_2" + this.funcSet;
						this.LtoR1_2 = "waves2_2" + this.funcSet;
						this.LtoR2_2 = "waves3_2" + this.funcSet;
						this.LtoR3_2 = "waves4_2" + this.funcSet;
						this.LtoR4_2 = "waves5_2" + this.funcSet;
						this.LtoR5_2 = "waves6_2" + this.funcSet;
						this.LtoR6_2 = "waves7_2" + this.funcSet;
						this.LtoR7_2 = "waves8_2" + this.funcSet;
						this.LtoR8_2 = "waves9_2" + this.funcSet;
						this.LtoR9_2 = "waves8_2" + this.funcSet;
						this.LtoR10_2 = "waves7_2" + this.funcSet;
					}, 10)
					this.num = 2
				}
				break;

			case this.vKey == 19 && this.keyStatus == 1: //pause
				if (this.num == 2) {
					this.clear();
					setTimeout(() => {
						this.pause = "waves1_1" + this.funcSet;
						this.LtoR1 = "waves2_1" + this.funcSet;
						this.LtoR2 = "waves3_1" + this.funcSet;
						this.LtoR3 = "waves4_1" + this.funcSet;
						this.LtoR4 = "waves5_1" + this.funcSet;
						this.LtoR5 = "waves6_1" + this.funcSet;
						this.LtoR6 = "waves7_1" + this.funcSet;
						this.LtoR7 = "waves8_1" + this.funcSet;
						this.LtoR8 = "waves9_1" + this.funcSet;
						this.LtoR9 = "waves8_1" + this.funcSet;
						this.LtoR10 = "waves7_1" + this.funcSet;
					}, 10);
					this.num = 3
				}
				else if (this.num == 3) {
					this.clear2();
					setTimeout(() => {
						this.pause_2 = "waves1_2" + this.funcSet;
						this.LtoR1_2 = "waves2_2" + this.funcSet;
						this.LtoR2_2 = "waves3_2" + this.funcSet;
						this.LtoR3_2 = "waves4_2" + this.funcSet;
						this.LtoR4_2 = "waves5_2" + this.funcSet;
						this.LtoR5_2 = "waves6_2" + this.funcSet;
						this.LtoR6_2 = "waves7_2" + this.funcSet;
						this.LtoR7_2 = "waves8_2" + this.funcSet;
						this.LtoR8_2 = "waves9_2" + this.funcSet;
						this.LtoR9_2 = "waves8_2" + this.funcSet;
						this.LtoR10_2 = "waves7_2" + this.funcSet;
					}, 10)
					this.num = 2
				}
				break;

			case this.vKey == 192 && this.keyStatus == 1: //perid
				if (this.num == 2) {
					this.clear();
					setTimeout(() => {
						this.perid = "waves1_1" + this.funcSet;
						this.LtoR1 = "waves11_1" + this.funcSet;
						this.LtoR2 = "waves10_1" + this.funcSet;
						this.LtoR3 = "waves9_1" + this.funcSet;
						this.LtoR4 = "waves8_1" + this.funcSet;
						this.LtoR5 = "waves7_1" + this.funcSet;
						this.LtoR6 = "waves6_1" + this.funcSet;
						this.LtoR7 = "waves5_1" + this.funcSet;
						this.LtoR8 = "waves4_1" + this.funcSet;
						this.LtoR9 = "waves3_1" + this.funcSet;
						this.LtoR10 = "waves2_1" + this.funcSet;
					}, 10);
					this.num = 3
				}
				else if (this.num == 3) {
					this.clear2();
					setTimeout(() => {
						this.perid_2 = "waves1_2" + this.funcSet;
						this.LtoR1_2 = "waves11_2" + this.funcSet;
						this.LtoR2_2 = "waves10_2" + this.funcSet;
						this.LtoR3_2 = "waves9_2" + this.funcSet;
						this.LtoR4_2 = "waves8_2" + this.funcSet;
						this.LtoR5_2 = "waves7_2" + this.funcSet;
						this.LtoR6_2 = "waves6_2" + this.funcSet;
						this.LtoR7_2 = "waves5_2" + this.funcSet;
						this.LtoR8_2 = "waves4_2" + this.funcSet;
						this.LtoR9_2 = "waves3_2" + this.funcSet;
						this.LtoR10_2 = "waves2_2" + this.funcSet;
					}, 10)
					this.num = 2
				}
				break;

			case this.vKey == 49 && this.keyStatus == 1: //n1
				if (this.num == 2) {
					this.clear();
					setTimeout(() => {
						this.n1 = "waves1_1" + this.funcSet;
						this.LtoR1 = "waves11_1" + this.funcSet;
						this.LtoR2 = "waves10_1" + this.funcSet;
						this.LtoR3 = "waves9_1" + this.funcSet;
						this.LtoR4 = "waves8_1" + this.funcSet;
						this.LtoR5 = "waves7_1" + this.funcSet;
						this.LtoR6 = "waves6_1" + this.funcSet;
						this.LtoR7 = "waves5_1" + this.funcSet;
						this.LtoR8 = "waves4_1" + this.funcSet;
						this.LtoR9 = "waves3_1" + this.funcSet;
						this.LtoR10 = "waves2_1" + this.funcSet;
					}, 10);
					this.num = 3
				}
				else if (this.num == 3) {
					this.clear2();
					setTimeout(() => {
						this.n1_2 = "waves1_2" + this.funcSet;
						this.LtoR1_2 = "waves11_2" + this.funcSet;
						this.LtoR2_2 = "waves10_2" + this.funcSet;
						this.LtoR3_2 = "waves9_2" + this.funcSet;
						this.LtoR4_2 = "waves8_2" + this.funcSet;
						this.LtoR5_2 = "waves7_2" + this.funcSet;
						this.LtoR6_2 = "waves6_2" + this.funcSet;
						this.LtoR7_2 = "waves5_2" + this.funcSet;
						this.LtoR8_2 = "waves4_2" + this.funcSet;
						this.LtoR9_2 = "waves3_2" + this.funcSet;
						this.LtoR10_2 = "waves2_2" + this.funcSet;
					}, 10)
					this.num = 2
				}
				break;

			case this.vKey == 50 && this.keyStatus == 1: //n2
				if (this.num == 2) {
					this.clear();
					setTimeout(() => {
						this.n2 = "waves1_1" + this.funcSet;
						this.LtoR1 = "waves9_1" + this.funcSet;
						this.LtoR2 = "waves10_1" + this.funcSet;
						this.LtoR3 = "waves9_1" + this.funcSet;
						this.LtoR4 = "waves8_1" + this.funcSet;
						this.LtoR5 = "waves7_1" + this.funcSet;
						this.LtoR6 = "waves6_1" + this.funcSet;
						this.LtoR7 = "waves5_1" + this.funcSet;
						this.LtoR8 = "waves4_1" + this.funcSet;
						this.LtoR9 = "waves3_1" + this.funcSet;
						this.LtoR10 = "waves2_1" + this.funcSet;
					}, 10);
					this.num = 3
				}
				else if (this.num == 3) {
					this.clear2();
					setTimeout(() => {
						this.n2_2 = "waves1_2" + this.funcSet;
						this.LtoR1_2 = "waves9_2" + this.funcSet;
						this.LtoR2_2 = "waves10_2" + this.funcSet;
						this.LtoR3_2 = "waves9_2" + this.funcSet;
						this.LtoR4_2 = "waves8_2" + this.funcSet;
						this.LtoR5_2 = "waves7_2" + this.funcSet;
						this.LtoR6_2 = "waves6_2" + this.funcSet;
						this.LtoR7_2 = "waves5_2" + this.funcSet;
						this.LtoR8_2 = "waves4_2" + this.funcSet;
						this.LtoR9_2 = "waves3_2" + this.funcSet;
						this.LtoR10_2 = "waves2_2" + this.funcSet;
					}, 10)
					this.num = 2
				}
				break;

			case this.vKey == 51 && this.keyStatus == 1: //n3
				if (this.num == 2) {
					this.clear();
					setTimeout(() => {
						this.n3 = "waves1_1" + this.funcSet;
						this.LtoR1 = "waves7_1" + this.funcSet;
						this.LtoR2 = "waves8_1" + this.funcSet;
						this.LtoR3 = "waves9_1" + this.funcSet;
						this.LtoR4 = "waves8_1" + this.funcSet;
						this.LtoR5 = "waves7_1" + this.funcSet;
						this.LtoR6 = "waves6_1" + this.funcSet;
						this.LtoR7 = "waves5_1" + this.funcSet;
						this.LtoR8 = "waves4_1" + this.funcSet;
						this.LtoR9 = "waves3_1" + this.funcSet;
						this.LtoR10 = "waves2_1" + this.funcSet;
					}, 10);
					this.num = 3
				}
				else if (this.num == 3) {
					this.clear2();
					setTimeout(() => {
						this.n3_2 = "waves1_2" + this.funcSet;
						this.LtoR1_2 = "waves7_2" + this.funcSet;
						this.LtoR2_2 = "waves8_2" + this.funcSet;
						this.LtoR3_2 = "waves9_2" + this.funcSet;
						this.LtoR4_2 = "waves8_2" + this.funcSet;
						this.LtoR5_2 = "waves7_2" + this.funcSet;
						this.LtoR6_2 = "waves6_2" + this.funcSet;
						this.LtoR7_2 = "waves5_2" + this.funcSet;
						this.LtoR8_2 = "waves4_2" + this.funcSet;
						this.LtoR9_2 = "waves3_2" + this.funcSet;
						this.LtoR10_2 = "waves2_2" + this.funcSet;
					}, 10)
					this.num = 2
				}
				break;

			case this.vKey == 52 && this.keyStatus == 1: //n4
				if (this.num == 2) {
					this.clear();
					setTimeout(() => {
						this.n4 = "waves1_1" + this.funcSet;
						this.LtoR1 = "waves7_1" + this.funcSet;
						this.LtoR2 = "waves8_1" + this.funcSet;
						this.LtoR3 = "waves9_1" + this.funcSet;
						this.LtoR4 = "waves8_1" + this.funcSet;
						this.LtoR5 = "waves7_1" + this.funcSet;
						this.LtoR6 = "waves6_1" + this.funcSet;
						this.LtoR7 = "waves5_1" + this.funcSet;
						this.LtoR8 = "waves4_1" + this.funcSet;
						this.LtoR9 = "waves3_1" + this.funcSet;
						this.LtoR10 = "waves2_1" + this.funcSet;
					}, 10);
					this.num = 3
				}
				else if (this.num == 3) {
					this.clear2();
					setTimeout(() => {
						this.n4_2 = "waves1_2" + this.funcSet;
						this.LtoR1_2 = "waves7_2" + this.funcSet;
						this.LtoR2_2 = "waves8_2" + this.funcSet;
						this.LtoR3_2 = "waves9_2" + this.funcSet;
						this.LtoR4_2 = "waves8_2" + this.funcSet;
						this.LtoR5_2 = "waves7_2" + this.funcSet;
						this.LtoR6_2 = "waves6_2" + this.funcSet;
						this.LtoR7_2 = "waves5_2" + this.funcSet;
						this.LtoR8_2 = "waves4_2" + this.funcSet;
						this.LtoR9_2 = "waves3_2" + this.funcSet;
						this.LtoR10_2 = "waves2_2" + this.funcSet;
					}, 10)
					this.num = 2
				}
				break;

			case this.vKey == 53 && this.keyStatus == 1: //n5
				if (this.num == 2) {
					this.clear();
					setTimeout(() => {
						this.n5 = "waves1_1" + this.funcSet;
						this.LtoR1 = "waves5_1" + this.funcSet;
						this.LtoR2 = "waves6_1" + this.funcSet;
						this.LtoR3 = "waves7_1" + this.funcSet;
						this.LtoR4 = "waves8_1" + this.funcSet;
						this.LtoR5 = "waves7_1" + this.funcSet;
						this.LtoR6 = "waves6_1" + this.funcSet;
						this.LtoR7 = "waves5_1" + this.funcSet;
						this.LtoR8 = "waves4_1" + this.funcSet;
						this.LtoR9 = "waves3_1" + this.funcSet;
						this.LtoR10 = "waves2_1" + this.funcSet;
					}, 10);
					this.num = 3
				}
				else if (this.num == 3) {
					this.clear2();
					setTimeout(() => {
						this.n5_2 = "waves1_2" + this.funcSet;
						this.LtoR1_2 = "waves5_2" + this.funcSet;
						this.LtoR2_2 = "waves6_2" + this.funcSet;
						this.LtoR3_2 = "waves7_2" + this.funcSet;
						this.LtoR4_2 = "waves8_2" + this.funcSet;
						this.LtoR5_2 = "waves7_2" + this.funcSet;
						this.LtoR6_2 = "waves6_2" + this.funcSet;
						this.LtoR7_2 = "waves5_2" + this.funcSet;
						this.LtoR8_2 = "waves4_2" + this.funcSet;
						this.LtoR9_2 = "waves3_2" + this.funcSet;
						this.LtoR10_2 = "waves2_2" + this.funcSet;
					}, 10)
					this.num = 2
				}
				break;

			case this.vKey == 54 && this.keyStatus == 1: //n6
				if (this.num == 2) {
					this.clear();
					setTimeout(() => {
						this.n6 = "waves1_1" + this.funcSet;
						this.LtoR1 = "waves5_1" + this.funcSet;
						this.LtoR2 = "waves6_1" + this.funcSet;
						this.LtoR3 = "waves7_1" + this.funcSet;
						this.LtoR4 = "waves8_1" + this.funcSet;
						this.LtoR5 = "waves7_1" + this.funcSet;
						this.LtoR6 = "waves6_1" + this.funcSet;
						this.LtoR7 = "waves5_1" + this.funcSet;
						this.LtoR8 = "waves4_1" + this.funcSet;
						this.LtoR9 = "waves3_1" + this.funcSet;
						this.LtoR10 = "waves2_1" + this.funcSet;
					}, 10);
					this.num = 3
				}
				else if (this.num == 3) {
					this.clear2();
					setTimeout(() => {
						this.n6_2 = "waves1_2" + this.funcSet;
						this.LtoR1_2 = "waves5_2" + this.funcSet;
						this.LtoR2_2 = "waves6_2" + this.funcSet;
						this.LtoR3_2 = "waves7_2" + this.funcSet;
						this.LtoR4_2 = "waves8_2" + this.funcSet;
						this.LtoR5_2 = "waves7_2" + this.funcSet;
						this.LtoR6_2 = "waves6_2" + this.funcSet;
						this.LtoR7_2 = "waves5_2" + this.funcSet;
						this.LtoR8_2 = "waves4_2" + this.funcSet;
						this.LtoR9_2 = "waves3_2" + this.funcSet;
						this.LtoR10_2 = "waves2_2" + this.funcSet;
					}, 10)
					this.num = 2
				}
				break;

			case this.vKey == 55 && this.keyStatus == 1: //n7
				if (this.num == 2) {
					this.clear();
					setTimeout(() => {
						this.n7 = "waves1_1" + this.funcSet;
						this.LtoR1 = "waves3_1" + this.funcSet;
						this.LtoR2 = "waves4_1" + this.funcSet;
						this.LtoR3 = "waves5_1" + this.funcSet;
						this.LtoR4 = "waves6_1" + this.funcSet;
						this.LtoR5 = "waves7_1" + this.funcSet;
						this.LtoR6 = "waves6_1" + this.funcSet;
						this.LtoR7 = "waves5_1" + this.funcSet;
						this.LtoR8 = "waves4_1" + this.funcSet;
						this.LtoR9 = "waves3_1" + this.funcSet;
						this.LtoR10 = "waves2_1" + this.funcSet;
					}, 10);
					this.num = 3
				}
				else if (this.num == 3) {
					this.clear2();
					setTimeout(() => {
						this.n7_2 = "waves1_2" + this.funcSet;
						this.LtoR1_2 = "waves3_2" + this.funcSet;
						this.LtoR2_2 = "waves4_2" + this.funcSet;
						this.LtoR3_2 = "waves5_2" + this.funcSet;
						this.LtoR4_2 = "waves6_2" + this.funcSet;
						this.LtoR5_2 = "waves7_2" + this.funcSet;
						this.LtoR6_2 = "waves6_2" + this.funcSet;
						this.LtoR7_2 = "waves5_2" + this.funcSet;
						this.LtoR8_2 = "waves4_2" + this.funcSet;
						this.LtoR9_2 = "waves3_2" + this.funcSet;
						this.LtoR10_2 = "waves2_2" + this.funcSet;
					}, 10)
					this.num = 2
				}
				break;

			case this.vKey == 56 && this.keyStatus == 1: //n8
				if (this.num == 2) {
					this.clear();
					setTimeout(() => {
						this.n8 = "waves1_1" + this.funcSet;
						this.LtoR1 = "waves3_1" + this.funcSet;
						this.LtoR2 = "waves4_1" + this.funcSet;
						this.LtoR3 = "waves5_1" + this.funcSet;
						this.LtoR4 = "waves6_1" + this.funcSet;
						this.LtoR5 = "waves7_1" + this.funcSet;
						this.LtoR6 = "waves6_1" + this.funcSet;
						this.LtoR7 = "waves5_1" + this.funcSet;
						this.LtoR8 = "waves4_1" + this.funcSet;
						this.LtoR9 = "waves3_1" + this.funcSet;
						this.LtoR10 = "waves2_1" + this.funcSet;
					}, 10);
					this.num = 3
				}
				else if (this.num == 3) {
					this.clear2();
					setTimeout(() => {
						this.n8_2 = "waves1_2" + this.funcSet;
						this.LtoR1_2 = "waves3_2" + this.funcSet;
						this.LtoR2_2 = "waves4_2" + this.funcSet;
						this.LtoR3_2 = "waves5_2" + this.funcSet;
						this.LtoR4_2 = "waves6_2" + this.funcSet;
						this.LtoR5_2 = "waves7_2" + this.funcSet;
						this.LtoR6_2 = "waves6_2" + this.funcSet;
						this.LtoR7_2 = "waves5_2" + this.funcSet;
						this.LtoR8_2 = "waves4_2" + this.funcSet;
						this.LtoR9_2 = "waves3_2" + this.funcSet;
						this.LtoR10_2 = "waves2_2" + this.funcSet;
					}, 10)
					this.num = 2
				}
				break;

			case this.vKey == 57 && this.keyStatus == 1: //n9
				if (this.num == 2) {
					this.clear();
					setTimeout(() => {
						this.n9 = "waves1_1" + this.funcSet;
						this.LtoR1 = "waves2_1" + this.funcSet;
						this.LtoR2 = "waves3_1" + this.funcSet;
						this.LtoR3 = "waves4_1" + this.funcSet;
						this.LtoR4 = "waves5_1" + this.funcSet;
						this.LtoR5 = "waves6_1" + this.funcSet;
						this.LtoR6 = "waves7_1" + this.funcSet;
						this.LtoR7 = "waves6_1" + this.funcSet;
						this.LtoR8 = "waves5_1" + this.funcSet;
						this.LtoR9 = "waves4_1" + this.funcSet;
						this.LtoR10 = "waves3_1" + this.funcSet;
					}, 10);
					this.num = 3
				}
				else if (this.num == 3) {
					this.clear2();
					setTimeout(() => {
						this.n9_2 = "waves1_2" + this.funcSet;
						this.LtoR1_2 = "waves2_2" + this.funcSet;
						this.LtoR2_2 = "waves3_2" + this.funcSet;
						this.LtoR3_2 = "waves4_2" + this.funcSet;
						this.LtoR4_2 = "waves5_2" + this.funcSet;
						this.LtoR5_2 = "waves6_2" + this.funcSet;
						this.LtoR6_2 = "waves7_2" + this.funcSet;
						this.LtoR7_2 = "waves6_2" + this.funcSet;
						this.LtoR8_2 = "waves5_2" + this.funcSet;
						this.LtoR9_2 = "waves4_2" + this.funcSet;
						this.LtoR10_2 = "waves3_2" + this.funcSet;
					}, 10)
					this.num = 2
				}
				break;

			case this.vKey == 48 && this.keyStatus == 1: //n0
				if (this.num == 2) {
					this.clear();
					setTimeout(() => {
						this.n0 = "waves1_1" + this.funcSet;
						this.LtoR1 = "waves2_1" + this.funcSet;
						this.LtoR2 = "waves3_1" + this.funcSet;
						this.LtoR3 = "waves4_1" + this.funcSet;
						this.LtoR4 = "waves5_1" + this.funcSet;
						this.LtoR5 = "waves6_1" + this.funcSet;
						this.LtoR6 = "waves7_1" + this.funcSet;
						this.LtoR7 = "waves6_1" + this.funcSet;
						this.LtoR8 = "waves5_1" + this.funcSet;
						this.LtoR9 = "waves4_1" + this.funcSet;
						this.LtoR10 = "waves3_1" + this.funcSet;
					}, 10);
					this.num = 3
				}
				else if (this.num == 3) {
					this.clear2();
					setTimeout(() => {
						this.n0_2 = "waves1_2" + this.funcSet;
						this.LtoR1_2 = "waves2_2" + this.funcSet;
						this.LtoR2_2 = "waves3_2" + this.funcSet;
						this.LtoR3_2 = "waves4_2" + this.funcSet;
						this.LtoR4_2 = "waves5_2" + this.funcSet;
						this.LtoR5_2 = "waves6_2" + this.funcSet;
						this.LtoR6_2 = "waves7_2" + this.funcSet;
						this.LtoR7_2 = "waves6_2" + this.funcSet;
						this.LtoR8_2 = "waves5_2" + this.funcSet;
						this.LtoR9_2 = "waves4_2" + this.funcSet;
						this.LtoR10_2 = "waves3_2" + this.funcSet;
					}, 10)
					this.num = 2
				}
				break;

			case this.vKey == 189 && this.keyStatus == 1: //minus
				if (this.num == 2) {
					this.clear();
					setTimeout(() => {
						this.minus = "waves1_1" + this.funcSet;
						this.LtoR1 = "waves2_1" + this.funcSet;
						this.LtoR2 = "waves3_1" + this.funcSet;
						this.LtoR3 = "waves4_1" + this.funcSet;
						this.LtoR4 = "waves5_1" + this.funcSet;
						this.LtoR5 = "waves6_1" + this.funcSet;
						this.LtoR6 = "waves7_1" + this.funcSet;
						this.LtoR7 = "waves8_1" + this.funcSet;
						this.LtoR8 = "waves7_1" + this.funcSet;
						this.LtoR9 = "waves6_1" + this.funcSet;
						this.LtoR10 = "waves5_1" + this.funcSet;
					}, 10);
					this.num = 3
				}
				else if (this.num == 3) {
					this.clear2();
					setTimeout(() => {
						this.minus_2 = "waves1_2" + this.funcSet;
						this.LtoR1_2 = "waves2_2" + this.funcSet;
						this.LtoR2_2 = "waves3_2" + this.funcSet;
						this.LtoR3_2 = "waves4_2" + this.funcSet;
						this.LtoR4_2 = "waves5_2" + this.funcSet;
						this.LtoR5_2 = "waves6_2" + this.funcSet;
						this.LtoR6_2 = "waves7_2" + this.funcSet;
						this.LtoR7_2 = "waves8_2" + this.funcSet;
						this.LtoR8_2 = "waves7_2" + this.funcSet;
						this.LtoR9_2 = "waves6_2" + this.funcSet;
						this.LtoR10_2 = "waves5_2" + this.funcSet;
					}, 10)
					this.num = 2
				}
				break;

			case this.vKey == 187 && this.keyStatus == 1: //plus
				if (this.num == 2) {
					this.clear();
					setTimeout(() => {
						this.plus = "waves1_1" + this.funcSet;
						this.LtoR1 = "waves2_1" + this.funcSet;
						this.LtoR2 = "waves3_1" + this.funcSet;
						this.LtoR3 = "waves4_1" + this.funcSet;
						this.LtoR4 = "waves5_1" + this.funcSet;
						this.LtoR5 = "waves6_1" + this.funcSet;
						this.LtoR6 = "waves7_1" + this.funcSet;
						this.LtoR7 = "waves8_1" + this.funcSet;
						this.LtoR8 = "waves7_1" + this.funcSet;
						this.LtoR9 = "waves6_1" + this.funcSet;
						this.LtoR10 = "waves5_1" + this.funcSet;
					}, 10);
					this.num = 3
				}
				else if (this.num == 3) {
					this.clear2();
					setTimeout(() => {
						this.plus_2 = "waves1_2" + this.funcSet;
						this.LtoR1_2 = "waves2_2" + this.funcSet;
						this.LtoR2_2 = "waves3_2" + this.funcSet;
						this.LtoR3_2 = "waves4_2" + this.funcSet;
						this.LtoR4_2 = "waves5_2" + this.funcSet;
						this.LtoR5_2 = "waves6_2" + this.funcSet;
						this.LtoR6_2 = "waves7_2" + this.funcSet;
						this.LtoR7_2 = "waves8_2" + this.funcSet;
						this.LtoR8_2 = "waves7_2" + this.funcSet;
						this.LtoR9_2 = "waves6_2" + this.funcSet;
						this.LtoR10_2 = "waves5_2" + this.funcSet;
					}, 10)
					this.num = 2
				}
				break;

			case this.vKey == 8 && this.keyStatus == 1: //bsp
				if (this.num == 2) {
					this.clear();
					setTimeout(() => {
						this.bsp = "waves1_1" + this.funcSet;
						this.LtoR1 = "waves2_1" + this.funcSet;
						this.LtoR2 = "waves3_1" + this.funcSet;
						this.LtoR3 = "waves4_1" + this.funcSet;
						this.LtoR4 = "waves5_1" + this.funcSet;
						this.LtoR5 = "waves6_1" + this.funcSet;
						this.LtoR6 = "waves7_1" + this.funcSet;
						this.LtoR7 = "waves8_1" + this.funcSet;
						this.LtoR8 = "waves9_1" + this.funcSet;
						this.LtoR9 = "waves8_1" + this.funcSet;
						this.LtoR10 = "waves7_1" + this.funcSet;
					}, 10);
					this.num = 3
				}
				else if (this.num == 3) {
					this.clear2();
					setTimeout(() => {
						this.bsp_2 = "waves1_2" + this.funcSet;
						this.LtoR1_2 = "waves2_2" + this.funcSet;
						this.LtoR2_2 = "waves3_2" + this.funcSet;
						this.LtoR3_2 = "waves4_2" + this.funcSet;
						this.LtoR4_2 = "waves5_2" + this.funcSet;
						this.LtoR5_2 = "waves6_2" + this.funcSet;
						this.LtoR6_2 = "waves7_2" + this.funcSet;
						this.LtoR7_2 = "waves8_2" + this.funcSet;
						this.LtoR8_2 = "waves9_2" + this.funcSet;
						this.LtoR9_2 = "waves8_2" + this.funcSet;
						this.LtoR10_2 = "waves7_2" + this.funcSet;
					}, 10)
					this.num = 2
				}
				break;

			case this.vKey == 45 && this.keyStatus == 1: //insert
				if (this.num == 2) {
					this.clear();
					setTimeout(() => {
						this.insert = "waves1_1" + this.funcSet;
						this.LtoR1 = "waves2_1" + this.funcSet;
						this.LtoR2 = "waves3_1" + this.funcSet;
						this.LtoR3 = "waves4_1" + this.funcSet;
						this.LtoR4 = "waves5_1" + this.funcSet;
						this.LtoR5 = "waves6_1" + this.funcSet;
						this.LtoR6 = "waves7_1" + this.funcSet;
						this.LtoR7 = "waves8_1" + this.funcSet;
						this.LtoR8 = "waves9_1" + this.funcSet;
						this.LtoR9 = "waves8_1" + this.funcSet;
						this.LtoR10 = "waves7_1" + this.funcSet;
					}, 10);
					this.num = 3
				}
				else if (this.num == 3) {
					this.clear2();
					setTimeout(() => {
						this.insert_2 = "waves1_2" + this.funcSet;
						this.LtoR1_2 = "waves2_2" + this.funcSet;
						this.LtoR2_2 = "waves3_2" + this.funcSet;
						this.LtoR3_2 = "waves4_2" + this.funcSet;
						this.LtoR4_2 = "waves5_2" + this.funcSet;
						this.LtoR5_2 = "waves6_2" + this.funcSet;
						this.LtoR6_2 = "waves7_2" + this.funcSet;
						this.LtoR7_2 = "waves8_2" + this.funcSet;
						this.LtoR8_2 = "waves9_2" + this.funcSet;
						this.LtoR9_2 = "waves8_2" + this.funcSet;
						this.LtoR10_2 = "waves7_2" + this.funcSet;
					}, 10)
					this.num = 2
				}
				break;

			case this.vKey == 36 && this.keyStatus == 1: //home
				if (this.num == 2) {
					this.clear();
					setTimeout(() => {
						this.home = "waves1_1" + this.funcSet;
						this.LtoR1 = "waves2_1" + this.funcSet;
						this.LtoR2 = "waves3_1" + this.funcSet;
						this.LtoR3 = "waves4_1" + this.funcSet;
						this.LtoR4 = "waves5_1" + this.funcSet;
						this.LtoR5 = "waves6_1" + this.funcSet;
						this.LtoR6 = "waves7_1" + this.funcSet;
						this.LtoR7 = "waves8_1" + this.funcSet;
						this.LtoR8 = "waves9_1" + this.funcSet;
						this.LtoR9 = "waves8_1" + this.funcSet;
						this.LtoR10 = "waves7_1" + this.funcSet;
					}, 10);
					this.num = 3
				}
				else if (this.num == 3) {
					this.clear2();
					setTimeout(() => {
						this.home_2 = "waves1_2" + this.funcSet;
						this.LtoR1_2 = "waves2_2" + this.funcSet;
						this.LtoR2_2 = "waves3_2" + this.funcSet;
						this.LtoR3_2 = "waves4_2" + this.funcSet;
						this.LtoR4_2 = "waves5_2" + this.funcSet;
						this.LtoR5_2 = "waves6_2" + this.funcSet;
						this.LtoR6_2 = "waves7_2" + this.funcSet;
						this.LtoR7_2 = "waves8_2" + this.funcSet;
						this.LtoR8_2 = "waves9_2" + this.funcSet;
						this.LtoR9_2 = "waves8_2" + this.funcSet;
						this.LtoR10_2 = "waves7_2" + this.funcSet;
					}, 10)
					this.num = 2
				}
				break;

			case this.vKey == 33 && this.keyStatus == 1: //pup
				if (this.num == 2) {
					this.clear();
					setTimeout(() => {
						this.pup = "waves1_1" + this.funcSet;
						this.LtoR1 = "waves2_1" + this.funcSet;
						this.LtoR2 = "waves3_1" + this.funcSet;
						this.LtoR3 = "waves4_1" + this.funcSet;
						this.LtoR4 = "waves5_1" + this.funcSet;
						this.LtoR5 = "waves6_1" + this.funcSet;
						this.LtoR6 = "waves7_1" + this.funcSet;
						this.LtoR7 = "waves8_1" + this.funcSet;
						this.LtoR8 = "waves9_1" + this.funcSet;
						this.LtoR9 = "waves8_1" + this.funcSet;
						this.LtoR10 = "waves7_1" + this.funcSet;
					}, 10);
					this.num = 3
				}
				else if (this.num == 3) {
					this.clear2();
					setTimeout(() => {
						this.pup_2 = "waves1_2" + this.funcSet;
						this.LtoR1_2 = "waves2_2" + this.funcSet;
						this.LtoR2_2 = "waves3_2" + this.funcSet;
						this.LtoR3_2 = "waves4_2" + this.funcSet;
						this.LtoR4_2 = "waves5_2" + this.funcSet;
						this.LtoR5_2 = "waves6_2" + this.funcSet;
						this.LtoR6_2 = "waves7_2" + this.funcSet;
						this.LtoR7_2 = "waves8_2" + this.funcSet;
						this.LtoR8_2 = "waves9_2" + this.funcSet;
						this.LtoR9_2 = "waves8_2" + this.funcSet;
						this.LtoR10_2 = "waves7_2" + this.funcSet;
					}, 10)
					this.num = 2
				}
				break;

			case this.vKey == 144 && this.keyStatus == 1: //numlock
				if (this.num == 2) {
					this.clear();
					setTimeout(() => {
						this.numlock = "waves1_1" + this.funcSet;
						this.LtoR1 = "waves2_1" + this.funcSet;
						this.LtoR2 = "waves3_1" + this.funcSet;
						this.LtoR3 = "waves4_1" + this.funcSet;
						this.LtoR4 = "waves5_1" + this.funcSet;
						this.LtoR5 = "waves6_1" + this.funcSet;
						this.LtoR6 = "waves7_1" + this.funcSet;
						this.LtoR7 = "waves8_1" + this.funcSet;
						this.LtoR8 = "waves9_1" + this.funcSet;
						this.LtoR9 = "waves10_1" + this.funcSet;
						this.LtoR10 = "waves9_1" + this.funcSet;
					}, 10);
					this.num = 3
				}
				else if (this.num == 3) {
					this.clear2();
					setTimeout(() => {
						this.numlock_2 = "waves1_2" + this.funcSet;
						this.LtoR1_2 = "waves2_2" + this.funcSet;
						this.LtoR2_2 = "waves3_2" + this.funcSet;
						this.LtoR3_2 = "waves4_2" + this.funcSet;
						this.LtoR4_2 = "waves5_2" + this.funcSet;
						this.LtoR5_2 = "waves6_2" + this.funcSet;
						this.LtoR6_2 = "waves7_2" + this.funcSet;
						this.LtoR7_2 = "waves8_2" + this.funcSet;
						this.LtoR8_2 = "waves9_2" + this.funcSet;
						this.LtoR9_2 = "waves10_2" + this.funcSet;
						this.LtoR10_2 = "waves9_2" + this.funcSet;
					}, 10)
					this.num = 2
				}
				break;

			case this.vKey == 111 && this.keyStatus == 1: //numdrawn
				if (this.num == 2) {
					this.clear();
					setTimeout(() => {
						this.numdrawn = "waves1_1" + this.funcSet;
						this.LtoR1 = "waves2_1" + this.funcSet;
						this.LtoR2 = "waves3_1" + this.funcSet;
						this.LtoR3 = "waves4_1" + this.funcSet;
						this.LtoR4 = "waves5_1" + this.funcSet;
						this.LtoR5 = "waves6_1" + this.funcSet;
						this.LtoR6 = "waves7_1" + this.funcSet;
						this.LtoR7 = "waves8_1" + this.funcSet;
						this.LtoR8 = "waves9_1" + this.funcSet;
						this.LtoR9 = "waves10_1" + this.funcSet;
						this.LtoR10 = "waves9_1" + this.funcSet;
					}, 10);
					this.num = 3
				}
				else if (this.num == 3) {
					this.clear2();
					setTimeout(() => {
						this.numdrawn_2 = "waves1_2" + this.funcSet;
						this.LtoR1_2 = "waves2_2" + this.funcSet;
						this.LtoR2_2 = "waves3_2" + this.funcSet;
						this.LtoR3_2 = "waves4_2" + this.funcSet;
						this.LtoR4_2 = "waves5_2" + this.funcSet;
						this.LtoR5_2 = "waves6_2" + this.funcSet;
						this.LtoR6_2 = "waves7_2" + this.funcSet;
						this.LtoR7_2 = "waves8_2" + this.funcSet;
						this.LtoR8_2 = "waves9_2" + this.funcSet;
						this.LtoR9_2 = "waves10_2" + this.funcSet;
						this.LtoR10_2 = "waves9_2" + this.funcSet;
					}, 10)
					this.num = 2
				}
				break;

			case this.vKey == 106 && this.keyStatus == 1: //numtimes
				if (this.num == 2) {
					this.clear();
					setTimeout(() => {
						this.numtimes = "waves1_1" + this.funcSet;
						this.LtoR1 = "waves2_1" + this.funcSet;
						this.LtoR2 = "waves3_1" + this.funcSet;
						this.LtoR3 = "waves4_1" + this.funcSet;
						this.LtoR4 = "waves5_1" + this.funcSet;
						this.LtoR5 = "waves6_1" + this.funcSet;
						this.LtoR6 = "waves7_1" + this.funcSet;
						this.LtoR7 = "waves8_1" + this.funcSet;
						this.LtoR8 = "waves9_1" + this.funcSet;
						this.LtoR9 = "waves10_1" + this.funcSet;
						this.LtoR10 = "waves11_1" + this.funcSet;
					}, 10);
					this.num = 3
				}
				else if (this.num == 3) {
					this.clear2();
					setTimeout(() => {
						this.numtimes_2 = "waves1_2" + this.funcSet;
						this.LtoR1_2 = "waves2_2" + this.funcSet;
						this.LtoR2_2 = "waves3_2" + this.funcSet;
						this.LtoR3_2 = "waves4_2" + this.funcSet;
						this.LtoR4_2 = "waves5_2" + this.funcSet;
						this.LtoR5_2 = "waves6_2" + this.funcSet;
						this.LtoR6_2 = "waves7_2" + this.funcSet;
						this.LtoR7_2 = "waves8_2" + this.funcSet;
						this.LtoR8_2 = "waves9_2" + this.funcSet;
						this.LtoR9_2 = "waves10_2" + this.funcSet;
						this.LtoR10_2 = "waves11_2" + this.funcSet;
					}, 10)
					this.num = 2
				}
				break;

			case this.vKey == 109 && this.keyStatus == 1: //numminus
				if (this.num == 2) {
					this.clear();
					setTimeout(() => {
						this.numminus = "waves1_1" + this.funcSet;
						this.LtoR1 = "waves2_1" + this.funcSet;
						this.LtoR2 = "waves3_1" + this.funcSet;
						this.LtoR3 = "waves4_1" + this.funcSet;
						this.LtoR4 = "waves5_1" + this.funcSet;
						this.LtoR5 = "waves6_1" + this.funcSet;
						this.LtoR6 = "waves7_1" + this.funcSet;
						this.LtoR7 = "waves8_1" + this.funcSet;
						this.LtoR8 = "waves9_1" + this.funcSet;
						this.LtoR9 = "waves10_1" + this.funcSet;
						this.LtoR10 = "waves11_1" + this.funcSet;
					}, 10);
					this.num = 3
				}
				else if (this.num == 3) {
					this.clear2();
					setTimeout(() => {
						this.numminus_2 = "waves1_2" + this.funcSet;
						this.LtoR1_2 = "waves2_2" + this.funcSet;
						this.LtoR2_2 = "waves3_2" + this.funcSet;
						this.LtoR3_2 = "waves4_2" + this.funcSet;
						this.LtoR4_2 = "waves5_2" + this.funcSet;
						this.LtoR5_2 = "waves6_2" + this.funcSet;
						this.LtoR6_2 = "waves7_2" + this.funcSet;
						this.LtoR7_2 = "waves8_2" + this.funcSet;
						this.LtoR8_2 = "waves9_2" + this.funcSet;
						this.LtoR9_2 = "waves10_2" + this.funcSet;
						this.LtoR10_2 = "waves11_2" + this.funcSet;
					}, 10)
					this.num = 2
				}
				break;

			case this.vKey == 9 && this.keyStatus == 1: //tab
				if (this.num == 2) {
					this.clear();
					setTimeout(() => {
						this.tab = "waves1_1" + this.funcSet;
						this.LtoR1 = "waves11_1" + this.funcSet;
						this.LtoR2 = "waves10_1" + this.funcSet;
						this.LtoR3 = "waves9_1" + this.funcSet;
						this.LtoR4 = "waves8_1" + this.funcSet;
						this.LtoR5 = "waves7_1" + this.funcSet;
						this.LtoR6 = "waves6_1" + this.funcSet;
						this.LtoR7 = "waves5_1" + this.funcSet;
						this.LtoR8 = "waves4_1" + this.funcSet;
						this.LtoR9 = "waves3_1" + this.funcSet;
						this.LtoR10 = "waves2_1" + this.funcSet;
					}, 10);
					this.num = 3
				}
				else if (this.num == 3) {
					this.clear2();
					setTimeout(() => {
						this.tab_2 = "waves1_2" + this.funcSet;
						this.LtoR1_2 = "waves11_2" + this.funcSet;
						this.LtoR2_2 = "waves10_2" + this.funcSet;
						this.LtoR3_2 = "waves9_2" + this.funcSet;
						this.LtoR4_2 = "waves8_2" + this.funcSet;
						this.LtoR5_2 = "waves7_2" + this.funcSet;
						this.LtoR6_2 = "waves6_2" + this.funcSet;
						this.LtoR7_2 = "waves5_2" + this.funcSet;
						this.LtoR8_2 = "waves4_2" + this.funcSet;
						this.LtoR9_2 = "waves3_2" + this.funcSet;
						this.LtoR10_2 = "waves2_2" + this.funcSet;
					}, 10)
					this.num = 2
				}
				break;

			case this.vKey == 81 && this.keyStatus == 1: //q
				if (this.num == 2) {
					this.clear();
					setTimeout(() => {
						this.q = "waves1_1" + this.funcSet;
						this.LtoR1 = "waves11_1" + this.funcSet;
						this.LtoR2 = "waves10_1" + this.funcSet;
						this.LtoR3 = "waves9_1" + this.funcSet;
						this.LtoR4 = "waves8_1" + this.funcSet;
						this.LtoR5 = "waves7_1" + this.funcSet;
						this.LtoR6 = "waves6_1" + this.funcSet;
						this.LtoR7 = "waves5_1" + this.funcSet;
						this.LtoR8 = "waves4_1" + this.funcSet;
						this.LtoR9 = "waves3_1" + this.funcSet;
						this.LtoR10 = "waves2_1" + this.funcSet;
					}, 10);
					this.num = 3
				}
				else if (this.num == 3) {
					this.clear2();
					setTimeout(() => {
						this.q_2 = "waves1_2" + this.funcSet;
						this.LtoR1_2 = "waves11_2" + this.funcSet;
						this.LtoR2_2 = "waves10_2" + this.funcSet;
						this.LtoR3_2 = "waves9_2" + this.funcSet;
						this.LtoR4_2 = "waves8_2" + this.funcSet;
						this.LtoR5_2 = "waves7_2" + this.funcSet;
						this.LtoR6_2 = "waves6_2" + this.funcSet;
						this.LtoR7_2 = "waves5_2" + this.funcSet;
						this.LtoR8_2 = "waves4_2" + this.funcSet;
						this.LtoR9_2 = "waves3_2" + this.funcSet;
						this.LtoR10_2 = "waves2_2" + this.funcSet;
					}, 10)
					this.num = 2
				}
				break;

			case this.vKey == 87 && this.keyStatus == 1: //w
				if (this.num == 2) {
					this.clear();
					setTimeout(() => {
						this.w = "waves1_1" + this.funcSet;
						this.LtoR1 = "waves9_1" + this.funcSet;
						this.LtoR2 = "waves10_1" + this.funcSet;
						this.LtoR3 = "waves9_1" + this.funcSet;
						this.LtoR4 = "waves8_1" + this.funcSet;
						this.LtoR5 = "waves7_1" + this.funcSet;
						this.LtoR6 = "waves6_1" + this.funcSet;
						this.LtoR7 = "waves5_1" + this.funcSet;
						this.LtoR8 = "waves4_1" + this.funcSet;
						this.LtoR9 = "waves3_1" + this.funcSet;
						this.LtoR10 = "waves2_1" + this.funcSet;
					}, 10);
					this.num = 3
				}
				else if (this.num == 3) {
					this.clear2();
					setTimeout(() => {
						this.w_2 = "waves1_2" + this.funcSet;
						this.LtoR1_2 = "waves9_2" + this.funcSet;
						this.LtoR2_2 = "waves10_2" + this.funcSet;
						this.LtoR3_2 = "waves9_2" + this.funcSet;
						this.LtoR4_2 = "waves8_2" + this.funcSet;
						this.LtoR5_2 = "waves7_2" + this.funcSet;
						this.LtoR6_2 = "waves6_2" + this.funcSet;
						this.LtoR7_2 = "waves5_2" + this.funcSet;
						this.LtoR8_2 = "waves4_2" + this.funcSet;
						this.LtoR9_2 = "waves3_2" + this.funcSet;
						this.LtoR10_2 = "waves2_2" + this.funcSet;
					}, 10)
					this.num = 2
				}
				break;

			case this.vKey == 69 && this.keyStatus == 1: //E
				if (this.num == 2) {
					this.clear();
					setTimeout(() => {
						this.e = "waves1_1" + this.funcSet;
						this.LtoR1 = "waves9_1" + this.funcSet;
						this.LtoR2 = "waves10_1" + this.funcSet;
						this.LtoR3 = "waves9_1" + this.funcSet;
						this.LtoR4 = "waves8_1" + this.funcSet;
						this.LtoR5 = "waves7_1" + this.funcSet;
						this.LtoR6 = "waves6_1" + this.funcSet;
						this.LtoR7 = "waves5_1" + this.funcSet;
						this.LtoR8 = "waves4_1" + this.funcSet;
						this.LtoR9 = "waves3_1" + this.funcSet;
						this.LtoR10 = "waves2_1" + this.funcSet;
					}, 10);
					this.num = 3
				}
				else if (this.num == 3) {
					this.clear2();
					setTimeout(() => {
						this.e_2 = "waves1_2" + this.funcSet;
						this.LtoR1_2 = "waves9_2" + this.funcSet;
						this.LtoR2_2 = "waves10_2" + this.funcSet;
						this.LtoR3_2 = "waves9_2" + this.funcSet;
						this.LtoR4_2 = "waves8_2" + this.funcSet;
						this.LtoR5_2 = "waves7_2" + this.funcSet;
						this.LtoR6_2 = "waves6_2" + this.funcSet;
						this.LtoR7_2 = "waves5_2" + this.funcSet;
						this.LtoR8_2 = "waves4_2" + this.funcSet;
						this.LtoR9_2 = "waves3_2" + this.funcSet;
						this.LtoR10_2 = "waves2_2" + this.funcSet;
					}, 10)
					this.num = 2
				}
				break;

			case this.vKey == 82 && this.keyStatus == 1: //R
				if (this.num == 2) {
					this.clear();
					setTimeout(() => {
						this.r = "waves1_1" + this.funcSet;
						this.LtoR1 = "waves7_1" + this.funcSet;
						this.LtoR2 = "waves8_1" + this.funcSet;
						this.LtoR3 = "waves9_1" + this.funcSet;
						this.LtoR4 = "waves8_1" + this.funcSet;
						this.LtoR5 = "waves7_1" + this.funcSet;
						this.LtoR6 = "waves6_1" + this.funcSet;
						this.LtoR7 = "waves5_1" + this.funcSet;
						this.LtoR8 = "waves4_1" + this.funcSet;
						this.LtoR9 = "waves3_1" + this.funcSet;
						this.LtoR10 = "waves2_1" + this.funcSet;
					}, 10);
					this.num = 3
				}
				else if (this.num == 3) {
					this.clear2();
					setTimeout(() => {
						this.r_2 = "waves1_2" + this.funcSet;
						this.LtoR1_2 = "waves7_2" + this.funcSet;
						this.LtoR2_2 = "waves8_2" + this.funcSet;
						this.LtoR3_2 = "waves9_2" + this.funcSet;
						this.LtoR4_2 = "waves8_2" + this.funcSet;
						this.LtoR5_2 = "waves7_2" + this.funcSet;
						this.LtoR6_2 = "waves6_2" + this.funcSet;
						this.LtoR7_2 = "waves5_2" + this.funcSet;
						this.LtoR8_2 = "waves4_2" + this.funcSet;
						this.LtoR9_2 = "waves3_2" + this.funcSet;
						this.LtoR10_2 = "waves2_2" + this.funcSet;
					}, 10)
					this.num = 2
				}
				break;

			case this.vKey == 84 && this.keyStatus == 1: //T
				if (this.num == 2) {
					this.clear();
					setTimeout(() => {
						this.t = "waves1_1" + this.funcSet;
						this.LtoR1 = "waves7_1" + this.funcSet;
						this.LtoR2 = "waves8_1" + this.funcSet;
						this.LtoR3 = "waves9_1" + this.funcSet;
						this.LtoR4 = "waves8_1" + this.funcSet;
						this.LtoR5 = "waves7_1" + this.funcSet;
						this.LtoR6 = "waves6_1" + this.funcSet;
						this.LtoR7 = "waves5_1" + this.funcSet;
						this.LtoR8 = "waves4_1" + this.funcSet;
						this.LtoR9 = "waves3_1" + this.funcSet;
						this.LtoR10 = "waves2_1" + this.funcSet;
					}, 10);
					this.num = 3
				}
				else if (this.num == 3) {
					this.clear2();
					setTimeout(() => {
						this.t_2 = "waves1_2" + this.funcSet;
						this.LtoR1_2 = "waves7_2" + this.funcSet;
						this.LtoR2_2 = "waves8_2" + this.funcSet;
						this.LtoR3_2 = "waves9_2" + this.funcSet;
						this.LtoR4_2 = "waves8_2" + this.funcSet;
						this.LtoR5_2 = "waves7_2" + this.funcSet;
						this.LtoR6_2 = "waves6_2" + this.funcSet;
						this.LtoR7_2 = "waves5_2" + this.funcSet;
						this.LtoR8_2 = "waves4_2" + this.funcSet;
						this.LtoR9_2 = "waves3_2" + this.funcSet;
						this.LtoR10_2 = "waves2_2" + this.funcSet;
					}, 10)
					this.num = 2
				}
				break;

			case this.vKey == 89 && this.keyStatus == 1: //Y
				if (this.num == 2) {
					this.clear();
					setTimeout(() => {
						this.y = "waves1_1" + this.funcSet;
						this.LtoR1 = "waves5_1" + this.funcSet;
						this.LtoR2 = "waves6_1" + this.funcSet;
						this.LtoR3 = "waves7_1" + this.funcSet;
						this.LtoR4 = "waves8_1" + this.funcSet;
						this.LtoR5 = "waves7_1" + this.funcSet;
						this.LtoR6 = "waves6_1" + this.funcSet;
						this.LtoR7 = "waves5_1" + this.funcSet;
						this.LtoR8 = "waves4_1" + this.funcSet;
						this.LtoR9 = "waves3_1" + this.funcSet;
						this.LtoR10 = "waves2_1" + this.funcSet;
					}, 10);
					this.num = 3
				}
				else if (this.num == 3) {
					this.clear2();
					setTimeout(() => {
						this.y_2 = "waves1_2" + this.funcSet;
						this.LtoR1_2 = "waves5_2" + this.funcSet;
						this.LtoR2_2 = "waves6_2" + this.funcSet;
						this.LtoR3_2 = "waves7_2" + this.funcSet;
						this.LtoR4_2 = "waves8_2" + this.funcSet;
						this.LtoR5_2 = "waves7_2" + this.funcSet;
						this.LtoR6_2 = "waves6_2" + this.funcSet;
						this.LtoR7_2 = "waves5_2" + this.funcSet;
						this.LtoR8_2 = "waves4_2" + this.funcSet;
						this.LtoR9_2 = "waves3_2" + this.funcSet;
						this.LtoR10_2 = "waves2_2" + this.funcSet;
					}, 10)
					this.num = 2
				}
				break;

			case this.vKey == 85 && this.keyStatus == 1: //U
				if (this.num == 2) {
					this.clear();
					setTimeout(() => {
						this.u = "waves1_1" + this.funcSet;
						this.LtoR1 = "waves5_1" + this.funcSet;
						this.LtoR2 = "waves6_1" + this.funcSet;
						this.LtoR3 = "waves7_1" + this.funcSet;
						this.LtoR4 = "waves8_1" + this.funcSet;
						this.LtoR5 = "waves7_1" + this.funcSet;
						this.LtoR6 = "waves6_1" + this.funcSet;
						this.LtoR7 = "waves5_1" + this.funcSet;
						this.LtoR8 = "waves4_1" + this.funcSet;
						this.LtoR9 = "waves3_1" + this.funcSet;
						this.LtoR10 = "waves2_1" + this.funcSet;
					}, 10);
					this.num = 3
				}
				else if (this.num == 3) {
					this.clear2();
					setTimeout(() => {
						this.u_2 = "waves1_2" + this.funcSet;;
						this.LtoR1_2 = "waves5_2" + this.funcSet;
						this.LtoR2_2 = "waves6_2" + this.funcSet;
						this.LtoR3_2 = "waves7_2" + this.funcSet;
						this.LtoR4_2 = "waves8_2" + this.funcSet;
						this.LtoR5_2 = "waves7_2" + this.funcSet;
						this.LtoR6_2 = "waves6_2" + this.funcSet;
						this.LtoR7_2 = "waves5_2" + this.funcSet;
						this.LtoR8_2 = "waves4_2" + this.funcSet;
						this.LtoR9_2 = "waves3_2" + this.funcSet;
						this.LtoR10_2 = "waves2_2" + this.funcSet;
					}, 10)
					this.num = 2
				}
				break;

			case this.vKey == 73 && this.keyStatus == 1: //I
				if (this.num == 2) {
					this.clear();
					setTimeout(() => {
						this.i = "waves1_1" + this.funcSet;
						this.LtoR1 = "waves3_1" + this.funcSet;
						this.LtoR2 = "waves4_1" + this.funcSet;
						this.LtoR3 = "waves5_1" + this.funcSet;
						this.LtoR4 = "waves6_1" + this.funcSet;
						this.LtoR5 = "waves7_1" + this.funcSet;
						this.LtoR6 = "waves6_1" + this.funcSet;
						this.LtoR7 = "waves5_1" + this.funcSet;
						this.LtoR8 = "waves4_1" + this.funcSet;
						this.LtoR9 = "waves3_1" + this.funcSet;
						this.LtoR10 = "waves2_1" + this.funcSet;
					}, 10);
					this.num = 3
				}
				else if (this.num == 3) {
					this.clear2();
					setTimeout(() => {
						this.i_2 = "waves1_2" + this.funcSet;
						this.LtoR1_2 = "waves3_2" + this.funcSet;
						this.LtoR2_2 = "waves4_2" + this.funcSet;
						this.LtoR3_2 = "waves5_2" + this.funcSet;
						this.LtoR4_2 = "waves6_2" + this.funcSet;
						this.LtoR5_2 = "waves7_2" + this.funcSet;
						this.LtoR6_2 = "waves6_2" + this.funcSet;
						this.LtoR7_2 = "waves5_2" + this.funcSet;
						this.LtoR8_2 = "waves4_2" + this.funcSet;
						this.LtoR9_2 = "waves3_2" + this.funcSet;
						this.LtoR10_2 = "waves2_2" + this.funcSet;
					}, 10)
					this.num = 2
				}
				break;

			case this.vKey == 79 && this.keyStatus == 1: //O
				if (this.num == 2) {
					this.clear();
					setTimeout(() => {
						this.o = "waves1_1" + this.funcSet;
						this.LtoR1 = "waves3_1" + this.funcSet;
						this.LtoR2 = "waves4_1" + this.funcSet;
						this.LtoR3 = "waves5_1" + this.funcSet;
						this.LtoR4 = "waves6_1" + this.funcSet;
						this.LtoR5 = "waves7_1" + this.funcSet;
						this.LtoR6 = "waves6_1" + this.funcSet;
						this.LtoR7 = "waves5_1" + this.funcSet;
						this.LtoR8 = "waves4_1" + this.funcSet;
						this.LtoR9 = "waves3_1" + this.funcSet;
						this.LtoR10 = "waves2_1" + this.funcSet;
					}, 10);
					this.num = 3
				}
				else if (this.num == 3) {
					this.clear2();
					setTimeout(() => {
						this.o_2 = "waves1_2" + this.funcSet;
						this.LtoR1_2 = "waves3_2" + this.funcSet;
						this.LtoR2_2 = "waves4_2" + this.funcSet;
						this.LtoR3_2 = "waves5_2" + this.funcSet;
						this.LtoR4_2 = "waves6_2" + this.funcSet;
						this.LtoR5_2 = "waves7_2" + this.funcSet;
						this.LtoR6_2 = "waves6_2" + this.funcSet;
						this.LtoR7_2 = "waves5_2" + this.funcSet;
						this.LtoR8_2 = "waves4_2" + this.funcSet;
						this.LtoR9_2 = "waves3_2" + this.funcSet;
						this.LtoR10_2 = "waves2_2" + this.funcSet;
					}, 10)
					this.num = 2
				}
				break;

			case this.vKey == 80 && this.keyStatus == 1: //P
				if (this.num == 2) {
					this.clear();
					setTimeout(() => {
						this.p = "waves1_1" + this.funcSet;
						this.LtoR1 = "waves2_1" + this.funcSet;
						this.LtoR2 = "waves3_1" + this.funcSet;
						this.LtoR3 = "waves4_1" + this.funcSet;
						this.LtoR4 = "waves5_1" + this.funcSet;
						this.LtoR5 = "waves6_1" + this.funcSet;
						this.LtoR6 = "waves7_1" + this.funcSet;
						this.LtoR7 = "waves6_1" + this.funcSet;
						this.LtoR8 = "waves5_1" + this.funcSet;
						this.LtoR9 = "waves4_1" + this.funcSet;
						this.LtoR10 = "waves3_1" + this.funcSet;
					}, 10);
					this.num = 3
				}
				else if (this.num == 3) {
					this.clear2();
					setTimeout(() => {
						this.p_2 = "waves1_2" + this.funcSet;
						this.LtoR1_2 = "waves2_2" + this.funcSet;
						this.LtoR2_2 = "waves3_2" + this.funcSet;
						this.LtoR3_2 = "waves4_2" + this.funcSet;
						this.LtoR4_2 = "waves5_2" + this.funcSet;
						this.LtoR5_2 = "waves6_2" + this.funcSet;
						this.LtoR6_2 = "waves7_2" + this.funcSet;
						this.LtoR7_2 = "waves6_2" + this.funcSet;
						this.LtoR8_2 = "waves5_2" + this.funcSet;
						this.LtoR9_2 = "waves4_2" + this.funcSet;
						this.LtoR10_2 = "waves3_2" + this.funcSet;
					}, 10)
					this.num = 2
				}
				break;

			case this.vKey == 219 && this.keyStatus == 1: //lqu
				if (this.num == 2) {
					this.clear();
					setTimeout(() => {
						this.lqu = "waves1_1" + this.funcSet;
						this.LtoR1 = "waves2_1" + this.funcSet;
						this.LtoR2 = "waves3_1" + this.funcSet;
						this.LtoR3 = "waves4_1" + this.funcSet;
						this.LtoR4 = "waves5_1" + this.funcSet;
						this.LtoR5 = "waves6_1" + this.funcSet;
						this.LtoR6 = "waves7_1" + this.funcSet;
						this.LtoR7 = "waves6_1" + this.funcSet;
						this.LtoR8 = "waves5_1" + this.funcSet;
						this.LtoR9 = "waves4_1" + this.funcSet;
						this.LtoR10 = "waves3_1" + this.funcSet;
					}, 10);
					this.num = 3
				}
				else if (this.num == 3) {
					this.clear2();
					setTimeout(() => {
						this.lqu_2 = "waves1_2" + this.funcSet;
						this.LtoR1_2 = "waves2_2" + this.funcSet;
						this.LtoR2_2 = "waves3_2" + this.funcSet;
						this.LtoR3_2 = "waves4_2" + this.funcSet;
						this.LtoR4_2 = "waves5_2" + this.funcSet;
						this.LtoR5_2 = "waves6_2" + this.funcSet;
						this.LtoR6_2 = "waves7_2" + this.funcSet;
						this.LtoR7_2 = "waves6_2" + this.funcSet;
						this.LtoR8_2 = "waves5_2" + this.funcSet;
						this.LtoR9_2 = "waves4_2" + this.funcSet;
						this.LtoR10_2 = "waves3_2" + this.funcSet;
					}, 10)
					this.num = 2
				}
				break;

			case this.vKey == 221 && this.keyStatus == 1: //rqu 
				if (this.num == 2) {
					this.clear();
					setTimeout(() => {
						this.rqu = "waves1_1" + this.funcSet;
						this.LtoR1 = "waves2_1" + this.funcSet;
						this.LtoR2 = "waves3_1" + this.funcSet;
						this.LtoR3 = "waves4_1" + this.funcSet;
						this.LtoR4 = "waves5_1" + this.funcSet;
						this.LtoR5 = "waves6_1" + this.funcSet;
						this.LtoR6 = "waves7_1" + this.funcSet;
						this.LtoR7 = "waves8_1" + this.funcSet;
						this.LtoR8 = "waves7_1" + this.funcSet;
						this.LtoR9 = "waves6_1" + this.funcSet;
						this.LtoR10 = "waves5_1" + this.funcSet;
					}, 10);
					this.num = 3
				}
				else if (this.num == 3) {
					this.clear2();
					setTimeout(() => {
						this.rqu_2 = "waves1_2" + this.funcSet;
						this.LtoR1_2 = "waves2_2" + this.funcSet;
						this.LtoR2_2 = "waves3_2" + this.funcSet;
						this.LtoR3_2 = "waves4_2" + this.funcSet;
						this.LtoR4_2 = "waves5_2" + this.funcSet;
						this.LtoR5_2 = "waves6_2" + this.funcSet;
						this.LtoR6_2 = "waves7_2" + this.funcSet;
						this.LtoR7_2 = "waves8_2" + this.funcSet;
						this.LtoR8_2 = "waves7_2" + this.funcSet;
						this.LtoR9_2 = "waves6_2" + this.funcSet;
						this.LtoR10_2 = "waves5_2" + this.funcSet;
					}, 10)
					this.num = 2
				}
				break;

			case this.vKey == 220 && this.keyStatus == 1: //drawn
				if (this.num == 2) {
					this.clear();
					setTimeout(() => {
						this.drawn = "waves1_1" + this.funcSet;
						this.LtoR1 = "waves2_1" + this.funcSet;
						this.LtoR2 = "waves3_1" + this.funcSet;
						this.LtoR3 = "waves4_1" + this.funcSet;
						this.LtoR4 = "waves5_1" + this.funcSet;
						this.LtoR5 = "waves6_1" + this.funcSet;
						this.LtoR6 = "waves7_1" + this.funcSet;
						this.LtoR7 = "waves8_1" + this.funcSet;
						this.LtoR8 = "waves7_1" + this.funcSet;
						this.LtoR9 = "waves6_1" + this.funcSet;
						this.LtoR10 = "waves5_1" + this.funcSet;
					}, 10);
					this.num = 3
				}
				else if (this.num == 3) {
					this.clear2();
					setTimeout(() => {
						this.drawn_2 = "waves1_2" + this.funcSet;
						this.LtoR1_2 = "waves2_2" + this.funcSet;
						this.LtoR2_2 = "waves3_2" + this.funcSet;
						this.LtoR3_2 = "waves4_2" + this.funcSet;
						this.LtoR4_2 = "waves5_2" + this.funcSet;
						this.LtoR5_2 = "waves6_2" + this.funcSet;
						this.LtoR6_2 = "waves7_2" + this.funcSet;
						this.LtoR7_2 = "waves8_2" + this.funcSet;
						this.LtoR8_2 = "waves7_2" + this.funcSet;
						this.LtoR9_2 = "waves6_2" + this.funcSet;
						this.LtoR10_2 = "waves5_2" + this.funcSet;
					}, 10)
					this.num = 2
				}
				break;

			case this.vKey == 46 && this.keyStatus == 1: //delete
				if (this.num == 2) {
					this.clear();
					setTimeout(() => {
						this.delete = "waves1_1" + this.funcSet;
						this.LtoR1 = "waves2_1" + this.funcSet;
						this.LtoR2 = "waves3_1" + this.funcSet;
						this.LtoR3 = "waves4_1" + this.funcSet;
						this.LtoR4 = "waves5_1" + this.funcSet;
						this.LtoR5 = "waves6_1" + this.funcSet;
						this.LtoR6 = "waves7_1" + this.funcSet;
						this.LtoR7 = "waves8_1" + this.funcSet;
						this.LtoR8 = "waves9_1" + this.funcSet;
						this.LtoR9 = "waves8_1" + this.funcSet;
						this.LtoR10 = "waves7_1" + this.funcSet;
					}, 10);
					this.num = 3
				}
				else if (this.num == 3) {
					this.clear2();
					setTimeout(() => {
						this.delete_2 = "waves1_2" + this.funcSet;
						this.LtoR1_2 = "waves2_2" + this.funcSet;
						this.LtoR2_2 = "waves3_2" + this.funcSet;
						this.LtoR3_2 = "waves4_2" + this.funcSet;
						this.LtoR4_2 = "waves5_2" + this.funcSet;
						this.LtoR5_2 = "waves6_2" + this.funcSet;
						this.LtoR6_2 = "waves7_2" + this.funcSet;
						this.LtoR7_2 = "waves8_2" + this.funcSet;
						this.LtoR8_2 = "waves9_2" + this.funcSet;
						this.LtoR9_2 = "waves8_2" + this.funcSet;
						this.LtoR10_2 = "waves7_2" + this.funcSet;
					}, 10)
					this.num = 2
				}
				break;

			case this.vKey == 35 && this.keyStatus == 1: //end
				if (this.num == 2) {
					this.clear();
					setTimeout(() => {
						this.end = "waves1_1" + this.funcSet;
						this.LtoR1 = "waves2_1" + this.funcSet;
						this.LtoR2 = "waves3_1" + this.funcSet;
						this.LtoR3 = "waves4_1" + this.funcSet;
						this.LtoR4 = "waves5_1" + this.funcSet;
						this.LtoR5 = "waves6_1" + this.funcSet;
						this.LtoR6 = "waves7_1" + this.funcSet;
						this.LtoR7 = "waves8_1" + this.funcSet;
						this.LtoR8 = "waves9_1" + this.funcSet;
						this.LtoR9 = "waves8_1" + this.funcSet;
						this.LtoR10 = "waves7_1" + this.funcSet;
					}, 10);
					this.num = 3
				}
				else if (this.num == 3) {
					this.clear2();
					setTimeout(() => {
						this.end_2 = "waves1_2" + this.funcSet;
						this.LtoR1_2 = "waves2_2" + this.funcSet;
						this.LtoR2_2 = "waves3_2" + this.funcSet;
						this.LtoR3_2 = "waves4_2" + this.funcSet;
						this.LtoR4_2 = "waves5_2" + this.funcSet;
						this.LtoR5_2 = "waves6_2" + this.funcSet;
						this.LtoR6_2 = "waves7_2" + this.funcSet;
						this.LtoR7_2 = "waves8_2" + this.funcSet;
						this.LtoR8_2 = "waves9_2" + this.funcSet;
						this.LtoR9_2 = "waves8_2" + this.funcSet;
						this.LtoR10_2 = "waves7_2" + this.funcSet;
					}, 10)
					this.num = 2
				}
				break;

			case this.vKey == 34 && this.keyStatus == 1: //pdown
				if (this.num == 2) {
					this.clear();
					setTimeout(() => {
						this.pdown = "waves1_1" + this.funcSet;
						this.LtoR1 = "waves2_1" + this.funcSet;
						this.LtoR2 = "waves3_1" + this.funcSet;
						this.LtoR3 = "waves4_1" + this.funcSet;
						this.LtoR4 = "waves5_1" + this.funcSet;
						this.LtoR5 = "waves6_1" + this.funcSet;
						this.LtoR6 = "waves7_1" + this.funcSet;
						this.LtoR7 = "waves8_1" + this.funcSet;
						this.LtoR8 = "waves9_1" + this.funcSet;
						this.LtoR9 = "waves8_1" + this.funcSet;
						this.LtoR10 = "waves7_1" + this.funcSet;
					}, 10);
					this.num = 3
				}
				else if (this.num == 3) {
					this.clear2();
					setTimeout(() => {
						this.pdown_2 = "waves1_2" + this.funcSet;
						this.LtoR1_2 = "waves2_2" + this.funcSet;
						this.LtoR2_2 = "waves3_2" + this.funcSet;
						this.LtoR3_2 = "waves4_2" + this.funcSet;
						this.LtoR4_2 = "waves5_2" + this.funcSet;
						this.LtoR5_2 = "waves6_2" + this.funcSet;
						this.LtoR6_2 = "waves7_2" + this.funcSet;
						this.LtoR7_2 = "waves8_2" + this.funcSet;
						this.LtoR8_2 = "waves9_2" + this.funcSet;
						this.LtoR9_2 = "waves8_2" + this.funcSet;
						this.LtoR10_2 = "waves7_2" + this.funcSet;
					}, 10)
					this.num = 2
				}
				break;

			case this.vKey == 103 && this.keyStatus == 1: //num7
				if (this.num == 2) {
					this.clear();
					setTimeout(() => {
						this.num7 = "waves1_1" + this.funcSet;
						this.LtoR1 = "waves2_1" + this.funcSet;
						this.LtoR2 = "waves3_1" + this.funcSet;
						this.LtoR3 = "waves4_1" + this.funcSet;
						this.LtoR4 = "waves5_1" + this.funcSet;
						this.LtoR5 = "waves6_1" + this.funcSet;
						this.LtoR6 = "waves7_1" + this.funcSet;
						this.LtoR7 = "waves8_1" + this.funcSet;
						this.LtoR8 = "waves9_1" + this.funcSet;
						this.LtoR9 = "waves10_1" + this.funcSet;
						this.LtoR10 = "waves9_1" + this.funcSet;
					}, 10);
					this.num = 3
				}
				else if (this.num == 3) {
					this.clear2();
					setTimeout(() => {
						this.num7_2 = "waves1_2" + this.funcSet;
						this.LtoR1_2 = "waves2_2" + this.funcSet;
						this.LtoR2_2 = "waves3_2" + this.funcSet;
						this.LtoR3_2 = "waves4_2" + this.funcSet;
						this.LtoR4_2 = "waves5_2" + this.funcSet;
						this.LtoR5_2 = "waves6_2" + this.funcSet;
						this.LtoR6_2 = "waves7_2" + this.funcSet;
						this.LtoR7_2 = "waves8_2" + this.funcSet;
						this.LtoR8_2 = "waves9_2" + this.funcSet;
						this.LtoR9_2 = "waves10_2" + this.funcSet;
						this.LtoR10_2 = "waves9_2" + this.funcSet;
					}, 10)
					this.num = 2
				}
				break;

			case this.vKey == 104 && this.keyStatus == 1: //num8
				if (this.num == 2) {
					this.clear();
					setTimeout(() => {
						this.num8 = "waves1_1" + this.funcSet;
						this.LtoR1 = "waves2_1" + this.funcSet;
						this.LtoR2 = "waves3_1" + this.funcSet;
						this.LtoR3 = "waves4_1" + this.funcSet;
						this.LtoR4 = "waves5_1" + this.funcSet;
						this.LtoR5 = "waves6_1" + this.funcSet;
						this.LtoR6 = "waves7_1" + this.funcSet;
						this.LtoR7 = "waves8_1" + this.funcSet;
						this.LtoR8 = "waves9_1" + this.funcSet;
						this.LtoR9 = "waves10_1" + this.funcSet;
						this.LtoR10 = "waves9_1" + this.funcSet;
					}, 10);
					this.num = 3
				}
				else if (this.num == 3) {
					this.clear2();
					setTimeout(() => {
						this.num8_2 = "waves1_2" + this.funcSet;
						this.LtoR1_2 = "waves2_2" + this.funcSet;
						this.LtoR2_2 = "waves3_2" + this.funcSet;
						this.LtoR3_2 = "waves4_2" + this.funcSet;
						this.LtoR4_2 = "waves5_2" + this.funcSet;
						this.LtoR5_2 = "waves6_2" + this.funcSet;
						this.LtoR6_2 = "waves7_2" + this.funcSet;
						this.LtoR7_2 = "waves8_2" + this.funcSet;
						this.LtoR8_2 = "waves9_2" + this.funcSet;
						this.LtoR9_2 = "waves10_2" + this.funcSet;
						this.LtoR10_2 = "waves9_2" + this.funcSet;
					}, 10)
					this.num = 2
				}
				break;

			case this.vKey == 105 && this.keyStatus == 1: //num9
				if (this.num == 2) {
					this.clear();
					setTimeout(() => {
						this.num9 = "waves1_1" + this.funcSet;
						this.LtoR1 = "waves2_1" + this.funcSet;
						this.LtoR2 = "waves3_1" + this.funcSet;
						this.LtoR3 = "waves4_1" + this.funcSet;
						this.LtoR4 = "waves5_1" + this.funcSet;
						this.LtoR5 = "waves6_1" + this.funcSet;
						this.LtoR6 = "waves7_1" + this.funcSet;
						this.LtoR7 = "waves8_1" + this.funcSet;
						this.LtoR8 = "waves9_1" + this.funcSet;
						this.LtoR9 = "waves10_1" + this.funcSet;
						this.LtoR10 = "waves11_1" + this.funcSet;
					}, 10);
					this.num = 3
				}
				else if (this.num == 3) {
					this.clear2();
					setTimeout(() => {
						this.num9_2 = "waves1_2" + this.funcSet;
						this.LtoR1_2 = "waves2_2" + this.funcSet;
						this.LtoR2_2 = "waves3_2" + this.funcSet;
						this.LtoR3_2 = "waves4_2" + this.funcSet;
						this.LtoR4_2 = "waves5_2" + this.funcSet;
						this.LtoR5_2 = "waves6_2" + this.funcSet;
						this.LtoR6_2 = "waves7_2" + this.funcSet;
						this.LtoR7_2 = "waves8_2" + this.funcSet;
						this.LtoR8_2 = "waves9_2" + this.funcSet;
						this.LtoR9_2 = "waves10_2" + this.funcSet;
						this.LtoR10_2 = "waves11_2" + this.funcSet;
					}, 10)
					this.num = 2
				}
				break;

			case this.vKey == 107 && this.keyStatus == 1: //numplus
				if (this.num == 2) {
					this.clear();
					setTimeout(() => {
						this.numplus = "waves1_1" + this.funcSet;
						this.LtoR1 = "waves2_1" + this.funcSet;
						this.LtoR2 = "waves3_1" + this.funcSet;
						this.LtoR3 = "waves4_1" + this.funcSet;
						this.LtoR4 = "waves5_1" + this.funcSet;
						this.LtoR5 = "waves6_1" + this.funcSet;
						this.LtoR6 = "waves7_1" + this.funcSet;
						this.LtoR7 = "waves8_1" + this.funcSet;
						this.LtoR8 = "waves9_1" + this.funcSet;
						this.LtoR9 = "waves10_1" + this.funcSet;
						this.LtoR10 = "waves11_1" + this.funcSet;
					}, 10);
					this.num = 3
				}
				else if (this.num == 3) {
					this.clear2();
					setTimeout(() => {
						this.numplus_2 = "waves1_2" + this.funcSet;
						this.LtoR1_2 = "waves2_2" + this.funcSet;
						this.LtoR2_2 = "waves3_2" + this.funcSet;
						this.LtoR3_2 = "waves4_2" + this.funcSet;
						this.LtoR4_2 = "waves5_2" + this.funcSet;
						this.LtoR5_2 = "waves6_2" + this.funcSet;
						this.LtoR6_2 = "waves7_2" + this.funcSet;
						this.LtoR7_2 = "waves8_2" + this.funcSet;
						this.LtoR8_2 = "waves9_2" + this.funcSet;
						this.LtoR9_2 = "waves10_2" + this.funcSet;
						this.LtoR10_2 = "waves11_2" + this.funcSet;
					}, 10)
					this.num = 2
				}
				break;

			case this.vKey == 20 && this.keyStatus == 1: //caps
				if (this.num == 2) {
					this.clear();
					setTimeout(() => {
						this.caps = "waves1_1" + this.funcSet;
						this.LtoR1 = "waves11_1" + this.funcSet;
						this.LtoR2 = "waves10_1" + this.funcSet;
						this.LtoR3 = "waves9_1" + this.funcSet;
						this.LtoR4 = "waves8_1" + this.funcSet;
						this.LtoR5 = "waves7_1" + this.funcSet;
						this.LtoR6 = "waves6_1" + this.funcSet;
						this.LtoR7 = "waves5_1" + this.funcSet;
						this.LtoR8 = "waves4_1" + this.funcSet;
						this.LtoR9 = "waves3_1" + this.funcSet;
						this.LtoR10 = "waves2_1" + this.funcSet;
					}, 10);
					this.num = 3
				}
				else if (this.num == 3) {
					this.clear2();
					setTimeout(() => {
						this.caps_2 = "waves1_2" + this.funcSet;
						this.LtoR1_2 = "waves11_2" + this.funcSet;
						this.LtoR2_2 = "waves10_2" + this.funcSet;
						this.LtoR3_2 = "waves9_2" + this.funcSet;
						this.LtoR4_2 = "waves8_2" + this.funcSet;
						this.LtoR5_2 = "waves7_2" + this.funcSet;
						this.LtoR6_2 = "waves6_2" + this.funcSet;
						this.LtoR7_2 = "waves5_2" + this.funcSet;
						this.LtoR8_2 = "waves4_2" + this.funcSet;
						this.LtoR9_2 = "waves3_2" + this.funcSet;
						this.LtoR10_2 = "waves2_2" + this.funcSet;
					}, 10)
					this.num = 2
				}
				break;

			case this.vKey == 65 && this.keyStatus == 1: //A
				if (this.num == 2) {
					this.clear();
					setTimeout(() => {
						this.a = "waves1_1" + this.funcSet;
						this.LtoR1 = "waves11_1" + this.funcSet;
						this.LtoR2 = "waves10_1" + this.funcSet;
						this.LtoR3 = "waves9_1" + this.funcSet;
						this.LtoR4 = "waves8_1" + this.funcSet;
						this.LtoR5 = "waves7_1" + this.funcSet;
						this.LtoR6 = "waves6_1" + this.funcSet;
						this.LtoR7 = "waves5_1" + this.funcSet;
						this.LtoR8 = "waves4_1" + this.funcSet;
						this.LtoR9 = "waves3_1" + this.funcSet;
						this.LtoR10 = "waves2_1" + this.funcSet;
					}, 10);
					this.num = 3
				}
				else if (this.num == 3) {
					this.clear2();
					setTimeout(() => {
						this.a_2 = "waves1_2" + this.funcSet;
						this.LtoR1_2 = "waves11_2" + this.funcSet;
						this.LtoR2_2 = "waves10_2" + this.funcSet;
						this.LtoR3_2 = "waves9_2" + this.funcSet;
						this.LtoR4_2 = "waves8_2" + this.funcSet;
						this.LtoR5_2 = "waves7_2" + this.funcSet;
						this.LtoR6_2 = "waves6_2" + this.funcSet;
						this.LtoR7_2 = "waves5_2" + this.funcSet;
						this.LtoR8_2 = "waves4_2" + this.funcSet;
						this.LtoR9_2 = "waves3_2" + this.funcSet;
						this.LtoR10_2 = "waves2_2" + this.funcSet;
					}, 10)
					this.num = 2
				}
				break;

			case this.vKey == 83 && this.keyStatus == 1: //s
				if (this.num == 2) {
					this.clear();
					setTimeout(() => {
						this.s = "waves1_1" + this.funcSet;
						this.LtoR1 = "waves9_1" + this.funcSet;
						this.LtoR2 = "waves10_1" + this.funcSet;
						this.LtoR3 = "waves9_1" + this.funcSet;
						this.LtoR4 = "waves8_1" + this.funcSet;
						this.LtoR5 = "waves7_1" + this.funcSet;
						this.LtoR6 = "waves6_1" + this.funcSet;
						this.LtoR7 = "waves5_1" + this.funcSet;
						this.LtoR8 = "waves4_1" + this.funcSet;
						this.LtoR9 = "waves3_1" + this.funcSet;
						this.LtoR10 = "waves2_1" + this.funcSet;
					}, 10);
					this.num = 3
				}
				else if (this.num == 3) {
					this.clear2();
					setTimeout(() => {
						this.s_2 = "waves1_2" + this.funcSet;
						this.LtoR1_2 = "waves9_2" + this.funcSet;
						this.LtoR2_2 = "waves10_2" + this.funcSet;
						this.LtoR3_2 = "waves9_2" + this.funcSet;
						this.LtoR4_2 = "waves8_2" + this.funcSet;
						this.LtoR5_2 = "waves7_2" + this.funcSet;
						this.LtoR6_2 = "waves6_2" + this.funcSet;
						this.LtoR7_2 = "waves5_2" + this.funcSet;
						this.LtoR8_2 = "waves4_2" + this.funcSet;
						this.LtoR9_2 = "waves3_2" + this.funcSet;
						this.LtoR10_2 = "waves2_2" + this.funcSet;
					}, 10)
					this.num = 2
				}
				break;

			case this.vKey == 68 && this.keyStatus == 1: //d
				if (this.num == 2) {
					this.clear();
					setTimeout(() => {
						this.d = "waves1_1" + this.funcSet;
						this.LtoR1 = "waves9_1" + this.funcSet;
						this.LtoR2 = "waves10_1" + this.funcSet;
						this.LtoR3 = "waves9_1" + this.funcSet;
						this.LtoR4 = "waves8_1" + this.funcSet;
						this.LtoR5 = "waves7_1" + this.funcSet;
						this.LtoR6 = "waves6_1" + this.funcSet;
						this.LtoR7 = "waves5_1" + this.funcSet;
						this.LtoR8 = "waves4_1" + this.funcSet;
						this.LtoR9 = "waves3_1" + this.funcSet;
						this.LtoR10 = "waves2_1" + this.funcSet;
					}, 10);
					this.num = 3
				}
				else if (this.num == 3) {
					this.clear2();
					setTimeout(() => {
						this.d_2 = "waves1_2" + this.funcSet;
						this.LtoR1_2 = "waves9_2" + this.funcSet;
						this.LtoR2_2 = "waves10_2" + this.funcSet;
						this.LtoR3_2 = "waves9_2" + this.funcSet;
						this.LtoR4_2 = "waves8_2" + this.funcSet;
						this.LtoR5_2 = "waves7_2" + this.funcSet;
						this.LtoR6_2 = "waves6_2" + this.funcSet;
						this.LtoR7_2 = "waves5_2" + this.funcSet;
						this.LtoR8_2 = "waves4_2" + this.funcSet;
						this.LtoR9_2 = "waves3_2" + this.funcSet;
						this.LtoR10_2 = "waves2_2" + this.funcSet;
					}, 10)
					this.num = 2
				}
				break;

			case this.vKey == 70 && this.keyStatus == 1: //f
				if (this.num == 2) {
					this.clear();
					setTimeout(() => {
						this.f = "waves1_1" + this.funcSet;
						this.LtoR1 = "waves7_1" + this.funcSet;
						this.LtoR2 = "waves8_1" + this.funcSet;
						this.LtoR3 = "waves9_1" + this.funcSet;
						this.LtoR4 = "waves8_1" + this.funcSet;
						this.LtoR5 = "waves7_1" + this.funcSet;
						this.LtoR6 = "waves6_1" + this.funcSet;
						this.LtoR7 = "waves5_1" + this.funcSet;
						this.LtoR8 = "waves4_1" + this.funcSet;
						this.LtoR9 = "waves3_1" + this.funcSet;
						this.LtoR10 = "waves2_1" + this.funcSet;
					}, 10);
					this.num = 3
				}
				else if (this.num == 3) {
					this.clear2();
					setTimeout(() => {
						this.f_2 = "waves1_2" + this.funcSet;
						this.LtoR1_2 = "waves7_2" + this.funcSet;
						this.LtoR2_2 = "waves8_2" + this.funcSet;
						this.LtoR3_2 = "waves9_2" + this.funcSet;
						this.LtoR4_2 = "waves8_2" + this.funcSet;
						this.LtoR5_2 = "waves7_2" + this.funcSet;
						this.LtoR6_2 = "waves6_2" + this.funcSet;
						this.LtoR7_2 = "waves5_2" + this.funcSet;
						this.LtoR8_2 = "waves4_2" + this.funcSet;
						this.LtoR9_2 = "waves3_2" + this.funcSet;
						this.LtoR10_2 = "waves2_2" + this.funcSet;
					}, 10)
					this.num = 2
				}
				break;

			case this.vKey == 71 && this.keyStatus == 1: //g
				if (this.num == 2) {
					this.clear();
					setTimeout(() => {
						this.g = "waves1_1" + this.funcSet;
						this.LtoR1 = "waves7_1" + this.funcSet;
						this.LtoR2 = "waves8_1" + this.funcSet;
						this.LtoR3 = "waves9_1" + this.funcSet;
						this.LtoR4 = "waves8_1" + this.funcSet;
						this.LtoR5 = "waves7_1" + this.funcSet;
						this.LtoR6 = "waves6_1" + this.funcSet;
						this.LtoR7 = "waves5_1" + this.funcSet;
						this.LtoR8 = "waves4_1" + this.funcSet;
						this.LtoR9 = "waves3_1" + this.funcSet;
						this.LtoR10 = "waves2_1" + this.funcSet;
					}, 10);
					this.num = 3
				}
				else if (this.num == 3) {
					this.clear2();
					setTimeout(() => {
						this.g_2 = "waves1_2" + this.funcSet;
						this.LtoR1_2 = "waves7_2" + this.funcSet;
						this.LtoR2_2 = "waves8_2" + this.funcSet;
						this.LtoR3_2 = "waves9_2" + this.funcSet;
						this.LtoR4_2 = "waves8_2" + this.funcSet;
						this.LtoR5_2 = "waves7_2" + this.funcSet;
						this.LtoR6_2 = "waves6_2" + this.funcSet;
						this.LtoR7_2 = "waves5_2" + this.funcSet;
						this.LtoR8_2 = "waves4_2" + this.funcSet;
						this.LtoR9_2 = "waves3_2" + this.funcSet;
						this.LtoR10_2 = "waves2_2" + this.funcSet;
					}, 10)
					this.num = 2
				}

				break;

			case this.vKey == 72 && this.keyStatus == 1: //h
				if (this.num == 2) {
					this.clear();
					setTimeout(() => {
						this.h = "waves1_1" + this.funcSet;
						this.LtoR1 = "waves5_1" + this.funcSet;
						this.LtoR2 = "waves6_1" + this.funcSet;
						this.LtoR3 = "waves7_1" + this.funcSet;
						this.LtoR4 = "waves8_1" + this.funcSet;
						this.LtoR5 = "waves7_1" + this.funcSet;
						this.LtoR6 = "waves6_1" + this.funcSet;
						this.LtoR7 = "waves5_1" + this.funcSet;
						this.LtoR8 = "waves4_1" + this.funcSet;
						this.LtoR9 = "waves3_1" + this.funcSet;
						this.LtoR10 = "waves2_1" + this.funcSet;
					}, 10);
					this.num = 3
				}
				else if (this.num == 3) {
					this.clear2();
					setTimeout(() => {
						this.h = "waves1_1" + this.funcSet;
						this.LtoR1_2 = "waves5_2" + this.funcSet;
						this.LtoR2_2 = "waves6_2" + this.funcSet;
						this.LtoR3_2 = "waves7_2" + this.funcSet;
						this.LtoR4_2 = "waves8_2" + this.funcSet;
						this.LtoR5_2 = "waves7_2" + this.funcSet;
						this.LtoR6_2 = "waves6_2" + this.funcSet;
						this.LtoR7_2 = "waves5_2" + this.funcSet;
						this.LtoR8_2 = "waves4_2" + this.funcSet;
						this.LtoR9_2 = "waves3_2" + this.funcSet;
						this.LtoR10_2 = "waves2_2" + this.funcSet;
					}, 10)
					this.num = 2
				}
				break;

			case this.vKey == 74 && this.keyStatus == 1: //j
				if (this.num == 2) {
					this.clear();
					setTimeout(() => {
						this.j = "waves1_1" + this.funcSet;
						this.LtoR1 = "waves5_1" + this.funcSet;
						this.LtoR2 = "waves6_1" + this.funcSet;
						this.LtoR3 = "waves7_1" + this.funcSet;
						this.LtoR4 = "waves8_1" + this.funcSet;
						this.LtoR5 = "waves7_1" + this.funcSet;
						this.LtoR6 = "waves6_1" + this.funcSet;
						this.LtoR7 = "waves5_1" + this.funcSet;
						this.LtoR8 = "waves4_1" + this.funcSet;
						this.LtoR9 = "waves3_1" + this.funcSet;
						this.LtoR10 = "waves2_1" + this.funcSet;
					}, 10);
					this.num = 3
				}
				else if (this.num == 3) {
					this.clear2();
					setTimeout(() => {
						this.j_2 = "waves1_2" + this.funcSet;
						this.LtoR1_2 = "waves5_2" + this.funcSet;
						this.LtoR2_2 = "waves6_2" + this.funcSet;
						this.LtoR3_2 = "waves7_2" + this.funcSet;
						this.LtoR4_2 = "waves8_2" + this.funcSet;
						this.LtoR5_2 = "waves7_2" + this.funcSet;
						this.LtoR6_2 = "waves6_2" + this.funcSet;
						this.LtoR7_2 = "waves5_2" + this.funcSet;
						this.LtoR8_2 = "waves4_2" + this.funcSet;
						this.LtoR9_2 = "waves3_2" + this.funcSet;
						this.LtoR10_2 = "waves2_2" + this.funcSet;
					}, 10)
					this.num = 2
				}
				break;

			case this.vKey == 75 && this.keyStatus == 1: //k 
				if (this.num == 2) {
					this.clear();
					setTimeout(() => {
						this.k = "waves1_1" + this.funcSet;
						this.LtoR1 = "waves3_1" + this.funcSet;
						this.LtoR2 = "waves4_1" + this.funcSet;
						this.LtoR3 = "waves5_1" + this.funcSet;
						this.LtoR4 = "waves6_1" + this.funcSet;
						this.LtoR5 = "waves7_1" + this.funcSet;
						this.LtoR6 = "waves6_1" + this.funcSet;
						this.LtoR7 = "waves5_1" + this.funcSet;
						this.LtoR8 = "waves4_1" + this.funcSet;
						this.LtoR9 = "waves3_1" + this.funcSet;
						this.LtoR10 = "waves2_1" + this.funcSet;
					}, 10);
					this.num = 3
				}
				else if (this.num == 3) {
					this.clear2();
					setTimeout(() => {
						this.k_2 = "waves1_2" + this.funcSet;
						this.LtoR1_2 = "waves3_2" + this.funcSet;
						this.LtoR2_2 = "waves4_2" + this.funcSet;
						this.LtoR3_2 = "waves5_2" + this.funcSet;
						this.LtoR4_2 = "waves6_2" + this.funcSet;
						this.LtoR5_2 = "waves7_2" + this.funcSet;
						this.LtoR6_2 = "waves6_2" + this.funcSet;
						this.LtoR7_2 = "waves5_2" + this.funcSet;
						this.LtoR8_2 = "waves4_2" + this.funcSet;
						this.LtoR9_2 = "waves3_2" + this.funcSet;
						this.LtoR10_2 = "waves2_2" + this.funcSet;
					}, 10)
					this.num = 2
				}
				break;

			case this.vKey == 76 && this.keyStatus == 1: //l
				if (this.num == 2) {
					this.clear();
					setTimeout(() => {
						this.l = "waves1_1" + this.funcSet;
						this.LtoR1 = "waves3_1" + this.funcSet;
						this.LtoR2 = "waves4_1" + this.funcSet;
						this.LtoR3 = "waves5_1" + this.funcSet;
						this.LtoR4 = "waves6_1" + this.funcSet;
						this.LtoR5 = "waves7_1" + this.funcSet;
						this.LtoR6 = "waves6_1" + this.funcSet;
						this.LtoR7 = "waves5_1" + this.funcSet;
						this.LtoR8 = "waves4_1" + this.funcSet;
						this.LtoR9 = "waves3_1" + this.funcSet;
						this.LtoR10 = "waves2_1" + this.funcSet;
					}, 10);
					this.num = 3
				}
				else if (this.num == 3) {
					this.clear2();
					setTimeout(() => {
						this.l_2 = "waves1_2" + this.funcSet;
						this.LtoR1_2 = "waves3_2" + this.funcSet;
						this.LtoR2_2 = "waves4_2" + this.funcSet;
						this.LtoR3_2 = "waves5_2" + this.funcSet;
						this.LtoR4_2 = "waves6_2" + this.funcSet;
						this.LtoR5_2 = "waves7_2" + this.funcSet;
						this.LtoR6_2 = "waves6_2" + this.funcSet;
						this.LtoR7_2 = "waves5_2" + this.funcSet;
						this.LtoR8_2 = "waves4_2" + this.funcSet;
						this.LtoR9_2 = "waves3_2" + this.funcSet;
						this.LtoR10_2 = "waves2_2" + this.funcSet;
					}, 10)
					this.num = 2
				}
				break;

			case this.vKey == 186 && this.keyStatus == 1: //sem
				if (this.num == 2) {
					this.clear();
					setTimeout(() => {
						this.sem = "waves1_1" + this.funcSet;
						this.LtoR1 = "waves2_1" + this.funcSet;
						this.LtoR2 = "waves3_1" + this.funcSet;
						this.LtoR3 = "waves4_1" + this.funcSet;
						this.LtoR4 = "waves5_1" + this.funcSet;
						this.LtoR5 = "waves6_1" + this.funcSet;
						this.LtoR6 = "waves7_1" + this.funcSet;
						this.LtoR7 = "waves6_1" + this.funcSet;
						this.LtoR8 = "waves5_1" + this.funcSet;
						this.LtoR9 = "waves4_1" + this.funcSet;
						this.LtoR10 = "waves3_1" + this.funcSet;
					}, 10);
					this.num = 3
				}
				else if (this.num == 3) {
					this.clear2();
					setTimeout(() => {
						this.sem_2 = "waves1_2" + this.funcSet;
						this.LtoR1_2 = "waves2_2" + this.funcSet;
						this.LtoR2_2 = "waves3_2" + this.funcSet;
						this.LtoR3_2 = "waves4_2" + this.funcSet;
						this.LtoR4_2 = "waves5_2" + this.funcSet;
						this.LtoR5_2 = "waves6_2" + this.funcSet;
						this.LtoR6_2 = "waves7_2" + this.funcSet;
						this.LtoR7_2 = "waves6_2" + this.funcSet;
						this.LtoR8_2 = "waves5_2" + this.funcSet;
						this.LtoR9_2 = "waves4_2" + this.funcSet;
						this.LtoR10_2 = "waves3_2" + this.funcSet;
					}, 10)
					this.num = 2
				}
				break;

			case this.vKey == 222 && this.keyStatus == 1: //quo
				if (this.num == 2) {
					this.clear();
					setTimeout(() => {
						this.quo = "waves1_1" + this.funcSet;
						this.LtoR1 = "waves2_1" + this.funcSet;
						this.LtoR2 = "waves3_1" + this.funcSet;
						this.LtoR3 = "waves4_1" + this.funcSet;
						this.LtoR4 = "waves5_1" + this.funcSet;
						this.LtoR5 = "waves6_1" + this.funcSet;
						this.LtoR6 = "waves7_1" + this.funcSet;
						this.LtoR7 = "waves6_1" + this.funcSet;
						this.LtoR8 = "waves5_1" + this.funcSet;
						this.LtoR9 = "waves4_1" + this.funcSet;
						this.LtoR10 = "waves3_1" + this.funcSet;
					}, 10);
					this.num = 3
				}
				else if (this.num == 3) {
					this.clear2();
					setTimeout(() => {
						this.quo_2 = "waves1_2" + this.funcSet;
						this.LtoR1_2 = "waves2_2" + this.funcSet;
						this.LtoR2_2 = "waves3_2" + this.funcSet;
						this.LtoR3_2 = "waves4_2" + this.funcSet;
						this.LtoR4_2 = "waves5_2" + this.funcSet;
						this.LtoR5_2 = "waves6_2" + this.funcSet;
						this.LtoR6_2 = "waves7_2" + this.funcSet;
						this.LtoR7_2 = "waves6_2" + this.funcSet;
						this.LtoR8_2 = "waves5_2" + this.funcSet;
						this.LtoR9_2 = "waves4_2" + this.funcSet;
						this.LtoR10_2 = "waves3_2" + this.funcSet;
					}, 10)
					this.num = 2
				}
				break;
			case this.vKey == 13 && this.keyStatus == 1: //enter
				if (this.num == 2) {
					this.clear();
					setTimeout(() => {
						this.enter = "waves1_1" + this.funcSet;
						this.LtoR1 = "waves2_1" + this.funcSet;
						this.LtoR2 = "waves3_1" + this.funcSet;
						this.LtoR3 = "waves4_1" + this.funcSet;
						this.LtoR4 = "waves5_1" + this.funcSet;
						this.LtoR5 = "waves6_1" + this.funcSet;
						this.LtoR6 = "waves7_1" + this.funcSet;
						this.LtoR7 = "waves8_1" + this.funcSet;
						this.LtoR8 = "waves7_1" + this.funcSet;
						this.LtoR9 = "waves6_1" + this.funcSet;
						this.LtoR10 = "waves5_1" + this.funcSet;
					}, 10);
					this.num = 3
				}
				else if (this.num == 3) {
					this.clear2();
					setTimeout(() => {
						this.enter = "waves1_1" + this.funcSet;
						this.LtoR1_2 = "waves2_2" + this.funcSet;
						this.LtoR2_2 = "waves3_2" + this.funcSet;
						this.LtoR3_2 = "waves4_2" + this.funcSet;
						this.LtoR4_2 = "waves5_2" + this.funcSet;
						this.LtoR5_2 = "waves6_2" + this.funcSet;
						this.LtoR6_2 = "waves7_2" + this.funcSet;
						this.LtoR7_2 = "waves8_2" + this.funcSet;
						this.LtoR8_2 = "waves7_2" + this.funcSet;
						this.LtoR9_2 = "waves6_2" + this.funcSet;
						this.LtoR10_2 = "waves5_2" + this.funcSet;
					}, 10)
					this.num = 2
				}
				break;

			case this.vKey == 100 && this.keyStatus == 1: //num4
				if (this.num == 2) {
					this.clear();
					setTimeout(() => {
						this.num4 = "waves1_1" + this.funcSet;
						this.LtoR1 = "waves2_1" + this.funcSet;
						this.LtoR2 = "waves3_1" + this.funcSet;
						this.LtoR3 = "waves4_1" + this.funcSet;
						this.LtoR4 = "waves5_1" + this.funcSet;
						this.LtoR5 = "waves6_1" + this.funcSet;
						this.LtoR6 = "waves7_1" + this.funcSet;
						this.LtoR7 = "waves8_1" + this.funcSet;
						this.LtoR8 = "waves9_1" + this.funcSet;
						this.LtoR9 = "waves10_1" + this.funcSet;
						this.LtoR10 = "waves9_1" + this.funcSet;
					}, 10);
					this.num = 3
				}
				else if (this.num == 3) {
					this.clear2();
					setTimeout(() => {
						this.num4_2 = "waves1_2" + this.funcSet;
						this.LtoR1_2 = "waves2_2" + this.funcSet;
						this.LtoR2_2 = "waves3_2" + this.funcSet;
						this.LtoR3_2 = "waves4_2" + this.funcSet;
						this.LtoR4_2 = "waves5_2" + this.funcSet;
						this.LtoR5_2 = "waves6_2" + this.funcSet;
						this.LtoR6_2 = "waves7_2" + this.funcSet;
						this.LtoR7_2 = "waves8_2" + this.funcSet;
						this.LtoR8_2 = "waves9_2" + this.funcSet;
						this.LtoR9_2 = "waves10_2" + this.funcSet;
						this.LtoR10_2 = "waves9_2" + this.funcSet;
					}, 10)
					this.num = 2
				}
				break;

			case this.vKey == 101 && this.keyStatus == 1: //num5
				if (this.num == 2) {
					this.clear();
					setTimeout(() => {
						this.num5 = "waves1_1" + this.funcSet;
						this.LtoR1 = "waves2_1" + this.funcSet;
						this.LtoR2 = "waves3_1" + this.funcSet;
						this.LtoR3 = "waves4_1" + this.funcSet;
						this.LtoR4 = "waves5_1" + this.funcSet;
						this.LtoR5 = "waves6_1" + this.funcSet;
						this.LtoR6 = "waves7_1" + this.funcSet;
						this.LtoR7 = "waves8_1" + this.funcSet;
						this.LtoR8 = "waves9_1" + this.funcSet;
						this.LtoR9 = "waves10_1" + this.funcSet;
						this.LtoR10 = "waves9_1" + this.funcSet;
					}, 10);
					this.num = 3
				}
				else if (this.num == 3) {
					this.clear2();
					setTimeout(() => {
						this.num5_2 = "waves1_2" + this.funcSet;
						this.LtoR1_2 = "waves2_2" + this.funcSet;
						this.LtoR2_2 = "waves3_2" + this.funcSet;
						this.LtoR3_2 = "waves4_2" + this.funcSet;
						this.LtoR4_2 = "waves5_2" + this.funcSet;
						this.LtoR5_2 = "waves6_2" + this.funcSet;
						this.LtoR6_2 = "waves7_2" + this.funcSet;
						this.LtoR7_2 = "waves8_2" + this.funcSet;
						this.LtoR8_2 = "waves9_2" + this.funcSet;
						this.LtoR9_2 = "waves10_2" + this.funcSet;
						this.LtoR10_2 = "waves9_2" + this.funcSet;
					}, 10)
					this.num = 2
				}
				break;

			case this.vKey == 102 && this.keyStatus == 1: //num6
				if (this.num == 2) {
					this.clear();
					setTimeout(() => {
						this.num6 = "waves1_1" + this.funcSet;
						this.LtoR1 = "waves2_1" + this.funcSet;
						this.LtoR2 = "waves3_1" + this.funcSet;
						this.LtoR3 = "waves4_1" + this.funcSet;
						this.LtoR4 = "waves5_1" + this.funcSet;
						this.LtoR5 = "waves6_1" + this.funcSet;
						this.LtoR6 = "waves7_1" + this.funcSet;
						this.LtoR7 = "waves8_1" + this.funcSet;
						this.LtoR8 = "waves9_1" + this.funcSet;
						this.LtoR9 = "waves10_1" + this.funcSet;
						this.LtoR10 = "waves11_1" + this.funcSet;
					}, 10);
					this.num = 3
				}
				else if (this.num == 3) {
					this.clear2();
					setTimeout(() => {
						this.num6_2 = "waves1_2" + this.funcSet;
						this.LtoR1_2 = "waves2_2" + this.funcSet;
						this.LtoR2_2 = "waves3_2" + this.funcSet;
						this.LtoR3_2 = "waves4_2" + this.funcSet;
						this.LtoR4_2 = "waves5_2" + this.funcSet;
						this.LtoR5_2 = "waves6_2" + this.funcSet;
						this.LtoR6_2 = "waves7_2" + this.funcSet;
						this.LtoR7_2 = "waves8_2" + this.funcSet;
						this.LtoR8_2 = "waves9_2" + this.funcSet;
						this.LtoR9_2 = "waves10_2" + this.funcSet;
						this.LtoR10_2 = "waves11_2" + this.funcSet;
					}, 10)
					this.num = 2
				}
				break;
			case this.vKey == 'l16' && this.keyStatus == 1: //lshift
				if (this.num == 2) {
					this.clear();
					setTimeout(() => {
						this.lshift = "waves1_1" + this.funcSet;
						this.LtoR1 = "waves11_1" + this.funcSet;
						this.LtoR2 = "waves10_1" + this.funcSet;
						this.LtoR3 = "waves9_1" + this.funcSet;
						this.LtoR4 = "waves8_1" + this.funcSet;
						this.LtoR5 = "waves7_1" + this.funcSet;
						this.LtoR6 = "waves6_1" + this.funcSet;
						this.LtoR7 = "waves5_1" + this.funcSet;
						this.LtoR8 = "waves4_1" + this.funcSet;
						this.LtoR9 = "waves3_1" + this.funcSet;
						this.LtoR10 = "waves2_1" + this.funcSet;
					}, 10);
					this.num = 3
				}
				else if (this.num == 3) {
					this.clear2();
					setTimeout(() => {
						this.lshift_2 = "waves1_2" + this.funcSet;
						this.LtoR1_2 = "waves11_2" + this.funcSet;
						this.LtoR2_2 = "waves10_2" + this.funcSet;
						this.LtoR3_2 = "waves9_2" + this.funcSet;
						this.LtoR4_2 = "waves8_2" + this.funcSet;
						this.LtoR5_2 = "waves7_2" + this.funcSet;
						this.LtoR6_2 = "waves6_2" + this.funcSet;
						this.LtoR7_2 = "waves5_2" + this.funcSet;
						this.LtoR8_2 = "waves4_2" + this.funcSet;
						this.LtoR9_2 = "waves3_2" + this.funcSet;
						this.LtoR10_2 = "waves2_2" + this.funcSet;
					}, 10)
					this.num = 2
				}
				break;

			case this.vKey == 90 && this.keyStatus == 1: //z
				if (this.num == 2) {
					this.clear();
					setTimeout(() => {
						this.z = "waves1_1" + this.funcSet;
						this.LtoR1 = "waves9_1" + this.funcSet;
						this.LtoR2 = "waves10_1" + this.funcSet;
						this.LtoR3 = "waves9_1" + this.funcSet;
						this.LtoR4 = "waves8_1" + this.funcSet;
						this.LtoR5 = "waves7_1" + this.funcSet;
						this.LtoR6 = "waves6_1" + this.funcSet;
						this.LtoR7 = "waves5_1" + this.funcSet;
						this.LtoR8 = "waves4_1" + this.funcSet;
						this.LtoR9 = "waves3_1" + this.funcSet;
						this.LtoR10 = "waves2_1" + this.funcSet;
					}, 10);
					this.num = 3
				}
				else if (this.num == 3) {
					this.clear2();
					setTimeout(() => {
						this.z_2 = "waves1_2" + this.funcSet;
						this.LtoR1_2 = "waves9_2" + this.funcSet;
						this.LtoR2_2 = "waves10_2" + this.funcSet;
						this.LtoR3_2 = "waves9_2" + this.funcSet;
						this.LtoR4_2 = "waves8_2" + this.funcSet;
						this.LtoR5_2 = "waves7_2" + this.funcSet;
						this.LtoR6_2 = "waves6_2" + this.funcSet;
						this.LtoR7_2 = "waves5_2" + this.funcSet;
						this.LtoR8_2 = "waves4_2" + this.funcSet;
						this.LtoR9_2 = "waves3_2" + this.funcSet;
						this.LtoR10_2 = "waves2_2" + this.funcSet;
					}, 10)
					this.num = 2
				}
				break;

			case this.vKey == 88 && this.keyStatus == 1: //x
				if (this.num == 2) {
					this.clear();
					setTimeout(() => {
						this.x = "waves1_1" + this.funcSet;
						this.LtoR1 = "waves9_1" + this.funcSet;
						this.LtoR2 = "waves10_1" + this.funcSet;
						this.LtoR3 = "waves9_1" + this.funcSet;
						this.LtoR4 = "waves8_1" + this.funcSet;
						this.LtoR5 = "waves7_1" + this.funcSet;
						this.LtoR6 = "waves6_1" + this.funcSet;
						this.LtoR7 = "waves5_1" + this.funcSet;
						this.LtoR8 = "waves4_1" + this.funcSet;
						this.LtoR9 = "waves3_1" + this.funcSet;
						this.LtoR10 = "waves2_1" + this.funcSet;
					}, 10);
					this.num = 3
				}
				else if (this.num == 3) {
					this.clear2();
					setTimeout(() => {
						this.x_2 = "waves1_2" + this.funcSet;
						this.LtoR1_2 = "waves9_2" + this.funcSet;
						this.LtoR2_2 = "waves10_2" + this.funcSet;
						this.LtoR3_2 = "waves9_2" + this.funcSet;
						this.LtoR4_2 = "waves8_2" + this.funcSet;
						this.LtoR5_2 = "waves7_2" + this.funcSet;
						this.LtoR6_2 = "waves6_2" + this.funcSet;
						this.LtoR7_2 = "waves5_2" + this.funcSet;
						this.LtoR8_2 = "waves4_2" + this.funcSet;
						this.LtoR9_2 = "waves3_2" + this.funcSet;
						this.LtoR10_2 = "waves2_2" + this.funcSet;
					}, 10)
					this.num = 2
				}
				break;

			case this.vKey == 67 && this.keyStatus == 1: //c
				if (this.num == 2) {
					this.clear();
					setTimeout(() => {
						this.c = "waves1_1" + this.funcSet;
						this.LtoR1 = "waves7_1" + this.funcSet;
						this.LtoR2 = "waves8_1" + this.funcSet;
						this.LtoR3 = "waves9_1" + this.funcSet;
						this.LtoR4 = "waves8_1" + this.funcSet;
						this.LtoR5 = "waves7_1" + this.funcSet;
						this.LtoR6 = "waves6_1" + this.funcSet;
						this.LtoR7 = "waves5_1" + this.funcSet;
						this.LtoR8 = "waves4_1" + this.funcSet;
						this.LtoR9 = "waves3_1" + this.funcSet;
						this.LtoR10 = "waves2_1" + this.funcSet;
					}, 10);
					this.num = 3
				}
				else if (this.num == 3) {
					this.clear2();
					setTimeout(() => {
						this.c_2 = "waves1_2" + this.funcSet;
						this.LtoR1_2 = "waves7_2" + this.funcSet;
						this.LtoR2_2 = "waves8_2" + this.funcSet;
						this.LtoR3_2 = "waves9_2" + this.funcSet;
						this.LtoR4_2 = "waves8_2" + this.funcSet;
						this.LtoR5_2 = "waves7_2" + this.funcSet;
						this.LtoR6_2 = "waves6_2" + this.funcSet;
						this.LtoR7_2 = "waves5_2" + this.funcSet;
						this.LtoR8_2 = "waves4_2" + this.funcSet;
						this.LtoR9_2 = "waves3_2" + this.funcSet;
						this.LtoR10_2 = "waves2_2" + this.funcSet;;
					}, 10)
					this.num = 2
				}
				break;

			case this.vKey == 86 && this.keyStatus == 1: //v
				if (this.num == 2) {
					this.clear();
					setTimeout(() => {
						this.v = "waves1_1" + this.funcSet;
						this.LtoR1 = "waves7_1" + this.funcSet;
						this.LtoR2 = "waves8_1" + this.funcSet;
						this.LtoR3 = "waves9_1" + this.funcSet;
						this.LtoR4 = "waves8_1" + this.funcSet;
						this.LtoR5 = "waves7_1" + this.funcSet;
						this.LtoR6 = "waves6_1" + this.funcSet;
						this.LtoR7 = "waves5_1" + this.funcSet;
						this.LtoR8 = "waves4_1" + this.funcSet;
						this.LtoR9 = "waves3_1" + this.funcSet;
						this.LtoR10 = "waves2_1" + this.funcSet;
					}, 10);
					this.num = 3
				}
				else if (this.num == 3) {
					this.clear2();
					setTimeout(() => {
						this.v_2 = "waves1_2" + this.funcSet;
						this.LtoR1_2 = "waves7_2" + this.funcSet;
						this.LtoR2_2 = "waves8_2" + this.funcSet;
						this.LtoR3_2 = "waves9_2" + this.funcSet;
						this.LtoR4_2 = "waves8_2" + this.funcSet;
						this.LtoR5_2 = "waves7_2" + this.funcSet;
						this.LtoR6_2 = "waves6_2" + this.funcSet;
						this.LtoR7_2 = "waves5_2" + this.funcSet;
						this.LtoR8_2 = "waves4_2" + this.funcSet;
						this.LtoR9_2 = "waves3_2" + this.funcSet;
						this.LtoR10_2 = "waves2_2" + this.funcSet;
					}, 10)
					this.num = 2
				}
				break;

			case this.vKey == 66 && this.keyStatus == 1: //b
				if (this.num == 2) {
					this.clear();
					setTimeout(() => {
						this.b = "waves1_1" + this.funcSet;
						this.LtoR1 = "waves5_1" + this.funcSet;
						this.LtoR2 = "waves6_1" + this.funcSet;
						this.LtoR3 = "waves7_1" + this.funcSet;
						this.LtoR4 = "waves8_1" + this.funcSet;
						this.LtoR5 = "waves7_1" + this.funcSet;
						this.LtoR6 = "waves6_1" + this.funcSet;
						this.LtoR7 = "waves5_1" + this.funcSet;
						this.LtoR8 = "waves4_1" + this.funcSet;
						this.LtoR9 = "waves3_1" + this.funcSet;
						this.LtoR10 = "waves2_1" + this.funcSet;
					}, 10);
					this.num = 3
				}
				else if (this.num == 3) {
					this.clear2();
					setTimeout(() => {
						this.b_2 = "waves1_2" + this.funcSet;
						this.LtoR1_2 = "waves5_2" + this.funcSet;
						this.LtoR2_2 = "waves6_2" + this.funcSet;
						this.LtoR3_2 = "waves7_2" + this.funcSet;
						this.LtoR4_2 = "waves8_2" + this.funcSet;
						this.LtoR5_2 = "waves7_2" + this.funcSet;
						this.LtoR6_2 = "waves6_2" + this.funcSet;
						this.LtoR7_2 = "waves5_2" + this.funcSet;
						this.LtoR8_2 = "waves4_2" + this.funcSet;
						this.LtoR9_2 = "waves3_2" + this.funcSet;
						this.LtoR10_2 = "waves2_2" + this.funcSet;
					}, 10)
					this.num = 2
				}
				break;

			case this.vKey == 78 && this.keyStatus == 1: //n
				if (this.num == 2) {
					this.clear();
					setTimeout(() => {
						this.n = "waves1_1" + this.funcSet;
						this.LtoR1 = "waves5_1" + this.funcSet;
						this.LtoR2 = "waves6_1" + this.funcSet;
						this.LtoR3 = "waves7_1" + this.funcSet;
						this.LtoR4 = "waves8_1" + this.funcSet;
						this.LtoR5 = "waves7_1" + this.funcSet;
						this.LtoR6 = "waves6_1" + this.funcSet;
						this.LtoR7 = "waves5_1" + this.funcSet;
						this.LtoR8 = "waves4_1" + this.funcSet;
						this.LtoR9 = "waves3_1" + this.funcSet;
						this.LtoR10 = "waves2_1" + this.funcSet;
					}, 10);
					this.num = 3
				}
				else if (this.num == 3) {
					this.clear2();
					setTimeout(() => {
						this.n_2 = "waves1_2" + this.funcSet;
						this.LtoR1_2 = "waves5_2" + this.funcSet;
						this.LtoR2_2 = "waves6_2" + this.funcSet;
						this.LtoR3_2 = "waves7_2" + this.funcSet;
						this.LtoR4_2 = "waves8_2" + this.funcSet;
						this.LtoR5_2 = "waves7_2" + this.funcSet;
						this.LtoR6_2 = "waves6_2" + this.funcSet;
						this.LtoR7_2 = "waves5_2" + this.funcSet;
						this.LtoR8_2 = "waves4_2" + this.funcSet;
						this.LtoR9_2 = "waves3_2" + this.funcSet;
						this.LtoR10_2 = "waves2_2" + this.funcSet;
					}, 10)
					this.num = 2
				}
				break;

			case this.vKey == 77 && this.keyStatus == 1: //m
				if (this.num == 2) {
					this.clear();
					setTimeout(() => {
						this.m = "waves1_1" + this.funcSet;
						this.LtoR1 = "waves3_1" + this.funcSet;
						this.LtoR2 = "waves4_1" + this.funcSet;
						this.LtoR3 = "waves5_1" + this.funcSet;
						this.LtoR4 = "waves6_1" + this.funcSet;
						this.LtoR5 = "waves7_1" + this.funcSet;
						this.LtoR6 = "waves6_1" + this.funcSet;
						this.LtoR7 = "waves5_1" + this.funcSet;
						this.LtoR8 = "waves4_1" + this.funcSet;
						this.LtoR9 = "waves3_1" + this.funcSet;
						this.LtoR10 = "waves2_1" + this.funcSet;
					}, 10);
					this.num = 3
				}
				else if (this.num == 3) {
					this.clear2();
					setTimeout(() => {
						this.m_2 = "waves1_2" + this.funcSet;
						this.LtoR1_2 = "waves3_2" + this.funcSet;
						this.LtoR2_2 = "waves4_2" + this.funcSet;
						this.LtoR3_2 = "waves5_2" + this.funcSet;
						this.LtoR4_2 = "waves6_2" + this.funcSet;
						this.LtoR5_2 = "waves7_2" + this.funcSet;
						this.LtoR6_2 = "waves6_2" + this.funcSet;
						this.LtoR7_2 = "waves5_2" + this.funcSet;
						this.LtoR8_2 = "waves4_2" + this.funcSet;
						this.LtoR9_2 = "waves3_2" + this.funcSet;
						this.LtoR10_2 = "waves2_2" + this.funcSet;
					}, 10)
					this.num = 2
				}
				break;

			case this.vKey == 188 && this.keyStatus == 1: //comma
				if (this.num == 2) {
					this.clear();
					setTimeout(() => {
						this.comma = "waves1_1" + this.funcSet;
						this.LtoR1 = "waves3_1" + this.funcSet;
						this.LtoR2 = "waves4_1" + this.funcSet;
						this.LtoR3 = "waves5_1" + this.funcSet;
						this.LtoR4 = "waves6_1" + this.funcSet;
						this.LtoR5 = "waves7_1" + this.funcSet;
						this.LtoR6 = "waves6_1" + this.funcSet;
						this.LtoR7 = "waves5_1" + this.funcSet;
						this.LtoR8 = "waves4_1" + this.funcSet;
						this.LtoR9 = "waves3_1" + this.funcSet;
						this.LtoR10 = "waves2_1" + this.funcSet;
					}, 10);
					this.num = 3
				}
				else if (this.num == 3) {
					this.clear2();
					setTimeout(() => {
						this.comma_2 = "waves1_2" + this.funcSet;
						this.LtoR1_2 = "waves3_2" + this.funcSet;
						this.LtoR2_2 = "waves4_2" + this.funcSet;
						this.LtoR3_2 = "waves5_2" + this.funcSet;
						this.LtoR4_2 = "waves6_2" + this.funcSet;
						this.LtoR5_2 = "waves7_2" + this.funcSet;
						this.LtoR6_2 = "waves6_2" + this.funcSet;
						this.LtoR7_2 = "waves5_2" + this.funcSet;
						this.LtoR8_2 = "waves4_2" + this.funcSet;
						this.LtoR9_2 = "waves3_2" + this.funcSet;
						this.LtoR10_2 = "waves2_2" + this.funcSet;
					}, 10)
					this.num = 2
				}
				break;

			case this.vKey == 190 && this.keyStatus == 1: //dot
				if (this.num == 2) {
					this.clear();
					setTimeout(() => {
						this.dot = "waves1_1" + this.funcSet;
						this.LtoR1 = "waves2_1" + this.funcSet;
						this.LtoR2 = "waves3_1" + this.funcSet;
						this.LtoR3 = "waves4_1" + this.funcSet;
						this.LtoR4 = "waves5_1" + this.funcSet;
						this.LtoR5 = "waves6_1" + this.funcSet;
						this.LtoR6 = "waves7_1" + this.funcSet;
						this.LtoR7 = "waves6_1" + this.funcSet;
						this.LtoR8 = "waves5_1" + this.funcSet;
						this.LtoR9 = "waves4_1" + this.funcSet;
						this.LtoR10 = "waves3_1" + this.funcSet;
					}, 10);
					this.num = 3
				}
				else if (this.num == 3) {
					this.clear2();
					setTimeout(() => {
						this.dot_2 = "waves1_2" + this.funcSet;
						this.LtoR1_2 = "waves2_2" + this.funcSet;
						this.LtoR2_2 = "waves3_2" + this.funcSet;
						this.LtoR3_2 = "waves4_2" + this.funcSet;
						this.LtoR4_2 = "waves5_2" + this.funcSet;
						this.LtoR5_2 = "waves6_2" + this.funcSet;
						this.LtoR6_2 = "waves7_2" + this.funcSet;
						this.LtoR7_2 = "waves6_2" + this.funcSet;
						this.LtoR8_2 = "waves5_2" + this.funcSet;
						this.LtoR9_2 = "waves4_2" + this.funcSet;
						this.LtoR10_2 = "waves3_2" + this.funcSet;
					}, 10)
					this.num = 2
				}
				break;

			case this.vKey == 191 && this.keyStatus == 1: //qmark
				if (this.num == 2) {
					this.clear();
					setTimeout(() => {
						this.qmark = "waves1_1" + this.funcSet;
						this.LtoR1 = "waves2_1" + this.funcSet;
						this.LtoR2 = "waves3_1" + this.funcSet;
						this.LtoR3 = "waves4_1" + this.funcSet;
						this.LtoR4 = "waves5_1" + this.funcSet;
						this.LtoR5 = "waves6_1" + this.funcSet;
						this.LtoR6 = "waves7_1" + this.funcSet;
						this.LtoR7 = "waves6_1" + this.funcSet;
						this.LtoR8 = "waves5_1" + this.funcSet;
						this.LtoR9 = "waves4_1" + this.funcSet;
						this.LtoR10 = "waves3_1" + this.funcSet;
					}, 10);
					this.num = 3
				}
				else if (this.num == 3) {
					this.clear2();
					setTimeout(() => {
						this.qmark_2 = "waves1_2" + this.funcSet;
						this.LtoR1_2 = "waves2_2" + this.funcSet;
						this.LtoR2_2 = "waves3_2" + this.funcSet;
						this.LtoR3_2 = "waves4_2" + this.funcSet;
						this.LtoR4_2 = "waves5_2" + this.funcSet;
						this.LtoR5_2 = "waves6_2" + this.funcSet;
						this.LtoR6_2 = "waves7_2" + this.funcSet;
						this.LtoR7_2 = "waves6_2" + this.funcSet;
						this.LtoR8_2 = "waves5_2" + this.funcSet;
						this.LtoR9_2 = "waves4_2" + this.funcSet;
						this.LtoR10_2 = "waves3_2" + this.funcSet;
					}, 10)
					this.num = 2
				}
				break;

			case this.vKey == 'r16' && this.keyStatus == 1: //rshift
				if (this.num == 2) {
					this.clear();
					setTimeout(() => {
						this.rshift = "waves1_1" + this.funcSet;
						this.LtoR1 = "waves2_1" + this.funcSet;
						this.LtoR2 = "waves3_1" + this.funcSet;
						this.LtoR3 = "waves4_1" + this.funcSet;
						this.LtoR4 = "waves5_1" + this.funcSet;
						this.LtoR5 = "waves6_1" + this.funcSet;
						this.LtoR6 = "waves7_1" + this.funcSet;
						this.LtoR7 = "waves8_1" + this.funcSet;
						this.LtoR8 = "waves7_1" + this.funcSet;
						this.LtoR9 = "waves6_1" + this.funcSet;
						this.LtoR10 = "waves5_1" + this.funcSet;
					}, 10);
					this.num = 3
				}
				else if (this.num == 3) {
					this.clear2();
					setTimeout(() => {
						this.rshift_2 = "waves1_2" + this.funcSet;
						this.LtoR1_2 = "waves2_2" + this.funcSet;
						this.LtoR2_2 = "waves3_2" + this.funcSet;
						this.LtoR3_2 = "waves4_2" + this.funcSet;
						this.LtoR4_2 = "waves5_2" + this.funcSet;
						this.LtoR5_2 = "waves6_2" + this.funcSet;
						this.LtoR6_2 = "waves7_2" + this.funcSet;
						this.LtoR7_2 = "waves8_2" + this.funcSet;
						this.LtoR8_2 = "waves7_2" + this.funcSet;
						this.LtoR9_2 = "waves6_2" + this.funcSet;
						this.LtoR10_2 = "waves5_2" + this.funcSet;
					}, 10)
					this.num = 2
				}
				break;

			case this.vKey == 38 && this.keyStatus == 1: //up
				if (this.num == 2) {
					this.clear();
					setTimeout(() => {
						this.up = "waves1_1" + this.funcSet;
						this.LtoR1 = "waves2_1" + this.funcSet;
						this.LtoR2 = "waves3_1" + this.funcSet;
						this.LtoR3 = "waves4_1" + this.funcSet;
						this.LtoR4 = "waves5_1" + this.funcSet;
						this.LtoR5 = "waves6_1" + this.funcSet;
						this.LtoR6 = "waves7_1" + this.funcSet;
						this.LtoR7 = "waves8_1" + this.funcSet;
						this.LtoR8 = "waves9_1" + this.funcSet;
						this.LtoR9 = "waves8_1" + this.funcSet;
						this.LtoR10 = "waves7_1" + this.funcSet;
					}, 10);
					this.num = 3
				}
				else if (this.num == 3) {
					this.clear2();
					setTimeout(() => {
						this.up_2 = "waves1_2" + this.funcSet;
						this.LtoR1_2 = "waves2_2" + this.funcSet;
						this.LtoR2_2 = "waves3_2" + this.funcSet;
						this.LtoR3_2 = "waves4_2" + this.funcSet;
						this.LtoR4_2 = "waves5_2" + this.funcSet;
						this.LtoR5_2 = "waves6_2" + this.funcSet;
						this.LtoR6_2 = "waves7_2" + this.funcSet;
						this.LtoR7_2 = "waves8_2" + this.funcSet;
						this.LtoR8_2 = "waves9_2" + this.funcSet;
						this.LtoR9_2 = "waves8_2" + this.funcSet;
						this.LtoR10_2 = "waves7_2" + this.funcSet;
					}, 10)
					this.num = 2
				}
				break;

			case this.vKey == 97 && this.keyStatus == 1: //num1
				if (this.num == 2) {
					this.clear();
					setTimeout(() => {
						this.num1 = "waves1_1" + this.funcSet;
						this.LtoR1 = "waves2_1" + this.funcSet;
						this.LtoR2 = "waves3_1" + this.funcSet;
						this.LtoR3 = "waves4_1" + this.funcSet;
						this.LtoR4 = "waves5_1" + this.funcSet;
						this.LtoR5 = "waves6_1" + this.funcSet;
						this.LtoR6 = "waves7_1" + this.funcSet;
						this.LtoR7 = "waves8_1" + this.funcSet;
						this.LtoR8 = "waves9_1" + this.funcSet;
						this.LtoR9 = "waves10_1" + this.funcSet;
						this.LtoR10 = "waves9_1" + this.funcSet;
					}, 10);
					this.num = 3
				}
				else if (this.num == 3) {
					this.clear2();
					setTimeout(() => {
						this.num1_2 = "waves1_2" + this.funcSet;
						this.LtoR1_2 = "waves2_2" + this.funcSet;
						this.LtoR2_2 = "waves3_2" + this.funcSet;
						this.LtoR3_2 = "waves4_2" + this.funcSet;
						this.LtoR4_2 = "waves5_2" + this.funcSet;
						this.LtoR5_2 = "waves6_2" + this.funcSet;
						this.LtoR6_2 = "waves7_2" + this.funcSet;
						this.LtoR7_2 = "waves8_2" + this.funcSet;
						this.LtoR8_2 = "waves9_2" + this.funcSet;
						this.LtoR9_2 = "waves10_2" + this.funcSet;
						this.LtoR10_2 = "waves9_2" + this.funcSet;
					}, 10)
					this.num = 2
				}
				break;

			case this.vKey == 98 && this.keyStatus == 1: //num2
				if (this.num == 2) {
					this.clear();
					setTimeout(() => {
						this.num2 = "waves1_1" + this.funcSet;
						this.LtoR1 = "waves2_1" + this.funcSet;
						this.LtoR2 = "waves3_1" + this.funcSet;
						this.LtoR3 = "waves4_1" + this.funcSet;
						this.LtoR4 = "waves5_1" + this.funcSet;
						this.LtoR5 = "waves6_1" + this.funcSet;
						this.LtoR6 = "waves7_1" + this.funcSet;
						this.LtoR7 = "waves8_1" + this.funcSet;
						this.LtoR8 = "waves9_1" + this.funcSet;
						this.LtoR9 = "waves10_1" + this.funcSet;
						this.LtoR10 = "waves9_1" + this.funcSet;
					}, 10);
					this.num = 3
				}
				else if (this.num == 3) {
					this.clear2();
					setTimeout(() => {
						this.num2_2 = "waves1_2" + this.funcSet;
						this.LtoR1_2 = "waves2_2" + this.funcSet;
						this.LtoR2_2 = "waves3_2" + this.funcSet;
						this.LtoR3_2 = "waves4_2" + this.funcSet;
						this.LtoR4_2 = "waves5_2" + this.funcSet;
						this.LtoR5_2 = "waves6_2" + this.funcSet;
						this.LtoR6_2 = "waves7_2" + this.funcSet;
						this.LtoR7_2 = "waves8_2" + this.funcSet;
						this.LtoR8_2 = "waves9_2" + this.funcSet;
						this.LtoR9_2 = "waves10_2" + this.funcSet;
						this.LtoR10_2 = "waves9_2" + this.funcSet;
					}, 10)
					this.num = 2
				}
				break;

			case this.vKey == 99 && this.keyStatus == 1: //num3
				if (this.num == 2) {
					this.clear();
					setTimeout(() => {
						this.num3 = "waves1_1" + this.funcSet;
						this.LtoR1 = "waves2_1" + this.funcSet;
						this.LtoR2 = "waves3_1" + this.funcSet;
						this.LtoR3 = "waves4_1" + this.funcSet;
						this.LtoR4 = "waves5_1" + this.funcSet;
						this.LtoR5 = "waves6_1" + this.funcSet;
						this.LtoR6 = "waves7_1" + this.funcSet;
						this.LtoR7 = "waves8_1" + this.funcSet;
						this.LtoR8 = "waves9_1" + this.funcSet;
						this.LtoR9 = "waves10_1" + this.funcSet;
						this.LtoR10 = "waves11_1" + this.funcSet;
					}, 10);
					this.num = 3
				}
				else if (this.num == 3) {
					this.clear2();
					setTimeout(() => {
						this.num3_2 = "waves1_2" + this.funcSet;
						this.LtoR1_2 = "waves2_2" + this.funcSet;
						this.LtoR2_2 = "waves3_2" + this.funcSet;
						this.LtoR3_2 = "waves4_2" + this.funcSet;
						this.LtoR4_2 = "waves5_2" + this.funcSet;
						this.LtoR5_2 = "waves6_2" + this.funcSet;
						this.LtoR6_2 = "waves7_2" + this.funcSet;
						this.LtoR7_2 = "waves8_2" + this.funcSet;
						this.LtoR8_2 = "waves9_2" + this.funcSet;
						this.LtoR9_2 = "waves10_2" + this.funcSet;
						this.LtoR10_2 = "waves11_2" + this.funcSet;
					}, 10)
					this.num = 2
				}
				break;

			case this.vKey == 'num13' && this.keyStatus == 1: //numenter
				if (this.num == 2) {
					this.clear();
					setTimeout(() => {
						this.numenter = "waves1_1" + this.funcSet;
						this.LtoR1 = "waves2_1" + this.funcSet;
						this.LtoR2 = "waves3_1" + this.funcSet;
						this.LtoR3 = "waves4_1" + this.funcSet;
						this.LtoR4 = "waves5_1" + this.funcSet;
						this.LtoR5 = "waves6_1" + this.funcSet;
						this.LtoR6 = "waves7_1" + this.funcSet;
						this.LtoR7 = "waves8_1" + this.funcSet;
						this.LtoR8 = "waves9_1" + this.funcSet;
						this.LtoR9 = "waves10_1" + this.funcSet;
						this.LtoR10 = "waves11_1" + this.funcSet;
					}, 10);
					this.num = 3
				}
				else if (this.num == 3) {
					this.clear2();
					setTimeout(() => {
						this.numenter_2 = "waves1_2" + this.funcSet;
						this.LtoR1_2 = "waves2_2" + this.funcSet;
						this.LtoR2_2 = "waves3_2" + this.funcSet;
						this.LtoR3_2 = "waves4_2" + this.funcSet;
						this.LtoR4_2 = "waves5_2" + this.funcSet;
						this.LtoR5_2 = "waves6_2" + this.funcSet;
						this.LtoR6_2 = "waves7_2" + this.funcSet;
						this.LtoR7_2 = "waves8_2" + this.funcSet;
						this.LtoR8_2 = "waves9_2" + this.funcSet;
						this.LtoR9_2 = "waves10_2" + this.funcSet;
						this.LtoR10_2 = "waves11_2" + this.funcSet;
					}, 10)
					this.num = 2
				}
				break;

			case this.vKey == 'l17' && this.keyStatus == 1: //lctrl
				if (this.num == 2) {
					this.clear();
					setTimeout(() => {
						this.lctrl = "waves1_1" + this.funcSet;
						this.LtoR1 = "waves11_1" + this.funcSet;
						this.LtoR2 = "waves10_1" + this.funcSet;
						this.LtoR3 = "waves9_1" + this.funcSet;
						this.LtoR4 = "waves8_1" + this.funcSet;
						this.LtoR5 = "waves7_1" + this.funcSet;
						this.LtoR6 = "waves6_1" + this.funcSet;
						this.LtoR7 = "waves5_1" + this.funcSet;
						this.LtoR8 = "waves4_1" + this.funcSet;
						this.LtoR9 = "waves3_1" + this.funcSet;
						this.LtoR10 = "waves2_1" + this.funcSet;
					}, 10);
					this.num = 3
				}
				else if (this.num == 3) {
					this.clear2();
					setTimeout(() => {
						this.lctrl_2 = "waves1_2" + this.funcSet;
						this.LtoR1_2 = "waves11_2" + this.funcSet;
						this.LtoR2_2 = "waves10_2" + this.funcSet;
						this.LtoR3_2 = "waves9_2" + this.funcSet;
						this.LtoR4_2 = "waves8_2" + this.funcSet;
						this.LtoR5_2 = "waves7_2" + this.funcSet;
						this.LtoR6_2 = "waves6_2" + this.funcSet;
						this.LtoR7_2 = "waves5_2" + this.funcSet;
						this.LtoR8_2 = "waves4_2" + this.funcSet;
						this.LtoR9_2 = "waves3_2" + this.funcSet;
						this.LtoR10_2 = "waves2_2" + this.funcSet;
					}, 10)
					this.num = 2
				}
				break;

			case this.vKey == 91 && this.keyStatus == 1: //win
				if (this.num == 2) {
					this.clear();
					setTimeout(() => {
						this.win_2 = "waves1_2" + this.funcSet;
						this.LtoR1 = "waves11_1" + this.funcSet;
						this.LtoR2 = "waves10_1" + this.funcSet;
						this.LtoR3 = "waves9_1" + this.funcSet;
						this.LtoR4 = "waves8_1" + this.funcSet;
						this.LtoR5 = "waves7_1" + this.funcSet;
						this.LtoR6 = "waves6_1" + this.funcSet;
						this.LtoR7 = "waves5_1" + this.funcSet;
						this.LtoR8 = "waves4_1" + this.funcSet;
						this.LtoR9 = "waves3_1" + this.funcSet;
						this.LtoR10 = "waves2_1" + this.funcSet;
					}, 10);
					this.num = 3
				}
				else if (this.num == 3) {
					this.clear2();
					setTimeout(() => {
						this.win_2 = "waves1_2" + this.funcSet;
						this.LtoR1_2 = "waves2_2" + this.funcSet;
						this.LtoR2_2 = "waves3_2" + this.funcSet;
						this.LtoR3_2 = "waves4_2" + this.funcSet;
						this.LtoR4_2 = "waves5_2" + this.funcSet;
						this.LtoR5_2 = "waves6_2" + this.funcSet;
						this.LtoR6_2 = "waves7_2" + this.funcSet;
						this.LtoR7_2 = "waves8_2" + this.funcSet;
						this.LtoR8_2 = "waves9_2" + this.funcSet;
						this.LtoR9_2 = "waves10_2" + this.funcSet;
						this.LtoR10_2 = "waves11_2" + this.funcSet;
					}, 10)
					this.num = 2
				}
				break;

			case this.vKey == 'l18' && this.keyStatus == 1: //lalt
				if (this.num == 2) {
					this.clear();
					setTimeout(() => {
						this.lalt = "waves1_1" + this.funcSet;
						this.LtoR1 = "waves9_1" + this.funcSet;
						this.LtoR2 = "waves10_1" + this.funcSet;
						this.LtoR3 = "waves9_1" + this.funcSet;
						this.LtoR4 = "waves8_1" + this.funcSet;
						this.LtoR5 = "waves7_1" + this.funcSet;
						this.LtoR6 = "waves6_1" + this.funcSet;
						this.LtoR7 = "waves5_1" + this.funcSet;
						this.LtoR8 = "waves4_1" + this.funcSet;
						this.LtoR9 = "waves3_1" + this.funcSet;
						this.LtoR10 = "waves2_1" + this.funcSet;
					}, 10);
					this.num = 3
				}
				else if (this.num == 3) {
					this.clear2();
					setTimeout(() => {
						this.lalt_2 = "waves1_2" + this.funcSet;
						this.LtoR1_2 = "waves9_2" + this.funcSet;
						this.LtoR2_2 = "waves10_2" + this.funcSet;
						this.LtoR3_2 = "waves9_2" + this.funcSet;
						this.LtoR4_2 = "waves8_2" + this.funcSet;
						this.LtoR5_2 = "waves7_2" + this.funcSet;
						this.LtoR6_2 = "waves6_2" + this.funcSet;
						this.LtoR7_2 = "waves5_2" + this.funcSet;
						this.LtoR8_2 = "waves4_2" + this.funcSet;
						this.LtoR9_2 = "waves3_2" + this.funcSet;
						this.LtoR10_2 = "waves2_2" + this.funcSet;
					}, 10)
					this.num = 2
				}
				break;

			case this.vKey == 32 && this.keyStatus == 1: //space
				if (this.num == 2) {
					this.clear();
					setTimeout(() => {
						this.space = "waves1_1" + this.funcSet;
						this.LtoR1 = "waves5_1" + this.funcSet;
						this.LtoR2 = "waves6_1" + this.funcSet;
						this.LtoR3 = "waves7_1" + this.funcSet;
						this.LtoR4 = "waves8_1" + this.funcSet;
						this.LtoR5 = "waves7_1" + this.funcSet;
						this.LtoR6 = "waves6_1" + this.funcSet;
						this.LtoR7 = "waves5_1" + this.funcSet;
						this.LtoR8 = "waves4_1" + this.funcSet;
						this.LtoR9 = "waves3_1" + this.funcSet;
						this.LtoR10 = "waves2_1" + this.funcSet;
					}, 10);
					this.num = 3
				}
				else if (this.num == 3) {
					this.clear2();
					setTimeout(() => {
						this.space_2 = "waves1_2" + this.funcSet;
						this.LtoR1_2 = "waves5_2" + this.funcSet;
						this.LtoR2_2 = "waves6_2" + this.funcSet;
						this.LtoR3_2 = "waves7_2" + this.funcSet;
						this.LtoR4_2 = "waves8_2" + this.funcSet;
						this.LtoR5_2 = "waves7_2" + this.funcSet;
						this.LtoR6_2 = "waves6_2" + this.funcSet;
						this.LtoR7_2 = "waves5_2" + this.funcSet;
						this.LtoR8_2 = "waves4_2" + this.funcSet;
						this.LtoR9_2 = "waves3_2" + this.funcSet;
						this.LtoR10_2 = "waves2_2" + this.funcSet;
					}, 10)
					this.num = 2
				}
				break;

			case this.vKey == 'r18' && this.keyStatus == 1: //ralt
				if (this.num == 2) {
					this.clear();
					setTimeout(() => {
						this.ralt = "waves1_1" + this.funcSet;
						this.LtoR1 = "waves2_1" + this.funcSet;
						this.LtoR2 = "waves3_1" + this.funcSet;
						this.LtoR3 = "waves4_1" + this.funcSet;
						this.LtoR4 = "waves5_1" + this.funcSet;
						this.LtoR5 = "waves6_1" + this.funcSet;
						this.LtoR6 = "waves7_1" + this.funcSet;
						this.LtoR7 = "waves6_1" + this.funcSet;
						this.LtoR8 = "waves5_1" + this.funcSet;
						this.LtoR9 = "waves4_1" + this.funcSet;
						this.LtoR10 = "waves3_1" + this.funcSet;
					}, 10);
					this.num = 3
				}
				else if (this.num == 3) {
					this.clear2();
					setTimeout(() => {
						this.ralt_2 = "waves1_2" + this.funcSet;
						this.LtoR1_2 = "waves2_2" + this.funcSet;
						this.LtoR2_2 = "waves3_2" + this.funcSet;
						this.LtoR3_2 = "waves4_2" + this.funcSet;
						this.LtoR4_2 = "waves5_2" + this.funcSet;
						this.LtoR5_2 = "waves6_2" + this.funcSet;
						this.LtoR6_2 = "waves7_2" + this.funcSet;
						this.LtoR7_2 = "waves6_2" + this.funcSet;
						this.LtoR8_2 = "waves5_2" + this.funcSet;
						this.LtoR9_2 = "waves4_2" + this.funcSet;
						this.LtoR10_2 = "waves3_2" + this.funcSet;
					}, 10)
					this.num = 2
				}
				break;

			case this.vKey == 93 && this.keyStatus == 1: //book
				if (this.num == 2) {
					this.clear();
					setTimeout(() => {
						this.book = "waves1_1" + this.funcSet;
						this.LtoR1 = "waves2_1" + this.funcSet;
						this.LtoR2 = "waves3_1" + this.funcSet;
						this.LtoR3 = "waves4_1" + this.funcSet;
						this.LtoR4 = "waves5_1" + this.funcSet;
						this.LtoR5 = "waves6_1" + this.funcSet;
						this.LtoR6 = "waves7_1" + this.funcSet;
						this.LtoR7 = "waves6_1" + this.funcSet;
						this.LtoR8 = "waves5_1" + this.funcSet;
						this.LtoR9 = "waves4_1" + this.funcSet;
						this.LtoR10 = "waves3_1" + this.funcSet;
					}, 10);
					this.num = 3
				}
				else if (this.num == 3) {
					this.clear2();
					setTimeout(() => {
						this.book_2 = "waves1_2" + this.funcSet;
						this.LtoR1_2 = "waves2_2" + this.funcSet;
						this.LtoR2_2 = "waves3_2" + this.funcSet;
						this.LtoR3_2 = "waves4_2" + this.funcSet;
						this.LtoR4_2 = "waves5_2" + this.funcSet;
						this.LtoR5_2 = "waves6_2" + this.funcSet;
						this.LtoR6_2 = "waves7_2" + this.funcSet;
						this.LtoR7_2 = "waves6_2" + this.funcSet;
						this.LtoR8_2 = "waves5_2" + this.funcSet;
						this.LtoR9_2 = "waves4_2" + this.funcSet;
						this.LtoR10_2 = "waves3_2" + this.funcSet;
					}, 10)
					this.num = 2
				}
				break;

			case this.vKey == 'r17' && this.keyStatus == 1: //rctrl
				if (this.num == 2) {
					this.clear();
					setTimeout(() => {
						this.rctrl = "waves1_1" + this.funcSet;
						this.LtoR1 = "waves2_1" + this.funcSet;
						this.LtoR2 = "waves3_1" + this.funcSet;
						this.LtoR3 = "waves4_1" + this.funcSet;
						this.LtoR4 = "waves5_1" + this.funcSet;
						this.LtoR5 = "waves6_1" + this.funcSet;
						this.LtoR6 = "waves7_1" + this.funcSet;
						this.LtoR7 = "waves8_1" + this.funcSet;
						this.LtoR8 = "waves9_1" + this.funcSet;
						this.LtoR9 = "waves8_1" + this.funcSet;
						this.LtoR10 = "waves7_1" + this.funcSet;
					}, 10);
					this.num = 3
				}
				else if (this.num == 3) {
					this.clear2();
					setTimeout(() => {
						this.book_2 = "waves1_2" + this.funcSet;
						this.LtoR1_2 = "waves2_2" + this.funcSet;
						this.LtoR2_2 = "waves3_2" + this.funcSet;
						this.LtoR3_2 = "waves4_2" + this.funcSet;
						this.LtoR4_2 = "waves5_2" + this.funcSet;
						this.LtoR5_2 = "waves6_2" + this.funcSet;
						this.LtoR6_2 = "waves7_2" + this.funcSet;
						this.LtoR7_2 = "waves8_2" + this.funcSet;
						this.LtoR8_2 = "waves9_2" + this.funcSet;
						this.LtoR9_2 = "waves8_2" + this.funcSet;
						this.LtoR10_2 = "waves7_2" + this.funcSet;
					}, 10)
					this.num = 2
				}
				break;

			case this.vKey == 37 && this.keyStatus == 1: //left
				if (this.num == 2) {
					this.clear();
					setTimeout(() => {
						this.left = "waves1_1" + this.funcSet;
						this.LtoR1 = "waves2_1" + this.funcSet;
						this.LtoR2 = "waves3_1" + this.funcSet;
						this.LtoR3 = "waves4_1" + this.funcSet;
						this.LtoR4 = "waves5_1" + this.funcSet;
						this.LtoR5 = "waves6_1" + this.funcSet;
						this.LtoR6 = "waves7_1" + this.funcSet;
						this.LtoR7 = "waves8_1" + this.funcSet;
						this.LtoR8 = "waves9_1" + this.funcSet;
						this.LtoR9 = "waves8_1" + this.funcSet;
						this.LtoR10 = "waves7_1" + this.funcSet;
					}, 10);
					this.num = 3
				}
				else if (this.num == 3) {
					this.clear2();
					setTimeout(() => {
						this.left_2 = "waves1_2" + this.funcSet;
						this.LtoR1_2 = "waves2_2" + this.funcSet;
						this.LtoR2_2 = "waves3_2" + this.funcSet;
						this.LtoR3_2 = "waves4_2" + this.funcSet;
						this.LtoR4_2 = "waves5_2" + this.funcSet;
						this.LtoR5_2 = "waves6_2" + this.funcSet;
						this.LtoR6_2 = "waves7_2" + this.funcSet;
						this.LtoR7_2 = "waves8_2" + this.funcSet;
						this.LtoR8_2 = "waves9_2" + this.funcSet;
						this.LtoR9_2 = "waves8_2" + this.funcSet;
						this.LtoR10_2 = "waves7_2" + this.funcSet;
					}, 10)
					this.num = 2
				}
				break;

			case this.vKey == 40 && this.keyStatus == 1: //down
				if (this.num == 2) {
					this.clear();
					setTimeout(() => {
						this.down = "waves1_1" + this.funcSet;
						this.LtoR1 = "waves2_1" + this.funcSet;
						this.LtoR2 = "waves3_1" + this.funcSet;
						this.LtoR3 = "waves4_1" + this.funcSet;
						this.LtoR4 = "waves5_1" + this.funcSet;
						this.LtoR5 = "waves6_1" + this.funcSet;
						this.LtoR6 = "waves7_1" + this.funcSet;
						this.LtoR7 = "waves8_1" + this.funcSet;
						this.LtoR8 = "waves9_1" + this.funcSet;
						this.LtoR9 = "waves8_1" + this.funcSet;
						this.LtoR10 = "waves7_1" + this.funcSet;
					}, 10);
					this.num = 3
				}
				else if (this.num == 3) {
					this.clear2();
					setTimeout(() => {
						this.down_2 = "waves1_2" + this.funcSet;
						this.LtoR1_2 = "waves2_2" + this.funcSet;
						this.LtoR2_2 = "waves3_2" + this.funcSet;
						this.LtoR3_2 = "waves4_2" + this.funcSet;
						this.LtoR4_2 = "waves5_2" + this.funcSet;
						this.LtoR5_2 = "waves6_2" + this.funcSet;
						this.LtoR6_2 = "waves7_2" + this.funcSet;
						this.LtoR7_2 = "waves8_2" + this.funcSet;
						this.LtoR8_2 = "waves9_2" + this.funcSet;
						this.LtoR9_2 = "waves8_2" + this.funcSet;
						this.LtoR10_2 = "waves7_2" + this.funcSet;
					}, 10)
					this.num = 2
				}
				break;

			case this.vKey == 39 && this.keyStatus == 1: //right
				if (this.num == 2) {
					this.clear();
					setTimeout(() => {
						this.right = "waves1_1" + this.funcSet;
						this.LtoR1 = "waves2_1" + this.funcSet;
						this.LtoR2 = "waves3_1" + this.funcSet;
						this.LtoR3 = "waves4_1" + this.funcSet;
						this.LtoR4 = "waves5_1" + this.funcSet;
						this.LtoR5 = "waves6_1" + this.funcSet;
						this.LtoR6 = "waves7_1" + this.funcSet;
						this.LtoR7 = "waves8_1" + this.funcSet;
						this.LtoR8 = "waves9_1" + this.funcSet;
						this.LtoR9 = "waves8_1" + this.funcSet;
						this.LtoR10 = "waves7_1" + this.funcSet;
					}, 10);
					this.num = 3
				}
				else if (this.num == 3) {
					this.clear2();
					setTimeout(() => {
						this.right_2 = "waves1_2" + this.funcSet;
						this.LtoR1_2 = "waves2_2" + this.funcSet;
						this.LtoR2_2 = "waves3_2" + this.funcSet;
						this.LtoR3_2 = "waves4_2" + this.funcSet;
						this.LtoR4_2 = "waves5_2" + this.funcSet;
						this.LtoR5_2 = "waves6_2" + this.funcSet;
						this.LtoR6_2 = "waves7_2" + this.funcSet;
						this.LtoR7_2 = "waves8_2" + this.funcSet;
						this.LtoR8_2 = "waves9_2" + this.funcSet;
						this.LtoR9_2 = "waves8_2" + this.funcSet;
						this.LtoR10_2 = "waves7_2" + this.funcSet;
					}, 10)
					this.num = 2
				}
				break;

			case this.vKey == 96 && this.keyStatus == 1: //num0
				if (this.num == 2) {
					this.clear();
					setTimeout(() => {
						this.num0 = "waves1_1" + this.funcSet;
						this.LtoR1 = "waves2_1" + this.funcSet;
						this.LtoR2 = "waves3_1" + this.funcSet;
						this.LtoR3 = "waves4_1" + this.funcSet;
						this.LtoR4 = "waves5_1" + this.funcSet;
						this.LtoR5 = "waves6_1" + this.funcSet;
						this.LtoR6 = "waves7_1" + this.funcSet;
						this.LtoR7 = "waves8_1" + this.funcSet;
						this.LtoR8 = "waves9_1" + this.funcSet;
						this.LtoR9 = "waves10_1" + this.funcSet;
						this.LtoR10 = "waves9_1" + this.funcSet;
					}, 10);
					this.num = 3
				}
				else if (this.num == 3) {
					this.clear2();
					setTimeout(() => {
						this.num0_2 = "waves1_2" + this.funcSet;
						this.LtoR1_2 = "waves2_2" + this.funcSet;
						this.LtoR2_2 = "waves3_2" + this.funcSet;
						this.LtoR3_2 = "waves4_2" + this.funcSet;
						this.LtoR4_2 = "waves5_2" + this.funcSet;
						this.LtoR5_2 = "waves6_2" + this.funcSet;
						this.LtoR6_2 = "waves7_2" + this.funcSet;
						this.LtoR7_2 = "waves8_2" + this.funcSet;
						this.LtoR8_2 = "waves9_2" + this.funcSet;
						this.LtoR9_2 = "waves10_2" + this.funcSet;
						this.LtoR10_2 = "waves9_2" + this.funcSet;
					}, 10)
					this.num = 2
				}
				break;

			case this.vKey == 110 && this.keyStatus == 1: //numdot
				if (this.num == 2) {
					this.clear();
					setTimeout(() => {
						this.numdot = "waves1_1" + this.funcSet;
						this.LtoR1 = "waves2_1" + this.funcSet;
						this.LtoR2 = "waves3_1" + this.funcSet;
						this.LtoR3 = "waves4_1" + this.funcSet;
						this.LtoR4 = "waves5_1" + this.funcSet;
						this.LtoR5 = "waves6_1" + this.funcSet;
						this.LtoR6 = "waves7_1" + this.funcSet;
						this.LtoR7 = "waves8_1" + this.funcSet;
						this.LtoR8 = "waves9_1" + this.funcSet;
						this.LtoR9 = "waves10_1" + this.funcSet;
						this.LtoR10 = "waves11_1" + this.funcSet;
					}, 10);
					this.num = 3
				}
				else if (this.num == 3) {
					this.clear2();
					setTimeout(() => {
						this.numdot_2 = "waves1_2" + this.funcSet;
						this.LtoR1_2 = "waves2_2" + this.funcSet;
						this.LtoR2_2 = "waves3_2" + this.funcSet;
						this.LtoR3_2 = "waves4_2" + this.funcSet;
						this.LtoR4_2 = "waves5_2" + this.funcSet;
						this.LtoR5_2 = "waves6_2" + this.funcSet;
						this.LtoR6_2 = "waves7_2" + this.funcSet;
						this.LtoR7_2 = "waves8_2" + this.funcSet;
						this.LtoR8_2 = "waves9_2" + this.funcSet;
						this.LtoR9_2 = "waves10_2" + this.funcSet;
						this.LtoR10_2 = "waves11_2" + this.funcSet;
					}, 10)
					this.num = 2
				}
				break;
			case this.vKey == 44 && this.keyStatus == 1: //print
				if (this.num == 2) {
					this.clear();
					setTimeout(() => {
						this.print = "waves1_1" + this.funcSet;
						this.LtoR1 = "waves2_1" + this.funcSet;
						this.LtoR2 = "waves3_1" + this.funcSet;
						this.LtoR3 = "waves4_1" + this.funcSet;
						this.LtoR4 = "waves5_1" + this.funcSet;
						this.LtoR5 = "waves6_1" + this.funcSet;
						this.LtoR6 = "waves7_1" + this.funcSet;
						this.LtoR7 = "waves8_1" + this.funcSet;
						this.LtoR8 = "waves9_1" + this.funcSet;
						this.LtoR9 = "waves8_1" + this.funcSet;
						this.LtoR10 = "waves7_1" + this.funcSet;
					}, 10);
					this.num = 3;
				}
				else if (this.num == 3) {
					this.clear2();
					setTimeout(() => {
						this.print_2 = "waves1_2" + this.funcSet;
						this.LtoR1_2 = "waves2_2" + this.funcSet;
						this.LtoR2_2 = "waves3_2" + this.funcSet;
						this.LtoR3_2 = "waves4_2" + this.funcSet;
						this.LtoR4_2 = "waves5_2" + this.funcSet;
						this.LtoR5_2 = "waves6_2" + this.funcSet;
						this.LtoR6_2 = "waves7_2" + this.funcSet;
						this.LtoR7_2 = "waves8_2" + this.funcSet;
						this.LtoR8_2 = "waves9_2" + this.funcSet;
						this.LtoR9_2 = "waves8_2" + this.funcSet;
						this.LtoR10_2 = "waves7_2" + this.funcSet;
					}, 10)
					this.num == 2;
				}
				break;
			default:
				break;
		}
	}
	wavesOut_med() {
		this.getColor1();
		this.getColor2();
		this.thelastEffect = this.wavesOut_med;

	}
	wavesOut_high() {
		this.getColor1();
		this.getColor2();
		this.thelastEffect = this.wavesOut_high;
	}
	wavesOut_slow() {
		this.getColor1();
		this.getColor2();
		this.thelastEffect = this.wavesOut_slow;
	}
	wavesIn_med() {
		this.getColor1();
		this.getColor2();
		this.thelastEffect = this.wavesIn_med;
	}
	wavesIn_high() {
		this.getColor1();
		this.getColor2();
		this.thelastEffect = this.wavesIn_high;
	}
	wavesIn_slow() {
		this.getColor1();
		this.getColor2();
		this.thelastEffect = this.wavesIn_slow;
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
			this.getRuleRandom1();
			this.getRuleRandom2();
			this.detectEffectChange();
		}
		if (w == 2) {
			this.default02 = true;
			document.getElementById('colorgp').style.display = "block";
			this.getRule1();
			this.getRule2();
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
			this.defaultclr02 = "#" + (this.desideclrCss02.R + this.desideclrCss02.G + this.desideclrCss02.B);
			this.getRule2();
		}
		if (whichcolor == 2) {
			this.desideclrCss02 = {
				R: "ff",
				G: "3f",
				B: "00"
			};
			this.defaultclr02 = "#" + (this.desideclrCss02.R + this.desideclrCss02.G + this.desideclrCss02.B);
			this.getRule2();
		}
		if (whichcolor == 3) {
			this.desideclrCss02 = {
				R: "ff",
				G: "bf",
				B: "00"
			};
			this.defaultclr02 = "#" + (this.desideclrCss02.R + this.desideclrCss02.G + this.desideclrCss02.B);
			this.getRule2();
		}
		if (whichcolor == 4) {
			this.desideclrCss02 = {
				R: "7f",
				G: "ff",
				B: "00"
			};
			this.defaultclr02 = "#" + (this.desideclrCss02.R + this.desideclrCss02.G + this.desideclrCss02.B);
			this.getRule2();
		}
		if (whichcolor == 5) {
			this.desideclrCss02 = {
				R: "00",
				G: "ff",
				B: "ff"
			};
			this.defaultclr02 = "#" + (this.desideclrCss02.R + this.desideclrCss02.G + this.desideclrCss02.B);
			this.getRule2();
		}
		if (whichcolor == 6) {
			this.desideclrCss02 = {
				R: "00",
				G: "7f",
				B: "ff"
			};
			this.defaultclr02 = "#" + (this.desideclrCss02.R + this.desideclrCss02.G + this.desideclrCss02.B);
			this.getRule2();
		}
		if (whichcolor == 7) {
			this.desideclrCss02 = {
				R: "64",
				G: "00",
				B: "ff"
			};
			this.defaultclr02 = "#" + (this.desideclrCss02.R + this.desideclrCss02.G + this.desideclrCss02.B);
			this.getRule2();
		}
		if (whichcolor == 8) {
			this.desideclrCss02 = {
				R: "af",
				G: "26",
				B: "ff"
			};
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
	sp: any = 50;
	SpeedInput(value) {
		this.detectEffectChange();
		let vm = this;
		this.sp = value;
		setTimeout(() => {
			vm.speedMethod(value);
		}, 1000);
	}


	slowFun: any = this.wavesOut_slow
	medFun: any = this.wavesOut_med
	fastFun: any = this.wavesOut_high
	speed: any = '50';

	// //最先決定速度類型
	apFlag: any;

	effectDeside(w) {
		let vm = this;
		if (w !== this.apFlag) {
			this.leave = 0;
			setTimeout(() => {
				vm.leave = 1;
				vm.doApmode01();
			}, 200);
			clearInterval(this.getclr01);
			clearInterval(this.getclr02);
			if (w == 4) {
				this.Effectdirection = w
				this.apFlag = w;
				this.detectEffectChange();
				this.num = 0;
				this.slowFun = this.wavesOut_slow;
				this.medFun = this.wavesOut_med;
				this.fastFun = this.wavesOut_high;
				this.medFun();
				switch (true) {
					case this.sp == 20:
						this.fastFun();
						break;
					case this.sp == 50:
						this.medFun();
						break;
					case this.sp == 80:
						this.fastFun();
						break;
					default:
						break;
				}
			}
			if (w == 5) {
				this.Effectdirection = w
				this.apFlag = w;
				this.detectEffectChange();
				this.num = 2;
				//console.log("w=5 " + this.num)
				this.slowFun = this.wavesIn_slow;
				this.medFun = this.wavesIn_med;
				this.fastFun = this.wavesIn_high;
				this.medFun();
				switch (true) {
					case this.sp == 20:
						this.fastFun();
						break;
					case this.sp == 50:
						this.medFun();
						break;
					case this.sp == 80:
						this.fastFun();
						break;
					default:
						break;
				}
			}
		}
	}
	speedMethod(s) {
		this.speed = s;
		clearInterval(this.getclr01);
		// this.workerReset();
		if (s == 20) {
			this.fastFun();
			this.funcSet = "_high";
		}
		if (s == 50) {
			this.medFun();
			this.funcSet = "_med";
		}
		if (s == 80) {
			this.slowFun();
			this.funcSet = "_slow";
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
				if (rule.name == "waves1" && rule.type == rule.KEYFRAMES_RULE) {
					this.cssRule = rule;
				}
			}
		}
		this.cssRule.appendRule(`0% {background-color:${this.defaultclr}}`);
	}
	getRule2() {
		var rule;
		var ss = document.styleSheets;
		for (var i = 0; i < ss.length; i++) {
			for (var x = 0; x < ss[i]['cssRules'].length; x++) {
				rule = ss[i]['cssRules'][x];
				if (rule.name == "waves2" && rule.type == rule.KEYFRAMES_RULE) {
					this.cssRule = rule;
				}
			}
		}
		this.cssRule.appendRule(`0% {background-color:${this.defaultclr02}}`);
	}
	color1: any = ["#E9004C", "#FF3F00", "#FFBF00", "#7FFF00"]
	color2: any = ["#00FFFF", "#007FFF", "#6400FF", "#AF26FF"]
	getRuleRandom1() {
		var rule;
		var ss = document.styleSheets;
		for (var i = 0; i < ss.length; i++) {
			for (var x = 0; x < ss[i]['cssRules'].length; x++) {
				rule = ss[i]['cssRules'][x];
				if (rule.name == "waves1" && rule.type == rule.KEYFRAMES_RULE) {
					this.cssRule = rule;
				}
			}
		}
		var ran1 = Math.floor(Math.random() * 3)
		this.cssRule.appendRule(`0% {background-color:${this.color1[ran1]}}`);
	}
	getRuleRandom2() {
		var rule;
		var ss = document.styleSheets;
		for (var i = 0; i < ss.length; i++) {
			for (var x = 0; x < ss[i]['cssRules'].length; x++) {
				rule = ss[i]['cssRules'][x];
				if (rule.name == "waves2" && rule.type == rule.KEYFRAMES_RULE) {
					this.cssRule = rule;
				}
			}
		}
		var ran2 = Math.floor(Math.random() * 3)
		this.cssRule.appendRule(`0% {background-color:${this.color2[ran2]}}`);
	}





	//速度
	FastSpeed: any = 20;
	MedSpeed: any = 50;
	SlowSpeed: any = 80;

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
							// //console.log(this.sp);
						} else if (this.sp == this.MedSpeed) {
							this.speedMethod(this.FastSpeed);
							this.sp = this.FastSpeed;
							this.speedhere = this.FastSpeed;
							// //console.log(this.sp);
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
							// //console.log(this.sp);
						} else if (this.sp == this.MedSpeed) {
							this.speedMethod(this.SlowSpeed);
							this.sp = this.SlowSpeed;
							this.speedhere = this.SlowSpeed;
							// //console.log(this.sp);
						} else if (this.sp == this.SlowSpeed) {
							// alert('速度已調整為最慢');
							// //console.log(this.sp);
						}
					}

					if (doc[0].Light.Mode[position] == "Up_Left_Outside") {   //方向上左外
						this.presstime = 1
						if (this.presstime == 1) {
							// //console.log("向外")
							this.effectDeside(4);
						}
					}

					if (doc[0].Light.Mode[position] == "Down_Right_Inner") {   //方向下右內
						this.presstime = 1;
						if (this.presstime == 1) {//內
							// //console.log("向內")
							this.effectDeside(5);
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
		this.nowobj.Light.LightSetting.LSbrightness[11] = this.op;
		this.nowobj.Light.LightSetting.LSspeed[11] = this.sp;
		this.nowobj.Light.LightSetting.LSdirection[11] = this.Effectdirection;
		this.nowobj.Light.LightSetting.changeTime[11] = this.timeValue;

		//console.log(this.timeValue);
		this.nowobj.Light.LightSetting.changeMode[11] = this.ttitle;



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
		this.subscription.unsubscribe();
		this.goOut();
		env.log('light-effect', 'waves', 'end');
	}

	@Output() sendTimeCloseFlag = new EventEmitter();
	@Input() check01;
	@Input() timeEffect;
	@Input() receiveTemp;
	@Output() WavesTemp = new EventEmitter();
	@Output() LightEffect = new EventEmitter();
	@Output() applyStatus = new EventEmitter();
	applyFlag: any = 1;
	lightEffect: any = 11;
	waves: any;
	wavesObj() {
		this.waves = {
			'LightEffect': 11,
			'LSbrightness': this.op,
			'LSspeed': this.sp,
			'LSdirection': this.Effectdirection,
			'changeTime': this.timeValue,
			'ttitle': '涟漪',
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
			this.sp = 50;
		}


		if (this.Effectdirection !== undefined && this.Effectdirection !== null && this.Effectdirection !== "") {
			this.effectDeside(this.Effectdirection);
		} else {
			this.Effectdirection = 4; //預設
			this.effectDeside(this.Effectdirection);
		}


		if (this.NewtimeValue !== undefined && this.NewtimeValue !== null && this.NewtimeValue !== "") {
			this.timeValue = this.NewtimeValue;
		}

		if (this.ttitle !== undefined && this.ttitle !== null && this.ttitle !== "") {
			this.sendTtile();
		} else {
			this.ttitle = '涟漪';
		}

		if (this.default == true) {
			this.setDefault(1);
		} else {
			this.setDefault(2);
		}
	}

	sendApply() {
		if (this.timeEffect !== 11) {
			this.wavesObj();
			setTimeout(() => {
				this.sendTimeCloseFlag.emit(this.check01);
				this.WavesTemp.emit(this.waves);
				this.LightEffect.emit(this.waves.LightEffect);
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
