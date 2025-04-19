import { Component } from '@angular/core';
import { AuthService } from '../service/auth.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-signup',
  templateUrl: './signup.component.html',
  styleUrl: './signup.component.css'
})
export class SignupComponent {
  username = '';
  password = '';

  constructor(private auth: AuthService , public router: Router) {}

  signup() {
    this.auth.signup(this.username, this.password)
    .then(() => {
      alert('User created successfully');
      this.router.navigate(['/login']); // Redirect to login
    })
    .catch((err) => {
        alert('Signup failed. User already exists.');
      
    });
  }
}
