import { CommonModule } from '@angular/common';
import { HttpClient,HttpClientModule, HttpErrorResponse, HttpHeaders } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-profile',
  standalone: true,
  imports: [CommonModule,HttpClientModule,FormsModule],
  templateUrl: './profile.component.html',
  styleUrl: './profile.component.css'
})
export class ProfileComponent implements OnInit{
  profilebtnSelected=false;
  userName="";
  email="";
  userImage="";
  posts:any[]=[];
  token="";
  postDetails:any;
  isPostsSelected=true;
  showPostDetails=false;
  comment="";
  url="http://localhost:8080/api/"

  constructor(private http:HttpClient)
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
  const token =localStorage.getItem('token');
  if(token)
  {
    this.token=token;
 this.http.get(this.url+"user/user-profile?token="+token).subscribe(
  (res:any)=>{
    this.userName=res.userName;
    this.userImage=res.userPhotoUrl;
    this.email=res.email;
    this.posts=res.postDetailsDtoList;
  }
 )
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
