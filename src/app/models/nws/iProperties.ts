import { Geocode } from "./iGeocode";
import { Reference } from "./iReference";
import { Parameters } from "./iParameters";
import { Elevation } from "./iElevation";
import { Temperature } from "./iTemperature";
import { Dewpoint } from "./iDewPoint";
import { WindDirection } from "./iWindDirection";
import { WindSpeed } from "./iWindSpeed";
import { WindGust } from "./iWindGust";
import { BarometricPressure } from "./iBarometricPressure";
import { SeaLevelPressure } from "./iSeaLevelPressure";
import { Visibility } from "./iVisibility";
import { MaxTemperatureLast24Hours } from "./iMaxTemp";
import { MinTemperatureLast24Hours } from "./iMinTemp";
import { PrecipitationLastHour } from "./iPrecipLastHour";
import { PrecipitationLast3Hours } from "./iPrecripLast3";
import { PrecipitationLast6Hours } from "./iPrecipLast6";
import { RelativeHumidity } from "./iRelativeHumidity";
import { WindChill } from "./iWindChill";
import { HeatIndex } from "./iHeatIndex";
import { CloudLayer } from "./iCloudLayer";

export interface Properties {
  "@id": string
  "@type": string
  id: string
  areaDesc: string
  geocode: Geocode
  affectedZones: string[]
  references: Reference[]
  sent: string
  effective: string
  onset: string
  expires: string
  ends: string
  status: string
  messageType: string
  category: string
  severity: string
  certainty: string
  urgency: string
  event: string
  sender: string
  senderName: string
  headline: string
  description: string
  instruction: string
  response: string
  parameters: Parameters

  // Stations
  elevation: Elevation
  stationIdentifier: string
  name: string
  timeZone: string
  forecast: string
  county: string
  fireWeatherZone: string

  // Station Observation
  station: string
  timestamp: string
  rawMessage: string
  textDescription: string
  icon: string
  presentWeather: any[]
  temperature: Temperature
  dewpoint: Dewpoint
  windDirection: WindDirection
  windSpeed: WindSpeed
  windGust: WindGust
  barometricPressure: BarometricPressure
  seaLevelPressure: SeaLevelPressure
  visibility: Visibility
  maxTemperatureLast24Hours: MaxTemperatureLast24Hours
  minTemperatureLast24Hours: MinTemperatureLast24Hours
  precipitationLastHour: PrecipitationLastHour
  precipitationLast3Hours: PrecipitationLast3Hours
  precipitationLast6Hours: PrecipitationLast6Hours
  relativeHumidity: RelativeHumidity
  windChill: WindChill
  heatIndex: HeatIndex
  cloudLayers: CloudLayer[]
}