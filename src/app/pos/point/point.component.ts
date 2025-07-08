import { Component } from '@angular/core';
import { Router, RouterOutlet } from '@angular/router';

@Component({
  selector: 'app-point',
  imports: [RouterOutlet],
  templateUrl: './point.component.html',
  styleUrl: './point.component.css'
})
export class PointComponent {

  constructor(private router: Router) { }
}
