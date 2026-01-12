import { createBrowserRouter, RouterProvider } from "react-router-dom";
import Layout from "./Layout";
import Home from "./pages/Home";
import Login from "./pages/Login";
import Register from "./pages/Register";
import Gigs from "./pages/Gigs";
import Gig from "./pages/Gig";
import MyGigs from "./pages/MyGigs";
import AddGig from "./pages/AddGig";
import MyBids from "./pages/MyBids";
import Profile from "./pages/Profile";
import { AuthContextProvider } from "./context/AuthContext";
import { Toaster } from "react-hot-toast";
import "./index.css";

const router = createBrowserRouter([
  {
    path: "/",
    element: <Layout />,
    children: [
      {
        path: "/",
        element: <Home />,
      },
      {
        path: "/gigs", // Browse all gigs
        element: <Gigs />,
      },
      {
        path: "/gigs/:id", // Single gig details
        element: <Gig />,
      },
      {
        path: "/my-gigs", // Client's gigs
        element: <MyGigs />,
      },
      {
        path: "/add", // Post a gig
        element: <AddGig />,
      },
      {
        path: "/profile",
        element: <Profile />,
      },
      {
        path: "/my-bids",
        element: <MyBids />,
      },
      {
        path: "/login",
        element: <Login />,
      },
      {
        path: "/register",
        element: <Register />,
      },
    ],
  },
]);

function App() {
  return (
    <AuthContextProvider>
      <Toaster position="top-center" toastOptions={{ duration: 3000 }} />
      <RouterProvider router={router} />
    </AuthContextProvider>
  );
}

export default App;
