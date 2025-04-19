import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

@Injectable({ providedIn: 'root' })
export class AuthService {
  private token: string | null = null;

  constructor(private http: HttpClient) {}

  signup(username: string, password: string) {
    return this.http.post<{ message: string }>('http://localhost:3000/signup', { username, password }).toPromise();
  }

  login(username: string, password: string) {
    return this.http.post<{ token: string }>('http://localhost:3000/login', { username, password })
      .toPromise()
      .then(res => {
        if(res){
            this.token = res.token;
            localStorage.setItem('token', this.token);
        }
       
      });
  }

  getToken() {
    return localStorage.getItem('token');
  }
}