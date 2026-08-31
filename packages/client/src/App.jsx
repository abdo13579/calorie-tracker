import { createBrowserRouter, RouterProvider } from "react-router-dom";
import {
  LandingPage,
  TrackApp,
  PageLayout,
  ErrorPage,
  Detailes,
} from "./pages";

const router = createBrowserRouter([
  {
    path: "/",
    element: <PageLayout />,
    errorElement: <ErrorPage />,
    children: [
      {
        index: true,
        element: <LandingPage />,
      },
      {
        path: "tracker",
        children: [
          {
            path: ":idrecord",
            element: <Detailes />,
          },
          {
            index: true,
            element: <TrackApp />,
          },
        ],
      },
    ],
  },
]);

function App() {
  return <RouterProvider router={router} />;
}

export default App;
