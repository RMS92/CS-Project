import React, { SyntheticEvent, useEffect, useState } from "react";
import { User } from "../../../types";
import Icon from "../../../ui/Icon";
import clsx from "clsx";
import { MoreModal } from "../../../ui/Modal";
import Pagination from "../../../ui/Pagination";
import SlideIn from "../../../ui/animations/SlideIn";
import { useUsers } from "../../../hooks/useUsers";

export default function DashboardBodyUsers() {
  const { users, fetchUsers, deleteUser } = useUsers();

  const [currentModal, setCurrentModal] = useState<string>("");
  const [paginationItems, setPaginationItems] = useState<User[]>([]);
  const [searchValue, setSearchValue] = useState("");

  useEffect(() => {
    (async () => {
      await fetchUsers();
    })();
  }, []);

  const filteredUsers = (users || []).filter((u: User) =>
    searchValue === "" ||
    u.pseudo.toLowerCase().includes(searchValue.toLowerCase())
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

  if (users === null) {
    return <></>;
  }
  return (
    <>
      <div className="dashboard-head">
        <h4 className="h4">
          <Icon name="bigUser" />
          Utilisateurs
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
                <th>ID</th>
                <th>Pseudo</th>
                <th>Role</th>
                <th>Date création</th>
                <th />
              </tr>
            </thead>
            <tbody>
              {paginationItems.map((u) => (
                <tr key={u.id}>
                  <td>{u.id}</td>
                  <td>{u.pseudo}</td>
                  <td>{u.role}</td>
                  <td>
                    {new Date(parseFloat(u.created_at)).toLocaleDateString()}
                  </td>
                  <td style={{ width: "20px" }}>
                    <Icon
                      name="delete"
                      className="icon icon-delete"
                      onClick={async () => {
                        //delete user
                        await deleteUser(u);
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
