import { RouterProvider, createBrowserRouter } from "react-router-dom";
import { NhostClient, NhostProvider } from "@nhost/react";
import { NhostApolloProvider } from "@nhost/react-apollo";
import { withPubSub } from "./utils/use-pubsub";
import { loadable } from "./loadable";

// Lazy Loaded Routes
const PublicLayout = loadable(() => import("./layouts/PublicLayout"));
const HomePage = loadable(() => import("./Pages/HomePage"));
const DevPage = loadable(() => import("./Pages/DevPage"));

const BetaLayout = loadable(() => import("./layouts/BetaLayout"));
const BetaAccount = loadable(() => import("./Pages/BetaAccount"));
const BetaSignup = loadable(() => import("./Pages/BetaSignup"));
const BetaProjectCreate = loadable(() => import("./Pages/BetaProjectCreate"));
const BetaProjectDesktop = loadable(() => import("./Pages/BetaProjectDesktop"));

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
