import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { AppComponent } from './app.component';
import { NavComponent } from './layout/nav/nav.component';
import { HdComponent } from './hd.compo';

import { side01Component } from './side01.compo';
import { side02Component } from './side02.compo';
import { side03Component } from './side03.compo';
import { side04Component } from './side04.compo';
import { side05Component } from './side05.compo';
import { side06Component } from './side06.compo';
import { side07Component } from './side07.compo';
import { LightComponent } from './light.compo';
import { SelfdfComponent } from './selfdf.compo';
import { GameComponent } from './game.compo';
import { Selfdf01Component } from './selfdf01.compo';
import { Selfdf02Component } from './selfdf02.compo';
import { AttComponent } from './attractlight.compo';
import { SocialComponent } from './social.compo';
import { rainbowComponent } from './rainbow.compo';
import { boomComponent } from './boom.compo';
import { breathComponent } from './breath.compo';
import { crashComponent } from './crash.compo';
import { crossComponent } from './cross.compo';
import { dragonComponent } from './dragon.compo';
import { floatComponent } from './float.compo';
import { lightrainComponent } from './lightrain.compo';
import { gameEffectComponent } from './gameEffect.compo';
import { lightenComponent } from './lighten.compo';
import { meetingComponent } from './meeting.compo';
import { pureComponent } from './pure.compo';
import { roundComponent } from './round.compo';
import { wavesComponent } from './waves.compo';
import { starlightComponent } from './starlight.compo';
import { blasoulComponent } from './blasoul.compo';
import { noneComponent } from './none.compo';



import { ContainerComponent } from './layout/container/container.component';
import { APP_BASE_HREF } from '@angular/common';
import { RouterModule } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { GetDeviceService } from '../services/device/GetDevice.service'
import { EmitService } from '../services/libs/electron/services/emit.service'
import { AttService } from './attservice.service';

// app routes
import { routes } from './app.routes';
import { HttpModule } from '@angular/http';

//let routerModule = RouterModule.forRoot(routes);

//routerModule = RouterModule.forRoot(routes, {useHash: true});
@NgModule({
    declarations: [
        AppComponent,
        HdComponent,
        NavComponent,
        ContainerComponent,
        side01Component,
        side02Component,
        side03Component,
        side04Component,
        side05Component,
        side06Component,
        side07Component,
        LightComponent,
        SelfdfComponent,
        GameComponent,
        Selfdf01Component,
        Selfdf02Component,
        AttComponent,
        SocialComponent,
        rainbowComponent,
        lightrainComponent,
        boomComponent,
        breathComponent,
        crashComponent,
        crossComponent,
        dragonComponent,
        floatComponent,
        gameEffectComponent,
        lightenComponent,
        meetingComponent,
        pureComponent,
        roundComponent,
        starlightComponent,
        wavesComponent,
        blasoulComponent,
        noneComponent,
    ],
    imports: [
        BrowserModule,
        FormsModule,
        //routerModule
        HttpModule,

    ],
        bootstrap: [
            AppComponent,
            // HdComponent,

        ],
        providers: [
            GetDeviceService,
            EmitService,
            AttService,
            {
                provide: APP_BASE_HREF,
                useValue: '<%= APP_BASE %>'
            }
        ]
                    
})

export class AppModule { }