import { createFileRoute } from "@tanstack/react-router";
import { createEmptyContact } from "~/db/db";
import { ContactForm } from "./-contact-form";

export const Route = createFileRoute("/_app/contacts/new")({
  component: NewContact,
  loader: async () => createEmptyContact(),
});

function NewContact() {
  const contact = Route.useLoaderData();

  return <ContactForm contact={contact} />;
}
