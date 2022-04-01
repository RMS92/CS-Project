import { Notification } from "../models/notification.model";

export class NotificationCreatedEvent {
  private notification: Notification = null;
  constructor(notification: Notification) {
    this.notification = notification;
  }

  public getNotification(): Notification {
    return this.notification;
  }
}
