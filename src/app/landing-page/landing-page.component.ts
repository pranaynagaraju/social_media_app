import { Component, OnInit,NgZone  } from '@angular/core';
import { onAuthStateChanged } from 'firebase/auth';
import { auth } from '../../firebase/firebaseConfig';
import { Router } from '@angular/router';


@Component({
  selector: 'app-landing-page',
  standalone: true,
  imports: [],
  templateUrl: './landing-page.component.html',
  styleUrl: './landing-page.component.css'
})
export class LandingPageComponent implements OnInit {
  constructor(private router:Router,private ngZone: NgZone){}
  ngOnInit(): void {
    onAuthStateChanged(auth, (user) => {
      if (user) {
        this.ngZone.run(() => {
          this.router.navigate(['/home']);
        });
      } 
    });
  }
  loginBtn():void
  {
    this.router.navigate(['/login']);
  }

}
