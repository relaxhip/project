var __extends = this.__extends || function (d, b) {
    for (var p in b)
        if (b.hasOwnProperty(p)) d[p] = b[p];

    function __() {
        this.constructor = d;
    }
    __.prototype = b.prototype;
    d.prototype = new __();
};

var events = require('events');
var fs = require('fs');
var env = require('../../others/env');
var funcVar = require('../../others/FunctionVariable');
var evtType = require('../../others/EventVariable').EventTypes;
var exec = require('child_process').execFile;
//var HID = require('node-hid');

'use strict';

// var DeviceApi = (function (_super) {
//     __extends(DeviceApi, _super);
//     var _thisDevice;
//     function DeviceApi() {
//     	try{
//     		_thisDevice = this;
//             _super.call(this);
//             env.log('device','DeviceApi','New DeviceApi INSTANCE.');

//             if (env.isWindows){
//                 if(env.arch == 'ia32')
//                     _thisDevice.hiddevice = require(`./nodeDriver/win32/hiddevice.node`);
//                 else    
//                     _thisDevice.hiddevice = require(`./nodeDriver/win64/hiddevice.node`);

//             }else if (env.isMac){
//                 _thisDevice.hiddevice = require(`./nodeDriver/darwin/hiddevicemac.node`);
//             }

// 	    }catch(ex){
//             env.log('DeviceApi','DeviceApi','[DeviceApi Error]',ex.message);
//         }
//     }
var DeviceApi = function (hid) {
    try {
        _thisDevice = this;
        _thisDevice.hiddevice = hid;
        env.log("DeviceApi", "DeviceApi", "New DeviceApi INSTANCE");

    } catch (ex) {
        env.log("DeviceApi Error", "DeviceApi", `ex${ex.message}`);
    }
}

DeviceApi.prototype.RunFunction = function (Obj, callback) {
    try {
        // env.log('DeviceApi','RunFunction',`Function:${Obj.Func}`);
        if (Obj.Type !== funcVar.FuncType.Device)
            throw new Error('Type must be Device.');

        var fn = _thisDevice[Obj.Func];

        if (fn === undefined || !funcVar.FuncName.hasOwnProperty(Obj.Func))
            throw new Error(`Func error of ${Obj.Func}`);
        fn(Obj.Param, callback);
    } catch (ex) {
        env.log('DeviceApi', 'RunFunction', `DeviceApi.RunFunction error : ${ex.message}.`);
        callback(errCode.ValidateError, ex);
    }
};

DeviceApi.prototype.SetCommand = function (Obj, callback) {
    env.log('DeviceApi', 'SetCommand', JSON.stringify(Obj));
    _thisDevice.SetProfieInfo(Obj);
    callback('success', 'abc');
};

DeviceApi.prototype.SetFeatureReport = function (buf) {
    // env.log("DeviceApi","SetFeatureReport","SetFeatureReport",'777')
    return new Promise(function (resolve, reject) {
        setTimeout(function () {
            try {
                var rtnData = _thisDevice.hiddevice.SetFeatureReport(0x07, 64, buf);
                // var rtnData = _thisDevice.hiddevice.SetFeatureReport(buf[0], buf.length, buf);

                //if(rtnData != buf.length)
                if (rtnData != 64)
                    env.log("DeviceApi SetFeatureReport", "SetFeatureReport(error) return data length : ", JSON.stringify(rtnData));

                resolve(rtnData);
            } catch (err) {
                env.log("DeviceApi Error", "SetFeatureReport", `ex:${err.message}`);
                resolve(err);
            }
        }, 3);
    });
}

DeviceApi.prototype.WirteOutputData = function (buf) {
    // env.log("DeviceApi","WirteOutputData","WirteOutputData",'777')
    return new Promise(function (resolve, reject) {
        setTimeout(function () {
            try {
                resolve(rtnData);
                var rtnData = _thisDevice.hiddevice.WirteOutputData(0x08, 64, buf);


                if (rtnData != 64)
                    env.log("DeviceApi WirteOutputData", "WirteOutputData(error) return data length : ", JSON.stringify(rtnData));

             //   resolve(rtnData);

            } catch (err) {
                env.log("DeviceApi WirteOutputData", "WirteOutputData", `ex:${err.message}`);
                resolve(err);
            }
        }, 3);
    });
}


