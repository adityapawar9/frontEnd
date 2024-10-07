import { Component } from '@angular/core';


@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrl: './app.component.css'
})
export class AppComponent {
  title = 'SENOVA';
   // baseUrl = 'http://35.172.163.234:8080/amazon-clone/'
   baseUrl = 'http://localhost:8080/'
   id: number = 0;
   whatToShow: number = 0;
}
