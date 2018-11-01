declare var System;
import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { protocolService } from '../services/service/protocol.service';
import { ElectronEventService, dbService, EmitService } from '../services/libs/electron/index';
import { icpEventService } from '../services/service/icpEventService.service';
const { shell } = System._nodeRequire('electron');
const { app } = System._nodeRequire('electron')

import { Http } from '../../../node_modules/@angular/http';


let evtVar = System._nodeRequire('./backend/others/eventVariable');
let funcVar = System._nodeRequire('./backend/others/FunctionVariable');
let env = System._nodeRequire('./backend/others/env');
let remote = System._nodeRequire('electron').remote;
let { dialog } = remote;
let win = remote.getGlobal('MainWindow').win;

const { ipcRenderer } = System._nodeRequire('electron');
declare var $: any;
import { Subscription } from "rxjs/Subscription";
import { setImmediate } from 'core-js';
import { isRegExp } from 'util';
@Component({
	selector: 'hd-app',
	templateUrl: './components/hd.compo.html',
	//template: '<h1>我的第一个 Angular 应用</h1>',
	styleUrls: ['./css/first.css', './css/kbd.css','./css/setting.css'],
	providers: [protocolService, dbService, icpEventService],


})


export class HdComponent implements OnInit {
	@Output() outputProEvent: EventEmitter<any> = new EventEmitter();

	//流程:讀取profile=>keyDataSetIn	
	// thebegingsetProfile:any='2';
	profileclick: number = 1;
	gameclick: number = 0;
	keyDataReadyTime: number = 50;
	keyDataValueReady: boolean = false;
	fakekb: boolean = true;
	gameindex: number;
	checkatt: boolean = false;
	exitTime: number = 1000;
	checkAppbeFW: boolean = false;
	checksetapmode: boolean = false;
	startTime: number = 100;
	updateTempstart: number = 0;
	FnF12GameFlag: number = 0;
	showtextprofile: any;

	readprofileOne: boolean = true;
	callnameclick: boolean = false;
	changeProfile: any = '2';
	loading02: boolean = false;
	preEff: boolean = false;
	nextEff: boolean = false;
	doitfunctionRun: boolean = false;

	remindUnplug: boolean = false;
	showtext: string = "写入中";
	effectready: boolean = false;
	nexteffect: boolean = true;
	previouseffect: boolean = true;
	FnF12: boolean = false;
	makesurePlugIn: boolean = false;
	attPercent: any;
	getPercent(e) {
		this.attPercent = e;
		// console.log('hd pt',this.attPercent);
	}
	winFlag: number = 0;
	keeploading: number = 0;
	thefirstloading: boolean = false;
	beginProfileList: any = [];
	timebasicObj: any;//暫存obj
	readyforwinsblock: boolean = true;
	readyforCC: boolean = true;

	blockwins: boolean = true;
	backtowins: boolean = false;
	ccstart: boolean = true;
	backtocc: boolean = false;

	blockWindowsKeystatus: number = 1;
	CCstatus: number = 1;
	LightcompoRemind: any;
	hdblock: any;
	blockFrtp: any = '';
	addprorun: number = 1;
	LSsetinDB: any;
	altflag: number = 0;
	insertFlag: number = 0;
	oninitFlag: number = 0;
	loading: boolean;
	getGame: any;
	fnflag: number = 0;
	fnkeyset: any = 'notyet';
	profileAllcontentSend: any; //選出的profile傳送到其他分頁作為讀取或更新
	Path: any;
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
	changeEffect: number = 0;
	subscription: Subscription;
	FtdeleteSaveclick: number = 0;
	copytext: string;
	newNameprofile: any;
	blockfrtpclose: any;

	editproname: any;

	addDefaultName = "配置文件"
	profileName: string;
	names: any = ['游戏模式', '配置文件1'];
	count: number = 2;
	Openobbox: boolean = false;
	connectOn: boolean = false;
	changeOb: boolean = true;
	showinput: boolean = false;
	profileindex: any = 0;
	showmore: any = false;
	blockcss: any = "disabled";

	// begin: number = 1;
	seerainbow: any = false;
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
	seeblasoul: any = false;
	seenone: any = false;
	namescount: any = 1;
	profileID: any = [];
	profile_ID: any = [];
	text: any = "";
	word: any = "";
	seeEffecarr: any = [
		this.seerainbow,
		this.seebreath,
		this.seelighten,
		this.seecrash,
		this.seestarlight,
		this.seedragon,
		this.seemeeting,
		this.seelightrain,
		this.seeboom,
		this.seecross,
		this.seefloat,
		this.seewaves,
		this.seeround,
		this.seegameeffect,
		this.seepure,
		this.seeblasoul,
		this.seenone,
	]

	attshow: any = 'attshowchange ';
	show: any = "show";
	lanset: boolean = true;
	setting: boolean = false;
	logov: boolean = false;
	assor: string = "燚 Y720 键盘"
	lan: string = "简体中文";
	check: boolean = false;
	selfdf: any = 'none';
	ckcss: any = {
		color: "white",
		"background-color": "rgba(233,0,76,0.5)",
		"border": "1px solid #E7004C",
	};
	icpclick: number = 0;
	saveclick: number = 0;
	lecssb01 = "";
	lecssb02 = "";
	lecssb03 = "";

	insertime: number = 0;
	becss: any = {};
	loopNum: any = ['optb01', 'optb02', 'optb03'];

	showsd: boolean = false;
	css01: any = "white";
	css02: any = "";
	css03: any = "";
	css04: any = "";
	loadingFinish: boolean = true;
	KCTarr: any = [72, 165, 167, 168, 228, 166, 224, 62, 20, 43, 4, 41, 29, 145, 53, 30, 26, 57, 22, 100, 27, 138, 58, 31, 8, 60, 7, 61, 6, 144, 59, 32, 21, 23, 9, 10, 25, 5, 34, 33, 24, 28, 13, 11, 16, 17, 35, 36, 12, 48, 14, 63, 54, 135, 46, 37, 18, 64, 15, 137, 55, 101, 65, 38, 19, 47, 51, 52, 50, 56, 45, 39, 71, 0, 170, 226, 171, 230, 0, 70, 0, 42, 49, 68, 40, 69, 66, 67, 95, 92, 89, 44, 83, 81, 76, 179, 96, 93, 90, 98, 84, 79, 73, 176, 97, 94, 91, 99, 85, 86, 75, 78, 87, 133, 88, 82, 103, 80, 74, 77, 231, 225, 229, 139, 227, 172, 136, 0, 72, 165, 167, 168, 228, 166, 224, 62, 20, 43, 4, 0, 29, 145, 53, 30, 26, 57, 22, 100, 27, 138, 58, 31, 8, 60, 7, 61, 6, 144, 59, 32, 21, 23, 9, 10, 25, 5, 34, 33, 24, 28, 13, 11, 16, 17, 35, 36, 12, 48, 14, 63, 54, 135, 46, 37, 18, 64, 15, 137, 55, 101, 65, 38, 19, 47, 51, 52, 50, 56, 45, 39, 219, 0, 170, 226, 171, 230, 0, 216, 0, 42, 49, 68, 240, 176, 66, 67, 95, 92, 89, 44, 83, 81, 217, 179, 96, 93, 90, 98, 84, 79, 218, 176, 97, 94, 91, 99, 85, 86, 223, 222, 87, 133, 88, 82, 103, 80, 220, 221, 0, 225, 229, 139, 177, 172, 136, 0];
	firstbuttonActivcate: number = 0;
	chng: any;
	cur: any;
	prev: any;

	FnF12profilename: any = this.names[1];
	setprofileinfoDetail: any = [1, 1, 0, 7, 20, 0, 0, 0, 0, 0, 0, 0, 0, 30, 5, 5, 60, 80, 100, 100, 50, 50, 50, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 0, 0, 255, 0, 0, 255, 0, 0, 255, 0, 0, 255, 0, 0, 255, 255, 255, 255, 0, 255, 0, 255, 255, 255, 255, 255, 0, 41, 255, 0, 255, 0, 255, 255, 255, 0, 0, 0, 255, 255, 255, 0, 0, 0, 255, 255, 255, 0, 0, 0, 255, 255, 255, 0, 0, 0, 255, 255, 255, 0, 0, 0, 255, 0, 0, 0, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0];