DeviceApi.prototype.GetFeatureReport = function () {
    var Data = new Buffer(new Array(64));
    Data[0] = 0x07;

    return new Promise(function (resolve, reject) {
        setTimeout(function () {
            try {
                var rtnData = _thisDevice.hiddevice.GetFeatureReport(0x07, 64);

                env.log('DeviceApi GetFeatureReport', 'GetFeatureReport', JSON.stringify(rtnData));
                resolve(rtnData);

            } catch (err) {
                env.log("DeviceApi GetFeatureReport", "GetFeatureReport", `ex:${err.message}`);
                resolve(-1);
            }
        }, 10);
    });
}

DeviceApi.prototype.APMode = function (obj, callback) {
    // env.log('DeviceApi APMode','Data',JSON.stringify(obj));
    profile = obj.profile;
    RGBData = obj.RGBData;
    // env.log("origin:"+RGBData);
    var Data = new Buffer(new Array(64));
    var rtnData = 0;

    Data[0] = 0x08;
    Data[1] = 0x07;
    Data[2] = profile;
    Data[3] = 0; //Number

    // for(var i = 0; i < 60; i++)
    //     Data[4+i] = RGBData[i];

    return new Promise(function (resolve, reject) {

        // env.log('DeviceApi','APMode','Data 0',JSON.stringify(Data));

        // (function SetAp(j){
        //     env.log('DeviceApi','APMode','Data '+j,JSON.stringify(Data));
        //     if(j<8){
        //         _thisDevice.SetFeatureReport(Data).then(function() {
        //             Data[3]=j; //Number
        //             for(var i = 0; i < 60; i++)
        //                 Data[4+i] = RGBData[60*j+i];
        //             SetAp(j+1);
        //         });
        //     }else{
        //         _thisDevice.SetFeatureReport(Data).then(function() {
        //             env.log('DeviceApi','APMode','APMode','Finish')
        //             resolve(callback(1)); 
        //         });
        //     }

        // })(1);

        (function SetAp(j) {
            if (j < 8) {
                // if(j!=0)
                Data[3] = j; //Number
                for (var i = 0; i < 60; i++)
                    Data[4 + i] = RGBData[60 * j + i];
                //        env.log('DeviceApi APMode','Data '+j,JSON.stringify(Data));
                //        _thisDevice.SetFeatureReport(Data).then(function() {
                _thisDevice.WirteOutputData(Data).then(function () {
                    SetAp(j + 1);
                });
            } else {
                //  env.log('DeviceApi APMode','APMode','Finish')
                resolve(callback(1));
            }
        })(0);


        // _thisDevice.SetFeatureReport(Data).then(function() {

        //     Data[3] = 1;   //Number
        //     for(var i = 0; i < 60; i++)
        //         Data[4+i] = RGBData[60+i];

        //      env.log('DeviceApi','APMode','Data 1',JSON.stringify(Data));
        //     _thisDevice.SetFeatureReport(Data).then(function() {

        //         Data[3] = 2;   //Number
        //         for(var i = 0; i < 60; i++)
        //             Data[4+i] = RGBData[120+i];

        //          env.log('DeviceApi','APMode','Data 2',JSON.stringify(Data));
        //         _thisDevice.SetFeatureReport(Data).then(function() {

        //             Data[3] = 3;   //Number
        //             for(var i = 0; i < 60; i++)
        //                 Data[4+i] = RGBData[180+i];
        //              env.log('DeviceApi','APMode','Data 3',JSON.stringify(Data));
        //             _thisDevice.SetFeatureReport(Data).then(function() {

        //                 Data[3] = 4;   //Number
        //                 for(var i = 0; i < 60; i++)
        //                     Data[4+i] = RGBData[240+i];
        //                  env.log('DeviceApi','APMode','Data 4',JSON.stringify(Data));
        //                 _thisDevice.SetFeatureReport(Data).then(function() {

        //                     Data[3] = 5;   //Number
        //                     for(var i = 0; i < 60; i++)
        //                         Data[4+i] = RGBData[300+i];
        //                      env.log('DeviceApi','APMode','Data 5',JSON.stringify(Data));
        //                     _thisDevice.SetFeatureReport(Data).then(function() {

        //                         Data[3] = 6;   //Number
        //                         for(var i = 0; i < 60; i++)
        //                             Data[4+i] = RGBData[360+i];
        //                          env.log('DeviceApi','APMode','Data 6',JSON.stringify(Data));
        //                         _thisDevice.SetFeatureReport(Data).then(function() {

        //                             Data[3] = 7;   //Number
        //                             for(var i = 0; i < 60; i++)
        //                                 Data[4+i] = RGBData[420+i];
        //                              env.log('DeviceApi','APMode','Data 7',JSON.stringify(Data));
        //                             _thisDevice.SetFeatureReport(Data).then(function() {
        //                                 resolve(callback(1));
        //                             });
        //                         });
        //                     });
        //                 });
        //             });
        //         });
        //     }); 
        // });


    });
};

