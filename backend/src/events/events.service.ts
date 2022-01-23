import { Injectable } from "@nestjs/common";
import { DatabaseTable } from "../database/database.decorator";
import { DatabaseService } from "../database/database.service";
import { Event } from "./models/event.model";
import { CreateEventDto } from "./dto/create-event.dto";
import { UsersEventsService } from "../users-events/users-events.service";
import { User } from "../users/models/user.model";
import { UserEvent } from "../users-events/models/user-event.model";

@Injectable()
export class EventsService {
  constructor(private readonly userEventService: UsersEventsService) {}

  @DatabaseTable("event")
  private readonly db: DatabaseService<Event>;

  async findAll(): Promise<Event[]> {
    return this.db.queryAll({
      query: "*",
      where: "ORDER BY created_at DESC",
    });
  }

  async findOne(id: number): Promise<Event> {
    return this.db.query({
      query: "*",
      where: "id = " + id,
    });
  }

  async findEventsByUser(id: number): Promise<Event[]> {
    return this.db.queryAll({
      query: "*",
      where: "WHERE user_id = " + id,
    });
  }

  async findEventsInvitationsByUser(id: number): Promise<Event[]> {
    return this.db.join({
      query: "*",
      join: "user_event",
      joinCondition: "public.event.id = public.user_event.event_id",
      where: " WHERE public.user_event.user_id = " + id,
    });
  }

  async create(
    createEventDto: CreateEventDto,
    user_id: number
  ): Promise<Event> {
    const now = Date.now();
    const begin_at = new Date(createEventDto.begin_at).getTime();

    const event = await this.db.insert({
      query:
        "title, content, place, duration, start_time, begin_at, created_at, updated_at, user_id",
      where: `'${createEventDto.title}', '${createEventDto.content}', '${createEventDto.place}', ${createEventDto.duration}, ${createEventDto.start_time}, ${begin_at}, ${now}, ${now}, ${user_id}`,
    });

    for (let i = 0; i < createEventDto.users_ids.length; i++) {
      await this.userEventService.create(createEventDto.users_ids[i], event.id);
    }

    return event;
  }

  async createEventUser(user_id: string, event_id: string): Promise<UserEvent> {
    return this.userEventService.create(user_id, event_id);
  }

  /*async update(id: number, updateEventDto: UpdateEventDto): Promise<ShowEvent> {
    return this.db.update({
      query: `pseudo = '${updateEventDto.pseudo}'`,
      where: "id = " + id,
    });
  }*/

  async delete(id: number): Promise<Event> {
    return this.db.delete({
      query: "",
      where: "id = " + id,
    });
  }
}
