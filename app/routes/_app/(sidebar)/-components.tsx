import { getRouteApi, Link, useLocation, useRouterState } from "@tanstack/react-router";
import clsx from "clsx";
import { ContactRecord } from "~/db/db";

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

export function Header() {
  return (
    <h1>
      <Link to="/about">React Router Contacts</Link>
    </h1>
  );
}

export function ContactsList({ contacts }: { contacts: ContactRecord[] }) {
  return (
    <ul>
      {contacts.map((contact) => (
        <li key={contact.id}>
          <ContactLink contact={contact} />
        </li>
      ))}
    </ul>
  );
}

function ContactLink({ contact }: { contact: ContactRecord }) {
  const { q } = routeApi.useSearch();
  const routerState = useRouterState();

  const isPending = routerState.pendingMatches?.some(
    (match) =>
      match.routeId === "/_app/contacts/$contactId" && match.params.contactId === contact.id
  );
  const isTransitioning = routerState.isTransitioning;

  return (
    <Link
      to={"/contacts/$contactId"}
      params={{ contactId: contact.id }}
      search={{ q }}
      className={clsx({
        pending: isPending,
        transitioning: isTransitioning,
      })}
    >
      {contact.first || contact.last ? (
        <>
          {contact.first} {contact.last}
        </>
      ) : (
        <i>No Name</i>
      )}
      {contact.favorite ? <span>★</span> : null}
    </Link>
  );
}
