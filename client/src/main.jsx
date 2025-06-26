import { StrictMode } from "react"
import { createRoot } from "react-dom/client"
import "./index.css"
import App from "./App.jsx"
import "bootstrap/dist/css/bootstrap.min.css"
import "bootstrap/dist/js/bootstrap.bundle.min.js"
import { createBrowserRouter, RouterProvider } from "react-router"
import Homepage from "./routes/Homepage.jsx"
import Districts from "./routes/Districts.jsx"
import YummyContextProvider from "./contexts/YummyContextProvider.jsx"
import Login from "./routes/Login.jsx"
import Register from "./routes/Register.jsx"
import Restaurants from "./routes/Restaurants.jsx"
import Profile from "./routes/Profile.jsx"
import Dishes from "./routes/Dishes.jsx"
import Restaurant from "./routes/Restaurant.jsx"

const router = createBrowserRouter([
  {
    path: "/",
    element: <Homepage />,
  },
  {
    path: "/districts",
    element: <Districts />,
  },
  {
    path: "/login",
    element: <Login />,
  },
  {
    path: "/register",
    element: <Register />,
  },
  {
    path: "/restaurants",
    element: <Restaurants />,
  },
  {
    path: "/dishes",
    element: <Dishes />,
  },
  {
    path: "/:user_type/:id/profile",
    element: <Profile />,
  },
  {
    path: "/restaurant/:id",
    element: <Restaurant />,
  },
])

createRoot(document.getElementById("root")).render(
  <StrictMode>
    <YummyContextProvider>
      <RouterProvider router={router} />
    </YummyContextProvider>
  </StrictMode>
)
