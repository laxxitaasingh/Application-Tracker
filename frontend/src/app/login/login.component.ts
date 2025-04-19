import { Component } from '@angular/core';
import { AuthService } from '../service/auth.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrl: './login.component.css'
})
export class LoginComponent {
  username = '';
  password = '';

  constructor(private auth: AuthService, public router:Router) {}

  login() {
    this.auth.login(this.username, this.password)
      .then(() => {
        alert('Logged in')
        this.router.navigate(['/applications']);
      })

      .catch((err) => {
        
          alert('Login failed. Invalid creds.');
      
      });
  }
}
