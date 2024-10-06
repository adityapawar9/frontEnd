import { HttpClient } from '@angular/common/http';
import { Component } from '@angular/core';
import { AppComponent } from '../app.component';
interface ApiResponse {
  status: number;
  message: string;
}
@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrl: './login.component.css'
})
export class LoginComponent {
  constructor(public http: HttpClient, public app: AppComponent) {
  }
  user: any = {};
  isLogin: boolean = true; // Default to login form
  isLoading: boolean = false;
  username: string = '1234';
  password: string = 'Seller';

  login() {
    this.isLoading = true;
    const url = this.app.baseUrl + 'login/log';
    const obj = [this.username, this.password];
    this.http.post(url, obj).subscribe((data: any) => {
      if (!data) {
        window.alert('All fields are manditory')
      } else {
        if (data.id < 1) {
          window.alert(data.token)
        } else {
          this.isLoading = false;
          this.app.id = data.id;
          this.app.whatToShow = data.accountType;
          window.alert('Login successful')
        }
      }
    });
  }

  signup() {
    this.isLoading = true;
    if (!this.user.name || !this.user.userName || !this.user.password) {
      window.alert("All fields are mandatory")
      this.isLoading = false;
      return;
    }
    this.user.accountType = 3;
    const url = this.app.baseUrl + 'signup/register';
    this.http.post<ApiResponse>(url, this.user).subscribe((response: ApiResponse) => {
      if (response.status === 1) {
        window.alert(response.message)
        this.user = {}; // Reset user object
        this.isLogin = true; // Switch back to login form
        this.isLoading = false;
      } else {
        window.alert(response.message)
        this.isLoading = false;
      }
    });
  }

}
