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
	selector: 'none-effect',
	templateUrl: './components/effect/none.compo.html',
	//template: '<h1>我的第一个 Angular 应用</h1>',
	styleUrls: ['./css/first.css', './css/kbd.css',],
	providers: [protocolService, dbService, icpEventService],
	inputs: ['ProfileDetail', 'ttitle', 'getGameChange', 'updatenow', 'changeProfile']
})



export class noneComponent implements OnInit {

	constructor(private protocol: protocolService, private db: dbService, private getDeviceService: GetDeviceService, private emitService: EmitService, private icpEventService: icpEventService) {
		console.log('meeting loading complete');
		// this.subscription = this.emitService.EmitObservable.subscribe(src=>console.log(src)

		this.subscription = this.emitService.EmitObservable.subscribe(src => {
			if (src == 'insert') {
				// this.setAPmode();//連續下值預備動作
				this.plugIn();
			}
			if (src == 'remove') {
				this.goOut();
				console.log('out');
			}
			this.fromicp = src;
			if (this.fromicp.data !== undefined) {
				if (this.fromicp.data[0] == 4 && this.fromicp.data[1] == 225 && this.fromicp.data[2] == 15 && this.fromicp.data[3] == 1) {
					// console.log("attleft");
					this.attbtn = false;
				}
				else if (this.fromicp.data[0] == 4 && this.fromicp.data[1] == 225 && this.fromicp.data[2] == 16 && this.fromicp.data[3] == 2) {
					// console.log("attright");
					this.attbtn = true;
				}
			}
			// if (this.fromicp.data !== undefined && this.timeEventFlag == true) {
			// 	this.timeEvent();
			// }
		})

	}
	fromicp: any;
	saveapmode: boolean = false; //doapmode的執行判斷用布林值
	changeProfile: any = '2';
	keeploading: boolean = true;
	timeValue: any = 10;
	timeCount: any;
	timewarn: boolean = false;
	attbtn: boolean;
	@Output() passTime = new EventEmitter();
	@Output() effectfinish: EventEmitter<any> = new EventEmitter();



	@Output() openFrtp: EventEmitter<any> = new EventEmitter();