//only set current profile, key and mouse action 242byte
DeviceApi.prototype.SetMacroKey = function (obj) {
    env.log(`DeviceApi key:${obj.key}`, `repeat:${obj.repeat}`, JSON.stringify(obj.data));
    // key/* X*8+Y */, repeat/*0-0XFFFF*/, data /*242 byte*/
    var key = obj.key;
    var repeat = obj.repeat;
    var data = obj.data;
    var Data = new Buffer(new Array(64));

    Data[0] = 0x07;
    Data[1] = 0x05;
    Data[2] = key; //Reference Key matrix
    Data[3] = 0; //Number
    Data[4] = repeat >> 8 & 0xff; //Repeat time, Hibyte
    Data[5] = repeat & 0xff; //Repeat time, Lobyte

    for (var i = 0; i < 58; i++)
        Data[6 + i] = data[i];

    return new Promise(function (resolve, reject) {
        env.log('111', '111', JSON.stringify(Data));
        _thisDevice.SetFeatureReport(Data).then(function () {

            Data[3] = 1;
            for (var i = 0; i < 60; i++)
                Data[4 + i] = data[58 + i];
            // Data[4+i] = data[59+i];

            env.log('222', '222', JSON.stringify(Data));
            _thisDevice.SetFeatureReport(Data).then(function () {
                Data[3] = 2;
                for (var i = 0; i < 60; i++)
                    Data[4 + i] = data[118 + i];
                //Data[4 + i] = data[119 + i];
                env.log('333', '333', JSON.stringify(Data));
                _thisDevice.SetFeatureReport(Data).then(function () {
                    Data[3] = 3;
                    for (var i = 0; i < 60; i++)
                        Data[4 + i] = data[178 + i];
                    //Data[4 + i] = data[179 + i];
                    env.log('555', '555', JSON.stringify(Data));
                    _thisDevice.SetFeatureReport(Data).then(function () {
                        Data[3] = 4;
                        for (var i = 0; i < 60; i++)
                            Data[4 + i] = 0;

                        //   Data[4] = data[239];
                        //    Data[5] = data[240];
                        //    Data[6] = data[241];
                        Data[4] = data[238];
                        Data[5] = data[239];
                        Data[6] = data[240];
                        Data[7] = data[241];


                        env.log('666', '666', JSON.stringify(Data));
                        _thisDevice.SetFeatureReport(Data).then(function () {
                            resolve();
                        });
                    });
                });
            });
        });
    });
}

