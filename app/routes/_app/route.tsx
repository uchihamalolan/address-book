import { createFileRoute, Outlet, useRouterState } from "@tanstack/react-router";

import clsx from "clsx";

import { zodValidator } from "@tanstack/zod-adapter";
import z from "zod";

import { getContacts } from "~/db/db";
import { ContactsList, Header, SearchContacts } from "./(sidebar)/-components";

export const Route = createFileRoute("/_app")({
  component: Sidebar,
  notFoundComponent: NoContacts,
  validateSearch: zodValidator(
    z.object({
      q: z.string().default(""),
    })
  ),
  loaderDeps: ({ search: { q } }) => ({ q }),
  loader: ({ deps: { q } }) => getContacts(q),
});

function Sidebar() {
  const contacts = Route.useLoaderData();
  const routerState = useRouterState();
  const isPending = routerState.pendingMatches?.some(
    (match) => match.routeId === "/_app/contacts/$contactId"
  );

  return (
    <>
      <div id="sidebar">
        <Header />
        <SearchContacts />
        <nav>{contacts.length ? <ContactsList contacts={contacts} /> : <NoContacts />}</nav>
      </div>
      <div id="detail" className={clsx({ loading: isPending })}>
        <Outlet />
      </div>
    </>
  );
}

function NoContacts() {
  return (
    <p>
      <i>No contacts</i>
    </p>
  );
}
