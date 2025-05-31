import { Component } from '@angular/core';
import { NgbNavModule } from '@ng-bootstrap/ng-bootstrap';
import { EmInfoComponent } from "./em-info/em-info.component";
import { RegionalWeatherComponent } from "./dash/regional-weather/regional-weather.component";
import { NationalWeatherComponent } from "./dash/national-weather/national-weather.component";
import { RadioPropagationComponent } from "./dash/radio-propagation/radio-propagation.component";
import { ClockComponent } from './clock/clock.component';

@Component({
    standalone: true,
    selector: 'ham-root',
    templateUrl: './app.component.html',
    styles: [],
    imports: [NgbNavModule, EmInfoComponent, RegionalWeatherComponent, NationalWeatherComponent, RadioPropagationComponent, ClockComponent]
})
export class AppComponent {}
