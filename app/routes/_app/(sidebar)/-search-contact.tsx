import { getRouteApi, Link, useLocation } from "@tanstack/react-router";
import clsx from "clsx";
import { Search, UserPlus } from "lucide-react";

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
    <div className="flex justify-between gap-2 px-2 py-4">
      <label className={clsx("input", { loading: isFetching })}>
        <Search />
        <input
          aria-label="Search contacts"
          id="search-contacts-q"
          name="q"
          defaultValue={q ?? ""}
          onChange={(e) => handleChange(e.target.value)}
          placeholder="Search"
          type="search"
        />
        <div aria-hidden hidden={!isFetching} id="search-spinner" />
      </label>

      <Link to="/contacts/new">
        <button className="btn btn-primary">
          <UserPlus size={16} /> New
        </button>
      </Link>
    </div>
  );
}
