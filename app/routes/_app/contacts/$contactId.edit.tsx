import { createFileRoute } from "@tanstack/react-router";
import { getContact } from "~/db/db";
import { ContactForm } from "./-contact-form";

export const Route = createFileRoute("/_app/contacts/$contactId/edit")({
  component: EditContact,
  loader: async ({ params: { contactId } }) => {
    const contact = await getContact(contactId);
    if (!contact) throw new Error("contact not found");
    return contact;
  },
});

function EditContact() {
  const contact = Route.useLoaderData();

  return <ContactForm contact={contact} />;
}
