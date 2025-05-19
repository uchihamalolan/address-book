import { getRouteApi, Link } from "@tanstack/react-router";
import { Star } from "lucide-react";
import { ContactRecord } from "~/db/db";

const routeApi = getRouteApi("/_app");

export function ContactsList({ contacts }: { contacts: ContactRecord[] }) {
  return (
    <ul className="flex flex-col gap-1.5">
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
  const { favorite, first, last, id } = contact;

  const contactName =
    first || last ? (
      <>
        {first} {last}
      </>
    ) : (
      <i>No Name</i>
    );

  return (
    <Link
      className="hover:bg-base-300 p-2 rounded-lg flex justify-between items-center ${clsx(ac)}"
      to={"/contacts/$contactId"}
      params={{ contactId: id }}
      search={{ q }}
      activeProps={{
        className: "hover:bg-primary bg-primary text-primary-content",
      }}
    >
      {contactName}
      {favorite ? <Star fill="var(--color-amber-400)" /> : null}
    </Link>
  );
}
