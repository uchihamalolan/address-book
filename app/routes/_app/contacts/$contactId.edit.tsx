import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { getContact } from "~/db/db";

export const Route = createFileRoute("/_app/contacts/$contactId/edit")({
  component: EditContact,
  loader: async ({ params: { contactId } }) => {
    const contact = await getContact(contactId);
    console.log("contactId", contactId);
    if (!contact) throw new Error("contact not found");
    return contact;
  },
});

function EditContact() {
  const contact = Route.useLoaderData();
  const navigate = useNavigate();

  return (
    <form key={contact.id} id="contact-form" method="post">
      <p>
        <span>Name</span>
        <input
          aria-label="First name"
          defaultValue={contact.first}
          name="first"
          placeholder="First"
          type="text"
        />
        <input
          aria-label="Last name"
          defaultValue={contact.last}
          name="last"
          placeholder="Last"
          type="text"
        />
      </p>
      <label>
        <span>Twitter</span>
        <input defaultValue={contact.twitter} name="twitter" placeholder="@jack" type="text" />
      </label>
      <label>
        <span>Avatar URL</span>
        <input
          aria-label="Avatar URL"
          defaultValue={contact.avatar}
          name="avatar"
          placeholder="https://example.com/avatar.jpg"
          type="text"
        />
      </label>
      <label>
        <span>Notes</span>
        <textarea defaultValue={contact.notes} name="notes" rows={6} />
      </label>
      <p>
        <button type="submit">Save</button>
        <button type="button" onClick={() => navigate({ to: ".." })}>
          Cancel
        </button>
      </p>
    </form>
  );
}
