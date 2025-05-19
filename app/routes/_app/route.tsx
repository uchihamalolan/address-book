import { createFileRoute, Link, Outlet, useRouterState } from "@tanstack/react-router";
import { zodValidator } from "@tanstack/zod-adapter";
import clsx from "clsx";
import z from "zod";

import { getContacts } from "~/db/db";
import { ContactNotFound } from "./(sidebar)/-components";
import { ContactsList } from "./(sidebar)/-contact-list";
import { SearchContacts } from "./(sidebar)/-search-contact";

const ContactSchema = z.object({
  q: z.string().default(""),
});

export const Route = createFileRoute("/_app")({
  component: Sidebar,
  notFoundComponent: ContactNotFound,
  validateSearch: zodValidator(ContactSchema),
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
    <div className="flex">
      <aside id="sidebar">
        <h1>
          <Link to="/about">React Router Contacts</Link>
        </h1>
        <SearchContacts />
        <nav>{contacts.length ? <ContactsList contacts={contacts} /> : <>No Contacts</>}</nav>
      </aside>
      <main id="detail" className={clsx({ loadingdetail: isPending })}>
        <Outlet />
      </main>
    </div>
  );
}
