import { HttpException, HttpStatus } from "@nestjs/common";

export class PseudoAlreadyUsedException extends HttpException {
  constructor() {
    super("Le pseudo est déjà utilisé.", HttpStatus.BAD_REQUEST);
  }
}
