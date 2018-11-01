declare var System;
import { Component, OnInit, Output, EventEmitter, Input } from '@angular/core';
import { protocolService } from '../services/service/protocol.service';
import { icpEventService } from '../services/service/icpEventService.service'

const { ipcRenderer } = System._nodeRequire('electron');
declare var $: any;

import { ElectronEventService, dbService, EmitService } from '../services/libs/electron/index';
import { GetDeviceService } from '../services/device/GetDevice.service';
import { Subscription } from "rxjs/Subscription";



let evtVar = System._nodeRequire('./backend/others/eventVariable');
let funcVar = System._nodeRequire('./backend/others/FunctionVariable');
let env = System._nodeRequire('./backend/others/env');

@Component({
	selector: 'round-effect',
	templateUrl: './components/effect/round.compo.html',
	//template: '<h1>我的第一个 Angular 应用</h1>',
	styleUrls: ['./css/first.css', './css/kbd.css', './css/round.css', './css/attractlight.css'],
	providers: [protocolService, dbService, icpEventService],
	inputs: ['ProfileDetail', 'ttitle', 'getGameChange', 'updatenow', 'changeProfile']
})



export class roundComponent implements OnInit {
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
				// //this.setAPmode();//連續下值預備動作
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
				// if (this.timeEventFlag == true) {
				// 	this.timeEvent();
				// }
			}
			// //console.log("icp " + this.vKey);
			// //console.log("Mmode: " + this.MakeMode);
			// //console.log("Flag: " + this.Flag);
			// //console.log("keystatus: ", this.keyStatus);
			// this.testKey();
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
	fnflag: number = 0;
	nowobj: any;
	ProfileDetail: any;
	attbtn: boolean;
	defaultLb: boolean;
	// blockcss: any = "disabled";
	keyMatrixMap: any = []
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
	key: any;
	vKey: any;
	keyStatus: any;
	MakeMode: any;
	Flag: any;
	Data: any;
	savechange: number = 0;
	currentV: any;
	changeV: any;
	cuteValue: any = 0.5;
	speedValue: any = 6;
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

	@Input() attPt
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
			this.sendLBS();
		}
		else if (x == 0) {
			this.data = 0;
			this.lightBarStatus = this.data;
			this.upAtt = ["Upside1_att", "Upside2_att", "Upside3_att", "Upside4_att", "Upside5_att", "Upside6_att", "Upside7_att", "Upside8_att", "Upside9_att", "Upside10_att", "Upside11_att", "Upside12_att", "Upside13_att", "Upside14_att", "Upside15_att", "Upside16_att", "Upside17_att", "Upside18_att", "Upside19_att", "Upside20_att", "logo1_att", "logo2_att"]
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
			else if (data[6] == 0) {
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

	ngOnInit() {    //綻放
		// this.loading = true;
		// this.openFrtpfun(0);
		this.timeValue = this.receiveTemp[3];
		this.check01 = false;
		this.RoundTemp.emit(this.round);
		env.log('light-effect', 'round', 'start');
		//this.setAPmode();//連續下值預備動作
		this.LEDmatrix();//找出對應按鍵;
		// this.round_med();
		this.setDefault(1);
		this.readTemp();
		this.sendTimeCloseFlag.emit(false);
		setTimeout(() => {
			// this.timeEvent();
			this.doApmode01();
		}, 100);

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
			// if (this.envio == 1) {
				env.log('round', 'apmode', 'stopapmode')
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
				env.log('round', 'apmode', 'startapmode')
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

	array1: any = ["esc", "f1", "f2", "f3", "f4", "f5", "f6", "f7", "f8", "f9", "f10", "f11", "f12", "print", "scroll", "pause", "perid", "n1", "n2", "n3", "n4", "n5", "n6", "n7", "n8", "n9", "n0", "minus", "plus", "bsp", "insert", "home", "pup", "numlock", "numdrawn", "numtimes", "numminus", "tab", "q", "w", "e", "r", "t", "y", "u", "i", "o", "p", "lqu", "rqu", "delete", "drawn", "end", "pdown", "num7", "num8", "num9", "numplus", "caps", "a", "s", "d", "f", "g", "h", "j", "k", "l", "sem", "quo", "enter", "num4", "num5", "num6", "lshift", "z", "x", "c", "v", "b", "n", "m", "comma", "dot", "qmark", "rshift", "up", "num1", "num2", "num3", "numenter", "lctrl", "win", "lalt", "space", "ralt", "fn", "book", "rctrl", "left", "down", "right", "num0", "numdot", "Upside1", "Upside2", "Upside3", "Upside4", "Upside5", "Upside6", "Upside7", "Upside8", "Upside9", "Upside10", "Upside11", "Upside12", "Upside13", "Upside14", "Upside15", "Upside16", "Upside17", "Upside18", "Upside19", "Upside20", "logo1", "logo2"];

	arrayLB: any = ["Upside1", "Upside2", "Upside3", "Upside4", "Upside5", "Upside6", "Upside7", "Upside8", "Upside9", "Upside10", "Upside11", "Upside12", "Upside13", "Upside14", "Upside15", "Upside16", "Upside17", "Upside18", "Upside19", "Upside20", "logo1", "logo2"]

	arrayAtt: any = ["esc_att", "f1_att", "f2_att", "f3_att", "f4_att", "f5_att", "f6_att", "f7_att", "f8_att", "f9_att", "f10_att", "f11_att", "f12_att", "print_att", "scroll_att", "pause_att", "perid_att", "n1_att", "n2_att", "n3_att", "n4_att", "n5_att", "n6_att", "n7_att", "n8_att", "n9_att", "n0_att", "minus_att", "plus_att", "bsp_att", "insert_att", "home_att", "pup_att", "numlock_att", "numdrawn_att", "numtimes_att", "numminus_att", "tab_att", "q_att", "w_att", "e_att", "r_att", "t_att", "y_att", "u_att", "i_att", "o_att", "p_att", "lqu_att", "rqu_att", "delete_att", "drawn_att", "end_att", "pdown_att", "num7_att", "num8_att", "num9_att", "numplus_att", "caps_att", "a_att", "s_att", "d_att", "f_att", "g_att", "h_att", "j_att", "k_att", "l_att", "sem_att", "quo_att", "enter_att", "num4_att", "num5_att", "num6_att", "lshift_att", "z_att", "x_att", "c_att", "v_att", "b_att", "n_att", "m_att", "comma_att", "dot_att", "qmark_att", "rshift_att", "up_att", "num1_att", "num2_att", "num3_att", "numenter_att", "lctrl_att", "win_att", "lalt_att", "space_att", "ralt_att", "fn_att", "book_att", "rctrl_att", "left_att", "down_att", "right_att", "num0_att", "numdot_att", "Upside1_att", "Upside2_att", "Upside3_att", "Upside4_att", "Upside5_att", "Upside6_att", "Upside7_att", "Upside8_att", "Upside9_att", "Upside10_att", "Upside11_att", "Upside12_att", "Upside13_att", "Upside14_att", "Upside15_att", "Upside16_att", "Upside17_att", "Upside18_att", "Upside19_att", "Upside20_att", "logo1_att", "logo2_att"]

	getclr01: any;
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


	red: any = new Buffer(new Array(125));
	green: any = new Buffer(new Array(125));
	blue: any = new Buffer(new Array(125));
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
				apMode[this.positionRarr[i]] = this.red[i];
				apMode[this.positionGarr[i]] = this.green[i];
				apMode[this.positionBarr[i]] = this.blue[i];
			}
			if (this.data == 0) {
				apMode[46] = 0xff;
				apMode[206] = 0x00;
				apMode[366] = 0x00;
				apMode[56] = 0xff;
				apMode[216] = 0x00;
				apMode[376] = 0x00;
			}
			else if (this.data == 1) {
				apMode[56] = this.red[124];
				apMode[216] = this.green[124];
				apMode[376] = this.blue[124];
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


	thelastEffect: any = this.round_med;

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
		// //this.setAPmode();//連續下值預備動作
		// this.LEDmatrix()//找出對應按鍵;
		// this.setDefault(1);
		let vm = this;
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
	Upside1: any = "";
	Upside2: any = "";
	Upside3: any = "";
	Upside4: any = "";
	Upside5: any = "";
	Upside6: any = "";
	Upside7: any = "";
	Upside8: any = "";
	Upside9: any = "";
	Upside10: any = "";
	Upside11: any = "";
	Upside12: any = "";
	Upside13: any = "";
	Upside14: any = "";
	Upside15: any = "";
	Upside16: any = "";
	Upside17: any = "";
	Upside18: any = "";
	Upside19: any = "";
	Upside20: any = "";
	logo1: any = "";
	logo2: any = "";



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
	num: any = 0;
	funcSet: any = "_med"
	keyFlag1: any = 0;
	keyFlag2: any = 0;
	funcInIcp() {
		switch (true) {
			case this.vKey == 27 && this.keyStatus == 1: //esc
				if (this.num == 0) {
					this.clear();
					// if (this.keyFlag1 == 0) {
					// 	this.keyFlag1 = 1
					// 	setTimeout(() => {
					// 		this.keyFlag1 = 0;
					// 		this.esc = '' + this.funcSet;
					// 		this.perid = '' + this.funcSet;
					// 		this.n1 = '' + this.funcSet;
					// 		this.Upside1 = '' + this.funcSet;
					// 		this.Upside2 = '' + this.funcSet;
					// 		this.f1 = '' + this.funcSet;
					// 		this.tab = '' + this.funcSet;
					// 		this.n2 = '' + this.funcSet;
					// 		this.w = '' + this.funcSet;
					// 		this.q = '' + this.funcSet;
					// 	}, 1000);
					// }
					this.esc = 'round1' + this.funcSet;
					this.perid = 'round1' + this.funcSet;
					this.n1 = 'round1' + this.funcSet;
					this.Upside1 = 'round1' + this.funcSet;
					this.Upside2 = 'round1_2' + this.funcSet;
					this.f1 = 'round1_2' + this.funcSet;
					this.tab = 'round1_2' + this.funcSet;
					this.n2 = 'round1_2' + this.funcSet;
					this.w = 'round1_2' + this.funcSet;
					this.q = 'round1_2' + this.funcSet;
					this.num = 1
				}
				else if (this.num == 1) {
					this.clear();
					// if (this.keyFlag2 == 0) {
					// 	this.keyFlag2 = 1
					// 	setTimeout(() => {
					// 		this.keyFlag2 = 0;
					// 		this.esc = '' + this.funcSet;
					// 		this.perid = '' + this.funcSet;
					// 		this.n1 = '' + this.funcSet;
					// 		this.Upside1 = '' + this.funcSet;
					// 		this.Upside2 = '' + this.funcSet;
					// 		this.f1 = '' + this.funcSet;
					// 		this.tab = '' + this.funcSet;
					// 		this.n2 = '' + this.funcSet;
					// 		this.w = '' + this.funcSet;
					// 		this.q = '' + this.funcSet
					// 	}, 1000);
					// }
					this.num = 0
					this.esc = 'round2' + this.funcSet;
					this.perid = 'round2' + this.funcSet;
					this.n1 = "round2" + this.funcSet;
					this.Upside1 = "round2" + this.funcSet;
					this.Upside2 = "round2_2" + this.funcSet;
					this.f1 = 'round2_2' + this.funcSet;
					this.tab = 'round2_2' + this.funcSet;
					this.n2 = 'round2_2' + this.funcSet;
					this.w = 'round2_2' + this.funcSet;
					this.q = 'round2_2' + this.funcSet;
				}
				break;
			case this.vKey == 112 && this.keyStatus == 1: //f1
				if (this.num == 0) {
					this.clear();
					// if (this.keyFlag1 == 0) {
					// 	this.keyFlag1 = 1
					// 	setTimeout(() => {
					// 		this.keyFlag1 = 0;
					// 		this.f1 = '' + this.funcSet;
					// 		this.f2 = '' + this.funcSet;
					// 		this.n1 = '' + this.funcSet;
					// 		this.n2 = '' + this.funcSet;
					// 		this.n3 = '' + this.funcSet;
					// 		this.Upside1 = '' + this.funcSet;
					// 		this.Upside2 = '' + this.funcSet;
					// 		this.Upside3 = '' + this.funcSet;
					// 		this.Upside3 = '' + this.funcSet;
					// 		this.esc = '' + this.funcSet
					// 		this.f3 = '' + this.funcSet
					// 		this.perid = '' + this.funcSet
					// 		this.tab = '' + this.funcSet
					// 		this.q = '' + this.funcSet
					// 		this.w = '' + this.funcSet
					// 		this.e = '' + this.funcSet
					// 		this.n4 = '' + this.funcSet
					// 	}, 1000);
					// }
					this.f1 = 'round1' + this.funcSet;
					this.f2 = 'round1' + this.funcSet;
					this.n1 = 'round1' + this.funcSet;
					this.n2 = 'round1' + this.funcSet;
					this.n3 = 'round1' + this.funcSet;
					this.Upside1 = 'round1' + this.funcSet;
					this.Upside2 = 'round1' + this.funcSet;
					this.Upside3 = 'round1' + this.funcSet;
					this.esc = 'round1_2' + this.funcSet
					this.f3 = 'round1_2' + this.funcSet
					this.perid = 'round1_2' + this.funcSet
					this.tab = 'round1_2' + this.funcSet
					this.q = 'round1_2' + this.funcSet
					this.w = 'round1_2' + this.funcSet
					this.e = 'round1_2' + this.funcSet
					this.n4 = 'round1_2' + this.funcSet
					this.num = 1
				}
				else if (this.num == 1) {
					this.clear();
					// if (this.keyFlag2 == 0) {
					// 	this.keyFlag2 = 1
					// 	setTimeout(() => {
					// 		this.keyFlag2 = 0;
					// 		this.f1 = '' + this.funcSet;
					// 		this.f2 = '' + this.funcSet;
					// 		this.n1 = '' + this.funcSet;
					// 		this.n2 = '' + this.funcSet;
					// 		this.n3 = '' + this.funcSet;
					// 		this.Upside1 = '' + this.funcSet;
					// 		this.Upside2 = '' + this.funcSet;
					// 		this.Upside3 = '' + this.funcSet;
					// 		this.esc = '' + this.funcSet
					// 		this.f3 = '' + this.funcSet
					// 		this.perid = '' + this.funcSet
					// 		this.tab = '' + this.funcSet
					// 		this.q = '' + this.funcSet
					// 		this.w = '' + this.funcSet
					// 		this.e = '' + this.funcSet
					// 		this.n4 = '' + this.funcSet
					// 	}, 1000);
					// }
					this.num = 0
					this.f1 = 'round2' + this.funcSet;
					this.f2 = 'round2' + this.funcSet;
					this.n1 = 'round2' + this.funcSet;
					this.n2 = 'round2' + this.funcSet;
					this.n3 = 'round2' + this.funcSet;
					this.Upside1 = 'round2' + this.funcSet;
					this.Upside2 = 'round2' + this.funcSet;
					this.Upside3 = 'round2' + this.funcSet;
					this.esc = 'round2_2' + this.funcSet
					this.f3 = 'round2_2' + this.funcSet
					this.perid = 'round2_2' + this.funcSet
					this.tab = 'round2_2' + this.funcSet
					this.q = 'round2_2' + this.funcSet
					this.w = 'round2_2' + this.funcSet
					this.e = 'round2_2' + this.funcSet
					this.n4 = 'round2_2' + this.funcSet
				}
				break;

			case this.vKey == 113 && this.keyStatus == 1: //f2
				if (this.num == 0) {
					this.clear();
					// if (this.keyFlag1 == 0) {
					// 	this.keyFlag1 = 1
					// 	setTimeout(() => {
					// 		this.keyFlag1 = 0;
					// 		this.f1 = '' + this.funcSet;
					// 		this.f2 = '' + this.funcSet;
					// 		this.f3 = '' + this.funcSet;
					// 		this.n2 = '' + this.funcSet;
					// 		this.n3 = '' + this.funcSet;
					// 		this.n4 = '' + this.funcSet;
					// 		this.Upside4 = '' + this.funcSet;
					// 		this.Upside2 = '' + this.funcSet;
					// 		this.Upside3 = '' + this.funcSet;
					// 		this.esc = '' + this.funcSet;
					// 		this.f4 = '' + this.funcSet;
					// 		this.n1 = '' + this.funcSet;
					// 		this.n5 = '' + this.funcSet;
					// 		this.q = '' + this.funcSet;
					// 		this.w = '' + this.funcSet;
					// 		this.e = '' + this.funcSet;
					// 		this.r = '' + this.funcSet;
					// 	}, 1000);
					// }
					this.f1 = 'round1' + this.funcSet;
					this.f2 = 'round1' + this.funcSet;
					this.f3 = 'round1' + this.funcSet;
					this.n2 = 'round1' + this.funcSet;
					this.n3 = 'round1' + this.funcSet;
					this.n4 = 'round1' + this.funcSet;
					this.Upside4 = 'round1' + this.funcSet;
					this.Upside2 = 'round1' + this.funcSet;
					this.Upside3 = 'round1' + this.funcSet;
					this.esc = 'round1_2' + this.funcSet;
					this.f4 = 'round1_2' + this.funcSet;
					this.n1 = 'round1_2' + this.funcSet;
					this.n5 = 'round1_2' + this.funcSet;
					this.q = 'round1_2' + this.funcSet;
					this.w = 'round1_2' + this.funcSet;
					this.e = 'round1_2' + this.funcSet;
					this.r = 'round1_2' + this.funcSet;
					this.num = 1
				}
				else if (this.num == 1) {
					this.clear();
					// if (this.keyFlag2 == 0) {
					// 	this.keyFlag2 = 1
					// 	setTimeout(() => {
					// 		this.keyFlag2 = 0;
					// 		this.f1 = '' + this.funcSet;
					// 		this.f2 = '' + this.funcSet;
					// 		this.f3 = '' + this.funcSet;
					// 		this.n2 = '' + this.funcSet;
					// 		this.n3 = '' + this.funcSet;
					// 		this.n4 = '' + this.funcSet;
					// 		this.Upside4 = '' + this.funcSet;
					// 		this.Upside2 = '' + this.funcSet;
					// 		this.Upside3 = '' + this.funcSet;
					// 		this.esc = '' + this.funcSet;
					// 		this.f4 = '' + this.funcSet;
					// 		this.n1 = '' + this.funcSet;
					// 		this.n5 = '' + this.funcSet;
					// 		this.q = '' + this.funcSet;
					// 		this.w = '' + this.funcSet;
					// 		this.e = '' + this.funcSet;
					// 		this.r = '' + this.funcSet;
					// 	}, 1000);
					// }
					this.num = 0
					this.f1 = 'round2' + this.funcSet;
					this.f2 = 'round2' + this.funcSet;
					this.f3 = 'round2' + this.funcSet;
					this.n2 = 'round2' + this.funcSet;
					this.n3 = 'round2' + this.funcSet;
					this.n4 = 'round2' + this.funcSet;
					this.Upside4 = 'round2' + this.funcSet;
					this.Upside2 = 'round2' + this.funcSet;
					this.Upside3 = 'round2' + this.funcSet;
					this.esc = 'round2_2' + this.funcSet;
					this.f4 = 'round2_2' + this.funcSet;
					this.n1 = 'round2_2' + this.funcSet;
					this.n5 = 'round2_2' + this.funcSet;
					this.q = 'round2_2' + this.funcSet;
					this.w = 'round2_2' + this.funcSet;
					this.e = 'round2_2' + this.funcSet;
					this.r = 'round2_2' + this.funcSet;
				}
				break;

			case this.vKey == 114 && this.keyStatus == 1: //f3
				if (this.num == 0) {
					this.clear();
					// if (this.keyFlag1 == 0) {
					// 	this.keyFlag1 = 1
					// 	setTimeout(() => {
					// 		this.keyFlag1 = 0;
					// 		this.f4 = '' + this.funcSet;
					// 		this.f2 = '' + this.funcSet;
					// 		this.f3 = '' + this.funcSet;
					// 		this.n5 = '' + this.funcSet;
					// 		this.n3 = '' + this.funcSet;
					// 		this.n4 = '' + this.funcSet;
					// 		this.Upside4 = '' + this.funcSet;
					// 		this.Upside5 = '' + this.funcSet;
					// 		this.Upside3 = '' + this.funcSet;
					// 		this.Upside2 = '' + this.funcSet;
					// 		this.Upside6 = '' + this.funcSet;
					// 		this.f1 = '' + this.funcSet;
					// 		this.f5 = '' + this.funcSet;
					// 		this.n2 = '' + this.funcSet;
					// 		this.n6 = '' + this.funcSet;
					// 		this.w = '' + this.funcSet;
					// 		this.e = '' + this.funcSet;
					// 		this.r = '' + this.funcSet;
					// 		this.t = '' + this.funcSet;
					// 	}, 1000);
					// }
					this.f4 = 'round1' + this.funcSet;
					this.f2 = 'round1' + this.funcSet;
					this.f3 = 'round1' + this.funcSet;
					this.n5 = 'round1' + this.funcSet;
					this.n3 = 'round1' + this.funcSet;
					this.n4 = 'round1' + this.funcSet;
					this.Upside4 = 'round1' + this.funcSet;
					this.Upside5 = 'round1' + this.funcSet;
					this.Upside3 = 'round1' + this.funcSet;
					this.Upside2 = 'round1_2' + this.funcSet;
					this.Upside6 = 'round1_2' + this.funcSet;
					this.f1 = 'round1_2' + this.funcSet;
					this.f5 = 'round1_2' + this.funcSet;
					this.n2 = 'round1_2' + this.funcSet;
					this.n6 = 'round1_2' + this.funcSet;
					this.w = 'round1_2' + this.funcSet;
					this.e = 'round1_2' + this.funcSet;
					this.r = 'round1_2' + this.funcSet;
					this.t = 'round1_2' + this.funcSet;
					this.num = 1
				}
				else if (this.num == 1) {
					this.clear();
					// if (this.keyFlag2 == 0) {
					// 	this.keyFlag2 = 1
					// 	setTimeout(() => {
					// 		this.keyFlag2 = 0;
					// 		this.f4 = '' + this.funcSet;
					// 		this.f2 = '' + this.funcSet;
					// 		this.f3 = '' + this.funcSet;
					// 		this.n5 = '' + this.funcSet;
					// 		this.n3 = '' + this.funcSet;
					// 		this.n4 = '' + this.funcSet;
					// 		this.Upside4 = '' + this.funcSet;
					// 		this.Upside5 = '' + this.funcSet;
					// 		this.Upside3 = '' + this.funcSet;
					// 		this.Upside2 = '' + this.funcSet;
					// 		this.Upside6 = '' + this.funcSet;
					// 		this.f1 = '' + this.funcSet;
					// 		this.f5 = '' + this.funcSet;
					// 		this.n2 = '' + this.funcSet;
					// 		this.n6 = '' + this.funcSet;
					// 		this.w = '' + this.funcSet;
					// 		this.e = '' + this.funcSet;
					// 		this.r = '' + this.funcSet;
					// 		this.t = '' + this.funcSet;
					// 	}, 1000);
					// }
					this.num = 0
					this.f4 = 'round2' + this.funcSet;
					this.f2 = 'round2' + this.funcSet;
					this.f3 = 'round2' + this.funcSet;
					this.n5 = 'round2' + this.funcSet;
					this.n3 = 'round2' + this.funcSet;
					this.n4 = 'round2' + this.funcSet;
					this.Upside4 = 'round2' + this.funcSet;
					this.Upside5 = 'round2' + this.funcSet;
					this.Upside3 = 'round2' + this.funcSet;
					this.Upside2 = 'round2' + this.funcSet;
					this.Upside6 = 'round2' + this.funcSet;
					this.f1 = 'round2_2' + this.funcSet;
					this.f5 = 'round2_2' + this.funcSet;
					this.n2 = 'round2_2' + this.funcSet;
					this.n6 = 'round2_2' + this.funcSet;
					this.w = 'round2_2' + this.funcSet;
					this.e = 'round2_2' + this.funcSet;
					this.r = 'round2_2' + this.funcSet;
					this.t = 'round2_2' + this.funcSet;
				}
				break;

			case this.vKey == 115 && this.keyStatus == 1: //f4
				if (this.num == 0) {
					this.clear();
					// if (this.keyFlag1 == 0) {
					// 	this.keyFlag1 = 1
					// 	setTimeout(() => {
					// 		this.keyFlag1 = 0;
					// 		this.f3 = '' + this.funcSet;
					// 		this.f4 = '' + this.funcSet;
					// 		this.n4 = '' + this.funcSet;
					// 		this.n5 = '' + this.funcSet;
					// 		this.n6 = '' + this.funcSet;
					// 		this.Upside4 = '' + this.funcSet;
					// 		this.Upside5 = '' + this.funcSet;
					// 		this.Upside6 = '' + this.funcSet;
					// 		this.Upside3 = '' + this.funcSet;
					// 		this.Upside7 = '' + this.funcSet;
					// 		this.n3 = '' + this.funcSet;
					// 		this.n7 = '' + this.funcSet;
					// 		this.e = '' + this.funcSet;
					// 		this.r = '' + this.funcSet;
					// 		this.t = '' + this.funcSet;
					// 		this.y = '' + this.funcSet;
					// 	}, 1000);
					// }
					this.f3 = 'round1' + this.funcSet;
					this.f4 = 'round1' + this.funcSet;
					this.n4 = 'round1' + this.funcSet;
					this.n5 = 'round1' + this.funcSet;
					this.n6 = 'round1' + this.funcSet;
					this.Upside4 = 'round1' + this.funcSet;
					this.Upside5 = 'round1' + this.funcSet;
					this.Upside6 = 'round1' + this.funcSet;
					this.Upside3 = 'round1_2' + this.funcSet;
					this.Upside7 = 'round1_2' + this.funcSet;
					this.n3 = 'round1_2' + this.funcSet;
					this.n7 = 'round1_2' + this.funcSet;
					this.e = 'round1_2' + this.funcSet;
					this.r = 'round1_2' + this.funcSet;
					this.t = 'round1_2' + this.funcSet;
					this.y = 'round1_2' + this.funcSet;
					this.num = 1
				}
				else if (this.num == 1) {
					this.clear();
					// if (this.keyFlag2 == 0) {
					// 	this.keyFlag2 = 1
					// 	setTimeout(() => {
					// 		this.keyFlag2 = 0;
					// 		this.f3 = '' + this.funcSet;
					// 		this.f4 = '' + this.funcSet;
					// 		this.n4 = '' + this.funcSet;
					// 		this.n5 = '' + this.funcSet;
					// 		this.n6 = '' + this.funcSet;
					// 		this.Upside4 = '' + this.funcSet;
					// 		this.Upside5 = '' + this.funcSet;
					// 		this.Upside6 = '' + this.funcSet;
					// 		this.Upside3 = '' + this.funcSet;
					// 		this.Upside7 = '' + this.funcSet;
					// 		this.n3 = '' + this.funcSet;
					// 		this.n7 = '' + this.funcSet;
					// 		this.e = '' + this.funcSet;
					// 		this.r = '' + this.funcSet;
					// 		this.t = '' + this.funcSet;
					// 		this.y = '' + this.funcSet;
					// 	}, 1000);
					// }
					this.num = 0
					this.f3 = 'round2' + this.funcSet;
					this.f4 = 'round2' + this.funcSet;
					this.n4 = 'round2' + this.funcSet;
					this.n5 = 'round2' + this.funcSet;
					this.n6 = 'round2' + this.funcSet;
					this.Upside4 = 'round2' + this.funcSet;
					this.Upside5 = 'round2' + this.funcSet;
					this.Upside6 = 'round2' + this.funcSet;
					this.Upside3 = 'round2_2' + this.funcSet;
					this.Upside7 = 'round2_2' + this.funcSet;
					this.n3 = 'round2_2' + this.funcSet;
					this.n7 = 'round2_2' + this.funcSet;
					this.e = 'round2_2' + this.funcSet;
					this.r = 'round2_2' + this.funcSet;
					this.t = 'round2_2' + this.funcSet;
					this.y = 'round2_2' + this.funcSet;
				}
				break;

			case this.vKey == 116 && this.keyStatus == 1: //f5
				if (this.num == 0) {
					this.clear();
					// if (this.keyFlag1 == 0) {
					// 	this.keyFlag1 = 1
					// 	setTimeout(() => {
					// 		this.keyFlag1 = 0;
					// 		this.f5 = '' + this.funcSet;
					// 		this.f6 = '' + this.funcSet;
					// 		this.n6 = '' + this.funcSet;
					// 		this.n7 = '' + this.funcSet;
					// 		this.n8 = '' + this.funcSet;
					// 		this.Upside7 = '' + this.funcSet;
					// 		this.Upside5 = '' + this.funcSet;
					// 		this.Upside6 = '' + this.funcSet;
					// 		this.Upside4 = '' + this.funcSet;
					// 		this.Upside8 = '' + this.funcSet;
					// 		this.f4 = '' + this.funcSet;
					// 		this.f7 = '' + this.funcSet;
					// 		this.n5 = '' + this.funcSet;
					// 		this.n9 = '' + this.funcSet;
					// 		this.t = '' + this.funcSet;
					// 		this.y = '' + this.funcSet;
					// 		this.u = '' + this.funcSet;
					// 		this.i = '' + this.funcSet;
					// 	}, 1000);
					// }
					this.f5 = 'round1' + this.funcSet;
					this.f6 = 'round1' + this.funcSet;
					this.n6 = 'round1' + this.funcSet;
					this.n7 = 'round1' + this.funcSet;
					this.n8 = 'round1' + this.funcSet;
					this.Upside7 = 'round1' + this.funcSet;
					this.Upside5 = 'round1' + this.funcSet;
					this.Upside6 = 'round1' + this.funcSet;
					this.Upside4 = 'round1_2' + this.funcSet;
					this.Upside8 = 'round1_2' + this.funcSet;
					this.f4 = 'round1_2' + this.funcSet;
					this.f7 = 'round1_2' + this.funcSet;
					this.n5 = 'round1_2' + this.funcSet;
					this.n9 = 'round1_2' + this.funcSet;
					this.t = 'round1_2' + this.funcSet;
					this.y = 'round1_2' + this.funcSet;
					this.u = 'round1_2' + this.funcSet;
					this.i = 'round1_2' + this.funcSet;
					this.num = 1
				}
				else if (this.num == 1) {
					this.clear();
					// if (this.keyFlag2 == 0) {
					// 	this.keyFlag2 = 1
					// 	setTimeout(() => {
					// 		this.f5 = '' + this.funcSet;
					// 		this.f6 = '' + this.funcSet;
					// 		this.n6 = '' + this.funcSet;
					// 		this.n7 = '' + this.funcSet;
					// 		this.n8 = '' + this.funcSet;
					// 		this.Upside7 = '' + this.funcSet;
					// 		this.Upside5 = '' + this.funcSet;
					// 		this.Upside6 = '' + this.funcSet;
					// 		this.Upside4 = '' + this.funcSet;
					// 		this.Upside8 = '' + this.funcSet;
					// 		this.f4 = '' + this.funcSet;
					// 		this.f7 = '' + this.funcSet;
					// 		this.n5 = '' + this.funcSet;
					// 		this.n9 = '' + this.funcSet;
					// 		this.t = '' + this.funcSet;
					// 		this.y = '' + this.funcSet;
					// 		this.u = '' + this.funcSet;
					// 		this.i = '' + this.funcSet;
					// 		this.keyFlag2 = 0;
					// 	}, 1000);
					// }
					this.num = 0
					this.f5 = 'round2' + this.funcSet;
					this.f6 = 'round2' + this.funcSet;
					this.n6 = 'round2' + this.funcSet;
					this.n7 = 'round2' + this.funcSet;
					this.n8 = 'round2' + this.funcSet;
					this.Upside7 = 'round2' + this.funcSet;
					this.Upside5 = 'round2' + this.funcSet;
					this.Upside6 = 'round2' + this.funcSet;
					this.Upside4 = 'round2_2' + this.funcSet;
					this.Upside8 = 'round2_2' + this.funcSet;
					this.f4 = 'round2_2' + this.funcSet;
					this.f7 = 'round2_2' + this.funcSet;
					this.n5 = 'round2_2' + this.funcSet;
					this.n9 = 'round2_2' + this.funcSet;
					this.t = 'round2_2' + this.funcSet;
					this.y = 'round2_2' + this.funcSet;
					this.u = 'round2_2' + this.funcSet;
					this.i = 'round2_2' + this.funcSet;
				}
				break;

			case this.vKey == 117 && this.keyStatus == 1: //f6
				if (this.num == 0) {
					this.clear();
					// if (this.keyFlag1 == 0) {
					// 	this.keyFlag1 = 1
					// 	setTimeout(() => {
					// 		this.keyFlag1 = 0;
					// 		this.f5 = '' + this.funcSet;
					// 		this.f6 = '' + this.funcSet;
					// 		this.f7 = '' + this.funcSet;
					// 		this.n7 = '' + this.funcSet;
					// 		this.n8 = '' + this.funcSet;
					// 		this.n9 = '' + this.funcSet;
					// 		this.Upside7 = '' + this.funcSet;
					// 		this.Upside8 = '' + this.funcSet;
					// 		this.Upside6 = '' + this.funcSet;
					// 		this.Upside5 = '' + this.funcSet;
					// 		this.Upside9 = '' + this.funcSet;
					// 		this.f4 = '' + this.funcSet;
					// 		this.f8 = '' + this.funcSet;
					// 		this.n6 = '' + this.funcSet;
					// 		this.n0 = '' + this.funcSet;
					// 		this.y = '' + this.funcSet;
					// 		this.u = '' + this.funcSet;
					// 		this.i = '' + this.funcSet;
					// 		this.o = '' + this.funcSet;
					// 	}, 1000);
					// }
					this.f5 = 'round1' + this.funcSet;
					this.f6 = 'round1' + this.funcSet;
					this.f7 = 'round1' + this.funcSet;
					this.n7 = 'round1' + this.funcSet;
					this.n8 = 'round1' + this.funcSet;
					this.n9 = 'round1' + this.funcSet;
					this.Upside7 = 'round1' + this.funcSet;
					this.Upside8 = 'round1' + this.funcSet;
					this.Upside6 = 'round1' + this.funcSet;
					this.Upside5 = 'round1_2' + this.funcSet;
					this.Upside9 = 'round1_2' + this.funcSet;
					this.f4 = 'round1_2' + this.funcSet;
					this.f8 = 'round1_2' + this.funcSet;
					this.n6 = 'round1_2' + this.funcSet;
					this.n0 = 'round1_2' + this.funcSet;
					this.y = 'round1_2' + this.funcSet;
					this.u = 'round1_2' + this.funcSet;
					this.i = 'round1_2' + this.funcSet;
					this.o = 'round1_2' + this.funcSet;
					this.num = 1
				}
				else if (this.num == 1) {
					this.clear();
					// if (this.keyFlag2 == 0) {
					// 	this.keyFlag2 = 1
					// 	setTimeout(() => {
					// 		this.keyFlag2 = 0;
					// 		this.f5 = '' + this.funcSet;
					// 		this.f6 = '' + this.funcSet;
					// 		this.f7 = '' + this.funcSet;
					// 		this.n7 = '' + this.funcSet;
					// 		this.n8 = '' + this.funcSet;
					// 		this.n9 = '' + this.funcSet;
					// 		this.Upside7 = '' + this.funcSet;
					// 		this.Upside8 = '' + this.funcSet;
					// 		this.Upside6 = '' + this.funcSet;
					// 		this.Upside5 = '' + this.funcSet;
					// 		this.Upside9 = '' + this.funcSet;
					// 		this.f4 = '' + this.funcSet;
					// 		this.f8 = '' + this.funcSet;
					// 		this.n6 = '' + this.funcSet;
					// 		this.n0 = '' + this.funcSet;
					// 		this.y = '' + this.funcSet;
					// 		this.u = '' + this.funcSet;
					// 		this.i = '' + this.funcSet;
					// 		this.o = '' + this.funcSet;
					// 	}, 1000);
					// }
					this.num = 0
					this.f5 = 'round2' + this.funcSet;
					this.f6 = 'round2' + this.funcSet;
					this.f7 = 'round2' + this.funcSet;
					this.n9 = 'round2' + this.funcSet;
					this.n7 = 'round2' + this.funcSet;
					this.n8 = 'round2' + this.funcSet;
					this.Upside7 = 'round2' + this.funcSet;
					this.Upside8 = 'round2' + this.funcSet;
					this.Upside6 = 'round2' + this.funcSet;
					this.Upside5 = 'round2_2' + this.funcSet;
					this.Upside9 = 'round2_2' + this.funcSet;
					this.f4 = 'round2_2' + this.funcSet;
					this.f8 = 'round2_2' + this.funcSet;
					this.n6 = 'round2_2' + this.funcSet;
					this.n0 = 'round2_2' + this.funcSet;
					this.y = 'round2_2' + this.funcSet;
					this.u = 'round2_2' + this.funcSet;
					this.i = 'round2_2' + this.funcSet;
					this.o = 'round2_2' + this.funcSet;
				}
				break;

			case this.vKey == 118 && this.keyStatus == 1: //f7
				if (this.num == 0) {
					this.clear();
					// if (this.keyFlag1 == 0) {
					// 	this.keyFlag1 = 1
					// 	setTimeout(() => {
					// 		this.keyFlag1 = 0;
					// 		this.f8 = '' + this.funcSet;
					// 		this.f6 = '' + this.funcSet;
					// 		this.f7 = '' + this.funcSet;
					// 		this.n0 = '' + this.funcSet;
					// 		this.n8 = '' + this.funcSet;
					// 		this.n9 = '' + this.funcSet;
					// 		this.Upside7 = '' + this.funcSet;
					// 		this.Upside8 = '' + this.funcSet;
					// 		this.Upside9 = '' + this.funcSet;
					// 		this.Upside6 = '' + this.funcSet
					// 		this.Upside10 = '' + this.funcSet
					// 		this.f5 = '' + this.funcSet
					// 		this.f10 = '' + this.funcSet
					// 		this.u = '' + this.funcSet
					// 		this.i = '' + this.funcSet
					// 		this.o = '' + this.funcSet
					// 		this.p = '' + this.funcSet
					// 	}, 1000);
					// }
					this.f8 = 'round1' + this.funcSet;
					this.f6 = 'round1' + this.funcSet;
					this.f7 = 'round1' + this.funcSet;
					this.n0 = 'round1' + this.funcSet;
					this.n8 = 'round1' + this.funcSet;
					this.n9 = 'round1' + this.funcSet;
					this.Upside7 = 'round1' + this.funcSet;
					this.Upside8 = 'round1' + this.funcSet;
					this.Upside9 = 'round1' + this.funcSet;
					this.Upside6 = 'round1_2' + this.funcSet
					this.Upside10 = 'round1_2' + this.funcSet
					this.f5 = 'round1_2' + this.funcSet
					this.f10 = 'round1_2' + this.funcSet
					this.u = 'round1_2' + this.funcSet
					this.i = 'round1_2' + this.funcSet
					this.o = 'round1_2' + this.funcSet
					this.p = 'round1_2' + this.funcSet
					this.num = 1
				}
				else if (this.num == 1) {
					this.clear();
					// if (this.keyFlag2 == 0) {
					// 	this.keyFlag2 = 1
					// 	setTimeout(() => {
					// 		this.keyFlag2 = 0;
					// 		this.f8 = '' + this.funcSet;
					// 		this.f6 = '' + this.funcSet;
					// 		this.f7 = '' + this.funcSet;
					// 		this.n0 = '' + this.funcSet;
					// 		this.n8 = '' + this.funcSet;
					// 		this.n9 = '' + this.funcSet;
					// 		this.Upside7 = '' + this.funcSet;
					// 		this.Upside8 = '' + this.funcSet;
					// 		this.Upside9 = '' + this.funcSet;
					// 		this.Upside6 = '' + this.funcSet
					// 		this.Upside10 = '' + this.funcSet
					// 		this.f5 = '' + this.funcSet
					// 		this.f10 = '' + this.funcSet
					// 		this.u = '' + this.funcSet
					// 		this.i = '' + this.funcSet
					// 		this.o = '' + this.funcSet
					// 		this.p = '' + this.funcSet
					// 	}, 1000);
					// }
					this.num = 0
					this.f8 = 'round2' + this.funcSet;
					this.f6 = 'round2' + this.funcSet;
					this.f7 = 'round2' + this.funcSet;
					this.n0 = 'round2' + this.funcSet;
					this.n8 = 'round2' + this.funcSet;
					this.n9 = 'round2' + this.funcSet;
					this.Upside7 = 'round2' + this.funcSet;
					this.Upside8 = 'round2' + this.funcSet;
					this.Upside9 = 'round2' + this.funcSet;
					this.Upside6 = 'round2_2' + this.funcSet
					this.Upside10 = 'round2_2' + this.funcSet
					this.f5 = 'round2_2' + this.funcSet
					this.f10 = 'round2_2' + this.funcSet
					this.u = 'round2_2' + this.funcSet
					this.i = 'round2_2' + this.funcSet
					this.o = 'round2_2' + this.funcSet
					this.p = 'round2_2' + this.funcSet
				}
				break;

			case this.vKey == 119 && this.keyStatus == 1: //f8
				if (this.num == 0) {
					this.clear();
					// if (this.keyFlag1 == 0) {
					// 	this.keyFlag1 = 1
					// 	setTimeout(() => {
					// 		this.keyFlag1 = 0;
					// 		this.f8 = '' + this.funcSet;
					// 		this.f9 = '' + this.funcSet;
					// 		this.f7 = '' + this.funcSet;
					// 		this.n0 = '' + this.funcSet;
					// 		this.minus = '' + this.funcSet;
					// 		this.n9 = '' + this.funcSet;
					// 		this.Upside10 = '' + this.funcSet;
					// 		this.Upside8 = '' + this.funcSet;
					// 		this.Upside9 = '' + this.funcSet;
					// 		this.logo1 = '' + this.funcSet;
					// 		this.logo2 = '' + this.funcSet;
					// 		this.f6 = '' + this.funcSet;
					// 		this.f10 = '' + this.funcSet;
					// 		this.n9 = '' + this.funcSet;
					// 		this.minus = '' + this.funcSet;
					// 		this.i = '' + this.funcSet;
					// 		this.o = '' + this.funcSet;
					// 		this.p = '' + this.funcSet;
					// 		this.lqu = '' + this.funcSet;

					// 	}, 1000);
					// }
					this.f8 = 'round1' + this.funcSet;
					this.f9 = 'round1' + this.funcSet;
					this.f7 = 'round1' + this.funcSet;
					this.n0 = 'round1' + this.funcSet;
					this.minus = 'round1' + this.funcSet;
					this.n9 = 'round1' + this.funcSet;
					this.Upside10 = 'round1' + this.funcSet;
					this.Upside8 = 'round1' + this.funcSet;
					this.Upside9 = 'round1' + this.funcSet;
					this.logo1 = 'round1' + this.funcSet;
					this.logo2 = 'round1' + this.funcSet;
					this.f6 = 'round1_2' + this.funcSet;
					this.f10 = 'round1_2' + this.funcSet;
					this.n9 = 'round1_2' + this.funcSet;
					this.minus = 'round1_2' + this.funcSet;
					this.i = 'round1_2' + this.funcSet;
					this.o = 'round1_2' + this.funcSet;
					this.p = 'round1_2' + this.funcSet;
					this.lqu = 'round1_2' + this.funcSet;
					this.num = 1
				}
				else if (this.num == 1) {
					this.clear();
					// if (this.keyFlag2 == 0) {
					// 	this.keyFlag2 = 1
					// 	setTimeout(() => {
					// 		this.keyFlag2 = 0;
					// 		this.f8 = '' + this.funcSet;
					// 		this.f9 = '' + this.funcSet;
					// 		this.f7 = '' + this.funcSet;
					// 		this.n0 = '' + this.funcSet;
					// 		this.minus = '' + this.funcSet;
					// 		this.n9 = '' + this.funcSet;
					// 		this.Upside10 = '' + this.funcSet;
					// 		this.Upside8 = '' + this.funcSet;
					// 		this.Upside9 = '' + this.funcSet;
					// 		this.logo1 = '' + this.funcSet;
					// 		this.logo2 = '' + this.funcSet;
					// 		this.f6 = '' + this.funcSet;
					// 		this.f10 = '' + this.funcSet;
					// 		this.n9 = '' + this.funcSet;
					// 		this.minus = '' + this.funcSet;
					// 		this.i = '' + this.funcSet;
					// 		this.o = '' + this.funcSet;
					// 		this.p = '' + this.funcSet;
					// 		this.lqu = '' + this.funcSet;
					// 	}, 1000);
					// }
					this.num = 0
					this.f8 = 'round2' + this.funcSet;
					this.f9 = 'round2' + this.funcSet;
					this.f7 = 'round2' + this.funcSet;
					this.n0 = 'round2' + this.funcSet;
					this.minus = 'round2' + this.funcSet;
					this.n9 = 'round2' + this.funcSet;
					this.Upside10 = 'round2' + this.funcSet;
					this.Upside8 = 'round2' + this.funcSet;
					this.Upside9 = 'round2' + this.funcSet;
					this.logo1 = 'round2' + this.funcSet;
					this.logo2 = 'round2' + this.funcSet;
					this.f6 = 'round2_2' + this.funcSet;
					this.f10 = 'round2_2' + this.funcSet;
					this.n9 = 'round2_2' + this.funcSet;
					this.minus = 'round2_2' + this.funcSet;
					this.i = 'round2_2' + this.funcSet;
					this.o = 'round2_2' + this.funcSet;
					this.p = 'round2_2' + this.funcSet;
					this.lqu = 'round2_2' + this.funcSet;
				}
				break;

			case this.vKey == 120 && this.keyStatus == 1: //f9
				if (this.num == 0) {
					this.clear();
					// if (this.keyFlag1 == 0) {
					// 	this.keyFlag1 = 1
					// 	setTimeout(() => {
					// 		this.keyFlag1 = 0;
					// 		this.f8 = '' + this.funcSet;
					// 		this.f9 = '' + this.funcSet;
					// 		this.f10 = '' + this.funcSet;
					// 		this.n0 = '' + this.funcSet;
					// 		this.minus = '' + this.funcSet;
					// 		this.plus = '' + this.funcSet;
					// 		this.Upside10 = '' + this.funcSet;
					// 		this.Upside11 = '' + this.funcSet;
					// 		this.Upside12 = '' + this.funcSet;
					// 		this.logo1 = '' + this.funcSet;
					// 		this.logo2 = '' + this.funcSet;
					// 		this.f7 = '' + this.funcSet;
					// 		this.f11 = '' + this.funcSet;
					// 		this.n9 = '' + this.funcSet;
					// 		this.bsp = '' + this.funcSet;
					// 		this.o = '' + this.funcSet;
					// 		this.p = '' + this.funcSet;
					// 		this.lqu = '' + this.funcSet;
					// 		this.rqu = '' + this.funcSet;
					// 	}, 1000);
					// }
					this.f8 = 'round1' + this.funcSet;
					this.f9 = 'round1' + this.funcSet;
					this.f10 = 'round1' + this.funcSet;
					this.n0 = 'round1' + this.funcSet;
					this.minus = 'round1' + this.funcSet;
					this.plus = 'round1' + this.funcSet;
					this.Upside10 = 'round1' + this.funcSet;
					this.Upside11 = 'round1' + this.funcSet;
					this.Upside12 = 'round1' + this.funcSet;
					this.logo1 = 'round1' + this.funcSet;
					this.logo2 = 'round1' + this.funcSet;
					this.f7 = 'round1_2' + this.funcSet;
					this.f11 = 'round1_2' + this.funcSet;
					this.n9 = 'round1_2' + this.funcSet;
					this.bsp = 'round1_2' + this.funcSet;
					this.o = 'round1_2' + this.funcSet;
					this.p = 'round1_2' + this.funcSet;
					this.lqu = 'round1_2' + this.funcSet;
					this.rqu = 'round1_2' + this.funcSet;
					this.num = 1
				}
				else if (this.num == 1) {
					this.clear();
					// if (this.keyFlag2 == 0) {
					// 	this.keyFlag2 = 1
					// 	setTimeout(() => {
					// 		this.keyFlag2 = 0;
					// 		this.f8 = '' + this.funcSet;
					// 		this.f9 = '' + this.funcSet;
					// 		this.f10 = '' + this.funcSet;
					// 		this.n0 = '' + this.funcSet;
					// 		this.minus = '' + this.funcSet;
					// 		this.plus = '' + this.funcSet;
					// 		this.Upside10 = '' + this.funcSet;
					// 		this.Upside11 = '' + this.funcSet;
					// 		this.Upside12 = '' + this.funcSet;
					// 		this.logo1 = '' + this.funcSet;
					// 		this.logo2 = '' + this.funcSet;
					// 		this.f7 = '' + this.funcSet;
					// 		this.f11 = '' + this.funcSet;
					// 		this.n9 = '' + this.funcSet;
					// 		this.bsp = '' + this.funcSet;
					// 		this.o = '' + this.funcSet;
					// 		this.p = '' + this.funcSet;
					// 		this.lqu = '' + this.funcSet;
					// 		this.rqu = '' + this.funcSet;
					// 	}, 1000);
					// }
					this.num = 0
					this.f8 = 'round2' + this.funcSet;
					this.f9 = 'round2' + this.funcSet;
					this.f10 = 'round2' + this.funcSet;
					this.n0 = 'round2' + this.funcSet;
					this.minus = 'round2' + this.funcSet;
					this.plus = 'round2' + this.funcSet;
					this.Upside10 = 'round2' + this.funcSet;
					this.Upside11 = 'round2' + this.funcSet;
					this.Upside12 = 'round2' + this.funcSet;
					this.logo1 = 'round2' + this.funcSet;
					this.logo2 = 'round2' + this.funcSet;
					this.f7 = 'round2_2' + this.funcSet;
					this.f11 = 'round2_2' + this.funcSet;
					this.n9 = 'round2_2' + this.funcSet;
					this.bsp = 'round2_2' + this.funcSet;
					this.o = 'round2_2' + this.funcSet;
					this.p = 'round2_2' + this.funcSet;
					this.lqu = 'round2_2' + this.funcSet;
					this.rqu = 'round2_2' + this.funcSet;
				}
				break;

			case this.vKey == 121 && this.keyStatus == 1: //f10
				if (this.num == 0) {
					this.clear();
					// if (this.keyFlag1 == 0) {
					// 	this.keyFlag1 = 1
					// 	setTimeout(() => {
					// 		this.keyFlag1 = 0;
					// 		this.f11 = '' + this.funcSet;
					// 		this.f9 = '' + this.funcSet;
					// 		this.f10 = '' + this.funcSet;
					// 		this.minus = '' + this.funcSet;
					// 		this.plus = '' + this.funcSet;
					// 		this.Upside11 = '' + this.funcSet;
					// 		this.Upside12 = '' + this.funcSet;
					// 		this.logo1 = '' + this.funcSet;
					// 		this.logo2 = '' + this.funcSet;
					// 		this.f8 = '' + this.funcSet;
					// 		this.f12 = '' + this.funcSet;
					// 		this.n0 = '' + this.funcSet;
					// 		this.bsp = '' + this.funcSet;
					// 		this.p = '' + this.funcSet;
					// 		this.lqu = '' + this.funcSet;
					// 		this.rqu = '' + this.funcSet;
					// 		this.drawn = '' + this.funcSet;
					// 	}, 1000);
					// }
					this.f11 = 'round1' + this.funcSet;
					this.f9 = 'round1' + this.funcSet;
					this.f10 = 'round1' + this.funcSet;
					this.minus = 'round1' + this.funcSet;
					this.plus = 'round1' + this.funcSet;
					this.Upside11 = 'round1' + this.funcSet;
					this.Upside12 = 'round1' + this.funcSet;
					this.logo1 = 'round1' + this.funcSet;
					this.logo2 = 'round1' + this.funcSet;
					this.f8 = 'round1_2' + this.funcSet;
					this.f12 = 'round1_2' + this.funcSet;
					this.n0 = 'round1_2' + this.funcSet;
					this.bsp = 'round1_2' + this.funcSet;
					this.p = 'round1_2' + this.funcSet;
					this.lqu = 'round1_2' + this.funcSet;
					this.rqu = 'round1_2' + this.funcSet;
					this.drawn = 'round1_2' + this.funcSet;
					this.num = 1
				}
				else if (this.num == 1) {
					this.clear();
					// if (this.keyFlag2 == 0) {
					// 	this.keyFlag2 = 1
					// 	setTimeout(() => {
					// 		this.keyFlag2 = 0;
					// 		this.f11 = '' + this.funcSet;
					// 		this.f9 = '' + this.funcSet;
					// 		this.f10 = '' + this.funcSet;
					// 		this.minus = '' + this.funcSet;
					// 		this.plus = '' + this.funcSet;
					// 		this.Upside11 = '' + this.funcSet;
					// 		this.Upside12 = '' + this.funcSet;
					// 		this.logo1 = '' + this.funcSet;
					// 		this.logo2 = '' + this.funcSet;
					// 		this.f8 = '' + this.funcSet;
					// 		this.f12 = '' + this.funcSet;
					// 		this.n0 = '' + this.funcSet;
					// 		this.bsp = '' + this.funcSet;
					// 		this.p = '' + this.funcSet;
					// 		this.lqu = '' + this.funcSet;
					// 		this.rqu = '' + this.funcSet;
					// 		this.drawn = '' + this.funcSet;
					// 	}, 1000);
					// }
					this.num = 0
					this.f11 = 'round2' + this.funcSet;
					this.f9 = 'round2' + this.funcSet;
					this.f10 = 'round2' + this.funcSet;
					this.minus = 'round2' + this.funcSet;
					this.plus = 'round2' + this.funcSet;
					this.Upside11 = 'round2' + this.funcSet;
					this.Upside12 = 'round2' + this.funcSet;
					this.logo1 = 'round2' + this.funcSet;
					this.logo2 = 'round2' + this.funcSet;
					this.f8 = 'round2_2' + this.funcSet;
					this.f12 = 'round2_2' + this.funcSet;
					this.n0 = 'round2_2' + this.funcSet;
					this.bsp = 'round2_2' + this.funcSet;
					this.p = 'round2_2' + this.funcSet;
					this.lqu = 'round2_2' + this.funcSet;
					this.rqu = 'round2_2' + this.funcSet;
					this.drawn = 'round2_2' + this.funcSet;
				}
				break;

			case this.vKey == 122 && this.keyStatus == 1: //f11
				if (this.num == 0) {
					this.clear();
					// if (this.keyFlag1 == 0) {
					// 	this.keyFlag1 = 1
					// 	setTimeout(() => {
					// 		this.keyFlag1 = 0;
					// 		this.f11 = '' + this.funcSet;
					// 		this.f12 = '' + this.funcSet;
					// 		this.f10 = '' + this.funcSet;
					// 		this.bsp = '' + this.funcSet;
					// 		this.plus = '' + this.funcSet;
					// 		this.Upside11 = '' + this.funcSet;
					// 		this.Upside12 = '' + this.funcSet;
					// 		this.Upside13 = '' + this.funcSet;
					// 		this.logo1 = '' + this.funcSet;
					// 		this.logo2 = '' + this.funcSet;
					// 		this.Upside14 = '' + this.funcSet
					// 		this.f9 = '' + this.funcSet;
					// 		this.print = '' + this.funcSet;
					// 		this.insert = '' + this.funcSet;
					// 		this.lqu = '' + this.funcSet;
					// 		this.rqu = '' + this.funcSet;
					// 		this.drawn = '' + this.funcSet;
					// 		this.delete = '' + this.funcSet;
					// 	}, 1000);
					// }
					this.f11 = 'round1' + this.funcSet;
					this.f12 = 'round1' + this.funcSet;
					this.f10 = 'round1' + this.funcSet;
					this.bsp = 'round1' + this.funcSet;
					this.plus = 'round1' + this.funcSet;
					this.Upside11 = 'round1' + this.funcSet;
					this.Upside12 = 'round1' + this.funcSet;
					this.Upside13 = 'round1' + this.funcSet;
					this.logo1 = 'round1_2' + this.funcSet;
					this.logo2 = 'round1_2' + this.funcSet;
					this.Upside14 = 'round1_2' + this.funcSet
					this.f9 = 'round1_2' + this.funcSet;
					this.print = 'round1_2' + this.funcSet;
					this.insert = 'round1_2' + this.funcSet;
					this.lqu = 'round1_2' + this.funcSet;
					this.rqu = 'round1_2' + this.funcSet;
					this.drawn = 'round1_2' + this.funcSet;
					this.delete = 'round1_2' + this.funcSet;
					this.num = 1
				}
				else if (this.num == 1) {
					this.clear();
					// if (this.keyFlag2 == 0) {
					// 	this.keyFlag2 = 1
					// 	setTimeout(() => {
					// 		this.keyFlag2 = 0;
					// 		this.f11 = '' + this.funcSet;
					// 		this.f12 = '' + this.funcSet;
					// 		this.f10 = '' + this.funcSet;
					// 		this.bsp = '' + this.funcSet;
					// 		this.plus = '' + this.funcSet;
					// 		this.Upside11 = '' + this.funcSet;
					// 		this.Upside12 = '' + this.funcSet;
					// 		this.Upside13 = '' + this.funcSet;
					// 		this.logo1 = '' + this.funcSet;
					// 		this.logo2 = '' + this.funcSet;
					// 		this.Upside14 = '' + this.funcSet
					// 		this.f9 = '' + this.funcSet;
					// 		this.print = '' + this.funcSet;
					// 		this.insert = '' + this.funcSet;
					// 		this.lqu = '' + this.funcSet;
					// 		this.rqu = '' + this.funcSet;
					// 		this.drawn = '' + this.funcSet;
					// 		this.delete = '' + this.funcSet;
					// 	}, 1000);
					// }
					this.num = 0
					this.f11 = 'round2' + this.funcSet;
					this.f12 = 'round2' + this.funcSet;
					this.f10 = 'round2' + this.funcSet;
					this.bsp = 'round2' + this.funcSet;
					this.plus = 'round2' + this.funcSet;
					this.Upside11 = 'round2' + this.funcSet;
					this.Upside12 = 'round2' + this.funcSet;
					this.Upside13 = 'round2' + this.funcSet;
					this.logo1 = 'round2_2' + this.funcSet;
					this.logo2 = 'round2_2' + this.funcSet;
					this.Upside14 = 'round2_2' + this.funcSet
					this.f9 = 'round2_2' + this.funcSet;
					this.print = 'round2_2' + this.funcSet;
					this.insert = 'round2_2' + this.funcSet;
					this.lqu = 'round2_2' + this.funcSet;
					this.rqu = 'round2_2' + this.funcSet;
					this.drawn = 'round2_2' + this.funcSet;
					this.delete = 'round2_2' + this.funcSet;
				}
				break;

			case this.vKey == 123 && this.keyStatus == 1: //f12
				if (this.num == 0) {
					this.clear();
					// if (this.keyFlag1 == 0) {
					// 	this.keyFlag1 = 1
					// 	setTimeout(() => {
					// 		this.keyFlag1 = 0;
					// 		this.f11 = '' + this.funcSet;
					// 		this.f12 = '' + this.funcSet;
					// 		this.print = '' + this.funcSet;
					// 		this.bsp = '' + this.funcSet;
					// 		this.insert = '' + this.funcSet;
					// 		this.Upside14 = '' + this.funcSet;
					// 		this.Upside12 = '' + this.funcSet;
					// 		this.Upside13 = '' + this.funcSet;
					// 		this.Upside11 = '' + this.funcSet;
					// 		this.Upside14 = '' + this.funcSet;
					// 		this.scroll = '' + this.funcSet;
					// 		this.home = '' + this.funcSet;
					// 		this.rqu = '' + this.funcSet;
					// 		this.drawn = '' + this.funcSet;
					// 		this.delete = '' + this.funcSet;
					// 		this.end = '' + this.funcSet;
					// 	}, 1000);
					// }
					this.f11 = 'round1' + this.funcSet;
					this.f12 = 'round1' + this.funcSet;
					this.print = 'round1' + this.funcSet;
					this.bsp = 'round1' + this.funcSet;
					this.insert = 'round1' + this.funcSet;
					this.Upside14 = 'round1' + this.funcSet;
					this.Upside12 = 'round1' + this.funcSet;
					this.Upside13 = 'round1' + this.funcSet;
					this.Upside11 = 'round1_2' + this.funcSet;
					this.Upside14 = 'round1_2' + this.funcSet;
					this.scroll = 'round1_2' + this.funcSet;
					this.home = 'round1_2' + this.funcSet;
					this.rqu = 'round1_2' + this.funcSet;
					this.drawn = 'round1_2' + this.funcSet;
					this.delete = 'round1_2' + this.funcSet;
					this.end = 'round1_2' + this.funcSet;
					this.num = 1
				}
				else if (this.num == 1) {
					this.clear();
					// if (this.keyFlag2 == 0) {
					// 	this.keyFlag2 = 1
					// 	setTimeout(() => {
					// 		this.keyFlag2 = 0;
					// 		this.f11 = '' + this.funcSet;
					// 		this.f12 = '' + this.funcSet;
					// 		this.print = '' + this.funcSet;
					// 		this.bsp = '' + this.funcSet;
					// 		this.insert = '' + this.funcSet;
					// 		this.Upside14 = '' + this.funcSet;
					// 		this.Upside12 = '' + this.funcSet;
					// 		this.Upside13 = '' + this.funcSet;
					// 		this.Upside11 = '' + this.funcSet;
					// 		this.Upside14 = '' + this.funcSet;
					// 		this.scroll = '' + this.funcSet;
					// 		this.home = '' + this.funcSet;
					// 		this.rqu = '' + this.funcSet;
					// 		this.drawn = '' + this.funcSet;
					// 		this.delete = '' + this.funcSet;
					// 		this.end = '' + this.funcSet;
					// 	}, 1000);
					// }
					this.num = 0
					this.f11 = 'round2' + this.funcSet;
					this.f12 = 'round2' + this.funcSet;
					this.print = 'round2' + this.funcSet;
					this.bsp = 'round2' + this.funcSet;
					this.insert = 'round2' + this.funcSet;
					this.Upside14 = 'round2' + this.funcSet;
					this.Upside12 = 'round2' + this.funcSet;
					this.Upside13 = 'round2' + this.funcSet;
					this.Upside11 = 'round2_2' + this.funcSet;
					this.Upside14 = 'round2_2' + this.funcSet;
					this.scroll = 'round2_2' + this.funcSet;
					this.home = 'round2_2' + this.funcSet;
					this.rqu = 'round2_2' + this.funcSet;
					this.drawn = 'round2_2' + this.funcSet;
					this.delete = 'round2_2' + this.funcSet;
					this.end = 'round2_2' + this.funcSet;
				}
				break;

			case this.vKey == 145 && this.keyStatus == 1: //scroll
				if (this.num == 0) {
					this.clear();
					// if (this.keyFlag1 == 0) {
					// 	this.keyFlag1 = 1
					// 	setTimeout(() => {
					// 		this.keyFlag1 = 0;
					// 		this.print = '' + this.funcSet;
					// 		this.scroll = '' + this.funcSet;
					// 		this.pause = '' + this.funcSet;
					// 		this.home = '' + this.funcSet;
					// 		this.insert = '' + this.funcSet;
					// 		this.pup = '' + this.funcSet;
					// 		this.Upside14 = '' + this.funcSet;
					// 		this.Upside15 = '' + this.funcSet;
					// 		this.Upside13 = '' + this.funcSet;
					// 		this.Upside12 = '' + this.funcSet;
					// 		this.Upside16 = '' + this.funcSet;
					// 		this.f12 = '' + this.funcSet;
					// 		this.bsp = '' + this.funcSet;
					// 		this.numlock = '' + this.funcSet;
					// 		this.delete = '' + this.funcSet;
					// 		this.end = '' + this.funcSet;
					// 		this.pdown = '' + this.funcSet;
					// 	}, 1000);
					// }
					this.print = 'round1' + this.funcSet;
					this.scroll = 'round1' + this.funcSet;
					this.pause = 'round1' + this.funcSet;
					this.home = 'round1' + this.funcSet;
					this.insert = 'round1' + this.funcSet;
					this.pup = 'round1' + this.funcSet;
					this.Upside14 = 'round1' + this.funcSet;
					this.Upside15 = 'round1' + this.funcSet;
					this.Upside13 = 'round1' + this.funcSet;
					this.Upside12 = 'round1_2' + this.funcSet;
					this.Upside16 = 'round1_2' + this.funcSet;
					this.f12 = 'round1_2' + this.funcSet;
					this.bsp = 'round1_2' + this.funcSet;
					this.numlock = 'round1_2' + this.funcSet;
					this.delete = 'round1_2' + this.funcSet;
					this.end = 'round1_2' + this.funcSet;
					this.pdown = 'round1_2' + this.funcSet;
					this.num = 1
				}
				else if (this.num == 1) {
					this.clear();
					// if (this.keyFlag2 == 0) {
					// 	this.keyFlag2 = 1
					// 	setTimeout(() => {
					// 		this.keyFlag2 = 0;
					// 		this.print = '' + this.funcSet;
					// 		this.scroll = '' + this.funcSet;
					// 		this.pause = '' + this.funcSet;
					// 		this.home = '' + this.funcSet;
					// 		this.insert = '' + this.funcSet;
					// 		this.pup = '' + this.funcSet;
					// 		this.Upside14 = '' + this.funcSet;
					// 		this.Upside15 = '' + this.funcSet;
					// 		this.Upside13 = '' + this.funcSet;
					// 		this.Upside12 = '' + this.funcSet;
					// 		this.Upside16 = '' + this.funcSet;
					// 		this.f12 = '' + this.funcSet;
					// 		this.bsp = '' + this.funcSet;
					// 		this.numlock = '' + this.funcSet;
					// 		this.delete = '' + this.funcSet;
					// 		this.end = '' + this.funcSet;
					// 		this.pdown = '' + this.funcSet;
					// 	}, 1000);
					// }
					this.num = 0
					this.print = 'round2' + this.funcSet;
					this.scroll = 'round2' + this.funcSet;
					this.pause = 'round2' + this.funcSet;
					this.home = 'round2' + this.funcSet;
					this.insert = 'round2' + this.funcSet;
					this.pup = 'round2' + this.funcSet;
					this.Upside14 = 'round2' + this.funcSet;
					this.Upside15 = 'round2' + this.funcSet;
					this.Upside13 = 'round2' + this.funcSet;
					this.Upside12 = 'round2_2' + this.funcSet;
					this.Upside16 = 'round2_2' + this.funcSet;
					this.f12 = 'round2_2' + this.funcSet;
					this.bsp = 'round2_2' + this.funcSet;
					this.numlock = 'round2_2' + this.funcSet;
					this.delete = 'round2_2' + this.funcSet;
					this.end = 'round2_2' + this.funcSet;
					this.pdown = 'round2_2' + this.funcSet;
				}
				break;
			case this.vKey == 19 && this.keyStatus == 1: //pause
				if (this.num == 0) {
					this.clear();
					// if (this.keyFlag1 == 0) {
					// 	this.keyFlag1 = 1
					// 	setTimeout(() => {
					// 		this.keyFlag1 = 0;
					// 		this.scroll = '' + this.funcSet;
					// 		this.numlock = '' + this.funcSet;
					// 		this.pause = '' + this.funcSet;
					// 		this.home = '' + this.funcSet;
					// 		this.pup = '' + this.funcSet;
					// 		this.Upside14 = '' + this.funcSet;
					// 		this.Upside15 = '' + this.funcSet;
					// 		this.Upside16 = '' + this.funcSet;
					// 		this.Upside13 = '' + this.funcSet;
					// 		this.Upside17 = '' + this.funcSet;
					// 		this.print = '' + this.funcSet;
					// 		this.insert = '' + this.funcSet;
					// 		this.numdrawn = '' + this.funcSet;
					// 		this.end = '' + this.funcSet;
					// 		this.pdown = '' + this.funcSet;
					// 		this.num7 = '' + this.funcSet;
					// 	}, 1000);
					// }
					this.scroll = 'round1' + this.funcSet;
					this.numlock = 'round1' + this.funcSet;
					this.pause = 'round1' + this.funcSet;
					this.home = 'round1' + this.funcSet;
					this.pup = 'round1' + this.funcSet;
					this.Upside14 = 'round1' + this.funcSet;
					this.Upside15 = 'round1' + this.funcSet;
					this.Upside16 = 'round1' + this.funcSet;
					this.Upside13 = 'round1_2' + this.funcSet;
					this.Upside17 = 'round1_2' + this.funcSet;
					this.print = 'round1_2' + this.funcSet;
					this.insert = 'round1_2' + this.funcSet;
					this.numdrawn = 'round1_2' + this.funcSet;
					this.end = 'round1_2' + this.funcSet;
					this.pdown = 'round1_2' + this.funcSet;
					this.num7 = 'round1_2' + this.funcSet;
					this.num = 1
				}
				else if (this.num == 1) {
					this.clear();
					// if (this.keyFlag2 == 0) {
					// 	this.keyFlag2 = 1
					// 	setTimeout(() => {
					// 		this.keyFlag2 = 0;
					// 		this.scroll = '' + this.funcSet;
					// 		this.numlock = '' + this.funcSet;
					// 		this.pause = '' + this.funcSet;
					// 		this.home = '' + this.funcSet;
					// 		this.pup = '' + this.funcSet;
					// 		this.Upside14 = '' + this.funcSet;
					// 		this.Upside15 = '' + this.funcSet;
					// 		this.Upside16 = '' + this.funcSet;
					// 		this.Upside13 = '' + this.funcSet;
					// 		this.Upside17 = '' + this.funcSet;
					// 		this.print = '' + this.funcSet;
					// 		this.insert = '' + this.funcSet;
					// 		this.numdrawn = '' + this.funcSet;
					// 		this.end = '' + this.funcSet;
					// 		this.pdown = '' + this.funcSet;
					// 		this.num7 = '' + this.funcSet;
					// 	}, 1000);
					// }
					this.num = 0
					this.scroll = 'round2' + this.funcSet;
					this.numlock = 'round2' + this.funcSet;
					this.pause = 'round2' + this.funcSet;
					this.home = 'round2' + this.funcSet;
					this.pup = 'round2' + this.funcSet;
					this.Upside14 = 'round2' + this.funcSet;
					this.Upside15 = 'round2' + this.funcSet;
					this.Upside16 = 'round2' + this.funcSet;
					this.Upside13 = 'round2_2' + this.funcSet;
					this.Upside17 = 'round2_2' + this.funcSet;
					this.print = 'round2_2' + this.funcSet;
					this.insert = 'round2_2' + this.funcSet;
					this.numdrawn = 'round2_2' + this.funcSet;
					this.end = 'round2_2' + this.funcSet;
					this.pdown = 'round2_2' + this.funcSet;
					this.num7 = 'round2_2' + this.funcSet;
				}
				break;

			case this.vKey == 192 && this.keyStatus == 1: //perid
				if (this.num == 0) {
					this.clear();
					// if (this.keyFlag1 == 0) {
					// 	this.keyFlag1 = 1
					// 	setTimeout(() => {
					// 		this.keyFlag1 = 0;
					// 		this.esc = '' + this.funcSet;
					// 		this.perid = '' + this.funcSet;
					// 		this.n1 = '' + this.funcSet;
					// 		this.tab = '' + this.funcSet;
					// 		this.q = '' + this.funcSet;
					// 		this.f1 = '' + this.funcSet;
					// 		this.n2 = '' + this.funcSet;
					// 		this.w = '' + this.funcSet;
					// 		this.caps = '' + this.funcSet;
					// 		this.a = '' + this.funcSet;
					// 	}, 1000);
					// }
					this.esc = 'round1' + this.funcSet;
					this.perid = 'round1' + this.funcSet;
					this.n1 = 'round1' + this.funcSet;
					this.tab = 'round1' + this.funcSet;
					this.q = 'round1' + this.funcSet;
					this.f1 = 'round1_2' + this.funcSet;
					this.n2 = 'round1_2' + this.funcSet;
					this.w = 'round1_2' + this.funcSet;
					this.caps = 'round1_2' + this.funcSet;
					this.a = 'round1_2' + this.funcSet;
					this.num = 1
				}
				else if (this.num == 1) {
					this.clear();
					// if (this.keyFlag2 == 0) {
					// 	this.keyFlag2 = 1
					// 	setTimeout(() => {
					// 		this.keyFlag2 = 0;
					// 		this.esc = '' + this.funcSet;
					// 		this.perid = '' + this.funcSet;
					// 		this.n1 = '' + this.funcSet;
					// 		this.tab = '' + this.funcSet;
					// 		this.q = '' + this.funcSet;
					// 		this.f1 = '' + this.funcSet;
					// 		this.n2 = '' + this.funcSet;
					// 		this.w = '' + this.funcSet;
					// 		this.caps = '' + this.funcSet;
					// 		this.a = '' + this.funcSet;
					// 	}, 1000);
					// }
					this.num = 0
					this.esc = 'round2' + this.funcSet;
					this.perid = 'round2' + this.funcSet;
					this.n1 = 'round2' + this.funcSet;
					this.tab = 'round2' + this.funcSet;
					this.q = 'round2' + this.funcSet;
					this.f1 = 'round2_2' + this.funcSet;
					this.n2 = 'round2_2' + this.funcSet;
					this.w = 'round2_2' + this.funcSet;
					this.caps = 'round2_2' + this.funcSet;
					this.a = 'round2_2' + this.funcSet;
				}
				break;

			case this.vKey == 49 && this.keyStatus == 1: //n1
				if (this.num == 0) {
					this.clear();
					// if (this.keyFlag1 == 0) {
					// 	this.keyFlag1 = 1
					// 	setTimeout(() => {
					// 		this.keyFlag1 = 0;
					// 		this.f1 = '' + this.funcSet;
					// 		this.perid = '' + this.funcSet;
					// 		this.n1 = '' + this.funcSet;
					// 		this.n2 = '' + this.funcSet;
					// 		this.tab = '' + this.funcSet;
					// 		this.q = '' + this.funcSet;
					// 		this.w = '' + this.funcSet;
					// 		this.Upside1 = '' + this.funcSet;
					// 		this.f2 = '' + this.funcSet;
					// 		this.n3 = '' + this.funcSet;
					// 		this.e = '' + this.funcSet;
					// 		this.caps = '' + this.funcSet;
					// 		this.a = '' + this.funcSet;
					// 		this.s = '' + this.funcSet;
					// 	}, 1000);
					// }
					this.f1 = 'round1' + this.funcSet;
					this.perid = 'round1' + this.funcSet;
					this.n1 = 'round1' + this.funcSet;
					this.n2 = 'round1' + this.funcSet;
					this.tab = 'round1' + this.funcSet;
					this.q = 'round1' + this.funcSet;
					this.w = 'round1' + this.funcSet;
					this.Upside1 = 'round1_2' + this.funcSet;
					this.f2 = 'round1_2' + this.funcSet;
					this.n3 = 'round1_2' + this.funcSet;
					this.e = 'round1_2' + this.funcSet;
					this.caps = 'round1_2' + this.funcSet;
					this.a = 'round1_2' + this.funcSet;
					this.s = 'round1_2' + this.funcSet;
					this.num = 1
				}
				else if (this.num == 1) {
					this.clear();
					// if (this.keyFlag2 == 0) {
					// 	this.keyFlag2 = 1
					// 	setTimeout(() => {
					// 		this.keyFlag2 = 0;
					// 		this.f1 = '' + this.funcSet;
					// 		this.perid = '' + this.funcSet;
					// 		this.n1 = '' + this.funcSet;
					// 		this.n2 = '' + this.funcSet;
					// 		this.tab = '' + this.funcSet;
					// 		this.q = '' + this.funcSet;
					// 		this.w = '' + this.funcSet;
					// 		this.Upside1 = '' + this.funcSet;
					// 		this.f2 = '' + this.funcSet;
					// 		this.n3 = '' + this.funcSet;
					// 		this.e = '' + this.funcSet;
					// 		this.caps = '' + this.funcSet;
					// 		this.a = '' + this.funcSet;
					// 		this.s = '' + this.funcSet;
					// 	}, 1000);
					// }
					this.num = 0
					this.f1 = 'round2' + this.funcSet;
					this.perid = 'round2' + this.funcSet;
					this.n1 = 'round2' + this.funcSet;
					this.n2 = 'round2' + this.funcSet;
					this.tab = 'round2' + this.funcSet;
					this.q = 'round2' + this.funcSet;
					this.w = 'round2' + this.funcSet;
					this.Upside1 = 'round_2' + this.funcSet;
					this.f2 = 'round_2' + this.funcSet;
					this.n3 = 'round_2' + this.funcSet;
					this.e = 'round_2' + this.funcSet;
					this.caps = 'round_2' + this.funcSet;
					this.a = 'round_2' + this.funcSet;
					this.s = 'round_2' + this.funcSet;
				}
				break;

			case this.vKey == 50 && this.keyStatus == 1: //n2
				if (this.num == 0) {
					this.clear();
					// if (this.keyFlag1 == 0) {
					// 	this.keyFlag1 = 1
					// 	setTimeout(() => {
					// 		this.keyFlag1 = 0;
					// 		this.f1 = '' + this.funcSet;
					// 		this.f2 = '' + this.funcSet;
					// 		this.n3 = '' + this.funcSet;
					// 		this.n1 = '' + this.funcSet;
					// 		this.n2 = '' + this.funcSet;
					// 		this.q = '' + this.funcSet;
					// 		this.w = '' + this.funcSet;
					// 		this.Upside1 = '' + this.funcSet;
					// 		this.Upside2 = '' + this.funcSet;
					// 		this.esc = '' + this.funcSet;
					// 		this.f3 = '' + this.funcSet;
					// 		this.perid = '' + this.funcSet;
					// 		this.n4 = '' + this.funcSet;
					// 		this.tab = '' + this.funcSet;
					// 		this.e = '' + this.funcSet;
					// 		this.r = '' + this.funcSet;
					// 		this.a = '' + this.funcSet;
					// 		this.s = '' + this.funcSet;
					// 		this.d = '' + this.funcSet;
					// 	}, 1000);
					// }
					this.f1 = 'round1' + this.funcSet;
					this.f2 = 'round1' + this.funcSet;
					this.n3 = 'round1' + this.funcSet;
					this.n1 = 'round1' + this.funcSet;
					this.n2 = 'round1' + this.funcSet;
					this.q = 'round1' + this.funcSet;
					this.w = 'round1' + this.funcSet;
					this.Upside1 = 'round1_2' + this.funcSet;
					this.Upside2 = 'round1_2' + this.funcSet;
					this.esc = 'round1_2' + this.funcSet;
					this.f3 = 'round1_2' + this.funcSet;
					this.perid = 'round1_2' + this.funcSet;
					this.n4 = 'round1_2' + this.funcSet;
					this.tab = 'round1_2' + this.funcSet;
					this.e = 'round1_2' + this.funcSet;
					this.r = 'round1_2' + this.funcSet;
					this.a = 'round1_2' + this.funcSet;
					this.s = 'round1_2' + this.funcSet;
					this.d = 'round1_2' + this.funcSet;
					this.num = 1
				}
				else if (this.num == 1) {
					this.clear();
					// if (this.keyFlag2 == 0) {
					// 	this.keyFlag2 = 1
					// 	setTimeout(() => {
					// 		this.keyFlag2 = 0;
					// 		this.f1 = '' + this.funcSet;
					// 		this.f2 = '' + this.funcSet;
					// 		this.n3 = '' + this.funcSet;
					// 		this.n1 = '' + this.funcSet;
					// 		this.n2 = '' + this.funcSet;
					// 		this.q = '' + this.funcSet;
					// 		this.w = '' + this.funcSet;
					// 		this.Upside1 = '' + this.funcSet;
					// 		this.Upside2 = '' + this.funcSet;
					// 		this.esc = '' + this.funcSet;
					// 		this.f3 = '' + this.funcSet;
					// 		this.perid = '' + this.funcSet;
					// 		this.n4 = '' + this.funcSet;
					// 		this.tab = '' + this.funcSet;
					// 		this.e = '' + this.funcSet;
					// 		this.r = '' + this.funcSet;
					// 		this.a = '' + this.funcSet;
					// 		this.s = '' + this.funcSet;
					// 		this.d = '' + this.funcSet;
					// 	}, 1000);
					// }
					this.num = 0
					this.f1 = 'round2' + this.funcSet;
					this.f2 = 'round2' + this.funcSet;
					this.n3 = 'round2' + this.funcSet;
					this.n1 = 'round2' + this.funcSet;
					this.n2 = 'round2' + this.funcSet;
					this.q = 'round2' + this.funcSet;
					this.w = 'round2' + this.funcSet;
					this.Upside1 = 'round2_2' + this.funcSet;
					this.Upside2 = 'round2_2' + this.funcSet;
					this.esc = 'round2_2' + this.funcSet;
					this.f3 = 'round2_2' + this.funcSet;
					this.perid = 'round2_2' + this.funcSet;
					this.n4 = 'round2_2' + this.funcSet;
					this.tab = 'round2_2' + this.funcSet;
					this.e = 'round2_2' + this.funcSet;
					this.r = 'round2_2' + this.funcSet;
					this.a = 'round2_2' + this.funcSet;
					this.s = 'round2_2' + this.funcSet;
					this.d = 'round2_2' + this.funcSet;
				}
				break;

			case this.vKey == 51 && this.keyStatus == 1: //n3
				if (this.num == 0) {
					this.clear();
					// if (this.keyFlag1 == 0) {
					// 	this.keyFlag1 = 1
					// 	setTimeout(() => {
					// 		this.keyFlag1 = 0;
					// 		this.f3 = '' + this.funcSet;
					// 		this.f2 = '' + this.funcSet;
					// 		this.n3 = '' + this.funcSet;
					// 		this.n4 = '' + this.funcSet;
					// 		this.n2 = '' + this.funcSet;
					// 		this.e = '' + this.funcSet;
					// 		this.w = '' + this.funcSet;
					// 		this.Upside1 = '' + this.funcSet;
					// 		this.Upside2 = '' + this.funcSet;
					// 		this.Upside3 = '' + this.funcSet;
					// 		this.f1 = '' + this.funcSet;
					// 		this.f4 = '' + this.funcSet;
					// 		this.n1 = '' + this.funcSet;
					// 		this.n5 = '' + this.funcSet;
					// 		this.q = '' + this.funcSet;
					// 		this.r = '' + this.funcSet;
					// 		this.s = '' + this.funcSet;
					// 		this.d = '' + this.funcSet;
					// 		this.f = '' + this.funcSet;
					// 	}, 1000);
					// }
					this.f3 = 'round1' + this.funcSet;
					this.f2 = 'round1' + this.funcSet;
					this.n3 = 'round1' + this.funcSet;
					this.n4 = 'round1' + this.funcSet;
					this.n2 = 'round1' + this.funcSet;
					this.e = 'round1' + this.funcSet;
					this.w = 'round1' + this.funcSet;
					this.Upside1 = 'round1_2' + this.funcSet;
					this.Upside2 = 'round1_2' + this.funcSet;
					this.Upside3 = 'round1_2' + this.funcSet;
					this.f1 = 'round1_2' + this.funcSet;
					this.f4 = 'round1_2' + this.funcSet;
					this.n1 = 'round1_2' + this.funcSet;
					this.n5 = 'round1_2' + this.funcSet;
					this.q = 'round1_2' + this.funcSet;
					this.r = 'round1_2' + this.funcSet;
					this.s = 'round1_2' + this.funcSet;
					this.d = 'round1_2' + this.funcSet;
					this.f = 'round1_2' + this.funcSet;
					this.num = 1
				}
				else if (this.num == 1) {
					this.clear();
					// if (this.keyFlag2 == 0) {
					// 	this.keyFlag2 = 1
					// 	setTimeout(() => {
					// 		this.keyFlag2 = 0;
					// 		this.f3 = '' + this.funcSet;
					// 		this.f2 = '' + this.funcSet;
					// 		this.n3 = '' + this.funcSet;
					// 		this.n4 = '' + this.funcSet;
					// 		this.n2 = '' + this.funcSet;
					// 		this.e = '' + this.funcSet;
					// 		this.w = '' + this.funcSet;
					// 		this.Upside1 = '' + this.funcSet;
					// 		this.Upside2 = '' + this.funcSet;
					// 		this.Upside3 = '' + this.funcSet;
					// 		this.f1 = '' + this.funcSet;
					// 		this.f4 = '' + this.funcSet;
					// 		this.n1 = '' + this.funcSet;
					// 		this.n5 = '' + this.funcSet;
					// 		this.q = '' + this.funcSet;
					// 		this.r = '' + this.funcSet;
					// 		this.s = '' + this.funcSet;
					// 		this.d = '' + this.funcSet;
					// 		this.f = '' + this.funcSet;
					// 	}, 1000);
					// }
					this.num = 0
					this.f3 = 'round2' + this.funcSet;
					this.f2 = 'round2' + this.funcSet;
					this.n3 = 'round2' + this.funcSet;
					this.n4 = 'round2' + this.funcSet;
					this.n2 = 'round2' + this.funcSet;
					this.e = 'round2' + this.funcSet;
					this.w = 'round2' + this.funcSet;
					this.Upside1 = 'round2_2' + this.funcSet;
					this.Upside2 = 'round2_2' + this.funcSet;
					this.Upside3 = 'round2_2' + this.funcSet;
					this.f1 = 'round2_2' + this.funcSet;
					this.f4 = 'round2_2' + this.funcSet;
					this.n1 = 'round2_2' + this.funcSet;
					this.n5 = 'round2_2' + this.funcSet;
					this.q = 'round2_2' + this.funcSet;
					this.r = 'round2_2' + this.funcSet;
					this.s = 'round2_2' + this.funcSet;
					this.d = 'round2_2' + this.funcSet;
					this.f = 'round2_2' + this.funcSet;
				}
				break;

			case this.vKey == 52 && this.keyStatus == 1: //n4
				if (this.num == 0) {
					this.clear();
					// if (this.keyFlag1 == 0) {
					// 	this.keyFlag1 = 1
					// 	setTimeout(() => {
					// 		this.keyFlag1 = 0;
					// 		this.f3 = '' + this.funcSet;
					// 		this.f4 = '' + this.funcSet;
					// 		this.n3 = '' + this.funcSet;
					// 		this.n4 = '' + this.funcSet;
					// 		this.n5 = '' + this.funcSet;
					// 		this.e = '' + this.funcSet;
					// 		this.r = '' + this.funcSet;
					// 		this.Upside2 = '' + this.funcSet
					// 		this.Upside3 = '' + this.funcSet
					// 		this.Upside4 = '' + this.funcSet
					// 		this.n2 = '' + this.funcSet
					// 		this.n6 = '' + this.funcSet
					// 		this.t = '' + this.funcSet
					// 		this.w = '' + this.funcSet
					// 		this.d = '' + this.funcSet
					// 		this.f = '' + this.funcSet
					// 		this.g = '' + this.funcSet
					// 		this.num = 1
					// 	}, 1000);
					// }
					this.f3 = 'round1' + this.funcSet;
					this.f4 = 'round1' + this.funcSet;
					this.n3 = 'round1' + this.funcSet;
					this.n4 = 'round1' + this.funcSet;
					this.n5 = 'round1' + this.funcSet;
					this.e = 'round1' + this.funcSet;
					this.r = 'round1' + this.funcSet;
					this.Upside2 = 'round1_2' + this.funcSet
					this.Upside3 = 'round1_2' + this.funcSet
					this.Upside4 = 'round1_2' + this.funcSet
					this.n2 = 'round1_2' + this.funcSet
					this.n6 = 'round1_2' + this.funcSet
					this.t = 'round1_2' + this.funcSet
					this.w = 'round1_2' + this.funcSet
					this.d = 'round1_2' + this.funcSet
					this.f = 'round1_2' + this.funcSet
					this.g = 'round1_2' + this.funcSet
					this.num = 1
				}
				else if (this.num == 1) {
					this.clear();
					// if (this.keyFlag2 == 0) {
					// 	this.keyFlag2 = 1
					// 	setTimeout(() => {
					// 		this.keyFlag2 = 0;
					// 		this.f3 = '' + this.funcSet;
					// 		this.f4 = '' + this.funcSet;
					// 		this.n3 = '' + this.funcSet;
					// 		this.n4 = '' + this.funcSet;
					// 		this.n5 = '' + this.funcSet;
					// 		this.e = '' + this.funcSet;
					// 		this.r = '' + this.funcSet;
					// 		this.Upside2 = '' + this.funcSet
					// 		this.Upside3 = '' + this.funcSet
					// 		this.Upside4 = '' + this.funcSet
					// 		this.n2 = '' + this.funcSet
					// 		this.n6 = '' + this.funcSet
					// 		this.t = '' + this.funcSet
					// 		this.w = '' + this.funcSet
					// 		this.d = '' + this.funcSet
					// 		this.f = '' + this.funcSet
					// 		this.g = '' + this.funcSet
					// 	}, 1000);
					// }
					this.num = 0
					this.f3 = 'round2' + this.funcSet;
					this.f4 = 'round2' + this.funcSet;
					this.n3 = 'round2' + this.funcSet;
					this.n4 = 'round2' + this.funcSet;
					this.n5 = 'round2' + this.funcSet;
					this.e = 'round2' + this.funcSet;
					this.r = 'round2' + this.funcSet;
					this.t = 'round2' + this.funcSet;
					this.Upside2 = 'round2_2' + this.funcSet
					this.Upside3 = 'round2_2' + this.funcSet
					this.Upside4 = 'round2_2' + this.funcSet
					this.n2 = 'round2_2' + this.funcSet
					this.n6 = 'round2_2' + this.funcSet
					this.t = 'round2_2' + this.funcSet
					this.w = 'round2_2' + this.funcSet
					this.d = 'round2_2' + this.funcSet
					this.f = 'round2_2' + this.funcSet
					this.g = 'round2_2' + this.funcSet
				}
				break;

			case this.vKey == 53 && this.keyStatus == 1: //n5
				if (this.num == 0) {
					this.clear();
					// if (this.keyFlag1 == 0) {
					// 	this.keyFlag1 = 1
					// 	setTimeout(() => {
					// 		this.keyFlag1 = 0;
					// 		this.f4 = '' + this.funcSet;
					// 		this.n5 = '' + this.funcSet;
					// 		this.n4 = '' + this.funcSet;
					// 		this.n6 = '' + this.funcSet;
					// 		this.r = '' + this.funcSet;
					// 		this.t = '' + this.funcSet;
					// 		this.Upside3 = '' + this.funcSet;
					// 		this.Upside4 = '' + this.funcSet;
					// 		this.Upside5 = '' + this.funcSet;
					// 		this.n3 = '' + this.funcSet;
					// 		this.n7 = '' + this.funcSet;
					// 		this.e = '' + this.funcSet;
					// 		this.y = '' + this.funcSet;
					// 		this.f = '' + this.funcSet;
					// 		this.g = '' + this.funcSet;
					// 		this.h = '' + this.funcSet;
					// 	}, 1000);
					// }
					this.f4 = 'round1' + this.funcSet;
					this.n5 = 'round1' + this.funcSet;
					this.n4 = 'round1' + this.funcSet;
					this.n6 = 'round1' + this.funcSet;
					this.r = 'round1' + this.funcSet;
					this.t = 'round1' + this.funcSet;
					this.Upside3 = 'round1_2' + this.funcSet;
					this.Upside4 = 'round1_2' + this.funcSet;
					this.Upside5 = 'round1_2' + this.funcSet;
					this.n3 = 'round1_2' + this.funcSet;
					this.n7 = 'round1_2' + this.funcSet;
					this.e = 'round1_2' + this.funcSet;
					this.y = 'round1_2' + this.funcSet;
					this.f = 'round1_2' + this.funcSet;
					this.g = 'round1_2' + this.funcSet;
					this.h = 'round1_2' + this.funcSet;
					this.num = 1
				}
				else if (this.num == 1) {
					this.clear();
					// if (this.keyFlag2 == 0) {
					// 	this.keyFlag2 = 1
					// 	setTimeout(() => {
					// 		this.keyFlag2 = 0;
					// 		this.f4 = '' + this.funcSet;
					// 		this.n5 = '' + this.funcSet;
					// 		this.n4 = '' + this.funcSet;
					// 		this.n6 = '' + this.funcSet;
					// 		this.r = '' + this.funcSet;
					// 		this.t = '' + this.funcSet;
					// 		this.Upside3 = '' + this.funcSet;
					// 		this.Upside4 = '' + this.funcSet;
					// 		this.Upside5 = '' + this.funcSet;
					// 		this.n3 = '' + this.funcSet;
					// 		this.n7 = '' + this.funcSet;
					// 		this.e = '' + this.funcSet;
					// 		this.y = '' + this.funcSet;
					// 		this.f = '' + this.funcSet;
					// 		this.g = '' + this.funcSet;
					// 		this.h = '' + this.funcSet;
					// 	}, 1000);
					// }
					this.num = 0
					this.f4 = 'round2' + this.funcSet;
					this.n5 = 'round2' + this.funcSet;
					this.n4 = 'round2' + this.funcSet;
					this.n6 = 'round2' + this.funcSet;
					this.r = 'round2' + this.funcSet;
					this.t = 'round2' + this.funcSet;
					this.Upside3 = 'round2_2' + this.funcSet;
					this.Upside4 = 'round2_2' + this.funcSet;
					this.Upside5 = 'round2_2' + this.funcSet;
					this.n3 = 'round2_2' + this.funcSet;
					this.n7 = 'round2_2' + this.funcSet;
					this.e = 'round2_2' + this.funcSet;
					this.y = 'round2_2' + this.funcSet;
					this.f = 'round2_2' + this.funcSet;
					this.g = 'round2_2' + this.funcSet;
					this.h = 'round2_2' + this.funcSet;
				}
				break;

			case this.vKey == 54 && this.keyStatus == 1: //n6
				if (this.num == 0) {
					this.clear();
					// if (this.keyFlag1 == 0) {
					// 	this.keyFlag1 = 1
					// 	setTimeout(() => {
					// 		this.keyFlag1 = 0;
					// 		this.f5 = '' + this.funcSet;
					// 		this.n5 = '' + this.funcSet;
					// 		this.n6 = '' + this.funcSet;
					// 		this.n7 = '' + this.funcSet;
					// 		this.y = '' + this.funcSet;
					// 		this.t = '' + this.funcSet;
					// 		this.Upside6 = '' + this.funcSet;
					// 		this.Upside4 = '' + this.funcSet;
					// 		this.Upside5 = '' + this.funcSet;
					// 		this.f4 = '' + this.funcSet;
					// 		this.n4 = '' + this.funcSet;
					// 		this.n8 = '' + this.funcSet;
					// 		this.r = '' + this.funcSet;
					// 		this.u = '' + this.funcSet;
					// 		this.g = '' + this.funcSet;
					// 		this.h = '' + this.funcSet;
					// 		this.j = '' + this.funcSet;
					// 	}, 1000);
					// }
					this.f5 = 'round1' + this.funcSet;
					this.n5 = 'round1' + this.funcSet;
					this.n6 = 'round1' + this.funcSet;
					this.n7 = 'round1' + this.funcSet;
					this.y = 'round1' + this.funcSet;
					this.t = 'round1' + this.funcSet;
					this.Upside6 = 'round1_2' + this.funcSet;
					this.Upside4 = 'round1_2' + this.funcSet;
					this.Upside5 = 'round1_2' + this.funcSet;
					this.f4 = 'round1_2' + this.funcSet;
					this.n4 = 'round1_2' + this.funcSet;
					this.n8 = 'round1_2' + this.funcSet;
					this.r = 'round1_2' + this.funcSet;
					this.u = 'round1_2' + this.funcSet;
					this.g = 'round1_2' + this.funcSet;
					this.h = 'round1_2' + this.funcSet;
					this.j = 'round1_2' + this.funcSet;
					this.num = 1
				}
				else if (this.num == 1) {
					this.clear();
					// if (this.keyFlag2 == 0) {
					// 	this.keyFlag2 = 1
					// 	setTimeout(() => {
					// 		this.keyFlag2 = 0;
					// 		this.f5 = '' + this.funcSet;
					// 		this.n5 = '' + this.funcSet;
					// 		this.n6 = '' + this.funcSet;
					// 		this.n7 = '' + this.funcSet;
					// 		this.y = '' + this.funcSet;
					// 		this.t = '' + this.funcSet;
					// 		this.Upside6 = '' + this.funcSet;
					// 		this.Upside4 = '' + this.funcSet;
					// 		this.Upside5 = '' + this.funcSet;
					// 		this.f4 = '' + this.funcSet;
					// 		this.n4 = '' + this.funcSet;
					// 		this.n8 = '' + this.funcSet;
					// 		this.r = '' + this.funcSet;
					// 		this.u = '' + this.funcSet;
					// 		this.g = '' + this.funcSet;
					// 		this.h = '' + this.funcSet;
					// 		this.j = '' + this.funcSet;
					// 	}, 1000);
					// }
					this.num = 0
					this.f5 = 'round2' + this.funcSet;
					this.n5 = 'round2' + this.funcSet;
					this.n6 = 'round2' + this.funcSet;
					this.n7 = 'round2' + this.funcSet;
					this.y = 'round2' + this.funcSet;
					this.t = 'round2' + this.funcSet;
					this.Upside6 = 'round2_2' + this.funcSet;
					this.Upside4 = 'round2_2' + this.funcSet;
					this.Upside5 = 'round2_2' + this.funcSet;
					this.f4 = 'round2_2' + this.funcSet;
					this.n4 = 'round2_2' + this.funcSet;
					this.n8 = 'round2_2' + this.funcSet;
					this.r = 'round2_2' + this.funcSet;
					this.u = 'round2_2' + this.funcSet;
					this.g = 'round2_2' + this.funcSet;
					this.h = 'round2_2' + this.funcSet;
					this.j = 'round2_2' + this.funcSet;
				}
				break;

			case this.vKey == 55 && this.keyStatus == 1: //n7
				if (this.num == 0) {
					this.clear();
					// if (this.keyFlag1 == 0) {
					// 	this.keyFlag1 = 1
					// 	setTimeout(() => {
					// 		this.keyFlag1 = 0;
					// 		this.f5 = '' + this.funcSet;
					// 		this.f6 = '' + this.funcSet;
					// 		this.n8 = '' + this.funcSet;
					// 		this.n6 = '' + this.funcSet;
					// 		this.n7 = '' + this.funcSet;
					// 		this.y = '' + this.funcSet;
					// 		this.u = '' + this.funcSet;
					// 		this.Upside5 = '' + this.funcSet;
					// 		this.Upside6 = '' + this.funcSet;
					// 		this.Upside7 = '' + this.funcSet;
					// 		this.f4 = '' + this.funcSet;
					// 		this.f7 = '' + this.funcSet;
					// 		this.t = '' + this.funcSet;
					// 		this.i = '' + this.funcSet;
					// 		this.h = '' + this.funcSet;
					// 		this.j = '' + this.funcSet;
					// 		this.k = '' + this.funcSet;
					// 	}, 1000);
					// }
					this.f5 = 'round1' + this.funcSet;
					this.f6 = 'round1' + this.funcSet;
					this.n8 = 'round1' + this.funcSet;
					this.n6 = 'round1' + this.funcSet;
					this.n7 = 'round1' + this.funcSet;
					this.y = 'round1' + this.funcSet;
					this.u = 'round1' + this.funcSet;
					this.Upside5 = 'round1_2' + this.funcSet;
					this.Upside6 = 'round1_2' + this.funcSet;
					this.Upside7 = 'round1_2' + this.funcSet;
					this.f4 = 'round1_2' + this.funcSet;
					this.f7 = 'round1_2' + this.funcSet;
					this.t = 'round1_2' + this.funcSet;
					this.i = 'round1_2' + this.funcSet;
					this.h = 'round1_2' + this.funcSet;
					this.j = 'round1_2' + this.funcSet;
					this.k = 'round1_2' + this.funcSet;
					this.num = 1
				}
				else if (this.num == 1) {
					this.clear();
					// if (this.keyFlag2 == 0) {
					// 	this.keyFlag2 = 1
					// 	setTimeout(() => {
					// 		this.keyFlag2 = 0;
					// 		this.f5 = '' + this.funcSet;
					// 		this.f6 = '' + this.funcSet;
					// 		this.n8 = '' + this.funcSet;
					// 		this.n6 = '' + this.funcSet;
					// 		this.n7 = '' + this.funcSet;
					// 		this.y = '' + this.funcSet;
					// 		this.u = '' + this.funcSet;
					// 		this.Upside5 = '' + this.funcSet;
					// 		this.Upside6 = '' + this.funcSet;
					// 		this.Upside7 = '' + this.funcSet;
					// 		this.f4 = '' + this.funcSet;
					// 		this.f7 = '' + this.funcSet;
					// 		this.t = '' + this.funcSet;
					// 		this.i = '' + this.funcSet;
					// 		this.h = '' + this.funcSet;
					// 		this.j = '' + this.funcSet;
					// 		this.k = '' + this.funcSet;
					// 	}, 1000);
					// }
					this.num = 0
					this.f5 = 'round2' + this.funcSet;
					this.f6 = 'round2' + this.funcSet;
					this.n8 = 'round2' + this.funcSet;
					this.n6 = 'round2' + this.funcSet;
					this.n7 = 'round2' + this.funcSet;
					this.y = 'round2' + this.funcSet;
					this.u = 'round2' + this.funcSet;
					this.Upside5 = 'round2_2' + this.funcSet;
					this.Upside6 = 'round2_2' + this.funcSet;
					this.Upside7 = 'round2_2' + this.funcSet;
					this.f4 = 'round2_2' + this.funcSet;
					this.f7 = 'round2_2' + this.funcSet;
					this.t = 'round2_2' + this.funcSet;
					this.i = 'round2_2' + this.funcSet;
					this.h = 'round2_2' + this.funcSet;
					this.j = 'round2_2' + this.funcSet;
					this.k = 'round2_2' + this.funcSet;
				}
				break;

			case this.vKey == 56 && this.keyStatus == 1: //n8
				if (this.num == 0) {
					this.clear();
					// if (this.keyFlag1 == 0) {
					// 	this.keyFlag1 = 1
					// 	setTimeout(() => {
					// 		this.keyFlag1 = 0;
					// 		this.f7 = '' + this.funcSet;
					// 		this.f6 = '' + this.funcSet;
					// 		this.n8 = '' + this.funcSet;
					// 		this.n9 = '' + this.funcSet;
					// 		this.n7 = '' + this.funcSet;
					// 		this.u = '' + this.funcSet;
					// 		this.i = '' + this.funcSet;
					// 		this.Upside6 = '' + this.funcSet;
					// 		this.Upside7 = '' + this.funcSet;
					// 		this.Upside8 = '' + this.funcSet;
					// 		this.Upside9 = '' + this.funcSet;
					// 		this.f5 = '' + this.funcSet;
					// 		this.f8 = '' + this.funcSet;
					// 		this.n6 = '' + this.funcSet;
					// 		this.n0 = '' + this.funcSet;
					// 		this.y = '' + this.funcSet;
					// 		this.o = '' + this.funcSet;
					// 		this.j = '' + this.funcSet;
					// 		this.k = '' + this.funcSet;
					// 		this.l = '' + this.funcSet;
					// 	}, 1000);
					// }
					this.f7 = 'round1' + this.funcSet;
					this.f6 = 'round1' + this.funcSet;
					this.n8 = 'round1' + this.funcSet;
					this.n9 = 'round1' + this.funcSet;
					this.n7 = 'round1' + this.funcSet;
					this.u = 'round1' + this.funcSet;
					this.i = 'round1' + this.funcSet;
					this.Upside6 = 'round1_2' + this.funcSet;
					this.Upside7 = 'round1_2' + this.funcSet;
					this.Upside8 = 'round1_2' + this.funcSet;
					this.Upside9 = 'round1_2' + this.funcSet;
					this.f5 = 'round1_2' + this.funcSet;
					this.f8 = 'round1_2' + this.funcSet;
					this.n6 = 'round1_2' + this.funcSet;
					this.n0 = 'round1_2' + this.funcSet;
					this.y = 'round1_2' + this.funcSet;
					this.o = 'round1_2' + this.funcSet;
					this.j = 'round1_2' + this.funcSet;
					this.k = 'round1_2' + this.funcSet;
					this.l = 'round1_2' + this.funcSet;
					this.num = 1
				}
				else if (this.num == 1) {
					this.clear();
					// if (this.keyFlag2 == 0) {
					// 	this.keyFlag2 = 1
					// 	setTimeout(() => {
					// 		this.keyFlag2 = 0;
					// 		this.f7 = '' + this.funcSet;
					// 		this.f6 = '' + this.funcSet;
					// 		this.n8 = '' + this.funcSet;
					// 		this.n9 = '' + this.funcSet;
					// 		this.n7 = '' + this.funcSet;
					// 		this.u = '' + this.funcSet;
					// 		this.i = '' + this.funcSet;
					// 		this.Upside6 = '' + this.funcSet;
					// 		this.Upside7 = '' + this.funcSet;
					// 		this.Upside8 = '' + this.funcSet;
					// 		this.Upside9 = '' + this.funcSet;
					// 		this.f5 = '' + this.funcSet;
					// 		this.f8 = '' + this.funcSet;
					// 		this.n6 = '' + this.funcSet;
					// 		this.n0 = '' + this.funcSet;
					// 		this.y = '' + this.funcSet;
					// 		this.o = '' + this.funcSet;
					// 		this.j = '' + this.funcSet;
					// 		this.k = '' + this.funcSet;
					// 		this.l = '' + this.funcSet;
					// 	}, 1000);
					// }
					this.num = 0
					this.f7 = 'round2' + this.funcSet;
					this.f6 = 'round2' + this.funcSet;
					this.n8 = 'round2' + this.funcSet;
					this.n9 = 'round2' + this.funcSet;
					this.n7 = 'round2' + this.funcSet;
					this.u = 'round2' + this.funcSet;
					this.i = 'round2' + this.funcSet;
					this.Upside6 = 'round2_2' + this.funcSet;
					this.Upside7 = 'round2_2' + this.funcSet;
					this.Upside8 = 'round2_2' + this.funcSet;
					this.Upside9 = 'round2_2' + this.funcSet;
					this.f5 = 'round2_2' + this.funcSet;
					this.f8 = 'round2_2' + this.funcSet;
					this.n6 = 'round2_2' + this.funcSet;
					this.n0 = 'round2_2' + this.funcSet;
					this.y = 'round2_2' + this.funcSet;
					this.o = 'round2_2' + this.funcSet;
					this.j = 'round2_2' + this.funcSet;
					this.k = 'round2_2' + this.funcSet;
					this.l = 'round2_2' + this.funcSet;
				}
				break;

			case this.vKey == 57 && this.keyStatus == 1: //n9
				if (this.num == 0) {
					this.clear();
					// if (this.keyFlag1 == 0) {
					// 	this.keyFlag1 = 1
					// 	setTimeout(() => {
					// 		this.keyFlag1 = 0;
					// 		this.f7 = '' + this.funcSet;
					// 		this.f8 = '' + this.funcSet;
					// 		this.n8 = '' + this.funcSet;
					// 		this.n9 = '' + this.funcSet;
					// 		this.n0 = '' + this.funcSet;
					// 		this.o = '' + this.funcSet;
					// 		this.i = '' + this.funcSet;
					// 		this.Upside8 = '' + this.funcSet;
					// 		this.Upside9 = '' + this.funcSet;
					// 		this.Upside10 = '' + this.funcSet;
					// 		this.f6 = '' + this.funcSet;
					// 		this.f9 = '' + this.funcSet;
					// 		this.n7 = '' + this.funcSet;
					// 		this.n0 = '' + this.funcSet;
					// 		this.u = '' + this.funcSet;
					// 		this.p = '' + this.funcSet;
					// 		this.k = '' + this.funcSet;
					// 		this.l = '' + this.funcSet;
					// 		this.lqu = '' + this.funcSet;
					// 	}, 1000);
					// }
					this.f7 = 'round1' + this.funcSet;
					this.f8 = 'round1' + this.funcSet;
					this.n8 = 'round1' + this.funcSet;
					this.n9 = 'round1' + this.funcSet;
					this.n0 = 'round1' + this.funcSet;
					this.o = 'round1' + this.funcSet;
					this.i = 'round1' + this.funcSet;
					this.Upside8 = 'round1_2' + this.funcSet;
					this.Upside9 = 'round1_2' + this.funcSet;
					this.Upside10 = 'round1_2' + this.funcSet;
					this.f6 = 'round1_2' + this.funcSet;
					this.f9 = 'round1_2' + this.funcSet;
					this.n7 = 'round1_2' + this.funcSet;
					this.n0 = 'round1_2' + this.funcSet;
					this.u = 'round1_2' + this.funcSet;
					this.p = 'round1_2' + this.funcSet;
					this.k = 'round1_2' + this.funcSet;
					this.l = 'round1_2' + this.funcSet;
					this.lqu = 'round1_2' + this.funcSet;
					this.num = 1
				}
				else if (this.num == 1) {
					this.clear();
					// if (this.keyFlag2 == 0) {
					// 	this.keyFlag2 = 1
					// 	setTimeout(() => {
					// 		this.keyFlag2 = 0;
					// 		this.f7 = '' + this.funcSet;
					// 		this.f8 = '' + this.funcSet;
					// 		this.n8 = '' + this.funcSet;
					// 		this.n9 = '' + this.funcSet;
					// 		this.n0 = '' + this.funcSet;
					// 		this.o = '' + this.funcSet;
					// 		this.i = '' + this.funcSet;
					// 		this.Upside8 = '' + this.funcSet;
					// 		this.Upside9 = '' + this.funcSet;
					// 		this.Upside10 = '' + this.funcSet;
					// 		this.f6 = '' + this.funcSet;
					// 		this.f9 = '' + this.funcSet;
					// 		this.n7 = '' + this.funcSet;
					// 		this.n0 = '' + this.funcSet;
					// 		this.u = '' + this.funcSet;
					// 		this.p = '' + this.funcSet;
					// 		this.k = '' + this.funcSet;
					// 		this.l = '' + this.funcSet;
					// 		this.lqu = '' + this.funcSet;
					// 	}, 1000);
					// }
					this.num = 0
					this.f7 = 'round2' + this.funcSet;
					this.f8 = 'round2' + this.funcSet;
					this.n8 = 'round2' + this.funcSet;
					this.n9 = 'round2' + this.funcSet;
					this.n0 = 'round2' + this.funcSet;
					this.o = 'round2' + this.funcSet;
					this.i = 'round2' + this.funcSet;
					this.Upside8 = 'round2_2' + this.funcSet;
					this.Upside9 = 'round2_2' + this.funcSet;
					this.Upside10 = 'round2_2' + this.funcSet;
					this.f6 = 'round2_2' + this.funcSet;
					this.f9 = 'round2_2' + this.funcSet;
					this.n7 = 'round2_2' + this.funcSet;
					this.n0 = 'round2_2' + this.funcSet;
					this.u = 'round2_2' + this.funcSet;
					this.p = 'round2_2' + this.funcSet;
					this.k = 'round2_2' + this.funcSet;
					this.l = 'round2_2' + this.funcSet;
					this.lqu = 'round2_2' + this.funcSet;
				}
				break;

			case this.vKey == 48 && this.keyStatus == 1: //n0
				if (this.num == 0) {
					this.clear();
					// if (this.keyFlag1 == 0) {
					// 	this.keyFlag1 = 1
					// 	setTimeout(() => {
					// 		this.keyFlag1 = 0;
					// 		this.f9 = '' + this.funcSet;
					// 		this.f8 = '' + this.funcSet;
					// 		this.minus = '' + this.funcSet;
					// 		this.n9 = '' + this.funcSet;
					// 		this.n0 = '' + this.funcSet;
					// 		this.p = '' + this.funcSet;
					// 		this.o = '' + this.funcSet;
					// 		this.Upside9 = '' + this.funcSet;
					// 		this.Upside10 = '' + this.funcSet;
					// 		this.logo1 = '' + this.funcSet;
					// 		this.logo2 = '' + this.funcSet;
					// 		this.f7 = '' + this.funcSet;
					// 		this.f10 = '' + this.funcSet;
					// 		this.n8 = '' + this.funcSet;
					// 		this.minus = '' + this.funcSet;
					// 		this.i = '' + this.funcSet;
					// 		this.lqu = '' + this.funcSet;
					// 		this.k = '' + this.funcSet;
					// 		this.l = '' + this.funcSet;
					// 		this.sem = '' + this.funcSet;
					// 	}, 1000);
					// }
					this.f9 = 'round1' + this.funcSet;
					this.f8 = 'round1' + this.funcSet;
					this.minus = 'round1' + this.funcSet;
					this.n9 = 'round1' + this.funcSet;
					this.n0 = 'round1' + this.funcSet;
					this.p = 'round1' + this.funcSet;
					this.o = 'round1' + this.funcSet;
					this.Upside9 = 'round1_2' + this.funcSet;
					this.Upside10 = 'round1_2' + this.funcSet;
					this.logo1 = 'round1_2' + this.funcSet;
					this.logo2 = 'round1_2' + this.funcSet;
					this.f7 = 'round1_2' + this.funcSet;
					this.f10 = 'round1_2' + this.funcSet;
					this.n8 = 'round1_2' + this.funcSet;
					this.minus = 'round1_2' + this.funcSet;
					this.i = 'round1_2' + this.funcSet;
					this.lqu = 'round1_2' + this.funcSet;
					this.k = 'round1_2' + this.funcSet;
					this.l = 'round1_2' + this.funcSet;
					this.sem = 'round1_2' + this.funcSet;
					this.num = 1
				}
				else if (this.num == 1) {
					this.clear();
					// if (this.keyFlag2 == 0) {
					// 	this.keyFlag2 = 1
					// 	setTimeout(() => {
					// 		this.keyFlag2 = 0;
					// 		this.f9 = '' + this.funcSet;
					// 		this.f8 = '' + this.funcSet;
					// 		this.minus = '' + this.funcSet;
					// 		this.n9 = '' + this.funcSet;
					// 		this.n0 = '' + this.funcSet;
					// 		this.p = '' + this.funcSet;
					// 		this.o = '' + this.funcSet;
					// 		this.Upside9 = '' + this.funcSet;
					// 		this.Upside10 = '' + this.funcSet;
					// 		this.logo1 = '' + this.funcSet;
					// 		this.logo2 = '' + this.funcSet;
					// 		this.f7 = '' + this.funcSet;
					// 		this.f10 = '' + this.funcSet;
					// 		this.n8 = '' + this.funcSet;
					// 		this.minus = '' + this.funcSet;
					// 		this.i = '' + this.funcSet;
					// 		this.lqu = '' + this.funcSet;
					// 		this.k = '' + this.funcSet;
					// 		this.l = '' + this.funcSet;
					// 		this.sem = '' + this.funcSet;
					// 	}, 1000);
					// }
					this.num = 0
					this.f9 = 'round2' + this.funcSet;
					this.f8 = 'round2' + this.funcSet;
					this.minus = 'round2' + this.funcSet;
					this.n9 = 'round2' + this.funcSet;
					this.n0 = 'round2' + this.funcSet;
					this.p = 'round2' + this.funcSet;
					this.o = 'round2' + this.funcSet;
					this.Upside9 = 'round2_2' + this.funcSet;
					this.Upside10 = 'round2_2' + this.funcSet;
					this.logo1 = 'round2_2' + this.funcSet;
					this.logo2 = 'round2_2' + this.funcSet;
					this.f7 = 'round2_2' + this.funcSet;
					this.f10 = 'round2_2' + this.funcSet;
					this.n8 = 'round2_2' + this.funcSet;
					this.minus = 'round2_2' + this.funcSet;
					this.i = 'round2_2' + this.funcSet;
					this.lqu = 'round2_2' + this.funcSet;
					this.k = 'round2_2' + this.funcSet;
					this.l = 'round2_2' + this.funcSet;
					this.sem = 'round2_2' + this.funcSet;
				}
				break;

			case this.vKey == 189 && this.keyStatus == 1: //minus
				if (this.num == 0) {
					this.clear();
					// if (this.keyFlag1 == 0) {
					// 	this.keyFlag1 = 1
					// 	setTimeout(() => {
					// 		this.keyFlag1 = 0;
					// 		this.f9 = '' + this.funcSet;
					// 		this.f10 = '' + this.funcSet;
					// 		this.minus = '' + this.funcSet;
					// 		this.plus = '' + this.funcSet;
					// 		this.n0 = '' + this.funcSet;
					// 		this.p = '' + this.funcSet;
					// 		this.lqu = '' + this.funcSet;
					// 		this.Upside11 = '' + this.funcSet
					// 		this.Upside12 = '' + this.funcSet
					// 		this.logo1 = '' + this.funcSet
					// 		this.logo2 = '' + this.funcSet
					// 		this.n0 = '' + this.funcSet
					// 		this.plus = '' + this.funcSet
					// 		this.o = '' + this.funcSet
					// 		this.rqu = '' + this.funcSet
					// 		this.l = '' + this.funcSet
					// 		this.sem = '' + this.funcSet
					// 		this.quo = '' + this.funcSet
					// 	}, 1000);
					// }
					this.f9 = 'round1' + this.funcSet;
					this.f10 = 'round1' + this.funcSet;
					this.minus = 'round1' + this.funcSet;
					this.plus = 'round1' + this.funcSet;
					this.n0 = 'round1' + this.funcSet;
					this.p = 'round1' + this.funcSet;
					this.lqu = 'round1' + this.funcSet;
					this.Upside11 = 'round1_2' + this.funcSet
					this.Upside12 = 'round1_2' + this.funcSet
					this.logo1 = 'round1_2' + this.funcSet
					this.logo2 = 'round1_2' + this.funcSet
					this.n0 = 'round1_2' + this.funcSet
					this.plus = 'round1_2' + this.funcSet
					this.o = 'round1_2' + this.funcSet
					this.rqu = 'round1_2' + this.funcSet
					this.l = 'round1_2' + this.funcSet
					this.sem = 'round1_2' + this.funcSet
					this.quo = 'round1_2' + this.funcSet
					this.num = 1
				}
				else if (this.num == 1) {
					this.clear();
					// if (this.keyFlag2 == 0) {
					// 	this.keyFlag2 = 1
					// 	setTimeout(() => {
					// 		this.keyFlag2 = 0;
					// 		this.f9 = '' + this.funcSet;
					// 		this.f10 = '' + this.funcSet;
					// 		this.minus = '' + this.funcSet;
					// 		this.plus = '' + this.funcSet;
					// 		this.n0 = '' + this.funcSet;
					// 		this.p = '' + this.funcSet;
					// 		this.lqu = '' + this.funcSet;
					// 		this.Upside11 = '' + this.funcSet
					// 		this.Upside12 = '' + this.funcSet
					// 		this.logo1 = '' + this.funcSet
					// 		this.logo2 = '' + this.funcSet
					// 		this.n0 = '' + this.funcSet
					// 		this.plus = '' + this.funcSet
					// 		this.o = '' + this.funcSet
					// 		this.rqu = '' + this.funcSet
					// 		this.l = '' + this.funcSet
					// 		this.sem = '' + this.funcSet
					// 		this.quo = '' + this.funcSet
					// 	}, 1000);
					// }
					this.num = 0
					this.f9 = 'round2' + this.funcSet;
					this.f10 = 'round2' + this.funcSet;
					this.minus = 'round2' + this.funcSet;
					this.plus = 'round2' + this.funcSet;
					this.n0 = 'round2' + this.funcSet;
					this.p = 'round2' + this.funcSet;
					this.lqu = 'round2' + this.funcSet;
					this.Upside11 = 'round1_2' + this.funcSet
					this.Upside12 = 'round1_2' + this.funcSet
					this.logo1 = 'round1_2' + this.funcSet
					this.logo2 = 'round1_2' + this.funcSet
					this.n0 = 'round1_2' + this.funcSet
					this.plus = 'round1_2' + this.funcSet
					this.o = 'round1_2' + this.funcSet
					this.rqu = 'round1_2' + this.funcSet
					this.l = 'round1_2' + this.funcSet
					this.sem = 'round1_2' + this.funcSet
					this.quo = 'round1_2' + this.funcSet
				}
				break;

			case this.vKey == 187 && this.keyStatus == 1: //plus
				if (this.num == 0) {
					this.clear();
					// if (this.keyFlag1 == 0) {
					// 	this.keyFlag1 = 1
					// 	setTimeout(() => {
					// 		this.keyFlag1 = 0;
					// 		this.f11 = '' + this.funcSet;
					// 		this.f10 = '' + this.funcSet;
					// 		this.minus = '' + this.funcSet;
					// 		this.plus = '' + this.funcSet;
					// 		this.n0 = '' + this.funcSet;
					// 		this.rqu = '' + this.funcSet;
					// 		this.lqu = '' + this.funcSet;
					// 		this.Upside11 = '' + this.funcSet;
					// 		this.Upside12 = '' + this.funcSet;
					// 		this.logo1 = '' + this.funcSet;
					// 		this.logo2 = '' + this.funcSet;
					// 		this.f9 = '' + this.funcSet;
					// 		this.f12 = '' + this.funcSet;
					// 		this.p = '' + this.funcSet;
					// 		this.drawn = '' + this.funcSet;
					// 		this.sem = '' + this.funcSet;
					// 		this.quo = '' + this.funcSet;
					// 		this.enter = '' + this.funcSet;
					// 	}, 1000);
					// }
					this.f11 = 'round1' + this.funcSet;
					this.f10 = 'round1' + this.funcSet;
					this.minus = 'round1' + this.funcSet;
					this.plus = 'round1' + this.funcSet;
					this.n0 = 'round1' + this.funcSet;
					this.rqu = 'round1' + this.funcSet;
					this.lqu = 'round1' + this.funcSet;
					this.Upside11 = 'round1_2' + this.funcSet;
					this.Upside12 = 'round1_2' + this.funcSet;
					this.logo1 = 'round1_2' + this.funcSet;
					this.logo2 = 'round1_2' + this.funcSet;
					this.f9 = 'round1_2' + this.funcSet;
					this.f12 = 'round1_2' + this.funcSet;
					this.p = 'round1_2' + this.funcSet;
					this.drawn = 'round1_2' + this.funcSet;
					this.sem = 'round1_2' + this.funcSet;
					this.quo = 'round1_2' + this.funcSet;
					this.enter = 'round1_2' + this.funcSet;
					this.num = 1
				}
				else if (this.num == 1) {
					this.clear();
					// if (this.keyFlag2 == 0) {
					// 	this.keyFlag2 = 1
					// 	setTimeout(() => {
					// 		this.keyFlag2 = 0;
					// 		this.f11 = '' + this.funcSet;
					// 		this.f10 = '' + this.funcSet;
					// 		this.minus = '' + this.funcSet;
					// 		this.plus = '' + this.funcSet;
					// 		this.n0 = '' + this.funcSet;
					// 		this.rqu = '' + this.funcSet;
					// 		this.lqu = '' + this.funcSet;
					// 		this.Upside11 = '' + this.funcSet;
					// 		this.Upside12 = '' + this.funcSet;
					// 		this.logo1 = '' + this.funcSet;
					// 		this.logo2 = '' + this.funcSet;
					// 		this.f9 = '' + this.funcSet;
					// 		this.f12 = '' + this.funcSet;
					// 		this.p = '' + this.funcSet;
					// 		this.drawn = '' + this.funcSet;
					// 		this.sem = '' + this.funcSet;
					// 		this.quo = '' + this.funcSet;
					// 		this.enter = '' + this.funcSet;
					// 	}, 1000);
					// }
					this.num = 0
					this.f11 = 'round2' + this.funcSet;
					this.f10 = 'round2' + this.funcSet;
					this.minus = 'round2' + this.funcSet;
					this.plus = 'round2' + this.funcSet;
					this.n0 = 'round2' + this.funcSet;
					this.drawn = 'round2' + this.funcSet;
					this.rqu = 'round2' + this.funcSet;
					this.lqu = 'round2' + this.funcSet;
					this.Upside11 = 'round2_2' + this.funcSet;
					this.Upside12 = 'round2_2' + this.funcSet;
					this.logo1 = 'round2_2' + this.funcSet;
					this.logo2 = 'round2_2' + this.funcSet;
					this.f9 = 'round2_2' + this.funcSet;
					this.f12 = 'round2_2' + this.funcSet;
					this.p = 'round2_2' + this.funcSet;
					this.drawn = 'round2_2' + this.funcSet;
					this.sem = 'round2_2' + this.funcSet;
					this.quo = 'round2_2' + this.funcSet;
					this.enter = 'round2_2' + this.funcSet;
				}
				break;

			case this.vKey == 8 && this.keyStatus == 1: //bsp
				if (this.num == 0) {
					this.clear();
					// if (this.keyFlag1 == 0) {
					// 	this.keyFlag1 = 1
					// 	setTimeout(() => {
					// 		this.keyFlag1 = 0;
					// 		this.f12 = '' + this.funcSet;
					// 		this.bsp = '' + this.funcSet;
					// 		this.plus = '' + this.funcSet;
					// 		this.print = '' + this.funcSet;
					// 		this.insert = '' + this.funcSet;
					// 		this.drawn = '' + this.funcSet;
					// 		this.Upside11 = '' + this.funcSet;
					// 		this.Upside12 = '' + this.funcSet;
					// 		this.Upside13 = '' + this.funcSet;
					// 		this.f11 = '' + this.funcSet;
					// 		this.scroll = '' + this.funcSet;
					// 		this.minus = '' + this.funcSet;
					// 		this.home = '' + this.funcSet;
					// 		this.rqu = '' + this.funcSet;
					// 		this.delete = '' + this.funcSet;
					// 		this.enter = '' + this.funcSet;
					// 	}, 1000);
					// }
					this.f12 = 'round1' + this.funcSet;
					this.bsp = 'round1' + this.funcSet;
					this.plus = 'round1' + this.funcSet;
					this.print = 'round1' + this.funcSet;
					this.insert = 'round1' + this.funcSet;
					this.drawn = 'round1' + this.funcSet;
					this.Upside11 = 'round1_2' + this.funcSet;
					this.Upside12 = 'round1_2' + this.funcSet;
					this.Upside13 = 'round1_2' + this.funcSet;
					this.f11 = 'round1_2' + this.funcSet;
					this.scroll = 'round1_2' + this.funcSet;
					this.minus = 'round1_2' + this.funcSet;
					this.home = 'round1_2' + this.funcSet;
					this.rqu = 'round1_2' + this.funcSet;
					this.delete = 'round1_2' + this.funcSet;
					this.enter = 'round1_2' + this.funcSet;
					this.num = 1
				}
				else if (this.num == 1) {
					this.clear();
					// if (this.keyFlag2 == 0) {
					// 	this.keyFlag2 = 1
					// 	setTimeout(() => {
					// 		this.keyFlag2 = 0;
					// 		this.f12 = '' + this.funcSet;
					// 		this.bsp = '' + this.funcSet;
					// 		this.plus = '' + this.funcSet;
					// 		this.print = '' + this.funcSet;
					// 		this.insert = '' + this.funcSet;
					// 		this.drawn = '' + this.funcSet;
					// 		this.Upside11 = '' + this.funcSet;
					// 		this.Upside12 = '' + this.funcSet;
					// 		this.Upside13 = '' + this.funcSet;
					// 		this.f11 = '' + this.funcSet;
					// 		this.scroll = '' + this.funcSet;
					// 		this.minus = '' + this.funcSet;
					// 		this.home = '' + this.funcSet;
					// 		this.rqu = '' + this.funcSet;
					// 		this.delete = '' + this.funcSet;
					// 		this.enter = '' + this.funcSet;
					// 	}, 1000);
					// }
					this.num = 0
					this.f12 = 'round2' + this.funcSet;
					this.bsp = 'round2' + this.funcSet;
					this.plus = 'round2' + this.funcSet;
					this.print = 'round2' + this.funcSet;
					this.insert = 'round2' + this.funcSet;
					this.drawn = 'round2' + this.funcSet;
					this.Upside11 = 'round1_2' + this.funcSet;
					this.Upside12 = 'round1_2' + this.funcSet;
					this.Upside13 = 'round1_2' + this.funcSet;
					this.f11 = 'round1_2' + this.funcSet;
					this.scroll = 'round1_2' + this.funcSet;
					this.minus = 'round1_2' + this.funcSet;
					this.home = 'round1_2' + this.funcSet;
					this.rqu = 'round1_2' + this.funcSet;
					this.delete = 'round1_2' + this.funcSet;
					this.enter = 'round1_2' + this.funcSet;
				}
				break;

			case this.vKey == 45 && this.keyStatus == 1: //insert
				if (this.num == 0) {
					this.clear();
					// if (this.keyFlag1 == 0) {
					// 	this.keyFlag1 = 1
					// 	setTimeout(() => {
					// 		this.keyFlag1 = 0;
					// 		this.print = '' + this.funcSet;
					// 		this.scroll = '' + this.funcSet;
					// 		this.home = '' + this.funcSet;
					// 		this.insert = '' + this.funcSet;
					// 		this.delete = '' + this.funcSet;
					// 		this.bsp = '' + this.funcSet;
					// 		this.Upside12 = '' + this.funcSet;
					// 		this.Upside13 = '' + this.funcSet;
					// 		this.Upside14 = '' + this.funcSet;
					// 		this.f12 = '' + this.funcSet;
					// 		this.pause = '' + this.funcSet;
					// 		this.pup = '' + this.funcSet;
					// 		this.end = '' + this.funcSet;
					// 		this.drawn = '' + this.funcSet;
					// 	}, 1000);
					// }
					this.print = 'round1' + this.funcSet;
					this.scroll = 'round1' + this.funcSet;
					this.home = 'round1' + this.funcSet;
					this.insert = 'round1' + this.funcSet;
					this.delete = 'round1' + this.funcSet;
					this.bsp = 'round1' + this.funcSet;
					this.Upside12 = 'round1_2' + this.funcSet;
					this.Upside13 = 'round1_2' + this.funcSet;
					this.Upside14 = 'round1_2' + this.funcSet;
					this.f12 = 'round1_2' + this.funcSet;
					this.pause = 'round1_2' + this.funcSet;
					this.pup = 'round1_2' + this.funcSet;
					this.end = 'round1_2' + this.funcSet;
					this.drawn = 'round1_2' + this.funcSet;
					this.num = 1
				}
				else if (this.num == 1) {
					this.clear();
					// if (this.keyFlag2 == 0) {
					// 	this.keyFlag2 = 1
					// 	setTimeout(() => {
					// 		this.keyFlag2 = 0;
					// 		this.print = '' + this.funcSet;
					// 		this.scroll = '' + this.funcSet;
					// 		this.home = '' + this.funcSet;
					// 		this.insert = '' + this.funcSet;
					// 		this.delete = '' + this.funcSet;
					// 		this.bsp = '' + this.funcSet;
					// 		this.Upside12 = '' + this.funcSet;
					// 		this.Upside13 = '' + this.funcSet;
					// 		this.Upside14 = '' + this.funcSet;
					// 		this.f12 = '' + this.funcSet;
					// 		this.pause = '' + this.funcSet;
					// 		this.pup = '' + this.funcSet;
					// 		this.end = '' + this.funcSet;
					// 		this.drawn = '' + this.funcSet;
					// 	}, 1000);
					// }
					this.num = 0
					this.print = 'round2' + this.funcSet;
					this.scroll = 'round2' + this.funcSet;
					this.home = 'round2' + this.funcSet;
					this.insert = 'round2' + this.funcSet;
					this.delete = 'round2' + this.funcSet;
					this.bsp = 'round2' + this.funcSet;
					this.Upside12 = 'round2_2' + this.funcSet;
					this.Upside13 = 'round2_2' + this.funcSet;
					this.Upside14 = 'round2_2' + this.funcSet;
					this.f12 = 'round2_2' + this.funcSet;
					this.pause = 'round2_2' + this.funcSet;
					this.pup = 'round2_2' + this.funcSet;
					this.end = 'round2_2' + this.funcSet;
					this.drawn = 'round2_2' + this.funcSet;
				}
				break;

			case this.vKey == 36 && this.keyStatus == 1: //home
				if (this.num == 0) {
					this.clear();
					// if (this.keyFlag1 == 0) {
					// 	this.keyFlag1 = 1
					// 	setTimeout(() => {
					// 		this.keyFlag1 = 0;
					// 		this.scroll = '' + this.funcSet;
					// 		this.home = '' + this.funcSet;
					// 		this.insert = '' + this.funcSet;
					// 		this.end = '' + this.funcSet;
					// 		this.delete = '' + this.funcSet;
					// 		this.pause = '' + this.funcSet;
					// 		this.pup = '' + this.funcSet;
					// 		this.Upside13 = '' + this.funcSet;
					// 		this.Upside14 = '' + this.funcSet;
					// 		this.Upside15 = '' + this.funcSet;
					// 		this.print = '' + this.funcSet;
					// 		this.numlock = '' + this.funcSet;
					// 		this.pdown = '' + this.funcSet;
					// 	}, 1000);
					// }
					this.scroll = 'round1' + this.funcSet;
					this.home = 'round1' + this.funcSet;
					this.insert = 'round1' + this.funcSet;
					this.end = 'round1' + this.funcSet;
					this.delete = 'round1' + this.funcSet;
					this.pause = 'round1' + this.funcSet;
					this.pup = 'round1' + this.funcSet;
					this.Upside13 = 'round1_2' + this.funcSet;
					this.Upside14 = 'round1_2' + this.funcSet;
					this.Upside15 = 'round1_2' + this.funcSet;
					this.print = 'round1_2' + this.funcSet;
					this.numlock = 'round1_2' + this.funcSet;
					this.pdown = 'round1_2' + this.funcSet;
					this.num = 1
				}
				else if (this.num == 1) {
					this.clear();
					// if (this.keyFlag2 == 0) {
					// 	this.keyFlag2 = 1
					// 	setTimeout(() => {
					// 		this.keyFlag2 = 0;
					// 		this.scroll = '' + this.funcSet;
					// 		this.home = '' + this.funcSet;
					// 		this.insert = '' + this.funcSet;
					// 		this.end = '' + this.funcSet;
					// 		this.delete = '' + this.funcSet;
					// 		this.pause = '' + this.funcSet;
					// 		this.pup = '' + this.funcSet;
					// 		this.pdown = '' + this.funcSet;
					// 		this.Upside13 = '' + this.funcSet;
					// 		this.Upside14 = '' + this.funcSet;
					// 		this.Upside15 = '' + this.funcSet;
					// 		this.print = '' + this.funcSet;
					// 		this.numlock = '' + this.funcSet;
					// 		this.pdown = '' + this.funcSet;
					// 	}, 1000);
					// }
					this.num = 0
					this.scroll = 'round2' + this.funcSet;
					this.home = 'round2' + this.funcSet;
					this.insert = 'round2' + this.funcSet;
					this.end = 'round2' + this.funcSet;
					this.delete = 'round2' + this.funcSet;
					this.pause = 'round2' + this.funcSet;
					this.pup = 'round2' + this.funcSet;
					this.pdown = 'round2' + this.funcSet;
					this.Upside13 = 'round2_2' + this.funcSet;
					this.Upside14 = 'round2_2' + this.funcSet;
					this.Upside15 = 'round2_2' + this.funcSet;
					this.print = 'round2_2' + this.funcSet;
					this.numlock = 'round2_2' + this.funcSet;
					this.pdown = 'round2_2' + this.funcSet;
				}
				break;

			case this.vKey == 33 && this.keyStatus == 1: //pup
				if (this.num == 0) {
					this.clear();
					// if (this.keyFlag1 == 0) {
					// 	this.keyFlag1 = 1
					// 	setTimeout(() => {
					// 		this.keyFlag1 = 0;
					// 		this.numlock = '' + this.funcSet;
					// 		this.home = '' + this.funcSet;
					// 		this.end = '' + this.funcSet;
					// 		this.pause = '' + this.funcSet;
					// 		this.pup = '' + this.funcSet;
					// 		this.pdown = '' + this.funcSet;
					// 		this.Upside16 = '' + this.funcSet;
					// 		this.Upside17 = '' + this.funcSet;
					// 		this.print = '' + this.funcSet;
					// 		this.scroll = '' + this.funcSet;
					// 		this.insert = '' + this.funcSet;
					// 		this.delete = '' + this.funcSet;
					// 		this.num7 = '' + this.funcSet;
					// 		this.num4 = '' + this.funcSet;
					// 	}, 1000);
					// }
					this.numlock = 'round1' + this.funcSet;
					this.home = 'round1' + this.funcSet;
					this.end = 'round1' + this.funcSet;;
					this.pause = 'round1' + this.funcSet;
					this.pup = 'round1' + this.funcSet;
					this.pdown = 'round1' + this.funcSet;
					this.Upside16 = 'round1_2' + this.funcSet;
					this.Upside17 = 'round1_2' + this.funcSet;
					this.print = 'round1_2' + this.funcSet;
					this.scroll = 'round1_2' + this.funcSet;
					this.insert = 'round1_2' + this.funcSet;
					this.delete = 'round1_2' + this.funcSet;
					this.num7 = 'round1_2' + this.funcSet;
					this.num4 = 'round1_2' + this.funcSet;
					this.num = 1
				}
				else if (this.num == 1) {
					this.clear();
					// if (this.keyFlag2 == 0) {
					// 	this.keyFlag2 = 1
					// 	setTimeout(() => {
					// 		this.keyFlag2 = 0;
					// 		this.numlock = '' + this.funcSet;
					// 		this.home = '' + this.funcSet;
					// 		this.end = '' + this.funcSet;
					// 		this.pause = '' + this.funcSet;
					// 		this.pup = '' + this.funcSet;
					// 		this.pdown = '' + this.funcSet;
					// 		this.Upside16 = '' + this.funcSet;
					// 		this.Upside17 = '' + this.funcSet;
					// 		this.print = '' + this.funcSet;
					// 		this.scroll = '' + this.funcSet;
					// 		this.insert = '' + this.funcSet;
					// 		this.delete = '' + this.funcSet;
					// 		this.num7 = '' + this.funcSet;
					// 		this.num4 = '' + this.funcSet;
					// 	}, 1000);
					// }
					this.num = 0
					this.numlock = 'round2' + this.funcSet;
					this.home = 'round2' + this.funcSet;
					this.end = 'round2' + this.funcSet;
					this.pause = 'round2' + this.funcSet;
					this.pup = 'round2' + this.funcSet;
					this.pdown = 'round2' + this.funcSet;
					this.Upside16 = 'round2_2' + this.funcSet;
					this.Upside17 = 'round2_2' + this.funcSet;
					this.print = 'round2_2' + this.funcSet;
					this.scroll = 'round2_2' + this.funcSet;
					this.insert = 'round2_2' + this.funcSet;
					this.delete = 'round2_2' + this.funcSet;
					this.num7 = 'round2_2' + this.funcSet;
					this.num4 = 'round2_2' + this.funcSet;
				}
				break;

			case this.vKey == 144 && this.keyStatus == 1: //numlock
				if (this.num == 0) {
					this.clear();
					// if (this.keyFlag1 == 0) {
					// 	this.keyFlag1 = 1
					// 	setTimeout(() => {
					// 		this.keyFlag1 = 0;
					// 		this.numlock = '' + this.funcSet;
					// 		this.numdrawn = '' + this.funcSet;
					// 		this.num8 = '' + this.funcSet;
					// 		this.num7 = '' + this.funcSet;
					// 		this.pup = '' + this.funcSet;
					// 		this.pdown = '' + this.funcSet;
					// 		this.Upside17 = '' + this.funcSet;
					// 		this.Upside18 = '' + this.funcSet;
					// 		this.scroll = '' + this.funcSet;
					// 		this.pause = '' + this.funcSet;
					// 		this.home = '' + this.funcSet;
					// 		this.end = '' + this.funcSet;
					// 		this.num8 = '' + this.funcSet;
					// 		this.num4 = '' + this.funcSet;
					// 	}, 1000);
					// }
					this.numlock = 'round1' + this.funcSet;
					this.numdrawn = 'round1' + this.funcSet;
					this.num8 = 'round1' + this.funcSet;
					this.num7 = 'round1' + this.funcSet;
					this.pup = 'round1' + this.funcSet;
					this.pdown = 'round1' + this.funcSet;
					this.Upside17 = 'round1_2' + this.funcSet;
					this.Upside18 = 'round1_2' + this.funcSet;
					this.scroll = 'round1_2' + this.funcSet;
					this.pause = 'round1_2' + this.funcSet;
					this.home = 'round1_2' + this.funcSet;
					this.end = 'round1_2' + this.funcSet;
					this.num8 = 'round1_2' + this.funcSet;
					this.num4 = 'round1_2' + this.funcSet;
					this.num = 1
				}
				else if (this.num == 1) {
					this.clear();
					// if (this.keyFlag2 == 0) {
					// 	this.keyFlag2 = 1
					// 	setTimeout(() => {
					// 		this.keyFlag2 = 0;
					// 		this.numlock = '' + this.funcSet;
					// 		this.numdrawn = '' + this.funcSet;
					// 		this.num8 = '' + this.funcSet;
					// 		this.num7 = '' + this.funcSet;
					// 		this.pup = '' + this.funcSet;
					// 		this.pdown = '' + this.funcSet;
					// 		this.Upside17 = '' + this.funcSet;
					// 		this.Upside18 = '' + this.funcSet;
					// 		this.scroll = '' + this.funcSet;
					// 		this.pause = '' + this.funcSet;
					// 		this.home = '' + this.funcSet;
					// 		this.end = '' + this.funcSet;
					// 		this.num8 = '' + this.funcSet;
					// 		this.num4 = '' + this.funcSet;
					// 	}, 1000);
					// }
					this.num = 0
					this.numlock = 'round2' + this.funcSet;
					this.numdrawn = 'round2' + this.funcSet;
					this.num8 = 'round2' + this.funcSet;
					this.num7 = 'round2' + this.funcSet;
					this.pup = 'round2' + this.funcSet;
					this.pdown = 'round2' + this.funcSet;
					this.Upside17 = 'round2_2' + this.funcSet;
					this.Upside18 = 'round2_2' + this.funcSet;
					this.scroll = 'round2_2' + this.funcSet;
					this.pause = 'round2_2' + this.funcSet;
					this.home = 'round2_2' + this.funcSet;
					this.end = 'round2_2' + this.funcSet;
					this.num8 = 'round2_2' + this.funcSet;
					this.num4 = 'round2_2' + this.funcSet;
				}
				break;

			case this.vKey == 111 && this.keyStatus == 1: //numdrawn
				if (this.num == 0) {
					this.clear();
					// if (this.keyFlag1 == 0) {
					// 	this.keyFlag1 = 1
					// 	setTimeout(() => {
					// 		this.keyFlag1 = 0;
					// 		this.numlock = '' + this.funcSet;
					// 		this.numdrawn = '' + this.funcSet;
					// 		this.numtimes = '' + this.funcSet;
					// 		this.num8 = '' + this.funcSet;
					// 		this.num7 = '' + this.funcSet;
					// 		this.Upside18 = '' + this.funcSet;
					// 		this.Upside19 = '' + this.funcSet;
					// 		this.Upside20 = '' + this.funcSet;
					// 		this.pause = '' + this.funcSet;
					// 		this.pup = '' + this.funcSet;
					// 		this.pdown = '' + this.funcSet;
					// 		this.num9 = '' + this.funcSet;
					// 		this.num4 = '' + this.funcSet;
					// 		this.num5 = '' + this.funcSet;
					// 		this.num6 = '' + this.funcSet;
					// 	}, 1000);
					// }
					this.numlock = 'round1' + this.funcSet;
					this.numdrawn = 'round1' + this.funcSet;
					this.numtimes = 'round1' + this.funcSet;
					this.num8 = 'round1' + this.funcSet;
					this.num7 = 'round1' + this.funcSet;
					this.Upside18 = 'round1_2' + this.funcSet;
					this.Upside19 = 'round1_2' + this.funcSet;
					this.Upside20 = 'round1_2' + this.funcSet;
					this.pause = 'round1_2' + this.funcSet;
					this.pup = 'round1_2' + this.funcSet;
					this.pdown = 'round1_2' + this.funcSet;
					this.num9 = 'round1_2' + this.funcSet;
					this.num4 = 'round1_2' + this.funcSet;
					this.num5 = 'round1_2' + this.funcSet;
					this.num6 = 'round1_2' + this.funcSet;
					this.num = 1
				}
				else if (this.num == 1) {
					this.clear();
					// if (this.keyFlag2 == 0) {
					// 	this.keyFlag2 = 1
					// 	setTimeout(() => {
					// 		this.keyFlag2 = 0;
					// 		this.numlock = '' + this.funcSet;
					// 		this.numdrawn = '' + this.funcSet;
					// 		this.numtimes = '' + this.funcSet;
					// 		this.num8 = '' + this.funcSet;
					// 		this.num7 = '' + this.funcSet;
					// 		this.Upside18 = '' + this.funcSet;
					// 		this.Upside19 = '' + this.funcSet;
					// 		this.Upside20 = '' + this.funcSet;
					// 		this.pause = '' + this.funcSet;
					// 		this.pup = '' + this.funcSet;
					// 		this.pdown = '' + this.funcSet;
					// 		this.num9 = '' + this.funcSet;
					// 		this.num4 = '' + this.funcSet;
					// 		this.num5 = '' + this.funcSet;
					// 		this.num6 = '' + this.funcSet;
					// 	}, 1000);
					// }
					this.num = 0
					this.numlock = 'round2' + this.funcSet;
					this.numdrawn = 'round2' + this.funcSet;
					this.numtimes = 'round2' + this.funcSet;
					this.num8 = 'round2' + this.funcSet;
					this.num7 = 'round2' + this.funcSet;
					this.Upside18 = 'round2_2' + this.funcSet;
					this.Upside19 = 'round2_2' + this.funcSet;
					this.Upside20 = 'round2_2' + this.funcSet;
					this.pause = 'round2_2' + this.funcSet;
					this.pup = 'round2_2' + this.funcSet;
					this.pdown = 'round2_2' + this.funcSet;
					this.num9 = 'round2_2' + this.funcSet;
					this.num4 = 'round2_2' + this.funcSet;
					this.num5 = 'round2_2' + this.funcSet;
					this.num6 = 'round2_2' + this.funcSet;
				}
				break;

			case this.vKey == 106 && this.keyStatus == 1: //numtimes
				if (this.num == 0) {
					this.clear();
					// if (this.keyFlag1 == 0) {
					// 	this.keyFlag1 = 1
					// 	setTimeout(() => {
					// 		this.keyFlag1 = 0;
					// 		this.numminus = '' + this.funcSet;
					// 		this.numdrawn = '' + this.funcSet;
					// 		this.numtimes = '' + this.funcSet;
					// 		this.num8 = '' + this.funcSet;
					// 		this.num9 = '' + this.funcSet;
					// 		this.Upside19 = '' + this.funcSet;
					// 		this.Upside20 = '' + this.funcSet;
					// 		this.numlock = '' + this.funcSet;
					// 		this.num7 = '' + this.funcSet;
					// 		this.num5 = '' + this.funcSet;
					// 		this.num6 = '' + this.funcSet;
					// 		this.numplus = '' + this.funcSet;
					// 	}, 1000);
					// }
					this.numminus = 'round1' + this.funcSet;
					this.numdrawn = 'round1' + this.funcSet;
					this.numtimes = 'round1' + this.funcSet;
					this.num8 = 'round1' + this.funcSet;
					this.num9 = 'round1' + this.funcSet;
					this.Upside19 = 'round1_2' + this.funcSet;
					this.Upside20 = 'round1_2' + this.funcSet;
					this.numlock = 'round1_2' + this.funcSet;
					this.num7 = 'round1_2' + this.funcSet;
					this.num5 = 'round1_2' + this.funcSet;
					this.num6 = 'round1_2' + this.funcSet;
					this.numplus = 'round1_2' + this.funcSet;
					this.num = 1
				}
				else if (this.num == 1) {
					this.clear();
					// if (this.keyFlag2 == 0) {
					// 	this.keyFlag2 = 1
					// 	setTimeout(() => {
					// 		this.keyFlag2 = 0;
					// 		this.numminus = '' + this.funcSet;
					// 		this.numdrawn = '' + this.funcSet;
					// 		this.numtimes = '' + this.funcSet;
					// 		this.num9 = '' + this.funcSet;
					// 		this.num8 = '' + this.funcSet;
					// 		this.Upside19 = '' + this.funcSet;
					// 		this.Upside20 = '' + this.funcSet;
					// 		this.numlock = '' + this.funcSet;
					// 		this.num7 = '' + this.funcSet;
					// 		this.num5 = '' + this.funcSet;
					// 		this.num6 = '' + this.funcSet;
					// 		this.numplus = '' + this.funcSet;
					// 	}, 1000);
					// }
					this.num = 0
					this.numminus = 'round2' + this.funcSet;
					this.numdrawn = 'round2' + this.funcSet;
					this.numtimes = 'round2' + this.funcSet;
					this.num9 = 'round2' + this.funcSet;
					this.num8 = 'round2' + this.funcSet;
					this.Upside19 = 'round2_2' + this.funcSet;
					this.Upside20 = 'round2_2' + this.funcSet;
					this.numlock = 'round2_2' + this.funcSet;
					this.num7 = 'round2_2' + this.funcSet;
					this.num5 = 'round2_2' + this.funcSet;
					this.num6 = 'round2_2' + this.funcSet;
					this.numplus = 'round2_2' + this.funcSet;
				}
				break;

			case this.vKey == 109 && this.keyStatus == 1: //numminus
				if (this.num == 0) {
					this.clear();
					// if (this.keyFlag1 == 0) {
					// 	this.keyFlag1 = 1
					// 	setTimeout(() => {
					// 		this.keyFlag1 = 0;
					// 		this.numminus = '' + this.funcSet;
					// 		this.numtimes = '' + this.funcSet;
					// 		this.num9 = '' + this.funcSet;
					// 		this.numplus = '' + this.funcSet;
					// 		this.Upside20 = '' + this.funcSet;
					// 		this.numdrawn = '' + this.funcSet;
					// 		this.num8 = '' + this.funcSet;
					// 		this.num6 = '' + this.funcSet;
					// 	}, 1000);
					// }
					this.numminus = 'round1' + this.funcSet;
					this.numtimes = 'round1' + this.funcSet;
					this.num9 = 'round1' + this.funcSet;
					this.numplus = 'round1' + this.funcSet;
					this.Upside20 = 'round1_2' + this.funcSet;
					this.numdrawn = 'round1_2' + this.funcSet;
					this.num8 = 'round1_2' + this.funcSet;
					this.num6 = 'round1_2' + this.funcSet;
					this.num = 1
				}
				else if (this.num == 1) {
					this.clear();
					// if (this.keyFlag2 == 0) {
					// 	this.keyFlag2 = 1
					// 	setTimeout(() => {
					// 		this.keyFlag2 = 0;
					// 		this.numminus = '' + this.funcSet;
					// 		this.numtimes = '' + this.funcSet;
					// 		this.num9 = '' + this.funcSet;
					// 		this.numplus = '' + this.funcSet;
					// 		this.Upside20 = '' + this.funcSet;
					// 		this.numdrawn = '' + this.funcSet;
					// 		this.num8 = '' + this.funcSet;
					// 		this.num6 = '' + this.funcSet;
					// 	}, 1000);
					// }
					this.num = 0
					this.numminus = 'round2' + this.funcSet;
					this.numtimes = 'round2' + this.funcSet;
					this.num9 = 'round2' + this.funcSet;
					this.numplus = 'round2' + this.funcSet;
					this.Upside20 = 'round2_2' + this.funcSet;
					this.numdrawn = 'round2_2' + this.funcSet;
					this.num8 = 'round2_2' + this.funcSet;
					this.num6 = 'round2_2' + this.funcSet;
				}
				break;

			case this.vKey == 9 && this.keyStatus == 1: //tab
				if (this.num == 0) {
					this.clear();
					// if (this.keyFlag1 == 0) {
					// 	this.keyFlag1 = 1
					// 	setTimeout(() => {
					// 		this.keyFlag1 = 0;
					// 		this.perid = '' + this.funcSet;
					// 		this.n1 = '' + this.funcSet;
					// 		this.tab = '' + this.funcSet;
					// 		this.q = '' + this.funcSet;
					// 		this.caps = '' + this.funcSet;
					// 		this.a = '' + this.funcSet;
					// 		this.esc = '' + this.funcSet;
					// 		this.n2 = '' + this.funcSet;
					// 		this.w = '' + this.funcSet;
					// 		this.a = '' + this.funcSet;
					// 		this.lshift = '' + this.funcSet;
					// 	}, 1000);
					// }
					this.perid = 'round1' + this.funcSet;
					this.n1 = 'round1' + this.funcSet;
					this.tab = 'round1' + this.funcSet;
					this.q = 'round1' + this.funcSet;
					this.caps = 'round1' + this.funcSet;
					this.a = 'round1' + this.funcSet;
					this.esc = 'round1_2' + this.funcSet;
					this.n2 = 'round1_2' + this.funcSet;
					this.w = 'round1_2' + this.funcSet;
					this.a = 'round1_2' + this.funcSet;
					this.lshift = 'round1_2' + this.funcSet;
					this.num = 1
				}
				else if (this.num == 1) {
					this.clear();
					// if (this.keyFlag2 == 0) {
					// 	this.keyFlag2 = 1
					// 	setTimeout(() => {
					// 		this.keyFlag2 = 0;
					// 		this.perid = '' + this.funcSet;
					// 		this.n1 = '' + this.funcSet;
					// 		this.tab = '' + this.funcSet;
					// 		this.q = '' + this.funcSet;
					// 		this.caps = '' + this.funcSet;
					// 		this.a = '' + this.funcSet;
					// 		this.esc = '' + this.funcSet;
					// 		this.n2 = '' + this.funcSet;
					// 		this.w = '' + this.funcSet;
					// 		this.a = '' + this.funcSet;
					// 		this.lshift = '' + this.funcSet;
					// 	}, 1000);
					// }
					this.num = 0
					this.perid = 'round2' + this.funcSet;
					this.n1 = 'round2' + this.funcSet;
					this.tab = 'round2' + this.funcSet;
					this.q = 'round2' + this.funcSet;
					this.caps = 'round2' + this.funcSet;
					this.a = 'round2' + this.funcSet;
					this.esc = 'round2_2' + this.funcSet;
					this.n2 = 'round2_2' + this.funcSet;
					this.w = 'round2_2' + this.funcSet;
					this.a = 'round2_2' + this.funcSet;
					this.lshift = 'round2_2' + this.funcSet;
				}
				break;

			case this.vKey == 81 && this.keyStatus == 1: //q
				if (this.num == 0) {
					this.clear();
					// if (this.keyFlag1 == 0) {
					// 	this.keyFlag1 = 1
					// 	setTimeout(() => {
					// 		this.keyFlag1 = 0;
					// 		this.n2 = '' + this.funcSet;
					// 		this.n1 = '' + this.funcSet;
					// 		this.tab = '' + this.funcSet;
					// 		this.q = '' + this.funcSet;
					// 		this.w = '' + this.funcSet;
					// 		this.caps = '' + this.funcSet;
					// 		this.a = '' + this.funcSet;
					// 		this.esc = '' + this.funcSet;
					// 		this.f1 = '' + this.funcSet;
					// 		this.perid = '' + this.funcSet;
					// 		this.n3 = '' + this.funcSet;
					// 		this.e = '' + this.funcSet;
					// 		this.s = '' + this.funcSet;
					// 		this.lshift = '' + this.funcSet;
					// 		this.z = '' + this.funcSet;
					// 	}, 1000);
					// }
					this.n2 = 'round1' + this.funcSet;
					this.n1 = 'round1' + this.funcSet;
					this.tab = 'round1' + this.funcSet;
					this.q = 'round1' + this.funcSet;
					this.w = 'round1' + this.funcSet;
					this.caps = 'round1' + this.funcSet;
					this.a = 'round1' + this.funcSet;
					this.esc = 'round1_2' + this.funcSet;
					this.f1 = 'round1_2' + this.funcSet;
					this.perid = 'round1_2' + this.funcSet;
					this.n3 = 'round1_2' + this.funcSet;
					this.e = 'round1_2' + this.funcSet;
					this.s = 'round1_2' + this.funcSet;
					this.lshift = 'round1_2' + this.funcSet;
					this.z = 'round1_2' + this.funcSet;
					this.num = 1
				}
				else if (this.num == 1) {
					this.clear();
					// if (this.keyFlag2 == 0) {
					// 	this.keyFlag2 = 1
					// 	setTimeout(() => {
					// 		this.keyFlag2 = 0;
					// 		this.n2 = '' + this.funcSet;
					// 		this.n1 = '' + this.funcSet;
					// 		this.tab = '' + this.funcSet;
					// 		this.q = '' + this.funcSet;
					// 		this.w = '' + this.funcSet;
					// 		this.caps = '' + this.funcSet;
					// 		this.a = '' + this.funcSet;
					// 		this.esc = '' + this.funcSet;
					// 		this.f1 = '' + this.funcSet;
					// 		this.perid = '' + this.funcSet;
					// 		this.n3 = '' + this.funcSet;
					// 		this.e = '' + this.funcSet;
					// 		this.s = '' + this.funcSet;
					// 		this.lshift = '' + this.funcSet;
					// 		this.z = '' + this.funcSet;
					// 	}, 1000);
					// }
					this.num = 0
					this.n2 = 'round2' + this.funcSet;
					this.n1 = 'round2' + this.funcSet;
					this.tab = 'round2' + this.funcSet;
					this.q = 'round2' + this.funcSet;
					this.w = 'round2' + this.funcSet;
					this.caps = 'round2' + this.funcSet;
					this.a = 'round2' + this.funcSet;
					this.esc = 'round2_2' + this.funcSet;
					this.f1 = 'round2_2' + this.funcSet;
					this.perid = 'round2_2' + this.funcSet;
					this.n3 = 'round2_2' + this.funcSet;
					this.e = 'round2_2' + this.funcSet;
					this.s = 'round2_2' + this.funcSet;
					this.lshift = 'round2_2' + this.funcSet;
					this.z = 'round2_2' + this.funcSet;
				}
				break;

			case this.vKey == 87 && this.keyStatus == 1: //w
				if (this.num == 0) {
					this.clear();
					// if (this.keyFlag1 == 0) {
					// 	this.keyFlag1 = 1
					// 	setTimeout(() => {
					// 		this.keyFlag1 = 0;
					// 		this.n2 = '' + this.funcSet;
					// 		this.n3 = '' + this.funcSet;
					// 		this.e = '' + this.funcSet;
					// 		this.q = '' + this.funcSet;
					// 		this.w = '' + this.funcSet;
					// 		this.a = '' + this.funcSet;
					// 		this.s = '' + this.funcSet;
					// 		this.f1 = '' + this.funcSet;
					// 		this.f2 = '' + this.funcSet;
					// 		this.n1 = '' + this.funcSet;
					// 		this.n4 = '' + this.funcSet;
					// 		this.tab = '' + this.funcSet;
					// 		this.r = '' + this.funcSet;
					// 		this.d = '' + this.funcSet;
					// 		this.z = '' + this.funcSet;
					// 		this.x = '' + this.funcSet;
					// 	}, 1000);
					// }
					this.n2 = 'round1' + this.funcSet;
					this.n3 = 'round1' + this.funcSet;
					this.e = 'round1' + this.funcSet;
					this.q = 'round1' + this.funcSet;
					this.w = 'round1' + this.funcSet;
					this.a = 'round1' + this.funcSet;
					this.s = 'round1' + this.funcSet;
					this.f1 = 'round1_2' + this.funcSet;
					this.f2 = 'round1_2' + this.funcSet;
					this.n1 = 'round1_2' + this.funcSet;
					this.n4 = 'round1_2' + this.funcSet;
					this.tab = 'round1_2' + this.funcSet;
					this.r = 'round1_2' + this.funcSet;
					this.d = 'round1_2' + this.funcSet;
					this.z = 'round1_2' + this.funcSet;
					this.x = 'round1_2' + this.funcSet;
					this.num = 1
				}
				else if (this.num == 1) {
					this.clear();
					// if (this.keyFlag2 == 0) {
					// 	this.keyFlag2 = 1
					// 	setTimeout(() => {
					// 		this.keyFlag2 = 0;
					// 		this.n2 = '' + this.funcSet;
					// 		this.n3 = '' + this.funcSet;
					// 		this.e = '' + this.funcSet;
					// 		this.q = '' + this.funcSet;
					// 		this.w = '' + this.funcSet;
					// 		this.a = '' + this.funcSet;
					// 		this.s = '' + this.funcSet;
					// 		this.f1 = '' + this.funcSet;
					// 		this.f2 = '' + this.funcSet;
					// 		this.n1 = '' + this.funcSet;
					// 		this.n4 = '' + this.funcSet;
					// 		this.tab = '' + this.funcSet;
					// 		this.r = '' + this.funcSet;
					// 		this.d = '' + this.funcSet;
					// 		this.z = '' + this.funcSet;
					// 		this.x = '' + this.funcSet;
					// 	}, 1000);
					// }
					this.num = 0
					this.n2 = 'round2' + this.funcSet;
					this.n3 = 'round2' + this.funcSet;
					this.e = 'round2' + this.funcSet;
					this.q = 'round2' + this.funcSet;
					this.w = 'round2' + this.funcSet;
					this.a = 'round2' + this.funcSet;
					this.s = 'round2' + this.funcSet;
					this.f1 = 'round2_2' + this.funcSet;
					this.f2 = 'round2_2' + this.funcSet;
					this.n1 = 'round2_2' + this.funcSet;
					this.n4 = 'round2_2' + this.funcSet;
					this.tab = 'round2_2' + this.funcSet;
					this.r = 'round2_2' + this.funcSet;
					this.d = 'round2_2' + this.funcSet;
					this.z = 'round2_2' + this.funcSet;
					this.x = 'round2_2' + this.funcSet;
				}
				break;

			case this.vKey == 69 && this.keyStatus == 1: //E
				if (this.num == 0) {
					this.clear();
					// if (this.keyFlag1 == 0) {
					// 	this.keyFlag1 = 1
					// 	setTimeout(() => {
					// 		this.keyFlag1 = 0;
					// 		this.n4 = '' + this.funcSet;
					// 		this.n3 = '' + this.funcSet;
					// 		this.e = '' + this.funcSet;
					// 		this.r = '' + this.funcSet;
					// 		this.w = '' + this.funcSet;
					// 		this.d = '' + this.funcSet;
					// 		this.s = '' + this.funcSet;
					// 		this.f2 = '' + this.funcSet;
					// 		this.f3 = '' + this.funcSet;
					// 		this.n2 = '' + this.funcSet;
					// 		this.n5 = '' + this.funcSet;
					// 		this.q = '' + this.funcSet;
					// 		this.t = '' + this.funcSet;
					// 		this.a = '' + this.funcSet;
					// 		this.f = '' + this.funcSet;
					// 		this.z = '' + this.funcSet;
					// 		this.x = '' + this.funcSet;
					// 		this.c = '' + this.funcSet;
					// 	}, 1000);
					// }
					this.n4 = 'round1' + this.funcSet;
					this.n3 = 'round1' + this.funcSet;
					this.e = 'round1' + this.funcSet;
					this.r = 'round1' + this.funcSet;
					this.w = 'round1' + this.funcSet;
					this.d = 'round1' + this.funcSet;
					this.s = 'round1' + this.funcSet;
					this.f2 = 'round1_2' + this.funcSet;
					this.f3 = 'round1_2' + this.funcSet;
					this.n2 = 'round1_2' + this.funcSet;
					this.n5 = 'round1_2' + this.funcSet;
					this.q = 'round1_2' + this.funcSet;
					this.t = 'round1_2' + this.funcSet;
					this.a = 'round1_2' + this.funcSet;
					this.f = 'round1_2' + this.funcSet;
					this.z = 'round1_2' + this.funcSet;
					this.x = 'round1_2' + this.funcSet;
					this.c = 'round1_2' + this.funcSet;
					this.num = 1
				}
				else if (this.num == 1) {
					this.clear();
					// if (this.keyFlag2 == 0) {
					// 	this.keyFlag2 = 1
					// 	setTimeout(() => {
					// 		this.keyFlag2 = 0;
					// 		this.n4 = '' + this.funcSet;
					// 		this.n3 = '' + this.funcSet;
					// 		this.e = '' + this.funcSet;
					// 		this.r = '' + this.funcSet;
					// 		this.w = '' + this.funcSet;
					// 		this.d = '' + this.funcSet;
					// 		this.s = '' + this.funcSet;
					// 		this.f2 = '' + this.funcSet;
					// 		this.f3 = '' + this.funcSet;
					// 		this.n2 = '' + this.funcSet;
					// 		this.n5 = '' + this.funcSet;
					// 		this.q = '' + this.funcSet;
					// 		this.t = '' + this.funcSet;
					// 		this.a = '' + this.funcSet;
					// 		this.f = '' + this.funcSet;
					// 		this.z = '' + this.funcSet;
					// 		this.x = '' + this.funcSet;
					// 		this.c = '' + this.funcSet;
					// 	}, 1000);
					// }
					this.num = 0
					this.n4 = 'round2' + this.funcSet;
					this.n3 = 'round2' + this.funcSet;
					this.e = 'round2' + this.funcSet;
					this.r = 'round2' + this.funcSet;
					this.w = 'round2' + this.funcSet;
					this.d = 'round2' + this.funcSet;
					this.s = 'round2' + this.funcSet;
					this.f2 = 'round2_2' + this.funcSet;
					this.f3 = 'round2_2' + this.funcSet;
					this.n2 = 'round2_2' + this.funcSet;
					this.n5 = 'round2_2' + this.funcSet;
					this.q = 'round2_2' + this.funcSet;
					this.t = 'round2_2' + this.funcSet;
					this.a = 'round2_2' + this.funcSet;
					this.f = 'round2_2' + this.funcSet;
					this.z = 'round2_2' + this.funcSet;
					this.x = 'round2_2' + this.funcSet;
					this.c = 'round2_2' + this.funcSet;
				}
				break;

			case this.vKey == 82 && this.keyStatus == 1: //R
				if (this.num == 0) {
					this.clear();
					// if (this.keyFlag1 == 0) {
					// 	this.keyFlag1 = 1
					// 	setTimeout(() => {
					// 		this.keyFlag1 = 0;
					// 		this.n4 = '' + this.funcSet;
					// 		this.n5 = '' + this.funcSet;
					// 		this.e = '' + this.funcSet;
					// 		this.r = '' + this.funcSet;
					// 		this.t = '' + this.funcSet;
					// 		this.d = '' + this.funcSet;
					// 		this.f = '' + this.funcSet;
					// 		this.f3 = '' + this.funcSet;
					// 		this.f4 = '' + this.funcSet;
					// 		this.n3 = '' + this.funcSet;
					// 		this.n6 = '' + this.funcSet;
					// 		this.w = '' + this.funcSet;
					// 		this.y = '' + this.funcSet;
					// 		this.s = '' + this.funcSet;
					// 		this.g = '' + this.funcSet;
					// 		this.x = '' + this.funcSet;
					// 		this.c = '' + this.funcSet;
					// 		this.v = '' + this.funcSet;
					// 	}, 1000);
					// }
					this.n4 = 'round1' + this.funcSet;
					this.n5 = 'round1' + this.funcSet;
					this.e = 'round1' + this.funcSet;
					this.r = 'round1' + this.funcSet;
					this.t = 'round1' + this.funcSet;
					this.d = 'round1' + this.funcSet;
					this.f = 'round1' + this.funcSet;
					this.f3 = 'round1_2' + this.funcSet;
					this.f4 = 'round1_2' + this.funcSet;
					this.n3 = 'round1_2' + this.funcSet;
					this.n6 = 'round1_2' + this.funcSet;
					this.w = 'round1_2' + this.funcSet;
					this.y = 'round1_2' + this.funcSet;
					this.s = 'round1_2' + this.funcSet;
					this.g = 'round1_2' + this.funcSet;
					this.x = 'round1_2' + this.funcSet;
					this.c = 'round1_2' + this.funcSet;
					this.v = 'round1_2' + this.funcSet;
					this.num = 1
				}
				else if (this.num == 1) {
					this.clear();
					// if (this.keyFlag2 == 0) {
					// 	this.keyFlag2 = 1
					// 	setTimeout(() => {
					// 		this.keyFlag2 = 0;
					// 		this.n4 = '' + this.funcSet;
					// 		this.n5 = '' + this.funcSet;
					// 		this.e = '' + this.funcSet;
					// 		this.r = '' + this.funcSet;
					// 		this.t = '' + this.funcSet;
					// 		this.d = '' + this.funcSet;
					// 		this.f = '' + this.funcSet;
					// 		this.f3 = '' + this.funcSet;
					// 		this.f4 = '' + this.funcSet;
					// 		this.n3 = '' + this.funcSet;
					// 		this.n6 = '' + this.funcSet;
					// 		this.w = '' + this.funcSet;
					// 		this.y = '' + this.funcSet;
					// 		this.s = '' + this.funcSet;
					// 		this.g = '' + this.funcSet;
					// 		this.x = '' + this.funcSet;
					// 		this.c = '' + this.funcSet;
					// 		this.v = '' + this.funcSet;
					// 	}, 1000);
					// }
					this.num = 0
					this.n4 = 'round2' + this.funcSet;
					this.n5 = 'round2' + this.funcSet;
					this.e = 'round2' + this.funcSet;
					this.r = 'round2' + this.funcSet;
					this.t = 'round2' + this.funcSet;
					this.d = 'round2' + this.funcSet;
					this.f = 'round2' + this.funcSet;
					this.f3 = 'round2_2' + this.funcSet;
					this.f4 = 'round2_2' + this.funcSet;
					this.n3 = 'round2_2' + this.funcSet;
					this.n6 = 'round2_2' + this.funcSet;
					this.w = 'round2_2' + this.funcSet;
					this.y = 'round2_2' + this.funcSet;
					this.s = 'round2_2' + this.funcSet;
					this.g = 'round2_2' + this.funcSet;
					this.x = 'round2_2' + this.funcSet;
					this.c = 'round2_2' + this.funcSet;
					this.v = 'round2_2' + this.funcSet;
				}
				break;

			case this.vKey == 84 && this.keyStatus == 1: //T
				if (this.num == 0) {
					this.clear();
					// if (this.keyFlag1 == 0) {
					// 	this.keyFlag1 = 1
					// 	setTimeout(() => {
					// 		this.keyFlag1 = 0;
					// 		this.n6 = '' + this.funcSet;
					// 		this.n5 = '' + this.funcSet;
					// 		this.y = '' + this.funcSet;
					// 		this.r = '' + this.funcSet;
					// 		this.t = '' + this.funcSet;
					// 		this.f = '' + this.funcSet;
					// 		this.g = '' + this.funcSet;
					// 		this.f4 = '' + this.funcSet;
					// 		this.f5 = '' + this.funcSet;
					// 		this.n4 = '' + this.funcSet;
					// 		this.n7 = '' + this.funcSet;
					// 		this.e = '' + this.funcSet;
					// 		this.u = '' + this.funcSet;
					// 		this.d = '' + this.funcSet;
					// 		this.h = '' + this.funcSet;
					// 		this.c = '' + this.funcSet;
					// 		this.v = '' + this.funcSet;
					// 		this.b = '' + this.funcSet;
					// 	}, 1000);
					// }
					this.n6 = 'round1' + this.funcSet;
					this.n5 = 'round1' + this.funcSet;
					this.y = 'round1' + this.funcSet;
					this.r = 'round1' + this.funcSet;
					this.t = 'round1' + this.funcSet;
					this.f = 'round1' + this.funcSet;
					this.g = 'round1' + this.funcSet;
					this.f4 = 'round1_2' + this.funcSet;
					this.f5 = 'round1_2' + this.funcSet;
					this.n4 = 'round1_2' + this.funcSet;
					this.n7 = 'round1_2' + this.funcSet;
					this.e = 'round1_2' + this.funcSet;
					this.u = 'round1_2' + this.funcSet;
					this.d = 'round1_2' + this.funcSet;
					this.h = 'round1_2' + this.funcSet;
					this.c = 'round1_2' + this.funcSet;
					this.v = 'round1_2' + this.funcSet;
					this.b = 'round1_2' + this.funcSet;
					this.num = 1
				}
				else if (this.num == 1) {
					this.clear();
					// if (this.keyFlag2 == 0) {
					// 	this.keyFlag2 = 1
					// 	setTimeout(() => {
					// 		this.keyFlag2 = 0;
					// 		this.n6 = '' + this.funcSet;
					// 		this.n5 = '' + this.funcSet;
					// 		this.y = '' + this.funcSet;
					// 		this.r = '' + this.funcSet;
					// 		this.t = '' + this.funcSet;
					// 		this.f = '' + this.funcSet;
					// 		this.g = '' + this.funcSet;
					// 		this.f4 = '' + this.funcSet;
					// 		this.f5 = '' + this.funcSet;
					// 		this.n4 = '' + this.funcSet;
					// 		this.n7 = '' + this.funcSet;
					// 		this.e = '' + this.funcSet;
					// 		this.u = '' + this.funcSet;
					// 		this.d = '' + this.funcSet;
					// 		this.h = '' + this.funcSet;
					// 		this.c = '' + this.funcSet;
					// 		this.v = '' + this.funcSet;
					// 		this.b = '' + this.funcSet;
					// 	}, 1000);
					// }
					this.num = 0
					this.n6 = 'round2' + this.funcSet;
					this.n5 = 'round2' + this.funcSet;
					this.y = 'round2' + this.funcSet;
					this.r = 'round2' + this.funcSet;
					this.t = 'round2' + this.funcSet;
					this.f = 'round2' + this.funcSet;
					this.g = 'round2' + this.funcSet;
					this.f4 = 'round2_2' + this.funcSet;
					this.f5 = 'round2_2' + this.funcSet;
					this.n4 = 'round2_2' + this.funcSet;
					this.n7 = 'round2_2' + this.funcSet;
					this.e = 'round2_2' + this.funcSet;
					this.u = 'round2_2' + this.funcSet;
					this.d = 'round2_2' + this.funcSet;
					this.h = 'round2_2' + this.funcSet;
					this.c = 'round2_2' + this.funcSet;
					this.v = 'round2_2' + this.funcSet;
					this.b = 'round2_2' + this.funcSet;
				}
				break;

			case this.vKey == 89 && this.keyStatus == 1: //Y
				if (this.num == 0) {
					this.clear();
					// if (this.keyFlag1 == 0) {
					// 	this.keyFlag1 = 1
					// 	setTimeout(() => {
					// 		this.keyFlag1 = 0;
					// 		this.n6 = '' + this.funcSet;
					// 		this.n7 = '' + this.funcSet;
					// 		this.y = '' + this.funcSet;
					// 		this.u = '' + this.funcSet;
					// 		this.t = '' + this.funcSet;
					// 		this.h = '' + this.funcSet;
					// 		this.g = '' + this.funcSet;
					// 		this.f5 = '' + this.funcSet;
					// 		this.f6 = '' + this.funcSet;
					// 		this.n5 = '' + this.funcSet;
					// 		this.n8 = '' + this.funcSet;
					// 		this.t = '' + this.funcSet;
					// 		this.i = '' + this.funcSet;
					// 		this.f = '' + this.funcSet;
					// 		this.j = '' + this.funcSet;
					// 		this.v = '' + this.funcSet;
					// 		this.b = '' + this.funcSet;
					// 		this.n = '' + this.funcSet;
					// 	}, 1000);
					// }
					this.n6 = 'round1' + this.funcSet;
					this.n7 = 'round1' + this.funcSet;
					this.y = 'round1' + this.funcSet;
					this.u = 'round1' + this.funcSet;
					this.t = 'round1' + this.funcSet;
					this.h = 'round1' + this.funcSet;
					this.g = 'round1' + this.funcSet;
					this.f5 = 'round1_2' + this.funcSet;
					this.f6 = 'round1_2' + this.funcSet;
					this.n5 = 'round1_2' + this.funcSet;
					this.n8 = 'round1_2' + this.funcSet;
					this.t = 'round1_2' + this.funcSet;
					this.i = 'round1_2' + this.funcSet;
					this.f = 'round1_2' + this.funcSet;
					this.j = 'round1_2' + this.funcSet;
					this.v = 'round1_2' + this.funcSet;
					this.b = 'round1_2' + this.funcSet;
					this.n = 'round1_2' + this.funcSet;
					this.num = 1
				}
				else if (this.num == 1) {
					this.clear();
					// if (this.keyFlag2 == 0) {
					// 	this.keyFlag2 = 1
					// 	setTimeout(() => {
					// 		this.keyFlag2 = 0;
					// 		this.n6 = '' + this.funcSet;
					// 		this.n7 = '' + this.funcSet;
					// 		this.y = '' + this.funcSet;
					// 		this.u = '' + this.funcSet;
					// 		this.t = '' + this.funcSet;
					// 		this.h = '' + this.funcSet;
					// 		this.g = '' + this.funcSet;
					// 		this.f5 = '' + this.funcSet;
					// 		this.f6 = '' + this.funcSet;
					// 		this.n5 = '' + this.funcSet;
					// 		this.n8 = '' + this.funcSet;
					// 		this.t = '' + this.funcSet;
					// 		this.i = '' + this.funcSet;
					// 		this.f = '' + this.funcSet;
					// 		this.j = '' + this.funcSet;
					// 		this.v = '' + this.funcSet;
					// 		this.b = '' + this.funcSet;
					// 		this.n = '' + this.funcSet;
					// 	}, 1000);
					// }
					this.num = 0
					this.n6 = 'round2' + this.funcSet;
					this.n7 = 'round2' + this.funcSet;
					this.y = 'round2' + this.funcSet;
					this.u = 'round2' + this.funcSet;
					this.t = 'round2' + this.funcSet;
					this.h = 'round2' + this.funcSet;
					this.g = 'round2' + this.funcSet;
					this.f5 = 'round2_2' + this.funcSet;
					this.f6 = 'round2_2' + this.funcSet;
					this.n5 = 'round2_2' + this.funcSet;
					this.n8 = 'round2_2' + this.funcSet;
					this.t = 'round2_2' + this.funcSet;
					this.i = 'round2_2' + this.funcSet;
					this.f = 'round2_2' + this.funcSet;
					this.j = 'round2_2' + this.funcSet;
					this.v = 'round2_2' + this.funcSet;
					this.b = 'round2_2' + this.funcSet;
					this.n = 'round2_2' + this.funcSet;
				}
				break;

			case this.vKey == 85 && this.keyStatus == 1: //U
				if (this.num == 0) {
					this.clear();
					// if (this.keyFlag1 == 0) {
					// 	this.keyFlag1 = 1
					// 	setTimeout(() => {
					// 		this.keyFlag1 = 0;
					// 		this.n8 = '' + this.funcSet;
					// 		this.n7 = '' + this.funcSet;
					// 		this.y = '' + this.funcSet;
					// 		this.u = '' + this.funcSet;
					// 		this.i = '' + this.funcSet;
					// 		this.h = '' + this.funcSet;
					// 		this.j = '' + this.funcSet;
					// 		this.f5 = '' + this.funcSet;
					// 		this.f6 = '' + this.funcSet;
					// 		this.f7 = '' + this.funcSet;
					// 		this.n6 = '' + this.funcSet;
					// 		this.n9 = '' + this.funcSet;
					// 		this.t = '' + this.funcSet;
					// 		this.o = '' + this.funcSet;
					// 		this.g = '' + this.funcSet;
					// 		this.k = '' + this.funcSet;
					// 		this.b = '' + this.funcSet;
					// 		this.n = '' + this.funcSet;
					// 		this.m = '' + this.funcSet;
					// 	}, 1000);
					// }
					this.n8 = 'round1' + this.funcSet;
					this.n7 = 'round1' + this.funcSet;
					this.y = 'round1' + this.funcSet;
					this.u = 'round1' + this.funcSet;
					this.i = 'round1' + this.funcSet;
					this.h = 'round1' + this.funcSet;
					this.j = 'round1' + this.funcSet;
					this.f5 = 'round1_2' + this.funcSet;
					this.f6 = 'round1_2' + this.funcSet;
					this.f7 = 'round1_2' + this.funcSet;
					this.n6 = 'round1_2' + this.funcSet;
					this.n9 = 'round1_2' + this.funcSet;
					this.t = 'round1_2' + this.funcSet;
					this.o = 'round1_2' + this.funcSet;
					this.g = 'round1_2' + this.funcSet;
					this.k = 'round1_2' + this.funcSet;
					this.b = 'round1_2' + this.funcSet;
					this.n = 'round1_2' + this.funcSet;
					this.m = 'round1_2' + this.funcSet;
					this.num = 1
				}
				else if (this.num == 1) {
					this.clear();
					// if (this.keyFlag2 == 0) {
					// 	this.keyFlag2 = 1
					// 	setTimeout(() => {
					// 		this.keyFlag2 = 0;
					// 		this.n8 = '' + this.funcSet;
					// 		this.n7 = '' + this.funcSet;
					// 		this.y = '' + this.funcSet;
					// 		this.u = '' + this.funcSet;
					// 		this.i = '' + this.funcSet;
					// 		this.h = '' + this.funcSet;
					// 		this.j = '' + this.funcSet;
					// 		this.f5 = '' + this.funcSet;
					// 		this.f6 = '' + this.funcSet;
					// 		this.f7 = '' + this.funcSet;
					// 		this.n6 = '' + this.funcSet;
					// 		this.n9 = '' + this.funcSet;
					// 		this.t = '' + this.funcSet;
					// 		this.o = '' + this.funcSet;
					// 		this.g = '' + this.funcSet;
					// 		this.k = '' + this.funcSet;
					// 		this.b = '' + this.funcSet;
					// 		this.n = '' + this.funcSet;
					// 		this.m = '' + this.funcSet;
					// 	}, 1000);
					// }
					this.num = 0
					this.n8 = 'round2' + this.funcSet;
					this.n7 = 'round2' + this.funcSet;
					this.y = 'round2' + this.funcSet;
					this.u = 'round2' + this.funcSet;
					this.i = 'round2' + this.funcSet;
					this.h = 'round2' + this.funcSet;
					this.j = 'round2' + this.funcSet;
					this.f5 = 'round2_2' + this.funcSet;
					this.f6 = 'round2_2' + this.funcSet;
					this.f7 = 'round2_2' + this.funcSet;
					this.n6 = 'round2_2' + this.funcSet;
					this.n9 = 'round2_2' + this.funcSet;
					this.t = 'round2_2' + this.funcSet;
					this.o = 'round2_2' + this.funcSet;
					this.g = 'round2_2' + this.funcSet;
					this.k = 'round2_2' + this.funcSet;
					this.b = 'round2_2' + this.funcSet;
					this.n = 'round2_2' + this.funcSet;
					this.m = 'round2_2' + this.funcSet;
				}
				break;

			case this.vKey == 73 && this.keyStatus == 1: //I
				if (this.num == 0) {
					this.clear();
					// if (this.keyFlag1 == 0) {
					// 	this.keyFlag1 = 1
					// 	setTimeout(() => {
					// 		this.keyFlag1 = 0;
					// 		this.n8 = '' + this.funcSet;
					// 		this.n9 = '' + this.funcSet;
					// 		this.o = '' + this.funcSet;
					// 		this.u = '' + this.funcSet;
					// 		this.i = '' + this.funcSet;
					// 		this.j = '' + this.funcSet;
					// 		this.k = '' + this.funcSet;
					// 		this.f5 = '' + this.funcSet;
					// 		this.f6 = '' + this.funcSet;
					// 		this.f7 = '' + this.funcSet;
					// 		this.n7 = '' + this.funcSet;
					// 		this.n0 = '' + this.funcSet;
					// 		this.y = '' + this.funcSet;
					// 		this.p = '' + this.funcSet;
					// 		this.l = '' + this.funcSet;
					// 		this.h = '' + this.funcSet;
					// 		this.n = '' + this.funcSet;
					// 		this.m = '' + this.funcSet;
					// 		this.comma = '' + this.funcSet;
					// 	}, 1000);
					// }
					this.n8 = 'round1' + this.funcSet;
					this.n9 = 'round1' + this.funcSet;
					this.o = 'round1' + this.funcSet;
					this.u = 'round1' + this.funcSet;
					this.i = 'round1' + this.funcSet;
					this.j = 'round1' + this.funcSet;
					this.k = 'round1' + this.funcSet;
					this.f5 = 'round1_2' + this.funcSet;
					this.f6 = 'round1_2' + this.funcSet;
					this.f7 = 'round1_2' + this.funcSet;
					this.n7 = 'round1_2' + this.funcSet;
					this.n0 = 'round1_2' + this.funcSet;
					this.y = 'round1_2' + this.funcSet;
					this.p = 'round1_2' + this.funcSet;
					this.l = 'round1_2' + this.funcSet;
					this.h = 'round1_2' + this.funcSet;
					this.n = 'round1_2' + this.funcSet;
					this.m = 'round1_2' + this.funcSet;
					this.comma = 'round1_2' + this.funcSet;
					this.num = 1
				}
				else if (this.num == 1) {
					this.clear();
					// if (this.keyFlag2 == 0) {
					// 	this.keyFlag2 = 1
					// 	setTimeout(() => {
					// 		this.keyFlag2 = 0;
					// 		this.n8 = '' + this.funcSet;
					// 		this.n9 = '' + this.funcSet;
					// 		this.o = '' + this.funcSet;
					// 		this.u = '' + this.funcSet;
					// 		this.i = '' + this.funcSet;
					// 		this.j = '' + this.funcSet;
					// 		this.k = '' + this.funcSet;
					// 		this.f5 = '' + this.funcSet;
					// 		this.f6 = '' + this.funcSet;
					// 		this.f7 = '' + this.funcSet;
					// 		this.n7 = '' + this.funcSet;
					// 		this.n0 = '' + this.funcSet;
					// 		this.y = '' + this.funcSet;
					// 		this.p = '' + this.funcSet;
					// 		this.l = '' + this.funcSet;
					// 		this.h = '' + this.funcSet;
					// 		this.n = '' + this.funcSet;
					// 		this.m = '' + this.funcSet;
					// 		this.comma = '' + this.funcSet;
					// 	}, 1000);
					// }
					this.num = 0
					this.n8 = 'round2' + this.funcSet;
					this.n9 = 'round2' + this.funcSet;
					this.o = 'round2' + this.funcSet;
					this.u = 'round2' + this.funcSet;
					this.i = 'round2' + this.funcSet;
					this.j = 'round2' + this.funcSet;
					this.k = 'round2' + this.funcSet;
					this.f5 = 'round2_2' + this.funcSet;
					this.f6 = 'round2_2' + this.funcSet;
					this.f7 = 'round2_2' + this.funcSet;
					this.n7 = 'round2_2' + this.funcSet;
					this.n0 = 'round2_2' + this.funcSet;
					this.y = 'round2_2' + this.funcSet;
					this.p = 'round2_2' + this.funcSet;
					this.l = 'round2_2' + this.funcSet;
					this.h = 'round2_2' + this.funcSet;
					this.n = 'round2_2' + this.funcSet;
					this.m = 'round2_2' + this.funcSet;
					this.comma = 'round2_2' + this.funcSet;
				}
				break;

			case this.vKey == 79 && this.keyStatus == 1: //O
				if (this.num == 0) {
					this.clear();
					// if (this.keyFlag1 == 0) {
					// 	this.keyFlag1 = 1
					// 	setTimeout(() => {
					// 		this.keyFlag1 = 0;
					// 		this.n0 = '' + this.funcSet;
					// 		this.n9 = '' + this.funcSet;
					// 		this.o = '' + this.funcSet;
					// 		this.p = '' + this.funcSet;
					// 		this.i = '' + this.funcSet;
					// 		this.l = '' + this.funcSet;
					// 		this.k = '' + this.funcSet;
					// 		this.f6 = '' + this.funcSet;
					// 		this.f7 = '' + this.funcSet;
					// 		this.f8 = '' + this.funcSet;
					// 		this.n8 = '' + this.funcSet;
					// 		this.minus = '' + this.funcSet;
					// 		this.i = '' + this.funcSet;
					// 		this.lqu = '' + this.funcSet;
					// 		this.j = '' + this.funcSet;
					// 		this.sem = '' + this.funcSet;
					// 		this.m = '' + this.funcSet;
					// 		this.comma = '' + this.funcSet;
					// 		this.dot = '' + this.funcSet;
					// 	}, 1000);
					// }
					this.n0 = 'round1' + this.funcSet;
					this.n9 = 'round1' + this.funcSet;
					this.o = 'round1' + this.funcSet;
					this.p = 'round1' + this.funcSet;
					this.i = 'round1' + this.funcSet;
					this.l = 'round1' + this.funcSet;
					this.k = 'round1' + this.funcSet;
					this.f6 = 'round1_2' + this.funcSet;
					this.f7 = 'round1_2' + this.funcSet;
					this.f8 = 'round1_2' + this.funcSet;
					this.n8 = 'round1_2' + this.funcSet;
					this.minus = 'round1_2' + this.funcSet;
					this.i = 'round1_2' + this.funcSet;
					this.lqu = 'round1_2' + this.funcSet;
					this.j = 'round1_2' + this.funcSet;
					this.sem = 'round1_2' + this.funcSet;
					this.m = 'round1_2' + this.funcSet;
					this.comma = 'round1_2' + this.funcSet;
					this.dot = 'round1_2' + this.funcSet;
					this.num = 1
				}
				else if (this.num == 1) {
					this.clear();
					// if (this.keyFlag2 == 0) {
					// 	this.keyFlag2 = 1
					// 	setTimeout(() => {
					// 		this.keyFlag2 = 0;
					// 		this.n0 = '' + this.funcSet;
					// 		this.n9 = '' + this.funcSet;
					// 		this.o = '' + this.funcSet;
					// 		this.p = '' + this.funcSet;
					// 		this.i = '' + this.funcSet;
					// 		this.l = '' + this.funcSet;
					// 		this.k = '' + this.funcSet;
					// 		this.f6 = '' + this.funcSet;
					// 		this.f7 = '' + this.funcSet;
					// 		this.f8 = '' + this.funcSet;
					// 		this.n8 = '' + this.funcSet;
					// 		this.minus = '' + this.funcSet;
					// 		this.i = '' + this.funcSet;
					// 		this.lqu = '' + this.funcSet;
					// 		this.j = '' + this.funcSet;
					// 		this.sem = '' + this.funcSet;
					// 		this.m = '' + this.funcSet;
					// 		this.comma = '' + this.funcSet;
					// 		this.dot = '' + this.funcSet;
					// 	}, 1000);
					// }
					this.num = 0
					this.n0 = 'round2' + this.funcSet;
					this.n9 = 'round2' + this.funcSet;
					this.o = 'round2' + this.funcSet;
					this.p = 'round2' + this.funcSet;
					this.i = 'round2' + this.funcSet;
					this.l = 'round2' + this.funcSet;
					this.k = 'round2' + this.funcSet;
					this.f8 = 'round2_2' + this.funcSet;
					this.f9 = 'round2_2' + this.funcSet;
					this.n8 = 'round2_2' + this.funcSet;
					this.minus = 'round2_2' + this.funcSet;
					this.i = 'round2_2' + this.funcSet;
					this.lqu = 'round2_2' + this.funcSet;
					this.j = 'round2_2' + this.funcSet;
					this.sem = 'round2_2' + this.funcSet;
					this.m = 'round2_2' + this.funcSet;
					this.comma = 'round2_2' + this.funcSet;
					this.dot = 'round2_2' + this.funcSet;
				}
				break;

			case this.vKey == 80 && this.keyStatus == 1: //P
				if (this.num == 0) {
					this.clear();
					// if (this.keyFlag1 == 0) {
					// 	this.keyFlag1 = 1
					// 	setTimeout(() => {
					// 		this.keyFlag1 = 0;
					// 		this.n0 = '' + this.funcSet;
					// 		this.minus = '' + this.funcSet;
					// 		this.o = '' + this.funcSet;
					// 		this.p = '' + this.funcSet;
					// 		this.lqu = '' + this.funcSet;
					// 		this.l = '' + this.funcSet;
					// 		this.sem = '' + this.funcSet;
					// 		this.f7 = '' + this.funcSet;
					// 		this.f8 = '' + this.funcSet;
					// 		this.f9 = '' + this.funcSet;
					// 		this.n9 = '' + this.funcSet;
					// 		this.plus = '' + this.funcSet;
					// 		this.i = '' + this.funcSet;
					// 		this.rqu = '' + this.funcSet;
					// 		this.k = '' + this.funcSet;
					// 		this.quo = '' + this.funcSet;
					// 		this.comma = '' + this.funcSet;
					// 		this.dot = '' + this.funcSet;
					// 		this.qmark = '' + this.funcSet;
					// 	}, 1000);
					// }
					this.n0 = 'round1' + this.funcSet;
					this.minus = 'round1' + this.funcSet;
					this.o = 'round1' + this.funcSet;
					this.p = 'round1' + this.funcSet;
					this.lqu = 'round1' + this.funcSet;
					this.l = 'round1' + this.funcSet;
					this.sem = 'round1' + this.funcSet;
					this.f7 = 'round1_2' + this.funcSet;
					this.f8 = 'round1_2' + this.funcSet;
					this.f9 = 'round1_2' + this.funcSet;
					this.n9 = 'round1_2' + this.funcSet;
					this.plus = 'round1_2' + this.funcSet;
					this.i = 'round1_2' + this.funcSet;
					this.rqu = 'round1_2' + this.funcSet;
					this.k = 'round1_2' + this.funcSet;
					this.quo = 'round1_2' + this.funcSet;
					this.comma = 'round1_2' + this.funcSet;
					this.dot = 'round1_2' + this.funcSet;
					this.qmark = 'round1_2' + this.funcSet;
					this.num = 1
				}
				else if (this.num == 1) {
					this.clear();
					// if (this.keyFlag2 == 0) {
					// 	this.keyFlag2 = 1
					// 	setTimeout(() => {
					// 		this.keyFlag2 = 0;
					// 		this.n0 = '' + this.funcSet;
					// 		this.minus = '' + this.funcSet;
					// 		this.o = '' + this.funcSet;
					// 		this.p = '' + this.funcSet;
					// 		this.lqu = '' + this.funcSet;
					// 		this.l = '' + this.funcSet;
					// 		this.sem = '' + this.funcSet;
					// 		this.f7 = '' + this.funcSet;
					// 		this.f8 = '' + this.funcSet;
					// 		this.f9 = '' + this.funcSet;
					// 		this.n9 = '' + this.funcSet;
					// 		this.plus = '' + this.funcSet;
					// 		this.i = '' + this.funcSet;
					// 		this.rqu = '' + this.funcSet;
					// 		this.k = '' + this.funcSet;
					// 		this.quo = '' + this.funcSet;
					// 		this.comma = '' + this.funcSet;
					// 		this.dot = '' + this.funcSet;
					// 		this.qmark = '' + this.funcSet;
					// 	}, 1000);
					// }
					this.num = 0
					this.n0 = 'round2' + this.funcSet;
					this.minus = 'round2' + this.funcSet;
					this.o = 'round2' + this.funcSet;
					this.p = 'round2' + this.funcSet;
					this.lqu = 'round2' + this.funcSet;
					this.l = 'round2' + this.funcSet;
					this.sem = 'round2' + this.funcSet;
					this.f7 = 'round2_2' + this.funcSet;
					this.f8 = 'round2_2' + this.funcSet;
					this.f9 = 'round2_2' + this.funcSet;
					this.n9 = 'round2_2' + this.funcSet;
					this.plus = 'round2_2' + this.funcSet;
					this.i = 'round2_2' + this.funcSet;
					this.rqu = 'round2_2' + this.funcSet;
					this.k = 'round2_2' + this.funcSet;
					this.quo = 'round2_2' + this.funcSet;
					this.comma = 'round2_2' + this.funcSet;
					this.dot = 'round2_2' + this.funcSet;
					this.qmark = 'round2_2' + this.funcSet;
				}
				break;

			case this.vKey == 219 && this.keyStatus == 1: //lqu
				if (this.num == 0) {
					this.clear();
					// if (this.keyFlag1 == 0) {
					// 	this.keyFlag1 = 1
					// 	setTimeout(() => {
					// 		this.keyFlag1 = 0;
					// 		this.plus = '' + this.funcSet;
					// 		this.minus = '' + this.funcSet;
					// 		this.p = '' + this.funcSet;
					// 		this.lqu = '' + this.funcSet;
					// 		this.sem = '' + this.funcSet;
					// 		this.quo = '' + this.funcSet;
					// 		this.f8 = '' + this.funcSet;
					// 		this.f9 = '' + this.funcSet;
					// 		this.f10 = '' + this.funcSet;
					// 		this.n0 = '' + this.funcSet;
					// 		this.bsp = '' + this.funcSet;
					// 		this.o = '' + this.funcSet;
					// 		this.rqu = '' + this.funcSet;
					// 		this.l = '' + this.funcSet;
					// 		this.enter = '' + this.funcSet;
					// 		this.dot = '' + this.funcSet;
					// 		this.qmark = '' + this.funcSet;
					// 	}, 1000);
					// }
					this.plus = 'round1' + this.funcSet;
					this.minus = 'round1' + this.funcSet;
					this.p = 'round1' + this.funcSet;
					this.lqu = 'round1' + this.funcSet;
					this.sem = 'round1' + this.funcSet;
					this.quo = 'round1' + this.funcSet;
					this.f8 = 'round1_2' + this.funcSet;
					this.f9 = 'round1_2' + this.funcSet;
					this.f10 = 'round1_2' + this.funcSet;
					this.n0 = 'round1_2' + this.funcSet;
					this.bsp = 'round1_2' + this.funcSet;
					this.o = 'round1_2' + this.funcSet;
					this.rqu = 'round1_2' + this.funcSet;
					this.l = 'round1_2' + this.funcSet;
					this.enter = 'round1_2' + this.funcSet;
					this.dot = 'round1_2' + this.funcSet;
					this.qmark = 'round1_2' + this.funcSet;
					this.num = 1
				}
				else if (this.num == 1) {
					this.clear();
					// if (this.keyFlag2 == 0) {
					// 	this.keyFlag2 = 1
					// 	setTimeout(() => {
					// 		this.keyFlag2 = 0;
					// 		this.plus = '' + this.funcSet;
					// 		this.minus = '' + this.funcSet;
					// 		this.p = '' + this.funcSet;
					// 		this.lqu = '' + this.funcSet;
					// 		this.sem = '' + this.funcSet;
					// 		this.quo = '' + this.funcSet;
					// 		this.f8 = '' + this.funcSet;
					// 		this.f9 = '' + this.funcSet;
					// 		this.f10 = '' + this.funcSet;
					// 		this.n0 = '' + this.funcSet;
					// 		this.bsp = '' + this.funcSet;
					// 		this.o = '' + this.funcSet;
					// 		this.rqu = '' + this.funcSet;
					// 		this.l = '' + this.funcSet;
					// 		this.enter = '' + this.funcSet;
					// 		this.dot = '' + this.funcSet;
					// 		this.qmark = '' + this.funcSet;
					// 	}, 1000);
					// }
					this.num = 0
					this.plus = 'round2' + this.funcSet;
					this.minus = 'round2' + this.funcSet;
					this.p = 'round2' + this.funcSet;
					this.lqu = 'round2' + this.funcSet;
					this.sem = 'round2' + this.funcSet;
					this.quo = 'round2' + this.funcSet;
					this.f8 = 'round2_2' + this.funcSet;
					this.f9 = 'round2_2' + this.funcSet;
					this.f10 = 'round2_2' + this.funcSet;
					this.n0 = 'round2_2' + this.funcSet;
					this.bsp = 'round2_2' + this.funcSet;
					this.o = 'round2_2' + this.funcSet;
					this.rqu = 'round2_2' + this.funcSet;
					this.l = 'round2_2' + this.funcSet;
					this.enter = 'round2_2' + this.funcSet;
					this.dot = 'round2_2' + this.funcSet;
					this.qmark = 'round2_2' + this.funcSet;
				}
				break;

			case this.vKey == 221 && this.keyStatus == 1: //rqu 
				if (this.num == 0) {
					this.clear();
					// if (this.keyFlag1 == 0) {
					// 	this.keyFlag1 = 1
					// 	setTimeout(() => {
					// 		this.keyFlag1 = 0;
					// 		this.plus = '' + this.funcSet;
					// 		this.rqu = '' + this.funcSet;
					// 		this.lqu = '' + this.funcSet;
					// 		this.quo = '' + this.funcSet;
					// 		this.drawn = '' + this.funcSet;
					// 		this.f9 = '' + this.funcSet;
					// 		this.f10 = '' + this.funcSet;
					// 		this.f11 = '' + this.funcSet;
					// 		this.minus = '' + this.funcSet;
					// 		this.bsp = '' + this.funcSet;
					// 		this.p = '' + this.funcSet;
					// 		this.sem = '' + this.funcSet;
					// 		this.enter = '' + this.funcSet;
					// 		this.qmark = '' + this.funcSet;
					// 		this.rshift = '' + this.funcSet;
					// 	}, 1000);
					// }
					this.plus = 'round1' + this.funcSet;
					this.rqu = 'round1' + this.funcSet;
					this.lqu = 'round1' + this.funcSet;
					this.quo = 'round1' + this.funcSet;
					this.drawn = 'round1' + this.funcSet;
					this.f9 = 'round1_2' + this.funcSet;
					this.f10 = 'round1_2' + this.funcSet;
					this.f11 = 'round1_2' + this.funcSet;
					this.minus = 'round1_2' + this.funcSet;
					this.bsp = 'round1_2' + this.funcSet;
					this.p = 'round1_2' + this.funcSet;
					this.sem = 'round1_2' + this.funcSet;
					this.enter = 'round1_2' + this.funcSet;
					this.qmark = 'round1_2' + this.funcSet;
					this.rshift = 'round1_2' + this.funcSet;
					this.num = 1
				}
				else if (this.num == 1) {
					this.clear();
					// if (this.keyFlag2 == 0) {
					// 	this.keyFlag2 = 1
					// 	setTimeout(() => {
					// 		this.keyFlag2 = 0;
					// 		this.plus = '' + this.funcSet;
					// 		this.rqu = '' + this.funcSet;
					// 		this.lqu = '' + this.funcSet;
					// 		this.quo = '' + this.funcSet;
					// 		this.drawn = '' + this.funcSet;
					// 		this.f9 = '' + this.funcSet;
					// 		this.f10 = '' + this.funcSet;
					// 		this.f11 = '' + this.funcSet;
					// 		this.minus = '' + this.funcSet;
					// 		this.bsp = '' + this.funcSet;
					// 		this.p = '' + this.funcSet;
					// 		this.sem = '' + this.funcSet;
					// 		this.enter = '' + this.funcSet;
					// 		this.qmark = '' + this.funcSet;
					// 		this.rshift = '' + this.funcSet;
					// 	}, 1000);
					// }
					this.num = 0
					this.plus = 'round2' + this.funcSet;
					this.rqu = 'round2' + this.funcSet;
					this.lqu = 'round2' + this.funcSet;
					this.quo = 'round2' + this.funcSet;
					this.drawn = 'round2' + this.funcSet;
					this.f9 = 'round2_2' + this.funcSet;
					this.f10 = 'round2_2' + this.funcSet;
					this.f11 = 'round2_2' + this.funcSet;
					this.minus = 'round2_2' + this.funcSet;
					this.bsp = 'round2_2' + this.funcSet;
					this.p = 'round2_2' + this.funcSet;
					this.sem = 'round2_2' + this.funcSet;
					this.enter = 'round2_2' + this.funcSet;
					this.qmark = 'round2_2' + this.funcSet;
					this.rshift = 'round2_2' + this.funcSet;
				}
				break;

			case this.vKey == 220 && this.keyStatus == 1: //drawn
				if (this.num == 0) {
					this.clear();
					// if (this.keyFlag1 == 0) {
					// 	this.keyFlag1 = 1
					// 	setTimeout(() => {
					// 		this.keyFlag1 = 0;
					// 		this.bsp = '' + this.funcSet;
					// 		this.rqu = '' + this.funcSet;
					// 		this.enter = '' + this.funcSet;
					// 		this.drawn = '' + this.funcSet;
					// 		this.f10 = '' + this.funcSet;
					// 		this.f11 = '' + this.funcSet;
					// 		this.f12 = '' + this.funcSet;
					// 		this.minus = '' + this.funcSet;
					// 		this.plus = '' + this.funcSet;
					// 		this.insert = '' + this.funcSet;
					// 		this.lqu = '' + this.funcSet;
					// 		this.delete = '' + this.funcSet;
					// 		this.quo = '' + this.funcSet;
					// 		this.rshift = '' + this.funcSet;
					// 	}, 1000);
					// }
					this.bsp = 'round1' + this.funcSet;
					this.rqu = 'round1' + this.funcSet;
					this.enter = 'round1' + this.funcSet;
					this.drawn = 'round1' + this.funcSet;
					this.f10 = 'round1_2' + this.funcSet;
					this.f11 = 'round1_2' + this.funcSet;
					this.f12 = 'round1_2' + this.funcSet;
					this.minus = 'round1_2' + this.funcSet;
					this.plus = 'round1_2' + this.funcSet;
					this.insert = 'round1_2' + this.funcSet;
					this.lqu = 'round1_2' + this.funcSet;
					this.delete = 'round1_2' + this.funcSet;
					this.quo = 'round1_2' + this.funcSet;
					this.rshift = 'round1_2' + this.funcSet;
					this.num = 1
				}
				else if (this.num == 1) {
					this.clear();
					// if (this.keyFlag2 == 0) {
					// 	this.keyFlag2 = 1
					// 	setTimeout(() => {
					// 		this.keyFlag2 = 0;
					// 		this.bsp = '' + this.funcSet;
					// 		this.rqu = '' + this.funcSet;
					// 		this.enter = '' + this.funcSet;
					// 		this.drawn = '' + this.funcSet;
					// 		this.f10 = '' + this.funcSet;
					// 		this.f11 = '' + this.funcSet;
					// 		this.f12 = '' + this.funcSet;
					// 		this.minus = '' + this.funcSet;
					// 		this.plus = '' + this.funcSet;
					// 		this.insert = '' + this.funcSet;
					// 		this.lqu = '' + this.funcSet;
					// 		this.delete = '' + this.funcSet;
					// 		this.quo = '' + this.funcSet;
					// 		this.rshift = '' + this.funcSet;
					// 	}, 1000);
					// }
					this.num = 0
					this.bsp = 'round2' + this.funcSet;
					this.rqu = 'round2' + this.funcSet;
					this.enter = 'round2' + this.funcSet;
					this.drawn = 'round2' + this.funcSet;
					this.f10 = 'round2_2' + this.funcSet;
					this.f11 = 'round2_2' + this.funcSet;
					this.f12 = 'round2_2' + this.funcSet;
					this.minus = 'round2_2' + this.funcSet;
					this.plus = 'round2_2' + this.funcSet;
					this.insert = 'round2_2' + this.funcSet;
					this.lqu = 'round2_2' + this.funcSet;
					this.delete = 'round2_2' + this.funcSet;
					this.quo = 'round2_2' + this.funcSet;
					this.rshift = 'round2_2' + this.funcSet;
				}
				break;

			case this.vKey == 46 && this.keyStatus == 1: //delete
				if (this.num == 0) {
					this.clear();
					// if (this.keyFlag1 == 0) {
					// 	this.keyFlag1 = 1
					// 	setTimeout(() => {
					// 		this.keyFlag1 = 0;
					// 		this.delete = '' + this.funcSet;
					// 		this.home = '' + this.funcSet;
					// 		this.end = '' + this.funcSet;
					// 		this.insert = '' + this.funcSet;
					// 		this.f12 = '' + this.funcSet;
					// 		this.print = '' + this.funcSet;
					// 		this.scroll = '' + this.funcSet;
					// 		this.bsp = '' + this.funcSet;
					// 		this.pup = '' + this.funcSet;
					// 		this.pdown = '' + this.funcSet;
					// 		this.enter = '' + this.funcSet;
					// 	}, 1000);
					// }
					this.delete = 'round1' + this.funcSet;
					this.home = 'round1' + this.funcSet;
					this.end = 'round1' + this.funcSet;
					this.insert = 'round1' + this.funcSet;
					this.f12 = 'round1_2' + this.funcSet;
					this.print = 'round1_2' + this.funcSet;
					this.scroll = 'round1_2' + this.funcSet;
					this.bsp = 'round1_2' + this.funcSet;
					this.pup = 'round1_2' + this.funcSet;
					this.pdown = 'round1_2' + this.funcSet;
					this.enter = 'round1_2' + this.funcSet;
					this.num = 1
				}
				else if (this.num == 1) {
					this.clear();
					// if (this.keyFlag2 == 0) {
					// 	this.keyFlag2 = 1
					// 	setTimeout(() => {
					// 		this.keyFlag2 = 0;
					// 		this.delete = '' + this.funcSet;
					// 		this.home = '' + this.funcSet;
					// 		this.end = '' + this.funcSet;
					// 		this.insert = '' + this.funcSet;
					// 		this.f12 = '' + this.funcSet;
					// 		this.print = '' + this.funcSet;
					// 		this.scroll = '' + this.funcSet;
					// 		this.bsp = '' + this.funcSet;
					// 		this.pup = '' + this.funcSet;
					// 		this.pdown = '' + this.funcSet;
					// 		this.enter = '' + this.funcSet;
					// 	}, 1000);
					// }
					this.num = 0
					this.delete = 'round2' + this.funcSet;
					this.home = 'round2' + this.funcSet;
					this.end = 'round2' + this.funcSet;
					this.insert = 'round2' + this.funcSet;
					this.f12 = 'round2_2' + this.funcSet;
					this.print = 'round2_2' + this.funcSet;
					this.scroll = 'round2_2' + this.funcSet;
					this.bsp = 'round2_2' + this.funcSet;
					this.pup = 'round2_2' + this.funcSet;
					this.pdown = 'round2_2' + this.funcSet;
					this.enter = 'round2_2' + this.funcSet;
				}
				break;

			case this.vKey == 35 && this.keyStatus == 1: //end
				if (this.num == 0) {
					this.clear();
					// if (this.keyFlag1 == 0) {
					// 	this.keyFlag1 = 1
					// 	setTimeout(() => {
					// 		this.keyFlag1 = 0;
					// 		this.delete = '' + this.funcSet;
					// 		this.home = '' + this.funcSet;
					// 		this.end = '' + this.funcSet;
					// 		this.pup = '' + this.funcSet;
					// 		this.pdown = '' + this.funcSet;
					// 		this.print = '' + this.funcSet;
					// 		this.scroll = '' + this.funcSet;
					// 		this.pause = '' + this.funcSet;
					// 		this.bsp = '' + this.funcSet;
					// 		this.insert = '' + this.funcSet;
					// 		this.numlock = '' + this.funcSet;
					// 		this.num7 = '' + this.funcSet;
					// 		this.up = '' + this.funcSet;
					// 	}, 1000);
					// }
					this.delete = 'round1' + this.funcSet;
					this.home = 'round1' + this.funcSet;
					this.end = 'round1' + this.funcSet;
					this.pup = 'round1' + this.funcSet;
					this.pdown = 'round1' + this.funcSet;
					this.print = 'round1_2' + this.funcSet;
					this.scroll = 'round1_2' + this.funcSet;
					this.pause = 'round1_2' + this.funcSet;
					this.bsp = 'round1_2' + this.funcSet;
					this.insert = 'round1_2' + this.funcSet;
					this.numlock = 'round1_2' + this.funcSet;
					this.num7 = 'round1_2' + this.funcSet;
					this.up = 'round1_2' + this.funcSet;
					this.num = 1
				}
				else if (this.num == 1) {
					this.clear();
					// if (this.keyFlag2 == 0) {
					// 	this.keyFlag2 = 1
					// 	setTimeout(() => {
					// 		this.keyFlag2 = 0;
					// 		this.delete = '' + this.funcSet;
					// 		this.home = '' + this.funcSet;
					// 		this.end = '' + this.funcSet;
					// 		this.pup = '' + this.funcSet;
					// 		this.pdown = '' + this.funcSet;
					// 		this.print = '' + this.funcSet;
					// 		this.scroll = '' + this.funcSet;
					// 		this.pause = '' + this.funcSet;
					// 		this.bsp = '' + this.funcSet;
					// 		this.insert = '' + this.funcSet;
					// 		this.numlock = '' + this.funcSet;
					// 		this.num7 = '' + this.funcSet;
					// 		this.up = '' + this.funcSet;
					// 	}, 1000);
					// }
					this.num = 0
					this.delete = 'round2' + this.funcSet;
					this.home = 'round2' + this.funcSet;
					this.end = 'round2' + this.funcSet;
					this.pup = 'round2' + this.funcSet;
					this.pdown = 'round2' + this.funcSet;
					this.print = 'round2_2' + this.funcSet;
					this.scroll = 'round2_2' + this.funcSet;
					this.pause = 'round2_2' + this.funcSet;
					this.bsp = 'round2_2' + this.funcSet;
					this.insert = 'round2_2' + this.funcSet;
					this.numlock = 'round2_2' + this.funcSet;
					this.num7 = 'round2_2' + this.funcSet;
					this.up = 'round2_2' + this.funcSet;
				}
				break;

			case this.vKey == 34 && this.keyStatus == 1: //pdown
				if (this.num == 0) {
					this.clear();
					// if (this.keyFlag1 == 0) {
					// 	this.keyFlag1 = 1
					// 	setTimeout(() => {
					// 		this.keyFlag1 = 0;
					// 		this.numlock = '' + this.funcSet;
					// 		this.num7 = '' + this.funcSet;
					// 		this.end = '' + this.funcSet;
					// 		this.pup = '' + this.funcSet;
					// 		this.pdown = '' + this.funcSet;
					// 		this.scroll = '' + this.funcSet;
					// 		this.pause = '' + this.funcSet;
					// 		this.insert = '' + this.funcSet;
					// 		this.home = '' + this.funcSet;
					// 		this.delete = '' + this.funcSet;
					// 		this.num4 = '' + this.funcSet;
					// 		this.num1 = '' + this.funcSet;
					// 		this.up = '' + this.funcSet;
					// 	}, 1000);
					// }
					this.numlock = 'round1' + this.funcSet;
					this.num7 = 'round1' + this.funcSet;
					this.end = 'round1' + this.funcSet;
					this.pup = 'round1' + this.funcSet;
					this.pdown = 'round1' + this.funcSet;
					this.scroll = 'round1_2' + this.funcSet;
					this.pause = 'round1_2' + this.funcSet;
					this.insert = 'round1_2' + this.funcSet;
					this.home = 'round1_2' + this.funcSet;
					this.delete = 'round1_2' + this.funcSet;
					this.num4 = 'round1_2' + this.funcSet;
					this.num1 = 'round1_2' + this.funcSet;
					this.up = 'round1_2' + this.funcSet;
					this.num = 1
				}
				else if (this.num == 1) {
					this.clear();
					// if (this.keyFlag2 == 0) {
					// 	this.keyFlag2 = 1
					// 	setTimeout(() => {
					// 		this.keyFlag2 = 0;
					// 		this.numlock = '' + this.funcSet;
					// 		this.num7 = '' + this.funcSet;
					// 		this.end = '' + this.funcSet;
					// 		this.pup = '' + this.funcSet;
					// 		this.pdown = '' + this.funcSet;
					// 		this.scroll = '' + this.funcSet;
					// 		this.pause = '' + this.funcSet;
					// 		this.insert = '' + this.funcSet;
					// 		this.home = '' + this.funcSet;
					// 		this.delete = '' + this.funcSet;
					// 		this.num4 = '' + this.funcSet;
					// 		this.num1 = '' + this.funcSet;
					// 		this.up = '' + this.funcSet;
					// 	}, 1000);
					// }
					this.num = 0
					this.numlock = 'round2' + this.funcSet;
					this.num7 = 'round2' + this.funcSet;
					this.end = 'round2' + this.funcSet;
					this.pup = 'round2' + this.funcSet;
					this.pdown = 'round2' + this.funcSet;
					this.scroll = 'round2_2' + this.funcSet;
					this.pause = 'round2_2' + this.funcSet;
					this.insert = 'round2_2' + this.funcSet;
					this.home = 'round2_2' + this.funcSet;
					this.delete = 'round2_2' + this.funcSet;
					this.num4 = 'round2_2' + this.funcSet;
					this.num1 = 'round2_2' + this.funcSet;
					this.up = 'round2_2' + this.funcSet;
				}
				break;

			case this.vKey == 103 && this.keyStatus == 1: //num7
				//console.log('num7 ready')
				if (this.num == 0) {
					this.clear();
					// if (this.keyFlag1 == 0) {
					// 	this.keyFlag1 = 1
					// 	setTimeout(() => {
					// 		this.keyFlag1 = 0;
					// 		this.numlock = '' + this.funcSet;
					// 		this.num7 = '' + this.funcSet;
					// 		this.num8 = '' + this.funcSet;
					// 		this.num4 = '' + this.funcSet;
					// 		this.num5 = '' + this.funcSet;
					// 		this.numdrawn = '' + this.funcSet;
					// 		this.pdown = '' + this.funcSet;
					// 		this.pause = '' + this.funcSet;
					// 		this.home = '' + this.funcSet;
					// 		this.pup = '' + this.funcSet;
					// 		this.end = '' + this.funcSet;
					// 		this.numtimes = '' + this.funcSet;
					// 		this.num9 = '' + this.funcSet;
					// 		this.num5 = '' + this.funcSet;
					// 		this.num1 = '' + this.funcSet;
					// 		this.num2 = '' + this.funcSet;
					// 	}, 1000);
					// }
					this.numlock = 'round1' + this.funcSet;
					this.num7 = 'round1' + this.funcSet;
					this.num8 = 'round1' + this.funcSet;
					this.num4 = 'round1' + this.funcSet;
					this.num5 = 'round1' + this.funcSet;
					this.numdrawn = 'round1' + this.funcSet;
					this.pdown = 'round1' + this.funcSet;
					this.pause = 'round1_2' + this.funcSet;
					this.home = 'round1_2' + this.funcSet;
					this.pup = 'round1_2' + this.funcSet;
					this.end = 'round1_2' + this.funcSet;
					this.numtimes = 'round1_2' + this.funcSet;
					this.num9 = 'round1_2' + this.funcSet;
					this.num5 = 'round1_2' + this.funcSet;
					this.num1 = 'round1_2' + this.funcSet;
					this.num2 = 'round1_2' + this.funcSet;
					this.num = 1
				}
				else if (this.num == 1) {
					this.clear();
					// if (this.keyFlag2 == 0) {
					// 	this.keyFlag2 = 1
					// 	setTimeout(() => {
					// 		this.keyFlag2 = 0;
					// 		this.numlock = '' + this.funcSet;
					// 		this.num7 = '' + this.funcSet;
					// 		this.num8 = '' + this.funcSet;
					// 		this.num4 = '' + this.funcSet;
					// 		this.num5 = '' + this.funcSet;
					// 		this.numdrawn = '' + this.funcSet;
					// 		this.pdown = '' + this.funcSet;
					// 		this.pause = '' + this.funcSet;
					// 		this.home = '' + this.funcSet;
					// 		this.pup = '' + this.funcSet;
					// 		this.end = '' + this.funcSet;
					// 		this.numtimes = '' + this.funcSet;
					// 		this.num9 = '' + this.funcSet;
					// 		this.num5 = '' + this.funcSet;
					// 		this.num1 = '' + this.funcSet;
					// 		this.num2 = '' + this.funcSet;
					// 	}, 1000);
					// }
					this.num = 0
					this.numlock = 'round2' + this.funcSet;
					this.num7 = 'round2' + this.funcSet;
					this.num5 = 'round2' + this.funcSet;
					this.numdrawn = 'round2' + this.funcSet;
					this.pdown = 'round2' + this.funcSet;
					this.pause = 'round2_2' + this.funcSet;
					this.home = 'round2_2' + this.funcSet;
					this.pup = 'round2_2' + this.funcSet;
					this.end = 'round2_2' + this.funcSet;
					this.numtimes = 'round2_2' + this.funcSet;
					this.num9 = 'round2_2' + this.funcSet;
					this.num5 = 'round2_2' + this.funcSet;
					this.num1 = 'round2_2' + this.funcSet;
					this.num2 = 'round2_2' + this.funcSet;
				}
				break;

			case this.vKey == 104 && this.keyStatus == 1: //num8
				//console.log('num8 ready')
				if (this.num == 0) {
					this.clear();
					// if (this.keyFlag1 == 0) {
					// 	this.keyFlag1 = 1
					// 	setTimeout(() => {
					// 		this.keyFlag1 = 0;
					// 		this.numdrawn = '' + this.funcSet;
					// 		this.numtimes = '' + this.funcSet;
					// 		this.num7 = '' + this.funcSet;
					// 		this.num8 = '' + this.funcSet;
					// 		this.num9 = '' + this.funcSet;
					// 		this.num4 = '' + this.funcSet;
					// 		this.num5 = '' + this.funcSet;
					// 		this.num6 = '' + this.funcSet;
					// 		this.pup = '' + this.funcSet;
					// 		this.numlock = '' + this.funcSet;
					// 		this.pdown = '' + this.funcSet;
					// 		this.numminus = '' + this.funcSet;
					// 		this.numplus = '' + this.funcSet;
					// 		this.num6 = '' + this.funcSet;
					// 		this.num1 = '' + this.funcSet;
					// 		this.num2 = '' + this.funcSet;
					// 		this.num3 = '' + this.funcSet;
					// 	}, 1000);
					// }
					this.numdrawn = 'round1' + this.funcSet;
					this.numtimes = 'round1' + this.funcSet;
					this.num7 = 'round1' + this.funcSet;
					this.num8 = 'round1' + this.funcSet;
					this.num9 = 'round1' + this.funcSet;
					this.num4 = 'round1' + this.funcSet;
					this.num5 = 'round1' + this.funcSet;
					this.num6 = 'round1' + this.funcSet;
					this.pup = 'round1_2' + this.funcSet;
					this.numlock = 'round1_2' + this.funcSet;
					this.pdown = 'round1_2' + this.funcSet;
					this.numminus = 'round1_2' + this.funcSet;
					this.numplus = 'round1_2' + this.funcSet;
					this.num6 = 'round1_2' + this.funcSet;
					this.num1 = 'round1_2' + this.funcSet;
					this.num2 = 'round1_2' + this.funcSet;
					this.num3 = 'round1_2' + this.funcSet;
					this.num = 1
				}
				else if (this.num == 1) {
					this.clear();
					// if (this.keyFlag2 == 0) {
					// 	this.keyFlag2 = 1
					// 	setTimeout(() => {
					// 		this.keyFlag2 = 0;
					// 		this.numdrawn = '' + this.funcSet;
					// 		this.numtimes = '' + this.funcSet;
					// 		this.num7 = '' + this.funcSet;
					// 		this.num8 = '' + this.funcSet;
					// 		this.num9 = '' + this.funcSet;
					// 		this.num4 = '' + this.funcSet;
					// 		this.num5 = '' + this.funcSet;
					// 		this.num6 = '' + this.funcSet;
					// 		this.pup = '' + this.funcSet;
					// 		this.numlock = '' + this.funcSet;
					// 		this.pdown = '' + this.funcSet;
					// 		this.numminus = '' + this.funcSet;
					// 		this.numplus = '' + this.funcSet;
					// 		this.num6 = '' + this.funcSet;
					// 		this.num1 = '' + this.funcSet;
					// 		this.num2 = '' + this.funcSet;
					// 		this.num3 = '' + this.funcSet;
					// 	}, 1000);
					// }
					this.num = 0
					this.numdrawn = 'round2' + this.funcSet;
					this.numtimes = 'round2' + this.funcSet;
					this.num7 = 'round2' + this.funcSet;
					this.num8 = 'round2' + this.funcSet;
					this.num9 = 'round2' + this.funcSet;
					this.num4 = 'round2' + this.funcSet;
					this.num5 = 'round2' + this.funcSet;
					this.num6 = 'round2' + this.funcSet;
					this.pup = 'round2_2' + this.funcSet;
					this.numlock = 'round2_2' + this.funcSet;
					this.pdown = 'round2_2' + this.funcSet;
					this.numminus = 'round2_2' + this.funcSet;
					this.numplus = 'round2_2' + this.funcSet;
					this.num6 = 'round2_2' + this.funcSet;
					this.num1 = 'round2_2' + this.funcSet;
					this.num2 = 'round2_2' + this.funcSet;
					this.num3 = 'round2_2' + this.funcSet;
				}
				break;

			case this.vKey == 105 && this.keyStatus == 1: //num9
				//console.log('num9 ready')
				if (this.num == 0) {
					this.clear();
					// if (this.keyFlag1 == 0) {
					// 	this.keyFlag1 = 1
					// 	setTimeout(() => {
					// 		this.keyFlag1 = 0;
					// 		this.numminus = '' + this.funcSet;
					// 		this.numtimes = '' + this.funcSet;
					// 		this.num8 = '' + this.funcSet;
					// 		this.num9 = '' + this.funcSet;
					// 		this.num5 = '' + this.funcSet;
					// 		this.num6 = '' + this.funcSet;
					// 		this.numplus = '' + this.funcSet;
					// 		this.numlock = '' + this.funcSet;
					// 		this.numdrawn = '' + this.funcSet;
					// 		this.numdrawn = '' + this.funcSet;
					// 		this.num7 = '' + this.funcSet;
					// 		this.num4 = '' + this.funcSet;
					// 		this.num2 = '' + this.funcSet;
					// 		this.num3 = '' + this.funcSet;
					// 		this.numenter = '' + this.funcSet;
					// 	}, 1000);
					// }
					this.numminus = 'round1' + this.funcSet;
					this.numtimes = 'round1' + this.funcSet;
					this.num8 = 'round1' + this.funcSet;
					this.num9 = 'round1' + this.funcSet;
					this.num5 = 'round1' + this.funcSet;
					this.num6 = 'round1' + this.funcSet;
					this.numplus = 'round1' + this.funcSet;
					this.numlock = 'round1_2' + this.funcSet;
					this.numdrawn = 'round1_2' + this.funcSet;
					this.numdrawn = 'round1_2' + this.funcSet;
					this.num7 = 'round1_2' + this.funcSet;
					this.num4 = 'round1_2' + this.funcSet;
					this.num2 = 'round1_2' + this.funcSet;
					this.num3 = 'round1_2' + this.funcSet;
					this.numenter = 'round1_2' + this.funcSet;
					this.num = 1
				}
				else if (this.num == 1) {
					this.clear();
					// if (this.keyFlag2 == 0) {
					// 	this.keyFlag2 = 1
					// 	setTimeout(() => {
					// 		this.keyFlag2 = 0;
					// 		this.numminus = '' + this.funcSet;
					// 		this.numtimes = '' + this.funcSet;
					// 		this.num8 = '' + this.funcSet;
					// 		this.num9 = '' + this.funcSet;
					// 		this.num5 = '' + this.funcSet;
					// 		this.num6 = '' + this.funcSet;
					// 		this.numplus = '' + this.funcSet;
					// 		this.numlock = '' + this.funcSet;
					// 		this.numdrawn = '' + this.funcSet;
					// 		this.numdrawn = '' + this.funcSet;
					// 		this.num7 = '' + this.funcSet;
					// 		this.num4 = '' + this.funcSet;
					// 		this.num2 = '' + this.funcSet;
					// 		this.num3 = '' + this.funcSet;
					// 		this.numenter = '' + this.funcSet;
					// 	}, 1000);
					// }
					this.num = 0
					this.numminus = 'round2' + this.funcSet;
					this.numtimes = 'round2' + this.funcSet;
					this.num8 = 'round2' + this.funcSet;
					this.num9 = 'round2' + this.funcSet;
					this.num5 = 'round2' + this.funcSet;
					this.num6 = 'round2' + this.funcSet;
					this.numplus = 'round2' + this.funcSet;
					this.numlock = 'round2_2' + this.funcSet;
					this.numdrawn = 'round2_2' + this.funcSet;
					this.numdrawn = 'round2_2' + this.funcSet;
					this.num7 = 'round2_2' + this.funcSet;
					this.num4 = 'round2_2' + this.funcSet;
					this.num2 = 'round2_2' + this.funcSet;
					this.num3 = 'round2_2' + this.funcSet;
					this.numenter = 'round2_2' + this.funcSet;
				}
				break;

			case this.vKey == 107 && this.keyStatus == 1: //numplus
				if (this.num == 0) {
					this.clear();
					// if (this.keyFlag1 == 0) {
					// 	this.keyFlag1 = 1
					// 	setTimeout(() => {
					// 		this.keyFlag1 = 0;
					// 		this.numminus = '' + this.funcSet;
					// 		this.num9 = '' + this.funcSet;
					// 		this.num6 = '' + this.funcSet;
					// 		this.numplus = '' + this.funcSet;
					// 		this.numdrawn = '' + this.funcSet;
					// 		this.numtimes = '' + this.funcSet;
					// 		this.num8 = '' + this.funcSet;
					// 		this.num5 = '' + this.funcSet;
					// 		this.num3 = '' + this.funcSet;
					// 		this.numenter = '' + this.funcSet;
					// 	}, 1000);
					// }
					this.numminus = 'round1' + this.funcSet;
					this.num9 = 'round1' + this.funcSet;
					this.num6 = 'round1' + this.funcSet;
					this.numplus = 'round1' + this.funcSet;
					this.numdrawn = 'round1_2' + this.funcSet;
					this.numtimes = 'round1_2' + this.funcSet;
					this.num8 = 'round1_2' + this.funcSet;
					this.num5 = 'round1_2' + this.funcSet;
					this.num3 = 'round1_2' + this.funcSet;
					this.numenter = 'round1_2' + this.funcSet;
					this.num = 1
				}


				else if (this.num == 1) {
					this.clear();
					// if (this.keyFlag2 == 0) {
					// 	this.keyFlag2 = 1
					// 	setTimeout(() => {
					// 		this.keyFlag2 = 0;
					// 		this.numminus = '' + this.funcSet;
					// 		this.num9 = '' + this.funcSet;
					// 		this.num6 = '' + this.funcSet;
					// 		this.numplus = '' + this.funcSet;
					// 		this.numdrawn = '' + this.funcSet;
					// 		this.numtimes = '' + this.funcSet;
					// 		this.num8 = '' + this.funcSet;
					// 		this.num5 = '' + this.funcSet;
					// 		this.num3 = '' + this.funcSet;
					// 		this.numenter = '' + this.funcSet;
					// 	}, 1000);
					// }
					this.num = 0
					this.numminus = 'round2' + this.funcSet;
					this.num9 = 'round2' + this.funcSet;
					this.num6 = 'round2' + this.funcSet;
					this.numplus = 'round2' + this.funcSet;
					this.numdrawn = '' + this.funcSet;
					this.numtimes = '' + this.funcSet;
					this.num8 = '' + this.funcSet;
					this.num5 = '' + this.funcSet;
					this.num3 = '' + this.funcSet;
					this.numenter = '' + this.funcSet;
				}
				break;

			case this.vKey == 20 && this.keyStatus == 1: //CAPS
				if (this.num == 0) {
					this.clear();
					// if (this.keyFlag1 == 0) {
					// 	this.keyFlag1 = 1
					// 	setTimeout(() => {
					// 		this.keyFlag1 = 0;
					// 		this.caps = '' + this.funcSet;
					// 		this.tab = '' + this.funcSet;
					// 		this.lshift = '' + this.funcSet;
					// 		this.q = '' + this.funcSet;
					// 		this.a = '' + this.funcSet;
					// 		this.perid = '' + this.funcSet;
					// 		this.n1 = '' + this.funcSet;
					// 		this.w = '' + this.funcSet;
					// 		this.s = '' + this.funcSet;
					// 		this.lctrl = '' + this.funcSet;
					// 		this.win = '' + this.funcSet;
					// 	}, 1000);
					// }
					this.caps = 'round1' + this.funcSet;
					this.tab = 'round1' + this.funcSet;
					this.lshift = 'round1' + this.funcSet;
					this.q = 'round1' + this.funcSet;
					this.a = 'round1' + this.funcSet;
					this.perid = 'round1_2' + this.funcSet;
					this.n1 = 'round1_2' + this.funcSet;
					this.w = 'round1_2' + this.funcSet;
					this.s = 'round1_2' + this.funcSet;
					this.lctrl = 'round1_2' + this.funcSet;
					this.win = 'round1_2' + this.funcSet;
					this.num = 1
				}
				else if (this.num == 1) {
					this.clear();
					// if (this.keyFlag2 == 0) {
					// 	this.keyFlag2 = 1
					// 	setTimeout(() => {
					// 		this.keyFlag2 = 0;
					// 		this.caps = '' + this.funcSet;
					// 		this.tab = '' + this.funcSet;
					// 		this.lshift = '' + this.funcSet;
					// 		this.q = '' + this.funcSet;
					// 		this.a = '' + this.funcSet;
					// 		this.perid = '' + this.funcSet;
					// 		this.n1 = '' + this.funcSet;
					// 		this.w = '' + this.funcSet;
					// 		this.s = '' + this.funcSet;
					// 		this.lctrl = '' + this.funcSet;
					// 		this.win = '' + this.funcSet;
					// 	}, 1000);
					// }
					this.num = 0
					this.caps = 'round2' + this.funcSet;
					this.tab = 'round2' + this.funcSet;
					this.lshift = 'round2' + this.funcSet;
					this.q = 'round2' + this.funcSet;
					this.a = 'round2' + this.funcSet;
					this.perid = 'round2_2' + this.funcSet;
					this.n1 = 'round2_2' + this.funcSet;
					this.w = 'round2_2' + this.funcSet;
					this.s = 'round2_2' + this.funcSet;
					this.lctrl = 'round2_2' + this.funcSet;
					this.win = 'round2_2' + this.funcSet;
				}
				break;

			case this.vKey == 65 && this.keyStatus == 1: //A
				if (this.num == 0) {
					this.clear();
					// if (this.keyFlag1 == 0) {
					// 	this.keyFlag1 = 1
					// 	setTimeout(() => {
					// 		this.keyFlag1 = 0;
					// 		this.caps = '' + this.funcSet;
					// 		this.z = '' + this.funcSet;
					// 		this.lshift = '' + this.funcSet;
					// 		this.q = '' + this.funcSet;
					// 		this.a = '' + this.funcSet;
					// 		this.s = '' + this.funcSet;
					// 		this.w = '' + this.funcSet;
					// 		this.tab = '' + this.funcSet;
					// 		this.n1 = '' + this.funcSet;
					// 		this.n2 = '' + this.funcSet;
					// 		this.n3 = '' + this.funcSet;
					// 		this.e = '' + this.funcSet;
					// 		this.d = '' + this.funcSet;
					// 		this.x = '' + this.funcSet;
					// 		this.win = '' + this.funcSet;
					// 		this.lalt = '' + this.funcSet;
					// 	}, 1000);
					// }
					this.caps = 'round1' + this.funcSet;
					this.z = 'round1' + this.funcSet;
					this.lshift = 'round1' + this.funcSet;
					this.q = 'round1' + this.funcSet;
					this.a = 'round1' + this.funcSet;
					this.s = 'round1' + this.funcSet;
					this.w = 'round1' + this.funcSet;
					this.tab = 'round1_2' + this.funcSet;
					this.n1 = 'round1_2' + this.funcSet;
					this.n2 = 'round1_2' + this.funcSet;
					this.n3 = 'round1_2' + this.funcSet;
					this.e = 'round1_2' + this.funcSet;
					this.d = 'round1_2' + this.funcSet;
					this.x = 'round1_2' + this.funcSet;
					this.win = 'round1_2' + this.funcSet;
					this.lalt = 'round1_2' + this.funcSet;
					this.num = 1
				}
				else if (this.num == 1) {
					this.clear();
					// if (this.keyFlag2 == 0) {
					// 	this.keyFlag2 = 1
					// 	setTimeout(() => {
					// 		this.keyFlag2 = 0;
					// 		this.caps = '' + this.funcSet;
					// 		this.z = '' + this.funcSet;
					// 		this.lshift = '' + this.funcSet;
					// 		this.q = '' + this.funcSet;
					// 		this.a = '' + this.funcSet;
					// 		this.s = '' + this.funcSet;
					// 		this.w = '' + this.funcSet;
					// 		this.tab = '' + this.funcSet;
					// 		this.n1 = '' + this.funcSet;
					// 		this.n2 = '' + this.funcSet;
					// 		this.n3 = '' + this.funcSet;
					// 		this.e = '' + this.funcSet;
					// 		this.d = '' + this.funcSet;
					// 		this.x = '' + this.funcSet;
					// 		this.win = '' + this.funcSet;
					// 		this.lalt = '' + this.funcSet;
					// 	}, 1000);
					// }
					this.num = 0
					this.caps = 'round2' + this.funcSet;
					this.z = 'round2' + this.funcSet;
					this.lshift = 'round2' + this.funcSet;
					this.q = 'round2' + this.funcSet;
					this.a = 'round2' + this.funcSet;
					this.s = 'round2' + this.funcSet;
					this.w = 'round2' + this.funcSet;
					this.tab = 'round2_2' + this.funcSet;
					this.n1 = 'round2_2' + this.funcSet;
					this.n2 = 'round2_2' + this.funcSet;
					this.n3 = 'round2_2' + this.funcSet;
					this.e = 'round2_2' + this.funcSet;
					this.d = 'round2_2' + this.funcSet;
					this.x = 'round2_2' + this.funcSet;
					this.win = 'round2_2' + this.funcSet;
					this.lalt = 'round2_2' + this.funcSet;
				}
				break;

			case this.vKey == 83 && this.keyStatus == 1: //s
				if (this.num == 0) {
					this.clear();
					// if (this.keyFlag1 == 0) {
					// 	this.keyFlag1 = 1
					// 	setTimeout(() => {
					// 		this.keyFlag1 = 0;
					// 		this.w = '' + this.funcSet;
					// 		this.e = '' + this.funcSet;
					// 		this.a = '' + this.funcSet;
					// 		this.s = '' + this.funcSet;
					// 		this.d = '' + this.funcSet;
					// 		this.z = '' + this.funcSet;
					// 		this.x = '' + this.funcSet;
					// 		this.n2 = '' + this.funcSet;
					// 		this.n3 = '' + this.funcSet;
					// 		this.q = '' + this.funcSet;
					// 		this.r = '' + this.funcSet;
					// 		this.caps = '' + this.funcSet;
					// 		this.f = '' + this.funcSet;
					// 		this.lshift = '' + this.funcSet;
					// 		this.c = '' + this.funcSet;
					// 		this.lalt = '' + this.funcSet;
					// 	}, 1000);
					// }
					this.w = 'round1' + this.funcSet;
					this.e = 'round1' + this.funcSet;
					this.a = 'round1' + this.funcSet;
					this.s = 'round1' + this.funcSet;
					this.d = 'round1' + this.funcSet;
					this.z = 'round1' + this.funcSet;
					this.x = 'round1' + this.funcSet;
					this.n2 = 'round1_2' + this.funcSet;
					this.n3 = 'round1_2' + this.funcSet;
					this.q = 'round1_2' + this.funcSet;
					this.r = 'round1_2' + this.funcSet;
					this.caps = 'round1_2' + this.funcSet;
					this.f = 'round1_2' + this.funcSet;
					this.lshift = 'round1_2' + this.funcSet;
					this.c = 'round1_2' + this.funcSet;
					this.lalt = 'round1_2' + this.funcSet;
					this.num = 1
				}
				else if (this.num == 1) {
					this.clear();
					// if (this.keyFlag2 == 0) {
					// 	this.keyFlag2 = 1
					// 	setTimeout(() => {
					// 		this.keyFlag2 = 0;
					// 		this.w = '' + this.funcSet;
					// 		this.e = '' + this.funcSet;
					// 		this.a = '' + this.funcSet;
					// 		this.s = '' + this.funcSet;
					// 		this.d = '' + this.funcSet;
					// 		this.z = '' + this.funcSet;
					// 		this.x = '' + this.funcSet;
					// 		this.n2 = '' + this.funcSet;
					// 		this.n3 = '' + this.funcSet;
					// 		this.q = '' + this.funcSet;
					// 		this.r = '' + this.funcSet;
					// 		this.caps = '' + this.funcSet;
					// 		this.f = '' + this.funcSet;
					// 		this.lshift = '' + this.funcSet;
					// 		this.c = '' + this.funcSet;
					// 		this.lalt = '' + this.funcSet;
					// 	}, 1000);
					// }
					this.num = 0
					this.w = 'round2' + this.funcSet;
					this.e = 'round2' + this.funcSet;
					this.a = 'round2' + this.funcSet;
					this.s = 'round2' + this.funcSet;
					this.d = 'round2' + this.funcSet;
					this.z = 'round2' + this.funcSet;
					this.x = 'round2' + this.funcSet;
					this.n2 = 'round2_2' + this.funcSet;
					this.n3 = 'round2_2' + this.funcSet;
					this.q = 'round2_2' + this.funcSet;
					this.r = 'round2_2' + this.funcSet;
					this.caps = 'round2_2' + this.funcSet;
					this.f = 'round2_2' + this.funcSet;
					this.lshift = 'round2_2' + this.funcSet;
					this.c = 'round2_2' + this.funcSet;
					this.lalt = 'round2_2' + this.funcSet;
				}
				break;

			case this.vKey == 68 && this.keyStatus == 1: //d
				if (this.num == 0) {
					this.clear();
					// if (this.keyFlag1 == 0) {
					// 	this.keyFlag1 = 1
					// 	setTimeout(() => {
					// 		this.keyFlag1 = 0;
					// 		this.r = '' + this.funcSet;
					// 		this.e = '' + this.funcSet;
					// 		this.f = '' + this.funcSet;
					// 		this.s = '' + this.funcSet;
					// 		this.d = '' + this.funcSet;
					// 		this.x = '' + this.funcSet;
					// 		this.c = '' + this.funcSet;
					// 		this.n3 = '' + this.funcSet;
					// 		this.n4 = '' + this.funcSet;
					// 		this.n5 = '' + this.funcSet;
					// 		this.w = '' + this.funcSet;
					// 		this.t = '' + this.funcSet;
					// 		this.a = '' + this.funcSet;
					// 		this.g = '' + this.funcSet;
					// 		this.z = '' + this.funcSet;
					// 		this.v = '' + this.funcSet;
					// 		this.lalt = '' + this.funcSet;
					// 	}, 1000);
					// }
					this.r = 'round1' + this.funcSet;
					this.e = 'round1' + this.funcSet;
					this.f = 'round1' + this.funcSet;
					this.s = 'round1' + this.funcSet;
					this.d = 'round1' + this.funcSet;
					this.x = 'round1' + this.funcSet;
					this.c = 'round1' + this.funcSet;
					this.n3 = 'round1_2' + this.funcSet;
					this.n4 = 'round1_2' + this.funcSet;
					this.n5 = 'round1_2' + this.funcSet;
					this.w = 'round1_2' + this.funcSet;
					this.t = 'round1_2' + this.funcSet;
					this.a = 'round1_2' + this.funcSet;
					this.g = 'round1_2' + this.funcSet;
					this.z = 'round1_2' + this.funcSet;
					this.v = 'round1_2' + this.funcSet;
					this.lalt = 'round1_2' + this.funcSet;
					this.num = 1
				}
				else if (this.num == 1) {
					this.clear();
					// if (this.keyFlag2 == 0) {
					// 	this.keyFlag2 = 1
					// 	setTimeout(() => {
					// 		this.keyFlag2 = 0;
					// 		this.r = '' + this.funcSet;
					// 		this.e = '' + this.funcSet;
					// 		this.f = '' + this.funcSet;
					// 		this.s = '' + this.funcSet;
					// 		this.d = '' + this.funcSet;
					// 		this.x = '' + this.funcSet;
					// 		this.c = '' + this.funcSet;
					// 		this.n3 = '' + this.funcSet;
					// 		this.n4 = '' + this.funcSet;
					// 		this.n5 = '' + this.funcSet;
					// 		this.w = '' + this.funcSet;
					// 		this.t = '' + this.funcSet;
					// 		this.a = '' + this.funcSet;
					// 		this.g = '' + this.funcSet;
					// 		this.z = '' + this.funcSet;
					// 		this.v = '' + this.funcSet;
					// 		this.lalt = '' + this.funcSet;
					// 	}, 1000);
					// }
					this.num = 0
					this.r = 'round2' + this.funcSet;
					this.e = 'round2' + this.funcSet;
					this.f = 'round2' + this.funcSet;
					this.s = 'round2' + this.funcSet;
					this.d = 'round2' + this.funcSet;
					this.x = 'round2' + this.funcSet;
					this.c = 'round2' + this.funcSet;
					this.n3 = 'round2_2' + this.funcSet;
					this.n4 = 'round2_2' + this.funcSet;
					this.n5 = 'round2_2' + this.funcSet;
					this.w = 'round2_2' + this.funcSet;
					this.t = 'round2_2' + this.funcSet;
					this.a = 'round2_2' + this.funcSet;
					this.g = 'round2_2' + this.funcSet;
					this.z = 'round2_2' + this.funcSet;
					this.v = 'round2_2' + this.funcSet;
					this.lalt = 'round2_2' + this.funcSet;
				}
				break;

			case this.vKey == 70 && this.keyStatus == 1: //f
				if (this.num == 0) {
					this.clear();
					// if (this.keyFlag1 == 0) {
					// 	this.keyFlag1 = 1
					// 	setTimeout(() => {
					// 		this.keyFlag1 = 0;
					// 		this.r = '' + this.funcSet;
					// 		this.t = '' + this.funcSet;
					// 		this.f = '' + this.funcSet;
					// 		this.g = '' + this.funcSet;
					// 		this.d = '' + this.funcSet;
					// 		this.v = '' + this.funcSet;
					// 		this.c = '' + this.funcSet;
					// 		this.n4 = '' + this.funcSet;
					// 		this.n5 = '' + this.funcSet;
					// 		this.n6 = '' + this.funcSet;
					// 		this.e = '' + this.funcSet;
					// 		this.y = '' + this.funcSet;
					// 		this.s = '' + this.funcSet;
					// 		this.h = '' + this.funcSet;
					// 		this.x = '' + this.funcSet;
					// 		this.b = '' + this.funcSet;
					// 	}, 1000);
					// }
					this.r = 'round1' + this.funcSet;
					this.t = 'round1' + this.funcSet;
					this.f = 'round1' + this.funcSet;
					this.g = 'round1' + this.funcSet;
					this.d = 'round1' + this.funcSet;
					this.v = 'round1' + this.funcSet;
					this.c = 'round1' + this.funcSet;
					this.n4 = 'round1_2' + this.funcSet;
					this.n5 = 'round1_2' + this.funcSet;
					this.n6 = 'round1_2' + this.funcSet;
					this.e = 'round1_2' + this.funcSet;
					this.y = 'round1_2' + this.funcSet;
					this.s = 'round1_2' + this.funcSet;
					this.h = 'round1_2' + this.funcSet;
					this.x = 'round1_2' + this.funcSet;
					this.b = 'round1_2' + this.funcSet;
					this.num = 1
				}
				else if (this.num == 1) {
					this.clear();
					// if (this.keyFlag2 == 0) {
					// 	this.keyFlag2 = 1
					// 	setTimeout(() => {
					// 		this.keyFlag2 = 0;
					// 		this.r = '' + this.funcSet;
					// 		this.t = '' + this.funcSet;
					// 		this.f = '' + this.funcSet;
					// 		this.g = '' + this.funcSet;
					// 		this.d = '' + this.funcSet;
					// 		this.v = '' + this.funcSet;
					// 		this.c = '' + this.funcSet;
					// 		this.n4 = '' + this.funcSet;
					// 		this.n5 = '' + this.funcSet;
					// 		this.n6 = '' + this.funcSet;
					// 		this.e = '' + this.funcSet;
					// 		this.y = '' + this.funcSet;
					// 		this.s = '' + this.funcSet;
					// 		this.h = '' + this.funcSet;
					// 		this.x = '' + this.funcSet;
					// 		this.b = '' + this.funcSet;
					// 	}, 1000);
					// }
					this.num = 0
					this.r = 'round2' + this.funcSet;
					this.t = 'round2' + this.funcSet;
					this.f = 'round2' + this.funcSet;
					this.g = 'round2' + this.funcSet;
					this.d = 'round2' + this.funcSet;
					this.v = 'round2' + this.funcSet;
					this.c = 'round2' + this.funcSet;
					this.n4 = 'round2_2' + this.funcSet;
					this.n5 = 'round2_2' + this.funcSet;
					this.n6 = 'round2_2' + this.funcSet;
					this.e = 'round2_2' + this.funcSet;
					this.y = 'round2_2' + this.funcSet;
					this.s = 'round2_2' + this.funcSet;
					this.h = 'round2_2' + this.funcSet;
					this.x = 'round2_2' + this.funcSet;
					this.b = 'round2_2' + this.funcSet;
				}
				break;

			case this.vKey == 71 && this.keyStatus == 1: //g
				if (this.num == 0) {
					this.clear();
					// if (this.keyFlag1 == 0) {
					// 	this.keyFlag1 = 1
					// 	setTimeout(() => {
					// 		this.keyFlag1 = 0;
					// 		this.y = '' + this.funcSet;
					// 		this.t = '' + this.funcSet;
					// 		this.f = '' + this.funcSet;
					// 		this.g = '' + this.funcSet;
					// 		this.h = '' + this.funcSet;
					// 		this.v = '' + this.funcSet;
					// 		this.c = '' + this.funcSet;
					// 		this.n5 = '' + this.funcSet;
					// 		this.n6 = '' + this.funcSet;
					// 		this.n7 = '' + this.funcSet;
					// 		this.r = '' + this.funcSet;
					// 		this.u = '' + this.funcSet;
					// 		this.d = '' + this.funcSet;
					// 		this.j = '' + this.funcSet;
					// 		this.x = '' + this.funcSet;
					// 		this.b = '' + this.funcSet;
					// 		this.space = '' + this.funcSet;
					// 	}, 1000);
					// }
					this.y = 'round1' + this.funcSet;
					this.t = 'round1' + this.funcSet;
					this.f = 'round1' + this.funcSet;
					this.g = 'round1' + this.funcSet;
					this.h = 'round1' + this.funcSet;
					this.v = 'round1' + this.funcSet;
					this.c = 'round1' + this.funcSet;
					this.n5 = 'round1_2' + this.funcSet;
					this.n6 = 'round1_2' + this.funcSet;
					this.n7 = 'round1_2' + this.funcSet;
					this.r = 'round1_2' + this.funcSet;
					this.u = 'round1_2' + this.funcSet;
					this.d = 'round1_2' + this.funcSet;
					this.j = 'round1_2' + this.funcSet;
					this.x = 'round1_2' + this.funcSet;
					this.b = 'round1_2' + this.funcSet;
					this.space = 'round1_2' + this.funcSet;
					this.num = 1
				}
				else if (this.num == 1) {
					this.clear();
					// if (this.keyFlag2 == 0) {
					// 	this.keyFlag2 = 1
					// 	setTimeout(() => {
					// 		this.keyFlag2 = 0;
					// 		this.y = '' + this.funcSet;
					// 		this.t = '' + this.funcSet;
					// 		this.f = '' + this.funcSet;
					// 		this.g = '' + this.funcSet;
					// 		this.h = '' + this.funcSet;
					// 		this.v = '' + this.funcSet;
					// 		this.c = '' + this.funcSet;
					// 		this.n5 = '' + this.funcSet;
					// 		this.n6 = '' + this.funcSet;
					// 		this.n7 = '' + this.funcSet;
					// 		this.r = '' + this.funcSet;
					// 		this.u = '' + this.funcSet;
					// 		this.d = '' + this.funcSet;
					// 		this.j = '' + this.funcSet;
					// 		this.x = '' + this.funcSet;
					// 		this.b = '' + this.funcSet;
					// 		this.space = '' + this.funcSet;
					// 	}, 1000);
					// }
					this.num = 0
					this.y = 'round2' + this.funcSet;
					this.t = 'round2' + this.funcSet;
					this.f = 'round2' + this.funcSet;
					this.g = 'round2' + this.funcSet;
					this.h = 'round2' + this.funcSet;
					this.v = 'round2' + this.funcSet;
					this.c = 'round2' + this.funcSet;
					this.n5 = 'round2_2' + this.funcSet;
					this.n6 = 'round2_2' + this.funcSet;
					this.n7 = 'round2_2' + this.funcSet;
					this.r = 'round2_2' + this.funcSet;
					this.u = 'round2_2' + this.funcSet;
					this.d = 'round2_2' + this.funcSet;
					this.j = 'round2_2' + this.funcSet;
					this.x = 'round2_2' + this.funcSet;
					this.b = 'round2_2' + this.funcSet;
					this.space = 'round2_2' + this.funcSet;
				}
				break;

			case this.vKey == 72 && this.keyStatus == 1: //h
				if (this.num == 0) {
					this.clear();
					// if (this.keyFlag1 == 0) {
					// 	this.keyFlag1 = 1
					// 	setTimeout(() => {
					// 		this.keyFlag1 = 0;
					// 		this.y = '' + this.funcSet;
					// 		this.u = '' + this.funcSet;
					// 		this.j = '' + this.funcSet;
					// 		this.g = '' + this.funcSet;
					// 		this.h = '' + this.funcSet;
					// 		this.v = '' + this.funcSet;
					// 		this.b = '' + this.funcSet;
					// 		this.n6 = '' + this.funcSet;
					// 		this.n7 = '' + this.funcSet;
					// 		this.n8 = '' + this.funcSet;
					// 		this.t = '' + this.funcSet;
					// 		this.i = '' + this.funcSet;
					// 		this.f = '' + this.funcSet;
					// 		this.k = '' + this.funcSet;
					// 		this.c = '' + this.funcSet;
					// 		this.n = '' + this.funcSet;
					// 		this.space = '' + this.funcSet;
					// 	}, 1000);
					// }
					this.y = 'round1' + this.funcSet;
					this.u = 'round1' + this.funcSet;
					this.j = 'round1' + this.funcSet;
					this.g = 'round1' + this.funcSet;
					this.h = 'round1' + this.funcSet;
					this.v = 'round1' + this.funcSet;
					this.b = 'round1' + this.funcSet;
					this.n6 = 'round1_2' + this.funcSet;
					this.n7 = 'round1_2' + this.funcSet;
					this.n8 = 'round1_2' + this.funcSet;
					this.t = 'round1_2' + this.funcSet;
					this.i = 'round1_2' + this.funcSet;
					this.f = 'round1_2' + this.funcSet;
					this.k = 'round1_2' + this.funcSet;
					this.c = 'round1_2' + this.funcSet;
					this.n = 'round1_2' + this.funcSet;
					this.space = 'round1_2' + this.funcSet;
					this.num = 1
				}
				else if (this.num == 1) {
					this.clear();
					// if (this.keyFlag2 == 0) {
					// 	this.keyFlag2 = 1
					// 	setTimeout(() => {
					// 		this.keyFlag2 = 0;
					// 		this.y = '' + this.funcSet;
					// 		this.u = '' + this.funcSet;
					// 		this.j = '' + this.funcSet;
					// 		this.g = '' + this.funcSet;
					// 		this.h = '' + this.funcSet;
					// 		this.v = '' + this.funcSet;
					// 		this.b = '' + this.funcSet;
					// 		this.n6 = '' + this.funcSet;
					// 		this.n7 = '' + this.funcSet;
					// 		this.n8 = '' + this.funcSet;
					// 		this.t = '' + this.funcSet;
					// 		this.i = '' + this.funcSet;
					// 		this.f = '' + this.funcSet;
					// 		this.k = '' + this.funcSet;
					// 		this.c = '' + this.funcSet;
					// 		this.n = '' + this.funcSet;
					// 		this.space = '' + this.funcSet;
					// 	}, 1000);
					// }
					this.num = 0
					this.y = 'round2' + this.funcSet;
					this.u = 'round2' + this.funcSet;
					this.j = 'round2' + this.funcSet;
					this.g = 'round2' + this.funcSet;
					this.h = 'round2' + this.funcSet;
					this.v = 'round2' + this.funcSet;
					this.b = 'round2' + this.funcSet;
					this.n6 = 'round2_2' + this.funcSet;
					this.n7 = 'round2_2' + this.funcSet;
					this.n8 = 'round2_2' + this.funcSet;
					this.t = 'round2_2' + this.funcSet;
					this.i = 'round2_2' + this.funcSet;
					this.f = 'round2_2' + this.funcSet;
					this.k = 'round2_2' + this.funcSet;
					this.c = 'round2_2' + this.funcSet;
					this.n = 'round2_2' + this.funcSet;
					this.space = 'round2_2' + this.funcSet;
				}
				break;

			case this.vKey == 74 && this.keyStatus == 1: //j
				if (this.num == 0) {
					this.clear();
					// if (this.keyFlag1 == 0) {
					// 	this.keyFlag1 = 1
					// 	setTimeout(() => {
					// 		this.keyFlag1 = 0;
					// 		this.i = '' + this.funcSet;
					// 		this.u = '' + this.funcSet;
					// 		this.j = '' + this.funcSet;
					// 		this.k = '' + this.funcSet;
					// 		this.h = '' + this.funcSet;
					// 		this.n = '' + this.funcSet;
					// 		this.b = '' + this.funcSet;
					// 		this.n7 = '' + this.funcSet;
					// 		this.n8 = '' + this.funcSet;
					// 		this.n9 = '' + this.funcSet;
					// 		this.y = '' + this.funcSet;
					// 		this.o = '' + this.funcSet;
					// 		this.g = '' + this.funcSet;
					// 		this.l = '' + this.funcSet;
					// 		this.v = '' + this.funcSet;
					// 		this.m = '' + this.funcSet;
					// 		this.space = '' + this.funcSet;
					// 	}, 1000);
					// }
					this.i = 'round1' + this.funcSet;
					this.u = 'round1' + this.funcSet;
					this.j = 'round1' + this.funcSet;
					this.k = 'round1' + this.funcSet;
					this.h = 'round1' + this.funcSet;
					this.n = 'round1' + this.funcSet;
					this.b = 'round1' + this.funcSet;
					this.n7 = 'round1_2' + this.funcSet;
					this.n8 = 'round1_2' + this.funcSet;
					this.n9 = 'round1_2' + this.funcSet;
					this.y = 'round1_2' + this.funcSet;
					this.o = 'round1_2' + this.funcSet;
					this.g = 'round1_2' + this.funcSet;
					this.l = 'round1_2' + this.funcSet;
					this.v = 'round1_2' + this.funcSet;
					this.m = 'round1_2' + this.funcSet;
					this.space = 'round1_2' + this.funcSet;
					this.num = 1
				}
				else if (this.num == 1) {
					this.clear();
					// if (this.keyFlag2 == 0) {
					// 	this.keyFlag2 = 1
					// 	setTimeout(() => {
					// 		this.keyFlag2 = 0;
					// 		this.i = '' + this.funcSet;
					// 		this.u = '' + this.funcSet;
					// 		this.j = '' + this.funcSet;
					// 		this.k = '' + this.funcSet;
					// 		this.h = '' + this.funcSet;
					// 		this.n = '' + this.funcSet;
					// 		this.b = '' + this.funcSet;
					// 		this.n7 = '' + this.funcSet;
					// 		this.n8 = '' + this.funcSet;
					// 		this.n9 = '' + this.funcSet;
					// 		this.y = '' + this.funcSet;
					// 		this.o = '' + this.funcSet;
					// 		this.g = '' + this.funcSet;
					// 		this.l = '' + this.funcSet;
					// 		this.v = '' + this.funcSet;
					// 		this.m = '' + this.funcSet;
					// 		this.space = '' + this.funcSet;
					// 	}, 1000);
					// }
					this.num = 0
					this.i = 'round2' + this.funcSet;
					this.u = 'round2' + this.funcSet;
					this.j = 'round2' + this.funcSet;
					this.k = 'round2' + this.funcSet;
					this.h = 'round2' + this.funcSet;
					this.n = 'round2' + this.funcSet;
					this.b = 'round2' + this.funcSet;
					this.n7 = 'round2_2' + this.funcSet;
					this.n8 = 'round2_2' + this.funcSet;
					this.n9 = 'round2_2' + this.funcSet;
					this.y = 'round2_2' + this.funcSet;
					this.o = 'round2_2' + this.funcSet;
					this.g = 'round2_2' + this.funcSet;
					this.l = 'round2_2' + this.funcSet;
					this.v = 'round2_2' + this.funcSet;
					this.m = 'round2_2' + this.funcSet;
					this.space = 'round2_2' + this.funcSet;
				}
				break;

			case this.vKey == 75 && this.keyStatus == 1: //k
				if (this.num == 0) {
					this.clear();
					// if (this.keyFlag1 == 0) {
					// 	this.keyFlag1 = 1
					// 	setTimeout(() => {
					// 		this.keyFlag1 = 0;
					// 		this.i = '' + this.funcSet;
					// 		this.o = '' + this.funcSet;
					// 		this.j = '' + this.funcSet;
					// 		this.k = '' + this.funcSet;
					// 		this.l = '' + this.funcSet;
					// 		this.m = '' + this.funcSet;
					// 		this.n = '' + this.funcSet;
					// 		this.n7 = '' + this.funcSet;
					// 		this.n8 = '' + this.funcSet;
					// 		this.n9 = '' + this.funcSet;
					// 		this.u = '' + this.funcSet;
					// 		this.p = '' + this.funcSet;
					// 		this.h = '' + this.funcSet;
					// 		this.sem = '' + this.funcSet;
					// 		this.b = '' + this.funcSet;
					// 		this.comma = '' + this.funcSet;
					// 	}, 1000);
					// }
					this.i = 'round1' + this.funcSet;
					this.o = 'round1' + this.funcSet;
					this.j = 'round1' + this.funcSet;
					this.k = 'round1' + this.funcSet;
					this.l = 'round1' + this.funcSet;
					this.n = 'round1' + this.funcSet;
					this.m = 'round1' + this.funcSet;
					this.n7 = 'round1_2' + this.funcSet;
					this.n8 = 'round1_2' + this.funcSet;
					this.n9 = 'round1_2' + this.funcSet;
					this.u = 'round1_2' + this.funcSet;
					this.p = 'round1_2' + this.funcSet;
					this.h = 'round1_2' + this.funcSet;
					this.sem = 'round1_2' + this.funcSet;
					this.b = 'round1_2' + this.funcSet;
					this.comma = 'round1_2' + this.funcSet;
					this.num = 1
				}
				else if (this.num == 1) {
					this.clear();
					// if (this.keyFlag2 == 0) {
					// 	this.keyFlag2 = 1
					// 	setTimeout(() => {
					// 		this.keyFlag2 = 0;
					// 		this.i = '' + this.funcSet;
					// 		this.o = '' + this.funcSet;
					// 		this.j = '' + this.funcSet;
					// 		this.k = '' + this.funcSet;
					// 		this.l = '' + this.funcSet;
					// 		this.m = '' + this.funcSet;
					// 		this.n = '' + this.funcSet;
					// 		this.n7 = '' + this.funcSet;
					// 		this.n8 = '' + this.funcSet;
					// 		this.n9 = '' + this.funcSet;
					// 		this.u = '' + this.funcSet;
					// 		this.p = '' + this.funcSet;
					// 		this.h = '' + this.funcSet;
					// 		this.sem = '' + this.funcSet;
					// 		this.b = '' + this.funcSet;
					// 		this.comma = '' + this.funcSet;
					// 	}, 1000);
					// }
					this.num = 0
					this.i = 'round2' + this.funcSet;
					this.o = 'round2' + this.funcSet;
					this.j = 'round2' + this.funcSet;
					this.k = 'round2' + this.funcSet;
					this.l = 'round2' + this.funcSet;
					this.m = 'round2' + this.funcSet;
					this.n = 'round2' + this.funcSet;
					this.n7 = 'round2_2' + this.funcSet;
					this.n8 = 'round2_2' + this.funcSet;
					this.n9 = 'round2_2' + this.funcSet;
					this.u = 'round2_2' + this.funcSet;
					this.p = 'round2_2' + this.funcSet;
					this.h = 'round2_2' + this.funcSet;
					this.sem = 'round2_2' + this.funcSet;
					this.b = 'round2_2' + this.funcSet;
					this.comma = 'round2_2' + this.funcSet;
				}
				break;

			case this.vKey == 76 && this.keyStatus == 1: //l
				if (this.num == 0) {
					this.clear();
					// if (this.keyFlag1 == 0) {
					// 	this.keyFlag1 = 1
					// 	setTimeout(() => {
					// 		this.keyFlag1 = 0;
					// 		this.p = '' + this.funcSet;
					// 		this.o = '' + this.funcSet;
					// 		this.sem = '' + this.funcSet;
					// 		this.k = '' + this.funcSet;
					// 		this.l = '' + this.funcSet;
					// 		this.m = '' + this.funcSet;
					// 		this.dot = '' + this.funcSet;
					// 		this.n9 = '' + this.funcSet;
					// 		this.n0 = '' + this.funcSet;
					// 		this.minus = '' + this.funcSet;
					// 		this.i = '' + this.funcSet;
					// 		this.lqu = '' + this.funcSet;
					// 		this.j = '' + this.funcSet;
					// 		this.quo = '' + this.funcSet;
					// 		this.n = '' + this.funcSet;
					// 		this.dot = '' + this.funcSet;
					// 		this.ralt = '' + this.funcSet;
					// 	}, 1000);
					// }
					this.p = 'round1' + this.funcSet;
					this.o = 'round1' + this.funcSet;
					this.sem = 'round1' + this.funcSet;
					this.k = 'round1' + this.funcSet;
					this.l = 'round1' + this.funcSet;
					this.m = 'round1' + this.funcSet;
					this.dot = 'round1' + this.funcSet;
					this.n9 = 'round1_2' + this.funcSet;
					this.n0 = 'round1_2' + this.funcSet;
					this.minus = 'round1_2' + this.funcSet;
					this.i = 'round1_2' + this.funcSet;
					this.lqu = 'round1_2' + this.funcSet;
					this.j = 'round1_2' + this.funcSet;
					this.quo = 'round1_2' + this.funcSet;
					this.n = 'round1_2' + this.funcSet;
					this.dot = 'round1_2' + this.funcSet;
					this.ralt = 'round1_2' + this.funcSet;
					this.num = 1
				}
				else if (this.num == 1) {
					this.clear();
					// if (this.keyFlag2 == 0) {
					// 	this.keyFlag2 = 1
					// 	setTimeout(() => {
					// 		this.keyFlag2 = 0;
					// 		this.p = '' + this.funcSet;
					// 		this.o = '' + this.funcSet;
					// 		this.sem = '' + this.funcSet;
					// 		this.k = '' + this.funcSet;
					// 		this.l = '' + this.funcSet;
					// 		this.m = '' + this.funcSet;
					// 		this.dot = '' + this.funcSet;
					// 		this.n9 = '' + this.funcSet;
					// 		this.n0 = '' + this.funcSet;
					// 		this.minus = '' + this.funcSet;
					// 		this.i = '' + this.funcSet;
					// 		this.lqu = '' + this.funcSet;
					// 		this.j = '' + this.funcSet;
					// 		this.quo = '' + this.funcSet;
					// 		this.n = '' + this.funcSet;
					// 		this.dot = '' + this.funcSet;
					// 		this.ralt = '' + this.funcSet;
					// 	}, 1000);
					// }
					this.num = 0
					this.p = 'round2' + this.funcSet;
					this.o = 'round2' + this.funcSet;
					this.sem = 'round2' + this.funcSet;
					this.k = 'round2' + this.funcSet;
					this.l = 'round2' + this.funcSet;
					this.m = 'round2' + this.funcSet;
					this.dot = 'round2' + this.funcSet;
					this.n9 = 'round2_2' + this.funcSet;
					this.n0 = 'round2_2' + this.funcSet;
					this.minus = 'round2_2' + this.funcSet;
					this.i = 'round2_2' + this.funcSet;
					this.lqu = 'round2_2' + this.funcSet;
					this.j = 'round2_2' + this.funcSet;
					this.quo = 'round2_2' + this.funcSet;
					this.n = 'round2_2' + this.funcSet;
					this.dot = 'round2_2' + this.funcSet;
					this.ralt = 'round2_2' + this.funcSet;
				}
				break;

			case this.vKey == 186 && this.keyStatus == 1: //sem
				if (this.num == 0) {
					this.clear();
					// if (this.keyFlag1 == 0) {
					// 	this.keyFlag1 = 1
					// 	setTimeout(() => {
					// 		this.keyFlag1 = 0;
					// 		this.p = '' + this.funcSet;
					// 		this.lqu = '' + this.funcSet;
					// 		this.sem = '' + this.funcSet;
					// 		this.quo = '' + this.funcSet;
					// 		this.l = '' + this.funcSet;
					// 		this.comma = '' + this.funcSet;
					// 		this.dot = '' + this.funcSet;
					// 		this.n0 = '' + this.funcSet;
					// 		this.minus = '' + this.funcSet;
					// 		this.plus = '' + this.funcSet;
					// 		this.o = '' + this.funcSet;
					// 		this.rqu = '' + this.funcSet;
					// 		this.k = '' + this.funcSet;
					// 		this.enter = '' + this.funcSet;
					// 		this.m = '' + this.funcSet;
					// 		this.qmark = '' + this.funcSet;
					// 	}, 1000);
					// }
					this.p = 'round1' + this.funcSet;
					this.lqu = 'round1' + this.funcSet;
					this.sem = 'round1' + this.funcSet;
					this.quo = 'round1' + this.funcSet;
					this.l = 'round1' + this.funcSet;
					this.comma = 'round1' + this.funcSet;
					this.dot = 'round1' + this.funcSet;
					this.n0 = 'round1_2' + this.funcSet;
					this.minus = 'round1_2' + this.funcSet;
					this.plus = 'round1_2' + this.funcSet;
					this.o = 'round1_2' + this.funcSet;
					this.rqu = 'round1_2' + this.funcSet;
					this.k = 'round1_2' + this.funcSet;
					this.enter = 'round1_2' + this.funcSet;
					this.m = 'round1_2' + this.funcSet;
					this.qmark = 'round1_2' + this.funcSet;
					this.num = 1
				}
				else if (this.num == 1) {
					this.clear();
					// if (this.keyFlag2 == 0) {
					// 	this.keyFlag2 = 1
					// 	setTimeout(() => {
					// 		this.keyFlag2 = 0;
					// 		this.p = '' + this.funcSet;
					// 		this.lqu = '' + this.funcSet;
					// 		this.sem = '' + this.funcSet;
					// 		this.quo = '' + this.funcSet;
					// 		this.l = '' + this.funcSet;
					// 		this.comma = '' + this.funcSet;
					// 		this.dot = '' + this.funcSet;
					// 		this.n0 = '' + this.funcSet;
					// 		this.minus = '' + this.funcSet;
					// 		this.plus = '' + this.funcSet;
					// 		this.o = '' + this.funcSet;
					// 		this.rqu = '' + this.funcSet;
					// 		this.k = '' + this.funcSet;
					// 		this.enter = '' + this.funcSet;
					// 		this.m = '' + this.funcSet;
					// 		this.qmark = '' + this.funcSet;
					// 	}, 1000);
					// }
					this.num = 0
					this.p = 'round2' + this.funcSet;
					this.lqu = 'round2' + this.funcSet;
					this.sem = 'round2' + this.funcSet;
					this.quo = 'round2' + this.funcSet;
					this.l = 'round2' + this.funcSet;
					this.comma = 'round2' + this.funcSet;
					this.dot = 'round2' + this.funcSet;
					this.n0 = 'round2_2' + this.funcSet;
					this.minus = 'round2_2' + this.funcSet;
					this.plus = 'round2_2' + this.funcSet;
					this.o = 'round2_2' + this.funcSet;
					this.rqu = 'round2_2' + this.funcSet;
					this.k = 'round2_2' + this.funcSet;
					this.enter = 'round2_2' + this.funcSet;
					this.m = 'round2_2' + this.funcSet;
					this.qmark = 'round2_2' + this.funcSet;
				}
				break;

			case this.vKey == 222 && this.keyStatus == 1: //quo
				if (this.num == 0) {
					this.clear();
					// if (this.keyFlag1 == 0) {
					// 	this.keyFlag1 = 1
					// 	setTimeout(() => {
					// 		this.keyFlag1 = 0;
					// 		this.rqu = '' + this.funcSet;
					// 		this.lqu = '' + this.funcSet;
					// 		this.sem = '' + this.funcSet;
					// 		this.quo = '' + this.funcSet;
					// 		this.dot = '' + this.funcSet;
					// 		this.qmark = '' + this.funcSet;
					// 		this.n0 = '' + this.funcSet;
					// 		this.minus = '' + this.funcSet;
					// 		this.plus = '' + this.funcSet;
					// 		this.p = '' + this.funcSet;
					// 		this.l = '' + this.funcSet;
					// 		this.comma = '' + this.funcSet;
					// 		this.ralt = '' + this.funcSet;
					// 		this.fn = '' + this.funcSet;
					// 		this.book = '' + this.funcSet;
					// 	}, 1000);
					// }
					this.rqu = 'round1' + this.funcSet;
					this.lqu = 'round1' + this.funcSet;
					this.sem = 'round1' + this.funcSet;
					this.quo = 'round1' + this.funcSet;
					this.dot = 'round1' + this.funcSet;
					this.qmark = 'round1' + this.funcSet;
					this.n0 = 'round1_2' + this.funcSet;
					this.minus = 'round1_2' + this.funcSet;
					this.plus = 'round1_2' + this.funcSet;
					this.p = 'round1_2' + this.funcSet;
					this.l = 'round1_2' + this.funcSet;
					this.comma = 'round1_2' + this.funcSet;
					this.ralt = 'round1_2' + this.funcSet;
					this.fn = 'round1_2' + this.funcSet;
					this.book = 'round1_2' + this.funcSet;
					this.num = 1
				}
				else if (this.num == 1) {
					this.clear();
					// if (this.keyFlag2 == 0) {
					// 	this.keyFlag2 = 1
					// 	setTimeout(() => {
					// 		this.keyFlag2 = 0;
					// 		this.rqu = '' + this.funcSet;
					// 		this.lqu = '' + this.funcSet;
					// 		this.sem = '' + this.funcSet;
					// 		this.quo = '' + this.funcSet;
					// 		this.dot = '' + this.funcSet;
					// 		this.qmark = '' + this.funcSet;
					// 		this.n0 = '' + this.funcSet;
					// 		this.minus = '' + this.funcSet;
					// 		this.plus = '' + this.funcSet;
					// 		this.p = '' + this.funcSet;
					// 		this.l = '' + this.funcSet;
					// 		this.comma = '' + this.funcSet;
					// 		this.ralt = '' + this.funcSet;
					// 		this.fn = '' + this.funcSet;
					// 		this.book = '' + this.funcSet;
					// 	}, 1000);
					// }
					this.num = 0
					this.rqu = 'round2' + this.funcSet;
					this.lqu = 'round2' + this.funcSet;
					this.sem = 'round2' + this.funcSet;
					this.quo = 'round2' + this.funcSet;
					this.dot = 'round2' + this.funcSet;
					this.qmark = 'round2' + this.funcSet;
					this.n0 = 'round2_2' + this.funcSet;
					this.minus = 'round2_2' + this.funcSet;
					this.plus = 'round2_2' + this.funcSet;
					this.p = 'round2_2' + this.funcSet;
					this.l = 'round2_2' + this.funcSet;
					this.comma = 'round2_2' + this.funcSet;
					this.ralt = 'round2_2' + this.funcSet;
					this.fn = 'round2_2' + this.funcSet;
					this.book = 'round2_2' + this.funcSet;
				}
				break;
			case this.vKey == 13 && this.keyStatus == 1: //enter
				if (this.num == 0) {
					this.clear();
					// if (this.keyFlag1 == 0) {
					// 	this.keyFlag1 = 1
					// 	setTimeout(() => {
					// 		this.keyFlag1 = 0;
					// 		this.rqu = '' + this.funcSet;
					// 		this.drawn = '' + this.funcSet;
					// 		this.quo = '' + this.funcSet;
					// 		this.qmark = '' + this.funcSet;
					// 		this.enter = '' + this.funcSet;
					// 		this.rshift = '' + this.funcSet;
					// 		this.plus = '' + this.funcSet;
					// 		this.bsp = '' + this.funcSet;
					// 		this.lqu = '' + this.funcSet;
					// 		this.sem = '' + this.funcSet;
					// 		this.dot = '' + this.funcSet;
					// 		this.book = '' + this.funcSet;
					// 		this.rctrl = '' + this.funcSet;
					// 	}, 1000);
					// }
					this.rqu = 'round1' + this.funcSet;
					this.drawn = 'round1' + this.funcSet;
					this.quo = 'round1' + this.funcSet;
					this.qmark = 'round1' + this.funcSet;
					this.enter = 'round1' + this.funcSet;
					this.rshift = 'round1' + this.funcSet;
					this.plus = 'round1_2' + this.funcSet;
					this.bsp = 'round1_2' + this.funcSet;
					this.lqu = 'round1_2' + this.funcSet;
					this.sem = 'round1_2' + this.funcSet;
					this.dot = 'round1_2' + this.funcSet;
					this.book = 'round1_2' + this.funcSet;
					this.rctrl = 'round1_2' + this.funcSet;
					this.num = 1
				}
				else if (this.num == 1) {
					this.clear();
					// if (this.keyFlag2 == 0) {
					// 	this.keyFlag2 = 1
					// 	setTimeout(() => {
					// 		this.keyFlag2 = 0;
					// 		this.rqu = '' + this.funcSet;
					// 		this.drawn = '' + this.funcSet;
					// 		this.quo = '' + this.funcSet;
					// 		this.qmark = '' + this.funcSet;
					// 		this.enter = '' + this.funcSet;
					// 		this.rshift = '' + this.funcSet;
					// 		this.plus = '' + this.funcSet;
					// 		this.bsp = '' + this.funcSet;
					// 		this.lqu = '' + this.funcSet;
					// 		this.sem = '' + this.funcSet;
					// 		this.dot = '' + this.funcSet;
					// 		this.book = '' + this.funcSet;
					// 		this.rctrl = '' + this.funcSet;
					// 	}, 1000);
					// }
					this.num = 0
					this.rqu = 'round2' + this.funcSet;
					this.drawn = 'round2' + this.funcSet;
					this.quo = 'round2' + this.funcSet;
					this.qmark = 'round2' + this.funcSet;
					this.enter = 'round2' + this.funcSet;
					this.rshift = 'round2' + this.funcSet;
					this.plus = 'round2_2' + this.funcSet;
					this.bsp = 'round2_2' + this.funcSet;
					this.lqu = 'round2_2' + this.funcSet;
					this.sem = 'round2_2' + this.funcSet;
					this.dot = 'round2_2' + this.funcSet;
					this.book = 'round2_2' + this.funcSet;
					this.rctrl = 'round2_2' + this.funcSet;
				}
				break;

			case this.vKey == 100 && this.keyStatus == 1: //num4
				if (this.num == 0) {
					this.clear();
					// if (this.keyFlag1 == 0) {
					// 	this.keyFlag1 = 1
					// 	setTimeout(() => {
					// 		this.keyFlag1 = 0;
					// 		this.num7 = '' + this.funcSet;
					// 		this.num8 = '' + this.funcSet;
					// 		this.num4 = '' + this.funcSet;
					// 		this.num5 = '' + this.funcSet;
					// 		this.num1 = '' + this.funcSet;
					// 		this.pup = '' + this.funcSet;
					// 		this.numlock = '' + this.funcSet;
					// 		this.numdrawn = '' + this.funcSet;
					// 		this.end = '' + this.funcSet;
					// 		this.pdown = '' + this.funcSet;
					// 		this.num9 = '' + this.funcSet;
					// 		this.num6 = '' + this.funcSet;
					// 		this.num2 = '' + this.funcSet;
					// 		this.num0 = '' + this.funcSet;
					// 		this.up = '' + this.funcSet;
					// 		this.right = '' + this.funcSet;
					// 	}, 1000);
					// }
					this.num7 = 'round1' + this.funcSet;
					this.num8 = 'round1' + this.funcSet;
					this.num4 = 'round1' + this.funcSet;
					this.num5 = 'round1' + this.funcSet;
					this.num1 = 'round1' + this.funcSet;
					this.pup = 'round1_2' + this.funcSet;
					this.numlock = 'round1_2' + this.funcSet;
					this.numdrawn = 'round1_2' + this.funcSet;
					this.end = 'round1_2' + this.funcSet;
					this.pdown = 'round1_2' + this.funcSet;
					this.num9 = 'round1_2' + this.funcSet;
					this.num6 = 'round1_2' + this.funcSet;
					this.num2 = 'round1_2' + this.funcSet;
					this.num0 = 'round1_2' + this.funcSet;
					this.up = 'round1_2' + this.funcSet;
					this.right = 'round1_2' + this.funcSet;
					this.num = 1
				}
				else if (this.num == 1) {
					this.clear();
					// if (this.keyFlag2 == 0) {
					// 	this.keyFlag2 = 1
					// 	setTimeout(() => {
					// 		this.keyFlag2 = 0;
					// 		this.num7 = '' + this.funcSet;
					// 		this.num8 = '' + this.funcSet;
					// 		this.num4 = '' + this.funcSet;
					// 		this.num5 = '' + this.funcSet;
					// 		this.num1 = '' + this.funcSet;
					// 		this.pup = '' + this.funcSet;
					// 		this.numlock = '' + this.funcSet;
					// 		this.numdrawn = '' + this.funcSet;
					// 		this.end = '' + this.funcSet;
					// 		this.pdown = '' + this.funcSet;
					// 		this.num9 = '' + this.funcSet;
					// 		this.num6 = '' + this.funcSet;
					// 		this.num2 = '' + this.funcSet;
					// 		this.num0 = '' + this.funcSet;
					// 		this.up = '' + this.funcSet;
					// 		this.right = '' + this.funcSet;
					// 	}, 1000);
					// }
					this.num = 0
					this.num7 = 'round2' + this.funcSet;
					this.num8 = 'round2' + this.funcSet;
					this.num4 = 'round2' + this.funcSet;
					this.num5 = 'round2' + this.funcSet;
					this.num1 = 'round2' + this.funcSet;
					this.pup = 'round1_2' + this.funcSet;
					this.numlock = 'round2_2' + this.funcSet;
					this.numdrawn = 'round2_2' + this.funcSet;
					this.end = 'round2_2' + this.funcSet;
					this.pdown = 'round2_2' + this.funcSet;
					this.num9 = 'round2_2' + this.funcSet;
					this.num6 = 'round2_2' + this.funcSet;
					this.num2 = 'round2_2' + this.funcSet;
					this.num0 = 'round2_2' + this.funcSet;
					this.up = 'round2_2' + this.funcSet;
					this.right = 'round2_2' + this.funcSet;
				}
				break;

			case this.vKey == 101 && this.keyStatus == 1: //num5
				if (this.num == 0) {
					this.clear();
					// if (this.keyFlag1 == 0) {
					// 	this.keyFlag1 = 1
					// 	setTimeout(() => {
					// 		this.keyFlag1 = 0;
					// 		this.num8 = '' + this.funcSet;
					// 		this.num9 = '' + this.funcSet;
					// 		this.num4 = '' + this.funcSet;
					// 		this.num5 = '' + this.funcSet;
					// 		this.num6 = '' + this.funcSet;
					// 		this.num1 = '' + this.funcSet;
					// 		this.num2 = '' + this.funcSet;
					// 		this.numlock = '' + this.funcSet;
					// 		this.numdrawn = '' + this.funcSet;
					// 		this.numtimes = '' + this.funcSet;
					// 		this.pdown = '' + this.funcSet;
					// 		this.num7 = '' + this.funcSet;
					// 		this.numplus = '' + this.funcSet;
					// 		this.num3 = '' + this.funcSet;
					// 		this.num0 = '' + this.funcSet;
					// 		this.numdot = '' + this.funcSet;
					// 	}, 1000);
					// }
					this.num8 = 'round1' + this.funcSet;
					this.num9 = 'round1' + this.funcSet;
					this.num4 = 'round1' + this.funcSet;
					this.num5 = 'round1' + this.funcSet;
					this.num6 = 'round1' + this.funcSet;
					this.num1 = 'round1' + this.funcSet;
					this.num2 = 'round1' + this.funcSet;
					this.numlock = 'round1_2' + this.funcSet;
					this.numdrawn = 'round1_2' + this.funcSet;
					this.numtimes = 'round1_2' + this.funcSet;
					this.pdown = 'round1_2' + this.funcSet;
					this.num7 = 'round1_2' + this.funcSet;
					this.numplus = 'round1_2' + this.funcSet;
					this.num3 = 'round1_2' + this.funcSet;
					this.num0 = 'round1_2' + this.funcSet;
					this.numdot = 'round1_2' + this.funcSet;
					this.num = 1
				}
				else if (this.num == 1) {
					this.clear();
					// if (this.keyFlag2 == 0) {
					// 	this.keyFlag2 = 1
					// 	setTimeout(() => {
					// 		this.keyFlag2 = 0;
					// 		this.num8 = '' + this.funcSet;
					// 		this.num9 = '' + this.funcSet;
					// 		this.num4 = '' + this.funcSet;
					// 		this.num5 = '' + this.funcSet;
					// 		this.num6 = '' + this.funcSet;
					// 		this.num1 = '' + this.funcSet;
					// 		this.num2 = '' + this.funcSet;
					// 		this.numlock = '' + this.funcSet;
					// 		this.numdrawn = '' + this.funcSet;
					// 		this.numtimes = '' + this.funcSet;
					// 		this.pdown = '' + this.funcSet;
					// 		this.num7 = '' + this.funcSet;
					// 		this.numplus = '' + this.funcSet;
					// 		this.num3 = '' + this.funcSet;
					// 		this.num0 = '' + this.funcSet;
					// 		this.numdot = '' + this.funcSet;
					// 	}, 1000);
					// }
					this.num = 0
					this.num8 = 'round2' + this.funcSet;
					this.num9 = 'round2' + this.funcSet;
					this.num4 = 'round2' + this.funcSet;
					this.num5 = 'round2' + this.funcSet;
					this.num6 = 'round2' + this.funcSet;
					this.num1 = 'round2' + this.funcSet;
					this.num2 = 'round2' + this.funcSet;
					this.numlock = 'round2_2' + this.funcSet;
					this.numdrawn = 'round2_2' + this.funcSet;
					this.numtimes = 'round2_2' + this.funcSet;
					this.pdown = 'round2_2' + this.funcSet;
					this.num7 = 'round2_2' + this.funcSet;
					this.numplus = 'round2_2' + this.funcSet;
					this.num3 = 'round2_2' + this.funcSet;
					this.num0 = 'round2_2' + this.funcSet;
					this.numdot = 'round2_2' + this.funcSet;
				}
				break;

			case this.vKey == 102 && this.keyStatus == 1: //num6
				if (this.num == 0) {
					this.clear();
					// if (this.keyFlag1 == 0) {
					// 	this.keyFlag1 = 1
					// 	setTimeout(() => {
					// 		this.keyFlag1 = 0;
					// 		this.numplus = '' + this.funcSet;
					// 		this.num9 = '' + this.funcSet;
					// 		this.num5 = '' + this.funcSet;
					// 		this.num6 = '' + this.funcSet;
					// 		this.num2 = '' + this.funcSet;
					// 		this.num3 = '' + this.funcSet;
					// 		this.numdrawn = '' + this.funcSet;
					// 		this.numtimes = '' + this.funcSet;
					// 		this.numminus = '' + this.funcSet;
					// 		this.num7 = '' + this.funcSet;
					// 		this.num8 = '' + this.funcSet;
					// 		this.num4 = '' + this.funcSet;
					// 		this.num1 = '' + this.funcSet;
					// 		this.numdot = '' + this.funcSet;
					// 		this.numenter = '' + this.funcSet;
					// 	}, 1000);
					// }
					this.numplus = 'round1' + this.funcSet;
					this.num9 = 'round1' + this.funcSet;
					this.num5 = 'round1' + this.funcSet;
					this.num6 = 'round1' + this.funcSet;
					this.num2 = 'round1' + this.funcSet;
					this.num3 = 'round1' + this.funcSet;
					this.numdrawn = 'round1_2' + this.funcSet;
					this.numtimes = 'round1_2' + this.funcSet;
					this.numminus = 'round1_2' + this.funcSet;
					this.num7 = 'round1_2' + this.funcSet;
					this.num8 = 'round1_2' + this.funcSet;
					this.num4 = 'round1_2' + this.funcSet;
					this.num1 = 'round1_2' + this.funcSet;
					this.numdot = 'round1_2' + this.funcSet;
					this.numenter = 'round1_2' + this.funcSet;
					this.num = 1
				}
				else if (this.num == 1) {
					this.clear();
					// if (this.keyFlag2 == 0) {
					// 	this.keyFlag2 = 1
					// 	setTimeout(() => {
					// 		this.keyFlag2 = 0;
					// 		this.numplus = '' + this.funcSet;
					// 		this.num9 = '' + this.funcSet;
					// 		this.num5 = '' + this.funcSet;
					// 		this.num6 = '' + this.funcSet;
					// 		this.num2 = '' + this.funcSet;
					// 		this.num3 = '' + this.funcSet;
					// 		this.numdrawn = '' + this.funcSet;
					// 		this.numtimes = '' + this.funcSet;
					// 		this.numminus = '' + this.funcSet;
					// 		this.num7 = '' + this.funcSet;
					// 		this.num8 = '' + this.funcSet;
					// 		this.num4 = '' + this.funcSet;
					// 		this.num1 = '' + this.funcSet;
					// 		this.numdot = '' + this.funcSet;
					// 		this.numenter = '' + this.funcSet;
					// 	}, 1000);
					// }
					this.num = 0
					this.numplus = 'round2' + this.funcSet;
					this.num9 = 'round2' + this.funcSet;
					this.num5 = 'round2' + this.funcSet;
					this.num6 = 'round2' + this.funcSet;
					this.num2 = 'round2' + this.funcSet;
					this.num3 = 'round2' + this.funcSet;
					this.numdrawn = 'round2_2' + this.funcSet;
					this.numtimes = 'round2_2' + this.funcSet;
					this.numminus = 'round2_2' + this.funcSet;
					this.num7 = 'round2_2' + this.funcSet;
					this.num8 = 'round2_2' + this.funcSet;
					this.num4 = 'round2_2' + this.funcSet;
					this.num1 = 'round2_2' + this.funcSet;
					this.numdot = 'round2_2' + this.funcSet;
					this.numenter = 'round2_2' + this.funcSet;
				}
				break;

			case this.vKey == 'l16' && this.keyStatus == 1: //lshift
				if (this.num == 0) {
					this.clear();
					// if (this.keyFlag1 == 0) {
					// 	this.keyFlag1 = 1
					// 	setTimeout(() => {
					// 		this.keyFlag1 = 0;
					// 		this.lshift = '' + this.funcSet;
					// 		this.caps = '' + this.funcSet;
					// 		this.lctrl = '' + this.funcSet;
					// 		this.a = '' + this.funcSet;
					// 		this.tab = '' + this.funcSet;
					// 		this.q = '' + this.funcSet;
					// 		this.s = '' + this.funcSet;
					// 		this.z = '' + this.funcSet;
					// 		this.win = '' + this.funcSet;
					// 	}, 1000);
					// }
					this.lshift = 'round1' + this.funcSet;
					this.caps = 'round1' + this.funcSet;
					this.lctrl = 'round1' + this.funcSet;
					this.a = 'round1' + this.funcSet;
					this.tab = 'round1_2' + this.funcSet;
					this.q = 'round1_2' + this.funcSet;
					this.s = 'round1_2' + this.funcSet;
					this.z = 'round1_2' + this.funcSet;
					this.win = 'round1_2' + this.funcSet;
					this.num = 1
				}
				else if (this.num == 1) {
					this.clear();
					// if (this.keyFlag2 == 0) {
					// 	this.keyFlag2 = 1
					// 	setTimeout(() => {
					// 		this.keyFlag2 = 0;
					// 		this.lshift = '' + this.funcSet;
					// 		this.caps = '' + this.funcSet;
					// 		this.lctrl = '' + this.funcSet;
					// 		this.a = '' + this.funcSet;
					// 		this.tab = '' + this.funcSet;
					// 		this.q = '' + this.funcSet;
					// 		this.s = '' + this.funcSet;
					// 		this.z = '' + this.funcSet;
					// 		this.win = '' + this.funcSet;
					// 	}, 1000);
					// }
					this.num = 0
					this.lshift = 'round2' + this.funcSet;
					this.caps = 'round2' + this.funcSet;
					this.lctrl = 'round2' + this.funcSet;
					this.a = 'round2' + this.funcSet;
					this.tab = 'round_2' + this.funcSet;
					this.q = 'round_2' + this.funcSet;
					this.s = 'round_2' + this.funcSet;
					this.z = 'round_2' + this.funcSet;
					this.win = 'round_2' + this.funcSet;
				}
				break;

			case this.vKey == 90 && this.keyStatus == 1: //z
				if (this.num == 0) {
					this.clear();
					// if (this.keyFlag1 == 0) {
					// 	this.keyFlag1 = 1
					// 	setTimeout(() => {
					// 		this.keyFlag1 = 0;
					// 		this.s = '' + this.funcSet;
					// 		this.win = '' + this.funcSet;
					// 		this.z = '' + this.funcSet;
					// 		this.x = '' + this.funcSet;
					// 		this.s = '' + this.funcSet;
					// 		this.d = '' + this.funcSet;
					// 		this.lalt = '' + this.funcSet;
					// 		this.w = '' + this.funcSet;
					// 		this.e = '' + this.funcSet;
					// 		this.q = '' + this.funcSet;
					// 		this.caps = '' + this.funcSet;
					// 		this.a = '' + this.funcSet;
					// 		this.f = '' + this.funcSet;
					// 		this.lshift = '' + this.funcSet;
					// 		this.c = '' + this.funcSet;
					// 		this.lctrl = '' + this.funcSet;
					// 	}, 1000);
					// }
					this.lshift = 'round1' + this.funcSet;
					this.s = 'round1' + this.funcSet;
					this.win = 'round1' + this.funcSet;
					this.z = 'round1' + this.funcSet;
					this.x = 'round1' + this.funcSet;
					this.s = 'round1' + this.funcSet;
					this.d = 'round1' + this.funcSet;
					this.lalt = 'round1' + this.funcSet;
					this.w = 'round1_2' + this.funcSet;
					this.e = 'round1_2' + this.funcSet;
					this.q = 'round1_2' + this.funcSet;
					this.caps = 'round1_2' + this.funcSet;
					this.a = 'round1_2' + this.funcSet;
					this.f = 'round1_2' + this.funcSet;
					this.lshift = 'round1_2' + this.funcSet;
					this.c = 'round1_2' + this.funcSet;
					this.lctrl = 'round1_2' + this.funcSet;
					this.num = 1
				}
				else if (this.num == 1) {
					this.clear();
					// if (this.keyFlag2 == 0) {
					// 	this.keyFlag2 = 1
					// 	setTimeout(() => {
					// 		this.keyFlag2 = 0;
					// 		this.lshift = '' + this.funcSet;
					// 		this.s = '' + this.funcSet;
					// 		this.win = '' + this.funcSet;
					// 		this.z = '' + this.funcSet;
					// 		this.x = '' + this.funcSet;
					// 		this.s = '' + this.funcSet;
					// 		this.d = '' + this.funcSet;
					// 		this.lalt = '' + this.funcSet;
					// 		this.w = '' + this.funcSet;
					// 		this.e = '' + this.funcSet;
					// 		this.q = '' + this.funcSet;
					// 		this.caps = '' + this.funcSet;
					// 		this.a = '' + this.funcSet;
					// 		this.f = '' + this.funcSet;
					// 		this.lshift = '' + this.funcSet;
					// 		this.c = '' + this.funcSet;
					// 		this.lctrl = '' + this.funcSet;
					// 	}, 1000);
					// }
					this.num = 0
					this.lshift = 'round2' + this.funcSet;
					this.s = 'round2' + this.funcSet;
					this.win = 'round2' + this.funcSet;
					this.z = 'round2' + this.funcSet;
					this.x = 'round2' + this.funcSet;
					this.s = 'round2' + this.funcSet;
					this.d = 'round2' + this.funcSet;
					this.lalt = 'round2' + this.funcSet;
					this.w = '' + this.funcSet;
					this.e = '' + this.funcSet;
					this.q = '' + this.funcSet;
					this.caps = '' + this.funcSet;
					this.a = '' + this.funcSet;
					this.f = '' + this.funcSet;
					this.lshift = '' + this.funcSet;
					this.c = '' + this.funcSet;
					this.lctrl = '' + this.funcSet;
				}
				break;

			case this.vKey == 88 && this.keyStatus == 1: //x
				if (this.num == 0) {
					this.clear();
					// if (this.keyFlag1 == 0) {
					// 	this.keyFlag1 = 1
					// 	setTimeout(() => {
					// 		this.keyFlag1 = 0;
					// 		this.d = '' + this.funcSet;
					// 		this.f = '' + this.funcSet;
					// 		this.c = '' + this.funcSet;
					// 		this.z = '' + this.funcSet;
					// 		this.x = '' + this.funcSet;
					// 		this.lalt = '' + this.funcSet;
					// 		this.w = '' + this.funcSet;
					// 		this.e = '' + this.funcSet;
					// 		this.r = '' + this.funcSet;
					// 		this.a = '' + this.funcSet;
					// 		this.s = '' + this.funcSet;
					// 		this.g = '' + this.funcSet;
					// 		this.v = '' + this.funcSet;
					// 		this.win = '' + this.funcSet;
					// 	}, 1000);
					// }
					this.d = 'round1' + this.funcSet;
					this.f = 'round1' + this.funcSet;
					this.c = 'round1' + this.funcSet;
					this.z = 'round1' + this.funcSet;
					this.x = 'round1' + this.funcSet;
					this.lalt = 'round1' + this.funcSet;
					this.w = 'round1_2' + this.funcSet;
					this.e = 'round1_2' + this.funcSet;
					this.r = 'round1_2' + this.funcSet;
					this.a = 'round1_2' + this.funcSet;
					this.s = 'round1_2' + this.funcSet;
					this.g = 'round1_2' + this.funcSet;
					this.v = 'round1_2' + this.funcSet;
					this.win = 'round1_2' + this.funcSet;
					this.num = 1
				}
				else if (this.num == 1) {
					this.clear();
					// if (this.keyFlag2 == 0) {
					// 	this.keyFlag2 = 1
					// 	setTimeout(() => {
					// 		this.keyFlag2 = 0;
					// 		this.d = '' + this.funcSet;
					// 		this.f = '' + this.funcSet;
					// 		this.c = '' + this.funcSet;
					// 		this.z = '' + this.funcSet;
					// 		this.x = '' + this.funcSet;
					// 		this.lalt = '' + this.funcSet;
					// 		this.w = '' + this.funcSet;
					// 		this.e = '' + this.funcSet;
					// 		this.r = '' + this.funcSet;
					// 		this.a = '' + this.funcSet;
					// 		this.s = '' + this.funcSet;
					// 		this.g = '' + this.funcSet;
					// 		this.v = '' + this.funcSet;
					// 		this.win = '' + this.funcSet;
					// 	}, 1000);
					// }
					this.num = 0
					this.d = 'round2' + this.funcSet;
					this.f = 'round2' + this.funcSet;
					this.c = 'round2' + this.funcSet;
					this.z = 'round2' + this.funcSet;
					this.x = 'round2' + this.funcSet;
					this.lalt = 'round2' + this.funcSet;
					this.w = 'round2_2' + this.funcSet;
					this.e = 'round2_2' + this.funcSet;
					this.r = 'round2_2' + this.funcSet;
					this.a = 'round2_2' + this.funcSet;
					this.s = 'round2_2' + this.funcSet;
					this.g = 'round2_2' + this.funcSet;
					this.v = 'round2_2' + this.funcSet;
					this.win = 'round2_2' + this.funcSet;
				}
				break;

			case this.vKey == 67 && this.keyStatus == 1: //c
				if (this.num == 0) {
					this.clear();
					// if (this.keyFlag1 == 0) {
					// 	this.keyFlag1 = 1
					// 	setTimeout(() => {
					// 		this.keyFlag1 = 0;
					// 		this.c = '' + this.funcSet;
					// 		this.x = '' + this.funcSet;
					// 		this.f = '' + this.funcSet;
					// 		this.g = '' + this.funcSet;
					// 		this.v = '' + this.funcSet;
					// 		this.e = '' + this.funcSet;
					// 		this.r = '' + this.funcSet;
					// 		this.t = '' + this.funcSet;
					// 		this.s = '' + this.funcSet;
					// 		this.d = '' + this.funcSet;
					// 		this.h = '' + this.funcSet;
					// 		this.z = '' + this.funcSet;
					// 		this.b = '' + this.funcSet;
					// 		this.lalt = '' + this.funcSet;
					// 	}, 1000);
					// }
					this.c = 'round1' + this.funcSet;
					this.x = 'round1' + this.funcSet;
					this.f = 'round1' + this.funcSet;
					this.g = 'round1' + this.funcSet;
					this.v = 'round1' + this.funcSet;
					this.e = 'round1_2' + this.funcSet;
					this.r = 'round1_2' + this.funcSet;
					this.t = 'round1_2' + this.funcSet;
					this.s = 'round1_2' + this.funcSet;
					this.d = 'round1_2' + this.funcSet;
					this.h = 'round1_2' + this.funcSet;
					this.z = 'round1_2' + this.funcSet;
					this.b = 'round1_2' + this.funcSet;
					this.lalt = 'round1_2' + this.funcSet;
					this.num = 1
				}
				else if (this.num == 1) {
					this.clear();
					// if (this.keyFlag2 == 0) {
					// 	this.keyFlag2 = 1
					// 	setTimeout(() => {
					// 		this.keyFlag2 = 0;
					// 		this.c = '' + this.funcSet;
					// 		this.x = '' + this.funcSet;
					// 		this.f = '' + this.funcSet;
					// 		this.g = '' + this.funcSet;
					// 		this.v = '' + this.funcSet;
					// 		this.e = '' + this.funcSet;
					// 		this.r = '' + this.funcSet;
					// 		this.t = '' + this.funcSet;
					// 		this.s = '' + this.funcSet;
					// 		this.d = '' + this.funcSet;
					// 		this.h = '' + this.funcSet;
					// 		this.z = '' + this.funcSet;
					// 		this.b = '' + this.funcSet;
					// 		this.lalt = '' + this.funcSet;
					// 	}, 1000);
					// }
					this.num = 0
					this.c = 'round2' + this.funcSet;
					this.x = 'round2' + this.funcSet;
					this.f = 'round2' + this.funcSet;
					this.g = 'round2' + this.funcSet;
					this.v = 'round2' + this.funcSet;
					this.e = 'round2_2' + this.funcSet;
					this.r = 'round2_2' + this.funcSet;
					this.t = 'round2_2' + this.funcSet;
					this.s = 'round2_2' + this.funcSet;
					this.d = 'round2_2' + this.funcSet;
					this.h = 'round2_2' + this.funcSet;
					this.z = 'round2_2' + this.funcSet;
					this.b = 'round2_2' + this.funcSet;
					this.lalt = 'round2_2' + this.funcSet;
				}
				break;

			case this.vKey == 86 && this.keyStatus == 1: //v
				if (this.num == 0) {
					this.clear();
					// if (this.keyFlag1 == 0) {
					// 	this.keyFlag1 = 1
					// 	setTimeout(() => {
					// 		this.keyFlag1 = 0;
					// 		this.c = '' + this.funcSet;
					// 		this.v = '' + this.funcSet;
					// 		this.b = '' + this.funcSet;
					// 		this.g = '' + this.funcSet;
					// 		this.h = '' + this.funcSet;
					// 		this.r = '' + this.funcSet;
					// 		this.t = '' + this.funcSet;
					// 		this.y = '' + this.funcSet;
					// 		this.d = '' + this.funcSet;
					// 		this.f = '' + this.funcSet;
					// 		this.j = '' + this.funcSet;
					// 		this.x = '' + this.funcSet;
					// 		this.b = '' + this.funcSet;
					// 		this.space = '' + this.funcSet;
					// 	}, 1000);
					// }
					this.c = 'round1' + this.funcSet;
					this.v = 'round1' + this.funcSet;
					this.b = 'round1' + this.funcSet;
					this.g = 'round1' + this.funcSet;
					this.h = 'round1' + this.funcSet;
					this.r = 'round1_2' + this.funcSet;
					this.t = 'round1_2' + this.funcSet;
					this.y = 'round1_2' + this.funcSet;
					this.d = 'round1_2' + this.funcSet;
					this.f = 'round1_2' + this.funcSet;
					this.j = 'round1_2' + this.funcSet;
					this.x = 'round1_2' + this.funcSet;
					this.b = 'round1_2' + this.funcSet;
					this.space = 'round1_2' + this.funcSet;
					this.num = 1
				}
				else if (this.num == 1) {
					this.clear();
					// if (this.keyFlag2 == 0) {
					// 	this.keyFlag2 = 1
					// 	setTimeout(() => {
					// 		this.keyFlag2 = 0;
					// 		this.c = '' + this.funcSet;
					// 		this.v = '' + this.funcSet;
					// 		this.b = '' + this.funcSet;
					// 		this.g = '' + this.funcSet;
					// 		this.h = '' + this.funcSet;
					// 		this.r = '' + this.funcSet;
					// 		this.t = '' + this.funcSet;
					// 		this.y = '' + this.funcSet;
					// 		this.d = '' + this.funcSet;
					// 		this.f = '' + this.funcSet;
					// 		this.j = '' + this.funcSet;
					// 		this.x = '' + this.funcSet;
					// 		this.b = '' + this.funcSet;
					// 		this.space = '' + this.funcSet;
					// 	}, 1000);
					// }
					this.num = 0
					this.c = 'round2' + this.funcSet;
					this.v = 'round2' + this.funcSet;
					this.b = 'round2' + this.funcSet;
					this.g = 'round2' + this.funcSet;
					this.h = 'round2' + this.funcSet;
					this.r = 'round2_2' + this.funcSet;
					this.t = 'round2_2' + this.funcSet;
					this.y = 'round2_2' + this.funcSet;
					this.d = 'round2_2' + this.funcSet;
					this.f = 'round2_2' + this.funcSet;
					this.j = 'round2_2' + this.funcSet;
					this.x = 'round2_2' + this.funcSet;
					this.b = 'round2_2' + this.funcSet;
					this.space = 'round2_2' + this.funcSet;
				}
				break;

			case this.vKey == 66 && this.keyStatus == 1: //b
				if (this.num == 0) {
					this.clear();
					// if (this.keyFlag1 == 0) {
					// 	this.keyFlag1 = 1
					// 	setTimeout(() => {
					// 		this.keyFlag1 = 0;
					// 		this.h = '' + this.funcSet;
					// 		this.j = '' + this.funcSet;
					// 		this.v = '' + this.funcSet;
					// 		this.b = '' + this.funcSet;
					// 		this.n = '' + this.funcSet;
					// 		this.t = '' + this.funcSet;
					// 		this.y = '' + this.funcSet;
					// 		this.u = '' + this.funcSet;
					// 		this.f = '' + this.funcSet;
					// 		this.g = '' + this.funcSet;
					// 		this.k = '' + this.funcSet;
					// 		this.c = '' + this.funcSet;
					// 		this.m = '' + this.funcSet;
					// 		this.space = '' + this.funcSet;
					// 	}, 1000);
					// }
					this.h = 'round1' + this.funcSet;
					this.j = 'round1' + this.funcSet;
					this.v = 'round1' + this.funcSet;
					this.b = 'round1' + this.funcSet;
					this.n = 'round1' + this.funcSet;
					this.t = 'round1_2' + this.funcSet;
					this.y = 'round1_2' + this.funcSet;
					this.u = 'round1_2' + this.funcSet;
					this.f = 'round1_2' + this.funcSet;
					this.g = 'round1_2' + this.funcSet;
					this.k = 'round1_2' + this.funcSet;
					this.c = 'round1_2' + this.funcSet;
					this.m = 'round1_2' + this.funcSet;
					this.space = 'round1_2' + this.funcSet;
					this.num = 1
				}
				else if (this.num == 1) {
					this.clear();
					// if (this.keyFlag2 == 0) {
					// 	this.keyFlag2 = 1
					// 	setTimeout(() => {
					// 		this.keyFlag2 = 0;
					// 		this.h = '' + this.funcSet;
					// 		this.j = '' + this.funcSet;
					// 		this.v = '' + this.funcSet;
					// 		this.b = '' + this.funcSet;
					// 		this.n = '' + this.funcSet;
					// 		this.t = '' + this.funcSet;
					// 		this.y = '' + this.funcSet;
					// 		this.u = '' + this.funcSet;
					// 		this.f = '' + this.funcSet;
					// 		this.g = '' + this.funcSet;
					// 		this.k = '' + this.funcSet;
					// 		this.c = '' + this.funcSet;
					// 		this.m = '' + this.funcSet;
					// 		this.space = '' + this.funcSet;
					// 	}, 1000);
					// }
					this.num = 0
					this.h = 'round2' + this.funcSet;
					this.j = 'round2' + this.funcSet;
					this.v = 'round2' + this.funcSet;
					this.b = 'round2' + this.funcSet;
					this.n = 'round2' + this.funcSet;
					this.t = 'round2_2' + this.funcSet;
					this.y = 'round2_2' + this.funcSet;
					this.u = 'round2_2' + this.funcSet;
					this.f = 'round2_2' + this.funcSet;
					this.g = 'round2_2' + this.funcSet;
					this.k = 'round2_2' + this.funcSet;
					this.c = 'round2_2' + this.funcSet;
					this.m = 'round2_2' + this.funcSet;
					this.space = 'round2_2' + this.funcSet;
				}
				break;


			case this.vKey == 78 && this.keyStatus == 1: //n
				if (this.num == 0) {
					this.clear();
					// if (this.keyFlag1 == 0) {
					// 	this.keyFlag1 = 1
					// 	setTimeout(() => {
					// 		this.keyFlag1 = 0;
					// 		this.k = '' + this.funcSet;
					// 		this.j = '' + this.funcSet;
					// 		this.m = '' + this.funcSet;
					// 		this.b = '' + this.funcSet;
					// 		this.n = '' + this.funcSet;
					// 		this.y = '' + this.funcSet;
					// 		this.u = '' + this.funcSet;
					// 		this.i = '' + this.funcSet;
					// 		this.g = '' + this.funcSet;
					// 		this.h = '' + this.funcSet;
					// 		this.l = '' + this.funcSet;
					// 		this.v = '' + this.funcSet;
					// 		this.comma = '' + this.funcSet;
					// 		this.space = '' + this.funcSet;
					// 	}, 1000);
					// }
					this.k = 'round1' + this.funcSet;
					this.j = 'round1' + this.funcSet;
					this.m = 'round1' + this.funcSet;
					this.b = 'round1' + this.funcSet;
					this.n = 'round1' + this.funcSet;
					this.y = 'round1_2' + this.funcSet;
					this.u = 'round1_2' + this.funcSet;
					this.i = 'round1_2' + this.funcSet;
					this.g = 'round1_2' + this.funcSet;
					this.h = 'round1_2' + this.funcSet;
					this.l = 'round1_2' + this.funcSet;
					this.v = 'round1_2' + this.funcSet;
					this.comma = 'round1_2' + this.funcSet;
					this.space = 'round1_2' + this.funcSet;
					this.num = 1
				}
				else if (this.num == 1) {
					this.clear();
					// if (this.keyFlag2 == 0) {
					// 	this.keyFlag2 = 1
					// 	setTimeout(() => {
					// 		this.keyFlag2 = 0;
					// 		this.k = '' + this.funcSet;
					// 		this.j = '' + this.funcSet;
					// 		this.m = '' + this.funcSet;
					// 		this.b = '' + this.funcSet;
					// 		this.n = '' + this.funcSet;
					// 		this.y = '' + this.funcSet;
					// 		this.u = '' + this.funcSet;
					// 		this.i = '' + this.funcSet;
					// 		this.g = '' + this.funcSet;
					// 		this.h = '' + this.funcSet;
					// 		this.l = '' + this.funcSet;
					// 		this.v = '' + this.funcSet;
					// 		this.comma = '' + this.funcSet;
					// 		this.space = '' + this.funcSet;
					// 	}, 1000);
					// }
					this.num = 0
					this.k = 'round2' + this.funcSet;
					this.j = 'round2' + this.funcSet;
					this.m = 'round2' + this.funcSet;
					this.b = 'round2' + this.funcSet;
					this.n = 'round2' + this.funcSet;
					this.y = 'round2_2' + this.funcSet;
					this.u = 'round2_2' + this.funcSet;
					this.i = 'round2_2' + this.funcSet;
					this.g = 'round2_2' + this.funcSet;
					this.h = 'round2_2' + this.funcSet;
					this.l = 'round2_2' + this.funcSet;
					this.v = 'round2_2' + this.funcSet;
					this.comma = 'round2_2' + this.funcSet;
					this.space = 'round2_2' + this.funcSet;
				}
				break;

			case this.vKey == 77 && this.keyStatus == 1: //m
				if (this.num == 0) {
					this.clear();
					// if (this.keyFlag1 == 0) {
					// 	this.keyFlag1 = 1
					// 	setTimeout(() => {
					// 		this.keyFlag1 = 0;
					// 		this.k = '' + this.funcSet;
					// 		this.l = '' + this.funcSet;
					// 		this.n = '' + this.funcSet;
					// 		this.m = '' + this.funcSet;
					// 		this.comma = '' + this.funcSet;
					// 		this.u = "" + this.funcSet;
					// 		this.i = "" + this.funcSet;
					// 		this.o = "" + this.funcSet;
					// 		this.h = "" + this.funcSet;
					// 		this.j = "" + this.funcSet;
					// 		this.sem = "" + this.funcSet;
					// 		this.b = "" + this.funcSet;
					// 		this.dot = "" + this.funcSet;
					// 		this.space = "" + this.funcSet;
					// 	}, 1000);
					// }
					this.k = 'round1' + this.funcSet;
					this.l = 'round1' + this.funcSet;
					this.n = 'round1' + this.funcSet;
					this.m = 'round1' + this.funcSet;
					this.comma = 'round1' + this.funcSet;
					this.u = "round1_2" + this.funcSet;
					this.i = "round1_2" + this.funcSet;
					this.o = "round1_2" + this.funcSet;
					this.h = "round1_2" + this.funcSet;
					this.j = "round1_2" + this.funcSet;
					this.sem = "round1_2" + this.funcSet;
					this.b = "round1_2" + this.funcSet;
					this.dot = "round1_2" + this.funcSet;
					this.space = "round1_2" + this.funcSet;
					this.num = 1
				}
				else if (this.num == 1) {
					this.clear();
					// if (this.keyFlag2 == 0) {
					// 	this.keyFlag2 = 1
					// 	setTimeout(() => {
					// 		this.keyFlag2 = 0;
					// 		this.k = '' + this.funcSet;
					// 		this.l = '' + this.funcSet;
					// 		this.n = '' + this.funcSet;
					// 		this.m = '' + this.funcSet;
					// 		this.comma = '' + this.funcSet;
					// 		this.u = "" + this.funcSet;
					// 		this.i = "" + this.funcSet;
					// 		this.o = "" + this.funcSet;
					// 		this.h = "" + this.funcSet;
					// 		this.j = "" + this.funcSet;
					// 		this.sem = "" + this.funcSet;
					// 		this.b = "" + this.funcSet;
					// 		this.dot = "" + this.funcSet;
					// 		this.space = "" + this.funcSet;
					// 	}, 1000);
					// }
					this.num = 0
					this.k = 'round2' + this.funcSet;
					this.l = 'round2' + this.funcSet;
					this.n = 'round2' + this.funcSet;
					this.m = 'round2' + this.funcSet;
					this.comma = 'round2' + this.funcSet;
					this.u = "round2_2" + this.funcSet;
					this.i = "round2_2" + this.funcSet;
					this.o = "round2_2" + this.funcSet;
					this.h = "round2_2" + this.funcSet;
					this.j = "round2_2" + this.funcSet;
					this.sem = "round2_2" + this.funcSet;
					this.b = "round2_2" + this.funcSet;
					this.dot = "round2_2" + this.funcSet;
					this.space = "round2_2" + this.funcSet;
				}
				break;

			case this.vKey == 188 && this.keyStatus == 1: //comma
				if (this.num == 0) {
					this.clear();
					// if (this.keyFlag1 == 0) {
					// 	this.keyFlag1 = 1
					// 	setTimeout(() => {
					// 		this.keyFlag1 = 0;
					// 		this.l = '' + this.funcSet;
					// 		this.sem = '' + this.funcSet;
					// 		this.m = '' + this.funcSet;
					// 		this.comma = '' + this.funcSet;
					// 		this.dot = '' + this.funcSet;
					// 		this.i = '' + this.funcSet;
					// 		this.o = '' + this.funcSet;
					// 		this.p = '' + this.funcSet;
					// 		this.j = '' + this.funcSet;
					// 		this.k = '' + this.funcSet;
					// 		this.quo = '' + this.funcSet;
					// 		this.n = '' + this.funcSet;
					// 		this.qmark = '' + this.funcSet;
					// 		this.ralt = '' + this.funcSet;
					// 	}, 1000);
					// }
					this.l = 'round1' + this.funcSet;
					this.sem = 'round1' + this.funcSet;
					this.m = 'round1' + this.funcSet;
					this.comma = 'round1' + this.funcSet;
					this.dot = 'round1' + this.funcSet;
					this.i = 'round1_2' + this.funcSet;
					this.o = 'round1_2' + this.funcSet;
					this.p = 'round1_2' + this.funcSet;
					this.j = 'round1_2' + this.funcSet;
					this.k = 'round1_2' + this.funcSet;
					this.quo = 'round1_2' + this.funcSet;
					this.n = 'round1_2' + this.funcSet;
					this.qmark = 'round1_2' + this.funcSet;
					this.ralt = 'round1_2' + this.funcSet;
					this.num = 1
				}
				else if (this.num == 1) {
					this.clear();
					// if (this.keyFlag2 == 0) {
					// 	this.keyFlag2 = 1
					// 	setTimeout(() => {
					// 		this.keyFlag2 = 0;
					// 		this.l = '' + this.funcSet;
					// 		this.sem = '' + this.funcSet;
					// 		this.m = '' + this.funcSet;
					// 		this.comma = '' + this.funcSet;
					// 		this.dot = '' + this.funcSet;
					// 		this.i = '' + this.funcSet;
					// 		this.o = '' + this.funcSet;
					// 		this.p = '' + this.funcSet;
					// 		this.j = '' + this.funcSet;
					// 		this.k = '' + this.funcSet;
					// 		this.quo = '' + this.funcSet;
					// 		this.n = '' + this.funcSet;
					// 		this.qmark = '' + this.funcSet;
					// 		this.ralt = '' + this.funcSet;
					// 	}, 1000);
					// }
					this.num = 0
					this.l = 'round2' + this.funcSet;
					this.sem = 'round2' + this.funcSet;
					this.m = 'round2' + this.funcSet;
					this.comma = 'round2' + this.funcSet;
					this.dot = 'round2' + this.funcSet;
					this.i = 'round2_2' + this.funcSet;
					this.o = 'round2_2' + this.funcSet;
					this.p = 'round2_2' + this.funcSet;
					this.j = 'round2_2' + this.funcSet;
					this.k = 'round2_2' + this.funcSet;
					this.quo = 'round2_2' + this.funcSet;
					this.n = 'round2_2' + this.funcSet;
					this.qmark = 'round2_2' + this.funcSet;
					this.ralt = 'round2_2' + this.funcSet;
				}
				break;

			case this.vKey == 190 && this.keyStatus == 1: //dot
				if (this.num == 0) {
					this.clear();
					// if (this.keyFlag1 == 0) {
					// 	this.keyFlag1 = 1
					// 	setTimeout(() => {
					// 		this.keyFlag1 = 0;
					// 		this.quo = '' + this.funcSet;
					// 		this.sem = '' + this.funcSet;
					// 		this.comma = '' + this.funcSet;
					// 		this.dot = '' + this.funcSet;
					// 		this.qmark = '' + this.funcSet;
					// 		this.ralt = '' + this.funcSet;
					// 		this.o = '' + this.funcSet;
					// 		this.p = '' + this.funcSet;
					// 		this.lqu = '' + this.funcSet;
					// 		this.k = '' + this.funcSet;
					// 		this.l = '' + this.funcSet;
					// 		this.m = '' + this.funcSet;
					// 		this.fn = '' + this.funcSet;
					// 	}, 1000);
					// }
					this.quo = 'round1' + this.funcSet;
					this.sem = 'round1' + this.funcSet;
					this.comma = 'round1' + this.funcSet;
					this.dot = 'round1' + this.funcSet;
					this.qmark = 'round1' + this.funcSet;
					this.ralt = 'round1' + this.funcSet;
					this.o = 'round1_2' + this.funcSet;
					this.p = 'round1_2' + this.funcSet;
					this.lqu = 'round1_2' + this.funcSet;
					this.k = 'round1_2' + this.funcSet;
					this.l = 'round1_2' + this.funcSet;
					this.m = 'round1_2' + this.funcSet;
					this.fn = 'round1_2' + this.funcSet;
					this.num = 1
				}
				else if (this.num == 1) {
					this.clear();
					// if (this.keyFlag2 == 0) {
					// 	this.keyFlag2 = 1
					// 	setTimeout(() => {
					// 		this.keyFlag2 = 0;
					// 		this.quo = '' + this.funcSet;
					// 		this.sem = '' + this.funcSet;
					// 		this.comma = '' + this.funcSet;
					// 		this.dot = '' + this.funcSet;
					// 		this.qmark = '' + this.funcSet;
					// 		this.ralt = '' + this.funcSet;
					// 		this.o = '' + this.funcSet;
					// 		this.p = '' + this.funcSet;
					// 		this.lqu = '' + this.funcSet;
					// 		this.k = '' + this.funcSet;
					// 		this.l = '' + this.funcSet;
					// 		this.m = '' + this.funcSet;
					// 		this.fn = '' + this.funcSet;
					// 	}, 1000);
					// }
					this.num = 0
					this.quo = 'round2' + this.funcSet;
					this.sem = 'round2' + this.funcSet;
					this.comma = 'round2' + this.funcSet;
					this.dot = 'round2' + this.funcSet;
					this.qmark = 'round2' + this.funcSet;
					this.ralt = 'round2' + this.funcSet;
					this.o = 'round2_2' + this.funcSet;
					this.p = 'round2_2' + this.funcSet;
					this.lqu = 'round2_2' + this.funcSet;
					this.k = 'round2_2' + this.funcSet;
					this.l = 'round2_2' + this.funcSet;
					this.m = 'round2_2' + this.funcSet;
					this.fn = 'round2_2' + this.funcSet;
				}
				break;

			case this.vKey == 191 && this.keyStatus == 1: //qmark
				if (this.num == 0) {
					this.clear();
					// if (this.keyFlag1 == 0) {
					// 	this.keyFlag1 = 1
					// 	setTimeout(() => {
					// 		this.keyFlag1 = 0;
					// 		this.qmark = '' + this.funcSet;
					// 		this.quo = '' + this.funcSet;
					// 		this.dot = '' + this.funcSet;
					// 		this.ralt = '' + this.funcSet;
					// 		this.fn = '' + this.funcSet;
					// 		this.p = '' + this.funcSet;
					// 		this.lqu = '' + this.funcSet;
					// 		this.rqu = '' + this.funcSet;
					// 		this.l = '' + this.funcSet;
					// 		this.sem = '' + this.funcSet;
					// 		this.enter = '' + this.funcSet;
					// 		this.sem = '' + this.funcSet;
					// 		this.rshift = '' + this.funcSet;
					// 		this.ralt = '' + this.funcSet;
					// 		this.book = '' + this.funcSet;
					// 	}, 1000);
					// }
					this.qmark = 'round1' + this.funcSet;
					this.quo = 'round1' + this.funcSet;
					this.dot = 'round1' + this.funcSet;
					this.ralt = 'round1' + this.funcSet;
					this.fn = 'round1' + this.funcSet;
					this.p = 'round1_2' + this.funcSet;
					this.lqu = 'round1_2' + this.funcSet;
					this.rqu = 'round1_2' + this.funcSet;
					this.l = 'round1_2' + this.funcSet;
					this.sem = 'round1_2' + this.funcSet;
					this.enter = 'round1_2' + this.funcSet;
					this.sem = 'round1_2' + this.funcSet;
					this.rshift = 'round1_2' + this.funcSet;
					this.ralt = 'round1_2' + this.funcSet;
					this.book = 'round1_2' + this.funcSet;
					this.num = 1
				}
				else if (this.num == 1) {
					this.clear();
					// if (this.keyFlag2 == 0) {
					// 	this.keyFlag2 = 1
					// 	setTimeout(() => {
					// 		this.keyFlag2 = 0;
					// 		this.qmark = '' + this.funcSet;
					// 		this.quo = '' + this.funcSet;
					// 		this.dot = '' + this.funcSet;
					// 		this.ralt = '' + this.funcSet;
					// 		this.fn = '' + this.funcSet;
					// 		this.p = '' + this.funcSet;
					// 		this.lqu = '' + this.funcSet;
					// 		this.rqu = '' + this.funcSet;
					// 		this.l = '' + this.funcSet;
					// 		this.sem = '' + this.funcSet;
					// 		this.enter = '' + this.funcSet;
					// 		this.sem = '' + this.funcSet;
					// 		this.rshift = '' + this.funcSet;
					// 		this.ralt = '' + this.funcSet;
					// 		this.book = '' + this.funcSet;
					// 	}, 1000);
					// }
					this.num = 0
					this.qmark = 'round2' + this.funcSet;
					this.quo = 'round2' + this.funcSet;
					this.dot = 'round2' + this.funcSet;
					this.ralt = 'round2' + this.funcSet;
					this.fn = 'round2' + this.funcSet;
					this.p = 'round2_2' + this.funcSet;
					this.lqu = 'round2_2' + this.funcSet;
					this.rqu = 'round2_2' + this.funcSet;
					this.l = 'round2_2' + this.funcSet;
					this.sem = 'round2_2' + this.funcSet;
					this.enter = 'round2_2' + this.funcSet;
					this.sem = 'round2_2' + this.funcSet;
					this.rshift = 'round2_2' + this.funcSet;
					this.ralt = 'round2_2' + this.funcSet;
					this.book = 'round2_2' + this.funcSet;
				}
				break;

			case this.vKey == 'r16' && this.keyStatus == 1: //rshift
				if (this.num == 0) {
					this.clear();
					// if (this.keyFlag1 == 0) {
					// 	this.keyFlag1 = 1
					// 	setTimeout(() => {
					// 		this.keyFlag1 = 0;
					// 		this.rshift = '' + this.funcSet;
					// 		this.enter = '' + this.funcSet;
					// 		this.book = '' + this.funcSet;
					// 		this.rctrl = '' + this.funcSet;
					// 		this.rqu = '' + this.funcSet;
					// 		this.drawn = '' + this.funcSet;
					// 		this.quo = '' + this.funcSet;
					// 		this.qmark = '' + this.funcSet;
					// 		this.fn = '' + this.funcSet;
					// 	}, 1000);
					// }
					this.rshift = 'round1' + this.funcSet;
					this.enter = 'round1' + this.funcSet;
					this.book = 'round1' + this.funcSet;
					this.rctrl = 'round1' + this.funcSet;
					this.rqu = 'round1_2' + this.funcSet;
					this.drawn = 'round1_2' + this.funcSet;
					this.quo = 'round1_2' + this.funcSet;
					this.qmark = 'round1_2' + this.funcSet;
					this.fn = 'round1_2' + this.funcSet;
					this.num = 1
				}
				else if (this.num == 1) {
					this.clear();
					// if (this.keyFlag2 == 0) {
					// 	this.keyFlag2 = 1
					// 	setTimeout(() => {
					// 		this.keyFlag2 = 0;
					// 		this.rshift = '' + this.funcSet;
					// 		this.enter = '' + this.funcSet;
					// 		this.book = '' + this.funcSet;
					// 		this.rctrl = '' + this.funcSet;
					// 		this.rqu = '' + this.funcSet;
					// 		this.drawn = '' + this.funcSet;
					// 		this.quo = '' + this.funcSet;
					// 		this.qmark = '' + this.funcSet;
					// 		this.fn = '' + this.funcSet;
					// 	}, 1000);
					// }
					this.num = 0
					this.rshift = 'round2' + this.funcSet;
					this.enter = 'round2' + this.funcSet;
					this.book = 'round2' + this.funcSet;
					this.rctrl = 'round2' + this.funcSet;
					this.rqu = 'round2_2' + this.funcSet;
					this.drawn = 'round2_2' + this.funcSet;
					this.quo = 'round2_2' + this.funcSet;
					this.qmark = 'round2_2' + this.funcSet;
					this.fn = 'round2_2' + this.funcSet;
				}
				break;

			case this.vKey == 38 && this.keyStatus == 1: //up
				if (this.num == 0) {
					this.clear();
					// if (this.keyFlag1 == 0) {
					// 	this.keyFlag1 = 1
					// 	setTimeout(() => {
					// 		this.keyFlag1 = 0;
					// 		this.up = '' + this.funcSet;
					// 		this.left = '' + this.funcSet;
					// 		this.down = '' + this.funcSet;
					// 		this.delete = '' + this.funcSet;
					// 		this.end = '' + this.funcSet;
					// 		this.pdown = '' + this.funcSet;
					// 		this.right = '' + this.funcSet;
					// 		this.num4 = '' + this.funcSet;
					// 		this.num1 = '' + this.funcSet;
					// 	}, 1000);
					// }
					this.up = 'round1' + this.funcSet;
					this.left = 'round1' + this.funcSet;
					this.down = 'round1' + this.funcSet;
					this.delete = 'round1_2' + this.funcSet;
					this.end = 'round1_2' + this.funcSet;
					this.pdown = 'round1_2' + this.funcSet;
					this.right = 'round1_2' + this.funcSet;
					this.num4 = 'round1_2' + this.funcSet;
					this.num1 = 'round1_2' + this.funcSet;
					this.num = 1
				}
				else if (this.num == 1) {
					this.clear();
					// if (this.keyFlag2 == 0) {
					// 	this.keyFlag2 = 1
					// 	setTimeout(() => {
					// 		this.keyFlag2 = 0;
					// 		this.up = '' + this.funcSet;
					// 		this.left = '' + this.funcSet;
					// 		this.down = '' + this.funcSet;
					// 		this.delete = '' + this.funcSet;
					// 		this.end = '' + this.funcSet;
					// 		this.pdown = '' + this.funcSet;
					// 		this.right = '' + this.funcSet;
					// 		this.num4 = '' + this.funcSet;
					// 		this.num1 = '' + this.funcSet;
					// 	}, 1000);
					// }
					this.num = 0
					this.up = 'round2' + this.funcSet;
					this.left = 'round2' + this.funcSet;
					this.down = 'round2' + this.funcSet;
					this.delete = 'round2_2' + this.funcSet;
					this.end = 'round2_2' + this.funcSet;
					this.pdown = 'round2_2' + this.funcSet;
					this.right = 'round2_2' + this.funcSet;
					this.num4 = 'round2_2' + this.funcSet;
					this.num1 = 'round2_2' + this.funcSet;
				}
				break;

			case this.vKey == 97 && this.keyStatus == 1: //num1
				if (this.num == 0) {
					this.clear();
					// if (this.keyFlag1 == 0) {
					// 	this.keyFlag1 = 1
					// 	setTimeout(() => {
					// 		this.keyFlag1 = 0;
					// 		this.num4 = '' + this.funcSet;
					// 		this.num5 = '' + this.funcSet;
					// 		this.num1 = '' + this.funcSet;
					// 		this.num2 = '' + this.funcSet;
					// 		this.num0 = '' + this.funcSet;
					// 		this.right = '' + this.funcSet;
					// 		this.pdown = '' + this.funcSet;
					// 		this.num7 = '' + this.funcSet;
					// 		this.num8 = '' + this.funcSet;
					// 		this.num6 = '' + this.funcSet;
					// 		this.num3 = '' + this.funcSet;
					// 		this.num3 = '' + this.funcSet;
					// 		this.up = '' + this.funcSet;
					// 		this.down = '' + this.funcSet;
					// 	}, 1000);
					// }
					this.num4 = 'round1' + this.funcSet;
					this.num5 = 'round1' + this.funcSet;
					this.num1 = 'round1' + this.funcSet;
					this.num2 = 'round1' + this.funcSet;
					this.num0 = 'round1' + this.funcSet;
					this.right = 'round1' + this.funcSet;
					this.pdown = 'round1_2' + this.funcSet;
					this.num7 = 'round1_2' + this.funcSet;
					this.num8 = 'round1_2' + this.funcSet;
					this.num6 = 'round1_2' + this.funcSet;
					this.num3 = 'round1_2' + this.funcSet;
					this.num3 = 'round1_2' + this.funcSet;
					this.up = 'round1_2' + this.funcSet;
					this.down = 'round1_2' + this.funcSet;
					this.num = 1
				}
				else if (this.num == 1) {
					this.clear();
					// if (this.keyFlag2 == 0) {
					// 	this.keyFlag2 = 1
					// 	setTimeout(() => {
					// 		this.keyFlag2 = 0;
					// 		this.num4 = '' + this.funcSet;
					// 		this.num5 = '' + this.funcSet;
					// 		this.num1 = '' + this.funcSet;
					// 		this.num2 = '' + this.funcSet;
					// 		this.num0 = '' + this.funcSet;
					// 		this.right = '' + this.funcSet;
					// 		this.pdown = '' + this.funcSet;
					// 		this.num7 = '' + this.funcSet;
					// 		this.num8 = '' + this.funcSet;
					// 		this.num6 = '' + this.funcSet;
					// 		this.num3 = '' + this.funcSet;
					// 		this.num3 = '' + this.funcSet;
					// 		this.up = '' + this.funcSet;
					// 		this.down = '' + this.funcSet;
					// 	}, 1000);
					// }
					this.num = 0
					this.num4 = 'round2' + this.funcSet;
					this.num5 = 'round2' + this.funcSet;
					this.num1 = 'round2' + this.funcSet;
					this.num2 = 'round2' + this.funcSet;
					this.num0 = 'round2' + this.funcSet;
					this.right = 'round2' + this.funcSet;
					this.pdown = 'round2_2' + this.funcSet;
					this.num7 = 'round2_2' + this.funcSet;
					this.num8 = 'round2_2' + this.funcSet;
					this.num6 = 'round2_2' + this.funcSet;
					this.num3 = 'round2_2' + this.funcSet
					this.num3 = 'round2_2' + this.funcSet;
					this.up = 'round2_2' + this.funcSet;
					this.down = 'round2_2' + this.funcSet;
				}
				break;

			case this.vKey == 98 && this.keyStatus == 1: //num2
				if (this.num == 0) {
					this.clear();
					// if (this.keyFlag1 == 0) {
					// 	this.keyFlag1 = 1
					// 	setTimeout(() => {
					// 		this.keyFlag1 = 0;
					// 		this.num5 = '' + this.funcSet;
					// 		this.num6 = '' + this.funcSet;
					// 		this.num1 = '' + this.funcSet;
					// 		this.num2 = '' + this.funcSet;
					// 		this.num3 = '' + this.funcSet;
					// 		this.num0 = '' + this.funcSet;
					// 		this.num7 = '' + this.funcSet;
					// 		this.num8 = '' + this.funcSet;
					// 		this.num9 = '' + this.funcSet;
					// 		this.num4 = '' + this.funcSet;
					// 		this.numdot = '' + this.funcSet;
					// 		this.numenter = '' + this.funcSet;
					// 		this.right = '' + this.funcSet;
					// 	}, 1000);
					// }
					this.num5 = 'round1' + this.funcSet;
					this.num6 = 'round1' + this.funcSet;
					this.num1 = 'round1' + this.funcSet;
					this.num2 = 'round1' + this.funcSet;
					this.num3 = 'round1' + this.funcSet;
					this.num0 = 'round1' + this.funcSet;
					this.num7 = 'round1_2' + this.funcSet;
					this.num8 = 'round1_2' + this.funcSet;
					this.num9 = 'round1_2' + this.funcSet;
					this.num4 = 'round1_2' + this.funcSet;
					this.numdot = 'round1_2' + this.funcSet;
					this.numenter = 'round1_2' + this.funcSet;
					this.right = 'round1_2' + this.funcSet;
					this.num = 1
				}
				else if (this.num == 1) {
					this.clear();
					// if (this.keyFlag2 == 0) {
					// 	this.keyFlag2 = 1
					// 	setTimeout(() => {
					// 		this.keyFlag2 = 0;
					// 		this.num5 = '' + this.funcSet;
					// 		this.num6 = '' + this.funcSet;
					// 		this.num1 = '' + this.funcSet;
					// 		this.num2 = '' + this.funcSet;
					// 		this.num3 = '' + this.funcSet;
					// 		this.num0 = '' + this.funcSet;
					// 		this.num7 = '' + this.funcSet;
					// 		this.num8 = '' + this.funcSet;
					// 		this.num9 = '' + this.funcSet;
					// 		this.num4 = '' + this.funcSet;
					// 		this.numdot = '' + this.funcSet;
					// 		this.numenter = '' + this.funcSet;
					// 		this.right = '' + this.funcSet;
					// 	}, 1000);
					// }
					this.num = 0
					this.num5 = 'round2' + this.funcSet;
					this.num6 = 'round2' + this.funcSet;
					this.num1 = 'round2' + this.funcSet;
					this.num2 = 'round2' + this.funcSet;
					this.num3 = 'round2' + this.funcSet;
					this.num0 = 'round2' + this.funcSet;
					this.num7 = 'round2_2' + this.funcSet;
					this.num8 = 'round2_2' + this.funcSet;
					this.num9 = 'round2_2' + this.funcSet;
					this.num4 = 'round2_2' + this.funcSet;
					this.numdot = 'round2_2' + this.funcSet;
					this.numenter = 'round2_2' + this.funcSet;
					this.right = 'round2_2' + this.funcSet;
				}
				break;

			case this.vKey == 99 && this.keyStatus == 1: //num3
				if (this.num == 0) {
					this.clear();
					// if (this.keyFlag1 == 0) {
					// 	this.keyFlag1 = 1
					// 	setTimeout(() => {
					// 		this.keyFlag1 = 0;
					// 		this.num6 = '' + this.funcSet;
					// 		this.num2 = '' + this.funcSet;
					// 		this.num3 = '' + this.funcSet;
					// 		this.numdot = '' + this.funcSet;
					// 		this.numenter = '' + this.funcSet;
					// 		this.num8 = '' + this.funcSet;
					// 		this.num9 = '' + this.funcSet;
					// 		this.numplus = '' + this.funcSet;
					// 		this.num4 = '' + this.funcSet;
					// 		this.num5 = '' + this.funcSet;
					// 		this.num1 = '' + this.funcSet;
					// 		this.num0 = '' + this.funcSet;
					// 	}, 1000);
					// }
					this.num6 = 'round1' + this.funcSet;
					this.num2 = 'round1' + this.funcSet;
					this.num3 = 'round1' + this.funcSet;
					this.numdot = 'round1' + this.funcSet;
					this.numenter = 'round1' + this.funcSet;
					this.num8 = 'round1_2' + this.funcSet;
					this.num9 = 'round1_2' + this.funcSet;
					this.numplus = 'round1_2' + this.funcSet;
					this.num4 = 'round1_2' + this.funcSet;
					this.num5 = 'round1_2' + this.funcSet;
					this.num1 = 'round1_2' + this.funcSet;
					this.num0 = 'round1_2' + this.funcSet;
					this.num = 1
				}
				else if (this.num == 1) {
					this.clear();
					// if (this.keyFlag2 == 0) {
					// 	this.keyFlag2 = 1
					// 	setTimeout(() => {
					// 		this.keyFlag2 = 0;
					// 		this.num6 = '' + this.funcSet;
					// 		this.num2 = '' + this.funcSet;
					// 		this.num3 = '' + this.funcSet;
					// 		this.numdot = '' + this.funcSet;
					// 		this.numenter = '' + this.funcSet;
					// 		this.num8 = '' + this.funcSet;
					// 		this.num9 = '' + this.funcSet;
					// 		this.numplus = '' + this.funcSet;
					// 		this.num4 = '' + this.funcSet;
					// 		this.num5 = '' + this.funcSet;
					// 		this.num1 = '' + this.funcSet;
					// 		this.num0 = '' + this.funcSet;
					// 	}, 1000);
					// }
					this.num = 0
					this.num6 = 'round2' + this.funcSet;
					this.num2 = 'round2' + this.funcSet;
					this.num3 = 'round2' + this.funcSet;
					this.numdot = 'round2' + this.funcSet;
					this.numenter = 'round2' + this.funcSet;
					this.num8 = 'round2_2' + this.funcSet;
					this.num9 = 'round2_2' + this.funcSet;
					this.numplus = 'round2_2' + this.funcSet;
					this.num4 = 'round2_2' + this.funcSet;
					this.num5 = 'round2_2' + this.funcSet;
					this.num1 = 'round2_2' + this.funcSet;
					this.num0 = 'round2_2' + this.funcSet;
				}
				break;


			case this.vKey == 'num13' && this.keyStatus == 1: //numenter
				if (this.num == 0) {
					this.clear();
					// if (this.keyFlag1 == 0) {
					// 	this.keyFlag1 = 1
					// 	setTimeout(() => {
					// 		this.keyFlag1 = 0;
					// 		this.num3 = '' + this.funcSet;
					// 		this.numdot = '' + this.funcSet;
					// 		this.numenter = '' + this.funcSet;
					// 		this.num9 = '' + this.funcSet;
					// 		this.numplus = '' + this.funcSet;
					// 		this.num6 = '' + this.funcSet;
					// 		this.num5 = '' + this.funcSet;
					// 		this.num2 = '' + this.funcSet;
					// 	}, 1000);
					// }
					this.num3 = 'round1' + this.funcSet;
					this.numdot = 'round1' + this.funcSet;
					this.numenter = 'round1' + this.funcSet;
					this.num9 = 'round1_2' + this.funcSet;
					this.numplus = 'round1_2' + this.funcSet;
					this.num6 = 'round1_2' + this.funcSet;
					this.num5 = 'round1_2' + this.funcSet;
					this.num2 = 'round1_2' + this.funcSet;
					this.num = 1
				}
				else if (this.num == 1) {
					this.clear();
					// if (this.keyFlag2 == 0) {
					// 	this.keyFlag2 = 1
					// 	setTimeout(() => {
					// 		this.keyFlag2 = 0;
					// 		this.num3 = '' + this.funcSet;
					// 		this.numdot = '' + this.funcSet;
					// 		this.numenter = '' + this.funcSet;
					// 		this.num9 = '' + this.funcSet;
					// 		this.numplus = '' + this.funcSet;
					// 		this.num6 = '' + this.funcSet;
					// 		this.num5 = '' + this.funcSet;
					// 		this.num2 = '' + this.funcSet;
					// 	}, 1000);
					// }
					this.num = 0
					this.num3 = 'round2' + this.funcSet;
					this.numdot = 'round2' + this.funcSet;
					this.numenter = 'round2' + this.funcSet;
					this.num9 = 'round2_2' + this.funcSet;
					this.numplus = 'round2_2' + this.funcSet;
					this.num6 = 'round2_2' + this.funcSet;
					this.num5 = 'round2_2' + this.funcSet;
					this.num2 = 'round2_2' + this.funcSet;
				}
				break;
			case this.vKey == 'l17' && this.keyStatus == 1: //lctrl
				if (this.num == 0) {
					this.clear();
					// if (this.keyFlag1 == 0) {
					// 	this.keyFlag1 = 1
					// 	setTimeout(() => {
					// 		this.keyFlag1 = 0;
					// 		this.lctrl = '' + this.funcSet;
					// 		this.lshift = '' + this.funcSet;
					// 		this.win = '' + this.funcSet;
					// 		this.caps = '' + this.funcSet;
					// 		this.a = '' + this.funcSet;
					// 		this.z = '' + this.funcSet;
					// 		this.lalt = '' + this.funcSet;
					// 	}, 1000);
					// }
					this.lctrl = 'round1' + this.funcSet;
					this.lshift = 'round1' + this.funcSet;
					this.win = 'round1' + this.funcSet;
					this.caps = 'round1_2' + this.funcSet;
					this.a = 'round1_2' + this.funcSet;
					this.z = 'round1_2' + this.funcSet;
					this.lalt = 'round1_2' + this.funcSet;
					this.num = 1
				}
				else if (this.num == 1) {
					this.clear();
					// if (this.keyFlag2 == 0) {
					// 	this.keyFlag2 = 1
					// 	setTimeout(() => {
					// 		this.keyFlag2 = 0;
					// 		this.lctrl = '' + this.funcSet;
					// 		this.lshift = '' + this.funcSet;
					// 		this.win = '' + this.funcSet;
					// 		this.caps = '' + this.funcSet;
					// 		this.a = '' + this.funcSet;
					// 		this.z = '' + this.funcSet;
					// 		this.lalt = '' + this.funcSet;
					// 	}, 1000);
					// }
					this.num = 0
					this.lctrl = 'round2' + this.funcSet;
					this.lshift = 'round2' + this.funcSet;
					this.win = 'round2' + this.funcSet;
					this.caps = 'round2_2' + this.funcSet;
					this.a = 'round2_2' + this.funcSet;
					this.z = 'round2_2' + this.funcSet;
					this.lalt = 'round2_2' + this.funcSet;
				}
				break;

			case this.vKey == 91 && this.keyStatus == 1: //win
				if (this.num == 0) {
					this.clear();
					// if (this.keyFlag1 == 0) {
					// 	this.keyFlag1 = 1
					// 	setTimeout(() => {
					// 		this.keyFlag1 = 0;
					// 		this.lctrl = '' + this.funcSet;
					// 		this.win = '' + this.funcSet;
					// 		this.z = '' + this.funcSet;
					// 		this.lalt = '' + this.funcSet;
					// 		this.caps = '' + this.funcSet;
					// 		this.a = '' + this.funcSet;
					// 		this.s = '' + this.funcSet;
					// 		this.lshift = '' + this.funcSet;
					// 		this.x = '' + this.funcSet;
					// 	}, 1000);
					// }
					this.lctrl = 'round1' + this.funcSet;
					this.win = 'round1' + this.funcSet;
					this.z = 'round1' + this.funcSet;
					this.lalt = 'round1' + this.funcSet;
					this.caps = 'round1_2' + this.funcSet;
					this.a = 'round1_2' + this.funcSet;
					this.s = 'round1_2' + this.funcSet;
					this.lshift = 'round1_2' + this.funcSet;
					this.x = 'round1_2' + this.funcSet;
					this.num = 1
				}
				else if (this.num == 1) {
					this.clear();
					// if (this.keyFlag2 == 0) {
					// 	this.keyFlag2 = 1
					// 	setTimeout(() => {
					// 		this.keyFlag2 = 0;
					// 		this.lctrl = '' + this.funcSet;
					// 		this.win = '' + this.funcSet;
					// 		this.z = '' + this.funcSet;
					// 		this.lalt = '' + this.funcSet;
					// 		this.caps = '' + this.funcSet;
					// 		this.a = '' + this.funcSet;
					// 		this.s = '' + this.funcSet;
					// 		this.lshift = '' + this.funcSet;
					// 		this.x = '' + this.funcSet;
					// 	}, 1000);
					// }
					this.num = 0
					this.lctrl = 'round2' + this.funcSet;
					this.win = 'round2' + this.funcSet;
					this.z = 'round2' + this.funcSet;
					this.lalt = 'round2' + this.funcSet;
					this.caps = 'round2_2' + this.funcSet;
					this.a = 'round2_2' + this.funcSet;
					this.s = 'round2_2' + this.funcSet;
					this.lshift = 'round2_2' + this.funcSet;
					this.x = 'round2_2' + this.funcSet;
				}
				break;

			case this.vKey == 'l18' && this.keyStatus == 1: //lalt
				if (this.num == 0) {
					this.clear();
					// if (this.keyFlag1 == 0) {
					// 	this.keyFlag1 = 1
					// 	setTimeout(() => {
					// 		this.keyFlag1 = 0;
					// 		this.z = '' + this.funcSet;
					// 		this.x = '' + this.funcSet;
					// 		this.win = '' + this.funcSet;
					// 		this.lalt = '' + this.funcSet;
					// 		this.a = '' + this.funcSet;
					// 		this.s = '' + this.funcSet;
					// 		this.d = '' + this.funcSet;
					// 		this.lshift = '' + this.funcSet;
					// 		this.c = '' + this.funcSet;
					// 		this.lctrl = '' + this.funcSet;
					// 	}, 1000);
					// }
					this.z = 'round1' + this.funcSet;
					this.x = 'round1' + this.funcSet;
					this.win = 'round1' + this.funcSet;
					this.lalt = 'round1' + this.funcSet;
					this.a = 'round1_2' + this.funcSet;
					this.s = 'round1_2' + this.funcSet;
					this.d = 'round1_2' + this.funcSet;
					this.lshift = 'round1_2' + this.funcSet;
					this.c = 'round1_2' + this.funcSet;
					this.lctrl = 'round1_2' + this.funcSet;
					this.num = 1
				}
				else if (this.num == 1) {
					this.clear();
					// if (this.keyFlag2 == 0) {
					// 	this.keyFlag2 = 1
					// 	setTimeout(() => {
					// 		this.keyFlag2 = 0;
					// 		this.z = '' + this.funcSet;
					// 		this.x = '' + this.funcSet;
					// 		this.win = '' + this.funcSet;
					// 		this.lalt = '' + this.funcSet;
					// 		this.a = '' + this.funcSet;
					// 		this.s = '' + this.funcSet;
					// 		this.d = '' + this.funcSet;
					// 		this.lshift = '' + this.funcSet;
					// 		this.c = '' + this.funcSet;
					// 		this.lctrl = '' + this.funcSet;
					// 	}, 1000);
					// }
					this.num = 0
					this.z = 'round2' + this.funcSet;
					this.x = 'round2' + this.funcSet;
					this.win = 'round2' + this.funcSet;
					this.lalt = 'round2' + this.funcSet;
					this.a = 'round2_2' + this.funcSet;
					this.s = 'round2_2' + this.funcSet;
					this.d = 'round2_2' + this.funcSet;
					this.lshift = 'round2_2' + this.funcSet;
					this.c = 'round2_2' + this.funcSet;
					this.lctrl = 'round2_2' + this.funcSet;
				}
				break;

			case this.vKey == 32 && this.keyStatus == 1: //space
				if (this.num == 0) {
					this.clear();
					// if (this.keyFlag1 == 0) {
					// 	this.keyFlag1 = 1
					// 	setTimeout(() => {
					// 		this.keyFlag1 = 0;
					// 		this.n = '' + this.funcSet;
					// 		this.b = '' + this.funcSet;
					// 		this.space = '' + this.funcSet;
					// 		this.g = '' + this.funcSet;
					// 		this.h = '' + this.funcSet;
					// 		this.j = '' + this.funcSet;
					// 		this.c = '' + this.funcSet;
					// 		this.v = '' + this.funcSet;
					// 		this.m = '' + this.funcSet;
					// 	}, 1000);
					// }
					this.n = 'round1' + this.funcSet;
					this.b = 'round1' + this.funcSet;
					this.space = 'round1' + this.funcSet;
					this.g = 'round1_2' + this.funcSet;
					this.h = 'round1_2' + this.funcSet;
					this.j = 'round1_2' + this.funcSet;
					this.c = 'round1_2' + this.funcSet;
					this.v = 'round1_2' + this.funcSet;
					this.m = 'round1_2' + this.funcSet;
					this.num = 1
				}
				else if (this.num == 1) {
					this.clear();
					// if (this.keyFlag2 == 0) {
					// 	this.keyFlag2 = 1
					// 	setTimeout(() => {
					// 		this.keyFlag2 = 0;
					// 		this.n = '' + this.funcSet;
					// 		this.b = '' + this.funcSet;
					// 		this.space = '' + this.funcSet;
					// 		this.g = '' + this.funcSet;
					// 		this.h = '' + this.funcSet;
					// 		this.j = '' + this.funcSet;
					// 		this.c = '' + this.funcSet;
					// 		this.v = '' + this.funcSet;
					// 		this.m = '' + this.funcSet;
					// 	}, 1000);
					// }
					this.num = 0
					this.n = 'round2' + this.funcSet;
					this.b = 'round2' + this.funcSet;
					this.space = 'round2' + this.funcSet;
					this.g = 'round2_2' + this.funcSet;
					this.h = 'round2_2' + this.funcSet;
					this.j = 'round2_2' + this.funcSet;
					this.c = 'round2_2' + this.funcSet;
					this.v = 'round2_2' + this.funcSet;
					this.m = 'round2_2' + this.funcSet;
				}
				break;

			case this.vKey == 'r18' && this.keyStatus == 1: //ralt
				if (this.num == 0) {
					this.clear();
					// if (this.keyFlag1 == 0) {
					// 	this.keyFlag1 = 1
					// 	setTimeout(() => {
					// 		this.keyFlag1 = 0;
					// 		this.dot = '' + this.funcSet;
					// 		this.qmark = '' + this.funcSet;
					// 		this.ralt = '' + this.funcSet;
					// 		this.fn = '' + this.funcSet;
					// 		this.l = '' + this.funcSet;
					// 		this.sem = '' + this.funcSet;
					// 		this.quo = '' + this.funcSet;
					// 		this.m = '' + this.funcSet;
					// 		this.comma = '' + this.funcSet;
					// 		this.book = '' + this.funcSet;
					// 	}, 1000);
					// }
					this.dot = 'round1' + this.funcSet;
					this.qmark = 'round1' + this.funcSet;
					this.ralt = 'round1' + this.funcSet;
					this.fn = 'round1' + this.funcSet;
					this.l = 'round1_2' + this.funcSet;
					this.sem = 'round1_2' + this.funcSet;
					this.quo = 'round1_2' + this.funcSet;
					this.m = 'round1_2' + this.funcSet;
					this.comma = 'round1_2' + this.funcSet;
					this.book = 'round1_2' + this.funcSet;
					this.num = 1
				}
				else if (this.num == 1) {
					this.clear();
					// if (this.keyFlag2 == 0) {
					// 	this.keyFlag2 = 1
					// 	setTimeout(() => {
					// 		this.keyFlag2 = 0;
					// 		this.dot = '' + this.funcSet;
					// 		this.qmark = '' + this.funcSet;
					// 		this.ralt = '' + this.funcSet;
					// 		this.fn = '' + this.funcSet;
					// 		this.l = '' + this.funcSet;
					// 		this.sem = '' + this.funcSet;
					// 		this.quo = '' + this.funcSet;
					// 		this.m = '' + this.funcSet;
					// 		this.comma = '' + this.funcSet;
					// 		this.book = '' + this.funcSet;
					// 	}, 1000);
					// }
					this.num = 0
					this.dot = 'round2' + this.funcSet;
					this.qmark = 'round2' + this.funcSet;
					this.ralt = 'round2' + this.funcSet;
					this.fn = 'round2' + this.funcSet;
					this.l = 'round2_2' + this.funcSet;
					this.sem = 'round2_2' + this.funcSet;
					this.quo = 'round2_2' + this.funcSet;
					this.m = 'round2_2' + this.funcSet;
					this.comma = 'round2_2' + this.funcSet;
					this.book = 'round2_2' + this.funcSet;
				}
				break;

			case this.vKey == 93 && this.keyStatus == 1: //book
				if (this.num == 0) {
					this.clear();
					// if (this.keyFlag1 == 0) {
					// 	this.keyFlag1 = 1
					// 	setTimeout(() => {
					// 		this.keyFlag1 = 0;
					// 		this.book = '' + this.funcSet;
					// 		this.rshift = '' + this.funcSet;
					// 		this.rctrl = '' + this.funcSet;
					// 		this.fn = '' + this.funcSet;
					// 		this.quo = '' + this.funcSet;
					// 		this.enter = '' + this.funcSet;
					// 		this.dot = '' + this.funcSet;
					// 		this.qmark = '' + this.funcSet;
					// 		this.ralt = '' + this.funcSet;
					// 		this.rctrl = '' + this.funcSet;
					// 	}, 1000);
					// }
					this.book = 'round1' + this.funcSet;
					this.rshift = 'round1' + this.funcSet;
					this.rctrl = 'round1' + this.funcSet;
					this.fn = 'round1' + this.funcSet;
					this.quo = 'round1_2' + this.funcSet;
					this.enter = 'round1_2' + this.funcSet;
					this.dot = 'round1_2' + this.funcSet;
					this.qmark = 'round1_2' + this.funcSet;
					this.ralt = 'round1_2' + this.funcSet;
					this.rctrl = 'round1_2' + this.funcSet;
					this.num = 1
				}
				else if (this.num == 1) {
					this.clear();
					// if (this.keyFlag2 == 0) {
					// 	this.keyFlag2 = 1
					// 	setTimeout(() => {
					// 		this.keyFlag2 = 0;
					// 		this.book = '' + this.funcSet;
					// 		this.rshift = '' + this.funcSet;
					// 		this.rctrl = '' + this.funcSet;
					// 		this.fn = '' + this.funcSet;
					// 		this.quo = '' + this.funcSet;
					// 		this.enter = '' + this.funcSet;
					// 		this.dot = '' + this.funcSet;
					// 		this.qmark = '' + this.funcSet;
					// 		this.ralt = '' + this.funcSet;
					// 		this.rctrl = '' + this.funcSet;
					// 	}, 1000);
					// }
					this.num = 0
					this.book = 'round2' + this.funcSet;
					this.rshift = 'round2' + this.funcSet;
					this.rctrl = 'round2' + this.funcSet;
					this.fn = 'round2' + this.funcSet;
					this.quo = 'round2_2' + this.funcSet;
					this.enter = 'round2_2' + this.funcSet;
					this.dot = 'round2_2' + this.funcSet;
					this.qmark = 'round2_2' + this.funcSet;
					this.ralt = 'round2_2' + this.funcSet;
					this.rctrl = 'round2_2' + this.funcSet;
				}
				break;

			case this.vKey == 'r17' && this.keyStatus == 1: //rctrl
				if (this.num == 0) {
					this.clear();
					// if (this.keyFlag1 == 0) {
					// 	this.keyFlag1 = 1
					// 	setTimeout(() => {
					// 		this.keyFlag1 = 0;
					// 		this.book = '' + this.funcSet;
					// 		this.rshift = '' + this.funcSet;
					// 		this.rctrl = '' + this.funcSet;
					// 		this.enter = 'round1_2' + this.funcSet;
					// 		this.qmark = 'round1_2' + this.funcSet;
					// 		this.fn = 'round1_2' + this.funcSet;
					// 	}, 1000);
					// }
					this.book = 'round1' + this.funcSet;
					this.rshift = 'round1' + this.funcSet;
					this.rctrl = 'round1' + this.funcSet;
					this.enter = 'round1_2' + this.funcSet;
					this.qmark = 'round1_2' + this.funcSet;
					this.fn = 'round1_2' + this.funcSet;
					this.num = 1
				}
				else if (this.num == 1) {
					this.clear();
					// if (this.keyFlag2 == 0) {
					// 	this.keyFlag2 = 1
					// 	setTimeout(() => {
					// 		this.keyFlag2 = 0;
					// 		this.book = '' + this.funcSet;
					// 		this.rshift = '' + this.funcSet;
					// 		this.rctrl = '' + this.funcSet;
					// 		this.enter = '' + this.funcSet;
					// 		this.qmark = '' + this.funcSet;
					// 		this.fn = '' + this.funcSet;
					// 	}, 1000);
					// }
					this.num = 0
					this.book = 'round2' + this.funcSet;
					this.rshift = 'round2' + this.funcSet;
					this.rctrl = 'round2' + this.funcSet;
					this.enter = 'round2_2' + this.funcSet;
					this.qmark = 'round2_2' + this.funcSet;
					this.fn = 'round2_2' + this.funcSet;
				}
				break;

			case this.vKey == 37 && this.keyStatus == 1: //left
				if (this.num == 0) {
					this.clear();
					// if (this.keyFlag1 == 0) {
					// 	this.keyFlag1 = 1
					// 	setTimeout(() => {
					// 		this.keyFlag1 = 0;
					// 		this.left = '' + this.funcSet;
					// 		this.up = '' + this.funcSet;
					// 		this.down = '' + this.funcSet;
					// 		this.rshift = '' + this.funcSet;
					// 		this.rctrl = '' + this.funcSet;
					// 		this.right = '' + this.funcSet
					// 	}, 1000);
					// }
					this.left = 'round1' + this.funcSet;
					this.up = 'round1' + this.funcSet;
					this.down = 'round1' + this.funcSet;
					this.rshift = 'round1_2' + this.funcSet;
					this.rctrl = 'round1_2' + this.funcSet;
					this.right = 'round1_2' + this.funcSet
					this.num = 1
				}
				else if (this.num == 1) {
					this.clear();
					// if (this.keyFlag2 == 0) {
					// 	this.keyFlag2 = 1
					// 	setTimeout(() => {
					// 		this.keyFlag2 = 0;
					// 		this.left = '' + this.funcSet;
					// 		this.up = '' + this.funcSet;
					// 		this.down = '' + this.funcSet;
					// 		this.rshift = '' + this.funcSet;
					// 		this.rctrl = '' + this.funcSet;
					// 		this.right = '' + this.funcSet
					// 	}, 1000);
					// }
					this.num = 0
					this.left = 'round2' + this.funcSet;
					this.up = 'round2' + this.funcSet;
					this.down = 'round2' + this.funcSet;
					this.rshift = 'round2_2' + this.funcSet;
					this.rctrl = 'round2_2' + this.funcSet;
					this.right = 'round2_2' + this.funcSet
				}
				break;

			case this.vKey == 40 && this.keyStatus == 1: //down
				if (this.num == 0) {
					this.clear();
					// if (this.keyFlag1 == 0) {
					// 	this.keyFlag1 = 1
					// 	setTimeout(() => {
					// 		this.keyFlag1 = 0;
					// 		this.up = '' + this.funcSet;
					// 		this.left = '' + this.funcSet;
					// 		this.down = '' + this.funcSet;
					// 		this.right = '' + this.funcSet;
					// 		this.num1 = 'round1_2' + this.funcSet;
					// 		this.num0 = 'round1_2' + this.funcSet;
					// 	}, 1000);
					// }
					this.up = 'round1' + this.funcSet;
					this.left = 'round1' + this.funcSet;
					this.down = 'round1' + this.funcSet;
					this.right = 'round1' + this.funcSet;
					this.num1 = 'round1_2' + this.funcSet;
					this.num0 = 'round1_2' + this.funcSet;
					this.num = 1
				}
				else if (this.num == 1) {
					this.clear();
					// if (this.keyFlag2 == 0) {
					// 	this.keyFlag2 = 1
					// 	setTimeout(() => {
					// 		this.keyFlag2 = 0;
					// 		this.up = '' + this.funcSet;
					// 		this.left = '' + this.funcSet;
					// 		this.down = '' + this.funcSet;
					// 		this.right = '' + this.funcSet;
					// 		this.num1 = '' + this.funcSet;
					// 		this.num0 = '' + this.funcSet;
					// 	}, 1000);
					// }
					this.num = 0
					this.up = 'round2' + this.funcSet;
					this.left = 'round2' + this.funcSet;
					this.down = 'round2' + this.funcSet;
					this.right = 'round2' + this.funcSet;
					this.num1 = 'round1' + this.funcSet;
					this.num1 = 'round2_2' + this.funcSet;
					this.num0 = 'round2_2' + this.funcSet;
				}
				break;

			case this.vKey == 39 && this.keyStatus == 1: //right
				if (this.num == 0) {
					this.clear();
					// if (this.keyFlag1 == 0) {
					// 	this.keyFlag1 = 1
					// 	setTimeout(() => {
					// 		this.keyFlag1 = 0;
					// 		this.up = '' + this.funcSet;
					// 		this.down = '' + this.funcSet;
					// 		this.right = '' + this.funcSet;
					// 		this.num0 = '' + this.funcSet;
					// 		this.num1 = '' + this.funcSet;
					// 		this.left = '' + this.funcSet;
					// 		this.num4 = '' + this.funcSet;
					// 		this.num2 = '' + this.funcSet;
					// 	}, 1000);
					// }
					this.up = 'round1' + this.funcSet;
					this.down = 'round1' + this.funcSet;
					this.right = 'round1' + this.funcSet;
					this.num0 = 'round1' + this.funcSet;
					this.num1 = 'round1' + this.funcSet;
					this.left = 'round1_2' + this.funcSet;
					this.num4 = 'round1_2' + this.funcSet;
					this.num2 = 'round1_2' + this.funcSet;
					this.num = 1
				}
				else if (this.num == 1) {
					this.clear();
					// if (this.keyFlag2 == 0) {
					// 	this.keyFlag2 = 1
					// 	setTimeout(() => {
					// 		this.keyFlag2 = 0;
					// 		this.up = '' + this.funcSet;
					// 		this.down = '' + this.funcSet;
					// 		this.right = '' + this.funcSet;
					// 		this.num0 = '' + this.funcSet;
					// 		this.num1 = '' + this.funcSet;
					// 		this.left = '' + this.funcSet;
					// 		this.num4 = '' + this.funcSet;
					// 		this.num2 = '' + this.funcSet;
					// 	}, 1000);
					// }
					this.num = 0
					this.up = 'round2' + this.funcSet;
					this.down = 'round2' + this.funcSet;
					this.right = 'round2' + this.funcSet;
					this.num0 = 'round2' + this.funcSet;
					this.num1 = 'round2' + this.funcSet;
					this.left = 'round2_2' + this.funcSet;
					this.num4 = 'round2_2' + this.funcSet;
					this.num2 = 'round2_2' + this.funcSet;
				}
				break;

			case this.vKey == 96 && this.keyStatus == 1: //num0
				if (this.num == 0) {
					this.clear();
					// if (this.keyFlag1 == 0) {
					// 	this.keyFlag1 = 1
					// 	setTimeout(() => {
					// 		this.keyFlag1 = 0;
					// 		this.num1 = '' + this.funcSet;
					// 		this.num2 = '' + this.funcSet;
					// 		this.right = '' + this.funcSet;
					// 		this.num0 = '' + this.funcSet;
					// 		this.up = '' + this.funcSet;
					// 		this.down = '' + this.funcSet;
					// 		this.num4 = '' + this.funcSet;
					// 		this.num5 = '' + this.funcSet;
					// 		this.num3 = '' + this.funcSet;
					// 		this.numdot = '' + this.funcSet;
					// 	}, 1000);
					// }
					this.num1 = 'round1' + this.funcSet;
					this.num2 = 'round1' + this.funcSet;
					this.right = 'round1' + this.funcSet;
					this.num0 = 'round1' + this.funcSet;
					this.up = 'round1_2' + this.funcSet;
					this.down = 'round1_2' + this.funcSet;
					this.num4 = 'round1_2' + this.funcSet;
					this.num5 = 'round1_2' + this.funcSet;
					this.num3 = 'round1_2' + this.funcSet;
					this.numdot = 'round1_2' + this.funcSet;
					this.num = 1
				}
				else if (this.num == 1) {
					this.clear();
					// if (this.keyFlag2 == 0) {
					// 	this.keyFlag2 = 1
					// 	setTimeout(() => {
					// 		this.keyFlag2 = 0;
					// 		this.num1 = '' + this.funcSet;
					// 		this.num2 = '' + this.funcSet;
					// 		this.right = '' + this.funcSet;
					// 		this.num0 = '' + this.funcSet;
					// 		this.up = '' + this.funcSet;
					// 		this.down = '' + this.funcSet;
					// 		this.num4 = '' + this.funcSet;
					// 		this.num5 = '' + this.funcSet;
					// 		this.num3 = '' + this.funcSet;
					// 		this.numdot = '' + this.funcSet;
					// 	}, 1000);
					// }
					this.num = 0
					this.num1 = 'round2' + this.funcSet;
					this.num2 = 'round2' + this.funcSet;
					this.right = 'round2' + this.funcSet;
					this.num0 = 'round2' + this.funcSet;
					this.up = 'round2_2' + this.funcSet;
					this.down = 'round2_2' + this.funcSet;
					this.num4 = 'round2_2' + this.funcSet;
					this.num5 = 'round2_2' + this.funcSet;
					this.num3 = 'round2_2' + this.funcSet;
					this.numdot = 'round2_2' + this.funcSet;
				}
				break;

			case this.vKey == 110 && this.keyStatus == 1: //numdot
				if (this.num == 0) {
					this.clear();
					// if (this.keyFlag1 == 0) {
					// 	this.keyFlag1 = 1
					// 	setTimeout(() => {
					// 		this.keyFlag1 = 0;
					// 		this.numenter = '' + this.funcSet;
					// 		this.num3 = '' + this.funcSet;
					// 		this.num5 = '' + this.funcSet;
					// 		this.num6 = '' + this.funcSet;
					// 		this.num1 = '' + this.funcSet;
					// 		this.num2 = '' + this.funcSet;
					// 		this.num0 = '' + this.funcSet;
					// 	}, 1000);
					// }
					this.numenter = 'round1' + this.funcSet;
					this.num3 = 'round1' + this.funcSet;
					this.num5 = 'round1_2' + this.funcSet;
					this.num6 = 'round1_2' + this.funcSet;
					this.num1 = 'round1_2' + this.funcSet;
					this.num2 = 'round1_2' + this.funcSet;
					this.num0 = 'round1_2' + this.funcSet;
					this.num = 1
				}
				else if (this.num == 1) {
					this.clear();
					// if (this.keyFlag2 == 0) {
					// 	this.keyFlag2 = 1
					// 	setTimeout(() => {
					// 		this.keyFlag2 = 0;
					// 		this.numenter = '' + this.funcSet;
					// 		this.num3 = '' + this.funcSet;
					// 		this.num5 = '' + this.funcSet;
					// 		this.num6 = '' + this.funcSet;
					// 		this.num1 = '' + this.funcSet;
					// 		this.num2 = '' + this.funcSet;
					// 		this.num0 = '' + this.funcSet;
					// 	}, 1000);
					// }
					this.num = 0
					this.numenter = 'round2' + this.funcSet;
					this.num3 = 'round2' + this.funcSet;
					this.num5 = 'round2_2' + this.funcSet;
					this.num6 = 'round2_2' + this.funcSet;
					this.num1 = 'round2_2' + this.funcSet;
					this.num2 = 'round2_2' + this.funcSet;
					this.num0 = 'round2_2' + this.funcSet;
				}
				break;
			case this.vKey == 44:
				if (this.num == 0) {
					this.clear();
					// if (this.keyFlag1 == 0) {
					// 	this.keyFlag1 = 1
					// 	setTimeout(() => {
					// 		this.keyFlag1 = 0;
					// 		this.print = '' + this.funcSet;
					// 		this.f12 = '' + this.funcSet;
					// 		this.bsp = '' + this.funcSet;
					// 		this.insert = '' + this.funcSet;
					// 		this.scroll = '' + this.funcSet;
					// 		this.Upside14 = '' + this.funcSet;
					// 		this.Upside15 = '' + this.funcSet;
					// 		this.Upside12 = '' + this.funcSet;
					// 		this.Upside13 = '' + this.funcSet;
					// 		this.Upside16 = '' + this.funcSet;
					// 		this.f11 = '' + this.funcSet;
					// 		this.pause = '' + this.funcSet;
					// 		this.home = '' + this.funcSet;
					// 		this.end = '' + this.funcSet;
					// 		this.delete = '' + this.funcSet;
					// 	}, 1000);
					// }
					this.print = 'round1' + this.funcSet;
					this.f12 = 'round1' + this.funcSet;
					this.bsp = 'round1' + this.funcSet;
					this.insert = 'round1' + this.funcSet;
					this.scroll = 'round1' + this.funcSet;
					this.Upside14 = 'round1' + this.funcSet;
					this.Upside15 = 'round1' + this.funcSet;
					this.Upside12 = 'round1_2' + this.funcSet;
					this.Upside13 = 'round1_2' + this.funcSet;
					this.Upside16 = 'round1_2' + this.funcSet;
					this.f11 = 'round1_2' + this.funcSet;
					this.pause = 'round1_2' + this.funcSet;
					this.home = 'round1_2' + this.funcSet;
					this.end = 'round1_2' + this.funcSet;
					this.delete = 'round1_2' + this.funcSet;
				}
				else if (this.num == 1) {
					this.clear();
					// if (this.keyFlag1 == 0) {
					// 	this.keyFlag1 = 1
					// 	setTimeout(() => {
					// 		this.keyFlag1 = 0;
					// 		this.print = '' + this.funcSet;
					// 		this.f12 = '' + this.funcSet;
					// 		this.bsp = '' + this.funcSet;
					// 		this.insert = '' + this.funcSet;
					// 		this.scroll = '' + this.funcSet;
					// 		this.Upside14 = '' + this.funcSet;
					// 		this.Upside15 = '' + this.funcSet;
					// 		this.Upside12 = '' + this.funcSet;
					// 		this.Upside13 = '' + this.funcSet;
					// 		this.Upside16 = '' + this.funcSet;
					// 		this.f11 = '' + this.funcSet;
					// 		this.pause = '' + this.funcSet;
					// 		this.home = '' + this.funcSet;
					// 		this.end = '' + this.funcSet;
					// 		this.delete = '' + this.funcSet;
					// 	}, 1000);
					// }
					this.print = 'round2' + this.funcSet;
					this.f12 = 'round2' + this.funcSet;
					this.bsp = 'round2' + this.funcSet;
					this.insert = 'round2' + this.funcSet;
					this.scroll = 'round2' + this.funcSet;
					this.Upside14 = 'round2' + this.funcSet;
					this.Upside15 = 'round2' + this.funcSet;
					this.Upside12 = 'round2_2' + this.funcSet;
					this.Upside13 = 'round2_2' + this.funcSet;
					this.Upside16 = 'round2_2' + this.funcSet;
					this.f11 = 'round2_2' + this.funcSet;
					this.pause = 'round2_2' + this.funcSet;
					this.home = 'round2_2' + this.funcSet;
					this.end = 'round2_2' + this.funcSet;
					this.delete = 'round2_2' + this.funcSet;
				}
				break;
			default:
				break;
		}
	}


	round_med() {
		this.getColor1();
		this.thelastEffect = this.round_med;
	}

	round_high() {
		this.getColor1();
		this.thelastEffect = this.round_high;
	}

	round_slow() {
		this.getColor1();
		this.thelastEffect = this.round_slow;
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
			this.getRuleround1();
			this.getRuleround2();
			this.detectEffectChange();
		} else {
			return false;
		}
	}

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
			this.getRuleround1();
		}
		if (whichcolor == 2) {
			this.desideclrCss = {
				R: "ff",
				G: "3f",
				B: "00"
			};

			// this.pure_orange();
			this.defaultclr = "#" + (this.desideclrCss.R + this.desideclrCss.G + this.desideclrCss.B);
			this.getRuleround1();
		}
		if (whichcolor == 3) {
			this.desideclrCss = {
				R: "ff",
				G: "bf",
				B: "00"
			};
			// this.pure_yellow();
			this.defaultclr = "#" + (this.desideclrCss.R + this.desideclrCss.G + this.desideclrCss.B);
			this.getRuleround1();
		}
		if (whichcolor == 4) {
			this.desideclrCss = {
				R: "7f",
				G: "ff",
				B: "00"
			};

			// this.pure_green();
			this.defaultclr = "#" + (this.desideclrCss.R + this.desideclrCss.G + this.desideclrCss.B);
			this.getRuleround1();
		}
		if (whichcolor == 5) {
			this.desideclrCss = {
				R: "00",
				G: "ff",
				B: "ff"
			};

			// this.pure_lightblue();
			this.defaultclr = "#" + (this.desideclrCss.R + this.desideclrCss.G + this.desideclrCss.B);
			this.getRuleround1();
		}
		if (whichcolor == 6) {
			this.desideclrCss = {
				R: "00",
				G: "7f",
				B: "ff"
			};

			// this.pure_blue();
			this.defaultclr = "#" + (this.desideclrCss.R + this.desideclrCss.G + this.desideclrCss.B);
			this.getRuleround1();
		}
		if (whichcolor == 7) {
			this.desideclrCss = {
				R: "64",
				G: "00",
				B: "ff"
			};
			// this.pure_darkblue();
			this.defaultclr = "#" + (this.desideclrCss.R + this.desideclrCss.G + this.desideclrCss.B);
			this.getRuleround1();
		}
		if (whichcolor == 8) {
			this.desideclrCss = {
				R: "af",
				G: "26",
				B: "ff"
			};
			// this.pure_purple();
			this.defaultclr = "#" + (this.desideclrCss.R + this.desideclrCss.G + this.desideclrCss.B);
			this.getRuleround1();
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
			this.getRuleround2();
		}
		if (whichcolor == 2) {
			this.desideclrCss02 = {
				R: "ff",
				G: "3f",
				B: "00"
			};
			// this.pure_orange();
			this.defaultclr02 = "#" + (this.desideclrCss02.R + this.desideclrCss02.G + this.desideclrCss02.B);
			this.getRuleround2();
		}
		if (whichcolor == 3) {
			this.desideclrCss02 = {
				R: "ff",
				G: "bf",
				B: "00"
			};
			// this.pure_yellow();
			this.defaultclr02 = "#" + (this.desideclrCss02.R + this.desideclrCss02.G + this.desideclrCss02.B);
			this.getRuleround2();
		}
		if (whichcolor == 4) {
			this.desideclrCss02 = {
				R: "7f",
				G: "ff",
				B: "00"
			};
			// this.pure_green();
			this.defaultclr02 = "#" + (this.desideclrCss02.R + this.desideclrCss02.G + this.desideclrCss02.B);
			this.getRuleround2();
		}
		if (whichcolor == 5) {
			this.desideclrCss02 = {
				R: "00",
				G: "ff",
				B: "ff"
			};
			// this.pure_lightblue();
			this.defaultclr02 = "#" + (this.desideclrCss02.R + this.desideclrCss02.G + this.desideclrCss02.B);
			this.getRuleround2();
		}
		if (whichcolor == 6) {
			this.desideclrCss02 = {
				R: "00",
				G: "7f",
				B: "ff"
			};
			// this.pure_blue();
			this.defaultclr02 = "#" + (this.desideclrCss02.R + this.desideclrCss02.G + this.desideclrCss02.B);
			this.getRuleround2();
		}
		if (whichcolor == 7) {
			this.desideclrCss02 = {
				R: "64",
				G: "00",
				B: "ff"
			};
			// this.pure_darkblue();
			this.defaultclr02 = "#" + (this.desideclrCss02.R + this.desideclrCss02.G + this.desideclrCss02.B);
			this.getRuleround2();

		}
		if (whichcolor == 8) {
			this.desideclrCss02 = {
				R: "af",
				G: "26",
				B: "ff"
			};
			// this.pure_purple();
			this.defaultclr02 = "#" + (this.desideclrCss02.R + this.desideclrCss02.G + this.desideclrCss02.B);
			this.getRuleround2();
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

	sp: any = 6;
	SpeedInput(value) {
		this.detectEffectChange();
		let vm = this;
		this.sp = value;
		setTimeout(() => {
			vm.speedMethod(value);
		}, 1000);
	}



	medFun: any = this.round_med;
	fastFun: any = this.round_high;
	slowFun: any = this.round_slow;
	speed: any = '6';

	//最先決定速度類型

	speedMethod(s) {
		clearInterval(this.getclr01);
		this.speed = s;
		if (s == 1) {
			this.fastFun();
			this.funcSet = "_high"
		}
		if (s == 6) {
			this.medFun();
			this.funcSet = "_med"
		}
		if (s == 11) {
			this.slowFun();
			this.funcSet = "_slow"
		} else {
			return false;
		}
	}

	cssRule: any = "";

	getRuleround1() {
		var rule;
		var ss = document.styleSheets;
		for (var i = 0; i < ss.length; i++) {
			for (var x = 0; x < ss[i]['cssRules'].length; x++) {
				rule = ss[i]['cssRules'][x];
				if (rule.name == "round1" && rule.type == rule.KEYFRAMES_RULE) {
					this.cssRule = rule;
				}
			}
		}
		this.cssRule.appendRule(`0% {background-color:${this.defaultclr}}`);
		this.detectEffectChange();
	}
	getRuleround2() {
		var rule;
		var ss = document.styleSheets;
		for (var i = 0; i < ss.length; i++) {
			for (var x = 0; x < ss[i]['cssRules'].length; x++) {
				rule = ss[i]['cssRules'][x];
				if (rule.name == "round2" && rule.type == rule.KEYFRAMES_RULE) {
					this.cssRule = rule;
				}
			}
		}
		this.cssRule.appendRule(`0% {background-color:${this.defaultclr02}}`);
		this.detectEffectChange();
	}

	color: any = ["#E9004C", "#FF3F00", "#FFBF00", "#7FFF00", "#007FFF", "#6400FF", "#AF26FF"]

	getRuleRandom1() {
		var rule;
		var ss = document.styleSheets;
		for (var i = 0; i < ss.length; i++) {
			for (var x = 0; x < ss[i]['cssRules'].length; x++) {
				rule = ss[i]['cssRules'][x];
				if (rule.name == "round1" && rule.type == rule.KEYFRAMES_RULE) {
					this.cssRule = rule;
				}
			}
		}
		var ran1 = Math.floor(Math.random() * 7)
		this.cssRule.appendRule(`0% {background-color:${this.color[ran1]}}`);
	}
	getRuleRandom2() {
		var rule;
		var ss = document.styleSheets;
		for (var i = 0; i < ss.length; i++) {
			for (var x = 0; x < ss[i]['cssRules'].length; x++) {
				rule = ss[i]['cssRules'][x];
				if (rule.name == "round2" && rule.type == rule.KEYFRAMES_RULE) {
					this.cssRule = rule;
				}
			}
		}
		var ran2 = Math.floor(Math.random() * 7)
		this.cssRule.appendRule(`0% {background-color:${this.color[ran2]}}`);
	}

	//速度
	FastSpeed: any = 1;
	MedSpeed: any = 6;
	SlowSpeed: any = 11;

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
						} else if (this.pausetime == 2) {
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
		this.nowobj.Light.LightSetting.LSbrightness[12] = this.op;
		this.nowobj.Light.LightSetting.LSspeed[12] = this.sp;
		this.nowobj.Light.LightSetting.LSdirection[12] = this.Effectdirection;
		this.nowobj.Light.LightSetting.changeTime[12] = this.timeValue;

		//console.log(this.timeValue);
		this.nowobj.Light.LightSetting.changeMode[12] = this.ttitle;



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
		env.log('light-effect', 'round', 'end');
		this.subscription.unsubscribe();
		this.goOut();
	}

	@Output() sendTimeCloseFlag = new EventEmitter();
	@Input() check01;
	@Input() timeEffect;
	@Input() receiveTemp;
	@Output() RoundTemp = new EventEmitter();
	@Output() LightEffect = new EventEmitter();
	@Output() applyStatus = new EventEmitter();
	applyFlag: any = 1;
	lightEffect: any = 12;
	round: any;
	roundObj() {
		this.round = {
			'LightEffect': 12,
			'LSbrightness': this.op,
			'LSspeed': this.sp,
			'LSdirection': this.Effectdirection,
			'changeTime': this.timeValue,
			'ttitle': '绽放',
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
			this.sp = 6;
			this.speedMethod(this.sp);
		}

		if (this.NewtimeValue !== undefined && this.NewtimeValue !== null && this.NewtimeValue !== "") {
			this.timeValue = this.NewtimeValue;
		}

		if (this.ttitle !== undefined && this.ttitle !== null && this.ttitle !== "") {
			this.sendTtile();
		} else {
			this.ttitle = '绽放';
		}

		if (this.default == true) {
			this.setDefault(1);
		} else {
			this.setDefault(2);
		}
	}

	sendApply() {
		if (this.timeEffect !== 12) {
			this.roundObj();
			setTimeout(() => {
				this.sendTimeCloseFlag.emit(this.check01);
				this.RoundTemp.emit(this.round);
				this.LightEffect.emit(this.round.LightEffect);
				this.passTime.emit(this.timeValue);
				setTimeout(() => {
					this.applyStatus.emit(this.applyFlag);
					setTimeout(() => {
						this.sendTimeCloseFlag.emit(this.check01);
						this.detectEffectChange();
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
		if (this.op != this.receiveTemp[0] || this.sp != this.receiveTemp[1] || this.timeValue != this.receiveTemp[3] || this.lightEffect != this.receiveTemp[5] || this.check01 != this.receiveTemp[6] || this.timeEffect != this.receiveTemp[7] || this.default != this.receiveTemp[8] || this.defaultclr != this.receiveTemp[9].defaultclr || this.defaultclr02 != this.receiveTemp[9].defaultclr02) {
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
