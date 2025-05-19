import { useNavigate } from "@tanstack/react-router";
import { ContactRecord } from "~/db/db";

export function ContactForm({ contact }: { contact: ContactRecord }) {
  const navigate = useNavigate();

  return (
    <form key={contact.id} id="contact-form" method="post">
      <fieldset className="fieldset bg-base-200 border-base-300 rounded-box w-lg border p-4 flex flex-col gap-8">
        <legend className="fieldset-legend">Contact details</legend>

        <label className="label flex flex-col items-start">
          Name
          <div className="flex items-center gap-4">
            <input
              className="input text-base-content"
              aria-label="First name"
              defaultValue={contact.first}
              name="first"
              placeholder="First"
              type="text"
            />
            <input
              className="input text-base-content"
              aria-label="Last name"
              defaultValue={contact.last}
              name="last"
              placeholder="Last"
              type="text"
            />
          </div>
        </label>

        <label className="label flex flex-col items-start">
          Twitter
          <input
            className="input text-base-content"
            defaultValue={contact.twitter}
            name="twitter"
            placeholder="@jack"
            type="text"
          />
        </label>

        <label className="label flex flex-col items-start">
          Avatar URL
          <input
            className="input text-base-content"
            aria-label="Avatar URL"
            defaultValue={contact.avatar}
            name="avatar"
            placeholder="https://example.com/avatar.jpg"
            type="text"
          />
        </label>

        <label className="label flex flex-col items-start">
          Notes
          <textarea
            className="textarea text-base-content"
            defaultValue={contact.notes}
            name="notes"
            rows={6}
          />
        </label>

        <div className="flex gap-2 mt-4">
          <button className="btn btn-primary" type="submit">
            Save
          </button>
          <button className="btn btn-warning" type="button" onClick={() => navigate({ to: ".." })}>
            Cancel
          </button>
        </div>
      </fieldset>
    </form>
  );
}
