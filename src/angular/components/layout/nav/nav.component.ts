declare var System;
import { OnInit,Component,Input,ChangeDetectorRef } from '@angular/core';
import { ElectronEventService, dbService} from '../../../services/libs/electron/index';
let evtVar = System._nodeRequire('./backend/others/eventVariable');

@Component({
    selector: 'sm-nav',
    templateUrl : './components/layout/nav/nav.component.html',
    styleUrls: ['./components/layout/nav/nav.component.css'],
    providers: [dbService]
})

export class NavComponent implements OnInit{

    @Input() DeviceName:string="";
    @Input() DeviceStatus:number=0;
    @Input() DeviceObj:any;

    device:Array<string>;
    DeviceObj2:any=[];
    test:any;

    constructor(private db:dbService, private cdr:ChangeDetectorRef){}

    ngOnInit() {
        ElectronEventService.on('icpEvent').subscribe((e: any) => {
            var obj = JSON.parse(e.detail);
            if (obj.Func === evtVar.EventTypes.RefreshDevice) {
                this.db.getDevice().then((doc:any)=>{
                    this.DeviceObj2=[];
                    for(let device of doc){
                        if(device.status == 1)
                            this.DeviceObj2.push(device);
                    }
                });
            }
        });
    }

    ngAfterViewInit(){
        this.cdr.markForCheck();
    }
}