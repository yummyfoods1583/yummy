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
import Admin from "./routes/Admin.jsx"
import Register from "./routes/Register.jsx"
import Restaurants from "./routes/Restaurants.jsx"

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
    path: "/:user_type/:user_id",
    element: <Admin />,
  },
  {
    path: "/restaurants",
    element: <Restaurants/>,
  },
])

createRoot(document.getElementById("root")).render(
  <StrictMode>
    <YummyContextProvider>
      <RouterProvider router={router} />
    </YummyContextProvider>
  </StrictMode>
)
