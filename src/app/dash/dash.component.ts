import { Component, OnInit } from '@angular/core';
import { NgbAccordionModule } from '@ng-bootstrap/ng-bootstrap';
import { RegionalWeatherComponent } from "./regional-weather/regional-weather.component";
import { RadioPropagationComponent } from "./radio-propagation/radio-propagation.component";
import { NationalWeatherComponent } from "./national-weather/national-weather.component";

@Component({
    standalone: true,
    selector: "ham-dash",
    imports: [NgbAccordionModule, RegionalWeatherComponent, RadioPropagationComponent, NationalWeatherComponent],
    templateUrl: "./dash.component.html",
    styleUrl: "./dash.component.scss"
})
export class DashComponent implements OnInit {

  constructor() {}

  public ngOnInit(): void {
  }
}
