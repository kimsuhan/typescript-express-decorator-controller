import { RouteParamType } from "../decorator";

export interface RouteParam {
  name?: string;
  type?: RouteParamType;
  dto?: any;
  required?: boolean;
  fileOption?: {
    group: string;
    isArray?: boolean;
  };
}
