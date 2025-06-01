import { Component } from '@angular/core';
import { ImageHandlerComponent } from "../../image-handler/image-handler.component";
import { NgbNavModule } from '@ng-bootstrap/ng-bootstrap';
import { CommonModule } from '@angular/common';

@Component({
    standalone: true,
    selector: 'ham-national-weather',
    templateUrl: './national-weather.component.html',
    styleUrl: './national-weather.component.scss',
    imports: [ImageHandlerComponent, NgbNavModule, CommonModule]
})
export class NationalWeatherComponent {
    public selectedUvForecastDay: number = 1;
    public availableUvForecastDays: number[] = [1, 2, 3, 4];
    public activeUvForecastLink: string = "https://www.cpc.ncep.noaa.gov/products/stratosphere/uv_index/gif_files/uvi_usa_f1_wmo.gif";

    public onUvForecastNumberClick(day: number): void {
        this.selectedUvForecastDay = day;
        this.activeUvForecastLink = `https://www.cpc.ncep.noaa.gov/products/stratosphere/uv_index/gif_files/uvi_usa_f${day}_wmo.gif`;
    }
}
