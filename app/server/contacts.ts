import { createServerFn } from "@tanstack/react-start";
import z from "zod";
import { updateContact } from "~/db/db";

const StarContactSchema = z.object({
  contactId: z.string(),
  favorite: z.boolean(),
});

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
