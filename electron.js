var env = require('./backend/others/env');
var funcVar = require('./backend/others/FunctionVariable');
var path = require('path');
var evtVar = require('./backend/others/EventVariable').EventTypes;
// 应用控制模块
const electron = require('electron');
const app = electron.app;
const {Menu,Tray,ipcMain,globalShortcut,ipcRenderer} = require('electron');

// 创建窗口模块
const BrowserWindow = electron.BrowserWindow;

// 创建窗口模块
//var BrowserWindow = require('browser-window'),

// 主窗口
var mainWindow;

app.commandLine.appendSwitch('--ignore-gpu-blacklist');

// 初始化并准备创建主窗口
app.on('ready', function () {
    env.log('Main','Main','Ready');
    var _initDev = false;  
    // 创建一个宽800px 高700px的窗口
    // mainWindow = new BrowserWindow({
    //     width: 800,
    //     height: 700,
    // });
    // global.EnvVariate = env;
    // 载入应用的inde.html
    // mainWindow.loadURL('file://' + __dirname.replace(/\\/g, '/') + '/index.html');
    // env.log('666','666','666','file://' + __dirname.replace(/\\/g, '/') + '/index.html');

    // var windows = require('./windows');
    // global.MainWindow = new windows.SmartWindowClass();
    // global.MainWindow.load();

    // 打开开发工具界面
    //mainWindow.openDevTools();


    // 窗口关闭时触发
    // mainWindow.on('closed', function(){
    //     env.log(env.level.INFO,'Main','Main','Close');
    //     // 想要取消窗口对象的引用， 如果你的应用支持多窗口，你需要将所有的窗口对象存储到一个数组中，然后在这里删除想对应的元素
    //     mainWindow = null            
    // });    
});


var windows = require('./windows');
var cp = require('child_process');
var fs = require('fs');
var ipc = require('electron').ipcRenderer;
var net = require('net');
var ProtocolInterface = require('./backend/protocol/Interface');


var isAppReady = false;
app.once('ready', function () { return isAppReady = true; });
function onAppReady(cb) {
    if (isAppReady) {
        cb();
    }
    else {
        app.once('ready', cb);
    }
}

