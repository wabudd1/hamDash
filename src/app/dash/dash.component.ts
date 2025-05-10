import { Component } from '@angular/core';
import { ApiService } from '../services/api.service';
import { IEpaUltraviolet } from '../models/iEpaUltraviolet';

@Component({
  selector: 'ham-dash',
  standalone: true,
  imports: [],
  templateUrl: './dash.component.html',
  styleUrl: './dash.component.scss'
})
export class DashComponent {
  public todayUltraviolet?: IEpaUltraviolet;

  constructor(private api: ApiService) {
    this.api.getCurrentUv(28806).subscribe({
      next: data => this.todayUltraviolet = data,
      error: err => console.error('UV index borked:  ' + err)
    });
  }
}
