import { RouteMethod } from "../decorator/method.decorator";
import { RouteParam } from "./route-param.interface";

export interface RouteService {
  path?: string;
  sse?: boolean;
  method?: RouteMethod;
  param?: RouteParam;
}
