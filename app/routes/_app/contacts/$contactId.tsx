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
    <div id="contact">
      <img
        alt={`${contact.first} ${contact.last} avatar`}
        key={contact.avatar}
        src={contact.avatar}
      />

      <div>
        <h1>
          {contactName}
          <Favorite contact={contact} />
        </h1>

        {contact.twitter ? (
          <p>
            <a href={`https://twitter.com/${contact.twitter}`}>{contact.twitter}</a>
          </p>
        ) : null}

        {contact.notes ? <p>{contact.notes}</p> : null}

        <div>
          <Link to={"/contacts/$contactId/edit"} params={{ contactId: contact.id }}>
            <button>Edit</button>
          </Link>
          <Link to={"/about"}>
            <button>Delete</button>
          </Link>
        </div>
      </div>

      {/* To Render edit form  */}
      <Outlet />
    </div>
  );
}

function Favorite({ contact }: { contact: ContactRecord }) {
  const favorite = contact.favorite;
  const favContact = useServerFn(starContact);
  const router = useRouter();

  return (
    <button
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
