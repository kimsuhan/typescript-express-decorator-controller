import { RouteParam } from "../interfaces";
import { initRouteService } from "./controller.decorator";

export enum RouteParamType {
  Body = "body",
  Param = "param",
  Query = "query",
}

/****************************************************************************************************************************************
 * Parameter Decorator
 *
 * @author Suhan Kim <saixox40@gmail.com>
 * @param type RouteParamType
 */
function optionParameterBinder(type: RouteParamType) {
  return function (name: string, required?: boolean): ParameterDecorator {
    return (target, propertyKey, parameterIndex) => {
      const routeService = initRouteService(
        target.constructor,
        String(propertyKey),
        parameterIndex
      );
      const setting = routeService[String(propertyKey)].param[
        parameterIndex
      ] as RouteParam;
      setting.name = name;
      setting.type = type;
      setting.required = required;
    };
  };
}

export const Param = optionParameterBinder(RouteParamType.Param);
export const Query = optionParameterBinder(RouteParamType.Query);

/****************************************************************************************************************************************
 * Body Decorator
 *
 * @author Suhan Kim <saixox40@gmail.com>
 * @param dto Validate DTO
 */
export const Body = function (dto: any): ParameterDecorator {
  return (target, propertyKey, parameterIndex) => {
    const routeService = initRouteService(
      target.constructor,
      String(propertyKey),
      parameterIndex
    );
    const settingService = routeService[String(propertyKey)].param[
      parameterIndex
    ] as RouteParam;
    settingService.type = RouteParamType.Body;
    settingService.dto = dto;
  };
};
