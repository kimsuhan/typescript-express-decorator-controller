import { Response, Router } from "express";
import path from "path";
import { RouteMetaKey } from "../../constants";
import { RouteController, RouteParamType } from "../../decorator";
import { RouteParam, RouteService } from "../../interfaces";
import {
  catchAsync,
  validateBody,
  validateParam,
  validateQuery,
} from "../../middlewares";

export const router = Router();

/**
 * Directory에서 Controller class를 불러옴
 *
 * @param directories
 * @param formats
 * @returns
 */
function importClassesFromDirectories(
  directories: string[],
  formats = [".js", ".ts", ".tsx"]
): any[] {
  const loadFileClasses = function (exported: any, allLoaded: any[]) {
    if (exported instanceof Function) {
      allLoaded.push(exported);
    } else if (exported instanceof Array) {
      exported.forEach((i: any) => loadFileClasses(i, allLoaded));
    } else if (exported instanceof Object || typeof exported === "object") {
      Object.keys(exported).forEach((key) =>
        loadFileClasses(exported[key], allLoaded)
      );
    }

    return allLoaded;
  };

  const allFiles = directories.reduce((allDirs, dir) => {
    return allDirs.concat(require("glob").sync(path.normalize(dir)));
  }, [] as string[]);

  const dirs = allFiles
    .filter((file) => {
      const dtsExtension = file.substring(file.length - 5, file.length);
      return (
        formats.indexOf(path.extname(file)) !== -1 && dtsExtension !== ".d.ts"
      );
    })
    .map((file) => {
      return require(file);
    });

  return loadFileClasses(dirs, []);
}

// Read Controller
const controllers = importClassesFromDirectories([
  __dirname + "/../**/**.controller.ts",
]);

controllers.forEach((controller) => {
  const instance = new controller();
  const routeController = Reflect.getMetadata(
    RouteMetaKey.Controller,
    controller
  ) as RouteController;
  const routeService = Reflect.getMetadata(
    RouteMetaKey.Service,
    controller
  ) as RouteService;

  Object.keys(routeService).forEach((functionName) => {
    const service = routeService[functionName] as RouteService;
    const params: RouteParam = service.param;
    const middlewares = [];

    // Middleware Setting
    Object.keys(params).forEach((index) => {
      const param: RouteParam = params[index];
      if (param.type === RouteParamType.Body) {
        middlewares.push(validateBody(param.dto));
      } else if (param.type === RouteParamType.Param) {
        middlewares.push(validateParam(param.name, param.required));
      } else if (param.type === RouteParamType.Query) {
        middlewares.push(validateQuery(param.name, param.required));
      }
    });

    // Route Setting
    router[service.method.toString()](
      routeController.path + service.path,
      middlewares,
      catchAsync(async (req: any, res: Response) => {
        // Parameter Setting
        const parameter = [];
        for (let i = 0; i < instance[functionName].length; i++) {
          const param: RouteParam = params[i];
          if (params[i]) {
            if (param.type === RouteParamType.Body) {
              parameter.push(req.body);
            } else if (param.type === RouteParamType.Param) {
              parameter.push(req.params[param.name]);
            } else if (param.type === RouteParamType.Query) {
              parameter.push(req.query[param.name]);
            }
          } else {
            parameter.push(null);
          }
        }

        let response = await instance[functionName].apply(null, parameter);
        if (!response) {
          response = "OK";
        }

        res.send(response);
      })
    );
  });
});
