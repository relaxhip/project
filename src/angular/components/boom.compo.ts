declare var System;
import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { protocolService } from '../services/service/protocol.service';
import { icpEventService } from '../services/service/icpEventService.service'

const { ipcRenderer } = System._nodeRequire('electron');
declare var $: any;

import { ElectronEventService, dbService, EmitService } from '../services/libs/electron/index';
import { GetDeviceService } from '../services/device/GetDevice.service';
import { Subscription } from "rxjs/Subscription";



let funcVar = System._nodeRequire('./backend/others/FunctionVariable');
let evtVar = System._nodeRequire('./backend/others/eventVariable');
let env = System._nodeRequire('./backend/others/env');


@Component({
	selector: 'boom-effect',
	templateUrl: './components/effect/boom.compo.html',
	//template: '<h1>我的第一个 Angular 应用</h1>',
	styleUrls: ['./css/first.css', './css/kbd.css', './css/boom.css', './css/attractlight.css'],
	providers: [protocolService, dbService, icpEventService],
	inputs: ['ProfileDetail', 'ttitle', 'getGameChange', 'updatenow', 'changeProfile']
})



export class boomComponent implements OnInit {
	constructor(private protocol: protocolService, private db: dbService, private getDeviceService: GetDeviceService, private emitService: EmitService, private icpEventService: icpEventService) {
		// //console.log('float loading complete');
		//data在這裡取得 icp emit過來的值 ↓↓
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
			// //console.log(src);
			this.key = src;
			//console.log('src', this.key);
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
				// if(this.timeEventFlag == true){
				// 	this.timeEvent();
				// }
			}
			// //console.log(this.key.data[3]);
			// //console.log("icp " + this.vKey);
			// this.findXY();
			// //console.log("Mmode: " + this.MakeMode);
			// //console.log("Flag: " + this.Flag);
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
	timeStop: any;
	mode: any = 0;
	fnflag: number = 0;
	nowobj: any;
	ProfileDetail: any;
	keyMatrixMap: any = [];
	attbtn: boolean;
	defaultLb: boolean;
	CreatekeyMatrixMap() {
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
		// this.keyMatrixMap[0] = ['pause', 'stop', 'play/pause', 'next', 'rctrl', 'previous', 'lctrl', 'f5'];
		// this.keyMatrixMap[1] = ['q', 'tab', 'a', 'esc', 'z', 'k150', 'perid', 'n1'];
		// this.keyMatrixMap[2] = ['w', 'caps', 's', 'k45', 'x', 'k132', 'f1', 'n2'];
		// this.keyMatrixMap[3] = ['e', 'f3', 'd', 'f4', 'c', 'k151', 'f2', 'n3'];
		// this.keyMatrixMap[4] = ['r', 't', 'f', 'g', 'v', 'b', 'n5', 'n4'];
		// this.keyMatrixMap[5] = ['u', 'y', 'j', 'h', 'm', 'n', 'n6', 'n7'];
		// this.keyMatrixMap[6] = ['i', 'lqu', 'k', 'f6', 'comma', 'k56', 'plus', 'n8'];
		// this.keyMatrixMap[7] = ['o', 'f7', 'l', 'k14', 'dot', 'book', 'f8', 'n9'];
		// this.keyMatrixMap[8] = ['p', 'rqu', 'sem', 'quo', 'k42', 'qmark', 'minus', 'n0'];
		// this.keyMatrixMap[9] = ['scroll', 'media select', 'v-', 'lalt', 'v+', 'ralt', 'mute', 'print'];
		// this.keyMatrixMap[10] = ['none', 'bsp', 'drawn', 'f11', 'enter', 'f12', 'f9', 'f10'];
		// this.keyMatrixMap[11] = ['num7', 'num4', 'num1', 'space', 'numlock', 'down', 'delete', 'imc'];
		// this.keyMatrixMap[12] = ['num8', 'num5', 'num2', 'num0', 'numdrawn', 'right', 'insert', 'g mode'];
		// this.keyMatrixMap[13] = ['num9', 'num6', 'num3', 'numdot', 'numtimes', 'numminus', 'pup', 'pdown'];
		// this.keyMatrixMap[14] = ['numplus', '巴葡', 'numenter', 'up', 'none', 'left', 'home', 'end'];
		// this.keyMatrixMap[15] = ['none', 'lshift', 'rshift', 'k131', 'win', 'fn', 'k133', 'none'];
	}

	keyX: any;
	keyY: any;
	keyarr: any = [];
	findXY() {
		// //console.log('findXY')
		// // this.keyX = this.Data[3];
		// // this.keyY = this.Data[4];
		// //console.log(this.Data);
		//console.log('findXY')
		// this.keyX = this.Data[3];
		// this.keyY = this.Data[4];
		// //console.log(this.Data);

		// for (let index = 0; index < this.Data.length; index++) {
		// 	this.keyarr.push(this.Data[index]);

		// }

		// //console.log('對應arr');
		// //console.log(this.keyarr);



		// //console.log(this.keyarr[3]);
		// // //console.log(this.keyX);

		// this.vKey = this.keyMatrixMap[this.Data[3]][this.Data[4]];
		// this.keyStatus = this.Data[5];
		// //console.log('對應的x');
		// //console.log(x);
		// //console.log('對應的y');
		// //console.log(y);

		// this.vKey = x*8+y;

		// //console.log('對應的key');
		// //console.log(this.key);
		// // //console.log(this.key.data);
		// //console.log('對應的vkey');
		// //console.log(this.vKey);
		// //console.log('keyStatus', this.keyStatus)
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
	keeploading: boolean = true;
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
	speedhere: any = 40;

	subscription: Subscription;
	key: any;
	vKey: any;
	keyStatus: any;
	MakeMode: any;
	Flag: any;
	Data: any = [];
	savechange: number = 0;
	currentV: any;
	changeV: any;

	timeValue: any = 10;
	timeCount: any;
	setAp: number = 0;

	cuteValue: any = 0.5;
	speedValue: any = 40;
	loading: boolean;
	Effectdirection: any = 4;
	NewtimeValue: any;
	ttitle: string;
	// blockcss: any = "disabled";
	timewarn: boolean = false;
	@Output() outputTtile: EventEmitter<any> = new EventEmitter();
	@Output() effectfinish: EventEmitter<any> = new EventEmitter();

	sendTtile() {
		this.outputTtile.emit(this.ttitle);
	}

	@Output() passTime = new EventEmitter();
	@Output() openFrtp: EventEmitter<any> = new EventEmitter();

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
	// 				document.getElementById('time').blur();
	// 				setTimeout(() => {
	// 					clearInterval(vm.getclr01);
	// 					vm.leave = 0;
	// 				}, vm.timeCount * 59990);
	// 			}
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

	timeBlur(){
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


	ngOnInit() {        //漣漪
		this.timeValue = this.receiveTemp[3];
		this.check01 = false;
		this.BoomTemp.emit(this.boomT)
		env.log('light-effect', 'boom', 'start');
		//this.setAPmode();//連續下值預備動作
		this.LEDmatrix();//找出對應按鍵;
		this.setDefault(1);
		// this.boomOut_med();
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
			// if(this.envio == 1){
				env.log('boom', 'apmode', 'stopapmode')
			// }
			// this.savechange = 0
			//console.log('222')
			// //console.log(this.savechange)
		}
		if (this.currentV == '"startApmode"' && this.savechange == 0) {
			this.savechange = 1;
			this.plugIn();
			this.attBar(0);
			// if(this.envio == 1){
				env.log('boom', 'apmode', 'startapmode')
			// }
			// this.savechange = 0
			//console.log('333')
			// //console.log(this.savechange)

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


		if (this.currentV == '"setintoDB"') {
			//console.log('beginSetinDb');

			// this.subscription.unsubscribe();
			setTimeout(() => {
				this.setIntoDB();
			}, 6000)
		}

		if(this.currentV == '"setTime"'){
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
	thelastEffect: any = this.boomOut_med;


	array1: any = ["esc", "f1", "f2", "f3", "f4", "f5", "f6", "f7", "f8", "f9", "f10", "f11", "f12", "print", "scroll", "pause", "perid", "n1", "n2", "n3", "n4", "n5", "n6", "n7", "n8", "n9", "n0", "minus", "plus", "bsp", "insert", "home", "pup", "numlock", "numdrawn", "numtimes", "numminus", "tab", "q", "w", "e", "r", "t", "y", "u", "i", "o", "p", "lqu", "rqu", "delete", "drawn", "end", "pdown", "num7", "num8", "num9", "numplus", "caps", "a", "s", "d", "f", "g", "h", "j", "k", "l", "sem", "quo", "enter", "num4", "num5", "num6", "lshift", "z", "x", "c", "v", "b", "n", "m", "comma", "dot", "qmark", "rshift", "up", "num1", "num2", "num3", "numenter", "lctrl", "win", "lalt", "space", "ralt", "fn", "book", "rctrl", "left", "down", "right", "num0", "numdot", "Upside1", "Upside2", "Upside3", "Upside4", "Upside5", "Upside6", "Upside7", "Upside8", "Upside9", "Upside10", "Upside11", "Upside12", "Upside13", "Upside14", "Upside15", "Upside16", "Upside17", "Upside18", "Upside19", "Upside20", "logo1", "logo2"];

	array2: any = ["esc_2", "f1_2", "f2_2", "f3_2", "f4_2", "f5_2", "f6_2", "f7_2", "f8_2", "f9_2", "f10_2", "f11_2", "f12_2", "print_2", "scroll_2", "pause_2", "perid_2", "n1_2", "n2_2", "n3_2", "n4_2", "n5_2", "n6_2", "n7_2", "n8_2", "n9_2", "n0_2", "minus_2", "plus_2", "bsp_2", "insert_2", "home_2", "pup_2", "numlock_2", "numdrawn_2", "numtimes_2", "numminus_2", "tab_2", "q_2", "w_2", "e_2", "r_2", "t_2", "y_2", "u_2", "i_2", "o_2", "p_2", "lqu_2", "rqu_2", "delete_2", "drawn_2", "end_2", "pdown_2", "num7_2", "num8_2", "num9_2", "numplus_2", "caps_2", "a_2", "s_2", "d_2", "f_2", "g_2", "h_2", "j_2", "k_2", "l_2", "sem_2", "quo_2", "enter_2", "num4_2", "num5_2", "num6_2", "lshift_2", "z_2", "x_2", "c_2", "v_2", "b_2", "n_2", "m_2", "comma_2", "dot_2", "qmark_2", "rshift_2", "up_2", "num1_2", "num2_2", "num3_2", "numenter_2", "lctrl_2", "win_2", "lalt_2", "space_2", "ralt_2", "fn_2", "book_2", "rctrl_2", "left_2", "down_2", "right_2", "num0_2", "numdot_2", "Upside1_2", "Upside2_2", "Upside3_2", "Upside4_2", "Upside5_2", "Upside6_2", "Upside7_2", "Upside8_2", "Upside9_2", "Upside10_2", "Upside11_2", "Upside12_2", "Upside13_2", "Upside14_2", "Upside15_2", "Upside16_2", "Upside17_2", "Upside18_2", "Upside19_2", "Upside20_2", "logo1_2", "logo2_2"]

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
			// //console.log(rgbColors) `.l; *-+9
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
				// 	profile: '1',    //profile  0:reset, 1:Profile1 2:Profile2
				// 	mode: '0x0e', //1~15 代表不同Mode
				// 	light: '0x14',    //0~32 燈光亮度
				// }
				// let obj2 = {
				// 	Type: funcVar.FuncType.Device,
				// 	Func: funcVar.FuncName.SetCommand,
				// 	Param: setprofile
				// }
				// // //console.log("setprofile:SetCommand");
				// this.protocol.RunSetFunction(obj2).then((data) => {
				// //console.log("Container RunSetFunction:" + data);
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
					//console.log('x:' + x + 'y:' + y)
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
					// this.saveapmode = false;
					this.doApmode01();
					//}

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
		}, 20);
	}

	//



	// KBClean() {
	// 	for (let i = 0; i < this.array1.length; i++) {
	// 		this.red[i] = 0;
	// 		this.green[i] = 0;
	// 		this.blue[i] = 0;
	// 	}
	// }
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
		let vm = this;
		// if (this.getDeviceService.dataObj.status == 1) {
		this.thelastEffect();
		this.leave = 1;
		this.doApmode01();
		this.letsgoout = true;
		this.letsgoIn = false;
		this.savechange = 0;
		// this.detectButton();
	}
	
	//取值區



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
	funcSet: any = "_med";
	keyFlag1: any = 0;
	keyFlag2: any = 0;


	funcInIcp() {
		//console.log("vKey: " + this.vKey)
		switch (true) {
			case this.vKey == 27 && this.keyStatus == 1: //esc
				if (this.num == 0) {
					// this.clear();
					if (this.keyFlag1 == 0) {
						this.keyFlag1 = 1;
						setTimeout(() => {
							this.esc = '' + this.funcSet;
							this.f1 = '' + this.funcSet;
							this.f2 = '' + this.funcSet;
							this.f3 = '' + this.funcSet;
							this.f4 = '' + this.funcSet;
							this.f5 = '' + this.funcSet;
							this.f6 = '' + this.funcSet;
							this.f7 = '' + this.funcSet;
							this.f8 = '' + this.funcSet;
							this.f9 = '' + this.funcSet;
							this.f10 = '' + this.funcSet;
							this.f11 = '' + this.funcSet;
							this.f12 = '' + this.funcSet;
							this.print = '' + this.funcSet;
							this.scroll = '' + this.funcSet;
							this.pause = '' + this.funcSet;
							this.keyFlag2 = 0;
						}, 1000);
					}
					this.esc = 'boom1_1' + this.funcSet;
					this.f1 = 'boom2_1' + this.funcSet;
					this.f2 = 'boom3_1' + this.funcSet;
					this.f3 = 'boom4_1' + this.funcSet;
					this.f4 = 'boom5_1' + this.funcSet;
					this.f5 = 'boom6_1' + this.funcSet;
					this.f6 = 'boom7_1' + this.funcSet;
					this.f7 = 'boom8_1' + this.funcSet;
					this.f8 = 'boom9_1' + this.funcSet;
					this.f9 = 'boom10_1' + this.funcSet;
					this.f10 = 'boom11_1' + this.funcSet;
					this.f11 = 'boom12_1' + this.funcSet;
					this.f12 = 'boom13_1' + this.funcSet;
					this.print = 'boom14_1' + this.funcSet;
					this.scroll = 'boom15_1' + this.funcSet;
					this.pause = 'boom16_1' + this.funcSet;

					this.num = 1;
				}
				else if (this.num == 1) {
					this.num = 0;
					// this.clear();
					if (this.keyFlag2 == 0) {
						this.keyFlag2 = 1;
						setTimeout(() => {
							this.keyFlag2 = 0;
							this.esc = '' + this.funcSet;
							this.f1 = '' + this.funcSet;
							this.f2 = '' + this.funcSet;
							this.f3 = '' + this.funcSet;
							this.f4 = '' + this.funcSet;
							this.f5 = '' + this.funcSet;
							this.f6 = '' + this.funcSet;
							this.f7 = '' + this.funcSet;
							this.f8 = '' + this.funcSet;
							this.f9 = '' + this.funcSet;
							this.f10 = '' + this.funcSet;
							this.f11 = '' + this.funcSet;
							this.f12 = '' + this.funcSet;
							this.print = '' + this.funcSet;
							this.scroll = '' + this.funcSet;
							this.pause = '' + this.funcSet;
						}, 1000);
					}
					this.esc_2 = 'boom1_2' + this.funcSet;
					this.f1_2 = 'boom2_2' + this.funcSet;
					this.f2_2 = 'boom3_2' + this.funcSet;
					this.f3_2 = 'boom4_2' + this.funcSet;
					this.f4_2 = 'boom5_2' + this.funcSet;
					this.f5_2 = 'boom6_2' + this.funcSet;
					this.f6_2 = 'boom7_2' + this.funcSet;
					this.f7_2 = 'boom8_2' + this.funcSet;
					this.f8_2 = 'boom9_2' + this.funcSet;
					this.f9_2 = 'boom10_2' + this.funcSet;
					this.f10_2 = 'boom11_2' + this.funcSet;
					this.f11_2 = 'boom12_2' + this.funcSet;
					this.f12_2 = 'boom13_2' + this.funcSet;
					this.print_2 = 'boom14_2' + this.funcSet;
					this.scroll_2 = 'boom15_2' + this.funcSet;
					this.pause_2 = 'boom16_2' + this.funcSet;
				}
				break;

			case this.vKey == 112 && this.keyStatus == 1: //f1
				if (this.num == 0) {
					// this.clear();
					if (this.keyFlag1 == 0) {
						this.keyFlag1 = 1;
						setTimeout(() => {
							this.keyFlag1 = 0;
							this.esc = '' + this.funcSet;
							this.f1 = '' + this.funcSet;
							this.f2 = '' + this.funcSet;
							this.f3 = '' + this.funcSet;
							this.f4 = '' + this.funcSet;
							this.f5 = '' + this.funcSet;
							this.f6 = '' + this.funcSet;
							this.f7 = '' + this.funcSet;
							this.f8 = '' + this.funcSet;
							this.f9 = '' + this.funcSet;
							this.f10 = '' + this.funcSet;
							this.f11 = '' + this.funcSet;
							this.f12 = '' + this.funcSet;
							this.print = '' + this.funcSet;
							this.scroll = '' + this.funcSet;
							this.pause = '' + this.funcSet;
						}, 1000);
					}
					this.esc = 'boom2_1' + this.funcSet;
					this.f1 = 'boom1_1' + this.funcSet;
					this.f2 = 'boom2_1' + this.funcSet;
					this.f3 = 'boom3_1' + this.funcSet;
					this.f4 = 'boom4_1' + this.funcSet;
					this.f5 = 'boom5_1' + this.funcSet;
					this.f6 = 'boom6_1' + this.funcSet;
					this.f7 = 'boom7_1' + this.funcSet;
					this.f8 = 'boom8_1' + this.funcSet;
					this.f9 = 'boom9_1' + this.funcSet;
					this.f10 = 'boom10_1' + this.funcSet;
					this.f11 = 'boom11_1' + this.funcSet;
					this.f12 = 'boom12_1' + this.funcSet;
					this.print = 'boom13_1' + this.funcSet;
					this.scroll = 'boom14_1' + this.funcSet;
					this.pause = 'boom15_1' + this.funcSet;

					this.num = 1;
				}
				else if (this.num == 1) {
					this.num = 0;
					// this.clear();
					if (this.keyFlag2 == 0) {
						this.keyFlag2 = 1;
						setTimeout(() => {
							this.keyFlag2 = 0;
							this.esc = '' + this.funcSet;
							this.f1 = '' + this.funcSet;
							this.f2 = '' + this.funcSet;
							this.f3 = '' + this.funcSet;
							this.f4 = '' + this.funcSet;
							this.f5 = '' + this.funcSet;
							this.f6 = '' + this.funcSet;
							this.f7 = '' + this.funcSet;
							this.f8 = '' + this.funcSet;
							this.f9 = '' + this.funcSet;
							this.f10 = '' + this.funcSet;
							this.f11 = '' + this.funcSet;
							this.f12 = '' + this.funcSet;
							this.print = '' + this.funcSet;
							this.scroll = '' + this.funcSet;
							this.pause = '' + this.funcSet;
						}, 1000);
					}
					this.esc = 'boom2_2' + this.funcSet;
					this.f1 = 'boom1_2' + this.funcSet;
					this.f2 = 'boom2_2' + this.funcSet;
					this.f3 = 'boom3_2' + this.funcSet;
					this.f4 = 'boom4_2' + this.funcSet;
					this.f5 = 'boom5_2' + this.funcSet;
					this.f6 = 'boom6_2' + this.funcSet;
					this.f7 = 'boom7_2' + this.funcSet;
					this.f8 = 'boom8_2' + this.funcSet;
					this.f9 = 'boom9_2' + this.funcSet;
					this.f10 = 'boom10_2' + this.funcSet;
					this.f11 = 'boom11_2' + this.funcSet;
					this.f12 = 'boom12_2' + this.funcSet;
					this.print = 'boom13_2' + this.funcSet;
					this.scroll = 'boom14_2' + this.funcSet;
					this.pause = 'boom15_2' + this.funcSet;

				}
				break;

			case this.vKey == 113 && this.keyStatus == 1: //f2
				if (this.num == 0) {
					// this.clear();
					if (this.keyFlag1 == 0) {
						this.keyFlag1 = 1;
						setTimeout(() => {
							this.keyFlag1 = 0;
							this.esc = '' + this.funcSet;
							this.f1 = '' + this.funcSet;
							this.f2 = '' + this.funcSet;
							this.f3 = '' + this.funcSet;
							this.f4 = '' + this.funcSet;
							this.f5 = '' + this.funcSet;
							this.f6 = '' + this.funcSet;
							this.f7 = '' + this.funcSet;
							this.f8 = '' + this.funcSet;
							this.f9 = '' + this.funcSet;
							this.f10 = '' + this.funcSet;
							this.f11 = '' + this.funcSet;
							this.f12 = '' + this.funcSet;
							this.print = '' + this.funcSet;
							this.scroll = '' + this.funcSet;
							this.pause = '' + this.funcSet;
						}, 1000);
					}
					this.esc = 'boom3_1' + this.funcSet;
					this.f1 = 'boom2_1' + this.funcSet;
					this.f2 = 'boom1_1' + this.funcSet;
					this.f3 = 'boom2_1' + this.funcSet;
					this.f4 = 'boom3_1' + this.funcSet;
					this.f5 = 'boom4_1' + this.funcSet;
					this.f6 = 'boom5_1' + this.funcSet;
					this.f7 = 'boom6_1' + this.funcSet;
					this.f8 = 'boom7_1' + this.funcSet;
					this.f9 = 'boom8_1' + this.funcSet;
					this.f10 = 'boom9_1' + this.funcSet;
					this.f11 = 'boom10_1' + this.funcSet;
					this.f12 = 'boom11_1' + this.funcSet;
					this.print = 'boom12_1' + this.funcSet;
					this.scroll = 'boom13_1' + this.funcSet;
					this.pause = 'boom14_1' + this.funcSet;


					this.num = 1;
				}
				else if (this.num == 1) {
					this.num = 0;
					// this.clear();
					if (this.keyFlag2 == 0) {
						this.keyFlag2 = 1;
						setTimeout(() => {
							this.keyFlag2 = 0;
							this.esc = '' + this.funcSet;
							this.f1 = '' + this.funcSet;
							this.f2 = '' + this.funcSet;
							this.f3 = '' + this.funcSet;
							this.f4 = '' + this.funcSet;
							this.f5 = '' + this.funcSet;
							this.f6 = '' + this.funcSet;
							this.f7 = '' + this.funcSet;
							this.f8 = '' + this.funcSet;
							this.f9 = '' + this.funcSet;
							this.f10 = '' + this.funcSet;
							this.f11 = '' + this.funcSet;
							this.f12 = '' + this.funcSet;
							this.print = '' + this.funcSet;
							this.scroll = '' + this.funcSet;
							this.pause = '' + this.funcSet;
						}, 1000);
					}
					this.esc = 'boom3_2' + this.funcSet;
					this.f1 = 'boom2_2' + this.funcSet;
					this.f2 = 'boom1_2' + this.funcSet;
					this.f3 = 'boom2_2' + this.funcSet;
					this.f4 = 'boom3_2' + this.funcSet;
					this.f5 = 'boom4_2' + this.funcSet;
					this.f6 = 'boom5_2' + this.funcSet;
					this.f7 = 'boom6_2' + this.funcSet;
					this.f8 = 'boom7_2' + this.funcSet;
					this.f9 = 'boom8_2' + this.funcSet;
					this.f10 = 'boom9_2' + this.funcSet;
					this.f11 = 'boom10_2' + this.funcSet;
					this.f12 = 'boom11_2' + this.funcSet;
					this.print = 'boom12_2' + this.funcSet;
					this.scroll = 'boom13_2' + this.funcSet;
					this.pause = 'boom14_2' + this.funcSet;

				}
				break;

			case this.vKey == 114 && this.keyStatus == 1: //f3
				if (this.num == 0) {
					// this.clear();
					if (this.keyFlag1 == 0) {
						this.keyFlag1 = 1;
						setTimeout(() => {
							this.keyFlag1 = 0;
							this.esc = '' + this.funcSet;
							this.f1 = '' + this.funcSet;
							this.f2 = '' + this.funcSet;
							this.f3 = '' + this.funcSet;
							this.f4 = '' + this.funcSet;
							this.f5 = '' + this.funcSet;
							this.f6 = '' + this.funcSet;
							this.f7 = '' + this.funcSet;
							this.f8 = '' + this.funcSet;
							this.f9 = '' + this.funcSet;
							this.f10 = '' + this.funcSet;
							this.f11 = '' + this.funcSet;
							this.f12 = '' + this.funcSet;
							this.print = '' + this.funcSet;
							this.scroll = '' + this.funcSet;
							this.pause = '' + this.funcSet;
						}, 1000);
					}
					this.esc = 'boom4_1' + this.funcSet;
					this.f1 = 'boom3_1' + this.funcSet;
					this.f2 = 'boom2_1' + this.funcSet;
					this.f3 = 'boom1_1' + this.funcSet;
					this.f4 = 'boom2_1' + this.funcSet;
					this.f5 = 'boom3_1' + this.funcSet;
					this.f6 = 'boom4_1' + this.funcSet;
					this.f7 = 'boom5_1' + this.funcSet;
					this.f8 = 'boom6_1' + this.funcSet;
					this.f9 = 'boom7_1' + this.funcSet;
					this.f10 = 'boom8_1' + this.funcSet;
					this.f11 = 'boom9_1' + this.funcSet;
					this.f12 = 'boom10_1' + this.funcSet;
					this.print = 'boom11_1' + this.funcSet;
					this.scroll = 'boom12_1' + this.funcSet;
					this.pause = 'boom13_1' + this.funcSet;

					this.num = 1;
				}
				else if (this.num == 1) {
					this.num = 0;
					// this.clear();
					if (this.keyFlag2 == 0) {
						this.keyFlag2 = 1;
						setTimeout(() => {
							this.keyFlag2 = 0;
							this.esc = '' + this.funcSet;
							this.f1 = '' + this.funcSet;
							this.f2 = '' + this.funcSet;
							this.f3 = '' + this.funcSet;
							this.f4 = '' + this.funcSet;
							this.f5 = '' + this.funcSet;
							this.f6 = '' + this.funcSet;
							this.f7 = '' + this.funcSet;
							this.f8 = '' + this.funcSet;
							this.f9 = '' + this.funcSet;
							this.f10 = '' + this.funcSet;
							this.f11 = '' + this.funcSet;
							this.f12 = '' + this.funcSet;
							this.print = '' + this.funcSet;
							this.scroll = '' + this.funcSet;
							this.pause = '' + this.funcSet;
						}, 1000);
					}
					this.esc = 'boom4_2' + this.funcSet;
					this.f1 = 'boom3_2' + this.funcSet;
					this.f2 = 'boom2_2' + this.funcSet;
					this.f3 = 'boom1_2' + this.funcSet;
					this.f4 = 'boom2_2' + this.funcSet;
					this.f5 = 'boom3_2' + this.funcSet;
					this.f6 = 'boom4_2' + this.funcSet;
					this.f7 = 'boom5_2' + this.funcSet;
					this.f8 = 'boom6_2' + this.funcSet;
					this.f9 = 'boom7_2' + this.funcSet;
					this.f10 = 'boom8_2' + this.funcSet;
					this.f11 = 'boom9_2' + this.funcSet;
					this.f12 = 'boom10_2' + this.funcSet;
					this.print = 'boom11_2' + this.funcSet;
					this.scroll = 'boom12_2' + this.funcSet;
					this.pause = 'boom13_2' + this.funcSet;
				}
				break;

			case this.vKey == 115 && this.keyStatus == 1: //f4
				if (this.num == 0) {
					// this.clear();
					if (this.keyFlag1 == 0) {
						this.keyFlag1 = 1;
						setTimeout(() => {
							this.keyFlag1 = 0;
							this.esc = '' + this.funcSet;
							this.f1 = '' + this.funcSet;
							this.f2 = '' + this.funcSet;
							this.f3 = '' + this.funcSet;
							this.f4 = '' + this.funcSet;
							this.f5 = '' + this.funcSet;
							this.f6 = '' + this.funcSet;
							this.f7 = '' + this.funcSet;
							this.f8 = '' + this.funcSet;
							this.f9 = '' + this.funcSet;
							this.f10 = '' + this.funcSet;
							this.f11 = '' + this.funcSet;
							this.f12 = '' + this.funcSet;
							this.print = '' + this.funcSet;
							this.scroll = '' + this.funcSet;
							this.pause = '' + this.funcSet;
						}, 1000);
					}
					this.esc = 'boom5_1' + this.funcSet;
					this.f1 = 'boom4_1' + this.funcSet;
					this.f2 = 'boom3_1' + this.funcSet;
					this.f3 = 'boom2_1' + this.funcSet;
					this.f4 = 'boom1_1' + this.funcSet;
					this.f5 = 'boom2_1' + this.funcSet;
					this.f6 = 'boom3_1' + this.funcSet;
					this.f7 = 'boom4_1' + this.funcSet;
					this.f8 = 'boom5_1' + this.funcSet;
					this.f9 = 'boom6_1' + this.funcSet;
					this.f10 = 'boom7_1' + this.funcSet;
					this.f11 = 'boom8_1' + this.funcSet;
					this.f12 = 'boom9_1' + this.funcSet;
					this.print = 'boom10_1' + this.funcSet;
					this.scroll = 'boom11_1' + this.funcSet;
					this.pause = 'boom12_1' + this.funcSet;
					this.num = 1;
				}
				else if (this.num == 1) {
					this.num = 0;
					// this.clear();
					if (this.keyFlag2 == 0) {
						this.keyFlag2 = 1;
						setTimeout(() => {
							this.keyFlag2 = 0;
							this.esc = '' + this.funcSet;
							this.f1 = '' + this.funcSet;
							this.f2 = '' + this.funcSet;
							this.f3 = '' + this.funcSet;
							this.f4 = '' + this.funcSet;
							this.f5 = '' + this.funcSet;
							this.f6 = '' + this.funcSet;
							this.f7 = '' + this.funcSet;
							this.f8 = '' + this.funcSet;
							this.f9 = '' + this.funcSet;
							this.f10 = '' + this.funcSet;
							this.f11 = '' + this.funcSet;
							this.f12 = '' + this.funcSet;
							this.print = '' + this.funcSet;
							this.scroll = '' + this.funcSet;
							this.pause = '' + this.funcSet;
						}, 1000);
					}
					this.esc = 'boom5_2' + this.funcSet;
					this.f1 = 'boom4_2' + this.funcSet;
					this.f2 = 'boom3_2' + this.funcSet;
					this.f3 = 'boom2_2' + this.funcSet;
					this.f4 = 'boom1_2' + this.funcSet;
					this.f5 = 'boom2_2' + this.funcSet;
					this.f6 = 'boom3_2' + this.funcSet;
					this.f7 = 'boom4_2' + this.funcSet;
					this.f8 = 'boom5_2' + this.funcSet;
					this.f9 = 'boom6_2' + this.funcSet;
					this.f10 = 'boom7_2' + this.funcSet;
					this.f11 = 'boom8_2' + this.funcSet;
					this.f12 = 'boom9_2' + this.funcSet;
					this.print = 'boom10_2' + this.funcSet;
					this.scroll = 'boom11_2' + this.funcSet;
					this.pause = 'boom12_2_' + this.funcSet

				}
				break;

			case this.vKey == 116 && this.keyStatus == 1: //f5
				if (this.num == 0) {
					// this.clear();
					if (this.keyFlag1 == 0) {
						this.keyFlag1 = 1;
						setTimeout(() => {
							this.keyFlag1 = 0;
							this.esc = '' + this.funcSet;
							this.f1 = '' + this.funcSet;
							this.f2 = '' + this.funcSet;
							this.f3 = '' + this.funcSet;
							this.f4 = '' + this.funcSet;
							this.f5 = '' + this.funcSet;
							this.f6 = '' + this.funcSet;
							this.f7 = '' + this.funcSet;
							this.f8 = '' + this.funcSet;
							this.f9 = '' + this.funcSet;
							this.f10 = '' + this.funcSet;
							this.f11 = '' + this.funcSet;
							this.f12 = '' + this.funcSet;
							this.print = '' + this.funcSet;
							this.scroll = '' + this.funcSet;
							this.pause = '' + this.funcSet;
						}, 1000);
					}
					this.esc = 'boom6_1' + this.funcSet;
					this.f1 = 'boom5_1' + this.funcSet;
					this.f2 = 'boom4_1' + this.funcSet;
					this.f3 = 'boom3_1' + this.funcSet;
					this.f4 = 'boom2_1' + this.funcSet;
					this.f5 = 'boom1_1' + this.funcSet;
					this.f6 = 'boom2_1' + this.funcSet;
					this.f7 = 'boom3_1' + this.funcSet;
					this.f8 = 'boom4_1' + this.funcSet;
					this.f9 = 'boom5_1' + this.funcSet;
					this.f10 = 'boom6_1' + this.funcSet;
					this.f11 = 'boom7_1' + this.funcSet;
					this.f12 = 'boom8_1' + this.funcSet;
					this.print = 'boom9_1' + this.funcSet;
					this.scroll = 'boom10_1' + this.funcSet;
					this.pause = 'boom11_1' + this.funcSet;


					this.num = 1;
				}
				else if (this.num == 1) {
					this.num = 0;
					// this.clear();
					if (this.keyFlag2 == 0) {
						this.keyFlag2 = 1;
						setTimeout(() => {
							this.keyFlag2 = 0;
							this.esc = '' + this.funcSet;
							this.f1 = '' + this.funcSet;
							this.f2 = '' + this.funcSet;
							this.f3 = '' + this.funcSet;
							this.f4 = '' + this.funcSet;
							this.f5 = '' + this.funcSet;
							this.f6 = '' + this.funcSet;
							this.f7 = '' + this.funcSet;
							this.f8 = '' + this.funcSet;
							this.f9 = '' + this.funcSet;
							this.f10 = '' + this.funcSet;
							this.f11 = '' + this.funcSet;
							this.f12 = '' + this.funcSet;
							this.print = '' + this.funcSet;
							this.scroll = '' + this.funcSet;
							this.pause = '' + this.funcSet;
						}, 1000);
					}
					this.esc = 'boom6_2' + this.funcSet;
					this.f1 = 'boom5_2' + this.funcSet;
					this.f2 = 'boom4_2' + this.funcSet;
					this.f3 = 'boom3_2' + this.funcSet;
					this.f4 = 'boom2_2' + this.funcSet;
					this.f5 = 'boom1_2' + this.funcSet;
					this.f6 = 'boom2_2' + this.funcSet;
					this.f7 = 'boom3_2' + this.funcSet;
					this.f8 = 'boom4_2' + this.funcSet;
					this.f9 = 'boom5_2' + this.funcSet;
					this.f10 = 'boom6_2' + this.funcSet;
					this.f11 = 'boom7_2' + this.funcSet;
					this.f12 = 'boom8_2' + this.funcSet;
					this.print = 'boom9_2' + this.funcSet;
					this.scroll = 'boom10_2' + this.funcSet;
					this.pause = 'boom11_2' + this.funcSet;


				}
				break;

			case this.vKey == 117 && this.keyStatus == 1: //f6
				if (this.num == 0) {
					// this.clear();
					if (this.keyFlag1 == 0) {
						this.keyFlag1 = 1;
						setTimeout(() => {
							this.keyFlag1 = 0;
							this.esc = '' + this.funcSet;
							this.f1 = '' + this.funcSet;
							this.f2 = '' + this.funcSet;
							this.f3 = '' + this.funcSet;
							this.f4 = '' + this.funcSet;
							this.f5 = '' + this.funcSet;
							this.f6 = '' + this.funcSet;
							this.f7 = '' + this.funcSet;
							this.f8 = '' + this.funcSet;
							this.f9 = '' + this.funcSet;
							this.f10 = '' + this.funcSet;
							this.f11 = '' + this.funcSet;
							this.f12 = '' + this.funcSet;
							this.print = '' + this.funcSet;
							this.scroll = '' + this.funcSet;
							this.pause = '' + this.funcSet;
						}, 1000);
					}
					this.esc = 'boom7_1' + this.funcSet;
					this.f1 = 'boom6_1' + this.funcSet;
					this.f2 = 'boom5_1' + this.funcSet;
					this.f3 = 'boom4_1' + this.funcSet;
					this.f4 = 'boom3_1' + this.funcSet;
					this.f5 = 'boom2_1' + this.funcSet;
					this.f6 = 'boom1_1' + this.funcSet;
					this.f7 = 'boom2_1' + this.funcSet;
					this.f8 = 'boom3_1' + this.funcSet;
					this.f9 = 'boom4_1' + this.funcSet;
					this.f10 = 'boom5_1' + this.funcSet;
					this.f11 = 'boom6_1' + this.funcSet;
					this.f12 = 'boom7_1' + this.funcSet;
					this.print = 'boom8_1' + this.funcSet;
					this.scroll = 'boom9_1' + this.funcSet;
					this.pause = 'boom10_1' + this.funcSet;


					this.num = 1;
				}
				else if (this.num == 1) {
					this.num = 0;
					// this.clear();
					if (this.keyFlag2 == 0) {
						this.keyFlag2 = 1;
						setTimeout(() => {
							this.keyFlag2 = 0;
							this.esc = '' + this.funcSet;
							this.f1 = '' + this.funcSet;
							this.f2 = '' + this.funcSet;
							this.f3 = '' + this.funcSet;
							this.f4 = '' + this.funcSet;
							this.f5 = '' + this.funcSet;
							this.f6 = '' + this.funcSet;
							this.f7 = '' + this.funcSet;
							this.f8 = '' + this.funcSet;
							this.f9 = '' + this.funcSet;
							this.f10 = '' + this.funcSet;
							this.f11 = '' + this.funcSet;
							this.f12 = '' + this.funcSet;
							this.print = '' + this.funcSet;
							this.scroll = '' + this.funcSet;
							this.pause = '' + this.funcSet;
						}, 1000);
					}
					this.esc = 'boom7_2' + this.funcSet;
					this.f1 = 'boom6_2' + this.funcSet;
					this.f2 = 'boom5_2' + this.funcSet;
					this.f3 = 'boom4_2' + this.funcSet;
					this.f4 = 'boom3_2' + this.funcSet;
					this.f5 = 'boom2_2' + this.funcSet;
					this.f6 = 'boom1_2' + this.funcSet;
					this.f7 = 'boom2_2' + this.funcSet;
					this.f8 = 'boom3_2' + this.funcSet;
					this.f9 = 'boom4_2' + this.funcSet;
					this.f10 = 'boom5_2' + this.funcSet;
					this.f11 = 'boom6_2' + this.funcSet;
					this.f12 = 'boom7_2' + this.funcSet;
					this.print = 'boom8_2' + this.funcSet;
					this.scroll = 'boom9_2' + this.funcSet;
					this.pause = 'boom10_2' + this.funcSet;
				}
				break;

			case this.vKey == 118 && this.keyStatus == 1: //f7
				if (this.num == 0) {
					// this.clear();
					if (this.keyFlag1 == 0) {
						this.keyFlag1 = 1;
						setTimeout(() => {
							this.keyFlag1 = 0;
							this.esc = '' + this.funcSet;
							this.f1 = '' + this.funcSet;
							this.f2 = '' + this.funcSet;
							this.f3 = '' + this.funcSet;
							this.f4 = '' + this.funcSet;
							this.f5 = '' + this.funcSet;
							this.f6 = '' + this.funcSet;
							this.f7 = '' + this.funcSet;
							this.f8 = '' + this.funcSet;
							this.f9 = '' + this.funcSet;
							this.f10 = '' + this.funcSet;
							this.f11 = '' + this.funcSet;
							this.f12 = '' + this.funcSet;
							this.print = '' + this.funcSet;
							this.scroll = '' + this.funcSet;
							this.pause = '' + this.funcSet;
						}, 1000);
					}
					this.esc = 'boom8_1' + this.funcSet;
					this.f1 = 'boom7_1' + this.funcSet;
					this.f2 = 'boom6_1' + this.funcSet;
					this.f3 = 'boom5_1' + this.funcSet;
					this.f4 = 'boom4_1' + this.funcSet;
					this.f5 = 'boom3_1' + this.funcSet;
					this.f6 = 'boom2_1' + this.funcSet;
					this.f7 = 'boom1_1' + this.funcSet;
					this.f8 = 'boom2_1' + this.funcSet;
					this.f9 = 'boom3_1' + this.funcSet;
					this.f10 = 'boom4_1' + this.funcSet;
					this.f11 = 'boom5_1' + this.funcSet;
					this.f12 = 'boom6_1' + this.funcSet;
					this.print = 'boom7_1' + this.funcSet;
					this.scroll = 'boom8_1' + this.funcSet;
					this.pause = 'boom9_1' + this.funcSet;

					this.num = 1;
				}
				else if (this.num == 1) {
					this.num = 0;
					// this.clear();
					if (this.keyFlag2 == 0) {
						this.keyFlag2 = 1;
						setTimeout(() => {
							this.keyFlag2 = 0;
							this.esc = '' + this.funcSet;
							this.f1 = '' + this.funcSet;
							this.f2 = '' + this.funcSet;
							this.f3 = '' + this.funcSet;
							this.f4 = '' + this.funcSet;
							this.f5 = '' + this.funcSet;
							this.f6 = '' + this.funcSet;
							this.f7 = '' + this.funcSet;
							this.f8 = '' + this.funcSet;
							this.f9 = '' + this.funcSet;
							this.f10 = '' + this.funcSet;
							this.f11 = '' + this.funcSet;
							this.f12 = '' + this.funcSet;
							this.print = '' + this.funcSet;
							this.scroll = '' + this.funcSet;
							this.pause = '' + this.funcSet;
						}, 1000);
					}
					this.esc = 'boom8_2' + this.funcSet;
					this.f1 = 'boom7_2' + this.funcSet;
					this.f2 = 'boom6_2' + this.funcSet;
					this.f3 = 'boom5_2' + this.funcSet;
					this.f4 = 'boom4_2' + this.funcSet;
					this.f5 = 'boom3_2' + this.funcSet;
					this.f6 = 'boom2_2' + this.funcSet;
					this.f7 = 'boom1_2' + this.funcSet;
					this.f8 = 'boom2_2' + this.funcSet;
					this.f9 = 'boom3_2' + this.funcSet;
					this.f10 = 'boom4_2' + this.funcSet;
					this.f11 = 'boom5_2' + this.funcSet;
					this.f12 = 'boom6_2' + this.funcSet;
					this.print = 'boom7_2' + this.funcSet;
					this.scroll = 'boom8_2' + this.funcSet;
					this.pause = 'boom9_2' + this.funcSet;


				}
				break;

			case this.vKey == 119 && this.keyStatus == 1: //f8
				if (this.num == 0) {
					// this.clear();
					if (this.keyFlag1 == 0) {
						this.keyFlag1 = 1;
						setTimeout(() => {
							this.keyFlag1 = 0;
							this.esc = '' + this.funcSet;
							this.f1 = '' + this.funcSet;
							this.f2 = '' + this.funcSet;
							this.f3 = '' + this.funcSet;
							this.f4 = '' + this.funcSet;
							this.f5 = '' + this.funcSet;
							this.f6 = '' + this.funcSet;
							this.f7 = '' + this.funcSet;
							this.f8 = '' + this.funcSet;
							this.f9 = '' + this.funcSet;
							this.f10 = '' + this.funcSet;
							this.f11 = '' + this.funcSet;
							this.f12 = '' + this.funcSet;
							this.print = '' + this.funcSet;
							this.scroll = '' + this.funcSet;
							this.pause = '' + this.funcSet;
						}, 1000);
					}
					this.esc = 'boom9_1' + this.funcSet;
					this.f1 = 'boom8_1' + this.funcSet;
					this.f2 = 'boom7_1' + this.funcSet;
					this.f3 = 'boom6_1' + this.funcSet;
					this.f4 = 'boom5_1' + this.funcSet;
					this.f5 = 'boom4_1' + this.funcSet;
					this.f6 = 'boom3_1' + this.funcSet;
					this.f7 = 'boom2_1' + this.funcSet;
					this.f8 = 'boom1_1' + this.funcSet;
					this.f9 = 'boom2_1' + this.funcSet;
					this.f10 = 'boom3_1' + this.funcSet;
					this.f11 = 'boom4_1' + this.funcSet;
					this.f12 = 'boom5_1' + this.funcSet;
					this.print = 'boom6_1' + this.funcSet;
					this.scroll = 'boom7_1' + this.funcSet;
					this.pause = 'boom8_1' + this.funcSet;

					this.num = 1;
				}
				else if (this.num == 1) {
					this.num = 0;
					// this.clear();
					if (this.keyFlag2 == 0) {
						this.keyFlag2 = 1;
						setTimeout(() => {
							this.keyFlag2 = 0;
							this.esc = '' + this.funcSet;
							this.f1 = '' + this.funcSet;
							this.f2 = '' + this.funcSet;
							this.f3 = '' + this.funcSet;
							this.f4 = '' + this.funcSet;
							this.f5 = '' + this.funcSet;
							this.f6 = '' + this.funcSet;
							this.f7 = '' + this.funcSet;
							this.f8 = '' + this.funcSet;
							this.f9 = '' + this.funcSet;
							this.f10 = '' + this.funcSet;
							this.f11 = '' + this.funcSet;
							this.f12 = '' + this.funcSet;
							this.print = '' + this.funcSet;
							this.scroll = '' + this.funcSet;
							this.pause = '' + this.funcSet;
						}, 1000);
					}
					this.esc = 'boom8_2' + this.funcSet;
					this.f1 = 'boom7_2' + this.funcSet;
					this.f2 = 'boom6_2' + this.funcSet;
					this.f3 = 'boom5_2' + this.funcSet;
					this.f4 = 'boom4_2' + this.funcSet;
					this.f5 = 'boom3_2' + this.funcSet;
					this.f6 = 'boom2_2' + this.funcSet;
					this.f7 = 'boom1_2' + this.funcSet;
					this.f8 = 'boom2_2' + this.funcSet;
					this.f9 = 'boom3_2' + this.funcSet;
					this.f10 = 'boom4_2' + this.funcSet;
					this.f11 = 'boom5_2' + this.funcSet;
					this.f12 = 'boom6_2' + this.funcSet;
					this.print = 'boom7_2' + this.funcSet;
					this.scroll = 'boom8_2' + this.funcSet;
					this.pause = 'boom9_2' + this.funcSet;
				}
				break;

			case this.vKey == 120 && this.keyStatus == 1: //f9
				if (this.num == 0) {
					// this.clear();
					if (this.keyFlag1 == 0) {
						this.keyFlag1 = 1;
						setTimeout(() => {
							this.keyFlag1 = 0;
							this.esc = '' + this.funcSet;
							this.f1 = '' + this.funcSet;
							this.f2 = '' + this.funcSet;
							this.f3 = '' + this.funcSet;
							this.f4 = '' + this.funcSet;
							this.f5 = '' + this.funcSet;
							this.f6 = '' + this.funcSet;
							this.f7 = '' + this.funcSet;
							this.f8 = '' + this.funcSet;
							this.f9 = '' + this.funcSet;
							this.f10 = '' + this.funcSet;
							this.f11 = '' + this.funcSet;
							this.f12 = '' + this.funcSet;
							this.print = '' + this.funcSet;
							this.scroll = '' + this.funcSet;
							this.pause = '' + this.funcSet;
						}, 1000);
					}
					this.esc = 'boom10_1' + this.funcSet;
					this.f1 = 'boom9_1' + this.funcSet;
					this.f2 = 'boom8_1' + this.funcSet;
					this.f3 = 'boom7_1' + this.funcSet;
					this.f4 = 'boom6_1' + this.funcSet;
					this.f5 = 'boom5_1' + this.funcSet;
					this.f6 = 'boom4_1' + this.funcSet;
					this.f7 = 'boom3_1' + this.funcSet;
					this.f8 = 'boom2_1' + this.funcSet;
					this.f9 = 'boom1_1' + this.funcSet;
					this.f10 = 'boom2_1' + this.funcSet;
					this.f11 = 'boom3_1' + this.funcSet;
					this.f12 = 'boom4_1' + this.funcSet;
					this.print = 'boom5_1' + this.funcSet;
					this.scroll = 'boom6_1' + this.funcSet;
					this.pause = 'boom7_1' + this.funcSet;


					this.num = 1;
				}
				else if (this.num == 1) {
					this.num = 0;
					// this.clear();
					if (this.keyFlag2 == 0) {
						this.keyFlag2 = 1;
						setTimeout(() => {
							this.keyFlag2 = 0;
							this.esc = '' + this.funcSet;
							this.f1 = '' + this.funcSet;
							this.f2 = '' + this.funcSet;
							this.f3 = '' + this.funcSet;
							this.f4 = '' + this.funcSet;
							this.f5 = '' + this.funcSet;
							this.f6 = '' + this.funcSet;
							this.f7 = '' + this.funcSet;
							this.f8 = '' + this.funcSet;
							this.f9 = '' + this.funcSet;
							this.f10 = '' + this.funcSet;
							this.f11 = '' + this.funcSet;
							this.f12 = '' + this.funcSet;
							this.print = '' + this.funcSet;
							this.scroll = '' + this.funcSet;
							this.pause = '' + this.funcSet;
						}, 1000);
					}
					this.esc = 'boom10_2' + this.funcSet;
					this.f1 = 'boom9_2' + this.funcSet;
					this.f2 = 'boom8_2' + this.funcSet;
					this.f3 = 'boom7_2' + this.funcSet;
					this.f4 = 'boom6_2' + this.funcSet;
					this.f5 = 'boom5_2' + this.funcSet;
					this.f6 = 'boom4_2' + this.funcSet;
					this.f7 = 'boom3_2' + this.funcSet;
					this.f8 = 'boom2_2' + this.funcSet;
					this.f9 = 'boom1_2' + this.funcSet;
					this.f10 = 'boom2_2' + this.funcSet;
					this.f11 = 'boom3_2' + this.funcSet;
					this.f12 = 'boom4_2' + this.funcSet;
					this.print = 'boom5_2' + this.funcSet;
					this.scroll = 'boom6_2' + this.funcSet;
					this.pause = 'boom7_2' + this.funcSet;
				}
				break;

			case this.vKey == 121 && this.keyStatus == 1: //f10
				if (this.num == 0) {
					// this.clear();
					if (this.keyFlag1 == 0) {
						this.keyFlag1 = 1;
						setTimeout(() => {
							this.keyFlag1 = 0;
							this.esc = '' + this.funcSet;
							this.f1 = '' + this.funcSet;
							this.f2 = '' + this.funcSet;
							this.f3 = '' + this.funcSet;
							this.f4 = '' + this.funcSet;
							this.f5 = '' + this.funcSet;
							this.f6 = '' + this.funcSet;
							this.f7 = '' + this.funcSet;
							this.f8 = '' + this.funcSet;
							this.f9 = '' + this.funcSet;
							this.f10 = '' + this.funcSet;
							this.f11 = '' + this.funcSet;
							this.f12 = '' + this.funcSet;
							this.print = '' + this.funcSet;
							this.scroll = '' + this.funcSet;
							this.pause = '' + this.funcSet;
						}, 1000);
					}
					this.esc = 'boom11_1' + this.funcSet;
					this.f1 = 'boom10_1' + this.funcSet;
					this.f2 = 'boom9_1' + this.funcSet;
					this.f3 = 'boom8_1' + this.funcSet;
					this.f4 = 'boom7_1' + this.funcSet;
					this.f5 = 'boom6_1' + this.funcSet;
					this.f6 = 'boom5_1' + this.funcSet;
					this.f7 = 'boom4_1' + this.funcSet;
					this.f8 = 'boom3_1' + this.funcSet;
					this.f9 = 'boom2_1' + this.funcSet;
					this.f10 = 'boom1_1' + this.funcSet;
					this.f11 = 'boom2_1' + this.funcSet;
					this.f12 = 'boom3_1' + this.funcSet;
					this.print = 'boom4_1' + this.funcSet;
					this.scroll = 'boom5_1' + this.funcSet;
					this.pause = 'boom6_1' + this.funcSet;


					this.num = 1;
				}
				else if (this.num == 1) {
					this.num = 0;
					// this.clear();
					if (this.keyFlag2 == 0) {
						this.keyFlag2 = 1;
						setTimeout(() => {
							this.keyFlag2 = 0;
							this.esc = '' + this.funcSet;
							this.f1 = '' + this.funcSet;
							this.f2 = '' + this.funcSet;
							this.f3 = '' + this.funcSet;
							this.f4 = '' + this.funcSet;
							this.f5 = '' + this.funcSet;
							this.f6 = '' + this.funcSet;
							this.f7 = '' + this.funcSet;
							this.f8 = '' + this.funcSet;
							this.f9 = '' + this.funcSet;
							this.f10 = '' + this.funcSet;
							this.f11 = '' + this.funcSet;
							this.f12 = '' + this.funcSet;
							this.print = '' + this.funcSet;
							this.scroll = '' + this.funcSet;
							this.pause = '' + this.funcSet;
						}, 1000);
					}
					this.esc = 'boom11_2' + this.funcSet;
					this.f1 = 'boom10_2' + this.funcSet;
					this.f2 = 'boom9_2' + this.funcSet;
					this.f3 = 'boom8_2' + this.funcSet;
					this.f4 = 'boom7_2' + this.funcSet;
					this.f5 = 'boom6_2' + this.funcSet;
					this.f6 = 'boom5_2' + this.funcSet;
					this.f7 = 'boom4_2' + this.funcSet;
					this.f8 = 'boom3_2' + this.funcSet;
					this.f9 = 'boom2_2' + this.funcSet;
					this.f10 = 'boom1_2' + this.funcSet;
					this.f11 = 'boom2_2' + this.funcSet;
					this.f12 = 'boom3_2' + this.funcSet;
					this.print = 'boom4_2' + this.funcSet;
					this.scroll = 'boom5_2' + this.funcSet;
					this.pause = 'boom6_2' + this.funcSet;
				}
				break;

			case this.vKey == 122 && this.keyStatus == 1: //f11
				if (this.num == 0) {
					// this.clear();
					if (this.keyFlag1 == 0) {
						this.keyFlag1 = 1;
						setTimeout(() => {
							this.keyFlag1 = 0;
							this.esc = '' + this.funcSet;
							this.f1 = '' + this.funcSet;
							this.f2 = '' + this.funcSet;
							this.f3 = '' + this.funcSet;
							this.f4 = '' + this.funcSet;
							this.f5 = '' + this.funcSet;
							this.f6 = '' + this.funcSet;
							this.f7 = '' + this.funcSet;
							this.f8 = '' + this.funcSet;
							this.f9 = '' + this.funcSet;
							this.f10 = '' + this.funcSet;
							this.f11 = '' + this.funcSet;
							this.f12 = '' + this.funcSet;
							this.print = '' + this.funcSet;
							this.scroll = '' + this.funcSet;
							this.pause = '' + this.funcSet;
						}, 1000);
					}
					this.esc = 'boom12_1' + this.funcSet;
					this.f1 = 'boom11_1' + this.funcSet;
					this.f2 = 'boom10_1' + this.funcSet;
					this.f3 = 'boom9_1' + this.funcSet;
					this.f4 = 'boom8_1' + this.funcSet;
					this.f5 = 'boom7_1' + this.funcSet;
					this.f6 = 'boom6_1' + this.funcSet;
					this.f7 = 'boom5_1' + this.funcSet;
					this.f8 = 'boom4_1' + this.funcSet;
					this.f9 = 'boom3_1' + this.funcSet;
					this.f10 = 'boom2_1' + this.funcSet;
					this.f11 = 'boom1_1' + this.funcSet;
					this.f12 = 'boom2_1' + this.funcSet;
					this.print = 'boom3_1' + this.funcSet;
					this.scroll = 'boom4_1' + this.funcSet;
					this.pause = 'boom5_1' + this.funcSet;
					this.num = 1;
				}
				else if (this.num == 1) {
					this.num = 0;
					// this.clear();
					if (this.keyFlag2 == 0) {
						this.keyFlag2 = 1;
						setTimeout(() => {
							this.keyFlag2 = 0;
							this.esc = '' + this.funcSet;
							this.f1 = '' + this.funcSet;
							this.f2 = '' + this.funcSet;
							this.f3 = '' + this.funcSet;
							this.f4 = '' + this.funcSet;
							this.f5 = '' + this.funcSet;
							this.f6 = '' + this.funcSet;
							this.f7 = '' + this.funcSet;
							this.f8 = '' + this.funcSet;
							this.f9 = '' + this.funcSet;
							this.f10 = '' + this.funcSet;
							this.f11 = '' + this.funcSet;
							this.f12 = '' + this.funcSet;
							this.print = '' + this.funcSet;
							this.scroll = '' + this.funcSet;
							this.pause = '' + this.funcSet;
						}, 1000);
					}
					this.esc = 'boom12_2' + this.funcSet;
					this.f1 = 'boom11_2' + this.funcSet;
					this.f2 = 'boom10_2' + this.funcSet;
					this.f3 = 'boom9_2' + this.funcSet;
					this.f4 = 'boom8_2' + this.funcSet;
					this.f5 = 'boom7_2' + this.funcSet;
					this.f6 = 'boom6_2' + this.funcSet;
					this.f7 = 'boom5_2' + this.funcSet;
					this.f8 = 'boom4_2' + this.funcSet;
					this.f9 = 'boom3_2' + this.funcSet;
					this.f10 = 'boom2_2' + this.funcSet;
					this.f11 = 'boom1_2' + this.funcSet;
					this.f12 = 'boom2_2' + this.funcSet;
					this.print = 'boom3_2' + this.funcSet;
					this.scroll = 'boom4_2' + this.funcSet;
					this.pause = 'boom5_2' + this.funcSet;
				}
				break;

			case this.vKey == 123 && this.keyStatus == 1: //f12
				if (this.num == 0) {
					// this.clear();
					if (this.keyFlag1 == 0) {
						this.keyFlag1 = 1;
						setTimeout(() => {
							this.keyFlag1 = 0;
							this.esc = '' + this.funcSet;
							this.f1 = '' + this.funcSet;
							this.f2 = '' + this.funcSet;
							this.f3 = '' + this.funcSet;
							this.f4 = '' + this.funcSet;
							this.f5 = '' + this.funcSet;
							this.f6 = '' + this.funcSet;
							this.f7 = '' + this.funcSet;
							this.f8 = '' + this.funcSet;
							this.f9 = '' + this.funcSet;
							this.f10 = '' + this.funcSet;
							this.f11 = '' + this.funcSet;
							this.f12 = '' + this.funcSet;
							this.print = '' + this.funcSet;
							this.scroll = '' + this.funcSet;
							this.pause = '' + this.funcSet;
						}, 1000);
					}
					this.esc = 'boom13_1' + this.funcSet;
					this.f1 = 'boom12_1' + this.funcSet;
					this.f2 = 'boom11_1' + this.funcSet;
					this.f3 = 'boom10_1' + this.funcSet;
					this.f4 = 'boom9_1' + this.funcSet;
					this.f5 = 'boom8_1' + this.funcSet;
					this.f6 = 'boom7_1' + this.funcSet;
					this.f7 = 'boom6_1' + this.funcSet;
					this.f8 = 'boom5_1' + this.funcSet;
					this.f9 = 'boom4_1' + this.funcSet;
					this.f10 = 'boom3_1' + this.funcSet;
					this.f11 = 'boom2_1' + this.funcSet;
					this.f12 = 'boom1_1' + this.funcSet;
					this.print = 'boom2_1' + this.funcSet;
					this.scroll = 'boom3_1' + this.funcSet;
					this.pause = 'boom4_1' + this.funcSet;


					this.num = 1;
				}
				else if (this.num == 1) {
					this.num = 0;
					// this.clear();
					if (this.keyFlag2 == 0) {
						this.keyFlag2 = 1;
						setTimeout(() => {
							this.keyFlag2 = 0;
							this.esc = '' + this.funcSet;
							this.f1 = '' + this.funcSet;
							this.f2 = '' + this.funcSet;
							this.f3 = '' + this.funcSet;
							this.f4 = '' + this.funcSet;
							this.f5 = '' + this.funcSet;
							this.f6 = '' + this.funcSet;
							this.f7 = '' + this.funcSet;
							this.f8 = '' + this.funcSet;
							this.f9 = '' + this.funcSet;
							this.f10 = '' + this.funcSet;
							this.f11 = '' + this.funcSet;
							this.f12 = '' + this.funcSet;
							this.print = '' + this.funcSet;
							this.scroll = '' + this.funcSet;
							this.pause = '' + this.funcSet;
						}, 1000);
					}
					this.esc = 'boom13_2' + this.funcSet;
					this.f1 = 'boom12_2' + this.funcSet;
					this.f2 = 'boom11_2' + this.funcSet;
					this.f3 = 'boom10_2' + this.funcSet;
					this.f4 = 'boom9_2' + this.funcSet;
					this.f5 = 'boom8_2' + this.funcSet;
					this.f6 = 'boom7_2' + this.funcSet;
					this.f7 = 'boom6_2' + this.funcSet;
					this.f8 = 'boom5_2' + this.funcSet;
					this.f9 = 'boom4_2' + this.funcSet;
					this.f10 = 'boom3_2' + this.funcSet;
					this.f11 = 'boom2_2' + this.funcSet;
					this.f12 = 'boom1_2' + this.funcSet;
					this.print = 'boom2_2' + this.funcSet;
					this.scroll = 'boom3_2' + this.funcSet;
					this.pause = 'boom4_2' + this.funcSet;


				}
				break;

			case this.vKey == 145 && this.keyStatus == 1: //scroll
				if (this.num == 0) {
					// this.clear();
					if (this.keyFlag1 == 0) {
						this.keyFlag1 = 1;
						setTimeout(() => {
							this.keyFlag1 = 0;
							this.esc = '' + this.funcSet;
							this.f1 = '' + this.funcSet;
							this.f2 = '' + this.funcSet;
							this.f3 = '' + this.funcSet;
							this.f4 = '' + this.funcSet;
							this.f5 = '' + this.funcSet;
							this.f6 = '' + this.funcSet;
							this.f7 = '' + this.funcSet;
							this.f8 = '' + this.funcSet;
							this.f9 = '' + this.funcSet;
							this.f10 = '' + this.funcSet;
							this.f11 = '' + this.funcSet;
							this.f12 = '' + this.funcSet;
							this.print = '' + this.funcSet;
							this.scroll = '' + this.funcSet;
							this.pause = '' + this.funcSet;
						}, 1000);
					}
					this.esc = 'boom15_1' + this.funcSet;
					this.f1 = 'boom14_1' + this.funcSet;
					this.f2 = 'boom13_1' + this.funcSet;
					this.f3 = 'boom12_1' + this.funcSet;
					this.f4 = 'boom11_1' + this.funcSet;
					this.f5 = 'boom10_1' + this.funcSet;
					this.f6 = 'boom9_1' + this.funcSet;
					this.f7 = 'boom8_1' + this.funcSet;
					this.f8 = 'boom7_1' + this.funcSet;
					this.f9 = 'boom6_1' + this.funcSet;
					this.f10 = 'boom5_1' + this.funcSet;
					this.f11 = 'boom4_1' + this.funcSet;
					this.f12 = 'boom3_1' + this.funcSet;
					this.print = 'boom2_1' + this.funcSet;
					this.scroll = 'boom1_1' + this.funcSet;
					this.pause = 'boom2_1' + this.funcSet;

					this.num = 1;
				}
				else if (this.num == 1) {
					this.num = 0;
					// this.clear();
					if (this.keyFlag2 == 0) {
						this.keyFlag2 = 1;
						setTimeout(() => {
							this.keyFlag2 = 0;
							this.esc = '' + this.funcSet;
							this.f1 = '' + this.funcSet;
							this.f2 = '' + this.funcSet;
							this.f3 = '' + this.funcSet;
							this.f4 = '' + this.funcSet;
							this.f5 = '' + this.funcSet;
							this.f6 = '' + this.funcSet;
							this.f7 = '' + this.funcSet;
							this.f8 = '' + this.funcSet;
							this.f9 = '' + this.funcSet;
							this.f10 = '' + this.funcSet;
							this.f11 = '' + this.funcSet;
							this.f12 = '' + this.funcSet;
							this.print = '' + this.funcSet;
							this.scroll = '' + this.funcSet;
							this.pause = '' + this.funcSet;
						}, 1000);
					}
					this.esc = 'boom15_2' + this.funcSet;
					this.f1 = 'boom14_2' + this.funcSet;
					this.f2 = 'boom13_2' + this.funcSet;
					this.f3 = 'boom12_2' + this.funcSet;
					this.f4 = 'boom11_2' + this.funcSet;
					this.f5 = 'boom10_2' + this.funcSet;
					this.f6 = 'boom9_2' + this.funcSet;
					this.f7 = 'boom8_2' + this.funcSet;
					this.f8 = 'boom7_2' + this.funcSet;
					this.f9 = 'boom6_2' + this.funcSet;
					this.f10 = 'boom5_2' + this.funcSet;
					this.f11 = 'boom4_2' + this.funcSet;
					this.f12 = 'boom3_2' + this.funcSet;
					this.print = 'boom2_2' + this.funcSet;
					this.scroll = 'boom1_2' + this.funcSet;
					this.pause = 'boom2_2' + this.funcSet;
				}
				break;

			case this.vKey == 19 && this.keyStatus == 1: //pause
				if (this.num == 0) {
					// this.clear();
					if (this.keyFlag1 == 0) {
						this.keyFlag1 = 1;
						setTimeout(() => {
							this.keyFlag1 = 0;
							this.esc = '' + this.funcSet;
							this.f1 = '' + this.funcSet;
							this.f2 = '' + this.funcSet;
							this.f3 = '' + this.funcSet;
							this.f4 = '' + this.funcSet;
							this.f5 = '' + this.funcSet;
							this.f6 = '' + this.funcSet;
							this.f7 = '' + this.funcSet;
							this.f8 = '' + this.funcSet;
							this.f9 = '' + this.funcSet;
							this.f10 = '' + this.funcSet;
							this.f11 = '' + this.funcSet;
							this.f12 = '' + this.funcSet;
							this.print = '' + this.funcSet;
							this.scroll = '' + this.funcSet;
							this.pause = '' + this.funcSet;
						}, 1000);
					}
					this.esc = 'boom16_1' + this.funcSet;
					this.f1 = 'boom15_1' + this.funcSet;
					this.f2 = 'boom14_1' + this.funcSet;
					this.f3 = 'boom13_1' + this.funcSet;
					this.f4 = 'boom12_1' + this.funcSet;
					this.f5 = 'boom11_1' + this.funcSet;
					this.f6 = 'boom10_1' + this.funcSet;
					this.f7 = 'boom9_1' + this.funcSet;
					this.f8 = 'boom8_1' + this.funcSet;
					this.f9 = 'boom7_1' + this.funcSet;
					this.f10 = 'boom6_1' + this.funcSet;
					this.f11 = 'boom5_1' + this.funcSet;
					this.f12 = 'boom4_1' + this.funcSet;
					this.print = 'boom3_1' + this.funcSet;
					this.scroll = 'boom2_1' + this.funcSet;
					this.pause = 'boom1_1' + this.funcSet;

					this.num = 1;
				}
				else if (this.num == 1) {
					this.num = 0;
					// this.clear();
					if (this.keyFlag2 == 0) {
						this.keyFlag2 = 1;
						setTimeout(() => {
							this.keyFlag2 = 0;
							this.esc = '' + this.funcSet;
							this.f1 = '' + this.funcSet;
							this.f2 = '' + this.funcSet;
							this.f3 = '' + this.funcSet;
							this.f4 = '' + this.funcSet;
							this.f5 = '' + this.funcSet;
							this.f6 = '' + this.funcSet;
							this.f7 = '' + this.funcSet;
							this.f8 = '' + this.funcSet;
							this.f9 = '' + this.funcSet;
							this.f10 = '' + this.funcSet;
							this.f11 = '' + this.funcSet;
							this.f12 = '' + this.funcSet;
							this.print = '' + this.funcSet;
							this.scroll = '' + this.funcSet;
							this.pause = '' + this.funcSet;
						}, 1000);
					}
					this.esc = 'boom16_2' + this.funcSet;
					this.f1 = 'boom15_2' + this.funcSet;
					this.f2 = 'boom14_2' + this.funcSet;
					this.f3 = 'boom13_2' + this.funcSet;
					this.f4 = 'boom12_2' + this.funcSet;
					this.f5 = 'boom11_2' + this.funcSet;
					this.f6 = 'boom10_2' + this.funcSet;
					this.f7 = 'boom9_2' + this.funcSet;
					this.f8 = 'boom8_2' + this.funcSet;
					this.f9 = 'boom7_2' + this.funcSet;
					this.f10 = 'boom6_2' + this.funcSet;
					this.f11 = 'boom5_2' + this.funcSet;
					this.f12 = 'boom4_2' + this.funcSet;
					this.print = 'boom3_2' + this.funcSet;
					this.scroll = 'boom2_2' + this.funcSet;
					this.pause = 'boom1_2' + this.funcSet;

				}
				break;

			case this.vKey == 192 && this.keyStatus == 1: //perid
				if (this.num == 0) {
					// this.clear();
					if (this.keyFlag1 == 0) {
						this.keyFlag1 = 1;
						setTimeout(() => {
							this.keyFlag1 = 0;
							this.perid = "" + this.funcSet;
							this.n1 = "" + this.funcSet;
							this.n2 = "" + this.funcSet;
							this.n3 = "" + this.funcSet;
							this.n4 = "" + this.funcSet;
							this.n5 = "" + this.funcSet;
							this.n6 = "" + this.funcSet;
							this.n7 = "" + this.funcSet;
							this.n8 = "" + this.funcSet;
							this.n9 = "" + this.funcSet;
							this.n0 = "" + this.funcSet;
							this.minus = "" + this.funcSet;
							this.plus = "" + this.funcSet;
							this.bsp = "" + this.funcSet;
							this.insert = "" + this.funcSet;
							this.home = "" + this.funcSet;
							this.pup = "" + this.funcSet;
							this.numlock = "" + this.funcSet;
							this.numdrawn = "" + this.funcSet;
							this.numtimes = "" + this.funcSet;
							this.numminus = "" + this.funcSet;
						}, 1000);
					}
					this.perid = "boom1_1" + this.funcSet;
					this.n1 = "boom2_1" + this.funcSet;
					this.n2 = "boom3_1" + this.funcSet;
					this.n3 = "boom4_1" + this.funcSet;
					this.n4 = "boom5_1" + this.funcSet;
					this.n5 = "boom6_1" + this.funcSet;
					this.n6 = "boom7_1" + this.funcSet;
					this.n7 = "boom8_1" + this.funcSet;
					this.n8 = "boom9_1" + this.funcSet;
					this.n9 = "boom10_1" + this.funcSet;
					this.n0 = "boom11_1" + this.funcSet;
					this.minus = "boom12_1" + this.funcSet;
					this.plus = "boom13_1" + this.funcSet;
					this.bsp = "boom14_1" + this.funcSet;
					this.insert = "boom15_1" + this.funcSet;
					this.home = "boom16_1" + this.funcSet;
					this.pup = "boom17_1" + this.funcSet;
					this.numlock = "boom18_1" + this.funcSet;
					this.numdrawn = "boom19_1" + this.funcSet;
					this.numtimes = "boom20_1" + this.funcSet;
					this.numminus = "boom21_1" + this.funcSet;
					this.num = 1;
				}
				else if (this.num == 1) {
					this.num = 0;
					// this.clear();
					if (this.keyFlag2 == 0) {
						this.keyFlag2 = 1;
						setTimeout(() => {
							this.keyFlag2 = 0;
							this.perid = "" + this.funcSet;
							this.n1 = "" + this.funcSet;
							this.n2 = "" + this.funcSet;
							this.n3 = "" + this.funcSet;
							this.n4 = "" + this.funcSet;
							this.n5 = "" + this.funcSet;
							this.n6 = "" + this.funcSet;
							this.n7 = "" + this.funcSet;
							this.n8 = "" + this.funcSet;
							this.n9 = "" + this.funcSet;
							this.n0 = "" + this.funcSet;
							this.minus = "" + this.funcSet;
							this.plus = "" + this.funcSet;
							this.bsp = "" + this.funcSet;
							this.insert = "" + this.funcSet;
							this.home = "" + this.funcSet;
							this.pup = "" + this.funcSet;
							this.numlock = "" + this.funcSet;
							this.numdrawn = "" + this.funcSet;
							this.numtimes = "" + this.funcSet;
							this.numminus = "" + this.funcSet;
						}, 1000);
					}
					this.perid = "boom1_2" + this.funcSet;
					this.n1 = "boom2_2" + this.funcSet;
					this.n2 = "boom3_2" + this.funcSet;
					this.n3 = "boom4_2" + this.funcSet;
					this.n4 = "boom5_2" + this.funcSet;
					this.n5 = "boom6_2" + this.funcSet;
					this.n6 = "boom7_2" + this.funcSet;
					this.n7 = "boom8_2" + this.funcSet;
					this.n8 = "boom9_2" + this.funcSet;
					this.n9 = "boom10_2" + this.funcSet;
					this.n0 = "boom11_2" + this.funcSet;
					this.minus = "boom12_2" + this.funcSet;
					this.plus = "boom13_2" + this.funcSet;
					this.bsp = "boom14_2" + this.funcSet;
					this.insert = "boom15_2" + this.funcSet;
					this.home = "boom16_2" + this.funcSet;
					this.pup = "boom17_2" + this.funcSet;
					this.numlock = "boom18_2" + this.funcSet;
					this.numdrawn = "boom19_2" + this.funcSet;
					this.numtimes = "boom20_2" + this.funcSet;
					this.numminus = "boom21_2" + this.funcSet;
				}
				break;

			case this.vKey == 49 && this.keyStatus == 1: //n1
				if (this.num == 0) {
					// this.clear();
					if (this.keyFlag1 == 0) {
						this.keyFlag1 = 1;
						setTimeout(() => {
							this.keyFlag1 = 0;
							this.perid = "" + this.funcSet;
							this.n1 = "" + this.funcSet;
							this.n2 = "" + this.funcSet;
							this.n3 = "" + this.funcSet;
							this.n4 = "" + this.funcSet;
							this.n5 = "" + this.funcSet;
							this.n6 = "" + this.funcSet;
							this.n7 = "" + this.funcSet;
							this.n8 = "" + this.funcSet;
							this.n9 = "" + this.funcSet;
							this.n0 = "" + this.funcSet;
							this.minus = "" + this.funcSet;
							this.plus = "" + this.funcSet;
							this.bsp = "" + this.funcSet;
							this.insert = "" + this.funcSet;
							this.home = "" + this.funcSet;
							this.pup = "" + this.funcSet;
							this.numlock = "" + this.funcSet;
							this.numdrawn = "" + this.funcSet;
							this.numtimes = "" + this.funcSet;
							this.numminus = "" + this.funcSet;
						}, 1000);
					}
					this.perid = "boom2_1" + this.funcSet;
					this.n1 = "boom1_1" + this.funcSet;
					this.n2 = "boom2_1" + this.funcSet;
					this.n3 = "boom3_1" + this.funcSet;
					this.n4 = "boom4_1" + this.funcSet;
					this.n5 = "boom5_1" + this.funcSet;
					this.n6 = "boom6_1" + this.funcSet;
					this.n7 = "boom7_1" + this.funcSet;
					this.n8 = "boom8_1" + this.funcSet;
					this.n9 = "boom9_1" + this.funcSet;
					this.n0 = "boom10_1" + this.funcSet;
					this.minus = "boom11_1" + this.funcSet;
					this.plus = "boom12_1" + this.funcSet;
					this.bsp = "boom13_1" + this.funcSet;
					this.insert = "boom14_1" + this.funcSet;
					this.home = "boom15_1" + this.funcSet;
					this.pup = "boom16_1" + this.funcSet;
					this.numlock = "boom17_1" + this.funcSet;
					this.numdrawn = "boom18_1" + this.funcSet;
					this.numtimes = "boom19_1" + this.funcSet;
					this.numminus = "boom20_1" + this.funcSet;

					this.num = 1;
				}
				else if (this.num == 1) {
					this.num = 0;
					// this.clear();
					if (this.keyFlag2 == 0) {
						this.keyFlag2 = 1;
						setTimeout(() => {
							this.keyFlag2 = 0;
							this.perid = "" + this.funcSet;
							this.n1 = "" + this.funcSet;
							this.n2 = "" + this.funcSet;
							this.n3 = "" + this.funcSet;
							this.n4 = "" + this.funcSet;
							this.n5 = "" + this.funcSet;
							this.n6 = "" + this.funcSet;
							this.n7 = "" + this.funcSet;
							this.n8 = "" + this.funcSet;
							this.n9 = "" + this.funcSet;
							this.n0 = "" + this.funcSet;
							this.minus = "" + this.funcSet;
							this.plus = "" + this.funcSet;
							this.bsp = "" + this.funcSet;
							this.insert = "" + this.funcSet;
							this.home = "" + this.funcSet;
							this.pup = "" + this.funcSet;
							this.numlock = "" + this.funcSet;
							this.numdrawn = "" + this.funcSet;
							this.numtimes = "" + this.funcSet;
							this.numminus = "" + this.funcSet;
						}, 1000);
					}
					this.perid = "boom2_2" + this.funcSet;
					this.n1 = "boom1_2" + this.funcSet;
					this.n2 = "boom2_2" + this.funcSet;
					this.n3 = "boom3_2" + this.funcSet;
					this.n4 = "boom4_2" + this.funcSet;
					this.n5 = "boom5_2" + this.funcSet;
					this.n6 = "boom6_2" + this.funcSet;
					this.n7 = "boom7_2" + this.funcSet;
					this.n8 = "boom8_2" + this.funcSet;
					this.n9 = "boom9_2" + this.funcSet;
					this.n0 = "boom10_2" + this.funcSet;
					this.minus = "boom11_2" + this.funcSet;
					this.plus = "boom12_2" + this.funcSet;
					this.bsp = "boom13_2" + this.funcSet;
					this.insert = "boom14_2" + this.funcSet;
					this.home = "boom15_2" + this.funcSet;
					this.pup = "boom16_2" + this.funcSet;
					this.numlock = "boom17_2" + this.funcSet;
					this.numdrawn = "boom18_2" + this.funcSet;
					this.numtimes = "boom19_2" + this.funcSet;
					this.numminus = "boom20_2" + this.funcSet;

				}
				break;

			case this.vKey == 50 && this.keyStatus == 1: //n2
				if (this.num == 0) {
					// this.clear();
					if (this.keyFlag1 == 0) {
						this.keyFlag1 = 1;
						setTimeout(() => {
							this.keyFlag1 = 0;
							this.perid = "" + this.funcSet;
							this.n1 = "" + this.funcSet;
							this.n2 = "" + this.funcSet;
							this.n3 = "" + this.funcSet;
							this.n4 = "" + this.funcSet;
							this.n5 = "" + this.funcSet;
							this.n6 = "" + this.funcSet;
							this.n7 = "" + this.funcSet;
							this.n8 = "" + this.funcSet;
							this.n9 = "" + this.funcSet;
							this.n0 = "" + this.funcSet;
							this.minus = "" + this.funcSet;
							this.plus = "" + this.funcSet;
							this.bsp = "" + this.funcSet;
							this.insert = "" + this.funcSet;
							this.home = "" + this.funcSet;
							this.pup = "" + this.funcSet;
							this.numlock = "" + this.funcSet;
							this.numdrawn = "" + this.funcSet;
							this.numtimes = "" + this.funcSet;
							this.numminus = "" + this.funcSet;
						}, 1000);
					}
					this.perid = "boom3_1" + this.funcSet;
					this.n1 = "boom2_1" + this.funcSet;
					this.n2 = "boom1_1" + this.funcSet;
					this.n3 = "boom2_1" + this.funcSet;
					this.n4 = "boom3_1" + this.funcSet;
					this.n5 = "boom4_1" + this.funcSet;
					this.n6 = "boom5_1" + this.funcSet;
					this.n7 = "boom6_1" + this.funcSet;
					this.n8 = "boom7_1" + this.funcSet;
					this.n9 = "boom8_1" + this.funcSet;
					this.n0 = "boom9_1" + this.funcSet;
					this.minus = "boom10_1" + this.funcSet;
					this.plus = "boom11_1" + this.funcSet;
					this.bsp = "boom12_1" + this.funcSet;
					this.insert = "boom13_1" + this.funcSet;
					this.home = "boom14_1" + this.funcSet;
					this.pup = "boom15_1" + this.funcSet;
					this.numlock = "boom16_1" + this.funcSet;
					this.numdrawn = "boom17_1" + this.funcSet;
					this.numtimes = "boom18_1" + this.funcSet;
					this.numminus = "boom19_1" + this.funcSet;

					this.num = 1;
				}
				else if (this.num == 1) {
					this.num = 0;
					// this.clear();
					if (this.keyFlag2 == 0) {
						this.keyFlag2 = 1;
						setTimeout(() => {
							this.keyFlag2 = 0;
							this.perid = "" + this.funcSet;
							this.n1 = "" + this.funcSet;
							this.n2 = "" + this.funcSet;
							this.n3 = "" + this.funcSet;
							this.n4 = "" + this.funcSet;
							this.n5 = "" + this.funcSet;
							this.n6 = "" + this.funcSet;
							this.n7 = "" + this.funcSet;
							this.n8 = "" + this.funcSet;
							this.n9 = "" + this.funcSet;
							this.n0 = "" + this.funcSet;
							this.minus = "" + this.funcSet;
							this.plus = "" + this.funcSet;
							this.bsp = "" + this.funcSet;
							this.insert = "" + this.funcSet;
							this.home = "" + this.funcSet;
							this.pup = "" + this.funcSet;
							this.numlock = "" + this.funcSet;
							this.numdrawn = "" + this.funcSet;
							this.numtimes = "" + this.funcSet;
							this.numminus = "" + this.funcSet;
						}, 1000);
					}
					this.perid = "boom3_2" + this.funcSet;
					this.n1 = "boom2_2" + this.funcSet;
					this.n2 = "boom1_2" + this.funcSet;
					this.n3 = "boom2_2" + this.funcSet;
					this.n4 = "boom3_2" + this.funcSet;
					this.n5 = "boom4_2" + this.funcSet;
					this.n6 = "boom5_2" + this.funcSet;
					this.n7 = "boom6_2" + this.funcSet;
					this.n8 = "boom7_2" + this.funcSet;
					this.n9 = "boom8_2" + this.funcSet;
					this.n0 = "boom9_2" + this.funcSet;
					this.minus = "boom10_2" + this.funcSet;
					this.plus = "boom11_2" + this.funcSet;
					this.bsp = "boom12_2" + this.funcSet;
					this.insert = "boom13_2" + this.funcSet;
					this.home = "boom14_2" + this.funcSet;
					this.pup = "boom15_2" + this.funcSet;
					this.numlock = "boom16_2" + this.funcSet;
					this.numdrawn = "boom17_2" + this.funcSet;
					this.numtimes = "boom18_2" + this.funcSet;
					this.numminus = "boom19_2" + this.funcSet;

				}
				break;

			case this.vKey == 51 && this.keyStatus == 1: //n3
				if (this.num == 0) {
					// this.clear();
					if (this.keyFlag1 == 0) {
						this.keyFlag1 = 1;
						setTimeout(() => {
							this.keyFlag1 = 0;
							this.perid = "" + this.funcSet;
							this.n1 = "" + this.funcSet;
							this.n2 = "" + this.funcSet;
							this.n3 = "" + this.funcSet;
							this.n4 = "" + this.funcSet;
							this.n5 = "" + this.funcSet;
							this.n6 = "" + this.funcSet;
							this.n7 = "" + this.funcSet;
							this.n8 = "" + this.funcSet;
							this.n9 = "" + this.funcSet;
							this.n0 = "" + this.funcSet;
							this.minus = "" + this.funcSet;
							this.plus = "" + this.funcSet;
							this.bsp = "" + this.funcSet;
							this.insert = "" + this.funcSet;
							this.home = "" + this.funcSet;
							this.pup = "" + this.funcSet;
							this.numlock = "" + this.funcSet;
							this.numdrawn = "" + this.funcSet;
							this.numtimes = "" + this.funcSet;
							this.numminus = "" + this.funcSet;
						}, 1000);
					}
					this.perid = "boom4_1" + this.funcSet;
					this.n1 = "boom3_1" + this.funcSet;
					this.n2 = "boom2_1" + this.funcSet;
					this.n3 = "boom1_1" + this.funcSet;
					this.n4 = "boom2_1" + this.funcSet;
					this.n5 = "boom3_1" + this.funcSet;
					this.n6 = "boom4_1" + this.funcSet;
					this.n7 = "boom5_1" + this.funcSet;
					this.n8 = "boom6_1" + this.funcSet;
					this.n9 = "boom7_1" + this.funcSet;
					this.n0 = "boom8_1" + this.funcSet;
					this.minus = "boom9_1" + this.funcSet;
					this.plus = "boom10_1" + this.funcSet;
					this.bsp = "boom11_1" + this.funcSet;
					this.insert = "boom12_1" + this.funcSet;
					this.home = "boom13_1" + this.funcSet;
					this.pup = "boom14_1" + this.funcSet;
					this.numlock = "boom15_1" + this.funcSet;
					this.numdrawn = "boom16_1" + this.funcSet;
					this.numtimes = "boom17_1" + this.funcSet;
					this.numminus = "boom18_1" + this.funcSet;

					this.num = 1;
				}
				else if (this.num == 1) {
					this.num = 0;
					// this.clear();
					if (this.keyFlag2 == 0) {
						this.keyFlag2 = 1;
						setTimeout(() => {
							this.keyFlag2 = 0;
							this.perid = "" + this.funcSet;
							this.n1 = "" + this.funcSet;
							this.n2 = "" + this.funcSet;
							this.n3 = "" + this.funcSet;
							this.n4 = "" + this.funcSet;
							this.n5 = "" + this.funcSet;
							this.n6 = "" + this.funcSet;
							this.n7 = "" + this.funcSet;
							this.n8 = "" + this.funcSet;
							this.n9 = "" + this.funcSet;
							this.n0 = "" + this.funcSet;
							this.minus = "" + this.funcSet;
							this.plus = "" + this.funcSet;
							this.bsp = "" + this.funcSet;
							this.insert = "" + this.funcSet;
							this.home = "" + this.funcSet;
							this.pup = "" + this.funcSet;
							this.numlock = "" + this.funcSet;
							this.numdrawn = "" + this.funcSet;
							this.numtimes = "" + this.funcSet;
							this.numminus = "" + this.funcSet;
						}, 1000);
					}
					this.perid = "boom4_2" + this.funcSet;
					this.n1 = "boom3_2" + this.funcSet;
					this.n2 = "boom2_2" + this.funcSet;
					this.n3 = "boom1_2" + this.funcSet;
					this.n4 = "boom2_2" + this.funcSet;
					this.n5 = "boom3_2" + this.funcSet;
					this.n6 = "boom4_2" + this.funcSet;
					this.n7 = "boom5_2" + this.funcSet;
					this.n8 = "boom6_2" + this.funcSet;
					this.n9 = "boom7_2" + this.funcSet;
					this.n0 = "boom8_2" + this.funcSet;
					this.minus = "boom9_2" + this.funcSet;
					this.plus = "boom10_2" + this.funcSet;
					this.bsp = "boom11_2" + this.funcSet;
					this.insert = "boom12_2" + this.funcSet;
					this.home = "boom13_2" + this.funcSet;
					this.pup = "boom14_2" + this.funcSet;
					this.numlock = "boom15_2" + this.funcSet;
					this.numdrawn = "boom16_2" + this.funcSet;
					this.numtimes = "boom17_2" + this.funcSet;
					this.numminus = "boom18_2" + this.funcSet;

				}
				break;

			case this.vKey == 52 && this.keyStatus == 1: //n4
				if (this.num == 0) {
					// this.clear();
					if (this.keyFlag1 == 0) {
						this.keyFlag1 = 1;
						setTimeout(() => {
							this.keyFlag1 = 0;
							this.perid = "" + this.funcSet;
							this.n1 = "" + this.funcSet;
							this.n2 = "" + this.funcSet;
							this.n3 = "" + this.funcSet;
							this.n4 = "" + this.funcSet;
							this.n5 = "" + this.funcSet;
							this.n6 = "" + this.funcSet;
							this.n7 = "" + this.funcSet;
							this.n8 = "" + this.funcSet;
							this.n9 = "" + this.funcSet;
							this.n0 = "" + this.funcSet;
							this.minus = "" + this.funcSet;
							this.plus = "" + this.funcSet;
							this.bsp = "" + this.funcSet;
							this.insert = "" + this.funcSet;
							this.home = "" + this.funcSet;
							this.pup = "" + this.funcSet;
							this.numlock = "" + this.funcSet;
							this.numdrawn = "" + this.funcSet;
							this.numtimes = "" + this.funcSet;
							this.numminus = "" + this.funcSet;
						}, 1000);
					}
					this.perid = "boom5_1" + this.funcSet;
					this.n1 = "boom4_1" + this.funcSet;
					this.n2 = "boom3_1" + this.funcSet;
					this.n3 = "boom2_1" + this.funcSet;
					this.n4 = "boom1_1" + this.funcSet;
					this.n5 = "boom2_1" + this.funcSet;
					this.n6 = "boom3_1" + this.funcSet;
					this.n7 = "boom4_1" + this.funcSet;
					this.n8 = "boom5_1" + this.funcSet;
					this.n9 = "boom6_1" + this.funcSet;
					this.n0 = "boom7_1" + this.funcSet;
					this.minus = "boom8_1" + this.funcSet;
					this.plus = "boom9_1" + this.funcSet;
					this.bsp = "boom10_1" + this.funcSet;
					this.insert = "boom11_1" + this.funcSet;
					this.home = "boom12_1" + this.funcSet;
					this.pup = "boom13_1" + this.funcSet;
					this.numlock = "boom14_1" + this.funcSet;
					this.numdrawn = "boom15_1" + this.funcSet;
					this.numtimes = "boom16_1" + this.funcSet;
					this.numminus = "boom17_1" + this.funcSet;

					this.num = 1;
				}
				else if (this.num == 1) {
					this.num = 0;
					// this.clear();
					if (this.keyFlag2 == 0) {
						this.keyFlag2 = 1;
						setTimeout(() => {
							this.keyFlag2 = 0;
							this.perid = "" + this.funcSet;
							this.n1 = "" + this.funcSet;
							this.n2 = "" + this.funcSet;
							this.n3 = "" + this.funcSet;
							this.n4 = "" + this.funcSet;
							this.n5 = "" + this.funcSet;
							this.n6 = "" + this.funcSet;
							this.n7 = "" + this.funcSet;
							this.n8 = "" + this.funcSet;
							this.n9 = "" + this.funcSet;
							this.n0 = "" + this.funcSet;
							this.minus = "" + this.funcSet;
							this.plus = "" + this.funcSet;
							this.bsp = "" + this.funcSet;
							this.insert = "" + this.funcSet;
							this.home = "" + this.funcSet;
							this.pup = "" + this.funcSet;
							this.numlock = "" + this.funcSet;
							this.numdrawn = "" + this.funcSet;
							this.numtimes = "" + this.funcSet;
							this.numminus = "" + this.funcSet;
						}, 1000);
					}
					this.perid = "boom5_2" + this.funcSet;
					this.n1 = "boom4_2" + this.funcSet;
					this.n2 = "boom3_2" + this.funcSet;
					this.n3 = "boom2_2" + this.funcSet;
					this.n4 = "boom1_2" + this.funcSet;
					this.n5 = "boom2_2" + this.funcSet;
					this.n6 = "boom3_2" + this.funcSet;
					this.n7 = "boom4_2" + this.funcSet;
					this.n8 = "boom5_2" + this.funcSet;
					this.n9 = "boom6_2" + this.funcSet;
					this.n0 = "boom7_2" + this.funcSet;
					this.minus = "boom8_2" + this.funcSet;
					this.plus = "boom9_2" + this.funcSet;
					this.bsp = "boom10_2" + this.funcSet;
					this.insert = "boom11_2" + this.funcSet;
					this.home = "boom12_2" + this.funcSet;
					this.pup = "boom13_2" + this.funcSet;
					this.numlock = "boom14_2" + this.funcSet;
					this.numdrawn = "boom15_2" + this.funcSet;
					this.numtimes = "boom16_2" + this.funcSet;
					this.numminus = "boom17_2" + this.funcSet;

				}
				break;

			case this.vKey == 53 && this.keyStatus == 1: //n5
				if (this.num == 0) {
					// this.clear();
					if (this.keyFlag1 == 0) {
						this.keyFlag1 = 1;
						setTimeout(() => {
							this.keyFlag1 = 0;
							this.perid = "" + this.funcSet;
							this.n1 = "" + this.funcSet;
							this.n2 = "" + this.funcSet;
							this.n3 = "" + this.funcSet;
							this.n4 = "" + this.funcSet;
							this.n5 = "" + this.funcSet;
							this.n6 = "" + this.funcSet;
							this.n7 = "" + this.funcSet;
							this.n8 = "" + this.funcSet;
							this.n9 = "" + this.funcSet;
							this.n0 = "" + this.funcSet;
							this.minus = "" + this.funcSet;
							this.plus = "" + this.funcSet;
							this.bsp = "" + this.funcSet;
							this.insert = "" + this.funcSet;
							this.home = "" + this.funcSet;
							this.pup = "" + this.funcSet;
							this.numlock = "" + this.funcSet;
							this.numdrawn = "" + this.funcSet;
							this.numtimes = "" + this.funcSet;
							this.numminus = "" + this.funcSet;
						}, 1000);
					}
					this.perid = "boom6_1" + this.funcSet;
					this.n1 = "boom5_1" + this.funcSet;
					this.n2 = "boom4_1" + this.funcSet;
					this.n3 = "boom3_1" + this.funcSet;
					this.n4 = "boom2_1" + this.funcSet;
					this.n5 = "boom1_1" + this.funcSet;
					this.n6 = "boom2_1" + this.funcSet;
					this.n7 = "boom3_1" + this.funcSet;
					this.n8 = "boom4_1" + this.funcSet;
					this.n9 = "boom5_1" + this.funcSet;
					this.n0 = "boom6_1" + this.funcSet;
					this.minus = "boom7_1" + this.funcSet;
					this.plus = "boom8_1" + this.funcSet;
					this.bsp = "boom9_1" + this.funcSet;
					this.insert = "boom10_1" + this.funcSet;
					this.home = "boom11_1" + this.funcSet;
					this.pup = "boom12_1" + this.funcSet;
					this.numlock = "boom13_1" + this.funcSet;
					this.numdrawn = "boom14_1" + this.funcSet;
					this.numtimes = "boom15_1" + this.funcSet;
					this.numminus = "boom16_1" + this.funcSet;

					this.num = 1;
				}
				else if (this.num == 1) {
					this.num = 0;
					// this.clear();
					if (this.keyFlag2 == 0) {
						this.keyFlag2 = 1;
						setTimeout(() => {
							this.keyFlag2 = 0;
							this.perid = "" + this.funcSet;
							this.n1 = "" + this.funcSet;
							this.n2 = "" + this.funcSet;
							this.n3 = "" + this.funcSet;
							this.n4 = "" + this.funcSet;
							this.n5 = "" + this.funcSet;
							this.n6 = "" + this.funcSet;
							this.n7 = "" + this.funcSet;
							this.n8 = "" + this.funcSet;
							this.n9 = "" + this.funcSet;
							this.n0 = "" + this.funcSet;
							this.minus = "" + this.funcSet;
							this.plus = "" + this.funcSet;
							this.bsp = "" + this.funcSet;
							this.insert = "" + this.funcSet;
							this.home = "" + this.funcSet;
							this.pup = "" + this.funcSet;
							this.numlock = "" + this.funcSet;
							this.numdrawn = "" + this.funcSet;
							this.numtimes = "" + this.funcSet;
							this.numminus = "" + this.funcSet;
						}, 1000);
					}
					this.perid = "boom6_2" + this.funcSet;
					this.n1 = "boom5_2" + this.funcSet;
					this.n2 = "boom4_2" + this.funcSet;
					this.n3 = "boom3_2" + this.funcSet;
					this.n4 = "boom2_2" + this.funcSet;
					this.n5 = "boom1_2" + this.funcSet;
					this.n6 = "boom2_2" + this.funcSet;
					this.n7 = "boom3_2" + this.funcSet;
					this.n8 = "boom4_2" + this.funcSet;
					this.n9 = "boom5_2" + this.funcSet;
					this.n0 = "boom6_2" + this.funcSet;
					this.minus = "boom7_2" + this.funcSet;
					this.plus = "boom8_2" + this.funcSet;
					this.bsp = "boom9_2" + this.funcSet;
					this.insert = "boom10_2" + this.funcSet;
					this.home = "boom11_2" + this.funcSet;
					this.pup = "boom12_2" + this.funcSet;
					this.numlock = "boom13_2" + this.funcSet;
					this.numdrawn = "boom14_2" + this.funcSet;
					this.numtimes = "boom15_2" + this.funcSet;
					this.numminus = "boom16_2" + this.funcSet;

				}
				break;

			case this.vKey == 54 && this.keyStatus == 1: //n6
				if (this.num == 0) {
					// this.clear();
					if (this.keyFlag1 == 0) {
						this.keyFlag1 = 1;
						setTimeout(() => {
							this.keyFlag1 = 0;
							this.perid = "" + this.funcSet;
							this.n1 = "" + this.funcSet;
							this.n2 = "" + this.funcSet;
							this.n3 = "" + this.funcSet;
							this.n4 = "" + this.funcSet;
							this.n5 = "" + this.funcSet;
							this.n6 = "" + this.funcSet;
							this.n7 = "" + this.funcSet;
							this.n8 = "" + this.funcSet;
							this.n9 = "" + this.funcSet;
							this.n0 = "" + this.funcSet;
							this.minus = "" + this.funcSet;
							this.plus = "" + this.funcSet;
							this.bsp = "" + this.funcSet;
							this.insert = "" + this.funcSet;
							this.home = "" + this.funcSet;
							this.pup = "" + this.funcSet;
							this.numlock = "" + this.funcSet;
							this.numdrawn = "" + this.funcSet;
							this.numtimes = "" + this.funcSet;
							this.numminus = "" + this.funcSet;
						}, 1000);
					}
					this.perid = "boom7_1" + this.funcSet;
					this.n1 = "boom6_1" + this.funcSet;
					this.n2 = "boom5_1" + this.funcSet;
					this.n3 = "boom4_1" + this.funcSet;
					this.n4 = "boom3_1" + this.funcSet;
					this.n5 = "boom2_1" + this.funcSet;
					this.n6 = "boom1_1" + this.funcSet;
					this.n7 = "boom2_1" + this.funcSet;
					this.n8 = "boom3_1" + this.funcSet;
					this.n9 = "boom4_1" + this.funcSet;
					this.n0 = "boom5_1" + this.funcSet;
					this.minus = "boom6_1" + this.funcSet;
					this.plus = "boom7_1" + this.funcSet;
					this.bsp = "boom8_1" + this.funcSet;
					this.insert = "boom9_1" + this.funcSet;
					this.home = "boom10_1" + this.funcSet;
					this.pup = "boom11_1" + this.funcSet;
					this.numlock = "boom12_1" + this.funcSet;
					this.numdrawn = "boom13_1" + this.funcSet;
					this.numtimes = "boom14_1" + this.funcSet;
					this.numminus = "boom15_1" + this.funcSet;

					this.num = 1;
				}
				else if (this.num == 1) {
					this.num = 0;
					// this.clear();
					if (this.keyFlag2 == 0) {
						this.keyFlag2 = 1;
						setTimeout(() => {
							this.keyFlag2 = 0;
							this.perid = "" + this.funcSet;
							this.n1 = "" + this.funcSet;
							this.n2 = "" + this.funcSet;
							this.n3 = "" + this.funcSet;
							this.n4 = "" + this.funcSet;
							this.n5 = "" + this.funcSet;
							this.n6 = "" + this.funcSet;
							this.n7 = "" + this.funcSet;
							this.n8 = "" + this.funcSet;
							this.n9 = "" + this.funcSet;
							this.n0 = "" + this.funcSet;
							this.minus = "" + this.funcSet;
							this.plus = "" + this.funcSet;
							this.bsp = "" + this.funcSet;
							this.insert = "" + this.funcSet;
							this.home = "" + this.funcSet;
							this.pup = "" + this.funcSet;
							this.numlock = "" + this.funcSet;
							this.numdrawn = "" + this.funcSet;
							this.numtimes = "" + this.funcSet;
							this.numminus = "" + this.funcSet;
						}, 1000);
					}
					this.perid = "boom7_2" + this.funcSet;
					this.n1 = "boom6_2" + this.funcSet;
					this.n2 = "boom5_2" + this.funcSet;
					this.n3 = "boom4_2" + this.funcSet;
					this.n4 = "boom3_2" + this.funcSet;
					this.n5 = "boom2_2" + this.funcSet;
					this.n6 = "boom1_2" + this.funcSet;
					this.n7 = "boom2_2" + this.funcSet;
					this.n8 = "boom3_2" + this.funcSet;
					this.n9 = "boom4_2" + this.funcSet;
					this.n0 = "boom5_2" + this.funcSet;
					this.minus = "boom6_2" + this.funcSet;
					this.plus = "boom7_2" + this.funcSet;
					this.bsp = "boom8_2" + this.funcSet;
					this.insert = "boom9_2" + this.funcSet;
					this.home = "boom10_2" + this.funcSet;
					this.pup = "boom11_2" + this.funcSet;
					this.numlock = "boom12_2" + this.funcSet;
					this.numdrawn = "boom13_2" + this.funcSet;
					this.numtimes = "boom14_2" + this.funcSet;
					this.numminus = "boom15_2" + this.funcSet;
				}
				break;

			case this.vKey == 55 && this.keyStatus == 1: //n7
				if (this.num == 0) {
					// this.clear();
					if (this.keyFlag1 == 0) {
						this.keyFlag1 = 1;
						setTimeout(() => {
							this.keyFlag1 = 0;
							this.perid = "" + this.funcSet;
							this.n1 = "" + this.funcSet;
							this.n2 = "" + this.funcSet;
							this.n3 = "" + this.funcSet;
							this.n4 = "" + this.funcSet;
							this.n5 = "" + this.funcSet;
							this.n6 = "" + this.funcSet;
							this.n7 = "" + this.funcSet;
							this.n8 = "" + this.funcSet;
							this.n9 = "" + this.funcSet;
							this.n0 = "" + this.funcSet;
							this.minus = "" + this.funcSet;
							this.plus = "" + this.funcSet;
							this.bsp = "" + this.funcSet;
							this.insert = "" + this.funcSet;
							this.home = "" + this.funcSet;
							this.pup = "" + this.funcSet;
							this.numlock = "" + this.funcSet;
							this.numdrawn = "" + this.funcSet;
							this.numtimes = "" + this.funcSet;
							this.numminus = "" + this.funcSet;
						}, 1000);
					}
					this.perid = "boom8_1" + this.funcSet;
					this.n1 = "boom7_1" + this.funcSet;
					this.n2 = "boom6_1" + this.funcSet;
					this.n3 = "boom5_1" + this.funcSet;
					this.n4 = "boom4_1" + this.funcSet;
					this.n5 = "boom3_1" + this.funcSet;
					this.n6 = "boom2_1" + this.funcSet;
					this.n7 = "boom1_1" + this.funcSet;
					this.n8 = "boom2_1" + this.funcSet;
					this.n9 = "boom3_1" + this.funcSet;
					this.n0 = "boom4_1" + this.funcSet;
					this.minus = "boom5_1" + this.funcSet;
					this.plus = "boom6_1" + this.funcSet;
					this.bsp = "boom7_1" + this.funcSet;
					this.insert = "boom8_1" + this.funcSet;
					this.home = "boom9_1" + this.funcSet;
					this.pup = "boom10_1" + this.funcSet;
					this.numlock = "boom11_1" + this.funcSet;
					this.numdrawn = "boom12_1" + this.funcSet;
					this.numtimes = "boom13_1" + this.funcSet;
					this.numminus = "boom14_1" + this.funcSet;
					this.num = 1;
				}
				else if (this.num == 1) {
					this.num = 0;
					// this.clear();
					if (this.keyFlag2 == 0) {
						this.keyFlag2 = 1;
						setTimeout(() => {
							this.keyFlag2 = 0;
							this.perid = "" + this.funcSet;
							this.n1 = "" + this.funcSet;
							this.n2 = "" + this.funcSet;
							this.n3 = "" + this.funcSet;
							this.n4 = "" + this.funcSet;
							this.n5 = "" + this.funcSet;
							this.n6 = "" + this.funcSet;
							this.n7 = "" + this.funcSet;
							this.n8 = "" + this.funcSet;
							this.n9 = "" + this.funcSet;
							this.n0 = "" + this.funcSet;
							this.minus = "" + this.funcSet;
							this.plus = "" + this.funcSet;
							this.bsp = "" + this.funcSet;
							this.insert = "" + this.funcSet;
							this.home = "" + this.funcSet;
							this.pup = "" + this.funcSet;
							this.numlock = "" + this.funcSet;
							this.numdrawn = "" + this.funcSet;
							this.numtimes = "" + this.funcSet;
							this.numminus = "" + this.funcSet;
						}, 1000);
					}
					this.perid = "boom8_2" + this.funcSet;
					this.n1 = "boom7_2" + this.funcSet;
					this.n2 = "boom6_2" + this.funcSet;
					this.n3 = "boom5_2" + this.funcSet;
					this.n4 = "boom4_2" + this.funcSet;
					this.n5 = "boom3_2" + this.funcSet;
					this.n6 = "boom2_2" + this.funcSet;
					this.n7 = "boom1_2" + this.funcSet;
					this.n8 = "boom2_2" + this.funcSet;
					this.n9 = "boom3_2" + this.funcSet;
					this.n0 = "boom4_2" + this.funcSet;
					this.minus = "boom5_2" + this.funcSet;
					this.plus = "boom6_2" + this.funcSet;
					this.bsp = "boom7_2" + this.funcSet;
					this.insert = "boom8_2" + this.funcSet;
					this.home = "boom9_2" + this.funcSet;
					this.pup = "boom10_2" + this.funcSet;
					this.numlock = "boom11_2" + this.funcSet;
					this.numdrawn = "boom12_2" + this.funcSet;
					this.numtimes = "boom13_2" + this.funcSet;
					this.numminus = "boom14_2" + this.funcSet;
				}
				break;

			case this.vKey == 56 && this.keyStatus == 1: //n8
				if (this.num == 0) {
					// this.clear();
					if (this.keyFlag1 == 0) {
						this.keyFlag1 = 1;
						setTimeout(() => {
							this.keyFlag1 = 0;
							this.perid = "" + this.funcSet;
							this.n1 = "" + this.funcSet;
							this.n2 = "" + this.funcSet;
							this.n3 = "" + this.funcSet;
							this.n4 = "" + this.funcSet;
							this.n5 = "" + this.funcSet;
							this.n6 = "" + this.funcSet;
							this.n7 = "" + this.funcSet;
							this.n8 = "" + this.funcSet;
							this.n9 = "" + this.funcSet;
							this.n0 = "" + this.funcSet;
							this.minus = "" + this.funcSet;
							this.plus = "" + this.funcSet;
							this.bsp = "" + this.funcSet;
							this.insert = "" + this.funcSet;
							this.home = "" + this.funcSet;
							this.pup = "" + this.funcSet;
							this.numlock = "" + this.funcSet;
							this.numdrawn = "" + this.funcSet;
							this.numtimes = "" + this.funcSet;
							this.numminus = "" + this.funcSet;
						}, 1000);
					}
					this.perid = "boom9_1" + this.funcSet;
					this.n1 = "boom8_1" + this.funcSet;
					this.n2 = "boom7_1" + this.funcSet;
					this.n3 = "boom6_1" + this.funcSet;
					this.n4 = "boom5_1" + this.funcSet;
					this.n5 = "boom4_1" + this.funcSet;
					this.n6 = "boom3_1" + this.funcSet;
					this.n7 = "boom2_1" + this.funcSet;
					this.n8 = "boom1_1" + this.funcSet;
					this.n9 = "boom2_1" + this.funcSet;
					this.n0 = "boom3_1" + this.funcSet;
					this.minus = "boom4_1" + this.funcSet;
					this.plus = "boom5_1" + this.funcSet;
					this.bsp = "boom6_1" + this.funcSet;
					this.insert = "boom7_1" + this.funcSet;
					this.home = "boom8_1" + this.funcSet;
					this.pup = "boom9_1" + this.funcSet;
					this.numlock = "boom10_1" + this.funcSet;
					this.numdrawn = "boom11_1" + this.funcSet;
					this.numtimes = "boom12_1" + this.funcSet;
					this.numminus = "boom13_1" + this.funcSet;

					this.num = 1;
				}
				else if (this.num == 1) {
					this.num = 0;
					// this.clear();
					if (this.keyFlag2 == 0) {
						this.keyFlag2 = 1;
						setTimeout(() => {
							this.keyFlag2 = 0;
							this.perid = "" + this.funcSet;
							this.n1 = "" + this.funcSet;
							this.n2 = "" + this.funcSet;
							this.n3 = "" + this.funcSet;
							this.n4 = "" + this.funcSet;
							this.n5 = "" + this.funcSet;
							this.n6 = "" + this.funcSet;
							this.n7 = "" + this.funcSet;
							this.n8 = "" + this.funcSet;
							this.n9 = "" + this.funcSet;
							this.n0 = "" + this.funcSet;
							this.minus = "" + this.funcSet;
							this.plus = "" + this.funcSet;
							this.bsp = "" + this.funcSet;
							this.insert = "" + this.funcSet;
							this.home = "" + this.funcSet;
							this.pup = "" + this.funcSet;
							this.numlock = "" + this.funcSet;
							this.numdrawn = "" + this.funcSet;
							this.numtimes = "" + this.funcSet;
							this.numminus = "" + this.funcSet;
						}, 1000);
					}
					this.perid = "boom9_2" + this.funcSet;
					this.n1 = "boom8_2" + this.funcSet;
					this.n2 = "boom7_2" + this.funcSet;
					this.n3 = "boom6_2" + this.funcSet;
					this.n4 = "boom5_2" + this.funcSet;
					this.n5 = "boom4_2" + this.funcSet;
					this.n6 = "boom3_2" + this.funcSet;
					this.n7 = "boom2_2" + this.funcSet;
					this.n8 = "boom1_2" + this.funcSet;
					this.n9 = "boom2_2" + this.funcSet;
					this.n0 = "boom3_2" + this.funcSet;
					this.minus = "boom4_2" + this.funcSet;
					this.plus = "boom5_2" + this.funcSet;
					this.bsp = "boom6_2" + this.funcSet;
					this.insert = "boom7_2" + this.funcSet;
					this.home = "boom8_2" + this.funcSet;
					this.pup = "boom9_2" + this.funcSet;
					this.numlock = "boom10_2" + this.funcSet;
					this.numdrawn = "boom11_2" + this.funcSet;
					this.numtimes = "boom12_2" + this.funcSet;
					this.numminus = "boom13_2" + this.funcSet;

				}
				break;

			case this.vKey == 57 && this.keyStatus == 1: //n9
				if (this.num == 0) {
					// this.clear();
					if (this.keyFlag1 == 0) {
						this.keyFlag1 = 1;
						setTimeout(() => {
							this.keyFlag1 = 0;
							this.perid = "" + this.funcSet;
							this.n1 = "" + this.funcSet;
							this.n2 = "" + this.funcSet;
							this.n3 = "" + this.funcSet;
							this.n4 = "" + this.funcSet;
							this.n5 = "" + this.funcSet;
							this.n6 = "" + this.funcSet;
							this.n7 = "" + this.funcSet;
							this.n8 = "" + this.funcSet;
							this.n9 = "" + this.funcSet;
							this.n0 = "" + this.funcSet;
							this.minus = "" + this.funcSet;
							this.plus = "" + this.funcSet;
							this.bsp = "" + this.funcSet;
							this.insert = "" + this.funcSet;
							this.home = "" + this.funcSet;
							this.pup = "" + this.funcSet;
							this.numlock = "" + this.funcSet;
							this.numdrawn = "" + this.funcSet;
							this.numtimes = "" + this.funcSet;
							this.numminus = "" + this.funcSet;
						}, 1000);
					}
					this.perid = "boom10_1" + this.funcSet;
					this.n1 = "boom9_1" + this.funcSet;
					this.n2 = "boom8_1" + this.funcSet;
					this.n3 = "boom7_1" + this.funcSet;
					this.n4 = "boom6_1" + this.funcSet;
					this.n5 = "boom5_1" + this.funcSet;
					this.n6 = "boom4_1" + this.funcSet;
					this.n7 = "boom3_1" + this.funcSet;
					this.n8 = "boom2_1" + this.funcSet;
					this.n9 = "boom1_1" + this.funcSet;
					this.n0 = "boom2_1" + this.funcSet;
					this.minus = "boom3_1" + this.funcSet;
					this.plus = "boom4_1" + this.funcSet;
					this.bsp = "boom5_1" + this.funcSet;
					this.insert = "boom6_1" + this.funcSet;
					this.home = "boom7_1" + this.funcSet;
					this.pup = "boom8_1" + this.funcSet;
					this.numlock = "boom9_1" + this.funcSet;
					this.numdrawn = "boom10_1" + this.funcSet;
					this.numtimes = "boom11_1" + this.funcSet;
					this.numminus = "boom12_1" + this.funcSet;

					this.num = 1;
				}
				else if (this.num == 1) {
					this.num = 0;
					// this.clear();
					if (this.keyFlag2 == 0) {
						this.keyFlag2 = 1;
						setTimeout(() => {
							this.keyFlag2 = 0;
							this.perid = "" + this.funcSet;
							this.n1 = "" + this.funcSet;
							this.n2 = "" + this.funcSet;
							this.n3 = "" + this.funcSet;
							this.n4 = "" + this.funcSet;
							this.n5 = "" + this.funcSet;
							this.n6 = "" + this.funcSet;
							this.n7 = "" + this.funcSet;
							this.n8 = "" + this.funcSet;
							this.n9 = "" + this.funcSet;
							this.n0 = "" + this.funcSet;
							this.minus = "" + this.funcSet;
							this.plus = "" + this.funcSet;
							this.bsp = "" + this.funcSet;
							this.insert = "" + this.funcSet;
							this.home = "" + this.funcSet;
							this.pup = "" + this.funcSet;
							this.numlock = "" + this.funcSet;
							this.numdrawn = "" + this.funcSet;
							this.numtimes = "" + this.funcSet;
							this.numminus = "" + this.funcSet;
						}, 1000);
					}
					this.perid = "boom10_2" + this.funcSet;
					this.n1 = "boom9_2" + this.funcSet;
					this.n2 = "boom8_2" + this.funcSet;
					this.n3 = "boom7_2" + this.funcSet;
					this.n4 = "boom6_2" + this.funcSet;
					this.n5 = "boom5_2" + this.funcSet;
					this.n6 = "boom4_2" + this.funcSet;
					this.n7 = "boom3_2" + this.funcSet;
					this.n8 = "boom2_2" + this.funcSet;
					this.n9 = "boom1_2" + this.funcSet;
					this.n0 = "boom2_2" + this.funcSet;
					this.minus = "boom3_2" + this.funcSet;
					this.plus = "boom4_2" + this.funcSet;
					this.bsp = "boom5_2" + this.funcSet;
					this.insert = "boom6_2" + this.funcSet;
					this.home = "boom7_2" + this.funcSet;
					this.pup = "boom8_2" + this.funcSet;
					this.numlock = "boom9_2" + this.funcSet;
					this.numdrawn = "boom10_2" + this.funcSet;
					this.numtimes = "boom11_2" + this.funcSet;
					this.numminus = "boom12_2" + this.funcSet;

				}
				break;

			case this.vKey == 48 && this.keyStatus == 1: //n0
				if (this.num == 0) {
					// this.clear();
					if (this.keyFlag1 == 0) {
						this.keyFlag1 = 1;
						setTimeout(() => {
							this.keyFlag1 = 0;
							this.perid = "" + this.funcSet;
							this.n1 = "" + this.funcSet;
							this.n2 = "" + this.funcSet;
							this.n3 = "" + this.funcSet;
							this.n4 = "" + this.funcSet;
							this.n5 = "" + this.funcSet;
							this.n6 = "" + this.funcSet;
							this.n7 = "" + this.funcSet;
							this.n8 = "" + this.funcSet;
							this.n9 = "" + this.funcSet;
							this.n0 = "" + this.funcSet;
							this.minus = "" + this.funcSet;
							this.plus = "" + this.funcSet;
							this.bsp = "" + this.funcSet;
							this.insert = "" + this.funcSet;
							this.home = "" + this.funcSet;
							this.pup = "" + this.funcSet;
							this.numlock = "" + this.funcSet;
							this.numdrawn = "" + this.funcSet;
							this.numtimes = "" + this.funcSet;
							this.numminus = "" + this.funcSet;
						}, 1000);
					}
					this.perid = "boom11_1" + this.funcSet;
					this.n1 = "boom10_1" + this.funcSet;
					this.n2 = "boom9_1" + this.funcSet;
					this.n3 = "boom8_1" + this.funcSet;
					this.n4 = "boom7_1" + this.funcSet;
					this.n5 = "boom6_1" + this.funcSet;
					this.n6 = "boom5_1" + this.funcSet;
					this.n7 = "boom4_1" + this.funcSet;
					this.n8 = "boom3_1" + this.funcSet;
					this.n9 = "boom2_1" + this.funcSet;
					this.n0 = "boom1_1" + this.funcSet;
					this.minus = "boom2_1" + this.funcSet;
					this.plus = "boom3_1" + this.funcSet;
					this.bsp = "boom4_1" + this.funcSet;
					this.insert = "boom5_1" + this.funcSet;
					this.home = "boom6_1" + this.funcSet;
					this.pup = "boom7_1" + this.funcSet;
					this.numlock = "boom8_1" + this.funcSet;
					this.numdrawn = "boom9_1" + this.funcSet;
					this.numtimes = "boom10_1" + this.funcSet;
					this.numminus = "boom11_1" + this.funcSet;

					this.num = 1;
				}
				else if (this.num == 1) {
					this.num = 0;
					// this.clear();
					if (this.keyFlag2 == 0) {
						this.keyFlag2 = 1;
						setTimeout(() => {
							this.keyFlag2 = 0;
							this.perid = "" + this.funcSet;
							this.n1 = "" + this.funcSet;
							this.n2 = "" + this.funcSet;
							this.n3 = "" + this.funcSet;
							this.n4 = "" + this.funcSet;
							this.n5 = "" + this.funcSet;
							this.n6 = "" + this.funcSet;
							this.n7 = "" + this.funcSet;
							this.n8 = "" + this.funcSet;
							this.n9 = "" + this.funcSet;
							this.n0 = "" + this.funcSet;
							this.minus = "" + this.funcSet;
							this.plus = "" + this.funcSet;
							this.bsp = "" + this.funcSet;
							this.insert = "" + this.funcSet;
							this.home = "" + this.funcSet;
							this.pup = "" + this.funcSet;
							this.numlock = "" + this.funcSet;
							this.numdrawn = "" + this.funcSet;
							this.numtimes = "" + this.funcSet;
							this.numminus = "" + this.funcSet;
						}, 1000);
					}
					this.perid = "boom11_2" + this.funcSet;
					this.n1 = "boom10_2" + this.funcSet;
					this.n2 = "boom9_2" + this.funcSet;
					this.n3 = "boom8_2" + this.funcSet;
					this.n4 = "boom7_2" + this.funcSet;
					this.n5 = "boom6_2" + this.funcSet;
					this.n6 = "boom5_2" + this.funcSet;
					this.n7 = "boom4_2" + this.funcSet;
					this.n8 = "boom3_2" + this.funcSet;
					this.n9 = "boom2_2" + this.funcSet;
					this.n0 = "boom1_2" + this.funcSet;
					this.minus = "boom2_2" + this.funcSet;
					this.plus = "boom3_2" + this.funcSet;
					this.bsp = "boom4_2" + this.funcSet;
					this.insert = "boom5_2" + this.funcSet;
					this.home = "boom6_2" + this.funcSet;
					this.pup = "boom7_2" + this.funcSet;
					this.numlock = "boom8_2" + this.funcSet;
					this.numdrawn = "boom9_2" + this.funcSet;
					this.numtimes = "boom10_2" + this.funcSet;
					this.numminus = "boom11_2" + this.funcSet;

				}
				break;

			case this.vKey == 189 && this.keyStatus == 1: //minus
				if (this.num == 0) {
					// this.clear();
					if (this.keyFlag1 == 0) {
						this.keyFlag1 = 1;
						setTimeout(() => {
							this.keyFlag1 = 0;
							this.perid = "" + this.funcSet;
							this.n1 = "" + this.funcSet;
							this.n2 = "" + this.funcSet;
							this.n3 = "" + this.funcSet;
							this.n4 = "" + this.funcSet;
							this.n5 = "" + this.funcSet;
							this.n6 = "" + this.funcSet;
							this.n7 = "" + this.funcSet;
							this.n8 = "" + this.funcSet;
							this.n9 = "" + this.funcSet;
							this.n0 = "" + this.funcSet;
							this.minus = "" + this.funcSet;
							this.plus = "" + this.funcSet;
							this.bsp = "" + this.funcSet;
							this.insert = "" + this.funcSet;
							this.home = "" + this.funcSet;
							this.pup = "" + this.funcSet;
							this.numlock = "" + this.funcSet;
							this.numdrawn = "" + this.funcSet;
							this.numtimes = "" + this.funcSet;
							this.numminus = "" + this.funcSet;
						}, 1000);
					}
					this.perid = "boom12_1" + this.funcSet;
					this.n1 = "boom11_1" + this.funcSet;
					this.n2 = "boom10_1" + this.funcSet;
					this.n3 = "boom9_1" + this.funcSet;
					this.n4 = "boom8_1" + this.funcSet;
					this.n5 = "boom7_1" + this.funcSet;
					this.n6 = "boom6_1" + this.funcSet;
					this.n7 = "boom5_1" + this.funcSet;
					this.n8 = "boom4_1" + this.funcSet;
					this.n9 = "boom3_1" + this.funcSet;
					this.n0 = "boom2_1" + this.funcSet;
					this.minus = "boom1_1" + this.funcSet;
					this.plus = "boom2_1" + this.funcSet;
					this.bsp = "boom3_1" + this.funcSet;
					this.insert = "boom4_1" + this.funcSet;
					this.home = "boom5_1" + this.funcSet;
					this.pup = "boom6_1" + this.funcSet;
					this.numlock = "boom7_1" + this.funcSet;
					this.numdrawn = "boom8_1" + this.funcSet;
					this.numtimes = "boom9_1" + this.funcSet;
					this.numminus = "boom10_1" + this.funcSet;

					this.num = 1;
				}
				else if (this.num == 1) {
					this.num = 0;
					// this.clear();
					if (this.keyFlag2 == 0) {
						this.keyFlag2 = 1;
						setTimeout(() => {
							this.keyFlag2 = 0;
							this.perid = "" + this.funcSet;
							this.n1 = "" + this.funcSet;
							this.n2 = "" + this.funcSet;
							this.n3 = "" + this.funcSet;
							this.n4 = "" + this.funcSet;
							this.n5 = "" + this.funcSet;
							this.n6 = "" + this.funcSet;
							this.n7 = "" + this.funcSet;
							this.n8 = "" + this.funcSet;
							this.n9 = "" + this.funcSet;
							this.n0 = "" + this.funcSet;
							this.minus = "" + this.funcSet;
							this.plus = "" + this.funcSet;
							this.bsp = "" + this.funcSet;
							this.insert = "" + this.funcSet;
							this.home = "" + this.funcSet;
							this.pup = "" + this.funcSet;
							this.numlock = "" + this.funcSet;
							this.numdrawn = "" + this.funcSet;
							this.numtimes = "" + this.funcSet;
							this.numminus = "" + this.funcSet;
						}, 1000);
					}
					this.perid = "boom12_2" + this.funcSet;
					this.n1 = "boom11_2" + this.funcSet;
					this.n2 = "boom10_2" + this.funcSet;
					this.n3 = "boom9_2" + this.funcSet;
					this.n4 = "boom8_2" + this.funcSet;
					this.n5 = "boom7_2" + this.funcSet;
					this.n6 = "boom6_2" + this.funcSet;
					this.n7 = "boom5_2" + this.funcSet;
					this.n8 = "boom4_2" + this.funcSet;
					this.n9 = "boom3_2" + this.funcSet;
					this.n0 = "boom2_2" + this.funcSet;
					this.minus = "boom1_2" + this.funcSet;
					this.plus = "boom2_2" + this.funcSet;
					this.bsp = "boom3_2" + this.funcSet;
					this.insert = "boom4_2" + this.funcSet;
					this.home = "boom5_2" + this.funcSet;
					this.pup = "boom6_2" + this.funcSet;
					this.numlock = "boom7_2" + this.funcSet;
					this.numdrawn = "boom8_2" + this.funcSet;
					this.numtimes = "boom9_2" + this.funcSet;
					this.numminus = "boom10_2" + this.funcSet;

				}
				break;
			case this.vKey == 187 && this.keyStatus == 1: //plus
				if (this.num == 0) {
					// this.clear();
					if (this.keyFlag1 == 0) {
						this.keyFlag1 = 1;
						setTimeout(() => {
							this.keyFlag1 = 0;
							this.perid = "" + this.funcSet;
							this.n1 = "" + this.funcSet;
							this.n2 = "" + this.funcSet;
							this.n3 = "" + this.funcSet;
							this.n4 = "" + this.funcSet;
							this.n5 = "" + this.funcSet;
							this.n6 = "" + this.funcSet;
							this.n7 = "" + this.funcSet;
							this.n8 = "" + this.funcSet;
							this.n9 = "" + this.funcSet;
							this.n0 = "" + this.funcSet;
							this.minus = "" + this.funcSet;
							this.plus = "" + this.funcSet;
							this.bsp = "" + this.funcSet;
							this.insert = "" + this.funcSet;
							this.home = "" + this.funcSet;
							this.pup = "" + this.funcSet;
							this.numlock = "" + this.funcSet;
							this.numdrawn = "" + this.funcSet;
							this.numtimes = "" + this.funcSet;
							this.numminus = "" + this.funcSet;
						}, 1000);
					}
					this.perid = "boom13_1" + this.funcSet;
					this.n1 = "boom12_1" + this.funcSet;
					this.n2 = "boom11_1" + this.funcSet;
					this.n3 = "boom10_1" + this.funcSet;
					this.n4 = "boom9_1" + this.funcSet;
					this.n5 = "boom8_1" + this.funcSet;
					this.n6 = "boom7_1" + this.funcSet;
					this.n7 = "boom6_1" + this.funcSet;
					this.n8 = "boom5_1" + this.funcSet;
					this.n9 = "boom4_1" + this.funcSet;
					this.n0 = "boom3_1" + this.funcSet;
					this.minus = "boom2_1" + this.funcSet;
					this.plus = "boom1_1" + this.funcSet;
					this.bsp = "boom2_1" + this.funcSet;
					this.insert = "boom3_1" + this.funcSet;
					this.home = "boom4_1" + this.funcSet;
					this.pup = "boom5_1" + this.funcSet;
					this.numlock = "boom6_1" + this.funcSet;
					this.numdrawn = "boom7_1" + this.funcSet;
					this.numtimes = "boom8_1" + this.funcSet;
					this.numminus = "boom9_1" + this.funcSet;

					this.num = 1;
				}
				else if (this.num == 1) {
					this.num = 0;
					// this.clear();
					if (this.keyFlag2 == 0) {
						this.keyFlag2 = 1;
						setTimeout(() => {
							this.keyFlag2 = 0;
							this.perid = "" + this.funcSet;
							this.n1 = "" + this.funcSet;
							this.n2 = "" + this.funcSet;
							this.n3 = "" + this.funcSet;
							this.n4 = "" + this.funcSet;
							this.n5 = "" + this.funcSet;
							this.n6 = "" + this.funcSet;
							this.n7 = "" + this.funcSet;
							this.n8 = "" + this.funcSet;
							this.n9 = "" + this.funcSet;
							this.n0 = "" + this.funcSet;
							this.minus = "" + this.funcSet;
							this.plus = "" + this.funcSet;
							this.bsp = "" + this.funcSet;
							this.insert = "" + this.funcSet;
							this.home = "" + this.funcSet;
							this.pup = "" + this.funcSet;
							this.numlock = "" + this.funcSet;
							this.numdrawn = "" + this.funcSet;
							this.numtimes = "" + this.funcSet;
							this.numminus = "" + this.funcSet;
						}, 1000);
					}
					this.perid = "boom13_2" + this.funcSet;
					this.n1 = "boom12_2" + this.funcSet;
					this.n2 = "boom11_2" + this.funcSet;
					this.n3 = "boom10_2" + this.funcSet;
					this.n4 = "boom9_2" + this.funcSet;
					this.n5 = "boom8_2" + this.funcSet;
					this.n6 = "boom7_2" + this.funcSet;
					this.n7 = "boom6_2" + this.funcSet;
					this.n8 = "boom5_2" + this.funcSet;
					this.n9 = "boom4_2" + this.funcSet;
					this.n0 = "boom3_2" + this.funcSet;
					this.minus = "boom2_2" + this.funcSet;
					this.plus = "boom1_2" + this.funcSet;
					this.bsp = "boom2_2" + this.funcSet;
					this.insert = "boom3_2" + this.funcSet;
					this.home = "boom4_2" + this.funcSet;
					this.pup = "boom5_2" + this.funcSet;
					this.numlock = "boom6_2" + this.funcSet;
					this.numdrawn = "boom7_2" + this.funcSet;
					this.numtimes = "boom8_2" + this.funcSet;
					this.numminus = "boom9_2" + this.funcSet;

				}
				break;

			case this.vKey == 8 && this.keyStatus == 1: //bsp
				if (this.num == 0) {
					// this.clear();
					if (this.keyFlag1 == 0) {
						this.keyFlag1 = 1;
						setTimeout(() => {
							this.keyFlag1 = 0;
							this.perid = "" + this.funcSet;
							this.n1 = "" + this.funcSet;
							this.n2 = "" + this.funcSet;
							this.n3 = "" + this.funcSet;
							this.n4 = "" + this.funcSet;
							this.n5 = "" + this.funcSet;
							this.n6 = "" + this.funcSet;
							this.n7 = "" + this.funcSet;
							this.n8 = "" + this.funcSet;
							this.n9 = "" + this.funcSet;
							this.n0 = "" + this.funcSet;
							this.minus = "" + this.funcSet;
							this.plus = "" + this.funcSet;
							this.bsp = "" + this.funcSet;
							this.insert = "" + this.funcSet;
							this.home = "" + this.funcSet;
							this.pup = "" + this.funcSet;
							this.numlock = "" + this.funcSet;
							this.numdrawn = "" + this.funcSet;
							this.numtimes = "" + this.funcSet;
							this.numminus = "" + this.funcSet;
						}, 1000);
					}
					this.perid = "boom14_1" + this.funcSet;
					this.n1 = "boom13_1" + this.funcSet;
					this.n2 = "boom12_1" + this.funcSet;
					this.n3 = "boom11_1" + this.funcSet;
					this.n4 = "boom10_1" + this.funcSet;
					this.n5 = "boom9_1" + this.funcSet;
					this.n6 = "boom8_1" + this.funcSet;
					this.n7 = "boom7_1" + this.funcSet;
					this.n8 = "boom6_1" + this.funcSet;
					this.n9 = "boom5_1" + this.funcSet;
					this.n0 = "boom4_1" + this.funcSet;
					this.minus = "boom3_1" + this.funcSet;
					this.plus = "boom2_1" + this.funcSet;
					this.bsp = "boom1_1" + this.funcSet;
					this.insert = "boom2_1" + this.funcSet;
					this.home = "boom3_1" + this.funcSet;
					this.pup = "boom4_1" + this.funcSet;
					this.numlock = "boom5_1" + this.funcSet;
					this.numdrawn = "boom6_1" + this.funcSet;
					this.numtimes = "boom7_1" + this.funcSet;
					this.numminus = "boom8_1" + this.funcSet;

					this.num = 1;
				}
				else if (this.num == 1) {
					this.num = 0;
					// this.clear();
					if (this.keyFlag2 == 0) {
						this.keyFlag2 = 1;
						setTimeout(() => {
							this.keyFlag2 = 0;
							this.perid = "" + this.funcSet;
							this.n1 = "" + this.funcSet;
							this.n2 = "" + this.funcSet;
							this.n3 = "" + this.funcSet;
							this.n4 = "" + this.funcSet;
							this.n5 = "" + this.funcSet;
							this.n6 = "" + this.funcSet;
							this.n7 = "" + this.funcSet;
							this.n8 = "" + this.funcSet;
							this.n9 = "" + this.funcSet;
							this.n0 = "" + this.funcSet;
							this.minus = "" + this.funcSet;
							this.plus = "" + this.funcSet;
							this.bsp = "" + this.funcSet;
							this.insert = "" + this.funcSet;
							this.home = "" + this.funcSet;
							this.pup = "" + this.funcSet;
							this.numlock = "" + this.funcSet;
							this.numdrawn = "" + this.funcSet;
							this.numtimes = "" + this.funcSet;
							this.numminus = "" + this.funcSet;
						}, 1000);
					}
					this.perid = "boom14_2" + this.funcSet;
					this.n1 = "boom13_2" + this.funcSet;
					this.n2 = "boom12_2" + this.funcSet;
					this.n3 = "boom11_2" + this.funcSet;
					this.n4 = "boom10_2" + this.funcSet;
					this.n5 = "boom9_2" + this.funcSet;
					this.n6 = "boom8_2" + this.funcSet;
					this.n7 = "boom7_2" + this.funcSet;
					this.n8 = "boom6_2" + this.funcSet;
					this.n9 = "boom5_2" + this.funcSet;
					this.n0 = "boom4_2" + this.funcSet;
					this.minus = "boom3_2" + this.funcSet;
					this.plus = "boom2_2" + this.funcSet;
					this.bsp = "boom1_2" + this.funcSet;
					this.insert = "boom2_2" + this.funcSet;
					this.home = "boom3_2" + this.funcSet;
					this.pup = "boom4_2" + this.funcSet;
					this.numlock = "boom5_2" + this.funcSet;
					this.numdrawn = "boom6_2" + this.funcSet;
					this.numtimes = "boom7_2" + this.funcSet;
					this.numminus = "boom8_2" + this.funcSet;

				}
				break;

			case this.vKey == 45 && this.keyStatus == 1: //insert
				if (this.num == 0) {
					// this.clear();
					if (this.keyFlag1 == 0) {
						this.keyFlag1 = 1;
						setTimeout(() => {
							this.keyFlag1 = 0;
							this.perid = "" + this.funcSet;
							this.n1 = "" + this.funcSet;
							this.n2 = "" + this.funcSet;
							this.n3 = "" + this.funcSet;
							this.n4 = "" + this.funcSet;
							this.n5 = "" + this.funcSet;
							this.n6 = "" + this.funcSet;
							this.n7 = "" + this.funcSet;
							this.n8 = "" + this.funcSet;
							this.n9 = "" + this.funcSet;
							this.n0 = "" + this.funcSet;
							this.minus = "" + this.funcSet;
							this.plus = "" + this.funcSet;
							this.bsp = "" + this.funcSet;
							this.insert = "" + this.funcSet;
							this.home = "" + this.funcSet;
							this.pup = "" + this.funcSet;
							this.numlock = "" + this.funcSet;
							this.numdrawn = "" + this.funcSet;
							this.numtimes = "" + this.funcSet;
							this.numminus = "" + this.funcSet;
						}, 1000);
					}
					this.perid = "boom15_1" + this.funcSet;
					this.n1 = "boom14_1" + this.funcSet;
					this.n2 = "boom13_1" + this.funcSet;
					this.n3 = "boom12_1" + this.funcSet;
					this.n4 = "boom11_1" + this.funcSet;
					this.n5 = "boom10_1" + this.funcSet;
					this.n6 = "boom9_1" + this.funcSet;
					this.n7 = "boom8_1" + this.funcSet;
					this.n8 = "boom7_1" + this.funcSet;
					this.n9 = "boom6_1" + this.funcSet;
					this.n0 = "boom5_1" + this.funcSet;
					this.minus = "boom4_1" + this.funcSet;
					this.plus = "boom3_1" + this.funcSet;
					this.bsp = "boom2_1" + this.funcSet;
					this.insert = "boom1_1" + this.funcSet;
					this.home = "boom2_1" + this.funcSet;
					this.pup = "boom3_1" + this.funcSet;
					this.numlock = "boom4_1" + this.funcSet;
					this.numdrawn = "boom5_1" + this.funcSet;
					this.numtimes = "boom6_1" + this.funcSet;
					this.numminus = "boom7_1" + this.funcSet;

					this.num = 1;
				}
				else if (this.num == 1) {
					this.num = 0;
					// this.clear();
					if (this.keyFlag2 == 0) {
						this.keyFlag2 = 1;
						setTimeout(() => {
							this.keyFlag2 = 0;
							this.perid = "" + this.funcSet;
							this.n1 = "" + this.funcSet;
							this.n2 = "" + this.funcSet;
							this.n3 = "" + this.funcSet;
							this.n4 = "" + this.funcSet;
							this.n5 = "" + this.funcSet;
							this.n6 = "" + this.funcSet;
							this.n7 = "" + this.funcSet;
							this.n8 = "" + this.funcSet;
							this.n9 = "" + this.funcSet;
							this.n0 = "" + this.funcSet;
							this.minus = "" + this.funcSet;
							this.plus = "" + this.funcSet;
							this.bsp = "" + this.funcSet;
							this.insert = "" + this.funcSet;
							this.home = "" + this.funcSet;
							this.pup = "" + this.funcSet;
							this.numlock = "" + this.funcSet;
							this.numdrawn = "" + this.funcSet;
							this.numtimes = "" + this.funcSet;
							this.numminus = "" + this.funcSet;
						}, 1000);
					}
					this.perid = "boom15_2" + this.funcSet;
					this.n1 = "boom14_2" + this.funcSet;
					this.n2 = "boom13_2" + this.funcSet;
					this.n3 = "boom12_2" + this.funcSet;
					this.n4 = "boom11_2" + this.funcSet;
					this.n5 = "boom10_2" + this.funcSet;
					this.n6 = "boom9_2" + this.funcSet;
					this.n7 = "boom8_2" + this.funcSet;
					this.n8 = "boom7_2" + this.funcSet;
					this.n9 = "boom6_2" + this.funcSet;
					this.n0 = "boom5_2" + this.funcSet;
					this.minus = "boom4_2" + this.funcSet;
					this.plus = "boom3_2" + this.funcSet;
					this.bsp = "boom2_2" + this.funcSet;
					this.insert = "boom1_2" + this.funcSet;
					this.home = "boom2_2" + this.funcSet;
					this.pup = "boom3_2" + this.funcSet;
					this.numlock = "boom4_2" + this.funcSet;
					this.numdrawn = "boom5_2" + this.funcSet;
					this.numtimes = "boom6_2" + this.funcSet;
					this.numminus = "boom7_2" + this.funcSet;

				}
				break;

			case this.vKey == 36 && this.keyStatus == 1: //home
				if (this.num == 0) {
					// this.clear();
					if (this.keyFlag1 == 0) {
						this.keyFlag1 = 1;
						setTimeout(() => {
							this.keyFlag1 = 0;
							this.perid = "" + this.funcSet;
							this.n1 = "" + this.funcSet;
							this.n2 = "" + this.funcSet;
							this.n3 = "" + this.funcSet;
							this.n4 = "" + this.funcSet;
							this.n5 = "" + this.funcSet;
							this.n6 = "" + this.funcSet;
							this.n7 = "" + this.funcSet;
							this.n8 = "" + this.funcSet;
							this.n9 = "" + this.funcSet;
							this.n0 = "" + this.funcSet;
							this.minus = "" + this.funcSet;
							this.plus = "" + this.funcSet;
							this.bsp = "" + this.funcSet;
							this.insert = "" + this.funcSet;
							this.home = "" + this.funcSet;
							this.pup = "" + this.funcSet;
							this.numlock = "" + this.funcSet;
							this.numdrawn = "" + this.funcSet;
							this.numtimes = "" + this.funcSet;
							this.numminus = "" + this.funcSet;
						}, 1000);
					}
					this.perid = "boom16_1" + this.funcSet;
					this.n1 = "boom15_1" + this.funcSet;
					this.n2 = "boom14_1" + this.funcSet;
					this.n3 = "boom13_1" + this.funcSet;
					this.n4 = "boom12_1" + this.funcSet;
					this.n5 = "boom11_1" + this.funcSet;
					this.n6 = "boom10_1" + this.funcSet;
					this.n7 = "boom9_1" + this.funcSet;
					this.n8 = "boom8_1" + this.funcSet;
					this.n9 = "boom7_1" + this.funcSet;
					this.n0 = "boom6_1" + this.funcSet;
					this.minus = "boom5_1" + this.funcSet;
					this.plus = "boom4_1" + this.funcSet;
					this.bsp = "boom3_1" + this.funcSet;
					this.insert = "boom2_1" + this.funcSet;
					this.home = "boom1_1" + this.funcSet;
					this.pup = "boom2_1" + this.funcSet;
					this.numlock = "boom3_1" + this.funcSet;
					this.numdrawn = "boom4_1" + this.funcSet;
					this.numtimes = "boom5_1" + this.funcSet;
					this.numminus = "boom6_1" + this.funcSet;

					this.num = 1;
				}
				else if (this.num == 1) {
					this.num = 0;
					// this.clear();
					if (this.keyFlag2 == 0) {
						this.keyFlag2 = 1;
						setTimeout(() => {
							this.keyFlag2 = 0;
							this.perid = "" + this.funcSet;
							this.n1 = "" + this.funcSet;
							this.n2 = "" + this.funcSet;
							this.n3 = "" + this.funcSet;
							this.n4 = "" + this.funcSet;
							this.n5 = "" + this.funcSet;
							this.n6 = "" + this.funcSet;
							this.n7 = "" + this.funcSet;
							this.n8 = "" + this.funcSet;
							this.n9 = "" + this.funcSet;
							this.n0 = "" + this.funcSet;
							this.minus = "" + this.funcSet;
							this.plus = "" + this.funcSet;
							this.bsp = "" + this.funcSet;
							this.insert = "" + this.funcSet;
							this.home = "" + this.funcSet;
							this.pup = "" + this.funcSet;
							this.numlock = "" + this.funcSet;
							this.numdrawn = "" + this.funcSet;
							this.numtimes = "" + this.funcSet;
							this.numminus = "" + this.funcSet;
						}, 1000);
					}
					this.perid = "boom16_2" + this.funcSet;
					this.n1 = "boom15_2" + this.funcSet;
					this.n2 = "boom14_2" + this.funcSet;
					this.n3 = "boom13_2" + this.funcSet;
					this.n4 = "boom12_2" + this.funcSet;
					this.n5 = "boom11_2" + this.funcSet;
					this.n6 = "boom10_2" + this.funcSet;
					this.n7 = "boom9_2" + this.funcSet;
					this.n8 = "boom8_2" + this.funcSet;
					this.n9 = "boom7_2" + this.funcSet;
					this.n0 = "boom6_2" + this.funcSet;
					this.minus = "boom5_2" + this.funcSet;
					this.plus = "boom4_2" + this.funcSet;
					this.bsp = "boom3_2" + this.funcSet;
					this.insert = "boom2_2" + this.funcSet;
					this.home = "boom1_2" + this.funcSet;
					this.pup = "boom2_2" + this.funcSet;
					this.numlock = "boom3_2" + this.funcSet;
					this.numdrawn = "boom4_2" + this.funcSet;
					this.numtimes = "boom5_2" + this.funcSet;
					this.numminus = "boom6_2" + this.funcSet;

				}
				break;

			case this.vKey == 33 && this.keyStatus == 1: //pup
				if (this.num == 0) {
					// this.clear();
					if (this.keyFlag1 == 0) {
						this.keyFlag1 = 1;
						setTimeout(() => {
							this.keyFlag1 = 0;
							this.perid = "" + this.funcSet;
							this.n1 = "" + this.funcSet;
							this.n2 = "" + this.funcSet;
							this.n3 = "" + this.funcSet;
							this.n4 = "" + this.funcSet;
							this.n5 = "" + this.funcSet;
							this.n6 = "" + this.funcSet;
							this.n7 = "" + this.funcSet;
							this.n8 = "" + this.funcSet;
							this.n9 = "" + this.funcSet;
							this.n0 = "" + this.funcSet;
							this.minus = "" + this.funcSet;
							this.plus = "" + this.funcSet;
							this.bsp = "" + this.funcSet;
							this.insert = "" + this.funcSet;
							this.home = "" + this.funcSet;
							this.pup = "" + this.funcSet;
							this.numlock = "" + this.funcSet;
							this.numdrawn = "" + this.funcSet;
							this.numtimes = "" + this.funcSet;
							this.numminus = "" + this.funcSet;
						}, 1000);
					}
					this.perid = "boom17_1" + this.funcSet;
					this.n1 = "boom16_1" + this.funcSet;
					this.n2 = "boom15_1" + this.funcSet;
					this.n3 = "boom14_1" + this.funcSet;
					this.n4 = "boom13_1" + this.funcSet;
					this.n5 = "boom12_1" + this.funcSet;
					this.n6 = "boom11_1" + this.funcSet;
					this.n7 = "boom10_1" + this.funcSet;
					this.n8 = "boom9_1" + this.funcSet;
					this.n9 = "boom8_1" + this.funcSet;
					this.n0 = "boom7_1" + this.funcSet;
					this.minus = "boom6_1" + this.funcSet;
					this.plus = "boom5_1" + this.funcSet;
					this.bsp = "boom4_1" + this.funcSet;
					this.insert = "boom3_1" + this.funcSet;
					this.home = "boom2_1" + this.funcSet;
					this.pup = "boom1_1" + this.funcSet;
					this.numlock = "boom2_1" + this.funcSet;
					this.numdrawn = "boom3_1" + this.funcSet;
					this.numtimes = "boom4_1" + this.funcSet;
					this.numminus = "boom5_1" + this.funcSet;

					this.num = 1;
				}
				else if (this.num == 1) {
					this.num = 0;
					// this.clear();
					if (this.keyFlag2 == 0) {
						this.keyFlag2 = 1;
						setTimeout(() => {
							this.keyFlag2 = 0;
							this.perid = "" + this.funcSet;
							this.n1 = "" + this.funcSet;
							this.n2 = "" + this.funcSet;
							this.n3 = "" + this.funcSet;
							this.n4 = "" + this.funcSet;
							this.n5 = "" + this.funcSet;
							this.n6 = "" + this.funcSet;
							this.n7 = "" + this.funcSet;
							this.n8 = "" + this.funcSet;
							this.n9 = "" + this.funcSet;
							this.n0 = "" + this.funcSet;
							this.minus = "" + this.funcSet;
							this.plus = "" + this.funcSet;
							this.bsp = "" + this.funcSet;
							this.insert = "" + this.funcSet;
							this.home = "" + this.funcSet;
							this.pup = "" + this.funcSet;
							this.numlock = "" + this.funcSet;
							this.numdrawn = "" + this.funcSet;
							this.numtimes = "" + this.funcSet;
							this.numminus = "" + this.funcSet;
						}, 1000);
					}
					this.perid = "boom17_2" + this.funcSet;
					this.n1 = "boom16_2" + this.funcSet;
					this.n2 = "boom15_2" + this.funcSet;
					this.n3 = "boom14_2" + this.funcSet;
					this.n4 = "boom13_2" + this.funcSet;
					this.n5 = "boom12_2" + this.funcSet;
					this.n6 = "boom11_2" + this.funcSet;
					this.n7 = "boom10_2" + this.funcSet;
					this.n8 = "boom9_2" + this.funcSet;
					this.n9 = "boom8_2" + this.funcSet;
					this.n0 = "boom7_2" + this.funcSet;
					this.minus = "boom6_2" + this.funcSet;
					this.plus = "boom5_2" + this.funcSet;
					this.bsp = "boom4_2" + this.funcSet;
					this.insert = "boom3_2" + this.funcSet;
					this.home = "boom2_2" + this.funcSet;
					this.pup = "boom1_2" + this.funcSet;
					this.numlock = "boom2_2" + this.funcSet;
					this.numdrawn = "boom3_2" + this.funcSet;
					this.numtimes = "boom4_2" + this.funcSet;
					this.numminus = "boom5_2" + this.funcSet;
				}
				break;

			case this.vKey == 144 && this.keyStatus == 1: //numlock
				if (this.num == 0) {
					// this.clear();
					if (this.keyFlag1 == 0) {
						this.keyFlag1 = 1;
						setTimeout(() => {
							this.keyFlag1 = 0;
							this.perid = "" + this.funcSet;
							this.n1 = "" + this.funcSet;
							this.n2 = "" + this.funcSet;
							this.n3 = "" + this.funcSet;
							this.n4 = "" + this.funcSet;
							this.n5 = "" + this.funcSet;
							this.n6 = "" + this.funcSet;
							this.n7 = "" + this.funcSet;
							this.n8 = "" + this.funcSet;
							this.n9 = "" + this.funcSet;
							this.n0 = "" + this.funcSet;
							this.minus = "" + this.funcSet;
							this.plus = "" + this.funcSet;
							this.bsp = "" + this.funcSet;
							this.insert = "" + this.funcSet;
							this.home = "" + this.funcSet;
							this.pup = "" + this.funcSet;
							this.numlock = "" + this.funcSet;
							this.numdrawn = "" + this.funcSet;
							this.numtimes = "" + this.funcSet;
							this.numminus = "" + this.funcSet;
						}, 1000);
					}
					this.perid = "boom18_1" + this.funcSet;
					this.n1 = "boom17_1" + this.funcSet;
					this.n2 = "boom16_1" + this.funcSet;
					this.n3 = "boom15_1" + this.funcSet;
					this.n4 = "boom14_1" + this.funcSet;
					this.n5 = "boom13_1" + this.funcSet;
					this.n6 = "boom12_1" + this.funcSet;
					this.n7 = "boom11_1" + this.funcSet;
					this.n8 = "boom10_1" + this.funcSet;
					this.n9 = "boom9_1" + this.funcSet;
					this.n0 = "boom8_1" + this.funcSet;
					this.minus = "boom7_1" + this.funcSet;
					this.plus = "boom6_1" + this.funcSet;
					this.bsp = "boom5_1" + this.funcSet;
					this.insert = "boom4_1" + this.funcSet;
					this.home = "boom3_1" + this.funcSet;
					this.pup = "boom2_1" + this.funcSet;
					this.numlock = "boom1_1" + this.funcSet;
					this.numdrawn = "boom2_1" + this.funcSet;
					this.numtimes = "boom3_1" + this.funcSet;
					this.numminus = "boom4_1" + this.funcSet;

					this.num = 1;
				}
				else if (this.num == 1) {
					this.num = 0;
					// this.clear();
					if (this.keyFlag2 == 0) {
						this.keyFlag2 = 1;
						setTimeout(() => {
							this.keyFlag2 = 0;
							this.perid = "" + this.funcSet;
							this.n1 = "" + this.funcSet;
							this.n2 = "" + this.funcSet;
							this.n3 = "" + this.funcSet;
							this.n4 = "" + this.funcSet;
							this.n5 = "" + this.funcSet;
							this.n6 = "" + this.funcSet;
							this.n7 = "" + this.funcSet;
							this.n8 = "" + this.funcSet;
							this.n9 = "" + this.funcSet;
							this.n0 = "" + this.funcSet;
							this.minus = "" + this.funcSet;
							this.plus = "" + this.funcSet;
							this.bsp = "" + this.funcSet;
							this.insert = "" + this.funcSet;
							this.home = "" + this.funcSet;
							this.pup = "" + this.funcSet;
							this.numlock = "" + this.funcSet;
							this.numdrawn = "" + this.funcSet;
							this.numtimes = "" + this.funcSet;
							this.numminus = "" + this.funcSet;
						}, 1000);
					}
					this.perid = "boom18_2" + this.funcSet;
					this.n1 = "boom17_2" + this.funcSet;
					this.n2 = "boom16_2" + this.funcSet;
					this.n3 = "boom15_2" + this.funcSet;
					this.n4 = "boom14_2" + this.funcSet;
					this.n5 = "boom13_2" + this.funcSet;
					this.n6 = "boom12_2" + this.funcSet;
					this.n7 = "boom11_2" + this.funcSet;
					this.n8 = "boom10_2" + this.funcSet;
					this.n9 = "boom9_2" + this.funcSet;
					this.n0 = "boom8_2" + this.funcSet;
					this.minus = "boom7_2" + this.funcSet;
					this.plus = "boom6_2" + this.funcSet;
					this.bsp = "boom5_2" + this.funcSet;
					this.insert = "boom4_2" + this.funcSet;
					this.home = "boom3_2" + this.funcSet;
					this.pup = "boom2_2" + this.funcSet;
					this.numlock = "boom1_2" + this.funcSet;
					this.numdrawn = "boom2_2" + this.funcSet;
					this.numtimes = "boom3_2" + this.funcSet;
					this.numminus = "boom4_2" + this.funcSet;
				}
				break;

			case this.vKey == 111 && this.keyStatus == 1: //numdrawn
				if (this.num == 0) {
					// this.clear();
					if (this.keyFlag1 == 0) {
						this.keyFlag1 = 1;
						setTimeout(() => {
							this.keyFlag1 = 0;
							this.perid = "" + this.funcSet;
							this.n1 = "" + this.funcSet;
							this.n2 = "" + this.funcSet;
							this.n3 = "" + this.funcSet;
							this.n4 = "" + this.funcSet;
							this.n5 = "" + this.funcSet;
							this.n6 = "" + this.funcSet;
							this.n7 = "" + this.funcSet;
							this.n8 = "" + this.funcSet;
							this.n9 = "" + this.funcSet;
							this.n0 = "" + this.funcSet;
							this.minus = "" + this.funcSet;
							this.plus = "" + this.funcSet;
							this.bsp = "" + this.funcSet;
							this.insert = "" + this.funcSet;
							this.home = "" + this.funcSet;
							this.pup = "" + this.funcSet;
							this.numlock = "" + this.funcSet;
							this.numdrawn = "" + this.funcSet;
							this.numtimes = "" + this.funcSet;
							this.numminus = "" + this.funcSet;
						}, 1000);
					}
					this.perid = "boom19_1" + this.funcSet;
					this.n1 = "boom18_1" + this.funcSet;
					this.n2 = "boom17_1" + this.funcSet;
					this.n3 = "boom16_1" + this.funcSet;
					this.n4 = "boom15_1" + this.funcSet;
					this.n5 = "boom14_1" + this.funcSet;
					this.n6 = "boom13_1" + this.funcSet;
					this.n7 = "boom12_1" + this.funcSet;
					this.n8 = "boom11_1" + this.funcSet;
					this.n9 = "boom10_1" + this.funcSet;
					this.n0 = "boom9_1" + this.funcSet;
					this.minus = "boom8_1" + this.funcSet;
					this.plus = "boom7_1" + this.funcSet;
					this.bsp = "boom6_1" + this.funcSet;
					this.insert = "boom5_1" + this.funcSet;
					this.home = "boom4_1" + this.funcSet;
					this.pup = "boom3_1" + this.funcSet;
					this.numlock = "boom2_1" + this.funcSet;
					this.numdrawn = "boom1_1" + this.funcSet;
					this.numtimes = "boom2_1" + this.funcSet;
					this.numminus = "boom3_1" + this.funcSet;
					this.num = 1;
				}
				else if (this.num == 1) {
					this.num = 0;
					// this.clear();
					if (this.keyFlag2 == 0) {
						this.keyFlag2 = 1;
						setTimeout(() => {
							this.keyFlag2 = 0;
							this.perid = "" + this.funcSet;
							this.n1 = "" + this.funcSet;
							this.n2 = "" + this.funcSet;
							this.n3 = "" + this.funcSet;
							this.n4 = "" + this.funcSet;
							this.n5 = "" + this.funcSet;
							this.n6 = "" + this.funcSet;
							this.n7 = "" + this.funcSet;
							this.n8 = "" + this.funcSet;
							this.n9 = "" + this.funcSet;
							this.n0 = "" + this.funcSet;
							this.minus = "" + this.funcSet;
							this.plus = "" + this.funcSet;
							this.bsp = "" + this.funcSet;
							this.insert = "" + this.funcSet;
							this.home = "" + this.funcSet;
							this.pup = "" + this.funcSet;
							this.numlock = "" + this.funcSet;
							this.numdrawn = "" + this.funcSet;
							this.numtimes = "" + this.funcSet;
							this.numminus = "" + this.funcSet;
						}, 1000);
					}
					this.perid = "boom19_2" + this.funcSet;
					this.n1 = "boom18_2" + this.funcSet;
					this.n2 = "boom17_2" + this.funcSet;
					this.n3 = "boom16_2" + this.funcSet;
					this.n4 = "boom15_2" + this.funcSet;
					this.n5 = "boom14_2" + this.funcSet;
					this.n6 = "boom13_2" + this.funcSet;
					this.n7 = "boom12_2" + this.funcSet;
					this.n8 = "boom11_2" + this.funcSet;
					this.n9 = "boom10_2" + this.funcSet;
					this.n0 = "boom9_2" + this.funcSet;
					this.minus = "boom8_2" + this.funcSet;
					this.plus = "boom7_2" + this.funcSet;
					this.bsp = "boom6_2" + this.funcSet;
					this.insert = "boom5_2" + this.funcSet;
					this.home = "boom4_2" + this.funcSet;
					this.pup = "boom3_2" + this.funcSet;
					this.numlock = "boom2_2" + this.funcSet;
					this.numdrawn = "boom1_2" + this.funcSet;
					this.numtimes = "boom2_2" + this.funcSet;
					this.numminus = "boom3_2" + this.funcSet;

				}
				break;

			case this.vKey == 106 && this.keyStatus == 1: //numtimes
				if (this.num == 0) {
					// this.clear();
					if (this.keyFlag1 == 0) {
						this.keyFlag1 = 1;
						setTimeout(() => {
							this.keyFlag1 = 0;
							this.perid = "" + this.funcSet;
							this.n1 = "" + this.funcSet;
							this.n2 = "" + this.funcSet;
							this.n3 = "" + this.funcSet;
							this.n4 = "" + this.funcSet;
							this.n5 = "" + this.funcSet;
							this.n6 = "" + this.funcSet;
							this.n7 = "" + this.funcSet;
							this.n8 = "" + this.funcSet;
							this.n9 = "" + this.funcSet;
							this.n0 = "" + this.funcSet;
							this.minus = "" + this.funcSet;
							this.plus = "" + this.funcSet;
							this.bsp = "" + this.funcSet;
							this.insert = "" + this.funcSet;
							this.home = "" + this.funcSet;
							this.pup = "" + this.funcSet;
							this.numlock = "" + this.funcSet;
							this.numdrawn = "" + this.funcSet;
							this.numtimes = "" + this.funcSet;
							this.numminus = "" + this.funcSet;
						}, 1000);
					}
					this.perid = "boom20_1" + this.funcSet;
					this.n1 = "boom19_1" + this.funcSet;
					this.n2 = "boom18_1" + this.funcSet;
					this.n3 = "boom17_1" + this.funcSet;
					this.n4 = "boom16_1" + this.funcSet;
					this.n5 = "boom15_1" + this.funcSet;
					this.n6 = "boom14_1" + this.funcSet;
					this.n7 = "boom13_1" + this.funcSet;
					this.n8 = "boom12_1" + this.funcSet;
					this.n9 = "boom11_1" + this.funcSet;
					this.n0 = "boom10_1" + this.funcSet;
					this.minus = "boom9_1" + this.funcSet;
					this.plus = "boom8_1" + this.funcSet;
					this.bsp = "boom7_1" + this.funcSet;
					this.insert = "boom6_1" + this.funcSet;
					this.home = "boom5_1" + this.funcSet;
					this.pup = "boom4_1" + this.funcSet;
					this.numlock = "boom3_1" + this.funcSet;
					this.numdrawn = "boom2_1" + this.funcSet;
					this.numtimes = "boom1_1" + this.funcSet;
					this.numminus = "boom2_1" + this.funcSet;

					this.num = 1;
				}
				else if (this.num == 1) {
					this.num = 0;
					// this.clear();
					if (this.keyFlag2 == 0) {
						this.keyFlag2 = 1;
						setTimeout(() => {
							this.keyFlag2 = 0;
							this.perid = "" + this.funcSet;
							this.n1 = "" + this.funcSet;
							this.n2 = "" + this.funcSet;
							this.n3 = "" + this.funcSet;
							this.n4 = "" + this.funcSet;
							this.n5 = "" + this.funcSet;
							this.n6 = "" + this.funcSet;
							this.n7 = "" + this.funcSet;
							this.n8 = "" + this.funcSet;
							this.n9 = "" + this.funcSet;
							this.n0 = "" + this.funcSet;
							this.minus = "" + this.funcSet;
							this.plus = "" + this.funcSet;
							this.bsp = "" + this.funcSet;
							this.insert = "" + this.funcSet;
							this.home = "" + this.funcSet;
							this.pup = "" + this.funcSet;
							this.numlock = "" + this.funcSet;
							this.numdrawn = "" + this.funcSet;
							this.numtimes = "" + this.funcSet;
							this.numminus = "" + this.funcSet;
						}, 1000);
					}
					this.perid = "boom20_2" + this.funcSet;
					this.n1 = "boom19_2" + this.funcSet;
					this.n2 = "boom18_2" + this.funcSet;
					this.n3 = "boom17_2" + this.funcSet;
					this.n4 = "boom16_2" + this.funcSet;
					this.n5 = "boom15_2" + this.funcSet;
					this.n6 = "boom14_2" + this.funcSet;
					this.n7 = "boom13_2" + this.funcSet;
					this.n8 = "boom12_2" + this.funcSet;
					this.n9 = "boom11_2" + this.funcSet;
					this.n0 = "boom10_2" + this.funcSet;
					this.minus = "boom9_2" + this.funcSet;
					this.plus = "boom8_2" + this.funcSet;
					this.bsp = "boom7_2" + this.funcSet;
					this.insert = "boom6_2" + this.funcSet;
					this.home = "boom5_2" + this.funcSet;
					this.pup = "boom4_2" + this.funcSet;
					this.numlock = "boom3_2" + this.funcSet;
					this.numdrawn = "boom2_2" + this.funcSet;
					this.numtimes = "boom1_2" + this.funcSet;
					this.numminus = "boom2_2" + this.funcSet;
				}
				break;

			case this.vKey == 109 && this.keyStatus == 1: //numminus
				if (this.num == 0) {
					// this.clear();
					if (this.keyFlag1 == 0) {
						this.keyFlag1 = 1;
						setTimeout(() => {
							this.keyFlag1 = 0;
							this.perid = "" + this.funcSet;
							this.n1 = "" + this.funcSet;
							this.n2 = "" + this.funcSet;
							this.n3 = "" + this.funcSet;
							this.n4 = "" + this.funcSet;
							this.n5 = "" + this.funcSet;
							this.n6 = "" + this.funcSet;
							this.n7 = "" + this.funcSet;
							this.n8 = "" + this.funcSet;
							this.n9 = "" + this.funcSet;
							this.n0 = "" + this.funcSet;
							this.minus = "" + this.funcSet;
							this.plus = "" + this.funcSet;
							this.bsp = "" + this.funcSet;
							this.insert = "" + this.funcSet;
							this.home = "" + this.funcSet;
							this.pup = "" + this.funcSet;
							this.numlock = "" + this.funcSet;
							this.numdrawn = "" + this.funcSet;
							this.numtimes = "" + this.funcSet;
							this.numminus = "" + this.funcSet;
						}, 1000);
					}
					this.perid = "boom21_1" + this.funcSet;
					this.n1 = "boom20_1" + this.funcSet;
					this.n2 = "boom19_1" + this.funcSet;
					this.n3 = "boom18_1" + this.funcSet;
					this.n4 = "boom17_1" + this.funcSet;
					this.n5 = "boom16_1" + this.funcSet;
					this.n6 = "boom15_1" + this.funcSet;
					this.n7 = "boom14_1" + this.funcSet;
					this.n8 = "boom13_1" + this.funcSet;
					this.n9 = "boom12_1" + this.funcSet;
					this.n0 = "boom11_1" + this.funcSet;
					this.minus = "boom10_1" + this.funcSet;
					this.plus = "boom9_1" + this.funcSet;
					this.bsp = "boom8_1" + this.funcSet;
					this.insert = "boom7_1" + this.funcSet;
					this.home = "boom6_1" + this.funcSet;
					this.pup = "boom5_1" + this.funcSet;
					this.numlock = "boom4_1" + this.funcSet;
					this.numdrawn = "boom3_1" + this.funcSet;
					this.numtimes = "boom2_1" + this.funcSet;
					this.numminus = "boom1_1" + this.funcSet;

					this.num = 1;
				}
				else if (this.num == 1) {
					this.num = 0;
					// this.clear();
					if (this.keyFlag2 == 0) {
						this.keyFlag2 = 1;
						setTimeout(() => {
							this.keyFlag2 = 0;
							this.perid = "" + this.funcSet;
							this.n1 = "" + this.funcSet;
							this.n2 = "" + this.funcSet;
							this.n3 = "" + this.funcSet;
							this.n4 = "" + this.funcSet;
							this.n5 = "" + this.funcSet;
							this.n6 = "" + this.funcSet;
							this.n7 = "" + this.funcSet;
							this.n8 = "" + this.funcSet;
							this.n9 = "" + this.funcSet;
							this.n0 = "" + this.funcSet;
							this.minus = "" + this.funcSet;
							this.plus = "" + this.funcSet;
							this.bsp = "" + this.funcSet;
							this.insert = "" + this.funcSet;
							this.home = "" + this.funcSet;
							this.pup = "" + this.funcSet;
							this.numlock = "" + this.funcSet;
							this.numdrawn = "" + this.funcSet;
							this.numtimes = "" + this.funcSet;
							this.numminus = "" + this.funcSet;
						}, 1000);
					}
					this.perid = "boom21_2" + this.funcSet;
					this.n1 = "boom20_2" + this.funcSet;
					this.n2 = "boom19_2" + this.funcSet;
					this.n3 = "boom18_2" + this.funcSet;
					this.n4 = "boom17_2" + this.funcSet;
					this.n5 = "boom16_2" + this.funcSet;
					this.n6 = "boom15_2" + this.funcSet;
					this.n7 = "boom14_2" + this.funcSet;
					this.n8 = "boom13_2" + this.funcSet;
					this.n9 = "boom12_2" + this.funcSet;
					this.n0 = "boom11_2" + this.funcSet;
					this.minus = "boom10_2" + this.funcSet;
					this.plus = "boom9_2" + this.funcSet;
					this.bsp = "boom8_2" + this.funcSet;
					this.insert = "boom7_2" + this.funcSet;
					this.home = "boom6_2" + this.funcSet;
					this.pup = "boom5_2" + this.funcSet;
					this.numlock = "boom4_2" + this.funcSet;
					this.numdrawn = "boom3_2" + this.funcSet;
					this.numtimes = "boom2_2" + this.funcSet;
					this.numminus = "boom1_2" + this.funcSet;
				}
				break;

			case this.vKey == 9 && this.keyStatus == 1: //tab
				if (this.num == 0) {
					// this.clear();
					if (this.keyFlag1 == 0) {
						this.keyFlag1 = 1;
						setTimeout(() => {
							this.keyFlag1 = 0;
							this.tab = '' + this.funcSet;
							this.q = "" + this.funcSet;
							this.w = "" + this.funcSet;
							this.e = "" + this.funcSet;
							this.r = "" + this.funcSet;
							this.t = "" + this.funcSet;
							this.y = "" + this.funcSet;
							this.u = "" + this.funcSet;
							this.i = "" + this.funcSet;
							this.o = "" + this.funcSet;
							this.p = "" + this.funcSet;
							this.lqu = "" + this.funcSet;
							this.rqu = "" + this.funcSet;
							this.drawn = "" + this.funcSet;
							this.delete = "" + this.funcSet;
							this.end = "" + this.funcSet;
							this.pdown = "" + this.funcSet;
							this.num7 = "" + this.funcSet;
							this.num8 = "" + this.funcSet;
							this.num9 = "" + this.funcSet;
							this.numplus = "" + this.funcSet;
						}, 1000);
					}
					this.tab = 'boom1_1' + this.funcSet;
					this.q = "boom2_1" + this.funcSet;
					this.w = "boom3_1" + this.funcSet;
					this.e = "boom4_1" + this.funcSet;
					this.r = "boom5_1" + this.funcSet;
					this.t = "boom6_1" + this.funcSet;
					this.y = "boom7_1" + this.funcSet;
					this.u = "boom8_1" + this.funcSet;
					this.i = "boom9_1" + this.funcSet;
					this.o = "boom10_1" + this.funcSet;
					this.p = "boom11_1" + this.funcSet;
					this.lqu = "boom12_1" + this.funcSet;
					this.rqu = "boom13_1" + this.funcSet;
					this.drawn = "boom14_1" + this.funcSet;
					this.delete = "boom15_1" + this.funcSet;
					this.end = "boom16_1" + this.funcSet;
					this.pdown = "boom17_1" + this.funcSet;
					this.num7 = "boom18_1" + this.funcSet;
					this.num8 = "boom19_1" + this.funcSet;
					this.num9 = "boom20_1" + this.funcSet;
					this.numplus = "boom21_1" + this.funcSet;
					this.num = 1;
				}
				else if (this.num == 1) {
					this.num = 0;
					// this.clear();
					if (this.keyFlag2 == 0) {
						this.keyFlag2 = 1;
						setTimeout(() => {
							this.keyFlag2 = 0;
							this.tab = '' + this.funcSet;
							this.q = "" + this.funcSet;
							this.w = "" + this.funcSet;
							this.e = "" + this.funcSet;
							this.r = "" + this.funcSet;
							this.t = "" + this.funcSet;
							this.y = "" + this.funcSet;
							this.u = "" + this.funcSet;
							this.i = "" + this.funcSet;
							this.o = "" + this.funcSet;
							this.p = "" + this.funcSet;
							this.lqu = "" + this.funcSet;
							this.rqu = "" + this.funcSet;
							this.drawn = "" + this.funcSet;
							this.delete = "" + this.funcSet;
							this.end = "" + this.funcSet;
							this.pdown = "" + this.funcSet;
							this.num7 = "" + this.funcSet;
							this.num8 = "" + this.funcSet;
							this.num9 = "" + this.funcSet;
							this.numplus = "" + this.funcSet;
						}, 1000);
					}
					this.tab = 'boom1_2' + this.funcSet;
					this.q = "boom2_2" + this.funcSet;
					this.w = "boom3_2" + this.funcSet;
					this.e = "boom4_2" + this.funcSet;
					this.r = "boom5_2" + this.funcSet;
					this.t = "boom6_2" + this.funcSet;
					this.y = "boom7_2" + this.funcSet;
					this.u = "boom8_2" + this.funcSet;
					this.i = "boom9_2" + this.funcSet;
					this.o = "boom10_2" + this.funcSet;
					this.p = "boom11_2" + this.funcSet;
					this.lqu = "boom12_2" + this.funcSet;
					this.rqu = "boom13_2" + this.funcSet;
					this.drawn = "boom14_2" + this.funcSet;
					this.delete = "boom15_2" + this.funcSet;
					this.end = "boom16_2" + this.funcSet;
					this.pdown = "boom17_2" + this.funcSet;
					this.num7 = "boom18_2" + this.funcSet;
					this.num8 = "boom19_2" + this.funcSet;
					this.num9 = "boom20_2" + this.funcSet;
					this.numplus = "boom21_2" + this.funcSet;
				}
				break;

			case this.vKey == 81 && this.keyStatus == 1: //q
				if (this.num == 0) {
					// this.clear();
					if (this.keyFlag1 == 0) {
						this.keyFlag1 = 1;
						setTimeout(() => {
							this.keyFlag1 = 0;
							this.tab = '' + this.funcSet;
							this.q = "" + this.funcSet;
							this.w = "" + this.funcSet;
							this.e = "" + this.funcSet;
							this.r = "" + this.funcSet;
							this.t = "" + this.funcSet;
							this.y = "" + this.funcSet;
							this.u = "" + this.funcSet;
							this.i = "" + this.funcSet;
							this.o = "" + this.funcSet;
							this.p = "" + this.funcSet;
							this.lqu = "" + this.funcSet;
							this.rqu = "" + this.funcSet;
							this.drawn = "" + this.funcSet;
							this.delete = "" + this.funcSet;
							this.end = "" + this.funcSet;
							this.pdown = "" + this.funcSet;
							this.num7 = "" + this.funcSet;
							this.num8 = "" + this.funcSet;
							this.num9 = "" + this.funcSet;
							this.numplus = "" + this.funcSet;
						}, 1000);
					}
					this.tab = 'boom2_1' + this.funcSet;
					this.q = "boom1_1" + this.funcSet;
					this.w = "boom2_1" + this.funcSet;
					this.e = "boom3_1" + this.funcSet;
					this.r = "boom4_1" + this.funcSet;
					this.t = "boom5_1" + this.funcSet;
					this.y = "boom6_1" + this.funcSet;
					this.u = "boom7_1" + this.funcSet;
					this.i = "boom8_1" + this.funcSet;
					this.o = "boom9_1" + this.funcSet;
					this.p = "boom10_1" + this.funcSet;
					this.lqu = "boom11_1" + this.funcSet;
					this.rqu = "boom12_1" + this.funcSet;
					this.drawn = "boom13_1" + this.funcSet;
					this.delete = "boom14_1" + this.funcSet;
					this.end = "boom15_1" + this.funcSet;
					this.pdown = "boom16_1" + this.funcSet;
					this.num7 = "boom17_1" + this.funcSet;
					this.num8 = "boom18_1" + this.funcSet;
					this.num9 = "boom19_1" + this.funcSet;
					this.numplus = "boom20_1" + this.funcSet;

					this.num = 1;
				}
				else if (this.num == 1) {
					this.num = 0;
					// this.clear();
					if (this.keyFlag2 == 0) {
						this.keyFlag2 = 1;
						setTimeout(() => {
							this.keyFlag2 = 0;
							this.tab = '' + this.funcSet;
							this.q = "" + this.funcSet;
							this.w = "" + this.funcSet;
							this.e = "" + this.funcSet;
							this.r = "" + this.funcSet;
							this.t = "" + this.funcSet;
							this.y = "" + this.funcSet;
							this.u = "" + this.funcSet;
							this.i = "" + this.funcSet;
							this.o = "" + this.funcSet;
							this.p = "" + this.funcSet;
							this.lqu = "" + this.funcSet;
							this.rqu = "" + this.funcSet;
							this.drawn = "" + this.funcSet;
							this.delete = "" + this.funcSet;
							this.end = "" + this.funcSet;
							this.pdown = "" + this.funcSet;
							this.num7 = "" + this.funcSet;
							this.num8 = "" + this.funcSet;
							this.num9 = "" + this.funcSet;
							this.numplus = "" + this.funcSet;
						}, 1000);
					}
					this.tab = 'boom2_2' + this.funcSet;
					this.q = "boom1_2" + this.funcSet;
					this.w = "boom2_2" + this.funcSet;
					this.e = "boom3_2" + this.funcSet;
					this.r = "boom4_2" + this.funcSet;
					this.t = "boom5_2" + this.funcSet;
					this.y = "boom6_2" + this.funcSet;
					this.u = "boom7_2" + this.funcSet;
					this.i = "boom8_2" + this.funcSet;
					this.o = "boom9_2" + this.funcSet;
					this.p = "boom10_2" + this.funcSet;
					this.lqu = "boom11_2" + this.funcSet;
					this.rqu = "boom12_2" + this.funcSet;
					this.drawn = "boom13_2" + this.funcSet;
					this.delete = "boom14_2" + this.funcSet;
					this.end = "boom15_2" + this.funcSet;
					this.pdown = "boom16_2" + this.funcSet;
					this.num7 = "boom17_2" + this.funcSet;
					this.num8 = "boom18_2" + this.funcSet;
					this.num9 = "boom19_2" + this.funcSet;
					this.numplus = "boom20_2" + this.funcSet;

				}
				break;

			case this.vKey == 87 && this.keyStatus == 1: //w
				if (this.num == 0) {
					// this.clear();
					if (this.keyFlag1 == 0) {
						this.keyFlag1 = 1;
						setTimeout(() => {
							this.keyFlag1 = 0;
							this.tab = '' + this.funcSet;
							this.q = "" + this.funcSet;
							this.w = "" + this.funcSet;
							this.e = "" + this.funcSet;
							this.r = "" + this.funcSet;
							this.t = "" + this.funcSet;
							this.y = "" + this.funcSet;
							this.u = "" + this.funcSet;
							this.i = "" + this.funcSet;
							this.o = "" + this.funcSet;
							this.p = "" + this.funcSet;
							this.lqu = "" + this.funcSet;
							this.rqu = "" + this.funcSet;
							this.drawn = "" + this.funcSet;
							this.delete = "" + this.funcSet;
							this.end = "" + this.funcSet;
							this.pdown = "" + this.funcSet;
							this.num7 = "" + this.funcSet;
							this.num8 = "" + this.funcSet;
							this.num9 = "" + this.funcSet;
							this.numplus = "" + this.funcSet;
						}, 1000);
					}
					this.tab = 'boom3_1' + this.funcSet;
					this.q = "boom2_1" + this.funcSet;
					this.w = "boom1_1" + this.funcSet;
					this.e = "boom2_1" + this.funcSet;
					this.r = "boom3_1" + this.funcSet;
					this.t = "boom4_1" + this.funcSet;
					this.y = "boom5_1" + this.funcSet;
					this.u = "boom6_1" + this.funcSet;
					this.i = "boom7_1" + this.funcSet;
					this.o = "boom8_1" + this.funcSet;
					this.p = "boom9_1" + this.funcSet;
					this.lqu = "boom10_1" + this.funcSet;
					this.rqu = "boom11_1" + this.funcSet;
					this.drawn = "boom12_1" + this.funcSet;
					this.delete = "boom13_1" + this.funcSet;
					this.end = "boom14_1" + this.funcSet;
					this.pdown = "boom15_1" + this.funcSet;
					this.num7 = "boom16_1" + this.funcSet;
					this.num8 = "boom17_1" + this.funcSet;
					this.num9 = "boom18_1" + this.funcSet;
					this.numplus = "boom19_1" + this.funcSet;

					this.num = 1;
				}
				else if (this.num == 1) {
					this.num = 0;
					// this.clear();
					if (this.keyFlag2 == 0) {
						this.keyFlag2 = 1;
						setTimeout(() => {
							this.keyFlag2 = 0;
							this.tab = '' + this.funcSet;
							this.q = "" + this.funcSet;
							this.w = "" + this.funcSet;
							this.e = "" + this.funcSet;
							this.r = "" + this.funcSet;
							this.t = "" + this.funcSet;
							this.y = "" + this.funcSet;
							this.u = "" + this.funcSet;
							this.i = "" + this.funcSet;
							this.o = "" + this.funcSet;
							this.p = "" + this.funcSet;
							this.lqu = "" + this.funcSet;
							this.rqu = "" + this.funcSet;
							this.drawn = "" + this.funcSet;
							this.delete = "" + this.funcSet;
							this.end = "" + this.funcSet;
							this.pdown = "" + this.funcSet;
							this.num7 = "" + this.funcSet;
							this.num8 = "" + this.funcSet;
							this.num9 = "" + this.funcSet;
							this.numplus = "" + this.funcSet;
						}, 1000);
					}
					this.tab = 'boom3_2' + this.funcSet;
					this.q = "boom2_2" + this.funcSet;
					this.w = "boom1_2" + this.funcSet;
					this.e = "boom2_2" + this.funcSet;
					this.r = "boom3_2" + this.funcSet;
					this.t = "boom4_2" + this.funcSet;
					this.y = "boom5_2" + this.funcSet;
					this.u = "boom6_2" + this.funcSet;
					this.i = "boom7_2" + this.funcSet;
					this.o = "boom8_2" + this.funcSet;
					this.p = "boom9_2" + this.funcSet;
					this.lqu = "boom10_2" + this.funcSet;
					this.rqu = "boom11_2" + this.funcSet;
					this.drawn = "boom12_2" + this.funcSet;
					this.delete = "boom13_2" + this.funcSet;
					this.end = "boom14_2" + this.funcSet;
					this.pdown = "boom15_2" + this.funcSet;
					this.num7 = "boom16_2" + this.funcSet;
					this.num8 = "boom17_2" + this.funcSet;
					this.num9 = "boom18_2" + this.funcSet;
					this.numplus = "boom19_2" + this.funcSet;

				}
				break;

			case this.vKey == 69 && this.keyStatus == 1: //E
				if (this.num == 0) {
					// this.clear();
					if (this.keyFlag1 == 0) {
						this.keyFlag1 = 1;
						setTimeout(() => {
							this.keyFlag1 = 0;
							this.tab = '' + this.funcSet;
							this.q = "" + this.funcSet;
							this.w = "" + this.funcSet;
							this.e = "" + this.funcSet;
							this.r = "" + this.funcSet;
							this.t = "" + this.funcSet;
							this.y = "" + this.funcSet;
							this.u = "" + this.funcSet;
							this.i = "" + this.funcSet;
							this.o = "" + this.funcSet;
							this.p = "" + this.funcSet;
							this.lqu = "" + this.funcSet;
							this.rqu = "" + this.funcSet;
							this.drawn = "" + this.funcSet;
							this.delete = "" + this.funcSet;
							this.end = "" + this.funcSet;
							this.pdown = "" + this.funcSet;
							this.num7 = "" + this.funcSet;
							this.num8 = "" + this.funcSet;
							this.num9 = "" + this.funcSet;
							this.numplus = "" + this.funcSet;
						}, 1000);
					}
					this.tab = 'boom4_1' + this.funcSet;
					this.q = "boom3_1" + this.funcSet;
					this.w = "boom2_1" + this.funcSet;
					this.e = "boom1_1" + this.funcSet;
					this.r = "boom2_1" + this.funcSet;
					this.t = "boom3_1" + this.funcSet;
					this.y = "boom4_1" + this.funcSet;
					this.u = "boom5_1" + this.funcSet;
					this.i = "boom6_1" + this.funcSet;
					this.o = "boom7_1" + this.funcSet;
					this.p = "boom8_1" + this.funcSet;
					this.lqu = "boom9_1" + this.funcSet;
					this.rqu = "boom10_1" + this.funcSet;
					this.drawn = "boom11_1" + this.funcSet;
					this.delete = "boom12_1" + this.funcSet;
					this.end = "boom13_1" + this.funcSet;
					this.pdown = "boom14_1" + this.funcSet;
					this.num7 = "boom15_1" + this.funcSet;
					this.num8 = "boom16_1" + this.funcSet;
					this.num9 = "boom17_1" + this.funcSet;
					this.numplus = "boom18_1" + this.funcSet;

					this.num = 1;
				}
				else if (this.num == 1) {
					this.num = 0;
					// this.clear();
					if (this.keyFlag2 == 0) {
						this.keyFlag2 = 1;
						setTimeout(() => {
							this.keyFlag2 = 0;
							this.tab = '' + this.funcSet;
							this.q = "" + this.funcSet;
							this.w = "" + this.funcSet;
							this.e = "" + this.funcSet;
							this.r = "" + this.funcSet;
							this.t = "" + this.funcSet;
							this.y = "" + this.funcSet;
							this.u = "" + this.funcSet;
							this.i = "" + this.funcSet;
							this.o = "" + this.funcSet;
							this.p = "" + this.funcSet;
							this.lqu = "" + this.funcSet;
							this.rqu = "" + this.funcSet;
							this.drawn = "" + this.funcSet;
							this.delete = "" + this.funcSet;
							this.end = "" + this.funcSet;
							this.pdown = "" + this.funcSet;
							this.num7 = "" + this.funcSet;
							this.num8 = "" + this.funcSet;
							this.num9 = "" + this.funcSet;
							this.numplus = "" + this.funcSet;
						}, 1000);
					}
					this.tab = 'boom4_2' + this.funcSet;
					this.q = "boom3_2" + this.funcSet;
					this.w = "boom2_2" + this.funcSet;
					this.e = "boom1_2" + this.funcSet;
					this.r = "boom2_2" + this.funcSet;
					this.t = "boom3_2" + this.funcSet;
					this.y = "boom4_2" + this.funcSet;
					this.u = "boom5_2" + this.funcSet;
					this.i = "boom6_2" + this.funcSet;
					this.o = "boom7_2" + this.funcSet;
					this.p = "boom8_2" + this.funcSet;
					this.lqu = "boom9_2" + this.funcSet;
					this.rqu = "boom10_2" + this.funcSet;
					this.drawn = "boom11_2" + this.funcSet;
					this.delete = "boom12_2" + this.funcSet;
					this.end = "boom13_2" + this.funcSet;
					this.pdown = "boom14_2" + this.funcSet;
					this.num7 = "boom15_2" + this.funcSet;
					this.num8 = "boom16_2" + this.funcSet;
					this.num9 = "boom17_2" + this.funcSet;
					this.numplus = "boom18_2" + this.funcSet;

				}
				break;

			case this.vKey == 82 && this.keyStatus == 1: //R
				if (this.num == 0) {
					// this.clear();
					if (this.keyFlag1 == 0) {
						this.keyFlag1 = 1;
						setTimeout(() => {
							this.keyFlag1 = 0;
							this.tab = '' + this.funcSet;
							this.q = "" + this.funcSet;
							this.w = "" + this.funcSet;
							this.e = "" + this.funcSet;
							this.r = "" + this.funcSet;
							this.t = "" + this.funcSet;
							this.y = "" + this.funcSet;
							this.u = "" + this.funcSet;
							this.i = "" + this.funcSet;
							this.o = "" + this.funcSet;
							this.p = "" + this.funcSet;
							this.lqu = "" + this.funcSet;
							this.rqu = "" + this.funcSet;
							this.drawn = "" + this.funcSet;
							this.delete = "" + this.funcSet;
							this.end = "" + this.funcSet;
							this.pdown = "" + this.funcSet;
							this.num7 = "" + this.funcSet;
							this.num8 = "" + this.funcSet;
							this.num9 = "" + this.funcSet;
							this.numplus = "" + this.funcSet;
						}, 1000);
					}
					this.tab = 'boom5_1' + this.funcSet;
					this.q = "boom4_1" + this.funcSet;
					this.w = "boom3_1" + this.funcSet;
					this.e = "boom2_1" + this.funcSet;
					this.r = "boom1_1" + this.funcSet;
					this.t = "boom2_1" + this.funcSet;
					this.y = "boom3_1" + this.funcSet;
					this.u = "boom4_1" + this.funcSet;
					this.i = "boom5_1" + this.funcSet;
					this.o = "boom6_1" + this.funcSet;
					this.p = "boom7_1" + this.funcSet;
					this.lqu = "boom8_1" + this.funcSet;
					this.rqu = "boom9_1" + this.funcSet;
					this.drawn = "boom10_1" + this.funcSet;
					this.delete = "boom11_1" + this.funcSet;
					this.end = "boom12_1" + this.funcSet;
					this.pdown = "boom13_1" + this.funcSet;
					this.num7 = "boom14_1" + this.funcSet;
					this.num8 = "boom15_1" + this.funcSet;
					this.num9 = "boom16_1" + this.funcSet;
					this.numplus = "boom17_1" + this.funcSet;

					this.num = 1;
				}
				else if (this.num == 1) {
					this.num = 0;
					// this.clear();
					if (this.keyFlag2 == 0) {
						this.keyFlag2 = 1;
						setTimeout(() => {
							this.keyFlag2 = 0;
							this.tab = '' + this.funcSet;
							this.q = "" + this.funcSet;
							this.w = "" + this.funcSet;
							this.e = "" + this.funcSet;
							this.r = "" + this.funcSet;
							this.t = "" + this.funcSet;
							this.y = "" + this.funcSet;
							this.u = "" + this.funcSet;
							this.i = "" + this.funcSet;
							this.o = "" + this.funcSet;
							this.p = "" + this.funcSet;
							this.lqu = "" + this.funcSet;
							this.rqu = "" + this.funcSet;
							this.drawn = "" + this.funcSet;
							this.delete = "" + this.funcSet;
							this.end = "" + this.funcSet;
							this.pdown = "" + this.funcSet;
							this.num7 = "" + this.funcSet;
							this.num8 = "" + this.funcSet;
							this.num9 = "" + this.funcSet;
							this.numplus = "" + this.funcSet;
						}, 1000);
					}
					this.tab = 'boom5_2' + this.funcSet;
					this.q = "boom4_2" + this.funcSet;
					this.w = "boom3_2" + this.funcSet;
					this.e = "boom2_2" + this.funcSet;
					this.r = "boom1_2" + this.funcSet;
					this.t = "boom2_2" + this.funcSet;
					this.y = "boom3_2" + this.funcSet;
					this.u = "boom4_2" + this.funcSet;
					this.i = "boom5_2" + this.funcSet;
					this.o = "boom6_2" + this.funcSet;
					this.p = "boom7_2" + this.funcSet;
					this.lqu = "boom8_2" + this.funcSet;
					this.rqu = "boom9_2" + this.funcSet;
					this.drawn = "boom10_2" + this.funcSet;
					this.delete = "boom11_2" + this.funcSet;
					this.end = "boom12_2" + this.funcSet;
					this.pdown = "boom13_2" + this.funcSet;
					this.num7 = "boom14_2" + this.funcSet;
					this.num8 = "boom15_2" + this.funcSet;
					this.num9 = "boom16_2" + this.funcSet;
					this.numplus = "boom17_2" + this.funcSet;

				}
				break;

			case this.vKey == 84 && this.keyStatus == 1: //T
				if (this.num == 0) {
					// this.clear();
					if (this.keyFlag1 == 0) {
						this.keyFlag1 = 1;
						setTimeout(() => {
							this.keyFlag1 = 0;
							this.tab = '' + this.funcSet;
							this.q = "" + this.funcSet;
							this.w = "" + this.funcSet;
							this.e = "" + this.funcSet;
							this.r = "" + this.funcSet;
							this.t = "" + this.funcSet;
							this.y = "" + this.funcSet;
							this.u = "" + this.funcSet;
							this.i = "" + this.funcSet;
							this.o = "" + this.funcSet;
							this.p = "" + this.funcSet;
							this.lqu = "" + this.funcSet;
							this.rqu = "" + this.funcSet;
							this.drawn = "" + this.funcSet;
							this.delete = "" + this.funcSet;
							this.end = "" + this.funcSet;
							this.pdown = "" + this.funcSet;
							this.num7 = "" + this.funcSet;
							this.num8 = "" + this.funcSet;
							this.num9 = "" + this.funcSet;
							this.numplus = "" + this.funcSet;
						}, 1000);
					}
					this.tab = 'boom6_1' + this.funcSet;
					this.q = "boom5_1" + this.funcSet;
					this.w = "boom4_1" + this.funcSet;
					this.e = "boom3_1" + this.funcSet;
					this.r = "boom2_1" + this.funcSet;
					this.t = "boom1_1" + this.funcSet;
					this.y = "boom2_1" + this.funcSet;
					this.u = "boom3_1" + this.funcSet;
					this.i = "boom4_1" + this.funcSet;
					this.o = "boom5_1" + this.funcSet;
					this.p = "boom6_1" + this.funcSet;
					this.lqu = "boom7_1" + this.funcSet;
					this.rqu = "boom8_1" + this.funcSet;
					this.drawn = "boom9_1" + this.funcSet;
					this.delete = "boom10_1" + this.funcSet;
					this.end = "boom11_1" + this.funcSet;
					this.pdown = "boom12_1" + this.funcSet;
					this.num7 = "boom13_1" + this.funcSet;
					this.num8 = "boom14_1" + this.funcSet;
					this.num9 = "boom15_1" + this.funcSet;
					this.numplus = "boom16_1" + this.funcSet;

					this.num = 1;
				}
				else if (this.num == 1) {
					this.num = 0;
					// this.clear();
					if (this.keyFlag2 == 0) {
						this.keyFlag2 = 1;
						setTimeout(() => {
							this.keyFlag2 = 0;
							this.tab = '' + this.funcSet;
							this.q = "" + this.funcSet;
							this.w = "" + this.funcSet;
							this.e = "" + this.funcSet;
							this.r = "" + this.funcSet;
							this.t = "" + this.funcSet;
							this.y = "" + this.funcSet;
							this.u = "" + this.funcSet;
							this.i = "" + this.funcSet;
							this.o = "" + this.funcSet;
							this.p = "" + this.funcSet;
							this.lqu = "" + this.funcSet;
							this.rqu = "" + this.funcSet;
							this.drawn = "" + this.funcSet;
							this.delete = "" + this.funcSet;
							this.end = "" + this.funcSet;
							this.pdown = "" + this.funcSet;
							this.num7 = "" + this.funcSet;
							this.num8 = "" + this.funcSet;
							this.num9 = "" + this.funcSet;
							this.numplus = "" + this.funcSet;
						}, 1000);
					}
					this.tab = 'boom6_2' + this.funcSet;
					this.q = "boom5_2" + this.funcSet;
					this.w = "boom4_2" + this.funcSet;
					this.e = "boom3_2" + this.funcSet;
					this.r = "boom2_2" + this.funcSet;
					this.t = "boom1_2" + this.funcSet;
					this.y = "boom2_2" + this.funcSet;
					this.u = "boom3_2" + this.funcSet;
					this.i = "boom4_2" + this.funcSet;
					this.o = "boom5_2" + this.funcSet;
					this.p = "boom6_2" + this.funcSet;
					this.lqu = "boom7_2" + this.funcSet;
					this.rqu = "boom8_2" + this.funcSet;
					this.drawn = "boom9_2" + this.funcSet;
					this.delete = "boom10_2" + this.funcSet;
					this.end = "boom11_2" + this.funcSet;
					this.pdown = "boom12_2" + this.funcSet;
					this.num7 = "boom13_2" + this.funcSet;
					this.num8 = "boom14_2" + this.funcSet;
					this.num9 = "boom15_2" + this.funcSet;
					this.numplus = "boom16_2" + this.funcSet;

				}
				break;

			case this.vKey == 89 && this.keyStatus == 1: //Y
				if (this.num == 0) {
					// this.clear();
					if (this.keyFlag1 == 0) {
						this.keyFlag1 = 1;
						setTimeout(() => {
							this.keyFlag1 = 0;
							this.tab = '' + this.funcSet;
							this.q = "" + this.funcSet;
							this.w = "" + this.funcSet;
							this.e = "" + this.funcSet;
							this.r = "" + this.funcSet;
							this.t = "" + this.funcSet;
							this.y = "" + this.funcSet;
							this.u = "" + this.funcSet;
							this.i = "" + this.funcSet;
							this.o = "" + this.funcSet;
							this.p = "" + this.funcSet;
							this.lqu = "" + this.funcSet;
							this.rqu = "" + this.funcSet;
							this.drawn = "" + this.funcSet;
							this.delete = "" + this.funcSet;
							this.end = "" + this.funcSet;
							this.pdown = "" + this.funcSet;
							this.num7 = "" + this.funcSet;
							this.num8 = "" + this.funcSet;
							this.num9 = "" + this.funcSet;
							this.numplus = "" + this.funcSet;
						}, 1000);
					}
					this.tab = 'boom7_1' + this.funcSet;
					this.q = "boom6_1" + this.funcSet;
					this.w = "boom5_1" + this.funcSet;
					this.e = "boom4_1" + this.funcSet;
					this.r = "boom3_1" + this.funcSet;
					this.t = "boom2_1" + this.funcSet;
					this.y = "boom1_1" + this.funcSet;
					this.u = "boom2_1" + this.funcSet;
					this.i = "boom3_1" + this.funcSet;
					this.o = "boom4_1" + this.funcSet;
					this.p = "boom5_1" + this.funcSet;
					this.lqu = "boom6_1" + this.funcSet;
					this.rqu = "boom7_1" + this.funcSet;
					this.drawn = "boom8_1" + this.funcSet;
					this.delete = "boom9_1" + this.funcSet;
					this.end = "boom10_1" + this.funcSet;
					this.pdown = "boom11_1" + this.funcSet;
					this.num7 = "boom12_1" + this.funcSet;
					this.num8 = "boom13_1" + this.funcSet;
					this.num9 = "boom14_1" + this.funcSet;
					this.numplus = "boom15_1" + this.funcSet;

					this.num = 1;
				}
				else if (this.num == 1) {
					this.num = 0;
					// this.clear();
					if (this.keyFlag2 == 0) {
						this.keyFlag2 = 1;
						setTimeout(() => {
							this.keyFlag2 = 0;
							this.tab = '' + this.funcSet;
							this.q = "" + this.funcSet;
							this.w = "" + this.funcSet;
							this.e = "" + this.funcSet;
							this.r = "" + this.funcSet;
							this.t = "" + this.funcSet;
							this.y = "" + this.funcSet;
							this.u = "" + this.funcSet;
							this.i = "" + this.funcSet;
							this.o = "" + this.funcSet;
							this.p = "" + this.funcSet;
							this.lqu = "" + this.funcSet;
							this.rqu = "" + this.funcSet;
							this.drawn = "" + this.funcSet;
							this.delete = "" + this.funcSet;
							this.end = "" + this.funcSet;
							this.pdown = "" + this.funcSet;
							this.num7 = "" + this.funcSet;
							this.num8 = "" + this.funcSet;
							this.num9 = "" + this.funcSet;
							this.numplus = "" + this.funcSet;
						}, 1000);
					}
					this.tab = 'boom7_2' + this.funcSet;
					this.q = "boom6_2" + this.funcSet;
					this.w = "boom5_2" + this.funcSet;
					this.e = "boom4_2" + this.funcSet;
					this.r = "boom3_2" + this.funcSet;
					this.t = "boom2_2" + this.funcSet;
					this.y = "boom1_2" + this.funcSet;
					this.u = "boom2_2" + this.funcSet;
					this.i = "boom3_2" + this.funcSet;
					this.o = "boom4_2" + this.funcSet;
					this.p = "boom5_2" + this.funcSet;
					this.lqu = "boom6_2" + this.funcSet;
					this.rqu = "boom7_2" + this.funcSet;
					this.drawn = "boom8_2" + this.funcSet;
					this.delete = "boom9_2" + this.funcSet;
					this.end = "boom10_2" + this.funcSet;
					this.pdown = "boom11_2" + this.funcSet;
					this.num7 = "boom12_2" + this.funcSet;
					this.num8 = "boom13_2" + this.funcSet;
					this.num9 = "boom14_2" + this.funcSet;
					this.numplus = "boom15_2" + this.funcSet;

				}
				break;

			case this.vKey == 85 && this.keyStatus == 1: //U
				if (this.num == 0) {
					// this.clear();
					if (this.keyFlag1 == 0) {
						this.keyFlag1 = 1;
						setTimeout(() => {
							this.keyFlag1 = 0;
							this.tab = '' + this.funcSet;
							this.q = "" + this.funcSet;
							this.w = "" + this.funcSet;
							this.e = "" + this.funcSet;
							this.r = "" + this.funcSet;
							this.t = "" + this.funcSet;
							this.y = "" + this.funcSet;
							this.u = "" + this.funcSet;
							this.i = "" + this.funcSet;
							this.o = "" + this.funcSet;
							this.p = "" + this.funcSet;
							this.lqu = "" + this.funcSet;
							this.rqu = "" + this.funcSet;
							this.drawn = "" + this.funcSet;
							this.delete = "" + this.funcSet;
							this.end = "" + this.funcSet;
							this.pdown = "" + this.funcSet;
							this.num7 = "" + this.funcSet;
							this.num8 = "" + this.funcSet;
							this.num9 = "" + this.funcSet;
							this.numplus = "" + this.funcSet;
						}, 1000);
					}
					this.tab = 'boom8_1' + this.funcSet;
					this.q = "boom7_1" + this.funcSet;
					this.w = "boom6_1" + this.funcSet;
					this.e = "boom5_1" + this.funcSet;
					this.r = "boom4_1" + this.funcSet;
					this.t = "boom3_1" + this.funcSet;
					this.y = "boom2_1" + this.funcSet;
					this.u = "boom1_1" + this.funcSet;
					this.i = "boom2_1" + this.funcSet;
					this.o = "boom3_1" + this.funcSet;
					this.p = "boom4_1" + this.funcSet;
					this.lqu = "boom5_1" + this.funcSet;
					this.rqu = "boom6_1" + this.funcSet;
					this.drawn = "boom7_1" + this.funcSet;
					this.delete = "boom8_1" + this.funcSet;
					this.end = "boom9_1" + this.funcSet;
					this.pdown = "boom10_1" + this.funcSet;
					this.num7 = "boom11_1" + this.funcSet;
					this.num8 = "boom12_1" + this.funcSet;
					this.num9 = "boom13_1" + this.funcSet;
					this.numplus = "boom14_1" + this.funcSet;

					this.num = 1;
				}
				else if (this.num == 1) {
					this.num = 0;
					// this.clear();
					if (this.keyFlag2 == 0) {
						this.keyFlag2 = 1;
						setTimeout(() => {
							this.keyFlag2 = 0;
							this.tab = '' + this.funcSet;
							this.q = "" + this.funcSet;
							this.w = "" + this.funcSet;
							this.e = "" + this.funcSet;
							this.r = "" + this.funcSet;
							this.t = "" + this.funcSet;
							this.y = "" + this.funcSet;
							this.u = "" + this.funcSet;
							this.i = "" + this.funcSet;
							this.o = "" + this.funcSet;
							this.p = "" + this.funcSet;
							this.lqu = "" + this.funcSet;
							this.rqu = "" + this.funcSet;
							this.drawn = "" + this.funcSet;
							this.delete = "" + this.funcSet;
							this.end = "" + this.funcSet;
							this.pdown = "" + this.funcSet;
							this.num7 = "" + this.funcSet;
							this.num8 = "" + this.funcSet;
							this.num9 = "" + this.funcSet;
							this.numplus = "" + this.funcSet;
						}, 1000);
					}
					this.tab = 'boom8_2' + this.funcSet;
					this.q = "boom7_2" + this.funcSet;
					this.w = "boom6_2" + this.funcSet;
					this.e = "boom5_2" + this.funcSet;
					this.r = "boom4_2" + this.funcSet;
					this.t = "boom3_2" + this.funcSet;
					this.y = "boom2_2" + this.funcSet;
					this.u = "boom1_2" + this.funcSet;
					this.i = "boom2_2" + this.funcSet;
					this.o = "boom3_2" + this.funcSet;
					this.p = "boom4_2" + this.funcSet;
					this.lqu = "boom5_2" + this.funcSet;
					this.rqu = "boom6_2" + this.funcSet;
					this.drawn = "boom7_2" + this.funcSet;
					this.delete = "boom8_2" + this.funcSet;
					this.end = "boom9_2" + this.funcSet;
					this.pdown = "boom10_2" + this.funcSet;
					this.num7 = "boom11_2" + this.funcSet;
					this.num8 = "boom12_2" + this.funcSet;
					this.num9 = "boom13_2" + this.funcSet;
					this.numplus = "boom14_2" + this.funcSet;

				}
				break;

			case this.vKey == 73 && this.keyStatus == 1: //I
				if (this.num == 0) {
					// this.clear();
					if (this.keyFlag1 == 0) {
						this.keyFlag1 = 1;
						setTimeout(() => {
							this.keyFlag1 = 0;
							this.tab = '' + this.funcSet;
							this.q = "" + this.funcSet;
							this.w = "" + this.funcSet;
							this.e = "" + this.funcSet;
							this.r = "" + this.funcSet;
							this.t = "" + this.funcSet;
							this.y = "" + this.funcSet;
							this.u = "" + this.funcSet;
							this.i = "" + this.funcSet;
							this.o = "" + this.funcSet;
							this.p = "" + this.funcSet;
							this.lqu = "" + this.funcSet;
							this.rqu = "" + this.funcSet;
							this.drawn = "" + this.funcSet;
							this.delete = "" + this.funcSet;
							this.end = "" + this.funcSet;
							this.pdown = "" + this.funcSet;
							this.num7 = "" + this.funcSet;
							this.num8 = "" + this.funcSet;
							this.num9 = "" + this.funcSet;
							this.numplus = "" + this.funcSet;
						}, 1000);
					}
					this.tab = 'boom9_1' + this.funcSet;
					this.q = "boom8_1" + this.funcSet;
					this.w = "boom7_1" + this.funcSet;
					this.e = "boom6_1" + this.funcSet;
					this.r = "boom5_1" + this.funcSet;
					this.t = "boom4_1" + this.funcSet;
					this.y = "boom3_1" + this.funcSet;
					this.u = "boom2_1" + this.funcSet;
					this.i = "boom1_1" + this.funcSet;
					this.o = "boom2_1" + this.funcSet;
					this.p = "boom3_1" + this.funcSet;
					this.lqu = "boom4_1" + this.funcSet;
					this.rqu = "boom5_1" + this.funcSet;
					this.drawn = "boom6_1" + this.funcSet;
					this.delete = "boom7_1" + this.funcSet;
					this.end = "boom8_1" + this.funcSet;
					this.pdown = "boom9_1" + this.funcSet;
					this.num7 = "boom10_1" + this.funcSet;
					this.num8 = "boom11_1" + this.funcSet;
					this.num9 = "boom12_1" + this.funcSet;
					this.numplus = "boom13_1" + this.funcSet;

					this.num = 1;
				}
				else if (this.num == 1) {
					this.num = 0;
					// this.clear();
					if (this.keyFlag2 == 0) {
						this.keyFlag2 = 1;
						setTimeout(() => {
							this.keyFlag2 = 0;
							this.tab = '' + this.funcSet;
							this.q = "" + this.funcSet;
							this.w = "" + this.funcSet;
							this.e = "" + this.funcSet;
							this.r = "" + this.funcSet;
							this.t = "" + this.funcSet;
							this.y = "" + this.funcSet;
							this.u = "" + this.funcSet;
							this.i = "" + this.funcSet;
							this.o = "" + this.funcSet;
							this.p = "" + this.funcSet;
							this.lqu = "" + this.funcSet;
							this.rqu = "" + this.funcSet;
							this.drawn = "" + this.funcSet;
							this.delete = "" + this.funcSet;
							this.end = "" + this.funcSet;
							this.pdown = "" + this.funcSet;
							this.num7 = "" + this.funcSet;
							this.num8 = "" + this.funcSet;
							this.num9 = "" + this.funcSet;
							this.numplus = "" + this.funcSet;
						}, 1000);
					}
					this.tab = 'boom9_2' + this.funcSet;
					this.q = "boom8_2" + this.funcSet;
					this.w = "boom7_2" + this.funcSet;
					this.e = "boom6_2" + this.funcSet;
					this.r = "boom5_2" + this.funcSet;
					this.t = "boom4_2" + this.funcSet;
					this.y = "boom3_2" + this.funcSet;
					this.u = "boom2_2" + this.funcSet;
					this.i = "boom1_2" + this.funcSet;
					this.o = "boom2_2" + this.funcSet;
					this.p = "boom3_2" + this.funcSet;
					this.lqu = "boom4_2" + this.funcSet;
					this.rqu = "boom5_2" + this.funcSet;
					this.drawn = "boom6_2" + this.funcSet;
					this.delete = "boom7_2" + this.funcSet;
					this.end = "boom8_2" + this.funcSet;
					this.pdown = "boom9_2" + this.funcSet;
					this.num7 = "boom10_2" + this.funcSet;
					this.num8 = "boom11_2" + this.funcSet;
					this.num9 = "boom12_2" + this.funcSet;
					this.numplus = "boom13_2" + this.funcSet;

				}
				break;

			case this.vKey == 79 && this.keyStatus == 1: //O
				if (this.num == 0) {
					// this.clear();
					if (this.keyFlag1 == 0) {
						this.keyFlag1 = 1;
						setTimeout(() => {
							this.keyFlag1 = 0;
							this.tab = '' + this.funcSet;
							this.q = "" + this.funcSet;
							this.w = "" + this.funcSet;
							this.e = "" + this.funcSet;
							this.r = "" + this.funcSet;
							this.t = "" + this.funcSet;
							this.y = "" + this.funcSet;
							this.u = "" + this.funcSet;
							this.i = "" + this.funcSet;
							this.o = "" + this.funcSet;
							this.p = "" + this.funcSet;
							this.lqu = "" + this.funcSet;
							this.rqu = "" + this.funcSet;
							this.drawn = "" + this.funcSet;
							this.delete = "" + this.funcSet;
							this.end = "" + this.funcSet;
							this.pdown = "" + this.funcSet;
							this.num7 = "" + this.funcSet;
							this.num8 = "" + this.funcSet;
							this.num9 = "" + this.funcSet;
							this.numplus = "" + this.funcSet;
						}, 1000);
					}
					this.tab = 'boom10_1' + this.funcSet;
					this.q = "boom9_1" + this.funcSet;
					this.w = "boom8_1" + this.funcSet;
					this.e = "boom7_1" + this.funcSet;
					this.r = "boom6_1" + this.funcSet;
					this.t = "boom5_1" + this.funcSet;
					this.y = "boom4_1" + this.funcSet;
					this.u = "boom3_1" + this.funcSet;
					this.i = "boom2_1" + this.funcSet;
					this.o = "boom1_1" + this.funcSet;
					this.p = "boom2_1" + this.funcSet;
					this.lqu = "boom3_1" + this.funcSet;
					this.rqu = "boom4_1" + this.funcSet;
					this.drawn = "boom5_1" + this.funcSet;
					this.delete = "boom6_1" + this.funcSet;
					this.end = "boom7_1" + this.funcSet;
					this.pdown = "boom8_1" + this.funcSet;
					this.num7 = "boom9_1" + this.funcSet;
					this.num8 = "boom10_1" + this.funcSet;
					this.num9 = "boom11_1" + this.funcSet;
					this.numplus = "boom12_1" + this.funcSet;

					this.num = 1;
				}
				else if (this.num == 1) {
					this.num = 0;
					// this.clear();
					if (this.keyFlag2 == 0) {
						this.keyFlag2 = 1;
						setTimeout(() => {
							this.keyFlag2 = 0;
							this.tab = '' + this.funcSet;
							this.q = "" + this.funcSet;
							this.w = "" + this.funcSet;
							this.e = "" + this.funcSet;
							this.r = "" + this.funcSet;
							this.t = "" + this.funcSet;
							this.y = "" + this.funcSet;
							this.u = "" + this.funcSet;
							this.i = "" + this.funcSet;
							this.o = "" + this.funcSet;
							this.p = "" + this.funcSet;
							this.lqu = "" + this.funcSet;
							this.rqu = "" + this.funcSet;
							this.drawn = "" + this.funcSet;
							this.delete = "" + this.funcSet;
							this.end = "" + this.funcSet;
							this.pdown = "" + this.funcSet;
							this.num7 = "" + this.funcSet;
							this.num8 = "" + this.funcSet;
							this.num9 = "" + this.funcSet;
							this.numplus = "" + this.funcSet;
						}, 1000);
					}
					this.tab = 'boom10_2' + this.funcSet;
					this.q = "boom9_2" + this.funcSet;
					this.w = "boom8_2" + this.funcSet;
					this.e = "boom7_2" + this.funcSet;
					this.r = "boom6_2" + this.funcSet;
					this.t = "boom5_2" + this.funcSet;
					this.y = "boom4_2" + this.funcSet;
					this.u = "boom3_2" + this.funcSet;
					this.i = "boom2_2" + this.funcSet;
					this.o = "boom1_2" + this.funcSet;
					this.p = "boom2_2" + this.funcSet;
					this.lqu = "boom3_2" + this.funcSet;
					this.rqu = "boom4_2" + this.funcSet;
					this.drawn = "boom5_2" + this.funcSet;
					this.delete = "boom6_2" + this.funcSet;
					this.end = "boom7_2" + this.funcSet;
					this.pdown = "boom8_2" + this.funcSet;
					this.num7 = "boom9_2" + this.funcSet;
					this.num8 = "boom10_2" + this.funcSet;
					this.num9 = "boom11_2" + this.funcSet;
					this.numplus = "boom12_2" + this.funcSet;

				}
				break;

			case this.vKey == 80 && this.keyStatus == 1: //P
				if (this.num == 0) {
					// this.clear();
					if (this.keyFlag1 == 0) {
						this.keyFlag1 = 1;
						setTimeout(() => {
							this.keyFlag1 = 0;
							this.tab = '' + this.funcSet;
							this.q = "" + this.funcSet;
							this.w = "" + this.funcSet;
							this.e = "" + this.funcSet;
							this.r = "" + this.funcSet;
							this.t = "" + this.funcSet;
							this.y = "" + this.funcSet;
							this.u = "" + this.funcSet;
							this.i = "" + this.funcSet;
							this.o = "" + this.funcSet;
							this.p = "" + this.funcSet;
							this.lqu = "" + this.funcSet;
							this.rqu = "" + this.funcSet;
							this.drawn = "" + this.funcSet;
							this.delete = "" + this.funcSet;
							this.end = "" + this.funcSet;
							this.pdown = "" + this.funcSet;
							this.num7 = "" + this.funcSet;
							this.num8 = "" + this.funcSet;
							this.num9 = "" + this.funcSet;
							this.numplus = "" + this.funcSet;
						}, 1000);
					}
					this.tab = 'boom11_1' + this.funcSet;
					this.q = "boom10_1" + this.funcSet;
					this.w = "boom9_1" + this.funcSet;
					this.e = "boom8_1" + this.funcSet;
					this.r = "boom7_1" + this.funcSet;
					this.t = "boom6_1" + this.funcSet;
					this.y = "boom5_1" + this.funcSet;
					this.u = "boom4_1" + this.funcSet;
					this.i = "boom3_1" + this.funcSet;
					this.o = "boom2_1" + this.funcSet;
					this.p = "boom1_1" + this.funcSet;
					this.lqu = "boom2_1" + this.funcSet;
					this.rqu = "boom3_1" + this.funcSet;
					this.drawn = "boom4_1" + this.funcSet;
					this.delete = "boom5_1" + this.funcSet;
					this.end = "boom6_1" + this.funcSet;
					this.pdown = "boom7_1" + this.funcSet;
					this.num7 = "boom8_1" + this.funcSet;
					this.num8 = "boom9_1" + this.funcSet;
					this.num9 = "boom10_1" + this.funcSet;
					this.numplus = "boom11_1" + this.funcSet;

					this.num = 1;
				}
				else if (this.num == 1) {
					this.num = 0;
					// this.clear();
					if (this.keyFlag2 == 0) {
						this.keyFlag2 = 1;
						setTimeout(() => {
							this.keyFlag2 = 0;
							this.tab = '' + this.funcSet;
							this.q = "" + this.funcSet;
							this.w = "" + this.funcSet;
							this.e = "" + this.funcSet;
							this.r = "" + this.funcSet;
							this.t = "" + this.funcSet;
							this.y = "" + this.funcSet;
							this.u = "" + this.funcSet;
							this.i = "" + this.funcSet;
							this.o = "" + this.funcSet;
							this.p = "" + this.funcSet;
							this.lqu = "" + this.funcSet;
							this.rqu = "" + this.funcSet;
							this.drawn = "" + this.funcSet;
							this.delete = "" + this.funcSet;
							this.end = "" + this.funcSet;
							this.pdown = "" + this.funcSet;
							this.num7 = "" + this.funcSet;
							this.num8 = "" + this.funcSet;
							this.num9 = "" + this.funcSet;
							this.numplus = "" + this.funcSet;
						}, 1000);
					}
					this.tab = 'boom11_2' + this.funcSet;
					this.q = "boom10_2" + this.funcSet;
					this.w = "boom9_2" + this.funcSet;
					this.e = "boom8_2" + this.funcSet;
					this.r = "boom7_2" + this.funcSet;
					this.t = "boom6_2" + this.funcSet;
					this.y = "boom5_2" + this.funcSet;
					this.u = "boom4_2" + this.funcSet;
					this.i = "boom3_2" + this.funcSet;
					this.o = "boom2_2" + this.funcSet;
					this.p = "boom1_2" + this.funcSet;
					this.lqu = "boom2_2" + this.funcSet;
					this.rqu = "boom3_2" + this.funcSet;
					this.drawn = "boom4_2" + this.funcSet;
					this.delete = "boom5_2" + this.funcSet;
					this.end = "boom6_2" + this.funcSet;
					this.pdown = "boom7_2" + this.funcSet;
					this.num7 = "boom8_2" + this.funcSet;
					this.num8 = "boom9_2" + this.funcSet;
					this.num9 = "boom10_2" + this.funcSet;
					this.numplus = "boom11_2" + this.funcSet;

				}
				break;

			case this.vKey == 219 && this.keyStatus == 1: //lqu
				if (this.num == 0) {
					// this.clear();
					if (this.keyFlag1 == 0) {
						this.keyFlag1 = 1;
						setTimeout(() => {
							this.keyFlag1 = 0;
							this.tab = '' + this.funcSet;
							this.q = "" + this.funcSet;
							this.w = "" + this.funcSet;
							this.e = "" + this.funcSet;
							this.r = "" + this.funcSet;
							this.t = "" + this.funcSet;
							this.y = "" + this.funcSet;
							this.u = "" + this.funcSet;
							this.i = "" + this.funcSet;
							this.o = "" + this.funcSet;
							this.p = "" + this.funcSet;
							this.lqu = "" + this.funcSet;
							this.rqu = "" + this.funcSet;
							this.drawn = "" + this.funcSet;
							this.delete = "" + this.funcSet;
							this.end = "" + this.funcSet;
							this.pdown = "" + this.funcSet;
							this.num7 = "" + this.funcSet;
							this.num8 = "" + this.funcSet;
							this.num9 = "" + this.funcSet;
							this.numplus = "" + this.funcSet;
						}, 1000);
					}
					this.tab = 'boom12_1' + this.funcSet;
					this.q = "boom11_1" + this.funcSet;
					this.w = "boom10_1" + this.funcSet;
					this.e = "boom9_1" + this.funcSet;
					this.r = "boom8_1" + this.funcSet;
					this.t = "boom7_1" + this.funcSet;
					this.y = "boom6_1" + this.funcSet;
					this.u = "boom5_1" + this.funcSet;
					this.i = "boom4_1" + this.funcSet;
					this.o = "boom3_1" + this.funcSet;
					this.p = "boom2_1" + this.funcSet;
					this.lqu = "boom1_1" + this.funcSet;
					this.rqu = "boom2_1" + this.funcSet;
					this.drawn = "boom3_1" + this.funcSet;
					this.delete = "boom4_1" + this.funcSet;
					this.end = "boom5_1" + this.funcSet;
					this.pdown = "boom6_1" + this.funcSet;
					this.num7 = "boom7_1" + this.funcSet;
					this.num8 = "boom8_1" + this.funcSet;
					this.num9 = "boom9_1" + this.funcSet;
					this.numplus = "boom10_1" + this.funcSet;

					this.num = 1;
				}
				else if (this.num == 1) {
					this.num = 0;
					// this.clear();
					if (this.keyFlag2 == 0) {
						this.keyFlag2 = 1;
						setTimeout(() => {
							this.keyFlag2 = 0;
							this.tab = '' + this.funcSet;
							this.q = "" + this.funcSet;
							this.w = "" + this.funcSet;
							this.e = "" + this.funcSet;
							this.r = "" + this.funcSet;
							this.t = "" + this.funcSet;
							this.y = "" + this.funcSet;
							this.u = "" + this.funcSet;
							this.i = "" + this.funcSet;
							this.o = "" + this.funcSet;
							this.p = "" + this.funcSet;
							this.lqu = "" + this.funcSet;
							this.rqu = "" + this.funcSet;
							this.drawn = "" + this.funcSet;
							this.delete = "" + this.funcSet;
							this.end = "" + this.funcSet;
							this.pdown = "" + this.funcSet;
							this.num7 = "" + this.funcSet;
							this.num8 = "" + this.funcSet;
							this.num9 = "" + this.funcSet;
							this.numplus = "" + this.funcSet;
						}, 1000);
					}
					this.tab = 'boom12_2' + this.funcSet;
					this.q = "boom11_2" + this.funcSet;
					this.w = "boom10_2" + this.funcSet;
					this.e = "boom9_2" + this.funcSet;
					this.r = "boom8_2" + this.funcSet;
					this.t = "boom7_2" + this.funcSet;
					this.y = "boom6_2" + this.funcSet;
					this.u = "boom5_2" + this.funcSet;
					this.i = "boom4_2" + this.funcSet;
					this.o = "boom3_2" + this.funcSet;
					this.p = "boom2_2" + this.funcSet;
					this.lqu = "boom1_2" + this.funcSet;
					this.rqu = "boom2_2" + this.funcSet;
					this.drawn = "boom3_2" + this.funcSet;
					this.delete = "boom4_2" + this.funcSet;
					this.end = "boom5_2" + this.funcSet;
					this.pdown = "boom6_2" + this.funcSet;
					this.num7 = "boom7_2" + this.funcSet;
					this.num8 = "boom8_2" + this.funcSet;
					this.num9 = "boom9_2" + this.funcSet;
					this.numplus = "boom10_2" + this.funcSet;

				}
				break;

			case this.vKey == 221 && this.keyStatus == 1: //rqu 
				if (this.num == 0) {
					// this.clear();
					if (this.keyFlag1 == 0) {
						this.keyFlag1 = 1;
						setTimeout(() => {
							this.keyFlag1 = 0;
							this.tab = '' + this.funcSet;
							this.q = "" + this.funcSet;
							this.w = "" + this.funcSet;
							this.e = "" + this.funcSet;
							this.r = "" + this.funcSet;
							this.t = "" + this.funcSet;
							this.y = "" + this.funcSet;
							this.u = "" + this.funcSet;
							this.i = "" + this.funcSet;
							this.o = "" + this.funcSet;
							this.p = "" + this.funcSet;
							this.lqu = "" + this.funcSet;
							this.rqu = "" + this.funcSet;
							this.drawn = "" + this.funcSet;
							this.delete = "" + this.funcSet;
							this.end = "" + this.funcSet;
							this.pdown = "" + this.funcSet;
							this.num7 = "" + this.funcSet;
							this.num8 = "" + this.funcSet;
							this.num9 = "" + this.funcSet;
							this.numplus = "" + this.funcSet;
						}, 1000);
					}
					this.tab = 'boom13_1' + this.funcSet;
					this.q = "boom12_1" + this.funcSet;
					this.w = "boom11_1" + this.funcSet;
					this.e = "boom10_1" + this.funcSet;
					this.r = "boom9_1" + this.funcSet;
					this.t = "boom8_1" + this.funcSet;
					this.y = "boom7_1" + this.funcSet;
					this.u = "boom6_1" + this.funcSet;
					this.i = "boom5_1" + this.funcSet;
					this.o = "boom4_1" + this.funcSet;
					this.p = "boom3_1" + this.funcSet;
					this.lqu = "boom2_1" + this.funcSet;
					this.rqu = "boom1_1" + this.funcSet;
					this.drawn = "boom2_1" + this.funcSet;
					this.delete = "boom3_1" + this.funcSet;
					this.end = "boom4_1" + this.funcSet;
					this.pdown = "boom5_1" + this.funcSet;
					this.num7 = "boom6_1" + this.funcSet;
					this.num8 = "boom7_1" + this.funcSet;
					this.num9 = "boom8_1" + this.funcSet;
					this.numplus = "boom9_1" + this.funcSet;

					this.num = 1;
				}
				else if (this.num == 1) {
					this.num = 0;
					// this.clear();
					if (this.keyFlag2 == 0) {
						this.keyFlag2 = 1;
						setTimeout(() => {
							this.keyFlag2 = 0;
							this.tab = '' + this.funcSet;
							this.q = "" + this.funcSet;
							this.w = "" + this.funcSet;
							this.e = "" + this.funcSet;
							this.r = "" + this.funcSet;
							this.t = "" + this.funcSet;
							this.y = "" + this.funcSet;
							this.u = "" + this.funcSet;
							this.i = "" + this.funcSet;
							this.o = "" + this.funcSet;
							this.p = "" + this.funcSet;
							this.lqu = "" + this.funcSet;
							this.rqu = "" + this.funcSet;
							this.drawn = "" + this.funcSet;
							this.delete = "" + this.funcSet;
							this.end = "" + this.funcSet;
							this.pdown = "" + this.funcSet;
							this.num7 = "" + this.funcSet;
							this.num8 = "" + this.funcSet;
							this.num9 = "" + this.funcSet;
							this.numplus = "" + this.funcSet;
						}, 1000);
					}
					this.tab = 'boom13_2' + this.funcSet;
					this.q = "boom12_2" + this.funcSet;
					this.w = "boom11_2" + this.funcSet;
					this.e = "boom10_2" + this.funcSet;
					this.r = "boom9_2" + this.funcSet;
					this.t = "boom8_2" + this.funcSet;
					this.y = "boom7_2" + this.funcSet;
					this.u = "boom6_2" + this.funcSet;
					this.i = "boom5_2" + this.funcSet;
					this.o = "boom4_2" + this.funcSet;
					this.p = "boom3_2" + this.funcSet;
					this.lqu = "boom2_2" + this.funcSet;
					this.rqu = "boom1_2" + this.funcSet;
					this.drawn = "boom2_2" + this.funcSet;
					this.delete = "boom3_2" + this.funcSet;
					this.end = "boom4_2" + this.funcSet;
					this.pdown = "boom5_2" + this.funcSet;
					this.num7 = "boom6_2" + this.funcSet;
					this.num8 = "boom7_2" + this.funcSet;
					this.num9 = "boom8_2" + this.funcSet;
					this.numplus = "boom9_2" + this.funcSet;

				}
				break;

			case this.vKey == 220 && this.keyStatus == 1: //drawn
				if (this.num == 0) {
					// this.clear();
					if (this.keyFlag1 == 0) {
						this.keyFlag1 = 1;
						setTimeout(() => {
							this.keyFlag1 = 0;
							this.tab = '' + this.funcSet;
							this.q = "" + this.funcSet;
							this.w = "" + this.funcSet;
							this.e = "" + this.funcSet;
							this.r = "" + this.funcSet;
							this.t = "" + this.funcSet;
							this.y = "" + this.funcSet;
							this.u = "" + this.funcSet;
							this.i = "" + this.funcSet;
							this.o = "" + this.funcSet;
							this.p = "" + this.funcSet;
							this.lqu = "" + this.funcSet;
							this.rqu = "" + this.funcSet;
							this.drawn = "" + this.funcSet;
							this.delete = "" + this.funcSet;
							this.end = "" + this.funcSet;
							this.pdown = "" + this.funcSet;
							this.num7 = "" + this.funcSet;
							this.num8 = "" + this.funcSet;
							this.num9 = "" + this.funcSet;
							this.numplus = "" + this.funcSet;
						}, 1000);
					}
					this.tab = 'boom14_1' + this.funcSet;
					this.q = "boom13_1" + this.funcSet;
					this.w = "boom12_1" + this.funcSet;
					this.e = "boom11_1" + this.funcSet;
					this.r = "boom10_1" + this.funcSet;
					this.t = "boom9_1" + this.funcSet;
					this.y = "boom8_1" + this.funcSet;
					this.u = "boom7_1" + this.funcSet;
					this.i = "boom6_1" + this.funcSet;
					this.o = "boom5_1" + this.funcSet;
					this.p = "boom4_1" + this.funcSet;
					this.lqu = "boom3_1" + this.funcSet;
					this.rqu = "boom2_1" + this.funcSet;
					this.drawn = "boom1_1" + this.funcSet;
					this.delete = "boom2_1" + this.funcSet;
					this.end = "boom3_1" + this.funcSet;
					this.pdown = "boom4_1" + this.funcSet;
					this.num7 = "boom5_1" + this.funcSet;
					this.num8 = "boom6_1" + this.funcSet;
					this.num9 = "boom7_1" + this.funcSet;
					this.numplus = "boom8_1" + this.funcSet;

					this.num = 1;
				}
				else if (this.num == 1) {
					this.num = 0;
					// this.clear();
					if (this.keyFlag2 == 0) {
						this.keyFlag2 = 1;
						setTimeout(() => {
							this.keyFlag2 = 0;
							this.tab = '' + this.funcSet;
							this.q = "" + this.funcSet;
							this.w = "" + this.funcSet;
							this.e = "" + this.funcSet;
							this.r = "" + this.funcSet;
							this.t = "" + this.funcSet;
							this.y = "" + this.funcSet;
							this.u = "" + this.funcSet;
							this.i = "" + this.funcSet;
							this.o = "" + this.funcSet;
							this.p = "" + this.funcSet;
							this.lqu = "" + this.funcSet;
							this.rqu = "" + this.funcSet;
							this.drawn = "" + this.funcSet;
							this.delete = "" + this.funcSet;
							this.end = "" + this.funcSet;
							this.pdown = "" + this.funcSet;
							this.num7 = "" + this.funcSet;
							this.num8 = "" + this.funcSet;
							this.num9 = "" + this.funcSet;
							this.numplus = "" + this.funcSet;
						}, 1000);
					}
					this.tab = "boom14_2" + this.funcSet;
					this.q = "boom13_2" + this.funcSet;
					this.w = "boom12_2" + this.funcSet;
					this.e = "boom11_2" + this.funcSet;
					this.r = "boom10_2" + this.funcSet;
					this.t = "boom9_2" + this.funcSet;
					this.y = "boom8_2" + this.funcSet;
					this.u = "boom7_2" + this.funcSet;
					this.i = "boom6_2" + this.funcSet;
					this.o = "boom5_2" + this.funcSet;
					this.p = "boom4_2" + this.funcSet;
					this.lqu = "boom3_2" + this.funcSet;
					this.rqu = "boom2_2" + this.funcSet;
					this.drawn = "boom1_2" + this.funcSet;
					this.delete = "boom2_2" + this.funcSet;
					this.end = "boom3_2" + this.funcSet;
					this.pdown = "boom4_2" + this.funcSet;
					this.num7 = "boom5_2" + this.funcSet;
					this.num8 = "boom6_2" + this.funcSet;
					this.num9 = "boom7_2" + this.funcSet;
					this.numplus = "boom8_2" + this.funcSet;

				}
				break;

			case this.vKey == 46 && this.keyStatus == 1: //delete
				if (this.num == 0) {
					// this.clear();
					if (this.keyFlag1 == 0) {
						this.keyFlag1 = 1;
						setTimeout(() => {
							this.keyFlag1 = 0;
							this.tab = '' + this.funcSet;
							this.q = "" + this.funcSet;
							this.w = "" + this.funcSet;
							this.e = "" + this.funcSet;
							this.r = "" + this.funcSet;
							this.t = "" + this.funcSet;
							this.y = "" + this.funcSet;
							this.u = "" + this.funcSet;
							this.i = "" + this.funcSet;
							this.o = "" + this.funcSet;
							this.p = "" + this.funcSet;
							this.lqu = "" + this.funcSet;
							this.rqu = "" + this.funcSet;
							this.drawn = "" + this.funcSet;
							this.delete = "" + this.funcSet;
							this.end = "" + this.funcSet;
							this.pdown = "" + this.funcSet;
							this.num7 = "" + this.funcSet;
							this.num8 = "" + this.funcSet;
							this.num9 = "" + this.funcSet;
							this.numplus = "" + this.funcSet;
						}, 1000);
					}
					this.tab = 'boom15_1' + this.funcSet;
					this.q = "boom14_1" + this.funcSet;
					this.w = "boom13_1" + this.funcSet;
					this.e = "boom12_1" + this.funcSet;
					this.r = "boom11_1" + this.funcSet;
					this.t = "boom10_1" + this.funcSet;
					this.y = "boom9_1" + this.funcSet;
					this.u = "boom8_1" + this.funcSet;
					this.i = "boom7_1" + this.funcSet;
					this.o = "boom6_1" + this.funcSet;
					this.p = "boom5_1" + this.funcSet;
					this.lqu = "boom4_1" + this.funcSet;
					this.rqu = "boom3_1" + this.funcSet;
					this.drawn = "boom2_1" + this.funcSet;
					this.delete = "boom1_1" + this.funcSet;
					this.end = "boom2_1" + this.funcSet;
					this.pdown = "boom3_1" + this.funcSet;
					this.num7 = "boom4_1" + this.funcSet;
					this.num8 = "boom5_1" + this.funcSet;
					this.num9 = "boom6_1" + this.funcSet;
					this.numplus = "boom7_1" + this.funcSet;

					this.num = 1;
				}
				else if (this.num == 1) {
					this.num = 0;
					// this.clear();
					if (this.keyFlag2 == 0) {
						this.keyFlag2 = 1;
						setTimeout(() => {
							this.keyFlag2 = 0;
							this.tab = '' + this.funcSet;
							this.q = "" + this.funcSet;
							this.w = "" + this.funcSet;
							this.e = "" + this.funcSet;
							this.r = "" + this.funcSet;
							this.t = "" + this.funcSet;
							this.y = "" + this.funcSet;
							this.u = "" + this.funcSet;
							this.i = "" + this.funcSet;
							this.o = "" + this.funcSet;
							this.p = "" + this.funcSet;
							this.lqu = "" + this.funcSet;
							this.rqu = "" + this.funcSet;
							this.drawn = "" + this.funcSet;
							this.delete = "" + this.funcSet;
							this.end = "" + this.funcSet;
							this.pdown = "" + this.funcSet;
							this.num7 = "" + this.funcSet;
							this.num8 = "" + this.funcSet;
							this.num9 = "" + this.funcSet;
							this.numplus = "" + this.funcSet;
						}, 1000);
					}
					this.tab = 'boom15_2' + this.funcSet;
					this.q = "boom14_2" + this.funcSet;
					this.w = "boom13_2" + this.funcSet;
					this.e = "boom12_2" + this.funcSet;
					this.r = "boom11_2" + this.funcSet;
					this.t = "boom10_2" + this.funcSet;
					this.y = "boom9_2" + this.funcSet;
					this.u = "boom8_2" + this.funcSet;
					this.i = "boom7_2" + this.funcSet;
					this.o = "boom6_2" + this.funcSet;
					this.p = "boom5_2" + this.funcSet;
					this.lqu = "boom4_2" + this.funcSet;
					this.rqu = "boom3_2" + this.funcSet;
					this.drawn = "boom2_2" + this.funcSet;
					this.delete = "boom1_2" + this.funcSet;
					this.end = "boom2_2" + this.funcSet;
					this.pdown = "boom3_2" + this.funcSet;
					this.num7 = "boom4_2" + this.funcSet;
					this.num8 = "boom5_2" + this.funcSet;
					this.num9 = "boom6_2" + this.funcSet;
					this.numplus = "boom7_2" + this.funcSet;

				}
				break;

			case this.vKey == 35 && this.keyStatus == 1: //end
				if (this.num == 0) {
					// this.clear();
					if (this.keyFlag1 == 0) {
						this.keyFlag1 = 1;
						setTimeout(() => {
							this.keyFlag1 = 0;
							this.tab = '' + this.funcSet;
							this.q = "" + this.funcSet;
							this.w = "" + this.funcSet;
							this.e = "" + this.funcSet;
							this.r = "" + this.funcSet;
							this.t = "" + this.funcSet;
							this.y = "" + this.funcSet;
							this.u = "" + this.funcSet;
							this.i = "" + this.funcSet;
							this.o = "" + this.funcSet;
							this.p = "" + this.funcSet;
							this.lqu = "" + this.funcSet;
							this.rqu = "" + this.funcSet;
							this.drawn = "" + this.funcSet;
							this.delete = "" + this.funcSet;
							this.end = "" + this.funcSet;
							this.pdown = "" + this.funcSet;
							this.num7 = "" + this.funcSet;
							this.num8 = "" + this.funcSet;
							this.num9 = "" + this.funcSet;
							this.numplus = "" + this.funcSet;
						}, 1000);
					}
					this.tab = 'boom16_1' + this.funcSet;
					this.q = "boom15_1" + this.funcSet;
					this.w = "boom14_1" + this.funcSet;
					this.e = "boom13_1" + this.funcSet;
					this.r = "boom12_1" + this.funcSet;
					this.t = "boom11_1" + this.funcSet;
					this.y = "boom10_1" + this.funcSet;
					this.u = "boom9_1" + this.funcSet;
					this.i = "boom8_1" + this.funcSet;
					this.o = "boom7_1" + this.funcSet;
					this.p = "boom6_1" + this.funcSet;
					this.lqu = "boom5_1" + this.funcSet;
					this.rqu = "boom4_1" + this.funcSet;
					this.drawn = "boom3_1" + this.funcSet;
					this.delete = "boom2_1" + this.funcSet;
					this.end = "boom1_1" + this.funcSet;
					this.pdown = "boom2_1" + this.funcSet;
					this.num7 = "boom3_1" + this.funcSet;
					this.num8 = "boom4_1" + this.funcSet;
					this.num9 = "boom5_1" + this.funcSet;
					this.numplus = "boom6_1" + this.funcSet;

					this.num = 1;
				}
				else if (this.num == 1) {
					this.num = 0;
					// this.clear();
					if (this.keyFlag2 == 0) {
						this.keyFlag2 = 1;
						setTimeout(() => {
							this.keyFlag2 = 0;
							this.tab = '' + this.funcSet;
							this.q = "" + this.funcSet;
							this.w = "" + this.funcSet;
							this.e = "" + this.funcSet;
							this.r = "" + this.funcSet;
							this.t = "" + this.funcSet;
							this.y = "" + this.funcSet;
							this.u = "" + this.funcSet;
							this.i = "" + this.funcSet;
							this.o = "" + this.funcSet;
							this.p = "" + this.funcSet;
							this.lqu = "" + this.funcSet;
							this.rqu = "" + this.funcSet;
							this.drawn = "" + this.funcSet;
							this.delete = "" + this.funcSet;
							this.end = "" + this.funcSet;
							this.pdown = "" + this.funcSet;
							this.num7 = "" + this.funcSet;
							this.num8 = "" + this.funcSet;
							this.num9 = "" + this.funcSet;
							this.numplus = "" + this.funcSet;
						}, 1000);
					}
					this.tab = 'boom16_2' + this.funcSet;
					this.q = "boom15_2" + this.funcSet;
					this.w = "boom14_2" + this.funcSet;
					this.e = "boom13_2" + this.funcSet;
					this.r = "boom12_2" + this.funcSet;
					this.t = "boom11_2" + this.funcSet;
					this.y = "boom10_2" + this.funcSet;
					this.u = "boom9_2" + this.funcSet;
					this.i = "boom8_2" + this.funcSet;
					this.o = "boom7_2" + this.funcSet;
					this.p = "boom6_2" + this.funcSet;
					this.lqu = "boom5_2" + this.funcSet;
					this.rqu = "boom4_2" + this.funcSet;
					this.drawn = "boom3_2" + this.funcSet;
					this.delete = "boom2_2" + this.funcSet;
					this.end = "boom1_2" + this.funcSet;
					this.pdown = "boom2_2" + this.funcSet;
					this.num7 = "boom3_2" + this.funcSet;
					this.num8 = "boom4_2" + this.funcSet;
					this.num9 = "boom5_2" + this.funcSet;
					this.numplus = "boom6_2" + this.funcSet;

				}
				break;

			case this.vKey == 34 && this.keyStatus == 1: //pdown
				if (this.num == 0) {
					// this.clear();
					if (this.keyFlag1 == 0) {
						this.keyFlag1 = 1;
						setTimeout(() => {
							this.keyFlag1 = 0;
							this.tab = '' + this.funcSet;
							this.q = "" + this.funcSet;
							this.w = "" + this.funcSet;
							this.e = "" + this.funcSet;
							this.r = "" + this.funcSet;
							this.t = "" + this.funcSet;
							this.y = "" + this.funcSet;
							this.u = "" + this.funcSet;
							this.i = "" + this.funcSet;
							this.o = "" + this.funcSet;
							this.p = "" + this.funcSet;
							this.lqu = "" + this.funcSet;
							this.rqu = "" + this.funcSet;
							this.drawn = "" + this.funcSet;
							this.delete = "" + this.funcSet;
							this.end = "" + this.funcSet;
							this.pdown = "" + this.funcSet;
							this.num7 = "" + this.funcSet;
							this.num8 = "" + this.funcSet;
							this.num9 = "" + this.funcSet;
							this.numplus = "" + this.funcSet;
						}, 1000);
					}
					this.tab = 'boom17_1' + this.funcSet;
					this.q = "boom16_1" + this.funcSet;
					this.w = "boom15_1" + this.funcSet;
					this.e = "boom14_1" + this.funcSet;
					this.r = "boom13_1" + this.funcSet;
					this.t = "boom12_1" + this.funcSet;
					this.y = "boom11_1" + this.funcSet;
					this.u = "boom10_1" + this.funcSet;
					this.i = "boom9_1" + this.funcSet;
					this.o = "boom8_1" + this.funcSet;
					this.p = "boom7_1" + this.funcSet;
					this.lqu = "boom7_1" + this.funcSet;
					this.rqu = "boom5_1" + this.funcSet;
					this.drawn = "boom4_1" + this.funcSet;
					this.delete = "boom3_1" + this.funcSet;
					this.end = "boom2_1" + this.funcSet;
					this.pdown = "boom1_1" + this.funcSet;
					this.num7 = "boom2_1" + this.funcSet;
					this.num8 = "boom3_1" + this.funcSet;
					this.num9 = "boom4_1" + this.funcSet;
					this.numplus = "boom5_1" + this.funcSet;

					this.num = 1;
				}
				else if (this.num == 1) {
					this.num = 0;
					// this.clear();
					if (this.keyFlag2 == 0) {
						this.keyFlag2 = 1;
						setTimeout(() => {
							this.keyFlag2 = 0;
							this.tab = '' + this.funcSet;
							this.q = "" + this.funcSet;
							this.w = "" + this.funcSet;
							this.e = "" + this.funcSet;
							this.r = "" + this.funcSet;
							this.t = "" + this.funcSet;
							this.y = "" + this.funcSet;
							this.u = "" + this.funcSet;
							this.i = "" + this.funcSet;
							this.o = "" + this.funcSet;
							this.p = "" + this.funcSet;
							this.lqu = "" + this.funcSet;
							this.rqu = "" + this.funcSet;
							this.drawn = "" + this.funcSet;
							this.delete = "" + this.funcSet;
							this.end = "" + this.funcSet;
							this.pdown = "" + this.funcSet;
							this.num7 = "" + this.funcSet;
							this.num8 = "" + this.funcSet;
							this.num9 = "" + this.funcSet;
							this.numplus = "" + this.funcSet;
						}, 1000);
					}
					this.tab = 'boom17_2' + this.funcSet;
					this.q = "boom16_2" + this.funcSet;
					this.w = "boom15_2" + this.funcSet;
					this.e = "boom14_2" + this.funcSet;
					this.r = "boom13_2" + this.funcSet;
					this.t = "boom12_2" + this.funcSet;
					this.y = "boom11_2" + this.funcSet;
					this.u = "boom10_2" + this.funcSet;
					this.i = "boom9_2" + this.funcSet;
					this.o = "boom8_2" + this.funcSet;
					this.p = "boom7_2" + this.funcSet;
					this.lqu = "boom7_2" + this.funcSet;
					this.rqu = "boom5_2" + this.funcSet;
					this.drawn = "boom4_2" + this.funcSet;
					this.delete = "boom3_2" + this.funcSet;
					this.end = "boom2_2" + this.funcSet;
					this.pdown = "boom1_2" + this.funcSet;
					this.num7 = "boom2_2" + this.funcSet;
					this.num8 = "boom3_2" + this.funcSet;
					this.num9 = "boom4_2" + this.funcSet;
					this.numplus = "boom5_2" + this.funcSet;

				}
				break;

			case this.vKey == 103 && this.keyStatus == 1: //num7
				if (this.num == 0) {
					// this.clear();
					if (this.keyFlag1 == 0) {
						this.keyFlag1 = 1;
						setTimeout(() => {
							this.keyFlag1 = 0;
							this.tab = '' + this.funcSet;
							this.q = "" + this.funcSet;
							this.w = "" + this.funcSet;
							this.e = "" + this.funcSet;
							this.r = "" + this.funcSet;
							this.t = "" + this.funcSet;
							this.y = "" + this.funcSet;
							this.u = "" + this.funcSet;
							this.i = "" + this.funcSet;
							this.o = "" + this.funcSet;
							this.p = "" + this.funcSet;
							this.lqu = "" + this.funcSet;
							this.rqu = "" + this.funcSet;
							this.drawn = "" + this.funcSet;
							this.delete = "" + this.funcSet;
							this.end = "" + this.funcSet;
							this.pdown = "" + this.funcSet;
							this.num7 = "" + this.funcSet;
							this.num8 = "" + this.funcSet;
							this.num9 = "" + this.funcSet;
							this.numplus = "" + this.funcSet;
						}, 1000);
					}
					this.tab = 'boom18_1' + this.funcSet;
					this.q = "boom17_1" + this.funcSet;
					this.w = "boom16_1" + this.funcSet;
					this.e = "boom15_1" + this.funcSet;
					this.r = "boom14_1" + this.funcSet;
					this.t = "boom13_1" + this.funcSet;
					this.y = "boom12_1" + this.funcSet;
					this.u = "boom11_1" + this.funcSet;
					this.i = "boom10_1" + this.funcSet;
					this.o = "boom9_1" + this.funcSet;
					this.p = "boom8_1" + this.funcSet;
					this.lqu = "boom7_1" + this.funcSet;
					this.rqu = "boom6_1" + this.funcSet;
					this.drawn = "boom5_1" + this.funcSet;
					this.delete = "boom4_1" + this.funcSet;
					this.end = "boom3_1" + this.funcSet;
					this.pdown = "boom2_1" + this.funcSet;
					this.num7 = "boom1_1" + this.funcSet;
					this.num8 = "boom2_1" + this.funcSet;
					this.num9 = "boom3_1" + this.funcSet;
					this.numplus = "boom4_1" + this.funcSet;

					this.num = 1;
				}
				else if (this.num == 1) {
					this.num = 0;
					// this.clear();
					if (this.keyFlag2 == 0) {
						this.keyFlag2 = 1;
						setTimeout(() => {
							this.keyFlag2 = 0;
							this.tab = '' + this.funcSet;
							this.q = "" + this.funcSet;
							this.w = "" + this.funcSet;
							this.e = "" + this.funcSet;
							this.r = "" + this.funcSet;
							this.t = "" + this.funcSet;
							this.y = "" + this.funcSet;
							this.u = "" + this.funcSet;
							this.i = "" + this.funcSet;
							this.o = "" + this.funcSet;
							this.p = "" + this.funcSet;
							this.lqu = "" + this.funcSet;
							this.rqu = "" + this.funcSet;
							this.drawn = "" + this.funcSet;
							this.delete = "" + this.funcSet;
							this.end = "" + this.funcSet;
							this.pdown = "" + this.funcSet;
							this.num7 = "" + this.funcSet;
							this.num8 = "" + this.funcSet;
							this.num9 = "" + this.funcSet;
							this.numplus = "" + this.funcSet;
						}, 1000);
					}
					this.tab = 'boom18_2' + this.funcSet;
					this.q = "boom17_2" + this.funcSet;
					this.w = "boom16_2" + this.funcSet;
					this.e = "boom15_2" + this.funcSet;
					this.r = "boom14_2" + this.funcSet;
					this.t = "boom13_2" + this.funcSet;
					this.y = "boom12_2" + this.funcSet;
					this.u = "boom11_2" + this.funcSet;
					this.i = "boom10_2" + this.funcSet;
					this.o = "boom9_2" + this.funcSet;
					this.p = "boom8_2" + this.funcSet;
					this.lqu = "boom7_2" + this.funcSet;
					this.rqu = "boom6_2" + this.funcSet;
					this.drawn = "boom5_2" + this.funcSet;
					this.delete = "boom4_2" + this.funcSet;
					this.end = "boom3_2" + this.funcSet;
					this.pdown = "boom2_2" + this.funcSet;
					this.num7 = "boom1_2" + this.funcSet;
					this.num8 = "boom2_2" + this.funcSet;
					this.num9 = "boom3_2" + this.funcSet;
					this.numplus = "boom4_2" + this.funcSet;

				}
				break;

			case this.vKey == 104 && this.keyStatus == 1: //num8
				if (this.num == 0) {
					// this.clear();
					if (this.keyFlag1 == 0) {
						this.keyFlag1 = 1;
						setTimeout(() => {
							this.keyFlag1 = 0;
							this.tab = '' + this.funcSet;
							this.q = "" + this.funcSet;
							this.w = "" + this.funcSet;
							this.e = "" + this.funcSet;
							this.r = "" + this.funcSet;
							this.t = "" + this.funcSet;
							this.y = "" + this.funcSet;
							this.u = "" + this.funcSet;
							this.i = "" + this.funcSet;
							this.o = "" + this.funcSet;
							this.p = "" + this.funcSet;
							this.lqu = "" + this.funcSet;
							this.rqu = "" + this.funcSet;
							this.drawn = "" + this.funcSet;
							this.delete = "" + this.funcSet;
							this.end = "" + this.funcSet;
							this.pdown = "" + this.funcSet;
							this.num7 = "" + this.funcSet;
							this.num8 = "" + this.funcSet;
							this.num9 = "" + this.funcSet;
							this.numplus = "" + this.funcSet;
						}, 1000);
					}
					this.tab = 'boom19_1' + this.funcSet;
					this.q = "boom18_1" + this.funcSet;
					this.w = "boom17_1" + this.funcSet;
					this.e = "boom16_1" + this.funcSet;
					this.r = "boom15_1" + this.funcSet;
					this.t = "boom14_1" + this.funcSet;
					this.y = "boom13_1" + this.funcSet;
					this.u = "boom12_1" + this.funcSet;
					this.i = "boom11_1" + this.funcSet;
					this.o = "boom10_1" + this.funcSet;
					this.p = "boom9_1" + this.funcSet;
					this.lqu = "boom8_1" + this.funcSet;
					this.rqu = "boom7_1" + this.funcSet;
					this.drawn = "boom6_1" + this.funcSet;
					this.delete = "boom5_1" + this.funcSet;
					this.end = "boom4_1" + this.funcSet;
					this.pdown = "boom3_1" + this.funcSet;
					this.num7 = "boom2_1" + this.funcSet;
					this.num8 = "boom1_1" + this.funcSet;
					this.num9 = "boom2_1" + this.funcSet;
					this.numplus = "boom3_1" + this.funcSet;

					this.num = 1;
				}
				else if (this.num == 1) {
					this.num = 0;
					// this.clear();
					if (this.keyFlag2 == 0) {
						this.keyFlag2 = 1;
						setTimeout(() => {
							this.keyFlag2 = 0;
							this.tab = '' + this.funcSet;
							this.q = "" + this.funcSet;
							this.w = "" + this.funcSet;
							this.e = "" + this.funcSet;
							this.r = "" + this.funcSet;
							this.t = "" + this.funcSet;
							this.y = "" + this.funcSet;
							this.u = "" + this.funcSet;
							this.i = "" + this.funcSet;
							this.o = "" + this.funcSet;
							this.p = "" + this.funcSet;
							this.lqu = "" + this.funcSet;
							this.rqu = "" + this.funcSet;
							this.drawn = "" + this.funcSet;
							this.delete = "" + this.funcSet;
							this.end = "" + this.funcSet;
							this.pdown = "" + this.funcSet;
							this.num7 = "" + this.funcSet;
							this.num8 = "" + this.funcSet;
							this.num9 = "" + this.funcSet;
							this.numplus = "" + this.funcSet;
						}, 1000);
					}
					this.tab = 'boom19_2' + this.funcSet;
					this.q = "boom18_2" + this.funcSet;
					this.w = "boom17_2" + this.funcSet;
					this.e = "boom16_2" + this.funcSet;
					this.r = "boom15_2" + this.funcSet;
					this.t = "boom14_2" + this.funcSet;
					this.y = "boom13_2" + this.funcSet;
					this.u = "boom12_2" + this.funcSet;
					this.i = "boom11_2" + this.funcSet;
					this.o = "boom10_2" + this.funcSet;
					this.p = "boom9_2" + this.funcSet;
					this.lqu = "boom8_2" + this.funcSet;
					this.rqu = "boom7_2" + this.funcSet;
					this.drawn = "boom6_2" + this.funcSet;
					this.delete = "boom5_2" + this.funcSet;
					this.end = "boom4_2" + this.funcSet;
					this.pdown = "boom3_2" + this.funcSet;
					this.num7 = "boom2_2" + this.funcSet;
					this.num8 = "boom1_2" + this.funcSet;
					this.num9 = "boom2_2" + this.funcSet;
					this.numplus = "boom3_2" + this.funcSet;

				}
				break;

			case this.vKey == 105 && this.keyStatus == 1: //num9
				if (this.num == 0) {
					// this.clear();
					if (this.keyFlag1 == 0) {
						this.keyFlag1 = 1;
						setTimeout(() => {
							this.keyFlag1 = 0;
							this.tab = '' + this.funcSet;
							this.q = "" + this.funcSet;
							this.w = "" + this.funcSet;
							this.e = "" + this.funcSet;
							this.r = "" + this.funcSet;
							this.t = "" + this.funcSet;
							this.y = "" + this.funcSet;
							this.u = "" + this.funcSet;
							this.i = "" + this.funcSet;
							this.o = "" + this.funcSet;
							this.p = "" + this.funcSet;
							this.lqu = "" + this.funcSet;
							this.rqu = "" + this.funcSet;
							this.drawn = "" + this.funcSet;
							this.delete = "" + this.funcSet;
							this.end = "" + this.funcSet;
							this.pdown = "" + this.funcSet;
							this.num7 = "" + this.funcSet;
							this.num8 = "" + this.funcSet;
							this.num9 = "" + this.funcSet;
							this.numplus = "" + this.funcSet;
						}, 1000);
					}
					this.tab = 'boom20_1' + this.funcSet;
					this.q = "boom19_1" + this.funcSet;
					this.w = "boom18_1" + this.funcSet;
					this.e = "boom17_1" + this.funcSet;
					this.r = "boom16_1" + this.funcSet;
					this.t = "boom15_1" + this.funcSet;
					this.y = "boom14_1" + this.funcSet;
					this.u = "boom13_1" + this.funcSet;
					this.i = "boom12_1" + this.funcSet;
					this.o = "boom11_1" + this.funcSet;
					this.p = "boom10_1" + this.funcSet;
					this.lqu = "boom9_1" + this.funcSet;
					this.rqu = "boom8_1" + this.funcSet;
					this.drawn = "boom7_1" + this.funcSet;
					this.delete = "boom6_1" + this.funcSet;
					this.end = "boom5_1" + this.funcSet;
					this.pdown = "boom4_1" + this.funcSet;
					this.num7 = "boom3_1" + this.funcSet;
					this.num8 = "boom2_1" + this.funcSet;
					this.num9 = "boom1_1" + this.funcSet;
					this.numplus = "boom2_1" + this.funcSet;

					this.num = 1;
				}
				else if (this.num == 1) {
					this.num = 0;
					// this.clear();
					if (this.keyFlag2 == 0) {
						this.keyFlag2 = 1;
						setTimeout(() => {
							this.keyFlag2 = 0;
							this.tab = '' + this.funcSet;
							this.q = "" + this.funcSet;
							this.w = "" + this.funcSet;
							this.e = "" + this.funcSet;
							this.r = "" + this.funcSet;
							this.t = "" + this.funcSet;
							this.y = "" + this.funcSet;
							this.u = "" + this.funcSet;
							this.i = "" + this.funcSet;
							this.o = "" + this.funcSet;
							this.p = "" + this.funcSet;
							this.lqu = "" + this.funcSet;
							this.rqu = "" + this.funcSet;
							this.drawn = "" + this.funcSet;
							this.delete = "" + this.funcSet;
							this.end = "" + this.funcSet;
							this.pdown = "" + this.funcSet;
							this.num7 = "" + this.funcSet;
							this.num8 = "" + this.funcSet;
							this.num9 = "" + this.funcSet;
							this.numplus = "" + this.funcSet;
						}, 1000);
					}
					this.tab = 'boom20_2' + this.funcSet;
					this.q = "boom19_2" + this.funcSet;
					this.w = "boom18_2" + this.funcSet;
					this.e = "boom17_2" + this.funcSet;
					this.r = "boom16_2" + this.funcSet;
					this.t = "boom15_2" + this.funcSet;
					this.y = "boom14_2" + this.funcSet;
					this.u = "boom13_2" + this.funcSet;
					this.i = "boom12_2" + this.funcSet;
					this.o = "boom11_2" + this.funcSet;
					this.p = "boom10_2" + this.funcSet;
					this.lqu = "boom9_2" + this.funcSet;
					this.rqu = "boom8_2" + this.funcSet;
					this.drawn = "boom7_2" + this.funcSet;
					this.delete = "boom6_2" + this.funcSet;
					this.end = "boom5_2" + this.funcSet;
					this.pdown = "boom4_2" + this.funcSet;
					this.num7 = "boom3_2" + this.funcSet;
					this.num8 = "boom2_2" + this.funcSet;
					this.num9 = "boom1_2" + this.funcSet;
					this.numplus = "boom2_2" + this.funcSet;

				}
				break;

			case this.vKey == 107 && this.keyStatus == 1: //numplus
				if (this.num == 0) {
					// this.clear();
					if (this.keyFlag1 == 0) {
						this.keyFlag1 = 1;
						setTimeout(() => {
							this.keyFlag1 = 0;
							this.tab = '' + this.funcSet;
							this.q = "" + this.funcSet;
							this.w = "" + this.funcSet;
							this.e = "" + this.funcSet;
							this.r = "" + this.funcSet;
							this.t = "" + this.funcSet;
							this.y = "" + this.funcSet;
							this.u = "" + this.funcSet;
							this.i = "" + this.funcSet;
							this.o = "" + this.funcSet;
							this.p = "" + this.funcSet;
							this.lqu = "" + this.funcSet;
							this.rqu = "" + this.funcSet;
							this.drawn = "" + this.funcSet;
							this.delete = "" + this.funcSet;
							this.end = "" + this.funcSet;
							this.pdown = "" + this.funcSet;
							this.num7 = "" + this.funcSet;
							this.num8 = "" + this.funcSet;
							this.num9 = "" + this.funcSet;
							this.numplus = "" + this.funcSet;
						}, 1000);
					}
					this.tab = 'boom21_1' + this.funcSet;
					this.q = "boom20_1" + this.funcSet;
					this.w = "boom19_1" + this.funcSet;
					this.e = "boom18_1" + this.funcSet;
					this.r = "boom17_1" + this.funcSet;
					this.t = "boom16_1" + this.funcSet;
					this.y = "boom15_1" + this.funcSet;
					this.u = "boom14_1" + this.funcSet;
					this.i = "boom13_1" + this.funcSet;
					this.o = "boom12_1" + this.funcSet;
					this.p = "boom11_1" + this.funcSet;
					this.lqu = "boom10_1" + this.funcSet;
					this.rqu = "boom9_1" + this.funcSet;
					this.drawn = "boom8_1" + this.funcSet;
					this.delete = "boom7_1" + this.funcSet;
					this.end = "boom6_1" + this.funcSet;
					this.pdown = "boom5_1" + this.funcSet;
					this.num7 = "boom4_1" + this.funcSet;
					this.num8 = "boom3_1" + this.funcSet;
					this.num9 = "boom2_1" + this.funcSet;
					this.numplus = "boom1_1" + this.funcSet;

					this.num = 1;
				}
				else if (this.num == 1) {
					this.num = 0;
					// this.clear();
					if (this.keyFlag2 == 0) {
						this.keyFlag2 = 1;
						setTimeout(() => {
							this.keyFlag2 = 0;
							this.tab = '' + this.funcSet;
							this.q = "" + this.funcSet;
							this.w = "" + this.funcSet;
							this.e = "" + this.funcSet;
							this.r = "" + this.funcSet;
							this.t = "" + this.funcSet;
							this.y = "" + this.funcSet;
							this.u = "" + this.funcSet;
							this.i = "" + this.funcSet;
							this.o = "" + this.funcSet;
							this.p = "" + this.funcSet;
							this.lqu = "" + this.funcSet;
							this.rqu = "" + this.funcSet;
							this.drawn = "" + this.funcSet;
							this.delete = "" + this.funcSet;
							this.end = "" + this.funcSet;
							this.pdown = "" + this.funcSet;
							this.num7 = "" + this.funcSet;
							this.num8 = "" + this.funcSet;
							this.num9 = "" + this.funcSet;
							this.numplus = "" + this.funcSet;
						}, 1000);
					}
					this.tab = 'boom21_2' + this.funcSet;
					this.q = "boom20_2" + this.funcSet;
					this.w = "boom19_2" + this.funcSet;
					this.e = "boom18_2" + this.funcSet;
					this.r = "boom17_2" + this.funcSet;
					this.t = "boom16_2" + this.funcSet;
					this.y = "boom15_2" + this.funcSet;
					this.u = "boom14_2" + this.funcSet;
					this.i = "boom13_2" + this.funcSet;
					this.o = "boom12_2" + this.funcSet;
					this.p = "boom11_2" + this.funcSet;
					this.lqu = "boom10_2" + this.funcSet;
					this.rqu = "boom9_2" + this.funcSet;
					this.drawn = "boom8_2" + this.funcSet;
					this.delete = "boom7_2" + this.funcSet;
					this.end = "boom6_2" + this.funcSet;
					this.pdown = "boom5_2" + this.funcSet;
					this.num7 = "boom4_2" + this.funcSet;
					this.num8 = "boom3_2" + this.funcSet;
					this.num9 = "boom2_2" + this.funcSet;
					this.numplus = "boom1_2" + this.funcSet;

				}
				break;

			case this.vKey == 20 && this.keyStatus == 1: //CAPS
				if (this.num == 0) {
					// this.clear();
					if (this.keyFlag1 == 0) {
						this.keyFlag1 = 1;
						setTimeout(() => {
							this.keyFlag1 = 0;
							this.caps = "" + this.funcSet;
							this.a = "" + this.funcSet;
							this.s = "" + this.funcSet;
							this.d = "" + this.funcSet;
							this.f = "" + this.funcSet;
							this.g = "" + this.funcSet;
							this.h = "" + this.funcSet;
							this.j = "" + this.funcSet;
							this.k = "" + this.funcSet;
							this.l = "" + this.funcSet;
							this.sem = "" + this.funcSet;
							this.quo = "" + this.funcSet;
							this.enter = "" + this.funcSet;
							this.num4 = "" + this.funcSet;
							this.num5 = "" + this.funcSet;
							this.num6 = "" + this.funcSet;
						}, 1000);
					}
					this.caps = "boom1_1" + this.funcSet;
					this.a = "boom2_1" + this.funcSet;
					this.s = "boom3_1" + this.funcSet;
					this.d = "boom4_1" + this.funcSet;
					this.f = "boom5_1" + this.funcSet;
					this.g = "boom6_1" + this.funcSet;
					this.h = "boom7_1" + this.funcSet;
					this.j = "boom8_1" + this.funcSet;
					this.k = "boom9_1" + this.funcSet;
					this.l = "boom10_1" + this.funcSet;
					this.sem = "boom11_1" + this.funcSet;
					this.quo = "boom12_1" + this.funcSet;
					this.enter = "boom13_1" + this.funcSet;
					this.num4 = "boom14_1" + this.funcSet;
					this.num5 = "boom15_1" + this.funcSet;
					this.num6 = "boom16_1" + this.funcSet;

					this.num = 1;
				}
				else if (this.num == 1) {
					this.num = 0;
					// this.clear();
					if (this.keyFlag2 == 0) {
						this.keyFlag2 = 1;
						setTimeout(() => {
							this.keyFlag2 = 0;
							this.caps = "" + this.funcSet;
							this.a = "" + this.funcSet;
							this.s = "" + this.funcSet;
							this.d = "" + this.funcSet;
							this.f = "" + this.funcSet;
							this.g = "" + this.funcSet;
							this.h = "" + this.funcSet;
							this.j = "" + this.funcSet;
							this.k = "" + this.funcSet;
							this.l = "" + this.funcSet;
							this.sem = "" + this.funcSet;
							this.quo = "" + this.funcSet;
							this.enter = "" + this.funcSet;
							this.num4 = "" + this.funcSet;
							this.num5 = "" + this.funcSet;
							this.num6 = "" + this.funcSet;
						}, 1000);
					}
					this.caps = "boom1_2" + this.funcSet;
					this.a = "boom2_2" + this.funcSet;
					this.s = "boom3_2" + this.funcSet;
					this.d = "boom4_2" + this.funcSet;
					this.f = "boom5_2" + this.funcSet;
					this.g = "boom6_2" + this.funcSet;
					this.h = "boom7_2" + this.funcSet;
					this.j = "boom8_2" + this.funcSet;
					this.k = "boom9_2" + this.funcSet;
					this.l = "boom10_2" + this.funcSet;
					this.sem = "boom11_2" + this.funcSet;
					this.quo = "boom12_2" + this.funcSet;
					this.enter = "boom13_2" + this.funcSet;
					this.num4 = "boom14_2" + this.funcSet;
					this.num5 = "boom15_2" + this.funcSet;
					this.num6 = "boom16_2" + this.funcSet;

				}
				break;

			case this.vKey == 65 && this.keyStatus == 1: //A
				if (this.num == 0) {
					// this.clear();
					if (this.keyFlag1 == 0) {
						this.keyFlag1 = 1;
						setTimeout(() => {
							this.keyFlag1 = 0;
							this.caps = "" + this.funcSet;
							this.a = "" + this.funcSet;
							this.s = "" + this.funcSet;
							this.d = "" + this.funcSet;
							this.f = "" + this.funcSet;
							this.g = "" + this.funcSet;
							this.h = "" + this.funcSet;
							this.j = "" + this.funcSet;
							this.k = "" + this.funcSet;
							this.l = "" + this.funcSet;
							this.sem = "" + this.funcSet;
							this.quo = "" + this.funcSet;
							this.enter = "" + this.funcSet;
							this.num4 = "" + this.funcSet;
							this.num5 = "" + this.funcSet;
							this.num6 = "" + this.funcSet;
						}, 1000);
					}
					this.caps = "boom2_1" + this.funcSet;
					this.a = "boom1_1" + this.funcSet;
					this.s = "boom2_1" + this.funcSet;
					this.d = "boom3_1" + this.funcSet;
					this.f = "boom4_1" + this.funcSet;
					this.g = "boom5_1" + this.funcSet;
					this.h = "boom6_1" + this.funcSet;
					this.j = "boom7_1" + this.funcSet;
					this.k = "boom8_1" + this.funcSet;
					this.l = "boom9_1" + this.funcSet;
					this.sem = "boom10_1" + this.funcSet;
					this.quo = "boom11_1" + this.funcSet;
					this.enter = "boom12_1" + this.funcSet;
					this.num4 = "boom13_1" + this.funcSet;
					this.num5 = "boom14_1" + this.funcSet;
					this.num6 = "boom15_1" + this.funcSet;

					this.num = 1;
				}
				else if (this.num == 1) {
					this.num = 0;
					// this.clear();
					if (this.keyFlag2 == 0) {
						this.keyFlag2 = 1;
						setTimeout(() => {
							this.keyFlag2 = 0;
							this.caps = "" + this.funcSet;
							this.a = "" + this.funcSet;
							this.s = "" + this.funcSet;
							this.d = "" + this.funcSet;
							this.f = "" + this.funcSet;
							this.g = "" + this.funcSet;
							this.h = "" + this.funcSet;
							this.j = "" + this.funcSet;
							this.k = "" + this.funcSet;
							this.l = "" + this.funcSet;
							this.sem = "" + this.funcSet;
							this.quo = "" + this.funcSet;
							this.enter = "" + this.funcSet;
							this.num4 = "" + this.funcSet;
							this.num5 = "" + this.funcSet;
							this.num6 = "" + this.funcSet;
						}, 1000);
					}
					this.caps = "boom2_2" + this.funcSet;
					this.a = "boom1_2" + this.funcSet;
					this.s = "boom2_2" + this.funcSet;
					this.d = "boom3_2" + this.funcSet;
					this.f = "boom4_2" + this.funcSet;
					this.g = "boom5_2" + this.funcSet;
					this.h = "boom6_2" + this.funcSet;
					this.j = "boom7_2" + this.funcSet;
					this.k = "boom8_2" + this.funcSet;
					this.l = "boom9_2" + this.funcSet;
					this.sem = "boom10_2" + this.funcSet;
					this.quo = "boom11_2" + this.funcSet;
					this.enter = "boom12_2" + this.funcSet;
					this.num4 = "boom13_2" + this.funcSet;
					this.num5 = "boom14_2" + this.funcSet;
					this.num6 = "boom15_2" + this.funcSet;

				}
				break;

			case this.vKey == 83 && this.keyStatus == 1: //s
				if (this.num == 0) {
					// this.clear();
					if (this.keyFlag1 == 0) {
						this.keyFlag1 = 1;
						setTimeout(() => {
							this.keyFlag1 = 0;
							this.caps = "" + this.funcSet;
							this.a = "" + this.funcSet;
							this.s = "" + this.funcSet;
							this.d = "" + this.funcSet;
							this.f = "" + this.funcSet;
							this.g = "" + this.funcSet;
							this.h = "" + this.funcSet;
							this.j = "" + this.funcSet;
							this.k = "" + this.funcSet;
							this.l = "" + this.funcSet;
							this.sem = "" + this.funcSet;
							this.quo = "" + this.funcSet;
							this.enter = "" + this.funcSet;
							this.num4 = "" + this.funcSet;
							this.num5 = "" + this.funcSet;
							this.num6 = "" + this.funcSet;
						}, 1000);
					}
					this.caps = "boom3_1" + this.funcSet;
					this.a = "boom2_1" + this.funcSet;
					this.s = "boom1_1" + this.funcSet;
					this.d = "boom2_1" + this.funcSet;
					this.f = "boom3_1" + this.funcSet;
					this.g = "boom4_1" + this.funcSet;
					this.h = "boom5_1" + this.funcSet;
					this.j = "boom6_1" + this.funcSet;
					this.k = "boom7_1" + this.funcSet;
					this.l = "boom8_1" + this.funcSet;
					this.sem = "boom9_1" + this.funcSet;
					this.quo = "boom10_1" + this.funcSet;
					this.enter = "boom11_1" + this.funcSet;
					this.num4 = "boom12_1" + this.funcSet;
					this.num5 = "boom13_1" + this.funcSet;
					this.num6 = "boom14_1" + this.funcSet;

					this.num = 1;
				}
				else if (this.num == 1) {
					this.num = 0;
					// this.clear();
					if (this.keyFlag2 == 0) {
						this.keyFlag2 = 1;
						setTimeout(() => {
							this.keyFlag2 = 0;
							this.caps = "" + this.funcSet;
							this.a = "" + this.funcSet;
							this.s = "" + this.funcSet;
							this.d = "" + this.funcSet;
							this.f = "" + this.funcSet;
							this.g = "" + this.funcSet;
							this.h = "" + this.funcSet;
							this.j = "" + this.funcSet;
							this.k = "" + this.funcSet;
							this.l = "" + this.funcSet;
							this.sem = "" + this.funcSet;
							this.quo = "" + this.funcSet;
							this.enter = "" + this.funcSet;
							this.num4 = "" + this.funcSet;
							this.num5 = "" + this.funcSet;
							this.num6 = "" + this.funcSet;
						}, 1000);
					}
					this.caps = "boom3_2" + this.funcSet;
					this.a = "boom2_2" + this.funcSet;
					this.s = "boom1_2" + this.funcSet;
					this.d = "boom2_2" + this.funcSet;
					this.f = "boom3_2" + this.funcSet;
					this.g = "boom4_2" + this.funcSet;
					this.h = "boom5_2" + this.funcSet;
					this.j = "boom6_2" + this.funcSet;
					this.k = "boom7_2" + this.funcSet;
					this.l = "boom8_2" + this.funcSet;
					this.sem = "boom9_2" + this.funcSet;
					this.quo = "boom10_2" + this.funcSet;
					this.enter = "boom11_2" + this.funcSet;
					this.num4 = "boom12_2" + this.funcSet;
					this.num5 = "boom13_2" + this.funcSet;
					this.num6 = "boom14_2" + this.funcSet;

				}
				break;

			case this.vKey == 68 && this.keyStatus == 1: //d
				if (this.num == 0) {
					// this.clear();
					if (this.keyFlag1 == 0) {
						this.keyFlag1 = 1;
						setTimeout(() => {
							this.keyFlag1 = 0;
							this.caps = "" + this.funcSet;
							this.a = "" + this.funcSet;
							this.s = "" + this.funcSet;
							this.d = "" + this.funcSet;
							this.f = "" + this.funcSet;
							this.g = "" + this.funcSet;
							this.h = "" + this.funcSet;
							this.j = "" + this.funcSet;
							this.k = "" + this.funcSet;
							this.l = "" + this.funcSet;
							this.sem = "" + this.funcSet;
							this.quo = "" + this.funcSet;
							this.enter = "" + this.funcSet;
							this.num4 = "" + this.funcSet;
							this.num5 = "" + this.funcSet;
							this.num6 = "" + this.funcSet;
						}, 1000);
					}
					this.caps = "boom4_1" + this.funcSet;
					this.a = "boom3_1" + this.funcSet;
					this.s = "boom2_1" + this.funcSet;
					this.d = "boom1_1" + this.funcSet;
					this.f = "boom2_1" + this.funcSet;
					this.g = "boom3_1" + this.funcSet;
					this.h = "boom4_1" + this.funcSet;
					this.j = "boom5_1" + this.funcSet;
					this.k = "boom6_1" + this.funcSet;
					this.l = "boom7_1" + this.funcSet;
					this.sem = "boom8_1" + this.funcSet;
					this.quo = "boom9_1" + this.funcSet;
					this.enter = "boom10_1" + this.funcSet;
					this.num4 = "boom11_1" + this.funcSet;
					this.num5 = "boom12_1" + this.funcSet;
					this.num6 = "boom13_1" + this.funcSet;

					this.num = 1;
				}
				else if (this.num == 1) {
					this.num = 0;
					// this.clear();
					if (this.keyFlag2 == 0) {
						this.keyFlag2 = 1;
						setTimeout(() => {
							this.keyFlag2 = 0;
							this.caps = "" + this.funcSet;
							this.a = "" + this.funcSet;
							this.s = "" + this.funcSet;
							this.d = "" + this.funcSet;
							this.f = "" + this.funcSet;
							this.g = "" + this.funcSet;
							this.h = "" + this.funcSet;
							this.j = "" + this.funcSet;
							this.k = "" + this.funcSet;
							this.l = "" + this.funcSet;
							this.sem = "" + this.funcSet;
							this.quo = "" + this.funcSet;
							this.enter = "" + this.funcSet;
							this.num4 = "" + this.funcSet;
							this.num5 = "" + this.funcSet;
							this.num6 = "" + this.funcSet;
						}, 1000);
					}
					this.caps = "boom4_2" + this.funcSet;
					this.a = "boom3_2" + this.funcSet;
					this.s = "boom2_2" + this.funcSet;
					this.d = "boom1_2" + this.funcSet;
					this.f = "boom2_2" + this.funcSet;
					this.g = "boom3_2" + this.funcSet;
					this.h = "boom4_2" + this.funcSet;
					this.j = "boom5_2" + this.funcSet;
					this.k = "boom6_2" + this.funcSet;
					this.l = "boom7_2" + this.funcSet;
					this.sem = "boom8_2" + this.funcSet;
					this.quo = "boom9_2" + this.funcSet;
					this.enter = "boom10_2" + this.funcSet;
					this.num4 = "boom11_2" + this.funcSet;
					this.num5 = "boom12_2" + this.funcSet;
					this.num6 = "boom13_2" + this.funcSet;

				}
				break;

			case this.vKey == 70 && this.keyStatus == 1: //f
				if (this.num == 0) {
					// this.clear();
					if (this.keyFlag1 == 0) {
						this.keyFlag1 = 1;
						setTimeout(() => {
							this.keyFlag1 = 0;
							this.caps = "" + this.funcSet;
							this.a = "" + this.funcSet;
							this.s = "" + this.funcSet;
							this.d = "" + this.funcSet;
							this.f = "" + this.funcSet;
							this.g = "" + this.funcSet;
							this.h = "" + this.funcSet;
							this.j = "" + this.funcSet;
							this.k = "" + this.funcSet;
							this.l = "" + this.funcSet;
							this.sem = "" + this.funcSet;
							this.quo = "" + this.funcSet;
							this.enter = "" + this.funcSet;
							this.num4 = "" + this.funcSet;
							this.num5 = "" + this.funcSet;
							this.num6 = "" + this.funcSet;
						}, 1000);
					}
					this.caps = "boom5_1" + this.funcSet;
					this.a = "boom4_1" + this.funcSet;
					this.s = "boom3_1" + this.funcSet;
					this.d = "boom2_1" + this.funcSet;
					this.f = "boom1_1" + this.funcSet;
					this.g = "boom2_1" + this.funcSet;
					this.h = "boom3_1" + this.funcSet;
					this.j = "boom4_1" + this.funcSet;
					this.k = "boom5_1" + this.funcSet;
					this.l = "boom6_1" + this.funcSet;
					this.sem = "boom7_1" + this.funcSet;
					this.quo = "boom8_1" + this.funcSet;
					this.enter = "boom9_1" + this.funcSet;
					this.num4 = "boom10_1" + this.funcSet;
					this.num5 = "boom11_1" + this.funcSet;
					this.num6 = "boom12_1" + this.funcSet;

					this.num = 1;
				}
				else if (this.num == 1) {
					this.num = 0;
					// this.clear();
					if (this.keyFlag2 == 0) {
						this.keyFlag2 = 1;
						setTimeout(() => {
							this.keyFlag2 = 0;
							this.caps = "" + this.funcSet;
							this.a = "" + this.funcSet;
							this.s = "" + this.funcSet;
							this.d = "" + this.funcSet;
							this.f = "" + this.funcSet;
							this.g = "" + this.funcSet;
							this.h = "" + this.funcSet;
							this.j = "" + this.funcSet;
							this.k = "" + this.funcSet;
							this.l = "" + this.funcSet;
							this.sem = "" + this.funcSet;
							this.quo = "" + this.funcSet;
							this.enter = "" + this.funcSet;
							this.num4 = "" + this.funcSet;
							this.num5 = "" + this.funcSet;
							this.num6 = "" + this.funcSet;
						}, 1000);
					}
					this.caps = "boom5_2" + this.funcSet;
					this.a = "boom4_2" + this.funcSet;
					this.s = "boom3_2" + this.funcSet;
					this.d = "boom2_2" + this.funcSet;
					this.f = "boom1_2" + this.funcSet;
					this.g = "boom2_2" + this.funcSet;
					this.h = "boom3_2" + this.funcSet;
					this.j = "boom4_2" + this.funcSet;
					this.k = "boom5_2" + this.funcSet;
					this.l = "boom6_2" + this.funcSet;
					this.sem = "boom7_2" + this.funcSet;
					this.quo = "boom8_2" + this.funcSet;
					this.enter = "boom9_2" + this.funcSet;
					this.num4 = "boom10_2" + this.funcSet;
					this.num5 = "boom11_2" + this.funcSet;
					this.num6 = "boom12_2" + this.funcSet;

				}
				break;

			case this.vKey == 71 && this.keyStatus == 1: //g
				if (this.num == 0) {
					// this.clear();
					if (this.keyFlag1 == 0) {
						this.keyFlag1 = 1;
						setTimeout(() => {
							this.keyFlag1 = 0;
							this.caps = "" + this.funcSet;
							this.a = "" + this.funcSet;
							this.s = "" + this.funcSet;
							this.d = "" + this.funcSet;
							this.f = "" + this.funcSet;
							this.g = "" + this.funcSet;
							this.h = "" + this.funcSet;
							this.j = "" + this.funcSet;
							this.k = "" + this.funcSet;
							this.l = "" + this.funcSet;
							this.sem = "" + this.funcSet;
							this.quo = "" + this.funcSet;
							this.enter = "" + this.funcSet;
							this.num4 = "" + this.funcSet;
							this.num5 = "" + this.funcSet;
							this.num6 = "" + this.funcSet;
						}, 1000);
					}
					this.caps = "boom6_1" + this.funcSet;
					this.a = "boom5_1" + this.funcSet;
					this.s = "boom4_1" + this.funcSet;
					this.d = "boom3_1" + this.funcSet;
					this.f = "boom2_1" + this.funcSet;
					this.g = "boom1_1" + this.funcSet;
					this.h = "boom2_1" + this.funcSet;
					this.j = "boom3_1" + this.funcSet;
					this.k = "boom4_1" + this.funcSet;
					this.l = "boom5_1" + this.funcSet;
					this.sem = "boom6_1" + this.funcSet;
					this.quo = "boom7_1" + this.funcSet;
					this.enter = "boom8_1" + this.funcSet;
					this.num4 = "boom9_1" + this.funcSet;
					this.num5 = "boom10_1" + this.funcSet;
					this.num6 = "boom11_1" + this.funcSet;

					this.num = 1;
				}
				else if (this.num == 1) {
					this.num = 0;
					// this.clear();
					if (this.keyFlag2 == 0) {
						this.keyFlag2 = 1;
						setTimeout(() => {
							this.keyFlag2 = 0;
							this.caps = "" + this.funcSet;
							this.a = "" + this.funcSet;
							this.s = "" + this.funcSet;
							this.d = "" + this.funcSet;
							this.f = "" + this.funcSet;
							this.g = "" + this.funcSet;
							this.h = "" + this.funcSet;
							this.j = "" + this.funcSet;
							this.k = "" + this.funcSet;
							this.l = "" + this.funcSet;
							this.sem = "" + this.funcSet;
							this.quo = "" + this.funcSet;
							this.enter = "" + this.funcSet;
							this.num4 = "" + this.funcSet;
							this.num5 = "" + this.funcSet;
							this.num6 = "" + this.funcSet;
						}, 1000);
					}
					this.caps = "boom6_2" + this.funcSet;
					this.a = "boom5_2" + this.funcSet;
					this.s = "boom4_2" + this.funcSet;
					this.d = "boom3_2" + this.funcSet;
					this.f = "boom2_2" + this.funcSet;
					this.g = "boom1_2" + this.funcSet;
					this.h = "boom2_2" + this.funcSet;
					this.j = "boom3_2" + this.funcSet;
					this.k = "boom4_2" + this.funcSet;
					this.l = "boom5_2" + this.funcSet;
					this.sem = "boom6_2" + this.funcSet;
					this.quo = "boom7_2" + this.funcSet;
					this.enter = "boom8_2" + this.funcSet;
					this.num4 = "boom9_2" + this.funcSet;
					this.num5 = "boom10_2" + this.funcSet;
					this.num6 = "boom11_2" + this.funcSet;

				}
				break;

			case this.vKey == 72 && this.keyStatus == 1: //h
				if (this.num == 0) {
					// this.clear();
					if (this.keyFlag1 == 0) {
						this.keyFlag1 = 1;
						setTimeout(() => {
							this.keyFlag1 = 0;
							this.caps = "" + this.funcSet;
							this.a = "" + this.funcSet;
							this.s = "" + this.funcSet;
							this.d = "" + this.funcSet;
							this.f = "" + this.funcSet;
							this.g = "" + this.funcSet;
							this.h = "" + this.funcSet;
							this.j = "" + this.funcSet;
							this.k = "" + this.funcSet;
							this.l = "" + this.funcSet;
							this.sem = "" + this.funcSet;
							this.quo = "" + this.funcSet;
							this.enter = "" + this.funcSet;
							this.num4 = "" + this.funcSet;
							this.num5 = "" + this.funcSet;
							this.num6 = "" + this.funcSet;
						}, 1000);
					}
					this.caps = "boom7_1" + this.funcSet;
					this.a = "boom6_1" + this.funcSet;
					this.s = "boom5_1" + this.funcSet;
					this.d = "boom4_1" + this.funcSet;
					this.f = "boom3_1" + this.funcSet;
					this.g = "boom2_1" + this.funcSet;
					this.h = "boom1_1" + this.funcSet;
					this.j = "boom2_1" + this.funcSet;
					this.k = "boom3_1" + this.funcSet;
					this.l = "boom4_1" + this.funcSet;
					this.sem = "boom5_1" + this.funcSet;
					this.quo = "boom6_1" + this.funcSet;
					this.enter = "boom7_1" + this.funcSet;
					this.num4 = "boom8_1" + this.funcSet;
					this.num5 = "boom9_1" + this.funcSet;
					this.num6 = "boom10_1" + this.funcSet;

					this.num = 1;
				}
				else if (this.num == 1) {
					this.num = 0;
					// this.clear();
					if (this.keyFlag2 == 0) {
						this.keyFlag2 = 1;
						setTimeout(() => {
							this.keyFlag2 = 0;
							this.caps = "" + this.funcSet;
							this.a = "" + this.funcSet;
							this.s = "" + this.funcSet;
							this.d = "" + this.funcSet;
							this.f = "" + this.funcSet;
							this.g = "" + this.funcSet;
							this.h = "" + this.funcSet;
							this.j = "" + this.funcSet;
							this.k = "" + this.funcSet;
							this.l = "" + this.funcSet;
							this.sem = "" + this.funcSet;
							this.quo = "" + this.funcSet;
							this.enter = "" + this.funcSet;
							this.num4 = "" + this.funcSet;
							this.num5 = "" + this.funcSet;
							this.num6 = "" + this.funcSet;
						}, 1000);
					}
					this.caps = "boom7_2" + this.funcSet;
					this.a = "boom6_2" + this.funcSet;
					this.s = "boom5_2" + this.funcSet;
					this.d = "boom4_2" + this.funcSet;
					this.f = "boom3_2" + this.funcSet;
					this.g = "boom2_2" + this.funcSet;
					this.h = "boom1_2" + this.funcSet;
					this.j = "boom2_2" + this.funcSet;
					this.k = "boom3_2" + this.funcSet;
					this.l = "boom4_2" + this.funcSet;
					this.sem = "boom5_2" + this.funcSet;
					this.quo = "boom6_2" + this.funcSet;
					this.enter = "boom7_2" + this.funcSet;
					this.num4 = "boom8_2" + this.funcSet;
					this.num5 = "boom9_2" + this.funcSet;
					this.num6 = "boom10_2" + this.funcSet;

				}
				break;

			case this.vKey == 74 && this.keyStatus == 1: //j
				if (this.num == 0) {
					// this.clear();
					if (this.keyFlag1 == 0) {
						this.keyFlag1 = 1;
						setTimeout(() => {
							this.keyFlag1 = 0;
							this.caps = "" + this.funcSet;
							this.a = "" + this.funcSet;
							this.s = "" + this.funcSet;
							this.d = "" + this.funcSet;
							this.f = "" + this.funcSet;
							this.g = "" + this.funcSet;
							this.h = "" + this.funcSet;
							this.j = "" + this.funcSet;
							this.k = "" + this.funcSet;
							this.l = "" + this.funcSet;
							this.sem = "" + this.funcSet;
							this.quo = "" + this.funcSet;
							this.enter = "" + this.funcSet;
							this.num4 = "" + this.funcSet;
							this.num5 = "" + this.funcSet;
							this.num6 = "" + this.funcSet;
						}, 1000);
					}
					this.caps = "boom8_1" + this.funcSet;
					this.a = "boom7_1" + this.funcSet;
					this.s = "boom6_1" + this.funcSet;
					this.d = "boom5_1" + this.funcSet;
					this.f = "boom4_1" + this.funcSet;
					this.g = "boom3_1" + this.funcSet;
					this.h = "boom2_1" + this.funcSet;
					this.j = "boom1_1" + this.funcSet;
					this.k = "boom2_1" + this.funcSet;
					this.l = "boom3_1" + this.funcSet;
					this.sem = "boom4_1" + this.funcSet;
					this.quo = "boom5_1" + this.funcSet;
					this.enter = "boom6_1" + this.funcSet;
					this.num4 = "boom7_1" + this.funcSet;
					this.num5 = "boom8_1" + this.funcSet;
					this.num6 = "boom9_1" + this.funcSet;

					this.num = 1;
				}
				else if (this.num == 1) {
					this.num = 0;
					// this.clear();
					if (this.keyFlag2 == 0) {
						this.keyFlag2 = 1;
						setTimeout(() => {
							this.keyFlag2 = 0;
							this.caps = "" + this.funcSet;
							this.a = "" + this.funcSet;
							this.s = "" + this.funcSet;
							this.d = "" + this.funcSet;
							this.f = "" + this.funcSet;
							this.g = "" + this.funcSet;
							this.h = "" + this.funcSet;
							this.j = "" + this.funcSet;
							this.k = "" + this.funcSet;
							this.l = "" + this.funcSet;
							this.sem = "" + this.funcSet;
							this.quo = "" + this.funcSet;
							this.enter = "" + this.funcSet;
							this.num4 = "" + this.funcSet;
							this.num5 = "" + this.funcSet;
							this.num6 = "" + this.funcSet;
						}, 1000);
					}
					this.caps = "boom8_2" + this.funcSet;
					this.a = "boom7_2" + this.funcSet;
					this.s = "boom6_2" + this.funcSet;
					this.d = "boom5_2" + this.funcSet;
					this.f = "boom4_2" + this.funcSet;
					this.g = "boom3_2" + this.funcSet;
					this.h = "boom2_2" + this.funcSet;
					this.j = "boom1_2" + this.funcSet;
					this.k = "boom2_2" + this.funcSet;
					this.l = "boom3_2" + this.funcSet;
					this.sem = "boom4_2" + this.funcSet;
					this.quo = "boom5_2" + this.funcSet;
					this.enter = "boom6_2" + this.funcSet;
					this.num4 = "boom7_2" + this.funcSet;
					this.num5 = "boom8_2" + this.funcSet;
					this.num6 = "boom9_2" + this.funcSet;

				}
				break;

			case this.vKey == 75 && this.keyStatus == 1: //k
				if (this.num == 0) {
					// this.clear();
					if (this.keyFlag1 == 0) {
						this.keyFlag1 = 1;
						setTimeout(() => {
							this.keyFlag1 = 0;
							this.caps = "" + this.funcSet;
							this.a = "" + this.funcSet;
							this.s = "" + this.funcSet;
							this.d = "" + this.funcSet;
							this.f = "" + this.funcSet;
							this.g = "" + this.funcSet;
							this.h = "" + this.funcSet;
							this.j = "" + this.funcSet;
							this.k = "" + this.funcSet;
							this.l = "" + this.funcSet;
							this.sem = "" + this.funcSet;
							this.quo = "" + this.funcSet;
							this.enter = "" + this.funcSet;
							this.num4 = "" + this.funcSet;
							this.num5 = "" + this.funcSet;
							this.num6 = "" + this.funcSet;
						}, 1000);
					}
					this.caps = "boom9_1" + this.funcSet;
					this.a = "boom8_1" + this.funcSet;
					this.s = "boom7_1" + this.funcSet;
					this.d = "boom6_1" + this.funcSet;
					this.f = "boom5_1" + this.funcSet;
					this.g = "boom4_1" + this.funcSet;
					this.h = "boom3_1" + this.funcSet;
					this.j = "boom2_1" + this.funcSet;
					this.k = "boom1_1" + this.funcSet;
					this.l = "boom2_1" + this.funcSet;
					this.sem = "boom3_1" + this.funcSet;
					this.quo = "boom4_1" + this.funcSet;
					this.enter = "boom5_1" + this.funcSet;
					this.num4 = "boom6_1" + this.funcSet;
					this.num5 = "boom7_1" + this.funcSet;
					this.num6 = "boom8_1" + this.funcSet;

					this.num = 1;
				}
				else if (this.num == 1) {
					this.num = 0;
					// this.clear();
					if (this.keyFlag2 == 0) {
						this.keyFlag2 = 1;
						setTimeout(() => {
							this.keyFlag2 = 0;
							this.caps = "" + this.funcSet;
							this.a = "" + this.funcSet;
							this.s = "" + this.funcSet;
							this.d = "" + this.funcSet;
							this.f = "" + this.funcSet;
							this.g = "" + this.funcSet;
							this.h = "" + this.funcSet;
							this.j = "" + this.funcSet;
							this.k = "" + this.funcSet;
							this.l = "" + this.funcSet;
							this.sem = "" + this.funcSet;
							this.quo = "" + this.funcSet;
							this.enter = "" + this.funcSet;
							this.num4 = "" + this.funcSet;
							this.num5 = "" + this.funcSet;
							this.num6 = "" + this.funcSet;
						}, 1000);
					}
					this.caps = "boom9_2" + this.funcSet;
					this.a = "boom8_2" + this.funcSet;
					this.s = "boom7_2" + this.funcSet;
					this.d = "boom6_2" + this.funcSet;
					this.f = "boom5_2" + this.funcSet;
					this.g = "boom4_2" + this.funcSet;
					this.h = "boom3_2" + this.funcSet;
					this.j = "boom2_2" + this.funcSet;
					this.k = "boom1_2" + this.funcSet;
					this.l = "boom2_2" + this.funcSet;
					this.sem = "boom3_2" + this.funcSet;
					this.quo = "boom4_2" + this.funcSet;
					this.enter = "boom5_2" + this.funcSet;
					this.num4 = "boom6_2" + this.funcSet;
					this.num5 = "boom7_2" + this.funcSet;
					this.num6 = "boom8_2" + this.funcSet;

				}
				break;

			case this.vKey == 76 && this.keyStatus == 1: //l
				if (this.num == 0) {
					// this.clear();
					if (this.keyFlag1 == 0) {
						this.keyFlag1 = 1;
						setTimeout(() => {
							this.keyFlag1 = 0;
							this.caps = "" + this.funcSet;
							this.a = "" + this.funcSet;
							this.s = "" + this.funcSet;
							this.d = "" + this.funcSet;
							this.f = "" + this.funcSet;
							this.g = "" + this.funcSet;
							this.h = "" + this.funcSet;
							this.j = "" + this.funcSet;
							this.k = "" + this.funcSet;
							this.l = "" + this.funcSet;
							this.sem = "" + this.funcSet;
							this.quo = "" + this.funcSet;
							this.enter = "" + this.funcSet;
							this.num4 = "" + this.funcSet;
							this.num5 = "" + this.funcSet;
							this.num6 = "" + this.funcSet;
						}, 1000);
					}
					this.caps = "boom10_1" + this.funcSet;
					this.a = "boom9_1" + this.funcSet;
					this.s = "boom8_1" + this.funcSet;
					this.d = "boom7_1" + this.funcSet;
					this.f = "boom6_1" + this.funcSet;
					this.g = "boom5_1" + this.funcSet;
					this.h = "boom4_1" + this.funcSet;
					this.j = "boom3_1" + this.funcSet;
					this.k = "boom2_1" + this.funcSet;
					this.l = "boom1_1" + this.funcSet;
					this.sem = "boom2_1" + this.funcSet;
					this.quo = "boom3_1" + this.funcSet;
					this.enter = "boom4_1" + this.funcSet;
					this.num4 = "boom5_1" + this.funcSet;
					this.num5 = "boom6_1" + this.funcSet;
					this.num6 = "boom7_1" + this.funcSet;

					this.num = 1;
				}
				else if (this.num == 1) {
					this.num = 0;
					// this.clear();
					if (this.keyFlag2 == 0) {
						this.keyFlag2 = 1;
						setTimeout(() => {
							this.keyFlag2 = 0;
							this.caps = "" + this.funcSet;
							this.a = "" + this.funcSet;
							this.s = "" + this.funcSet;
							this.d = "" + this.funcSet;
							this.f = "" + this.funcSet;
							this.g = "" + this.funcSet;
							this.h = "" + this.funcSet;
							this.j = "" + this.funcSet;
							this.k = "" + this.funcSet;
							this.l = "" + this.funcSet;
							this.sem = "" + this.funcSet;
							this.quo = "" + this.funcSet;
							this.enter = "" + this.funcSet;
							this.num4 = "" + this.funcSet;
							this.num5 = "" + this.funcSet;
							this.num6 = "" + this.funcSet;
						}, 1000);
					}
					this.caps = "boom10_2" + this.funcSet;
					this.a = "boom9_2" + this.funcSet;
					this.s = "boom8_2" + this.funcSet;
					this.d = "boom7_2" + this.funcSet;
					this.f = "boom6_2" + this.funcSet;
					this.g = "boom5_2" + this.funcSet;
					this.h = "boom4_2" + this.funcSet;
					this.j = "boom3_2" + this.funcSet;
					this.k = "boom2_2" + this.funcSet;
					this.l = "boom1_2" + this.funcSet;
					this.sem = "boom2_2" + this.funcSet;
					this.quo = "boom3_2" + this.funcSet;
					this.enter = "boom4_2" + this.funcSet;
					this.num4 = "boom5_2" + this.funcSet;
					this.num5 = "boom6_2" + this.funcSet;
					this.num6 = "boom7_2" + this.funcSet;

				}
				break;

			case this.vKey == 186 && this.keyStatus == 1: //sem
				if (this.num == 0) {
					// this.clear();
					if (this.keyFlag1 == 0) {
						this.keyFlag1 = 1;
						setTimeout(() => {
							this.keyFlag1 = 0;
							this.caps = "" + this.funcSet;
							this.a = "" + this.funcSet;
							this.s = "" + this.funcSet;
							this.d = "" + this.funcSet;
							this.f = "" + this.funcSet;
							this.g = "" + this.funcSet;
							this.h = "" + this.funcSet;
							this.j = "" + this.funcSet;
							this.k = "" + this.funcSet;
							this.l = "" + this.funcSet;
							this.sem = "" + this.funcSet;
							this.quo = "" + this.funcSet;
							this.enter = "" + this.funcSet;
							this.num4 = "" + this.funcSet;
							this.num5 = "" + this.funcSet;
							this.num6 = "" + this.funcSet;
						}, 1000);
					}
					this.caps = "boom11_1" + this.funcSet;
					this.a = "boom10_1" + this.funcSet;
					this.s = "boom9_1" + this.funcSet;
					this.d = "boom8_1" + this.funcSet;
					this.f = "boom7_1" + this.funcSet;
					this.g = "boom6_1" + this.funcSet;
					this.h = "boom5_1" + this.funcSet;
					this.j = "boom4_1" + this.funcSet;
					this.k = "boom3_1" + this.funcSet;
					this.l = "boom2_1" + this.funcSet;
					this.sem = "boom1_1" + this.funcSet;
					this.quo = "boom2_1" + this.funcSet;
					this.enter = "boom3_1" + this.funcSet;
					this.num4 = "boom4_1" + this.funcSet;
					this.num5 = "boom5_1" + this.funcSet;
					this.num6 = "boom6_1" + this.funcSet;

					this.num = 1;
				}
				else if (this.num == 1) {
					this.num = 0;
					// this.clear();
					if (this.keyFlag2 == 0) {
						this.keyFlag2 = 1;
						setTimeout(() => {
							this.keyFlag2 = 0;
							this.caps = "" + this.funcSet;
							this.a = "" + this.funcSet;
							this.s = "" + this.funcSet;
							this.d = "" + this.funcSet;
							this.f = "" + this.funcSet;
							this.g = "" + this.funcSet;
							this.h = "" + this.funcSet;
							this.j = "" + this.funcSet;
							this.k = "" + this.funcSet;
							this.l = "" + this.funcSet;
							this.sem = "" + this.funcSet;
							this.quo = "" + this.funcSet;
							this.enter = "" + this.funcSet;
							this.num4 = "" + this.funcSet;
							this.num5 = "" + this.funcSet;
							this.num6 = "" + this.funcSet;
						}, 1000);
					}
					this.caps = "boom11_2" + this.funcSet;
					this.a = "boom10_2" + this.funcSet;
					this.s = "boom9_2" + this.funcSet;
					this.d = "boom8_2" + this.funcSet;
					this.f = "boom7_2" + this.funcSet;
					this.g = "boom6_2" + this.funcSet;
					this.h = "boom5_2" + this.funcSet;
					this.j = "boom4_2" + this.funcSet;
					this.k = "boom3_2" + this.funcSet;
					this.l = "boom2_2" + this.funcSet;
					this.sem = "boom1_2" + this.funcSet;
					this.quo = "boom2_2" + this.funcSet;
					this.enter = "boom3_2" + this.funcSet;
					this.num4 = "boom4_2" + this.funcSet;
					this.num5 = "boom5_2" + this.funcSet;
					this.num6 = "boom6_2" + this.funcSet;

				}
				break;

			case this.vKey == 222 && this.keyStatus == 1: //quo
				if (this.num == 0) {
					// this.clear();
					if (this.keyFlag1 == 0) {
						this.keyFlag1 = 1;
						setTimeout(() => {
							this.keyFlag1 = 0;
							this.caps = "" + this.funcSet;
							this.a = "" + this.funcSet;
							this.s = "" + this.funcSet;
							this.d = "" + this.funcSet;
							this.f = "" + this.funcSet;
							this.g = "" + this.funcSet;
							this.h = "" + this.funcSet;
							this.j = "" + this.funcSet;
							this.k = "" + this.funcSet;
							this.l = "" + this.funcSet;
							this.sem = "" + this.funcSet;
							this.quo = "" + this.funcSet;
							this.enter = "" + this.funcSet;
							this.num4 = "" + this.funcSet;
							this.num5 = "" + this.funcSet;
							this.num6 = "" + this.funcSet;
						}, 1000);
					}
					this.caps = "boom12_1" + this.funcSet;
					this.a = "boom11_1" + this.funcSet;
					this.s = "boom10_1" + this.funcSet;
					this.d = "boom9_1" + this.funcSet;
					this.f = "boom8_1" + this.funcSet;
					this.g = "boom7_1" + this.funcSet;
					this.h = "boom6_1" + this.funcSet;
					this.j = "boom5_1" + this.funcSet;
					this.k = "boom4_1" + this.funcSet;
					this.l = "boom9_1" + this.funcSet;
					this.sem = "boom2_1" + this.funcSet;
					this.quo = "boom1_1" + this.funcSet;
					this.enter = "boom2_1" + this.funcSet;
					this.num4 = "boom3_1" + this.funcSet;
					this.num5 = "boom4_1" + this.funcSet;
					this.num6 = "boom5_1" + this.funcSet;

					this.num = 1;
				}
				else if (this.num == 1) {
					this.num = 0;
					// this.clear();
					if (this.keyFlag2 == 0) {
						this.keyFlag2 = 1;
						setTimeout(() => {
							this.keyFlag2 = 0;
							this.caps = "" + this.funcSet;
							this.a = "" + this.funcSet;
							this.s = "" + this.funcSet;
							this.d = "" + this.funcSet;
							this.f = "" + this.funcSet;
							this.g = "" + this.funcSet;
							this.h = "" + this.funcSet;
							this.j = "" + this.funcSet;
							this.k = "" + this.funcSet;
							this.l = "" + this.funcSet;
							this.sem = "" + this.funcSet;
							this.quo = "" + this.funcSet;
							this.enter = "" + this.funcSet;
							this.num4 = "" + this.funcSet;
							this.num5 = "" + this.funcSet;
							this.num6 = "" + this.funcSet;
						}, 1000);
					}
					this.caps = "boom12_2" + this.funcSet;
					this.a = "boom11_2" + this.funcSet;
					this.s = "boom10_2" + this.funcSet;
					this.d = "boom9_2" + this.funcSet;
					this.f = "boom8_2" + this.funcSet;
					this.g = "boom7_2" + this.funcSet;
					this.h = "boom6_2" + this.funcSet;
					this.j = "boom5_2" + this.funcSet;
					this.k = "boom4_2" + this.funcSet;
					this.l = "boom9_2" + this.funcSet;
					this.sem = "boom2_2" + this.funcSet;
					this.quo = "boom1_2" + this.funcSet;
					this.enter = "boom2_2" + this.funcSet;
					this.num4 = "boom3_2" + this.funcSet;
					this.num5 = "boom4_2" + this.funcSet;
					this.num6 = "boom5_2" + this.funcSet;

				}
				break;
			case this.vKey == 13 && this.keyStatus == 1: //enter
				if (this.num == 0) {
					// this.clear();
					if (this.keyFlag1 == 0) {
						this.keyFlag1 = 1;
						setTimeout(() => {
							this.keyFlag1 = 0;
							this.caps = "" + this.funcSet;
							this.a = "" + this.funcSet;
							this.s = "" + this.funcSet;
							this.d = "" + this.funcSet;
							this.f = "" + this.funcSet;
							this.g = "" + this.funcSet;
							this.h = "" + this.funcSet;
							this.j = "" + this.funcSet;
							this.k = "" + this.funcSet;
							this.l = "" + this.funcSet;
							this.sem = "" + this.funcSet;
							this.quo = "" + this.funcSet;
							this.enter = "" + this.funcSet;
							this.num4 = "" + this.funcSet;
							this.num5 = "" + this.funcSet;
							this.num6 = "" + this.funcSet;
						}, 1000);
					}
					this.caps = "boom13_1" + this.funcSet;
					this.a = "boom12_1" + this.funcSet;
					this.s = "boom11_1" + this.funcSet;
					this.d = "boom10_1" + this.funcSet;
					this.f = "boom9_1" + this.funcSet;
					this.g = "boom8_1" + this.funcSet;
					this.h = "boom7_1" + this.funcSet;
					this.j = "boom6_1" + this.funcSet;
					this.k = "boom5_1" + this.funcSet;
					this.l = "boom4_1" + this.funcSet;
					this.sem = "boom3_1" + this.funcSet;
					this.quo = "boom2_1" + this.funcSet;
					this.enter = "boom1_1" + this.funcSet;
					this.num4 = "boom2_1" + this.funcSet;
					this.num5 = "boom3_1" + this.funcSet;
					this.num6 = "boom4_1" + this.funcSet;

					this.num = 1;
				}
				else if (this.num == 1) {
					this.num = 0;
					// this.clear();
					if (this.keyFlag2 == 0) {
						this.keyFlag2 = 1;
						setTimeout(() => {
							this.keyFlag2 = 0;
							this.caps = "" + this.funcSet;
							this.a = "" + this.funcSet;
							this.s = "" + this.funcSet;
							this.d = "" + this.funcSet;
							this.f = "" + this.funcSet;
							this.g = "" + this.funcSet;
							this.h = "" + this.funcSet;
							this.j = "" + this.funcSet;
							this.k = "" + this.funcSet;
							this.l = "" + this.funcSet;
							this.sem = "" + this.funcSet;
							this.quo = "" + this.funcSet;
							this.enter = "" + this.funcSet;
							this.num4 = "" + this.funcSet;
							this.num5 = "" + this.funcSet;
							this.num6 = "" + this.funcSet;
						}, 1000);
					}
					this.caps = "boom13_2" + this.funcSet;
					this.a = "boom12_2" + this.funcSet;
					this.s = "boom11_2" + this.funcSet;
					this.d = "boom10_2" + this.funcSet;
					this.f = "boom9_2" + this.funcSet;
					this.g = "boom8_2" + this.funcSet;
					this.h = "boom7_2" + this.funcSet;
					this.j = "boom6_2" + this.funcSet;
					this.k = "boom5_2" + this.funcSet;
					this.l = "boom4_2" + this.funcSet;
					this.sem = "boom3_2" + this.funcSet;
					this.quo = "boom2_2" + this.funcSet;
					this.enter = "boom1_2" + this.funcSet;
					this.num4 = "boom2_2" + this.funcSet;
					this.num5 = "boom3_2" + this.funcSet;
					this.num6 = "boom4_2" + this.funcSet;

				}
				break;

			case this.vKey == 100 && this.keyStatus == 1: //num4
				if (this.num == 0) {
					// this.clear();
					if (this.keyFlag1 == 0) {
						this.keyFlag1 = 1;
						setTimeout(() => {
							this.keyFlag1 = 0;
							this.caps = "" + this.funcSet;
							this.a = "" + this.funcSet;
							this.s = "" + this.funcSet;
							this.d = "" + this.funcSet;
							this.f = "" + this.funcSet;
							this.g = "" + this.funcSet;
							this.h = "" + this.funcSet;
							this.j = "" + this.funcSet;
							this.k = "" + this.funcSet;
							this.l = "" + this.funcSet;
							this.sem = "" + this.funcSet;
							this.quo = "" + this.funcSet;
							this.enter = "" + this.funcSet;
							this.num4 = "" + this.funcSet;
							this.num5 = "" + this.funcSet;
							this.num6 = "" + this.funcSet;
						}, 1000);
					}
					this.caps = "boom14_1" + this.funcSet;
					this.a = "boom13_1" + this.funcSet;
					this.s = "boom12_1" + this.funcSet;
					this.d = "boom11_1" + this.funcSet;
					this.f = "boom10_1" + this.funcSet;
					this.g = "boom9_1" + this.funcSet;
					this.h = "boom8_1" + this.funcSet;
					this.j = "boom7_1" + this.funcSet;
					this.k = "boom6_1" + this.funcSet;
					this.l = "boom5_1" + this.funcSet;
					this.sem = "boom4_1" + this.funcSet;
					this.quo = "boom3_1" + this.funcSet;
					this.enter = "boom2_1" + this.funcSet;
					this.num4 = "boom1_1" + this.funcSet;
					this.num5 = "boom2_1" + this.funcSet;
					this.num6 = "boom3_1" + this.funcSet;

					this.num = 1;
				}
				else if (this.num == 1) {
					this.num = 0;
					// this.clear();
					if (this.keyFlag2 == 0) {
						this.keyFlag2 = 1;
						setTimeout(() => {
							this.keyFlag2 = 0;
							this.caps = "" + this.funcSet;
							this.a = "" + this.funcSet;
							this.s = "" + this.funcSet;
							this.d = "" + this.funcSet;
							this.f = "" + this.funcSet;
							this.g = "" + this.funcSet;
							this.h = "" + this.funcSet;
							this.j = "" + this.funcSet;
							this.k = "" + this.funcSet;
							this.l = "" + this.funcSet;
							this.sem = "" + this.funcSet;
							this.quo = "" + this.funcSet;
							this.enter = "" + this.funcSet;
							this.num4 = "" + this.funcSet;
							this.num5 = "" + this.funcSet;
							this.num6 = "" + this.funcSet;
						}, 1000);
					}
					this.caps = "boom14_2" + this.funcSet;
					this.a = "boom13_2" + this.funcSet;
					this.s = "boom12_2" + this.funcSet;
					this.d = "boom11_2" + this.funcSet;
					this.f = "boom10_2" + this.funcSet;
					this.g = "boom9_2" + this.funcSet;
					this.h = "boom8_2" + this.funcSet;
					this.j = "boom7_2" + this.funcSet;
					this.k = "boom6_2" + this.funcSet;
					this.l = "boom5_2" + this.funcSet;
					this.sem = "boom4_2" + this.funcSet;
					this.quo = "boom3_2" + this.funcSet;
					this.enter = "boom2_2" + this.funcSet;
					this.num4 = "boom1_2" + this.funcSet;
					this.num5 = "boom2_2" + this.funcSet;
					this.num6 = "boom3_2" + this.funcSet;

				}
				break;

			case this.vKey == 101 && this.keyStatus == 1: //num5
				if (this.num == 0) {
					// this.clear();
					if (this.keyFlag1 == 0) {
						this.keyFlag1 = 1;
						setTimeout(() => {
							this.keyFlag1 = 0;
							this.caps = "" + this.funcSet;
							this.a = "" + this.funcSet;
							this.s = "" + this.funcSet;
							this.d = "" + this.funcSet;
							this.f = "" + this.funcSet;
							this.g = "" + this.funcSet;
							this.h = "" + this.funcSet;
							this.j = "" + this.funcSet;
							this.k = "" + this.funcSet;
							this.l = "" + this.funcSet;
							this.sem = "" + this.funcSet;
							this.quo = "" + this.funcSet;
							this.enter = "" + this.funcSet;
							this.num4 = "" + this.funcSet;
							this.num5 = "" + this.funcSet;
							this.num6 = "" + this.funcSet;
						}, 1000);
					}
					this.caps = "boom15_1" + this.funcSet;
					this.a = "boom14_1" + this.funcSet;
					this.s = "boom13_1" + this.funcSet;
					this.d = "boom12_1" + this.funcSet;
					this.f = "boom11_1" + this.funcSet;
					this.g = "boom10_1" + this.funcSet;
					this.h = "boom9_1" + this.funcSet;
					this.j = "boom8_1" + this.funcSet;
					this.k = "boom7_1" + this.funcSet;
					this.l = "boom6_1" + this.funcSet;
					this.sem = "boom5_1" + this.funcSet;
					this.quo = "boom4_1" + this.funcSet;
					this.enter = "boom3_1" + this.funcSet;
					this.num4 = "boom2_1" + this.funcSet;
					this.num5 = "boom1_1" + this.funcSet;
					this.num6 = "boom2_1" + this.funcSet;

					this.num = 1;
				}
				else if (this.num == 1) {
					this.num = 0;
					// this.clear();
					if (this.keyFlag2 == 0) {
						this.keyFlag2 = 1;
						setTimeout(() => {
							this.keyFlag2 = 0;
							this.caps = "" + this.funcSet;
							this.a = "" + this.funcSet;
							this.s = "" + this.funcSet;
							this.d = "" + this.funcSet;
							this.f = "" + this.funcSet;
							this.g = "" + this.funcSet;
							this.h = "" + this.funcSet;
							this.j = "" + this.funcSet;
							this.k = "" + this.funcSet;
							this.l = "" + this.funcSet;
							this.sem = "" + this.funcSet;
							this.quo = "" + this.funcSet;
							this.enter = "" + this.funcSet;
							this.num4 = "" + this.funcSet;
							this.num5 = "" + this.funcSet;
							this.num6 = "" + this.funcSet;
						}, 1000);
					}
					this.caps = "boom15_2" + this.funcSet;
					this.a = "boom14_2" + this.funcSet;
					this.s = "boom13_2" + this.funcSet;
					this.d = "boom12_2" + this.funcSet;
					this.f = "boom11_2" + this.funcSet;
					this.g = "boom10_2" + this.funcSet;
					this.h = "boom9_2" + this.funcSet;
					this.j = "boom8_2" + this.funcSet;
					this.k = "boom7_2" + this.funcSet;
					this.l = "boom6_2" + this.funcSet;
					this.sem = "boom5_2" + this.funcSet;
					this.quo = "boom4_2" + this.funcSet;
					this.enter = "boom3_2" + this.funcSet;
					this.num4 = "boom2_2" + this.funcSet;
					this.num5 = "boom1_2" + this.funcSet;
					this.num6 = "boom2_2" + this.funcSet;

				}
				break;

			case this.vKey == 102 && this.keyStatus == 1: //num6
				if (this.num == 0) {
					// this.clear();
					if (this.keyFlag1 == 0) {
						this.keyFlag1 = 1;
						setTimeout(() => {
							this.keyFlag1 = 0;
							this.caps = "" + this.funcSet;
							this.a = "" + this.funcSet;
							this.s = "" + this.funcSet;
							this.d = "" + this.funcSet;
							this.f = "" + this.funcSet;
							this.g = "" + this.funcSet;
							this.h = "" + this.funcSet;
							this.j = "" + this.funcSet;
							this.k = "" + this.funcSet;
							this.l = "" + this.funcSet;
							this.sem = "" + this.funcSet;
							this.quo = "" + this.funcSet;
							this.enter = "" + this.funcSet;
							this.num4 = "" + this.funcSet;
							this.num5 = "" + this.funcSet;
							this.num6 = "" + this.funcSet;
						}, 1000);
					}
					this.caps = "boom16_1" + this.funcSet;
					this.a = "boom15_1" + this.funcSet;
					this.s = "boom14_1" + this.funcSet;
					this.d = "boom13_1" + this.funcSet;
					this.f = "boom12_1" + this.funcSet;
					this.g = "boom11_1" + this.funcSet;
					this.h = "boom10_1" + this.funcSet;
					this.j = "boom9_1" + this.funcSet;
					this.k = "boom8_1" + this.funcSet;
					this.l = "boom7_1" + this.funcSet;
					this.sem = "boom6_1" + this.funcSet;
					this.quo = "boom5_1" + this.funcSet;
					this.enter = "boom4_1" + this.funcSet;
					this.num4 = "boom3_1" + this.funcSet;
					this.num5 = "boom2_1" + this.funcSet;
					this.num6 = "boom1_1" + this.funcSet;

					this.num = 1;
				}
				else if (this.num == 1) {
					this.num = 0;
					// this.clear();
					if (this.keyFlag2 == 0) {
						this.keyFlag2 = 1;
						setTimeout(() => {
							this.keyFlag2 = 0;
							this.caps = "" + this.funcSet;
							this.a = "" + this.funcSet;
							this.s = "" + this.funcSet;
							this.d = "" + this.funcSet;
							this.f = "" + this.funcSet;
							this.g = "" + this.funcSet;
							this.h = "" + this.funcSet;
							this.j = "" + this.funcSet;
							this.k = "" + this.funcSet;
							this.l = "" + this.funcSet;
							this.sem = "" + this.funcSet;
							this.quo = "" + this.funcSet;
							this.enter = "" + this.funcSet;
							this.num4 = "" + this.funcSet;
							this.num5 = "" + this.funcSet;
							this.num6 = "" + this.funcSet;
						}, 1000);
					}
					this.caps = "boom16_2" + this.funcSet;
					this.a = "boom15_2" + this.funcSet;
					this.s = "boom14_2" + this.funcSet;
					this.d = "boom13_2" + this.funcSet;
					this.f = "boom12_2" + this.funcSet;
					this.g = "boom11_2" + this.funcSet;
					this.h = "boom10_2" + this.funcSet;
					this.j = "boom9_2" + this.funcSet;
					this.k = "boom8_2" + this.funcSet;
					this.l = "boom7_2" + this.funcSet;
					this.sem = "boom6_2" + this.funcSet;
					this.quo = "boom5_2" + this.funcSet;
					this.enter = "boom4_2" + this.funcSet;
					this.num4 = "boom3_2" + this.funcSet;
					this.num5 = "boom2_2" + this.funcSet;
					this.num6 = "boom1_2" + this.funcSet;

				}
				break;

			case this.vKey == 'l16' && this.keyStatus == 1: //lshift
				if (this.num == 0) {
					// this.clear();
					if (this.keyFlag1 == 0) {
						this.keyFlag1 = 1;
						setTimeout(() => {
							this.keyFlag1 = 0;
							this.lshift = "" + this.funcSet;
							this.z = "" + this.funcSet;
							this.x = "" + this.funcSet;
							this.c = "" + this.funcSet;
							this.v = "" + this.funcSet;
							this.b = "" + this.funcSet;
							this.n = "" + this.funcSet;
							this.m = "" + this.funcSet;
							this.comma = "" + this.funcSet;
							this.dot = "" + this.funcSet;
							this.qmark = "" + this.funcSet;
							this.rshift = "" + this.funcSet;
							this.up = "" + this.funcSet;
							this.num1 = "" + this.funcSet;
							this.num2 = "" + this.funcSet;
							this.num3 = "" + this.funcSet;
							this.numenter = "" + this.funcSet;
						}, 1000);
					}
					this.lshift = "boom1_1" + this.funcSet;
					this.z = "boom2_1" + this.funcSet;
					this.x = "boom3_1" + this.funcSet;
					this.c = "boom4_1" + this.funcSet;
					this.v = "boom5_1" + this.funcSet;
					this.b = "boom6_1" + this.funcSet;
					this.n = "boom7_1" + this.funcSet;
					this.m = "boom8_1" + this.funcSet;
					this.comma = "boom9_1" + this.funcSet;
					this.dot = "boom10_1" + this.funcSet;
					this.qmark = "boom11_1" + this.funcSet;
					this.rshift = "boom12_1" + this.funcSet;
					this.up = "boom13_1" + this.funcSet;
					this.num1 = "boom14_1" + this.funcSet;
					this.num2 = "boom15_1" + this.funcSet;
					this.num3 = "boom16_1" + this.funcSet;
					this.numenter = "boom17_1" + this.funcSet;

					this.num = 1;
				}
				else if (this.num == 1) {
					this.num = 0;
					// this.clear();
					if (this.keyFlag2 == 0) {
						this.keyFlag2 = 1;
						setTimeout(() => {
							this.keyFlag2 = 0;
							this.lshift = "" + this.funcSet;
							this.z = "" + this.funcSet;
							this.x = "" + this.funcSet;
							this.c = "" + this.funcSet;
							this.v = "" + this.funcSet;
							this.b = "" + this.funcSet;
							this.n = "" + this.funcSet;
							this.m = "" + this.funcSet;
							this.comma = "" + this.funcSet;
							this.dot = "" + this.funcSet;
							this.qmark = "" + this.funcSet;
							this.rshift = "" + this.funcSet;
							this.up = "" + this.funcSet;
							this.num1 = "" + this.funcSet;
							this.num2 = "" + this.funcSet;
							this.num3 = "" + this.funcSet;
							this.numenter = "" + this.funcSet;
						}, 1000);
					}
					this.lshift = "boom1_2" + this.funcSet;
					this.z = "boom2_2" + this.funcSet;
					this.x = "boom3_2" + this.funcSet;
					this.c = "boom4_2" + this.funcSet;
					this.v = "boom5_2" + this.funcSet;
					this.b = "boom6_2" + this.funcSet;
					this.n = "boom7_2" + this.funcSet;
					this.m = "boom8_2" + this.funcSet;
					this.comma = "boom9_2" + this.funcSet;
					this.dot = "boom10_2" + this.funcSet;
					this.qmark = "boom11_2" + this.funcSet;
					this.rshift = "boom12_2" + this.funcSet;
					this.up = "boom13_2" + this.funcSet;
					this.num1 = "boom14_2" + this.funcSet;
					this.num2 = "boom15_2" + this.funcSet;
					this.num3 = "boom16_2" + this.funcSet;
					this.numenter = "boom17_2" + this.funcSet;

				}
				break;

			case this.vKey == 90 && this.keyStatus == 1: //z
				if (this.num == 0) {
					// this.clear();
					if (this.keyFlag1 == 0) {
						this.keyFlag1 = 1;
						setTimeout(() => {
							this.keyFlag1 = 0;
							this.lshift = "" + this.funcSet;
							this.z = "" + this.funcSet;
							this.x = "" + this.funcSet;
							this.c = "" + this.funcSet;
							this.v = "" + this.funcSet;
							this.b = "" + this.funcSet;
							this.n = "" + this.funcSet;
							this.m = "" + this.funcSet;
							this.comma = "" + this.funcSet;
							this.dot = "" + this.funcSet;
							this.qmark = "" + this.funcSet;
							this.rshift = "" + this.funcSet;
							this.up = "" + this.funcSet;
							this.num1 = "" + this.funcSet;
							this.num2 = "" + this.funcSet;
							this.num3 = "" + this.funcSet;
							this.numenter = "" + this.funcSet;
						}, 1000);
					}
					this.lshift = "boom2_1" + this.funcSet;
					this.z = "boom1_1" + this.funcSet;
					this.x = "boom2_1" + this.funcSet;
					this.c = "boom3_1" + this.funcSet;
					this.v = "boom4_1" + this.funcSet;
					this.b = "boom5_1" + this.funcSet;
					this.n = "boom6_1" + this.funcSet;
					this.m = "boom7_1" + this.funcSet;
					this.comma = "boom8_1" + this.funcSet;
					this.dot = "boom9_1" + this.funcSet;
					this.qmark = "boom10_1" + this.funcSet;
					this.rshift = "boom11_1" + this.funcSet;
					this.up = "boom12_1" + this.funcSet;
					this.num1 = "boom13_1" + this.funcSet;
					this.num2 = "boom14_1" + this.funcSet;
					this.num3 = "boom15_1" + this.funcSet;
					this.numenter = "boom16_1" + this.funcSet;

					this.num = 1;
				}
				else if (this.num == 1) {
					this.num = 0;
					// this.clear();
					if (this.keyFlag2 == 0) {
						this.keyFlag2 = 1;
						setTimeout(() => {
							this.keyFlag2 = 0;
							this.lshift = "" + this.funcSet;
							this.z = "" + this.funcSet;
							this.x = "" + this.funcSet;
							this.c = "" + this.funcSet;
							this.v = "" + this.funcSet;
							this.b = "" + this.funcSet;
							this.n = "" + this.funcSet;
							this.m = "" + this.funcSet;
							this.comma = "" + this.funcSet;
							this.dot = "" + this.funcSet;
							this.qmark = "" + this.funcSet;
							this.rshift = "" + this.funcSet;
							this.up = "" + this.funcSet;
							this.num1 = "" + this.funcSet;
							this.num2 = "" + this.funcSet;
							this.num3 = "" + this.funcSet;
							this.numenter = "" + this.funcSet;
						}, 1000);
					}
					this.lshift = "boom2_2" + this.funcSet;
					this.z = "boom1_2" + this.funcSet;
					this.x = "boom2_2" + this.funcSet;
					this.c = "boom3_2" + this.funcSet;
					this.v = "boom4_2" + this.funcSet;
					this.b = "boom5_2" + this.funcSet;
					this.n = "boom6_2" + this.funcSet;
					this.m = "boom7_2" + this.funcSet;
					this.comma = "boom8_2" + this.funcSet;
					this.dot = "boom9_2" + this.funcSet;
					this.qmark = "boom10_2" + this.funcSet;
					this.rshift = "boom11_2" + this.funcSet;
					this.up = "boom12_2" + this.funcSet;
					this.num1 = "boom13_2" + this.funcSet;
					this.num2 = "boom14_2" + this.funcSet;
					this.num3 = "boom15_2" + this.funcSet;
					this.numenter = "boom16_2" + this.funcSet;

				}
				break;

			case this.vKey == 88 && this.keyStatus == 1: //x
				if (this.num == 0) {
					// this.clear();
					if (this.keyFlag1 == 0) {
						this.keyFlag1 = 1;
						setTimeout(() => {
							this.keyFlag1 = 0;
							this.lshift = "" + this.funcSet;
							this.z = "" + this.funcSet;
							this.x = "" + this.funcSet;
							this.c = "" + this.funcSet;
							this.v = "" + this.funcSet;
							this.b = "" + this.funcSet;
							this.n = "" + this.funcSet;
							this.m = "" + this.funcSet;
							this.comma = "" + this.funcSet;
							this.dot = "" + this.funcSet;
							this.qmark = "" + this.funcSet;
							this.rshift = "" + this.funcSet;
							this.up = "" + this.funcSet;
							this.num1 = "" + this.funcSet;
							this.num2 = "" + this.funcSet;
							this.num3 = "" + this.funcSet;
							this.numenter = "" + this.funcSet;
						}, 1000);
					}
					this.lshift = "boom3_1" + this.funcSet;
					this.z = "boom2_1" + this.funcSet;
					this.x = "boom1_1" + this.funcSet;
					this.c = "boom2_1" + this.funcSet;
					this.v = "boom3_1" + this.funcSet;
					this.b = "boom4_1" + this.funcSet;
					this.n = "boom5_1" + this.funcSet;
					this.m = "boom6_1" + this.funcSet;
					this.comma = "boom7_1" + this.funcSet;
					this.dot = "boom8_1" + this.funcSet;
					this.qmark = "boom9_1" + this.funcSet;
					this.rshift = "boom10_1" + this.funcSet;
					this.up = "boom11_1" + this.funcSet;
					this.num1 = "boom12_1" + this.funcSet;
					this.num2 = "boom13_1" + this.funcSet;
					this.num3 = "boom14_1" + this.funcSet;
					this.numenter = "boom15_1" + this.funcSet;

					this.num = 1;
				}
				else if (this.num == 1) {
					this.num = 0;
					// this.clear();
					if (this.keyFlag2 == 0) {
						this.keyFlag2 = 1;
						setTimeout(() => {
							this.keyFlag2 = 0;
							this.lshift = "" + this.funcSet;
							this.z = "" + this.funcSet;
							this.x = "" + this.funcSet;
							this.c = "" + this.funcSet;
							this.v = "" + this.funcSet;
							this.b = "" + this.funcSet;
							this.n = "" + this.funcSet;
							this.m = "" + this.funcSet;
							this.comma = "" + this.funcSet;
							this.dot = "" + this.funcSet;
							this.qmark = "" + this.funcSet;
							this.rshift = "" + this.funcSet;
							this.up = "" + this.funcSet;
							this.num1 = "" + this.funcSet;
							this.num2 = "" + this.funcSet;
							this.num3 = "" + this.funcSet;
							this.numenter = "" + this.funcSet;
						}, 1000);
					}
					this.lshift = "boom3_2" + this.funcSet;
					this.z = "boom2_2" + this.funcSet;
					this.x = "boom1_2" + this.funcSet;
					this.c = "boom2_2" + this.funcSet;
					this.v = "boom3_2" + this.funcSet;
					this.b = "boom4_2" + this.funcSet;
					this.n = "boom5_2" + this.funcSet;
					this.m = "boom6_2" + this.funcSet;
					this.comma = "boom7_2" + this.funcSet;
					this.dot = "boom8_2" + this.funcSet;
					this.qmark = "boom9_2" + this.funcSet;
					this.rshift = "boom10_2" + this.funcSet;
					this.up = "boom11_2" + this.funcSet;
					this.num1 = "boom12_2" + this.funcSet;
					this.num2 = "boom13_2" + this.funcSet;
					this.num3 = "boom14_2" + this.funcSet;
					this.numenter = "boom15_2" + this.funcSet;

				}
				break;

			case this.vKey == 67 && this.keyStatus == 1: //c
				if (this.num == 0) {
					// this.clear();
					if (this.keyFlag1 == 0) {
						this.keyFlag1 = 1;
						setTimeout(() => {
							this.keyFlag1 = 0;
							this.lshift = "" + this.funcSet;
							this.z = "" + this.funcSet;
							this.x = "" + this.funcSet;
							this.c = "" + this.funcSet;
							this.v = "" + this.funcSet;
							this.b = "" + this.funcSet;
							this.n = "" + this.funcSet;
							this.m = "" + this.funcSet;
							this.comma = "" + this.funcSet;
							this.dot = "" + this.funcSet;
							this.qmark = "" + this.funcSet;
							this.rshift = "" + this.funcSet;
							this.up = "" + this.funcSet;
							this.num1 = "" + this.funcSet;
							this.num2 = "" + this.funcSet;
							this.num3 = "" + this.funcSet;
							this.numenter = "" + this.funcSet;
						}, 1000);
					}
					this.lshift = "boom4_1" + this.funcSet;
					this.z = "boom3_1" + this.funcSet;
					this.x = "boom2_1" + this.funcSet;
					this.c = "boom1_1" + this.funcSet;
					this.v = "boom2_1" + this.funcSet;
					this.b = "boom3_1" + this.funcSet;
					this.n = "boom4_1" + this.funcSet;
					this.m = "boom5_1" + this.funcSet;
					this.comma = "boom6_1" + this.funcSet;
					this.dot = "boom7_1" + this.funcSet;
					this.qmark = "boom8_1" + this.funcSet;
					this.rshift = "boom9_1" + this.funcSet;
					this.up = "boom10_1" + this.funcSet;
					this.num1 = "boom11_1" + this.funcSet;
					this.num2 = "boom12_1" + this.funcSet;
					this.num3 = "boom13_1" + this.funcSet;
					this.numenter = "boom14_1" + this.funcSet;

					this.num = 1;
				}
				else if (this.num == 1) {
					this.num = 0;
					// this.clear();
					if (this.keyFlag2 == 0) {
						this.keyFlag2 = 1;
						setTimeout(() => {
							this.keyFlag2 = 0;
							this.lshift = "" + this.funcSet;
							this.z = "" + this.funcSet;
							this.x = "" + this.funcSet;
							this.c = "" + this.funcSet;
							this.v = "" + this.funcSet;
							this.b = "" + this.funcSet;
							this.n = "" + this.funcSet;
							this.m = "" + this.funcSet;
							this.comma = "" + this.funcSet;
							this.dot = "" + this.funcSet;
							this.qmark = "" + this.funcSet;
							this.rshift = "" + this.funcSet;
							this.up = "" + this.funcSet;
							this.num1 = "" + this.funcSet;
							this.num2 = "" + this.funcSet;
							this.num3 = "" + this.funcSet;
							this.numenter = "" + this.funcSet;
						}, 1000);
					}
					this.lshift = "boom4_2" + this.funcSet;
					this.z = "boom3_2" + this.funcSet;
					this.x = "boom2_2" + this.funcSet;
					this.c = "boom1_2" + this.funcSet;
					this.v = "boom2_2" + this.funcSet;
					this.b = "boom3_2" + this.funcSet;
					this.n = "boom4_2" + this.funcSet;
					this.m = "boom5_2" + this.funcSet;
					this.comma = "boom6_2" + this.funcSet;
					this.dot = "boom7_2" + this.funcSet;
					this.qmark = "boom8_2" + this.funcSet;
					this.rshift = "boom9_2" + this.funcSet;
					this.up = "boom10_2" + this.funcSet;
					this.num1 = "boom11_2" + this.funcSet;
					this.num2 = "boom12_2" + this.funcSet;
					this.num3 = "boom13_2" + this.funcSet;
					this.numenter = "boom14_2" + this.funcSet;

				}
				break;

			case this.vKey == 86 && this.keyStatus == 1: //v
				if (this.num == 0) {
					// this.clear();
					if (this.keyFlag1 == 0) {
						this.keyFlag1 = 1;
						setTimeout(() => {
							this.keyFlag1 = 0;
							this.lshift = "" + this.funcSet;
							this.z = "" + this.funcSet;
							this.x = "" + this.funcSet;
							this.c = "" + this.funcSet;
							this.v = "" + this.funcSet;
							this.b = "" + this.funcSet;
							this.n = "" + this.funcSet;
							this.m = "" + this.funcSet;
							this.comma = "" + this.funcSet;
							this.dot = "" + this.funcSet;
							this.qmark = "" + this.funcSet;
							this.rshift = "" + this.funcSet;
							this.up = "" + this.funcSet;
							this.num1 = "" + this.funcSet;
							this.num2 = "" + this.funcSet;
							this.num3 = "" + this.funcSet;
							this.numenter = "" + this.funcSet;
						}, 1000);
					}
					this.lshift = "boom5_1" + this.funcSet;
					this.z = "boom4_1" + this.funcSet;
					this.x = "boom3_1" + this.funcSet;
					this.c = "boom2_1" + this.funcSet;
					this.v = "boom1_1" + this.funcSet;
					this.b = "boom2_1" + this.funcSet;
					this.n = "boom3_1" + this.funcSet;
					this.m = "boom4_1" + this.funcSet;
					this.comma = "boom5_1" + this.funcSet;
					this.dot = "boom6_1" + this.funcSet;
					this.qmark = "boom7_1" + this.funcSet;
					this.rshift = "boom8_1" + this.funcSet;
					this.up = "boom9_1" + this.funcSet;
					this.num1 = "boom10_1" + this.funcSet;
					this.num2 = "boom11_1" + this.funcSet;
					this.num3 = "boom12_1" + this.funcSet;
					this.numenter = "boom13_1" + this.funcSet;

					this.num = 1;
				}
				else if (this.num == 1) {
					this.num = 0;
					// this.clear();
					if (this.keyFlag2 == 0) {
						this.keyFlag2 = 1;
						setTimeout(() => {
							this.keyFlag2 = 0;
							this.lshift = "" + this.funcSet;
							this.z = "" + this.funcSet;
							this.x = "" + this.funcSet;
							this.c = "" + this.funcSet;
							this.v = "" + this.funcSet;
							this.b = "" + this.funcSet;
							this.n = "" + this.funcSet;
							this.m = "" + this.funcSet;
							this.comma = "" + this.funcSet;
							this.dot = "" + this.funcSet;
							this.qmark = "" + this.funcSet;
							this.rshift = "" + this.funcSet;
							this.up = "" + this.funcSet;
							this.num1 = "" + this.funcSet;
							this.num2 = "" + this.funcSet;
							this.num3 = "" + this.funcSet;
							this.numenter = "" + this.funcSet;
						}, 1000);
					}
					this.lshift = "boom5_2" + this.funcSet;
					this.z = "boom4_2" + this.funcSet;
					this.x = "boom3_2" + this.funcSet;
					this.c = "boom2_2" + this.funcSet;
					this.v = "boom1_2" + this.funcSet;
					this.b = "boom2_2" + this.funcSet;
					this.n = "boom3_2" + this.funcSet;
					this.m = "boom4_2" + this.funcSet;
					this.comma = "boom5_2" + this.funcSet;
					this.dot = "boom6_2" + this.funcSet;
					this.qmark = "boom7_2" + this.funcSet;
					this.rshift = "boom8_2" + this.funcSet;
					this.up = "boom9_2" + this.funcSet;
					this.num1 = "boom10_2" + this.funcSet;
					this.num2 = "boom11_2" + this.funcSet;
					this.num3 = "boom12_2" + this.funcSet;
					this.numenter = "boom13_2" + this.funcSet;

				}
				break;

			case this.vKey == 66 && this.keyStatus == 1: //b
				if (this.num == 0) {
					// this.clear();
					if (this.keyFlag1 == 0) {
						this.keyFlag1 = 1;
						setTimeout(() => {
							this.keyFlag1 = 0;
							this.lshift = "" + this.funcSet;
							this.z = "" + this.funcSet;
							this.x = "" + this.funcSet;
							this.c = "" + this.funcSet;
							this.v = "" + this.funcSet;
							this.b = "" + this.funcSet;
							this.n = "" + this.funcSet;
							this.m = "" + this.funcSet;
							this.comma = "" + this.funcSet;
							this.dot = "" + this.funcSet;
							this.qmark = "" + this.funcSet;
							this.rshift = "" + this.funcSet;
							this.up = "" + this.funcSet;
							this.num1 = "" + this.funcSet;
							this.num2 = "" + this.funcSet;
							this.num3 = "" + this.funcSet;
							this.numenter = "" + this.funcSet;
						}, 1000);
					}
					this.lshift = "boom6_1" + this.funcSet;
					this.z = "boom5_1" + this.funcSet;
					this.x = "boom4_1" + this.funcSet;
					this.c = "boom3_1" + this.funcSet;
					this.v = "boom2_1" + this.funcSet;
					this.b = "boom1_1" + this.funcSet;
					this.n = "boom2_1" + this.funcSet;
					this.m = "boom3_1" + this.funcSet;
					this.comma = "boom4_1" + this.funcSet;
					this.dot = "boom5_1" + this.funcSet;
					this.qmark = "boom6_1" + this.funcSet;
					this.rshift = "boom7_1" + this.funcSet;
					this.up = "boom8_1" + this.funcSet;
					this.num1 = "boom9_1" + this.funcSet;
					this.num2 = "boom10_1" + this.funcSet;
					this.num3 = "boom11_1" + this.funcSet;
					this.numenter = "boom12_1" + this.funcSet;

					this.num = 1;
				}
				else if (this.num == 1) {
					this.num = 0;
					// this.clear();
					if (this.keyFlag2 == 0) {
						this.keyFlag2 = 1;
						setTimeout(() => {
							this.keyFlag2 = 0;
							this.lshift = "" + this.funcSet;
							this.z = "" + this.funcSet;
							this.x = "" + this.funcSet;
							this.c = "" + this.funcSet;
							this.v = "" + this.funcSet;
							this.b = "" + this.funcSet;
							this.n = "" + this.funcSet;
							this.m = "" + this.funcSet;
							this.comma = "" + this.funcSet;
							this.dot = "" + this.funcSet;
							this.qmark = "" + this.funcSet;
							this.rshift = "" + this.funcSet;
							this.up = "" + this.funcSet;
							this.num1 = "" + this.funcSet;
							this.num2 = "" + this.funcSet;
							this.num3 = "" + this.funcSet;
							this.numenter = "" + this.funcSet;
						}, 1000);
					}
					this.lshift = "boom6_2" + this.funcSet;
					this.z = "boom5_2" + this.funcSet;
					this.x = "boom4_2" + this.funcSet;
					this.c = "boom3_2" + this.funcSet;
					this.v = "boom2_2" + this.funcSet;
					this.b = "boom1_2" + this.funcSet;
					this.n = "boom2_2" + this.funcSet;
					this.m = "boom3_2" + this.funcSet;
					this.comma = "boom4_2" + this.funcSet;
					this.dot = "boom5_2" + this.funcSet;
					this.qmark = "boom6_2" + this.funcSet;
					this.rshift = "boom7_2" + this.funcSet;
					this.up = "boom8_2" + this.funcSet;
					this.num1 = "boom9_2" + this.funcSet;
					this.num2 = "boom10_2" + this.funcSet;
					this.num3 = "boom11_2" + this.funcSet;
					this.numenter = "boom12_2" + this.funcSet;

				}
				break;

			case this.vKey == 78 && this.keyStatus == 1: //n
				if (this.num == 0) {
					// this.clear();
					if (this.keyFlag1 == 0) {
						this.keyFlag1 = 1;
						setTimeout(() => {
							this.keyFlag1 = 0;
							this.lshift = "" + this.funcSet;
							this.z = "" + this.funcSet;
							this.x = "" + this.funcSet;
							this.c = "" + this.funcSet;
							this.v = "" + this.funcSet;
							this.b = "" + this.funcSet;
							this.n = "" + this.funcSet;
							this.m = "" + this.funcSet;
							this.comma = "" + this.funcSet;
							this.dot = "" + this.funcSet;
							this.qmark = "" + this.funcSet;
							this.rshift = "" + this.funcSet;
							this.up = "" + this.funcSet;
							this.num1 = "" + this.funcSet;
							this.num2 = "" + this.funcSet;
							this.num3 = "" + this.funcSet;
							this.numenter = "" + this.funcSet;
						}, 1000);
					}
					this.lshift = "boom7_1" + this.funcSet;
					this.z = "boom6_1" + this.funcSet;
					this.x = "boom5_1" + this.funcSet;
					this.c = "boom4_1" + this.funcSet;
					this.v = "boom3_1" + this.funcSet;
					this.b = "boom2_1" + this.funcSet;
					this.n = "boom1_1" + this.funcSet;
					this.m = "boom2_1" + this.funcSet;
					this.comma = "boom3_1" + this.funcSet;
					this.dot = "boom4_1" + this.funcSet;
					this.qmark = "boom5_1" + this.funcSet;
					this.rshift = "boom6_1" + this.funcSet;
					this.up = "boom7_1" + this.funcSet;
					this.num1 = "boom8_1" + this.funcSet;
					this.num2 = "boom9_1" + this.funcSet;
					this.num3 = "boom10_1" + this.funcSet;
					this.numenter = "boom11_1" + this.funcSet;

					this.num = 1;
				}
				else if (this.num == 1) {
					this.num = 0;
					// this.clear();
					if (this.keyFlag2 == 0) {
						this.keyFlag2 = 1;
						setTimeout(() => {
							this.keyFlag2 = 0;
							this.lshift = "" + this.funcSet;
							this.z = "" + this.funcSet;
							this.x = "" + this.funcSet;
							this.c = "" + this.funcSet;
							this.v = "" + this.funcSet;
							this.b = "" + this.funcSet;
							this.n = "" + this.funcSet;
							this.m = "" + this.funcSet;
							this.comma = "" + this.funcSet;
							this.dot = "" + this.funcSet;
							this.qmark = "" + this.funcSet;
							this.rshift = "" + this.funcSet;
							this.up = "" + this.funcSet;
							this.num1 = "" + this.funcSet;
							this.num2 = "" + this.funcSet;
							this.num3 = "" + this.funcSet;
							this.numenter = "" + this.funcSet;
						}, 1000);
					}
					this.lshift = "boom7_2" + this.funcSet;
					this.z = "boom6_2" + this.funcSet;
					this.x = "boom5_2" + this.funcSet;
					this.c = "boom4_2" + this.funcSet;
					this.v = "boom3_2" + this.funcSet;
					this.b = "boom2_2" + this.funcSet;
					this.n = "boom1_2" + this.funcSet;
					this.m = "boom2_2" + this.funcSet;
					this.comma = "boom3_2" + this.funcSet;
					this.dot = "boom4_2" + this.funcSet;
					this.qmark = "boom5_2" + this.funcSet;
					this.rshift = "boom6_2" + this.funcSet;
					this.up = "boom7_2" + this.funcSet;
					this.num1 = "boom8_2" + this.funcSet;
					this.num2 = "boom9_2" + this.funcSet;
					this.num3 = "boom10_2" + this.funcSet;
					this.numenter = "boom11_2" + this.funcSet;

				}
				break;

			case this.vKey == 77 && this.keyStatus == 1: //m
				if (this.num == 0) {
					// this.clear();
					if (this.keyFlag1 == 0) {
						this.keyFlag1 = 1;
						setTimeout(() => {
							this.keyFlag1 = 0;
							this.lshift = "" + this.funcSet;
							this.z = "" + this.funcSet;
							this.x = "" + this.funcSet;
							this.c = "" + this.funcSet;
							this.v = "" + this.funcSet;
							this.b = "" + this.funcSet;
							this.n = "" + this.funcSet;
							this.m = "" + this.funcSet;
							this.comma = "" + this.funcSet;
							this.dot = "" + this.funcSet;
							this.qmark = "" + this.funcSet;
							this.rshift = "" + this.funcSet;
							this.up = "" + this.funcSet;
							this.num1 = "" + this.funcSet;
							this.num2 = "" + this.funcSet;
							this.num3 = "" + this.funcSet;
							this.numenter = "" + this.funcSet;
						}, 1000);
					}
					this.lshift = "boom8_1" + this.funcSet;
					this.z = "boom7_1" + this.funcSet;
					this.x = "boom6_1" + this.funcSet;
					this.c = "boom5_1" + this.funcSet;
					this.v = "boom4_1" + this.funcSet;
					this.b = "boom3_1" + this.funcSet;
					this.n = "boom2_1" + this.funcSet;
					this.m = "boom1_1" + this.funcSet;
					this.comma = "boom2_1" + this.funcSet;
					this.dot = "boom3_1" + this.funcSet;
					this.qmark = "boom4_1" + this.funcSet;
					this.rshift = "boom5_1" + this.funcSet;
					this.up = "boom6_1" + this.funcSet;
					this.num1 = "boom7_1" + this.funcSet;
					this.num2 = "boom8_1" + this.funcSet;
					this.num3 = "boom9_1" + this.funcSet;
					this.numenter = "boom10_1" + this.funcSet;

					this.num = 1;
				}
				else if (this.num == 1) {
					this.num = 0;
					// this.clear();
					if (this.keyFlag2 == 0) {
						this.keyFlag2 = 1;
						setTimeout(() => {
							this.keyFlag2 = 0;
							this.lshift = "" + this.funcSet;
							this.z = "" + this.funcSet;
							this.x = "" + this.funcSet;
							this.c = "" + this.funcSet;
							this.v = "" + this.funcSet;
							this.b = "" + this.funcSet;
							this.n = "" + this.funcSet;
							this.m = "" + this.funcSet;
							this.comma = "" + this.funcSet;
							this.dot = "" + this.funcSet;
							this.qmark = "" + this.funcSet;
							this.rshift = "" + this.funcSet;
							this.up = "" + this.funcSet;
							this.num1 = "" + this.funcSet;
							this.num2 = "" + this.funcSet;
							this.num3 = "" + this.funcSet;
							this.numenter = "" + this.funcSet;
						}, 1000);
					}
					this.lshift = "boom8_2" + this.funcSet;
					this.z = "boom7_2" + this.funcSet;
					this.x = "boom6_2" + this.funcSet;
					this.c = "boom5_2" + this.funcSet;
					this.v = "boom4_2" + this.funcSet;
					this.b = "boom3_2" + this.funcSet;
					this.n = "boom2_2" + this.funcSet;
					this.m = "boom1_2" + this.funcSet;
					this.comma = "boom2_2" + this.funcSet;
					this.dot = "boom3_2" + this.funcSet;
					this.qmark = "boom4_2" + this.funcSet;
					this.rshift = "boom5_2" + this.funcSet;
					this.up = "boom6_2" + this.funcSet;
					this.num1 = "boom7_2" + this.funcSet;
					this.num2 = "boom8_2" + this.funcSet;
					this.num3 = "boom9_2" + this.funcSet;
					this.numenter = "boom10_2" + this.funcSet;

				}
				break;

			case this.vKey == 188 && this.keyStatus == 1: //comma
				if (this.num == 0) {
					// this.clear();
					if (this.keyFlag1 == 0) {
						this.keyFlag1 = 1;
						setTimeout(() => {
							this.keyFlag1 = 0;
							this.lshift = "" + this.funcSet;
							this.z = "" + this.funcSet;
							this.x = "" + this.funcSet;
							this.c = "" + this.funcSet;
							this.v = "" + this.funcSet;
							this.b = "" + this.funcSet;
							this.n = "" + this.funcSet;
							this.m = "" + this.funcSet;
							this.comma = "" + this.funcSet;
							this.dot = "" + this.funcSet;
							this.qmark = "" + this.funcSet;
							this.rshift = "" + this.funcSet;
							this.up = "" + this.funcSet;
							this.num1 = "" + this.funcSet;
							this.num2 = "" + this.funcSet;
							this.num3 = "" + this.funcSet;
							this.numenter = "" + this.funcSet;
						}, 1000);
					}
					this.lshift = "boom9_1" + this.funcSet;
					this.z = "boom8_1" + this.funcSet;
					this.x = "boom7_1" + this.funcSet;
					this.c = "boom6_1" + this.funcSet;
					this.v = "boom5_1" + this.funcSet;
					this.b = "boom4_1" + this.funcSet;
					this.n = "boom3_1" + this.funcSet;
					this.m = "boom2_1" + this.funcSet;
					this.comma = "boom1_1" + this.funcSet;
					this.dot = "boom2_1" + this.funcSet;
					this.qmark = "boom3_1" + this.funcSet;
					this.rshift = "boom4_1" + this.funcSet;
					this.up = "boom5_1" + this.funcSet;
					this.num1 = "boom6_1" + this.funcSet;
					this.num2 = "boom7_1" + this.funcSet;
					this.num3 = "boom8_1" + this.funcSet;
					this.numenter = "boom9_1" + this.funcSet;

					this.num = 1;
				}
				else if (this.num == 1) {
					this.num = 0;
					// this.clear();
					if (this.keyFlag2 == 0) {
						this.keyFlag2 = 1;
						setTimeout(() => {
							this.keyFlag2 = 0;
							this.lshift = "" + this.funcSet;
							this.z = "" + this.funcSet;
							this.x = "" + this.funcSet;
							this.c = "" + this.funcSet;
							this.v = "" + this.funcSet;
							this.b = "" + this.funcSet;
							this.n = "" + this.funcSet;
							this.m = "" + this.funcSet;
							this.comma = "" + this.funcSet;
							this.dot = "" + this.funcSet;
							this.qmark = "" + this.funcSet;
							this.rshift = "" + this.funcSet;
							this.up = "" + this.funcSet;
							this.num1 = "" + this.funcSet;
							this.num2 = "" + this.funcSet;
							this.num3 = "" + this.funcSet;
							this.numenter = "" + this.funcSet;
						}, 1000);
					}
					this.lshift = "boom9_2" + this.funcSet;
					this.z = "boom8_2" + this.funcSet;
					this.x = "boom7_2" + this.funcSet;
					this.c = "boom6_2" + this.funcSet;
					this.v = "boom5_2" + this.funcSet;
					this.b = "boom4_2" + this.funcSet;
					this.n = "boom3_2" + this.funcSet;
					this.m = "boom2_2" + this.funcSet;
					this.comma = "boom1_2" + this.funcSet;
					this.dot = "boom2_2" + this.funcSet;
					this.qmark = "boom3_2" + this.funcSet;
					this.rshift = "boom4_2" + this.funcSet;
					this.up = "boom5_2" + this.funcSet;
					this.num1 = "boom6_2" + this.funcSet;
					this.num2 = "boom7_2" + this.funcSet;
					this.num3 = "boom8_2" + this.funcSet;
					this.numenter = "boom9_2" + this.funcSet;

				}
				break;

			case this.vKey == 190 && this.keyStatus == 1: //dot
				if (this.num == 0) {
					// this.clear();
					if (this.keyFlag1 == 0) {
						this.keyFlag1 = 1;
						setTimeout(() => {
							this.keyFlag1 = 0;
							this.lshift = "" + this.funcSet;
							this.z = "" + this.funcSet;
							this.x = "" + this.funcSet;
							this.c = "" + this.funcSet;
							this.v = "" + this.funcSet;
							this.b = "" + this.funcSet;
							this.n = "" + this.funcSet;
							this.m = "" + this.funcSet;
							this.comma = "" + this.funcSet;
							this.dot = "" + this.funcSet;
							this.qmark = "" + this.funcSet;
							this.rshift = "" + this.funcSet;
							this.up = "" + this.funcSet;
							this.num1 = "" + this.funcSet;
							this.num2 = "" + this.funcSet;
							this.num3 = "" + this.funcSet;
							this.numenter = "" + this.funcSet;
						}, 1000);
					}
					this.lshift = "boom10_1" + this.funcSet;
					this.z = "boom9_1" + this.funcSet;
					this.x = "boom8_1" + this.funcSet;
					this.c = "boom7_1" + this.funcSet;
					this.v = "boom6_1" + this.funcSet;
					this.b = "boom5_1" + this.funcSet;
					this.n = "boom4_1" + this.funcSet;
					this.m = "boom3_1" + this.funcSet;
					this.comma = "boom2_1" + this.funcSet;
					this.dot = "boom1_1" + this.funcSet;
					this.qmark = "boom2_1" + this.funcSet;
					this.rshift = "boom3_1" + this.funcSet;
					this.up = "boom4_1" + this.funcSet;
					this.num1 = "boom5_1" + this.funcSet;
					this.num2 = "boom6_1" + this.funcSet;
					this.num3 = "boom7_1" + this.funcSet;
					this.numenter = "boom8_1" + this.funcSet;

					this.num = 1;
				}
				else if (this.num == 1) {
					this.num = 0;
					// this.clear();
					if (this.keyFlag2 == 0) {
						this.keyFlag2 = 1;
						setTimeout(() => {
							this.keyFlag2 = 0;
							this.lshift = "" + this.funcSet;
							this.z = "" + this.funcSet;
							this.x = "" + this.funcSet;
							this.c = "" + this.funcSet;
							this.v = "" + this.funcSet;
							this.b = "" + this.funcSet;
							this.n = "" + this.funcSet;
							this.m = "" + this.funcSet;
							this.comma = "" + this.funcSet;
							this.dot = "" + this.funcSet;
							this.qmark = "" + this.funcSet;
							this.rshift = "" + this.funcSet;
							this.up = "" + this.funcSet;
							this.num1 = "" + this.funcSet;
							this.num2 = "" + this.funcSet;
							this.num3 = "" + this.funcSet;
							this.numenter = "" + this.funcSet;
						}, 1000);
					}
					this.lshift = "boom10_2" + this.funcSet;
					this.z = "boom9_2" + this.funcSet;
					this.x = "boom8_2" + this.funcSet;
					this.c = "boom7_2" + this.funcSet;
					this.v = "boom6_2" + this.funcSet;
					this.b = "boom5_2" + this.funcSet;
					this.n = "boom4_2" + this.funcSet;
					this.m = "boom3_2" + this.funcSet;
					this.comma = "boom2_2" + this.funcSet;
					this.dot = "boom1_2" + this.funcSet;
					this.qmark = "boom2_2" + this.funcSet;
					this.rshift = "boom3_2" + this.funcSet;
					this.up = "boom4_2" + this.funcSet;
					this.num1 = "boom5_2" + this.funcSet;
					this.num2 = "boom6_2" + this.funcSet;
					this.num3 = "boom7_2" + this.funcSet;
					this.numenter = "boom8_2" + this.funcSet;

				}
				break;

			case this.vKey == 191 && this.keyStatus == 1: //qmark
				if (this.num == 0) {
					// this.clear();
					if (this.keyFlag1 == 0) {
						this.keyFlag1 = 1;
						setTimeout(() => {
							this.keyFlag1 = 0;
							this.lshift = "" + this.funcSet;
							this.z = "" + this.funcSet;
							this.x = "" + this.funcSet;
							this.c = "" + this.funcSet;
							this.v = "" + this.funcSet;
							this.b = "" + this.funcSet;
							this.n = "" + this.funcSet;
							this.m = "" + this.funcSet;
							this.comma = "" + this.funcSet;
							this.dot = "" + this.funcSet;
							this.qmark = "" + this.funcSet;
							this.rshift = "" + this.funcSet;
							this.up = "" + this.funcSet;
							this.num1 = "" + this.funcSet;
							this.num2 = "" + this.funcSet;
							this.num3 = "" + this.funcSet;
							this.numenter = "" + this.funcSet;
						}, 1000);
					}
					this.lshift = "boom11_1" + this.funcSet;
					this.z = "boom10_1" + this.funcSet;
					this.x = "boom9_1" + this.funcSet;
					this.c = "boom8_1" + this.funcSet;
					this.v = "boom7_1" + this.funcSet;
					this.b = "boom6_1" + this.funcSet;
					this.n = "boom5_1" + this.funcSet;
					this.m = "boom4_1" + this.funcSet;
					this.comma = "boom3_1" + this.funcSet;
					this.dot = "boom2_1" + this.funcSet;
					this.qmark = "boom1_1" + this.funcSet;
					this.rshift = "boom2_1" + this.funcSet;
					this.up = "boom3_1" + this.funcSet;
					this.num1 = "boom4_1" + this.funcSet;
					this.num2 = "boom5_1" + this.funcSet;
					this.num3 = "boom6_1" + this.funcSet;
					this.numenter = "boom7_1" + this.funcSet;

					this.num = 1;
				}
				else if (this.num == 1) {
					this.num = 0;
					// this.clear();
					if (this.keyFlag2 == 0) {
						this.keyFlag2 = 1;
						setTimeout(() => {
							this.keyFlag2 = 0;
							this.lshift = "" + this.funcSet;
							this.z = "" + this.funcSet;
							this.x = "" + this.funcSet;
							this.c = "" + this.funcSet;
							this.v = "" + this.funcSet;
							this.b = "" + this.funcSet;
							this.n = "" + this.funcSet;
							this.m = "" + this.funcSet;
							this.comma = "" + this.funcSet;
							this.dot = "" + this.funcSet;
							this.qmark = "" + this.funcSet;
							this.rshift = "" + this.funcSet;
							this.up = "" + this.funcSet;
							this.num1 = "" + this.funcSet;
							this.num2 = "" + this.funcSet;
							this.num3 = "" + this.funcSet;
							this.numenter = "" + this.funcSet;
						}, 1000);
					}
					this.lshift = "boom11_2" + this.funcSet;
					this.z = "boom10_2" + this.funcSet;
					this.x = "boom9_2" + this.funcSet;
					this.c = "boom8_2" + this.funcSet;
					this.v = "boom7_2" + this.funcSet;
					this.b = "boom6_2" + this.funcSet;
					this.n = "boom5_2" + this.funcSet;
					this.m = "boom4_2" + this.funcSet;
					this.comma = "boom3_2" + this.funcSet;
					this.dot = "boom2_2" + this.funcSet;
					this.qmark = "boom1_2" + this.funcSet;
					this.rshift = "boom2_2" + this.funcSet;
					this.up = "boom3_2" + this.funcSet;
					this.num1 = "boom4_2" + this.funcSet;
					this.num2 = "boom5_2" + this.funcSet;
					this.num3 = "boom6_2" + this.funcSet;
					this.numenter = "boom7_2" + this.funcSet;

				}
				break;

			case this.vKey == 'r16' && this.keyStatus == 1: //rshift
				if (this.num == 0) {
					// this.clear();
					if (this.keyFlag1 == 0) {
						this.keyFlag1 = 1;
						setTimeout(() => {
							this.keyFlag1 = 0;
							this.lshift = "" + this.funcSet;
							this.z = "" + this.funcSet;
							this.x = "" + this.funcSet;
							this.c = "" + this.funcSet;
							this.v = "" + this.funcSet;
							this.b = "" + this.funcSet;
							this.n = "" + this.funcSet;
							this.m = "" + this.funcSet;
							this.comma = "" + this.funcSet;
							this.dot = "" + this.funcSet;
							this.qmark = "" + this.funcSet;
							this.rshift = "" + this.funcSet;
							this.up = "" + this.funcSet;
							this.num1 = "" + this.funcSet;
							this.num2 = "" + this.funcSet;
							this.num3 = "" + this.funcSet;
							this.numenter = "" + this.funcSet;
						}, 1000);
					}
					this.lshift = "boom12_1" + this.funcSet;
					this.z = "boom11_1" + this.funcSet;
					this.x = "boom10_1" + this.funcSet;
					this.c = "boom9_1" + this.funcSet;
					this.v = "boom8_1" + this.funcSet;
					this.b = "boom7_1" + this.funcSet;
					this.n = "boom6_1" + this.funcSet;
					this.m = "boom5_1" + this.funcSet;
					this.comma = "boom4_1" + this.funcSet;
					this.dot = "boom3_1" + this.funcSet;
					this.qmark = "boom2_1" + this.funcSet;
					this.rshift = "boom1_1" + this.funcSet;
					this.up = "boom2_1" + this.funcSet;
					this.num1 = "boom3_1" + this.funcSet;
					this.num2 = "boom4_1" + this.funcSet;
					this.num3 = "boom5_1" + this.funcSet;
					this.numenter = "boom6_1" + this.funcSet;

					this.num = 1;
				}
				else if (this.num == 1) {
					this.num = 0;
					// this.clear();
					if (this.keyFlag2 == 0) {
						this.keyFlag2 = 1;
						setTimeout(() => {
							this.keyFlag2 = 0;
							this.lshift = "" + this.funcSet;
							this.z = "" + this.funcSet;
							this.x = "" + this.funcSet;
							this.c = "" + this.funcSet;
							this.v = "" + this.funcSet;
							this.b = "" + this.funcSet;
							this.n = "" + this.funcSet;
							this.m = "" + this.funcSet;
							this.comma = "" + this.funcSet;
							this.dot = "" + this.funcSet;
							this.qmark = "" + this.funcSet;
							this.rshift = "" + this.funcSet;
							this.up = "" + this.funcSet;
							this.num1 = "" + this.funcSet;
							this.num2 = "" + this.funcSet;
							this.num3 = "" + this.funcSet;
							this.numenter = "" + this.funcSet;
						}, 1000);
					}
					this.lshift = "boom12_2" + this.funcSet;
					this.z = "boom11_2" + this.funcSet;
					this.x = "boom10_2" + this.funcSet;
					this.c = "boom9_2" + this.funcSet;
					this.v = "boom8_2" + this.funcSet;
					this.b = "boom7_2" + this.funcSet;
					this.n = "boom6_2" + this.funcSet;
					this.m = "boom5_2" + this.funcSet;
					this.comma = "boom4_2" + this.funcSet;
					this.dot = "boom3_2" + this.funcSet;
					this.qmark = "boom2_2" + this.funcSet;
					this.rshift = "boom1_2" + this.funcSet;
					this.up = "boom2_2" + this.funcSet;
					this.num1 = "boom3_2" + this.funcSet;
					this.num2 = "boom4_2" + this.funcSet;
					this.num3 = "boom5_2" + this.funcSet;
					this.numenter = "boom6_2" + this.funcSet;

				}
				break;

			case this.vKey == 38 && this.keyStatus == 1: //up
				if (this.num == 0) {
					// this.clear();
					if (this.keyFlag1 == 0) {
						this.keyFlag1 = 1;
						setTimeout(() => {
							this.keyFlag1 = 0;
							this.lshift = "" + this.funcSet;
							this.z = "" + this.funcSet;
							this.x = "" + this.funcSet;
							this.c = "" + this.funcSet;
							this.v = "" + this.funcSet;
							this.b = "" + this.funcSet;
							this.n = "" + this.funcSet;
							this.m = "" + this.funcSet;
							this.comma = "" + this.funcSet;
							this.dot = "" + this.funcSet;
							this.qmark = "" + this.funcSet;
							this.rshift = "" + this.funcSet;
							this.up = "" + this.funcSet;
							this.num1 = "" + this.funcSet;
							this.num2 = "" + this.funcSet;
							this.num3 = "" + this.funcSet;
							this.numenter = "" + this.funcSet;
						}, 1000);
					}
					this.lshift = "boom13_1" + this.funcSet;
					this.z = "boom12_1" + this.funcSet;
					this.x = "boom11_1" + this.funcSet;
					this.c = "boom10_1" + this.funcSet;
					this.v = "boom9_1" + this.funcSet;
					this.b = "boom8_1" + this.funcSet;
					this.n = "boom7_1" + this.funcSet;
					this.m = "boom6_1" + this.funcSet;
					this.comma = "boom5_1" + this.funcSet;
					this.dot = "boom4_1" + this.funcSet;
					this.qmark = "boom3_1" + this.funcSet;
					this.rshift = "boom2_1" + this.funcSet;
					this.up = "boom1_1" + this.funcSet;
					this.num1 = "boom2_1" + this.funcSet;
					this.num2 = "boom3_1" + this.funcSet;
					this.num3 = "boom4_1" + this.funcSet;
					this.numenter = "boom5_1" + this.funcSet;

					this.num = 1;
				}
				else if (this.num == 1) {
					this.num = 0;
					// this.clear();
					if (this.keyFlag2 == 0) {
						this.keyFlag2 = 1;
						setTimeout(() => {
							this.keyFlag2 = 0;
							this.lshift = "" + this.funcSet;
							this.z = "" + this.funcSet;
							this.x = "" + this.funcSet;
							this.c = "" + this.funcSet;
							this.v = "" + this.funcSet;
							this.b = "" + this.funcSet;
							this.n = "" + this.funcSet;
							this.m = "" + this.funcSet;
							this.comma = "" + this.funcSet;
							this.dot = "" + this.funcSet;
							this.qmark = "" + this.funcSet;
							this.rshift = "" + this.funcSet;
							this.up = "" + this.funcSet;
							this.num1 = "" + this.funcSet;
							this.num2 = "" + this.funcSet;
							this.num3 = "" + this.funcSet;
							this.numenter = "" + this.funcSet;
						}, 1000);
					}
					this.lshift = "boom13_2" + this.funcSet;
					this.z = "boom12_2" + this.funcSet;
					this.x = "boom11_2" + this.funcSet;
					this.c = "boom10_2" + this.funcSet;
					this.v = "boom9_2" + this.funcSet;
					this.b = "boom8_2" + this.funcSet;
					this.n = "boom7_2" + this.funcSet;
					this.m = "boom6_2" + this.funcSet;
					this.comma = "boom5_2" + this.funcSet;
					this.dot = "boom4_2" + this.funcSet;
					this.qmark = "boom3_2" + this.funcSet;
					this.rshift = "boom2_2" + this.funcSet;
					this.up = "boom1_2" + this.funcSet;
					this.num1 = "boom2_2" + this.funcSet;
					this.num2 = "boom3_2" + this.funcSet;
					this.num3 = "boom4_2" + this.funcSet;

					this.numenter = "boom5_2" + this.funcSet;
				} break;

			case this.vKey == 97 && this.keyStatus == 1: //num1
				if (this.num == 0) {
					// this.clear();
					if (this.keyFlag1 == 0) {
						this.keyFlag1 = 1;
						setTimeout(() => {
							this.keyFlag1 = 0;
							this.lshift = "" + this.funcSet;
							this.z = "" + this.funcSet;
							this.x = "" + this.funcSet;
							this.c = "" + this.funcSet;
							this.v = "" + this.funcSet;
							this.b = "" + this.funcSet;
							this.n = "" + this.funcSet;
							this.m = "" + this.funcSet;
							this.comma = "" + this.funcSet;
							this.dot = "" + this.funcSet;
							this.qmark = "" + this.funcSet;
							this.rshift = "" + this.funcSet;
							this.up = "" + this.funcSet;
							this.num1 = "" + this.funcSet;
							this.num2 = "" + this.funcSet;
							this.num3 = "" + this.funcSet;
							this.numenter = "" + this.funcSet;
						}, 1000);
					}
					this.lshift = "boom14_1" + this.funcSet;
					this.z = "boom13_1" + this.funcSet;
					this.x = "boom12_1" + this.funcSet;
					this.c = "boom11_1" + this.funcSet;
					this.v = "boom10_1" + this.funcSet;
					this.b = "boom9_1" + this.funcSet;
					this.n = "boom8_1" + this.funcSet;
					this.m = "boom7_1" + this.funcSet;
					this.comma = "boom6_1" + this.funcSet;
					this.dot = "boom5_1" + this.funcSet;
					this.qmark = "boom4_1" + this.funcSet;
					this.rshift = "boom3_1" + this.funcSet;
					this.up = "boom2_1" + this.funcSet;
					this.num1 = "boom1_1" + this.funcSet;
					this.num2 = "boom2_1" + this.funcSet;
					this.num3 = "boom3_1" + this.funcSet;
					this.numenter = "boom4_1" + this.funcSet;

					this.num = 1;
				}
				else if (this.num == 1) {
					this.num = 0;
					// this.clear();
					if (this.keyFlag2 == 0) {
						this.keyFlag2 = 1;
						setTimeout(() => {
							this.keyFlag2 = 0;
							this.lshift = "" + this.funcSet;
							this.z = "" + this.funcSet;
							this.x = "" + this.funcSet;
							this.c = "" + this.funcSet;
							this.v = "" + this.funcSet;
							this.b = "" + this.funcSet;
							this.n = "" + this.funcSet;
							this.m = "" + this.funcSet;
							this.comma = "" + this.funcSet;
							this.dot = "" + this.funcSet;
							this.qmark = "" + this.funcSet;
							this.rshift = "" + this.funcSet;
							this.up = "" + this.funcSet;
							this.num1 = "" + this.funcSet;
							this.num2 = "" + this.funcSet;
							this.num3 = "" + this.funcSet;
							this.numenter = "" + this.funcSet;
						}, 1000);
					}
					this.lshift = "boom14_2" + this.funcSet;
					this.z = "boom13_2" + this.funcSet;
					this.x = "boom12_2" + this.funcSet;
					this.c = "boom11_2" + this.funcSet;
					this.v = "boom10_2" + this.funcSet;
					this.b = "boom9_2" + this.funcSet;
					this.n = "boom8_2" + this.funcSet;
					this.m = "boom7_2" + this.funcSet;
					this.comma = "boom6_2" + this.funcSet;
					this.dot = "boom5_2" + this.funcSet;
					this.qmark = "boom4_2" + this.funcSet;
					this.rshift = "boom3_2" + this.funcSet;
					this.up = "boom2_2" + this.funcSet;
					this.num1 = "boom1_2" + this.funcSet;
					this.num2 = "boom2_2" + this.funcSet;
					this.num3 = "boom3_2" + this.funcSet;
					this.numenter = "boom4_2" + this.funcSet;

				}
				break;

			case this.vKey == 98 && this.keyStatus == 1: //num2
				if (this.num == 0) {
					// this.clear();
					if (this.keyFlag1 == 0) {
						this.keyFlag1 = 1;
						setTimeout(() => {
							this.keyFlag1 = 0;
							this.lshift = "" + this.funcSet;
							this.z = "" + this.funcSet;
							this.x = "" + this.funcSet;
							this.c = "" + this.funcSet;
							this.v = "" + this.funcSet;
							this.b = "" + this.funcSet;
							this.n = "" + this.funcSet;
							this.m = "" + this.funcSet;
							this.comma = "" + this.funcSet;
							this.dot = "" + this.funcSet;
							this.qmark = "" + this.funcSet;
							this.rshift = "" + this.funcSet;
							this.up = "" + this.funcSet;
							this.num1 = "" + this.funcSet;
							this.num2 = "" + this.funcSet;
							this.num3 = "" + this.funcSet;
							this.numenter = "" + this.funcSet;
						}, 1000);
					}
					this.lshift = "boom15_1" + this.funcSet;
					this.z = "boom14_1" + this.funcSet;
					this.x = "boom13_1" + this.funcSet;
					this.c = "boom12_1" + this.funcSet;
					this.v = "boom11_1" + this.funcSet;
					this.b = "boom10_1" + this.funcSet;
					this.n = "boom9_1" + this.funcSet;
					this.m = "boom8_1" + this.funcSet;
					this.comma = "boom7_1" + this.funcSet;
					this.dot = "boom6_1" + this.funcSet;
					this.qmark = "boom5_1" + this.funcSet;
					this.rshift = "boom4_1" + this.funcSet;
					this.up = "boom3_1" + this.funcSet;
					this.num1 = "boom2_1" + this.funcSet;
					this.num2 = "boom1_1" + this.funcSet;
					this.num3 = "boom2_1" + this.funcSet;
					this.numenter = "boom3_1" + this.funcSet;

					this.num = 1;
				}
				else if (this.num == 1) {
					this.num = 0;
					// this.clear();
					if (this.keyFlag2 == 0) {
						this.keyFlag2 = 1;
						setTimeout(() => {
							this.keyFlag2 = 0;
							this.lshift = "" + this.funcSet;
							this.z = "" + this.funcSet;
							this.x = "" + this.funcSet;
							this.c = "" + this.funcSet;
							this.v = "" + this.funcSet;
							this.b = "" + this.funcSet;
							this.n = "" + this.funcSet;
							this.m = "" + this.funcSet;
							this.comma = "" + this.funcSet;
							this.dot = "" + this.funcSet;
							this.qmark = "" + this.funcSet;
							this.rshift = "" + this.funcSet;
							this.up = "" + this.funcSet;
							this.num1 = "" + this.funcSet;
							this.num2 = "" + this.funcSet;
							this.num3 = "" + this.funcSet;
							this.numenter = "" + this.funcSet;
						}, 1000);
					}
					this.lshift = "boom15_2" + this.funcSet;
					this.z = "boom14_2" + this.funcSet;
					this.x = "boom13_2" + this.funcSet;
					this.c = "boom12_2" + this.funcSet;
					this.v = "boom11_2" + this.funcSet;
					this.b = "boom10_2" + this.funcSet;
					this.n = "boom9_2" + this.funcSet;
					this.m = "boom8_2" + this.funcSet;
					this.comma = "boom7_2" + this.funcSet;
					this.dot = "boom6_2" + this.funcSet;
					this.qmark = "boom5_2" + this.funcSet;
					this.rshift = "boom4_2" + this.funcSet;
					this.up = "boom3_2" + this.funcSet;
					this.num1 = "boom2_2" + this.funcSet;
					this.num2 = "boom1_2" + this.funcSet;
					this.num3 = "boom2_2" + this.funcSet;
					this.numenter = "boom3_2" + this.funcSet;

				}
				break;

			case this.vKey == 99 && this.keyStatus == 1: //num3
				if (this.num == 0) {
					// this.clear();
					if (this.keyFlag1 == 0) {
						this.keyFlag1 = 1;
						setTimeout(() => {
							this.keyFlag1 = 0;
							this.lshift = "" + this.funcSet;
							this.z = "" + this.funcSet;
							this.x = "" + this.funcSet;
							this.c = "" + this.funcSet;
							this.v = "" + this.funcSet;
							this.b = "" + this.funcSet;
							this.n = "" + this.funcSet;
							this.m = "" + this.funcSet;
							this.comma = "" + this.funcSet;
							this.dot = "" + this.funcSet;
							this.qmark = "" + this.funcSet;
							this.rshift = "" + this.funcSet;
							this.up = "" + this.funcSet;
							this.num1 = "" + this.funcSet;
							this.num2 = "" + this.funcSet;
							this.num3 = "" + this.funcSet;
							this.numenter = "" + this.funcSet;
						}, 1000);
					}
					this.lshift = "boom16_1" + this.funcSet;
					this.z = "boom15_1" + this.funcSet;
					this.x = "boom14_1" + this.funcSet;
					this.c = "boom13_1" + this.funcSet;
					this.v = "boom12_1" + this.funcSet;
					this.b = "boom11_1" + this.funcSet;
					this.n = "boom10_1" + this.funcSet;
					this.m = "boom9_1" + this.funcSet;
					this.comma = "boom8_1" + this.funcSet;
					this.dot = "boom7_1" + this.funcSet;
					this.qmark = "boom6_1" + this.funcSet;
					this.rshift = "boom5_1" + this.funcSet;
					this.up = "boom4_1" + this.funcSet;
					this.num1 = "boom3_1" + this.funcSet;
					this.num2 = "boom2_1" + this.funcSet;
					this.num3 = "boom1_1" + this.funcSet;
					this.numenter = "boom2_1" + this.funcSet;

					this.num = 1;
				}
				else if (this.num == 1) {
					this.num = 0;
					// this.clear();
					if (this.keyFlag2 == 0) {
						this.keyFlag2 = 1;
						setTimeout(() => {
							this.keyFlag2 = 0;
							this.lshift = "" + this.funcSet;
							this.z = "" + this.funcSet;
							this.x = "" + this.funcSet;
							this.c = "" + this.funcSet;
							this.v = "" + this.funcSet;
							this.b = "" + this.funcSet;
							this.n = "" + this.funcSet;
							this.m = "" + this.funcSet;
							this.comma = "" + this.funcSet;
							this.dot = "" + this.funcSet;
							this.qmark = "" + this.funcSet;
							this.rshift = "" + this.funcSet;
							this.up = "" + this.funcSet;
							this.num1 = "" + this.funcSet;
							this.num2 = "" + this.funcSet;
							this.num3 = "" + this.funcSet;
							this.numenter = "" + this.funcSet;
						}, 1000);
					}
					this.lshift = "boom16_2" + this.funcSet;
					this.z = "boom15_2" + this.funcSet;
					this.x = "boom14_2" + this.funcSet;
					this.c = "boom13_2" + this.funcSet;
					this.v = "boom12_2" + this.funcSet;
					this.b = "boom11_2" + this.funcSet;
					this.n = "boom10_2" + this.funcSet;
					this.m = "boom9_2" + this.funcSet;
					this.comma = "boom8_2" + this.funcSet;
					this.dot = "boom7_2" + this.funcSet;
					this.qmark = "boom6_2" + this.funcSet;
					this.rshift = "boom5_2" + this.funcSet;
					this.up = "boom4_2" + this.funcSet;
					this.num1 = "boom3_2" + this.funcSet;
					this.num2 = "boom2_2" + this.funcSet;
					this.num3 = "boom1_2" + this.funcSet;
					this.numenter = "boom2_2" + this.funcSet;

				}
				break;

			case this.vKey == 'num13' && this.keyStatus == 1: //numenter
				if (this.num == 0) {
					// this.clear();
					if (this.keyFlag1 == 0) {
						this.keyFlag1 = 1;
						setTimeout(() => {
							this.keyFlag1 = 0;
							this.lshift = "" + this.funcSet;
							this.z = "" + this.funcSet;
							this.x = "" + this.funcSet;
							this.c = "" + this.funcSet;
							this.v = "" + this.funcSet;
							this.b = "" + this.funcSet;
							this.n = "" + this.funcSet;
							this.m = "" + this.funcSet;
							this.comma = "" + this.funcSet;
							this.dot = "" + this.funcSet;
							this.qmark = "" + this.funcSet;
							this.rshift = "" + this.funcSet;
							this.up = "" + this.funcSet;
							this.num1 = "" + this.funcSet;
							this.num2 = "" + this.funcSet;
							this.num3 = "" + this.funcSet;
							this.numenter = "" + this.funcSet;
						}, 1000);
					}
					this.lshift = "boom17_1" + this.funcSet;
					this.z = "boom16_1" + this.funcSet;
					this.x = "boom15_1" + this.funcSet;
					this.c = "boom14_1" + this.funcSet;
					this.v = "boom13_1" + this.funcSet;
					this.b = "boom12_1" + this.funcSet;
					this.n = "boom11_1" + this.funcSet;
					this.m = "boom10_1" + this.funcSet;
					this.comma = "boom9_1" + this.funcSet;
					this.dot = "boom8_1" + this.funcSet;
					this.qmark = "boom7_1" + this.funcSet;
					this.rshift = "boom6_1" + this.funcSet;
					this.up = "boom5_1" + this.funcSet;
					this.num1 = "boom4_1" + this.funcSet;
					this.num2 = "boom3_1" + this.funcSet;
					this.num3 = "boom2_1" + this.funcSet;
					this.numenter = "boom1_1" + this.funcSet;

					this.num = 1;
				}
				else if (this.num == 1) {
					this.num = 0;
					// this.clear();
					if (this.keyFlag2 == 0) {
						this.keyFlag2 = 1;
						setTimeout(() => {
							this.keyFlag2 = 0;
							this.lshift = "" + this.funcSet;
							this.z = "" + this.funcSet;
							this.x = "" + this.funcSet;
							this.c = "" + this.funcSet;
							this.v = "" + this.funcSet;
							this.b = "" + this.funcSet;
							this.n = "" + this.funcSet;
							this.m = "" + this.funcSet;
							this.comma = "" + this.funcSet;
							this.dot = "" + this.funcSet;
							this.qmark = "" + this.funcSet;
							this.rshift = "" + this.funcSet;
							this.up = "" + this.funcSet;
							this.num1 = "" + this.funcSet;
							this.num2 = "" + this.funcSet;
							this.num3 = "" + this.funcSet;
							this.numenter = "" + this.funcSet;
						}, 1000);
					}
					this.lshift = "boom17_2" + this.funcSet;
					this.z = "boom16_2" + this.funcSet;
					this.x = "boom15_2" + this.funcSet;
					this.c = "boom14_2" + this.funcSet;
					this.v = "boom13_2" + this.funcSet;
					this.b = "boom12_2" + this.funcSet;
					this.n = "boom11_2" + this.funcSet;
					this.m = "boom10_2" + this.funcSet;
					this.comma = "boom9_2" + this.funcSet;
					this.dot = "boom8_2" + this.funcSet;
					this.qmark = "boom7_2" + this.funcSet;
					this.rshift = "boom6_2" + this.funcSet;
					this.up = "boom5_2" + this.funcSet;
					this.num1 = "boom4_2" + this.funcSet;
					this.num2 = "boom3_2" + this.funcSet;
					this.num3 = "boom2_2" + this.funcSet;
					this.numenter = "boom1_2" + this.funcSet;

				}
				break;

			case this.vKey == 'l17' && this.keyStatus == 1: //lctrl
				if (this.num == 0) {
					// this.clear();
					if (this.keyFlag1 == 0) {
						this.keyFlag1 = 1;
						setTimeout(() => {
							this.keyFlag1 = 0;
							this.lctrl = "" + this.funcSet;
							this.win = "" + this.funcSet;
							this.lalt = "" + this.funcSet;
							this.space = "" + this.funcSet;
							this.ralt = "" + this.funcSet;
							this.fn = "" + this.funcSet;
							this.book = "" + this.funcSet;
							this.rctrl = "" + this.funcSet;
							this.left = "" + this.funcSet;
							this.down = "" + this.funcSet;
							this.right = "" + this.funcSet;
							this.num0 = "" + this.funcSet;
							this.numdot = "" + this.funcSet;
						}, 1000);
					}
					this.lctrl = "boom1_1" + this.funcSet;
					this.win = "boom2_1" + this.funcSet;
					this.lalt = "boom3_1" + this.funcSet;
					this.space = "boom4_1" + this.funcSet;
					this.ralt = "boom5_1" + this.funcSet;
					this.fn = "boom6_1" + this.funcSet;
					this.book = "boom7_1" + this.funcSet;
					this.rctrl = "boom8_1" + this.funcSet;
					this.left = "boom9_1" + this.funcSet;
					this.down = "boom10_1" + this.funcSet;
					this.right = "boom11_1" + this.funcSet;
					this.num0 = "boom12_1" + this.funcSet;
					this.numdot = "boom13_1" + this.funcSet;

					this.num = 1;
				}
				else if (this.num == 1) {
					this.num = 0;
					// this.clear();
					if (this.keyFlag2 == 0) {
						this.keyFlag2 = 1;
						setTimeout(() => {
							this.keyFlag2 = 0;
							this.lctrl = "" + this.funcSet;
							this.win = "" + this.funcSet;
							this.lalt = "" + this.funcSet;
							this.space = "" + this.funcSet;
							this.ralt = "" + this.funcSet;
							this.fn = "" + this.funcSet;
							this.book = "" + this.funcSet;
							this.rctrl = "" + this.funcSet;
							this.left = "" + this.funcSet;
							this.down = "" + this.funcSet;
							this.right = "" + this.funcSet;
							this.num0 = "" + this.funcSet;
							this.numdot = "" + this.funcSet;
						}, 1000);
					}
					this.lctrl = "boom1_2" + this.funcSet;
					this.win = "boom2_2" + this.funcSet;
					this.lalt = "boom3_2" + this.funcSet;
					this.space = "boom4_2" + this.funcSet;
					this.ralt = "boom5_2" + this.funcSet;
					this.fn = "boom6_2" + this.funcSet;
					this.book = "boom7_2" + this.funcSet;
					this.rctrl = "boom8_2" + this.funcSet;
					this.left = "boom9_2" + this.funcSet;
					this.down = "boom10_2" + this.funcSet;
					this.right = "boom11_2" + this.funcSet;
					this.num0 = "boom12_2" + this.funcSet;
					this.numdot = "boom13_2" + this.funcSet;

				}
				break;

			case this.vKey == 91 && this.keyStatus == 1: //win
				if (this.num == 0) {
					// this.clear();
					if (this.keyFlag1 == 0) {
						this.keyFlag1 = 1;
						setTimeout(() => {
							this.keyFlag1 = 0;
							this.lctrl = "" + this.funcSet;
							this.win = "" + this.funcSet;
							this.lalt = "" + this.funcSet;
							this.space = "" + this.funcSet;
							this.ralt = "" + this.funcSet;
							this.fn = "" + this.funcSet;
							this.book = "" + this.funcSet;
							this.rctrl = "" + this.funcSet;
							this.left = "" + this.funcSet;
							this.down = "" + this.funcSet;
							this.right = "" + this.funcSet;
							this.num0 = "" + this.funcSet;
							this.numdot = "" + this.funcSet;
						}, 1000);
					}
					this.lctrl = "boom2_1" + this.funcSet;
					this.win = "boom1_1" + this.funcSet;
					this.lalt = "boom2_1" + this.funcSet;
					this.space = "boom3_1" + this.funcSet;
					this.ralt = "boom4_1" + this.funcSet;
					this.fn = "boom5_1" + this.funcSet;
					this.book = "boom6_1" + this.funcSet;
					this.rctrl = "boom7_1" + this.funcSet;
					this.left = "boom8_1" + this.funcSet;
					this.down = "boom9_1" + this.funcSet;
					this.right = "boom10_1" + this.funcSet;
					this.num0 = "boom11_1" + this.funcSet;
					this.numdot = "boom12_1" + this.funcSet;

					this.num = 1;
				}
				else if (this.num == 1) {
					this.num = 0;
					// this.clear();
					if (this.keyFlag2 == 0) {
						this.keyFlag2 = 1;
						setTimeout(() => {
							this.keyFlag2 = 0;
							this.lctrl = "" + this.funcSet;
							this.win = "" + this.funcSet;
							this.lalt = "" + this.funcSet;
							this.space = "" + this.funcSet;
							this.ralt = "" + this.funcSet;
							this.fn = "" + this.funcSet;
							this.book = "" + this.funcSet;
							this.rctrl = "" + this.funcSet;
							this.left = "" + this.funcSet;
							this.down = "" + this.funcSet;
							this.right = "" + this.funcSet;
							this.num0 = "" + this.funcSet;
							this.numdot = "" + this.funcSet;
						}, 1000);
					}
					this.lctrl = "boom2_2" + this.funcSet;
					this.win = "boom1_2" + this.funcSet;
					this.lalt = "boom2_2" + this.funcSet;
					this.space = "boom3_2" + this.funcSet;
					this.ralt = "boom4_2" + this.funcSet;
					this.fn = "boom5_2" + this.funcSet;
					this.book = "boom6_2" + this.funcSet;
					this.rctrl = "boom7_2" + this.funcSet;
					this.left = "boom8_2" + this.funcSet;
					this.down = "boom9_2" + this.funcSet;
					this.right = "boom10_2" + this.funcSet;
					this.num0 = "boom11_2" + this.funcSet;
					this.numdot = "boom12_2" + this.funcSet;

				}
				break;

			case this.vKey == 'l18' && this.keyStatus == 1: //lalt
				if (this.num == 0) {
					// this.clear();
					if (this.keyFlag1 == 0) {
						this.keyFlag1 = 1;
						setTimeout(() => {
							this.keyFlag1 = 0;
							this.lctrl = "" + this.funcSet;
							this.win = "" + this.funcSet;
							this.lalt = "" + this.funcSet;
							this.space = "" + this.funcSet;
							this.ralt = "" + this.funcSet;
							this.fn = "" + this.funcSet;
							this.book = "" + this.funcSet;
							this.rctrl = "" + this.funcSet;
							this.left = "" + this.funcSet;
							this.down = "" + this.funcSet;
							this.right = "" + this.funcSet;
							this.num0 = "" + this.funcSet;
							this.numdot = "" + this.funcSet;
						}, 1000);
					}
					this.lctrl = "boom3_1" + this.funcSet;
					this.win = "boom2_1" + this.funcSet;
					this.lalt = "boom1_1" + this.funcSet;
					this.space = "boom2_1" + this.funcSet;
					this.ralt = "boom3_1" + this.funcSet;
					this.fn = "boom4_1" + this.funcSet;
					this.book = "boom5_1" + this.funcSet;
					this.rctrl = "boom6_1" + this.funcSet;
					this.left = "boom7_1" + this.funcSet;
					this.down = "boom8_1" + this.funcSet;
					this.right = "boom9_1" + this.funcSet;
					this.num0 = "boom10_1" + this.funcSet;
					this.numdot = "boom11_1" + this.funcSet;

					this.num = 1;
				}
				else if (this.num == 1) {
					this.num = 0;
					// this.clear();
					if (this.keyFlag2 == 0) {
						this.keyFlag2 = 1;
						setTimeout(() => {
							this.keyFlag2 = 0;
							this.lctrl = "" + this.funcSet;
							this.win = "" + this.funcSet;
							this.lalt = "" + this.funcSet;
							this.space = "" + this.funcSet;
							this.ralt = "" + this.funcSet;
							this.fn = "" + this.funcSet;
							this.book = "" + this.funcSet;
							this.rctrl = "" + this.funcSet;
							this.left = "" + this.funcSet;
							this.down = "" + this.funcSet;
							this.right = "" + this.funcSet;
							this.num0 = "" + this.funcSet;
							this.numdot = "" + this.funcSet;
						}, 1000);
					}
					this.lctrl = "boom3_2" + this.funcSet;
					this.win = "boom2_2" + this.funcSet;
					this.lalt = "boom1_2" + this.funcSet;
					this.space = "boom2_2" + this.funcSet;
					this.ralt = "boom3_2" + this.funcSet;
					this.fn = "boom4_2" + this.funcSet;
					this.book = "boom5_2" + this.funcSet;
					this.rctrl = "boom6_2" + this.funcSet;
					this.left = "boom7_2" + this.funcSet;
					this.down = "boom8_2" + this.funcSet;
					this.right = "boom9_2" + this.funcSet;
					this.num0 = "boom10_2" + this.funcSet;
					this.numdot = "boom11_2" + this.funcSet;

				}
				break;

			case this.vKey == 32 && this.keyStatus == 1: //space
				if (this.num == 0) {
					// this.clear();
					if (this.keyFlag1 == 0) {
						this.keyFlag1 = 1;
						setTimeout(() => {
							this.keyFlag1 = 0;
							this.lctrl = "" + this.funcSet;
							this.win = "" + this.funcSet;
							this.lalt = "" + this.funcSet;
							this.space = "" + this.funcSet;
							this.ralt = "" + this.funcSet;
							this.fn = "" + this.funcSet;
							this.book = "" + this.funcSet;
							this.rctrl = "" + this.funcSet;
							this.left = "" + this.funcSet;
							this.down = "" + this.funcSet;
							this.right = "" + this.funcSet;
							this.num0 = "" + this.funcSet;
							this.numdot = "" + this.funcSet;
						}, 1000);
					}
					this.lctrl = "boom4_1" + this.funcSet;
					this.win = "boom3_1" + this.funcSet;
					this.lalt = "boom2_1" + this.funcSet;
					this.space = "boom1_1" + this.funcSet;
					this.ralt = "boom2_1" + this.funcSet;
					this.fn = "boom3_1" + this.funcSet;
					this.book = "boom4_1" + this.funcSet;
					this.rctrl = "boom5_1" + this.funcSet;
					this.left = "boom6_1" + this.funcSet;
					this.down = "boom7_1" + this.funcSet;
					this.right = "boom8_1" + this.funcSet;
					this.num0 = "boom9_1" + this.funcSet;
					this.numdot = "boom10_1" + this.funcSet;

					this.num = 1;
				}
				else if (this.num == 1) {
					this.num = 0;
					// this.clear();
					if (this.keyFlag2 == 0) {
						this.keyFlag2 = 1;
						setTimeout(() => {
							this.keyFlag2 = 0;
							this.lctrl = "" + this.funcSet;
							this.win = "" + this.funcSet;
							this.lalt = "" + this.funcSet;
							this.space = "" + this.funcSet;
							this.ralt = "" + this.funcSet;
							this.fn = "" + this.funcSet;
							this.book = "" + this.funcSet;
							this.rctrl = "" + this.funcSet;
							this.left = "" + this.funcSet;
							this.down = "" + this.funcSet;
							this.right = "" + this.funcSet;
							this.num0 = "" + this.funcSet;
							this.numdot = "" + this.funcSet;
						}, 1000);
					}
					this.lctrl = "boom4_2" + this.funcSet;
					this.win = "boom3_2" + this.funcSet;
					this.lalt = "boom2_2" + this.funcSet;
					this.space = "boom1_2" + this.funcSet;
					this.ralt = "boom2_2" + this.funcSet;
					this.fn = "boom3_2" + this.funcSet;
					this.book = "boom4_2" + this.funcSet;
					this.rctrl = "boom5_2" + this.funcSet;
					this.left = "boom6_2" + this.funcSet;
					this.down = "boom7_2" + this.funcSet;
					this.right = "boom8_2" + this.funcSet;
					this.num0 = "boom9_2" + this.funcSet;
					this.numdot = "boom10_2" + this.funcSet;

				}
				break;

			case this.vKey == 'r18' && this.keyStatus == 1: //ralt
				if (this.num == 0) {
					// this.clear();
					if (this.keyFlag1 == 0) {
						this.keyFlag1 = 1;
						setTimeout(() => {
							this.keyFlag1 = 0;
							this.lctrl = "" + this.funcSet;
							this.win = "" + this.funcSet;
							this.lalt = "" + this.funcSet;
							this.space = "" + this.funcSet;
							this.ralt = "" + this.funcSet;
							this.fn = "" + this.funcSet;
							this.book = "" + this.funcSet;
							this.rctrl = "" + this.funcSet;
							this.left = "" + this.funcSet;
							this.down = "" + this.funcSet;
							this.right = "" + this.funcSet;
							this.num0 = "" + this.funcSet;
							this.numdot = "" + this.funcSet;
						}, 1000);
					}
					this.lctrl = "boom5_1" + this.funcSet;
					this.win = "boom4_1" + this.funcSet;
					this.lalt = "boom3_1" + this.funcSet;
					this.space = "boom2_1" + this.funcSet;
					this.ralt = "boom1_1" + this.funcSet;
					this.fn = "boom2_1" + this.funcSet;
					this.book = "boom3_1" + this.funcSet;
					this.rctrl = "boom4_1" + this.funcSet;
					this.left = "boom5_1" + this.funcSet;
					this.down = "boom6_1" + this.funcSet;
					this.right = "boom7_1" + this.funcSet;
					this.num0 = "boom8_1" + this.funcSet;
					this.numdot = "boom9_1" + this.funcSet;

					this.num = 1;
				}
				else if (this.num == 1) {
					this.num = 0;
					// this.clear();
					if (this.keyFlag2 == 0) {
						this.keyFlag2 = 1;
						setTimeout(() => {
							this.keyFlag2 = 0;
							this.lctrl = "" + this.funcSet;
							this.win = "" + this.funcSet;
							this.lalt = "" + this.funcSet;
							this.space = "" + this.funcSet;
							this.ralt = "" + this.funcSet;
							this.fn = "" + this.funcSet;
							this.book = "" + this.funcSet;
							this.rctrl = "" + this.funcSet;
							this.left = "" + this.funcSet;
							this.down = "" + this.funcSet;
							this.right = "" + this.funcSet;
							this.num0 = "" + this.funcSet;
							this.numdot = "" + this.funcSet;
						}, 1000);
					}
					this.lctrl = "boom5_2" + this.funcSet;
					this.win = "boom4_2" + this.funcSet;
					this.lalt = "boom3_2" + this.funcSet;
					this.space = "boom2_2" + this.funcSet;
					this.ralt = "boom1_2" + this.funcSet;
					this.fn = "boom2_2" + this.funcSet;
					this.book = "boom3_2" + this.funcSet;
					this.rctrl = "boom4_2" + this.funcSet;
					this.left = "boom5_2" + this.funcSet;
					this.down = "boom6_2" + this.funcSet;
					this.right = "boom7_2" + this.funcSet;
					this.num0 = "boom8_2" + this.funcSet;
					this.numdot = "boom9_2" + this.funcSet;

				}
				break;

			case this.vKey == 93 && this.keyStatus == 1: //book
				if (this.num == 0) {
					// this.clear();
					if (this.keyFlag1 == 0) {
						this.keyFlag1 = 1;
						setTimeout(() => {
							this.keyFlag1 = 0;
							this.lctrl = "" + this.funcSet;
							this.win = "" + this.funcSet;
							this.lalt = "" + this.funcSet;
							this.space = "" + this.funcSet;
							this.ralt = "" + this.funcSet;
							this.fn = "" + this.funcSet;
							this.book = "" + this.funcSet;
							this.rctrl = "" + this.funcSet;
							this.left = "" + this.funcSet;
							this.down = "" + this.funcSet;
							this.right = "" + this.funcSet;
							this.num0 = "" + this.funcSet;
							this.numdot = "" + this.funcSet;
						}, 1000);
					}
					this.lctrl = "boom7_1" + this.funcSet;
					this.win = "boom6_1" + this.funcSet;
					this.lalt = "boom5_1" + this.funcSet;
					this.space = "boom4_1" + this.funcSet;
					this.ralt = "boom3_1" + this.funcSet;
					this.fn = "boom2_1" + this.funcSet;
					this.book = "boom1_1" + this.funcSet;
					this.rctrl = "boom2_1" + this.funcSet;
					this.left = "boom3_1" + this.funcSet;
					this.down = "boom4_1" + this.funcSet;
					this.right = "boom5_1" + this.funcSet;
					this.num0 = "boom6_1" + this.funcSet;
					this.numdot = "boom7_1" + this.funcSet;

					this.num = 1;
				}
				else if (this.num == 1) {
					this.num = 0;
					// this.clear();
					if (this.keyFlag2 == 0) {
						this.keyFlag2 = 1;
						setTimeout(() => {
							this.keyFlag2 = 0;
							this.lctrl = "" + this.funcSet;
							this.win = "" + this.funcSet;
							this.lalt = "" + this.funcSet;
							this.space = "" + this.funcSet;
							this.ralt = "" + this.funcSet;
							this.fn = "" + this.funcSet;
							this.book = "" + this.funcSet;
							this.rctrl = "" + this.funcSet;
							this.left = "" + this.funcSet;
							this.down = "" + this.funcSet;
							this.right = "" + this.funcSet;
							this.num0 = "" + this.funcSet;
							this.numdot = "" + this.funcSet;
						}, 1000);
					}
					this.lctrl = "boom7_2" + this.funcSet;
					this.win = "boom6_2" + this.funcSet;
					this.lalt = "boom5_2" + this.funcSet;
					this.space = "boom4_2" + this.funcSet;
					this.ralt = "boom3_2" + this.funcSet;
					this.fn = "boom2_2" + this.funcSet;
					this.book = "boom1_2" + this.funcSet;
					this.rctrl = "boom2_2" + this.funcSet;
					this.left = "boom3_2" + this.funcSet;
					this.down = "boom4_2" + this.funcSet;
					this.right = "boom5_2" + this.funcSet;
					this.num0 = "boom6_2" + this.funcSet;
					this.numdot = "boom7_2" + this.funcSet;

				}
				break;

			case this.vKey == 'r17' && this.keyStatus == 1: //rctrl
				if (this.num == 0) {
					// this.clear();
					if (this.keyFlag1 == 0) {
						this.keyFlag1 = 1;
						setTimeout(() => {
							this.keyFlag1 = 0;
							this.lctrl = "" + this.funcSet;
							this.win = "" + this.funcSet;
							this.lalt = "" + this.funcSet;
							this.space = "" + this.funcSet;
							this.ralt = "" + this.funcSet;
							this.fn = "" + this.funcSet;
							this.book = "" + this.funcSet;
							this.rctrl = "" + this.funcSet;
							this.left = "" + this.funcSet;
							this.down = "" + this.funcSet;
							this.right = "" + this.funcSet;
							this.num0 = "" + this.funcSet;
							this.numdot = "" + this.funcSet;
						}, 1000);
					}
					this.lctrl = "boom8_1" + this.funcSet;
					this.win = "boom7_1" + this.funcSet;
					this.lalt = "boom6_1" + this.funcSet;
					this.space = "boom5_1" + this.funcSet;
					this.ralt = "boom4_1" + this.funcSet;
					this.fn = "boom3_1" + this.funcSet;
					this.book = "boom2_1" + this.funcSet;
					this.rctrl = "boom1_1" + this.funcSet;
					this.left = "boom2_1" + this.funcSet;
					this.down = "boom3_1" + this.funcSet;
					this.right = "boom4_1" + this.funcSet;
					this.num0 = "boom5_1" + this.funcSet;
					this.numdot = "boom6_1" + this.funcSet;

					this.num = 1;
				}
				else if (this.num == 1) {
					this.num = 0;
					// this.clear();
					if (this.keyFlag2 == 0) {
						this.keyFlag2 = 1;
						setTimeout(() => {
							this.keyFlag2 = 0;
							this.lctrl = "" + this.funcSet;
							this.win = "" + this.funcSet;
							this.lalt = "" + this.funcSet;
							this.space = "" + this.funcSet;
							this.ralt = "" + this.funcSet;
							this.fn = "" + this.funcSet;
							this.book = "" + this.funcSet;
							this.rctrl = "" + this.funcSet;
							this.left = "" + this.funcSet;
							this.down = "" + this.funcSet;
							this.right = "" + this.funcSet;
							this.num0 = "" + this.funcSet;
							this.numdot = "" + this.funcSet;
						}, 1000);
					}
					this.lctrl = "boom8_2" + this.funcSet;
					this.win = "boom7_2" + this.funcSet;
					this.lalt = "boom6_2" + this.funcSet;
					this.space = "boom5_2" + this.funcSet;
					this.ralt = "boom4_2" + this.funcSet;
					this.fn = "boom3_2" + this.funcSet;
					this.book = "boom2_2" + this.funcSet;
					this.rctrl = "boom1_2" + this.funcSet;
					this.left = "boom2_2" + this.funcSet;
					this.down = "boom3_2" + this.funcSet;
					this.right = "boom4_2" + this.funcSet;
					this.num0 = "boom5_2" + this.funcSet;
					this.numdot = "boom6_2" + this.funcSet;

				}
				break;

			case this.vKey == 37 && this.keyStatus == 1: //left
				if (this.num == 0) {
					// this.clear();
					if (this.keyFlag1 == 0) {
						this.keyFlag1 = 1;
						setTimeout(() => {
							this.keyFlag1 = 0;
							this.lctrl = "" + this.funcSet;
							this.win = "" + this.funcSet;
							this.lalt = "" + this.funcSet;
							this.space = "" + this.funcSet;
							this.ralt = "" + this.funcSet;
							this.fn = "" + this.funcSet;
							this.book = "" + this.funcSet;
							this.rctrl = "" + this.funcSet;
							this.left = "" + this.funcSet;
							this.down = "" + this.funcSet;
							this.right = "" + this.funcSet;
							this.num0 = "" + this.funcSet;
							this.numdot = "" + this.funcSet;
						}, 1000);
					}
					this.lctrl = "boom9_1" + this.funcSet;
					this.win = "boom8_1" + this.funcSet;
					this.lalt = "boom7_1" + this.funcSet;
					this.space = "boom6_1" + this.funcSet;
					this.ralt = "boom5_1" + this.funcSet;
					this.fn = "boom4_1" + this.funcSet;
					this.book = "boom3_1" + this.funcSet;
					this.rctrl = "boom2_1" + this.funcSet;
					this.left = "boom1_1" + this.funcSet;
					this.down = "boom2_1" + this.funcSet;
					this.right = "boom3_1" + this.funcSet;
					this.num0 = "boom4_1" + this.funcSet;
					this.numdot = "boom5_1" + this.funcSet;

					this.num = 1;
				}
				else if (this.num == 1) {
					this.num = 0;
					// this.clear();
					if (this.keyFlag2 == 0) {
						this.keyFlag2 = 1;
						setTimeout(() => {
							this.keyFlag2 = 0;
							this.lctrl = "" + this.funcSet;
							this.win = "" + this.funcSet;
							this.lalt = "" + this.funcSet;
							this.space = "" + this.funcSet;
							this.ralt = "" + this.funcSet;
							this.fn = "" + this.funcSet;
							this.book = "" + this.funcSet;
							this.rctrl = "" + this.funcSet;
							this.left = "" + this.funcSet;
							this.down = "" + this.funcSet;
							this.right = "" + this.funcSet;
							this.num0 = "" + this.funcSet;
							this.numdot = "" + this.funcSet;
						}, 1000);
					}
					this.lctrl = "boom9_2" + this.funcSet;
					this.win = "boom8_2" + this.funcSet;
					this.lalt = "boom7_2" + this.funcSet;
					this.space = "boom6_2" + this.funcSet;
					this.ralt = "boom5_2" + this.funcSet;
					this.fn = "boom4_2" + this.funcSet;
					this.book = "boom3_2" + this.funcSet;
					this.rctrl = "boom2_2" + this.funcSet;
					this.left = "boom1_2" + this.funcSet;
					this.down = "boom2_2" + this.funcSet;
					this.right = "boom3_2" + this.funcSet;
					this.num0 = "boom4_2" + this.funcSet;
					this.numdot = "boom5_2" + this.funcSet;

				}
				break;

			case this.vKey == 40 && this.keyStatus == 1: //down
				if (this.num == 0) {
					// this.clear();
					if (this.keyFlag1 == 0) {
						this.keyFlag1 = 1;
						setTimeout(() => {
							this.keyFlag1 = 0;
							this.lctrl = "" + this.funcSet;
							this.win = "" + this.funcSet;
							this.lalt = "" + this.funcSet;
							this.space = "" + this.funcSet;
							this.ralt = "" + this.funcSet;
							this.fn = "" + this.funcSet;
							this.book = "" + this.funcSet;
							this.rctrl = "" + this.funcSet;
							this.left = "" + this.funcSet;
							this.down = "" + this.funcSet;
							this.right = "" + this.funcSet;
							this.num0 = "" + this.funcSet;
							this.numdot = "" + this.funcSet;
						}, 1000);
					}
					this.lctrl = "boom10_1" + this.funcSet;
					this.win = "boom9_1" + this.funcSet;
					this.lalt = "boom8_1" + this.funcSet;
					this.space = "boom7_1" + this.funcSet;
					this.ralt = "boom6_1" + this.funcSet;
					this.fn = "boom5_1" + this.funcSet;
					this.book = "boom4_1" + this.funcSet;
					this.rctrl = "boom3_1" + this.funcSet;
					this.left = "boom2_1" + this.funcSet;
					this.down = "boom1_1" + this.funcSet;
					this.right = "boom2_1" + this.funcSet;
					this.num0 = "boom3_1" + this.funcSet;
					this.numdot = "boom4_1" + this.funcSet;

					this.num = 1;
				}
				else if (this.num == 1) {
					this.num = 0;
					// this.clear();
					if (this.keyFlag2 == 0) {
						this.keyFlag2 = 1;
						setTimeout(() => {
							this.keyFlag2 = 0;
							this.lctrl = "" + this.funcSet;
							this.win = "" + this.funcSet;
							this.lalt = "" + this.funcSet;
							this.space = "" + this.funcSet;
							this.ralt = "" + this.funcSet;
							this.fn = "" + this.funcSet;
							this.book = "" + this.funcSet;
							this.rctrl = "" + this.funcSet;
							this.left = "" + this.funcSet;
							this.down = "" + this.funcSet;
							this.right = "" + this.funcSet;
							this.num0 = "" + this.funcSet;
							this.numdot = "" + this.funcSet;
						}, 1000);
					}
					this.lctrl = "boom10_2" + this.funcSet;
					this.win = "boom9_2" + this.funcSet;
					this.lalt = "boom8_2" + this.funcSet;
					this.space = "boom7_2" + this.funcSet;
					this.ralt = "boom6_2" + this.funcSet;
					this.fn = "boom5_2" + this.funcSet;
					this.book = "boom4_2" + this.funcSet;
					this.rctrl = "boom3_2" + this.funcSet;
					this.left = "boom2_2" + this.funcSet;
					this.down = "boom1_2" + this.funcSet;
					this.right = "boom2_2" + this.funcSet;
					this.num0 = "boom3_2" + this.funcSet;
					this.numdot = "boom4_2" + this.funcSet;

				}
				break;

			case this.vKey == 39 && this.keyStatus == 1: //right
				if (this.num == 0) {
					// this.clear();
					if (this.keyFlag1 == 0) {
						this.keyFlag1 = 1;
						setTimeout(() => {
							this.keyFlag1 = 0;
							this.lctrl = "" + this.funcSet;
							this.win = "" + this.funcSet;
							this.lalt = "" + this.funcSet;
							this.space = "" + this.funcSet;
							this.ralt = "" + this.funcSet;
							this.fn = "" + this.funcSet;
							this.book = "" + this.funcSet;
							this.rctrl = "" + this.funcSet;
							this.left = "" + this.funcSet;
							this.down = "" + this.funcSet;
							this.right = "" + this.funcSet;
							this.num0 = "" + this.funcSet;
							this.numdot = "" + this.funcSet;
						}, 1000);
					}
					this.lctrl = "boom11_1" + this.funcSet;
					this.win = "boom10_1" + this.funcSet;
					this.lalt = "boom9_1" + this.funcSet;
					this.space = "boom8_1" + this.funcSet;
					this.ralt = "boom7_1" + this.funcSet;
					this.fn = "boom6_1" + this.funcSet;
					this.book = "boom5_1" + this.funcSet;
					this.rctrl = "boom4_1" + this.funcSet;
					this.left = "boom3_1" + this.funcSet;
					this.down = "boom2_1" + this.funcSet;
					this.right = "boom1_1" + this.funcSet;
					this.num0 = "boom2_1" + this.funcSet;
					this.numdot = "boom3_1" + this.funcSet;

					this.num = 1;
				}
				else if (this.num == 1) {
					this.num = 0;
					// this.clear();
					if (this.keyFlag2 == 0) {
						this.keyFlag2 = 1;
						setTimeout(() => {
							this.keyFlag2 = 0;
							this.lctrl = "" + this.funcSet;
							this.win = "" + this.funcSet;
							this.lalt = "" + this.funcSet;
							this.space = "" + this.funcSet;
							this.ralt = "" + this.funcSet;
							this.fn = "" + this.funcSet;
							this.book = "" + this.funcSet;
							this.rctrl = "" + this.funcSet;
							this.left = "" + this.funcSet;
							this.down = "" + this.funcSet;
							this.right = "" + this.funcSet;
							this.num0 = "" + this.funcSet;
							this.numdot = "" + this.funcSet;
						}, 1000);
					}
					this.lctrl = "boom11_2" + this.funcSet;
					this.win = "boom10_2" + this.funcSet;
					this.lalt = "boom9_2" + this.funcSet;
					this.space = "boom8_2" + this.funcSet;
					this.ralt = "boom7_2" + this.funcSet;
					this.fn = "boom6_2" + this.funcSet;
					this.book = "boom5_2" + this.funcSet;
					this.rctrl = "boom4_2" + this.funcSet;
					this.left = "boom3_2" + this.funcSet;
					this.down = "boom2_2" + this.funcSet;
					this.right = "boom1_2" + this.funcSet;
					this.num0 = "boom2_2" + this.funcSet;
					this.numdot = "boom3_2" + this.funcSet;

				}
				break;

			case this.vKey == 96 && this.keyStatus == 1: //num0
				if (this.num == 0) {
					// this.clear();
					if (this.keyFlag1 == 0) {
						this.keyFlag1 = 1;
						setTimeout(() => {
							this.keyFlag1 = 0;
							this.lctrl = "" + this.funcSet;
							this.win = "" + this.funcSet;
							this.lalt = "" + this.funcSet;
							this.space = "" + this.funcSet;
							this.ralt = "" + this.funcSet;
							this.fn = "" + this.funcSet;
							this.book = "" + this.funcSet;
							this.rctrl = "" + this.funcSet;
							this.left = "" + this.funcSet;
							this.down = "" + this.funcSet;
							this.right = "" + this.funcSet;
							this.num0 = "" + this.funcSet;
							this.numdot = "" + this.funcSet;
						}, 1000);
					}
					this.lctrl = "boom12_1" + this.funcSet;
					this.win = "boom11_1" + this.funcSet;
					this.lalt = "boom10_1" + this.funcSet;
					this.space = "boom9_1" + this.funcSet;
					this.ralt = "boom8_1" + this.funcSet;
					this.fn = "boom7_1" + this.funcSet;
					this.book = "boom6_1" + this.funcSet;
					this.rctrl = "boom5_1" + this.funcSet;
					this.left = "boom4_1" + this.funcSet;
					this.down = "boom3_1" + this.funcSet;
					this.right = "boom2_1" + this.funcSet;
					this.num0 = "boom1_1" + this.funcSet;
					this.numdot = "boom2_1" + this.funcSet;

					this.num = 1;
				}
				else if (this.num == 1) {
					this.num = 0;
					// this.clear();
					if (this.keyFlag2 == 0) {
						this.keyFlag2 = 1;
						setTimeout(() => {
							this.keyFlag2 = 0;
							this.lctrl = "" + this.funcSet;
							this.win = "" + this.funcSet;
							this.lalt = "" + this.funcSet;
							this.space = "" + this.funcSet;
							this.ralt = "" + this.funcSet;
							this.fn = "" + this.funcSet;
							this.book = "" + this.funcSet;
							this.rctrl = "" + this.funcSet;
							this.left = "" + this.funcSet;
							this.down = "" + this.funcSet;
							this.right = "" + this.funcSet;
							this.num0 = "" + this.funcSet;
							this.numdot = "" + this.funcSet;
						}, 1000);
					}
					this.lctrl = "boom12_2" + this.funcSet;
					this.win = "boom11_2" + this.funcSet;
					this.lalt = "boom10_2" + this.funcSet;
					this.space = "boom9_2" + this.funcSet;
					this.ralt = "boom8_2" + this.funcSet;
					this.fn = "boom7_2" + this.funcSet;
					this.book = "boom6_2" + this.funcSet;
					this.rctrl = "boom5_2" + this.funcSet;
					this.left = "boom4_2" + this.funcSet;
					this.down = "boom3_2" + this.funcSet;
					this.right = "boom2_2" + this.funcSet;
					this.num0 = "boom1_2" + this.funcSet;
					this.numdot = "boom2_2" + this.funcSet;

				}
				break;

			case this.vKey == 110 && this.keyStatus == 1: //numdot
				if (this.num == 0) {
					// this.clear();
					if (this.keyFlag1 == 0) {
						this.keyFlag1 = 1;
						setTimeout(() => {
							this.keyFlag1 = 0;
							this.lctrl = "" + this.funcSet;
							this.win = "" + this.funcSet;
							this.lalt = "" + this.funcSet;
							this.space = "" + this.funcSet;
							this.ralt = "" + this.funcSet;
							this.fn = "" + this.funcSet;
							this.book = "" + this.funcSet;
							this.rctrl = "" + this.funcSet;
							this.left = "" + this.funcSet;
							this.down = "" + this.funcSet;
							this.right = "" + this.funcSet;
							this.num0 = "" + this.funcSet;
							this.numdot = "" + this.funcSet;
						}, 1000);
					}
					this.lctrl = "boom13_1" + this.funcSet;
					this.win = "boom12_1" + this.funcSet;
					this.lalt = "boom11_1" + this.funcSet;
					this.space = "boom10_1" + this.funcSet;
					this.ralt = "boom9_1" + this.funcSet;
					this.fn = "boom8_1" + this.funcSet;
					this.book = "boom7_1" + this.funcSet;
					this.rctrl = "boom6_1" + this.funcSet;
					this.left = "boom5_1" + this.funcSet;
					this.down = "boom4_1" + this.funcSet;
					this.right = "boom3_1" + this.funcSet;
					this.num0 = "boom2_1" + this.funcSet;
					this.numdot = "boom1_1" + this.funcSet;

					this.num = 1;
				}
				else if (this.num == 1) {
					this.num = 0;
					// this.clear();
					if (this.keyFlag2 == 0) {
						this.keyFlag2 = 1;
						setTimeout(() => {
							this.keyFlag2 = 0;
							this.lctrl = "" + this.funcSet;
							this.win = "" + this.funcSet;
							this.lalt = "" + this.funcSet;
							this.space = "" + this.funcSet;
							this.ralt = "" + this.funcSet;
							this.fn = "" + this.funcSet;
							this.book = "" + this.funcSet;
							this.rctrl = "" + this.funcSet;
							this.left = "" + this.funcSet;
							this.down = "" + this.funcSet;
							this.right = "" + this.funcSet;
							this.num0 = "" + this.funcSet;
							this.numdot = "" + this.funcSet;
						}, 1000);
					}
					this.lctrl = "boom13_2" + this.funcSet;
					this.win = "boom12_2" + this.funcSet;
					this.lalt = "boom11_2" + this.funcSet;
					this.space = "boom10_2" + this.funcSet;
					this.ralt = "boom9_2" + this.funcSet;
					this.fn = "boom8_2" + this.funcSet;
					this.book = "boom7_2" + this.funcSet;
					this.rctrl = "boom6_2" + this.funcSet;
					this.left = "boom5_2" + this.funcSet;
					this.down = "boom4_2" + this.funcSet;
					this.right = "boom3_2" + this.funcSet;
					this.num0 = "boom2_2" + this.funcSet;
					this.numdot = "boom1_2" + this.funcSet;

				}
				break;
			case this.vKey == 44://print
				if (this.num == 0) {
					// this.clear();
					if (this.keyFlag1 == 0) {
						this.keyFlag1 = 1;
						setTimeout(() => {
							this.keyFlag1 = 0;
							this.esc = "" + this.funcSet;
							this.f1 = '' + this.funcSet;
							this.f2 = '' + this.funcSet;
							this.f3 = '' + this.funcSet;
							this.f4 = '' + this.funcSet;
							this.f5 = '' + this.funcSet;
							this.f6 = '' + this.funcSet;
							this.f7 = '' + this.funcSet;
							this.f8 = '' + this.funcSet;
							this.f9 = '' + this.funcSet;
							this.f10 = '' + this.funcSet;
							this.f11 = '' + this.funcSet;
							this.f12 = '' + this.funcSet;
							this.print = '' + this.funcSet;
							this.scroll = '' + this.funcSet;
							this.pause = '' + this.funcSet;
						}, 1000);
					}
					this.esc = "boom14_1" + this.funcSet;
					this.f1 = 'boom13_1' + this.funcSet;
					this.f2 = 'boom12_1' + this.funcSet;
					this.f3 = 'boom11_1' + this.funcSet;
					this.f4 = 'boom10_1' + this.funcSet;
					this.f5 = 'boom9_1' + this.funcSet;
					this.f6 = 'boom8_1' + this.funcSet;
					this.f7 = 'boom7_1' + this.funcSet;
					this.f8 = 'boom6_1' + this.funcSet;
					this.f9 = 'boom5_1' + this.funcSet;
					this.f10 = 'boom4_1' + this.funcSet;
					this.f11 = 'boom3_1' + this.funcSet;
					this.f12 = 'boom2_1' + this.funcSet;
					this.print = 'boom1_1' + this.funcSet;
					this.scroll = 'boom2_1' + this.funcSet;
					this.pause = 'boom3_1' + this.funcSet;
					this.num = 1;
				}
				else if (this.num == 1) {
					this.num = 0;
					// this.clear();
					if (this.keyFlag2 == 0) {
						this.keyFlag2 = 1;
						setTimeout(() => {
							this.keyFlag2 = 0;
							this.esc_2 = "" + this.funcSet;
							this.f1_2 = '' + this.funcSet;
							this.f2_2 = '' + this.funcSet;
							this.f3_2 = '' + this.funcSet;
							this.f4_2 = '' + this.funcSet;
							this.f5_2 = '' + this.funcSet;
							this.f6_2 = '' + this.funcSet;
							this.f7_2 = '' + this.funcSet;
							this.f8_2 = '' + this.funcSet;
							this.f9_2 = '' + this.funcSet;
							this.f10_2 = '' + this.funcSet;
							this.f11_2 = '' + this.funcSet;
							this.f12_2 = '' + this.funcSet;
							this.print_2 = '' + this.funcSet;
							this.scroll_2 = '' + this.funcSet;
							this.pause_2 = '' + this.funcSet;
						}, 1000);
					}
					this.esc = "boom14_2" + this.funcSet;
					this.f1 = 'boom13_2' + this.funcSet;
					this.f2 = 'boom12_2' + this.funcSet;
					this.f3 = 'boom11_2' + this.funcSet;
					this.f4 = 'boom10_2' + this.funcSet;
					this.f5 = 'boom9_2' + this.funcSet;
					this.f6 = 'boom8_2' + this.funcSet;
					this.f7 = 'boom7_2' + this.funcSet;
					this.f8 = 'boom6_2' + this.funcSet;
					this.f9 = 'boom5_2' + this.funcSet;
					this.f10 = 'boom4_2' + this.funcSet;
					this.f11 = 'boom3_2' + this.funcSet;
					this.f12 = 'boom2_2' + this.funcSet;
					this.print = 'boom1_2' + this.funcSet;
					this.scroll = 'boom2_2' + this.funcSet;
					this.pause = 'boom3_2' + this.funcSet;
				}
				break;
			default:
				break;
		}
		//以上為向外








		//以下為向內\
		switch (true) {
			case this.vKey == 27 && this.keyStatus == 1: //esc
				if (this.num == 2) {
					// this.clear();
					if (this.keyFlag1 == 0) {
						this.keyFlag1 = 1;
						setTimeout(() => {
							this.keyFlag1 = 0;
						}, 1000);
					}
					this.esc = 'boom1_1' + this.funcSet;
					this.f1 = 'boom16_1' + this.funcSet;
					this.f2 = 'boom15_1' + this.funcSet;
					this.f3 = 'boom14_1' + this.funcSet;
					this.f4 = 'boom13_1' + this.funcSet;
					this.f5 = 'boom12_1' + this.funcSet;
					this.f6 = 'boom11_1' + this.funcSet;
					this.f7 = 'boom10_1' + this.funcSet;
					this.f8 = 'boom9_1' + this.funcSet;
					this.f9 = 'boom8_1' + this.funcSet;
					this.f10 = 'boom7_1' + this.funcSet;
					this.f11 = 'boom6_1' + this.funcSet;
					this.f12 = 'boom5_1' + this.funcSet;
					this.print = 'boom4_1' + this.funcSet;
					this.scroll = 'boom3_1' + this.funcSet;
					this.pause = 'boom2_1' + this.funcSet;
					this.num = 3
				}
				else if (this.num == 3) {
					this.num = 2;
					// this.clear();
					if (this.keyFlag1 == 0) {
						this.keyFlag1 = 1;
						setTimeout(() => {
							this.keyFlag1 = 0;
						}, 1000);
					}
					this.esc = 'boom1_2' + this.funcSet;
					this.f1 = 'boom16_2' + this.funcSet;
					this.f2 = 'boom15_2' + this.funcSet;
					this.f3 = 'boom14_2' + this.funcSet;
					this.f4 = 'boom13_2' + this.funcSet;
					this.f5 = 'boom12_2' + this.funcSet;
					this.f6 = 'boom11_2' + this.funcSet;
					this.f7 = 'boom10_2' + this.funcSet;
					this.f8 = 'boom9_2' + this.funcSet;
					this.f9 = 'boom8_2' + this.funcSet;
					this.f10 = 'boom7_2' + this.funcSet;
					this.f11 = 'boom6_2' + this.funcSet;
					this.f12 = 'boom5_2' + this.funcSet;
					this.print = 'boom4_2' + this.funcSet;
					this.scroll = 'boom3_2' + this.funcSet;
					this.pause = 'boom2_2' + this.funcSet;
				}
				break;

			case this.vKey == 112 && this.keyStatus == 1: //f1
				if (this.num == 2) {
					// this.clear();
					if (this.keyFlag1 == 0) {
						this.keyFlag1 = 1;
						setTimeout(() => {
							this.keyFlag1 = 0;
						}, 1000);
					}
					this.f1 = 'boom1_1' + this.funcSet;
					this.esc = "boom15_1" + this.funcSet;
					this.f2 = 'boom15_1' + this.funcSet;
					this.f3 = 'boom14_1' + this.funcSet;
					this.f4 = 'boom13_1' + this.funcSet;
					this.f5 = 'boom12_1' + this.funcSet;
					this.f6 = 'boom11_1' + this.funcSet;
					this.f7 = 'boom10_1' + this.funcSet;
					this.f8 = 'boom9_1' + this.funcSet;
					this.f9 = 'boom8_1' + this.funcSet;
					this.f10 = 'boom7_1' + this.funcSet;
					this.f11 = 'boom6_1' + this.funcSet;
					this.f12 = 'boom5_1' + this.funcSet;
					this.print = 'boom4_1' + this.funcSet;
					this.scroll = 'boom3_1' + this.funcSet;
					this.pause = 'boom2_1' + this.funcSet;
					this.num = 3
				}
				else if (this.num == 3) {
					this.num = 2;
					// this.clear();
					if (this.keyFlag1 == 0) {
						this.keyFlag1 = 1;
						setTimeout(() => {
							this.keyFlag1 = 0;
						}, 1000);
					}
					this.f1 = 'boom1_2' + this.funcSet;
					this.esc = "boom15_2" + this.funcSet;
					this.f2 = 'boom15_2' + this.funcSet;
					this.f3 = 'boom14_2' + this.funcSet;
					this.f4 = 'boom13_2' + this.funcSet;
					this.f5 = 'boom12_2' + this.funcSet;
					this.f6 = 'boom11_2' + this.funcSet;
					this.f7 = 'boom10_2' + this.funcSet;
					this.f8 = 'boom9_2' + this.funcSet;
					this.f9 = 'boom8_2' + this.funcSet;
					this.f10 = 'boom7_2' + this.funcSet;
					this.f11 = 'boom6_2' + this.funcSet;
					this.f12 = 'boom5_2' + this.funcSet;
					this.print = 'boom4_2' + this.funcSet;
					this.scroll = 'boom3_2' + this.funcSet;
					this.pause = 'boom2_2' + this.funcSet;
				}
				break;

			case this.vKey == 113 && this.keyStatus == 1: //f2
				if (this.num == 2) {
					// this.clear();
					if (this.keyFlag1 == 0) {
						this.keyFlag1 = 1;
						setTimeout(() => {
							this.keyFlag1 = 0;
						}, 1000);
					}
					this.f2 = 'boom1_1' + this.funcSet;
					this.esc = "boom14_1" + this.funcSet;
					this.f1 = 'boom13_1' + this.funcSet;
					this.f3 = 'boom14_1' + this.funcSet;
					this.f4 = 'boom13_1' + this.funcSet;
					this.f5 = 'boom12_1' + this.funcSet;
					this.f6 = 'boom11_1' + this.funcSet;
					this.f7 = 'boom10_1' + this.funcSet;
					this.f8 = 'boom9_1' + this.funcSet;
					this.f9 = 'boom8_1' + this.funcSet;
					this.f10 = 'boom7_1' + this.funcSet;
					this.f11 = 'boom6_1' + this.funcSet;
					this.f12 = 'boom5_1' + this.funcSet;
					this.print = 'boom4_1' + this.funcSet;
					this.scroll = 'boom3_1' + this.funcSet;
					this.pause = 'boom2_1' + this.funcSet;
					this.num = 3
				}
				else if (this.num == 3) {
					this.num = 2;
					// this.clear();
					if (this.keyFlag1 == 0) {
						this.keyFlag1 = 1;
						setTimeout(() => {
							this.keyFlag1 = 0;
						}, 1000);
					}
					this.f2 = 'boom1_2' + this.funcSet;
					this.esc = "boom14_2" + this.funcSet;
					this.f1 = 'boom13_2' + this.funcSet;
					this.f3 = 'boom14_2' + this.funcSet;
					this.f4 = 'boom13_2' + this.funcSet;
					this.f5 = 'boom12_2' + this.funcSet;
					this.f6 = 'boom11_2' + this.funcSet;
					this.f7 = 'boom10_2' + this.funcSet;
					this.f8 = 'boom9_2' + this.funcSet;
					this.f9 = 'boom8_2' + this.funcSet;
					this.f10 = 'boom7_2' + this.funcSet;
					this.f11 = 'boom6_2' + this.funcSet;
					this.f12 = 'boom5_2' + this.funcSet;
					this.print = 'boom4_2' + this.funcSet;
					this.scroll = 'boom3_2' + this.funcSet;
					this.pause = 'boom2_2' + this.funcSet;
				}
				break;

			case this.vKey == 114 && this.keyStatus == 1: //f3
				if (this.num == 2) {
					// this.clear();
					if (this.keyFlag1 == 0) {
						this.keyFlag1 = 1;
						setTimeout(() => {
							this.keyFlag1 = 0;
						}, 1000);
					}
					this.f3 = 'boom1_1' + this.funcSet;
					this.esc = "boom11_1" + this.funcSet;
					this.f1 = 'boom12_1' + this.funcSet;
					this.f2 = 'boom13_1' + this.funcSet;
					this.f4 = 'boom13_1' + this.funcSet;
					this.f5 = 'boom12_1' + this.funcSet;
					this.f6 = 'boom11_1' + this.funcSet;
					this.f7 = 'boom10_1' + this.funcSet;
					this.f8 = 'boom9_1' + this.funcSet;
					this.f9 = 'boom8_1' + this.funcSet;
					this.f10 = 'boom7_1' + this.funcSet;
					this.f11 = 'boom6_1' + this.funcSet;
					this.f12 = 'boom5_1' + this.funcSet;
					this.print = 'boom4_1' + this.funcSet;
					this.scroll = 'boom3_1' + this.funcSet;
					this.pause = 'boom2_1' + this.funcSet;
					this.num = 3
				}
				else if (this.num == 3) {
					this.num = 2;
					// this.clear();
					if (this.keyFlag1 == 0) {
						this.keyFlag1 = 1;
						setTimeout(() => {
							this.keyFlag1 = 0;
						}, 1000);
					}
					this.f3 = 'boom1_2' + this.funcSet;
					this.esc = "boom11_2" + this.funcSet;
					this.f1 = 'boom12_2' + this.funcSet;
					this.f2 = 'boom13_2' + this.funcSet;
					this.f4 = 'boom13_2' + this.funcSet;
					this.f5 = 'boom12_2' + this.funcSet;
					this.f6 = 'boom11_2' + this.funcSet;
					this.f7 = 'boom10_2' + this.funcSet;
					this.f8 = 'boom9_2' + this.funcSet;
					this.f9 = 'boom8_2' + this.funcSet;
					this.f10 = 'boom7_2' + this.funcSet;
					this.f11 = 'boom6_2' + this.funcSet;
					this.f12 = 'boom5_2' + this.funcSet;
					this.print = 'boom4_2' + this.funcSet;
					this.scroll = 'boom3_2' + this.funcSet;
					this.pause = 'boom2_2' + this.funcSet;
				}
				break;

			case this.vKey == 115 && this.keyStatus == 1: //f4
				if (this.num == 2) {
					// this.clear();
					if (this.keyFlag1 == 0) {
						this.keyFlag1 = 1;
						setTimeout(() => {
							this.keyFlag1 = 0;
						}, 1000);
					}
					this.f4 = 'boom1_1' + this.funcSet;
					this.esc = "boom8_1" + this.funcSet;
					this.f1 = 'boom9_1' + this.funcSet;
					this.f2 = 'boom10_1' + this.funcSet;
					this.f3 = 'boom11_1' + this.funcSet;
					this.f5 = 'boom11_1' + this.funcSet;
					this.f6 = 'boom10_1' + this.funcSet;
					this.f7 = 'boom9_1' + this.funcSet;
					this.f8 = 'boom8_1' + this.funcSet;
					this.f9 = 'boom7_1' + this.funcSet;
					this.f10 = 'boom6_1' + this.funcSet;
					this.f11 = 'boom5_1' + this.funcSet;
					this.f12 = 'boom4_1' + this.funcSet;
					this.print = 'boom4_1' + this.funcSet;
					this.scroll = 'boom3_1' + this.funcSet;
					this.pause = 'boom2_1' + this.funcSet;
					this.num = 3
				}
				else if (this.num == 3) {
					this.num = 2;
					// this.clear();
					if (this.keyFlag1 == 0) {
						this.keyFlag1 = 1;
						setTimeout(() => {
							this.keyFlag1 = 0;
						}, 1000);
					}
					this.f4 = 'boom1_2' + this.funcSet;
					this.esc = "boom8_2" + this.funcSet;
					this.f1 = 'boom9_2' + this.funcSet;
					this.f2 = 'boom10_2' + this.funcSet;
					this.f3 = 'boom11_2' + this.funcSet;
					this.f5 = 'boom11_2' + this.funcSet;
					this.f6 = 'boom10_2' + this.funcSet;
					this.f7 = 'boom9_2' + this.funcSet;
					this.f8 = 'boom8_2' + this.funcSet;
					this.f9 = 'boom7_2' + this.funcSet;
					this.f10 = 'boom6_2' + this.funcSet;
					this.f11 = 'boom5_2' + this.funcSet;
					this.f12 = 'boom4_2' + this.funcSet;
					this.print = 'boom4_2' + this.funcSet;
					this.scroll = 'boom3_2' + this.funcSet;
					this.pause = 'boom2_2' + this.funcSet;
				}
				break;

			case this.vKey == 116 && this.keyStatus == 1: //f5
				if (this.num == 2) {
					// this.clear();
					if (this.keyFlag1 == 0) {
						this.keyFlag1 = 1;
						setTimeout(() => {
							this.keyFlag1 = 0;
						}, 1000);
					}
					this.f5 = 'boom1_1' + this.funcSet;
					this.esc = "boom8_1" + this.funcSet;
					this.f1 = 'boom9_1' + this.funcSet;
					this.f2 = 'boom9_1' + this.funcSet;
					this.f3 = 'boom10_1' + this.funcSet;
					this.f4 = 'boom11_1' + this.funcSet;
					this.f6 = 'boom11_1' + this.funcSet;
					this.f7 = 'boom10_1' + this.funcSet;
					this.f8 = 'boom9_1' + this.funcSet;
					this.f9 = 'boom8_1' + this.funcSet;
					this.f10 = 'boom7_1' + this.funcSet;
					this.f11 = 'boom6_1' + this.funcSet;
					this.f12 = 'boom5_1' + this.funcSet;
					this.print = 'boom4_1' + this.funcSet;
					this.scroll = 'boom3_1' + this.funcSet;
					this.pause = 'boom2_1' + this.funcSet;
					this.num = 3
				}
				else if (this.num == 3) {
					this.num = 2;
					// this.clear();
					if (this.keyFlag1 == 0) {
						this.keyFlag1 = 1;
						setTimeout(() => {
							this.keyFlag1 = 0;
						}, 1000);
					}
					this.f5 = 'boom1_2' + this.funcSet;
					this.esc = "boom7_2" + this.funcSet;
					this.f1 = 'boom8_2' + this.funcSet;
					this.f2 = 'boom9_2' + this.funcSet;
					this.f3 = 'boom10_2' + this.funcSet;
					this.f4 = 'boom11_2' + this.funcSet;
					this.f6 = 'boom11_2' + this.funcSet;
					this.f7 = 'boom10_2' + this.funcSet;
					this.f8 = 'boom9_2' + this.funcSet;
					this.f9 = 'boom8_2' + this.funcSet;
					this.f10 = 'boom7_2' + this.funcSet;
					this.f11 = 'boom6_2' + this.funcSet;
					this.f12 = 'boom5_2' + this.funcSet;
					this.print = 'boom4_2' + this.funcSet;
					this.scroll = 'boom3_2' + this.funcSet;
					this.pause = 'boom2_2' + this.funcSet;
				}
				break;

			case this.vKey == 117 && this.keyStatus == 1: //f6
				if (this.num == 2) {
					// this.clear();
					if (this.keyFlag1 == 0) {
						this.keyFlag1 = 1;
						setTimeout(() => {
							this.keyFlag1 = 0;
						}, 1000);
					}
					this.f6 = 'boom1_1' + this.funcSet;
					this.esc = "boom5_1" + this.funcSet;
					this.f1 = 'boom6_1' + this.funcSet;
					this.f2 = 'boom7_1' + this.funcSet;
					this.f3 = 'boom8_1' + this.funcSet;
					this.f4 = 'boom9_1' + this.funcSet;
					this.f5 = 'boom10_1' + this.funcSet;
					this.f7 = 'boom10_1' + this.funcSet;
					this.f8 = 'boom9_1' + this.funcSet;
					this.f9 = 'boom8_1' + this.funcSet;
					this.f10 = 'boom7_1' + this.funcSet;
					this.f11 = 'boom6_1' + this.funcSet;
					this.f12 = 'boom5_1' + this.funcSet;
					this.print = 'boom4_1' + this.funcSet;
					this.scroll = 'boom3_1' + this.funcSet;
					this.pause = 'boom2_1' + this.funcSet;
					this.num = 3
				}
				else if (this.num == 3) {
					this.num = 2;
					// this.clear();
					if (this.keyFlag1 == 0) {
						this.keyFlag1 = 1;
						setTimeout(() => {
							this.keyFlag1 = 0;
						}, 1000);
					}
					this.f6 = 'boom1_2' + this.funcSet;
					this.esc = "boom5_2" + this.funcSet;
					this.f1 = 'boom6_2' + this.funcSet;
					this.f2 = 'boom7_2' + this.funcSet;
					this.f3 = 'boom8_2' + this.funcSet;
					this.f4 = 'boom9_2' + this.funcSet;
					this.f5 = 'boom10_2' + this.funcSet;
					this.f7 = 'boom10_2' + this.funcSet;
					this.f8 = 'boom9_2' + this.funcSet;
					this.f9 = 'boom8_2' + this.funcSet;
					this.f10 = 'boom7_2' + this.funcSet;
					this.f11 = 'boom6_2' + this.funcSet;
					this.f12 = 'boom5_2' + this.funcSet;
					this.print = 'boom4_2' + this.funcSet;
					this.scroll = 'boom3_2' + this.funcSet;
					this.pause = 'boom2_2' + this.funcSet;
				}
				break;

			case this.vKey == 118 && this.keyStatus == 1: //f7
				if (this.num == 2) {
					// this.clear();
					if (this.keyFlag1 == 0) {
						this.keyFlag1 = 1;
						setTimeout(() => {
							this.keyFlag1 = 0;
						}, 1000);
					}
					this.f7 = 'boom1_1' + this.funcSet;
					this.esc = "boom3_1" + this.funcSet;
					this.f1 = 'boom4_1' + this.funcSet;
					this.f2 = 'boom5_1' + this.funcSet;
					this.f3 = 'boom6_1' + this.funcSet;
					this.f4 = 'boom7_1' + this.funcSet;
					this.f5 = 'boom8_1' + this.funcSet;
					this.f6 = 'boom9_1' + this.funcSet;
					this.f8 = 'boom9_1' + this.funcSet;
					this.f9 = 'boom8_1' + this.funcSet;
					this.f10 = 'boom7_1' + this.funcSet;
					this.f11 = 'boom6_1' + this.funcSet;
					this.f12 = 'boom5_1' + this.funcSet;
					this.print = 'boom4_1' + this.funcSet;
					this.scroll = 'boom3_1' + this.funcSet;
					this.pause = 'boom2_1' + this.funcSet;
					this.num = 3
				}
				else if (this.num == 3) {
					this.num = 2;
					// this.clear();
					if (this.keyFlag1 == 0) {
						this.keyFlag1 = 1;
						setTimeout(() => {
							this.keyFlag1 = 0;
						}, 1000);
					}
					this.f7 = 'boom1_1' + this.funcSet;
					this.esc = "boom3_1" + this.funcSet;
					this.f1 = 'boom4_1' + this.funcSet;
					this.f2 = 'boom5_1' + this.funcSet;
					this.f3 = 'boom6_1' + this.funcSet;
					this.f4 = 'boom7_1' + this.funcSet;
					this.f5 = 'boom8_1' + this.funcSet;
					this.f6 = 'boom9_1' + this.funcSet;
					this.f8 = 'boom9_1' + this.funcSet;
					this.f9 = 'boom8_1' + this.funcSet;
					this.f10 = 'boom7_1' + this.funcSet;
					this.f11 = 'boom6_1' + this.funcSet;
					this.f12 = 'boom5_1' + this.funcSet;
					this.print = 'boom4_1' + this.funcSet;
					this.scroll = 'boom3_1' + this.funcSet;
					this.pause = 'boom2_1' + this.funcSet;
				}
				break;

			case this.vKey == 119 && this.keyStatus == 1: //f8
				if (this.num == 2) {
					// this.clear();
					if (this.keyFlag1 == 0) {
						this.keyFlag1 = 1;
						setTimeout(() => {
							this.keyFlag1 = 0;
						}, 1000);
					}
					this.f8 = 'boom1_1' + this.funcSet;
					this.esc = "boom2_1" + this.funcSet;
					this.f1 = 'boom3_1' + this.funcSet;
					this.f2 = 'boom4_1' + this.funcSet;
					this.f3 = 'boom5_1' + this.funcSet;
					this.f4 = 'boom6_1' + this.funcSet;
					this.f5 = 'boom7_1' + this.funcSet;
					this.f6 = 'boom8_1' + this.funcSet;
					this.f7 = 'boom9_1' + this.funcSet;
					this.f9 = 'boom9_1' + this.funcSet;
					this.f10 = 'boom8_1' + this.funcSet;
					this.f11 = 'boom7_1' + this.funcSet;
					this.f12 = 'boom6_1' + this.funcSet;
					this.print = 'boom5_1' + this.funcSet;
					this.scroll = 'boom4_1' + this.funcSet;
					this.pause = 'boom3_1' + this.funcSet;
					this.num = 3
				}
				else if (this.num == 3) {
					this.num = 2;
					// this.clear();
					if (this.keyFlag1 == 0) {
						this.keyFlag1 = 1;
						setTimeout(() => {
							this.keyFlag1 = 0;
						}, 1000);
					}
					this.f8 = 'boom1_2' + this.funcSet;
					this.esc = "boom2_2" + this.funcSet;
					this.f1 = 'boom3_2' + this.funcSet;
					this.f2 = 'boom4_2' + this.funcSet;
					this.f3 = 'boom5_2' + this.funcSet;
					this.f4 = 'boom6_2' + this.funcSet;
					this.f5 = 'boom7_2' + this.funcSet;
					this.f6 = 'boom8_2' + this.funcSet;
					this.f7 = 'boom9_2' + this.funcSet;
					this.f9 = 'boom9_2' + this.funcSet;
					this.f10 = 'boom8_2' + this.funcSet;
					this.f11 = 'boom7_2' + this.funcSet;
					this.f12 = 'boom6_2' + this.funcSet;
					this.print = 'boom5_2' + this.funcSet;
					this.scroll = 'boom4_2' + this.funcSet;
					this.pause = 'boom3_2' + this.funcSet;
				}
				break;

			case this.vKey == 120 && this.keyStatus == 1: //f9
				if (this.num == 2) {
					// this.clear();
					if (this.keyFlag1 == 0) {
						this.keyFlag1 = 1;
						setTimeout(() => {
							this.keyFlag1 = 0;
						}, 1000);
					}
					this.f9 = 'boom1_1' + this.funcSet;
					this.esc = "boom2_1" + this.funcSet;
					this.f1 = 'boom3_1' + this.funcSet;
					this.f2 = 'boom4_1' + this.funcSet;
					this.f3 = 'boom5_1' + this.funcSet;
					this.f4 = 'boom6_1' + this.funcSet;
					this.f5 = 'boom7_1' + this.funcSet;
					this.f6 = 'boom8_1' + this.funcSet;
					this.f7 = 'boom9_1' + this.funcSet;
					this.f8 = 'boom10_1' + this.funcSet;
					this.f10 = 'boom10_1' + this.funcSet;
					this.f11 = 'boom9_1' + this.funcSet;
					this.f12 = 'boom8_1' + this.funcSet;
					this.print = 'boom7_1' + this.funcSet;
					this.scroll = 'boom6_1' + this.funcSet;
					this.pause = 'boom5_1' + this.funcSet;
					this.num = 3
				}
				else if (this.num == 3) {
					this.num = 2;
					// this.clear();
					if (this.keyFlag1 == 0) {
						this.keyFlag1 = 1;
						setTimeout(() => {
							this.keyFlag1 = 0;
						}, 1000);
					}
					this.f9 = 'boom1_2' + this.funcSet;
					this.esc = "boom2_2" + this.funcSet;
					this.f1 = 'boom3_2' + this.funcSet;
					this.f2 = 'boom4_2' + this.funcSet;
					this.f3 = 'boom5_2' + this.funcSet;
					this.f4 = 'boom6_2' + this.funcSet;
					this.f5 = 'boom7_2' + this.funcSet;
					this.f6 = 'boom8_2' + this.funcSet;
					this.f7 = 'boom9_2' + this.funcSet;
					this.f8 = 'boom10_2' + this.funcSet;
					this.f10 = 'boom10_2' + this.funcSet;
					this.f11 = 'boom9_2' + this.funcSet;
					this.f12 = 'boom8_2' + this.funcSet;
					this.print = 'boom7_2' + this.funcSet;
					this.scroll = 'boom6_2' + this.funcSet;
					this.pause = 'boom5_2' + this.funcSet;
				}
				break;

			case this.vKey == 121 && this.keyStatus == 1: //f10
				if (this.num == 2) {
					// this.clear();
					if (this.keyFlag1 == 0) {
						this.keyFlag1 = 1;
						setTimeout(() => {
							this.keyFlag1 = 0;
						}, 1000);
					}
					this.f10 = 'boom1_1' + this.funcSet;
					this.esc = "boom2_1" + this.funcSet;
					this.f1 = 'boom3_1' + this.funcSet;
					this.f2 = 'boom4_1' + this.funcSet;
					this.f3 = 'boom5_1' + this.funcSet;
					this.f4 = 'boom6_1' + this.funcSet;
					this.f5 = 'boom7_1' + this.funcSet;
					this.f6 = 'boom8_1' + this.funcSet;
					this.f7 = 'boom9_1' + this.funcSet;
					this.f8 = 'boom10_1' + this.funcSet;
					this.f9 = 'boom11_1' + this.funcSet;
					this.f11 = 'boom11_1' + this.funcSet;
					this.f12 = 'boom10_1' + this.funcSet;
					this.print = 'boom9_1' + this.funcSet;
					this.scroll = 'boom8_1' + this.funcSet;
					this.pause = 'boom7_1' + this.funcSet;
					this.num = 3
				}
				else if (this.num == 3) {
					this.num = 2;
					// this.clear();
					if (this.keyFlag1 == 0) {
						this.keyFlag1 = 1;
						setTimeout(() => {
							this.keyFlag1 = 0;
						}, 1000);
					}
					this.f10 = 'boom1_2' + this.funcSet;
					this.esc = "boom2_2" + this.funcSet;
					this.f1 = 'boom3_2' + this.funcSet;
					this.f2 = 'boom4_2' + this.funcSet;
					this.f3 = 'boom5_2' + this.funcSet;
					this.f4 = 'boom6_2' + this.funcSet;
					this.f5 = 'boom7_2' + this.funcSet;
					this.f6 = 'boom8_2' + this.funcSet;
					this.f7 = 'boom9_2' + this.funcSet;
					this.f8 = 'boom10_2' + this.funcSet;
					this.f9 = 'boom11_2' + this.funcSet;
					this.f11 = 'boom11_2' + this.funcSet;
					this.f12 = 'boom10_2' + this.funcSet;
					this.print = 'boom9_2' + this.funcSet;
					this.scroll = 'boom8_2' + this.funcSet;
					this.pause = 'boom7_2' + this.funcSet;
				}
				break;

			case this.vKey == 122 && this.keyStatus == 1: //f11
				if (this.num == 2) {
					// this.clear();
					if (this.keyFlag1 == 0) {
						this.keyFlag1 = 1;
						setTimeout(() => {
							this.keyFlag1 = 0;
						}, 1000);
					}
					this.f11 = 'boom1' + this.funcSet;
					this.esc = "boom2" + this.funcSet;
					this.f1 = 'boom3' + this.funcSet;
					this.f2 = 'boom4' + this.funcSet;
					this.f3 = 'boom5' + this.funcSet;
					this.f4 = 'boom6' + this.funcSet;
					this.f5 = 'boom7' + this.funcSet;
					this.f6 = 'boom8' + this.funcSet;
					this.f7 = 'boom9' + this.funcSet;
					this.f8 = 'boom10' + this.funcSet;
					this.f9 = 'boom11' + this.funcSet;
					this.f10 = 'boom12' + this.funcSet;
					this.f12 = 'boom12' + this.funcSet;
					this.print = 'boom11' + this.funcSet;
					this.scroll = 'boom10' + this.funcSet;
					this.pause = 'boom9' + this.funcSet;
					this.num = 3
				}
				else if (this.num == 3) {
					this.num = 2;
					// this.clear();
					if (this.keyFlag1 == 0) {
						this.keyFlag1 = 1;
						setTimeout(() => {
							this.keyFlag1 = 0;
						}, 1000);
					}
					this.f11 = 'boom1' + this.funcSet;
					this.esc = "boom2" + this.funcSet;
					this.f1 = 'boom3' + this.funcSet;
					this.f2 = 'boom4' + this.funcSet;
					this.f3 = 'boom5' + this.funcSet;
					this.f4 = 'boom6' + this.funcSet;
					this.f5 = 'boom7' + this.funcSet;
					this.f6 = 'boom8' + this.funcSet;
					this.f7 = 'boom9' + this.funcSet;
					this.f8 = 'boom10' + this.funcSet;
					this.f9 = 'boom11' + this.funcSet;
					this.f10 = 'boom12' + this.funcSet;
					this.f12 = 'boom12' + this.funcSet;
					this.print = 'boom11' + this.funcSet;
					this.scroll = 'boom10' + this.funcSet;
					this.pause = 'boom9' + this.funcSet;
				}
				break;

			case this.vKey == 123 && this.keyStatus == 1: //f12
				if (this.num == 2) {
					// this.clear();
					if (this.keyFlag1 == 0) {
						this.keyFlag1 = 1;
						setTimeout(() => {
							this.keyFlag1 = 0;
						}, 1000);
					}
					this.f12 = 'boom1_1' + this.funcSet;
					this.esc = "boom2_1" + this.funcSet;
					this.f1 = 'boom3_1' + this.funcSet;
					this.f2 = 'boom4_1' + this.funcSet;
					this.f3 = 'boom5_1' + this.funcSet;
					this.f4 = 'boom6_1' + this.funcSet;
					this.f5 = 'boom7_1' + this.funcSet;
					this.f6 = 'boom8_1' + this.funcSet;
					this.f7 = 'boom9_1' + this.funcSet;
					this.f8 = 'boom10_1' + this.funcSet;
					this.f9 = 'boom11_1' + this.funcSet;
					this.f10 = 'boom12_1' + this.funcSet;
					this.f11 = 'boom13_1' + this.funcSet;
					this.print = 'boom13_1' + this.funcSet;
					this.scroll = 'boom12_1' + this.funcSet;
					this.pause = 'boom11_1' + this.funcSet;
					this.num = 3
				}
				else if (this.num == 3) {
					this.num = 2;
					// this.clear();
					if (this.keyFlag1 == 0) {
						this.keyFlag1 = 1;
						setTimeout(() => {
							this.keyFlag1 = 0;
						}, 1000);
					}
					this.f12 = 'boom1_2' + this.funcSet;
					this.esc = "boom2_2" + this.funcSet;
					this.f1 = 'boom3_2' + this.funcSet;
					this.f2 = 'boom4_2' + this.funcSet;
					this.f3 = 'boom5_2' + this.funcSet;
					this.f4 = 'boom6_2' + this.funcSet;
					this.f5 = 'boom7_2' + this.funcSet;
					this.f6 = 'boom8_2' + this.funcSet;
					this.f7 = 'boom9_2' + this.funcSet;
					this.f8 = 'boom10_2' + this.funcSet;
					this.f9 = 'boom11_2' + this.funcSet;
					this.f10 = 'boom12_2' + this.funcSet;
					this.f11 = 'boom13_2' + this.funcSet;
					this.print = 'boom13_2' + this.funcSet;
					this.scroll = 'boom12_2' + this.funcSet;
					this.pause = 'boom11_2' + this.funcSet;
				}
				break;

			case this.vKey == 145 && this.keyStatus == 1: //scroll
				if (this.num == 2) {
					// this.clear();
					if (this.keyFlag1 == 0) {
						this.keyFlag1 = 1;
						setTimeout(() => {
							this.keyFlag1 = 0;
						}, 1000);
					}
					this.scroll = 'boom1_1' + this.funcSet;
					this.esc = "boom2_1" + this.funcSet;
					this.f1 = 'boom3_1' + this.funcSet;
					this.f2 = 'boom4_1' + this.funcSet;
					this.f3 = 'boom5_1' + this.funcSet;
					this.f4 = 'boom6_1' + this.funcSet;
					this.f5 = 'boom7_1' + this.funcSet;
					this.f6 = 'boom8_1' + this.funcSet;
					this.f7 = 'boom9_1' + this.funcSet;
					this.f8 = 'boom10_1' + this.funcSet;
					this.f9 = 'boom11_1' + this.funcSet;
					this.f10 = 'boom12_1' + this.funcSet;
					this.f11 = 'boom13_1' + this.funcSet;
					this.f12 = 'boom14_1' + this.funcSet;
					this.print = 'boom15_1' + this.funcSet;
					this.pause = 'boom15_1' + this.funcSet;
					this.num = 3
				}
				else if (this.num == 3) {
					this.num = 2;
					// this.clear();
					if (this.keyFlag1 == 0) {
						this.keyFlag1 = 1;
						setTimeout(() => {
							this.keyFlag1 = 0;
						}, 1000);
					}
					this.scroll = 'boom1_2' + this.funcSet;
					this.esc = "boom2_2" + this.funcSet;
					this.f1 = 'boom3_2' + this.funcSet;
					this.f2 = 'boom4_2' + this.funcSet;
					this.f3 = 'boom5_2' + this.funcSet;
					this.f4 = 'boom6_2' + this.funcSet;
					this.f5 = 'boom7_2' + this.funcSet;
					this.f6 = 'boom8_2' + this.funcSet;
					this.f7 = 'boom9_2' + this.funcSet;
					this.f8 = 'boom10_2' + this.funcSet;
					this.f9 = 'boom11_2' + this.funcSet;
					this.f10 = 'boom12_2' + this.funcSet;
					this.f11 = 'boom13_2' + this.funcSet;
					this.f12 = 'boom14_2' + this.funcSet;
					this.print = 'boom15_2' + this.funcSet;
					this.pause = 'boom15_2' + this.funcSet;
				}
				break;

			case this.vKey == 19 && this.keyStatus == 1: //pause
				if (this.num == 2) {
					// this.clear();
					if (this.keyFlag1 == 0) {
						this.keyFlag1 = 1;
						setTimeout(() => {
							this.keyFlag1 = 0;
						}, 1000);
					}
					this.pause = 'boom1_1' + this.funcSet;
					this.esc = "boom2_1" + this.funcSet;
					this.f1 = 'boom3_1' + this.funcSet;
					this.f2 = 'boom4_1' + this.funcSet;
					this.f3 = 'boom5_1' + this.funcSet;
					this.f4 = 'boom6_1' + this.funcSet;
					this.f5 = 'boom7_1' + this.funcSet;
					this.f6 = 'boom8_1' + this.funcSet;
					this.f7 = 'boom9_1' + this.funcSet;
					this.f8 = 'boom10_1' + this.funcSet;
					this.f9 = 'boom11_1' + this.funcSet;
					this.f10 = 'boom12_1' + this.funcSet;
					this.f11 = 'boom13_1' + this.funcSet;
					this.f12 = 'boom14_1' + this.funcSet;
					this.print = 'boom15_1' + this.funcSet;
					this.scroll = 'boom16_1' + this.funcSet;
					this.num = 3
				}
				else if (this.num == 3) {
					this.num = 2;
					// this.clear();
					if (this.keyFlag1 == 0) {
						this.keyFlag1 = 1;
						setTimeout(() => {
							this.keyFlag1 = 0;
						}, 1000);
					}
					this.pause = 'boom1_2' + this.funcSet;
					this.esc = "boom2_2" + this.funcSet;
					this.f1 = 'boom3_2' + this.funcSet;
					this.f2 = 'boom4_2' + this.funcSet;
					this.f3 = 'boom5_2' + this.funcSet;
					this.f4 = 'boom6_2' + this.funcSet;
					this.f5 = 'boom7_2' + this.funcSet;
					this.f6 = 'boom8_2' + this.funcSet;
					this.f7 = 'boom9_2' + this.funcSet;
					this.f8 = 'boom10_2' + this.funcSet;
					this.f9 = 'boom11_2' + this.funcSet;
					this.f10 = 'boom12_2' + this.funcSet;
					this.f11 = 'boom13_2' + this.funcSet;
					this.f12 = 'boom14_2' + this.funcSet;
					this.print = 'boom15_2' + this.funcSet;
					this.scroll = 'boom16_2' + this.funcSet;
				}
				break;

			case this.vKey == 192 && this.keyStatus == 1: //perid
				if (this.num == 2) {
					// this.clear();
					if (this.keyFlag1 == 0) {
						this.keyFlag1 = 1;
						setTimeout(() => {
							this.keyFlag1 = 0;
						}, 1000);
					}
					this.perid = "boom1_1" + this.funcSet;
					this.n1 = "boom21_1" + this.funcSet;
					this.n2 = "boom20_1" + this.funcSet;
					this.n3 = "boom19_1" + this.funcSet;
					this.n4 = "boom18_1" + this.funcSet;
					this.n5 = "boom17_1" + this.funcSet;
					this.n6 = "boom16_1" + this.funcSet;
					this.n7 = "boom15_1" + this.funcSet;
					this.n8 = "boom14_1" + this.funcSet;
					this.n9 = "boom13_1" + this.funcSet;
					this.n0 = "boom12_1" + this.funcSet;
					this.minus = "boom11_1" + this.funcSet;
					this.plus = "boom10_1" + this.funcSet;
					this.bsp = "boom9_1" + this.funcSet;
					this.insert = "boom8_1" + this.funcSet;
					this.home = "boom7_1" + this.funcSet;
					this.pup = "boom6_1" + this.funcSet;
					this.numlock = "boom5_1" + this.funcSet;
					this.numdrawn = "boom4_1" + this.funcSet;
					this.numtimes = "boom3_1" + this.funcSet;
					this.numminus = "boom2_1" + this.funcSet;
					this.num = 3
				}
				else if (this.num == 3) {
					this.num = 2;
					// this.clear();
					if (this.keyFlag1 == 0) {
						this.keyFlag1 = 1;
						setTimeout(() => {
							this.keyFlag1 = 0;
						}, 1000);
					}
					this.perid = "boom1_2" + this.funcSet;
					this.n1 = "boom21_2" + this.funcSet;
					this.n2 = "boom20_2" + this.funcSet;
					this.n3 = "boom19_2" + this.funcSet;
					this.n4 = "boom18_2" + this.funcSet;
					this.n5 = "boom17_2" + this.funcSet;
					this.n6 = "boom16_2" + this.funcSet;
					this.n7 = "boom15_2" + this.funcSet;
					this.n8 = "boom14_2" + this.funcSet;
					this.n9 = "boom13_2" + this.funcSet;
					this.n0 = "boom12_2" + this.funcSet;
					this.minus = "boom11_2" + this.funcSet;
					this.plus = "boom10_2" + this.funcSet;
					this.bsp = "boom9_2" + this.funcSet;
					this.insert = "boom8_2" + this.funcSet;
					this.home = "boom7_2" + this.funcSet;
					this.pup = "boom6_2" + this.funcSet;
					this.numlock = "boom5_2" + this.funcSet;
					this.numdrawn = "boom4_2" + this.funcSet;
					this.numtimes = "boom3_2" + this.funcSet;
					this.numminus = "boom2_2" + this.funcSet;
				}
				break;

			case this.vKey == 49 && this.keyStatus == 1: //n1
				if (this.num == 2) {
					// this.clear();
					if (this.keyFlag1 == 0) {
						this.keyFlag1 = 1;
						setTimeout(() => {
							this.keyFlag1 = 0;
						}, 1000);
					}
					this.n1 = 'boom1_1' + this.funcSet;
					this.perid = "boom20_1" + this.funcSet;
					this.n2 = "boom20_1" + this.funcSet;
					this.n3 = "boom19_1" + this.funcSet;
					this.n4 = "boom18_1" + this.funcSet;
					this.n5 = "boom17_1" + this.funcSet;
					this.n6 = "boom16_1" + this.funcSet;
					this.n7 = "boom15_1" + this.funcSet;
					this.n8 = "boom14_1" + this.funcSet;
					this.n9 = "boom13_1" + this.funcSet;
					this.n0 = "boom12_1" + this.funcSet;
					this.minus = "boom11_1" + this.funcSet;
					this.plus = "boom10_1" + this.funcSet;
					this.bsp = "boom9_1" + this.funcSet;
					this.insert = "boom8_1" + this.funcSet;
					this.home = "boom7_1" + this.funcSet;
					this.pup = "boom6_1" + this.funcSet;
					this.numlock = "boom5_1" + this.funcSet;
					this.numdrawn = "boom4_1" + this.funcSet;
					this.numtimes = "boom3_1" + this.funcSet;
					this.numminus = "boom2_1" + this.funcSet;
					this.num = 3
				}
				else if (this.num == 3) {
					this.num = 2;
					// this.clear();
					if (this.keyFlag1 == 0) {
						this.keyFlag1 = 1;
						setTimeout(() => {
							this.keyFlag1 = 0;
						}, 1000);
					}
					this.n1 = 'boom1_2' + this.funcSet;
					this.perid = "boom20_2" + this.funcSet;
					this.n2 = "boom20_2" + this.funcSet;
					this.n3 = "boom19_2" + this.funcSet;
					this.n4 = "boom18_2" + this.funcSet;
					this.n5 = "boom17_2" + this.funcSet;
					this.n6 = "boom16_2" + this.funcSet;
					this.n7 = "boom15_2" + this.funcSet;
					this.n8 = "boom14_2" + this.funcSet;
					this.n9 = "boom13_2" + this.funcSet;
					this.n0 = "boom12_2" + this.funcSet;
					this.minus = "boom11_2" + this.funcSet;
					this.plus = "boom10_2" + this.funcSet;
					this.bsp = "boom9_2" + this.funcSet;
					this.insert = "boom8_2" + this.funcSet;
					this.home = "boom7_2" + this.funcSet;
					this.pup = "boom6_2" + this.funcSet;
					this.numlock = "boom5_2" + this.funcSet;
					this.numdrawn = "boom4_2" + this.funcSet;
					this.numtimes = "boom3_2" + this.funcSet;
					this.numminus = "boom2_2" + this.funcSet;
				}
				break;

			case this.vKey == 50 && this.keyStatus == 1: //n2
				if (this.num == 2) {
					// this.clear();
					if (this.keyFlag1 == 0) {
						this.keyFlag1 = 1;
						setTimeout(() => {
							this.keyFlag1 = 0;
						}, 1000);
					}
					this.n2 = 'boom1_1' + this.funcSet;
					this.perid = "boom18_1" + this.funcSet;
					this.n1 = "boom19_1" + this.funcSet;
					this.n3 = "boom19_1" + this.funcSet;
					this.n4 = "boom18_1" + this.funcSet;
					this.n5 = "boom17_1" + this.funcSet;
					this.n6 = "boom16_1" + this.funcSet;
					this.n7 = "boom15_1" + this.funcSet;
					this.n8 = "boom14_1" + this.funcSet;
					this.n9 = "boom13_1" + this.funcSet;
					this.n0 = "boom12_1" + this.funcSet;
					this.minus = "boom11_1" + this.funcSet;
					this.plus = "boom10_1" + this.funcSet;
					this.bsp = "boom9_1" + this.funcSet;
					this.insert = "boom8_1" + this.funcSet;
					this.home = "boom7_1" + this.funcSet;
					this.pup = "boom6_1" + this.funcSet;
					this.numlock = "boom5_1" + this.funcSet;
					this.numdrawn = "boom4_1" + this.funcSet;
					this.numtimes = "boom3_1" + this.funcSet;
					this.numminus = "boom2_1" + this.funcSet;
					this.num = 3
				}
				else if (this.num == 3) {
					this.num = 2;
					// this.clear();
					if (this.keyFlag1 == 0) {
						this.keyFlag1 = 1;
						setTimeout(() => {
							this.keyFlag1 = 0;
						}, 1000);
					}
					this.n2 = 'boom1_2' + this.funcSet;
					this.perid = "boom18_2" + this.funcSet;
					this.n1 = "boom19_2" + this.funcSet;
					this.n3 = "boom19_2" + this.funcSet;
					this.n4 = "boom18_2" + this.funcSet;
					this.n5 = "boom17_2" + this.funcSet;
					this.n6 = "boom16_2" + this.funcSet;
					this.n7 = "boom15_2" + this.funcSet;
					this.n8 = "boom14_2" + this.funcSet;
					this.n9 = "boom13_2" + this.funcSet;
					this.n0 = "boom12_2" + this.funcSet;
					this.minus = "boom11_2" + this.funcSet;
					this.plus = "boom10_2" + this.funcSet;
					this.bsp = "boom9_2" + this.funcSet;
					this.insert = "boom8_2" + this.funcSet;
					this.home = "boom7_2" + this.funcSet;
					this.pup = "boom6_2" + this.funcSet;
					this.numlock = "boom5_2" + this.funcSet;
					this.numdrawn = "boom4_2" + this.funcSet;
					this.numtimes = "boom3_2" + this.funcSet;
					this.numminus = "boom2_2" + this.funcSet;
				}
				break;

			case this.vKey == 51 && this.keyStatus == 1: //n3
				if (this.num == 2) {
					// this.clear();
					if (this.keyFlag1 == 0) {
						this.keyFlag1 = 1;
						setTimeout(() => {
							this.keyFlag1 = 0;
						}, 1000);
					}
					this.n3 = 'boom1_1' + this.funcSet;
					this.perid = "boom14_1" + this.funcSet;
					this.n1 = "boom15_1" + this.funcSet;
					this.n2 = "boom16_1" + this.funcSet;
					this.n4 = "boom17_1" + this.funcSet;
					this.n5 = "boom17_1" + this.funcSet;
					this.n6 = "boom16_1" + this.funcSet;
					this.n7 = "boom15_1" + this.funcSet;
					this.n8 = "boom14_1" + this.funcSet;
					this.n9 = "boom13_1" + this.funcSet;
					this.n0 = "boom12_1" + this.funcSet;
					this.minus = "boom11_1" + this.funcSet;
					this.plus = "boom10_1" + this.funcSet;
					this.bsp = "boom9_1" + this.funcSet;
					this.insert = "boom8_1" + this.funcSet;
					this.home = "boom7_1" + this.funcSet;
					this.pup = "boom6_1" + this.funcSet;
					this.numlock = "boom5_1" + this.funcSet;
					this.numdrawn = "boom4_1" + this.funcSet;
					this.numtimes = "boom3_1" + this.funcSet;
					this.numminus = "boom2_1" + this.funcSet;
					this.num = 3
				}
				else if (this.num == 3) {
					this.num = 2;
					// this.clear();
					if (this.keyFlag1 == 0) {
						this.keyFlag1 = 1;
						setTimeout(() => {
							this.keyFlag1 = 0;
						}, 1000);
					}
					this.n3 = 'boom1_2' + this.funcSet;
					this.perid = "boom14_2" + this.funcSet;
					this.n1 = "boom15_2" + this.funcSet;
					this.n2 = "boom16_2" + this.funcSet;
					this.n4 = "boom17_2" + this.funcSet;
					this.n5 = "boom17_2" + this.funcSet;
					this.n6 = "boom16_2" + this.funcSet;
					this.n7 = "boom15_2" + this.funcSet;
					this.n8 = "boom14_2" + this.funcSet;
					this.n9 = "boom13_2" + this.funcSet;
					this.n0 = "boom12_2" + this.funcSet;
					this.minus = "boom11_2" + this.funcSet;
					this.plus = "boom10_2" + this.funcSet;
					this.bsp = "boom9_2" + this.funcSet;
					this.insert = "boom8_2" + this.funcSet;
					this.home = "boom7_2" + this.funcSet;
					this.pup = "boom6_2" + this.funcSet;
					this.numlock = "boom5_2" + this.funcSet;
					this.numdrawn = "boom4_2" + this.funcSet;
					this.numtimes = "boom3_2" + this.funcSet;
					this.numminus = "boom2_2" + this.funcSet;
				}
				break;

			case this.vKey == 52 && this.keyStatus == 1: //n4
				if (this.num == 2) {
					// this.clear();
					if (this.keyFlag1 == 0) {
						this.keyFlag1 = 1;
						setTimeout(() => {
							this.keyFlag1 = 0;
						}, 1000);
					}
					this.n4 = 'boom1_1' + this.funcSet;
					this.perid = "boom14_1" + this.funcSet;
					this.n1 = "boom15_1" + this.funcSet;
					this.n2 = "boom16_1" + this.funcSet;
					this.n3 = "boom17_1" + this.funcSet;
					this.n5 = "boom17_1" + this.funcSet;
					this.n6 = "boom16_1" + this.funcSet;
					this.n7 = "boom15_1" + this.funcSet;
					this.n8 = "boom14_1" + this.funcSet;
					this.n9 = "boom13_1" + this.funcSet;
					this.n0 = "boom12_1" + this.funcSet;
					this.minus = "boom11_1" + this.funcSet;
					this.plus = "boom10_1" + this.funcSet;
					this.bsp = "boom9_1" + this.funcSet;
					this.insert = "boom8_1" + this.funcSet;
					this.home = "boom7_1" + this.funcSet;
					this.pup = "boom6_1" + this.funcSet;
					this.numlock = "boom5_1" + this.funcSet;
					this.numdrawn = "boom4_1" + this.funcSet;
					this.numtimes = "boom3_1" + this.funcSet;
					this.numminus = "boom2_1" + this.funcSet;
					this.num = 3
				}
				else if (this.num == 3) {
					this.num = 2;
					// this.clear();
					if (this.keyFlag1 == 0) {
						this.keyFlag1 = 1;
						setTimeout(() => {
							this.keyFlag1 = 0;
						}, 1000);
					}
					this.n4 = 'boom1_2' + this.funcSet;
					this.perid = "boom14_2" + this.funcSet;
					this.n1 = "boom15_2" + this.funcSet;
					this.n2 = "boom16_2" + this.funcSet;
					this.n3 = "boom17_2" + this.funcSet;
					this.n5 = "boom17_2" + this.funcSet;
					this.n6 = "boom16_2" + this.funcSet;
					this.n7 = "boom15_2" + this.funcSet;
					this.n8 = "boom14_2" + this.funcSet;
					this.n9 = "boom13_2" + this.funcSet;
					this.n0 = "boom12_2" + this.funcSet;
					this.minus = "boom11_2" + this.funcSet;
					this.plus = "boom10_2" + this.funcSet;
					this.bsp = "boom9_2" + this.funcSet;
					this.insert = "boom8_2" + this.funcSet;
					this.home = "boom7_2" + this.funcSet;
					this.pup = "boom6_2" + this.funcSet;
					this.numlock = "boom5_2" + this.funcSet;
					this.numdrawn = "boom4_2" + this.funcSet;
					this.numtimes = "boom3_2" + this.funcSet;
					this.numminus = "boom2_2" + this.funcSet;
				}
				break;

			case this.vKey == 53 && this.keyStatus == 1: //n5
				if (this.num == 2) {
					// this.clear();
					if (this.keyFlag1 == 0) {
						this.keyFlag1 = 1;
						setTimeout(() => {
							this.keyFlag1 = 0;
						}, 1000);
					}
					this.n5 = 'boom1_1' + this.funcSet;
					this.perid = "boom12_1" + this.funcSet;
					this.n1 = "boom13_1" + this.funcSet;
					this.n2 = "boom14_1" + this.funcSet;
					this.n3 = "boom15_1" + this.funcSet;
					this.n4 = "boom16_1" + this.funcSet;
					this.n6 = "boom16_1" + this.funcSet;
					this.n7 = "boom15_1" + this.funcSet;
					this.n8 = "boom14_1" + this.funcSet;
					this.n9 = "boom13_1" + this.funcSet;
					this.n0 = "boom12_1" + this.funcSet;
					this.minus = "boom11_1" + this.funcSet;
					this.plus = "boom10_1" + this.funcSet;
					this.bsp = "boom9_1" + this.funcSet;
					this.insert = "boom8_1" + this.funcSet;
					this.home = "boom7_1" + this.funcSet;
					this.pup = "boom6_1" + this.funcSet;
					this.numlock = "boom5_1" + this.funcSet;
					this.numdrawn = "boom4_1" + this.funcSet;
					this.numtimes = "boom3_1" + this.funcSet;
					this.numminus = "boom2_1" + this.funcSet;
					this.num = 3
				}
				else if (this.num == 3) {
					this.num = 2;
					// this.clear();
					if (this.keyFlag1 == 0) {
						this.keyFlag1 = 1;
						setTimeout(() => {
							this.keyFlag1 = 0;
						}, 1000);
					}
					this.n5 = 'boom1_2' + this.funcSet;
					this.perid = "boom2_2" + this.funcSet;
					this.n1 = "boom13_2" + this.funcSet;
					this.n2 = "boom14_2" + this.funcSet;
					this.n3 = "boom15_2" + this.funcSet;
					this.n4 = "boom16_2" + this.funcSet;
					this.n6 = "boom16_2" + this.funcSet;
					this.n7 = "boom15_2" + this.funcSet;
					this.n8 = "boom14_2" + this.funcSet;
					this.n9 = "boom13_2" + this.funcSet;
					this.n0 = "boom12_2" + this.funcSet;
					this.minus = "boom11_2" + this.funcSet;
					this.plus = "boom10_2" + this.funcSet;
					this.bsp = "boom9_2" + this.funcSet;
					this.insert = "boom8_2" + this.funcSet;
					this.home = "boom7_2" + this.funcSet;
					this.pup = "boom6_2" + this.funcSet;
					this.numlock = "boom5_2" + this.funcSet;
					this.numdrawn = "boom4_2" + this.funcSet;
					this.numtimes = "boom3_2" + this.funcSet;
					this.numminus = "boom2_2" + this.funcSet;
				}
				break;

			case this.vKey == 54 && this.keyStatus == 1: //n6
				if (this.num == 2) {
					// this.clear();
					if (this.keyFlag1 == 0) {
						this.keyFlag1 = 1;
						setTimeout(() => {
							this.keyFlag1 = 0;
						}, 1000);
					}
					this.n6 = 'boom1_1' + this.funcSet;
					this.perid = "boom10_1" + this.funcSet;
					this.n1 = "boom11_1" + this.funcSet;
					this.n2 = "boom12_1" + this.funcSet;
					this.n3 = "boom13_1" + this.funcSet;
					this.n4 = "boom14_1" + this.funcSet;
					this.n5 = "boom15_1" + this.funcSet;
					this.n7 = "boom15_1" + this.funcSet;
					this.n8 = "boom14_1" + this.funcSet;
					this.n9 = "boom13_1" + this.funcSet;
					this.n0 = "boom12_1" + this.funcSet;
					this.minus = "boom11_1" + this.funcSet;
					this.plus = "boom10_1" + this.funcSet;
					this.bsp = "boom9_1" + this.funcSet;
					this.insert = "boom8_1" + this.funcSet;
					this.home = "boom7_1" + this.funcSet;
					this.pup = "boom6_1" + this.funcSet;
					this.numlock = "boom5_1" + this.funcSet;
					this.numdrawn = "boom4_1" + this.funcSet;
					this.numtimes = "boom3_1" + this.funcSet;
					this.numminus = "boom2_1" + this.funcSet;
					this.num = 3
				}
				else if (this.num == 3) {
					this.num = 2;
					// this.clear();
					if (this.keyFlag1 == 0) {
						this.keyFlag1 = 1;
						setTimeout(() => {
							this.keyFlag1 = 0;
						}, 1000);
					}
					this.n6 = 'boom1_2' + this.funcSet;
					this.perid = "boom10_2" + this.funcSet;
					this.n1 = "boom11_2" + this.funcSet;
					this.n2 = "boom12_2" + this.funcSet;
					this.n3 = "boom13_2" + this.funcSet;
					this.n4 = "boom14_2" + this.funcSet;
					this.n5 = "boom15_2" + this.funcSet;
					this.n7 = "boom15_2" + this.funcSet;
					this.n8 = "boom14_2" + this.funcSet;
					this.n9 = "boom13_2" + this.funcSet;
					this.n0 = "boom12_2" + this.funcSet;
					this.minus = "boom11_2" + this.funcSet;
					this.plus = "boom10_2" + this.funcSet;
					this.bsp = "boom9_2" + this.funcSet;
					this.insert = "boom8_2" + this.funcSet;
					this.home = "boom7_2" + this.funcSet;
					this.pup = "boom6_2" + this.funcSet;
					this.numlock = "boom5_2" + this.funcSet;
					this.numdrawn = "boom4_2" + this.funcSet;
					this.numtimes = "boom3_2" + this.funcSet;
					this.numminus = "boom2_2" + this.funcSet;
				}
				break;

			case this.vKey == 55 && this.keyStatus == 1: //n7
				if (this.num == 2) {
					// this.clear();
					if (this.keyFlag1 == 0) {
						this.keyFlag1 = 1;
						setTimeout(() => {
							this.keyFlag1 = 0;
						}, 1000);
					}
					this.n7 = 'boom1_1' + this.funcSet;
					this.perid = "boom8_1" + this.funcSet;
					this.n1 = "boom9_1" + this.funcSet;
					this.n2 = "boom10_1" + this.funcSet;
					this.n3 = "boom11_1" + this.funcSet;
					this.n4 = "boom12_1" + this.funcSet;
					this.n5 = "boom13_1" + this.funcSet;
					this.n6 = "boom14_1" + this.funcSet;
					this.n8 = "boom14_1" + this.funcSet;
					this.n9 = "boom13_1" + this.funcSet;
					this.n0 = "boom12_1" + this.funcSet;
					this.minus = "boom11_1" + this.funcSet;
					this.plus = "boom10_1" + this.funcSet;
					this.bsp = "boom9_1" + this.funcSet;
					this.insert = "boom8_1" + this.funcSet;
					this.home = "boom7_1" + this.funcSet;
					this.pup = "boom6_1" + this.funcSet;
					this.numlock = "boom5_1" + this.funcSet;
					this.numdrawn = "boom4_1" + this.funcSet;
					this.numtimes = "boom3_1" + this.funcSet;
					this.numminus = "boom2_1" + this.funcSet;
					this.num = 3
				}
				else if (this.num == 3) {
					this.num = 2;
					// this.clear();
					if (this.keyFlag1 == 0) {
						this.keyFlag1 = 1;
						setTimeout(() => {
							this.keyFlag1 = 0;
						}, 1000);
					}
					this.n7 = 'boom1_2' + this.funcSet;
					this.perid = "boom8_2" + this.funcSet;
					this.n1 = "boom9_2" + this.funcSet;
					this.n2 = "boom10_2" + this.funcSet;
					this.n3 = "boom11_2" + this.funcSet;
					this.n4 = "boom12_2" + this.funcSet;
					this.n5 = "boom13_2" + this.funcSet;
					this.n6 = "boom14_2" + this.funcSet;
					this.n8 = "boom14_2" + this.funcSet;
					this.n9 = "boom13_2" + this.funcSet;
					this.n0 = "boom12_2" + this.funcSet;
					this.minus = "boom11_2" + this.funcSet;
					this.plus = "boom10_2" + this.funcSet;
					this.bsp = "boom9_2" + this.funcSet;
					this.insert = "boom8_2" + this.funcSet;
					this.home = "boom7_2" + this.funcSet;
					this.pup = "boom6_2" + this.funcSet;
					this.numlock = "boom5_2" + this.funcSet;
					this.numdrawn = "boom4_2" + this.funcSet;
					this.numtimes = "boom3_2" + this.funcSet;
					this.numminus = "boom2_2" + this.funcSet;
				}
				break;

			case this.vKey == 56 && this.keyStatus == 1: //n8
				if (this.num == 2) {
					// this.clear();
					if (this.keyFlag1 == 0) {
						this.keyFlag1 = 1;
						setTimeout(() => {
							this.keyFlag1 = 0;
						}, 1000);
					}
					this.n8 = 'boom1_1' + this.funcSet;
					this.perid = "boom6_1" + this.funcSet;
					this.n1 = "boom7_1" + this.funcSet;
					this.n2 = "boom8_1" + this.funcSet;
					this.n3 = "boom9_1" + this.funcSet;
					this.n4 = "boom10_1" + this.funcSet;
					this.n5 = "boom11_1" + this.funcSet;
					this.n6 = "boom12_1" + this.funcSet;
					this.n7 = "boom13_1" + this.funcSet;
					this.n9 = "boom13_1" + this.funcSet;
					this.n0 = "boom12_1" + this.funcSet;
					this.minus = "boom11_1" + this.funcSet;
					this.plus = "boom10_1" + this.funcSet;
					this.bsp = "boom9_1" + this.funcSet;
					this.insert = "boom8_1" + this.funcSet;
					this.home = "boom7_1" + this.funcSet;
					this.pup = "boom6_1" + this.funcSet;
					this.numlock = "boom5_1" + this.funcSet;
					this.numdrawn = "boom4_1" + this.funcSet;
					this.numtimes = "boom3_1" + this.funcSet;
					this.numminus = "boom2_1" + this.funcSet;
					this.num = 3
				}
				else if (this.num == 3) {
					this.num = 2;
					// this.clear();
					if (this.keyFlag1 == 0) {
						this.keyFlag1 = 1;
						setTimeout(() => {
							this.keyFlag1 = 0;
						}, 1000);
					}
					this.n8 = 'boom1_2' + this.funcSet;
					this.perid = "boom2_2" + this.funcSet;
					this.n1 = "boom7_2" + this.funcSet;
					this.n2 = "boom8_2" + this.funcSet;
					this.n3 = "boom9_2" + this.funcSet;
					this.n4 = "boom10_2" + this.funcSet;
					this.n5 = "boom11_2" + this.funcSet;
					this.n6 = "boom12_2" + this.funcSet;
					this.n7 = "boom13_2" + this.funcSet;
					this.n9 = "boom13_2" + this.funcSet;
					this.n0 = "boom12_2" + this.funcSet;
					this.minus = "boom11_2" + this.funcSet;
					this.plus = "boom10_2" + this.funcSet;
					this.bsp = "boom9_2" + this.funcSet;
					this.insert = "boom8_2" + this.funcSet;
					this.home = "boom7_2" + this.funcSet;
					this.pup = "boom6_2" + this.funcSet;
					this.numlock = "boom5_2" + this.funcSet;
					this.numdrawn = "boom4_2" + this.funcSet;
					this.numtimes = "boom3_2" + this.funcSet;
					this.numminus = "boom2_2" + this.funcSet;
				}
				break;

			case this.vKey == 57 && this.keyStatus == 1: //n9
				if (this.num == 2) {
					// this.clear();
					if (this.keyFlag1 == 0) {
						this.keyFlag1 = 1;
						setTimeout(() => {
							this.keyFlag1 = 0;
						}, 1000);
					}
					this.n9 = 'boom1_1' + this.funcSet;
					this.perid = "boom4_1" + this.funcSet;
					this.n1 = "boom5_1" + this.funcSet;
					this.n2 = "boom6_1" + this.funcSet;
					this.n3 = "boom7_1" + this.funcSet;
					this.n4 = "boom8_1" + this.funcSet;
					this.n5 = "boom9_1" + this.funcSet;
					this.n6 = "boom10_1" + this.funcSet;
					this.n7 = "boom11_1" + this.funcSet;
					this.n8 = "boom12_1" + this.funcSet;
					this.n0 = "boom12_1" + this.funcSet;
					this.minus = "boom11_1" + this.funcSet;
					this.plus = "boom10_1" + this.funcSet;
					this.bsp = "boom9_1" + this.funcSet;
					this.insert = "boom8_1" + this.funcSet;
					this.home = "boom7_1" + this.funcSet;
					this.pup = "boom6_1" + this.funcSet;
					this.numlock = "boom5_1" + this.funcSet;
					this.numdrawn = "boom4_1" + this.funcSet;
					this.numtimes = "boom3_1" + this.funcSet;
					this.numminus = "boom2_1" + this.funcSet;
					this.num = 3
				}
				else if (this.num == 3) {
					this.num = 2;
					// this.clear();
					if (this.keyFlag1 == 0) {
						this.keyFlag1 = 1;
						setTimeout(() => {
							this.keyFlag1 = 0;
						}, 1000);
					}
					this.n9 = 'boom1_2' + this.funcSet;
					this.perid = "boom4_2" + this.funcSet;
					this.n1 = "boom5_2" + this.funcSet;
					this.n2 = "boom6_2" + this.funcSet;
					this.n3 = "boom7_2" + this.funcSet;
					this.n4 = "boom8_2" + this.funcSet;
					this.n5 = "boom9_2" + this.funcSet;
					this.n6 = "boom10_2" + this.funcSet;
					this.n7 = "boom11_2" + this.funcSet;
					this.n8 = "boom12_2" + this.funcSet;
					this.n0 = "boom12_2" + this.funcSet;
					this.minus = "boom11_2" + this.funcSet;
					this.plus = "boom10_2" + this.funcSet;
					this.bsp = "boom9_2" + this.funcSet;
					this.insert = "boom8_2" + this.funcSet;
					this.home = "boom7_2" + this.funcSet;
					this.pup = "boom6_2" + this.funcSet;
					this.numlock = "boom5_2" + this.funcSet;
					this.numdrawn = "boom4_2" + this.funcSet;
					this.numtimes = "boom3_2" + this.funcSet;
					this.numminus = "boom2_2" + this.funcSet;
				}
				break;

			case this.vKey == 48 && this.keyStatus == 1: //n0
				if (this.num == 2) {
					// this.clear();
					if (this.keyFlag1 == 0) {
						this.keyFlag1 = 1;
						setTimeout(() => {
							this.keyFlag1 = 0;
						}, 1000);
					}
					this.n0 = 'boom1_1' + this.funcSet;
					this.perid = "boom2_1" + this.funcSet;
					this.n1 = "boom3_1" + this.funcSet;
					this.n2 = "boom4_1" + this.funcSet;
					this.n3 = "boom5_1" + this.funcSet;
					this.n4 = "boom6_1" + this.funcSet;
					this.n5 = "boom7_1" + this.funcSet;
					this.n6 = "boom8_1" + this.funcSet;
					this.n7 = "boom9_1" + this.funcSet;
					this.n8 = "boom10_1" + this.funcSet;
					this.n9 = "boom11_1" + this.funcSet;
					this.minus = "boom11_1" + this.funcSet;
					this.plus = "boom10_1" + this.funcSet;
					this.bsp = "boom9_1" + this.funcSet;
					this.insert = "boom8_1" + this.funcSet;
					this.home = "boom7_1" + this.funcSet;
					this.pup = "boom6_1" + this.funcSet;
					this.numlock = "boom5_1" + this.funcSet;
					this.numdrawn = "boom4_1" + this.funcSet;
					this.numtimes = "boom3_1" + this.funcSet;
					this.numminus = "boom2_1" + this.funcSet;
					this.num = 3
				}
				else if (this.num == 3) {
					this.num = 2;
					// this.clear();
					if (this.keyFlag1 == 0) {
						this.keyFlag1 = 1;
						setTimeout(() => {
							this.keyFlag1 = 0;
						}, 1000);
					}
					this.n0 = 'boom1_2' + this.funcSet;
					this.perid = "boom2_2" + this.funcSet;
					this.n1 = "boom3_2" + this.funcSet;
					this.n2 = "boom4_2" + this.funcSet;
					this.n3 = "boom5_2" + this.funcSet;
					this.n4 = "boom6_2" + this.funcSet;
					this.n5 = "boom7_2" + this.funcSet;
					this.n6 = "boom8_2" + this.funcSet;
					this.n7 = "boom9_2" + this.funcSet;
					this.n8 = "boom10_2" + this.funcSet;
					this.n9 = "boom11_2" + this.funcSet;
					this.minus = "boom11_2" + this.funcSet;
					this.plus = "boom10_2" + this.funcSet;
					this.bsp = "boom9_2" + this.funcSet;
					this.insert = "boom8_2" + this.funcSet;
					this.home = "boom7_2" + this.funcSet;
					this.pup = "boom6_2" + this.funcSet;
					this.numlock = "boom5_2" + this.funcSet;
					this.numdrawn = "boom4_2" + this.funcSet;
					this.numtimes = "boom3_2" + this.funcSet;
					this.numminus = "boom2_2" + this.funcSet;
				}
				break;

			case this.vKey == 189 && this.keyStatus == 1: //minus
				if (this.num == 2) {
					// this.clear();
					if (this.keyFlag1 == 0) {
						this.keyFlag1 = 1;
						setTimeout(() => {
							this.keyFlag1 = 0;
						}, 1000);
					}
					this.minus = 'boom1_1' + this.funcSet;
					this.perid = "boom2_1" + this.funcSet;
					this.n1 = "boom3_1" + this.funcSet;
					this.n2 = "boom4_1" + this.funcSet;
					this.n3 = "boom5_1" + this.funcSet;
					this.n4 = "boom6_1" + this.funcSet;
					this.n5 = "boom7_1" + this.funcSet;
					this.n6 = "boom8_1" + this.funcSet;
					this.n7 = "boom9_1" + this.funcSet;
					this.n8 = "boom11_1" + this.funcSet;
					this.n9 = "boom12_1" + this.funcSet;
					this.n0 = "boom12_1" + this.funcSet;
					this.plus = "boom11_1" + this.funcSet;
					this.bsp = "boom10_1" + this.funcSet;
					this.insert = "boom9_1" + this.funcSet;
					this.home = "boom8_1" + this.funcSet;
					this.pup = "boom7_1" + this.funcSet;
					this.numlock = "boom6_1" + this.funcSet;
					this.numdrawn = "boom5_1" + this.funcSet;
					this.numtimes = "boom4_1" + this.funcSet;
					this.numminus = "boom3_1" + this.funcSet;
					this.num = 3
				}
				else if (this.num == 3) {
					this.num = 2;
					// this.clear();
					if (this.keyFlag1 == 0) {
						this.keyFlag1 = 1;
						setTimeout(() => {
							this.keyFlag1 = 0;
						}, 1000);
					}
					this.minus = 'boom1_2' + this.funcSet;
					this.perid = "boom2_2" + this.funcSet;
					this.n1 = "boom3_2" + this.funcSet;
					this.n2 = "boom4_2" + this.funcSet;
					this.n3 = "boom5_2" + this.funcSet;
					this.n4 = "boom6_2" + this.funcSet;
					this.n5 = "boom7_2" + this.funcSet;
					this.n6 = "boom8_2" + this.funcSet;
					this.n7 = "boom9_2" + this.funcSet;
					this.n8 = "boom11_2" + this.funcSet;
					this.n9 = "boom12_2" + this.funcSet;
					this.n0 = "boom12_2" + this.funcSet;
					this.plus = "boom11_2" + this.funcSet;
					this.bsp = "boom10_2" + this.funcSet;
					this.insert = "boom9_2" + this.funcSet;
					this.home = "boom8_2" + this.funcSet;
					this.pup = "boom7_2" + this.funcSet;
					this.numlock = "boom6_2" + this.funcSet;
					this.numdrawn = "boom5_2" + this.funcSet;
					this.numtimes = "boom4_2" + this.funcSet;
					this.numminus = "boom3_2" + this.funcSet;
				}
				break;

			case this.vKey == 187 && this.keyStatus == 1: //plus
				if (this.num == 2) {
					// this.clear();
					if (this.keyFlag1 == 0) {
						this.keyFlag1 = 1;
						setTimeout(() => {
							this.keyFlag1 = 0;
						}, 1000);
					}
					this.plus = 'boom1_1' + this.funcSet;
					this.perid = "boom2_1" + this.funcSet;
					this.n1 = "boom3_1" + this.funcSet;
					this.n2 = "boom4_1" + this.funcSet;
					this.n3 = "boom5_1" + this.funcSet;
					this.n4 = "boom6_1" + this.funcSet;
					this.n5 = "boom7_1" + this.funcSet;
					this.n6 = "boom8_1" + this.funcSet;
					this.n7 = "boom9_1" + this.funcSet;
					this.n8 = "boom10_1" + this.funcSet;
					this.n9 = "boom11_1" + this.funcSet;
					this.n0 = "boom12_1" + this.funcSet;
					this.minus = "boom13_1" + this.funcSet;
					this.bsp = "boom13_1" + this.funcSet;
					this.insert = "boom12_1" + this.funcSet;
					this.home = "boom11_1" + this.funcSet;
					this.pup = "boom10_1" + this.funcSet;
					this.numlock = "boom9_1" + this.funcSet;
					this.numdrawn = "boom8_1" + this.funcSet;
					this.numtimes = "boom7_1" + this.funcSet;
					this.numminus = "boom6_1" + this.funcSet;
					this.num = 3
				}
				else if (this.num == 3) {
					this.num = 2;
					// this.clear();
					if (this.keyFlag1 == 0) {
						this.keyFlag1 = 1;
						setTimeout(() => {
							this.keyFlag1 = 0;
						}, 1000);
					}
					this.plus = 'boom1_2' + this.funcSet;
					this.perid = "boom2_2" + this.funcSet;
					this.n1 = "boom3_2" + this.funcSet;
					this.n2 = "boom4_2" + this.funcSet;
					this.n3 = "boom5_2" + this.funcSet;
					this.n4 = "boom6_2" + this.funcSet;
					this.n5 = "boom7_2" + this.funcSet;
					this.n6 = "boom8_2" + this.funcSet;
					this.n7 = "boom9_2" + this.funcSet;
					this.n8 = "boom10_2" + this.funcSet;
					this.n9 = "boom11_2" + this.funcSet;
					this.n0 = "boom12_2" + this.funcSet;
					this.minus = "boom13_2" + this.funcSet;
					this.bsp = "boom13_2" + this.funcSet;
					this.insert = "boom12_2" + this.funcSet;
					this.home = "boom11_2" + this.funcSet;
					this.pup = "boom10_2" + this.funcSet;
					this.numlock = "boom9_2" + this.funcSet;
					this.numdrawn = "boom8_2" + this.funcSet;
					this.numtimes = "boom7_2" + this.funcSet;
					this.numminus = "boom6_2" + this.funcSet;
				}
				break;

			case this.vKey == 8 && this.keyStatus == 1: //bsp
				if (this.num == 2) {
					// this.clear();
					if (this.keyFlag1 == 0) {
						this.keyFlag1 = 1;
						setTimeout(() => {
							this.keyFlag1 = 0;
						}, 1000);
					}
					this.bsp = 'boom1_1' + this.funcSet;
					this.perid = "boom2_1" + this.funcSet;
					this.n1 = "boom3_1" + this.funcSet;
					this.n2 = "boom4_1" + this.funcSet;
					this.n3 = "boom5_1" + this.funcSet;
					this.n4 = "boom6_1" + this.funcSet;
					this.n5 = "boom7_1" + this.funcSet;
					this.n6 = "boom8_1" + this.funcSet;
					this.n7 = "boom9_1" + this.funcSet;
					this.n8 = "boom10_1" + this.funcSet;
					this.n9 = "boom11_1" + this.funcSet;
					this.n0 = "boom12_1" + this.funcSet;
					this.minus = "boom13_1" + this.funcSet;
					this.plus = "boom14_1" + this.funcSet;
					this.insert = "boom14_1" + this.funcSet;
					this.home = "boom13_1" + this.funcSet;
					this.pup = "boom12_1" + this.funcSet;
					this.numlock = "boom11_1" + this.funcSet;
					this.numdrawn = "boom10_1" + this.funcSet;
					this.numtimes = "boom9_1" + this.funcSet;
					this.numminus = "boom8_1" + this.funcSet;
					this.num = 3
				}
				else if (this.num == 3) {
					this.num = 2;
					// this.clear();
					if (this.keyFlag1 == 0) {
						this.keyFlag1 = 1;
						setTimeout(() => {
							this.keyFlag1 = 0;
						}, 1000);
					}
					this.bsp = 'boom1_2' + this.funcSet;
					this.perid = "boom2_2" + this.funcSet;
					this.n1 = "boom3_2" + this.funcSet;
					this.n2 = "boom4_2" + this.funcSet;
					this.n3 = "boom5_2" + this.funcSet;
					this.n4 = "boom6_2" + this.funcSet;
					this.n5 = "boom7_2" + this.funcSet;
					this.n6 = "boom8_2" + this.funcSet;
					this.n7 = "boom9_2" + this.funcSet;
					this.n8 = "boom10_2" + this.funcSet;
					this.n9 = "boom11_2" + this.funcSet;
					this.n0 = "boom12_2" + this.funcSet;
					this.minus = "boom13_2" + this.funcSet;
					this.plus = "boom14_2" + this.funcSet;
					this.insert = "boom14_2" + this.funcSet;
					this.home = "boom13_2" + this.funcSet;
					this.pup = "boom12_2" + this.funcSet;
					this.numlock = "boom11_2" + this.funcSet;
					this.numdrawn = "boom10_2" + this.funcSet;
					this.numtimes = "boom9_2" + this.funcSet;
					this.numminus = "boom8_2" + this.funcSet;
				}
				break;

			case this.vKey == 45 && this.keyStatus == 1: //insert
				if (this.num == 2) {
					// this.clear();
					if (this.keyFlag1 == 0) {
						this.keyFlag1 = 1;
						setTimeout(() => {
							this.keyFlag1 = 0;
						}, 1000);
					}
					this.insert = 'boom1_1' + this.funcSet;
					this.perid = "boom2_1" + this.funcSet;
					this.n1 = "boom3_1" + this.funcSet;
					this.n2 = "boom4_1" + this.funcSet;
					this.n3 = "boom5_1" + this.funcSet;
					this.n4 = "boom6_1" + this.funcSet;
					this.n5 = "boom7_1" + this.funcSet;
					this.n6 = "boom8_1" + this.funcSet;
					this.n7 = "boom9_1" + this.funcSet;
					this.n8 = "boom10_1" + this.funcSet;
					this.n9 = "boom11_1" + this.funcSet;
					this.n0 = "boom12_1" + this.funcSet;
					this.minus = "boom13_1" + this.funcSet;
					this.plus = "boom14_1" + this.funcSet;
					this.bsp = "boom15_1" + this.funcSet;
					this.home = "boom15_1" + this.funcSet;
					this.pup = "boom14_1" + this.funcSet;
					this.numlock = "boom13_1" + this.funcSet;
					this.numdrawn = "boom12_1" + this.funcSet;
					this.numtimes = "boom11_1" + this.funcSet;
					this.numminus = "boom10_1" + this.funcSet;
					this.num = 3
				}
				else if (this.num == 3) {
					this.num = 2;
					// this.clear();
					if (this.keyFlag1 == 0) {
						this.keyFlag1 = 1;
						setTimeout(() => {
							this.keyFlag1 = 0;
						}, 1000);
					}
					this.insert = 'boom1_2' + this.funcSet;
					this.perid = "boom2_2" + this.funcSet;
					this.n1 = "boom3_2" + this.funcSet;
					this.n2 = "boom4_2" + this.funcSet;
					this.n3 = "boom5_2" + this.funcSet;
					this.n4 = "boom6_2" + this.funcSet;
					this.n5 = "boom7_2" + this.funcSet;
					this.n6 = "boom8_2" + this.funcSet;
					this.n7 = "boom9_2" + this.funcSet;
					this.n8 = "boom10_2" + this.funcSet;
					this.n9 = "boom11_2" + this.funcSet;
					this.n0 = "boom12_2" + this.funcSet;
					this.minus = "boom13_2" + this.funcSet;
					this.plus = "boom14_2" + this.funcSet;
					this.bsp = "boom15_2" + this.funcSet;
					this.home = "boom15_2" + this.funcSet;
					this.pup = "boom14_2" + this.funcSet;
					this.numlock = "boom13_2" + this.funcSet;
					this.numdrawn = "boom12_2" + this.funcSet;
					this.numtimes = "boom11_2" + this.funcSet;
					this.numminus = "boom10_2" + this.funcSet;
				}
				break;

			case this.vKey == 36 && this.keyStatus == 1: //home
				if (this.num == 2) {
					// this.clear();
					if (this.keyFlag1 == 0) {
						this.keyFlag1 = 1;
						setTimeout(() => {
							this.keyFlag1 = 0;
						}, 1000);
					}
					this.home = 'boom1_1' + this.funcSet;
					this.perid = "boom2_1" + this.funcSet;
					this.n1 = "boom3_1" + this.funcSet;
					this.n2 = "boom4_1" + this.funcSet;
					this.n3 = "boom5_1" + this.funcSet;
					this.n4 = "boom6_1" + this.funcSet;
					this.n5 = "boom7_1" + this.funcSet;
					this.n6 = "boom8_1" + this.funcSet;
					this.n7 = "boom9_1" + this.funcSet;
					this.n8 = "boom10_1" + this.funcSet;
					this.n9 = "boom11_1" + this.funcSet;
					this.n0 = "boom12_1" + this.funcSet;
					this.minus = "boom13_1" + this.funcSet;
					this.plus = "boom14_1" + this.funcSet;
					this.bsp = "boom15_1" + this.funcSet;
					this.insert = "boom16_1" + this.funcSet;
					this.pup = "boom16_1" + this.funcSet;
					this.numlock = "boom15_1" + this.funcSet;
					this.numdrawn = "boom14_1" + this.funcSet;
					this.numtimes = "boom13_1" + this.funcSet;
					this.numminus = "boom12_1" + this.funcSet;
					this.num = 3
				}
				else if (this.num == 3) {
					this.num = 2;
					// this.clear();
					if (this.keyFlag1 == 0) {
						this.keyFlag1 = 1;
						setTimeout(() => {
							this.keyFlag1 = 0;
						}, 1000);
					}
					this.home = 'boom1_2' + this.funcSet;
					this.perid = "boom2_2" + this.funcSet;
					this.n1 = "boom3_2" + this.funcSet;
					this.n2 = "boom4_2" + this.funcSet;
					this.n3 = "boom5_2" + this.funcSet;
					this.n4 = "boom6_2" + this.funcSet;
					this.n5 = "boom7_2" + this.funcSet;
					this.n6 = "boom8_2" + this.funcSet;
					this.n7 = "boom9_2" + this.funcSet;
					this.n8 = "boom10_2" + this.funcSet;
					this.n9 = "boom11_2" + this.funcSet;
					this.n0 = "boom12_2" + this.funcSet;
					this.minus = "boom13_2" + this.funcSet;
					this.plus = "boom14_2" + this.funcSet;
					this.bsp = "boom15_2" + this.funcSet;
					this.insert = "boom16_2" + this.funcSet;
					this.pup = "boom16_2" + this.funcSet;
					this.numlock = "boom15_2" + this.funcSet;
					this.numdrawn = "boom14_2" + this.funcSet;
					this.numtimes = "boom13_2" + this.funcSet;
					this.numminus = "boom12_2" + this.funcSet;
				}
				break;

			case this.vKey == 33 && this.keyStatus == 1: //pup
				if (this.num == 2) {
					// this.clear();
					if (this.keyFlag1 == 0) {
						this.keyFlag1 = 1;
						setTimeout(() => {
							this.keyFlag1 = 0;
						}, 1000);
					}
					this.pup = 'boom1_1' + this.funcSet;
					this.perid = "boom2_1" + this.funcSet;
					this.n1 = "boom3_1" + this.funcSet;
					this.n2 = "boom4_1" + this.funcSet;
					this.n3 = "boom5_1" + this.funcSet;
					this.n4 = "boom6_1" + this.funcSet;
					this.n5 = "boom7_1" + this.funcSet;
					this.n6 = "boom8_1" + this.funcSet;
					this.n7 = "boom9_1" + this.funcSet;
					this.n8 = "boom10_1" + this.funcSet;
					this.n9 = "boom11_1" + this.funcSet;
					this.n0 = "boom12_1" + this.funcSet;
					this.minus = "boom13_1" + this.funcSet;
					this.plus = "boom14_1" + this.funcSet;
					this.bsp = "boom15_1" + this.funcSet;
					this.insert = "boom16_1" + this.funcSet;
					this.home = "boom17_1" + this.funcSet;
					this.numlock = "boom17_1" + this.funcSet;
					this.numdrawn = "boom16_1" + this.funcSet;
					this.numtimes = "boom15_1" + this.funcSet;
					this.numminus = "boom14_1" + this.funcSet;
					this.num = 3
				}
				else if (this.num == 3) {
					this.num = 2;
					// this.clear();
					if (this.keyFlag1 == 0) {
						this.keyFlag1 = 1;
						setTimeout(() => {
							this.keyFlag1 = 0;
						}, 1000);
					}
					this.pup = 'boom1_2' + this.funcSet;
					this.perid = "boom2_2" + this.funcSet;
					this.n1 = "boom3_2" + this.funcSet;
					this.n2 = "boom4_2" + this.funcSet;
					this.n3 = "boom5_2" + this.funcSet;
					this.n4 = "boom6_2" + this.funcSet;
					this.n5 = "boom7_2" + this.funcSet;
					this.n6 = "boom8_2" + this.funcSet;
					this.n7 = "boom9_2" + this.funcSet;
					this.n8 = "boom10_2" + this.funcSet;
					this.n9 = "boom11_2" + this.funcSet;
					this.n0 = "boom12_2" + this.funcSet;
					this.minus = "boom13_2" + this.funcSet;
					this.plus = "boom14_2" + this.funcSet;
					this.bsp = "boom15_2" + this.funcSet;
					this.insert = "boom16_2" + this.funcSet;
					this.home = "boom17_2" + this.funcSet;
					this.numlock = "boom17_2" + this.funcSet;
					this.numdrawn = "boom16_2" + this.funcSet;
					this.numtimes = "boom15_2" + this.funcSet;
					this.numminus = "boom14_2" + this.funcSet;
				}
				break;

			case this.vKey == 144 && this.keyStatus == 1: //numlock
				if (this.num == 2) {
					// this.clear();
					if (this.keyFlag1 == 0) {
						this.keyFlag1 = 1;
						setTimeout(() => {
							this.keyFlag1 = 0;
						}, 1000);
					}
					this.numlock = 'boom1_1' + this.funcSet;
					this.perid = "boom2_1" + this.funcSet;
					this.n1 = "boom3_1" + this.funcSet;
					this.n2 = "boom4_1" + this.funcSet;
					this.n3 = "boom5_1" + this.funcSet;
					this.n4 = "boom6_1" + this.funcSet;
					this.n5 = "boom7_1" + this.funcSet;
					this.n6 = "boom8_1" + this.funcSet;
					this.n7 = "boom9_1" + this.funcSet;
					this.n8 = "boom10_1" + this.funcSet;
					this.n9 = "boom11_1" + this.funcSet;
					this.n0 = "boom12_1" + this.funcSet;
					this.minus = "boom13_1" + this.funcSet;
					this.plus = "boom14_1" + this.funcSet;
					this.bsp = "boom15_1" + this.funcSet;
					this.insert = "boom16_1" + this.funcSet;
					this.home = "boom17_1" + this.funcSet;
					this.pup = "boom18_1" + this.funcSet;
					this.numdrawn = "boom18_1" + this.funcSet;
					this.numtimes = "boom17_1" + this.funcSet;
					this.numminus = "boom16_1" + this.funcSet;
					this.num = 3
				}
				else if (this.num == 3) {
					this.num = 2;
					// this.clear();
					if (this.keyFlag1 == 0) {
						this.keyFlag1 = 1;
						setTimeout(() => {
							this.keyFlag1 = 0;
						}, 1000);
					}
					this.numlock = 'boom1_2' + this.funcSet;
					this.perid = "boom2_2" + this.funcSet;
					this.n1 = "boom3_2" + this.funcSet;
					this.n2 = "boom4_2" + this.funcSet;
					this.n3 = "boom5_2" + this.funcSet;
					this.n4 = "boom6_2" + this.funcSet;
					this.n5 = "boom7_2" + this.funcSet;
					this.n6 = "boom8_2" + this.funcSet;
					this.n7 = "boom9_2" + this.funcSet;
					this.n8 = "boom10_2" + this.funcSet;
					this.n9 = "boom11_2" + this.funcSet;
					this.n0 = "boom12_2" + this.funcSet;
					this.minus = "boom13_2" + this.funcSet;
					this.plus = "boom14_2" + this.funcSet;
					this.bsp = "boom15_2" + this.funcSet;
					this.insert = "boom16_2" + this.funcSet;
					this.home = "boom17_2" + this.funcSet;
					this.pup = "boom18_2" + this.funcSet;
					this.numdrawn = "boom18_2" + this.funcSet;
					this.numtimes = "boom17_2" + this.funcSet;
					this.numminus = "boom16_2" + this.funcSet;
				}
				break;

			case this.vKey == 111 && this.keyStatus == 1: //numdrawn
				if (this.num == 2) {
					// this.clear();
					if (this.keyFlag1 == 0) {
						this.keyFlag1 = 1;
						setTimeout(() => {
							this.keyFlag1 = 0;
						}, 1000);
					}
					this.numdrawn = 'boom1_1' + this.funcSet;
					this.perid = "boom2_1" + this.funcSet;
					this.n1 = "boom3_1" + this.funcSet;
					this.n2 = "boom4_1" + this.funcSet;
					this.n3 = "boom5_1" + this.funcSet;
					this.n4 = "boom6_1" + this.funcSet;
					this.n5 = "boom7_1" + this.funcSet;
					this.n6 = "boom8_1" + this.funcSet;
					this.n7 = "boom9_1" + this.funcSet;
					this.n8 = "boom10_1" + this.funcSet;
					this.n9 = "boom11_1" + this.funcSet;
					this.n0 = "boom12_1" + this.funcSet;
					this.minus = "boom13_1" + this.funcSet;
					this.plus = "boom14_1" + this.funcSet;
					this.bsp = "boom15_1" + this.funcSet;
					this.insert = "boom16_1" + this.funcSet;
					this.home = "boom17_1" + this.funcSet;
					this.pup = "boom18_1" + this.funcSet;
					this.numlock = "boom19_1" + this.funcSet;
					this.numtimes = "boom19_1" + this.funcSet;
					this.numminus = "boom18_1" + this.funcSet;
					this.num = 3
				}
				else if (this.num == 3) {
					this.num = 2;
					// this.clear();
					if (this.keyFlag1 == 0) {
						this.keyFlag1 = 1;
						setTimeout(() => {
							this.keyFlag1 = 0;
						}, 1000);
					}
					this.numdrawn = 'boom1_2' + this.funcSet;
					this.perid = "boom2_2" + this.funcSet;
					this.n1 = "boom3_2" + this.funcSet;
					this.n2 = "boom4_2" + this.funcSet;
					this.n3 = "boom5_2" + this.funcSet;
					this.n4 = "boom6_2" + this.funcSet;
					this.n5 = "boom7_2" + this.funcSet;
					this.n6 = "boom8_2" + this.funcSet;
					this.n7 = "boom9_2" + this.funcSet;
					this.n8 = "boom10_2" + this.funcSet;
					this.n9 = "boom11_2" + this.funcSet;
					this.n0 = "boom12_2" + this.funcSet;
					this.minus = "boom13_2" + this.funcSet;
					this.plus = "boom14_2" + this.funcSet;
					this.bsp = "boom15_2" + this.funcSet;
					this.insert = "boom16_2" + this.funcSet;
					this.home = "boom17_2" + this.funcSet;
					this.pup = "boom18_2" + this.funcSet;
					this.numlock = "boom19_2" + this.funcSet;
					this.numtimes = "boom19_2" + this.funcSet;
					this.numminus = "boom18_2" + this.funcSet;
				}
				break;

			case this.vKey == 106 && this.keyStatus == 1: //numtimes
				if (this.num == 2) {
					// this.clear();
					if (this.keyFlag1 == 0) {
						this.keyFlag1 = 1;
						setTimeout(() => {
							this.keyFlag1 = 0;
						}, 1000);
					}
					this.numtimes = 'boom1_1' + this.funcSet;
					this.perid = "boom2_1" + this.funcSet;
					this.n1 = "boom3_1" + this.funcSet;
					this.n2 = "boom4_1" + this.funcSet;
					this.n3 = "boom5_1" + this.funcSet;
					this.n4 = "boom6_1" + this.funcSet;
					this.n5 = "boom7_1" + this.funcSet;
					this.n6 = "boom8_1" + this.funcSet;
					this.n7 = "boom9_1" + this.funcSet;
					this.n8 = "boom10_1" + this.funcSet;
					this.n9 = "boom11_1" + this.funcSet;
					this.n0 = "boom12_1" + this.funcSet;
					this.minus = "boom13_1" + this.funcSet;
					this.plus = "boom14_1" + this.funcSet;
					this.bsp = "boom15_1" + this.funcSet;
					this.insert = "boom16_1" + this.funcSet;
					this.home = "boom17_1" + this.funcSet;
					this.pup = "boom18_1" + this.funcSet;
					this.numlock = "boom19_1" + this.funcSet;
					this.numdrawn = "boom20_1" + this.funcSet;
					this.numminus = "boom20_1" + this.funcSet;
					this.num = 3
				}
				else if (this.num == 3) {
					this.num = 2;
					// this.clear();
					if (this.keyFlag1 == 0) {
						this.keyFlag1 = 1;
						setTimeout(() => {
							this.keyFlag1 = 0;
						}, 1000);
					}
					this.numtimes = 'boom1_2' + this.funcSet;
					this.perid = "boom2_2" + this.funcSet;
					this.n1 = "boom3_2" + this.funcSet;
					this.n2 = "boom4_2" + this.funcSet;
					this.n3 = "boom5_2" + this.funcSet;
					this.n4 = "boom6_2" + this.funcSet;
					this.n5 = "boom7_2" + this.funcSet;
					this.n6 = "boom8_2" + this.funcSet;
					this.n7 = "boom9_2" + this.funcSet;
					this.n8 = "boom10_2" + this.funcSet;
					this.n9 = "boom11_2" + this.funcSet;
					this.n0 = "boom12_2" + this.funcSet;
					this.minus = "boom13_2" + this.funcSet;
					this.plus = "boom14_2" + this.funcSet;
					this.bsp = "boom15_2" + this.funcSet;
					this.insert = "boom16_2" + this.funcSet;
					this.home = "boom17_2" + this.funcSet;
					this.pup = "boom18_2" + this.funcSet;
					this.numlock = "boom19_2" + this.funcSet;
					this.numdrawn = "boom20_2" + this.funcSet;
					this.numminus = "boom20_2" + this.funcSet;
				}
				break;

			case this.vKey == 109 && this.keyStatus == 1: //numminus
				if (this.num == 2) {
					// this.clear();
					if (this.keyFlag1 == 0) {
						this.keyFlag1 = 1;
						setTimeout(() => {
							this.keyFlag1 = 0;
						}, 1000);
					}
					this.numminus = 'boom1_1' + this.funcSet;
					this.perid = "boom2_1" + this.funcSet;
					this.n1 = "boom3_1" + this.funcSet;
					this.n2 = "boom4_1" + this.funcSet;
					this.n3 = "boom5_1" + this.funcSet;
					this.n4 = "boom6_1" + this.funcSet;
					this.n5 = "boom7_1" + this.funcSet;
					this.n6 = "boom8_1" + this.funcSet;
					this.n7 = "boom9_1" + this.funcSet;
					this.n8 = "boom10_1" + this.funcSet;
					this.n9 = "boom11_1" + this.funcSet;
					this.n0 = "boom12_1" + this.funcSet;
					this.minus = "boom13_1" + this.funcSet;
					this.plus = "boom14_1" + this.funcSet;
					this.bsp = "boom15_1" + this.funcSet;
					this.insert = "boom16_1" + this.funcSet;
					this.home = "boom17_1" + this.funcSet;
					this.pup = "boom18_1" + this.funcSet;
					this.numlock = "boom19_1" + this.funcSet;
					this.numdrawn = "boom20_1" + this.funcSet;
					this.numtimes = "boom21_1" + this.funcSet;
					this.num = 3
				}
				else if (this.num == 3) {
					this.num = 2;
					// this.clear();
					if (this.keyFlag1 == 0) {
						this.keyFlag1 = 1;
						setTimeout(() => {
							this.keyFlag1 = 0;
						}, 1000);
					}
					this.numminus = 'boom1_2' + this.funcSet;
					this.perid = "boom2_2" + this.funcSet;
					this.n1 = "boom3_2" + this.funcSet;
					this.n2 = "boom4_2" + this.funcSet;
					this.n3 = "boom5_2" + this.funcSet;
					this.n4 = "boom6_2" + this.funcSet;
					this.n5 = "boom7_2" + this.funcSet;
					this.n6 = "boom8_2" + this.funcSet;
					this.n7 = "boom9_2" + this.funcSet;
					this.n8 = "boom10_2" + this.funcSet;
					this.n9 = "boom11_2" + this.funcSet;
					this.n0 = "boom12_2" + this.funcSet;
					this.minus = "boom13_2" + this.funcSet;
					this.plus = "boom14_2" + this.funcSet;
					this.bsp = "boom15_2" + this.funcSet;
					this.insert = "boom16_2" + this.funcSet;
					this.home = "boom17_2" + this.funcSet;
					this.pup = "boom18_2" + this.funcSet;
					this.numlock = "boom19_2" + this.funcSet;
					this.numdrawn = "boom20_2" + this.funcSet;
					this.numtimes = "boom21_2" + this.funcSet;
				}
				break;

			case this.vKey == 9 && this.keyStatus == 1: //tabs
				if (this.num == 2) {
					// this.clear();
					if (this.keyFlag1 == 0) {
						this.keyFlag1 = 1;
						setTimeout(() => {
							this.keyFlag1 = 0;
						}, 1000);
					}
					this.tab = 'boom1_1' + this.funcSet;
					this.q = "boom2_1" + this.funcSet;
					this.w = "boom3_1" + this.funcSet;
					this.e = "boom4_1" + this.funcSet;
					this.r = "boom5_1" + this.funcSet;
					this.t = "boom6_1" + this.funcSet;
					this.y = "boom7_1" + this.funcSet;
					this.u = "boom8_1" + this.funcSet;
					this.i = "boom9_1" + this.funcSet;
					this.o = "boom10_1" + this.funcSet;
					this.p = "boom11_1" + this.funcSet;
					this.lqu = "boom12_1" + this.funcSet;
					this.rqu = "boom13_1" + this.funcSet;
					this.drawn = "boom14_1" + this.funcSet;
					this.delete = "boom15_1" + this.funcSet;
					this.end = "boom16_1" + this.funcSet;
					this.pdown = "boom17_1" + this.funcSet;
					this.num7 = "boom18_1" + this.funcSet;
					this.num8 = "boom19_1" + this.funcSet;
					this.num9 = "boom20_1" + this.funcSet;
					this.numplus = "boom21_1" + this.funcSet;
					this.num = 3
				}
				else if (this.num == 3) {
					this.num = 2;
					// this.clear();
					if (this.keyFlag1 == 0) {
						this.keyFlag1 = 1;
						setTimeout(() => {
							this.keyFlag1 = 0;
						}, 1000);
					}
					this.tab = 'boom1_2' + this.funcSet;
					this.q = "boom2_2" + this.funcSet;
					this.w = "boom3_2" + this.funcSet;
					this.e = "boom4_2" + this.funcSet;
					this.r = "boom5_2" + this.funcSet;
					this.t = "boom6_2" + this.funcSet;
					this.y = "boom7_2" + this.funcSet;
					this.u = "boom8_2" + this.funcSet;
					this.i = "boom9_2" + this.funcSet;
					this.o = "boom10_2" + this.funcSet;
					this.p = "boom11_2" + this.funcSet;
					this.lqu = "boom12_2" + this.funcSet;
					this.rqu = "boom13_2" + this.funcSet;
					this.drawn = "boom14_2" + this.funcSet;
					this.delete = "boom15_2" + this.funcSet;
					this.end = "boom16_2" + this.funcSet;
					this.pdown = "boom17_2" + this.funcSet;
					this.num7 = "boom18_2" + this.funcSet;
					this.num8 = "boom19_2" + this.funcSet;
					this.num9 = "boom20_2" + this.funcSet;
					this.numplus = "boom21_2" + this.funcSet;
				}
				break;

			case this.vKey == 81 && this.keyStatus == 1: //q
				if (this.num == 2) {
					// this.clear();
					if (this.keyFlag1 == 0) {
						this.keyFlag1 = 1;
						setTimeout(() => {
							this.keyFlag1 = 0;
						}, 1000);
					}
					this.q = 'boom1_1' + this.funcSet;
					this.tab = "boom20_1" + this.funcSet;
					this.w = "boom20_1" + this.funcSet;
					this.e = "boom19_1" + this.funcSet;
					this.r = "boom18_1" + this.funcSet;
					this.t = "boom17_1" + this.funcSet;
					this.y = "boom16_1" + this.funcSet;
					this.u = "boom15_1" + this.funcSet;
					this.i = "boom14_1" + this.funcSet;
					this.o = "boom13_1" + this.funcSet;
					this.p = "boom12_1" + this.funcSet;
					this.lqu = "boom11_1" + this.funcSet;
					this.rqu = "boom10_1" + this.funcSet;
					this.drawn = "boom9_1" + this.funcSet;
					this.delete = "boom8_1" + this.funcSet;
					this.end = "boom7_1" + this.funcSet;
					this.pdown = "boom6_1" + this.funcSet;
					this.num7 = "boom5_1" + this.funcSet;
					this.num8 = "boom4_1" + this.funcSet;
					this.num9 = "boom3_1" + this.funcSet;
					this.numplus = "boom2_1" + this.funcSet;
					this.num = 3
				}
				else if (this.num == 3) {
					this.num = 2;
					// this.clear();
					if (this.keyFlag1 == 0) {
						this.keyFlag1 = 1;
						setTimeout(() => {
							this.keyFlag1 = 0;
						}, 1000);
					}
					this.q = 'boom1_2' + this.funcSet;
					this.tab = "boom20_2" + this.funcSet;
					this.w = "boom20_2" + this.funcSet;
					this.e = "boom19_2" + this.funcSet;
					this.r = "boom18_2" + this.funcSet;
					this.t = "boom17_2" + this.funcSet;
					this.y = "boom16_2" + this.funcSet;
					this.u = "boom15_2" + this.funcSet;
					this.i = "boom14_2" + this.funcSet;
					this.o = "boom13_2" + this.funcSet;
					this.p = "boom12_2" + this.funcSet;
					this.lqu = "boom11_2" + this.funcSet;
					this.rqu = "boom10_2" + this.funcSet;
					this.drawn = "boom9_2" + this.funcSet;
					this.delete = "boom8_2" + this.funcSet;
					this.end = "boom7_2" + this.funcSet;
					this.pdown = "boom6_2" + this.funcSet;
					this.num7 = "boom5_2" + this.funcSet;
					this.num8 = "boom4_2" + this.funcSet;
					this.num9 = "boom3_2" + this.funcSet;
					this.numplus = "boom2_2" + this.funcSet;
				}
				break;

			case this.vKey == 87 && this.keyStatus == 1: //w
				if (this.num == 2) {
					// this.clear();
					if (this.keyFlag1 == 0) {
						this.keyFlag1 = 1;
						setTimeout(() => {
							this.keyFlag1 = 0;
						}, 1000);
					}
					this.w = 'boom1_1' + this.funcSet;
					this.tab = "boom18_1" + this.funcSet;
					this.q = "boom19_1" + this.funcSet;
					this.e = "boom19_1" + this.funcSet;
					this.r = "boom18_1" + this.funcSet;
					this.t = "boom17_1" + this.funcSet;
					this.y = "boom16_1" + this.funcSet;
					this.u = "boom15_1" + this.funcSet;
					this.i = "boom14_1" + this.funcSet;
					this.o = "boom13_1" + this.funcSet;
					this.p = "boom12_1" + this.funcSet;
					this.lqu = "boom11_1" + this.funcSet;
					this.rqu = "boom10_1" + this.funcSet;
					this.drawn = "boom9_1" + this.funcSet;
					this.delete = "boom8_1" + this.funcSet;
					this.end = "boom7_1" + this.funcSet;
					this.pdown = "boom6_1" + this.funcSet;
					this.num7 = "boom5_1" + this.funcSet;
					this.num8 = "boom4_1" + this.funcSet;
					this.num9 = "boom3_1" + this.funcSet;
					this.numplus = "boom2_1" + this.funcSet;
					this.num = 3
				}
				else if (this.num == 3) {
					this.num = 2;
					// this.clear();
					if (this.keyFlag1 == 0) {
						this.keyFlag1 = 1;
						setTimeout(() => {
							this.keyFlag1 = 0;
						}, 1000);
					}
					this.w = 'boom1_1' + this.funcSet;
					this.tab = "boom18_2" + this.funcSet;
					this.q = "boom19_2" + this.funcSet;
					this.e = "boom19_2" + this.funcSet;
					this.r = "boom18_2" + this.funcSet;
					this.t = "boom17_2" + this.funcSet;
					this.y = "boom16_2" + this.funcSet;
					this.u = "boom15_2" + this.funcSet;
					this.i = "boom14_2" + this.funcSet;
					this.o = "boom13_2" + this.funcSet;
					this.p = "boom12_2" + this.funcSet;
					this.lqu = "boom11_2" + this.funcSet;
					this.rqu = "boom10_2" + this.funcSet;
					this.drawn = "boom9_2" + this.funcSet;
					this.delete = "boom8_2" + this.funcSet;
					this.end = "boom7_2" + this.funcSet;
					this.pdown = "boom6_2" + this.funcSet;
					this.num7 = "boom5_2" + this.funcSet;
					this.num8 = "boom4_2" + this.funcSet;
					this.num9 = "boom3_2" + this.funcSet;
					this.numplus = "boom2_2" + this.funcSet;
				}
				break;

			case this.vKey == 69 && this.keyStatus == 1: //E
				if (this.num == 2) {
					// this.clear();
					if (this.keyFlag1 == 0) {
						this.keyFlag1 = 1;
						setTimeout(() => {
							this.keyFlag1 = 0;
						}, 1000);
					}
					this.e = "wave1_1" + this.funcSet;
					this.tab = "boom16_1" + this.funcSet;
					this.q = "boom17_1" + this.funcSet;
					this.w = "boom18_1" + this.funcSet;
					this.r = "boom18_1" + this.funcSet;
					this.t = "boom17_1" + this.funcSet;
					this.y = "boom16_1" + this.funcSet;
					this.u = "boom15_1" + this.funcSet;
					this.i = "boom14_1" + this.funcSet;
					this.o = "boom13_1" + this.funcSet;
					this.p = "boom12_1" + this.funcSet;
					this.lqu = "boom11_1" + this.funcSet;
					this.rqu = "boom10_1" + this.funcSet;
					this.drawn = "boom9_1" + this.funcSet;
					this.delete = "boom8_1" + this.funcSet;
					this.end = "boom7_1" + this.funcSet;
					this.pdown = "boom6_1" + this.funcSet;
					this.num7 = "boom5_1" + this.funcSet;
					this.num8 = "boom4_1" + this.funcSet;
					this.num9 = "boom3_1" + this.funcSet;
					this.numplus = "boom2_1" + this.funcSet;
					this.num = 3
				}
				else if (this.num == 3) {
					this.num = 2;
					// this.clear();
					if (this.keyFlag1 == 0) {
						this.keyFlag1 = 1;
						setTimeout(() => {
							this.keyFlag1 = 0;
						}, 1000);
					}
					this.e = "wave1_2" + this.funcSet;
					this.tab = "boom16_2" + this.funcSet;
					this.q = "boom17_2" + this.funcSet;
					this.w = "boom18_2" + this.funcSet;
					this.r = "boom18_2" + this.funcSet;
					this.t = "boom17_2" + this.funcSet;
					this.y = "boom16_2" + this.funcSet;
					this.u = "boom15_2" + this.funcSet;
					this.i = "boom14_2" + this.funcSet;
					this.o = "boom13_2" + this.funcSet;
					this.p = "boom12_2" + this.funcSet;
					this.lqu = "boom11_2" + this.funcSet;
					this.rqu = "boom10_2" + this.funcSet;
					this.drawn = "boom9_2" + this.funcSet;
					this.delete = "boom8_2" + this.funcSet;
					this.end = "boom7_2" + this.funcSet;
					this.pdown = "boom6_2" + this.funcSet;
					this.num7 = "boom5_2" + this.funcSet;
					this.num8 = "boom4_2" + this.funcSet;
					this.num9 = "boom3_2" + this.funcSet;
					this.numplus = "boom2_2" + this.funcSet;
				}
				break;

			case this.vKey == 82 && this.keyStatus == 1: //R
				if (this.num == 2) {
					// this.clear();
					if (this.keyFlag1 == 0) {
						this.keyFlag1 = 1;
						setTimeout(() => {
							this.keyFlag1 = 0;
						}, 1000);
					}
					this.r = "boom1_1" + this.funcSet;
					this.tab = "boom14_1" + this.funcSet;
					this.q = "boom15_1" + this.funcSet;
					this.w = "boom16_1" + this.funcSet;
					this.e = "boom17_1" + this.funcSet;
					this.t = "boom17_1" + this.funcSet;
					this.y = "boom16_1" + this.funcSet;
					this.u = "boom15_1" + this.funcSet;
					this.i = "boom14_1" + this.funcSet;
					this.o = "boom13_1" + this.funcSet;
					this.p = "boom12_1" + this.funcSet;
					this.lqu = "boom11_1" + this.funcSet;
					this.rqu = "boom10_1" + this.funcSet;
					this.drawn = "boom19_1" + this.funcSet;
					this.delete = "boom8_1" + this.funcSet;
					this.end = "boom7_1" + this.funcSet;
					this.pdown = "boom6_1" + this.funcSet;
					this.num7 = "boom5_1" + this.funcSet;
					this.num8 = "boom4_1" + this.funcSet;
					this.num9 = "boom3_1" + this.funcSet;
					this.numplus = "boom2_1" + this.funcSet;
					this.num = 3
				}
				else if (this.num == 3) {
					this.num = 2;
					// this.clear();
					if (this.keyFlag1 == 0) {
						this.keyFlag1 = 1;
						setTimeout(() => {
							this.keyFlag1 = 0;
						}, 1000);
					}
					this.r = "boom1_2" + this.funcSet;
					this.tab = "boom14_2" + this.funcSet;
					this.q = "boom15_2" + this.funcSet;
					this.w = "boom16_2" + this.funcSet;
					this.e = "boom17_2" + this.funcSet;
					this.t = "boom17_2" + this.funcSet;
					this.y = "boom16_2" + this.funcSet;
					this.u = "boom15_2" + this.funcSet;
					this.i = "boom14_2" + this.funcSet;
					this.o = "boom13_2" + this.funcSet;
					this.p = "boom12_2" + this.funcSet;
					this.lqu = "boom11_2" + this.funcSet;
					this.rqu = "boom10_2" + this.funcSet;
					this.drawn = "boom19_2" + this.funcSet;
					this.delete = "boom8_2" + this.funcSet;
					this.end = "boom7_2" + this.funcSet;
					this.pdown = "boom6_2" + this.funcSet;
					this.num7 = "boom5_2" + this.funcSet;
					this.num8 = "boom4_2" + this.funcSet;
					this.num9 = "boom3_2" + this.funcSet;
					this.numplus = "boom2_2" + this.funcSet;
				}
				break;

			case this.vKey == 84 && this.keyStatus == 1: //T
				if (this.num == 2) {
					// this.clear();
					if (this.keyFlag1 == 0) {
						this.keyFlag1 = 1;
						setTimeout(() => {
							this.keyFlag1 = 0;
						}, 1000);
					}
					this.t = "boom1_1" + this.funcSet;
					this.tab = "boom12_1" + this.funcSet;
					this.q = "boom13_1" + this.funcSet;
					this.w = "boom14_1" + this.funcSet;
					this.e = "boom15_1" + this.funcSet;
					this.r = "boom16_1" + this.funcSet;
					this.y = "boom16_1" + this.funcSet;
					this.u = "boom15_1" + this.funcSet;
					this.i = "boom14_1" + this.funcSet;
					this.o = "boom13_1" + this.funcSet;
					this.p = "boom12_1" + this.funcSet;
					this.lqu = "boom11_1" + this.funcSet;
					this.rqu = "boom10_1" + this.funcSet;
					this.drawn = "boom9_1" + this.funcSet;
					this.delete = "boom8_1" + this.funcSet;
					this.end = "boom7_1" + this.funcSet;
					this.pdown = "boom6_1" + this.funcSet;
					this.num7 = "boom5_1" + this.funcSet;
					this.num8 = "boom4_1" + this.funcSet;
					this.num9 = "boom3_1" + this.funcSet;
					this.numplus = "boom2_1" + this.funcSet;
					this.num = 3
				}
				else if (this.num == 3) {
					this.num = 2;
					// this.clear();
					if (this.keyFlag1 == 0) {
						this.keyFlag1 = 1;
						setTimeout(() => {
							this.keyFlag1 = 0;
						}, 1000);
					}
					this.t = "boom1_2" + this.funcSet;
					this.tab = "boom12_2" + this.funcSet;
					this.q = "boom13_2" + this.funcSet;
					this.w = "boom14_2" + this.funcSet;
					this.e = "boom15_2" + this.funcSet;
					this.r = "boom16_2" + this.funcSet;
					this.y = "boom16_2" + this.funcSet;
					this.u = "boom15_2" + this.funcSet;
					this.i = "boom14_2" + this.funcSet;
					this.o = "boom13_2" + this.funcSet;
					this.p = "boom12_2" + this.funcSet;
					this.lqu = "boom11_2" + this.funcSet;
					this.rqu = "boom10_2" + this.funcSet;
					this.drawn = "boom9_2" + this.funcSet;
					this.delete = "boom8_2" + this.funcSet;
					this.end = "boom7_2" + this.funcSet;
					this.pdown = "boom6_2" + this.funcSet;
					this.num7 = "boom5_2" + this.funcSet;
					this.num8 = "boom4_2" + this.funcSet;
					this.num9 = "boom3_2" + this.funcSet;
					this.numplus = "boom2_2" + this.funcSet;
				}
				break;

			case this.vKey == 89 && this.keyStatus == 1: //Y
				if (this.num == 2) {
					// this.clear();
					if (this.keyFlag1 == 0) {
						this.keyFlag1 = 1;
						setTimeout(() => {
							this.keyFlag1 = 0;
						}, 1000);
					}
					this.y = "boom1_1" + this.funcSet;
					this.tab = "boom10_1" + this.funcSet;
					this.q = "boom11_1" + this.funcSet;
					this.w = "boom12_1" + this.funcSet;
					this.e = "boom13_1" + this.funcSet;
					this.r = "boom14_1" + this.funcSet;
					this.t = "boom15_1" + this.funcSet;
					this.u = "boom15_1" + this.funcSet;
					this.i = "boom14_1" + this.funcSet;
					this.o = "boom13_1" + this.funcSet;
					this.p = "boom12_1" + this.funcSet;
					this.lqu = "boom11_1" + this.funcSet;
					this.rqu = "boom10_1" + this.funcSet;
					this.drawn = "boom9_1" + this.funcSet;
					this.delete = "boom8_1" + this.funcSet;
					this.end = "boom7_1" + this.funcSet;
					this.pdown = "boom6_1" + this.funcSet;
					this.num7 = "boom5_1" + this.funcSet;
					this.num8 = "boom4_1" + this.funcSet;
					this.num9 = "boom3_1" + this.funcSet;
					this.numplus = "boom2_1" + this.funcSet;
					this.num = 3
				}
				else if (this.num == 3) {
					this.num = 2;
					// this.clear();
					if (this.keyFlag1 == 0) {
						this.keyFlag1 = 1;
						setTimeout(() => {
							this.keyFlag1 = 0;
						}, 1000);
					}
					this.y = "boom1_2" + this.funcSet;
					this.tab = "boom10_2" + this.funcSet;
					this.q = "boom11_2" + this.funcSet;
					this.w = "boom12_2" + this.funcSet;
					this.e = "boom13_2" + this.funcSet;
					this.r = "boom14_2" + this.funcSet;
					this.t = "boom15_2" + this.funcSet;
					this.u = "boom15_2" + this.funcSet;
					this.i = "boom14_2" + this.funcSet;
					this.o = "boom13_2" + this.funcSet;
					this.p = "boom12_2" + this.funcSet;
					this.lqu = "boom11_2" + this.funcSet;
					this.rqu = "boom10_2" + this.funcSet;
					this.drawn = "boom9_2" + this.funcSet;
					this.delete = "boom8_2" + this.funcSet;
					this.end = "boom7_2" + this.funcSet;
					this.pdown = "boom6_2" + this.funcSet;
					this.num7 = "boom5_2" + this.funcSet;
					this.num8 = "boom4_2" + this.funcSet;
					this.num9 = "boom3_2" + this.funcSet;
					this.numplus = "boom2_2" + this.funcSet;
				}
				break;

			case this.vKey == 85 && this.keyStatus == 1: //U
				if (this.num == 2) {
					// this.clear();
					if (this.keyFlag1 == 0) {
						this.keyFlag1 = 1;
						setTimeout(() => {
							this.keyFlag1 = 0;
						}, 1000);
					}
					this.u = "boom1_1" + this.funcSet;
					this.tab = "boom8_1" + this.funcSet;
					this.q = "boom9_1" + this.funcSet;
					this.w = "boom10_1" + this.funcSet;
					this.e = "boom11_1" + this.funcSet;
					this.r = "boom12_1" + this.funcSet;
					this.t = "boom13_1" + this.funcSet;
					this.y = "boom14_1" + this.funcSet;
					this.i = "boom14_1" + this.funcSet;
					this.o = "boom13_1" + this.funcSet;
					this.p = "boom12_1" + this.funcSet;
					this.lqu = "boom11_1" + this.funcSet;
					this.rqu = "boom10_1" + this.funcSet;
					this.drawn = "boom9_1" + this.funcSet;
					this.delete = "boom8_1" + this.funcSet;
					this.end = "boom7_1" + this.funcSet;
					this.pdown = "boom6_1" + this.funcSet;
					this.num7 = "boom5_1" + this.funcSet;
					this.num8 = "boom4_1" + this.funcSet;
					this.num9 = "boom3_1" + this.funcSet;
					this.numplus = "boom2_1" + this.funcSet;
					this.num = 3
				}
				else if (this.num == 3) {
					this.num = 2;
					// this.clear();
					if (this.keyFlag1 == 0) {
						this.keyFlag1 = 1;
						setTimeout(() => {
							this.keyFlag1 = 0;
						}, 1000);
					}
					this.u = "boom1_2" + this.funcSet;
					this.tab = "boom8_2" + this.funcSet;
					this.q = "boom9_2" + this.funcSet;
					this.w = "boom10_2" + this.funcSet;
					this.e = "boom11_2" + this.funcSet;
					this.r = "boom12_2" + this.funcSet;
					this.t = "boom13_2" + this.funcSet;
					this.y = "boom14_2" + this.funcSet;
					this.i = "boom14_2" + this.funcSet;
					this.o = "boom13_2" + this.funcSet;
					this.p = "boom12_2" + this.funcSet;
					this.lqu = "boom11_2" + this.funcSet;
					this.rqu = "boom10_2" + this.funcSet;
					this.drawn = "boom9_2" + this.funcSet;
					this.delete = "boom8_2" + this.funcSet;
					this.end = "boom7_2" + this.funcSet;
					this.pdown = "boom6_2" + this.funcSet;
					this.num7 = "boom5_2" + this.funcSet;
					this.num8 = "boom4_2" + this.funcSet;
					this.num9 = "boom3_2" + this.funcSet;
					this.numplus = "boom2_2" + this.funcSet;
				}
				break;

			case this.vKey == 73 && this.keyStatus == 1: //I
				if (this.num == 2) {
					// this.clear();
					if (this.keyFlag1 == 0) {
						this.keyFlag1 = 1;
						setTimeout(() => {
							this.keyFlag1 = 0;
						}, 1000);
					}
					this.i = "boom1_1" + this.funcSet;
					this.tab = "boom6_1" + this.funcSet;
					this.q = "boom7_1" + this.funcSet;
					this.w = "boom8_1" + this.funcSet;
					this.e = "boom9_1" + this.funcSet;
					this.r = "boom10_1" + this.funcSet;
					this.t = "boom11_1" + this.funcSet;
					this.y = "boom12_1" + this.funcSet;
					this.u = "boom13_1" + this.funcSet;
					this.o = "boom13_1" + this.funcSet;
					this.p = "boom12_1" + this.funcSet;
					this.lqu = "boom11_1" + this.funcSet;
					this.rqu = "boom10_1" + this.funcSet;
					this.drawn = "boom9_1" + this.funcSet;
					this.delete = "boom8_1" + this.funcSet;
					this.end = "boom7_1" + this.funcSet;
					this.pdown = "boom6_1" + this.funcSet;
					this.num7 = "boom5_1" + this.funcSet;
					this.num8 = "boom4_1" + this.funcSet;
					this.num9 = "boom3_1" + this.funcSet;
					this.numplus = "boom2_1" + this.funcSet;
					this.num = 3
				}
				else if (this.num == 3) {
					this.num = 2;
					// this.clear();
					if (this.keyFlag1 == 0) {
						this.keyFlag1 = 1;
						setTimeout(() => {
							this.keyFlag1 = 0;
						}, 1000);
					}
					this.i = "boom1_2" + this.funcSet;
					this.tab = "boom6_2" + this.funcSet;
					this.q = "boom7_2" + this.funcSet;
					this.w = "boom8_2" + this.funcSet;
					this.e = "boom9_2" + this.funcSet;
					this.r = "boom10_2" + this.funcSet;
					this.t = "boom11_2" + this.funcSet;
					this.y = "boom12_2" + this.funcSet;
					this.u = "boom13_2" + this.funcSet;
					this.o = "boom13_2" + this.funcSet;
					this.p = "boom12_2" + this.funcSet;
					this.lqu = "boom11_2" + this.funcSet;
					this.rqu = "boom10_2" + this.funcSet;
					this.drawn = "boom9_2" + this.funcSet;
					this.delete = "boom8_2" + this.funcSet;
					this.end = "boom7_2" + this.funcSet;
					this.pdown = "boom6_2" + this.funcSet;
					this.num7 = "boom5_2" + this.funcSet;
					this.num8 = "boom4_2" + this.funcSet;
					this.num9 = "boom3_2" + this.funcSet;
					this.numplus = "boom2_2" + this.funcSet;
				}
				break;

			case this.vKey == 79 && this.keyStatus == 1: //O
				if (this.num == 2) {
					// this.clear();
					if (this.keyFlag1 == 0) {
						this.keyFlag1 = 1;
						setTimeout(() => {
							this.keyFlag1 = 0;
						}, 1000);
					}
					this.o = "boom1_1" + this.funcSet;
					this.tab = "boom4_1" + this.funcSet;
					this.q = "boom5_1" + this.funcSet;
					this.w = "boom6_1" + this.funcSet;
					this.e = "boom7_1" + this.funcSet;
					this.r = "boom8_1" + this.funcSet;
					this.t = "boom9_1" + this.funcSet;
					this.y = "boom10_1" + this.funcSet;
					this.u = "boom11_1" + this.funcSet;
					this.i = "boom12_1" + this.funcSet;
					this.p = "boom12_1" + this.funcSet;
					this.lqu = "boom11_1" + this.funcSet;
					this.rqu = "boom10_1" + this.funcSet;
					this.drawn = "boom9_1" + this.funcSet;
					this.delete = "boom8_1" + this.funcSet;
					this.end = "boom7_1" + this.funcSet;
					this.pdown = "boom6_1" + this.funcSet;
					this.num7 = "boom5_1" + this.funcSet;
					this.num8 = "boom4_1" + this.funcSet;
					this.num9 = "boom3_1" + this.funcSet;
					this.numplus = "boom2_1" + this.funcSet;
					this.num = 3
				}
				else if (this.num == 3) {
					this.num = 2;
					// this.clear();
					if (this.keyFlag1 == 0) {
						this.keyFlag1 = 1;
						setTimeout(() => {
							this.keyFlag1 = 0;
						}, 1000);
					}
					this.o = "boom1_2" + this.funcSet;
					this.tab = "boom4_2" + this.funcSet;
					this.q = "boom5_2" + this.funcSet;
					this.w = "boom6_2" + this.funcSet;
					this.e = "boom7_2" + this.funcSet;
					this.r = "boom8_2" + this.funcSet;
					this.t = "boom9_2" + this.funcSet;
					this.y = "boom10_2" + this.funcSet;
					this.u = "boom11_2" + this.funcSet;
					this.i = "boom12_2" + this.funcSet;
					this.p = "boom12_2" + this.funcSet;
					this.lqu = "boom11_2" + this.funcSet;
					this.rqu = "boom10_2" + this.funcSet;
					this.drawn = "boom9_2" + this.funcSet;
					this.delete = "boom8_2" + this.funcSet;
					this.end = "boom7_2" + this.funcSet;
					this.pdown = "boom6_2" + this.funcSet;
					this.num7 = "boom5_2" + this.funcSet;
					this.num8 = "boom4_2" + this.funcSet;
					this.num9 = "boom3_2" + this.funcSet;
					this.numplus = "boom2_2" + this.funcSet;
				}
				break;

			case this.vKey == 80 && this.keyStatus == 1: //P
				if (this.num == 2) {
					// this.clear();
					if (this.keyFlag1 == 0) {
						this.keyFlag1 = 1;
						setTimeout(() => {
							this.keyFlag1 = 0;
						}, 1000);
					}
					this.p = "boom1_1" + this.funcSet;
					this.tab = "boom4_1" + this.funcSet;
					this.q = "boom5_1" + this.funcSet;
					this.w = "boom4_1" + this.funcSet;
					this.e = "boom5_1" + this.funcSet;
					this.r = "boom6_1" + this.funcSet;
					this.t = "boom7_1" + this.funcSet;
					this.y = "boom8_1" + this.funcSet;
					this.u = "boom9_1" + this.funcSet;
					this.i = "boom10_1" + this.funcSet;
					this.o = "boom11_1" + this.funcSet;
					this.lqu = "boom11_1" + this.funcSet;
					this.rqu = "boom10_1" + this.funcSet;
					this.drawn = "boom9_1" + this.funcSet;
					this.delete = "boom8_1" + this.funcSet;
					this.end = "boom7_1" + this.funcSet;
					this.pdown = "boom6_1" + this.funcSet;
					this.num7 = "boom5_1" + this.funcSet;
					this.num8 = "boom4_1" + this.funcSet;
					this.num9 = "boom3_1" + this.funcSet;
					this.numplus = "boom2_1" + this.funcSet;
					this.num = 3
				}
				else if (this.num == 3) {
					this.num = 2;
					// this.clear();
					if (this.keyFlag1 == 0) {
						this.keyFlag1 = 1;
						setTimeout(() => {
							this.keyFlag1 = 0;
						}, 1000);
					}
					this.p = "boom1_2" + this.funcSet;
					this.tab = "boom4_2" + this.funcSet;
					this.q = "boom5_2" + this.funcSet;
					this.w = "boom4_2" + this.funcSet;
					this.e = "boom5_2" + this.funcSet;
					this.r = "boom6_2" + this.funcSet;
					this.t = "boom7_2" + this.funcSet;
					this.y = "boom8_2" + this.funcSet;
					this.u = "boom9_2" + this.funcSet;
					this.i = "boom10_2" + this.funcSet;
					this.o = "boom11_2" + this.funcSet;
					this.lqu = "boom11_2" + this.funcSet;
					this.rqu = "boom10_2" + this.funcSet;
					this.drawn = "boom9_2" + this.funcSet;
					this.delete = "boom8_2" + this.funcSet;
					this.end = "boom7_2" + this.funcSet;
					this.pdown = "boom6_2" + this.funcSet;
					this.num7 = "boom5_2" + this.funcSet;
					this.num8 = "boom4_2" + this.funcSet;
					this.num9 = "boom3_2" + this.funcSet;
					this.numplus = "boom2_2" + this.funcSet;
				}
				break;

			case this.vKey == 219 && this.keyStatus == 1: //lqu
				if (this.num == 2) {
					// this.clear();
					if (this.keyFlag1 == 0) {
						this.keyFlag1 = 1;
						setTimeout(() => {
							this.keyFlag1 = 0;
						}, 1000);
					}
					this.lqu = "boom1_1" + this.funcSet;
					this.tab = "boom2_1" + this.funcSet;
					this.q = "boom3_1" + this.funcSet;
					this.w = "boom4_1" + this.funcSet;
					this.e = "boom5_1" + this.funcSet;
					this.r = "boom6_1" + this.funcSet;
					this.t = "boom7_1" + this.funcSet;
					this.y = "boom8_1" + this.funcSet;
					this.u = "boom9_1" + this.funcSet;
					this.i = "boom10_1" + this.funcSet;
					this.o = "boom11_1" + this.funcSet;
					this.p = "boom12_1" + this.funcSet;
					this.rqu = "boom12_1" + this.funcSet;
					this.drawn = "boom11_1" + this.funcSet;
					this.delete = "boom10_1" + this.funcSet;
					this.end = "boom9_1" + this.funcSet;
					this.pdown = "boom8_1" + this.funcSet;
					this.num7 = "boom7_1" + this.funcSet;
					this.num8 = "boom6_1" + this.funcSet;
					this.num9 = "boom5_1" + this.funcSet;
					this.numplus = "boom4_1" + this.funcSet;
					this.num = 3
				}
				else if (this.num == 3) {
					this.num = 2;
					// this.clear();
					if (this.keyFlag1 == 0) {
						this.keyFlag1 = 1;
						setTimeout(() => {
							this.keyFlag1 = 0;
						}, 1000);
					}
					this.lqu = "boom1_2" + this.funcSet;
					this.tab = "boom2_2" + this.funcSet;
					this.q = "boom3_2" + this.funcSet;
					this.w = "boom4_2" + this.funcSet;
					this.e = "boom5_2" + this.funcSet;
					this.r = "boom6_2" + this.funcSet;
					this.t = "boom7_2" + this.funcSet;
					this.y = "boom8_2" + this.funcSet;
					this.u = "boom9_2" + this.funcSet;
					this.i = "boom10_2" + this.funcSet;
					this.o = "boom11_2" + this.funcSet;
					this.p = "boom12_2" + this.funcSet;
					this.rqu = "boom12_2" + this.funcSet;
					this.drawn = "boom11_2" + this.funcSet;
					this.delete = "boom10_2" + this.funcSet;
					this.end = "boom9_2" + this.funcSet;
					this.pdown = "boom8_2" + this.funcSet;
					this.num7 = "boom7_2" + this.funcSet;
					this.num8 = "boom6_2" + this.funcSet;
					this.num9 = "boom5_2" + this.funcSet;
					this.numplus = "boom4_2" + this.funcSet;
				}
				break;

			case this.vKey == 221 && this.keyStatus == 1: //rqu 
				if (this.num == 2) {
					// this.clear();
					if (this.keyFlag1 == 0) {
						this.keyFlag1 = 1;
						setTimeout(() => {
							this.keyFlag1 = 0;
						}, 1000);
					}
					this.rqu = "boom1_1" + this.funcSet;
					this.tab = "boom2_1" + this.funcSet;
					this.q = "boom3_1" + this.funcSet;
					this.w = "boom4_1" + this.funcSet;
					this.e = "boom5_1" + this.funcSet;
					this.r = "boom6_1" + this.funcSet;
					this.t = "boom7_1" + this.funcSet;
					this.y = "boom8_1" + this.funcSet;
					this.u = "boom9_1" + this.funcSet;
					this.i = "boom10_1" + this.funcSet;
					this.o = "boom11_1" + this.funcSet;
					this.p = "boom12_1" + this.funcSet;
					this.lqu = "boom13_1" + this.funcSet;
					this.drawn = "boom13_1" + this.funcSet;
					this.delete = "boom12_1" + this.funcSet;
					this.end = "boom11_1" + this.funcSet;
					this.pdown = "boom10_1" + this.funcSet;
					this.num7 = "boom9_1" + this.funcSet;
					this.num8 = "boom8_1" + this.funcSet;
					this.num9 = "boom7_1" + this.funcSet;
					this.numplus = "boom8_1" + this.funcSet;
					this.num = 3
				}
				else if (this.num == 3) {
					this.num = 2;
					// this.clear();
					if (this.keyFlag1 == 0) {
						this.keyFlag1 = 1;
						setTimeout(() => {
							this.keyFlag1 = 0;
						}, 1000);
					}
					this.rqu = "boom1_2" + this.funcSet;
					this.tab = "boom2_2" + this.funcSet;
					this.q = "boom3_2" + this.funcSet;
					this.w = "boom4_2" + this.funcSet;
					this.e = "boom5_2" + this.funcSet;
					this.r = "boom6_2" + this.funcSet;
					this.t = "boom7_2" + this.funcSet;
					this.y = "boom8_2" + this.funcSet;
					this.u = "boom9_2" + this.funcSet;
					this.i = "boom10_2" + this.funcSet;
					this.o = "boom11_2" + this.funcSet;
					this.p = "boom12_2" + this.funcSet;
					this.lqu = "boom13_2" + this.funcSet;
					this.drawn = "boom13_2" + this.funcSet;
					this.delete = "boom12_2" + this.funcSet;
					this.end = "boom11_2" + this.funcSet;
					this.pdown = "boom10_2" + this.funcSet;
					this.num7 = "boom9_2" + this.funcSet;
					this.num8 = "boom8_2" + this.funcSet;
					this.num9 = "boom7_2" + this.funcSet;
					this.numplus = "boom8_2" + this.funcSet;
				}
				break;

			case this.vKey == 220 && this.keyStatus == 1: //drawn
				if (this.num == 2) {
					// this.clear();
					if (this.keyFlag1 == 0) {
						this.keyFlag1 = 1;
						setTimeout(() => {
							this.keyFlag1 = 0;
						}, 1000);
					}
					this.drawn = "boom1_1" + this.funcSet;
					this.tab = "boom2_1" + this.funcSet;
					this.q = "boom3_1" + this.funcSet;
					this.w = "boom4_1" + this.funcSet;
					this.e = "boom5_1" + this.funcSet;
					this.r = "boom6_1" + this.funcSet;
					this.t = "boom7_1" + this.funcSet;
					this.y = "boom8_1" + this.funcSet;
					this.u = "boom9_1" + this.funcSet;
					this.i = "boom10_1" + this.funcSet;
					this.o = "boom11_1" + this.funcSet;
					this.p = "boom12_1" + this.funcSet;
					this.lqu = "boom13_1" + this.funcSet;
					this.rqu = "boom14_1" + this.funcSet;
					this.delete = "boom14_1" + this.funcSet;
					this.end = "boom13_1" + this.funcSet;
					this.pdown = "boom12_1" + this.funcSet;
					this.num7 = "boom11_1" + this.funcSet;
					this.num8 = "boom10_1" + this.funcSet;
					this.num9 = "boom9_1" + this.funcSet;
					this.numplus = "boom8_1" + this.funcSet;
					this.num = 3
				}
				else if (this.num == 3) {
					this.num = 2;
					// this.clear();
					if (this.keyFlag1 == 0) {
						this.keyFlag1 = 1;
						setTimeout(() => {
							this.keyFlag1 = 0;
						}, 1000);
					}
					this.drawn = "boom1_2" + this.funcSet;
					this.tab = "boom2_2" + this.funcSet;
					this.q = "boom3_2" + this.funcSet;
					this.w = "boom4_2" + this.funcSet;
					this.e = "boom5_2" + this.funcSet;
					this.r = "boom6_2" + this.funcSet;
					this.t = "boom7_2" + this.funcSet;
					this.y = "boom8_2" + this.funcSet;
					this.u = "boom9_2" + this.funcSet;
					this.i = "boom10_2" + this.funcSet;
					this.o = "boom11_2" + this.funcSet;
					this.p = "boom12_2" + this.funcSet;
					this.lqu = "boom13_2" + this.funcSet;
					this.rqu = "boom14_2" + this.funcSet;
					this.delete = "boom14_2" + this.funcSet;
					this.end = "boom13_2" + this.funcSet;
					this.pdown = "boom12_2" + this.funcSet;
					this.num7 = "boom11_2" + this.funcSet;
					this.num8 = "boom10_2" + this.funcSet;
					this.num9 = "boom9_2" + this.funcSet;
					this.numplus = "boom8_2" + this.funcSet;
				}
				break;

			case this.vKey == 46 && this.keyStatus == 1: //delete
				if (this.num == 2) {
					// this.clear();
					if (this.keyFlag1 == 0) {
						this.keyFlag1 = 1;
						setTimeout(() => {
							this.keyFlag1 = 0;
						}, 1000);
					}
					this.delete = "boom1_1" + this.funcSet;
					this.tab = "boom2_1" + this.funcSet;
					this.q = "boom3_1" + this.funcSet;
					this.w = "boom4_1" + this.funcSet;
					this.e = "boom5_1" + this.funcSet;
					this.r = "boom6_1" + this.funcSet;
					this.t = "boom7_1" + this.funcSet;
					this.y = "boom8_1" + this.funcSet;
					this.u = "boom9_1" + this.funcSet;
					this.i = "boom10_1" + this.funcSet;
					this.o = "boom11_1" + this.funcSet;
					this.p = "boom12_1" + this.funcSet;
					this.lqu = "boom13_1" + this.funcSet;
					this.rqu = "boom14_1" + this.funcSet;
					this.drawn = "boom15_1" + this.funcSet;
					this.end = "boom15_1" + this.funcSet;
					this.pdown = "boom14_1" + this.funcSet;
					this.num7 = "boom13_1" + this.funcSet;
					this.num8 = "boom12_1" + this.funcSet;
					this.num9 = "boom11_1" + this.funcSet;
					this.numplus = "boom10_1" + this.funcSet;
					this.num = 3
				}
				else if (this.num == 3) {
					this.num = 2;
					// this.clear();
					if (this.keyFlag1 == 0) {
						this.keyFlag1 = 1;
						setTimeout(() => {
							this.keyFlag1 = 0;
						}, 1000);
					}
					this.delete = "boom1_2" + this.funcSet;
					this.tab = "boom2_2" + this.funcSet;
					this.q = "boom3_2" + this.funcSet;
					this.w = "boom4_2" + this.funcSet;
					this.e = "boom5_2" + this.funcSet;
					this.r = "boom6_2" + this.funcSet;
					this.t = "boom7_2" + this.funcSet;
					this.y = "boom8_2" + this.funcSet;
					this.u = "boom9_2" + this.funcSet;
					this.i = "boom10_2" + this.funcSet;
					this.o = "boom11_2" + this.funcSet;
					this.p = "boom12_2" + this.funcSet;
					this.lqu = "boom13_2" + this.funcSet;
					this.rqu = "boom14_2" + this.funcSet;
					this.drawn = "boom15_2" + this.funcSet;
					this.end = "boom15_2" + this.funcSet;
					this.pdown = "boom14_2" + this.funcSet;
					this.num7 = "boom13_2" + this.funcSet;
					this.num8 = "boom12_2" + this.funcSet;
					this.num9 = "boom11_2" + this.funcSet;
					this.numplus = "boom10_2" + this.funcSet;
				}
				break;

			case this.vKey == 35 && this.keyStatus == 1: //end
				if (this.num == 2) {
					// this.clear();
					if (this.keyFlag1 == 0) {
						this.keyFlag1 = 1;
						setTimeout(() => {
							this.keyFlag1 = 0;
						}, 1000);
					}
					this.end = "boom1_1" + this.funcSet;
					this.tab = "boom2_1" + this.funcSet;
					this.q = "boom3_1" + this.funcSet;
					this.w = "boom4_1" + this.funcSet;
					this.e = "boom5_1" + this.funcSet;
					this.r = "boom6_1" + this.funcSet;
					this.t = "boom7_1" + this.funcSet;
					this.y = "boom8_1" + this.funcSet;
					this.u = "boom9_1" + this.funcSet;
					this.i = "boom10_1" + this.funcSet;
					this.o = "boom11_1" + this.funcSet;
					this.p = "boom12_1" + this.funcSet;
					this.lqu = "boom13_1" + this.funcSet;
					this.rqu = "boom14_1" + this.funcSet;
					this.drawn = "boom15_1" + this.funcSet;
					this.delete = "boom16_1" + this.funcSet;
					this.pdown = "boom16_1" + this.funcSet;
					this.num7 = "boom15_1" + this.funcSet;
					this.num8 = "boom14_1" + this.funcSet;
					this.num9 = "boom13_1" + this.funcSet;
					this.numplus = "boom12_1" + this.funcSet;
					this.num = 3
				}
				else if (this.num == 3) {
					this.num = 2;
					// this.clear();
					if (this.keyFlag1 == 0) {
						this.keyFlag1 = 1;
						setTimeout(() => {
							this.keyFlag1 = 0;
						}, 1000);
					}
					this.end = "boom1_2" + this.funcSet;
					this.tab = "boom2_2" + this.funcSet;
					this.q = "boom3_2" + this.funcSet;
					this.w = "boom4_2" + this.funcSet;
					this.e = "boom5_2" + this.funcSet;
					this.r = "boom6_2" + this.funcSet;
					this.t = "boom7_2" + this.funcSet;
					this.y = "boom8_2" + this.funcSet;
					this.u = "boom9_2" + this.funcSet;
					this.i = "boom10_2" + this.funcSet;
					this.o = "boom11_2" + this.funcSet;
					this.p = "boom12_2" + this.funcSet;
					this.lqu = "boom13_2" + this.funcSet;
					this.rqu = "boom14_2" + this.funcSet;
					this.drawn = "boom15_2" + this.funcSet;
					this.delete = "boom16_2" + this.funcSet;
					this.pdown = "boom16_2" + this.funcSet;
					this.num7 = "boom15_2" + this.funcSet;
					this.num8 = "boom14_2" + this.funcSet;
					this.num9 = "boom13_2" + this.funcSet;
					this.numplus = "boom12_2" + this.funcSet;
				}
				break;

			case this.vKey == 34 && this.keyStatus == 1: //pdown
				if (this.num == 2) {
					// this.clear();
					if (this.keyFlag1 == 0) {
						this.keyFlag1 = 1;
						setTimeout(() => {
							this.keyFlag1 = 0;
						}, 1000);
					}
					this.pdown = "boom1_1" + this.funcSet;
					this.tab = "boom2_1" + this.funcSet;
					this.q = "boom3_1" + this.funcSet;
					this.w = "boom4_1" + this.funcSet;
					this.e = "boom5_1" + this.funcSet;
					this.r = "boom6_1" + this.funcSet;
					this.t = "boom7_1" + this.funcSet;
					this.y = "boom8_1" + this.funcSet;
					this.u = "boom9_1" + this.funcSet;
					this.i = "boom10_1" + this.funcSet;
					this.o = "boom11_1" + this.funcSet;
					this.p = "boom12_1" + this.funcSet;
					this.lqu = "boom13_1" + this.funcSet;
					this.rqu = "boom14_1" + this.funcSet;
					this.drawn = "boom15_1" + this.funcSet;
					this.delete = "boom16_1" + this.funcSet;
					this.end = "boom17_1" + this.funcSet;
					this.num7 = "boom17_1" + this.funcSet;
					this.num8 = "boom16_1" + this.funcSet;
					this.num9 = "boom15_1" + this.funcSet;
					this.numplus = "boom14_1" + this.funcSet;
					this.num = 3
				}
				else if (this.num == 3) {
					this.num = 2;
					// this.clear();
					if (this.keyFlag1 == 0) {
						this.keyFlag1 = 1;
						setTimeout(() => {
							this.keyFlag1 = 0;
						}, 1000);
					}
					this.pdown = "boom1_2" + this.funcSet;
					this.tab = "boom2_2" + this.funcSet;
					this.q = "boom3_2" + this.funcSet;
					this.w = "boom4_2" + this.funcSet;
					this.e = "boom5_2" + this.funcSet;
					this.r = "boom6_2" + this.funcSet;
					this.t = "boom7_2" + this.funcSet;
					this.y = "boom8_2" + this.funcSet;
					this.u = "boom9_2" + this.funcSet;
					this.i = "boom10_2" + this.funcSet;
					this.o = "boom11_2" + this.funcSet;
					this.p = "boom12_2" + this.funcSet;
					this.lqu = "boom13_2" + this.funcSet;
					this.rqu = "boom14_2" + this.funcSet;
					this.drawn = "boom15_2" + this.funcSet;
					this.delete = "boom16_2" + this.funcSet;
					this.end = "boom17_2" + this.funcSet;
					this.num7 = "boom17_2" + this.funcSet;
					this.num8 = "boom16_2" + this.funcSet;
					this.num9 = "boom15_2" + this.funcSet;
					this.numplus = "boom14_2" + this.funcSet;
				}
				break;

			case this.vKey == 103 && this.keyStatus == 1: //num7
				if (this.num == 2) {
					// this.clear();
					if (this.keyFlag1 == 0) {
						this.keyFlag1 = 1;
						setTimeout(() => {
							this.keyFlag1 = 0;
						}, 1000);
					}
					this.num7 = "boom1_1" + this.funcSet;
					this.tab = "boom2_1" + this.funcSet;
					this.q = "boom3_1" + this.funcSet;
					this.w = "boom4_1" + this.funcSet;
					this.e = "boom5_1" + this.funcSet;
					this.r = "boom6_1" + this.funcSet;
					this.t = "boom7_1" + this.funcSet;
					this.y = "boom8_1" + this.funcSet;
					this.u = "boom9_1" + this.funcSet;
					this.i = "boom10_1" + this.funcSet;
					this.o = "boom11_1" + this.funcSet;
					this.p = "boom12_1" + this.funcSet;
					this.lqu = "boom13_1" + this.funcSet;
					this.rqu = "boom14_1" + this.funcSet;
					this.drawn = "boom15_1" + this.funcSet;
					this.delete = "boom16_1" + this.funcSet;
					this.end = "boom17_1" + this.funcSet;
					this.pdown = "boom18_1" + this.funcSet;
					this.num8 = "boom18_1" + this.funcSet;
					this.num9 = "boom17_1" + this.funcSet;
					this.numplus = "boom16_1" + this.funcSet;
					this.num = 3
				}
				else if (this.num == 3) {
					this.num = 2;
					// this.clear();
					if (this.keyFlag1 == 0) {
						this.keyFlag1 = 1;
						setTimeout(() => {
							this.keyFlag1 = 0;
						}, 1000);
					}
					this.num7 = "boom1_2" + this.funcSet;
					this.tab = "boom2_2" + this.funcSet;
					this.q = "boom3_2" + this.funcSet;
					this.w = "boom4_2" + this.funcSet;
					this.e = "boom5_2" + this.funcSet;
					this.r = "boom6_2" + this.funcSet;
					this.t = "boom7_2" + this.funcSet;
					this.y = "boom8_2" + this.funcSet;
					this.u = "boom9_2" + this.funcSet;
					this.i = "boom10_2" + this.funcSet;
					this.o = "boom11_2" + this.funcSet;
					this.p = "boom12_2" + this.funcSet;
					this.lqu = "boom13_2" + this.funcSet;
					this.rqu = "boom14_2" + this.funcSet;
					this.drawn = "boom15_2" + this.funcSet;
					this.delete = "boom16_2" + this.funcSet;
					this.end = "boom17_2" + this.funcSet;
					this.pdown = "boom18_2" + this.funcSet;
					this.num8 = "boom18_2" + this.funcSet;
					this.num9 = "boom17_2" + this.funcSet;
					this.numplus = "boom16_2" + this.funcSet;
				}
				break;

			case this.vKey == 104 && this.keyStatus == 1: //num8
				if (this.num == 2) {
					// this.clear();
					if (this.keyFlag1 == 0) {
						this.keyFlag1 = 1;
						setTimeout(() => {
							this.keyFlag1 = 0;
						}, 1000);
					}
					this.num8 = "boom1_1" + this.funcSet;
					this.tab = "boom2_1" + this.funcSet;
					this.q = "boom3_1" + this.funcSet;
					this.w = "boom4_1" + this.funcSet;
					this.e = "boom5_1" + this.funcSet;
					this.r = "boom6_1" + this.funcSet;
					this.t = "boom7_1" + this.funcSet;
					this.y = "boom8_1" + this.funcSet;
					this.u = "boom9_1" + this.funcSet;
					this.i = "boom10_1" + this.funcSet;
					this.o = "boom11_1" + this.funcSet;
					this.p = "boom12_1" + this.funcSet;
					this.lqu = "boom13_1" + this.funcSet;
					this.rqu = "boom14_1" + this.funcSet;
					this.drawn = "boom15_1" + this.funcSet;
					this.delete = "boom16_1" + this.funcSet;
					this.end = "boom17_1" + this.funcSet;
					this.pdown = "boom18_1" + this.funcSet;
					this.num7 = "boom19_1" + this.funcSet;
					this.num9 = "boom19_1" + this.funcSet;
					this.numplus = "boom18_1" + this.funcSet;
					this.num = 3
				}
				else if (this.num == 3) {
					this.num = 2;
					// this.clear();
					if (this.keyFlag1 == 0) {
						this.keyFlag1 = 1;
						setTimeout(() => {
							this.keyFlag1 = 0;
						}, 1000);
					}
					this.num8 = "boom1_2" + this.funcSet;
					this.tab = "boom2_2" + this.funcSet;
					this.q = "boom3_2" + this.funcSet;
					this.w = "boom4_2" + this.funcSet;
					this.e = "boom5_2" + this.funcSet;
					this.r = "boom6_2" + this.funcSet;
					this.t = "boom7_2" + this.funcSet;
					this.y = "boom8_2" + this.funcSet;
					this.u = "boom9_2" + this.funcSet;
					this.i = "boom10_2" + this.funcSet;
					this.o = "boom11_2" + this.funcSet;
					this.p = "boom12_2" + this.funcSet;
					this.lqu = "boom13_2" + this.funcSet;
					this.rqu = "boom14_2" + this.funcSet;
					this.drawn = "boom15_2" + this.funcSet;
					this.delete = "boom16_2" + this.funcSet;
					this.end = "boom17_2" + this.funcSet;
					this.pdown = "boom18_2" + this.funcSet;
					this.num7 = "boom19_2" + this.funcSet;
					this.num9 = "boom19_2" + this.funcSet;
					this.numplus = "boom18_2" + this.funcSet;
				}
				break;

			case this.vKey == 105 && this.keyStatus == 1: //num9
				if (this.num == 2) {
					// this.clear();
					if (this.keyFlag1 == 0) {
						this.keyFlag1 = 1;
						setTimeout(() => {
							this.keyFlag1 = 0;
						}, 1000);
					}
					this.num9 = "boom1_1" + this.funcSet;
					this.tab = "boom2_1" + this.funcSet;
					this.q = "boom3_1" + this.funcSet;
					this.w = "boom4_1" + this.funcSet;
					this.e = "boom5_1" + this.funcSet;
					this.r = "boom6_1" + this.funcSet;
					this.t = "boom7_1" + this.funcSet;
					this.y = "boom8_1" + this.funcSet;
					this.u = "boom9_1" + this.funcSet;
					this.i = "boom10_1" + this.funcSet;
					this.o = "boom11_1" + this.funcSet;
					this.p = "boom12_1" + this.funcSet;
					this.lqu = "boom13_1" + this.funcSet;
					this.rqu = "boom14_1" + this.funcSet;
					this.drawn = "boom15_1" + this.funcSet;
					this.delete = "boom16_1" + this.funcSet;
					this.end = "boom17_1" + this.funcSet;
					this.pdown = "boom18_1" + this.funcSet;
					this.num7 = "boom19_1" + this.funcSet;
					this.num8 = "boom20_1" + this.funcSet;
					this.numplus = "boom20_1" + this.funcSet;
					this.num = 3
				}
				else if (this.num == 3) {
					this.num = 2;
					// this.clear();
					if (this.keyFlag1 == 0) {
						this.keyFlag1 = 1;
						setTimeout(() => {
							this.keyFlag1 = 0;
						}, 1000);
					}
					this.num9 = "boom1_2" + this.funcSet;
					this.tab = "boom2_2" + this.funcSet;
					this.q = "boom3_2" + this.funcSet;
					this.w = "boom4_2" + this.funcSet;
					this.e = "boom5_2" + this.funcSet;
					this.r = "boom6_2" + this.funcSet;
					this.t = "boom7_2" + this.funcSet;
					this.y = "boom8_2" + this.funcSet;
					this.u = "boom9_2" + this.funcSet;
					this.i = "boom10_2" + this.funcSet;
					this.o = "boom11_2" + this.funcSet;
					this.p = "boom12_2" + this.funcSet;
					this.lqu = "boom13_2" + this.funcSet;
					this.rqu = "boom14_2" + this.funcSet;
					this.drawn = "boom15_2" + this.funcSet;
					this.delete = "boom16_2" + this.funcSet;
					this.end = "boom17_2" + this.funcSet;
					this.pdown = "boom18_2" + this.funcSet;
					this.num7 = "boom19_2" + this.funcSet;
					this.num8 = "boom20_2" + this.funcSet;
					this.numplus = "boom20_2" + this.funcSet;
				}
				break;

			case this.vKey == 107 && this.keyStatus == 1: //numplus
				if (this.num == 2) {
					// this.clear();
					if (this.keyFlag1 == 0) {
						this.keyFlag1 = 1;
						setTimeout(() => {
							this.keyFlag1 = 0;
						}, 1000);
					}
					this.numplus = "boom1_1" + this.funcSet;
					this.tab = "boom2_1" + this.funcSet;
					this.q = "boom3_1" + this.funcSet;
					this.w = "boom4_1" + this.funcSet;
					this.e = "boom5_1" + this.funcSet;
					this.r = "boom6_1" + this.funcSet;
					this.t = "boom7_1" + this.funcSet;
					this.y = "boom8_1" + this.funcSet;
					this.u = "boom9_1" + this.funcSet;
					this.i = "boom10_1" + this.funcSet;
					this.o = "boom11_1" + this.funcSet;
					this.p = "boom12_1" + this.funcSet;
					this.lqu = "boom13_1" + this.funcSet;
					this.rqu = "boom14_1" + this.funcSet;
					this.drawn = "boom15_1" + this.funcSet;
					this.delete = "boom16_1" + this.funcSet;
					this.end = "boom17_1" + this.funcSet;
					this.pdown = "boom18_1" + this.funcSet;
					this.num7 = "boom19_1" + this.funcSet;
					this.num8 = "boom20_1" + this.funcSet;
					this.num9 = "boom21_1" + this.funcSet;
					this.num = 3
				}
				else if (this.num == 3) {
					this.num = 2;
					// this.clear();
					if (this.keyFlag1 == 0) {
						this.keyFlag1 = 1;
						setTimeout(() => {
							this.keyFlag1 = 0;
						}, 1000);
					}
					this.numplus = "boom1_2" + this.funcSet;
					this.tab = "boom2_2" + this.funcSet;
					this.q = "boom3_2" + this.funcSet;
					this.w = "boom4_2" + this.funcSet;
					this.e = "boom5_2" + this.funcSet;
					this.r = "boom6_2" + this.funcSet;
					this.t = "boom7_2" + this.funcSet;
					this.y = "boom8_2" + this.funcSet;
					this.u = "boom9_2" + this.funcSet;
					this.i = "boom10_2" + this.funcSet;
					this.o = "boom11_2" + this.funcSet;
					this.p = "boom12_2" + this.funcSet;
					this.lqu = "boom13_2" + this.funcSet;
					this.rqu = "boom14_2" + this.funcSet;
					this.drawn = "boom15_2" + this.funcSet;
					this.delete = "boom16_2" + this.funcSet;
					this.end = "boom17_2" + this.funcSet;
					this.pdown = "boom18_2" + this.funcSet;
					this.num7 = "boom19_2" + this.funcSet;
					this.num8 = "boom20_2" + this.funcSet;
					this.num9 = "boom21_2" + this.funcSet;
				}
				break;

			case this.vKey == 20 && this.keyStatus == 1: //CAPS
				if (this.num == 2) {
					// this.clear();
					if (this.keyFlag1 == 0) {
						this.keyFlag1 = 1;
						setTimeout(() => {
							this.keyFlag1 = 0;
						}, 1000);
					}
					this.caps = "boom1_1" + this.funcSet;
					this.a = "boom15_1" + this.funcSet;
					this.s = "boom14_1" + this.funcSet;
					this.d = "boom13_1" + this.funcSet;
					this.f = "boom12_1" + this.funcSet;
					this.g = "boom11_1" + this.funcSet;
					this.h = "boom10_1" + this.funcSet;
					this.j = "boom9_1" + this.funcSet;
					this.k = "boom8_1" + this.funcSet;
					this.l = "boom7_1" + this.funcSet;
					this.sem = "boom6_1" + this.funcSet;
					this.quo = "boom5_1" + this.funcSet;
					this.enter = "boom5_1" + this.funcSet;
					this.num4 = "boom4_1" + this.funcSet;
					this.num5 = "boom3_1" + this.funcSet;
					this.num6 = "boom2_1" + this.funcSet;
					this.num = 3
				}
				else if (this.num == 3) {
					this.num = 2;
					// this.clear();
					if (this.keyFlag1 == 0) {
						this.keyFlag1 = 1;
						setTimeout(() => {
							this.keyFlag1 = 0;
						}, 1000);
					}
					this.caps = "boom1_2" + this.funcSet;
					this.a = "boom15_2" + this.funcSet;
					this.s = "boom14_2" + this.funcSet;
					this.d = "boom13_2" + this.funcSet;
					this.f = "boom12_2" + this.funcSet;
					this.g = "boom11_2" + this.funcSet;
					this.h = "boom10_2" + this.funcSet;
					this.j = "boom9_2" + this.funcSet;
					this.k = "boom8_2" + this.funcSet;
					this.l = "boom7_2" + this.funcSet;
					this.sem = "boom6_2" + this.funcSet;
					this.quo = "boom5_2" + this.funcSet;
					this.enter = "boom5_2" + this.funcSet;
					this.num4 = "boom4_2" + this.funcSet;
					this.num5 = "boom3_2" + this.funcSet;
					this.num6 = "boom2_2" + this.funcSet;
				}
				break;

			case this.vKey == 65 && this.keyStatus == 1: //A
				if (this.num == 2) {
					// this.clear();
					if (this.keyFlag1 == 0) {
						this.keyFlag1 = 1;
						setTimeout(() => {
							this.keyFlag1 = 0;
						}, 1000);
					}
					this.a = "boom1_1" + this.funcSet;
					this.caps = "boom15_1" + this.funcSet;
					this.s = "boom15_1" + this.funcSet;
					this.d = "boom14_1" + this.funcSet;
					this.f = "boom13_1" + this.funcSet;
					this.g = "boom12_1" + this.funcSet;
					this.h = "boom11_1" + this.funcSet;
					this.j = "boom10_1" + this.funcSet;
					this.k = "boom9_1" + this.funcSet;
					this.l = "boom8_1" + this.funcSet;
					this.sem = "boom7_1" + this.funcSet;
					this.quo = "boom6_1" + this.funcSet;
					this.enter = "boom5_1" + this.funcSet;
					this.num4 = "boom4_1" + this.funcSet;
					this.num5 = "boom3_1" + this.funcSet;
					this.num6 = "boom2_1" + this.funcSet;
					this.num = 3
				}
				else if (this.num == 3) {
					this.num = 2;
					// this.clear();
					if (this.keyFlag1 == 0) {
						this.keyFlag1 = 1;
						setTimeout(() => {
							this.keyFlag1 = 0;
						}, 1000);
					}
					this.a = "boom1_2" + this.funcSet;
					this.caps = "boom15_2" + this.funcSet;
					this.s = "boom15_2" + this.funcSet;
					this.d = "boom14_2" + this.funcSet;
					this.f = "boom13_2" + this.funcSet;
					this.g = "boom12_2" + this.funcSet;
					this.h = "boom11_2" + this.funcSet;
					this.j = "boom10_2" + this.funcSet;
					this.k = "boom9_2" + this.funcSet;
					this.l = "boom8_2" + this.funcSet;
					this.sem = "boom7_2" + this.funcSet;
					this.quo = "boom6_2" + this.funcSet;
					this.enter = "boom5_2" + this.funcSet;
					this.num4 = "boom4_2" + this.funcSet;
					this.num5 = "boom3_2" + this.funcSet;
					this.num6 = "boom2_2" + this.funcSet;
				}
				break;

			case this.vKey == 83 && this.keyStatus == 1: //s
				if (this.num == 2) {
					// this.clear();
					if (this.keyFlag1 == 0) {
						this.keyFlag1 = 1;
						setTimeout(() => {
							this.keyFlag1 = 0;
						}, 1000);
					}
					this.s = "boom1_1" + this.funcSet;
					this.caps = "boom3_1" + this.funcSet;
					this.a = "boom14_1" + this.funcSet;
					this.d = "boom14_1" + this.funcSet;
					this.f = "boom13_1" + this.funcSet;
					this.g = "boom12_1" + this.funcSet;
					this.h = "boom11_1" + this.funcSet;
					this.j = "boom10_1" + this.funcSet;
					this.k = "boom9_1" + this.funcSet;
					this.l = "boom8_1" + this.funcSet;
					this.sem = "boom7_1" + this.funcSet;
					this.quo = "boom6_1" + this.funcSet;
					this.enter = "boom5_1" + this.funcSet;
					this.num4 = "boom4_1" + this.funcSet;
					this.num5 = "boom3_1" + this.funcSet;
					this.num6 = "boom2_1" + this.funcSet;
					this.num = 3
				}
				else if (this.num == 3) {
					this.num = 2;
					// this.clear();
					if (this.keyFlag1 == 0) {
						this.keyFlag1 = 1;
						setTimeout(() => {
							this.keyFlag1 = 0;
						}, 1000);
					}
					this.s = "boom1_2" + this.funcSet;
					this.caps = "boom3_2" + this.funcSet;
					this.a = "boom14_2" + this.funcSet;
					this.d = "boom14_2" + this.funcSet;
					this.f = "boom13_2" + this.funcSet;
					this.g = "boom12_2" + this.funcSet;
					this.h = "boom11_2" + this.funcSet;
					this.j = "boom10_2" + this.funcSet;
					this.k = "boom9_2" + this.funcSet;
					this.l = "boom8_2" + this.funcSet;
					this.sem = "boom7_2" + this.funcSet;
					this.quo = "boom6_2" + this.funcSet;
					this.enter = "boom5_2" + this.funcSet;
					this.num4 = "boom4_2" + this.funcSet;
					this.num5 = "boom3_2" + this.funcSet;
					this.num6 = "boom2_2" + this.funcSet;
				}
				break;

			case this.vKey == 68 && this.keyStatus == 1: //d
				if (this.num == 2) {
					// this.clear();
					if (this.keyFlag1 == 0) {
						this.keyFlag1 = 1;
						setTimeout(() => {
							this.keyFlag1 = 0;
						}, 1000);
					}
					this.d = "boom1_1" + this.funcSet;
					this.caps = "boom11_1" + this.funcSet;
					this.a = "boom12_1" + this.funcSet;
					this.s = "boom13_1" + this.funcSet;
					this.f = "boom13_1" + this.funcSet;
					this.g = "boom12_1" + this.funcSet;
					this.h = "boom11_1" + this.funcSet;
					this.j = "boom10_1" + this.funcSet;
					this.k = "boom9_1" + this.funcSet;
					this.l = "boom8_1" + this.funcSet;
					this.sem = "boom7_1" + this.funcSet;
					this.quo = "boom6_1" + this.funcSet;
					this.enter = "boom5_1" + this.funcSet;
					this.num4 = "boom4_1" + this.funcSet;
					this.num5 = "boom3_1" + this.funcSet;
					this.num6 = "boom2_1" + this.funcSet;
					this.num = 3
				}
				else if (this.num == 3) {
					this.num = 2;
					// this.clear();
					if (this.keyFlag1 == 0) {
						this.keyFlag1 = 1;
						setTimeout(() => {
							this.keyFlag1 = 0;
						}, 1000);
					}
					this.d = "boom1_2" + this.funcSet;
					this.caps = "boom11_2" + this.funcSet;
					this.a = "boom12_2" + this.funcSet;
					this.s = "boom13_2" + this.funcSet;
					this.f = "boom13_2" + this.funcSet;
					this.g = "boom12_2" + this.funcSet;
					this.h = "boom11_2" + this.funcSet;
					this.j = "boom10_2" + this.funcSet;
					this.k = "boom9_2" + this.funcSet;
					this.l = "boom8_2" + this.funcSet;
					this.sem = "boom7_2" + this.funcSet;
					this.quo = "boom6_2" + this.funcSet;
					this.enter = "boom5_2" + this.funcSet;
					this.num4 = "boom4_2" + this.funcSet;
					this.num5 = "boom3_2" + this.funcSet;
					this.num6 = "boom2_2" + this.funcSet;
				}
				break;

			case this.vKey == 70 && this.keyStatus == 1: //f
				if (this.num == 2) {
					// this.clear();
					if (this.keyFlag1 == 0) {
						this.keyFlag1 = 1;
						setTimeout(() => {
							this.keyFlag1 = 0;
						}, 1000);
					}
					this.f = "boom1_1" + this.funcSet;
					this.caps = "boom9_1" + this.funcSet;
					this.a = "boom10_1" + this.funcSet;
					this.s = "boom11_1" + this.funcSet;
					this.d = "boom12_1" + this.funcSet;
					this.g = "boom12_1" + this.funcSet;
					this.h = "boom11_1" + this.funcSet;
					this.j = "boom10_1" + this.funcSet;
					this.k = "boom9_1" + this.funcSet;
					this.l = "boom8_1" + this.funcSet;
					this.sem = "boom7_1" + this.funcSet;
					this.quo = "boom6_1" + this.funcSet;
					this.enter = "boom5_1" + this.funcSet;
					this.num4 = "boom4_1" + this.funcSet;
					this.num5 = "boom3_1" + this.funcSet;
					this.num6 = "boom2_1" + this.funcSet;
					this.num = 3
				}
				else if (this.num == 3) {
					this.num = 2;
					// this.clear();
					if (this.keyFlag1 == 0) {
						this.keyFlag1 = 1;
						setTimeout(() => {
							this.keyFlag1 = 0;
						}, 1000);
					}
					this.f = "boom1_2" + this.funcSet;
					this.caps = "boom9_2" + this.funcSet;
					this.a = "boom10_2" + this.funcSet;
					this.s = "boom11_2" + this.funcSet;
					this.d = "boom12_2" + this.funcSet;
					this.g = "boom12_2" + this.funcSet;
					this.h = "boom11_2" + this.funcSet;
					this.j = "boom10_2" + this.funcSet;
					this.k = "boom9_2" + this.funcSet;
					this.l = "boom8_2" + this.funcSet;
					this.sem = "boom7_2" + this.funcSet;
					this.quo = "boom6_2" + this.funcSet;
					this.enter = "boom5_2" + this.funcSet;
					this.num4 = "boom4_2" + this.funcSet;
					this.num5 = "boom3_2" + this.funcSet;
					this.num6 = "boom2_2" + this.funcSet;
				}
				break;

			case this.vKey == 71 && this.keyStatus == 1: //g
				if (this.num == 2) {
					// this.clear();
					if (this.keyFlag1 == 0) {
						this.keyFlag1 = 1;
						setTimeout(() => {
							this.keyFlag1 = 0;
						}, 1000);
					}
					this.caps = "boom7_1" + this.funcSet;
					this.a = "boom8_1" + this.funcSet;
					this.s = "boom9_1" + this.funcSet;
					this.d = "boom10_1" + this.funcSet;
					this.f = "boom11_1" + this.funcSet;
					this.g = "boom1_1" + this.funcSet;
					this.h = "boom11_1" + this.funcSet;
					this.j = "boom10_1" + this.funcSet;
					this.k = "boom9_1" + this.funcSet;
					this.l = "boom8_1" + this.funcSet;
					this.sem = "boom7_1" + this.funcSet;
					this.quo = "boom6_1" + this.funcSet;
					this.enter = "boom5_1" + this.funcSet;
					this.num4 = "boom4_1" + this.funcSet;
					this.num5 = "boom3_1" + this.funcSet;
					this.num6 = "boom2_1" + this.funcSet;
					this.num = 3
				}
				else if (this.num == 3) {
					this.num = 2;
					// this.clear();
					if (this.keyFlag1 == 0) {
						this.keyFlag1 = 1;
						setTimeout(() => {
							this.keyFlag1 = 0;
						}, 1000);
					}
					this.g = "boom1_2" + this.funcSet;
					this.caps = "boom13_2" + this.funcSet;
					this.a = "boom14_2" + this.funcSet;
					this.s = "boom13_2" + this.funcSet;
					this.d = "boom12_2" + this.funcSet;
					this.f = "boom11_2" + this.funcSet;
					this.h = "boom11_2" + this.funcSet;
					this.j = "boom10_2" + this.funcSet;
					this.k = "boom9_2" + this.funcSet;
					this.l = "boom8_2" + this.funcSet;
					this.sem = "boom7_2" + this.funcSet;
					this.quo = "boom6_2" + this.funcSet;
					this.enter = "boom5_2" + this.funcSet;
					this.num4 = "boom4_2" + this.funcSet;
					this.num5 = "boom3_2" + this.funcSet;
					this.num6 = "boom2_2" + this.funcSet;
				}
				break;

			case this.vKey == 72 && this.keyStatus == 1: //h
				if (this.num == 2) {
					// this.clear();
					if (this.keyFlag1 == 0) {
						this.keyFlag1 = 1;
						setTimeout(() => {
							this.keyFlag1 = 0;
						}, 1000);
					}
					this.h = "boom1_1" + this.funcSet;
					this.caps = "boom15_1" + this.funcSet;
					this.a = "boom6_1" + this.funcSet;
					this.s = "boom7_1" + this.funcSet;
					this.d = "boom8_1" + this.funcSet;
					this.f = "boom9_1" + this.funcSet;
					this.g = "boom10_1" + this.funcSet;
					this.j = "boom10_1" + this.funcSet;
					this.k = "boom9_1" + this.funcSet;
					this.l = "boom8_1" + this.funcSet;
					this.sem = "boom7_1" + this.funcSet;
					this.quo = "boom6_1" + this.funcSet;
					this.enter = "boom5_1" + this.funcSet;
					this.num4 = "boom4_1" + this.funcSet;
					this.num5 = "boom3_1" + this.funcSet;
					this.num6 = "boom2_1" + this.funcSet;
					this.num = 3
				}
				else if (this.num == 3) {
					this.num = 2;
					// this.clear();
					if (this.keyFlag1 == 0) {
						this.keyFlag1 = 1;
						setTimeout(() => {
							this.keyFlag1 = 0;
						}, 1000);
					}
					this.h = "boom1_2" + this.funcSet;
					this.caps = "boom5_2" + this.funcSet;
					this.a = "boom6_2" + this.funcSet;
					this.s = "boom7_2" + this.funcSet;
					this.d = "boom8_2" + this.funcSet;
					this.f = "boom9_2" + this.funcSet;
					this.g = "boom10_2" + this.funcSet;
					this.j = "boom10_2" + this.funcSet;
					this.k = "boom9_2" + this.funcSet;
					this.l = "boom8_2" + this.funcSet;
					this.sem = "boom7_2" + this.funcSet;
					this.quo = "boom6_2" + this.funcSet;
					this.enter = "boom5_2" + this.funcSet;
					this.num4 = "boom4_2" + this.funcSet;
					this.num5 = "boom3_2" + this.funcSet;
					this.num6 = "boom2_2" + this.funcSet;
				}
				break;

			case this.vKey == 74 && this.keyStatus == 1: //j
				if (this.num == 2) {
					// this.clear();
					if (this.keyFlag1 == 0) {
						this.keyFlag1 = 1;
						setTimeout(() => {
							this.keyFlag1 = 0;
						}, 1000);
					}
					this.j = "boom1_1" + this.funcSet;
					this.caps = "boom3_1" + this.funcSet;
					this.a = "boom4_1" + this.funcSet;
					this.s = "boom5_1" + this.funcSet;
					this.d = "boom6_1" + this.funcSet;
					this.f = "boom7_1" + this.funcSet;
					this.g = "boom8_1" + this.funcSet;
					this.h = "boom9_1" + this.funcSet;
					this.k = "boom9_1" + this.funcSet;
					this.l = "boom8_1" + this.funcSet;
					this.sem = "boom7_1" + this.funcSet;
					this.quo = "boom6_1" + this.funcSet;
					this.enter = "boom5_1" + this.funcSet;
					this.num4 = "boom4_1" + this.funcSet;
					this.num5 = "boom9_1" + this.funcSet;
					this.num6 = "boom2_1" + this.funcSet;
					this.num = 3
				}
				else if (this.num == 3) {
					this.num = 2;
					// this.clear();
					if (this.keyFlag1 == 0) {
						this.keyFlag1 = 1;
						setTimeout(() => {
							this.keyFlag1 = 0;
						}, 1000);
					}
					this.j = "boom1_2" + this.funcSet;
					this.caps = "boom3_2" + this.funcSet;
					this.a = "boom4_2" + this.funcSet;
					this.s = "boom5_2" + this.funcSet;
					this.d = "boom6_2" + this.funcSet;
					this.f = "boom7_2" + this.funcSet;
					this.g = "boom8_2" + this.funcSet;
					this.h = "boom9_2" + this.funcSet;
					this.k = "boom9_2" + this.funcSet;
					this.l = "boom8_2" + this.funcSet;
					this.sem = "boom7_2" + this.funcSet;
					this.quo = "boom6_2" + this.funcSet;
					this.enter = "boom5_2" + this.funcSet;
					this.num4 = "boom4_2" + this.funcSet;
					this.num5 = "boom9_2" + this.funcSet;
					this.num6 = "boom2_2" + this.funcSet;
				}
				break;

			case this.vKey == 75 && this.keyStatus == 1: //k
				if (this.num == 2) {
					// this.clear();
					if (this.keyFlag1 == 0) {
						this.keyFlag1 = 1;
						setTimeout(() => {
							this.keyFlag1 = 0;
						}, 1000);
					}
					this.k = "boom1_1" + this.funcSet;
					this.caps = "boom2_1" + this.funcSet;
					this.a = "boom3_1" + this.funcSet;
					this.s = "boom4_1" + this.funcSet;
					this.d = "boom5_1" + this.funcSet;
					this.f = "boom6_1" + this.funcSet;
					this.g = "boom7_1" + this.funcSet;
					this.h = "boom8_1" + this.funcSet;
					this.j = "boom9_1" + this.funcSet;
					this.l = "boom9_1" + this.funcSet;
					this.sem = "boom8_1" + this.funcSet;
					this.quo = "boom7_1" + this.funcSet;
					this.enter = "boom6_1" + this.funcSet;
					this.num4 = "boom5_1" + this.funcSet;
					this.num5 = "boom4_1" + this.funcSet;
					this.num6 = "boom3_1" + this.funcSet;
					this.num = 3
				}
				else if (this.num == 3) {
					this.num = 2;
					// this.clear();
					if (this.keyFlag1 == 0) {
						this.keyFlag1 = 1;
						setTimeout(() => {
							this.keyFlag1 = 0;
						}, 1000);
					}
					this.k = "boom1_2" + this.funcSet;
					this.caps = "boom2_2" + this.funcSet;
					this.a = "boom3_2" + this.funcSet;
					this.s = "boom4_2" + this.funcSet;
					this.d = "boom5_2" + this.funcSet;
					this.f = "boom6_2" + this.funcSet;
					this.g = "boom7_2" + this.funcSet;
					this.h = "boom8_2" + this.funcSet;
					this.j = "boom9_2" + this.funcSet;
					this.l = "boom9_2" + this.funcSet;
					this.sem = "boom8_2" + this.funcSet;
					this.quo = "boom7_2" + this.funcSet;
					this.enter = "boom6_2" + this.funcSet;
					this.num4 = "boom5_2" + this.funcSet;
					this.num5 = "boom4_2" + this.funcSet;
					this.num6 = "boom3_2" + this.funcSet;
				}
				break;

			case this.vKey == 76 && this.keyStatus == 1: //l
				if (this.num == 2) {
					// this.clear();
					if (this.keyFlag1 == 0) {
						this.keyFlag1 = 1;
						setTimeout(() => {
							this.keyFlag1 = 0;
						}, 1000);
					}
					this.l = "boom1_1" + this.funcSet;
					this.caps = "boom2_1" + this.funcSet;
					this.a = "boom3_1" + this.funcSet;
					this.s = "boom4_1" + this.funcSet;
					this.d = "boom5_1" + this.funcSet;
					this.f = "boom6_1" + this.funcSet;
					this.g = "boom7_1" + this.funcSet;
					this.h = "boom8_1" + this.funcSet;
					this.j = "boom9_1" + this.funcSet;
					this.k = "boom10_1" + this.funcSet;
					this.sem = "boom10_1" + this.funcSet;
					this.quo = "boom9_1" + this.funcSet;
					this.enter = "boom8_1" + this.funcSet;
					this.num4 = "boom7_1" + this.funcSet;
					this.num5 = "boom6_1" + this.funcSet;
					this.num6 = "boom5_1" + this.funcSet;
					this.num = 3
				}
				else if (this.num == 3) {
					this.num = 2;
					// this.clear();
					if (this.keyFlag1 == 0) {
						this.keyFlag1 = 1;
						setTimeout(() => {
							this.keyFlag1 = 0;
						}, 1000);
					}
					this.l = "boom1_2" + this.funcSet;
					this.caps = "boom2_2" + this.funcSet;
					this.a = "boom3_2" + this.funcSet;
					this.s = "boom4_2" + this.funcSet;
					this.d = "boom5_2" + this.funcSet;
					this.f = "boom6_2" + this.funcSet;
					this.g = "boom7_2" + this.funcSet;
					this.h = "boom8_2" + this.funcSet;
					this.j = "boom9_2" + this.funcSet;
					this.k = "boom10_2" + this.funcSet;
					this.sem = "boom10_2" + this.funcSet;
					this.quo = "boom9_2" + this.funcSet;
					this.enter = "boom8_2" + this.funcSet;
					this.num4 = "boom7_2" + this.funcSet;
					this.num5 = "boom6_2" + this.funcSet;
					this.num6 = "boom5_2" + this.funcSet;
				}
				break;

			case this.vKey == 186 && this.keyStatus == 1: //sem
				if (this.num == 2) {
					// this.clear();
					if (this.keyFlag1 == 0) {
						this.keyFlag1 = 1;
						setTimeout(() => {
							this.keyFlag1 = 0;
						}, 1000);
					}
					this.sem = "boom1_1" + this.funcSet;
					this.caps = "boom2_1" + this.funcSet;
					this.a = "boom3_1" + this.funcSet;
					this.s = "boom4_1" + this.funcSet;
					this.d = "boom5_1" + this.funcSet;
					this.f = "boom6_1" + this.funcSet;
					this.g = "boom7_1" + this.funcSet;
					this.h = "boom8_1" + this.funcSet;
					this.j = "boom9_1" + this.funcSet;
					this.k = "boom10_1" + this.funcSet;
					this.l = "boom11_1" + this.funcSet;
					this.quo = "boom11_1" + this.funcSet;
					this.enter = "boom10_1" + this.funcSet;
					this.num4 = "boom9_1" + this.funcSet;
					this.num5 = "boom8_1" + this.funcSet;
					this.num6 = "boom7_1" + this.funcSet;
					this.num = 3
				}
				else if (this.num == 3) {
					this.num = 2;
					// this.clear();
					if (this.keyFlag1 == 0) {
						this.keyFlag1 = 1;
						setTimeout(() => {
							this.keyFlag1 = 0;
						}, 1000);
					}
					this.sem = "boom1_2" + this.funcSet;
					this.caps = "boom2_2" + this.funcSet;
					this.a = "boom3_2" + this.funcSet;
					this.s = "boom4_2" + this.funcSet;
					this.d = "boom5_2" + this.funcSet;
					this.f = "boom6_2" + this.funcSet;
					this.g = "boom7_2" + this.funcSet;
					this.h = "boom8_2" + this.funcSet;
					this.j = "boom9_2" + this.funcSet;
					this.k = "boom10_2" + this.funcSet;
					this.l = "boom11_2" + this.funcSet;
					this.quo = "boom11_2" + this.funcSet;
					this.enter = "boom10_2" + this.funcSet;
					this.num4 = "boom9_2" + this.funcSet;
					this.num5 = "boom8_2" + this.funcSet;
					this.num6 = "boom7_2" + this.funcSet;
				}
				break;

			case this.vKey == 222 && this.keyStatus == 1: //quo
				if (this.num == 2) {
					// this.clear();
					if (this.keyFlag1 == 0) {
						this.keyFlag1 = 1;
						setTimeout(() => {
							this.keyFlag1 = 0;
						}, 1000);
					}
					this.quo = "boom1_1" + this.funcSet;
					this.caps = "boom2_1" + this.funcSet;
					this.a = "boom3_1" + this.funcSet;
					this.s = "boom4_1" + this.funcSet;
					this.d = "boom5_1" + this.funcSet;
					this.f = "boom6_1" + this.funcSet;
					this.g = "boom7_1" + this.funcSet;
					this.h = "boom8_1" + this.funcSet;
					this.j = "boom9_1" + this.funcSet;
					this.k = "boom10_1" + this.funcSet;
					this.l = "boom11_1" + this.funcSet;
					this.sem = "boom12_1" + this.funcSet;
					this.enter = "boom12_1" + this.funcSet;
					this.num4 = "boom11_1" + this.funcSet;
					this.num5 = "boom10_1" + this.funcSet;
					this.num6 = "boom9_1" + this.funcSet;
					this.num = 3
				}
				else if (this.num == 3) {
					this.num = 2;
					// this.clear();
					if (this.keyFlag1 == 0) {
						this.keyFlag1 = 1;
						setTimeout(() => {
							this.keyFlag1 = 0;
						}, 1000);
					}
					this.quo = "boom1_2" + this.funcSet;
					this.caps = "boom2_2" + this.funcSet;
					this.a = "boom3_2" + this.funcSet;
					this.s = "boom4_2" + this.funcSet;
					this.d = "boom5_2" + this.funcSet;
					this.f = "boom6_2" + this.funcSet;
					this.g = "boom7_2" + this.funcSet;
					this.h = "boom8_2" + this.funcSet;
					this.j = "boom9_2" + this.funcSet;
					this.k = "boom10_2" + this.funcSet;
					this.l = "boom11_2" + this.funcSet;
					this.sem = "boom12_2" + this.funcSet;
					this.enter = "boom12_2" + this.funcSet;
					this.num4 = "boom11_2" + this.funcSet;
					this.num5 = "boom10_2" + this.funcSet;
					this.num6 = "boom9_2" + this.funcSet;
				}
				break;
			case this.vKey == 13 && this.keyStatus == 1://enter
				if (this.num == 2) {
					// this.clear();
					if (this.keyFlag1 == 0) {
						this.keyFlag1 = 1;
						setTimeout(() => {
							this.keyFlag1 = 0;
						}, 1000);
					}
					this.enter = "boom1_1" + this.funcSet;
					this.caps = "boom2_1" + this.funcSet;
					this.a = "boom3_1" + this.funcSet;
					this.s = "boom4_1" + this.funcSet;
					this.d = "boom5_1" + this.funcSet;
					this.f = "boom6_1" + this.funcSet;
					this.g = "boom7_1" + this.funcSet;
					this.h = "boom8_1" + this.funcSet;
					this.j = "boom9_1" + this.funcSet;
					this.k = "boom10_1" + this.funcSet;
					this.l = "boom11_1" + this.funcSet;
					this.sem = "boom12_1" + this.funcSet;
					this.quo = "boom13_1" + this.funcSet;
					this.num4 = "boom13_1" + this.funcSet;
					this.num5 = "boom12_1" + this.funcSet;
					this.num6 = "boom11_1" + this.funcSet;
					this.num = 3
				}
				else if (this.num == 3) {
					this.num = 2;
					// this.clear();
					if (this.keyFlag1 == 0) {
						this.keyFlag1 = 1;
						setTimeout(() => {
							this.keyFlag1 = 0;
						}, 1000);
					}
					this.enter = "boom1_2" + this.funcSet;
					this.caps = "boom2_2" + this.funcSet;
					this.a = "boom3_2" + this.funcSet;
					this.s = "boom4_2" + this.funcSet;
					this.d = "boom5_2" + this.funcSet;
					this.f = "boom6_2" + this.funcSet;
					this.g = "boom7_2" + this.funcSet;
					this.h = "boom8_2" + this.funcSet;
					this.j = "boom9_2" + this.funcSet;
					this.k = "boom10_2" + this.funcSet;
					this.l = "boom11_2" + this.funcSet;
					this.sem = "boom12_2" + this.funcSet;
					this.quo = "boom13_2" + this.funcSet;
					this.num4 = "boom13_2" + this.funcSet;
					this.num5 = "boom12_2" + this.funcSet;
					this.num6 = "boom11_2" + this.funcSet;
				}
				break;

			case this.vKey == 100 && this.keyStatus == 1: //num4
				if (this.num == 2) {
					// this.clear();
					if (this.keyFlag1 == 0) {
						this.keyFlag1 = 1;
						setTimeout(() => {
							this.keyFlag1 = 0;
						}, 1000);
					}
					this.num4 = "boom1_1" + this.funcSet;
					this.caps = "boom2_1" + this.funcSet;
					this.a = "boom3_1" + this.funcSet;
					this.s = "boom4_1" + this.funcSet;
					this.d = "boom5_1" + this.funcSet;
					this.f = "boom6_1" + this.funcSet;
					this.g = "boom7_1" + this.funcSet;
					this.h = "boom8_1" + this.funcSet;
					this.j = "boom9_1" + this.funcSet;
					this.k = "boom10_1" + this.funcSet;
					this.l = "boom11_1" + this.funcSet;
					this.sem = "boom12_1" + this.funcSet;
					this.quo = "boom13_1" + this.funcSet;
					this.enter = "boom14_1" + this.funcSet;
					this.num5 = "boom14_1" + this.funcSet;
					this.num6 = "boom13_1" + this.funcSet;
					this.num = 3
				}
				else if (this.num == 3) {
					this.num = 2;
					// this.clear();
					if (this.keyFlag1 == 0) {
						this.keyFlag1 = 1;
						setTimeout(() => {
							this.keyFlag1 = 0;
						}, 1000);
					}
					this.num4 = "boom1_2" + this.funcSet;
					this.caps = "boom2_2" + this.funcSet;
					this.a = "boom3_2" + this.funcSet;
					this.s = "boom4_2" + this.funcSet;
					this.d = "boom5_2" + this.funcSet;
					this.f = "boom6_2" + this.funcSet;
					this.g = "boom7_2" + this.funcSet;
					this.h = "boom8_2" + this.funcSet;
					this.j = "boom9_2" + this.funcSet;
					this.k = "boom10_2" + this.funcSet;
					this.l = "boom11_2" + this.funcSet;
					this.sem = "boom12_2" + this.funcSet;
					this.quo = "boom13_2" + this.funcSet;
					this.enter = "boom14_2" + this.funcSet;
					this.num5 = "boom14_2" + this.funcSet;
					this.num6 = "boom13_2" + this.funcSet;
				}
				break;

			case this.vKey == 101 && this.keyStatus == 1: //num5
				if (this.num == 2) {
					// this.clear();
					if (this.keyFlag1 == 0) {
						this.keyFlag1 = 1;
						setTimeout(() => {
							this.keyFlag1 = 0;
						}, 1000);
					}
					this.num5 = "boom1_1" + this.funcSet;
					this.caps = "boom2_1" + this.funcSet;
					this.a = "boom3_1" + this.funcSet;
					this.s = "boom4_1" + this.funcSet;
					this.d = "boom5_1" + this.funcSet;
					this.f = "boom6_1" + this.funcSet;
					this.g = "boom7_1" + this.funcSet;
					this.h = "boom8_1" + this.funcSet;
					this.j = "boom9_1" + this.funcSet;
					this.k = "boom10_1" + this.funcSet;
					this.l = "boom11_1" + this.funcSet;
					this.sem = "boom12_1" + this.funcSet;
					this.quo = "boom13_1" + this.funcSet;
					this.enter = "boom14_1" + this.funcSet;
					this.num4 = "boom15_1" + this.funcSet;
					this.num6 = "boom15_1" + this.funcSet;
					this.num = 3
				}
				else if (this.num == 3) {
					this.num = 2;
					// this.clear();
					if (this.keyFlag1 == 0) {
						this.keyFlag1 = 1;
						setTimeout(() => {
							this.keyFlag1 = 0;
						}, 1000);
					}
					this.num5 = "boom1_2" + this.funcSet;
					this.caps = "boom2_2" + this.funcSet;
					this.a = "boom3_2" + this.funcSet;
					this.s = "boom4_2" + this.funcSet;
					this.d = "boom5_2" + this.funcSet;
					this.f = "boom6_2" + this.funcSet;
					this.g = "boom7_2" + this.funcSet;
					this.h = "boom8_2" + this.funcSet;
					this.j = "boom9_2" + this.funcSet;
					this.k = "boom10_2" + this.funcSet;
					this.l = "boom11_2" + this.funcSet;
					this.sem = "boom12_2" + this.funcSet;
					this.quo = "boom13_2" + this.funcSet;
					this.enter = "boom14_2" + this.funcSet;
					this.num4 = "boom15_2" + this.funcSet;
					this.num6 = "boom15_2" + this.funcSet;
				}
				break;

			case this.vKey == 102 && this.keyStatus == 1: //num6
				if (this.num == 2) {
					// this.clear();
					if (this.keyFlag1 == 0) {
						this.keyFlag1 = 1;
						setTimeout(() => {
							this.keyFlag1 = 0;
						}, 1000);
					}
					this.num6 = "boom1_1" + this.funcSet;
					this.caps = "boom2_1" + this.funcSet;
					this.a = "boom3_1" + this.funcSet;
					this.s = "boom4_1" + this.funcSet;
					this.d = "boom5_1" + this.funcSet;
					this.f = "boom6_1" + this.funcSet;
					this.g = "boom7_1" + this.funcSet;
					this.h = "boom8_1" + this.funcSet;
					this.j = "boom9_1" + this.funcSet;
					this.k = "boom10_1" + this.funcSet;
					this.l = "boom11_1" + this.funcSet;
					this.sem = "boom12_1" + this.funcSet;
					this.quo = "boom13_1" + this.funcSet;
					this.enter = "boom14_1" + this.funcSet;
					this.num4 = "boom15_1" + this.funcSet;
					this.num5 = "boom16_1" + this.funcSet;
					this.num = 3
				}
				else if (this.num == 3) {
					this.num = 2;
					// this.clear();
					if (this.keyFlag1 == 0) {
						this.keyFlag1 = 1;
						setTimeout(() => {
							this.keyFlag1 = 0;
						}, 1000);
					}
					this.num6 = "boom1_2" + this.funcSet;
					this.caps = "boom2_2" + this.funcSet;
					this.a = "boom3_2" + this.funcSet;
					this.s = "boom4_2" + this.funcSet;
					this.d = "boom5_2" + this.funcSet;
					this.f = "boom6_2" + this.funcSet;
					this.g = "boom7_2" + this.funcSet;
					this.h = "boom8_2" + this.funcSet;
					this.j = "boom9_2" + this.funcSet;
					this.k = "boom10_2" + this.funcSet;
					this.l = "boom11_2" + this.funcSet;
					this.sem = "boom12_2" + this.funcSet;
					this.quo = "boom13_2" + this.funcSet;
					this.enter = "boom14_2" + this.funcSet;
					this.num4 = "boom15_2" + this.funcSet;
					this.num5 = "boom16_2" + this.funcSet;
				}
				break;

			case this.vKey == 'l16' && this.keyStatus == 1: //lshift
				if (this.num == 2) {
					// this.clear();
					if (this.keyFlag1 == 0) {
						this.keyFlag1 = 1;
						setTimeout(() => {
							this.keyFlag1 = 0;
						}, 1000);
					}
					this.lshift = "boom1_1" + this.funcSet;
					this.z = "boom17_1" + this.funcSet;
					this.x = "boom16_1" + this.funcSet;
					this.c = "boom15_1" + this.funcSet;
					this.v = "boom14_1" + this.funcSet;
					this.b = "boom13_1" + this.funcSet;
					this.n = "boom12_1" + this.funcSet;
					this.m = "boom11_1" + this.funcSet;
					this.comma = "boom10_1" + this.funcSet;
					this.dot = "boom9_1" + this.funcSet;
					this.qmark = "boom8_1" + this.funcSet;
					this.rshift = "boom7_1" + this.funcSet;
					this.up = "boom6_1" + this.funcSet;
					this.num1 = "boom5_1" + this.funcSet;
					this.num2 = "boom4_1" + this.funcSet;
					this.num3 = "boom3_1" + this.funcSet;
					this.numenter = "boom2_1" + this.funcSet;
					this.num = 3
				}
				else if (this.num == 3) {
					this.num = 2;
					// this.clear();
					if (this.keyFlag1 == 0) {
						this.keyFlag1 = 1;
						setTimeout(() => {
							this.keyFlag1 = 0;
						}, 1000);
					}
					this.lshift = "boom1_2" + this.funcSet;
					this.z = "boom17_2" + this.funcSet;
					this.x = "boom16_2" + this.funcSet;
					this.c = "boom15_2" + this.funcSet;
					this.v = "boom14_2" + this.funcSet;
					this.b = "boom13_2" + this.funcSet;
					this.n = "boom12_2" + this.funcSet;
					this.m = "boom11_2" + this.funcSet;
					this.comma = "boom10_2" + this.funcSet;
					this.dot = "boom9_2" + this.funcSet;
					this.qmark = "boom8_2" + this.funcSet;
					this.rshift = "boom7_2" + this.funcSet;
					this.up = "boom6_2" + this.funcSet;
					this.num1 = "boom5_2" + this.funcSet;
					this.num2 = "boom4_2" + this.funcSet;
					this.num3 = "boom3_2" + this.funcSet;
					this.numenter = "boom2_2" + this.funcSet;
				}
				break;

			case this.vKey == 90 && this.keyStatus == 1: //z
				if (this.num == 2) {
					// this.clear();
					if (this.keyFlag1 == 0) {
						this.keyFlag1 = 1;
						setTimeout(() => {
							this.keyFlag1 = 0;
						}, 1000);
					}
					this.z = "boom1_1" + this.funcSet;
					this.lshift = "boom16_1" + this.funcSet;
					this.x = "boom16_1" + this.funcSet;
					this.c = "boom15_1" + this.funcSet;
					this.v = "boom14_1" + this.funcSet;
					this.b = "boom13_1" + this.funcSet;
					this.n = "boom12_1" + this.funcSet;
					this.m = "boom11_1" + this.funcSet;
					this.comma = "boom10_1" + this.funcSet;
					this.dot = "boom9_1" + this.funcSet;
					this.qmark = "boom8_1" + this.funcSet;
					this.rshift = "boom7_1" + this.funcSet;
					this.up = "boom6_1" + this.funcSet;
					this.num1 = "boom5_1" + this.funcSet;
					this.num2 = "boom4_1" + this.funcSet;
					this.num3 = "boom3_1" + this.funcSet;
					this.numenter = "boom2_1" + this.funcSet;
					this.num = 3
				}
				else if (this.num == 3) {
					this.num = 2;
					// this.clear();
					if (this.keyFlag1 == 0) {
						this.keyFlag1 = 1;
						setTimeout(() => {
							this.keyFlag1 = 0;
						}, 1000);
					}
					this.z = "boom1_2" + this.funcSet;
					this.lshift = "boom16_2" + this.funcSet;
					this.x = "boom16_2" + this.funcSet;
					this.c = "boom15_2" + this.funcSet;
					this.v = "boom14_2" + this.funcSet;
					this.b = "boom13_2" + this.funcSet;
					this.n = "boom12_2" + this.funcSet;
					this.m = "boom11_2" + this.funcSet;
					this.comma = "boom10_2" + this.funcSet;
					this.dot = "boom9_2" + this.funcSet;
					this.qmark = "boom8_2" + this.funcSet;
					this.rshift = "boom7_2" + this.funcSet;
					this.up = "boom6_2" + this.funcSet;
					this.num1 = "boom5_2" + this.funcSet;
					this.num2 = "boom4_2" + this.funcSet;
					this.num3 = "boom3_2" + this.funcSet;
					this.numenter = "boom2_2" + this.funcSet;
				}
				break;

			case this.vKey == 88 && this.keyStatus == 1: //x
				if (this.num == 2) {
					// this.clear();
					if (this.keyFlag1 == 0) {
						this.keyFlag1 = 1;
						setTimeout(() => {
							this.keyFlag1 = 0;
						}, 1000);
					}
					this.x = "boom1_1" + this.funcSet;
					this.lshift = "boom14_1" + this.funcSet;
					this.z = "boom15_1" + this.funcSet;
					this.c = "boom15_1" + this.funcSet;
					this.v = "boom14_1" + this.funcSet;
					this.b = "boom13_1" + this.funcSet;
					this.n = "boom12_1" + this.funcSet;
					this.m = "boom11_1" + this.funcSet;
					this.comma = "boom10_1" + this.funcSet;
					this.dot = "boom9_1" + this.funcSet;
					this.qmark = "boom8_1" + this.funcSet;
					this.rshift = "boom7_1" + this.funcSet;
					this.up = "boom6_1" + this.funcSet;
					this.num1 = "boom5_1" + this.funcSet;
					this.num2 = "boom4_1" + this.funcSet;
					this.num3 = "boom3_1" + this.funcSet;
					this.numenter = "boom2_1" + this.funcSet;
					this.num = 3
				}
				else if (this.num == 3) {
					this.num = 2;
					// this.clear();
					if (this.keyFlag1 == 0) {
						this.keyFlag1 = 1;
						setTimeout(() => {
							this.keyFlag1 = 0;
						}, 1000);
					}
					this.x = "boom1_2" + this.funcSet;
					this.lshift = "boom14_2" + this.funcSet;
					this.z = "boom15_2" + this.funcSet;
					this.c = "boom15_2" + this.funcSet;
					this.v = "boom14_2" + this.funcSet;
					this.b = "boom13_2" + this.funcSet;
					this.n = "boom12_2" + this.funcSet;
					this.m = "boom11_2" + this.funcSet;
					this.comma = "boom10_2" + this.funcSet;
					this.dot = "boom9_2" + this.funcSet;
					this.qmark = "boom8_2" + this.funcSet;
					this.rshift = "boom7_2" + this.funcSet;
					this.up = "boom6_2" + this.funcSet;
					this.num1 = "boom5_2" + this.funcSet;
					this.num2 = "boom4_2" + this.funcSet;
					this.num3 = "boom3_2" + this.funcSet;
					this.numenter = "boom2_2" + this.funcSet;
				}
				break;

			case this.vKey == 67 && this.keyStatus == 1: //c
				if (this.num == 2) {
					// this.clear();
					if (this.keyFlag1 == 0) {
						this.keyFlag1 = 1;
						setTimeout(() => {
							this.keyFlag1 = 0;
						}, 1000);
					}
					this.c = "boom1_1" + this.funcSet;
					this.lshift = "boom12_1" + this.funcSet;
					this.z = "boom13_1" + this.funcSet;
					this.x = "boom14_1" + this.funcSet;
					this.v = "boom14_1" + this.funcSet;
					this.b = "boom13_1" + this.funcSet;
					this.n = "boom12_1" + this.funcSet;
					this.m = "boom11_1" + this.funcSet;
					this.comma = "boom10_1" + this.funcSet;
					this.dot = "boom9_1" + this.funcSet;
					this.qmark = "boom8_1" + this.funcSet;
					this.rshift = "boom7_1" + this.funcSet;
					this.up = "boom6_1" + this.funcSet;
					this.num1 = "boom5_1" + this.funcSet;
					this.num2 = "boom4_1" + this.funcSet;
					this.num3 = "boom3_1" + this.funcSet;
					this.numenter = "boom2_1" + this.funcSet;
					this.num = 3
				}
				else if (this.num == 3) {
					this.num = 2;
					// this.clear();
					if (this.keyFlag1 == 0) {
						this.keyFlag1 = 1;
						setTimeout(() => {
							this.keyFlag1 = 0;
						}, 1000);
					}
					this.c = "boom1_2" + this.funcSet;
					this.lshift = "boom12_2" + this.funcSet;
					this.z = "boom13_2" + this.funcSet;
					this.x = "boom14_2" + this.funcSet;
					this.v = "boom14_2" + this.funcSet;
					this.b = "boom13_2" + this.funcSet;
					this.n = "boom12_2" + this.funcSet;
					this.m = "boom11_2" + this.funcSet;
					this.comma = "boom10_2" + this.funcSet;
					this.dot = "boom9_2" + this.funcSet;
					this.qmark = "boom8_2" + this.funcSet;
					this.rshift = "boom7_2" + this.funcSet;
					this.up = "boom6_2" + this.funcSet;
					this.num1 = "boom5_2" + this.funcSet;
					this.num2 = "boom4_2" + this.funcSet;
					this.num3 = "boom3_2" + this.funcSet;
					this.numenter = "boom2_2" + this.funcSet;
				}
				break;

			case this.vKey == 86 && this.keyStatus == 1: //v
				if (this.num == 2) {
					// this.clear();
					if (this.keyFlag1 == 0) {
						this.keyFlag1 = 1;
						setTimeout(() => {
							this.keyFlag1 = 0;
						}, 1000);
					}
					this.v = "boom1_`" + this.funcSet;
					this.lshift = "boom10_1" + this.funcSet;
					this.z = "boom11_1" + this.funcSet;
					this.x = "boom12_1" + this.funcSet;
					this.c = "boom13_1" + this.funcSet;
					this.b = "boom13_1" + this.funcSet;
					this.n = "boom12_1" + this.funcSet;
					this.m = "boom11_1" + this.funcSet;
					this.comma = "boom10_1" + this.funcSet;
					this.dot = "boom9_1" + this.funcSet;
					this.qmark = "boom8_1" + this.funcSet;
					this.rshift = "boom7_1" + this.funcSet;
					this.up = "boom6_1" + this.funcSet;
					this.num1 = "boom5_1" + this.funcSet;
					this.num2 = "boom4_1" + this.funcSet;
					this.num3 = "boom3_1" + this.funcSet;
					this.numenter = "boom2_1" + this.funcSet;
					this.num = 3
				}
				else if (this.num == 3) {
					this.num = 2;
					// this.clear();
					if (this.keyFlag1 == 0) {
						this.keyFlag1 = 1;
						setTimeout(() => {
							this.keyFlag1 = 0;
						}, 1000);
					}
					this.v = "boom1_2" + this.funcSet;
					this.lshift = "boom10_2" + this.funcSet;
					this.z = "boom11_2" + this.funcSet;
					this.x = "boom12_2" + this.funcSet;
					this.c = "boom13_2" + this.funcSet;
					this.b = "boom13_2" + this.funcSet;
					this.n = "boom12_2" + this.funcSet;
					this.m = "boom11_2" + this.funcSet;
					this.comma = "boom10_2" + this.funcSet;
					this.dot = "boom9_2" + this.funcSet;
					this.qmark = "boom8_2" + this.funcSet;
					this.rshift = "boom7_2" + this.funcSet;
					this.up = "boom6_2" + this.funcSet;
					this.num1 = "boom5_2" + this.funcSet;
					this.num2 = "boom4_2" + this.funcSet;
					this.num3 = "boom3_2" + this.funcSet;
					this.numenter = "boom2_2" + this.funcSet;
				}
				break;

			case this.vKey == 66 && this.keyStatus == 1: //b
				if (this.num == 2) {
					// this.clear();
					if (this.keyFlag1 == 0) {
						this.keyFlag1 = 1;
						setTimeout(() => {
							this.keyFlag1 = 0;
						}, 1000);
					}
					this.b = "boom1_1" + this.funcSet;
					this.lshift = "boom8_1" + this.funcSet;
					this.z = "boom9_1" + this.funcSet;
					this.x = "boom10_1" + this.funcSet;
					this.c = "boom11_1" + this.funcSet;
					this.v = "boom12_1" + this.funcSet;
					this.n = "boom12_1" + this.funcSet;
					this.m = "boom11_1" + this.funcSet;
					this.comma = "boom10_1" + this.funcSet;
					this.dot = "boom9_1" + this.funcSet;
					this.qmark = "boom8_1" + this.funcSet;
					this.rshift = "boom7_1" + this.funcSet;
					this.up = "boom6_1" + this.funcSet;
					this.num1 = "boom5_1" + this.funcSet;
					this.num2 = "boom4_1" + this.funcSet;
					this.num3 = "boom3_1" + this.funcSet;
					this.numenter = "boom2_1" + this.funcSet;
					this.num = 3
				}
				else if (this.num == 3) {
					this.num = 2;
					// this.clear();
					if (this.keyFlag1 == 0) {
						this.keyFlag1 = 1;
						setTimeout(() => {
							this.keyFlag1 = 0;
						}, 1000);
					}
					this.h = "boom1_2" + this.funcSet;
					this.lshift = "boom8_2" + this.funcSet;
					this.z = "boom9_2" + this.funcSet;
					this.x = "boom10_2" + this.funcSet;
					this.c = "boom11_2" + this.funcSet;
					this.v = "boom12_2" + this.funcSet;
					this.n = "boom12_2" + this.funcSet;
					this.m = "boom11_2" + this.funcSet;
					this.comma = "boom10_2" + this.funcSet;
					this.dot = "boom9_2" + this.funcSet;
					this.qmark = "boom8_2" + this.funcSet;
					this.rshift = "boom7_2" + this.funcSet;
					this.up = "boom6_2" + this.funcSet;
					this.num1 = "boom5_2" + this.funcSet;
					this.num2 = "boom4_2" + this.funcSet;
					this.num3 = "boom3_2" + this.funcSet;
					this.numenter = "boom2_2" + this.funcSet;
				}
				break;

			case this.vKey == 78 && this.keyStatus == 1: //n
				if (this.num == 2) {
					// this.clear();
					if (this.keyFlag1 == 0) {
						this.keyFlag1 = 1;
						setTimeout(() => {
							this.keyFlag1 = 0;
						}, 1000);
					}
					this.n = "boom1_1" + this.funcSet;
					this.lshift = "boom6_1" + this.funcSet;
					this.z = "boom7_1" + this.funcSet;
					this.x = "boom8_1" + this.funcSet;
					this.c = "boom9_1" + this.funcSet;
					this.v = "boom10_1" + this.funcSet;
					this.b = "boom11_1" + this.funcSet;
					this.m = "boom11_1" + this.funcSet;
					this.comma = "boom10_1" + this.funcSet;
					this.dot = "boom9_1" + this.funcSet;
					this.qmark = "boom8_1" + this.funcSet;
					this.rshift = "boom7_1" + this.funcSet;
					this.up = "boom6_1" + this.funcSet;
					this.num1 = "boom5_1" + this.funcSet;
					this.num2 = "boom4_1" + this.funcSet;
					this.num3 = "boom3_1" + this.funcSet;
					this.numenter = "boom2_1" + this.funcSet;
					this.num = 3
				}
				else if (this.num == 3) {
					this.num = 2;
					// this.clear();
					if (this.keyFlag1 == 0) {
						this.keyFlag1 = 1;
						setTimeout(() => {
							this.keyFlag1 = 0;
						}, 1000);
					}
					this.n = "boom1_2" + this.funcSet;
					this.lshift = "boom6_2" + this.funcSet;
					this.z = "boom7_2" + this.funcSet;
					this.x = "boom8_2" + this.funcSet;
					this.c = "boom9_2" + this.funcSet;
					this.v = "boom10_2" + this.funcSet;
					this.b = "boom11_2" + this.funcSet;
					this.m = "boom11_2" + this.funcSet;
					this.comma = "boom10_2" + this.funcSet;
					this.dot = "boom9_2" + this.funcSet;
					this.qmark = "boom8_2" + this.funcSet;
					this.rshift = "boom7_2" + this.funcSet;
					this.up = "boom6_2" + this.funcSet;
					this.num1 = "boom5_2" + this.funcSet;
					this.num2 = "boom4_2" + this.funcSet;
					this.num3 = "boom3_2" + this.funcSet;
					this.numenter = "boom2_2" + this.funcSet;
				}
				break;

			case this.vKey == 77 && this.keyStatus == 1: //m
				if (this.num == 2) {
					// this.clear();
					if (this.keyFlag1 == 0) {
						this.keyFlag1 = 1;
						setTimeout(() => {
							this.keyFlag1 = 0;
						}, 1000);
					}
					this.m = "boom1_1" + this.funcSet;
					this.lshift = "boom4_1" + this.funcSet;
					this.z = "boom5_1" + this.funcSet;
					this.x = "boom6_1" + this.funcSet;
					this.c = "boom7_1" + this.funcSet;
					this.v = "boom8_1" + this.funcSet;
					this.b = "boom9_1" + this.funcSet;
					this.n = "boom10_1" + this.funcSet;
					this.comma = "boom10_1" + this.funcSet;
					this.dot = "boom9_1" + this.funcSet;
					this.qmark = "boom8_1" + this.funcSet;
					this.rshift = "boom7_1" + this.funcSet;
					this.up = "boom6_1" + this.funcSet;
					this.num1 = "boom5_1" + this.funcSet;
					this.num2 = "boom4_1" + this.funcSet;
					this.num3 = "boom3_1" + this.funcSet;
					this.numenter = "boom2_1" + this.funcSet;
					this.num = 3
				}
				else if (this.num == 3) {
					this.num = 2;
					// this.clear();
					if (this.keyFlag1 == 0) {
						this.keyFlag1 = 1;
						setTimeout(() => {
							this.keyFlag1 = 0;
						}, 1000);
					}
					this.m = "boom1_2" + this.funcSet;
					this.lshift = "boom4_2" + this.funcSet;
					this.z = "boom5_2" + this.funcSet;
					this.x = "boom6_2" + this.funcSet;
					this.c = "boom7_2" + this.funcSet;
					this.v = "boom8_2" + this.funcSet;
					this.b = "boom9_2" + this.funcSet;
					this.n = "boom10_2" + this.funcSet;
					this.comma = "boom10_2" + this.funcSet;
					this.dot = "boom9_2" + this.funcSet;
					this.qmark = "boom8_2" + this.funcSet;
					this.rshift = "boom7_2" + this.funcSet;
					this.up = "boom6_2" + this.funcSet;
					this.num1 = "boom5_2" + this.funcSet;
					this.num2 = "boom4_2" + this.funcSet;
					this.num3 = "boom3_2" + this.funcSet;
					this.numenter = "boom2_2_" + this.funcSet
				}
				break;

			case this.vKey == 188 && this.keyStatus == 1: //comma
				if (this.num == 2) {
					// this.clear();
					if (this.keyFlag1 == 0) {
						this.keyFlag1 = 1;
						setTimeout(() => {
							this.keyFlag1 = 0;
						}, 1000);
					}
					this.comma = "boom1_1" + this.funcSet;
					this.lshift = "boom2_1" + this.funcSet;
					this.z = "boom3_1" + this.funcSet;
					this.x = "boom4_1" + this.funcSet;
					this.c = "boom5_1" + this.funcSet;
					this.v = "boom6_1" + this.funcSet;
					this.b = "boom7_1" + this.funcSet;
					this.n = "boom8_1" + this.funcSet;
					this.m = "boom9_1" + this.funcSet;
					this.dot = "boom10_1" + this.funcSet;
					this.qmark = "boom11_1" + this.funcSet;
					this.rshift = "boom11_1" + this.funcSet;
					this.up = "boom10_1" + this.funcSet;
					this.num1 = "boom9_1" + this.funcSet;
					this.num2 = "boom8_1" + this.funcSet;
					this.num3 = "boom7_1" + this.funcSet;
					this.numenter = "boom6_1" + this.funcSet;
					this.num = 3
				}
				else if (this.num == 3) {
					this.num = 2;
					// this.clear();
					if (this.keyFlag1 == 0) {
						this.keyFlag1 = 1;
						setTimeout(() => {
							this.keyFlag1 = 0;
						}, 1000);
					}
					this.comma = "boom1_2" + this.funcSet;
					this.lshift = "boom2_2" + this.funcSet;
					this.z = "boom3_2" + this.funcSet;
					this.x = "boom4_2" + this.funcSet;
					this.c = "boom5_2" + this.funcSet;
					this.v = "boom6_2" + this.funcSet;
					this.b = "boom7_2" + this.funcSet;
					this.n = "boom8_2" + this.funcSet;
					this.m = "boom9_2" + this.funcSet;
					this.dot = "boom10_2" + this.funcSet;
					this.qmark = "boom11_2" + this.funcSet;
					this.rshift = "boom11_2" + this.funcSet;
					this.up = "boom10_2" + this.funcSet;
					this.num1 = "boom9_2" + this.funcSet;
					this.num2 = "boom8_2" + this.funcSet;
					this.num3 = "boom7_2" + this.funcSet;
					this.numenter = "boom6_2" + this.funcSet;
				}
				break;

			case this.vKey == 190 && this.keyStatus == 1: //dot
				if (this.num == 2) {
					// this.clear();
					if (this.keyFlag1 == 0) {
						this.keyFlag1 = 1;
						setTimeout(() => {
							this.keyFlag1 = 0;
						}, 1000);
					}
					this.dot = "boom_1" + this.funcSet;
					this.lshift = "boom2_1" + this.funcSet;
					this.z = "boom3_1" + this.funcSet;
					this.x = "boom4_1" + this.funcSet;
					this.c = "boom5_1" + this.funcSet;
					this.v = "boom6_1" + this.funcSet;
					this.b = "boom7_1" + this.funcSet;
					this.n = "boom8_1" + this.funcSet;
					this.m = "boom9_1" + this.funcSet;
					this.comma = "boom10_1" + this.funcSet;
					this.qmark = "boom10_1" + this.funcSet;
					this.rshift = "boom9_1" + this.funcSet;
					this.up = "boom8_1" + this.funcSet;
					this.num1 = "boom7_1" + this.funcSet;
					this.num2 = "boom6_1" + this.funcSet;
					this.num3 = "boom5_1" + this.funcSet;
					this.numenter = "boom4_1" + this.funcSet;
					this.num = 3
				}
				else if (this.num == 3) {
					this.num = 2;
					// this.clear();
					if (this.keyFlag1 == 0) {
						this.keyFlag1 = 1;
						setTimeout(() => {
							this.keyFlag1 = 0;
						}, 1000);
					}
					this.dot = "boom_2" + this.funcSet;
					this.lshift = "boom2_2" + this.funcSet;
					this.z = "boom3_2" + this.funcSet;
					this.x = "boom4_2" + this.funcSet;
					this.c = "boom5_2" + this.funcSet;
					this.v = "boom6_2" + this.funcSet;
					this.b = "boom7_2" + this.funcSet;
					this.n = "boom8_2" + this.funcSet;
					this.m = "boom9_2" + this.funcSet;
					this.comma = "boom10_2" + this.funcSet;
					this.qmark = "boom10_2" + this.funcSet;
					this.rshift = "boom9_2" + this.funcSet;
					this.up = "boom8_2" + this.funcSet;
					this.num1 = "boom7_2" + this.funcSet;
					this.num2 = "boom6_2" + this.funcSet;
					this.num3 = "boom5_2" + this.funcSet;
					this.numenter = "boom4_2" + this.funcSet;
				}
				break;

			case this.vKey == 191 && this.keyStatus == 1: //qmark
				if (this.num == 2) {
					// this.clear();
					if (this.keyFlag1 == 0) {
						this.keyFlag1 = 1;
						setTimeout(() => {
							this.keyFlag1 = 0;
						}, 1000);
					}
					this.qmark = "boom1_1" + this.funcSet;
					this.lshift = "boom2_1" + this.funcSet;
					this.z = "boom3_1" + this.funcSet;
					this.x = "boom4_1" + this.funcSet;
					this.c = "boom5_1" + this.funcSet;
					this.v = "boom6_1" + this.funcSet;
					this.b = "boom7_1" + this.funcSet;
					this.n = "boom8_1" + this.funcSet;
					this.m = "boom9_1" + this.funcSet;
					this.comma = "boom10_1" + this.funcSet;
					this.dot = "boom11_1" + this.funcSet;
					this.rshift = "boom11_1" + this.funcSet;
					this.up = "boom10_1" + this.funcSet;
					this.num1 = "boom9_1" + this.funcSet;
					this.num2 = "boom8_1" + this.funcSet;
					this.num3 = "wave7_1" + this.funcSet;
					this.numenter = "boom6_1" + this.funcSet;
					this.num = 3
				}
				else if (this.num == 3) {
					this.num = 2;
					// this.clear();
					if (this.keyFlag1 == 0) {
						this.keyFlag1 = 1;
						setTimeout(() => {
							this.keyFlag1 = 0;
						}, 1000);
					}
					this.qmark = "boom1_2" + this.funcSet;
					this.lshift = "boom2_2" + this.funcSet;
					this.z = "boom3_2" + this.funcSet;
					this.x = "boom4_2" + this.funcSet;
					this.c = "boom5_2" + this.funcSet;
					this.v = "boom6_2" + this.funcSet;
					this.b = "boom7_2" + this.funcSet;
					this.n = "boom8_2" + this.funcSet;
					this.m = "boom9_2" + this.funcSet;
					this.comma = "boom10_2" + this.funcSet;
					this.dot = "boom11_2" + this.funcSet;
					this.rshift = "boom11_2" + this.funcSet;
					this.up = "boom10_2" + this.funcSet;
					this.num1 = "boom9_2" + this.funcSet;
					this.num2 = "boom8_2" + this.funcSet;
					this.num3 = "wave7_2" + this.funcSet;
					this.numenter = "boom6_2" + this.funcSet;
				}
				break;

			case this.vKey == 'r16' && this.keyStatus == 1: //rshift
				if (this.num == 2) {
					// this.clear();
					if (this.keyFlag1 == 0) {
						this.keyFlag1 = 1;
						setTimeout(() => {
							this.keyFlag1 = 0;
						}, 1000);
					}
					this.rshift = "boom1_1" + this.funcSet;
					this.lshift = "boom2_1" + this.funcSet;
					this.z = "boom3_1" + this.funcSet;
					this.x = "boom4_1" + this.funcSet;
					this.c = "boom5_1" + this.funcSet;
					this.v = "boom6_1" + this.funcSet;
					this.b = "boom7_1" + this.funcSet;
					this.n = "boom8_1" + this.funcSet;
					this.m = "boom9_1" + this.funcSet;
					this.comma = "boom10_1" + this.funcSet;
					this.dot = "boom11_1" + this.funcSet;
					this.qmark = "boom12_1" + this.funcSet;
					this.up = "boom12_1" + this.funcSet;
					this.num1 = "boom11_1" + this.funcSet;
					this.num2 = "boom10_1" + this.funcSet;
					this.num3 = "boom9_1" + this.funcSet;
					this.numenter = "boom8_1" + this.funcSet;
					this.num = 3
				}
				else if (this.num == 3) {
					this.num = 2;
					// this.clear();
					if (this.keyFlag1 == 0) {
						this.keyFlag1 = 1;
						setTimeout(() => {
							this.keyFlag1 = 0;
						}, 1000);
					}
					this.rshift = "boom1_2" + this.funcSet;
					this.lshift = "boom2_2" + this.funcSet;
					this.z = "boom3_2" + this.funcSet;
					this.x = "boom4_2" + this.funcSet;
					this.c = "boom5_2" + this.funcSet;
					this.v = "boom6_2" + this.funcSet;
					this.b = "boom7_2" + this.funcSet;
					this.n = "boom8_2" + this.funcSet;
					this.m = "boom9_2" + this.funcSet;
					this.comma = "boom10_2" + this.funcSet;
					this.dot = "boom11_2" + this.funcSet;
					this.qmark = "boom12_2" + this.funcSet;
					this.up = "boom12_2" + this.funcSet;
					this.num1 = "boom11_2" + this.funcSet;
					this.num2 = "boom10_2" + this.funcSet;
					this.num3 = "boom9_2" + this.funcSet;
					this.numenter = "boom8_2" + this.funcSet;
				}
				break;

			case this.vKey == 38 && this.keyStatus == 1: //up
				if (this.num == 2) {
					// this.clear();
					if (this.keyFlag1 == 0) {
						this.keyFlag1 = 1;
						setTimeout(() => {
							this.keyFlag1 = 0;
						}, 1000);
					}
					this.up = "boom1_1" + this.funcSet;
					this.lshift = "boom2_1" + this.funcSet;
					this.z = "boom3_1" + this.funcSet;
					this.x = "boom4_1" + this.funcSet;
					this.c = "boom5_1" + this.funcSet;
					this.v = "boom6_1" + this.funcSet;
					this.b = "boom7_1" + this.funcSet;
					this.n = "boom8_1" + this.funcSet;
					this.m = "boom9_1" + this.funcSet;
					this.comma = "boom10_1" + this.funcSet;
					this.dot = "boom11_1" + this.funcSet;
					this.qmark = "boom12_1" + this.funcSet;
					this.rshift = "boom13_1" + this.funcSet;
					this.num1 = "boom13_1" + this.funcSet;
					this.num2 = "boom12_1" + this.funcSet;
					this.num3 = "boom11_1" + this.funcSet;
					this.numenter = "boom10_1" + this.funcSet;
					this.num = 3
				}
				else if (this.num == 3) {
					this.num = 2;
					// this.clear();
					if (this.keyFlag1 == 0) {
						this.keyFlag1 = 1;
						setTimeout(() => {
							this.keyFlag1 = 0;
						}, 1000);
					}
					this.up = "boom1_2" + this.funcSet;
					this.lshift = "boom2_2" + this.funcSet;
					this.z = "boom3_2" + this.funcSet;
					this.x = "boom4_2" + this.funcSet;
					this.c = "boom5_2" + this.funcSet;
					this.v = "boom6_2" + this.funcSet;
					this.b = "boom7_2" + this.funcSet;
					this.n = "boom8_2" + this.funcSet;
					this.m = "boom9_2" + this.funcSet;
					this.comma = "boom10_2" + this.funcSet;
					this.dot = "boom11_2" + this.funcSet;
					this.qmark = "boom12_2" + this.funcSet;
					this.rshift = "boom13_2" + this.funcSet;
					this.num1 = "boom13_2" + this.funcSet;
					this.num2 = "boom12_2" + this.funcSet;
					this.num3 = "boom11_2" + this.funcSet;
					this.numenter = "boom10_2" + this.funcSet;
				}
				break;

			case this.vKey == 97 && this.keyStatus == 1: //num1
				if (this.num == 2) {
					// this.clear();
					if (this.keyFlag1 == 0) {
						this.keyFlag1 = 1;
						setTimeout(() => {
							this.keyFlag1 = 0;
						}, 1000);
					}
					this.num1 = "boom1_1" + this.funcSet;
					this.lshift = "boom2_1" + this.funcSet;
					this.z = "boom3_1" + this.funcSet;
					this.x = "boom4_1" + this.funcSet;
					this.c = "boom5_1" + this.funcSet;
					this.v = "boom6_1" + this.funcSet;
					this.b = "boom7_1" + this.funcSet;
					this.n = "boom8_1" + this.funcSet;
					this.m = "boom9_1" + this.funcSet;
					this.comma = "boom10_1" + this.funcSet;
					this.dot = "boom11_1" + this.funcSet;
					this.qmark = "boom12_1" + this.funcSet;
					this.rshift = "boom13_1" + this.funcSet;
					this.up = "boom14_1" + this.funcSet;
					this.num2 = "boom14_1" + this.funcSet;
					this.num3 = "boom13_1" + this.funcSet;
					this.numenter = "boom12_1" + this.funcSet;
					this.num = 3
				}
				else if (this.num == 3) {
					this.num = 2;
					// this.clear();
					if (this.keyFlag1 == 0) {
						this.keyFlag1 = 1;
						setTimeout(() => {
							this.keyFlag1 = 0;
						}, 1000);
					}
					this.num1 = "boom1_2" + this.funcSet;
					this.lshift = "boom2_2" + this.funcSet;
					this.z = "boom3_2" + this.funcSet;
					this.x = "boom4_2" + this.funcSet;
					this.c = "boom5_2" + this.funcSet;
					this.v = "boom6_2" + this.funcSet;
					this.b = "boom7_2" + this.funcSet;
					this.n = "boom8_2" + this.funcSet;
					this.m = "boom9_2" + this.funcSet;
					this.comma = "boom10_2" + this.funcSet;
					this.dot = "boom11_2" + this.funcSet;
					this.qmark = "boom12_2" + this.funcSet;
					this.rshift = "boom13_2" + this.funcSet;
					this.up = "boom14_2" + this.funcSet;
					this.num2 = "boom14_2" + this.funcSet;
					this.num3 = "boom13_2" + this.funcSet;
					this.numenter = "boom12_2" + this.funcSet;
				}
				break;

			case this.vKey == 98 && this.keyStatus == 1: //num2
				if (this.num == 2) {
					// this.clear();
					if (this.keyFlag1 == 0) {
						this.keyFlag1 = 1;
						setTimeout(() => {
							this.keyFlag1 = 0;
						}, 1000);
					}
					this.num2 = "boom1_1" + this.funcSet;
					this.lshift = "boom2_1" + this.funcSet;
					this.z = "boom3_1" + this.funcSet;
					this.x = "boom4_1" + this.funcSet;
					this.c = "boom5_1" + this.funcSet;
					this.v = "boom6_1" + this.funcSet;
					this.b = "boom7_1" + this.funcSet;
					this.n = "boom8_1" + this.funcSet;
					this.m = "boom9_1" + this.funcSet;
					this.comma = "boom10_1" + this.funcSet;
					this.dot = "boom11_1" + this.funcSet;
					this.qmark = "boom12_1" + this.funcSet;
					this.rshift = "boom13_1" + this.funcSet;
					this.up = "boom14_1" + this.funcSet;
					this.num1 = "boom15_1" + this.funcSet;
					this.num3 = "boom15_1" + this.funcSet;
					this.numenter = "boom14_1" + this.funcSet;
					this.num = 3
				}
				else if (this.num == 3) {
					this.num = 2;
					// this.clear();
					if (this.keyFlag1 == 0) {
						this.keyFlag1 = 1;
						setTimeout(() => {
							this.keyFlag1 = 0;
						}, 1000);
					}
					this.num2 = "boom1_2" + this.funcSet;
					this.lshift = "boom2_2" + this.funcSet;
					this.z = "boom3_2" + this.funcSet;
					this.x = "boom4_2" + this.funcSet;
					this.c = "boom5_2" + this.funcSet;
					this.v = "boom6_2" + this.funcSet;
					this.b = "boom7_2" + this.funcSet;
					this.n = "boom8_2" + this.funcSet;
					this.m = "boom9_2" + this.funcSet;
					this.comma = "boom10_2" + this.funcSet;
					this.dot = "boom11_2" + this.funcSet;
					this.qmark = "boom12_2" + this.funcSet;
					this.rshift = "boom13_2" + this.funcSet;
					this.up = "boom14_2" + this.funcSet;
					this.num1 = "boom15_2" + this.funcSet;
					this.num3 = "boom15_2" + this.funcSet;
					this.numenter = "boom14_2" + this.funcSet;
				}
				break;

			case this.vKey == 99 && this.keyStatus == 1: //num3
				if (this.num == 2) {
					// this.clear();
					if (this.keyFlag1 == 0) {
						this.keyFlag1 = 1;
						setTimeout(() => {
							this.keyFlag1 = 0;
						}, 1000);
					}
					this.num3 = "boom1_1" + this.funcSet;
					this.lshift = "boom2_1" + this.funcSet;
					this.z = "boom3_1" + this.funcSet;
					this.x = "boom4_1" + this.funcSet;
					this.c = "boom5_1" + this.funcSet;
					this.v = "boom6_1" + this.funcSet;
					this.b = "boom7_1" + this.funcSet;
					this.n = "boom8_1" + this.funcSet;
					this.m = "boom9_1" + this.funcSet;
					this.comma = "boom10_1" + this.funcSet;
					this.dot = "boom11_1" + this.funcSet;
					this.qmark = "boom12_1" + this.funcSet;
					this.rshift = "boom13_1" + this.funcSet;
					this.up = "wave4_1" + this.funcSet;
					this.num1 = "boom15_1" + this.funcSet;
					this.num2 = "boom16_1" + this.funcSet;
					this.numenter = "boom16_1" + this.funcSet;
					this.num = 3
				}
				else if (this.num == 3) {
					this.num = 2;
					// this.clear();
					if (this.keyFlag1 == 0) {
						this.keyFlag1 = 1;
						setTimeout(() => {
							this.keyFlag1 = 0;
						}, 1000);
					}
					this.num3 = "boom_2" + this.funcSet;
					this.lshift = "boom2_2" + this.funcSet;
					this.z = "boom3_2" + this.funcSet;
					this.x = "boom4_2" + this.funcSet;
					this.c = "boom5_2" + this.funcSet;
					this.v = "boom6_2" + this.funcSet;
					this.b = "boom7_2" + this.funcSet;
					this.n = "boom8_2" + this.funcSet;
					this.m = "boom9_2" + this.funcSet;
					this.comma = "boom10_2" + this.funcSet;
					this.dot = "boom11_2" + this.funcSet;
					this.qmark = "boom12_2" + this.funcSet;
					this.rshift = "boom13_2" + this.funcSet;
					this.up = "wave4_2" + this.funcSet;
					this.num1 = "boom15_2" + this.funcSet;
					this.num2 = "boom16_2" + this.funcSet;
					this.numenter = "boom16_2" + this.funcSet;
				}
				break;

			case this.vKey == 'num13' && this.keyStatus == 1: //numenter
				if (this.num == 2) {
					// this.clear();
					if (this.keyFlag1 == 0) {
						this.keyFlag1 = 1;
						setTimeout(() => {
							this.keyFlag1 = 0;
						}, 1000);
					}
					this.numenter = "boom1_1" + this.funcSet;
					this.lshift = "boom2_1" + this.funcSet;
					this.z = "boom3_1" + this.funcSet;
					this.x = "boom4_1" + this.funcSet;
					this.c = "boom5_1" + this.funcSet;
					this.v = "boom6_1" + this.funcSet;
					this.b = "boom7_1" + this.funcSet;
					this.n = "boom8_1" + this.funcSet;
					this.m = "boom9_1" + this.funcSet;
					this.comma = "boom10_1" + this.funcSet;
					this.dot = "boom11_1" + this.funcSet;
					this.qmark = "boom12_1" + this.funcSet;
					this.rshift = "boom13_1" + this.funcSet;
					this.up = "boom14_1" + this.funcSet;
					this.num1 = "boom15_1" + this.funcSet;
					this.num2 = "boom16_1" + this.funcSet;
					this.numenter = "boom17_1" + this.funcSet;
					this.num = 3
				}
				else if (this.num == 3) {
					this.num = 2;
					// this.clear();
					if (this.keyFlag1 == 0) {
						this.keyFlag1 = 1;
						setTimeout(() => {
							this.keyFlag1 = 0;
						}, 1000);
					}
					this.numenter = "boom1_2" + this.funcSet;
					this.lshift = "boom2_2" + this.funcSet;
					this.z = "boom3_2" + this.funcSet;
					this.x = "boom4_2" + this.funcSet;
					this.c = "boom5_2" + this.funcSet;
					this.v = "boom6_2" + this.funcSet;
					this.b = "boom7_2" + this.funcSet;
					this.n = "boom8_2" + this.funcSet;
					this.m = "boom9_2" + this.funcSet;
					this.comma = "boom10_2" + this.funcSet;
					this.dot = "boom11_2" + this.funcSet;
					this.qmark = "boom12_2" + this.funcSet;
					this.rshift = "boom13_2" + this.funcSet;
					this.up = "boom14_2" + this.funcSet;
					this.num1 = "boom15_2" + this.funcSet;
					this.num2 = "boom16_2" + this.funcSet;
					this.numenter = "boom17_2" + this.funcSet;
				}
				break;

			case this.vKey == 'l17' && this.keyStatus == 1: //lctrl
				if (this.num == 2) {
					// this.clear();
					if (this.keyFlag1 == 0) {
						this.keyFlag1 = 1;
						setTimeout(() => {
							this.keyFlag1 = 0;
						}, 1000);
					}
					this.lctrl = "boom1_1" + this.funcSet;
					this.win = "boom13_1" + this.funcSet;
					this.lalt = "boom12_1" + this.funcSet;
					this.space = "boom11_1" + this.funcSet;
					this.ralt = "boom10_1" + this.funcSet;
					this.fn = "boom9_1" + this.funcSet;
					this.book = "boom8_1" + this.funcSet;
					this.rctrl = "boom7_1" + this.funcSet;
					this.left = "boom6_1" + this.funcSet;
					this.down = "boom5_1" + this.funcSet;
					this.right = "boom4_1" + this.funcSet;
					this.num0 = "boom3_1" + this.funcSet;
					this.numdot = "boom2_1" + this.funcSet;
					this.num = 3
				}
				else if (this.num == 3) {
					this.num = 2;
					// this.clear();
					if (this.keyFlag1 == 0) {
						this.keyFlag1 = 1;
						setTimeout(() => {
							this.keyFlag1 = 0;
						}, 1000);
					}
					this.lctrl = "boom1_2" + this.funcSet;
					this.win = "boom13_2" + this.funcSet;
					this.lalt = "boom12_2" + this.funcSet;
					this.space = "boom11_2" + this.funcSet;
					this.ralt = "boom10_2" + this.funcSet;
					this.fn = "boom9_2" + this.funcSet;
					this.book = "boom8_2" + this.funcSet;
					this.rctrl = "boom7_2" + this.funcSet;
					this.left = "boom6_2" + this.funcSet;
					this.down = "boom5_2" + this.funcSet;
					this.right = "boom4_2" + this.funcSet;
					this.num0 = "boom3_2" + this.funcSet;
					this.numdot = "boom2_2" + this.funcSet;
				}
				break;

			case this.vKey == 91 && this.keyStatus == 1: //win
				if (this.num == 2) {
					// this.clear();
					if (this.keyFlag1 == 0) {
						this.keyFlag1 = 1;
						setTimeout(() => {
							this.keyFlag1 = 0;
						}, 1000);
					}
					this.win = "boom1_1" + this.funcSet;
					this.lctrl = "boom12_1" + this.funcSet;
					this.lalt = "boom12_1" + this.funcSet;
					this.space = "boom11_1" + this.funcSet;
					this.ralt = "boom10_1" + this.funcSet;
					this.fn = "boom9_1" + this.funcSet;
					this.book = "boom8_1" + this.funcSet;
					this.rctrl = "boom7_1" + this.funcSet;
					this.left = "boom6_1" + this.funcSet;
					this.down = "boom5_1" + this.funcSet;
					this.right = "boom4_1" + this.funcSet;
					this.num0 = "boom3_1" + this.funcSet;
					this.numdot = "boom2_1" + this.funcSet;
					this.num = 3
				}
				else if (this.num == 3) {
					this.num = 2;
					// this.clear();
					if (this.keyFlag1 == 0) {
						this.keyFlag1 = 1;
						setTimeout(() => {
							this.keyFlag1 = 0;
						}, 1000);
					}
					this.win = "boom1_2" + this.funcSet;
					this.lctrl = "boom12_2" + this.funcSet;
					this.lalt = "boom12_2" + this.funcSet;
					this.space = "boom11_2" + this.funcSet;
					this.ralt = "boom10_2" + this.funcSet;
					this.fn = "boom9_2" + this.funcSet;
					this.book = "boom8_2" + this.funcSet;
					this.rctrl = "boom7_2" + this.funcSet;
					this.left = "boom6_2" + this.funcSet;
					this.down = "boom5_2" + this.funcSet;
					this.right = "boom4_2" + this.funcSet;
					this.num0 = "boom3_2" + this.funcSet;
					this.numdot = "boom2_2" + this.funcSet;
				}
				break;

			case this.vKey == 'l18' && this.keyStatus == 1: //lalt
				if (this.num == 2) {
					// this.clear();
					if (this.keyFlag1 == 0) {
						this.keyFlag1 = 1;
						setTimeout(() => {
							this.keyFlag1 = 0;
						}, 1000);
					}
					this.lalt = "boom1_1" + this.funcSet;
					this.lctrl = "boom10_1" + this.funcSet;
					this.win = "boom11_1" + this.funcSet;
					this.space = "boom11_1" + this.funcSet;
					this.ralt = "boom10_1" + this.funcSet;
					this.fn = "boom9_1" + this.funcSet;
					this.book = "boom8_1" + this.funcSet;
					this.rctrl = "boom7_1" + this.funcSet;
					this.left = "boom6_1" + this.funcSet;
					this.down = "boom5_1" + this.funcSet;
					this.right = "boom4_1" + this.funcSet;
					this.num0 = "boom3_1" + this.funcSet;
					this.numdot = "boom2_1" + this.funcSet;
					this.num = 3
				}
				else if (this.num == 3) {
					this.num = 2;
					// this.clear();
					if (this.keyFlag1 == 0) {
						this.keyFlag1 = 1;
						setTimeout(() => {
							this.keyFlag1 = 0;
						}, 1000);
					}
					this.lalt = "boom1_2" + this.funcSet;
					this.lctrl = "boom10_2" + this.funcSet;
					this.win = "boom11_2" + this.funcSet;
					this.space = "boom11_2" + this.funcSet;
					this.ralt = "boom10_2" + this.funcSet;
					this.fn = "boom9_2" + this.funcSet;
					this.book = "boom8_2" + this.funcSet;
					this.rctrl = "boom7_2" + this.funcSet;
					this.left = "boom6_2" + this.funcSet;
					this.down = "boom5_2" + this.funcSet;
					this.right = "boom4_2" + this.funcSet;
					this.num0 = "boom3_2" + this.funcSet;
					this.numdot = "boom2_2" + this.funcSet;
				}
				break;

			case this.vKey == 32 && this.keyStatus == 1: //space
				if (this.num == 2) {
					// this.clear();
					if (this.keyFlag1 == 0) {
						this.keyFlag1 = 1;
						setTimeout(() => {
							this.keyFlag1 = 0;
						}, 1000);
					}
					this.space = "boom1_1" + this.funcSet;
					this.lctrl = "boom8_1" + this.funcSet;
					this.win = "boom9_1" + this.funcSet;
					this.lalt = "boom10_1" + this.funcSet;
					this.ralt = "boom10_1" + this.funcSet;
					this.fn = "boom9_1" + this.funcSet;
					this.book = "boom8_1" + this.funcSet;
					this.rctrl = "boom7_1" + this.funcSet;
					this.left = "boom6_1" + this.funcSet;
					this.down = "boom5_1" + this.funcSet;
					this.right = "boom4_1" + this.funcSet;
					this.num0 = "boom3_1" + this.funcSet;
					this.numdot = "boom2_1" + this.funcSet;
					this.num = 3
				}
				else if (this.num == 3) {
					this.num = 2;
					// this.clear();
					if (this.keyFlag1 == 0) {
						this.keyFlag1 = 1;
						setTimeout(() => {
							this.keyFlag1 = 0;
						}, 1000);
					}
					this.space = "boom1_2" + this.funcSet;
					this.lctrl = "boom8_2" + this.funcSet;
					this.win = "boom9_2" + this.funcSet;
					this.lalt = "boom10_2" + this.funcSet;
					this.ralt = "boom10_2" + this.funcSet;
					this.fn = "boom9_2" + this.funcSet;
					this.book = "boom8_2" + this.funcSet;
					this.rctrl = "boom7_2" + this.funcSet;
					this.left = "boom6_2" + this.funcSet;
					this.down = "boom5_2" + this.funcSet;
					this.right = "boom4_2" + this.funcSet;
					this.num0 = "boom3_2" + this.funcSet;
					this.numdot = "boom2_2" + this.funcSet;
				}
				break;

			case this.vKey == 'r18' && this.keyStatus == 1: //ralt
				if (this.num == 2) {
					// this.clear();
					if (this.keyFlag1 == 0) {
						this.keyFlag1 = 1;
						setTimeout(() => {
							this.keyFlag1 = 0;
						}, 1000);
					}
					this.ralt = "boom1_1" + this.funcSet;
					this.lctrl = "boom6_1" + this.funcSet;
					this.win = "boom7_1" + this.funcSet;
					this.lalt = "boom8_1" + this.funcSet;
					this.space = "boom9_1" + this.funcSet;
					this.fn = "boom9_1" + this.funcSet;
					this.book = "boom8_1" + this.funcSet;
					this.rctrl = "boom7_1" + this.funcSet;
					this.left = "boom6_1" + this.funcSet;
					this.down = "boom5_1" + this.funcSet;
					this.right = "boom4_1" + this.funcSet;
					this.num0 = "boom3_1" + this.funcSet;
					this.numdot = "boom2_1" + this.funcSet;
					this.num = 3
				}
				else if (this.num == 3) {
					this.num = 2;
					// this.clear();
					if (this.keyFlag1 == 0) {
						this.keyFlag1 = 1;
						setTimeout(() => {
							this.keyFlag1 = 0;
						}, 1000);
					}
					this.ralt = "boom1_2" + this.funcSet;
					this.lctrl = "boom6_2" + this.funcSet;
					this.win = "boom7_2" + this.funcSet;
					this.lalt = "boom8_2" + this.funcSet;
					this.space = "boom9_2" + this.funcSet;
					this.fn = "boom9_2" + this.funcSet;
					this.book = "boom8_2" + this.funcSet;
					this.rctrl = "boom7_2" + this.funcSet;
					this.left = "boom6_2" + this.funcSet;
					this.down = "boom5_2" + this.funcSet;
					this.right = "boom4_2" + this.funcSet;
					this.num0 = "boom3_2" + this.funcSet;
					this.numdot = "boom2_2" + this.funcSet;
				}
				break;

			case this.vKey == 93 && this.keyStatus == 1: //book
				if (this.num == 2) {
					// this.clear();
					if (this.keyFlag1 == 0) {
						this.keyFlag1 = 1;
						setTimeout(() => {
							this.keyFlag1 = 0;
						}, 1000);
					}
					this.book = "boom1_1" + this.funcSet;
					this.lctrl = "boom2_1" + this.funcSet;
					this.win = "boom3_1" + this.funcSet;
					this.lalt = "boom4_1" + this.funcSet;
					this.space = "boom5_1" + this.funcSet;
					this.ralt = "boom6_1" + this.funcSet;
					this.fn = "boom7_1" + this.funcSet;
					this.rctrl = "boom7_1" + this.funcSet;
					this.left = "boom6_1" + this.funcSet;
					this.down = "boom5_1" + this.funcSet;
					this.right = "boom4_1" + this.funcSet;
					this.num0 = "boom3_1" + this.funcSet;
					this.numdot = "boom2_1" + this.funcSet;
					this.num = 3
				}
				else if (this.num == 3) {
					this.num = 2;
					// this.clear();
					if (this.keyFlag1 == 0) {
						this.keyFlag1 = 1;
						setTimeout(() => {
							this.keyFlag1 = 0;
						}, 1000);
					}
					this.book = "boom1_2" + this.funcSet;
					this.lctrl = "boom2_2" + this.funcSet;
					this.win = "boom3_2" + this.funcSet;
					this.lalt = "boom4_2" + this.funcSet;
					this.space = "boom5_2" + this.funcSet;
					this.ralt = "boom6_2" + this.funcSet;
					this.fn = "boom7_2" + this.funcSet;
					this.rctrl = "boom7_2" + this.funcSet;
					this.left = "boom6_2" + this.funcSet;
					this.down = "boom5_2" + this.funcSet;
					this.right = "boom4_2" + this.funcSet;
					this.num0 = "boom3_2" + this.funcSet;
					this.numdot = "boom2_2" + this.funcSet;
				}
				break;

			case this.vKey == 'r17' && this.keyStatus == 1: //rctrl
				if (this.num == 2) {
					// this.clear();
					if (this.keyFlag1 == 0) {
						this.keyFlag1 = 1;
						setTimeout(() => {
							this.keyFlag1 = 0;
						}, 1000);
					}
					this.rctrl = "boom1_1" + this.funcSet;
					this.lctrl = "boom2_1" + this.funcSet;
					this.win = "boom3_1" + this.funcSet;
					this.lalt = "boom4_1" + this.funcSet;
					this.space = "boom5_1" + this.funcSet;
					this.ralt = "boom6_1" + this.funcSet;
					this.fn = "boom7_1" + this.funcSet;
					this.book = "boom8_1" + this.funcSet;
					this.left = "boom8_1" + this.funcSet;
					this.down = "boom7_1" + this.funcSet;
					this.right = "boom6_1" + this.funcSet;
					this.num0 = "boom5_1" + this.funcSet;
					this.numdot = "boom4_1" + this.funcSet;
					this.num = 3
				}
				else if (this.num == 3) {
					this.num = 2;
					// this.clear();
					if (this.keyFlag1 == 0) {
						this.keyFlag1 = 1;
						setTimeout(() => {
							this.keyFlag1 = 0;
						}, 1000);
					}
					this.rctrl = "boom1_2" + this.funcSet;
					this.lctrl = "boom2_2" + this.funcSet;
					this.win = "boom3_2" + this.funcSet;
					this.lalt = "boom4_2" + this.funcSet;
					this.space = "boom5_2" + this.funcSet;
					this.ralt = "boom6_2" + this.funcSet;
					this.fn = "boom7_2" + this.funcSet;
					this.book = "boom8_2" + this.funcSet;
					this.left = "boom8_2" + this.funcSet;
					this.down = "boom7_2" + this.funcSet;
					this.right = "boom6_2" + this.funcSet;
					this.num0 = "boom5_2" + this.funcSet;
					this.numdot = "boom4_2" + this.funcSet;
				}
				break;

			case this.vKey == 37 && this.keyStatus == 1: //left
				if (this.num == 2) {
					// this.clear();
					if (this.keyFlag1 == 0) {
						this.keyFlag1 = 1;
						setTimeout(() => {
							this.keyFlag1 = 0;
						}, 1000);
					}
					this.left = "boom1_1" + this.funcSet;
					this.lctrl = "boom2_1" + this.funcSet;
					this.win = "boom3_1" + this.funcSet;
					this.lalt = "boom4_1" + this.funcSet;
					this.space = "boom5_1" + this.funcSet;
					this.ralt = "boom6_1" + this.funcSet;
					this.fn = "boom7_1" + this.funcSet;
					this.book = "boom8_1" + this.funcSet;
					this.rctrl = "boom9_1" + this.funcSet;
					this.down = "boom9_1" + this.funcSet;
					this.right = "boom8_1" + this.funcSet;
					this.num0 = "boom7_1" + this.funcSet;
					this.numdot = "boom6_1" + this.funcSet;
					this.num = 3
				}
				else if (this.num == 3) {
					this.num = 2;
					// this.clear();
					if (this.keyFlag1 == 0) {
						this.keyFlag1 = 1;
						setTimeout(() => {
							this.keyFlag1 = 0;
						}, 1000);
					}
					this.left = "boom1_2" + this.funcSet;
					this.lctrl = "boom2_2" + this.funcSet;
					this.win = "boom3_2" + this.funcSet;
					this.lalt = "boom4_2" + this.funcSet;
					this.space = "boom5_2" + this.funcSet;
					this.ralt = "boom6_2" + this.funcSet;
					this.fn = "boom7_2" + this.funcSet;
					this.book = "boom8_2" + this.funcSet;
					this.rctrl = "boom9_2" + this.funcSet;
					this.down = "boom9_2" + this.funcSet;
					this.right = "boom8_2" + this.funcSet;
					this.num0 = "boom7_2" + this.funcSet;
					this.numdot = "boom6_2" + this.funcSet;
				}
				break;

			case this.vKey == 40 && this.keyStatus == 1: //down
				if (this.num == 2) {
					// this.clear();
					if (this.keyFlag1 == 0) {
						this.keyFlag1 = 1;
						setTimeout(() => {
							this.keyFlag1 = 0;
						}, 1000);
					}
					this.down = "boom1_1" + this.funcSet;
					this.lctrl = "boom2_1" + this.funcSet;
					this.win = "boom3_1" + this.funcSet;
					this.lalt = "boom4_1" + this.funcSet;
					this.space = "boom5_1" + this.funcSet;
					this.ralt = "boom6_1" + this.funcSet;
					this.fn = "boom7_1" + this.funcSet;
					this.book = "boom8_1" + this.funcSet;
					this.rctrl = "boom9_1" + this.funcSet;
					this.left = "boom10_1" + this.funcSet;
					this.right = "boom10_1" + this.funcSet;
					this.num0 = "boom9_1" + this.funcSet;
					this.numdot = "boom8_1" + this.funcSet;
					this.num = 3
				}
				else if (this.num == 3) {
					this.num = 2;
					// this.clear();
					if (this.keyFlag1 == 0) {
						this.keyFlag1 = 1;
						setTimeout(() => {
							this.keyFlag1 = 0;
						}, 1000);
					}
					this.down = "boom1_2" + this.funcSet;
					this.lctrl = "boom2_2" + this.funcSet;
					this.win = "boom3_2" + this.funcSet;
					this.lalt = "boom4_2" + this.funcSet;
					this.space = "boom5_2" + this.funcSet;
					this.ralt = "boom6_2" + this.funcSet;
					this.fn = "boom7_2" + this.funcSet;
					this.book = "boom8_2" + this.funcSet;
					this.rctrl = "boom9_2" + this.funcSet;
					this.left = "boom10_2" + this.funcSet;
					this.right = "boom10_2" + this.funcSet;
					this.num0 = "boom9_2" + this.funcSet;
					this.numdot = "boom8_2" + this.funcSet;
				}
				break;

			case this.vKey == 39 && this.keyStatus == 1: //right
				if (this.num == 2) {
					// this.clear();
					if (this.keyFlag1 == 0) {
						this.keyFlag1 = 1;
						setTimeout(() => {
							this.keyFlag1 = 0;
						}, 1000);
					}
					this.right = "boom1_1" + this.funcSet;
					this.lctrl = "boom2_1" + this.funcSet;
					this.win = "boom3_1" + this.funcSet;
					this.lalt = "boom4_1" + this.funcSet;
					this.space = "boom5_1" + this.funcSet;
					this.ralt = "boom6_1" + this.funcSet;
					this.fn = "boom7_1" + this.funcSet;
					this.book = "boom8_1" + this.funcSet;
					this.rctrl = "boom9_1" + this.funcSet;
					this.left = "boom10_1" + this.funcSet;
					this.down = "boom11_1" + this.funcSet;
					this.num0 = "boom11_1" + this.funcSet;
					this.numdot = "boom10_1" + this.funcSet;
					this.num = 3
				}
				else if (this.num == 3) {
					this.num = 2;
					// this.clear();
					if (this.keyFlag1 == 0) {
						this.keyFlag1 = 1;
						setTimeout(() => {
							this.keyFlag1 = 0;
						}, 1000);
					}
					this.right = "boom1_2" + this.funcSet;
					this.lctrl = "boom2_2" + this.funcSet;
					this.win = "boom3_2" + this.funcSet;
					this.lalt = "boom4_2" + this.funcSet;
					this.space = "boom5_2" + this.funcSet;
					this.ralt = "boom6_2" + this.funcSet;
					this.fn = "boom7_2" + this.funcSet;
					this.book = "boom8_2" + this.funcSet;
					this.rctrl = "boom9_2" + this.funcSet;
					this.left = "boom10_2" + this.funcSet;
					this.down = "boom11_2" + this.funcSet;
					this.num0 = "boom11_2" + this.funcSet;
					this.numdot = "boom10_2" + this.funcSet;
				}
				break;

			case this.vKey == 96 && this.keyStatus == 1: //num0
				if (this.num == 2) {
					// this.clear();
					if (this.keyFlag1 == 0) {
						this.keyFlag1 = 1;
						setTimeout(() => {
							this.keyFlag1 = 0;
						}, 1000);
					}
					this.num0 = "boom1_1" + this.funcSet;
					this.lctrl = "boom2_1" + this.funcSet;
					this.win = "boom3_1" + this.funcSet;
					this.lalt = "boom4_1" + this.funcSet;
					this.space = "boom5_1" + this.funcSet;
					this.ralt = "boom6_1" + this.funcSet;
					this.fn = "boom7_1" + this.funcSet;
					this.book = "boom8_1" + this.funcSet;
					this.rctrl = "boom9_1" + this.funcSet;
					this.left = "boom10_1" + this.funcSet;
					this.down = "boom11_1" + this.funcSet;
					this.right = "boom12_1" + this.funcSet;
					this.numdot = "boom12_1" + this.funcSet;
					this.num = 3
				}
				else if (this.num == 3) {
					this.num = 2;
					// this.clear();
					if (this.keyFlag1 == 0) {
						this.keyFlag1 = 1;
						setTimeout(() => {
							this.keyFlag1 = 0;
						}, 1000);
					}
					this.num0 = "boom1_2" + this.funcSet;
					this.lctrl = "boom2_2" + this.funcSet;
					this.win = "boom3_2" + this.funcSet;
					this.lalt = "boom4_2" + this.funcSet;
					this.space = "boom5_2" + this.funcSet;
					this.ralt = "boom6_2" + this.funcSet;
					this.fn = "boom7_2" + this.funcSet;
					this.book = "boom8_2" + this.funcSet;
					this.rctrl = "boom9_2" + this.funcSet;
					this.left = "boom10_2" + this.funcSet;
					this.down = "boom11_2" + this.funcSet;
					this.right = "boom12_2" + this.funcSet;
					this.numdot = "boom12_2" + this.funcSet;
				}
				break;

			case this.vKey == 110 && this.keyStatus == 1: //numdot
				if (this.num == 2) {
					// this.clear();
					if (this.keyFlag1 == 0) {
						this.keyFlag1 = 1;
						setTimeout(() => {
							this.keyFlag1 = 0;
						}, 1000);
					}
					this.numdot = "boom1_1" + this.funcSet;
					this.lctrl = "boom2_1" + this.funcSet;
					this.win = "boom3_1" + this.funcSet;
					this.lalt = "boom4_1" + this.funcSet;
					this.space = "boom5_1" + this.funcSet;
					this.ralt = "boom6_1" + this.funcSet;
					this.fn = "boom7_1" + this.funcSet;
					this.book = "boom8_1" + this.funcSet;
					this.rctrl = "boom9_1" + this.funcSet;
					this.left = "boom10_1" + this.funcSet;
					this.down = "boom11_1" + this.funcSet;
					this.right = "boom12_1" + this.funcSet;
					this.num0 = "boom13_1" + this.funcSet;
					this.num = 3
				}
				else if (this.num == 3) {
					this.num = 2;
					// this.clear();
					if (this.keyFlag1 == 0) {
						this.keyFlag1 = 1;
						setTimeout(() => {
							this.keyFlag1 = 0;
						}, 1000);
					}
					this.numdot = "boom1_2" + this.funcSet;
					this.lctrl = "boom2_2" + this.funcSet;
					this.win = "boom3_2" + this.funcSet;
					this.lalt = "boom4_2" + this.funcSet;
					this.space = "boom5_2" + this.funcSet;
					this.ralt = "boom6_2" + this.funcSet;
					this.fn = "boom7_2" + this.funcSet;
					this.book = "boom8_2" + this.funcSet;
					this.rctrl = "boom9_2" + this.funcSet;
					this.left = "boom10_2" + this.funcSet;
					this.down = "boom11_2" + this.funcSet;
					this.right = "boom12_2" + this.funcSet;
					this.num0 = "boom13_2" + this.funcSet;
				}
				break;
			case this.vKey == 44 && this.keyStatus == 1: //print
				if (this.num == 2) {
					// this.clear();
					if (this.keyFlag1 == 0) {
						this.keyFlag1 = 1;
						setTimeout(() => {
							this.keyFlag1 = 0;
						}, 1000);
					}
					this.print = 'boom1_1' + this.funcSet;
					this.esc = "boom2_1" + this.funcSet;
					this.f1 = 'boom3_1' + this.funcSet;
					this.f2 = 'boom4_1' + this.funcSet;
					this.f3 = 'boom5_1' + this.funcSet;
					this.f4 = 'boom6_1' + this.funcSet;
					this.f5 = 'boom7_1' + this.funcSet;
					this.f6 = 'boom8_1' + this.funcSet;
					this.f7 = 'boom9_1' + this.funcSet;
					this.f8 = 'boom10_1' + this.funcSet;
					this.f9 = 'boom11_1' + this.funcSet;
					this.f10 = 'boom12_1' + this.funcSet;
					this.f11 = 'boom13_1' + this.funcSet;
					this.f12 = 'boom14_1' + this.funcSet;
					this.scroll = 'boom14_1' + this.funcSet;
					this.pause = 'boom13_1' + this.funcSet;
					this.num = 3
				}
				else if (this.num == 3) {
					this.num = 2;
					// this.clear();
					if (this.keyFlag1 == 0) {
						this.keyFlag1 = 1;
						setTimeout(() => {
							this.keyFlag1 = 0;
						}, 1000);
					}
					this.print = 'boom1_2' + this.funcSet;
					this.esc = "boom2_2" + this.funcSet;
					this.f1 = 'boom3_2' + this.funcSet;
					this.f2 = 'boom4_2' + this.funcSet;
					this.f3 = 'boom5_2' + this.funcSet;
					this.f4 = 'boom6_2' + this.funcSet;
					this.f5 = 'boom7_2' + this.funcSet;
					this.f6 = 'boom8_2' + this.funcSet;
					this.f7 = 'boom9_2' + this.funcSet;
					this.f8 = 'boom10_2' + this.funcSet;
					this.f9 = 'boom11_2' + this.funcSet;
					this.f10 = 'boom12_2' + this.funcSet;
					this.f11 = 'boom13_2' + this.funcSet;
					this.f12 = 'boom14_2' + this.funcSet;
					this.scroll = 'boom14_2' + this.funcSet;
					this.pause = 'boom13_2' + this.funcSet;
				}
				break;
			default:
				break;
		}
	}

	//漣漪向外
	boomOut_med() {
		this.getColor1();
		this.thelastEffect = this.boomOut_med;
	}

	boomOut_high() {
		this.getColor1();
		this.thelastEffect = this.boomOut_high;
	}

	boomOut_slow() {
		this.getColor1();
		this.thelastEffect = this.boomOut_slow;
	}

	boomIn_med() {     //漣漪向內中速
		this.getColor1();
		this.thelastEffect = this.boomIn_med;
	}

	boomIn_high() {     //漣漪向內高速
		this.getColor1();
		this.thelastEffect = this.boomIn_high;
	}

	boomIn_slow() {     //漣漪向內高速
		this.getColor1();
		this.thelastEffect = this.boomIn_slow;
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
			this.defaultclr = "#" + (this.desideclrCss.R + this.desideclrCss.G + this.desideclrCss.B).toUpperCas
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
	op: any = "1";
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

	sp: any = 40;
	SpeedInput(value) {
		this.detectEffectChange();
		let vm = this;
		this.sp = value;
		setTimeout(() => {
			vm.speedMethod(value);
		}, 1000);
	}


	// //最先決定速度類型
	slowFun: any = this.boomOut_slow
	medFun: any = this.boomOut_med
	fastFun: any = this.boomOut_high
	// dir: any = '0x01';
	speed: any = '40';
	// //最先決定速度類型

	stopDoAp: any;
	apFlag: any;
	effectDeside(w) {
		let vm = this;
		if (w !== this.apFlag) {
			this.leave = 0;
			clearTimeout(this.stopDoAp);
			this.stopDoAp = setTimeout(() => {
				vm.leave = 1;
				vm.doApmode01();
			}, 200);
			clearInterval(this.getclr01);

			if (w == 4) {
				this.Effectdirection = w;
				this.apFlag = w;
				this.detectEffectChange();
				this.slowFun = this.boomOut_slow;
				this.medFun = this.boomOut_med;
				this.fastFun = this.boomOut_high;
				this.medFun();
				this.num = 0;
				switch (true) {
					case this.sp == 50:
						this.slowFun();
						break;
					case this.sp == 40:
						this.medFun();
						break;
					case this.sp == 30:
						this.fastFun();
					default:
						break;
				}
			}
			else if (w == 5) {
				this.Effectdirection = w;
				this.apFlag = w;
				this.detectEffectChange();
				this.slowFun = this.boomIn_slow;
				this.medFun = this.boomIn_med;
				this.fastFun = this.boomIn_high;
				this.medFun();
				this.num = 2;
				switch (true) {
					case this.sp == 50:
						this.slowFun();
						break;
					case this.sp == 40:
						this.medFun();
						break;
					case this.sp == 30:
						this.fastFun();
					default:
						break;
				}
			}
		}
	}

	speedMethod(s) {
		this.speed = s;
		clearInterval(this.getclr01);
		if (s == 30) {
			this.fastFun();
			this.funcSet = "_high";
		}
		if (s == 40) {
			this.medFun();
			this.funcSet = "_med";
		}
		if (s == 50) {
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
				if (rule.name == "boom1" && rule.type == rule.KEYFRAMES_RULE) {
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
				if (rule.name == "boom2" && rule.type == rule.KEYFRAMES_RULE) {
					this.cssRule = rule;
				}
			}
		}
		this.cssRule.appendRule(`0% {background-color:${this.defaultclr02}}`);
		this.detectEffectChange();
	}
	color1: any = ["#E9004C", "#FF3F00", "#FFBF00", "#7FFF00"]
	color2: any = ["#00FFFF", "#007FFF", "#6400FF", "#AF26FF"]
	getRuleRandom1() {
		var rule;
		var ss = document.styleSheets;
		for (var i = 0; i < ss.length; i++) {
			for (var x = 0; x < ss[i]['cssRules'].length; x++) {
				rule = ss[i]['cssRules'][x];
				if (rule.name == "boom1" && rule.type == rule.KEYFRAMES_RULE) {
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
				if (rule.name == "boom2" && rule.type == rule.KEYFRAMES_RULE) {
					this.cssRule = rule;
				}
			}
		}
		var ran2 = Math.floor(Math.random() * 3)
		this.cssRule.appendRule(`0% {background-color:${this.color2[ran2]}}`);
	}

	//速度
	FastSpeed: any = 30;
	MedSpeed: any = 40;
	SlowSpeed: any = 50;
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
						// //console.log('function did');
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
						} else if (this.openclose == 2) {
							this.goOut();
							setTimeout(()=>{
								this.goIn();
								this.openclose = 0;
							},100)
						}
					}

					if (doc[0].Light.Mode[position] == "pauseEffect") {
						// //console.log('stop');
						this.pausetime++
						if (this.pausetime == 1) {
							this.goOut();
						} else if (this.pausetime == 2) {
							this.goOut();
							setTimeout(()=>{
								this.goIn();
							},100)
							this.pausetime = 0;
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

		this.nowobj.Light.LightSetting.LSbrightness[8] = this.op;
		this.nowobj.Light.LightSetting.LSspeed[8] = this.sp;
		this.nowobj.Light.LightSetting.LSdirection[8] = this.Effectdirection;
		this.nowobj.Light.LightSetting.changeTime[8] = this.timeValue;
		this.nowobj.Light.LightSetting.changeMode[8] = this.ttitle;



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
		this.subscription.unsubscribe();
		this.goOut();
		//this.clearAllInterval();
		env.log('light-effect', 'boom', 'end');
	}

	@Output() sendTimeCloseFlag = new EventEmitter();
	@Input() check01;
	@Input() timeEffect;
	@Input() receiveTemp;
	@Output() BoomTemp = new EventEmitter();
	@Output() LightEffect = new EventEmitter();
	@Output() applyStatus = new EventEmitter();
	boomT: any;
	applyFlag: any = 1;
	lightEffect: any = 8;
	boomObj() {
		this.boomT = {
			'LightEffect': 8,
			'LSbrightness': this.op,
			'LSspeed': this.sp,
			'LSdirection': this.Effectdirection,
			'changeTime': this.timeValue,
			'ttitle': '脉冲',
			'changeStatus': this.check01,
			'changeEffect': this.timeEffect,
			'ColorMode': this.default,
			'Color':{
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
			// this.speedMethod(this.sp);
		} else {
			this.sp = 6;
			// this.speedMethod(this.sp);
		}
		if (this.Effectdirection !== undefined && this.Effectdirection !== null && this.Effectdirection !== "") {
			this.effectDeside(this.Effectdirection);
		} else {
			this.Effectdirection = 4; //預設
			this.effectDeside(this.Effectdirection);
		} //預設
		if (this.NewtimeValue !== undefined && this.NewtimeValue !== null && this.NewtimeValue !== "") {
			this.timeValue = this.NewtimeValue;
		}
		// else {
		// 	this.timeValue = 10;
		// }
		if (this.ttitle !== undefined && this.ttitle !== null && this.ttitle !== "") {
			this.sendTtile();
		} else {
			this.ttitle = '脉冲';
		}

		if (this.default == true) {
            this.setDefault(1);
        } else {
            this.setDefault(2);
        }
	}
	sendApply() {
		if (this.timeEffect !== 8) {
			this.boomObj();
			setTimeout(() => {
				this.sendTimeCloseFlag.emit(this.check01);
				this.BoomTemp.emit(this.boomT);
				this.LightEffect.emit(this.boomT.LightEffect)
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