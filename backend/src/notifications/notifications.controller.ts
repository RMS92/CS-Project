import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  Sse,
  UseGuards,
  Req,
} from "@nestjs/common";
import { NotificationsService } from "./notifications.service";
import { CreateNotificationDto } from "./dto/create-notification.dto";
import { Observable } from "rxjs";
import { OnEvent } from "@nestjs/event-emitter";
import { NotificationCreatedEvent } from "./events/notification-created.event";
import { Notification } from "./models/notification.model";
import { AuthenticatedGuard } from "../auth/guards/authenticated-auth.guard";

@Controller("notifications")
export class NotificationsController {
  constructor(private readonly notificationsService: NotificationsService) {}

  @Sse("sse")
  sse(): Observable<{ data: Notification }> {
    return this.notificationsService.sse();
  }

  @OnEvent("notification.created")
  handleNotificationCreatedEvent(
    notificationCreatedEvent: NotificationCreatedEvent
  ) {
    return this.notificationsService.handleNotificationCreatedEvent(
      notificationCreatedEvent
    );
  }

  @Post()
  @UseGuards(AuthenticatedGuard)
  create(
    @Body() createNotificationDto: CreateNotificationDto
  ): Promise<Notification> {
    return this.notificationsService.create(createNotificationDto);
  }

  @Post("read")
  @UseGuards(AuthenticatedGuard)
  markAsRead(@Req() req): Promise<Notification[]> {
    const userId = req.user.id;
    return this.notificationsService.markAsRead(userId);
  }

  @Get()
  @UseGuards(AuthenticatedGuard)
  findAll(): Promise<Notification[]> {
    return this.notificationsService.findAll();
  }

  @Get("admin")
  @UseGuards(AuthenticatedGuard)
  findAllAdmin(@Req() req): Promise<Notification[]> {
    const role = req.user.role;
    return this.notificationsService.findAllAdmin(role);
  }

  @Get("users")
  @UseGuards(AuthenticatedGuard)
  findAllByUser(@Req() req): Promise<Notification[]> {
    const userId = req.user.id;
    return this.notificationsService.findAllByUser(userId);
  }

  @Get(":id")
  findOne(@Param("id") id: string) {
    return this.notificationsService.findOne(+id);
  }

  @Delete(":id")
  remove(@Param("id") id: string) {
    return this.notificationsService.remove(+id);
  }

  @Delete(":id/admin")
  @UseGuards(AuthenticatedGuard)
  removeAdmin(@Param("id") id: string, @Req() req): Promise<Notification> {
    const role = req.user.role;
    return this.notificationsService.removeAdmin(+id, role);
  }
}
