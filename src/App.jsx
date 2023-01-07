import { RouterProvider, createBrowserRouter } from "react-router-dom";
import { NhostClient, NhostProvider } from "@nhost/react";
import { NhostApolloProvider } from "@nhost/react-apollo";
import { withPubSub } from "./utils/use-pubsub";
import { loadable } from "./loadable";

// Lazy Loaded Routes
const PublicLayout = loadable(() => import("./layouts/PublicLayout"));
const HomePage = loadable(() => import("./pages/HomePage"));
const DevPage = loadable(() => import("./pages/DevPage"));

const BetaLayout = loadable(() => import("./layouts/BetaLayout"));
const BetaAccount = loadable(() => import("./pages/BetaAccount"));
const BetaSignup = loadable(() => import("./pages/BetaSignup"));
const BetaProjectCreate = loadable(() => import("./pages/BetaProjectCreate"));
const BetaProjectDesktop = loadable(() => import("./pages/BetaProjectDesktop"));

// TODO: get parameters at build time
const nhost = new NhostClient({
  subdomain: "gbdxstfogsleelzwgwlv",
  region: "eu-central-1"
});

export const router = createBrowserRouter([
  {
    path: "/",
    element: <HomePage />
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
    element: <BetaLayout />,
    children: [
      { index: true, element: <BetaAccount /> },
      { path: "signup", element: <BetaSignup /> },
      { path: "create", element: <BetaProjectCreate /> },
      { path: "project/:uuid", element: <BetaProjectDesktop /> }
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
