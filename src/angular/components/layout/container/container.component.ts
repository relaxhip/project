declare var System;
import { Component ,OnInit ,Output ,EventEmitter} from '@angular/core';
import { ElectronEventService, dbService} from '../../../services/libs/electron/index';
import { protocolService } from '../../../services/service/protocol.service';

let evtVar = System._nodeRequire('./backend/others/eventVariable');
let funcVar = System._nodeRequire('./backend/others/FunctionVariable');
let env = System._nodeRequire('./backend/others/env');

@Component({
    selector: 'sm-container',
    templateUrl : './components/layout/container/container.component.html',
    styleUrls: ['./components/layout/container/container.component.css'],
    providers: [protocolService,dbService]
})

export class ContainerComponent implements OnInit{

    VID:string="";
    PID:string="";
    Status:string="";
    DeviceName:string="";
    DeviceObj:any=[]
    Device:any={};
    TempData:any;

    @Output() updateData:EventEmitter<string> = new EventEmitter();
    @Output() changeStatus:EventEmitter<string> = new EventEmitter();

    constructor(private protocol: protocolService, private db:dbService){
        console.log('container loading complete');
    }

    ngOnInit(){
       
       /* //收到後端通知
        // let obj = {
        //     Type : funcVar.FuncType.System,
        //     Func:funcVar.FuncName.InitDevice,
        //     Param:null
        // }
        // this.protocol.RunSetFunction(obj).then((data) => {
        //         console.log("111111:" + data);
        // });


        ElectronEventService.on('icpEvent').subscribe((e: any) => {
            var obj = JSON.parse(e.detail);
            this.TempData = obj;
            if (obj.Func === evtVar.EventTypes.RefreshDevice) {
                this.VID = obj.Param.VID;
                this.PID = obj.Param.PID;
                this.DeviceName = obj.Param.DeviceName;

                this.db.getDevice().then((doc:any)=>{
                    this.DeviceObj = doc;
                    //container.component將參數傳至app.component
                    this.changeStatus.emit(this.DeviceObj);
                })

                if(obj.Param == 1)
                    console.log('Device 插入 ');
                else if(obj.Param == 0)
                    console.log('Device 移除 ');
                // if(obj.Param.PlugType==1)
                //     this.Status="USB裝置插入"
                // else if(obj.Param.PlugType==0)
                //     this.Status="USB裝置移除"
                // let obj1 = {
                //     Type : funcVar.FuncType.System,
                //     SN:"111111",
                //     Func:funcVar.FuncName.abctest,
                //     Param:"111"
                // }
                // this.Device.DeviceName = obj.Param.DeviceName;
                // this.Device.VID = obj.Param.VID;
                // this.Device.PID = obj.Param.PID
                // ;
                // this.updateData.emit(obj.Param);
                // //console.log(JSON.stringify(obj1));
                // //呼叫後端函數
                // this.protocol.RunSetFunction(obj1).then((data) => {
                //         console.log("Container RunSetFunction:" + data);
                // });
            }
        });
    }

    scan(){
        let obj2 = {
            Type : funcVar.FuncType.System,
            SN:"222222",
            Func:funcVar.FuncName.InitDevice,
            Param:""//this.TempData.Param
        }
        //呼叫後端函數
        this.protocol.RunSetFunction(obj2).then((data) => {
            console.log("Container RunSetFunction:  " + data);
        });*/
    }
}