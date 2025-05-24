import { Component, OnInit } from '@angular/core';
import { NgbAccordionModule } from '@ng-bootstrap/ng-bootstrap';
import { RegionalWeatherComponent } from "./regional-weather/regional-weather.component";
import { RadioPropagationComponent } from "./radio-propagation/radio-propagation.component";

@Component({
  selector: "ham-dash",
  standalone: true,
  imports: [NgbAccordionModule, RegionalWeatherComponent, RadioPropagationComponent],
  templateUrl: "./dash.component.html",
  styleUrl: "./dash.component.scss"
})
export class DashComponent implements OnInit {

  constructor() {}

  public ngOnInit(): void {
  }
}
