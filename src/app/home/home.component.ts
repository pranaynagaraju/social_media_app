import { Component, ElementRef,HostListener, OnDestroy, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { auth } from '../../firebase/firebaseConfig';
import { CommonModule } from '@angular/common';
import { AnimationComponent } from '../animation/animation.component';
import { FormsModule } from '@angular/forms';
import { HttpClient,HttpClientModule, HttpErrorResponse, HttpHeaders} from '@angular/common/http';
import { signOut } from 'firebase/auth';
import { TimeAgoPipe } from '../animation/pipes/timeAgoPipe';
import { PostDetails } from '../interfaces/post-details.interface';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [CommonModule,AnimationComponent,FormsModule,HttpClientModule,TimeAgoPipe],
  templateUrl: './home.component.html',
  styleUrl: './home.component.css'
})
export class HomeComponent implements OnDestroy,OnInit{
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
 isModalVisible = false;
 showPostDetails=false;
 postDetails: PostDetails = {} as PostDetails
 comment="";
 toggleModal() {
   this.isModalVisible = !this.isModalVisible;
 }
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
    if (typeof localStorage !== 'undefined') {
      this.token=localStorage.getItem('token');
    } 
    const verifyTokenUrl=this.url+"user/user-details"+"?token="+this.token;
    this.loginCheck = this.http.get(verifyTokenUrl).subscribe(
      response => {
        let user: any = response;
        this.userName = user.name;
        this.userEmail = user.email;
        if(user.photoURL)
        {
        this.userImage = user.photoURL;
        }
        console.log("API call here");
      },
      error => {
          ;
      }
    )
    this.getAllPosts();
  }

  closeDropdown():void
  {
    if(this.profilebtnSelected)
    {
      this.profilebtnSelected=false;
    }
    
  }
  onLikeClick(post:any) {
    post.liked = !post.liked;
    if(post.liked)
    {
    post.totalLikes++;
    }
    else
    {
      post.totalLikes--;
    }
    const params = {
      token: this.token,
      postId: post.postId.toString(),
    };
    return this.http.post<string>(`${this.url}post/like`, null, { params }).subscribe(
      (response:String)=>
      {
          console.log(response);
      }
    );
  }
  
onCommentClick(post:any)
{

  const getPostDetails = `${this.url}post/get-post-details?token=${this.token}&postId=${post.postId}`;
    
  this.http.get(getPostDetails).subscribe(
    (response: any) => {
     this.postDetails=response;
     this.showPostDetails=true;
    },
    (error: any) => {
      // Handle errors if needed
    }
  )
}
closePostDetailsModal()
{   
  this.showPostDetails=false;

}
addComment(postDetails: any) {
  const params = {
    token: this.token,
    postId: postDetails.postId.toString(),
    comment: this.comment,
  };

  const headers = new HttpHeaders({
    'Content-Type': 'text/plain',
  });

  this.http.post(`${this.url}post/add-comment`, {}, { params, headers, responseType: 'text' })
    .subscribe(
      (response: any) => {
        console.log(postDetails.pi);
        this.onCommentClick(postDetails);
        this.comment="";
      },
      (error: HttpErrorResponse) => {
        console.error('Error:', error);
        console.log('Response Text:', error.error.text); // Access the response text
        // Handle the error as needed
      }
    );
}

  getAllPosts(): void {
    console.log("called all posts")
    const getAllPostUrl = `${this.url}post/get-all-posts?token=${this.token}`;
    
    this.http.get(getAllPostUrl).subscribe(
      (response: any) => {
        this.postsList = response;
        this.totalNoOfPosts=this.postsList.length;
        console.log("ALL POST GET"+response)
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
      'Content-Type': 'text/plain', 
    });

    this.http.post(sendPostUrl, formData,{ responseType: 'text' }).subscribe(
      (response) => {
        this.getAllPosts();
        console.log('POST request successful:', response);
      },
      (error) => {
        console.error('POST request error:', error);
      }
    );
    }

}
}
