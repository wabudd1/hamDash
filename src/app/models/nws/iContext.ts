import { Bearing } from "./iBearing"
import { County } from "./iCounty"
import { Distance } from "./iDistance"
import { ForecastGridData } from "./iForecastGridData"
import { ForecastOffice } from "./iForecastOffice"
import { Geometry } from "./iGeometry"
import { ObservationStations } from "./iObservationStations"
import { PublicZone } from "./iPublicZone"
import { UnitCode } from "./iUnitCode"
import { Value } from "./iValue"

export interface Context {
  "@version": string
  wx: string
  "@vocab": string

  // ZoneStations
  s: string
  geo: string
  unit: string
  geometry: Geometry
  city: string
  state: string
  distance: Distance
  bearing: Bearing
  value: Value
  unitCode: UnitCode
  forecastOffice: ForecastOffice
  forecastGridData: ForecastGridData
  publicZone: PublicZone
  county: County
  observationStations: ObservationStations
}