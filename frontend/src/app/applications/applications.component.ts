import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Component } from '@angular/core';

@Component({
  selector: 'app-applications',
  templateUrl: './applications.component.html',
  styleUrl: './applications.component.css'
})
export class ApplicationsComponent {
  applications: any[] = [];
  newApp = { company: '', position: '', status: 'Applied' };
  statuses = ['Applied', 'Interview', 'Rejected', 'Offered', 'On Hold'];

  constructor(private http: HttpClient) {}

  ngOnInit() {
    this.fetchApplications();
  }

  fetchApplications() {
    const token = localStorage.getItem('token');
    this.http.get<any[]>('http://localhost:3000/applications',{
      headers: new HttpHeaders({
        Authorization: `${token}`
      })
    }).subscribe(data => this.applications = data);
  }
  addApplication() {
    const token = localStorage.getItem('token');
  
    this.http.post('http://localhost:3000/applications', this.newApp, {
      headers: new HttpHeaders({
        Authorization: `${token}`
      })
    }).subscribe(() => {
      this.newApp = { company: '', position: '', status: 'Applied' };
      this.fetchApplications();
    });
  }
  deleteApplication(id: number) {
    const token = localStorage.getItem('token');
    this.http.delete(`http://localhost:3000/applications/${id}`,{
      headers: new HttpHeaders({
        Authorization: `${token}`
      })
    }).subscribe(() => this.fetchApplications());
  }
}
