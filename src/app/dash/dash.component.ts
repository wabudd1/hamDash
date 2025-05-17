import { Component, OnInit } from '@angular/core';
import { ApiService } from '../services/api.service';
import { IEpaUltraviolet } from '../models/iEpaUltraviolet';

@Component({
  selector: 'ham-dash',
  standalone: true,
  imports: [],
  templateUrl: './dash.component.html',
  styleUrl: './dash.component.scss',
  providers: [ApiService]
})
export class DashComponent implements OnInit {
  public todayUltraviolet?: IEpaUltraviolet;

  constructor(private api: ApiService) {
  }

  public ngOnInit(): void {
    this.loadCurrentUvIndex();
  }

  private loadCurrentUvIndex(): void {
    this.api.getCurrentUv(28806).subscribe({
      next: data => {
        this.todayUltraviolet = data[0];
      },
      error: err => {
        console.error('UV index borked:  ' + err);
      }
    });
  }
}
