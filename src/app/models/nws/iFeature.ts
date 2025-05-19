import { Properties } from "./iProperties"
import { Geometry } from "./iGeometry"
export interface Feature {
  id: string
  type: string
  geometry: Geometry
  properties: Properties
}