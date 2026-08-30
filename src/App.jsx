import { createBrowserRouter, RouterProvider } from "react-router-dom";
import { LandingPage, TrackApp, PageLayout, ErrorPage, Detailes } from "./pages";

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
        element: <TrackApp />,
      },
      {
        path: "tracker/:idrecord",
        element: <Detailes />
      }
    ],
  },
]);

function App() {
  return <RouterProvider router={router} />;
}

export default App;
