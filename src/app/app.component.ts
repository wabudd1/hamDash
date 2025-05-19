import { Component } from '@angular/core';
import { DashComponent } from "./dash/dash.component";
import { NgbNavModule } from '@ng-bootstrap/ng-bootstrap';
import { EmInfoComponent } from "./em-info/em-info.component";

@Component({
  selector: 'ham-root',
  standalone: true,
  templateUrl: './app.component.html',
  styles: [],
  imports: [DashComponent, NgbNavModule, EmInfoComponent],
})
export class AppComponent {
  title = 'hamDash';
}
