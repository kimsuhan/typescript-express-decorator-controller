export class CustomException extends Error {
  status: number;
  code: string;
  messages: Array<string>;

  constructor(status: number, code: string, messages: Array<string>) {
    super(code);
    this.status = status;
    this.code = code;
    this.messages = messages;
  }
}
