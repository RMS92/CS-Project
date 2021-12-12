import React, { useCallback, useRef, useState } from "react";
import clsx from "clsx";
import { useClickOutside } from "../hooks/useClickOutside";
import { User } from "../types";
import { useToggle } from "../hooks/useToogle";

export default function SelectBox({
  filteredValue,
  setFilteredValue,
  initialValues,
}: {
  filteredValue: User;
  setFilteredValue: Function;
  initialValues: User[];
}) {
  const [visible, setVisible] = useToggle(false);
  const [search, setSearch] = useState("");

  const filteredUsers = (initialValues || []).filter((u: User) =>
    search === "" || u.pseudo.toLowerCase().includes(search.toLowerCase())
      ? u
      : ""
  );

  return (
    <div className="grid-filter__group">
      <label htmlFor="filter-legit">Utilisateurs :</label>
      <div className="ts-control no-search single plugin-no_backspace_delete plugin-dropdown_input">
        <div
          className={clsx("items ts-input", visible ? " focus" : null)}
          onClick={setVisible}
        >
          <div className="item" data-value="">
            {filteredValue.pseudo}
          </div>
        </div>
        <div
          className="ts-dropdown single no-search plugin-no_backspace_delete plugin-dropdown_input"
          style={{ display: visible ? "block" : "none" }}
        >
          <div className="dropdown-input-wrap">
            <input
              placeholder="Rechercher..."
              className="dropdown-input"
              onChange={(e) => setSearch(e.target.value)}
              value={search}
            />
          </div>
          <div className="ts-dropdown-content">
            {filteredUsers.map((f: User) => (
              <div
                key={f.id}
                className={clsx(
                  "option",
                  f.id === filteredValue.id ? " active" : null
                )}
                role="option"
                onClick={() => setFilteredValue(f)}
              >
                {f.pseudo}
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

function useFilteredValues(initial: User[]) {
  const [values, setValues] = useState(initial);

  return {
    filteredValues: values,
    addValue: useCallback(function (user: User) {
      setValues((state: User[]) => [...state, user]);
    }, []),
    deleteValue: useCallback(function (user: User) {
      setValues((state: User[]) => state.filter((n: User) => n !== user));
    }, []),
    resetValue: useCallback(function () {
      setValues([]);
    }, []),
  };
}
