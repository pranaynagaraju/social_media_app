import { Routes } from '@angular/router';
import { LoginComponent } from './login/login.component';
import { HomeComponent } from './home/home.component';
import { AnimationComponent } from './animation/animation.component';
import { LandingPageComponent } from './landing-page/landing-page.component';

export const routes: Routes = [{path:'',component:LandingPageComponent},{path:'login',component:LoginComponent},
{path:'home',component:HomeComponent},
{path:'animation',component:AnimationComponent}];
