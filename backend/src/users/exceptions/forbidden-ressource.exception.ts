import { HttpException, HttpStatus } from "@nestjs/common";

export class ForbiddenRessourceException extends HttpException {
  constructor() {
    super("Forbidden ressource", HttpStatus.FORBIDDEN);
  }
}
