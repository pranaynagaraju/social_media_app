import { Component, ElementRef,HostListener, OnDestroy, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { auth } from '../../firebase/firebaseConfig';
import { CommonModule } from '@angular/common';
import { AnimationComponent } from '../animation/animation.component';
import { FormsModule } from '@angular/forms';
import { HttpClient,HttpClientModule, HttpHeaders} from '@angular/common/http';
import { signOut } from 'firebase/auth';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [CommonModule,AnimationComponent,FormsModule,HttpClientModule],
  templateUrl: './home.component.html',
  styleUrl: './home.component.css'
})
export class HomeComponent implements OnInit,OnDestroy{
 userLoggedIn=false;
 userDetails:any;
 userImage:any='../../assets/user.png';
 userName:any;
 showFiller = true;
 userEmail:any;
 fileUpload: File | undefined;
 isAnimation=true;
 profilebtnSelected:boolean;
 loginCheck:any;
 token:any;
 postText: any="";
 postsList: any[]=[];
 totalNoOfPosts=0;
 url='http://localhost:8080/api/';
  constructor(private router:Router,private elRef: ElementRef, private http: HttpClient){
    this.profilebtnSelected=false;
  }
  ngOnDestroy(): void {
   if (this.loginCheck) {
    this.loginCheck.unsubscribe();
  }
  }

  ngOnInit() {
    // if (typeof localStorage !== 'undefined') {
    //   this.token=localStorage.getItem('token');
    // } 
    // const verifyTokenUrl=this.url+"user/user-details"+"?token="+this.token;
    // this.loginCheck = this.http.get(verifyTokenUrl).subscribe(
    //   response => {
    //     let user: any = response;
    //     this.userName = user.name;
    //     this.userEmail = user.email;
    //     if(user.photoURL)
    //     {
    //     this.userImage = user.photoURL;
    //     }

    //     console.log("API call here");
    //   },
    //   error => {
    //       ;
    //   }
    // )
    this.getAllPosts();
  }

  closeDropdown():void
  {
    if(this.profilebtnSelected)
    {
      this.profilebtnSelected=false;
    }
    
  }
  getAllPosts(): void {
    const getAllPostUrl = `${this.url}post/get-all-posts?token=${this.token}`;
    
    this.http.get(getAllPostUrl).subscribe(
      (response: any) => {
        this.postsList = response;
        this.totalNoOfPosts=this.postsList.length;
      },
      (error: any) => {
        // Handle errors if needed
      }
    );
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
      localStorage.removeItem('token');
      this.router.navigate([''])

    }).catch((error) => {

    });
    
  }
  uploadImage(event:Event):void{
    const inputElement = event.target as HTMLInputElement;
  const file = inputElement?.files?.[0];

  if (file) {
    this.fileUpload = file;
    console.log(this.fileUpload);
  }
}
postUpdate():void
{
  if (this.fileUpload) {
    const formData = new FormData();
    formData.append('token', this.token.toString());
    formData.append('file', this.fileUpload as Blob, 'filename');
    formData.append('postText', this.postText);
    console.log(this.url + 'upload'+formData)
    console.log(this.fileUpload.toString());
    const sendPostUrl = `${this.url}post/upload`;
    const headers = new HttpHeaders({
      'Content-Type': 'application/json', 
    });

    this.http.post<any>(sendPostUrl, formData).subscribe(
      (response) => {
        console.log('POST request successful:', response);
      },
      (error) => {
        console.error('POST request error:', error);
      }
    );

    this.getAllPosts();
  }

}
}
