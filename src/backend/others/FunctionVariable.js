'use strict';

var FuncName = {
	//设备初始化
    InitDevice : "InitDevice",
    
    SetCommand:"SetCommand",
    //設定Macro
    SetMacroKey:"SetMacroKey",
    //GetKeyMatrix
    GetKeyMatrix:"GetKeyMatrix",
    //SetKeyMatrix
    SetKeyMatrix:"SetKeyMatrix",
    //APMode
    APMode:"APMode",
    //SetProfie
    SetProfie:"SetProfie",
    //GetProfileInfo
    GetProfileInfo:"GetProfileInfo",
    //確認AppVersion & download
    UpdateApp:"UpdateApp",
    //upzip AppUpdate File
    DownloadInstallPackage : "DownloadInstallPackage",
    UpdateFW : "UpdateFW",
    DownloadFWInstallPackage : "DownloadFWInstallPackage",
    ChangeWindowSize : "ChangeWindowSize",
    RunApplication : "RunApplication" ,
    LightBarMode :"LightBarMode",
    GetDefaultKeyMatrix:"GetDefaultKeyMatrix",
    GetProfieAndFirmwareVer:"GetProfieAndFirmwareVer",
    SendKey:"SendKey",
    ExportProfile:"ExportProfile",
    QuitApp:"QuitApp"
};

var FuncType = {
    System : 0x01,
    Mouse : 0x02,
    Keyboard :0x03,
    Device : 0x04
};

exports.FuncName = FuncName;
exports.FuncType = FuncType;