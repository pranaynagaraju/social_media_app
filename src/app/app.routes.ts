import { Routes } from '@angular/router';
import { LoginComponent } from './login/login.component';
import { HomeComponent } from './home/home.component';
import { AnimationComponent } from './animation/animation.component';
import { LandingPageComponent } from './landing-page/landing-page.component';
import { SignupComponent } from './signup/signup.component';
import { UpdatedetailsComponent } from './updatedetails/updatedetails.component';
import { ProfileComponent } from './profile/profile.component';

export const routes: Routes = [{path:'home',component:HomeComponent},{path:'',component:LandingPageComponent},{path:'login',component:LoginComponent},
{path:'animation',component:AnimationComponent},{path:'signup',component:SignupComponent},
{path:'profile',component:ProfileComponent}];