var Smart = (function () {
    var _this;
    function Smart(opts) {
        env.log('electron','Smart','New Smart INSTANCE.');        
        _this = this;

        if (opts.closeApp){
            app.terminate();
            return;
        }
        _this.registerListeners();
        _this.startRunningInstanceListener();

        global.EnvVariate = env;  
        global.CanQuit = true;   
        global.MainWindow = new windows.SmartWindowClass();

        global.MainWindow.on('finish-load', function (isCrashed) {   
            _this._initDev = false;         
            if(global.AppProtocol !== undefined){
                // _this.initDevice();
            }else{
                global.AppProtocol = new ProtocolInterface.ProtocolInterfaceClass();
                // _this.initDevice();
            }
            global.AppProtocol.on(evtVar.ProtocolMessage, function(obj){
                try{
                    // env.log('main','AppProtocol',JSON.stringify(obj))
                    //global.MainWindow.win.webContents.send(evtVar.ProtocolMessage, obj);
                    if(obj.Func == "ChangeWindowSize"){
                        global.MainWindow.win.setSize(obj.Param.x , obj.Param.y);
                        // global.MainWindow.win.hide();
                        global.MainWindow.win.setSkipTaskbar(true);
                        return;
                    }else if(obj.Func == "QuitApp"){
                        global.CanQuit = true;
                        app.quit();
                    }
                    var t = {Func:obj.Func,Param:obj.Param};
                    // console.log(JSON.stringify(t));
                    global.MainWindow.win.webContents.executeJavaScript(`window.dispatchEvent(new CustomEvent('icpEvent', {'detail':'${JSON.stringify(t)}'}));`);
                }catch(e){
                    env.log('electron','AppProtocol','error')
                }
			});
            if (isCrashed === null || isCrashed === undefined || !isCrashed){
                if (!opts.noShow){
                    global.CanQuit = false;
                    global.MainWindow.win.show();
                }else{
                    if (env.isMac)
                        app.dock.hide();
                    global.CanQuit = true;
                }
            }
        }); 
        global.MainWindow.load();
        //
        if(global.AppProtocol === undefined)
            global.AppProtocol = new ProtocolInterface.ProtocolInterfaceClass();   
    }
    
    Smart.startup = function (opts) {
        if (!!Smart.INSTANCE) {
            throw new Error('Can only ever have one instance at the same time');
        }
        Smart.INSTANCE = new Smart(opts);
    };
    
    Smart.prototype.registerListeners = function () {
        app.on('will-quit', function () {
            env.log('electron','Smart','App#will-quit: deleting running instance handle');
            env.DeleteLogFile();
            _this.deleteRunningInstanceHandle(); 
            globalShortcut.unregister('ctrl+i'); 
            globalShortcut.unregisterAll();              
        });
        app.on('activate-with-no-open-windows', function(){
            if (env.isMac && global.MainWindow !== undefined){
                app.dock.show();
                global.CanQuit = false;
                global.MainWindow.win.show();
            }
        });
        
        app.on('activate',function(){
            global.MainWindow.win.setSize(env.winSettings.width , env.winSettings.height);
        })

        app.on('browser-window-blur',function(){
            // global.MainWindow.win.setSize(env.winSettings.width , env.winSettings.height);
        })

        app.on('browser-window-focus',function(){
            // global.MainWindow.win.setSize(env.winSettings.width , env.winSettings.height);
        })

        app.on('gpu-process-crashed', function(){
            env.log('electron','main','App#gpu-process-crashed.');
        });

        ipcMain.on("OpenBK700", function (event, labs){ 
            _this.installTray(labs);        
        });
    };

    Smart.prototype.installTray = function (labs) { 
        if (labs === null || labs === undefined || labs.constructor !== Array || labs.length !== 2)
            labs = ['Open','Exit'];
        if (global.TrayIcon !== undefined){
            global.TrayIcon.destroy();
            global.TrayIcon = null;
        }

        global.TrayIcon = new Tray(path.join(__dirname,'image/icon_logo.png')); 
        var contextMenu = Menu.buildFromTemplate(
            [
                { 
                    label: labs[0],
                    icon:path.join(env.appRoot,'image','topmost.png'),
                    click:function(event){
                        if (env.isMac)
                            app.dock.show();
                        global.MainWindow.win.setSize(env.winSettings.width , env.winSettings.height);
                        console.log(event);
                        global.CanQuit = false;
                        global.MainWindow.win.show();
                    }
                },
                {
                    label: labs[1],
                    icon:path.join(env.appRoot,'image','exit.png'),
                    click:function(){
                        // global.CanQuit = true;
                        // // app.dock.hide();
                        // app.quit();
                        var t = {Func:"ExitApp",Param:"Exitready"};
                        global.MainWindow.win.webContents.executeJavaScript(`window.dispatchEvent(new CustomEvent('icpEvent', {'detail':'${JSON.stringify(t)}'}));`);
                    }
                } 
            ]
        );      
        global.TrayIcon.setTitle("BK700");
        global.TrayIcon.setToolTip("BK700");
        global.TrayIcon.setContextMenu(contextMenu);
        //在tray icon上點擊雙鍵所做的動作
        global.TrayIcon.on('double-click', function(){
            if (env.isMac)
                app.dock.show();
            global.MainWindow.win.setSize(env.winSettings.width , env.winSettings.height);
            global.CanQuit = false;
            global.MainWindow.win.show() ;
        });

        //在tray icon上點擊右鍵所做的動作
        global.TrayIcon.on('right-click', function(){
            if (env.isMac)
                app.dock.show();
            global.MainWindow.win.setSize(env.winSettings.width , env.winSettings.height);
            global.CanQuit = false;
            global.MainWindow.win.show();
        }); 
    };

    Smart.prototype.alarmNotifyWindowClearCloseTime = function () {
        if (_this.alarmcloseNofifyWindowTimeId !== undefined){
            clearTimeout(_this.alarmcloseNofifyWindowTimeId);
            _this.alarmcloseNofifyWindowTimeId = undefined;
        }
    };

    Smart.prototype.NotifyWindowSetCloseTime = function () {
        if (_this.closeNofifyWindowTimeout > 0 && _this.notifyWindow !== null && _this.notifyWindow !== undefined){
            _this.closeNofifyWindowTimeId = setTimeout(function() {
                _this.notifyWindow.close();
                _this.closeNofifyWindowTimeId = undefined;
            }, _this.closeNofifyWindowTimeout);
        }
    };
    
    Smart.prototype.initDevice = function () {
        if(!_this._initDev){
            _this._initDev = true;
            var Obj={
                Type:funcVar.FuncType.System,
                Func:funcVar.FuncName.InitDevice,
                Param:null
            };
            global.AppProtocol.RunFunction(Obj, function (error,data){
                try
                {
                    global.MainWindow.win.webContents.send('InitDevice');
                    env.log('electron','InitDevice callback',error);
                }catch(ex){
                    env.log('Error','main',`AppProtocol.InitDevice Error : ${ex}`);
                }
            });
        }
    };
    
    Smart.prototype.startRunningInstanceListener = function () {
        // We are the one to own this
        _this.deleteRunningInstanceHandle();
        // Listen to other instances talking to us
        var runningInstance = net.createServer(function (connection) {
            connection.on('data', function (data) {
                try{
                    var otherInstanceArgs = data.toString().toLowerCase();
                    env.log('electron','Received data from other instance', otherInstanceArgs);
                    if(otherInstanceArgs.startsWith('reopen')){
                        global.CanQuit = false;
                        global.MainWindow.win.show();
                        if (env.isMac)
                            app.dock.show();
                    }else if(otherInstanceArgs.startsWith('closeapp')){
                        setTimeout(function () {
			                global.CanQuit = true;
			                return app.terminate(); 
			            }, 0); 
                    }
                }catch(ex){
                    env.log('Error','startRunningInstanceListener',`Smart.connection#data : ${ex.message}`);
                }
            });
        });
        runningInstance.listen(env.runningInstanceHandle);
        // This can happen when multiple apps fight over the same connection
        runningInstance.on('error', function (error) {
            env.log('Error','startRunningInstanceListener','Terminating because running instance listener failed:', error.toString());
            setTimeout(function () {
                global.CanQuit = true;
                return app.terminate(); 
            }, 0); // we cannot allow multiple apps, so we quit
        });
    };
    
    Smart.prototype.deleteRunningInstanceHandle = function () {
        if (env.isWindows) {
            return;
        }
        if (fs.existsSync(env.runningInstanceHandle)) {
            try {
                return fs.unlinkSync(env.runningInstanceHandle);
            }
            catch (e) {
                if (e.code !== 'ENOENT') {
                    env.log('Error','deleteRunningInstanceHandle','Fatal error deleting running instance handle', e);
                    throw e;
                }
            }
        }
    };
    
    Smart.prototype._initDev = false;
    return Smart;
})();

