import React, { SyntheticEvent, useEffect, useState } from "react";
import { Event } from "../../../types";
import Icon from "../../../ui/Icon";
import { MoreModal } from "../../../ui/Modal";
import Pagination from "../../../ui/Pagination";
import SlideIn from "../../../ui/animations/SlideIn";
import { useEvents } from "../../../hooks/useEvents";
import { fireEvent } from "@testing-library/react";

export default function DashboardBodyEvents({
  setPage,
}: {
  setPage: Function;
}) {
  const { events, fetchEvents } = useEvents();
  const [currentModal, setCurrentModal] = useState<string>("");
  const [paginationItems, setPaginationItems] = useState<Event[]>([]);
  const [searchValue, setSearchValue] = useState("");

  useEffect(() => {
    (async () => {
      await fetchEvents();
    })();
  }, []);

  const filteredUsers = (events || []).filter((u: Event) =>
    searchValue === "" ||
    u.title.toLowerCase().includes(searchValue.toLowerCase())
      ? u
      : ""
  );

  console.log(currentModal);

  const handleChange = (e: SyntheticEvent) => {
    // @ts-ignore
    setSearchValue(e.target.value);
  };

  const closeModal = (): void => {
    setCurrentModal("");
  };

  if (events === null) {
    return <></>;
  }
  return (
    <>
      <div className="dashboard-head">
        <h4 className="h4">
          <Icon name="events" />
          Évènements
        </h4>
        <div className="dashboard-head__search">
          <form className="dashboard-searchField">
            <input
              type="search"
              name="search"
              placeholder="e.g. title"
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
                <th>ID</th>
                <th>title</th>
                <th>Créateur</th>
                <th>Date création</th>
                <th />
                <th />
              </tr>
            </thead>
            <tbody>
              {paginationItems.map((e) => (
                <tr key={e.id}>
                  <td>{e.id}</td>
                  <td>{e.title}</td>
                  <td>{e.user_id}</td>
                  <td>
                    {new Date(parseFloat(e.created_at)).toLocaleDateString()}
                  </td>
                  <td
                    style={{
                      width: "20px",
                    }}
                  >
                    <Icon
                      name="edit"
                      className="icon icon-edit"
                      onClick={async () => {
                        //set page to edit event
                      }}
                    />
                  </td>
                  <td
                    style={{
                      width: "20px",
                    }}
                  >
                    <Icon
                      name="delete"
                      className="icon icon-delete"
                      onClick={async () => {
                        //delete event
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
