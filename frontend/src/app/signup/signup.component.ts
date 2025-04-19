import { Component } from '@angular/core';
import { AuthService } from '../service/auth.service';

@Component({
  selector: 'app-signup',
  templateUrl: './signup.component.html',
  styleUrl: './signup.component.css'
})
export class SignupComponent {
  username = '';
  password = '';

  constructor(private auth: AuthService) {}

  signup() {
    this.auth.signup(this.username, this.password)
      .then(() => alert('User created successfully'))
      .catch(err => alert('Signup failed'));
  }
}