	openFrtpfun(w) {
		console.log('送值' + w)
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
	resetTime: any;
	timeInput(e) {
		//console.log('reset222')
		this.timeValue = e;
		this.passTime.emit(this.timeValue);
		var vm = this;
		window.addEventListener('keydown', function (e) {
			if (e.keyCode == 13) {
				if (vm.timeValue < 1 || isNaN(vm.timeValue)) {
					// alert('请输入 1 ~ 9999 之数值');
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
			console.log('do getkeymatrixKB');
		});
	}
	ngOnInit() {
		env.log('none-effect', 'none-effect', 'start')
		// this.setAPmode();//連續下值預備動作
		this.LEDmatrix();//找出對應按鍵;
		this.sendTimeCloseFlag.emit(false);
		// this.passTime.emit(this.timeValue);
		setTimeout(() => {
			// this.timeEvent();
			this.doApmode01();
		}, 500);


		if (this.keeploading) {
			console.log('light2222');

			// this.openFrtpfun(0);
		}

		this.keeploading = true;
		this.effectfinish.emit();
		if (this.lightBS == 0) {
			//console.log("from parent LBS 0 attRight", this.lightBS);
			this.attbtn = true;
		}
		else if (this.lightBS == 1) {
			//console.log("from parent LBS 1 attLeft", this.lightBS)
			this.attbtn = false;
		}
	}
	@Input() lightBS;
	ngOnChanges(changes: any) {
		// changes.prop contains the old and the new value...
		for (let propName in changes) {

			this.changeV = changes[propName];
			this.currentV = JSON.stringify(this.changeV.currentValue);
			let prev = JSON.stringify(this.changeV.previousValue);
			console.log('getGame11111');
			console.log(this.savechange);
			console.log(this.currentV);
		}


		if (this.currentV == '"stopApmode"' && this.savechange == 0) {
			this.savechange = 1;
			this.goOut();
			// this.savechange = 0
			console.log('222')
			// console.log(this.savechange)
		}
		if (this.currentV == '"startApmode"' && this.savechange == 0) {
			this.savechange = 1;
			this.plugIn();   
			// this.savechange = 0
			console.log('333')
			// console.log(this.savechange)

		}
		// console.log(prev);
		if (this.currentV == '"changeProfile"') {
			console.log('beginreloading');
			this.keeploading = false;
			// this.subscription.unsubscribe();
			this.goOut();

			let vm = this;
			setTimeout(() => {
				this.leave = 1;
				vm.ngOnInit();
			}, 200);

		}

		if (this.currentV == '"updatenow"') {
			console.log('beginreloading');
			this.keeploading = true;
			// this.subscription.unsubscribe();
			this.goOut();

			let vm = this;
			setTimeout(() => {
				this.leave = 1;
				vm.ngOnInit();
			}, 200);
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

	array1: any = ["esc", "f1", "f2", "f3", "f4", "f5", "f6", "f7", "f8", "f9", "f10", "f11", "f12", "print", "scroll", "pause", "perid", "n1", "n2", "n3", "n4", "n5", "n6", "n7", "n8", "n9", "n0", "minus", "plus", "bsp", "insert", "home", "pup", "numlock", "numdrawn", "numtimes", "numminus", "tab", "q", "w", "e", "r", "t", "y", "u", "i", "o", "p", "lqu", "rqu", "delete", "drawn", "end", "pdown", "num7", "num8", "num9", "numplus", "caps", "a", "s", "d", "f", "g", "h", "j", "k", "l", "sem", "quo", "enter", "num4", "num5", "num6", "lshift", "z", "x", "c", "v", "b", "n", "m", "comma", "dot", "qmark", "rshift", "up", "num1", "num2", "num3", "numenter", "lctrl", "win", "lalt", "space", "ralt", "fn", "book", "rctrl", "left", "down", "right", "num0", "numdot"]

	leave: any = 1
	firstKB: any;
	positionR: any;
	positionG: any;
	positionB: any;
	positionRarr: any = [];
	positionGarr: any = [];
	positionBarr: any = [];
	subscription: Subscription;
	getclr01: any;
	setAp: number = 0;
	savechange: number = 0;
	currentV: any;
	changeV: any;


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
			if (data[6] == 0) {
				//console.log('按鈕位置在右邊')
				this.attbtn = true;
			}
			else if (data[6] == 1) {
				//console.log('按鈕位置在左邊')
				this.attbtn = false;
			}
		})
	}

	getColor() {     //第一組DIV取值
		this.getclr01 = setInterval(() => {
			for (var i = 0; i < this.array1.length; i++) {
				let clrIn = window.getComputedStyle(document.getElementById(this.array1[i]), null).getPropertyValue("background-color")
				let vm = this;
				vm.red[i] = (parseInt(vm.convertColor(clrIn)[0]));
				vm.green[i] = (parseInt(vm.convertColor(clrIn)[1]));
				vm.blue[i] = (parseInt(vm.convertColor(clrIn)[2]));
			}
		}, 5);
	}

	//取值區

	red: any = new Buffer(new Array(104));
	green: any = new Buffer(new Array(104));
	blue: any = new Buffer(new Array(104));
	bri: any;
	seeresult() {
		console.log('red');
		console.log(this.red);
		console.log('green');
		console.log(this.green);
		console.log('blue');
		console.log(this.blue);
		console.log(this.positionRarr);
		console.log(this.positionGarr);
		console.log(this.positionBarr);
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
			var x = this.bri * 1000 / 3.9
			if (x > 255) {
				x = 255;
			}
			rgbColors[0] = Math.round((parseInt(rgbColors[0]) * x) / 255)//當下R值 * A透明度值 * 鍵盤透明度
			rgbColors[1] = Math.round((parseInt(rgbColors[1]) * x) / 255)//當下G值 * A透明度值 * 鍵盤透明度
			rgbColors[2] = Math.round((parseInt(rgbColors[2]) * x) / 255)//當下B值 * A透明度值 * 鍵盤透明度
			// console.log(rgbColors) 
		}
		////////////////////////////////
		// Handle the #RRGGBB' format //
		////////////////////////////////
		else if (color.substring(0, 1) == "#") {
			rgbColors[0] = color.substring(1, 3);  // redValue
			rgbColors[1] = color.substring(3, 5);  // greenValue
			rgbColors[2] = color.substring(5, 7);  // blueValue
			rgbColors[3] = color.substring(7, 9);
		}
		return rgbColors;
	}
	//

	setAPmode() {
		if (this.setAp == 0) {
			this.setAp = 1;

			console.log('setapmode');
			let data = {
				profile: this.changeProfile,
			}
			let obj1 = {
				Type: funcVar.FuncType.Device,
				Func: funcVar.FuncName.SetProfie,
				Param: data
			}
			this.protocol.RunSetFunction(obj1).then((data) => {
				console.log("Container RunSetFunction:" + data);
				//
				let setprofile = {
					profile: this.changeProfile,    //profile  0:reset, 1:Profile1 2:Profile2
					mode: '0x0e', //1~15 代表不同Mode
					light: '0x14',    //0~32 燈光亮度
				}
				let obj2 = {
					Type: funcVar.FuncType.Device,
					Func: funcVar.FuncName.SetCommand,
					Param: setprofile
				}
				console.log("setprofile:SetCommand");
				this.protocol.RunSetFunction(obj2).then((data) => {
					console.log("Container RunSetFunction:" + data);
					this.setAp = 0;
				});
			})
		}
	}

	LEDmatrix() {

		var s = [];//找Marixtable
		s[0] = ['f5', 'n6', 'y', 'h', 'n', 'f6', 'n7', 'k132'];
		s[1] = ['f3', 'n4', 'r', 'g', 'b', 'f4', 'n5', 't'];
		s[2] = ['f2', 'n3', 'e', 'd', 'v', 'space', 'c', 'f'];
		s[3] = ['f1', 'n2', 'w', 's', 'z', 'lalt', 'x', 'K131'];
		s[4] = ['L-Up', 'n1', 'q', 'a', 'K45', 'win', '', 'L-Down'];
		s[5] = ['esc', 'perid', 'tab', 'caps', 'lshift', 'lctrl', '', ''];
		s[6] = ['f12', 'K14', 'drawn', 'K42', 'enter', 'print', 'bsp', 'insert'];
		s[7] = ['f10', 'plus', 'lqu', 'quo', 'rctrl', 'f11', 'rqu', 'rshift'];
		s[8] = ['minus', 'p', 'sem', 'K56', 'qmark', 'f9', 'book', 'fn'];
		s[9] = ['n0', 'i', 'k', 'l', 'comma', 'dot', 'o', 'ralt'];
		s[10] = ['f7', 'n8', 'u', 'j', 'm', 'f8', 'n9', 'K133'];
		s[11] = ['scroll', 'pdown', 'delete', 'numlock', 'end', 'pause', 'home', 'pup'];
		s[12] = ['', 'num2', 'numdrawn', '', 'num5', 'D123', 'D121', 'num8'];
		s[13] = ['', 'R-Up', 'numminus', 'R-Down', 'numenter', 'D122', '', 'numplus'];
		s[14] = ['', 'num3', 'numtimes', '', 'num6', '', 'numdot', 'num9'];
		s[15] = ['up', 'num1', 'down', 'right', 'num4', 'left', 'num0', 'num7'];


		for (var t = 0; t < this.array1.length; t++) {

			let word = this.array1[t];
			for (let i = 0; i < 16; i++) {
				if (s[i].indexOf(word) !== -1) {
					let x = i;
					let y = s[i].indexOf(word);
					this.positionR = x * 10 + y;
					this.positionG = x * 10 + y + 160;
					this.positionB = x * 10 + y + 320;
					// console.log('x:' + x + 'y:' + y)
					this.positionRarr.push(this.positionR);
					this.positionGarr.push(this.positionG);
					this.positionBarr.push(this.positionB);
				}
			}
		}
	}

	doApmode01() {
		console.log('doApmode')
		if (this.saveapmode === false) { //設定一個布林值決定是否要執行下面的程式碼
			this.saveapmode = true;//一進入程式後就把判斷通道關閉，代表同一個時間，不會有兩個doapmode執行
			var apMode = new Buffer(new Array(480));
			for (let i = 0; i < this.array1.length; i++) {
				apMode[this.positionRarr[i]] = this.red[i];
				apMode[this.positionGarr[i]] = this.green[i];
				apMode[this.positionBarr[i]] = this.blue[i];
			}

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

				this.saveapmode = false;
				// this.doApmode01();

				//
			})
		} else {
			console.log('有重複的apmode');//當判斷到有第二個doapmode要執行的要求，直接關閉此要求，結果就是剩下一個doapmode執行
			this.leave == 0;
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




		this.savechange = 0;

	}

