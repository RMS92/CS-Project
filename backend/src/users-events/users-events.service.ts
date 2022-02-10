import { Injectable } from "@nestjs/common";
import { CreateUserEventDto } from "./dto/create-user-event.dto";
import { DatabaseTable } from "../database/database.decorator";
import { DatabaseService } from "../database/database.service";
import { UserEvent } from "./models/user-event.model";
import { ConfigService } from "../config/config.service";

@Injectable()
export class UsersEventsService {
  constructor(
    @DatabaseTable("user_event")
    private readonly db: DatabaseService<UserEvent>,
    private readonly configService: ConfigService
  ) {
    this.configService = new ConfigService({
      useProcess: true,
    });
  }

  securityLevel: number = this.configService.databaseSecurity.securityLevel;

  // DONE
  async findAll(): Promise<UserEvent[]> {
    if (this.securityLevel === 1) {
      return this.db.queryAll({
        query: "*",
        where: "",
      });
    } else {
      return this.db.preparedQueryAll({
        query: "*",
        where: "",
        variables: [],
      });
    }
  }

  // DONE
  async create(user_id: string, event_id: string): Promise<UserEvent> {
    const now = Date.now();

    if (this.securityLevel === 1) {
      return this.db.insert({
        query: "user_id, event_id, created_at, updated_at",
        where: `${user_id}, ${event_id}, ${now}, ${now}`,
      });
    } else {
      const where = `$${1}, $${2}, $${3}, $${4}`;
      return this.db.preparedInsert({
        query: "user_id, event_id, created_at, updated_at",
        where,
        variables: [user_id, event_id, now, now],
      });
    }
  }
}
