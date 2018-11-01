declare var System;
import { Component ,OnInit, Input} from '@angular/core';
import {protocolService} from '../services/service/protocol.service';

const {ipcRenderer} = System._nodeRequire('electron');
declare var $:any;

@Component({
    selector: 'hd-app',
    templateUrl : './components/fn.compo.html',
    //template: '<h1>我的第一个 Angular 应用</h1>',
    styleUrls: ['./css/first.css','./css/kbd.css'],
   
})



export class FnComponent{
    selfdf:any='none';
    showsd:boolean=false;
    
    ckcss:any={
    color:"white",
    "background-color":"rgba(233,0,76,0.5)",
    "border":"1px solid #E7004C"
    };
    
    lecss01="";
    lecss02="";
    lecss03="";
    lecss04="";
    lecss05="";
    lecss06="";
    lecss07="";
    
    becss:any={
        color:"#555555",
        "background-color":"transparent",
        "border":"1px solid transparent",
        };
        onClick01(){
      
        
            this.showsd=true;
            this.lecss01= this.ckcss;
            this.lecss02= this.becss;
            this.lecss03= this.becss;
            this.lecss04= this.becss;
            this.lecss05= this.becss;
            this.lecss06= this.becss;
            this.lecss07= this.becss;
          
        };
        onClick02(){
           
            this.showsd=true;
            this.lecss01= this.becss;
            this.lecss02= this.ckcss;
            this.lecss03= this.becss;
            this.lecss04= this.becss;
            this.lecss05= this.becss;
            this.lecss06= this.becss;
            this.lecss07= this.becss;
    
        };
        onClick03(){
            
            this.showsd=true;
            this.lecss01= this.becss;
            this.lecss02= this.becss;
            this.lecss03= this.ckcss;
            this.lecss04= this.becss;
            this.lecss05= this.becss;
            this.lecss06= this.becss;
            this.lecss07= this.becss;
    
        };
        onClick04(){
       
            this.showsd=true;
            this.lecss01= this.becss;
            this.lecss02= this.becss;
            this.lecss03= this.becss;
            this.lecss04= this.ckcss;
            this.lecss05= this.becss;
            this.lecss06= this.becss;
            this.lecss07= this.becss;
    
        };
        onClick05(){
          
            this.showsd=true;
            this.lecss01= this.becss;
            this.lecss02= this.becss;
            this.lecss03= this.becss;
            this.lecss04= this.becss;
            this.lecss05= this.ckcss;
            this.lecss06= this.becss;
            this.lecss07= this.becss;
    
        };
        onClick06(){
            
            this.showsd=true;
            this.lecss01= this.becss;
            this.lecss02= this.becss;
            this.lecss03= this.becss;
            this.lecss04= this.becss;
            this.lecss05= this.becss;
            this.lecss06= this.ckcss;
            this.lecss07= this.becss;
    
        };
        onClick07(){
           
            this.showsd=true;
            this.lecss01= this.becss;
            this.lecss02= this.becss;
            this.lecss03= this.becss;
            this.lecss04= this.becss;
            this.lecss05= this.becss;
            this.lecss06= this.becss;
            this.lecss07= this.ckcss;
    
        };
    
        callSelfdf(){
            this.selfdf='block';
            //console.log(this.selfdf);
        };
        
        colseSelfdf(){
            this.selfdf='none';
            //console.log(this.selfdf);
        };
}