	goOut() {
		clearInterval(this.getclr01);
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
		this.leave = 1;
		this.doApmode01();  //每200毫秒放入硬體
		this.letsgoout = true;
		this.letsgoIn = false;
		this.savechange = 0;

	}


	ngOnDestroy(): void {
		this.subscription.unsubscribe();
		this.goOut();
	}

	@Output() sendTimeCloseFlag = new EventEmitter();
	@Input() check01;
	@Input() timeEffect;
	@Output() LightEffect = new EventEmitter();
	@Output() applyStatus = new EventEmitter();
	applyFlag: any = 1;
	noneT: any;
	noneObj() {
		this.noneT = {
			'LightEffect': 16,
			'LSbrightness': "",
			'LSspeed': "",
			'LSdirection': "",
			'changeTime': this.timeValue,
			'ttitle': '关闭所有灯光（省电模式）',
			'changeStatus': this.check01,
			'changeEffect': this.timeEffect,
			'ColorMode': '',
			'Color': '',
		}
		// this.NoneTemp.emit(this.noneT);
		// this.LightEffect.emit(this.noneT.LightEffect)
	}
	sendApply() {
		if (this.timeEffect !== 16) {
			this.noneObj();
			this.sendTimeCloseFlag.emit(this.check01);
			this.passTime.emit(this.timeValue);
			setTimeout(() => {
				this.LightEffect.emit(this.noneT.LightEffect);
				setTimeout(() => {
					this.applyStatus.emit(this.applyFlag);
					this.sendTimeCloseFlag.emit(this.check01);
				}, 500);
			}, 500);
		} else {
			console.log('apply false');
			return false;
		}
	}
}

