import { Injectable } from "@nestjs/common";
import { CreateNotificationDto } from "./dto/create-notification.dto";
import { Observable, Subject } from "rxjs";
import { EventEmitter2 } from "@nestjs/event-emitter";
import { NotificationCreatedEvent } from "./events/notification-created.event";
import { DatabaseTable } from "../database/database.decorator";
import { DatabaseService } from "../database/database.service";
import { Notification } from "./models/notification.model";
import { ConfigService } from "../config/config.service";

@Injectable()
export class NotificationsService {
  private event = new Subject<{ data: Notification }>();

  constructor(
    @DatabaseTable("notification")
    private readonly db: DatabaseService<Notification>,
    private readonly eventEmitter: EventEmitter2,
    private readonly configService: ConfigService
  ) {
    this.configService = new ConfigService({
      useProcess: true,
    });
  }

  securityLevel: number = this.configService.databaseSecurity.securityLevel;

  sse(): Observable<{ data: Notification }> {
    return this.event.asObservable();
  }

  handleNotificationCreatedEvent(
    notificationCreatedEvent: NotificationCreatedEvent
  ): void {
    this.event.next({ data: notificationCreatedEvent.getNotification() });
  }

  async create(
    createNotificationDto: CreateNotificationDto
  ): Promise<Notification> {
    let notification = null;
    const now = Date.now();
    if (this.securityLevel === 1 || this.securityLevel === 2) {
      notification = await this.db.insert({
        query:
          "message, url, channel, created_at, updated_at, read_at, user_id",
        where: `'${createNotificationDto.message}', '${createNotificationDto.url}', '${createNotificationDto.channel}', ${now}, '${now}', ${createNotificationDto.read_at}, ${createNotificationDto.user_id}`,
      });
    } else {
      console.log("TODO: prepared query");
    }
    this.eventEmitter.emit(
      "notification.created",
      new NotificationCreatedEvent(notification)
    );
    return notification;
  }

  async markAsRead(): Promise<Notification[]> {
    let notifications = [];
    if (this.securityLevel === 1 || this.securityLevel === 2) {
      notifications = await this.db.queryAll({
        query: "*",
        where: "WHERE read_at = null",
      });
    } else {
      console.log("TODO: prepared query");
    }
    for (let notification of notifications) {
      if (this.securityLevel === 1 || this.securityLevel === 2) {
        await this.db.update({
          query: "read_at = " + new Date(Date.now()),
          where: "id = " + notification.id,
        });
      } else {
        console.log("TODO: prepared query");
      }
    }
    return notifications;
  }

  findAll() {
    return `This action returns all notifications`;
  }

  findOne(id: number) {
    return `This action returns a #${id} notification`;
  }

  remove(id: number) {
    return `This action removes a #${id} notification`;
  }
}
