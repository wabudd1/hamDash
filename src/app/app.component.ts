import { Component } from '@angular/core';
import { DashComponent } from "./dash/dash.component";

@Component({
  selector: 'ham-root',
  standalone: true,
  templateUrl: './app.component.html',
  styles: [],
  imports: [DashComponent],
})
export class AppComponent {
  title = 'hamDash';
}
