import { Component, OnInit, NgZone  } from '@angular/core';
import { Router, RouterLink } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { GoogleAuthProvider, signInWithPopup,signInWithEmailAndPassword } from "firebase/auth";
import { onAuthStateChanged,signOut } from 'firebase/auth';
import { auth } from '../../firebase/firebaseConfig';
import { AnimationComponent } from '../animation/animation.component';
import { CommonModule } from '@angular/common';
import { HttpClient,HttpClientModule } from '@angular/common/http';


@Component({
  selector: 'app-login',
  standalone: true,
  imports: [FormsModule,AnimationComponent,CommonModule,RouterLink,HttpClientModule],
  templateUrl: './login.component.html',
  styleUrl: './login.component.css'
})
export class LoginComponent  implements OnInit {
  loginCheck: any;
  passVisible: boolean = false;
  email: string = "";
  password: string = "";
  isAnimation=false;
  token:any;
  url='http://localhost:8080/api/';
  constructor(private router: Router, private http: HttpClient) { }
   
  ngOnInit(): void {
    if (typeof localStorage !== 'undefined') {
      this.token=localStorage.getItem('token');
    } 
    if(this.token)
    {
    this.loginCheck = this.http.get(this.url+"user/user-details"+"?token="+this.token).subscribe(
      response => {
      this.router.navigate(['/home']);
      }
    );
    }
  }
  visibility(): void {
    this.passVisible = !this.passVisible;
    console.log(this.passVisible)
  }

  login(event: Event): void {
    event.preventDefault();
    this.isAnimation=true;
    signInWithEmailAndPassword(auth, this.email, this.password)
  .then((userCredential) => {
    userCredential.user.getIdToken().then((idToken)=> {
      localStorage.setItem('token', idToken);
      this.router.navigate(['/home']);
  });
  })
  .catch((error) => {
    const errorCode = error.code;
    const errorMessage = error.message;
    this.isAnimation=false;
  });
  }
  //working code
  // async googleLogin(): Promise<any> {
  //   const provider = await new GoogleAuthProvider();
  //   return await signInWithPopup(auth, provider);
  // }
  
  async googleLogin(): Promise<any> {
   
      const provider = await new GoogleAuthProvider();
      const userResult = await signInWithPopup(auth, provider) .then((userResult) => {
        userResult.user.getIdToken().then((idToken)=> {
          localStorage.setItem('token', idToken);
          this.router.navigate(['/home']);
      });
      })
      .catch((error) => {
        console.error("Login failed due to an error", error);
      });

      
  }
  
  
}