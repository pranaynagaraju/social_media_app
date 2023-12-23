import { Component, OnInit, NgZone  } from '@angular/core';
import { Router } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { GoogleAuthProvider, signInWithPopup } from "firebase/auth";
import { onAuthStateChanged,signOut } from 'firebase/auth';
import { auth } from '../../firebase/firebaseConfig';
import { AnimationComponent } from '../animation/animation.component';
import { CommonModule } from '@angular/common';


@Component({
  selector: 'app-login',
  standalone: true,
  imports: [FormsModule,AnimationComponent,CommonModule],
  templateUrl: './login.component.html',
  styleUrl: './login.component.css'
})
export class LoginComponent  implements OnInit {
  constructor(private router: Router ,private ngZone: NgZone) { }
  passVisible: boolean = false;
  email: string = "";
  password: string = "";
  isLoading=true;
 
  ngOnInit(): void {
    onAuthStateChanged(auth, (user) => {
      if (user) {
        this.ngZone.run(() => {
          this.router.navigate(['/home']);
        });
      } 
    });
  }
  visibility(): void {
    this.passVisible = !this.passVisible;
    console.log(this.passVisible)
  }

  login(event: Event): void {
    const loginUrl = 'http://localhost:8080/api/login';  // Replace with your actual login endpoint

    const loginData = {
      email: this.email,
      password: this.password
    };
    console.log(this.email, this.password)
    const requestOptions = {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(loginData)
    };

    fetch(loginUrl, requestOptions)
      .then(response => response.json())
      .then(data => {
        console.log(data);
        //this.router.navigate(['/home'])
      })
      .catch(error => {
        // Handle errors here
        console.error('Error:', error);
      });

  }
  //working code
  // async googleLogin(): Promise<any> {
  //   const provider = await new GoogleAuthProvider();
  //   return await signInWithPopup(auth, provider);
  // }
  
  async googleLogin(): Promise<any> {
    try {
      const provider = await new GoogleAuthProvider();
      const userResult = await signInWithPopup(auth, provider);

      if (userResult) {
        this.router.navigate(['/home']);
      }
    } catch (error:any) {
      console.log("Login failed due to an error")
    }
  }
  
  
}