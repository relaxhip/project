declare var System;
import { Component, OnInit, Input } from '@angular/core';
import { protocolService } from '../services/service/protocol.service';
const { ipcRenderer } = System._nodeRequire('electron');

@Component({
    selector: 'clickarea-app',
    templateUrl: './components/pages/clickarea.compo.html',
    //template: '<h1>我的第一个 Angular 应用</h1>',
    styleUrls: ['./css/first.css'],

})

export class clickareaComponent {


}