import { Injectable } from "@nestjs/common";
import { DatabaseTable } from "../database/database.decorator";
import { DatabaseService } from "../database/database.service";
import { Event } from "./models/event.model";
import { CreateEventDto } from "./dto/create-event.dto";
import { UsersEventsService } from "../users-events/users-events.service";
import { User } from "../users/models/user.model";
import { UserEvent } from "../users-events/models/user-event.model";
import { ConfigService } from "../config/config.service";
import escapeInput from "../utils";

@Injectable()
export class EventsService {
  constructor(
    @DatabaseTable("event")
    private readonly db: DatabaseService<Event>,
    private readonly userEventService: UsersEventsService,
    private readonly configService: ConfigService
  ) {
    this.configService = new ConfigService({
      useProcess: true,
    });
  }
  securityLevel: number = this.configService.databaseSecurity.securityLevel;

  async findAll(): Promise<Event[]> {
    if (this.securityLevel === 1 || this.securityLevel === 2) {
      return this.db.queryAll({
        query: "*",
        where: "ORDER BY created_at DESC",
      });
    } else {
      return this.db.preparedQueryAll({
        query: "*",
        where: "ORDER BY created_at DESC",
        variables: [],
      });
    }
  }

  async findOne(id: number): Promise<Event> {
    if (this.securityLevel === 1 || this.securityLevel === 2) {
      return this.db.query({
        query: "*",
        where: "id = " + id,
      });
    } else {
      const where = "id = $1";
      return this.db.preparedQuery({
        query: "*",
        where,
        variables: [id],
      });
    }
  }

  async findEventsByUser(id: number): Promise<Event[]> {
    if (this.securityLevel === 1 || this.securityLevel === 2) {
      return this.db.queryAll({
        query: "*",
        where: "WHERE user_id = " + id,
      });
    } else {
      const where = "WHERE user_id = $1";
      return this.db.preparedQueryAll({
        query: "*",
        where,
        variables: [id],
      });
    }
  }

  async findEventsInvitationsByUser(id: number): Promise<Event[]> {
    if (this.securityLevel === 1 || this.securityLevel === 2) {
      return this.db.join({
        query:
          "title, content, place, duration, public.event.created_at, public.event.updated_at, public.user_event.user_id, begin_at, start_time, event_id as id",
        join: "user_event",
        joinCondition: "public.event.id = public.user_event.event_id",
        where: " WHERE public.user_event.user_id = " + id,
      });
    } else {
      return this.db.preparedJoin({
        query:
          "title, content, place, duration, public.event.created_at, public.event.updated_at, public.user_event.user_id, begin_at, start_time, event_id as id",
        join: "user_event",
        joinCondition: "public.event.id = public.user_event.event_id",
        where: " WHERE public.user_event.user_id = $1",
        variables: [id],
      });
    }
  }

  async create(
    createEventDto: CreateEventDto,
    user_id: number
  ): Promise<Event> {
    const now = Date.now();
    const begin_at = new Date(createEventDto.begin_at).getTime();

    let event;
    if (this.securityLevel === 1) {
      event = await this.db.insert({
        query:
          "title, content, place, duration, start_time, begin_at, created_at, updated_at, user_id",
        where: `'${createEventDto.title}', '${createEventDto.content}', '${createEventDto.place}', ${createEventDto.duration}, ${createEventDto.start_time}, ${begin_at}, ${now}, ${now}, ${user_id}`,
      });
    } else if (this.securityLevel === 2) {
      const safeTitle = escapeInput(createEventDto.title);
      const safeContent = escapeInput(createEventDto.content);
      const safePlace = escapeInput(createEventDto.place);
      event = await this.db.insert({
        query:
          "title, content, place, duration, start_time, begin_at, created_at, updated_at, user_id",
        where: `'${safeTitle}', '${safeContent}', '${safePlace}', ${createEventDto.duration}, ${createEventDto.start_time}, ${begin_at}, ${now}, ${now}, ${user_id}`,
      });
    } else {
      const where = `$${1}, $${2}, $${3}, $${4}, $${5}, $${6}, $${7}, $${8}, $${9}`;
      event = await this.db.preparedInsert({
        query:
          "title, content, place, duration, start_time, begin_at, created_at, updated_at, user_id",
        where,
        variables: [
          createEventDto.title,
          createEventDto.content,
          createEventDto.place,
          createEventDto.duration,
          createEventDto.start_time,
          begin_at,
          now,
          now,
          user_id,
        ],
      });
    }

    for (let i = 0; i < createEventDto.users_ids.length; i++) {
      await this.userEventService.create(createEventDto.users_ids[i], event.id);
    }

    return event;
  }

  async createEventUser(user_id: string, event_id: string): Promise<UserEvent> {
    return this.userEventService.create(user_id, event_id);
  }

  async delete(id: number): Promise<Event> {
    if (this.securityLevel === 1 || this.securityLevel === 2) {
      return this.db.delete({
        query: "",
        where: "id = " + id,
      });
    } else {
      const where = "id = $1";
      return this.db.preparedDelete({
        query: "",
        where,
        variables: [id],
      });
    }
  }
}
