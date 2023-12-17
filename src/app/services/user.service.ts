import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class UserService {
  userDetails: any = null;

  constructor() { }

  setUserDetails(userDetails: any): void {
    this.userDetails = userDetails;
  }

  clearUserDetails(): void {
    this.userDetails = null;
  }
}
