import { createFileRoute, Link, Outlet, useRouter } from "@tanstack/react-router";
import { useServerFn } from "@tanstack/react-start";
import { ContactRecord, getContact } from "~/db/db";
import { starContact } from "~/server/contacts";

export const Route = createFileRoute("/_app/contacts/$contactId")({
  component: Contact,
  loader: async ({ params: { contactId } }) => {
    const contact = await getContact(contactId);
    if (!contact) throw new Error("no contact found");
    return contact;
  },
});

function Contact() {
  const contact = Route.useLoaderData();

  const contactName =
    contact.first || contact.last ? `${contact.first} ${contact.last}` : <i>No Name</i>;

  return (
    <div id="contact" className="max-w-2xl">
      <div className="contact-header flex gap-16">
        <img
          alt={`${contact.first} ${contact.last} avatar`}
          key={contact.avatar}
          src={contact.avatar}
          className="object-cover aspect-square rounded-3xl w-48"
        />
        <div className="contact-info flex flex-col gap-4">
          <div className="flex items-center gap-4">
            <h1 className="text-3xl">{contactName}</h1>
            <Favorite contact={contact} />
          </div>

          {contact.twitter ? (
            <a href={`https://twitter.com/${contact.twitter}`}>{contact.twitter}</a>
          ) : null}

          {contact.notes ? <p className="whitespace-break-spaces">{contact.notes}</p> : null}

          <div className="flex items-center gap-4">
            <Link to={"/contacts/$contactId/edit"} params={{ contactId: contact.id }}>
              <button className="btn btn-primary">Edit</button>
            </Link>
            <Link to={"/about"}>
              <button className="btn btn-neutral">Delete</button>
            </Link>
          </div>
        </div>
      </div>
      <div className="contact-form mt-16">
        <Outlet />
      </div>
    </div>
  );
}

function Favorite({ contact }: { contact: ContactRecord }) {
  const favorite = contact.favorite;
  const favContact = useServerFn(starContact);
  const router = useRouter();

  return (
    <button
      className="btn btn-outline btn-circle"
      aria-label={favorite ? "Remove from favorites" : "Add to favorites"}
      name="favorite"
      value={favorite ? "false" : "true"}
      onClick={async () => {
        await favContact({ data: { contactId: contact.id, favorite: !favorite } });
        await router.invalidate({ sync: true });
      }}
    >
      {favorite ? "★" : "☆"}
    </button>
  );
}
