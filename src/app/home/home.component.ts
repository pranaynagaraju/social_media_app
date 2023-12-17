import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { onAuthStateChanged,signOut } from 'firebase/auth';
import { auth } from '../../firebase/firebaseConfig';
import { UserService } from '../services/user.service';



@Component({
  selector: 'app-home',
  standalone: true,
  imports: [],
  templateUrl: './home.component.html',
  styleUrl: './home.component.css'
})
export class HomeComponent implements OnInit {
 userLoggedIn=false;
 userDetails:any;
 userImage:any;
 userName:any;
 userEmail:any;
  // constructor(private router:Router, private userService:UserService){}
  constructor(private router:Router){}

  ngOnInit() {
    onAuthStateChanged(auth, (user) => {
      if (user) {
        console.log(user)
        this.userLoggedIn=true;
        this.userDetails = sessionStorage.getItem("userDetails");
        this.userDetails=JSON.parse(this.userDetails);
        this.userName=this.userDetails.userName;
        this.userEmail=this.userDetails.userEmail;
        this.userImage=this.userDetails.userImage

      } else {
        this.router.navigate([''])
      }
    });


    if(sessionStorage.getItem('userDetails')===null)
    {
      this.router.navigate(['/login'])
    }
  }
  // const handleLogout = () => {
  //   signOut(auth)
  //     .then(() => {
  //       setUser(null);
  //     })
  //     .catch((error) => {
  //       console.log("Logout error:", error);
  //     });
  // };
}
