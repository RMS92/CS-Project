import { Injectable } from "@nestjs/common";
import { CreateNotificationDto } from "./dto/create-notification.dto";
import { Observable, Subject } from "rxjs";
import { EventEmitter2 } from "@nestjs/event-emitter";
import { NotificationCreatedEvent } from "./events/notification-created.event";
import { DatabaseTable } from "../database/database.decorator";
import { DatabaseService } from "../database/database.service";
import { Notification } from "./models/notification.model";
import { ConfigService } from "../config/config.service";
import { ForbiddenRessourceException } from "../users/exceptions/forbidden-ressource.exception";

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
        query: "message, url, channel, created_at, updated_at, user_id",
        where: `'${createNotificationDto.message}', '${createNotificationDto.url}', '${createNotificationDto.channel}', ${now}, '${now}', ${createNotificationDto.user_id}`,
      });
    } else {
      const where = `$${1}, $${2}, $${3}, $${4}, $${5}, $${6}`;
      notification = await this.db.preparedInsert({
        query: "message, url, channel, created_at, updated_at, user_id",
        where,
        variables: [
          createNotificationDto.message,
          createNotificationDto.url,
          createNotificationDto.channel,
          now,
          now,
          createNotificationDto.user_id,
        ],
      });
    }
    this.eventEmitter.emit(
      "notification.created",
      new NotificationCreatedEvent(notification)
    );
    return notification;
  }

  async markAsRead(userID: number): Promise<Notification[]> {
    let notifications = [];
    if (this.securityLevel === 1 || this.securityLevel === 2) {
      notifications = await this.db.queryAll({
        query: "*",
        where: "WHERE read_at is null AND user_id =" + userID,
      });
      console.log(notifications);
    } else {
      const where = "WHERE read_at is null AND user_id = $1";
      notifications = await this.db.preparedQueryAll({
        query: "*",
        where,
        variables: [userID],
      });
    }
    for (let notification of notifications) {
      if (this.securityLevel === 1 || this.securityLevel === 2) {
        await this.db.update({
          query: "read_at = " + Date.now(),
          where: "id = " + notification.id,
        });
      } else {
        const where = "id = $2";
        await this.db.preparedUpdate({
          query: "read_at = $1",
          where,
          variables: [Date.now(), notification.id],
        });
      }
    }
    return notifications;
  }

  async findAll(): Promise<Notification[]> {
    if (this.securityLevel === 1 || this.securityLevel === 2) {
      return this.db.queryAll({
        query: "*",
        where: "WHERE channel NOT LIKE 'private'",
      });
    } else {
      const where = "WHERE channel NOT LIKE 'private'";
      return this.db.preparedQueryAll({
        query: "*",
        where,
        variables: [],
      });
    }
  }

  async findAllAdmin(role: string): Promise<Notification[]> {
    if (role === "ROLE_ADMIN" || role === "ROLE_SUPERADMIN") {
      if (this.securityLevel === 1 || this.securityLevel === 2) {
        return this.db.queryAll({
          query: "*",
          where: "WHERE channel LIKE 'public'",
        });
      } else {
        const where = "WHERE channel LIKE 'public'";
        return this.db.preparedQueryAll({
          query: "*",
          where,
          variables: [],
        });
      }
    } else {
      throw new ForbiddenRessourceException();
    }
  }

  async findAllByUser(userId: number): Promise<Notification[]> {
    if (this.securityLevel === 1 || this.securityLevel === 2) {
      return this.db.queryAll({
        query: "*",
        where: "WHERE user_id = " + userId + " ORDER BY created_at DESC",
      });
    } else {
      const where = "WHERE user_id = $1 ORDER BY created_at DESC";
      return this.db.preparedQueryAll({
        query: "*",
        where,
        variables: [userId],
      });
    }
  }

  findOne(id: number) {
    return `This action returns a #${id} notification`;
  }

  remove(id: number) {
    return `This action removes a #${id} notification`;
  }

  async removeAdmin(id: number, role: string): Promise<Notification> {
    if (role === "ROLE_ADMIN" || role === "ROLE_SUPERADMIN") {
      if (this.securityLevel === 1 || this.securityLevel === 2) {
        return await this.db.delete({
          query: "",
          where: "id = " + id,
        });
      } else {
        const where = "id = $1";
        return await this.db.preparedDelete({
          query: "",
          where,
          variables: [id],
        });
      }
    } else {
      throw new ForbiddenRessourceException();
    }
  }
}