function main() {

    app.commandLine.appendSwitch('--disable-gpu'); 
    app.commandLine.appendSwitch(' --enable-logging');
    app.commandLine.appendSwitch('touch-events', 'enabled');

    //避免記憶體一直增加
    app.commandLine.appendSwitch('js-flags', '--max-old-space-size=512');


    // Ready for creating browser windows
    onAppReady(function () 
    {
        var args = Array.prototype.slice.call(process.argv, 1);
        var opts = args.filter(function (a) { return /^-/.test(a); })
                        .map(function (a) { return a.replace(/^-*/, ''); })
                        .reduce(function (r, a) {  r[a] = true;  return r; }, {});
        // On Mac/Unix we can rely on the server handle to be deleted if the instance is not running
        if (!env.isWindows && !fs.existsSync(env.runningInstanceHandle)) {
            env.log('electron','main','Mac/Linux: starting smart because handle does not exist');
            Smart.startup(opts);
        }
        else { 
                    env.log('electron','main'," runningInstanceHandle: "+env.runningInstanceHandle);
                    env.log('electron','main',JSON.stringify(opts));
                    var con = net.connect({
                        path: env.runningInstanceHandle
                    }, function () {
                        // Another instance is running, we talk to it and ask it to open a window
                        var msg = opts.closeApp ? 'closeApp' : 'ReOpen';
                        con.write(msg, function () {
                            con.end();
                            env.log('electron','main','Sending args to running instance and terminating');
                            setTimeout(function () {
                                global.CanQuit = true;
                                // return app.terminate(); 
                                return app.quit();
                            }, 0); // terminate later to prevent bad things from happen
                        });
                    });
                    con.on('error', function (error) {
                        env.log('electron','main','No instance running,Starting smart.'+error);
                        Smart.startup(opts);
                    }); 
            }

         var ret = globalShortcut.register('ctrl+i', function() 
         {
              global.MainWindow.win.toggleDevTools();
          });
   
    });
}
// On Darwin, the PATH environment will not be correctly set when double clicking
// the application. Need to fix it up before anything starts up.
function fixUnixEnvironment(cb) {
    var didReturn = false;
    var done = function () {
        if (didReturn) {
            return;
        }
        didReturn = true;
        cb();
    };
    var child = cp.spawn(process.env.SHELL, ['-ilc', 'env'], {
        detached: true,
        stdio: ['ignore', 'pipe', process.stderr],
    });
    child.stdout.setEncoding('utf8');
    child.on('error', done);
    var buffer = '';
    child.stdout.on('data', function (d) {
        buffer += d;
    });
    child.on('close', function (code, signal) {
        if (code !== 0) {
            return done();
        }
        var hash = Object.create(null);
        buffer.split('\n').forEach(function (line) {
            var p = line.split('=', 2);
            var key = p[0];
            var value = p[1];
            if (!key || hash[key]) {
                return;
            }
            hash[key] = true;
            process.env[key] = value;
        });
        done();
    });
}
if (env.isMac || env.isLinux) {
    fixUnixEnvironment(main);
}
else {
    main();
}