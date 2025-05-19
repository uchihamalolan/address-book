////////////////////////////////////////////////////////////////////////////////
// 🛑 Nothing in here has anything to do with React Router, it's just a fake database
////////////////////////////////////////////////////////////////////////////////

import { sort } from "fast-sort";
import { matchSorter } from "match-sorter";
import invariant from "tiny-invariant";

import { contacts } from "./data";

type ContactMutation = {
  id?: string;
  first?: string;
  last?: string;
  avatar?: string;
  twitter?: string;
  notes?: string;
  favorite?: boolean;
};

export type ContactRecord = ContactMutation & {
  id: string;
  createdAt: string;
};

const sleep = async (ms: number) => await new Promise((resolve) => setTimeout(resolve, ms));

////////////////////////////////////////////////////////////////////////////////
// This is just a fake DB table. In a real app you'd be talking to a real db or
// fetching from an existing API.

class FakeContacts {
  #fakeContacts: Map<string, ContactRecord>;

  constructor(initialContacts?: ContactMutation[]) {
    this.#fakeContacts = new Map();

    initialContacts?.forEach((initialContact) => this.create(initialContact));
  }

  async create(values: ContactMutation): Promise<ContactRecord> {
    const id = values.id || Math.random().toString(36).substring(2, 9);
    const createdAt = new Date().toISOString();
    const newContact = { id, createdAt, ...values };
    this.#fakeContacts.set(id, newContact);

    return newContact;
  }

  async getAll(): Promise<ContactRecord[]> {
    return sort([...this.#fakeContacts.values()]).desc((c) => c.createdAt);
  }

  async get(id: string): Promise<ContactRecord | undefined> {
    return this.#fakeContacts.get(id);
  }

  async set(id: string, values: ContactMutation): Promise<ContactRecord> {
    const contact = await this.get(id);
    invariant(contact, `No contact found for ${id}`);
    const updatedContact = { ...contact, ...values };
    this.#fakeContacts.set(id, updatedContact);
    return updatedContact;
  }

  async destroy(id: string) {
    this.#fakeContacts.delete(id);
  }
}

const fakeContacts = new FakeContacts(contacts);

////////////////////////////////////////////////////////////////////////////////
// Handful of helper functions to be called from route loaders and actions
export async function getContacts(query?: string | null) {
  await sleep(500);
  let contacts = await fakeContacts.getAll();

  if (query) {
    contacts = matchSorter(contacts, query, {
      keys: ["first", "last"],
    });
  }

  return contacts;
}

export async function createEmptyContact() {
  await sleep(500);
  const contact = await fakeContacts.create({});
  return contact;
}

export async function getContact(id: string) {
  await sleep(500);

  return await fakeContacts.get(id);
}

export async function updateContact(id: string, updates: ContactMutation) {
  await sleep(500);
  const contact = await fakeContacts.get(id);
  if (!contact) {
    throw new Error(`No contact found for ${id}`);
  }
  await fakeContacts.set(id, { ...contact, ...updates });
  return contact;
}

export async function deleteContact(id: string) {
  await fakeContacts.destroy(id);
}
