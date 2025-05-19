import { useMutation, useSuspenseQuery } from "@tanstack/react-query";
import { createFileRoute, Link, Outlet, useNavigate } from "@tanstack/react-router";
import { Pencil, Trash2 } from "lucide-react";

import { ContactRecord } from "~/db/db";
import { contactQueryOptions, starMutationOptions, trashMutationOptions } from "~/server/contacts";

export const Route = createFileRoute("/_app/contacts/$contactId")({
  component: Contact,
  loader: async ({ params: { contactId }, context: { queryClient } }) => {
    return await queryClient.ensureQueryData(contactQueryOptions(contactId));
  },
});

function Contact() {
  const { contactId } = Route.useParams();
  const { data: contact } = useSuspenseQuery(contactQueryOptions(contactId));

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
              <button className="btn btn-primary" aria-label="Edit Contact">
                <Pencil size={16} />
                Edit
              </button>
            </Link>
            <DeleteContact contactId={contact.id} />
          </div>
        </div>
      </div>
      <div className="contact-form mt-16">
        <Outlet />
      </div>
    </div>
  );
}

function DeleteContact({ contactId }: { contactId: string }) {
  const { mutate } = useMutation(trashMutationOptions(contactId));
  const navigate = useNavigate();

  const handleDelete = () => {
    const response = confirm("Do you really want to delete this contact?");
    if (!response) return;

    mutate();
    navigate({ to: "/" });
  };

  return (
    <button
      className="btn btn-outline btn-error"
      aria-label="Delete Contact"
      onClick={handleDelete}
    >
      <Trash2 size={16} />
      Delete
    </button>
  );
}

function Favorite({ contact }: { contact: ContactRecord }) {
  const { favorite, id } = contact;
  const { mutate, variables } = useMutation(starMutationOptions(id));

  const finalFav = variables?.favorite ?? favorite;

  return (
    <button
      className={`btn btn-circle btn-primary text-xl ${!finalFav && "btn-outline"}`}
      aria-label={finalFav ? "Remove from favorites" : "Add to favorites"}
      name="favorite"
      value={finalFav ? "false" : "true"}
      onClick={() => mutate({ favorite: !favorite })}
    >
      {finalFav ? "★" : "☆"}
    </button>
  );
}
