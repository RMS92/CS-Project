import React, { useState } from "react";
import clsx from "clsx";
import DashboardBody from "./DashboardBody";
import Icon from "../../ui/Icon";

export default function Dashboard() {
  const [page, setPage] = useState<string>("users");
  return (
    <>
      <div className="container">
        <div className="layout-dashboard">
          <aside className="dashboard-sidebar">
            <div className="dashboard-sidebar__wrapper">
              <div className="dashboard-sidebar__main">
                <h5 className="h6">Main nav</h5>
                <ul>
                  <li>
                    <a
                      href="#dashboard"
                      className={clsx(
                        page === "dashboard" ? "is-active" : null
                      )}
                      onClick={() => setPage("dashboard")}
                    >
                      Dashboard
                    </a>
                  </li>
                  <li>
                    <a
                      href="#pages"
                      className={clsx(page === "pages" ? "is-active" : null)}
                      onClick={() => setPage("pages")}
                    >
                      Pages
                    </a>
                  </li>
                </ul>

                <h5 className="h6">Components</h5>
                <ul>
                  <li>
                    <a
                      href="#utilisateurs"
                      className={clsx(page === "users" ? "is-active" : null)}
                      onClick={() => setPage("users")}
                    >
                      Utilisateurs
                    </a>
                  </li>
                  <li>
                    <a
                      href="#évènements"
                      className={clsx(
                        "dashboard-sidebar__nav",
                        page === "events" ||
                          page === "events/view" ||
                          page === "events/edit"
                          ? "is-active"
                          : null
                      )}
                      onClick={() => setPage("events")}
                    >
                      Évènements
                    </a>
                  </li>
                </ul>
                <h5 className="h6">More</h5>
                <ul>
                  <li>
                    <div className="flex">
                      <a
                        href="#notifications"
                        className={clsx(
                          page === "notifications" ||
                            page === "notifications/create" ||
                            page === "notifications/edit"
                            ? "is-active"
                            : null
                        )}
                        onClick={() => setPage("notifications")}
                      >
                        Notifications
                      </a>
                      <Icon
                        name="add"
                        className="icon icon-plus"
                        width="16"
                        onClick={() => {
                          setPage("notifications/create");
                        }}
                      />
                    </div>
                  </li>
                </ul>
              </div>
            </div>
          </aside>
          <DashboardBody page={page} setPage={setPage} />
        </div>
      </div>
    </>
  );
}
