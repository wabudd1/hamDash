import { Context } from "./iContext"
import { Feature } from "./iFeature"
import { Geometry } from "./iGeometry"
import { Pagination } from "./iPagination"
import { Properties } from "./iProperties"

export interface INwsRoot {
  "@context": [string, Context]
  type: string
  features: Feature[]
  title: string
  updated: string // Weather Alert
  observationStations: string[] // Zone Station
  pagination: Pagination // Zone Station

  geometry: Geometry // Station observation
  properties: Properties // Station observation
}