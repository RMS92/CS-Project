import { HttpException, HttpStatus } from "@nestjs/common";

export class WrongPasswordException extends HttpException {
  constructor() {
    super("Mot de passe incorrect", HttpStatus.BAD_REQUEST);
  }
}
