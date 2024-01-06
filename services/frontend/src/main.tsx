import { StrictMode } from "react";
import ReactDOM from "react-dom/client";
// import App from "./App.tsx";
import {
  Outlet,
  RouterProvider,
  Link,
  Router,
  Route,
  RootRoute,
} from "@tanstack/react-router";
import { PersistQueryClientProvider } from "@tanstack/react-query-persist-client";
import { TanStackRouterDevtools } from "@tanstack/router-devtools";

import "./index.css";
import { QueryClient } from "@tanstack/react-query";
import { createIDBPersister } from "./lib/index-db-persister.ts";

const rootRoute = new RootRoute({
  component: () => (
    <>
      <div className="p-2 flex gap-2">
        <Link to="/" className="[&.active]:font-bold">
          Home
        </Link>{" "}
        <Link to="/about" className="[&.active]:font-bold">
          About
        </Link>
      </div>
      <hr />
      <Outlet />
      <TanStackRouterDevtools />
    </>
  ),
});

const indexRoute = new Route({
  getParentRoute: () => rootRoute,
  path: "/",
  component: function Index() {
    return (
      <div className="p-2">
        <h3>Welcome Home!</h3>
      </div>
    );
  },
});

const aboutRoute = new Route({
  getParentRoute: () => rootRoute,
  path: "/about",
  component: function About() {
    return <div className="p-2">Hello from About!</div>;
  },
});

const routeTree = rootRoute.addChildren([indexRoute, aboutRoute]);

const router = new Router({ routeTree });

declare module "@tanstack/react-router" {
  interface Register {
    router: typeof router;
  }
}

const persister = createIDBPersister();
const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      gcTime: Infinity,
    },
  },
});
const rootElement = document.getElementById("root")!;
if (!rootElement.innerHTML) {
  const root = ReactDOM.createRoot(rootElement);
  root.render(
    <StrictMode>
      <PersistQueryClientProvider
        client={queryClient}
        persistOptions={{ persister }}
      >
        <RouterProvider router={router} />
      </PersistQueryClientProvider>
    </StrictMode>
  );
}
