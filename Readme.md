
1. https://nodejs.org/en/download/releases/ 下載6.9.2
2. electron 版本 1.4.10 下载网址: https://github.com/electron/electron/releases/tag/v1.4.10
3. Visual Studio Code 下载网址: https://code.visualstudio.com/
4. 透過VS code 終端機. 進入專案目录中
5. 运行 npm install 
6. 运行 npm install -g gulp （Mac 系統前面加sudo )
9. 建置資料夾.vscode中建置tasks.json and launch.json 修改tasks.json文件

   {
        "version": "0.1.0",
        "isShellCommand": true,
        "tasks": [ 
            {
                "taskName": "default", 
                "command": "gulp",
                "args": [ "--no-color"  ],
                "isBuildCommand": false,
                "isWatching": false,
                "problemMatcher":[
                    "$lessCompile",
                    "$tsc",
                    "$jshint"
                ]
            },
            {
                "taskName": "rebuild",
                "args": [],
                "isBuildCommand": false,
                "isWatching": false,
                "problemMatcher":[
                    "$lessCompile",
                    "$tsc",
                    "$jshint"
                ]
            },
            {
                "taskName": "abc",
                "command": "gulp",
                "args": [ "--no-color"  ],
                "isBuildCommand": true,
                "problemMatcher":[
                    "$lessCompile",
                    "$tsc",
                    "$jshint"
                ]
            }
        ]
    }
    设置Visual Studio Code 快捷编译热键(Win:Shift+Ctrl+B Mac:Shift+Command+B)执行命令
10. 修改launch.json文件，设置electron 启动App(热键 Win:F5 Mac:Fn+F5 )
    win 配置如下：
     {
        "version": "0.2.0",
        "configurations": [
            {
                "type": "node",
                "request": "launch",
                "name": "Launch BK700",
                "program": "${workspaceRoot}/App/electron.js",
                "cwd": "${workspaceRoot}/App/",
                "runtimeExecutable": electron路径,
                "protocol": "legacy",
                "runtimeArgs": [],
                "env": { },
                "args": [],
                "sourceMaps": true
            }
        ]
    }
 Mac 配置如下：
     {
        "version": "0.2.0",
        "configurations": [
            {
                "type": "node",
                "request": "launch",
                "name": "Launch BK700",
                "program": "${workspaceRoot}/App/electron.js",
                "cwd": "${workspaceRoot}/App/",
                "runtimeExecutable": electron路径,
                "protocol": "legacy",
                "runtimeArgs": [],
                "env": { },
                "args": [],
                "sourceMaps": true
            }
        ]
    }

11.electron路径 請依照安裝時配置操作. 
PS:打包前先到src\angular\css抓取ttf檔放至App\css底下

打包command 用vscode的終端機 到App目錄下
Mac :
electron-packager ./ BK700 --platform=darwin --arch=x64  --electron-version=1.4.10
Windows:
x64:
electron-packager ./ BK700 --platform=win32 --arch=x64 --electron-version=1.4.10 --icon=./image/icon.ico

x32:
electron-packager ./ BK700 --platform=win32 --arch=ia32 --electron-version=1.4.10 --icon=./image/icon.ico 



12.打包前在HD頁的detectFWVersion須注意FW執行檔路徑，並確認打包內的FW Version
檔名一律改為BK700-FWUpdate.exe，且如有升版時應將detectFWVersion()內的版本號判斷手動更改

如用F5開啟 路徑為 "../BK700-FWUpdate.exe"
打包前請更改為 "resources/app/BK700-FWUpdate.exe"



前端呼叫後端流程
ex. 由container.component 透過 protocol.service 再傳至 AppProtocol 到system的function
但此方式有個問題, system function無法callback參數值只能回傳是否有error, 修正方式callback obj裡面包含err和param

後端通知前端流程
Component 透過ElectronEventService來收到後端的通知

13.目前FW版本為V37