import { RouterProvider, createBrowserRouter } from "react-router-dom";
import { NhostClient, NhostProvider } from "@nhost/react";
import { NhostApolloProvider } from "@nhost/react-apollo";
import { Navigate } from "react-router-dom";
import { withPubSub } from "./utils/use-pubsub";
import { loadable } from "./loadable";

// Lazy Loaded Routes
const PublicLayout = loadable(() => import("./layouts/PublicLayout"));
const DevPage = loadable(() => import("./pages/DevPage"));

const PublicLayoutBeta = loadable(() => import("./layouts/PublicLayoutBeta"));
const BetaAccount = loadable(() => import("./pages/BetaAccount"));
const BetaSignup = loadable(() => import("./pages/BetaSignup"));
const BetaProjectCreate = loadable(() => import("./pages/BetaProjectCreate"));
const BetaProjectImport = loadable(() => import("./pages/BetaProjectImport"));
const BetaProjectDesktop = loadable(() => import("./pages/BetaProjectDesktop"));

// TODO: get parameters at build time
const nhost = new NhostClient({
  subdomain: "gbdxstfogsleelzwgwlv",
  region: "eu-central-1"
});

export const router = createBrowserRouter([
  {
    path: "/",
    element: <Navigate to="/beta" />
  },
  {
    path: "/dev",
    element: <PublicLayout />,
    children: [
      {
        index: true,
        element: <DevPage />
      }
    ]
  },
  {
    path: "/beta",
    element: <PublicLayoutBeta />,
    children: [
      // Public Routes
      { index: true, element: <Navigate to="/beta/@me" /> },
      { path: "signup", element: <BetaSignup /> },
      // Protected Routes
      { path: "@me", element: <BetaAccount /> },
      { path: "@me/:uuid", element: <BetaProjectDesktop /> },
      { path: "@me/create", element: <BetaProjectCreate /> },
      { path: "@me/import", element: <BetaProjectImport /> }
    ]
  }
]);

const App = () => (
  <NhostProvider nhost={nhost}>
    <NhostApolloProvider nhost={nhost}>
      <RouterProvider router={router} />
    </NhostApolloProvider>
  </NhostProvider>
);

export default withPubSub(App);