DeviceApi.prototype.SetKeyMatrix = function (obj, callback) {
    env.log('DeviceApi SetKeyMatrix', 'SetKeyMatrix', JSON.stringify(obj))
    var profile = obj.profile;
    var KeyData = obj.KeyData
    var SetData = new Buffer(new Array(64));
    SetData[0] = 0x07;
    SetData[1] = 0x03;
    SetData[2] = profile; //Reference Key matrix
    SetData[3] = 0;


    return new Promise(function (resolve, reject) {

        for (var i = 0; i < 60; i++)
            SetData[i + 4] = KeyData[i];

        (function SKeyM(j) {
            if (j < 4) {
                if (j <= 2) {
                    _thisDevice.SetFeatureReport(SetData).then(function () {
                        for (var i = 0; i < 60; i++)
                            SetData[i + 4] = KeyData[i + 60 * (j + 1)];
                        SetData[3] = j + 1;
                        SKeyM(j + 1);
                    });
                } else {
                    _thisDevice.SetFeatureReport(SetData).then(function () {

                        for (var i = 0; i < 60; i++)
                            SetData[i + 4] = 0;

                        for (var i = 0; i < 16; i++)
                            SetData[i + 4] = KeyData[i + 60 * (j + 1)];
                        SetData[3] = j + 1;
                        SKeyM(j + 1);
                    });
                }
            } else {
                _thisDevice.SetFeatureReport(SetData).then(function () {
                    env.log('DeviceApi SetKeyMatrix', 'SetKeyMatrix', 'Finish')
                    resolve(callback());
                });
            }

        })(0);

        //env.log('Interface','SetKeyMatrix','111',JSON.stringify(SetData));
        // _thisDevice.SetFeatureReport(SetData).then(function() {

        //     for(var i = 0; i < 60; i++)
        //         SetData[i+4] = KeyData[i+60];
        //     SetData[3] = 1;

        //     env.log('Interface','SetKeyMatrix','222',JSON.stringify(SetData));
        //     _thisDevice.SetFeatureReport(SetData).then(function() {
        //         for(var i = 0; i < 60; i++)
        //             SetData[i+4] = KeyData[i+120];
        //         SetData[3] = 2;

        //         env.log('Interface','SetKeyMatrix','333',JSON.stringify(SetData));
        //         _thisDevice.SetFeatureReport(SetData).then(function() {
        //             for(var i = 0; i < 60; i++)
        //                 SetData[i+4] = KeyData[i+180];
        //             SetData[3] = 3;

        //             env.log('Interface','SetKeyMatrix','555',JSON.stringify(SetData));
        //             _thisDevice.SetFeatureReport(SetData).then(function() {

        //                 for(var i = 0; i < 60; i++)
        //                     SetData[i+4] = 0;

        //                 for(var i = 0; i < 16; i++)
        //                     SetData[i+4] = KeyData[i+240];
        //                 SetData[3] = 4;

        //                 env.log('Interface','SetKeyMatrix','666',JSON.stringify(SetData));
        //                 _thisDevice.SetFeatureReport(SetData).then(function() {
        //                     resolve(callback()); 
        //                 });
        //             });
        //         });
        //     });
        // }); 

        env.log('DeviceApi SetKeyMatrix', '111', JSON.stringify(SetData));

    });
};

DeviceApi.prototype.RunApplication = function (obj, callback) {
    env.log('DeviceApi RunApplication', 'RunApplication', JSON.stringify(obj))
    if (env.isWindows) {
        exec(obj, function (err, data) {
            if (err)
                callback(err)
            else
                callback(true);
        })
    } else {
        obj = 'open -nF ' + obj
        exec(obj, {
            shell: '/bin/bash'
        }, function (err, data) {
            if (err)
                callback(err)
            else
                callback(true);
        })
    }
}

DeviceApi.prototype.GetProfileInfo = function (obj, callback) {
    env.log('DeviceApi GetProfileInfo', 'GetProfileInfo', JSON.stringify(obj))

    var profile = obj.profile;
    var SetData = new Buffer(new Array(64));
    var GetData = [new Buffer(new Array(120))];

    SetData[0] = 0x07;
    SetData[1] = 0x82;
    SetData[2] = profile; //Reference Key matrix
    SetData[3] = 0;

    return new Promise(function (resolve, reject) {
        _thisDevice.SetFeatureReport(SetData).then(function () {

            _thisDevice.GetFeatureReport().then(function (rtnData) {

                for (var i = 0; i < 60; i++)
                    GetData[i] = rtnData[i + 3];

                SetData[3] = 1;
                _thisDevice.SetFeatureReport(SetData).then(function () {
                    _thisDevice.GetFeatureReport().then(function (rtnData) {
                        for (var j = 0; j < 60; j++)
                            GetData[j + 60] = rtnData[j + 3];

                        resolve(callback(GetData));
                        env.log('DeviceApi GetProfileInfo', 'GetProfileInfo Data : ', JSON.stringify(GetData));
                    });
                });
            });
        });
    });
}


