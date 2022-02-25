import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  Req,
  Res,
  UseGuards,
} from "@nestjs/common";
import { EventsService } from "./events.service";
import { Event } from "./models/event.model";
import { CreateEventDto } from "./dto/create-event.dto";
import { AuthenticatedGuard } from "../auth/guards/authenticated-auth.guard";
import { UserEvent } from "../users-events/models/user-event.model";
import { CreateUserEventDto } from "../users-events/dto/create-user-event.dto";

@Controller("events")
export class EventsController {
  constructor(private readonly eventsService: EventsService) {}

  @Get()
  async findAll(): Promise<Event[]> {
    return this.eventsService.findAll();
  }

  @Get(":id")
  async findOne(@Param("id") id: string): Promise<Event> {
    return this.eventsService.findOne(+id);
  }

  @Get("users/:id")
  async findEventsByUser(@Param("id") id: string): Promise<Event[]> {
    return this.eventsService.findEventsByUser(+id);
  }

  @Get("users/:id/invitations")
  async findEventsInvitationsByUser(@Param("id") id: string): Promise<Event[]> {
    return this.eventsService.findEventsInvitationsByUser(+id);
  }

  @Post()
  @UseGuards(AuthenticatedGuard)
  async create(
    @Body() createEventDto: CreateEventDto,
    @Req() req
  ): Promise<Event> {
    const user_id = req.user.id;
    return this.eventsService.create(createEventDto, +user_id);
  }

  @Post("users")
  @UseGuards(AuthenticatedGuard)
  async createEventUser(
    @Body() createUserEvent: CreateUserEventDto,
    @Req() req
  ): Promise<UserEvent> {
    const user_id = req.user.id;
    return this.eventsService.createEventUser(
      user_id,
      createUserEvent.event_id
    );
  }

  /*@Patch(":id")
  async update(
    @Param("id") id: string,
    @Body() updateEventDto: UpdateEventDto
  ): Promise<ShowEvent> {
    return this.eventsService.update(+id, updateEventDto);
  }*/

  @Delete(":id")
  @UseGuards(AuthenticatedGuard)
  async delete(@Param("id") id: string, @Req() req): Promise<Event> {
    const authId = req.user.id;
    return this.eventsService.delete(+id, authId);
  }
}
