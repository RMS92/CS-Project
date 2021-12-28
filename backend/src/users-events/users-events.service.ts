import { Injectable } from "@nestjs/common";
import { CreateUserEventDto } from "./dto/create-user-event.dto";
import { DatabaseTable } from "../database/database.decorator";
import { DatabaseService } from "../database/database.service";
import { UserEvent } from "./models/user-event.model";

@Injectable()
export class UsersEventsService {
  @DatabaseTable("user_event")
  private readonly db: DatabaseService<UserEvent>;

  async findAll(): Promise<UserEvent[]> {
    return this.db.queryAll({
      query: "*",
      where: "",
    });
  }

  async create(user_id: string, event_id: string): Promise<UserEvent> {
    const now = Date.now();

    return this.db.insert({
      query: "user_id, event_id, created_at, updated_at",
      where: `${user_id}, ${event_id}, ${now}, ${now}`,
    });
  }
}
