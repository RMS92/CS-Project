import { HttpException, HttpStatus } from "@nestjs/common";

export class WrongPseudoException extends HttpException {
  constructor() {
    super("Pseudo incorrect", HttpStatus.BAD_REQUEST);
  }
}
