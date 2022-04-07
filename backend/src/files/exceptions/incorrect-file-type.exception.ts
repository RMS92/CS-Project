import { HttpException, HttpStatus } from "@nestjs/common";

export class IncorrectFileTypeException extends HttpException {
  constructor() {
    super("Incorrect file type", HttpStatus.BAD_REQUEST);
  }
}
