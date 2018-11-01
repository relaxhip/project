var events = require('events');
var env = require('../others/env');
var fs = require('fs');
var path = require('path');
var funcVar = require('../others/FunctionVariable');
var evtType = require('../others/EventVariable').EventTypes;
var device = require('./device/device');
var AppObj = require("../dbapi/AppDB");
var updateObj = require('../others/update');
var InitDeviceFlag = false;
var os = require('os');
var appFullPath = undefined;


'use strict';

var __extends = this.__extends || function (d, b) {
    for (var p in b)
        if (b.hasOwnProperty(p)) d[p] = b[p];

    function __() {
        this.constructor = d;
    }
    __.prototype = b.prototype;
    d.prototype = new __();
};

var ProtocolInterface = (function (_super) {
    __extends(ProtocolInterface, _super);
    var _this;

    function ProtocolInterface() {
        try {
            _this = this;
            _super.call(this);
            env.log( 'Interface', 'ProtocolInterface', " New ProtocolInterface INSTANCE. ");

            if (env.isWindows) {
                if (env.arch == 'ia32')
                    _this.hiddevice = require(`./nodeDriver/win32/hiddevice.node`);
                else
                    _this.hiddevice = require(`./nodeDriver/win64/hiddevice.node`);

            } else if (env.isMac) {
                _this.hiddevice = require(`./nodeDriver/darwin/hiddevicemac.node`);
            }
            _this.update = new updateObj.UpdateClass();
            _this.AppDB = new AppObj.AppDB();

            _this.hiddevice.DebugMessageCallback(_this.DebugCallback);
            _this.hiddevice.StartHidPnpNotify();
            _this.hiddevice.HIDPnpCallBack(_this.HIDDevicePnp);

            if (_this.hiddevice === undefined)
                env.log( "Interface", "InterfaceClass", `hiddevice init error.`);

            // _this.DeviceApi = new device.DeviceApi();    
            // _this.DeviceApi.on(evtType.ProtocolMessage, _this.OnProtocolMessage);   

            // _this.update.on(evtType.ProtocolMessage, _this.OnProtocolMessage);
            // setTimeout(function(){
            //     _this.update.UpdateFW().then(function(data){});  
            // },6000);      
        } catch (ex) {
            env.log('Interface Error', 'ProtocolInterface', `ex:${ex.message}`);
        }
    }

    ProtocolInterface.prototype.HIDDevicePnp = function (Obj) {
        env.log('Interface', 'HIDDevicePnp', JSON.stringify(Obj));
        if (Obj.vid == 6493 && Obj.pid == 8289 && Obj.status == 1) {
            if (InitDeviceFlag == false) {
                // var flag = 0;
                // while(!InitDeviceFlag || flag!=5){
                //     setTimeout(function(){
                //         env.log('DEBUGMessage','Interface','HIDDevicePnp','FindDevice');       
                //         InitDeviceFlag = _this.hiddevice.FindDevice(6493, 8289);  
                //         flag++;           
                //         env.log('DEBUGMessage','Interface','FindDevice',InitDeviceFlag);   
                //         if(_this.DeviceApi==undefined && InitDeviceFlag){
                //             _this.DeviceApi = new device.DeviceApi(_this.hiddevice); 
                //             var Obj2={
                //                 Type : funcVar.FuncType.System,
                //                 SN : null,
                //                 Func : evtType.RefreshDevice,
                //                 Param : 1
                //             };
                //             _this.emit(evtType.ProtocolMessage, Obj2);
                //         }
                //     },1000); 
                // } 

                // for (var i = 0; i <= 5; i++) {
                //     (function() {
                //         setTimeout(function(){
                //             env.log('DEBUGMessage','Interface','HIDDevicePnp','FindDevice');

                //             InitDeviceFlag = _this.hiddevice.FindDevice(6493, 8289);  

                //             env.log('DEBUGMessage','Interface','FindDevice',InitDeviceFlag);   
                //             if(_this.DeviceApi==undefined && InitDeviceFlag){
                //                 _this.DeviceApi = new device.DeviceApi(_this.hiddevice); 
                //                 var Obj2={
                //                     Type : funcVar.FuncType.System,
                //                     SN : null,
                //                     Func : evtType.RefreshDevice,
                //                     Param : 1
                //                 };
                //                 _this.emit(evtType.ProtocolMessage, Obj2);
                //                 i = 6;
                //             }
                //         }, 500);
                //     })(i);
                //  }

                var looptime = 0;
                var DeviceFlags = setInterval(function () {

                    env.log('Interface', 'HIDDevicePnp', 'FindDevice');

                    InitDeviceFlag = _this.hiddevice.FindDevice(6493, 8289);

                    env.log('Interface', 'FindDevice', InitDeviceFlag);
                    if (InitDeviceFlag) {
                        if (_this.DeviceApi == undefined) {
                            _this.DeviceApi = new device.DeviceApi(_this.hiddevice);
                            if (env.isWindows) {
                                var rtn = _this.hiddevice.DeviceDataCallback(0xff00, 0xff00, _this.HIDEP2Data);
                                env.log('Interface', 'HIDDevicePnp DeviceDataCallback : ', rtn);
                            
                                //capture key data
                                _this.hiddevice.KeyboardDataCallback(1, _this.KeyDataCallback);

                                //application event
                                // _this.hiddevice.ForgroundAppEvent(_this.AppEventCallback);
                            
                            }
                        }

                        setTimeout(function() 
                        {
                            var Obj2 = {
                                Type: funcVar.FuncType.System,
                                SN: null,
                                Func: evtType.RefreshDevice,
                                Param: 1
                            };
                            _this.emit(evtType.ProtocolMessage, Obj2);
                        },3000);
                        clearInterval(DeviceFlags);
                        DeviceFlags = undefined;
                    }

                    if (looptime > 5) {
                        clearInterval(DeviceFlags);
                        DeviceFlags = undefined;
                    }

                    looptime++;
                }, 500);

                if (InitDeviceFlag == false)
                    env.log('Interface Error', 'HIDDevicePnp', 'init fail');
            }

        } else if (Obj.vid == 6493 && Obj.pid == 8289 && Obj.status == 0) {
            var Obj2 = {
                Type: funcVar.FuncType.System,
                SN: null,
                Func: evtType.RefreshDevice,
                Param: 0
            };

            _this.emit(evtType.ProtocolMessage, Obj2);
            _this.DeviceApi = undefined;
            InitDeviceFlag = false;
        }

        env.log('Interface', '_this.DeviceApi', 'InitDeviceFlag :' + InitDeviceFlag);
    }


    ProtocolInterface.prototype.SetProfie = function (profile) {
        var Data = new Buffer(new Array(64));

        return new Promise(function (resolve, reject) {
            Data[0] = 0x07;
            Data[1] = 0x01;
            Data[2] = profile; //Profile

            var rtnData = _this.SetFeatureReport(Data).then(function () {

                _this.GetFeatureReport();
                resolve();
            })
        });

        // _this.GetFeatureReport();
    }

    ProtocolInterface.prototype.DebugCallback = function (Obj) {
        env.log('Interface', 'DebugCallback', JSON.stringify(Obj));

    }

    ProtocolInterface.prototype.HIDEP2Data = function (Obj) {
        // env.log('Interface', 'HIDEP2Data', JSON.stringify(Obj));

        var Obj2 = {
            Type: funcVar.FuncType.System,
            SN: null,
            Func: evtType.HIDEP2Data,
            Param: Obj
        };
        _this.emit(evtType.ProtocolMessage, Obj2);

    }

    ProtocolInterface.prototype.KeyDataCallback = function (Obj) {
        // env.log('Interface','KeyData',JSON.stringify(Obj));

        var Obj2={
            Type : funcVar.FuncType.System,
            SN : null,
            Func : evtType.KeyDataCallback,
            Param : Obj
        };
        _this.emit(evtType.ProtocolMessage, Obj2);

    }

    //Application Event callback
    ProtocolInterface.prototype.AppEventCallback = function (Obj) {
        env.log('Interface','AppEventCallback',JSON.stringify(Obj));
        if(appFullPath == undefined)
            appFullPath = Obj;
        if(appFullPath != Obj){
            appFullPath = Obj;
            var Obj2={
                Type : funcVar.FuncType.System,
                SN : null,
                Func : evtType.AppChanged,
                Param : Obj
            };
            _this.emit(evtType.ProtocolMessage, Obj2);
        }
    }

    ProtocolInterface.prototype.OnProtocolMessage = function (Obj) {
        _this.emit(evtType.ProtocolMessage, Obj);
    }


    //运行函数
    ProtocolInterface.prototype.RunFunction = function (Obj, callback) {
        try {
            // env.log(env.level.DEBUG,'Interface','RunFunction',JSON.stringify(Obj)); 
            if (!_this.CheckParam(Obj)) {
                callback('Error', 'ProtocolInterface.RunFunction');
                return;
            }
            if (Obj.Func == funcVar.FuncName.InitDevice) {
                _this.InitDevice(callback);
                return;
            }

            if (Obj.Func == funcVar.FuncName.UpdateApp) {
                _this.update.UpdateApp();
                return;
            } else if (Obj.Func == funcVar.FuncName.DownloadInstallPackage) {
                _this.update.DownloadInstallPackage().then(function (data) {});
                return;
            } else if (Obj.Func == funcVar.FuncName.UpdateFW) {
                _this.update.UpdateFW();
                return;
            } else if (Obj.Func == funcVar.FuncName.DownloadFWInstallPackage) {
                _this.update.DownloadFWInstallPackage().then(function (data) {});
                return;
            } else if (Obj.Func == funcVar.FuncName.ChangeWindowSize) {
                var options = {
                    Type: funcVar.FuncType.System,
                    Func: evtType.ChangeWindowSize,
                    Param: Obj.Param
                }
                _this.emit(evtType.ProtocolMessage, options);
                return;
            } else if (Obj.Func == funcVar.FuncName.SendKey) {
                _this.SendKey(Obj.Param);
            }
            else if (Obj.Func == funcVar.FuncName.ExportProfile) {
                _this.ExportProfile(Obj.Param);
            }else if (Obj.Func == funcVar.FuncName.QuitApp) {
                var options = {
                    Type: funcVar.FuncType.System,
                    Func: evtType.QuitApp,
                    Param: Obj.Param
                }
                _this.emit(evtType.ProtocolMessage, options);
                return;
            }
            // else if(Obj.Func = funcVar.FuncName.SetCommand)
            // {
            //     // _this.SetProfie(1).then(function() {
            //         _this.SetProfieInfo(Obj.Param);

            //         // _this.GetKeyMatrix(1).then(function (data){
            //         //     _this.SetKeyMatrix(1, data).then(function() {
            //         //     });
            //         // });
            //         return;
            //     // });
            // }

            switch (Obj.Type) {
                case funcVar.FuncType.System:
                    _this.SystemApi.RunFunction(Obj, callback);
                    break;
                case funcVar.FuncType.Device:
                    _this.DeviceApi.RunFunction(Obj, callback);
                    break;

                default:
                    callback('InterFace RunFun Error', Obj.Type);
                    return;
            }
        } catch (ex) {
            env.log('Interface Error', 'RunFunction', ` ex:${ex.message}`);
        }
    };
    //检查参数正确性
    ProtocolInterface.prototype.CheckParam = function (Obj) {
        if (Obj === null || Obj === undefined || typeof Obj !== 'object')
            return false;
        // if (!Obj.hasOwnProperty('Type'))
        // 	return false;
        if (!Obj.hasOwnProperty('Type') || !Obj.hasOwnProperty('Func') || !Obj.hasOwnProperty('Param'))
            return false
        if (Obj.Type === null || Obj.Type === undefined || typeof Obj.Type !== 'number')
            return false;
        return true;
    };


    //初始化设备列表
    ProtocolInterface.prototype.InitDevice = function (callback) {

        // var obj = {
        //     "ProfileName": "abc",
        //     "Key": {
        //         "keyFunctionArr": [],
        //     },
        //     "FnKey": "",
        //     "Light": {
        //         "Mode": "",
        //         "Speed": "",
        //         "Color": [],
        //         "Time": "",
        //         "Into": ""
        //     },
        //     "AttLight": {
        //         "effect": "",
        //         "time": ""
        //     },
        //     "GameMode": ['0','0','0']

        // }
        // _this.AppDB.AddProfile(obj).then(function (data) {
        //     _this.AppDB.getAllProfile().then(function (data) {
        //         env.log('123', '123', '123', JSON.stringify(data))
        //     });
        // });

        env.log('Interface', 'InitDevice', ' begin.');
        if (InitDeviceFlag == 0)
            InitDeviceFlag = _this.hiddevice.FindDevice(6493, 8289);
        try {
            setTimeout(function () {
                if (InitDeviceFlag == true) {
                    if (_this.DeviceApi == undefined)
                        _this.DeviceApi = new device.DeviceApi(_this.hiddevice);

                    if (env.isWindows) {
                        //open ep3 channel
                        var rtn = _this.hiddevice.DeviceDataCallback(0xff00, 0xff00, _this.HIDEP2Data);
                        env.log('Interface', 'Init DeviceDataCallback : ', rtn);
                   
                   
                     //capture key data
                     _this.hiddevice.KeyboardDataCallback(1, _this.KeyDataCallback);

                      //application event
                    //   _this.hiddevice.ForgroundAppEvent(_this.AppEventCallback);
                   
                    }

                    var Obj2 = {
                        Type: funcVar.FuncType.Device,
                        Func: evtType.RefreshDevice,
                        Param: 1
                    };
                    _this.emit(evtType.ProtocolMessage, Obj2);

                    // _this.GetKeyMatrix(1).then(function (data){
                    //     _this.SetKeyMatrix(1, data).then(function() {
                    //     });
                    // });
                }
            }, 2000);
        } catch (ex) {
            env.log('ProtocolInterface Error', 'InitDevice', err.message)
        }
    };

    //关闭所有设备
    ProtocolInterface.prototype.CloseAllDevice = function (callback) {
        try {
            env.log('Interface', 'CloseAllDevice', ` Begin Close Device `);
            // Promise.all([_this.SupportMouse.CloseDevice()]).then(function() {
            //     callback();
            // }, function() {
            //     env.log(env.level.ERROR,'Interface','CloseAllDevice',` Close Mouse fail `); 
            //     callback();
            // });

            // Promise.all([_this.SupportKeyboard.CloseDevice()]).then(function() {
            //     callback();
            // }, function() {
            //     env.log(env.level.ERROR,'Interface','CloseAllDevice',` Close HidDevice fail `);  
            //     callback();
            // });

            Promise.all([_this.DeviceApi.CloseDevice()]).then(function () {
                callback();
            }, function () {
                env.log('Interface Error', 'CloseAllDevice', ` Close HidDevice fail `);
                callback();
            });

        } catch (ex) {
            env.log('Interface Error', 'CloseAllDevice', `ex:${ex.message}`);
            callback();
        }
    };

    //虛擬送鍵盤值
    ProtocolInterface.prototype.SendKey = function (Obj) {
        // env.log('Interface', 'SendKey', JSON.stringify(Obj));
        _this.hiddevice.RunVirtualKey(Obj.ModifyKey, Obj.VirtualKey);
    };

    ProtocolInterface.prototype.ExportProfile = function (Obj) {
        env.log('Interface', 'ExportProfile', JSON.stringify(Obj));
        fs.writeFileSync(Obj.Path, JSON.stringify(Obj.Data, null, "\t"));       
    };

    // //在关机，登出，登入时需要重新刷新HID设备
    // ProtocolInterface.prototype.OnSessionChange = function (changeType) {        
    //     env.log(env.level.DEBUG,'Interface','OnSessionChange',`Begin.`);
    //     try{
    //         if (env.isLessThenWin81){
    //             if(changeType === 0x2 || changeType === 0x4 || changeType === 0x6 || changeType === 0x8){
    // 				_this.CloseAllDevice();
    // 			}
    //             if (!_this.IsRefreshDevice){
    //                 clearTimeout(_this.RefreshDeviceWaitNextEventTimeoutId);
    //                 _this.RefreshAllDevice(3500);
    //             }
    //             env.log('Interface','OnSessionChange',`Send RefreshDevice event to UI`);                
    //         }
    //     }catch(ex){
    //         env.log(env.level.ERROR,'Interface','OnSessionChange',`ex :${ex.message}.`);
    //         _this.IsRefreshDevice = false;
    //     }
    // };



    //支援机种
    ProtocolInterface.prototype.SupportDevice = undefined;

    //是否拔插时正刷新设备列表
    ProtocolInterface.prototype.IsRefreshDevice = false;

    ProtocolInterface.prototype.AppDB = false;

    ProtocolInterface.prototype.update = false;
    //当前最前程序路径
    // ProtocolInterface.prototype.ForegroundAppPath = undefined;

    return ProtocolInterface;
})(events.EventEmitter);

exports.ProtocolInterfaceClass = ProtocolInterface;