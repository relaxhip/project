declare var System;
import { Component ,OnInit, Input} from '@angular/core';
import {protocolService} from '../services/service/protocol.service';

const {ipcRenderer} = System._nodeRequire('electron');
declare var $:any;

@Component({
    selector: 'self-app',
    templateUrl : './components/selfdf.compo.html',
    //template: '<h1>我的第一个 Angular 应用</h1>',
    styleUrls: ['./css/first.css','./css/kbd.css'],
   
})



export class SelfdfComponent{
   selfshow:boolean=true;
   
    givclr01:any={
        color:"white",
        "background-color":"#E9004C",
    };
    givclr02:any={};
    
    clickon:any={
        color:"white",
        "background-color":"#E9004C",
    };

    clickOn01(){

        this.givclr01 = this.clickon;
        this.givclr02 = {};
        this.selfshow=true;
    };

    clickOn02(){

        this.givclr02 = this.clickon;
        this.givclr01 = {};
        this.selfshow=false;
    };
}