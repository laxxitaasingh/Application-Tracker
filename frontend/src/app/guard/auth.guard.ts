import { Injectable } from '@angular/core';
import {
  CanActivate,
  Router
} from '@angular/router';

@Injectable({
  providedIn: 'root'
})
export class AuthGuard implements CanActivate {
  constructor(private router: Router) {}

  canActivate(): boolean {
    if (typeof window !== 'undefined') {
        const token = localStorage.getItem('token');
  
        if (token) {
          return true;
        } else {
          alert('You are not authorized to access this page. Please log in.');
          this.router.navigate(['/login']);
          return false;
        }
      }
  
      // In case this somehow runs outside of browser
      return false;
    }
  }

