import { RouteService } from "../interfaces";
import { initRouteService } from "./controller.decorator";

export enum RouteMethod {
  GET = "get",
  POST = "post",
  PATCH = "patch",
  DEL = "delete",
  PUT = "put",
}

/****************************************************************************************************************************************
 * Method Decorator
 *
 * @author Suhan Kim <saixox40@gmail.com>
 * @param method RouteMethod
 */
function methodBinder(method: RouteMethod) {
  return function (path: string): MethodDecorator {
    return (target: any, propertyKey: string | symbol) => {
      const routeService = initRouteService(
        target.constructor,
        String(propertyKey)
      );
      const settingService = routeService[String(propertyKey)] as RouteService;
      settingService.path = path;
      settingService.method = method;
    };
  };
}

export const Get = methodBinder(RouteMethod.GET);
export const Post = methodBinder(RouteMethod.POST);
export const Put = methodBinder(RouteMethod.PUT);
export const Patch = methodBinder(RouteMethod.PATCH);
export const Delete = methodBinder(RouteMethod.DEL);
