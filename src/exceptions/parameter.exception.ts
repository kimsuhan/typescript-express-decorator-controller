import httpStatus from "http-status";
import { CustomException } from "./custom.exception";

export class ParameterException extends CustomException {
  constructor(messages: Array<string>) {
    super(httpStatus.BAD_REQUEST, "param_error", messages);
  }
}
