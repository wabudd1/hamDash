import { Component, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { NgbModal, NgbPopoverModule } from '@ng-bootstrap/ng-bootstrap';
import { NgxChartsModule } from '@swimlane/ngx-charts';
import { IGraphData } from '../../models/iGraphData';
import { GraphDatumColor } from '../../models/GraphDatumColor';
import { ApiService } from '../../services/api.service';
import { IEpaUvForecast } from '../../models/iEpaUvForecast';
import { IEpaUltraviolet } from '../../models/iEpaUltraviolet';
import { INwsRoot } from '../../models/nws/iNwsRoot';
import { Constants, WeatherZone } from '../../constants';
import { AlertsModalComponent } from '../alerts-modal/alerts-modal.component';
import { lightFormat, parse } from 'date-fns';
import { convert } from 'convert';
import { GraphData } from '../../models/GraphData';

@Component({
    standalone: true,
    selector: 'ham-regional-weather',
    imports: [NgxChartsModule, NgbPopoverModule, FormsModule],
    templateUrl: './regional-weather.component.html',
    styleUrl: './regional-weather.component.scss',
    providers: [ApiService]
})
export class RegionalWeatherComponent implements OnInit {
  public readonly weatherZones: WeatherZone[] = Constants.relevantWeatherZones;
  public selectedWeatherZoneCode: string = "";
  public zoneStationLimit: number = 10;
  public latestStationObservations: INwsRoot[] = [];

  public apiDelayMinutes: number = 15;

  public weatherAlertCount: number = 0;
  public weatherZoneErrorCount: number = 0;
  public weatherAlertTimestamp?: Date;
  public weatherAlertZones: INwsRoot[] = [];

  public todayUltraviolet?: IEpaUltraviolet;
  public latestDayForecastDate: string = "";
  public hourlyUltraviolet?: IEpaUvForecast[];
  public latestHourlyForecastDate: string = "";


  // Array index does, in fact, align with UV Index number.
  public uvIndexColors: string[] = [
    "#006600", // Dark Green
    "#4eb400", // Slightly less Dark Green
    "#a1cf00", // Just Green
    "#f7e300", // Yellow
    "#f7b500", // Gold
    "#f78700", // Orange
    "#f75900", // More Orange
    "#e82b0f", // Red
    "#d9001c", // More Red
    "#ff0099", // Pink
    "#b54aff", // Lavender
    "#998cff", // Periwinkle
    "#80a6ff", // Light Blue
    "#66bfff", // Lighter Blue 
    "#4dd9ff" // Turquoise a.k.a. The Sun Is A Deadly Laser.
  ];

  public useImperial: boolean = true;
  public view: [number, number] = [700, 400];
  public uvGraphData: IGraphData[] = [];
  public uvGraphColors: GraphDatumColor[] = [];
  public xAxisLabel: string = "Day";
  public yAxisLabel: string = "UV Index";

  constructor(private api: ApiService, private modalService: NgbModal) {  }

  ngOnInit(): void {
    this.fetchWeatherAlerts();

    // TODO:  Add ZIP code input.
    this.loadCurrentUvIndex();
    this.loadUvIndexForecast();
  }

  /**
   * Called when the user selects an Observation Zone for the Current Observations table.
   * Loads data from the relevant stations within that zone.
   */
  public onObservationsLoadClick(): void {
    if (this.selectedWeatherZoneCode != null && this.selectedWeatherZoneCode.length > 0) {
      this.fetchZoneObservations(this.selectedWeatherZoneCode);
    }
  }

  public onAlertButtonClick(zoneAlert: INwsRoot): void {
		const modalRef = this.modalService.open(AlertsModalComponent);
    (modalRef.componentInstance as AlertsModalComponent).weatherZone = zoneAlert;
  }

  /**
   * Gets the filename of the UV Index image that corresponds to the day's
   * forecasted high UV Index (0-11, can't find images above 11).
   * @returns Filename of the image corresponding to the UV Index
   */
  public getUvIndexImage(): string {
    let src = "";

    if (this.todayUltraviolet != null) {
      src = "uv" + this.todayUltraviolet.UV_INDEX + ".gif";
    }

    return src;
  }

  public formatNwsDate(date: string | undefined): string {
    if (date != null) {
      let dateObj = new Date(date);
      return lightFormat(dateObj, "MM/dd/yy HH:mm");
    }
    else {
      return "";
    }
  }

  /**
   * Parses a weather measurement into a human readable format.  Converts the
   * value into Imperial if the stars are in alignment.
   * 
   * @param unitCode UnitCode field of a measurement
   * @param value Value field of a measurement 
   * @returns Human-readable string representation, possibly converted to Imperial
   */
  public parseUnitValue(unitCode: string, value?: number): string {
    let convertedUnit = "?";
    if (value != null) {
      let unitParts = unitCode.split(":");
      let unitPrefix = unitParts[0];
      let parsedUnit = unitParts[1];
      convertedUnit = `${value}${unitCode}`;

      switch (unitPrefix)
      {
        case "wmo":
        case "wmoUnit":
          convertedUnit = this.convertWmoUnit(parsedUnit, value);
          break;
        case "nwsUnit":
          // Haven't encountered yet.
          // Some kind of custom National Weather Service unit with no standard.
          break;
        case "uc":
          // Haven't encountered yet.
          // Supposed to be standard Units of Measure format.
          // https://unitsofmeasure.org/
          break;
      }
    }

    return convertedUnit;
  }

  /**
   * Gets some text to explain what the QC code means.
   * 
   * @param qcCode Single character qc_code on a measurement
   * @returns Text explaining what the code means
   */
  public getQualityControlExplainer(qcCode: string): string {
    let explainer = "";

    switch (qcCode)
    {
      case "Z":
        explainer = "Preliminary, no QC";
        break;
      case "C":
        explainer = "Coarse pass, passed level 1";
        break;
      case "S":
        explainer = "Screened, passed levels 1 and 2";
        break;
      case "V":
        explainer = "Verified, passed levels 1, 2, and 3";
        break;
      case "X":
        explainer = "Rejected/erroneous, failed level 1";
        break;
      case "Q":
        explainer = "Questioned, passed level 1, failed 2 or 3";
        break;
      case "G":
        explainer = "Subjectively good";
        break;
      case "B":
        explainer = "Subjectively bad";
        break;
      case "T":
        explainer = "Virtual temperature could not be calculated, air temperature passing all QC checks has been returned";
        break;
    }

    return explainer;
  }

  /**
   * Helper method to parse and/or convert (to imperial) WMO standard units.
   * Value parameter is expected to be in Metric units.
   * 
   * See https://codes.wmo.int/common/unit for a list.
   * @param unit WMO Unit Code
   * @param value Value of the measurement
   * @returns Human-readable string representation, possibly converted to Imperial.
   */
  private convertWmoUnit(unit: string, value: number): string {
    let convertedUnit = `${value}${unit}`;

    if (this.useImperial) {
      switch (unit)
      {
        case "degC":
          unit = "F";
          convertedUnit = convert(value, "celsius").to("best", "imperial").quantity.toFixed(2);
          convertedUnit += " °F";
          break;
        case "degree_(angle)":
          convertedUnit = this.getDirectionFromAngle(value);
          break;
        case "km_h-1":
          convertedUnit = convert(value, "km").to("best", "imperial").quantity.toFixed(2);
          convertedUnit += " mph";
          break;
        case "Pa":
          // Usually air pressure
          convertedUnit = convert(value, "Pa").to("best", "imperial").toString(2);
          // let mercury = value / 133.3223684;
          // convertedUnit = `${mercury}mmHG`;
          break;
        case "m":
          convertedUnit = convert(value, "m").to("best", "imperial").toString(2);
          break;
        case "mm":
          convertedUnit = convert(value, "mm").to("best", "imperial").toString(2);
          break;
        case "percent":
          convertedUnit = value.toFixed(2);
          convertedUnit += "%";
          break;
      }
    }
    else {
      // Make metric units more human readable.
      switch (unit)
      {
        case "degC":
          convertedUnit = `${value}°C`;
          break;
        case "degree_(angle)":
          convertedUnit = `${value} degrees`;
          break;
        case "km_h-1":
          convertedUnit = `${value} km/h`;
          break;
        case "Pa":
          convertedUnit = `${value} Pascals`;
          break;
        
      }
    }
    return convertedUnit;
  }

  /**
   * Converts an angle in degrees into a cardinal direction.
   * @param degrees Angle degrees (0 - 360) from a wind direction measurement
   * @returns string abbreviated cardinal direction
   */
  private getDirectionFromAngle(degrees: number): string {
    let cardinalDirection = "";

    let directions = ['N', 'NE', 'E', 'SE', 'S', 'SW', 'W', 'NW'];
    var index = Math.round(((degrees %= 360) < 0 ? degrees + 360 : degrees) / 45) % 8
    
    cardinalDirection = directions[index];

    return cardinalDirection;
  }

  /**
   * Loads data for the current day's UV Index Forecast.
   */
  private loadCurrentUvIndex(): void {
    this.api.getTodayMaxUv(28806).subscribe({
      next: (data) => {
        this.todayUltraviolet = data[0];
        this.latestDayForecastDate = lightFormat(this.parseEpaDateString(this.todayUltraviolet.DATE), "MM/dd");
      },
      error: (err) => {
        console.error("UV index borked:  " + err);
      },
    });
  }

  /**
   * Loads Hourly UV Index forecast data and converts it for display
   * in a pretty graph.
   */
  private loadUvIndexForecast(): void {
    this.api.getTodayHourlyUv(28806).subscribe({
      next: data => {
        this.hourlyUltraviolet = data;
        // TODO:  Remove data for pre-dawn/post-dusk hours.  Why would this ZIP code ever have UV light after 9pm at any time of year???
        this.latestHourlyForecastDate = lightFormat(this.parseEpaDateTimeString(this.hourlyUltraviolet[0].DATE_TIME), "MM/dd hh");
        this.uvGraphData = this.epaDataToGraph(this.hourlyUltraviolet);
        this.uvGraphColors = [];
        this.uvGraphData.forEach(datum => {
          this.uvGraphColors.push(new GraphDatumColor(datum.name, this.uvIndexColors[datum.value]));
        })
      },
      error: err => {
        console.error("UV index hourly borked:  " + err);
      }
    })
  }

  /**
   * Fetches alerts for the Zones defined in constants.#006600
   * TODO:  Currently only grabs one.  Not sure how burdensome it is to
   * be pulling ~15 per page load.
   */
  private fetchWeatherAlerts(): void {
    // TODO:  SetTimeout, while loop for constant refresh
    // TODO:  Should all zones be fetched at the same time?
    this.weatherAlertZones = [];
    this.weatherAlertCount = 0;
    Constants.relevantWeatherZones.forEach(val => {
      this.api.getWeatherAlerts(val.code).subscribe({
        next: alertZone => {
          this.weatherAlertZones.push(alertZone);
          this.weatherAlertCount += alertZone.features.length;
          this.weatherAlertTimestamp = new Date();
        },
        error: err => {
          console.log(err);
        }
      });
      
    });
  }

  /**
   * Gets a string representation of a date, unless undefined then returns a placeholder string.
   * Could use DatePipe but meh.
   * @param dateToFormat Date object to format
   * @returns Human readable date and time (24 hr) string
   */
  public datetoFormattedString(dateToFormat: Date | undefined): string {
    let date = "N/A";
    if (dateToFormat != null) {
      date = lightFormat(dateToFormat, "MM/dd/yy HH:mm");
    }
    return date;
  }

  /**
   * Calls the API to obtain Current Observation data for each station
   * in the given zone.
   * @param zoneCode NWS Zone Code e.g., "NCZ053"
   */
  private fetchZoneObservations(zoneCode: string): void {
    this.latestStationObservations = [];
    this.api.getStationsForZone(zoneCode, this.zoneStationLimit).subscribe({
        next: stations => {
          stations.features.forEach(val => {
            this.api.getLatestStationObservation(val.properties.stationIdentifier).subscribe({
              next: station => {
                this.latestStationObservations.push(station);
              },
              error: err => {
                console.log(err);
              }
            });
          });
        },
        error: err => {
          console.log(err);
        }
      });
  }

  /**
   * Retrieves the latest observation data from a given station and shoves
   * it into the global array of observations for display in a table.
   * 
   * @param stationId ID of the station, such as "KAVL"
   */
  private fetchLatestObservations(stationId: string): void {
    this.api.getLatestStationObservation(stationId).subscribe({
      next: data => {
        if (this.latestStationObservations.length == 0) {
          this.latestStationObservations.push(data);
        }
        else {
          let index = this.latestStationObservations.findIndex(val => val.properties.stationIdentifier == data.properties.stationIdentifier);
          if (index > -1) {
            this.latestStationObservations[index] = data;
          }
        }
      },
      error: err => {
        console.log(err);
      }
    });
  }

  /**
   * Parses the incoming raw UV Forecast data and simplifies it down to the
   * two values used in the graph.
   * @param rawData Raw UV Forecast object
   * @returns Simplified graph data
   */
  private epaDataToGraph(rawData: IEpaUvForecast[]): IGraphData[] {
    let results: IGraphData[] = [];

    // Surely they have an order property for a reason...right?
    rawData = rawData.sort((a, b) => a.ORDER - b.ORDER);
    rawData.forEach(val => {
      let parsedDate = this.parseEpaDateTimeString(val.DATE_TIME);
      results.push(new GraphData(lightFormat(parsedDate, "MM/dd hh aa"), val.UV_VALUE));
    });

    return results;
  }

  /**
   * Converts the EPA's weird date format into a Date object.
   * @param dateString DATE string from the EPA API
   * @returns Date object
   */
  private parseEpaDateString(dateString: string): Date {
    let dateObj = new Date();

    // "May/18/2025"
    dateObj = parse(dateString, "MMM/dd/yyyy", new Date());

    return dateObj;
  }

  /**
   * Converts the EPA's weird date format into a Date object.
   * @param dateTimeString DATE_TIME string from the EPA API
   * @returns Date object
   */
  private parseEpaDateTimeString(dateTimeString: string): Date {
    let dateObj = new Date();

    // "May/18/2025 07 AM"
    dateObj = parse(dateTimeString, "MMM/dd/yyyy hh aa", new Date());

    return dateObj;
  }
}
