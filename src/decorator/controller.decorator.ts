import { RouteMetaKey } from "../constants";
import { RouteService } from "../interfaces";

// TODO 위치 재선정 필요
export function initRouteService(
  instance: any,
  key: string,
  parameterIndex?: number
) {
  if (!Reflect.hasMetadata(RouteMetaKey.Service, instance)) {
    Reflect.defineMetadata(RouteMetaKey.Service, {}, instance);
  }

  const routeService = Reflect.getMetadata(
    RouteMetaKey.Service,
    instance
  ) as RouteService;
  if (!routeService[key]) {
    routeService[key] = {};
  }

  if (!routeService[key].param) {
    routeService[key].param = {};
  }

  if (
    (parameterIndex || parameterIndex >= 0) &&
    !routeService[key].param[parameterIndex]
  ) {
    routeService[key].param[parameterIndex] = {};
  }

  return routeService;
}

/**
 *
 */
export interface RouteController {
  path: string;
}

/**
 * Controller Decorator
 *
 * @author Suhan Kim <saixox40@gmail.com>
 * @param prefix Controller Prefix
 */
export const Controller = (prefix: string): ClassDecorator => {
  return (target: any) => {
    const type: RouteController = {
      path: prefix,
    };

    Reflect.defineMetadata(RouteMetaKey.Controller, type, target);
  };
};
