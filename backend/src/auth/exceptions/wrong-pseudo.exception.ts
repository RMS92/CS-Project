import { HttpException, HttpStatus } from "@nestjs/common";

export class WrongPseudoException extends HttpException {
  constructor() {
    super("Pseudo ou mot de passe incorrect.", HttpStatus.BAD_REQUEST);
  }
}