DeviceApi.prototype.GetKeyMatrix = function (obj, callback) {
    env.log('DeviceApi GetKeyMatrix', 'GetKeyMatrix', JSON.stringify(obj))

    var profile = obj.profile;
    var SetData = new Buffer(new Array(64));
    var GetData = [new Buffer(new Array(256))];
    SetData[0] = 0x07;
    SetData[1] = 0x83;
    SetData[2] = profile; //Reference Key matrix
    SetData[3] = 0;

    return new Promise(function (resolve, reject) {

        _thisDevice.SetFeatureReport(SetData).then(function () {
            _thisDevice.GetFeatureReport().then(function (rtnData) {

                for (var i = 0; i < 60; i++)
                    GetData[i] = rtnData[i + 3];

                // (function GKeyM(j){
                //     if(j<4){
                //         SetData[3] = j+1;
                //         _thisDevice.SetFeatureReport(SetData).then(function() {
                //             _thisDevice.GetFeatureReport().then(function(rtnData){
                //                 if(j<=2){
                //                     for(var i = 0; i < 16; i++)
                //                         GetData[i+243] = rtnData[i+3];
                //                         GKeyM(j+1);
                //                 }else{
                //                     for(var i = 0; i < 60; i++)
                //                         GetData[i+60*(j+1)] = rtnData[i+3];
                //                         GKeyM(j+1);
                //                 }
                //             });
                //         });
                //     }else{
                //         env.log('DeviceApi','GetKeyMatrix','GetKeyMatrix','Finish')
                //         resolve(callback(GetData)); 
                //     }

                // })(0);

                SetData[3] = 1;
                _thisDevice.SetFeatureReport(SetData).then(function () {
                    _thisDevice.GetFeatureReport().then(function (rtnData) {
                        for (var i = 0; i < 60; i++)
                            GetData[i + 60] = rtnData[i + 3];

                        SetData[3] = 2;
                        _thisDevice.SetFeatureReport(SetData).then(function () {
                            _thisDevice.GetFeatureReport().then(function (rtnData) {
                                for (var i = 0; i < 60; i++)
                                    GetData[i + 120] = rtnData[i + 3];

                                SetData[3] = 3;
                                _thisDevice.SetFeatureReport(SetData).then(function () {
                                    _thisDevice.GetFeatureReport().then(function (rtnData) {

                                        for (var i = 0; i < 60; i++)
                                            GetData[i + 180] = rtnData[i + 3];

                                        SetData[3] = 4;
                                        _thisDevice.SetFeatureReport(SetData).then(function () {
                                            _thisDevice.GetFeatureReport().then(function (rtnData) {

                                                for (var i = 0; i < 16; i++)
                                                    GetData[i + 240] = rtnData[i + 3];

                                                resolve(callback(GetData));
                                                env.log('DeviceApi GetKeyMatrix', 'GetKeyMatrix Data : ', JSON.stringify(GetData));
                                            });
                                        });
                                    });

                                });

                            });

                        });


                    });

                });

            });

        });
    });
};

