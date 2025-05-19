import { getRouteApi, useLocation } from "@tanstack/react-router";
import clsx from "clsx";

const routeApi = getRouteApi("/_app");

export function SearchContacts() {
  const isFetching = false;
  const { q } = routeApi.useSearch();
  const navigate = routeApi.useNavigate();
  const location = useLocation();
  const handleChange = (q: string) => {
    navigate({ to: location.pathname, search: { q }, replace: true });
  };

  return (
    <div>
      <input
        aria-label="Search contacts"
        id="search-contacts-q"
        name="q"
        className={clsx({ loading: isFetching })}
        defaultValue={q ?? ""}
        onChange={(e) => handleChange(e.target.value)}
        placeholder="Search"
        type="search"
      />
      <div aria-hidden hidden={!isFetching} id="search-spinner" />

      <button type="submit">New</button>
    </div>
  );
}
