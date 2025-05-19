import { getRouteApi, Link, useRouterState } from "@tanstack/react-router";
import clsx from "clsx";
import { ContactRecord } from "~/db/db";

const routeApi = getRouteApi("/_app");

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