DeviceApi.prototype.SetProfieInfo = function (obj) {
    env.log('DeviceApi', 'SetProfieInfo', JSON.stringify(obj))
    var profile = obj.profile;
    var mode = obj.mode; /*1~15*/
    var light = obj.light; /*0~32*/
    //
    var dragontime = obj.dragontime; /*0,30,50*/
    var rainbowtime = obj.rainbowtime; /*0,30,50*/
    var breathtime = obj.breathtime; /*1,5,10*/
    var lightentime = obj.lightentime; /*1,5,10*/
    var crashtime = obj.crashtime; /*1,5,10*/
    var rainbowdir = obj.rainbowdir; /*1,5,10*/
    var crashdir = obj.crashdir;
    var boomdir = obj.boomdir;
    var wavedir = obj.wavedir; /*0~5*/
    var rounddir = obj.rounddir; /*0,1*/
    var starlighttime = obj.starlighttime; /*20.60.100*/
    var meetingtime = obj.meetingtime; /*50.100.150*/
    var lightraintime = obj.lightraintime; /*50.100.150*/
    var boomtime = obj.boomtime; /*20.50.80*/
    var crosstime = obj.crosstime; /*20.50.80*/
    var wavetime = obj.wavetime; /*20.50.80*/
    var floattime = obj.floattime; /*30.40.50*/
    var roundtime = obj.roundtime; /*10.30.50*/
    var BreathModeR1 = obj.BreathModeR1; /*10.30.50*/
    var BreathModeR2 = obj.BreathModeR2; /*10.30.50*/
    var BreathModeG1 = obj.BreathModeG1; /*10.30.50*/
    var BreathModeG2 = obj.BreathModeG2; /*10.30.50*/
    var BreathModeB1 = obj.BreathModeB1; /*10.30.50*/
    var BreathModeB2 = obj.BreathModeB2; /*10.30.50*/
    var ZhuangJiModeR1 = obj.ZhuangJiModeR1; /*10.30.50*/
    var ZhuangJiModeR2 = obj.ZhuangJiModeR2; /*10.30.50*/
    var ZhuangJiModeG1 = obj.ZhuangJiModeG1; /*10.30.50*/
    var ZhuangJiModeG2 = obj.ZhuangJiModeG2; /*10.30.50*/
    var ZhuangJiModeB1 = obj.ZhuangJiModeB1; /*10.30.50*/
    var ZhuangJiModeB2 = obj.ZhuangJiModeB2; /*10.30.50*/
    var FanXingModeR = obj.FanXingModeR;
    var FanXingModeG = obj.FanXingModeG;
    var FanXingModeB = obj.FanXingModeB;
    var FanXingMode = obj.FanXingMode;
    var zhongguolongModeR1 = obj.zhongguolongModeR1;
    var zhongguolongModeR2 = obj.zhongguolongModeR2;
    var zhongguolongModeG1 = obj.zhongguolongModeG1;
    var zhongguolongModeG2 = obj.zhongguolongModeG2;
    var zhongguolongModeB1 = obj.zhongguolongModeB1;
    var zhongguolongModeB2 = obj.zhongguolongModeB2;

    var XieHouModeR1 = obj.XieHouModeR1;
    var XieHouModeR2 = obj.XieHouModeR2;
    var XieHouModeG1 = obj.XieHouModeG1;
    var XieHouModeG2 = obj.XieHouModeG2;
    var XieHouModeB1 = obj.XieHouModeB1;
    var XieHouModeB2 = obj.XieHouModeB2;
    var XieHouMode = obj.XieHouMode;
    var RainModeR = obj.RainModeR;
    var RainModeG = obj.RainModeG;
    var RainModeB = obj.RainModeB;
    var MaiChongModeR1 = obj.MaiChongModeR1;
    var MaiChongModeR2 = obj.MaiChongModeR2;
    var MaiChongModeG1 = obj.MaiChongModeG1;
    var MaiChongModeG2 = obj.MaiChongModeG2;
    var MaiChongModeB1 = obj.MaiChongModeB1;
    var MaiChongModeB2 = obj.MaiChongModeB2;
    var ZhongHModeR1 = obj.ZhongHModeR1;
    var ZhongHModeR2 = obj.ZhongHModeR2;
    var ZhongHModeG1 = obj.ZhongHModeG1;
    var ZhongHModeG2 = obj.ZhongHModeG2;
    var ZhongHModeB1 = obj.ZhongHModeB1;
    var ZhongHModeB2 = obj.ZhongHModeB2;
    var PiaoHModeR1 = obj.PiaoHModeR1;
    var PiaoHModeR2 = obj.PiaoHModeR2;
    var PiaoHModeG1 = obj.PiaoHModeG1;
    var PiaoHModeG2 = obj.PiaoHModeG2;
    var PiaoHModeB1 = obj.PiaoHModeB1;
    var PiaoHModeB2 = obj.PiaoHModeB2;
    var LianyiModeR1 = obj.LianyiModeR1;
    var LianyiModeR2 = obj.LianyiModeR2;
    var LianyiModeG1 = obj.LianyiModeG1;
    var LianyiModeG2 = obj.LianyiModeG2;
    var LianyiModeB1 = obj.LianyiModeB1;
    var LianyiModeB2 = obj.LianyiModeB2;
    var ZhanFangModeR1 = obj.ZhanFangModeR1;
    var ZhanFangModeR2 = obj.ZhanFangModeR2;
    var ZhanFangModeG1 = obj.ZhanFangModeG1;
    var ZhanFangModeG2 = obj.ZhanFangModeG2;
    var ZhanFangModeB1 = obj.ZhanFangModeB1;
    var ZhanFangModeB2 = obj.ZhanFangModeB2;
    var OneColorR = obj.OneColorR;
    var OneColorG = obj.OneColorG;
    var OneColorB = obj.OneColorB;
    var AltF4Fun = obj.AltF4Fun;
    var AltTabFun = obj.AltTabFun;
    var ShiftTabFun = obj.ShiftTabFun;


    var Data = new Buffer(new Array(0x7, 0x2, profile, 0, 1, 1, 0,
        mode /*LED MODE*/ ,
        light /*Light*/ ,
        rainbowdir, /*WaveDir*/
        crashdir, /*ZhuangJi_Dir*/
        0, /*Zhongguo_Long_Dir*/
        boomdir,
        0, /*Zhan_Fang_Dir*/

        rainbowtime, /*Wave_Time*/
        breathtime, /*Breath_Time*/
        lightentime, /*Cycle_Time*/
        crashtime, /*Zhuangji_Time*/
        starlighttime, /*FanXing_Time*/
        dragontime, /*ZhongguoLong_Time*/
        meetingtime, /*Xie_Hou_Time*/
        lightraintime, /*RainT*/
        wavetime, /*MaiChong_Time*/
        crosstime, /*Zhong_H_Time*/

        floattime, /*Piaoheng_Time*/
        boomtime, /*Lian_Yi_Time*/
        roundtime, /*Zhan_Fang_Time*/
        0, /*Breath_Mode*/
        0, /*ZhuangJi_Mode*/
        FanXingMode, /*Fan_Xing_Mode*/
        XieHouMode, /*Xie_Hou_Mode*/
        0, /*Rain_Mode*/
        0, /*MaiChong_Mode*/
        0, /*Zhong_H_Mode*/

        0, /*Piaoheng_mode*/
        0, /*Lian_Yi_Mode*/
        0, /*Zhan_Fang_Mode*/
        BreathModeR1, /*Breath_Mode_R[1]*/
        BreathModeR2, /*Breath_Mode_R[2]*/
        BreathModeG1, /*Breath_Mode_G[1]*/
        BreathModeG2, /*Breath_Mode_G[2]*/
        BreathModeB1, /*Breath_Mode_B[1]*/
        BreathModeB2, /*Breath_Mode_B[2]*/
        ZhuangJiModeR1, /*ZhuangJiModeR1*/

        ZhuangJiModeR2, /* ZhuangJiModeR2*/
        ZhuangJiModeG1, /*ZhuangJiModeG1*/
        ZhuangJiModeG2, /*ZhuangJiModeG2*/
        ZhuangJiModeB1, /*ZhuangJi_Mode_B*/
        ZhuangJiModeB2, /*ZhuangJi_Mode_B]*/
        FanXingModeR, /* Fan_Xing_ModeR1*/
        FanXingModeG, /* Fan_Xing_Mode_G1*/
        FanXingModeB, /*Fan_Xing_Mode_B1*/
        zhongguolongModeR1, /*Mai_Chong_Mode_R[2]*/
        zhongguolongModeR2, /*Mai_Chong_Mode_G[2]*/

        zhongguolongModeG1, /*Mai_Chong_Mode_B[2]*/
        zhongguolongModeG2, /*Zhong_H_Mode_R[2]*/
        zhongguolongModeB1, /*Zhong_H_Mode_G*/
        zhongguolongModeB2, /*Zhong_H_Mode_B[2]*/
        XieHouModeR1, /*Piao_H_Mode_G[2]*/
        XieHouModeR2,
        XieHouModeG1,
        XieHouModeG2, /*Piao_H_Mode_G[2]*/
        XieHouModeB1, /*Piao_H_Mode_G[2]*/
        XieHouModeB2
    ));

    return new Promise(function (resolve, reject) {
        // Data[0] = 0x07;
        // Data[1] = 0x01;
        // Data[2] = profile; //Profile

        _thisDevice.SetFeatureReport(Data).then(function () {

            var Data1 = new Buffer(new Array(0x7, 0x2, profile, 1,
                RainModeR,
                RainModeG,
                RainModeB,
                LianyiModeR1,
                LianyiModeR2,
                LianyiModeG1,
                LianyiModeG2,
                LianyiModeB1,
                LianyiModeB2,
                ZhongHModeR1,
                ZhongHModeR2,
                ZhongHModeG1,
                ZhongHModeG2,
                ZhongHModeB1,
                ZhongHModeB2,
                PiaoHModeR1,
                PiaoHModeR2,
                PiaoHModeG1,
                PiaoHModeG2,
                PiaoHModeB1,
                PiaoHModeB2,
                MaiChongModeR1,
                MaiChongModeR2,
                MaiChongModeG1,
                MaiChongModeG2,
                MaiChongModeB1,
                MaiChongModeB2,
                ZhanFangModeR1,
                ZhanFangModeR2,
                ZhanFangModeG1,
                ZhanFangModeG2,
                ZhanFangModeB1,
                ZhanFangModeB2,
                OneColorR,
                OneColorG,
                OneColorB,
                AltF4Fun,
                AltTabFun,
                ShiftTabFun,
                wavedir,
                1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0

            ));
            _thisDevice.SetFeatureReport(Data1);
            resolve();
        })
    });

    // _thisDevice.GetFeatureReport();
}

