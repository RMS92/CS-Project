import React, { SyntheticEvent, useState } from "react";
import Icon from "../../ui/Icon";
import { MoreModal } from "../../ui/Modal";
import DashboardBodyUsers from "./users/DashboardBodyUsers";
import SlideIn from "../../ui/animations/SlideIn";
import { NotificationType } from "../../types";
import DashboardBodyEvents from "./events/DashboardBodyEvents";
import DashboardBodyEventsEdit from "./events/DashboardBodyEventsEdit";
import { useEvents } from "../../hooks/useEvents";
import DashboardBodyNotifications from "./notifications/DashboardBodyNotifications";
import DashboardBodyNotificationsCreate from "./notifications/DashboardBodyNotificationsCreate";
import { useNotifications } from "../../hooks/useNotifications";

export default function DashboardBody({
  page,
  setPage,
}: {
  page: string;
  setPage: Function;
}) {
  const {
    events,
    selectedEvent,
    fetchEvent,
    fetchEvents,
    updateAdminEvent,
    deleteAdminEvent,
  } = useEvents();

  const {
    notifications,
    fetchNotifications,
    createNotification,
    deleteNotification,
  } = useNotifications();

  return (
    <main className="py5">
      {page === "users" ? (
        <DashboardBodyUsers />
      ) : page === "events" ? (
        <DashboardBodyEvents
          setPage={setPage}
          events={events}
          fetchEvent={fetchEvent}
          fetchEvents={fetchEvents}
          deleteAdminEvent={deleteAdminEvent}
        />
      ) : page === "events/edit" ? (
        <DashboardBodyEventsEdit
          selectedEvent={selectedEvent}
          updateAdminEvent={updateAdminEvent}
        />
      ) : page === "notifications" ? (
        <DashboardBodyNotifications
          notifications={notifications}
          fetchNotifications={fetchNotifications}
          deleteNotification={deleteNotification}
        />
      ) : page === "notifications/create" ? (
        <DashboardBodyNotificationsCreate
          createNotification={createNotification}
        />
      ) : null}
    </main>
  );
}
