'use strict';

var eventTypes = {
	//发生错误
	Error : 'Error',
    //读写USB时出错
    USBError: 'USBError',
	//刷新设备列表
    RefreshDevice : 'RefreshDevice',
    //分位不支持
    FirmwareNotSupport: 'FwNotSupport',
    //切换DPI
    DPIChanged: 'DPIChanged',
    //程序切换
    AppChanged: 'AppChanged',
    //Windows Session切换
    SessionChanged: 'SessionChanged',
    //设备拔插
    HotPlug : 'HotPlug',
    //SmartProtocol通过此事件通知
    ProtocolMessage : 'ProtocolMessage',
    //下載進度
    DownloadProgress: 'DownloadProgress',
    //通知前端有更新檔可以安裝
    UpdateApp : 'UpdateApp',
    UpdateFW : 'UpdateFW',
    ChangeWindowSize: 'ChangeWindowSize',
    HIDEP2Data:'HIDEP2Data',
    KeyDataCallback : 'KeyDataCallback',
    QuitApp:"QuitApp",
    //electron通知前端App要關閉
    ExitApp:"ExitApp"
};

exports.EventTypes = eventTypes;