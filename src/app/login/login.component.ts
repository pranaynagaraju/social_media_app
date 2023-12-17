import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { GoogleAuthProvider, signInWithPopup } from "firebase/auth";
import { auth } from '../../firebase/firebaseConfig';
import { UserService } from '../services/user.service';


@Component({
  selector: 'app-login',
  standalone: true,
  imports: [FormsModule],
  templateUrl: './login.component.html',
  styleUrl: './login.component.css'
})
export class LoginComponent {
  passVisible: boolean = false;
  email: string = "";
  password: string = "";




  //constructor(private router: Router, private _userService: UserService) { }
  constructor(private router: Router) { }
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


  //Need to review this
  // async googleLogin() {
  //   const provider = await new GoogleAuthProvider();
  //   const user = await signInWithPopup(auth, provider);
  //   // ... Now you have access to the user object ...
  //   console.log(JSON.stringify(user))
  // // You can also just return specific details instead of the entire object.
  // }
  
  async googleLogin(): Promise<any> {
    try {
      const provider = await new GoogleAuthProvider();
      const userResult = await signInWithPopup(auth, provider);
      const userDetails = {
        userName: userResult.user.displayName,
        userEmail: userResult.user.email,
        userImage: userResult.user.photoURL,
      };
      sessionStorage.setItem("userDetails",JSON.stringify(userDetails));
      //this._userService.setUserDetails(userDetails);
      if (userResult) {
        this.router.navigate(['/home']);
      }
    } catch (error:any) {
      console.error('Error during Google login:', error);
      console.log("Login failed due to an error")
      // if (error.code === "auth/popup-closed-by-user") {
      //   console.log("closed by the user")
      // } else if (error.code === "auth/network-error") {
      //   console.log("network problem")
      // } else {
      //   console.log("Login failed due to an error")
      // }
    }
  }
  
  
}