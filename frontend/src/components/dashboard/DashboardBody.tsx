import React, { SyntheticEvent, useState } from "react";
import Icon from "../../ui/Icon";
import { MoreModal } from "../../ui/Modal";
import DashboardBodyUsers from "./users/DashboardBodyUsers";
import SlideIn from "../../ui/animations/SlideIn";
import { NotificationType } from "../../types";
import DashboardBodyEvents from "./events/DashboardBodyEvents";

export default function DashboardBody({
  page,
  setPage,
}: {
  page: string;
  setPage: Function;
}) {
  return (
    <main className="py5">
      {page === "users" ? (
        <DashboardBodyUsers />
      ) : page === "events" ? (
        <DashboardBodyEvents setPage={setPage} />
      ) : page === "notifications" ? (
        <DashboardBodyNotifications />
      ) : page === "notifications/create" ? (
        <DashboardBodyNotificationsCreate />
      ) : page === "notifications/edit" ? (
        <DashboardBodyNotificationsEdit />
      ) : null}
    </main>
  );
}

function DashboardBodyNotifications() {
  return <>Notification body</>;
}

function DashboardBodyNotificationsCreate() {
  return <>Notifications create</>;
}

function DashboardBodyNotificationsEdit() {
  return <>Notifications edit</>;
}
