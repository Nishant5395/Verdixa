/**
 * An error that carries an HTTP status code. Throw it from any controller and the
 * global error handler in server.ts turns it into a JSON response: { message }.
 */
export class HttpError extends Error {
  status: number;

  constructor(status: number, message: string) {
    super(message);
    this.name = "HttpError";
    this.status = status;
  }
}
