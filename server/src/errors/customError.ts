export class CustomError extends Error {
  public readonly status: number;
  public readonly errorCode: number | undefined;

  constructor(message: string, status: number, errorCode?: number) {
    super(message);
    this.name = this.constructor.name;
    this.message = message;
    this.status = status;
    this.errorCode = errorCode;
  }
}
