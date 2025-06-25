import React, { useContext, useEffect, useRef } from "react"
import "bootstrap/dist/css/bootstrap.min.css"
import "bootstrap/dist/js/bootstrap.bundle.min.js"
import { Dropdown } from "bootstrap"
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import { faUser } from "@fortawesome/free-solid-svg-icons"
import YummyDataFetch from "../Api/YummyDataFetch"
import { useNavigate } from "react-router-dom"
import { YummyContext } from "../contexts/YummyContextProvider"
import { Link } from "react-router-dom"

const UserDropdown = () => {
  const navigate = useNavigate()
  const buttonRef = useRef(null)
  const dropdownRef = useRef(null)
  const [isOpen, setIsOpen] = React.useState(false)

  useEffect(() => {
    if (buttonRef.current && dropdownRef.current) {
      const dropdown = new Dropdown(buttonRef.current)

      return () => {
        dropdown.dispose()
      }
    }
  }, [])

  const toggleDropdown = () => {
    setIsOpen(!isOpen)
    if (buttonRef.current) {
      const dropdown = Dropdown.getInstance(buttonRef.current)
      if (dropdown) {
        isOpen ? dropdown.hide() : dropdown.show()
      }
    }
  }

  //handling the logout
  const { current_user, setCurrentUser } = useContext(YummyContext)
  const handleLogout = async () => {
    try {
      const response = await YummyDataFetch.post(`/logout`)
      alert("Logout Successfull!!!")
      localStorage.removeItem("yummy_user")
      setCurrentUser(null)
    } catch (err) {
      const message = err.response?.message || err.message
      alert(message)
    }
  }
  return (
    <div className="btn-group">
      <button
        ref={buttonRef}
        type="button"
        className="btn dropdown-toggle p-0 border-0"
        data-bs-toggle="dropdown"
        aria-expanded={isOpen}
        onClick={toggleDropdown}
      >
        <FontAwesomeIcon
          icon={faUser}
          style={{ color: "#000000", fontSize: "20px" }}
        />
      </button>
      <ul ref={dropdownRef} className={`dropdown-menu ${isOpen ? "show" : ""}`}>
        {/*dropdown items for all users*/}
        <li style={{ cursor: "pointer" }}>
          <Link
            to={`/${current_user.user_type}/${current_user.user_id}/profile`}
            className="dropdown-item"
          >
            Profile
          </Link>
        </li>
        <li>
          <hr className="dropdown-divider" />
        </li>
        <li onClick={handleLogout}>
          <span className="dropdown-item" style={{ cursor: "pointer" }}>
            <span className="text-danger fw-bold">Log Out</span>
          </span>
        </li>
      </ul>
    </div>
  )
}

export default UserDropdown
