import { Component } from '@angular/core';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrl: './home.component.css'
})
export class HomeComponent {
  show: number = 0;
  toggle(num: number) {
    this.show = num;
  }
}