DeviceApi.prototype.SetProfie = function (obj, callback) {

    var profile = obj.profile;
    env.log('DeviceApi', 'SetProfie1111', JSON.stringify(obj));

    var Data = new Buffer(new Array(64));

    return new Promise(function (resolve, reject) {
        Data[0] = 0x07;
        Data[1] = 0x01;
        Data[2] = profile; //Profile

        _thisDevice.SetFeatureReport(Data).then(function () {

            _thisDevice.GetFeatureReport();
            resolve(callback());
        })
    });



    // _thisDevice.GetFeatureReport();
}

DeviceApi.prototype.LightBarMode = function (obj, callback) {

    var apFlag = obj.Ap_Flag; //Ap_Flag : 0 (FW control light bar ), 1(Ap control light bar)
    var lightBarMode = obj.LightBar_Mode; //Light_Bar_Mode:0 (light bar follow KB) , 1(light bar mode)

    env.log('DeviceApi', 'LightBarMode', JSON.stringify(obj));

    var Data = new Buffer(new Array(64));

    return new Promise(function (resolve, reject) {
        Data[0] = 0x07;
        Data[1] = 0x08;
        Data[2] = apFlag; //apFlag
        Data[3] = lightBarMode; //apFlag

        _thisDevice.SetFeatureReport(Data).then(function () {

            _thisDevice.GetFeatureReport();
            resolve(callback());
        })
    });
}

