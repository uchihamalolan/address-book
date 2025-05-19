import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/_app/")({
  component: Home,
});

export default function Home() {
  return (
    <p id="index-page" className="my-8 mx-auto text-center text-base-content">
      This is a demo for React Router.
      <br />
      Check out <a href="https://reactrouter.com">the docs at reactrouter.com</a>.
    </p>
  );
}
