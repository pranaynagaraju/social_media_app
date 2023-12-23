import { Component, ElementRef,HostListener, OnDestroy, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { onAuthStateChanged,signOut } from 'firebase/auth';
import { auth } from '../../firebase/firebaseConfig';
import { CommonModule } from '@angular/common';


@Component({
  selector: 'app-home',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './home.component.html',
  styleUrl: './home.component.css'
})
export class HomeComponent implements OnInit, OnDestroy {
 userLoggedIn=false;
 userDetails:any;
 userImage:any='../../assets/user.png';
 userName:any;
 userEmail:any;
 profilebtnSelected:boolean;
  // constructor(private router:Router, private userService:UserService){}
  constructor(private router:Router,private elRef: ElementRef){
    this.profilebtnSelected=false;
  }

  ngOnInit() {
    onAuthStateChanged(auth, (user) => {
      if (user) {
        console.log(user)
        this.userLoggedIn=true;
        this.userName=user.displayName;
        this.userEmail=user.email;
        this.userImage=user.photoURL;
        this.profilebtnSelected=false;
      } else {
        this.router.navigate([''])
      }
    });
    document.addEventListener('click', this.onDocumentClick.bind(this));
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
  //@HostListener('document:click', ['$event'])
  onDocumentClick(event: MouseEvent) {
    console.log("closing")
    // Check if the click occurred outside the dropdown element
    if (!this.elRef.nativeElement.contains(event.target)) {
      console.log(this.profilebtnSelected)
      this.profilebtnSelected = false;
    }
  }
onProfileSelected():void
  {
  console.log("clicked")
  this.profilebtnSelected=!this.profilebtnSelected;
  console.log(this.profilebtnSelected);
  }
  onImageError() {
    this.userImage = '../../assets/user.png';
  }
  onsignOutbtnclick():void
  {
    console.log("signout")
    signOut(auth).then(() => {
      console.log("here")  
      this.router.navigate([''])

    }).catch((error) => {
      // An error happened.
    });
    
  }
  ngOnDestroy() {
    document.removeEventListener('click', this.onDocumentClick.bind(this));
  }
}
