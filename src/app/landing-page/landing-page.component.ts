import { Component, OnInit,NgZone  } from '@angular/core';
import { onAuthStateChanged } from 'firebase/auth';
import { auth } from '../../firebase/firebaseConfig';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { AnimationComponent } from '../animation/animation.component';
import { HttpClient,HttpClientModule } from '@angular/common/http';

@Component({
  selector: 'app-landing-page',
  standalone: true,
  imports: [CommonModule,AnimationComponent,FormsModule,HttpClientModule],
  templateUrl: './landing-page.component.html',
  styleUrl: './landing-page.component.css'
})
export class LandingPageComponent implements OnInit {
  isAnimation=true;
  token:any;
  loginCheck:any;
  url='http://localhost:8080/';
  constructor(private router:Router,private http:HttpClient){}
  ngOnInit(): void {
  this.token=localStorage.getItem("token");
  if (this.token) {
    this.url = this.url + '?token=' + this.token;
    this.loginCheck = this.http.get(this.url).subscribe(
      response => {
        this.router.navigate(['/home']);
        this.isAnimation = false; // Set animation to false after the HTTP request is completed
      },
      error => {
        this.isAnimation = false; // Make sure to set animation to false even in case of an error
      }
    );
  } else {
    this.isAnimation = false; // Set animation to false if there is no token
  }
}
  loginBtn():void
  {
    this.router.navigate(['/login']);
  }
  signUpBtn():void
  {
    this.router.navigate(['/signup']);
  }
}
