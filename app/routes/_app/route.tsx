import { useSuspenseQuery } from "@tanstack/react-query";
import { createFileRoute, Outlet } from "@tanstack/react-router";
import { zodValidator } from "@tanstack/zod-adapter";

import clsx from "clsx";
import z from "zod";

import { contactsQueryOptions } from "~/server/contacts";
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
  loader: async ({ deps: { q }, context: { queryClient } }) => {
    return await queryClient.ensureQueryData(contactsQueryOptions(q));
  },
});

function Sidebar() {
  const { q } = Route.useSearch();
  const { data: contacts, isPending } = useSuspenseQuery(contactsQueryOptions(q));

  return (
    <div className="flex h-screen">
      <aside id="sidebar" className="w-80 border-r border-r-base-300 bg-base-200 flex flex-col">
        {/* <h1>
          <Link to="/about">React Router Contacts</Link>
        </h1> */}
        <SearchContacts />
        <nav className="px-4 pt-4 border-t-2 border-t-base-300 overflow-auto flex-1">
          {contacts.length ? <ContactsList contacts={contacts} /> : <i>No Contacts</i>}
        </nav>
        <div className="h-6 bg-base-300"></div>
      </aside>
      <main
        id="detail"
        className={clsx(
          "flex-1 py-8 px-16 w-full",
          isPending && "opacity-25 transition-opacity duration-200 delay-200"
        )}
      >
        <Outlet />
      </main>
    </div>
  );
}
