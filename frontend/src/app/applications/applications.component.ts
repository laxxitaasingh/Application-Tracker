import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Component } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-applications',
  templateUrl: './applications.component.html',
  styleUrl: './applications.component.css'
})
export class ApplicationsComponent {
  applications: any[] = [];
  newApp = { company: '', position: '', status: 'Applied' };
  statuses = ['Applied', 'Interview', 'Rejected', 'Offered', 'On Hold'];
  totalApplications = 0;
totalInterviews = 0;
totalOffers = 0;

  constructor(private http: HttpClient , public router: Router) {}

  ngOnInit() {
    this.fetchApplications();
  }

  fetchApplications() {
    const token = localStorage.getItem('token');
    this.http.get<any[]>('http://localhost:3000/applications',{
      headers: new HttpHeaders({
        Authorization: `${token}`
      })
    }).subscribe(data => {
     
      this.applications = data
      this.updateStats();
    } );
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
  updateStatus(app: any) {
    const token = localStorage.getItem('token');
    this.http.patch(`http://localhost:3000/applications/${app.id}`,
      { status: app.status },
      {
        headers: new HttpHeaders({
          Authorization: `${token}`,
        })
      }
    ).subscribe(() => {
      console.log('Status updated');
    }, err => {
      console.error('Failed to update status', err);
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
  logout() {
    localStorage.removeItem('token');
    this.router.navigate(['/login']);
  }

  updateStats() {
    this.totalApplications = this.applications.length;
    this.totalInterviews = this.applications.filter(app => app.status == 'Interview').length;
    this.totalOffers = this.applications.filter(app => app.status == 'Offered').length;
  }
}
