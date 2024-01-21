export interface PostDetails {
    liked: boolean;
    postId: number;
    postImageUrl: string;
    postUploadedByUserName: string;
    postUploadedByUserPhoto: string;
    allComments: Comment[];
    totalLikes: number;
    totalComments: number;
  }
  
  export interface Comment {
    commentedUserName: string;
    commentedUserPhoto: string;
    comment: string;
    commentId: string;
  }