DeviceApi.prototype.GetDefaultKeyMatrix = function (obj, callback) {

    var Flag = obj.Flag; //Ap_Flag : 0 (FW control light bar ), 1(Ap control light bar)

    env.log('DeviceApi', 'GetDefaultKeyMatrix', JSON.stringify(obj));

    var Data = new Buffer(new Array(64));

    return new Promise(function (resolve, reject) {
        Data[0] = 0x07;
        Data[1] = 0x09;
        Data[2] = Flag; //apFlag 1:on 0:off

        _thisDevice.SetFeatureReport(Data).then(function () {

            _thisDevice.GetFeatureReport();
            resolve(callback());
        })
    });
}



DeviceApi.prototype.GetProfieAndFirmwareVer = function (obj, callback) {
    env.log('DeviceApi', 'GetProfieAndFirmwareVer', 'GetProfieAndFirmwareVer')
    var Data = new Buffer(new Array(64));
    return new Promise(function (resolve, reject) {
        Data[0] = 0x07;
        Data[1] = 0x81;

        _thisDevice.SetFeatureReport(Data).then(function () {
            _thisDevice.GetFeatureReport().then(function (doc) {
                resolve(callback(doc));
            });
        });
    });
}


// return DeviceApi;

exports.DeviceApi = DeviceApi;