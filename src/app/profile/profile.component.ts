import { CommonModule } from '@angular/common';
import { HttpClient,HttpClientModule, HttpErrorResponse, HttpHeaders } from '@angular/common/http';
import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';

@Component({
  selector: 'app-profile',
  standalone: true,
  imports: [CommonModule,HttpClientModule,FormsModule],
  templateUrl: './profile.component.html',
  styleUrl: './profile.component.css'
})
export class ProfileComponent implements OnInit{
  @ViewChild('addCommentRef') myInput: ElementRef | undefined;
  profilebtnSelected=false;
  userName="";
  email="";
  userImage="";
  posts:any[]=[];
  postsLength:undefined | number;
  savedPostsLength:undefined|number;
  token:any;
  isloading=false;
  postDetails:any;
  isPostsSelected=true;
  showPostDetails=false;
  comment="";
  savedPosts:any[]=[];
  url="http://localhost:8080/api/"

  constructor(private http:HttpClient, private router:ActivatedRoute)
  {

  }
  onProfileSelected():void
  {
  console.log("clicked")
  this.profilebtnSelected=!this.profilebtnSelected;
  console.log(this.profilebtnSelected);
  }

  changeElementStatePost():void
  {
    this.isPostsSelected=true;
  }
  changeElementStateSaved():void
  {
    this.isPostsSelected=false;
  }
  ngOnInit()
{
  this.isloading=true;
  this.token=localStorage.getItem('token');
  const token =localStorage.getItem('token');
  if(token)
  {
    console.log();
 this.http.get(this.url+"user/user-profile?token="+token+"&uid="+this.router.snapshot.params['id']).subscribe(
  (res:any)=>{
    this.userName=res.userName;
    this.userImage=res.userPhotoUrl;
    this.email=res.email;
    this.posts=res.userPosts;
    this.savedPosts=res.savedPostsList;
    this.postsLength=this.posts.length;
    this.savedPostsLength=this.savedPosts.length;
  
    this.isloading=false;
  }
 )
  }
}
onSaveClick(post:any) {
  post.saved = !post.saved;
  console.log(this.savedPosts.length)
  if(post.saved)
  {
    this.savedPosts.unshift(post);
  }
  console.log(this.savedPosts.length)
  const params = {
    token: this.token,
    postId: post.postId.toString(),
  };
  return this.http.post<string>(`${this.url}post/save`, null, { params }).subscribe(
    (response:String)=>
    {
        console.log(response);
    }
  );
} 
toggleCaret():void
{
  if(this.myInput)
  {
  const inputElement = this.myInput.nativeElement as HTMLInputElement;
  inputElement.focus();
  }
}

closePostDetailsModal()
{   
  this.showPostDetails=false;

}
showDetails(post:any)
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
onLikeClick(postToBeLiked:any) {
  postToBeLiked.liked = !postToBeLiked.liked;
  if(postToBeLiked.liked)
  {
    postToBeLiked.totalLikes++;
  this.posts.map((post)=>{
    if(post.postId==postToBeLiked.postId)
    {
      post.totalLikes++;
    }
  })
  }
  else
  {
    postToBeLiked.totalLikes--;
    this.posts.map((post)=>{
      if(post.postId==postToBeLiked.postId)
      {
        post.totalLikes--;
      }
    })
  }
  const params = {
    token: this.token,
    postId: postToBeLiked.postId.toString(),
  };
  return this.http.post<string>(`${this.url}post/like`, null, { params }).subscribe(
    (response:String)=>
    {
        console.log(response);
    }
  );
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
        this.showDetails(postDetails);
        this.comment="";
      },
      (error: HttpErrorResponse) => {
        console.error('Error:', error);
        console.log('Response Text:', error.error.text); // Access the response text
        // Handle the error as needed
      }
    );
}

}
