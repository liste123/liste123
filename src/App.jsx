import { RouterProvider, createBrowserRouter } from "react-router-dom";
import { withPubSub } from "./utils/use-pubsub";
import { loadable } from "./loadable";

// Lazy Loaded Routes
const PublicLayout = loadable(() => import("./layouts/PublicLayout"));
const HomePage = loadable(() => import("./Pages/HomePage"));

export const router = createBrowserRouter([
  {
    path: "/",
    element: <PublicLayout />,
    children: [
      {
        index: true,
        element: <HomePage />
      }
    ]
  }
]);

const App = () => <RouterProvider router={router} />;

export default withPubSub(App);
