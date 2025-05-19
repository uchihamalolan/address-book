import { queryOptions } from "@tanstack/react-query";
import { notFound } from "@tanstack/react-router";
import { createServerFn } from "@tanstack/react-start";
import z from "zod";

import { deleteContact, getContact, updateContact } from "~/db/db";
import { queryClient } from "~/router";

const StarContactSchema = z.object({
  contactId: z.string(),
  favorite: z.boolean(),
});

/* -------------------- STAR CONTACT -------------------- */

export const starContact = createServerFn({ method: "POST" })
  .validator((data: z.infer<typeof StarContactSchema>) => {
    return StarContactSchema.parse(data);
  })
  .handler(async ({ data }) => {
    try {
      return updateContact(data.contactId, {
        favorite: data.favorite,
      });
    } catch (error) {
      console.error("Failed to star contact:", error);
      throw new Error("Failed to star contact");
    }
  });

export const starMutationOptions = (contactId: string) => ({
  mutationKey: ["contact", contactId, "favorite"],
  mutationFn: async ({ favorite }: { favorite: boolean }) => {
    const res = await starContact({ data: { contactId, favorite } });
    return res;
  },
  onSuccess: () => queryClient.invalidateQueries(),
});

/* -------------------- FETCH CONTACT -------------------- */
const fetchContact = createServerFn({ method: "GET" })
  .validator((id: string) => id)
  .handler(async ({ data }) => {
    const contact = await getContact(data);

    if (!contact) throw notFound();

    return contact;
  });

export const contactQueryOptions = (contactId: string) =>
  queryOptions({
    queryKey: ["contact", contactId],
    queryFn: () => fetchContact({ data: contactId }),
  });

/* -------------------- TRASH CONTACT -------------------- */
const trashContact = createServerFn({ method: "POST" })
  .validator((id: string) => id)
  .handler(async ({ data }) => {
    await deleteContact(data);
  });

export const trashMutationOptions = (contactId: string) => ({
  mutationKey: ["contact", contactId, "trash"],
  mutationFn: async () => {
    await trashContact({ data: contactId });
  },
});
