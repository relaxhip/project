declare var System;
import { Component, OnInit, Input } from '@angular/core';
import { protocolService } from '../services/service/protocol.service';

const { shell } = System._nodeRequire('electron');
const { ipcRenderer } = System._nodeRequire('electron');
declare var $: any;

@Component({
    selector: 'social-app',
    templateUrl: './components/social.compo.html',
    //template: '<h1>我的第一个 Angular 应用</h1>',
    styleUrls: ['./css/first.css', './css/social.css'],

})



export class SocialComponent {
    official(){
        shell.openExternal('http://www.blasoul.com/');
    }
    bbs(){
        shell.openExternal('http://bbs.blasoul.com/portal.php');
    }
    sell(){
        shell.openExternal("http://www.blasoul.com/index.php?m=content&c=index&a=lists&catid=154");
    }
    weibo(){
        shell.openExternal("https://www.weibo.com/BLASOUL?is_hot=1");
    }
}
