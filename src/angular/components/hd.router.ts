import { NgModule, Component } from '@angular/core';
import {Routes, RouterModule} from '@angular/router';
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


const route : Routes =[
  { path:'game', component:GameComponent},
  { path:'light', component:LightComponent },
  { 
    path:'selfdf',
    component:SelfdfComponent, 
    children:[
      {
        path:'selfdf01',
      component:Selfdf01Component,
      children:[
        {
          path:'side01',
          component:side01Component
        },
        {
          path:'side02',
          component:side02Component
        },
        {
          path:'side03',
          component:side03Component
        },
        {
          path:'side04',
          component:side04Component
        },
        {
          path:'side05',
          component:side05Component
        },
        {
          path:'side06',
          component:side06Component
        },
        {
          path:'side07',
          component:side07Component
        }
      ]//第三層
    },//  path:'selfdf01',
    {
      path:'selfdf02',
      component:Selfdf02Component, 
    }

    ] //path:'selfdf',
    
    
    
  },//第二層self

  { path:'',redirectTo: '' , pathMatch: 'full'}

];

@NgModule({
    imports: [RouterModule.forRoot(route)],
    exports:  [RouterModule]

})

export class AppRoutingModule {}
