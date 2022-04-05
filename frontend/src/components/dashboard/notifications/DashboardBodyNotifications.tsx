import React, { SyntheticEvent, useEffect, useState } from "react";
import { NotificationType } from "../../../types";
import Icon from "../../../ui/Icon";
import Pagination from "../../../ui/Pagination";
import { useNotifications } from "../../../hooks/useNotifications";

export default function DashboardBodyNotifications({
  notifications,
  fetchNotifications,
  deleteNotification,
}: {
  notifications: NotificationType[];
  fetchNotifications: Function;
  deleteNotification: Function;
}) {
  const [currentModal, setCurrentModal] = useState<string>("");
  const [paginationItems, setPaginationItems] = useState<NotificationType[]>(
    []
  );
  const [searchValue, setSearchValue] = useState("");

  useEffect(() => {
    (async () => {
      await fetchNotifications();
    })();
  }, []);

  const filteredUsers = (notifications || []).filter((u: NotificationType) =>
    searchValue === "" ||
    u.message.toLowerCase().includes(searchValue.toLowerCase())
      ? u
      : ""
  );

  const handleChange = (e: SyntheticEvent) => {
    // @ts-ignore
    setSearchValue(e.target.value);
  };

  const closeModal = (): void => {
    setCurrentModal("");
  };

  return (
    <>
      <div className="dashboard-head">
        <h4 className="h4">
          <Icon name="bigUser" />
          Notifications
        </h4>
        <div className="dashboard-head__search">
          <form className="dashboard-searchField">
            <input
              type="search"
              name="search"
              placeholder="e.g. pseudo"
              onChange={handleChange}
            />
            <button title="search">
              <Icon name="search" />
            </button>
          </form>
        </div>
      </div>
      <div className="dashboard-tab">
        <div className="dashboard-tab__body">
          <table className="table">
            <thead>
              <tr>
                <th>Message</th>
                <th>Url</th>
                <th>channel</th>
                <th>Date création</th>
                <th />
              </tr>
            </thead>
            <tbody>
              {paginationItems.map((n) => (
                <tr key={n.id}>
                  <td>{n.message}</td>
                  <td>{n.url}</td>
                  <td>{n.channel}</td>
                  <td>
                    {new Date(parseFloat(n.created_at)).toLocaleDateString()}
                  </td>
                  <td style={{ width: "20px" }}>
                    <Icon
                      name="delete"
                      className="icon icon-delete"
                      onClick={async () => {
                        //delete notification
                        await deleteNotification(n);
                      }}
                    />
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <div className="dashboard-tab__footer">
          <Pagination
            items={filteredUsers}
            itemsPerPage={9}
            totalItems={filteredUsers.length}
            setPaginationItems={setPaginationItems}
          />
        </div>
      </div>
    </>
  );
}
