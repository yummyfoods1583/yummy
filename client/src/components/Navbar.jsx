import React, { useContext, useEffect } from "react"
import "bootstrap/dist/css/bootstrap.min.css"
import { NavLink, Link } from "react-router-dom"
import UserDropdown from "./UserDropdown"
import { YummyContext } from "../contexts/YummyContextProvider"

const Navbar = () => {
  //check whether there is a logged in user
  const { current_user, setCurrentUser } = useContext(YummyContext)
  useEffect(() => {
    const logged_user = JSON.parse(localStorage.getItem("yummy_user"))
    // console.log(logged_user)
    if (logged_user) {
      setCurrentUser(logged_user)
    }
  }, [])
  return (
    <>
      <div className="container-fluid shadow position-sticky top-0 z-3 bg-white bg-gradient">
        <header className="d-flex flex-wrap align-items-center justify-content-center justify-content-md-between mb-4 border-bottom fs-6 py-1">
          <div className="col-md-3 mb-2 mb-md-0 d-flex justify-content-center">
            <Link
              to="/"
              className="d-inline-flex link-body-emphasis text-decoration-none"
            >
              <img
                src="../public/Images/logo.png"
                width={"180px"}
                height={"50px"}
              />
            </Link>
          </div>
          <ul className="nav nav-underline col-12 col-md-auto mb-2 justify-content-center mb-md-0 gap-3 fw-semibold fs-6">
            <li>
              <NavLink
                to="/"
                className={({ isActive }) =>
                  "nav-link px-2 " + (isActive ? "active" : "")
                }
              >
                Home
              </NavLink>
            </li>
            <li>
              <NavLink
                to="/restaurants"
                className={({ isActive }) =>
                  "nav-link px-2 " + (isActive ? "active" : "")
                }
              >
                Visit Restaurants
              </NavLink>
            </li>
            <li>
              <NavLink to="/dishes" className="nav-link px-2">
                Our Menus
              </NavLink>
            </li>
          </ul>
          <div className="col-md-3 text-end d-flex justify-content-center gap-3">
            {current_user === null && (
              <>
                <Link
                  to="/register"
                  type="button"
                  className="btn btn-outline-success me-2 rounded-pill p-2 fs-6"
                >
                  Register
                </Link>
                <Link
                  to="/login"
                  type="button"
                  className="btn btn-outline-primary rounded-pill p-2 px-3 fs-6"
                >
                  Login
                </Link>
              </>
            )}
            {current_user && (
              <>
                <span>{current_user.user_id}</span>
                <UserDropdown />
              </>
            )}
          </div>
        </header>
      </div>
    </>
  )
}

export default Navbar
