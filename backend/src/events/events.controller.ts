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
import { UpdateEventDto } from "./dto/update-event.dto";
import { AuthenticatedGuard } from "../auth/guards/authenticated-auth.guard";

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

  @Post()
  @UseGuards(AuthenticatedGuard)
  async create(
    @Body() createEventDto: CreateEventDto,
    @Req() req
  ): Promise<Event> {
    const user_id = req.user.id;
    return this.eventsService.create(createEventDto, +user_id);
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
  async delete(@Param("id") id: string): Promise<Event> {
    return this.eventsService.delete(+id);
  }
}