	constructor(private protocol: protocolService, private db: dbService, private emitService: EmitService, private icpEventService: icpEventService) {
		//console.log('container loading complete');

		//

		this.subscription = this.emitService.EmitObservable.subscribe(src => {

			if (src == 'Exitready') {
				console.log('do Exitapp');
				this.exitAppBeFW();
			}

			//console.log('s1111');
			// //console.log(src);
			//console.log(this.saveclick);

			if (src == 'remove') {
				// this.makesurePlugIn = false;
				// this.EffectTagAllFalse();
				// // this.seenone=true;
				// //console.log('makesurePlugIn');
				// //console.log(this.makesurePlugIn);
				let windowSize;
				let obj3 = {
					Type: funcVar.FuncType.System,
					Func: funcVar.FuncName.QuitApp,
					Param: windowSize
				}
				// setTimeout(() => {
				this.protocol.RunSetFunction(obj3).then((data) => {
				})
				// }, 3000);

			}


			if (src == 'insert') {
				this.makesurePlugIn = true;
				this.detectFWVersion();
				this.detectButton();
				setTimeout(() => {
					this.setApmodeP1();//下 07 02 第一道
					// this.docanvas();
				}, 50);

			}

			if (src == 'insert' && this.oninitFlag == 0) {
				setTimeout(() => {
					this.makesurePlugIn = true;
					this.whenLoading(1);
					this.insertFlag = 1;
					this.saveclick = 1;
					//console.log('test00222')
					this.addpro1();
				}, 2000);

				// let obj={
				// 	"ProfileName": "MacroList",
				// }

				// this.db.getProfile(obj).then((doc: any) => {

				// if(doc[0].saveprofileNAME!=="" && doc[0].saveprofileNAME!==undefined && doc[0].saveprofileNAME!==null){
				// 	this.profileName=doc[0].saveprofileNAME;
				// }else{
				// 	this.profileName='游戏模式'
				// }

				// setTimeout(() => {


				// },20)
				// })

			}

			// let vm = this;
			// setTimeout(() => {
			// 	vm.insertFlag = 1;
			// 	//console.log('insert111111');
			// 	vm.saveclick = 1;
			// 	if (vm.oninitFlag == 0) {
			// 		vm.AltF4();
			// 		vm.addpro1();
			// 		// vm.loadingFinish = false;
			// 		// callback();
			// 		//頁面啟動時讀DB keyData

			// 		setTimeout(() => {
			// 			this.getGame='stopApmode';
			// 			//console.log('insert111');

			// 			vm.keyDataSetIn();
			// 			vm.insertFlag = 0;
			// 			vm.getReadFile();
			// 			// this.keyMacroSetIn();
			// 		}, 8000);
			// 	}
			// }, 3000);
			// }else if(src == 'insert' && this.saveclick == 0 && this.insertime>0){
			// 	this.setAPmode();
			// }

			// }else{
			// 	// this.setAPmode();
			// }
			// }else if(src == 'insert' && this.saveclick == 1){

			// 		// let txt;
			// 		let r = confirm("感應失效請重新插入設備");
			// 		if (r == true) {
			// 			// txt = "You pressed OK!";
			// 			this.saveclick=0;
			// 		} else {
			// 			// txt = "You pressed Cancel!";
			// 			return false;
			// 		}
			// 		this.loading=false;

			// }

			this.fromicp = src;
			// console.log(this.fromicp);
			//console.log('test:' + this.fromicp.data);

			// 	if(this.firstbuttonActivcate==0){
			// 	if (this.fromicp.data[0] == 4 && this.fromicp.data[1] == 225 && this.fromicp.data[2] == 16 && this.fromicp.data[3] == 2) {
			// 		//console.log('attRight');
			// 		// this.attbtn = true;
			// 		this.ATTativate(1);
			// 		this.firstbuttonActivcate=1;
			// 	} else {
			// 		return false;
			// 	}
			// }
			//魂力燈帶
			// if(	this.icpclick==0){


			// this.icpclick=1
			// if (this.fromicp.data[0] == 4 && this.fromicp.data[1] == 225 && this.fromicp.data[2] == 15 && this.fromicp.data[3] == 1) {
			//     //console.log('attLeft');
			//     // this.attbtn = false;
			//     // this.ATTativate(0);
			//     // this.Attswitch="attLeft";
			// }


			// if (this.fromicp.data[0] == 4 && this.fromicp.data[1] == 225 && this.fromicp.data[2] == 16 && this.fromicp.data[3] == 2) {
			// 	//console.log('attRight');
			// 	// this.attbtn = true;
			// 	this.ATTativate(1);
			// } else {
			// 	return false;
			// }


			// if(this.icpclick==1){
			//fnkey	

			// //console.log('testicp1111');
			if (this.fromicp.data !== undefined) {
				//

				//console.log('yes1231111');

				if (this.nexteffect == true && this.previouseffect == true) {

					//resetdefault
					// if (this.fromicp.data[0] == 4 && this.fromicp.data[1] == 225 && this.fromicp.data[2] == 14 && this.fromicp.data[3] == 1) {//Fn按下

					// }
					//console.log('yes12322222');
					if (this.fromicp.data[1] == 225 && this.fromicp.data[2] == 4 && this.fromicp.data[3] == 1) {//Fn按下
						this.set128 = 128;
						this.fnflag = 1;
						//console.log('fnflag:', this.fnflag);
						//console.log('fn1111' + this.set128)
					} else {

						if (this.fromicp.data[1] == 7 && this.fromicp.data[2] == 7 && this.fromicp.data[5] == 1) {//normalkey 按下
							//console.log('normal1111');
							this.keyfuncposition = this.fromicp.data[3] * 8 + this.fromicp.data[4]

							if (this.fnflag !== 1) {
								this.set128 = 0;
								this.doItfunction(this.keyfuncposition);
							} else {
								// this.keypositionX = this.fromicp.data[3];
								// this.keypositionY = this.fromicp.data[4];
								//console.log('fn444' + this.set128)
								this.keyfuncposition = this.fromicp.data[3] * 8 + this.fromicp.data[4] + this.set128;
								//console.log('this.keyfuncposition' + this.keyfuncposition);
								// //console.log('this.keyfuncposition get');
								this.doItfunction(this.keyfuncposition);
								this.set128 = 0;
								if (this.keyfuncposition == 213 && this.FnF12 == true && this.saveclick == 0) {
									console.log('test if');


									this.FnF12IF();


									// this.FnF12 = false;
									// this.changeProfile = '2';
									//console.log('get 213');
									// this.callName(0);

									// let obj = {
									// 	"ProfileName": "MacroList",
									// }
									// this.db.getProfile(obj).then((doc: any) => {
									// 	if (doc[0].saveprofileNAME!=="游戏模式" && doc[0].saveprofileNAME !== "" && doc[0].saveprofileNAME !== undefined && doc[0].saveprofileNAME !== null) {
									// 		let nameindex = this.names.indexOf(doc[0].saveprofileNAME);
									// 		console.log('nameindex:',nameindex);
									// 		this.callName(nameindex);
									// 	}else{
									// 		this.callName(0);
									// 	}
									// })

									// this.ngOnInit();
								}

							}
						}
					}

					if (this.fromicp.data[1] == 225 && this.fromicp.data[2] == 5 && this.fromicp.data[3] == 2) {//Fn放開
						this.fnflag = 0;
						this.set128 = 0;
						//console.log('fnflag:', this.fnflag);
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
					// 		if (this.keyfuncposition == 213 && this.FnF12 == true) {
					// 			this.FnF12 = false;
					// 			//console.log('get 213');
					// 			this.callName(0);
					// 		}

					// 	}
					// }
				}


				// if (this.firstbuttonActivcate == 0) {
				// 	if (this.fromicp.data[0] == 4 && this.fromicp.data[1] == 225 && this.fromicp.data[2] == 16 && this.fromicp.data[3] == 2) {
				// 		//console.log('attRight');
				// 		// this.attbtn = true;
				// 		this.ATTativate(1);
				// 		this.firstbuttonActivcate = 1;
				// 	} else {
				// 		return false;
				// 	}
				// }
				if (this.fromicp.data !== undefined) {
					if (this.fromicp.data[0] == 4 && this.fromicp.data[1] == 225 && this.fromicp.data[2] == 15 && this.fromicp.data[3] == 1) {
						//console.log("attleft");
						this.lightBarStatus = 1;
					}
					else if (this.fromicp.data[0] == 4 && this.fromicp.data[1] == 225 && this.fromicp.data[2] == 16 && this.fromicp.data[3] == 2) {
						//console.log("attright");
						this.lightBarStatus = 0;
					}
				}
				if (this.fromicp.data !== undefined) {
					this.timeCheck(this.doubleCheck);
				}
			}
		})
	}

	fwv: boolean = false;
	attModeFlag: any = 0;

	detectFWVersion() {
		let obj1 = {
			Type: funcVar.FuncType.Device,
			Func: funcVar.FuncName.GetProfieAndFirmwareVer,
			Param: ""
		}
		this.protocol.RunSetFunction(obj1).then((data) => {
			let obj2 = {
				Type: funcVar.FuncType.Device,
				Func: funcVar.FuncName.RunApplication,
				Param: "resources/app/BK700-FWUpdate.exe"
				//如要用F5開啟路徑為../BK700-FWUpdate.exe 打包前須改為 resources/app/BK700-FWUpdate.exe
			}
			env.log('HDpage', 'FWUpdatePath', obj2.Param)
			if (data[3] < 0x37) {
				this.fwv = true
				if (this.fwv) {
					this.ATTativate();
					this.protocol.RunSetFunction(obj2).then((data) => {
						env.log('HDpage', 'FWstart', 'start')
						let windowSize;
						let obj3 = {
							Type: funcVar.FuncType.System,
							Func: funcVar.FuncName.QuitApp,
							Param: windowSize
						}
						setTimeout(() => {
							this.protocol.RunSetFunction(obj3).then((data) => {
							})
						}, 3000);
					})
				}
			}
		})
	}

	resetUI(e) {
		console.log('12345678')
		this.updateTempstart = 0;
		// this.getGame = 'stopApmode';
		this.EffectTagAllFalse();
		setTimeout(() => {
			this.keyDataSetIn();
		}, 20);

	}

	setApmodeP1() {
		env.log('setAPmode 444', ' setProfile ', 'setProfile Complete')
		let setprofile = {
			profile: '1',    //profile  0:reset, 1:Profile1 2:Profile2
			mode: '0x0e', //1~15 代表不同Mode
			light: '0x14',    //0~32 燈光亮度

		}
		let obj2 = {
			Type: funcVar.FuncType.Device,
			Func: funcVar.FuncName.SetCommand,
			Param: setprofile
		}
		env.log('setAPmode 444', ' setCommand', 'before setCommand')
		this.protocol.RunSetFunction(obj2).then((data) => {
			env.log('setAPmode 444', ' setCommand ', 'setCommand Complete')
			console.log('dosetApmodeP1');
			setTimeout(() => {
				// 接著做p2
				this.setApmodeP2();
			}, 500);

		});
	}

	setApmodeP2() {
		env.log('setAPmode 444', ' setProfile ', 'setProfile Complete')
		let setprofile = {
			profile: '2',    //profile  0:reset, 1:Profile1 2:Profile2
			mode: '0x0e', //1~15 代表不同Mode
			light: '0x14',    //0~32 燈光亮度

		}
		let obj2 = {
			Type: funcVar.FuncType.Device,
			Func: funcVar.FuncName.SetCommand,
			Param: setprofile
		}
		env.log('setAPmode 444', ' setCommand', 'before setCommand')
		this.protocol.RunSetFunction(obj2).then((data) => {
			env.log('setAPmode 444', ' setCommand ', 'setCommand Complete');
			console.log('dosetApmodeP2');
			this.checksetapmode = true;
		});
	}




	setprofile() {
		if (this.checksetapmode) {
			let data = {
				profile: this.changeProfile,
			}
			let obj1 = {
				Type: funcVar.FuncType.Device,
				Func: funcVar.FuncName.SetProfie,
				Param: data
			}
			env.log('hd', ' 下setProfile', '設定完P1P2')
			this.protocol.RunSetFunction(obj1).then((data) => {
			})
		}
		else {
			//第二道寫純色無色
			env.log('setAPmode 444', ' setProfile ', 'setProfile Complete')
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
			env.log('setAPmode 444', ' setCommand', 'before setCommand')
			this.protocol.RunSetFunction(obj2).then((data) => {
				env.log('setAPmode 444', ' setCommand ', 'setCommand Complete')
				console.log('dosetApmode_this.changeProfile');

				setTimeout(() => {
					//切profile
					let data = {
						profile: this.changeProfile,
					}
					let obj1 = {
						Type: funcVar.FuncType.Device,
						Func: funcVar.FuncName.SetProfie,
						Param: data
					}
					env.log('setAPmode 444', ' setProfile ', 'before setProfile')
					this.protocol.RunSetFunction(obj1).then((data) => {
					})
				}, 500);
			});
		}

		//
		console.log('testsetprofile00000');



		//

		// env.log('setAPmode 444', ' setProfile ', 'setProfile Complete')
		// 		let setprofile = {
		// 			// profile: '1',    //profile  0:reset, 1:Profile1 2:Profile2
		// 			profile: this.changeProfile,   //profile  0:reset, 1:Profile1 2:Profile2
		// 			mode: '0x0e', //1~15 代表不同Mode
		// 			light: '0x14',    //0~32 燈光亮度

		// 		}
		// 		let obj2 = {
		// 			Type: funcVar.FuncType.Device,
		// 			Func: funcVar.FuncName.SetCommand,
		// 			Param: setprofile
		// 		}
		// 		env.log('setAPmode 444', ' setCommand', 'before setCommand')
		// 		this.protocol.RunSetFunction(obj2).then((data) => {
		// 			env.log('setAPmode 444', ' setCommand ', 'setCommand Complete')

		// 		});
		//

		// console.log('testsetprofile00000');

		// let data = {
		// 	profile: this.changeProfile,
		// }
		// let obj1 = {
		// 	Type: funcVar.FuncType.Device,
		// 	Func: funcVar.FuncName.SetProfie,
		// 	Param: data
		// }

		// this.protocol.RunSetFunction(obj1).then((data) => {


		// 	let setprofile = {
		// 		// profile: '1',    //profile  0:reset, 1:Profile1 2:Profile2
		// 		profile: this.changeProfile,   //profile  0:reset, 1:Profile1 2:Profile2
		// 	}
		// 	let obj2 = {
		// 		Type: funcVar.FuncType.Device,
		// 		Func: funcVar.FuncName.SetCommand,
		// 		Param: setprofile
		// 	}

		// 	this.protocol.RunSetFunction(obj2).then((data) => {
		// 		env.log('setprofile', '前端執行setprofile', JSON.stringify(this.changeProfile))
		// 	});
		// })
	}


	FnF12IF() {

		// if(this.FnF12GameFlag<1){

		if (this.profileName !== '游戏模式' && this.profileName !== "") {
			// this.FnF12GameFlag++;
			this.callName(0);
		} else {
			// this.FnF12GameFlag++;
			if (this.FnF12profilename !== '游戏模式') {
				console.log('FN0000', this.FnF12profilename);
				let nameindex = this.names.indexOf(this.FnF12profilename);
				console.log('nameindex:', nameindex);
				this.callName(nameindex);
			}
		}
		// }else{
		// 	this.callName(0);
		// 	this.FnF12GameFlag=0;
		// }
		this.settings();
	}
	updateEffect(e) {
		this.whenLoading(1);
		// this.LightcompoRemind = 'updatenow';
		// setTimeout(() => {
		// 	this.LightcompoRemind = '';
		// }, 200);
	}

	whenLoading(w) {
		if (w == 1) {
			this.loading = true;
			this.hdblock = 'disabled';
			if (this.keeploading == 1) {
				// this.showtext="写入中";
				this.whenLoading(1);

			}
		}

		if (w == 2) {
			this.loading02 = true;
			this.hdblock = 'disabled';
			if (this.keeploading == 1) {
				// this.showtext="写入中";
				this.whenLoading(1);

			}
		}

		if (w == 3) {

			setTimeout(() => {
				this.hdblock = '';
				this.loading02 = false;
			}, 1000);
		}

		if (w == 0) {
			setTimeout(() => {
				this.hdblock = '';
				this.loading = false;
			}, 1000);
		}

	}




	openFrtp(e) {
		if (e == 1) {
			// this.hdblock = "disabled";
			this.whenLoading(1);
			//console.log("11111" + this.hdblock)
		}
		if (e == 2) {
			// this.hdblock = "disabled";
			this.whenLoading(2);
			//console.log("11111" + this.hdblock)
		}
		if (e == 3) {
			// this.hdblock = "disabled";
			this.whenLoading(3);
			//console.log("11111" + this.hdblock)
		}
		if (e == 0) {
			this.whenLoading(0);
			// this.hdblock = " ";
			//console.log("22222" + this.hdblock)
		}
	}


	ngOnChanges(changes: any) {
		for (let propName in changes) {

			this.chng = changes[propName];
			this.cur = this.chng.currentValue;
			this.prev = this.chng.previousValue;
		}

		//console.log(this.cur); //收到改變的物件

	}
	//

	// if (this.fromicp.data[1] == 7 && this.fromicp.data[2] == 7 && this.fromicp.data[5] == 1) {//normalkey 按下
	//     //console.log('yes');

	//     this.keypositionX = this.fromicp.data[3];
	//     this.keypositionY = this.fromicp.data[4];
	//     this.keyfuncposition = this.fromicp.data[3] * 8 + this.fromicp.data[4] + this.set128;

	// 	//console.log('normalKEYPOSITION:' + this.keyfuncposition);
	// 	if(this.keyfuncposition!==undefined){

	// 	}
	//     // this.keyfuncposition = this.keyfuncposition + 128;

	//     // this.keyfuncposition = this.keyfuncposition + 128;
	//     // if(this.time==0){


	//     // }
	// } else if (this.fromicp.data[1] == 225 && this.fromicp.data[2] == 4 && this.fromicp.data[3] == 1) {//Fn按下
	//     //console.log('KEYPOSITION:' + this.keyfuncposition);
	//     this.set128 = 128;

	//     //console.log('fnKEYPOSITION:' + this.keyfuncposition)
	//     // this.doItfunction(this.keyfuncposition);



	// } else if (this.fromicp.data[1] == 225 && this.fromicp.data[2] == 5 && this.fromicp.data[3] == 2) {// Fn放開

	//     this.set128 = 0;
	// } else if (this.fromicp.data[1] == 7 && this.fromicp.data[2] == 7 && this.fromicp.data[5] == 0) {//normalkey 放開
	//     this.keyfuncposition = 0; //reset;
	//     // this.time=0;
	// }


	//接受游戏模式的options值
	getGameoptions(e) {
		//console.log('getGame1111');
		//console.log(e);
		this.getGame = e;
		if (e == '"loadingStart"') {
			console.log("loadingStart");
			this.whenLoading(1);
		}

		if (e == '"loadingEnded"') {
			this.whenLoading(0);
			console.log("loadingEnded");
		}
	}



	AltF4() {
		let vm = this;
		let s = 18;
		let t = 115;
		window.addEventListener('keydown', function (e) {
			if (e.keyCode == s) {
				//console.log('alt');
				vm.altflag = 1;
				window.addEventListener('keyup', (e) => {
					if (e.keyCode == s) {
						vm.altflag = 0
					}
				})
			}
			if (vm.altflag == 1) {
				if (e.keyCode == t) {
					vm.hide();
				}
			}
		})
	}



	// setAPmode() {
	// 	let data = {
	// 		profile: this.changeProfile,
	// 	}
	// 	let obj1 = {
	// 		Type: funcVar.FuncType.Device,
	// 		Func: funcVar.FuncName.SetProfie,
	// 		Param: data
	// 	}
	// 	env.log('setAPmode 444', ' setProfile ', 'before setProfile')
	// 	this.protocol.RunSetFunction(obj1).then((data) => {

	// 		env.log('setAPmode 444', ' setProfile ', 'setProfile Complete')
	// 		let setprofile = {
	// 			// profile: '1',    //profile  0:reset, 1:Profile1 2:Profile2
	// 			profile: this.changeProfile,   //profile  0:reset, 1:Profile1 2:Profile2
	// 			mode: '0x0e', //1~15 代表不同Mode
	// 			light: '0x14',    //0~32 燈光亮度

	// 		}
	// 		let obj2 = {
	// 			Type: funcVar.FuncType.Device,
	// 			Func: funcVar.FuncName.SetCommand,
	// 			Param: setprofile
	// 		}
	// 		env.log('setAPmode 444', ' setCommand', 'before setCommand')
	// 		this.protocol.RunSetFunction(obj2).then((data) => {
	// 			env.log('setAPmode 444', ' setCommand ', 'setCommand Complete')
	// 		});
	// 	})
	// }


	exitAppBeFW() {
		this.getGame = ''
		setTimeout(() => {
			this.getGame = 'stopApmode';
			setTimeout(() => {
				this.ATTativate();
				setTimeout(() => {
					let data = {
						profile: this.changeProfile,
					}
					let obj1 = {
						Type: funcVar.FuncType.Device,
						Func: funcVar.FuncName.SetProfie,
						Param: data
					}
					this.protocol.RunSetFunction(obj1).then((data) => {
						// env.log('rainbow', 'setProfie', 'end')
						// 	// //console.log("Container RunSetFunction:" + data);
						// 	//console.log('test1111');
						// let setprofile = {
						// 	profile: this.changeProfile,    //profile  0:reset, 1:Profile1 2:Profile2
						// 	mode: 0x00, //1~15 代表不同Mode
						// 	light: 0x14,    //0~32 燈光亮度
						// 	rainbowdir: 0x00,
						// 	rainbowtime: 0x30,
						// }
						let setprofile = {
							profile: this.changeProfile,    //profile  0:reset, 1:Profile1 2:Profile2
							mode: this.setprofileinfoDetail[0]/*LED MODE this.setprofileinfoDetail[0]*/,
							light: this.setprofileinfoDetail[1]/*Light  this.setprofileinfoDetail[1]*/,
							rainbowdir: this.setprofileinfoDetail[2], /*WaveDir this.setprofileinfoDetail[2]*/
							crashdir: this.setprofileinfoDetail[3], /*ZhuangJi_Dir*/
							dragondir: this.setprofileinfoDetail[4], /*Zhongguo_Long_Dir*/
							boomdir: this.setprofileinfoDetail[5],
							rounddir: this.setprofileinfoDetail[6], /*Zhan_Fang_Dir*/

							rainbowtime: this.setprofileinfoDetail[7], /*Wave_Time  this.setprofileinfoDetail[7]*/
							breathtime: this.setprofileinfoDetail[8], /*Breath_Time*/
							lightentime: this.setprofileinfoDetail[9], /*Cycle_Time*/
							crashtime: this.setprofileinfoDetail[10], /*Zhuangji_Time*/
							starlighttime: this.setprofileinfoDetail[11], /*FanXing_Time*/
							dragontime: this.setprofileinfoDetail[12], /*ZhongguoLong_Time*/
							meetingtime: this.setprofileinfoDetail[13], /*Xie_Hou_Time*/
							lightraintime: this.setprofileinfoDetail[14], /*RainT*/
							wavetime: this.setprofileinfoDetail[15], /*MaiChong_Time*/
							crosstime: this.setprofileinfoDetail[16], /*Zhong_H_Time*/

							floattime: this.setprofileinfoDetail[17], /*Piaoheng_Time*/
							boomtime: this.setprofileinfoDetail[18], /*Lian_Yi_Time*/
							roundtime: this.setprofileinfoDetail[19], /*Zhan_Fang_Time*/
							breathMode: this.setprofileinfoDetail[20], /*Breath_Mode*/
							crashMode: this.setprofileinfoDetail[21], /*ZhuangJi_Mode*/
							startlightMode: this.setprofileinfoDetail[22], /*Fan_Xing_Mode*/
							meetingMode: this.setprofileinfoDetail[23], /*Xie_Hou_Mode*/
							lightrainMode: this.setprofileinfoDetail[24], /*Rain_Mode*/
							waveMode: this.setprofileinfoDetail[25], /*MaiChong_Mode*/
							crossMode: this.setprofileinfoDetail[26], /*Zhong_H_Mode*/

							floatMode: this.setprofileinfoDetail[27], /*Piaoheng_mode*/
							boomMode: this.setprofileinfoDetail[28], /*Lian_Yi_Mode*/
							roundMode: this.setprofileinfoDetail[29], /*Zhan_Fang_Mode*/
							BreathModeR1: this.setprofileinfoDetail[30], /*Breath_Mode_R[1]*/
							BreathModeR2: this.setprofileinfoDetail[31], /*Breath_Mode_R[2]*/
							BreathModeG1: this.setprofileinfoDetail[32], /*Breath_Mode_G[1]*/
							BreathModeG2: this.setprofileinfoDetail[33], /*Breath_Mode_G[2]*/
							BreathModeB1: this.setprofileinfoDetail[34], /*Breath_Mode_B[1]*/
							BreathModeB2: this.setprofileinfoDetail[35], /*Breath_Mode_B[2]*/
							ZhuangJiModeR1: this.setprofileinfoDetail[36], /*ZhuangJiModeR1*/

							ZhuangJiModeR2: this.setprofileinfoDetail[37], /* ZhuangJiModeR2*/
							ZhuangJiModeG1: this.setprofileinfoDetail[38], /*ZhuangJiModeG1*/
							ZhuangJiModeG2: this.setprofileinfoDetail[39], /*ZhuangJiModeG2*/
							ZhuangJiModeB1: this.setprofileinfoDetail[40], /*ZhuangJi_Mode_B*/
							ZhuangJiModeB2: this.setprofileinfoDetail[41], /*ZhuangJi_Mode_B]*/
							FanXingModeR: this.setprofileinfoDetail[42], /* Fan_Xing_ModeR1*/
							FanXingModeG: this.setprofileinfoDetail[43], /* Fan_Xing_Mode_G1*/
							FanXingModeB: this.setprofileinfoDetail[44], /*Fan_Xing_Mode_B1*/
							zhongguolongModeR1: this.setprofileinfoDetail[45], /*Mai_Chong_Mode_R[2]*/
							zhongguolongModeR2: this.setprofileinfoDetail[46], /*Mai_Chong_Mode_G[2]*/

							zhongguolongModeG1: this.setprofileinfoDetail[47], /*Mai_Chong_Mode_B[2]*/
							zhongguolongModeG2: this.setprofileinfoDetail[48], /*Zhong_H_Mode_R[2]*/
							zhongguolongModeB1: this.setprofileinfoDetail[49], /*Zhong_H_Mode_G*/
							zhongguolongModeB2: this.setprofileinfoDetail[50], /*Zhong_H_Mode_B[2]*/
							XieHouModeR1: this.setprofileinfoDetail[51], /*Piao_H_Mode_G[2]*/
							XieHouModeR2: this.setprofileinfoDetail[52],
							XieHouModeG1: this.setprofileinfoDetail[53],
							XieHouModeG2: this.setprofileinfoDetail[54], /*Piao_H_Mode_G[2]*/
							XieHouModeB1: this.setprofileinfoDetail[55], /*Piao_H_Mode_G[2]*/
							XieHouModeB2: this.setprofileinfoDetail[56],
							RainModeR: this.setprofileinfoDetail[57],
							RainModeG: this.setprofileinfoDetail[58],
							RainModeB: this.setprofileinfoDetail[59],
							LianyiModeR1: this.setprofileinfoDetail[60],
							LianyiModeR2: this.setprofileinfoDetail[61],
							LianyiModeG1: this.setprofileinfoDetail[62],
							LianyiModeG2: this.setprofileinfoDetail[63],
							LianyiModeB1: this.setprofileinfoDetail[64],
							LianyiModeB2: this.setprofileinfoDetail[65],
							ZhongHModeR1: this.setprofileinfoDetail[66],
							ZhongHModeR2: this.setprofileinfoDetail[67],
							ZhongHModeG1: this.setprofileinfoDetail[68],
							ZhongHModeG2: this.setprofileinfoDetail[69],
							ZhongHModeB1: this.setprofileinfoDetail[70],
							ZhongHModeB2: this.setprofileinfoDetail[71],
							PiaoHModeR1: this.setprofileinfoDetail[72],
							PiaoHModeR2: this.setprofileinfoDetail[73],
							PiaoHModeG1: this.setprofileinfoDetail[74],
							PiaoHModeG2: this.setprofileinfoDetail[75],
							PiaoHModeB1: this.setprofileinfoDetail[76],
							PiaoHModeB2: this.setprofileinfoDetail[77],
							MaiChongModeR1: this.setprofileinfoDetail[78],
							MaiChongModeR2: this.setprofileinfoDetail[79],
							MaiChongModeG1: this.setprofileinfoDetail[80],
							MaiChongModeG2: this.setprofileinfoDetail[81],
							MaiChongModeB1: this.setprofileinfoDetail[82],
							MaiChongModeB2: this.setprofileinfoDetail[83],
							ZhanFangModeR1: this.setprofileinfoDetail[84],
							ZhanFangModeR2: this.setprofileinfoDetail[85],
							ZhanFangModeG1: this.setprofileinfoDetail[86],
							ZhanFangModeG2: this.setprofileinfoDetail[87],
							ZhanFangModeB1: this.setprofileinfoDetail[88],
							ZhanFangModeB2: this.setprofileinfoDetail[89],
							OneColorR: this.setprofileinfoDetail[90],
							OneColorG: this.setprofileinfoDetail[91],
							OneColorB: this.setprofileinfoDetail[92],
							AltF4Fun: this.setprofileinfoDetail[93],
							AltTabFun: this.setprofileinfoDetail[94],
							ShiftTabFun: this.setprofileinfoDetail[95],
							wavedir: this.setprofileinfoDetail[96],
						}
						console.log('test000', setprofile);

						if (this.fromLightEffect == 0 || this.fromLightEffect == 16) {
							console.log('this.fromLightEffect == 0');
							setprofile.mode = 0x00;
							setprofile.light = 0x14;
							setprofile.rainbowdir = 0x00;
							setprofile.rainbowtime = 0x30;
							this.checkAppbeFW = true; //可退出UI
						}

						if (this.fromLightEffect == 1) {
							console.log('this.fromLightEffect == 1');
							setprofile.mode = 0x01;
							setprofile.light = 0x14;
							setprofile.breathtime = 0x05;
							setprofile.breathMode = 0x00;
							setprofile.BreathModeR1 = 0xff;
							setprofile.BreathModeR2 = 0xb1;
							setprofile.BreathModeG1 = 0x00;
							setprofile.BreathModeG2 = 0x00;
							setprofile.BreathModeB1 = 0x35;
							setprofile.BreathModeB2 = 0xff;
							this.checkAppbeFW = true; //可退出UI
						}

						if (this.fromLightEffect == 2) {
							console.log('this.fromLightEffect == 2');
							setprofile.mode = 0x02;
							setprofile.light = 0x14;
							setprofile.lightentime = 0x05;
							this.checkAppbeFW = true; //可退出UI
						}

						if (this.fromLightEffect == 3) {
							console.log('this.fromLightEffect == 3');
							setprofile.mode = 0x03;
							setprofile.light = 0x14;
							setprofile.crashdir = 0x00;
							setprofile.crashtime = 0x60;
							setprofile.crashMode = 0x00;
							this.checkAppbeFW = true; //可退出UI
						}

						if (this.fromLightEffect == 4) {
							console.log('this.fromLightEffect == 4');
							setprofile.mode = 0x04;
							setprofile.light = 0x14;
							setprofile.starlighttime = 0x60;
							setprofile.startlightMode = 0x00;
							this.checkAppbeFW = true; //可退出UI
						}

						if (this.fromLightEffect == 5) {
							console.log('this.fromLightEffect == 5');
							setprofile.mode = 0x05;
							setprofile.light = 0x14;
							setprofile.dragondir = 0x00;
							setprofile.dragontime = 100;
							this.checkAppbeFW = true; //可退出UI
						}

						if (this.fromLightEffect == 6) {
							console.log('this.fromLightEffect == 6');
							setprofile.mode = 0x06;
							setprofile.light = 0x14;
							setprofile.meetingtime = 0x01;
							setprofile.meetingtime = 100;
							this.checkAppbeFW = true; //可退出UI
						}

						if (this.fromLightEffect == 7) {
							console.log('this.fromLightEffect == 7');
							setprofile.mode = 0x07;
							setprofile.light = 0x14;
							setprofile.lightrainMode = 0x01;
							setprofile.lightraintime = 0x50;
							setprofile.RainModeR = 0x00;
							setprofile.RainModeG = 0x29;
							setprofile.RainModeB = 0xff;
							this.checkAppbeFW = true; //可退出UI
						}

						if (this.fromLightEffect == 8) {
							console.log('this.fromLightEffect == 8');
							setprofile.mode = 0x08;
							setprofile.light = 0x14;
							setprofile.wavedir = 0x00;
							setprofile.waveMode = 0x01;
							setprofile.wavetime = 0x50;
							this.checkAppbeFW = true; //可退出UI
						}

						if (this.fromLightEffect == 9) {
							console.log('this.fromLightEffect == 9');
							setprofile.mode = 0x09;
							setprofile.light = 0x14;
							setprofile.crossMode = 0x01;
							setprofile.crosstime = 0x50;
							this.checkAppbeFW = true; //可退出UI
						}

						if (this.fromLightEffect == 10) {
							console.log('this.fromLightEffect == 10');
							setprofile.mode = 0x0a;
							setprofile.light = 0x14;
							setprofile.floatMode = 0x01;
							setprofile.floattime = 0x50;

						}

						if (this.fromLightEffect == 11) {
							console.log('this.fromLightEffect == 11');
							setprofile.mode = 0x0b;
							setprofile.light = 0x14;
							setprofile.boomdir = 0x00;
							setprofile.boomMode = 0x00;
							setprofile.boomtime = 0x30;
							this.checkAppbeFW = true; //可退出UI
						}

						if (this.fromLightEffect == 12) {
							console.log('this.fromLightEffect == 12');
							setprofile.mode = 0x0c;
							setprofile.light = 0x14;
							setprofile.rounddir = 0x00;
							setprofile.roundMode = 0x00;
							setprofile.roundtime = 0x30;
							this.checkAppbeFW = true; //可退出UI
						}

						if (this.fromLightEffect == 13) {
							console.log('this.fromLightEffect == 13');
							setprofile.mode = 0x0d;
							setprofile.light = 0x14;
							this.checkAppbeFW = true; //可退出UI
						}

						if (this.fromLightEffect == 14) {
							console.log('this.fromLightEffect == 14', this.fromLightEffect);
							setprofile.mode = 0x0e;
							setprofile.light = 0x14;
							setprofile.OneColorR = 0xff;
							setprofile.OneColorG = 0x00;
							setprofile.OneColorB = 0x00;
							this.checkAppbeFW = true; //可退出UI
						}

						if (this.fromLightEffect == 15) {
							console.log('this.fromLightEffect == 15');
							setprofile.mode = 0x00;
							setprofile.light = 0x14;
							setprofile.rainbowdir = 0x00;
							setprofile.rainbowtime = 0x30;
							this.checkAppbeFW = true; //可退出UI
						}
						// if(this.fromLightEffect == 1){
						// 	console.log('this.fromLightEffect == 1');
						// 		setprofile.mode=0x01;
						// 		setprofile.light=0x14;
						// 		setprofile.breathtime=0x05;
						// 	}
						// 	profile: this.changeProfile,    //profile  0:reset, 1:Profile1 2:Profile2
						// 	mode: 0x00, //1~15 代表不同Mode
						// 	light: 0x14,    //0~32 燈光亮度
						// 	rainbowdir: 0x00,
						// 	rainbowtime: 0x30,
						// }
						let obj2 = {
							Type: funcVar.FuncType.Device,
							Func: funcVar.FuncName.SetCommand,
							Param: setprofile
						}
						// //console.log("setprofile:SetCommand");
						this.protocol.RunSetFunction(obj2).then((data) => {
							//console.log("Container RunSetFunction:" + data);
							// setTimeout(()=>{
							// 	this.ATTativate();
							// },20)
							setTimeout(() => {
								if (this.checkAppbeFW == true && this.checkatt == true) {
									env.log('HD', 'exitBeFw', 'success')
									let windowSize;
									let obj3 = {
										Type: funcVar.FuncType.System,
										Func: funcVar.FuncName.QuitApp,
										Param: windowSize
									}
									this.protocol.RunSetFunction(obj3).then((data) => {
									})
								} else {
									env.log('HD', 'exitBeFw', 'fail')
									this.exitTime = this.exitTime + 500;
									console.log('增加500')
									this.exitAppBeFW();
								}
							}, this.exitTime);
						});
					})
				}, 200);
			}, 20);
		}, 20);
	}


	ATTativate() {
		console.log('ATTativate');
		// this.setInArr();
		// this.macrosavecick++;
		// if (this.macrosavecick == 1) {
		let data = {
			profile: this.changeProfile,
			Ap_Flag: '0',
			LightBar_Mode: '0',
		}
		let obj1 = {
			Type: funcVar.FuncType.Device,
			Func: funcVar.FuncName.LightBarMode,
			Param: data
		}
		this.protocol.RunSetFunction(obj1).then((data) => {
			setTimeout(() => {
				this.checkatt = true;
			}, 500);
		});
	}

	initAtt() {
		let data = {
			profile: this.changeProfile,
			Ap_Flag: '1',
			LightBar_Mode: '0',
		}
		let obj1 = {
			Type: funcVar.FuncType.Device,
			Func: funcVar.FuncName.LightBarMode,
			Param: data
		}
		this.protocol.RunSetFunction(obj1).then((data) => {
		});
	}

	getAtt() {
		let obj1 = {
			Type: funcVar.FuncType.Device,
			Func: funcVar.FuncName.GetProfieAndFirmwareVer,
			Param: ""
		}
		this.protocol.RunSetFunction(obj1).then((data) => {
			console.log(data)
		})
	}

	lightBarStatus: any;

	detectButton() {
		let obj3 = {
			Type: funcVar.FuncType.Device,
			Func: funcVar.FuncName.GetProfieAndFirmwareVer,
			Param: ""
		}
		setTimeout(() => {
			this.protocol.RunSetFunction(obj3).then((data) => {
				console.log(data)
				setTimeout(() => {
					//console.log('detectButton1111、');
					//console.log(data);
					if (data[5] == 1) {
						this.lightBarStatus = 0;
					}
					else if (data[5] == 0) {
						this.lightBarStatus = 1;
					}
				}, 20);
			})
		}, 20);
	}

	receiveLBS(e) {
		if (e !== undefined || e !== null || e !== "") {
			this.lightBarStatus = e;
		}
	}


	keyMacroSetIn() {
		let obj = {
			'ProfileName': this.profileName
		}
		env.log('keyMacroSetIn 222', 'getProfile', 'before getProfile')

		this.db.getProfile(obj).then((doc: any) => {

			env.log('keyMacroSetIn 222', 'getProfile', 'getProfile complete')

			//console.log('keymacro11111');
			//console.log(doc[0].Key.marcroContent);
			if (doc[0].Key.marcroContent.length !== 0) {

				env.log('keyMacroSetIn 222', 'Key.marcroContent.length !== 0', 'before getKeyMatrix')

				//console.log('keyMacroSetIn11111')
				//console.log(doc[0]);
				let setMacroarr = doc[0].Key.marcroContent;
				let KeyDataValue = doc[0].KeyDataValue;
				let vm = this;
				for (let index = 0; index < setMacroarr.length; index++) {

					(function (num) {
						setTimeout(function () {
							console.log('indexnum', num);
							console.log('setMacroarr.length-1:', setMacroarr.length - 1);
							if (setMacroarr[num] !== null && setMacroarr[num] !== undefined && setMacroarr[num] !== "") {

								if (num == setMacroarr.length - 1) {
									console.log('確認值');
									console.log(num);
									vm.AltF4();

									if (this.changeProfile == "2") {
										console.log("00000001111111");
										this.gameModesetblock();
									}
									// setTimeout(() => {
									// 	this.updateTemp();
									// }, 20);

									// setTimeout(() => {
									// this.setAPmode();
									setTimeout(() => {
										if (vm.updateTempstart == 0) {
											vm.updateTempstart = 1;
											vm.updateTemp();
										}
										setTimeout(() => {
											console.log('startAllsetting');
											vm.startAllsetting();
										}, 2000);

									}, 20);

									// let vm = this;
									// setTimeout(() => {
									// 	vm.startAllsetting();
									// }, 50);

									// this.loading = false;
									// this.saveclick = 0;
									// this.oninitFlag=0;
									// }, 1000);
								}


								let data = {
									profile: this.changeProfile,
								}
								let obj1 = {
									Type: funcVar.FuncType.Device,
									Func: funcVar.FuncName.GetKeyMatrix,
									Param: data
								}

								env.log('keyMacroSetIn 222', 'setMacroarr', 'before getKeyMatrix')

								this.protocol.RunSetFunction(obj1).then((data) => {
									env.log('keyMacroSetIn 222', 'setMacroarr', 'getKeyMatrix complete')
									//console.log("Container RunSetFunction:" + data);
									//console.log('keyMacroSetIn4444')
									let content = {
										profile: this.changeProfile,
										KeyData: data
									}
									let obj2 = {
										Type: funcVar.FuncType.Device,
										Func: funcVar.FuncName.SetKeyMatrix,
										Param: content
									}
									env.log('keyMacroSetIn 222', 'setMacroarr', 'before setKeyMatrix')
									this.protocol.RunSetFunction(obj2).then((data) => {

										env.log('keyMacroSetIn 222', 'setMacroarr', 'setKeyMatrix complete')

										//console.log("Container RunSetFunction:" + data);
										//console.log('setMatrix ended');

										//console.log('read333讀取完成')
										//console.log('keyMacroSetIn55555')
										setTimeout(() => {
											//console.log('keyMacroSetIn6666')
											//console.log(setMacroarr);
											var marcoarr = [];
											marcoarr = setMacroarr[num];
											let set = {
												key: KeyDataValue[num],
												repeat: "1",
												data: marcoarr
											}
											let obj3 = {
												Type: funcVar.FuncType.Device,
												Func: funcVar.FuncName.SetMacroKey,
												Param: set
											}
											env.log('keyMacroSetIn 222', 'setMacroarr', 'before setMacroKey')
											this.protocol.RunSetFunction(obj3).then((data) => {

												env.log('keyMacroSetIn 222', 'setMacroarr', 'setMacroKey complete')

												// if (num == setMacroarr.length - 1) {
												// 	this.AltF4();
												// 	// setTimeout(() => {
												// 	// 	this.updateTemp();
												// 	// }, 20);
												// 	let vm = this;
												// 	setTimeout(() => {
												// 		// this.setAPmode();
												// 		setTimeout(() => {
												// 			if (vm.updateTempstart == 0) {
												// 				vm.updateTempstart = 1;
												// 				vm.updateTemp();
												// 			}
												// 			setTimeout(() => {
												// 				console.log('startAllsetting');
												// 				vm.startAllsetting();
												// 			}, 50);

												// 		}, 20);

												// 		// let vm = this;
												// 		// setTimeout(() => {
												// 		// 	vm.startAllsetting();
												// 		// }, 50);

												// 		// this.loading = false;
												// 		// this.saveclick = 0;
												// 		// this.oninitFlag=0;
												// 	}, 1000);
												// }


												//console.log("Container RunSetFunction:" + data);
												//console.log('read333讀取完成4444')
												// this.seeprofile;

												// 			// this.getGame = 'stopApmode';

												// this.getGame = 'startApmode';
												// this.saveclick = 0;
												// // this.loading = false;
												// this.oninitFlag = 0;

												// 		if (this.dete == 0) {
												// 			this.detectButton();
												// 			this.dete = 1;
												// 		} else {
												// 			this.detectButton();
												// 			this.dete = 0;
												// 		}

											});
											//console.log('keyMa111')

										}, 150);
									});
								});

							}
						}, 50 * (index + 1));
					})(index);

				}
			} else {
				//console.log('keyMa222')
				this.AltF4();
				if (this.changeProfile == "2") {
					console.log("0000000");
					this.gameModesetblock();
				}
				// setTimeout(() => {
				// 	this.updateTemp();
				// }, 20);
				// // let vm=this;
				// // setTimeout(() => {
				// // this.setAPmode();
				// let vm = this;
				// setTimeout(() => {
				// 	vm.startAllsetting();
				// }, 50);
				let vm = this;
				setTimeout(() => {
					// this.setAPmode();
					setTimeout(() => {
						if (vm.updateTempstart == 0) {
							vm.updateTempstart = 1;
							vm.updateTemp();
						}
						setTimeout(() => {
							vm.startAllsetting();
						}, 50);

					}, 20);

					// let vm = this;
					// setTimeout(() => {
					// 	vm.startAllsetting();
					// }, 50);

					// this.loading = false;
					// this.saveclick = 0;
					// this.oninitFlag=0;
				}, 1000);

				// },5000);

				// this.getGame = 'stopApmode';

				// this.getGame = 'startApmode';
				// this.oninitFlag = 0;
				// this.saveclick = 0;
				// this.loading = false;


				// if (this.dete == 0) {
				// 	this.detectButton();
				// 	this.dete = 1;
				// } else {
				// 	this.detectButton();
				// 	this.dete = 0;
				// }
			}
		})
	}

	dete: any = 0;
	keyDataSetIn() {
		console.log('in keydatasetin');

		if (this.getGame = "stopApmode") {
			console.log('read0000');
			setTimeout(() => {
				console.log('read1111')
				if (this.names.indexOf(this.profileName) == -1) {
					this.profileName = '游戏模式'
				}

				let obj = {
					'ProfileName': this.profileName
				}
				env.log('keyDataSetIn 111', 'getDBProfile', 'befroe get profile')

				if (this.profileName == '游戏模式') {
					console.log('do keydatasetin 2')
					this.changeProfile = '2';
					this.blockWindowsKeystatus = 0;
					// this.testGetProfileInfo();

					setTimeout(() => {
						this.setprofile();
						dosetin();
					}, 50)
				} else {
					console.log('do keydatasetin 1')
					this.changeProfile = '1';
					this.blockWindowsKeystatus = 1;
					// this.testGetProfileInfo();
					setTimeout(() => {
						this.setprofile();
						dosetin();
					}, 50)
				}

				let vm=this;
				function dosetin(){
					
					setTimeout(() => {
						env.log('hd', 'keydatasetin', ' 清除')
						vm.cleanKBdata(); //清除所有鍵盤值
					}, 50);
					
					setTimeout(() => {
						env.log('hd', 'keydatasetin', '下值')
						vm.db.getProfile(obj).then((doc: any) => {
							env.log('keyDataSetIn 111', 'getDBProfile', 'after get profile')
							console.log('keymatrix keydata下值');
							console.log(doc[0]);
							if (doc[0] === "" || doc[0] === undefined || doc[0] === null) {
								console.log('doc[0] is undefined or null ');
								vm.saveclick = 0;
								vm.insertFlag = 0;
								vm.ngOnInit();
							}
	
							// vm.blockWindowsKeystatus=doc[0].winstatus;
							// vm.CCstatus=doc[0].capsstatus;
							// "winstatus": "",
							// 	"capsstatus": "",
	
	
							let lastdataRecord = doc[0].KeyDataValue;
							//
							let data = {
								profile: vm.changeProfile,
							}
							let obj1 = {
								Type: funcVar.FuncType.Device,
								Func: funcVar.FuncName.GetKeyMatrix,
								Param: data
							}
							env.log('keyDataSetIn 111', 'getKeyMatrix', 'befroe getKeyMatrix')
							vm.protocol.RunSetFunction(obj1).then((data) => {
								//console.log("Container RunSetFunction:" + data);
								env.log('keyDataSetIn 111', 'getKeyMatrix', 'after getKeyMatrix + keyDataValue' + doc[0].KeyDataValue.length)
	
								if (doc[0].KeyDataValue.length !== 0) {
									env.log('keyDataSetIn 111', 'keyDataValue !== 0', 'read profile')
									for (let index = 0; index < doc[0].KeyDataValue.length; index++) {
										//讀入profile內容
										if (doc[0].KeyDataValue[index] !== null && doc[0].KeyDataValue[index] !== undefined && doc[0].KeyDataValue[index] !== "") {
											//console.log('read222')
											data[index] = doc[0].KeyDataValue[index];
										}
									}
	
									if (doc[0].KeyDataValue[230] == null || doc[0].KeyDataValue[230] == undefined || doc[0].KeyDataValue[230] == "") {
										data[230] = 0x00;
									}
	
									if (doc[0].KeyDataValue[222] == null || doc[0].KeyDataValue[222] == undefined || doc[0].KeyDataValue[222] == "") {
										data[222] = 0x00;
									}
	
									if (doc[0].KeyDataValue[213] == null || doc[0].KeyDataValue[213] == undefined || doc[0].KeyDataValue[213] == "") {
										data[213] = 0xB3;
									}
	
									if (doc[0].KeyDataValue[200] == null || doc[0].KeyDataValue[200] == undefined || doc[0].KeyDataValue[200] == "") {
										data[200] = 0xB3;
									}
	
									if (doc[0].KeyDataValue[124] == null || doc[0].KeyDataValue[124] == undefined || doc[0].KeyDataValue[124] == "") {
	
										if (vm.gameindex == 0) {
											data[124] = 0x00;
										} else {
											data[124] = 227;
										}
									}
									setTimeout(() => {
										vm.keyDataValueReady = true;
									}, 10);
								} else {
									env.log('keyDataSetIn 111', 'keyDataValue == 0', 'set default KCTarr')
									for (let index = 0; index < vm.KCTarr.length; index++) {
										data[index] = vm.KCTarr[index];
										if (index == vm.KCTarr.length - 1) {
											data[222] = 0x00;
											data[230] = 0x00;
											data[213] = 0xB3;
											data[200] = 0xB3;
											if (vm.gameindex == 0) {
												data[124] = 0x00;
											} else {
												data[124] = 227;
											}
	
											setTimeout(() => {
												vm.keyDataValueReady = true;
											}, 10);
										}
									}
								}
								let obj3 = {
									'ProfileName': vm.profileName
								}
								env.log('keyDataSetIn 111', 'db.getProfile', 'befroe getProfile')
								vm.db.getProfile(obj3).then((doc: any) => {
									doc[0].KeyDataValue = data;
									//console.log('儲存');
									//console.log(doc[0].KeyDataValue);
	
									env.log('keyDataSetIn 111', 'db.getProfile', 'getProfile complete')
									vm.db.UpdateProfile(doc[0].id, doc[0]).then((doc: any) => {
										console.log('read222讀取完成')
										env.log('keyDataSetIn 111', 'Update', 'read DB complete')
									})
								})
								// //console.log('vmkeydata:');
								// //console.log(doc[0].KeyDataValue);
								// //console.log(data[7]);
								// //console.log(data);
	
								setTimeout(() => {
									if (vm.keyDataValueReady) {
										let content = {
											profile: vm.changeProfile,
											KeyData: data
										}
										let obj2 = {
											Type: funcVar.FuncType.Device,
											Func: funcVar.FuncName.SetKeyMatrix,
											Param: content
										}
										env.log('keyDataSetIn 111', 'setKeyMatrix', 'before setKeyMatrix')
										vm.protocol.RunSetFunction(obj2).then((data) => {
											//console.log("Container RunSetFunction555:" + data);
											console.log('setMatrix ended');
	
	
											console.log('read333讀取完成')
											env.log('keyDataSetIn 111', 'setKeyMatrix', 'setKeyMatrix complete');
											vm.seeSpecialkeystatus(doc[0]);
											setTimeout(() => {
												vm.keyDataValueReady = false;
												vm.keyMacroSetIn()//讀取macro
											}, 2000);
										});
									} else {
	
										vm.keyDataSetIn();
										vm.keyDataReadyTime += 50;
									}
								}, vm.keyDataReadyTime);
							});
						})
					}, 1000);
					
				}

				
			}, 50);

		} else {
			console.log('keydata else')
			this.getGame = '';
			this.getGame = "stopApmode"
			setTimeout(() => {
				this.keyDataSetIn();
			}, 50);
		}
	}

	testallprofile() {
		this.db.getAllProfile().then((doc: any) => {
			console.log("所有的profile內容");
			console.log(doc);
		})
	}

	ngOnInit() {
		this.hide();
		this.openwindow();
		this.whenLoading(1);
		// this.doshowDB();
		setTimeout(() => {
			this.oninitFlag = 1;
			if (this.insertFlag == 0) {
				this.saveclick = 1;
				//console.log('test00111')
				this.addpro1();


				// this.loadingFinish = false;
				// callback();
				//頁面啟動時讀DB keyData

				// let vm = this;
				// setTimeout(() => {
				// 	this.AltF4();
				// 	this.addpro1();
				// 	// this.getGame = 'stopApmode';
				// 	vm.loading = false;
				// 	//console.log('insert2222');

				// 	// vm.keyMacroSetIn();
				// 	vm.oninitFlag = 0;
				// }, 8000);
			}
		}, 2000);
	}

	// dofirst() { //替代ngOnInit //頁面啟動時讀DB游戏模式


	// 	// //console.log('1111'+this.deviceGet);

	// }
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
			////console.log('do getkeymatrixKB');
		});
	}


	startAllsetting() {
		// console.log('LBS', this.lightBarStatus);
		// if (this.lightBarStatus == 0) {
		// 	this.detectAtt();
		// }
		this.initAtt();
		this.seeprofile();
		// this.getGame = "startApmode";
		//console.log('starAll2222');
		//讀取上一次動作
		//console.log(this.profileName);
		this.getkeymatrixKB();
		let obj = {
			"ProfileName": this.profileName
		}
		env.log('startAllsetting 333', 'DB getProfile', 'before DB getProfile')
		this.db.getProfile(obj).then((doc: any) => {

			env.log('startAllsetting 333', 'DB getProfile', 'DB getProfile complete')

			//console.log('startall setting get');
			this.profileAllcontentSend = doc[0];
			//console.log(this.profileAllcontentSend);
			this.outputProEvent.emit(this.profileAllcontentSend);

			// 


			//之前紀錄的燈效
			if (doc[0].Light.LightEffect !== "" && doc[0].Light.LightEffect !== null && doc[0].Light.LightEffect !== undefined) {
				env.log('startAllsetting 333', 'LightEffect !== "" ', 'DB write in')
				console.log('333');
				//console.log(doc[0].Light.LightEffect)
				// this.setAPmode();
				// console.log('LBS',this.lightBarStatus);
				// if (this.lightBarStatus == 0) {
				// 	this.detectAtt();
				// }



				this.Lighteffect(doc[0].Light.LightEffect);
				// this.fromLightEffect = doc[0].Light.LightEffect;
				this.outputProEvent.emit(this.profileAllcontentSend);

				this.saveclick = 0;

				setTimeout(() => {
					this.FnF12 = true;//可用快捷鍵call遊戲模式
					this.whenLoading(0);
					this.getGame = '';
					// //預設this.FnF12profilename
					// this.FnF12profilename=this.names[1];
					if (this.profileName == undefined || this.profileName == null || this.profileName == "") {
						this.profileName = '游戏模式';
					}
					this.selfshow = false;
					setTimeout(() => {
						this.clickOn01();
						this.fakekb = false;
					}, 1000);


				}, 500);



				setTimeout(() => {//存入profile名稱
					let obj = {
						"ProfileName": "MacroList",
					}
					this.db.getProfile(obj).then((doc: any) => {
						doc[0].saveprofileNAME = this.profileName;
						this.db.UpdateProfile(doc[0].id, doc[0]).then((see: any) => {

						});
					});
				}, 50);
				// setTimeout(() => {//存入profile名稱
				// 	let obj = {
				// 		"ProfileName": "MacroList",
				// 	}
				// 	this.db.getProfile(obj).then((doc: any) => {
				// 		// saveprofileNAME
				// 		if (this.callnameclick) {
				// 			doc[0].saveprofileNAME = this.profileName;
				// 		}
				// 		if (doc[0].saveprofileNAME == "" || doc[0].saveprofileNAME == null || doc[0].saveprofileNAME == undefined) {
				// 			doc[0].saveprofileNAME ='游戏模式';
				// 		}

				// setTimeout(() => {//存入profile名稱
				// 	let obj = {
				// 				"ProfileName": "MacroList",
				// 			}
				// 	this.db.getProfile(obj).then((doc: any) => {
				// 	doc[0].saveprofileNAME = this.profileName;
				// 	this.db.UpdateProfile(doc[0].id, doc[0]).then((see: any) => {

				// 	});
				// });
				// }, 50);

				// 	});
				// }, 100);
				// if (this.thefirstloading) {
				// 	setTimeout(() => {
				// 		this.whenLoading(0);
				// 	}, 2000);

				// }

				// if (this.dete == 0) {
				// 	this.detectButton();
				// 	this.dete = 1;
				// } else {
				// 	this.detectButton();
				// 	this.dete = 0;
				// }
				this.thefirstloading = true;
				this.oninitFlag = 0;
				this.insertFlag = 0;



			} else {
				// console.log('LBS',this.lightBarStatus);
				// if (this.lightBarStatus == 0) {
				// 	this.detectAtt();
				// }
				env.log('startAllsetting 333', 'LightEffect == "" ', 'rainbow write in')
				//console.log('找到rainbow');
				// this.setAPmode();
				console.log('沒有之前燈效');
				this.Lighteffect(0);
				// this.fromLightEffect = 0
				this.outputProEvent.emit(this.profileAllcontentSend);
				this.saveclick = 0;
				setTimeout(() => {
					this.FnF12 = true;//可用快捷鍵call遊戲模式
					this.whenLoading(0);
					this.getGame = '';
					// //預設this.FnF12profilename
					// this.FnF12profilename=this.names[1];
					if (this.profileName == undefined || this.profileName == null || this.profileName == "") {
						this.profileName = '游戏模式';
					}

					this.selfshow = false;
					setTimeout(() => {
						this.clickOn01();
						this.fakekb = false;
					}, 1000);

				}, 500);

				setTimeout(() => {//存入profile名稱
					let obj = {
						"ProfileName": "MacroList",
					}
					this.db.getProfile(obj).then((doc: any) => {
						doc[0].saveprofileNAME = this.profileName;
						this.db.UpdateProfile(doc[0].id, doc[0]).then((see: any) => {

						});
					});
				}, 50);
				// setTimeout(() => {//存入profile名稱
				// 	let obj = {
				// 		"ProfileName": "MacroList",
				// 	}
				// 	this.db.getProfile(obj).then((doc: any) => {
				// 		// saveprofileNAME
				// 		// if(doc[0].saveprofileNAME == "" || doc[0].saveprofileNAME == null || doc[0].saveprofileNAME == undefined){
				// 		if (this.callnameclick) {
				// 			doc[0].saveprofileNAME = this.profileName;
				// 		}

				// 		if (doc[0].saveprofileNAME == "" || doc[0].saveprofileNAME == null || doc[0].saveprofileNAME == undefined) {
				// 			doc[0].saveprofileNAME ='游戏模式';
				// 		}
				// 		// 	console.log(doc[0].saveprofileNAME);
				// 		// }else{
				// 		// 	console.log('之前已有profile使用');
				// 		// }

				// 		setTimeout(() => {
				// 			this.db.UpdateProfile(doc[0].id, doc[0]).then((see: any) => {
				// 				console.log('讀取PROFILE');
				// 				console.log(this.names);
				// 				console.log(this.names.indexOf(doc[0].saveprofileNAME));
				// 				if(this.readprofileOne){
				// 				this.callName(this.names.indexOf(doc[0].saveprofileNAME));
				// 				this.readprofileOne=false;
				// 				}else{
				// 					this.whenLoading(0);
				// 				}

				// 				this.callnameclick=false;
				// 			});
				// 		}, 50);

				// 	});
				// }, 100);
				// if (this.thefirstloading) {
				// 	setTimeout(() => {
				// 		this.whenLoading(0);
				// 	}, 2000);
				// }

				// if (this.dete == 0) {
				// 	this.detectButton();
				// 	this.dete = 1;
				// } else {
				// 	this.detectButton();
				// 	this.dete = 0;
				// }
			}

			//console.log('找到profile');
			this.thefirstloading = true;
			this.oninitFlag = 0;
			this.insertFlag = 0;


			// setTimeout(() => {
			// 	this.EffectTagAllFalse();
			// },10000);
		})


		//啟動燈效
		// //console.log(this.begin);
		// if (this.begin == 1) {
		// 	this.seerainbow = true;
		// 	this.begin++;
		// }
	}

	hidebox() {
		this.showmore = false;
		this.Openobbox = false;
		this.changeOb = true;
	}


	openwindow() {
		//console.log('open');
		var windowSize = {
			x: 901,
			y: 655
		}

		let obj2 = {
			Type: funcVar.FuncType.System,
			Func: funcVar.FuncName.ChangeWindowSize,
			Param: windowSize
		}

		this.protocol.RunSetFunction(obj2).then((data) => { });
	}

	hide() {
		//console.log('hide');
		var windowSize = {
			x: 1,
			y: 1
		}

		let obj2 = {
			Type: funcVar.FuncType.System,
			Func: funcVar.FuncName.ChangeWindowSize,
			Param: windowSize
		}

		this.protocol.RunSetFunction(obj2).then((data) => {
			this.pageChange(1);
		});
	}


	createMacrolist() {

		if (this.beginProfileList.indexOf('MacroList') == -1) {
			//console.log('製作MacroList')
			let obj2 = {
				"ProfileName": "MacroList",
				"macrolistNames": [],
				"macrolistArr": [],
				"saveprofileNAME": ""
			}


			this.db.AddProfile(obj2).then((doc: any) => {
				//console.log("macrolist");
				setTimeout(() => {
					this.createGamelist();
				}, 20);

			})
		}

	}

	createGamelist() {

		if (this.beginProfileList.indexOf('游戏模式') == -1) {
			//console.log('製作游戏模式')

			let obj = {
				"ProfileName": "游戏模式",
				"Key": {
					"winstatus": "",
					"capsstatus": "",
					"keyFunctionArr": [],
					"marcroContent": [],
					"marcroChoose": [],
					"Path": [],
					"keyCopy": [],
					"options": {
						"OPshelf01": [],//內容/選單
						"OPshelf02": []
					}
				},
				"shelf01": [],
				"shelf02": [],
				"shelfblock01": [],
				"shelfblock02": [],
				"KeyDataValue": [],
				"Light": {
					"LightEffect": "",
					"LightSetting": {
						"LSbrightness": [],
						"LSspeed": [],
						"LSdirection": [],
						"changeMode": [],
						"changeTime": [],
						"changeStatus": [],
						"changeEffect": [],
					},
					"Mode": [],
					"ColorMode": [],
					"Speed": [],
					"Color": [],
					"Time": "",
					"Into": ""
				},
				"AttLight": {
					"effect": "",
					"time": ""
				},
				"GameMode": [0, 0, 0]
			}


			this.db.AddProfile(obj).then((doc: any) => {
				// this.db.getAllProfile().then((doc: any) => {
				// 	console.log('00000:', doc[0])
				// })
				//console.log("加入游戏模式");
				this.createProfilefstlist();//隱藏createprofile 1
				// let obj={
				// 	"ProfileName": "MacroList",
				// }

				// this.db.getProfile(obj).then((doc: any) => {
				// 	console.log('判斷上次的profile')
				// 	if(doc[0].saveprofileNAME!=="" && doc[0].saveprofileNAME!==undefined && doc[0].saveprofileNAME!==null){
				// 		this.profileName=doc[0].saveprofileNAME;
				// 		console.log(this.profileName);
				// 	}else{
				// 		this.profileName='游戏模式'
				// 	}
				// })

			})


		}
	}


	createProfilefstlist() {
		if (this.beginProfileList[2] == "" || this.beginProfileList[2] == undefined || this.beginProfileList[2] == null) {
			let obj2 = {
				"ProfileName": "配置文件1",
				"Key": {
					"winstatus": "",
					"capsstatus": "",
					"keyFunctionArr": [],
					"marcroContent": [],
					"marcroChoose": [],
					"Path": [],
					"keyCopy": [],
					"options": {
						"OPshelf01": [],
						"OPshelf02": []
					}

				},
				"shelf01": [],
				"shelf02": [],
				"shelfblock01": [],
				"shelfblock02": [],
				"KeyDataValue": [],
				"Light": {
					"LightEffect": "",
					"LightSetting": {
						"LSbrightness": [],
						"LSspeed": [],
						"LSdirection": [],
						"changeMode": [],
						"changeTime": [],
						"changeStatus": [],
						"changeEffect": [],
					},
					"Mode": [],
					"ColorMode": [],
					"Speed": [],
					"Color": [],
					"Time": "",
					"Into": ""
				},
				"AttLight": {
					"effect": "",
					"time": ""
				},
				"GameMode": [0, 0, 0]
			}


			this.db.AddProfile(obj2).then((doc: any) => {
				//console.log("加入profile1");
			})
		}

	}

	// testGetProfileInfo() {
	// 	let setprofile = {

	// 		profile: this.changeProfile   //profile  0:reset, 1:Profile1 2:Profile2

	// 	}
	// 	let obj2 = {
	// 		Type: funcVar.FuncType.Device,
	// 		Func: funcVar.FuncName.GetProfileInfo,
	// 		Param: setprofile
	// 	}

	// 	this.protocol.RunSetFunction(obj2).then((data) => {
	// 		console.log('GetProfileInfo', JSON.stringify(data));
	// 		// this.setprofileinfoDetail = data;
	// 	});
	// }


	addpro1() {
		// this.setApmodeP1();//下 07 02
		// this.addprorun=1;
		//console.log('addpro1');
		//如果硬體之前沒有profile內容，就加上游戏模式、profile 1
		//
		this.db.getAllProfile().then((doc: any) => {

			this.profileAllcontentSend = doc[0]; //先讀取游戏模式的內容，為了其他頁的預測讀取


			//如果沒有id1,做AddProfile 


			//製作macrolist


			for (let index = 0; index < doc.length; index++) {
				this.beginProfileList.push(doc[index].ProfileName);

			}

			this.createMacrolist();
			setTimeout(() => {
				this.seeprofile();
			}, 1000);

			let vm = this;
			setTimeout(() => {
				if (this.makesurePlugIn) {

					let obj = {
						"ProfileName": "MacroList",
					}

					this.db.getProfile(obj).then((doc: any) => {
						console.log('判斷上次的profile')
						if (doc[0].saveprofileNAME !== "" && doc[0].saveprofileNAME !== undefined && doc[0].saveprofileNAME !== null) {
							vm.profileName = doc[0].saveprofileNAME;
							console.log(vm.profileName);
							this.profileindex = this.names.indexOf(vm.profileName);
							this.gameindex = this.profileindex;
						} else {
							this.profileName = '游戏模式'
							this.gameindex = 0;
						}
					})

					// setTimeout(() => {
					// 	this.testGetProfileInfo();
					// }, 20)

					// this.whenLoading(0);
					setTimeout(() => {
						vm.keyDataSetIn();
					}, 50);

				} else {

					// let r = confirm("未偵測到設備，請重新插入後按下確定鍵");
					// if (r == true) {
					// 	vm.keyDataSetIn();
					// } else {
					// 	//關閉eletron
					// 	this.ngOnInit();
					// }

					this.remindUnplug = true;

					setTimeout(() => {
						let windowSize;
						let obj3 = {
							Type: funcVar.FuncType.System,
							Func: funcVar.FuncName.QuitApp,
							Param: windowSize
						}
						// setTimeout(() => {
						this.protocol.RunSetFunction(obj3).then((data) => {
						})
						// }, 3000);
					}, 10000);
				}
			}, 5000);
			// 	if (!doc[1]) { //如果沒有id2,做AddProfile 
			// 		let obj2 = {
			// 			"ProfileName": "profile 1",
			// 			"Key": {
			// 				"keyFunctionArr": [],
			// 				"marcroContent": [],
			// 				"Path": [],
			// 				"keyCopy": [],
			// 				"options": {
			// 					"OPshelf01": [],
			// 					"OPshelf02": []
			// 				}

			// 			},
			// 			"shelf01": [],
			// 			"shelf02": [],
			// 			"KeyDataValue": [],
			// 			"Light": {
			// 				"LightEffect": "",
			// 				"LightSetting": {
			// 					"LSbrightness": [],
			// 					"LSspeed": [],
			// 					"LSdirection": [],
			// 					"changeMode": [],
			// 					"changeTime": [],
			// 				},
			// 				"Mode": [],
			// 				"Speed": [],
			// 				"Color": [],
			// 				"Time": "",
			// 				"Into": ""
			// 			},
			// 			"AttLight": {
			// 				"effect": "",
			// 				"time": ""
			// 			},
			// 			"GameMode": [0, 0, 0]
			// 		}


			// 		this.db.AddProfile(obj2).then((doc: any) => {
			// 			//console.log("加入profile1");
			// 			let vm = this;
			// 			setTimeout(() => {
			// 				vm.keyDataSetIn();
			// 			}, 5000);

			// 		})
			// 	} else {
			// 		let vm = this;
			// 		setTimeout(() => {
			// 			vm.keyDataSetIn();
			// 		}, 5000);


			// 	}
			// }
			// // this.startAllsetting();
		})
		// if (this.names[0] !== "游戏模式") { //避免順序不對，游戏模式一定要是第一個
		// 	this.names.reverse()
		// }
	}


	seeprofile() {
		//找出所有的profile
		//比對後the.names更新
		this.db.getAllProfile().then((doc: any) => {
			//console.log('seeallprofile')
			// if (doc.id == (i + 1)) {
			// 	this.names[i] = doc.ProfileName
			// 
			console.log('profile doc', doc);
			for (let i = 0; i < doc.length; i++) { //找profile
				//console.log(doc[i]);
				// //console.log('allprofileName:' + doc[i].ProfileName + '//id:' + doc[i].id + '//keyFunctionArr:')
				//啟動時排序
				// for (let index = 1; index < doc.length; index++) {
				// 	if (doc[i].id == index) {
				// 		this.names[i] = doc[i].ProfileName;
				// 	}

				// }
				console.log("doc0000 Name", doc[i].ProfileName)
				if (doc[i] == '游戏模式') {
					continue;

				} else {
					if (this.names.indexOf(doc[i].ProfileName) == -1) {
						console.log("names", this.names)
						console.log("doc1111 Name", doc[i].ProfileName)
						this.names.push(doc[i].ProfileName);
					}
				}
				if (i == doc.length - 1) {
					let position = this.names.indexOf('MacroList');
					this.names.splice(position, 1);
				}
				// //console.log(doc[i]);
				// this.names.length=0;
				//有新的item就加入
				// let first=this.names.indexOf('游戏模式');
				// if(first!==0){

				// 	this.names.splice(1, first, '游戏模式');

				// }else{
				// 	this.names.splice(1, 1, '游戏模式');
				// }

				// 	this.names.push(doc[i].ProfileName);//放入左下方的profile顯示
			}

			for (let index = 0; index < this.names.length; index++) {
				//console.log('測空1111')
				if (this.names[index] == undefined) {
					this.names.splice(index, 1);
				} else {
					let result = this.names.filter(function (element, index, arr) {
						return arr.indexOf(element) === index;
					});
					this.names = result;
				}
				// //console.log(this.names[index]);
			}
			// this.arrangeprofile();

			console.log('SEEPROILENAME:', this.names);

		})
	}




	TestUpdatePF() {
		let obj = {
			"ProfileName": "profile 1",
			"Key": {
				"winstatus": "",
				"capsstatus": "",
				"keyFunctionArr": [],
				"marcroContent": [],
				"Path": [],
				"keyCopy": [],
				"options": {
					"OPshelf01": [],
					"OPshelf02": []
				}
			},
			"shelf01": [],
			"shelf02": [],
			"shelfblock01": [],
			"shelfblock02": [],
			"KeyDataValue": "updateSuccess",
			"Light": {
				"LightEffect": "",
				"LightSetting": {
					"LSbrightness": [],
					"LSspeed": [],
					"LSdirection": [],
					"changeMode": [],
					"changeTime": [],
					"changeStatus": [],
					"changeEffect": [],
				},
				"Mode": [],
				"ColorMode": [],
				"Speed": [],
				"Color": [],
				"Time": "",
				"Into": ""
			},
			"AttLight": {
				"effect": "",
				"time": ""
			},
			"GameMode": [0, 0, 0]
		}

		this.db.UpdateProfile(2, obj).then((doc: any) => {
			//console.log('UpdateProfile');
		})

		this.db.getProfile(obj).then((born: any) => {
			//console.log('result:');
			//console.log(born);
		})
	}

	openApp() {
		let options = null;
		if (env.isWindows) {
			options = { filters: [{ name: "App", extensions: ['exe'] }], properties: ['openFile'] }
		} else {
			options = { defaultPath: "/Applications", filters: [{ name: "App", extensions: ["app"] }] };
		}
		dialog.showOpenDialog(win, options, (fns) => {
			let appPath = fns[0];
			//console.log('000:' + appPath);
			// document.getElementById("textfield").focus();
			this.Path = appPath;

			// let obj1 = {
			//     Type: funcVar.FuncType.Device,
			//     Func: funcVar.FuncName.RunApplication,
			//     Param: appPath

			// }
			// this.protocol.RunSetFunction(obj1).then((data) => {
			// })
		});

	}

	SaveFile() {
		dialog.showSaveDialog(null, { defaultPath: this.profileName, filters: [{ name: 'Json File', extensions: ['json'] }] }, (fns) => {
			if (fns != undefined) {
				//console.log('11111:' + fns);

				// let data = {"VID":"0x0458","PID":"0x6005","DeviceName":"K10","DeviceType":"0x01","status":"0","_id":"yCXd2ZJ4bWesrIGK"}


				let obj01 = {
					"ProfileName": this.profileName
				}
				this.db.getProfile(obj01).then((doc: any) => {
					//console.log('匯出的profile：');
					//console.log(doc[0]);
					let data = doc[0];

					let obj = {
						Path: fns,
						Data: data
					}

					let obj2 = {
						Type: funcVar.FuncType.System,
						Func: funcVar.FuncName.ExportProfile,
						Param: obj
					}
					this.protocol.RunSetFunction(obj2).then((data) => {
					});
				});
			}

		})
	}

	ConnectApp() {
		//console.log('路徑:' + this.Path);
		//console.log('id:' + (Number(this.profileindex) + 1));
		//console.log('ProfileName:' + this.profileName);

		let obj = {
			'ProfileName': this.profileName
		}
		this.db.getProfile(obj).then((doc: any) => {
			//console.log('對應的profile：');
			//console.log(doc[0]);
			// //console.log(doc[0].Key.marcroContent[8]);

		})



		//this.profileindex
		//
	}


	onClick(w) {
		//文字部分
		for (var i = 0; i < this.loopNum.length; i++) {
			var a = this.loopNum[w];
			document.getElementById(this.loopNum[i]).style.color = "";
			document.getElementById(this.loopNum[i]).style.backgroundColor = "";
			document.getElementById(this.loopNum[i]).style.border = "";
			if (i === w) {
				document.getElementById(a).style.color = "white";
				document.getElementById(a).style.backgroundColor = "rgba(233,0,76,0.5)";
				document.getElementById(a).style.border = "1px solid #E7004C";
			}
			if (w === 0) {
				this.lanset = true;
				this.setting = false;
				this.logov = false;
			}
			if (w === 1) {
				this.lanset = false;
				this.setting = true;
				this.logov = false;
			}
			if (w === 2) {
				this.lanset = false;
				this.setting = false;
				this.logov = true;
			}
		}



	};


	pick01() {
		this.FnF12 = true;
		this.css01 = "white";
		this.css02 = "";
		this.css03 = "";
		this.css04 = "";

		this.getGame = "setTime"
		setTimeout(() => {
			this.getGame = ""
		}, 100);
		// this.LightcompoRemind = 'setintoDB';

		this.pageChange(1);
	};
	pick02() {
		this.FnF12 = true;
		this.css01 = "";
		this.css02 = "white";
		this.css03 = "";
		this.css04 = "";

		this.getGame = "setTime"
		setTimeout(() => {
			this.getGame = ""
		}, 100);
		// this.LightcompoRemind = 'updatenow';
		// setTimeout(() => {
		// 	this.LightcompoRemind = '';
		// }, 200);

		this.pageChange(2);
	};
	pick03() {
		this.FnF12 = true;
		this.css01 = "";
		this.css02 = "";
		this.css03 = "white";
		this.css04 = "";

		this.getGame = "setTime"
		setTimeout(() => {
			this.getGame = ""
		}, 100);
		// this.LightcompoRemind = 'setintoDB';

		this.pageChange(3);
	};

	pick04() {

		this.FnF12 = false;
		this.changeProfile = '2';
		// //console.log('get 213');
		this.callName(0);

		this.css01 = "";
		this.css02 = "";
		this.css03 = "";
		this.css04 = "white";

		this.getGame = "setTime"
		setTimeout(() => {
			this.getGame = ""
		}, 100);
		// this.LightcompoRemind = 'setintoDB';

		setTimeout(() => {
			this.pageChange(4);
		}, 20);
	};

	callSelfdf() {
		this.selfdf = 'block';
		this.onClick(0);

	};

	colseSelfdf() {
		this.selfdf = 'none';

	};


	//選頁

	self: boolean = true;
	lt: boolean;
	game: boolean = false;
	att: boolean = true;
	social: boolean = false;
	ltcss: any;





	pageChange(w) {
		console.log('pageChange')
		//第一次執行選頁時啟動燈效
		// //console.log(this.begin);
		// if (this.begin == 1) {
		// 	this.seerainbow = true;
		// 	this.begin++;
		// }

		this.self = false;
		// this.lt = false;
		this.game = false;
		this.att = true;
		this.social = false;

		this.attshow = "attshowchange";


		if (w == 1) {
			this.self = true;
			// this.show = "show";
			document.getElementById('show').style.top = '300px';

			this.getGame = ''
			setTimeout(() => {
				this.getGame = 'closeclrpicker';
				// document.getElementById('clrpicker').style.display='none';
			}, 20)
			// document.getElementById('show').style.display='hidden';
		}
		if (w == 2) {
			// this.lt = true;
			// this.self = true;
			document.getElementById('show').style.top = '0px';
			document.getElementById('show').style.visibility = 'visible';
		}
		if (w == 3) {
			this.att = true;
			this.attshow = "";
			// this.show = "show";
			document.getElementById('show').style.top = '300px';
			this.getGame = ''
			setTimeout(() => {
				this.getGame = 'closeclrpicker';
				// document.getElementById('clrpicker').style.display='none';
			}, 20)
		}
		if (w == 4) {
			this.game = true;
			// this.show = "show";
			document.getElementById('show').style.top = '300px';
			this.getGame = ''
			setTimeout(() => {
				this.getGame = 'closeclrpicker';
				// document.getElementById('clrpicker').style.display='none';
			}, 20)

		}
	}

	title01: any = "white"
	title02: any = ""
	ubtn01: boolean = true;
	ubtn02: boolean = true;
	define: boolean = true;
	title: boolean = true;

	settings() {

		this.show = "show";
		this.social = false
		this.define = true;
		this.self = true;
		this.ubtn01 = true;
		this.ubtn02 = true;
		this.title = true
		this.game = false;
		this.att = true;
		this.title02 = ""
		this.title01 = "white"
		this.pick01();
		document.getElementById('show').style.visibility = 'visible';
	}
	socials() {
		this.FnF12 = true;
		this.show = "show";
		this.social = true;
		this.ubtn01 = false;
		this.ubtn02 = false;
		this.define = false;
		this.self = false;
		this.title = false;
		this.game = false;
		this.att = false;
		this.title02 = "white"
		this.title01 = ""
		document.getElementById('show').style.visibility = 'hidden';
	}

	// wantStop(){ 
	//     //console.log('wantStop');
	//     for(var i = 0; i < this.firstarr.length; i++){ 
	//         document.getElementById(this.firstarr[i]).className = " "; 
	//         document.getElementById(this.firstarr2[i]).className = " "; 
	// }
	// }
	frtp: boolean = true;

	cancelftng: boolean = false;
	ftltbox: boolean = false;
	etitle: string = "流光";
	fnbtn: boolean = false;

	in: any = false;
	see: any = false;

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

	// //點開效果視窗關閉
	CloseFtltbox() {
		this.fnbtn = false;
		this.ftltbox = false;
	}

	changeIn() {
		this.in = !this.in;
	}


	Lighteffect(w) {
		if (w == 0) {
			console.log('觸發流光');
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
		if (w == 16) {
			this.etitle = "关闭所有灯光（省电模式）";
			this.seenone = true;

		}

		let obj1 = {
			"ProfileName": this.profileName
		}
		this.db.getProfile(obj1).then((doc: any) => {
			if (w == 0) {
				console.log('lightEffect', doc[0].Light.LightSetting.changeEffect[w], doc[0].Light.LightSetting.changeStatus[w])
				// this.etitle = "流光";
				// this.seerainbow = true;
				this.check01 = false;
				this.selectOPT = false;
				this.ttitle = this.titleArray[doc[0].Light.LightSetting.changeEffect[w]];
				this.timeEffect = doc[0].Light.LightSetting.changeEffect[w]
				setTimeout(() => {
					console.log('in timecheck111')
					this.timeCheck(this.check01);
				}, 100);
			}
			if (w == 1) {
				// this.etitle = "呼吸";
				// this.seebreath = true;
				this.check01 = false;
				this.selectOPT = false;
				this.ttitle = this.titleArray[doc[0].Light.LightSetting.changeEffect[w]];
				this.timeEffect = doc[0].Light.LightSetting.changeEffect[w]
				// setTimeout(() => {
				// 	this.timeCheck(this.check01);
				// }, 100);
			}
			if (w == 2) {
				// this.etitle = "光谱";
				// this.seelighten = true;
				this.check01 = false;
				this.selectOPT = false;
				this.ttitle = this.titleArray[doc[0].Light.LightSetting.changeEffect[w]];
				this.timeEffect = doc[0].Light.LightSetting.changeEffect[w]
				// setTimeout(() => {
				// 	this.timeCheck(this.check01);
				// }, 100);
			}
			if (w == 3) {
				// this.etitle = "撞击";
				// this.seecrash = true;
				this.check01 = false;
				this.selectOPT = false;
				this.ttitle = this.titleArray[doc[0].Light.LightSetting.changeEffect[w]];
				this.timeEffect = doc[0].Light.LightSetting.changeEffect[w]
				// setTimeout(() => {
				// 	this.timeCheck(this.check01);
				// }, 100);
			}
			if (w == 4) {
				// this.etitle = "繁星";
				// this.seestarlight = true;
				this.check01 = false;
				this.selectOPT = false;
				this.ttitle = this.titleArray[doc[0].Light.LightSetting.changeEffect[w]];
				this.timeEffect = doc[0].Light.LightSetting.changeEffect[w]
				// setTimeout(() => {
				// 	this.timeCheck(this.check01);
				// }, 100);
			}
			if (w == 5) {
				// this.etitle = "龙腾";
				// this.seedragon = true;
				this.check01 = false;
				this.selectOPT = false;
				this.ttitle = this.titleArray[doc[0].Light.LightSetting.changeEffect[w]];
				this.timeEffect = doc[0].Light.LightSetting.changeEffect[w]
				// setTimeout(() => {
				// 	this.timeCheck(this.check01);
				// }, 100);
			}
			if (w == 6) {
				// this.etitle = "邂逅";
				// this.seemeeting = true;
				this.check01 = false;
				this.selectOPT = false;
				this.ttitle = this.titleArray[doc[0].Light.LightSetting.changeEffect[w]];
				this.timeEffect = doc[0].Light.LightSetting.changeEffect[w]
				// setTimeout(() => {
				// 	this.timeCheck(this.check01);
				// }, 100);
			}
			if (w == 7) {
				// this.etitle = "光雨";
				// this.seelightrain = true;
				this.check01 = false;
				this.selectOPT = false;
				this.ttitle = this.titleArray[doc[0].Light.LightSetting.changeEffect[w]];
				this.timeEffect = doc[0].Light.LightSetting.changeEffect[w]
				// setTimeout(() => {
				// 	this.timeCheck(this.check01);
				// }, 100);
			}
			if (w == 8) {
				// this.etitle = "脉冲";
				// this.seeboom = true;
				this.check01 = false;
				this.selectOPT = false;
				this.ttitle = this.titleArray[doc[0].Light.LightSetting.changeEffect[w]];
				this.timeEffect = doc[0].Light.LightSetting.changeEffect[w]
				// setTimeout(() => {
				// 	this.timeCheck(this.check01);
				// }, 100);
			}
			if (w == 9) {
				// this.etitle = "纵横";
				// this.seecross = true;
				this.check01 = false;
				this.selectOPT = false;
				this.ttitle = this.titleArray[doc[0].Light.LightSetting.changeEffect[w]];
				this.timeEffect = doc[0].Light.LightSetting.changeEffect[w]
				// setTimeout(() => {
				// 	this.timeCheck(this.check01);
				// }, 100);
			}
			if (w == 10) {
				// this.etitle = "飘痕";
				// this.seefloat = true;
				this.check01 = false;
				this.selectOPT = false;
				this.ttitle = this.titleArray[doc[0].Light.LightSetting.changeEffect[w]];
				this.timeEffect = doc[0].Light.LightSetting.changeEffect[w]
				// setTimeout(() => {
				// 	this.timeCheck(this.check01);
				// }, 100);
			}
			if (w == 11) {
				// this.etitle = "涟漪";
				// this.seewaves = true;
				this.check01 = false;
				this.selectOPT = false;
				this.ttitle = this.titleArray[doc[0].Light.LightSetting.changeEffect[w]];
				this.timeEffect = doc[0].Light.LightSetting.changeEffect[w]
				// setTimeout(() => {
				// 	this.timeCheck(this.check01);
				// }, 100);
			}
			if (w == 12) {
				// this.etitle = "绽放";
				// this.seeround = true;
				this.check01 = false;
				this.selectOPT = false;
				this.ttitle = this.titleArray[doc[0].Light.LightSetting.changeEffect[w]];
				this.timeEffect = doc[0].Light.LightSetting.changeEffect[w]
				// setTimeout(() => {
				// 	this.timeCheck(this.check01);
				// }, 100);
			}
			if (w == 13) {
				// this.etitle = "游戏模式";
				// this.seegameeffect = true;
				this.check01 = false;
				this.selectOPT = false;
				this.ttitle = this.titleArray[doc[0].Light.LightSetting.changeEffect[w]];
				this.timeEffect = doc[0].Light.LightSetting.changeEffect[w]
				// setTimeout(() => {
				// 	this.timeCheck(this.check01);
				// }, 100);
			}
			if (w == 14) {
				// this.etitle = "纯色";
				// this.seepure = true;
				this.check01 = false;
				this.selectOPT = false;
				this.ttitle = this.titleArray[doc[0].Light.LightSetting.changeEffect[w]];
				this.timeEffect = doc[0].Light.LightSetting.changeEffect[w]
				// setTimeout(() => {
				// 	this.timeCheck(this.check01);
				// }, 100);
			}
			if (w == 15) {
				// this.etitle = "Blasoul";
				// this.seeblasoul = true;
				this.check01 = false;
				this.selectOPT = false;
				this.ttitle = this.titleArray[doc[0].Light.LightSetting.changeEffect[w]];
				this.timeEffect = doc[0].Light.LightSetting.changeEffect[w]
				// setTimeout(() => {
				// 	this.timeCheck(this.check01);
				// }, 100);
			}
			if (w == 16) {
				// this.etitle = "关闭所有灯光（省电模式）";
				// this.seenone = true;
				this.check01 = false;
				this.selectOPT = false;
				this.ttitle = this.titleArray[doc[0].Light.LightSetting.changeEffect[w]];
				this.timeEffect = doc[0].Light.LightSetting.changeEffect[w]
				// setTimeout(() => {
				// 	this.timeCheck(this.check01);
				// }, 100);
			}
		})
	}

	frtpStatus: any;

	frtpClose(w) {

		this.seeblasoul = false;
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
		this.seenone = false;

		document.getElementById('ftltbox').style.display = "none";
		document.getElementById('rbway').style.display = "none";
		document.getElementById('crashway').style.display = "none";
		document.getElementById('colorbar').style.display = "none";
		document.getElementById('blasoul').style.display = "none";
		document.getElementById('defaultset').style.display = "none";

		if (w == 0) {
			this.etitle = "流光";
			this.seerainbow = true;
			this.timebox = false;
			// this.check01 = doc[0].Light.LightSetting.changeStatus[w];
			// this.selectOPT = doc[0].Light.LightSetting.changeStatus[w];
			// this.ttitle = this.titleArray[doc[0].Light.LightSetting.changeEffect[w]];
		}
		if (w == 1) {
			this.etitle = "呼吸";
			this.seebreath = true;
			this.timebox = false;
			// this.check01 = doc[0].Light.LightSetting.changeStatus[w];
			// this.selectOPT = doc[0].Light.LightSetting.changeStatus[w];
			// this.ttitle = this.titleArray[doc[0].Light.LightSetting.changeEffect[w]];
		}
		if (w == 2) {
			this.etitle = "光谱";
			this.seelighten = true;
			this.timebox = false;
			// this.check01 = doc[0].Light.LightSetting.changeStatus[w];
			// this.selectOPT = doc[0].Light.LightSetting.changeStatus[w];
			// this.ttitle = this.titleArray[doc[0].Light.LightSetting.changeEffect[w]];
		}
		if (w == 3) {
			this.etitle = "撞击";
			this.seecrash = true;
			this.timebox = false;
			// this.check01 = doc[0].Light.LightSetting.changeStatus[w];
			// this.selectOPT = doc[0].Light.LightSetting.changeStatus[w];
			// this.ttitle = this.titleArray[doc[0].Light.LightSetting.changeEffect[w]];
		}
		if (w == 4) {
			this.etitle = "繁星";
			this.seestarlight = true;
			this.timebox = false;
			// this.check01 = doc[0].Light.LightSetting.changeStatus[w];
			// this.selectOPT = doc[0].Light.LightSetting.changeStatus[w];
			// this.ttitle = this.titleArray[doc[0].Light.LightSetting.changeEffect[w]];
		}
		if (w == 5) {
			this.etitle = "龙腾";
			this.seedragon = true;
			this.timebox = false;
			// this.check01 = doc[0].Light.LightSetting.changeStatus[w];
			// this.selectOPT = doc[0].Light.LightSetting.changeStatus[w];
			// this.ttitle = this.titleArray[doc[0].Light.LightSetting.changeEffect[w]];
		}
		if (w == 6) {
			this.etitle = "邂逅";
			this.seemeeting = true;
			this.timebox = false;
			// this.check01 = doc[0].Light.LightSetting.changeStatus[w];
			// this.selectOPT = doc[0].Light.LightSetting.changeStatus[w];
			// this.ttitle = this.titleArray[doc[0].Light.LightSetting.changeEffect[w]];
		}
		if (w == 7) {
			this.etitle = "光雨";
			this.seelightrain = true
			this.timebox = false;
			// this.check01 = doc[0].Light.LightSetting.changeStatus[w];
			// this.selectOPT = doc[0].Light.LightSetting.changeStatus[w];
			// this.ttitle = this.titleArray[doc[0].Light.LightSetting.changeEffect[w]];
		}
		if (w == 8) {
			this.etitle = "脉冲";
			this.seeboom = true;
			this.timebox = false;
			// this.check01 = doc[0].Light.LightSetting.changeStatus[w];
			// this.selectOPT = doc[0].Light.LightSetting.changeStatus[w];
			// this.ttitle = this.titleArray[doc[0].Light.LightSetting.changeEffect[w]];
		}
		if (w == 9) {
			this.etitle = "纵横";
			this.seecross = true;
			this.timebox = false;
			// this.check01 = doc[0].Light.LightSetting.changeStatus[w];
			// this.selectOPT = doc[0].Light.LightSetting.changeStatus[w];
			// this.ttitle = this.titleArray[doc[0].Light.LightSetting.changeEffect[w]];
		}
		if (w == 10) {
			this.etitle = "飘痕";
			this.seefloat = true;
			this.timebox = false;
			// this.check01 = doc[0].Light.LightSetting.changeStatus[w];
			// this.selectOPT = doc[0].Light.LightSetting.changeStatus[w];
			// this.ttitle = this.titleArray[doc[0].Light.LightSetting.changeEffect[w]];
		}
		if (w == 11) {
			this.etitle = "涟漪";
			this.seewaves = true;
			this.timebox = false;
			// this.check01 = doc[0].Light.LightSetting.changeStatus[w];
			// this.selectOPT = doc[0].Light.LightSetting.changeStatus[w];
			// this.ttitle = this.titleArray[doc[0].Light.LightSetting.changeEffect[w]];
		}
		if (w == 12) {
			this.etitle = "绽放";
			this.seeround = true;
			this.timebox = false;
			// this.check01 = doc[0].Light.LightSetting.changeStatus[w];
			// this.selectOPT = doc[0].Light.LightSetting.changeStatus[w];
			// this.ttitle = this.titleArray[doc[0].Light.LightSetting.changeEffect[w]];
		}
		if (w == 13) {
			this.etitle = "游戏模式";
			this.seegameeffect = true;
			this.timebox = false;
			// this.check01 = doc[0].Light.LightSetting.changeStatus[w];
			// this.selectOPT = doc[0].Light.LightSetting.changeStatus[w];
			// this.ttitle = this.titleArray[doc[0].Light.LightSetting.changeEffect[w]];
		}
		if (w == 14) {
			this.etitle = "纯色";
			this.seepure = true;
			this.timebox = false;
			// this.check01 = doc[0].Light.LightSetting.changeStatus[w];
			// this.selectOPT = doc[0].Light.LightSetting.changeStatus[w];
			// this.ttitle = this.titleArray[doc[0].Light.LightSetting.changeEffect[w]];
		}
		if (w == 15) {
			this.etitle = "Blasoul";
			this.seeblasoul = true;
			this.timebox = false;
			// this.check01 = doc[0].Light.LightSetting.changeStatus[w];
			// this.selectOPT = doc[0].Light.LightSetting.changeStatus[w];
			// this.ttitle = this.titleArray[doc[0].Light.LightSetting.changeEffect[w]];
		}
		if (w == 16) {
			this.etitle = "关闭所有灯光（省电模式）";
			this.seenone = true;
			this.timebox = false;
			// this.check01 = doc[0].Light.LightSetting.changeStatus[w];
			// this.selectOPT = doc[0].Light.LightSetting.changeStatus[w];
			// this.ttitle = this.titleArray[doc[0].Light.LightSetting.changeEffect[w]];
		}
		let obj1 = {
			"ProfileName": this.profileName
		}
		this.db.getProfile(obj1).then((doc: any) => {

			if (w == 0) {
				// this.etitle = "流光";
				// this.seerainbow = true;
				// this.timebox = false;
				this.check01 = false;
				this.selectOPT = false;
				this.ttitle = this.titleArray[doc[0].Light.LightSetting.changeEffect[w]];
				this.timeEffect = doc[0].Light.LightSetting.changeEffect[w]
				// setTimeout(() => {
				// 	this.timeCheck(this.doubleCheck);
				// }, 100);

			}
			if (w == 1) {
				// this.etitle = "呼吸";
				// this.seebreath = true;
				// this.timebox = false;
				this.check01 = false;
				this.selectOPT = false;
				this.ttitle = this.titleArray[doc[0].Light.LightSetting.changeEffect[w]];
				this.timeEffect = doc[0].Light.LightSetting.changeEffect[w]
				// setTimeout(() => {
				// 	this.timeCheck(this.doubleCheck);
				// }, 100);
			}
			if (w == 2) {
				// this.etitle = "光谱";
				// this.seelighten = true;
				// this.timebox = false;
				this.check01 = false;
				this.selectOPT = false;
				this.ttitle = this.titleArray[doc[0].Light.LightSetting.changeEffect[w]];
				this.timeEffect = doc[0].Light.LightSetting.changeEffect[w]
				// setTimeout(() => {
				// 	this.timeCheck(this.doubleCheck);
				// }, 100);
			}
			if (w == 3) {
				// this.etitle = "撞击";
				// this.seecrash = true;
				// this.timebox = false;
				this.check01 = false;
				this.selectOPT = false;
				this.ttitle = this.titleArray[doc[0].Light.LightSetting.changeEffect[w]];
				this.timeEffect = doc[0].Light.LightSetting.changeEffect[w]
				// setTimeout(() => {
				// 	this.timeCheck(this.doubleCheck);
				// }, 100);
			}
			if (w == 4) {
				// this.etitle = "繁星";
				// this.seestarlight = true;
				// this.timebox = false;
				this.check01 = false;
				this.selectOPT = false;
				this.ttitle = this.titleArray[doc[0].Light.LightSetting.changeEffect[w]];
				this.timeEffect = doc[0].Light.LightSetting.changeEffect[w]
				// setTimeout(() => {
				// 	this.timeCheck(this.doubleCheck);
				// }, 100);
			}
			if (w == 5) {
				// this.etitle = "龙腾";
				// this.seedragon = true;
				// this.timebox = false;
				this.check01 = false;
				this.selectOPT = false;
				this.ttitle = this.titleArray[doc[0].Light.LightSetting.changeEffect[w]];
				this.timeEffect = doc[0].Light.LightSetting.changeEffect[w]
				// setTimeout(() => {
				// 	this.timeCheck(this.doubleCheck);
				// }, 100);
			}
			if (w == 6) {
				// this.etitle = "邂逅";
				// this.seemeeting = true;
				// this.timebox = false;
				this.check01 = false;
				this.selectOPT = false;
				this.ttitle = this.titleArray[doc[0].Light.LightSetting.changeEffect[w]];
				this.timeEffect = doc[0].Light.LightSetting.changeEffect[w]
				// setTimeout(() => {
				// 	this.timeCheck(this.doubleCheck);
				// }, 100);
			}
			if (w == 7) {
				// this.etitle = "光雨";
				// this.seelightrain = true
				// this.timebox = false;
				this.check01 = false;
				this.selectOPT = false;
				this.ttitle = this.titleArray[doc[0].Light.LightSetting.changeEffect[w]];
				this.timeEffect = doc[0].Light.LightSetting.changeEffect[w]
				// setTimeout(() => {
				// 	this.timeCheck(this.doubleCheck);
				// }, 100);
			}
			if (w == 8) {
				// this.etitle = "脉冲";
				// this.seeboom = true;
				// this.timebox = false;
				this.check01 = false;
				this.selectOPT = false;
				this.ttitle = this.titleArray[doc[0].Light.LightSetting.changeEffect[w]];
				this.timeEffect = doc[0].Light.LightSetting.changeEffect[w]
				// setTimeout(() => {
				// 	this.timeCheck(this.doubleCheck);
				// }, 100);
			}
			if (w == 9) {
				// this.etitle = "纵横";
				// this.seecross = true;
				// this.timebox = false;
				this.check01 = false;
				this.selectOPT = false;
				this.ttitle = this.titleArray[doc[0].Light.LightSetting.changeEffect[w]];
				this.timeEffect = doc[0].Light.LightSetting.changeEffect[w]
				// setTimeout(() => {
				// 	this.timeCheck(this.doubleCheck);
				// }, 100);
			}
			if (w == 10) {
				// this.etitle = "飘痕";
				// this.seefloat = true;
				// this.timebox = false;
				this.check01 = false;
				this.selectOPT = false;
				this.ttitle = this.titleArray[doc[0].Light.LightSetting.changeEffect[w]];
				this.timeEffect = doc[0].Light.LightSetting.changeEffect[w]
				// setTimeout(() => {
				// 	this.timeCheck(this.doubleCheck);
				// }, 100);
			}
			if (w == 11) {
				// this.etitle = "涟漪";
				// this.seewaves = true;
				// this.timebox = false;
				this.check01 = false;
				this.selectOPT = false;
				this.ttitle = this.titleArray[doc[0].Light.LightSetting.changeEffect[w]];
				this.timeEffect = doc[0].Light.LightSetting.changeEffect[w]
				// setTimeout(() => {
				// 	this.timeCheck(this.doubleCheck);
				// }, 100);
			}
			if (w == 12) {
				// this.etitle = "绽放";
				// this.seeround = true;
				// this.timebox = false;
				this.check01 = false;
				this.selectOPT = false;
				this.ttitle = this.titleArray[doc[0].Light.LightSetting.changeEffect[w]];
				this.timeEffect = doc[0].Light.LightSetting.changeEffect[w]
				// setTimeout(() => {
				// 	this.timeCheck(this.doubleCheck);
				// }, 100);
			}
			if (w == 13) {
				// this.etitle = "游戏模式";
				// this.seegameeffect = true;
				// this.timebox = false;
				this.check01 = false;
				this.selectOPT = false;
				this.ttitle = this.titleArray[doc[0].Light.LightSetting.changeEffect[w]];
				this.timeEffect = doc[0].Light.LightSetting.changeEffect[w]
				// setTimeout(() => {
				// 	this.timeCheck(this.doubleCheck);
				// }, 100);
			}
			if (w == 14) {
				// this.etitle = "纯色";
				// this.seepure = true;
				// this.timebox = false;
				this.check01 = false;
				this.selectOPT = false;
				this.ttitle = this.titleArray[doc[0].Light.LightSetting.changeEffect[w]];
				this.timeEffect = doc[0].Light.LightSetting.changeEffect[w]
				// setTimeout(() => {
				// 	this.timeCheck(this.doubleCheck);
				// }, 100);
			}
			if (w == 15) {
				// this.etitle = "Blasoul";
				// this.seeblasoul = true;
				// this.timebox = false;
				this.check01 = false;
				this.selectOPT = false;
				this.ttitle = this.titleArray[doc[0].Light.LightSetting.changeEffect[w]];
				this.timeEffect = doc[0].Light.LightSetting.changeEffect[w]
				// setTimeout(() => {
				// 	this.timeCheck(this.doubleCheck);
				// }, 100);
			}
			if (w == 16) {
				// this.etitle = "关闭所有灯光（省电模式）";
				// this.seenone = true;
				// this.timebox = false;
				this.check01 = false;
				this.selectOPT = false;
				this.ttitle = this.titleArray[doc[0].Light.LightSetting.changeEffect[w]];
				this.timeEffect = doc[0].Light.LightSetting.changeEffect[w]
				// setTimeout(() => {
				// 	this.timeCheck(this.doubleCheck);
				// }, 100);
			}
		})
	}
	check01: boolean = false;

	cancelt: boolean = false;
	stime: boolean = false;
	timebox: boolean = false;
	ttitle: any = "请选擇效果";
	titleArray: any = ["流光", "呼吸", "光谱", "撞击", "繁星", "龙腾", "邂逅", "光雨", "脉冲", "纵横", "飘痕", "涟漪", "绽放", "游戏模式", "纯色", "Blasoul", "关闭所有灯光（省电模式）"];
	selectOPT: boolean = false;



	clickOnitem() {
		this.check01 = !this.check01;
		this.selectOPT = !this.selectOPT;
	}

	canceltime() {
		this.cancelt = false;
		this.stime = !this.stime;
		this.timebox = !this.timebox;
	}
	openTs() {
		this.cancelt = true;
		this.stime = !this.stime;
		this.timebox = !this.timebox;
	}
	closeTs() {
		this.stime = false;
		this.timebox = false;
	}

	timeCount: any;

	sendT(e) {
		this.timeCount = e
	}
	ttitleDB: any;
	checkDB: any;
	selectDB: any;
	doubleCheck: any;
	clearCheck: any;
	check02: any;

	timeCheck(e) {
		this.doubleCheck = e
		if (this.doubleCheck == true) {
			// clearTimeout(this.clearCheck);
			this.check01 = true;
			this.selectOPT = true;
			this.timeClose01(this.timeEffect);
		}
		else if (this.doubleCheck == false) {
			clearTimeout(this.stopTimeClose);
			// this.selectOPT = false;
		}
	}

	stopTimeClose: any;
	timeEffect: any;

	timeClose(w) {
		if (w == 0) {
			this.timeEffect = w;
			// this.timebox = false;
			this.ttitle = "流光";
		}
		if (w == 1) {
			this.timeEffect = w;
			// this.timebox = false;
			this.ttitle = "呼吸";
		}
		if (w == 2) {
			this.timeEffect = w;
			// this.timebox = false;
			this.ttitle = "光谱";
		}
		if (w == 3) {
			this.timeEffect = w;
			// this.timebox = false;
			this.ttitle = "撞击";
		}
		if (w == 4) {
			this.timeEffect = w;
			// this.timebox = false;
			this.ttitle = "繁星";
		}
		if (w == 5) {
			this.timeEffect = w;
			// this.timebox = false;
			this.ttitle = "龙腾";
		}
		if (w == 6) {
			this.timeEffect = w;
			// this.timebox = false;
			this.ttitle = "邂逅";
		}
		if (w == 7) {
			this.timeEffect = w;
			// this.timebox = false;
			this.ttitle = "光雨";
		}
		if (w == 8) {
			this.timeEffect = w;
			// this.timebox = false;
			this.ttitle = "脉冲";
		}
		if (w == 9) {
			this.timeEffect = w;
			// this.timebox = false;
			this.ttitle = "纵横";
		}
		if (w == 10) {
			this.timeEffect = w;
			// this.timebox = false;
			this.ttitle = "飘痕";
		}
		if (w == 11) {
			this.timeEffect = w;
			// this.timebox = false;
			this.ttitle = "涟漪";
		}
		if (w == 12) {
			this.timeEffect = w;
			// this.timebox = false;
			this.ttitle = "绽放";
		}
		if (w == 13) {
			this.timeEffect = w;
			// this.timebox = false;
			this.ttitle = "游戏模式";
		}
		if (w == 14) {
			this.timeEffect = w;
			// this.timebox = false;
			this.ttitle = "纯色";
		}
		if (w == 15) {
			this.timeEffect = w;
			// this.timebox = false;
			this.ttitle = "Blasoul";

		}
		if (w == 16) {
			this.timeEffect = w;
			// this.timebox = false;
			this.ttitle = "关闭所有灯光（省电模式）";
		}
		setTimeout(() => {
			document.getElementById('timebox').style.display = "none";
		}, 100);
	}

	timeClose01(w) {
		// console.log("in timeClose111", w, this.timeCount);
		// this.timebox = !this.timebox;
		// document.getElementById('timebox').style.display = "none";

		clearTimeout(this.stopTimeClose);
		if (this.check01 == true && this.timeCount > 0 && w >= 0) {
			console.log('in timeClose')
			// this.timeCount = doc[0].Light.LightSetting.changeTime[this.fromLightEffect]
			this.stopTimeClose = setTimeout(() => {
				let obj1 = {
					"ProfileName": this.profileName
				}
				this.db.getProfile(obj1).then((doc: any) => {
					this.doubleCheck = false;

					this.seeblasoul = false;
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
					this.seenone = false;

					// document.getElementById('rbway').style.display = "none";
					// document.getElementById('crashway').style.display = "none";
					// document.getElementById('colorbar').style.display = "none";
					// document.getElementById('blasoul').style.display = "none";
					// document.getElementById('defaultset').style.display = "none";


					if (w == 0) {
						this.etitle = "流光";
						this.seerainbow = true;
						this.ttitle = doc[0].Light.LightSetting.changeMode[doc[0].Light.LightSetting.changeEffect[w]];
						this.check01 = false;
						this.selectOPT = false;
						this.timebox = false;
						this.ttitle = "请选擇效果"
					}
					if (w == 1) {
						this.etitle = "呼吸";
						this.seebreath = true;
						this.ttitle = doc[0].Light.LightSetting.changeMode[doc[0].Light.LightSetting.changeEffect[w]];
						this.check01 = false;
						this.selectOPT = false;
						this.timebox = false;
						this.ttitle = "请选擇效果"
					}
					if (w == 2) {
						this.etitle = "光谱";
						this.seelighten = true;
						this.ttitle = doc[0].Light.LightSetting.changeMode[doc[0].Light.LightSetting.changeEffect[w]];
						this.check01 = false;
						this.selectOPT = false;
						this.timebox = false;
						this.ttitle = "请选擇效果"
					}
					if (w == 3) {
						this.etitle = "撞击";
						this.seecrash = true;
						this.ttitle = doc[0].Light.LightSetting.changeMode[doc[0].Light.LightSetting.changeEffect[w]];
						this.check01 = false;
						this.selectOPT = false;
						this.timebox = false;
						this.ttitle = "请选擇效果"
					}
					if (w == 4) {
						this.etitle = "繁星";
						this.seestarlight = true;
						this.ttitle = doc[0].Light.LightSetting.changeMode[doc[0].Light.LightSetting.changeEffect[w]];
						this.check01 = false;
						this.selectOPT = false;
						this.timebox = false;
						this.ttitle = "请选擇效果"
					}
					if (w == 5) {
						this.etitle = "龙腾";
						this.seedragon = true;
						this.ttitle = doc[0].Light.LightSetting.changeMode[doc[0].Light.LightSetting.changeEffect[w]];
						this.check01 = false;
						this.selectOPT = false;
						this.timebox = false;
						this.ttitle = "请选擇效果"
					}
					if (w == 6) {
						this.etitle = "邂逅";
						this.seemeeting = true;
						this.ttitle = doc[0].Light.LightSetting.changeMode[doc[0].Light.LightSetting.changeEffect[w]];
						this.check01 = false;
						this.selectOPT = false;
						this.timebox = false;
						this.ttitle = "请选擇效果"
					}
					if (w == 7) {
						this.etitle = "光雨";
						this.seelightrain = true;
						this.ttitle = doc[0].Light.LightSetting.changeMode[doc[0].Light.LightSetting.changeEffect[w]];
						this.check01 = false;
						this.selectOPT = false;
						this.timebox = false;
						this.ttitle = "请选擇效果"
					}
					if (w == 8) {
						this.etitle = "脉冲";
						this.seeboom = true;
						this.ttitle = doc[0].Light.LightSetting.changeMode[doc[0].Light.LightSetting.changeEffect[w]];
						this.check01 = false;
						this.selectOPT = false;
						this.timebox = false;
						this.ttitle = "请选擇效果"
					}
					if (w == 9) {
						this.etitle = "纵横";
						this.seecross = true;
						this.ttitle = doc[0].Light.LightSetting.changeMode[doc[0].Light.LightSetting.changeEffect[w]];
						this.check01 = false;
						this.selectOPT = false;
						this.timebox = false;
						this.ttitle = "请选擇效果"
					}
					if (w == 10) {
						this.etitle = "飘痕";
						this.seefloat = true;
						this.ttitle = doc[0].Light.LightSetting.changeMode[doc[0].Light.LightSetting.changeEffect[w]];
						this.check01 = false;
						this.selectOPT = false;
						this.timebox = false;
						this.ttitle = "请选擇效果"
					}
					if (w == 11) {
						this.etitle = "涟漪";
						this.seewaves = true;
						this.ttitle = doc[0].Light.LightSetting.changeMode[doc[0].Light.LightSetting.changeEffect[w]];
						this.check01 = false;
						this.selectOPT = false;
						this.timebox = false;
						this.ttitle = "请选擇效果"
					}
					if (w == 12) {
						this.etitle = "绽放";
						this.seeround = true;
						this.ttitle = doc[0].Light.LightSetting.changeMode[doc[0].Light.LightSetting.changeEffect[w]];
						this.check01 = false;
						this.selectOPT = false;
						this.timebox = false;
						this.ttitle = "请选擇效果"
					}
					if (w == 13) {
						this.etitle = "游戏模式";
						this.seegameeffect = true;
						this.ttitle = doc[0].Light.LightSetting.changeMode[doc[0].Light.LightSetting.changeEffect[w]];
						this.check01 = false;
						this.selectOPT = false;
						this.timebox = false;
						this.ttitle = "请选擇效果"
					}
					if (w == 14) {
						this.etitle = "纯色";
						this.seepure = true;
						this.ttitle = doc[0].Light.LightSetting.changeMode[doc[0].Light.LightSetting.changeEffect[w]];
						this.check01 = false;
						this.selectOPT = false;
						this.timebox = false;
						this.ttitle = "请选擇效果"
					}
					if (w == 15) {
						this.etitle = "Blasoul";
						this.seeblasoul = true;
						this.ttitle = doc[0].Light.LightSetting.changeMode[doc[0].Light.LightSetting.changeEffect[w]];
						this.check01 = false;
						this.selectOPT = false;
						this.timebox = false;
						this.ttitle = "请选擇效果"
					}
					if (w == 16) {
						this.etitle = "关闭所有灯光（省电模式）";
						this.seenone = true;
						this.check01 = false;
						this.selectOPT = false;
						this.ttitle = "请选擇效果"
					}
				})
			}, this.timeCount * 60000);
			if (w == 0) {
				this.timeEffect = w;
				// this.timebox = false;
				this.ttitle = "流光";
			}
			if (w == 1) {
				this.timeEffect = w;
				// this.timebox = false;
				this.ttitle = "呼吸";
			}
			if (w == 2) {
				this.timeEffect = w;
				// this.timebox = false;
				this.ttitle = "光谱";
			}
			if (w == 3) {
				this.timeEffect = w;
				// this.timebox = false;
				this.ttitle = "撞击";
			}
			if (w == 4) {
				this.timeEffect = w;
				// this.timebox = false;
				this.ttitle = "繁星";
			}
			if (w == 5) {
				this.timeEffect = w;
				// this.timebox = false;
				this.ttitle = "龙腾";
			}
			if (w == 6) {
				this.timeEffect = w;
				// this.timebox = false;
				this.ttitle = "邂逅";
			}
			if (w == 7) {
				this.timeEffect = w;
				// this.timebox = false;
				this.ttitle = "光雨";
			}
			if (w == 8) {
				this.timeEffect = w;
				// this.timebox = false;
				this.ttitle = "脉冲";
			}
			if (w == 9) {
				this.timeEffect = w;
				// this.timebox = false;
				this.ttitle = "纵横";
			}
			if (w == 10) {
				this.timeEffect = w;
				// this.timebox = false;
				this.ttitle = "飘痕";
			}
			if (w == 11) {
				this.timeEffect = w;
				// this.timebox = false;
				this.ttitle = "涟漪";
			}
			if (w == 12) {
				this.timeEffect = w;
				// this.timebox = false;
				this.ttitle = "绽放";
			}
			if (w == 13) {
				this.timeEffect = w;
				// this.timebox = false;
				this.ttitle = "游戏模式";
			}
			if (w == 14) {
				this.timeEffect = w;
				// this.timebox = false;
				this.ttitle = "纯色";
			}
			if (w == 15) {
				this.timeEffect = w;
				// this.timebox = false;
				this.ttitle = "Blasoul";
			}
			if (w == 16) {
				this.timeEffect = w;
				// this.timebox = false;
				this.ttitle = "关闭所有灯光（省电模式）";
			}
		} else {
			return false;
		}
	}



	FtEdit() { //編輯
		//畫面
		this.profileclick = 1;
		if (this.profileindex !== 0) {  //遊戲模式不改 
			this.showinput = !this.showinput;
		}

		// this.editproname = this.showtextprofile //存為點取項目未改變前
		//點進來的時候
		let obj = {
			"ProfileName": this.profileName,
		}

		this.db.getProfile(obj).then((doc: any) => {
			if (this.showinput == true) {
				document.getElementById('EditprofileName').focus();
			}
			//console.log('ftedit');
			//console.log(doc[0]);
			// this.seeprofile();
		});




		// document.getElementById('ob').style.display="none";
		// document.getElementById('reverseob').style.display="none";
		// document.getElementById('EditprofileName').style.display="block";
	}

	FtAdd() {
		// //console.log('FtAdd')
		this.whenLoading(1);
		//console.log(this.names);
		let addWord = this.addDefaultName + this.count;

		for (let i = 0; i < this.names.length; i++) {
			if (this.names[i] == addWord) {
				//console.log('等同且' + this.count)
				this.count++;
			}
		}

		// //console.log('new profile:');
		//console.log(this.addDefaultName + this.count);
		this.names.push(this.addDefaultName + this.count);//先顯示在UI，實際profile寫入讀出要2秒;
		let obj = {
			"ProfileName": this.addDefaultName + this.count,
			"Key": {
				"winstatus": "",
				"capsstatus": "",
				"keyFunctionArr": [],
				"marcroContent": [],
				"marcroChoose": [],
				"Path": [],
				"keyCopy": [],
				"options": {
					"OPshelf01": [],
					"OPshelf02": []
				}
			},
			"shelf01": [],
			"shelf02": [],
			"shelfblock01": [],
			"shelfblock02": [],
			"KeyDataValue": [],
			"Light": {
				"LightEffect": "",
				"LightSetting": {
					"LSbrightness": [],
					"LSspeed": [],
					"LSdirection": [],
					"changeMode": [],
					"changeTime": [],
					"changeStatus": [],
					"changeEffect": [],
				},
				"Mode": [],
				"ColorMode": [],
				"Speed": [],
				"Color": [],
				"Time": "",
				"Into": ""
			},
			"AttLight": {
				"effect": "",
				"time": ""
			},
			"GameMode": ""
		}
		this.db.AddProfile(obj).then((doc: any) => {
			//console.log("add");
			setTimeout(() => {
				this.seeprofile();
				setTimeout(() => {
					this.callName(this.names.indexOf(this.addDefaultName + this.count));
					console.log('testname0000', this.names.indexOf(this.addDefaultName + this.count))
				}, 80);
			}, 50);
		})
	}


	testdelete() {

		this.db.DeleteProfile(3).then((doc: any) => {
			//console.log('delete sucess');
			this.db.getAllProfile().then((doc: any) => {
				//console.log('test11111DB');
				this.names.splice(this.profileindex, 1);
				//console.log(this.names);
				for (let index = 0; index < doc.length; index++) {
					//console.log(doc[index]);

				}
			})
		})
	}




	Ftdelete() {
		// this.names.splice(this.profileindex, 1);
		// // this.Openobbox=false;
		// if (this.profileindex == 0) {
		// 	this.names.splice(0, 0, this.addDefaultName + 1)
		// }
		if (this.FtdeleteSaveclick == 0) {
			this.FtdeleteSaveclick = 1;

			if (this.profileindex > 1) { //遊戲模式不可刪
				//console.log('d前');
				//console.log(this.profileindex);
				this.callName(this.profileindex - 1);
				//console.log('d後');
				//console.log(this.profileindex);
				// //console.log('當前的profile');
				// //console.log(this.profileindex);

				setTimeout(() => {
					//
					this.pick01();
					//console.log('要刪除的profilename');
					//console.log(this.names[this.profileindex + 1]);
					let obj = {
						"ProfileName": this.names[this.profileindex + 1]
					}
					this.db.getProfile(obj).then((doc: any) => {
						//console.log('要刪除的obj');
						//console.log(doc[0]);
						this.db.DeleteProfile(doc[0].id).then((doc: any) => {
							//console.log('delete sucess');
							// //console.log(doc[0]);
							this.names.splice(this.profileindex + 1, 1);//刪除選項欄的此選項
							this.FtdeleteSaveclick = 0;
						})
					})
					//
				}, 8000);

				//刪除db的this.profileindex项
				// let obj = {
				// 			"ProfileName": this.names[this.profileindex]
				// 		}
				// 		this.db.getProfile(obj).then((doc: any) => {
				// 			//console.log('db delete1111');
				// 			// for (let index = 0; index < doc.length; index++) {
				// 			// 	//console.log(doc[index].id);

				// 			// }
				// 			// //console.log(doc[0].id);
				// 			//
				// 			this.db.DeleteProfile(doc[0].id).then((doc: any) => {
				// 				//console.log('delete sucess');
				// 				// this.db.getAllProfile().then((doc: any) => {
				// 				// 	//console.log('test11111DB');

				// 				this.names.splice(this.profileindex, 1);
				// 				//console.log('names');
				// 				//console.log(this.names);
				// 				// for (let index = 0; index < doc.length; index++) {
				// 				// //console.log(doc[index]);
				// 				// this.FtdeleteSaveclick = 3;
				// 				//console.log('arr的序數');
				// 				//console.log(this.profileindex);
				// 				// this.callName(this.profileindex-1);


				// 				});
				// 			});



				// if (this.profileindex+1 !== 0) { //遊戲模式之外才執行

				// 	// // 	//ui
				// 	// this.names.splice(this.profileindex, 1);
				// 	// //console.log(this.names);
				// 	// //console.log(this.names[this.profileindex]);
				// 	//硬體
				// 	let obj = {
				// 		"ProfileName": this.names[this.profileindex+1]
				// 	}
				// 	this.db.getProfile(obj).then((doc: any) => {
				// 		//console.log('db delete1111');
				// 		// for (let index = 0; index < doc.length; index++) {
				// 		// 	//console.log(doc[index].id);

				// 		// }
				// 		// //console.log(doc[0].id);
				// 		//
				// 		this.db.DeleteProfile(doc[0].id).then((doc: any) => {
				// 			//console.log('delete sucess');
				// 			// this.db.getAllProfile().then((doc: any) => {
				// 			// 	//console.log('test11111DB');

				// 			this.names.splice(this.profileindex+1, 1);

				// 			//console.log(this.names);
				// 			// for (let index = 0; index < doc.length; index++) {
				// 			// //console.log(doc[index]);
				// 			this.FtdeleteSaveclick = 3;
				// 			//console.log('arr的序數');
				// 			//console.log(this.profileindex+1);
				// 			// this.callName(this.profileindex-1);
				// 			this.profileName = '請先選擇文件';

				// 			// }
				// 			// })
				// 		})


				// 		//


				// 	})
				// }
			} else {
				// alert('此文件不可刪除');
				this.textShow = "此文件不可删除";
				this.namesCheck = true;
				setTimeout(() => {
					this.namesCheck = false;
				}, 3000);
				this.FtdeleteSaveclick = 0;
			}
			// 		//
			// if (this.FtdeleteSaveclick == 3) {

			// 	this.newNameprofile = this.names[this.profileindex + 1];
			// 	if (this.newNameprofile == undefined) {
			// 		this.newNameprofile = this.names[0];
			// 	}
			// 	this.FtdeleteSaveclick = 2;
			// }


			// 		//
			// if (this.FtdeleteSaveclick == 2) {


			// 	let obj = {
			// 		"ProfileName": this.newNameprofile
			// 	}
			// 	// //console.log(obj);
			// 	this.db.getProfile(obj).then((doc: any) => {
			// 		// //console.log(doc[0]);

			// 		this.profileAllcontentSend = doc[0]; //送obj
			// 		this.LightcompoRemind = 'updatenow';
			// 			setTimeout(() => {

			// 				//console.log('sss2222');
			// 				//console.log(this.hdblock);
			// 				this.LightcompoRemind = '';
			// 				this.whenLoading(1);
			// 			}, 200);




			// 		if (this.profileAllcontentSend == undefined) { //避免profile還未寫入值，一直讀取到有值
			// 			this.callName(this.profileindex);
			// 			this.FtdeleteSaveclick = 0;
			// 		} else {
			// 			//console.log(' ft find profile')
			// 			this.keyDataSetIn();

			// 			this.outputProEvent.emit(this.profileAllcontentSend);
			// 			this.FtdeleteSaveclick = 0;
			// 			return false;
			// 		}
			// 	})

			// }
		}
	}
	///	




	openobbox() {
		this.Openobbox = !this.Openobbox;
		this.changeOb = !this.changeOb;
		this.seeprofile();
	}

	callName(index) {
		this.getGame = '';
		if (this.profileName !== this.names[index]) {
			this.gameindex = index;

			this.whenLoading(1);
			this.timebasicObj = this.names[index];
			// this.profileName = this.names[index];
			this.showtextprofile = this.names[index];
			this.FnF12profilename = this.profileName;
			this.callnameclick = true;
			// if (index == 0) {
			// 	this.changeProfile = '2';
			// }else{
			// 	this.changeProfile = '1';
			// }

			this.FnF12 = false;//不可用快捷鍵call遊戲模式
			//console.log('sss11111');
			// this.keeploading=1;

			this.Openobbox = false;
			this.changeOb = false;

			this.css01 = "white";
			this.css02 = "";
			this.css03 = "";
			this.css04 = "";
			this.pageChange(1);
			this.thefirstloading = false;
			this.LightcompoRemind = 'changeProfile';
			setTimeout(() => {

				//console.log('sss2222');
				//console.log(this.hdblock);
				this.LightcompoRemind = '';

				// this.whenLoading(1);
			}, 200);

			this.getGame = 'stopApmode';
			console.log('stopApmode');
			// this.whenLoading(1);
			setTimeout(() => {

				//console.log('sss3333');
				//console.log(this.hdblock);
				//

				this.seerainbow = false;
				this.seebreath = false;
				this.seelighten = false;
				this.seecrash = false;
				this.seestarlight = false;
				this.seedragon = false;
				this.seemeeting = false;
				this.seelightrain = false;
				this.seeboom = false;
				this.seecross = false;
				this.seefloat = false;
				this.seewaves = false;
				this.seeround = false;
				this.seegameeffect = false;
				this.seepure = false;
				this.seeblasoul = false;
				this.seenone = false;
				// this.clickefffectpage='hidden';
				//
				this.selfshow = false;
				//console.log('this.selfshow');
				//console.log(this.selfshow);
				// this.whenLoading(1);
				//



				//
				setTimeout(() => { //重啟self頁面
					//console.log('sss4444');

					//console.log('test1111');

					// this.thefirstloading = false;



					// this.seeprofile();




					//console.log('test2222');


					this.profileName = this.names[index];
					// this.seenone=false;

					// this.EffectTagAllFalse();
					this.givclr01 = this.clickon;
					this.givclr02 = {};
					this.Openobbox = false;
					this.changeOb = true;
					setTimeout(() => {
						this.keyDataSetIn();
					}, 150);

					// if(this.profileName!=='游戏模式'){
					// 	this.thebegingsetProfile = '1';
					// }
					this.profileindex = index;
					// this.timebasicObj = this.names[index];

					this.showinput = false;

					let vm = this;
					// setTimeout(() => {
					// 	//console.log('可按')

					// 	this.selfshow = false;
					// 	setTimeout(() => {
					// 		this.selfshow = true;
					// 		vm.FnF12 = true;//可用快捷鍵call遊戲模式
					// 	}, 200);
					// }, 5000);

					// this.keeploading=0;

				}, 100);
				//
			}, 6000);


		} else {
			this.Openobbox = false;
			this.changeOb = true;
			return false
		}
	}


	editProfile(value) { //改文字內容

		// //console.log('proname:'+this.profileName);
		// //console.log('proname:'+this.names[this.profileindex]);
		this.showtextprofile = value;


		// let id = (Number(this.profileindex) + 1);
		// //console.log('newid:' + id);
		// this.names[this.profileindex] = value;
		// let obj = {
		// 	'ProfileName': value
		// }
		// this.db.UpdateProfile(id, obj).then((doc: any) => {
		// 	//console.log('updateEdit');
		// 	this.db.getAllProfile().then((re: any) => {
		// 		//console.log(re);
		// 	})
		// })
		// this.seeprofile();

	}
	namesIndex: any;
	namesCheck: boolean = false;
	textShow: any;
	enterConfirm(event) {
		let char = event.key;
		if (char == "Enter") {
			if (this.profileName == this.timebasicObj) {
				if (this.profileName == "" || this.profileName == undefined || this.profileName == null) {
					this.profileName = this.timebasicObj;
				} else {
					this.showinput = !this.showinput;
				}
			} else {
				for (let i = 0; i < this.names.length; i++) {
					if (this.showtextprofile === this.names[i]) {
						this.profileName = this.timebasicObj;
						this.showinput = !this.showinput;
						console.log('名稱相同不做任何更改');
						this.textShow = "已有相同Profile名称，请更改名称";
						this.namesCheck = true;
						setTimeout(() => {
							this.namesCheck = false;
						}, 3000);
						return false;
					}
				}
				this.whenLoading(1);
				// this.LightcompoRemind = 'changeProfile';
				// setTimeout(() => {

				// 	//console.log('sss2222');
				// 	//console.log(this.hdblock);
				// 	this.LightcompoRemind = '';

				// 	// this.whenLoading(1);
				// }, 200);

				// this.getGame = 'stopApmode';
				//

				this.showinput = !this.showinput;
				document.getElementById('EditprofileName').focus();
				this.Openobbox = !this.Openobbox //關選項box
				this.changeOb = true;
				console.log('目前選取的profileNAme');
				console.log(this.timebasicObj);
				//
				// let id = (Number(this.profileindex) + 1);

				// //console.log('newid:' + id);

				// 	// this.names[this.profileindex] = this.newNameprofile;//UI

				let obj = {
					'ProfileName': this.timebasicObj
				}
				//console.log(this.timebasicObj);

				this.db.getProfile(obj).then((doc: any) => {

					//console.log('目前選取的profile');

					//console.log(obj1);

					//console.log('newid:' + id);

					// if(this.editproname==undefined ||this.editproname==null){
					// 	//console.log('this.editproname==undefined ||this.editproname==null');
					// 	//console.log(this.editproname);
					// 	this.editproname=this.profileName;

					// 	//console.log(this.editproname);
					// }

					doc[0].ProfileName = this.showtextprofile;//修改後的名字
					console.log('進入新的profile0000', this.showtextprofile);
					//console.log('修改的名字');
					//console.log(this.editproname);

					//console.log('修改後obj');
					//console.log(obj1);
					console.log('000doc[0].id', doc[0].id);

					setTimeout(() => {
						console.log('ready to update')

						this.db.UpdateProfile(doc[0].id, doc[0]).then((see: any) => {
							//console.log('updateEdit');
							this.Openobbox = false;
							//刪除name中舊的名稱
							//console.log('list');
							//console.log(this.names);
							// console.log(this.names.indexOf(this.timebasicObj));
							//重新讀入目前db
							setTimeout(() => {
								console.log('拉DB內容')
								this.seeprofile();
								setTimeout(() => {
									this.checkIFnamesReady();
								}, this.startTime);

								// setTimeout(() => {
								// 	console.log('去除原本的')
								// 	if(this.names.indexOf(this.timebasicObj)!==-1){
								// 		this.names.splice(this.names.indexOf(this.timebasicObj), 1);
								// 	}else{
								// 		console.log('找不到',this.timebasicObj);
								// 	}
								// 	setTimeout(() => {
								// 		console.log('進入新的profile',this.names);
								// 		console.log('進入新的profile22222',this.showtextprofile);
								// 		console.log('完成時的profilename',this.profileName);
								// 		this.FnF12profilename=this.showtextprofile;
								// 		if(this.names.indexOf(this.showtextprofile)!==-1){
								// 			this.profileName=" ";
								// 		setTimeout(() => {//存入profile名稱

								// 			this.callName(this.names.indexOf(this.showtextprofile));
								// 			// let obj = {
								// 			// 	"ProfileName": "MacroList",
								// 			// }
								// 			// this.db.getProfile(obj).then((doc: any) => {
								// 			// 	doc[0].saveprofileNAME = this.profileName;
								// 			// 	this.db.UpdateProfile(doc[0].id, doc[0]).then((see: any) => {

								// 			// 	});
								// 			// });
								// 		}, 20);
								// 		// console.log('完成時的profilename',this.profileName)
								// 		}else{
								// 			console.log('更改名稱失敗')
								// 		}
								// 	}, 300);
								// }, 200);
							}, 100);
							// this.names.splice(this.names.indexOf(this.timebasicObj), 1);
							// setTimeout(() => {
							// 	if(this.names.indexOf(this.profileName)!==-1){
							// 	this.callName(this.names.indexOf(this.profileName));
							// 	}else{
							// 		this.whenLoading(0);
							// 	}
							// }, 50);

							// this.profileAllcontentSend = doc[0];//傳到效果頁
							// this.LightcompoRemind = 'updatenow';
							// setTimeout(() => {

							// 	//console.log('sss2222');
							// 	//console.log(this.hdblock);
							// 	this.LightcompoRemind = '';
							// 	this.whenLoading(0);
							// }, 200);
							// this.db.getAllProfile().then((re: any) => {
							// 	//console.log(re);
							// })
						})
					}, 20);
				})
			}
		}
		if (this.profileclick == 1) {
			window.addEventListener('mousedown', () => {
				if (this.showinput == true) {
					if (this.profileName == this.timebasicObj) {
						if (this.profileName == "" || this.profileName == undefined || this.profileName == null) {
							this.profileName = this.timebasicObj;
						} else {
							this.showinput = !this.showinput;
						}
					} else {
						for (let i = 0; i < this.names.length; i++) {
							if (this.showtextprofile === this.names[i]) {
								this.profileName = this.timebasicObj;
								this.showinput = !this.showinput;
								console.log('名稱相同不做任何更改');
								this.textShow = "已有相同Profile名称，请更改名称";
								this.namesCheck = true;
								setTimeout(() => {
									this.namesCheck = false;
								}, 3000);
								return false;
							}
						}
						this.whenLoading(1);
						this.showinput = !this.showinput;
						document.getElementById('EditprofileName').focus();
						this.Openobbox = !this.Openobbox //關選項box
						this.changeOb = true;
						console.log('目前選取的profileNAme');
						console.log(this.timebasicObj);

						let obj = {
							'ProfileName': this.timebasicObj
						}

						this.db.getProfile(obj).then((doc: any) => {

							doc[0].ProfileName = this.showtextprofile;//修改後的名字
							console.log('進入新的profile0000', this.showtextprofile);
							console.log('000doc[0].id', doc[0].id);

							setTimeout(() => {
								console.log('ready to update')

								this.db.UpdateProfile(doc[0].id, doc[0]).then((see: any) => {
									this.Openobbox = false;
									setTimeout(() => {
										console.log('拉DB內容')
										this.seeprofile();
										setTimeout(() => {
											this.checkIFnamesReady();
										}, this.startTime);
									}, 100);
								})
							}, 20);
						})
					}
				}
			});

			this.profileclick = 0;
		}

	}


	checkIFnamesReady() {
		console.log('check', this.showtextprofile);
		console.log('names', this.names);
		if (this.names.indexOf(this.showtextprofile) !== -1) {
			setTimeout(() => {
				console.log('去除原本的')
				if (this.names.indexOf(this.timebasicObj) !== -1) {
					this.names.splice(this.names.indexOf(this.timebasicObj), 1);
				} else {
					console.log('找不到', this.timebasicObj);
				}
				setTimeout(() => {
					console.log('進入新的profile', this.names);
					console.log('進入新的profile22222', this.showtextprofile);
					console.log('完成時的profilename', this.profileName);
					this.FnF12profilename = this.showtextprofile;
					if (this.names.indexOf(this.showtextprofile) !== -1) {
						this.profileName = " ";
						setTimeout(() => {//存入profile名稱

							this.callName(this.names.indexOf(this.showtextprofile));

							// let obj = {
							// 	"ProfileName": "MacroList",
							// }
							// this.db.getProfile(obj).then((doc: any) => {
							// 	doc[0].saveprofileNAME = this.profileName;
							// 	this.db.UpdateProfile(doc[0].id, doc[0]).then((see: any) => {

							// 	});
							// });
						}, 20);
						// console.log('完成時的profilename',this.profileName)
					} else {
						console.log('更改名稱失敗')
					}
				}, 300);
			}, 200);
		}
		else {
			console.log('復活')
			this.seeprofile();
			let vm = this;
			setTimeout(() => {
				vm.checkIFnamesReady();
			}, vm.startTime + 100);
		}
	}

	EffectTagAllFalse() { //清除所有的燈校畫面]
		this.seerainbow = false;
		this.seebreath = false;
		this.seelighten = false;
		this.seecrash = false;
		this.seestarlight = false;
		this.seedragon = false;
		this.seemeeting = false;
		this.seelightrain = false;
		this.seeboom = false;
		this.seecross = false;
		this.seefloat = false;
		this.seewaves = false;
		this.seeround = false;
		this.seegameeffect = false;
		this.seepure = false;
		this.seeblasoul = false;
		this.seenone = false;
		console.log('alltagfalse')

	}







	testpaste() {

		console.log('doitcopy777');
		// var ta = document.getElementById('clip');
		// ta.focus();
		// (ta as HTMLTextAreaElement).select();
		let obj = {
			ModifyKey: 0x11,
			VirtualKey: 0x56
		}

		let obj2 = {
			Type: funcVar.FuncType.System,
			Func: funcVar.FuncName.SendKey,
			Param: obj
		}

		// 
		this.protocol.RunSetFunction(obj2).then((data) => {
			console.log('test2222');
			// //console.log("Container RunSetFunction:" + data);

		});
	}

	doItfunction(position) {

		//console.log('doit:' + position);
		// this.time++;計次

		// this.db.getAllProfile().then((doc: any) => {
		// 	// //console.log('getallprogfile'+JSON.stringify(doc));
		// //console.log('getallprogfile'+doc);
		// //console.log("matrix紀錄的位置:"+position);

		// //console.log("func名稱:"+doc[1].Key.matrixkeyArr12);
		// for (let i = 0; i < doc.length; i++) { //找profile
		// 	if (doc[i].ProfileName == "profile 1") {
		// 		let arrorder = i;
		// 		//console.log(doc[arrorder].Light.Mode[position]);
		// //console.log(doc[arrorder]);
		// //console.log(doc[arrorder].Key);
		// //console.log("func名稱:"+doc[arrorder].Key.keyFunctionArr[10]);
		// //console.log("func名稱:"+doc[arrorder].Key.keyFunctionArr[position]);


		let obj = {
			'ProfileName': this.profileName
		}
		if (this.doitfunctionRun == false) {
			//console.log('doitfunction!!!');
			this.doitfunctionRun = true;

			var firstclear = setTimeout(() => {
				this.doitfunctionRun = false;
			}, 2000);
			this.db.getProfile(obj).then((doc: any) => {
				// this.profileAllcontentSend=doc[0];
				// this.outputProEvent.emit(this.profileAllcontentSend);
				//console.log('doit2222');



				for (let i = 0; i < doc[0].KeyDataValue.length; i++) {
					//console.log('doitcopy333');

					if (i == position) {


						if (doc[0].KeyDataValue[i] == 0xB3) {   //copytext
							console.log('doitcopy444');
							if (doc[0].Key.keyCopy[i] !== null && doc[0].Key.keyCopy[i] !== undefined && doc[0].Key.keyCopy[i] !== "") {
								console.log('doitcopy555');
								this.copytext = doc[0].Key.keyCopy[i]

								if (this.copytext !== null && this.copytext !== undefined && this.copytext !== "") {
									setTimeout(() => {
										console.log('doitcopy666');
										var ta = document.getElementById('cliptext');
										ta.focus();
										(ta as HTMLTextAreaElement).select();
										if (document.execCommand('copy')) {
											setTimeout(() => {
												this.doitfunctionRun = false;
												clearTimeout(firstclear);
											}, 50);
											this.testpaste();
										}
									}, 500);
								}
							}
						}
					}
				}
				//console.log('testhd2222')
				//console.log(doc[0].Key.keyFunctionArr[position]);

				if (doc[0].Light.Mode[position] == "PreviousEffect" && this.previouseffect == true && this.nexteffect == true) {   //fn燈效切頁
					//
					// let preEff;
					// clearTimeout(preEff);
					if (this.preEff == false) {
						this.preEff = true;
						// this.whenLoading(1);
						//console.log('往上一個特效');
						this.previouseffect = false;
						this.LightcompoRemind = 'changePage';
						setTimeout(() => {
							this.LightcompoRemind = '';
							// setTimeout(() => {
							this.previousAction();
							// }, 8000);

						}, 200);
					}
				}
				if (doc[0].Light.Mode[position] == "NextEffect" && this.nexteffect == true && this.previouseffect == true) {   //按鍵燈效加快
					// let nextEff;
					// clearTimeout(nextEff);
					if (this.nextEff == false) {
						this.nextEff = true;
						// this.whenLoading(1);
						//console.log('往下一個特效');
						this.nexteffect = false;
						this.LightcompoRemind = 'changePage';
						setTimeout(() => {
							this.LightcompoRemind = '';
							// setTimeout(() => {
							this.nextAction();
							// }, 8000);

						}, 200);
						// //
					}
				}

				if (doc[0].Key.keyFunctionArr[position] == "OpenMyComputer") {
					this.OpenMyComputer();
					//console.log('OpenMyComputer');
				}

				if (doc[0].Key.keyFunctionArr[position] == "OpenSearch") {
					this.OpenSearch();
					//console.log('OpenBrowser');
				}


				if (doc[0].Key.keyFunctionArr[position] == "OpenBrowser") {
					this.OpenBrowser();
					//console.log('OpenBrowser');
				}

				if (doc[0].Key.keyFunctionArr[position] == "OpenCalculator") {
					this.OpenCalculator();
					//console.log('222');
				}

				if (doc[0].Key.keyFunctionArr[position] == "OpenPlayer") {
					this.OpenPlayer();
				}

				if (doc[0].Key.keyFunctionArr[position] == "selfdefinePath") {
					//console.log('selfdf111');
					//20180806 Ako
					this.Path = doc[0].Key.Path[position];
					// this.selfdefinePath();
					shell.openExternal(this.Path);
				}
				//特色功能
				if (doc[0].Key.keyFunctionArr[position] == "changeMode") {
					// this.OpenMyComputer();
				}

				if (doc[0].Key.keyFunctionArr[position] == "blockWindowsKey") {
					this.blockWindowsKey();
				}

				if (doc[0].Key.keyFunctionArr[position] == "resetkey") {
					this.resetkey();
				}

				if (doc[0].Key.keyFunctionArr[position] == "CtrltoCaps") {
					//console.log('c11111')
					this.CtrltoCaps();
				}
			})
		}
		// //console.log("func名稱:"+doc[this.arrorder].Key.keyFunctionArr);

	}

	selfshow: boolean = true;

	givclr01: any = {
		color: "white",
		"background-color": "#E9004C",
	};
	givclr02: any = {};

	clickon: any = {
		color: "white",
		"background-color": "#E9004C",
	};

	clickOn01() {

		this.givclr01 = this.clickon;
		this.givclr02 = {};
		this.selfshow = true;
	};

	clickOn02() {
		if (this.profileAllcontentSend !== undefined) {
			this.givclr02 = this.clickon;
			this.givclr01 = {};
			this.selfshow = false;
		}
	};



	deviceReady: string;
	callbackFunc: any;
	// title = "app";

	//燈效頁送判斷
	effectfinish(e) {
		this.effectready = true;
	}

	sendEfFlag: any = 1;
	//往上一頁
	previousAction() {
		this.getGame = "";
		let obj1 = {
			"ProfileName": this.profileName
		}
		let w;
		if (this.effectready) {
			this.getGame = "stopApmode";
			this.whenLoading(1);
			if (this.seerainbow) {
				this.getGame = "";
				this.etitle = "关闭所有灯光（省电模式）";
				w = 16
				setTimeout(() => {
					this.EffectTagAllFalse()
					this.previouseffect = true;
					this.seenone = true;
					this.preEff = false;
					this.whenLoading(0);
				}, 1000);
				this.db.getProfile(obj1).then((doc: any) => {
					this.check01 = false;
					this.selectOPT = false;
					this.ttitle = this.titleArray[doc[0].Light.LightSetting.changeEffect[w]];
					this.timeEffect = doc[0].Light.LightSetting.changeEffect[w];
					setTimeout(() => {
						this.timeCheck(this.doubleCheck);
					}, 100);
				})
			}
			else if (this.seebreath) {
				this.getGame = "";
				this.etitle = "流光";
				w = 0;
				setTimeout(() => {
					this.EffectTagAllFalse();
					this.seerainbow = true;
					this.previouseffect = true;
					this.preEff = false;
					this.whenLoading(0);
				}, 1000);
				this.db.getProfile(obj1).then((doc: any) => {
					this.check01 = false;
					this.selectOPT = false;
					this.ttitle = this.titleArray[doc[0].Light.LightSetting.changeEffect[w]];
					this.timeEffect = doc[0].Light.LightSetting.changeEffect[w];
					setTimeout(() => {
						this.timeCheck(this.doubleCheck);
					}, 100);
				})
			}
			else if (this.seelighten) {
				this.getGame = "";
				this.etitle = "呼吸";
				w = 1;
				setTimeout(() => {
					this.EffectTagAllFalse()
					this.seebreath = true;
					this.previouseffect = true;
					this.preEff = false;
					this.whenLoading(0);
				}, 1000);
				this.db.getProfile(obj1).then((doc: any) => {
					this.check01 = false;
					this.selectOPT = false;
					this.ttitle = this.titleArray[doc[0].Light.LightSetting.changeEffect[w]];
					this.timeEffect = doc[0].Light.LightSetting.changeEffect[w];
					setTimeout(() => {
						this.timeCheck(this.doubleCheck);
					}, 100);
				})
			}
			else if (this.seecrash) {
				this.getGame = "";
				this.etitle = "光谱";
				w = 2;
				setTimeout(() => {
					this.EffectTagAllFalse()
					this.seelighten = true;
					this.previouseffect = true;
					this.preEff = false;
					this.whenLoading(0);
				}, 1000);
				this.db.getProfile(obj1).then((doc: any) => {
					this.check01 = false;
					this.selectOPT = false;
					this.ttitle = this.titleArray[doc[0].Light.LightSetting.changeEffect[w]];
					this.timeEffect = doc[0].Light.LightSetting.changeEffect[w];
					setTimeout(() => {
						this.timeCheck(this.doubleCheck);
					}, 100);
				})
			}
			else if (this.seestarlight) {
				this.getGame = "";
				this.etitle = "撞击";
				w = 3;
				setTimeout(() => {
					this.EffectTagAllFalse()
					this.seecrash = true;
					this.previouseffect = true;
					this.preEff = false;
					this.whenLoading(0);
				}, 1000);
				this.db.getProfile(obj1).then((doc: any) => {
					this.check01 = false;
					this.selectOPT = false;
					this.ttitle = this.titleArray[doc[0].Light.LightSetting.changeEffect[w]];
					this.timeEffect = doc[0].Light.LightSetting.changeEffect[w];
					setTimeout(() => {
						this.timeCheck(this.doubleCheck);
					}, 100);
				})
			}
			else if (this.seedragon) {
				this.getGame = "";
				this.etitle = "繁星";
				w = 4
				setTimeout(() => {
					this.EffectTagAllFalse()
					this.previouseffect = true;
					this.seestarlight = true;
					this.preEff = false;
					this.whenLoading(0);
				}, 1000);
				this.db.getProfile(obj1).then((doc: any) => {
					this.check01 = false;
					this.selectOPT = false;
					this.ttitle = this.titleArray[doc[0].Light.LightSetting.changeEffect[w]];
					this.timeEffect = doc[0].Light.LightSetting.changeEffect[w];
					setTimeout(() => {
						this.timeCheck(this.doubleCheck);
					}, 100);
				})
			}
			else if (this.seemeeting) {
				this.getGame = "";
				this.etitle = "龙腾";
				w = 5;
				setTimeout(() => {
					this.EffectTagAllFalse()
					this.previouseffect = true;
					this.seedragon = true;
					this.preEff = false;
					this.whenLoading(0);
				}, 1000);
				this.db.getProfile(obj1).then((doc: any) => {
					this.check01 = false;
					this.selectOPT = false;
					this.ttitle = this.titleArray[doc[0].Light.LightSetting.changeEffect[w]];
					this.timeEffect = doc[0].Light.LightSetting.changeEffect[w];
					setTimeout(() => {
						this.timeCheck(this.doubleCheck);
					}, 100);
				})
			}
			else if (this.seelightrain) {
				this.getGame = "";
				this.etitle = "邂逅";
				w = 6;
				setTimeout(() => {
					this.EffectTagAllFalse()
					this.seemeeting = true;
					this.previouseffect = true;
					this.preEff = false;
					this.whenLoading(0);
				}, 1000);
				this.db.getProfile(obj1).then((doc: any) => {
					this.check01 = false;
					this.selectOPT = false;
					this.ttitle = this.titleArray[doc[0].Light.LightSetting.changeEffect[w]];
					this.timeEffect = doc[0].Light.LightSetting.changeEffect[w];
					setTimeout(() => {
						this.timeCheck(this.doubleCheck);
					}, 100);
				})
			}
			else if (this.seeboom) {
				this.getGame = "";
				this.etitle = "光雨";
				w = 7;
				setTimeout(() => {
					this.EffectTagAllFalse()
					this.seelightrain = true;
					this.previouseffect = true;
					this.preEff = false;
					this.whenLoading(0);
				}, 1000);
				this.db.getProfile(obj1).then((doc: any) => {
					this.check01 = false;
					this.selectOPT = false;
					this.ttitle = this.titleArray[doc[0].Light.LightSetting.changeEffect[w]];
					this.timeEffect = doc[0].Light.LightSetting.changeEffect[w];
					setTimeout(() => {
						this.timeCheck(this.doubleCheck);
					}, 100);
				})
			}
			else if (this.seecross) {
				this.getGame = "";
				this.etitle = "脉冲";
				w = 8;
				setTimeout(() => {
					this.EffectTagAllFalse()
					this.previouseffect = true;
					this.seeboom = true;
					this.preEff = false;
					this.whenLoading(0);
				}, 1000)

				this.db.getProfile(obj1).then((doc: any) => {
					this.check01 = false;
					this.selectOPT = false;
					this.ttitle = this.titleArray[doc[0].Light.LightSetting.changeEffect[w]];
					this.timeEffect = doc[0].Light.LightSetting.changeEffect[w];
					setTimeout(() => {
						this.timeCheck(this.doubleCheck);
					}, 100);
				})
			}
			else if (this.seefloat) {
				this.getGame = "";
				this.etitle = "纵横";
				w = 9;
				setTimeout(() => {
					this.EffectTagAllFalse()
					this.seecross = true;
					this.previouseffect = true;
					this.preEff = false;
					this.whenLoading(0);
				}, 1000);
				this.db.getProfile(obj1).then((doc: any) => {
					this.check01 = false;
					this.selectOPT = false;
					this.ttitle = this.titleArray[doc[0].Light.LightSetting.changeEffect[w]];
					this.timeEffect = doc[0].Light.LightSetting.changeEffect[w];
					setTimeout(() => {
						this.timeCheck(this.doubleCheck);
					}, 100);
				})
			}
			else if (this.seewaves) {
				this.getGame = "";
				this.etitle = "飘痕";
				w = 10;
				setTimeout(() => {
					this.EffectTagAllFalse()
					this.seefloat = true;
					this.previouseffect = true;
					this.preEff = false;
					this.whenLoading(0);
				}, 1000);
				this.db.getProfile(obj1).then((doc: any) => {
					this.check01 = false;
					this.selectOPT = false;
					this.ttitle = this.titleArray[doc[0].Light.LightSetting.changeEffect[w]];
					this.timeEffect = doc[0].Light.LightSetting.changeEffect[w];
					setTimeout(() => {
						this.timeCheck(this.doubleCheck);
					}, 100);
				})
			}
			else if (this.seeround) {
				this.getGame = "";
				this.etitle = "涟漪";
				w = 11;
				setTimeout(() => {
					this.EffectTagAllFalse()
					this.seewaves = true;
					this.previouseffect = true;
					this.preEff = false;
					this.whenLoading(0);
				}, 1000);
				this.db.getProfile(obj1).then((doc: any) => {
					this.check01 = false;
					this.selectOPT = false;
					this.ttitle = this.titleArray[doc[0].Light.LightSetting.changeEffect[w]];
					this.timeEffect = doc[0].Light.LightSetting.changeEffect[w];
					setTimeout(() => {
						this.timeCheck(this.doubleCheck);
					}, 100);
				})
			}
			else if (this.seegameeffect) {
				this.getGame = "";
				this.etitle = "绽放";
				w = 12;
				setTimeout(() => {
					this.EffectTagAllFalse()
					this.seeround = true;
					this.previouseffect = true;
					this.preEff = false;
					this.whenLoading(0);
				}, 1000);
				this.db.getProfile(obj1).then((doc: any) => {
					this.check01 = false;
					this.selectOPT = false;
					this.ttitle = this.titleArray[doc[0].Light.LightSetting.changeEffect[w]];
					this.timeEffect = doc[0].Light.LightSetting.changeEffect[w];
					setTimeout(() => {
						this.timeCheck(this.doubleCheck);
					}, 100);
				})
			}
			else if (this.seepure) {
				this.getGame = "";
				this.etitle = "游戏模式";
				w = 13;
				setTimeout(() => {
					this.EffectTagAllFalse()
					this.previouseffect = true;
					this.seegameeffect = true;
					this.preEff = false;
					this.whenLoading(0);
				}, 1000);
				this.db.getProfile(obj1).then((doc: any) => {
					this.check01 = false;
					this.selectOPT = false;
					this.ttitle = this.titleArray[doc[0].Light.LightSetting.changeEffect[w]];
					this.timeEffect = doc[0].Light.LightSetting.changeEffect[w];
					setTimeout(() => {
						this.timeCheck(this.doubleCheck);
					}, 100);
				})
			}

			else if (this.seeblasoul) {
				this.getGame = "";
				this.etitle = "纯色";
				w = 14;
				setTimeout(() => {
					this.EffectTagAllFalse()
					this.seepure = true;
					this.previouseffect = true;
					this.preEff = false;
					this.whenLoading(0);
				}, 1000);
				this.db.getProfile(obj1).then((doc: any) => {
					this.check01 = false;
					this.selectOPT = false;
					this.ttitle = this.titleArray[doc[0].Light.LightSetting.changeEffect[w]];
					this.timeEffect = doc[0].Light.LightSetting.changeEffect[w];
					setTimeout(() => {
						this.timeCheck(this.doubleCheck);
					}, 100);
				})
			}
			else if (this.seenone) {
				this.getGame = "";
				this.etitle = "Blasoul";
				w = 15;
				setTimeout(() => {
					this.EffectTagAllFalse()
					this.seeblasoul = true;
					this.previouseffect = true;
					this.preEff = false;
					this.whenLoading(0);
				}, 1000);
				this.db.getProfile(obj1).then((doc: any) => {
					this.check01 = false;
					this.selectOPT = false;
					this.ttitle = this.titleArray[doc[0].Light.LightSetting.changeEffect[w]];
					this.timeEffect = doc[0].Light.LightSetting.changeEffect[w];
					setTimeout(() => {
						this.timeCheck(this.doubleCheck);
					}, 100);
				})
			}
		} else {
			this.previousAction();
		}

	}


	//往下一頁
	nextAction() {
		this.getGame = "";
		let obj1 = {
			"ProfileName": this.profileName
		}
		let w;
		if (this.effectready) {
			this.getGame = "stopApmode";
			this.whenLoading(1);
			if (this.seerainbow) {
				this.getGame = "";
				this.etitle = "呼吸";
				w = 1;
				setTimeout(() => {
					this.EffectTagAllFalse();
					this.seebreath = true;
					this.nexteffect = true;
					this.nextEff = false;
					this.whenLoading(0);
				}, 1000);
				this.db.getProfile(obj1).then((doc: any) => {
					this.check01 = false;
					this.selectOPT = false;
					this.ttitle = this.titleArray[doc[0].Light.LightSetting.changeEffect[w]];
					this.timeEffect = doc[0].Light.LightSetting.changeEffect[w];
					setTimeout(() => {
						this.timeCheck(this.doubleCheck);
					}, 100);
				})
			}
			else if (this.seebreath) {
				this.getGame = "";
				this.etitle = "光谱";
				w = 2;
				setTimeout(() => {
					this.EffectTagAllFalse();
					this.seelighten = true;
					this.nexteffect = true;
					this.nextEff = false;
					this.whenLoading(0);
				}, 1000);
				this.db.getProfile(obj1).then((doc: any) => {
					this.check01 = false;
					this.selectOPT = false;
					this.ttitle = this.titleArray[doc[0].Light.LightSetting.changeEffect[w]];
					this.timeEffect = doc[0].Light.LightSetting.changeEffect[w];
					setTimeout(() => {
						this.timeCheck(this.doubleCheck);
					}, 100);
				})
			}
			else if (this.seelighten) {
				this.getGame = "";
				this.etitle = "撞击";
				w = 3;
				setTimeout(() => {
					this.EffectTagAllFalse();
					this.seecrash = true;
					this.nexteffect = true;
					this.nextEff = false;
					this.whenLoading(0);
				}, 1000);
				this.db.getProfile(obj1).then((doc: any) => {
					this.check01 = false;
					this.selectOPT = false;
					this.ttitle = this.titleArray[doc[0].Light.LightSetting.changeEffect[w]];
					this.timeEffect = doc[0].Light.LightSetting.changeEffect[w];
					setTimeout(() => {
						this.timeCheck(this.doubleCheck);
					}, 100);
				})
			}
			else if (this.seecrash) {
				this.getGame = "";
				this.etitle = "繁星";
				w = 4;
				setTimeout(() => {
					this.EffectTagAllFalse();
					this.seestarlight = true;
					this.nexteffect = true;
					this.nextEff = false;
					this.whenLoading(0);
				}, 1000);
				this.db.getProfile(obj1).then((doc: any) => {
					this.check01 = false;
					this.selectOPT = false;
					this.ttitle = this.titleArray[doc[0].Light.LightSetting.changeEffect[w]];
					this.timeEffect = doc[0].Light.LightSetting.changeEffect[w];
					setTimeout(() => {
						this.timeCheck(this.doubleCheck);
					}, 100);
				})
			}
			else if (this.seestarlight) {
				this.getGame = "";
				this.etitle = "龙腾";
				w = 5;
				// setTimeout(() => {
				setTimeout(() => {
					this.EffectTagAllFalse();
					this.seedragon = true;
					this.nexteffect = true;
					this.nextEff = false;
					this.whenLoading(0);
				}, 1000);
				this.db.getProfile(obj1).then((doc: any) => {
					this.check01 = false;
					this.selectOPT = false;
					this.ttitle = this.titleArray[doc[0].Light.LightSetting.changeEffect[w]];
					this.timeEffect = doc[0].Light.LightSetting.changeEffect[w];
					setTimeout(() => {
						this.timeCheck(this.doubleCheck);
					}, 100);
				})
			}
			else if (this.seedragon) {
				this.getGame = "";
				this.etitle = "邂逅";
				w = 6;
				setTimeout(() => {
					this.EffectTagAllFalse();
					this.seemeeting = true;
					this.nexteffect = true;
					this.nextEff = false;
					this.whenLoading(0);
				}, 1000);
				this.db.getProfile(obj1).then((doc: any) => {
					this.check01 = false;
					this.selectOPT = false;
					this.ttitle = this.titleArray[doc[0].Light.LightSetting.changeEffect[w]];
					this.timeEffect = doc[0].Light.LightSetting.changeEffect[w];
					setTimeout(() => {
						this.timeCheck(this.doubleCheck);
					}, 100);
				})
			}
			else if (this.seemeeting) {
				this.nexteffect = true;
				this.getGame = "";
				this.etitle = "光雨";
				w = 7;
				setTimeout(() => {
					this.EffectTagAllFalse();
					this.seelightrain = true;
					this.nextEff = false;
					this.whenLoading(0);
				}, 1000);
				this.db.getProfile(obj1).then((doc: any) => {
					this.check01 = false;
					this.selectOPT = false;
					this.ttitle = this.titleArray[doc[0].Light.LightSetting.changeEffect[w]];
					this.timeEffect = doc[0].Light.LightSetting.changeEffect[w];
					setTimeout(() => {
						this.timeCheck(this.doubleCheck);
					}, 100);
				})
			}
			else if (this.seelightrain) {
				this.nexteffect = true;
				this.getGame = "";
				this.etitle = "脉冲";
				w = 8
				setTimeout(() => {
					this.EffectTagAllFalse();
					this.seeboom = true;
					this.nextEff = false;
					this.whenLoading(0);
				}, 1000);
				this.db.getProfile(obj1).then((doc: any) => {
					this.check01 = false;
					this.selectOPT = false;
					this.ttitle = this.titleArray[doc[0].Light.LightSetting.changeEffect[w]];
					this.timeEffect = doc[0].Light.LightSetting.changeEffect[w];
					setTimeout(() => {
						this.timeCheck(this.doubleCheck);
					}, 100);
				})
			}
			else if (this.seeboom) {
				this.getGame = "";
				this.etitle = "纵横";
				w = 9;
				setTimeout(() => {
					this.EffectTagAllFalse();
					this.seecross = true;
					this.nexteffect = true;
					this.nextEff = false;
					this.whenLoading(0);
				}, 1000);
				this.db.getProfile(obj1).then((doc: any) => {
					this.check01 = false;
					this.selectOPT = false;
					this.ttitle = this.titleArray[doc[0].Light.LightSetting.changeEffect[w]];
					this.timeEffect = doc[0].Light.LightSetting.changeEffect[w];
					setTimeout(() => {
						this.timeCheck(this.doubleCheck);
					}, 100);
				})
			}
			else if (this.seecross) {
				this.getGame = "";
				this.etitle = "飘痕";
				w = 10;
				setTimeout(() => {
					this.EffectTagAllFalse();
					this.nexteffect = true;
					this.seefloat = true;
					this.nextEff = false;
					this.whenLoading(0);
				}, 1000);
				this.db.getProfile(obj1).then((doc: any) => {
					this.check01 = false;
					this.selectOPT = false;
					this.ttitle = this.titleArray[doc[0].Light.LightSetting.changeEffect[w]];
					this.timeEffect = doc[0].Light.LightSetting.changeEffect[w];
					setTimeout(() => {
						this.timeCheck(this.doubleCheck);
					}, 100);
				})
			}
			else if (this.seefloat) {
				this.getGame = "";
				this.etitle = "涟漪";
				w = 11;
				setTimeout(() => {
					this.EffectTagAllFalse();
					this.nexteffect = true;
					this.seewaves = true;
					this.nextEff = false;
					this.whenLoading(0);
				}, 1000);
				this.db.getProfile(obj1).then((doc: any) => {
					this.check01 = false;
					this.selectOPT = false;
					this.ttitle = this.titleArray[doc[0].Light.LightSetting.changeEffect[w]];
					this.timeEffect = doc[0].Light.LightSetting.changeEffect[w];
					setTimeout(() => {
						this.timeCheck(this.doubleCheck);
					}, 100);
				})
			}
			else if (this.seewaves) {
				this.getGame = "";
				this.etitle = "绽放";
				w = 12;
				setTimeout(() => {
					this.EffectTagAllFalse();
					this.nexteffect = true;
					this.seeround = true;
					this.nextEff = false;
					this.whenLoading(0);
				}, 1000);
				this.db.getProfile(obj1).then((doc: any) => {
					this.check01 = false;
					this.selectOPT = false;
					this.ttitle = this.titleArray[doc[0].Light.LightSetting.changeEffect[w]];
					this.timeEffect = doc[0].Light.LightSetting.changeEffect[w];
					setTimeout(() => {
						this.timeCheck(this.doubleCheck);
					}, 100);
				})
			}
			else if (this.seeround) {
				this.getGame = "";
				this.etitle = "游戏模式";
				w = 13;
				setTimeout(() => {
					this.EffectTagAllFalse();
					this.nexteffect = true;
					this.seegameeffect = true;
					this.nextEff = false;
					this.whenLoading(0);
				}, 1000);
				this.db.getProfile(obj1).then((doc: any) => {
					this.check01 = false;
					this.selectOPT = false;
					this.ttitle = this.titleArray[doc[0].Light.LightSetting.changeEffect[w]];
					this.timeEffect = doc[0].Light.LightSetting.changeEffect[w];
					setTimeout(() => {
						this.timeCheck(this.doubleCheck);
					}, 100);
				})
			}
			else if (this.seegameeffect) {
				this.getGame = "";
				this.etitle = "纯色";
				w = 14;
				setTimeout(() => {
					this.EffectTagAllFalse();
					this.seepure = true;
					this.nexteffect = true;
					this.nextEff = false;
					this.whenLoading(0);
				}, 1000);
				this.db.getProfile(obj1).then((doc: any) => {
					this.check01 = false;
					this.selectOPT = false;
					this.ttitle = this.titleArray[doc[0].Light.LightSetting.changeEffect[w]];
					this.timeEffect = doc[0].Light.LightSetting.changeEffect[w];

					setTimeout(() => {
						this.timeCheck(this.doubleCheck);
					}, 100);
				})
			}
			else if (this.seepure) {
				this.getGame = "";
				this.etitle = "Blasoul";
				w = 15;
				setTimeout(() => {
					this.EffectTagAllFalse();
					this.seeblasoul = true;
					this.nexteffect = true;
					this.nextEff = false;
					this.whenLoading(0);
				}, 1000);
				this.db.getProfile(obj1).then((doc: any) => {
					this.check01 = false;
					this.selectOPT = false;
					this.ttitle = this.titleArray[doc[0].Light.LightSetting.changeEffect[w]];
					this.timeEffect = doc[0].Light.LightSetting.changeEffect[w];
					setTimeout(() => {
						this.timeCheck(this.doubleCheck);
					}, 100);
				})
			}
			else if (this.seeblasoul) {
				this.getGame = "";
				this.etitle = "关闭所有灯光（省电模式）";
				w = 16;
				setTimeout(() => {
					this.EffectTagAllFalse()
					this.seenone = true;
					this.nexteffect = true;
					this.nextEff = false;
					this.whenLoading(0);
				}, 1000);
				this.db.getProfile(obj1).then((doc: any) => {
					this.check01 = false;
					this.selectOPT = false;
					this.ttitle = this.titleArray[doc[0].Light.LightSetting.changeEffect[w]];
					this.timeEffect = doc[0].Light.LightSetting.changeEffect[w];
					setTimeout(() => {
						this.timeCheck(this.doubleCheck);
					}, 100);
				})
			}
			else if (this.seenone) {
				this.getGame = "";
				this.etitle = "流光";
				w = 0;
				setTimeout(() => {
					this.EffectTagAllFalse();
					this.seerainbow = true;
					this.nexteffect = true;
					this.nextEff = false;
					this.whenLoading(0);
				}, 1000);
				this.db.getProfile(obj1).then((doc: any) => {
					this.check01 = false;
					this.selectOPT = false;
					this.ttitle = this.titleArray[doc[0].Light.LightSetting.changeEffect[w]];
					this.timeEffect = doc[0].Light.LightSetting.changeEffect[w];
					setTimeout(() => {
						this.timeCheck(this.doubleCheck);
					}, 100);
				})
			}
		} else {
			this.nextAction();
		}
	}



	OpenCalculator() {
		// 「C:\Documents and Settings\All Users\「開始」功能表\程式集\附屬應用程式」
		let where = "C:\\WINDOWS\\system32\\calc.exe"
		let obj1 = {
			Type: funcVar.FuncType.Device,
			Func: funcVar.FuncName.RunApplication,
			Param: where

		}
		this.protocol.RunSetFunction(obj1).then((data) => {
			console.log('執行計算機1111')
		})
	}
	OpenBrowser() {
		// let where = "C:\\Program Files (x86)\\Google\\Chrome\\Application\\chrome.exe"
		// let obj1 = {
		// 	Type: funcVar.FuncType.Device,
		// 	Func: funcVar.FuncName.RunApplication,
		// 	Param: where

		// }
		// this.protocol.RunSetFunction(obj1).then((data) => {
		// })
		shell.openExternal("Http://")
	}

	OpenPlayer() {
		let where = "C:\\Program Files (x86)\\Windows Media Player\\wmplayer.exe"
		let obj1 = {
			Type: funcVar.FuncType.Device,
			Func: funcVar.FuncName.RunApplication,
			Param: where
		}
		this.protocol.RunSetFunction(obj1).then((data) => {
		})
	}

	OpenSearch() {
		let obj = {
			ModifyKey: 0x5b,
			VirtualKey: 0x53
		}
		let obj2 = {
			Type: funcVar.FuncType.System,
			Func: funcVar.FuncName.SendKey,
			Param: obj
		}
		// 
		this.protocol.RunSetFunction(obj2).then((data) => {
			//console.log('OpenSearch');
			// //console.log("Container RunSetFunction:" + data);
		});
	}



	OpenMyComputer() {

		let where = "C:\\Windows\\explorer.exe"

		let obj1 = {
			Type: funcVar.FuncType.Device,
			Func: funcVar.FuncName.RunApplication,
			Param: where

		}
		this.protocol.RunSetFunction(obj1).then((data) => {
		})

	}

	selfdefinePath() {
		//console.log('自定义效果11111');
		//console.log(this.Path);
		let where = this.Path;
		let obj1 = {
			Type: funcVar.FuncType.Device,
			Func: funcVar.FuncName.RunApplication,
			Param: where

		}
		this.protocol.RunSetFunction(obj1).then((data) => {
		})

	}





	//特色功能
	blockWindowsKey() {
		console.log('123');
		// if(this.readyforwinsblock==true){
		// 	this.readyforwinsblock=false;//1秒間隔
		if (this.blockWindowsKeystatus == 1 && this.blockwins == true) {
			this.blockwins = false;
			//console.log('bw11111');
			this.getGame = '';
			this.getGame = 'stopApmode';
			this.whenLoading(1);
			let data = {
				profile: this.changeProfile,
			}

			let obj1 = {
				Type: funcVar.FuncType.Device,
				Func: funcVar.FuncName.GetKeyMatrix,
				Param: data
			}
			this.protocol.RunSetFunction(obj1).then((data) => {


				//reset Keycodetable
				//console.log("Container RunSetFunction:" + data);

				//set new key

				data[124] = 0xB3; //L-win;

				// //console.log(data[7]);
				// //console.log(data);

				let content = {
					profile: this.changeProfile,
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

					this.whenLoading(0);
					this.blockWindowsKeystatus = 0;
					this.getGame = '';
					this.getGame = 'startApmode';

					// let obj = {
					// 	"ProfileName": this.profileName
					// }
					// this.db.getProfile(obj).then((doc: any) => {
					// 	// "winstatus": 1,
					// 	// "capsstatus": 1,
					// 	doc[0].winstatus = this.blockWindowsKeystatus;
					// 	this.db.UpdateProfile(doc[0].id, doc[0]).then((doc: any) => {
					// 	})
					// })
					let funName = 'blockWindowsKey';
					let keynum = 124;
					let keyset = 0xB3;
					this.savestatus(this.blockWindowsKeystatus, keynum, keyset, funName);
					this.backtowins = true;
					//console.log('bw22222');
				})
			})
		} else { //回復WIN KEY
			console.log('123123', this.backtowins);

			if (this.backtowins) {
				console.log('bw3333');
				this.backtowins = false;
				this.getGame = '';
				this.getGame = 'stopApmode';
				this.whenLoading(1);
				let data = {
					profile: this.changeProfile,
				}

				let obj1 = {
					Type: funcVar.FuncType.Device,
					Func: funcVar.FuncName.GetKeyMatrix,
					Param: data
				}
				this.protocol.RunSetFunction(obj1).then((data) => {

					//reset Keycodetable
					//console.log("Container RunSetFunction:" + data);

					//set new key

					data[124] = 0xE3; //L-win;

					// //console.log(data[7]);
					// //console.log(data);

					let content = {
						profile: this.changeProfile,
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

						this.whenLoading(0);
						this.blockWindowsKeystatus = 1;

						this.getGame = '';
						this.getGame = 'startApmode';

						let funName = 'blockWindowsKey';
						let keynum = 124;
						let keyset = 0xE3;
						this.savestatus(this.blockWindowsKeystatus, keynum, keyset, funName);
						setTimeout(() => {
							this.blockwins = true;
							//console.log('bw44444');
						}, 1000);
					})
				})
			}
		}
		// 	setTimeout(() => {
		// 		this.readyforwinsblock=true;
		// 	}, 1000);
		// }
	}



	resetkey() {
		this.getGame = '';
		this.getGame = 'stopApmode';

		let data = {
			profile: this.changeProfile,
		}

		let obj1 = {
			Type: funcVar.FuncType.Device,
			Func: funcVar.FuncName.GetKeyMatrix,
			Param: data
		}
		this.protocol.RunSetFunction(obj1).then((data) => {


			//reset Keycodetable



			//console.log("Container RunSetFunction:" + data);

			//set new key
			for (let index = 0; index < this.KCTarr.length; index++) {
				data[index] = this.KCTarr[index];
			}

			data[222] = 0x00;
			data[230] = 0x00;
			data[213] = 0xB3;
			data[200] = 0xB3;
			// //console.log(data[7]);
			// //console.log(data);

			let content = {
				profile: this.changeProfile,
				KeyData: data
			}

			let obj2 = {
				Type: funcVar.FuncType.Device,
				Func: funcVar.FuncName.SetKeyMatrix,
				Param: content
			}

			this.protocol.RunSetFunction(obj2).then((data) => {
				//console.log("Container RunSetFunction:" + data);
				//console.log('app 11111');
				//console.log(this.profileAllcontentSend.ProfileName);

				let obj = {
					"ProfileName": this.profileName,
					"Key": {
						"winstatus": "",
						"capsstatus": "",
						"keyFunctionArr": [],
						"marcroContent": [],
						"marcroChoose": [],
						"Path": [],
						"keyCopy": [],
						"options": {
							"OPshelf01": [],//內容/選單
							"OPshelf02": []
						}
					},
					"shelf01": [],
					"shelf02": [],
					"shelfblock01": [],
					"shelfblock02": [],
					"KeyDataValue": [],
					"Light": {
						"LightEffect": "",
						"LightSetting": {
							"LSbrightness": [],
							"LSspeed": [],
							"LSdirection": [],
							"changeMode": [],
							"changeTime": [],
							"changeStatus": [],
							"changeEffect": [],
						},
						"Mode": [],
						"ColorMode": [],
						"Speed": [],
						"Color": [],
						"Time": "",
						"Into": ""
					},
					"AttLight": {
						"effect": "",
						"time": ""
					},
					"GameMode": [0, 0, 0]
				}

				this.db.UpdateProfile(this.profileAllcontentSend.id, obj).then((doc: any) => {
					//console.log('reset done');
					//console.log(this.profileAllcontentSend);
					// for (let index = 0; index < this.names.length; index++) {
					// 	if (this.profileAllcontentSend.ProfileName == this.names[index]) {
					// 		//console.log('reset done2222');
					// 		this.clickOn01();
					// 		this.callName(index);
					// 	}
					// }
					setTimeout(() => {
						if (this.profileName !== "" && this.profileName !== null && this.profileName !== undefined) {
							let nameindex = this.names.indexOf(this.profileName);
							console.log('nameindex:', nameindex);
							if (this.names[nameindex] !== '游戏模式') {
								this.profileName = '游戏模式';
							} else {
								//因為最少兩個profile
								if (nameindex == 0) {
									this.profileName = this.names[this.names.length - 1];
								} else {
									this.profileName = this.names[0];
								}
							}
							setTimeout(() => {
								this.callName(nameindex);
							}, 20);
						}
					}, 500);
				})
			})
		})
	}



	CtrltoCaps() {
		this.getGame = '';

		if (this.CCstatus == 1 && this.ccstart == true) {
			console.log('ctrltoCaps');
			this.ccstart = false;

			this.getGame = 'stopApmode';
			this.whenLoading(1);
			//console.log('c222')
			let data = {
				profile: this.changeProfile,
			}

			let obj1 = {
				Type: funcVar.FuncType.Device,
				Func: funcVar.FuncName.GetKeyMatrix,
				Param: data
			}
			this.protocol.RunSetFunction(obj1).then((data) => {
				//console.log('c333')

				//reset Keycodetable

				//console.log("Container RunSetFunction:" + data);

				//set new key
				data[4] = 0x39; //R-ctrl;
				data[6] = 0x39; //L-ctrl;
				data[17] = 0xE0;//caption

				// //console.log(data[7]);
				// //console.log(data);

				let content = {
					profile: this.changeProfile,
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
					//console.log('c444')

					this.CCstatus = 0;

					// 	data[6] = 0x39; //L-ctrl;
					// data[17] = 0xE0;//caption
					let funName = 'CtrltoCaps';
					let keynum = [6, 17, 4];
					let keyset = [0x39, 0xE0, 0x39];
					console.log('this.CCstatus', this.CCstatus);
					this.savestatus(this.CCstatus, keynum, keyset, funName);
					this.backtocc = true;
					this.getGame = 'startApmode';
					this.whenLoading(0);
				})
			})

		} else {
			if (this.backtocc) {
				console.log('回復ctrl');
				this.backtocc = false;
				this.getGame = 'stopApmode';
				this.whenLoading(1);

				let data = {
					profile: this.changeProfile
				}

				let obj1 = {
					Type: funcVar.FuncType.Device,
					Func: funcVar.FuncName.GetKeyMatrix,
					Param: data
				}
				this.protocol.RunSetFunction(obj1).then((data) => {
					//console.log('c333')

					//reset Keycodetable
					//console.log("Container RunSetFunction:" + data);
					//set new key
					// data[6] = 0x39; //L-ctrl;
					// data[17] = 0xE0;//caption
					data[4] = 0xE4; //R-ctrl;
					data[6] = 0xE0; //L-ctrl;
					data[17] = 0x39;//caption
					// //console.log(data[7]);
					// //console.log(data);

					let content = {
						profile: this.changeProfile,
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
						//console.log('c444')
						this.CCstatus = 1;
						this.getGame = '';

						let funName = 'CtrltoCaps';
						let keynum = [6, 17, 4];
						let keyset = [0xE0, 0x39, 0xE4];
						this.savestatus(this.CCstatus, keynum, keyset, funName);
						this.getGame = 'startApmode';
						this.whenLoading(0);
						setTimeout(() => {
							this.ccstart = true;
						}, 1000);
					})
				})
			}
		}
	}


	getReadFile() {
		//console.log("inputtext0000")
		// const input = document.querySelector('input[type="file"]')
		const input = <HTMLInputElement>document.getElementById('myfile');
		let vm = this;
		input.addEventListener('change', function (e) {
			//console.log("inputtext1111")

			// //console.log(input.files);
			const reader = new FileReader();
			reader.onload = function () {
				// //console.log(reader.result);
				let resultfile = JSON.parse(reader.result);
				//console.log(resultfile);//讀取的內容
				// //對應的profileName，進行點選profile動作
				// for (let i = 0; i < vm.names.length; i++) {
				// 	if (vm.names[i] == resultfile.ProfileName) {
				// 		// //console.log(vm.names[i]);
				// 		// vm.callName(i);

				// 	}
				// }

				var text
				(function repeatCount() {
					console.log('repeat 111')
					text = resultfile.ProfileName
					if (vm.names.indexOf(text) == -1) {
						resultfile.ProfileName = text
						vm.names.push(resultfile.ProfileName);
					}
					else if (vm.names.indexOf(text) !== -1) {
						// text = resultfile.ProfileName;
						text += '-' + vm.namescount;
						vm.namescount++;
						if (vm.names.indexOf(text) == -1) {
							resultfile.ProfileName = text;
							vm.names.push(resultfile.ProfileName);
							vm.namescount = 1;
						}
						else if (vm.names.indexOf(text) !== -1) {
							repeatCount();
						}
					}
				})();


				// vm.textShow = "已有相同profile名称，请更改名称"
				// vm.namesCheck = true;
				// setTimeout(() => {
				// 	vm.namesCheck = false;
				// }, 3000);
				vm.db.getAllProfile().then((doc: any) => {
					for (var i = 0; i < doc.length; i++) {
						vm.profileID.push(doc[i].id); //取得所有profile id
						vm.profile_ID.push(doc[i]._id); //取得所有亂數id
					}
					vm.profileID.sort(); //將id做大小排序
					resultfile.id = doc.lenth; //將匯入id 改為陣列最後一個
					delete resultfile._id;
					console.log(resultfile);
					console.log(resultfile.id, resultfile._id);
					vm.db.AddProfile(resultfile).then((doc: any) => {
						vm.seeprofile();
					})
				})

			}
			reader.readAsText(input.files[0]);
		}, false)
	}

	ativateGetFile() {
		this.showmore = !this.showmore;
		setTimeout(() => {
			this.getReadFile();
		}, 500);
	}


	FileinMacro() {
		//console.log("inputtext222")
		// const input = document.querySelector('input[type="file"]')
		const input = <HTMLInputElement>document.getElementById('myfile');

		let vm = this;
		input.addEventListener('change', function (e) {
			//console.log("inputtext333")

			// //console.log(input.files);
			const reader = new FileReader();
			reader.onload = function () {
				// //console.log(reader.result);
				let resultfile = JSON.parse(reader.result);
				//console.log(resultfile);//讀取的內容

				// //對應的profileName，進行點選profile動作
				// for (let i = 0; i < vm.names.length; i++) {
				// 	if (vm.names[i] == resultfile.ProfileName) {
				// 		// //console.log(vm.names[i]);
				// 		// vm.callName(i);

				// 	}
				// }

				if (vm.names.indexOf(resultfile.ProfileName) !== -1) {
					vm.textShow = "已有相同专案名称，请更改名称"
					vm.namesCheck = true;
					setTimeout(() => {
						vm.namesCheck = false;
					}, 3000);
				} else {
					vm.db.AddProfile(resultfile).then((doc: any) => {
						// vm.seeprofile();
					})
				}

			}

			reader.readAsText(input.files[0]);



		}, false)
	}


	seeMacrolist() {

		let obj = {
			"ProfileName": "MacroList"
		}
		this.db.getProfile(obj).then((doc: any) => {
			//console.log(doc[0]);
		})
	}

	leave() {
		setTimeout(() => {
			this.showmore = !this.showmore;
		}, 200);
	}

	RainbowTemp: any = {
		'LightEffect': 0,
		'LSbrightness': 0.5,
		'LSspeed': 30,
		'LSdirection': 3,
		'changeTime': 10,
		'ttitle': '流光',
		'changeStatus': false,
		'changeEffect': 16,
		'ColorMode': '',
		'Color': '',
	}
	BreathTemp: any = {
		'LightEffect': 1,
		'LSbrightness': 0.5,
		'LSspeed': 6,
		'LSdirection': '',
		'changeTime': 10,
		'ttitle': '呼吸',
		'changeStatus': false,
		'changeEffect': 16,
		'ColorMode': true,
		'Color': {
			'defaultclr': '#e9004c',
			'defaultclr02': '#007fff'
		},
	}
	LightenTemp: any = {
		'LightEffect': 2,
		'LSbrightness': 0.5,
		'LSspeed': 6,
		'LSdirection': '',
		'changeTime': 10,
		'ttitle': '光谱',
		'changeStatus': false,
		'changeEffect': 16,
		'ColorMode': '',
		'Color': '',
	}
	CrashTemp: any = {
		'LightEffect': 3,
		'LSbrightness': 0.5,
		'LSspeed': 60,
		'LSdirection': 3,
		'changeTime': 10,
		'ttitle': '撞击',
		'changeStatus': false,
		'changeEffect': 16,
		'ColorMode': true,
		'Color': {
			'defaultclr': '#e9004c',
			'defaultclr02': '#ff3f00'
		},
	}
	StarlightTemp: any = {
		'LightEffect': 4,
		'LSbrightness': 0.5,
		'LSspeed': 60,
		'LSdirection': '',
		'changeTime': 10,
		'ttitle': '繁星',
		'changeStatus': false,
		'changeEffect': 16,
		'ColorMode': true,
		'Color': '',
	}
	DragonTemp: any = {
		'LightEffect': 5,
		'LSbrightness': 0.5,
		'LSspeed': 100,
		'LSdirection': 1,
		'changeTime': 10,
		'ttitle': '龙腾',
		'changeStatus': false,
		'changeEffect': 16,
		'ColorMode': true,
		'Color': {
			'defaultclr': '#ffffff',
			'defaultclr02': '#007fff'
		},
	}
	MeetingTemp: any = {
		'LightEffect': 6,
		'LSbrightness': 0.5,
		'LSspeed': 100,
		'LSdirection': '',
		'changeTime': 10,
		'ttitle': '邂逅',
		'changeStatus': false,
		'changeEffect': 16,
		'ColorMode': true,
		'Color': {
			'defaultclr': '#e9004c',
			'defaultclr02': '#007fff',
		},
	}
	LightrainTemp: any = {
		'LightEffect': 7,
		'LSbrightness': 0.5,
		'LSspeed': 50,
		'LSdirection': '',
		'changeTime': 10,
		'ttitle': '光雨',
		'changeStatus': false,
		'changeEffect': 16,
		'ColorMode': true,
		'Color': {
			'defaultclr': '#7fff00',
		},
	}
	BoomTemp: any = {
		'LightEffect': 8,
		'LSbrightness': 0.5,
		'LSspeed': 40,
		'LSdirection': 4,
		'changeTime': 10,
		'ttitle': '脉冲',
		'changeStatus': false,
		'changeEffect': 16,
		'ColorMode': true,
		'Color': {
			'defaultclr': '#e9004c',
			'defaultclr02': '#007fff',
		},
	}
	CrossTemp: any = {
		'LightEffect': 9,
		'LSbrightness': 0.5,
		'LSspeed': 50,
		'LSdirection': '',
		'changeTime': 10,
		'ttitle': '纵横',
		'changeStatus': false,
		'changeEffect': 16,
		'ColorMode': true,
		'Color': {
			'defaultclr': '#e9004c',
			'defaultclr02': '#007fff',
		},
	}
	FloatTemp: any = {
		'LightEffect': 10,
		'LSbrightness': 0.5,
		'LSspeed': 50,
		'LSdirection': '',
		'changeTime': 10,
		'ttitle': '飘痕',
		'changeStatus': false,
		'changeEffect': 16,
		'ColorMode': true,
		'Color': {
			'defaultclr': '#e9004c',
			'defaultclr02': '#007fff',
		},
	}
	WavesTemp: any = {
		'LightEffect': 11,
		'LSbrightness': 0.5,
		'LSspeed': 50,
		'LSdirection': 4,
		'changeTime': 10,
		'ttitle': '涟漪',
		'changeStatus': false,
		'changeEffect': 16,
		'ColorMode': true,
		'Color': {
			'defaultclr': '#e9004c',
			'defaultclr02': '#007fff',
		},
	}
	RoundTemp: any = {
		'LightEffect': 12,
		'LSbrightness': 0.5,
		'LSspeed': 6,
		'LSdirection': '',
		'changeTime': 10,
		'ttitle': '绽放',
		'changeStatus': false,
		'changeEffect': 16,
		'ColorMode': true,
		'Color': {
			'defaultclr': '#e9004c',
			'defaultclr02': '#007fff',
		},
	}
	GameeffectTemp: any = {
		'LightEffect': 13,
		'LSbrightness': 0.5,
		'LSspeed': '',
		'LSdirection': 0,
		'changeTime': 10,
		'ttitle': '游戏模式',
		'changeStatus': false,
		'changeEffect': 16,
		'ColorMode': '',
		'Color': '',
	}
	PureTemp: any = {
		'LightEffect': 14,
		'LSbrightness': 0.5,
		'LSspeed': '',
		'LSdirection': '',
		'changeTime': 10,
		'ttitle': '纯色',
		'changeStatus': false,
		'changeEffect': 16,
		'ColorMode': true,
		'Color': {
			'defaultclr': '#e9004c',
		},
	}
	BlasoulTemp: any = {
		'LightEffect': 15,
		'LSbrightness': 0.5,
		'LSspeed': 6,
		'LSdirection': '',
		'changeTime': 10,
		'ttitle': 'Blasoul',
		'changeStatus': false,
		'changeEffect': 16,
		'ColorMode': true,
		'Color': {
			'defaultclr': '#e9004c',
		},
	}
	NoneTemp: any = {
		'LightEffect': 16,
		'LSbrightness': '',
		'LSspeed': '',
		'LSdirection': '',
		'changeTime': 10,
		'ttitle': '关闭所有灯光（省电模式）',
		'changeStatus': false,
		'changeEffect': 16,
		'ColorMode': '',
		'Color': '',
	}
	fromLightEffect: any;
	sendRainbowTemp: any = [];
	sendBreathTemp: any = [];
	sendLightenTemp: any = [];
	sendCrashTemp: any = [];
	sendStarlightTemp: any = [];
	sendDragonTemp: any = [];
	sendMeetingTemp: any = [];
	sendLightrainTemp: any = [];
	sendBoomTemp: any = [];
	sendCrossTemp: any = [];
	sendFloatTemp: any = [];
	sendWavesTemp: any = [];
	sendRoundTemp: any = [];
	sendGameeffectTemp: any = [];
	sendPureTemp: any = [];
	sendBlasoulTemp: any = [];
	sendLightEffect: any = [];
	tempObj: any;
	applyFlag: any;

	fromRainbowTemp: any;
	fromBreathTemp: any;
	fromLightenTemp: any;
	fromCrashTemp: any;
	fromStarlightTemp: any;
	fromDragonTemp: any;
	fromMeetingTemp: any;
	fromLightrainTemp: any;
	fromBoomTemp: any;
	fromCrossTemp: any;
	fromFloatTemp: any;
	fromWavesTemp: any;
	fromRoundTemp: any;
	fromGameeffectTemp: any;
	fromPureTemp: any;
	fromBlasoulTemp: any;
	fromNoneTemp: any;

	rainbowTemp(e) {
		this.fromRainbowTemp = e;
	}
	breathTemp(e) {
		this.fromBreathTemp = e;
	}
	lightenTemp(e) {
		this.fromLightenTemp = e;
	}
	crashTemp(e) {
		this.fromCrashTemp = e;
	}
	starlightTemp(e) {
		this.fromStarlightTemp = e;
	}
	dragonTemp(e) {
		this.fromDragonTemp = e;
	}
	meetingTemp(e) {
		this.fromMeetingTemp = e;
	}
	lightrainTemp(e) {
		this.fromLightrainTemp = e;
	}
	boomTemp(e) {
		this.fromBoomTemp = e;
	}
	crossTemp(e) {
		this.fromCrossTemp = e;
	}
	floatTemp(e) {
		this.fromFloatTemp = e;
	}
	wavesTemp(e) {
		this.fromWavesTemp = e;
	}
	roundTemp(e) {
		this.fromRoundTemp = e;
	}
	gameeffectTemp(e) {
		this.fromGameeffectTemp = e;
	}
	pureTemp(e) {
		this.fromPureTemp = e;
	}
	blasoulTemp(e) {
		this.fromBlasoulTemp = e;
	}
	noneTemp(e) {
		this.fromNoneTemp = e;
	}
	LightEffect(e) {
		this.fromLightEffect = e;
	}
	sendApply(e) {
		if (e == 1) {
			this.updateTemp();
			// console.log('receive Apply',this.fromLightEffect);
		}
	}

	tempFlag: any = 0;
	lightCheck: any;
	allTemp() {
		let obj1 = {
			"ProfileName": this.profileName
		}
		// console.log('allTemp', this.fromLightEffect);
		this.db.getProfile(obj1).then((doc: any) => {

			if (doc[0].Light.LightSetting.LSbrightness.length == 0) {
				this.fromLightEffect = 0;
				this.timeEffect = 16;
				// console.log('db = null',this.fromLightEffect)
				this.tempObj = {
					'Rainbow': this.RainbowTemp,
					'Breath': this.BreathTemp,
					'Lighten': this.LightenTemp,
					'Crash': this.CrashTemp,
					'Starlight': this.StarlightTemp,
					'Dragon': this.DragonTemp,
					'Meeting': this.MeetingTemp,
					'Lightrain': this.LightrainTemp,
					'Boom': this.BoomTemp,
					'Cross': this.CrossTemp,
					'Float': this.FloatTemp,
					'Waves': this.WavesTemp,
					'Round': this.RoundTemp,
					'GameEffect': this.GameeffectTemp,
					'Pure': this.PureTemp,
					'Blasoul': this.BlasoulTemp,
					'None': this.NoneTemp,
				}
				setTimeout(() => {
					this.allTemp();
				}, 50);
			} else {
				console.log('db !== null', doc[0].Light.LightEffect);
				if (this.tempFlag == 0) {
					// console.log('tempFlag read')
					this.tempFlag = 1;
					this.fromLightEffect = doc[0].Light.LightEffect;
				}

				this.tempObj = {
					'Rainbow': this.fromRainbowTemp || {
						'LightEffect': 0,
						'LSbrightness': doc[0].Light.LightSetting.LSbrightness[0],
						'LSspeed': doc[0].Light.LightSetting.LSspeed[0],
						'LSdirection': doc[0].Light.LightSetting.LSdirection[0],
						'changeTime': doc[0].Light.LightSetting.changeTime[0],
						'ttitle': doc[0].Light.LightSetting.changeMode[0],
						'changeStatus': doc[0].Light.LightSetting.changeStatus[0],
						'changeEffect': doc[0].Light.LightSetting.changeEffect[0],
						'ColorMode': doc[0].Light.ColorMode[0],
						'Color': doc[0].Light.Color[0],
					},
					'Breath': this.fromBreathTemp || {
						'LightEffect': 1,
						'LSbrightness': doc[0].Light.LightSetting.LSbrightness[1],
						'LSspeed': doc[0].Light.LightSetting.LSspeed[1],
						'LSdirection': doc[0].Light.LightSetting.LSdirection[1],
						'changeTime': doc[0].Light.LightSetting.changeTime[1],
						'ttitle': doc[0].Light.LightSetting.changeMode[1],
						'changeStatus': doc[0].Light.LightSetting.changeStatus[1],
						'changeEffect': doc[0].Light.LightSetting.changeEffect[1],
						'ColorMode': doc[0].Light.ColorMode[1],
						'Color': doc[0].Light.Color[1],
					},
					'Lighten': this.fromLightenTemp || {
						'LightEffect': 2,
						'LSbrightness': doc[0].Light.LightSetting.LSbrightness[2],
						'LSspeed': doc[0].Light.LightSetting.LSspeed[2],
						'LSdirection': doc[0].Light.LightSetting.LSdirection[2],
						'changeTime': doc[0].Light.LightSetting.changeTime[2],
						'ttitle': doc[0].Light.LightSetting.changeMode[2],
						'changeStatus': doc[0].Light.LightSetting.changeStatus[2],
						'changeEffect': doc[0].Light.LightSetting.changeEffect[2],
						'ColorMode': doc[0].Light.ColorMode[2],
						'Color': doc[0].Light.Color[2],
					},
					'Crash': this.fromCrashTemp || {
						'LightEffect': 3,
						'LSbrightness': doc[0].Light.LightSetting.LSbrightness[3],
						'LSspeed': doc[0].Light.LightSetting.LSspeed[3],
						'LSdirection': doc[0].Light.LightSetting.LSdirection[3],
						'changeTime': doc[0].Light.LightSetting.changeTime[3],
						'ttitle': doc[0].Light.LightSetting.changeMode[3],
						'changeStatus': doc[0].Light.LightSetting.changeStatus[3],
						'changeEffect': doc[0].Light.LightSetting.changeEffect[3],
						'ColorMode': doc[0].Light.ColorMode[3],
						'Color': doc[0].Light.Color[3],
					},
					'Starlight': this.fromStarlightTemp || {
						'LightEffect': 4,
						'LSbrightness': doc[0].Light.LightSetting.LSbrightness[4],
						'LSspeed': doc[0].Light.LightSetting.LSspeed[4],
						'LSdirection': doc[0].Light.LightSetting.LSdirection[4],
						'changeTime': doc[0].Light.LightSetting.changeTime[4],
						'ttitle': doc[0].Light.LightSetting.changeMode[4],
						'changeStatus': doc[0].Light.LightSetting.changeStatus[4],
						'changeEffect': doc[0].Light.LightSetting.changeEffect[4],
						'ColorMode': doc[0].Light.ColorMode[4],
						'Color': doc[0].Light.Color[4],
					},
					'Dragon': this.fromDragonTemp || {
						'LightEffect': 5,
						'LSbrightness': doc[0].Light.LightSetting.LSbrightness[5],
						'LSspeed': doc[0].Light.LightSetting.LSspeed[5],
						'LSdirection': doc[0].Light.LightSetting.LSdirection[5],
						'changeTime': doc[0].Light.LightSetting.changeTime[5],
						'ttitle': doc[0].Light.LightSetting.changeMode[5],
						'changeStatus': doc[0].Light.LightSetting.changeStatus[5],
						'changeEffect': doc[0].Light.LightSetting.changeEffect[5],
						'ColorMode': doc[0].Light.ColorMode[5],
						'Color': doc[0].Light.Color[5],
					},
					'Meeting': this.fromMeetingTemp || {
						'LightEffect': 6,
						'LSbrightness': doc[0].Light.LightSetting.LSbrightness[6],
						'LSspeed': doc[0].Light.LightSetting.LSspeed[6],
						'LSdirection': doc[0].Light.LightSetting.LSdirection[6],
						'changeTime': doc[0].Light.LightSetting.changeTime[6],
						'ttitle': doc[0].Light.LightSetting.changeMode[6],
						'changeStatus': doc[0].Light.LightSetting.changeStatus[6],
						'changeEffect': doc[0].Light.LightSetting.changeEffect[6],
						'ColorMode': doc[0].Light.ColorMode[6],
						'Color': doc[0].Light.Color[6],
					},
					'Lightrain': this.fromLightrainTemp || {
						'LightEffect': 7,
						'LSbrightness': doc[0].Light.LightSetting.LSbrightness[7],
						'LSspeed': doc[0].Light.LightSetting.LSspeed[7],
						'LSdirection': doc[0].Light.LightSetting.LSdirection[7],
						'changeTime': doc[0].Light.LightSetting.changeTime[7],
						'ttitle': doc[0].Light.LightSetting.changeMode[7],
						'changeStatus': doc[0].Light.LightSetting.changeStatus[7],
						'changeEffect': doc[0].Light.LightSetting.changeEffect[7],
						'ColorMode': doc[0].Light.ColorMode[7],
						'Color': doc[0].Light.Color[7],
					},
					'Boom': this.fromBoomTemp || {
						'LightEffect': 8,
						'LSbrightness': doc[0].Light.LightSetting.LSbrightness[8],
						'LSspeed': doc[0].Light.LightSetting.LSspeed[8],
						'LSdirection': doc[0].Light.LightSetting.LSdirection[8],
						'changeTime': doc[0].Light.LightSetting.changeTime[8],
						'ttitle': doc[0].Light.LightSetting.changeMode[8],
						'changeStatus': doc[0].Light.LightSetting.changeStatus[8],
						'changeEffect': doc[0].Light.LightSetting.changeEffect[8],
						'ColorMode': doc[0].Light.ColorMode[8],
						'Color': doc[0].Light.Color[8],
					},
					'Cross': this.fromCrossTemp || {
						'LightEffect': 9,
						'LSbrightness': doc[0].Light.LightSetting.LSbrightness[9],
						'LSspeed': doc[0].Light.LightSetting.LSspeed[9],
						'LSdirection': doc[0].Light.LightSetting.LSdirection[9],
						'changeTime': doc[0].Light.LightSetting.changeTime[9],
						'ttitle': doc[0].Light.LightSetting.changeMode[9],
						'changeStatus': doc[0].Light.LightSetting.changeStatus[9],
						'changeEffect': doc[0].Light.LightSetting.changeEffect[9],
						'ColorMode': doc[0].Light.ColorMode[9],
						'Color': doc[0].Light.Color[9],
					},
					'Float': this.fromFloatTemp || {
						'LightEffect': 10,
						'LSbrightness': doc[0].Light.LightSetting.LSbrightness[10],
						'LSspeed': doc[0].Light.LightSetting.LSspeed[10],
						'LSdirection': doc[0].Light.LightSetting.LSdirection[10],
						'changeTime': doc[0].Light.LightSetting.changeTime[10],
						'ttitle': doc[0].Light.LightSetting.changeMode[10],
						'changeStatus': doc[0].Light.LightSetting.changeStatus[10],
						'changeEffect': doc[0].Light.LightSetting.changeEffect[10],
						'ColorMode': doc[0].Light.ColorMode[10],
						'Color': doc[0].Light.Color[10],
					},
					'Waves': this.fromWavesTemp || {
						'LightEffect': 11,
						'LSbrightness': doc[0].Light.LightSetting.LSbrightness[11],
						'LSspeed': doc[0].Light.LightSetting.LSspeed[11],
						'LSdirection': doc[0].Light.LightSetting.LSdirection[11],
						'changeTime': doc[0].Light.LightSetting.changeTime[11],
						'ttitle': doc[0].Light.LightSetting.changeMode[11],
						'changeStatus': doc[0].Light.LightSetting.changeStatus[11],
						'changeEffect': doc[0].Light.LightSetting.changeEffect[11],
						'ColorMode': doc[0].Light.ColorMode[11],
						'Color': doc[0].Light.Color[11],
					},
					'Round': this.fromRoundTemp || {
						'LightEffect': 12,
						'LSbrightness': doc[0].Light.LightSetting.LSbrightness[12],
						'LSspeed': doc[0].Light.LightSetting.LSspeed[12],
						'LSdirection': doc[0].Light.LightSetting.LSdirection[12],
						'changeTime': doc[0].Light.LightSetting.changeTime[12],
						'ttitle': doc[0].Light.LightSetting.changeMode[12],
						'changeStatus': doc[0].Light.LightSetting.changeStatus[12],
						'changeEffect': doc[0].Light.LightSetting.changeEffect[12],
						'ColorMode': doc[0].Light.ColorMode[12],
						'Color': doc[0].Light.Color[12],
					},
					'GameEffect': this.fromGameeffectTemp || {
						'LightEffect': 13,
						'LSbrightness': doc[0].Light.LightSetting.LSbrightness[13],
						'LSspeed': doc[0].Light.LightSetting.LSspeed[13],
						'LSdirection': doc[0].Light.LightSetting.LSdirection[13],
						'changeTime': doc[0].Light.LightSetting.changeTime[13],
						'ttitle': doc[0].Light.LightSetting.changeMode[13],
						'changeStatus': doc[0].Light.LightSetting.changeStatus[13],
						'changeEffect': doc[0].Light.LightSetting.changeEffect[13],
						'ColorMode': doc[0].Light.ColorMode[13],
						'Color': doc[0].Light.Color[13],
					},
					'Pure': this.fromPureTemp || {
						'LightEffect': 14,
						'LSbrightness': doc[0].Light.LightSetting.LSbrightness[14],
						'LSspeed': doc[0].Light.LightSetting.LSspeed[14],
						'LSdirection': doc[0].Light.LightSetting.LSdirection[14],
						'changeTime': doc[0].Light.LightSetting.changeTime[14],
						'ttitle': doc[0].Light.LightSetting.changeMode[14],
						'changeStatus': doc[0].Light.LightSetting.changeStatus[14],
						'changeEffect': doc[0].Light.LightSetting.changeEffect[14],
						'ColorMode': doc[0].Light.ColorMode[14],
						'Color': doc[0].Light.Color[14],
					},
					'Blasoul': this.fromBlasoulTemp || {
						'LightEffect': 15,
						'LSbrightness': doc[0].Light.LightSetting.LSbrightness[15],
						'LSspeed': doc[0].Light.LightSetting.LSspeed[15],
						'LSdirection': doc[0].Light.LightSetting.LSdirection[15],
						'changeTime': doc[0].Light.LightSetting.changeTime[15],
						'ttitle': doc[0].Light.LightSetting.changeMode[15],
						'changeStatus': doc[0].Light.LightSetting.changeStatus[15],
						'changeEffect': doc[0].Light.LightSetting.changeEffect[15],
						'ColorMode': doc[0].Light.ColorMode[15],
						'Color': doc[0].Light.Color[15],
					},
					'None': this.fromNoneTemp || {
						'LightEffect': 16,
						'LSbrightness': doc[0].Light.LightSetting.LSbrightness[16],
						'LSspeed': doc[0].Light.LightSetting.LSspeed[16],
						'LSdirection': doc[0].Light.LightSetting.LSdirection[16],
						'changeTime': doc[0].Light.LightSetting.changeTime[16],
						'ttitle': doc[0].Light.LightSetting.changeMode[16],
						'changeStatus': doc[0].Light.LightSetting.changeStatus[16],
						'changeEffect': doc[0].Light.LightSetting.changeEffect[16],
						'ColorMode': doc[0].Light.ColorMode[16],
						'Color': doc[0].Light.Color[16],
					},
				}
			}
		})
	}
	testAllTemp() {
		console.log('light effect', this.fromLightEffect)
	}
	checkFrtp: any;
	titleFrtp: any;
	updateTemp() {
		// //console.log(this.tempObj);
		this.allTemp();
		// console.log('in updateTemp' , this.fromLightEffect)
		//console.log("update TEMP")
		let obj1 = {
			"ProfileName": this.profileName
		}
		this.db.getProfile(obj1).then((doc: any) => {
			// //console.log(a);
			// console.log('update Temp doc', doc[0]);
			// console.log('in temp getprofile',this.fromLightEffect);
			doc[0].Light.LightEffect = this.fromLightEffect;

			doc[0].Light.LightSetting.LSbrightness = [this.tempObj.Rainbow.LSbrightness, this.tempObj.Breath.LSbrightness, this.tempObj.Lighten.LSbrightness, this.tempObj.Crash.LSbrightness, this.tempObj.Starlight.LSbrightness, this.tempObj.Dragon.LSbrightness, this.tempObj.Meeting.LSbrightness, this.tempObj.Lightrain.LSbrightness, this.tempObj.Boom.LSbrightness, this.tempObj.Cross.LSbrightness, this.tempObj.Float.LSbrightness, this.tempObj.Waves.LSbrightness, this.tempObj.Round.LSbrightness, this.tempObj.GameEffect.LSbrightness, this.tempObj.Pure.LSbrightness, this.tempObj.Blasoul.LSbrightness];

			doc[0].Light.LightSetting.LSspeed = [this.tempObj.Rainbow.LSspeed, this.tempObj.Breath.LSspeed, this.tempObj.Lighten.LSspeed, this.tempObj.Crash.LSspeed, this.tempObj.Starlight.LSspeed, this.tempObj.Dragon.LSspeed, this.tempObj.Meeting.LSspeed, this.tempObj.Lightrain.LSspeed, this.tempObj.Boom.LSspeed, this.tempObj.Cross.LSspeed, this.tempObj.Float.LSspeed, this.tempObj.Waves.LSspeed, this.tempObj.Round.LSspeed, this.tempObj.GameEffect.LSspeed, this.tempObj.Pure.LSspeed, this.tempObj.Blasoul.LSspeed];

			doc[0].Light.LightSetting.LSdirection = [this.tempObj.Rainbow.LSdirection, this.tempObj.Breath.LSdirection, this.tempObj.Lighten.LSdirection, this.tempObj.Crash.LSdirection, this.tempObj.Starlight.LSdirection, this.tempObj.Dragon.LSdirection, this.tempObj.Meeting.LSdirection, this.tempObj.Lightrain.LSdirection, this.tempObj.Boom.LSdirection, this.tempObj.Cross.LSdirection, this.tempObj.Float.LSdirection, this.tempObj.Waves.LSdirection, this.tempObj.Round.LSdirection, this.tempObj.GameEffect.LSdirection, this.tempObj.Pure.LSdirection, this.tempObj.Blasoul.LSdirection];

			doc[0].Light.LightSetting.changeTime = [this.tempObj.Rainbow.changeTime, this.tempObj.Breath.changeTime, this.tempObj.Lighten.changeTime, this.tempObj.Crash.changeTime, this.tempObj.Starlight.changeTime, this.tempObj.Dragon.changeTime, this.tempObj.Meeting.changeTime, this.tempObj.Lightrain.changeTime, this.tempObj.Boom.changeTime, this.tempObj.Cross.changeTime, this.tempObj.Float.changeTime, this.tempObj.Waves.changeTime, this.tempObj.Round.changeTime, this.tempObj.GameEffect.changeTime, this.tempObj.Pure.changeTime, this.tempObj.Blasoul.changeTime];

			doc[0].Light.LightSetting.changeMode = [this.tempObj.Rainbow.ttitle, this.tempObj.Breath.ttitle, this.tempObj.Lighten.ttitle, this.tempObj.Crash.ttitle, this.tempObj.Starlight.ttitle, this.tempObj.Dragon.ttitle, this.tempObj.Meeting.ttitle, this.tempObj.Lightrain.ttitle, this.tempObj.Boom.ttitle, this.tempObj.Cross.ttitle, this.tempObj.Float.ttitle, this.tempObj.Waves.ttitle, this.tempObj.Round.ttitle, this.tempObj.GameEffect.ttitle, this.tempObj.Pure.ttitle, this.tempObj.Blasoul.ttitle];

			doc[0].Light.LightSetting.changeStatus = [this.tempObj.Rainbow.changeStatus, this.tempObj.Breath.changeStatus, this.tempObj.Lighten.changeStatus, this.tempObj.Crash.changeStatus, this.tempObj.Starlight.changeStatus, this.tempObj.Dragon.changeStatus, this.tempObj.Meeting.changeStatus, this.tempObj.Lightrain.changeStatus, this.tempObj.Boom.changeStatus, this.tempObj.Cross.changeStatus, this.tempObj.Float.changeStatus, this.tempObj.Waves.changeStatus, this.tempObj.Round.changeStatus, this.tempObj.GameEffect.changeStatus, this.tempObj.Pure.changeStatus, this.tempObj.Blasoul.changeStatus];

			doc[0].Light.LightSetting.changeEffect = [this.tempObj.Rainbow.changeEffect, this.tempObj.Breath.changeEffect, this.tempObj.Lighten.changeEffect, this.tempObj.Crash.changeEffect, this.tempObj.Starlight.changeEffect, this.tempObj.Dragon.changeEffect, this.tempObj.Meeting.changeEffect, this.tempObj.Lightrain.changeEffect, this.tempObj.Boom.changeEffect, this.tempObj.Cross.changeEffect, this.tempObj.Float.changeEffect, this.tempObj.Waves.changeEffect, this.tempObj.Round.changeEffect, this.tempObj.GameEffect.changeEffect, this.tempObj.Pure.changeEffect, this.tempObj.Blasoul.changeEffect];

			doc[0].Light.Color = [this.tempObj.Rainbow.Color, this.tempObj.Breath.Color, this.tempObj.Lighten.Color, this.tempObj.Crash.Color, this.tempObj.Starlight.Color, this.tempObj.Dragon.Color, this.tempObj.Meeting.Color, this.tempObj.Lightrain.Color, this.tempObj.Boom.Color, this.tempObj.Cross.Color, this.tempObj.Float.Color, this.tempObj.Waves.Color, this.tempObj.Round.Color, this.tempObj.GameEffect.Color, this.tempObj.Pure.Color, this.tempObj.Blasoul.Color];

			doc[0].Light.ColorMode = [this.tempObj.Rainbow.ColorMode, this.tempObj.Breath.ColorMode, this.tempObj.Lighten.ColorMode, this.tempObj.Crash.ColorMode, this.tempObj.Starlight.ColorMode, this.tempObj.Dragon.ColorMode, this.tempObj.Meeting.ColorMode, this.tempObj.Lightrain.ColorMode, this.tempObj.Boom.ColorMode, this.tempObj.Cross.ColorMode, this.tempObj.Float.ColorMode, this.tempObj.Waves.ColorMode, this.tempObj.Round.ColorMode, this.tempObj.GameEffect.ColorMode, this.tempObj.Pure.ColorMode, this.tempObj.Blasoul.ColorMode];

			this.sendRainbowTemp = [doc[0].Light.LightSetting.LSbrightness[0], doc[0].Light.LightSetting.LSspeed[0], doc[0].Light.LightSetting.LSdirection[0], doc[0].Light.LightSetting.changeTime[0], doc[0].Light.LightSetting.changeMode[0], doc[0].Light.LightEffect, doc[0].Light.LightSetting.changeStatus[0], doc[0].Light.LightSetting.changeEffect[0], doc[0].Light.ColorMode[0], doc[0].Light.Color[0]];

			this.sendBreathTemp = [doc[0].Light.LightSetting.LSbrightness[1], doc[0].Light.LightSetting.LSspeed[1], doc[0].Light.LightSetting.LSdirection[1], doc[0].Light.LightSetting.changeTime[1], doc[0].Light.LightSetting.changeMode[1], doc[0].Light.LightEffect, doc[0].Light.LightSetting.changeStatus[1], doc[0].Light.LightSetting.changeEffect[1], doc[0].Light.ColorMode[1], doc[0].Light.Color[1]];

			this.sendLightenTemp = [doc[0].Light.LightSetting.LSbrightness[2], doc[0].Light.LightSetting.LSspeed[2], doc[0].Light.LightSetting.LSdirection[2], doc[0].Light.LightSetting.changeTime[2], doc[0].Light.LightSetting.changeMode[2], doc[0].Light.LightEffect, doc[0].Light.LightSetting.changeStatus[2], doc[0].Light.LightSetting.changeEffect[2], doc[0].Light.ColorMode[2], doc[0].Light.Color[2]];

			this.sendCrashTemp = [doc[0].Light.LightSetting.LSbrightness[3], doc[0].Light.LightSetting.LSspeed[3], doc[0].Light.LightSetting.LSdirection[3], doc[0].Light.LightSetting.changeTime[3], doc[0].Light.LightSetting.changeMode[3], doc[0].Light.LightEffect, doc[0].Light.LightSetting.changeStatus[3], doc[0].Light.LightSetting.changeEffect[3], doc[0].Light.ColorMode[3], doc[0].Light.Color[3]];

			this.sendStarlightTemp = [doc[0].Light.LightSetting.LSbrightness[4], doc[0].Light.LightSetting.LSspeed[4], doc[0].Light.LightSetting.LSdirection[4], doc[0].Light.LightSetting.changeTime[4], doc[0].Light.LightSetting.changeMode[4], doc[0].Light.LightEffect, doc[0].Light.LightSetting.changeStatus[4], doc[0].Light.LightSetting.changeEffect[4], doc[0].Light.ColorMode[4], doc[0].Light.Color[4]];

			this.sendDragonTemp = [doc[0].Light.LightSetting.LSbrightness[5], doc[0].Light.LightSetting.LSspeed[5], doc[0].Light.LightSetting.LSdirection[5], doc[0].Light.LightSetting.changeTime[5], doc[0].Light.LightSetting.changeMode[5], doc[0].Light.LightEffect, doc[0].Light.LightSetting.changeStatus[5], doc[0].Light.LightSetting.changeEffect[5], doc[0].Light.ColorMode[5], doc[0].Light.Color[5]];

			this.sendMeetingTemp = [doc[0].Light.LightSetting.LSbrightness[6], doc[0].Light.LightSetting.LSspeed[6], doc[0].Light.LightSetting.LSdirection[6], doc[0].Light.LightSetting.changeTime[6], doc[0].Light.LightSetting.changeMode[6], doc[0].Light.LightEffect, doc[0].Light.LightSetting.changeStatus[6], doc[0].Light.LightSetting.changeEffect[6], doc[0].Light.ColorMode[6], doc[0].Light.Color[6]];

			this.sendLightrainTemp = [doc[0].Light.LightSetting.LSbrightness[7], doc[0].Light.LightSetting.LSspeed[7], doc[0].Light.LightSetting.LSdirection[7], doc[0].Light.LightSetting.changeTime[7], doc[0].Light.LightSetting.changeMode[7], doc[0].Light.LightEffect, doc[0].Light.LightSetting.changeStatus[7], doc[0].Light.LightSetting.changeEffect[7], doc[0].Light.ColorMode[7], doc[0].Light.Color[7]];

			this.sendBoomTemp = [doc[0].Light.LightSetting.LSbrightness[8], doc[0].Light.LightSetting.LSspeed[8], doc[0].Light.LightSetting.LSdirection[8], doc[0].Light.LightSetting.changeTime[8], doc[0].Light.LightSetting.changeMode[8], doc[0].Light.LightEffect, doc[0].Light.LightSetting.changeStatus[8], doc[0].Light.LightSetting.changeEffect[8], doc[0].Light.ColorMode[8], doc[0].Light.Color[8]];

			this.sendCrossTemp = [doc[0].Light.LightSetting.LSbrightness[9], doc[0].Light.LightSetting.LSspeed[9], doc[0].Light.LightSetting.LSdirection[9], doc[0].Light.LightSetting.changeTime[9], doc[0].Light.LightSetting.changeMode[9], doc[0].Light.LightEffect, doc[0].Light.LightSetting.changeStatus[9], doc[0].Light.LightSetting.changeEffect[9], doc[0].Light.ColorMode[9], doc[0].Light.Color[9]];

			this.sendFloatTemp = [doc[0].Light.LightSetting.LSbrightness[10], doc[0].Light.LightSetting.LSspeed[10], doc[0].Light.LightSetting.LSdirection[10], doc[0].Light.LightSetting.changeTime[10], doc[0].Light.LightSetting.changeMode[10], doc[0].Light.LightEffect, doc[0].Light.LightSetting.changeStatus[10], doc[0].Light.LightSetting.changeEffect[10], doc[0].Light.ColorMode[10], doc[0].Light.Color[10]];

			this.sendWavesTemp = [doc[0].Light.LightSetting.LSbrightness[11], doc[0].Light.LightSetting.LSspeed[11], doc[0].Light.LightSetting.LSdirection[11], doc[0].Light.LightSetting.changeTime[11], doc[0].Light.LightSetting.changeMode[11], doc[0].Light.LightEffect, doc[0].Light.LightSetting.changeStatus[11], doc[0].Light.LightSetting.changeEffect[11], doc[0].Light.ColorMode[11], doc[0].Light.Color[11]];

			this.sendRoundTemp = [doc[0].Light.LightSetting.LSbrightness[12], doc[0].Light.LightSetting.LSspeed[12], doc[0].Light.LightSetting.LSdirection[12], doc[0].Light.LightSetting.changeTime[12], doc[0].Light.LightSetting.changeMode[12], doc[0].Light.LightEffect, doc[0].Light.LightSetting.changeStatus[12], doc[0].Light.LightSetting.changeEffect[12], doc[0].Light.ColorMode[12], doc[0].Light.Color[12]];

			this.sendGameeffectTemp = [doc[0].Light.LightSetting.LSbrightness[13], doc[0].Light.LightSetting.LSspeed[13], doc[0].Light.LightSetting.LSdirection[13], doc[0].Light.LightSetting.changeTime[13], doc[0].Light.LightSetting.changeMode[13], doc[0].Light.LightEffect, doc[0].Light.LightSetting.changeStatus[13], doc[0].Light.LightSetting.changeEffect[13], doc[0].Light.ColorMode[13], doc[0].Light.Color[13]];

			this.sendPureTemp = [doc[0].Light.LightSetting.LSbrightness[14], doc[0].Light.LightSetting.LSspeed[14], doc[0].Light.LightSetting.LSdirection[14], doc[0].Light.LightSetting.changeTime[14], doc[0].Light.LightSetting.changeMode[14], doc[0].Light.LightEffect, doc[0].Light.LightSetting.changeStatus[14], doc[0].Light.LightSetting.changeEffect[14], doc[0].Light.ColorMode[14], doc[0].Light.Color[14]];

			this.sendBlasoulTemp = [doc[0].Light.LightSetting.LSbrightness[15], doc[0].Light.LightSetting.LSspeed[15], doc[0].Light.LightSetting.LSdirection[15], doc[0].Light.LightSetting.changeTime[15], doc[0].Light.LightSetting.changeMode[15], doc[0].Light.LightEffect, doc[0].Light.LightSetting.changeStatus[15], doc[0].Light.LightSetting.changeEffect[15], doc[0].Light.ColorMode[15], doc[0].Light.Color[15]];

			this.db.UpdateProfile(doc[0].id, doc[0]).then((any: any) => {
				// console.log('update Temp doc ended',doc[0])
				// //console.log('sendRainbowTemp', this.sendRainbowTemp);
				// //console.log('sendBreathTemp', this.sendBreathTemp);
				// //console.log('sendLightenTemp', this.sendLightenTemp);
				//console.log('All Temp', this.tempObj);
				// setTimeout(() => {			
				// 	this.whenLoading(0)
				// }, 5000);
			})
		})
	}



	testgetkeyMatrix() {
		let data = {
			profile: this.changeProfile,

		}

		let obj1 = {
			Type: funcVar.FuncType.Device,
			Func: funcVar.FuncName.GetKeyMatrix,
			Param: data

		}
		this.protocol.RunSetFunction(obj1).then((data) => {
			console.log('Q:', data[8]);
			console.log('Q:', data[136]);
		})
	}


	seeproindex() {
		console.log(this.profileindex);
	}

	cleanKBdata() {

		let data = {
			profile: this.changeProfile

		}

		let obj1 = {
			Type: funcVar.FuncType.Device,
			Func: funcVar.FuncName.GetKeyMatrix,
			Param: data

		}
		this.protocol.RunSetFunction(obj1).then((data) => {
			console.log('reset333');
			//console.log("Container RunSetFunction:" + data);

			for (let index = 0; index < this.KCTarr.length; index++) {

				data[index] = this.KCTarr[index];

			}

			data[222] = 0x00;
			data[230] = 0x00;
			data[213] = 0xB3;
			data[200] = 0xB3;

			if (this.changeProfile == '2') {
				data[124] = 0x00;
			} else {
				data[124] = 227;
			}
			//console.log('thiskeydata:' + this.KCTarr);

			// //console.log(data[7]);
			// //console.log(data);

			let content = {
				profile: this.changeProfile,
				KeyData: data
			}

			let obj2 = {
				Type: funcVar.FuncType.Device,
				Func: funcVar.FuncName.SetKeyMatrix,
				Param: content

			}

			setTimeout(() => {
				this.protocol.RunSetFunction(obj2).then((data) => {
					console.log('reset444');
				});

			}, 50);
		})
	}


	seeSpecialkeystatus(spKeyfromDB) {
		console.log('seeSpecialkeystatus');
		if (spKeyfromDB.Key.winstatus !== undefined && spKeyfromDB.Key.winstatus !== null && spKeyfromDB.Key.winstatus !== "") {
			this.blockWindowsKeystatus = spKeyfromDB.Key.winstatus;
		}

		if (spKeyfromDB.Key.capsstatus !== undefined && spKeyfromDB.Key.capsstatus !== null && spKeyfromDB.Key.capsstatus !== "") {
			this.CCstatus = spKeyfromDB.Key.capsstatus;
		} else {
			this.CCstatus = 1; //預設值
		}

		console.log('this.blockWindowsKeystatus:', this.blockWindowsKeystatus);
		console.log('this.CCstatus:', this.CCstatus);

		if (this.blockWindowsKeystatus == 0) {
			console.log('this.blockWindowsKeystatus:000');
			this.backtowins = true;
			this.blockwins = false;
		} else if (this.blockWindowsKeystatus == 1) {
			console.log('this.blockWindowsKeystatus:111');
			this.backtowins = false;
			this.blockwins = true;
		} else {
			this.callName(0);
		}


		if (this.CCstatus == 0) {
			console.log('this.CCstatus:000');
			this.backtocc = true;
			this.ccstart = false;
		} else if (this.CCstatus == 1) {
			console.log('this.CCstatus:111');
			this.backtocc = false;
			this.ccstart = true;
		} else {
			this.callName(0);
		}
	}




	savestatus(specialKey, num, keydatain, funName) {

		let obj = {
			"ProfileName": this.profileName
		}
		this.db.getProfile(obj).then((doc: any) => {

			// "winstatus": 1,
			// "capsstatus": 1,
			// doc[0].winstatus = this.blockWindowsKeystatus;

			let result;
			(function () {

				let AllfunName = {
					"func01": 'blockWindowsKey',
					"func02": 'CtrltoCaps'
				}

				console.log('funName:', funName);


				if (funName == AllfunName.func01) {

					if (specialKey == 1) {
						console.log('specialKey==1:', specialKey);
						console.log('doc[0]:', doc[0]);
						// console.log('doc[124]:',doc[0].keyDataValue);
						doc[0].KeyDataValue[num] = keydatain;

					} else if (specialKey == 0) {
						doc[0].KeyDataValue[num] = 0xB3;
					}

					doc[0].Key.winstatus = specialKey;
				}


				if (funName == AllfunName.func02) {


					console.log('specialKey==2:', specialKey);
					console.log('doc[0]:', doc[0]);
					// console.log('doc[124]:',doc[0].keyDataValue);
					doc[0].KeyDataValue[num[0]] = keydatain[0];
					doc[0].KeyDataValue[num[1]] = keydatain[1];
					doc[0].KeyDataValue[num[2]] = keydatain[2];


					doc[0].Key.capsstatus = specialKey;
				}


				result = doc[0];
				console.log('showdoc[0]:', result);

			})()

			// console.log('doc[0].keyDataValue',doc[0].keyDataValue);
			this.db.UpdateProfile(doc[0].id, result).then((doc: any) => {

			})
		})
	}

	gameModesetblock() {
		let AltF4;
		let AltTab;
		let ShiftTab;

		let obj = {
			'ProfileName': '游戏模式'
		}
		this.db.getProfile(obj).then((doc: any) => {

			AltF4 = doc[0].GameMode[0];
			AltTab = doc[0].GameMode[1];
			ShiftTab = doc[0].GameMode[2];

			// console.log("0A", doc[0].GameMode[0]);
			// console.log("0B", doc[0].GameMode[1]);
			// console.log("0C", doc[0].GameMode[2]);

		})


		setTimeout(() => {
			this.kbSetting(AltTab, AltF4, ShiftTab);
			//console.log('上次紀錄的下值')
			// console.log("A", AltF4);
			// console.log("B", AltTab);
			// console.log("C", ShiftTab);
		}, 100);
	}



	kbSetting(AltTab, AltF4, ShiftTab) {//下值

		console.log('kbsetting');
		if (this.gameclick == 0) {
			this.gameclick++;
			this.getGame = '';

			setTimeout(() => {
				this.getGame = 'stopApmode';

			}, 20);


			// }

			setTimeout(() => {


				let data = {
					profile: '2',
				}
				let obj1 = {
					Type: funcVar.FuncType.Device,
					Func: funcVar.FuncName.SetProfie,
					Param: data
				}
				this.protocol.RunSetFunction(obj1).then((data) => {
					// //console.log("Container RunSetFunction:" + data);
					//console.log('test1111');
					// console.log("1111A", AltF4);
					// console.log("1111B", AltTab);
					// console.log("1111C", ShiftTab);




					let data2 = {
						profile: '2',    //profile  0:reset, 1:Profile1 2:Profile2
						AltTabFun: AltTab,
						AltF4Fun: AltF4,
						ShiftTabFun: ShiftTab,
						mode: '0x0e', //1~15 代表不同Mode
						light: '0x14',    //0~32 燈光亮度


					}


					let obj2 = {
						Type: funcVar.FuncType.Device,
						Func: funcVar.FuncName.SetCommand,
						Param: data2
					}
					this.protocol.RunSetFunction(obj2).then((data2) => {


					});
				});
			}, 500);
		}
	}


	allprofileReset() {
		this.whenLoading(1);
		let vm = this;
		(function () {
			vm.getGame = "";
			setTimeout(() => {
				vm.getGame = "stopApmode";
			}, 10);
		})()
		this.db.getAllProfile().then((doc: any) => {
			let resetProArr = [];
			for (let index = 0; index < doc.length; index++) {

				resetProArr.push(doc[index].id);

				if (index == doc.length - 1) {
					console.log('resetProArr:', resetProArr);
					if (resetProArr.length !== 0) {
						for (let i = 0; i < resetProArr.length; i++) {
							let resetID = resetProArr[i];

							this.db.DeleteProfile(resetID).then((doc: any) => {
							})


							if (i == resetProArr.length - 1) {
								this.colseSelfdf();
								this.pick01();
								this.names = ['游戏模式', '配置文件1'];
								this.FnF12profilename = this.names[1];
								this.addpro1();


							}
						}

					}
				}

			}


		})
	}

}


	// Rclr: any;
	// Gclr: any;
	// Bclr: any;
	// docanvas() {
	// 	var canvas = document.getElementById("myCanvas") as HTMLCanvasElement;
	// 	let vm = this;
	// 	// if (canvas && canvas.getContext('2d')) {
	// 	console.log('canvas in ');
	// 	var context = canvas.getContext('2d');
	// 	var myImg = document.getElementById("Img") as HTMLCanvasElement;

	// 	context.drawImage(myImg, 0, 0);

	// 	document.addEventListener("click", function (event) {
	// 		let actualX = Math.floor(event.pageX - canvas.offsetLeft);
	// 		let actualY = Math.floor(event.pageY - canvas.offsetTop);
	// 		let pixelData = context.getImageData(actualX, actualY, 1, 1);
	// 		let data = pixelData.data;
	// 		console.log('R:', data[0]);
	// 		console.log('G:', data[1]);
	// 		console.log('B:', data[2]);
	// 		console.log('A:', data[3]);
	// 		vm.Rclr = data[0];
	// 		vm.Gclr = data[1];
	// 		vm.Bclr = data[2];

	// 		// rgba(0, 0, 0, 1)
	// 		document.getElementById("showcolor").style.backgroundColor = 'rgba(' + data[0] + ',' + data[1] + ',' + data[2] + ',' + data[3] + ')';
	// 		// console.log('x:',Math.floor(event.pageX-canvas.offsetLeft));
	// 		// console.log('y:',Math.floor(event.pageY-canvas.offsetTop));

	// 	})
	// }

	// Openclrpicker(e) {
	// 	if (e == 'Openclrpicker') {
	// 		console.log('Openclrpicker0000');

	// 		document.getElementById('clrpicker').style.display = 'block';
	// 		setTimeout(() => {
	// 			this.docanvas();
	// 		}, 20);
	// 	}

	// 	if (e == 'Closeclrpicker') {
	// 		console.log('Closeclrpicker00000');
	// 		document.getElementById('clrpicker').style.display = 'none';
	// 	}
	// }

	// seeData: any = {
	// 	here: this,
	// 	showDb: [],
	// 	seeAllDB: function () {
	// 		let vm = this.here;
	// 		let showDb = this.showDb;
	// 		window.addEventListener('keydown', GetDBContent);
	// 		function GetDBContent(e) {
	// 			let charcode = e.keyCode;
	// 			// gg--spyy
	// 			// 71,71,189,189,83,80,89,89
	// 			showDb.push(charcode);
	// 			// console.log('showDb:', showDb)
	// 			if (e.keyCode == 13) {
	// 				let identi = showDb[0] == 71 && showDb[1] == 71 && showDb[2] == 189 && showDb[3] == 189 && showDb[4] == 83 && showDb[5] == 80 && showDb[6] == 89 && showDb[7] == 89;
	// 				if (identi) {
	// 					vm.db.getAllProfile().then((doc: any) => {
	// 						console.log("所有的profile內容");
	// 						console.log(doc);
	// 					})
	// 					showDb.length = 0;
	// 					// console.log('yes');
	// 				}
	// 				else if (showDb[0] !== 71) {
	// 					// console.log('no',showDb);
	// 					// console.log('boolean',showDb[0]==71);
	// 					showDb.length = 0;
	// 					// console.log('showDb:', showDb)
	// 				}
	// 			}
	// 		}
	// 	}
	// };

	// doshowDB() {
	// 	this.seeData.seeAllDB();
	// }


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


	// DefaultblockKeyFromDb(obj,data){
	// 	let setBlockKeys=obj;

	// 	for (let index = 0; index < setBlockKeys.shelfblock01.length; index++) {


	// 	}
	// }

