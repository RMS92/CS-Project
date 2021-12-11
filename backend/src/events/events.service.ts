import { Injectable } from "@nestjs/common";
import { DatabaseTable } from "../database/database.decorator";
import { DatabaseService } from "../database/database.service";
import { Event } from "./models/event.model";
import { CreateEventDto } from "./dto/create-event.dto";

@Injectable()
export class EventsService {
  @DatabaseTable("event")
  private readonly db: DatabaseService<Event>;

  async findAll(): Promise<Event[]> {
    return this.db.queryAll({
      query: "*",
      where: "",
    });
  }

  async findOne(id: number): Promise<Event> {
    return this.db.query({
      query: "*",
      where: "id = " + id,
    });
  }

  async create(
    createEventDto: CreateEventDto,
    user_id: number
  ): Promise<Event> {
    const now = Date.now();
    const begin_at = new Date(createEventDto.begin_at).getTime();

    return this.db.insert({
      query:
        "title, content, place, duration, begin_at, created_at, updated_at, user_id",
      where: `'${createEventDto.title}', '${createEventDto.content}', '${createEventDto.place}', ${createEventDto.duration}, ${begin_at}, ${now}, ${now}, ${user_id}`,
    });
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
