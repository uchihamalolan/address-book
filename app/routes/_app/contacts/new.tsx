import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/_app/contacts/new")({
  component: RouteComponent,
});

function RouteComponent() {
  return <div>Hello "/_app/contacts/new"!</div>;
}
