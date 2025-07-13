import React, { useEffect, useState } from "react"
import { useNavigate, useParams } from "react-router-dom"
import YummyDataFetch from "../Api/YummyDataFetch"
import Restaurant_Details from "../components/Modal/Restaurant_Details"
import Dishes from "./Dishes"
import Navbar from "../components/Navbar"

const Restaurant = () => {
  //navigator
  const navigate = useNavigate()
  const [restaurant, setRestaurant] = useState(null)
  const param = useParams()
  //fetch the restaurant
  const fetchRestaurant = async () => {
    try {
      const response = await YummyDataFetch.get(`/restaurant/${param.id}`)
      setRestaurant(response.data.data.restaurant)
    } catch (error) {
      if (error.response) {
        console.error("Response Error: " + error.response.data)
        console.error("Response Error Status: " + error.response.status)
      } else if (error.request) {
        console.error("No response recieved: " + error.request)
      } else {
        console.error("Axios error: " + error.message)
      }
    }
  }
  useEffect(() => {
    fetchRestaurant()
  }, [])
  if (restaurant) {
    //set photo_url
    let photo_url = "/Images/No_Image.jpg"
    if (restaurant.photo_url) {
      photo_url = restaurant.photo_url
    }

    //get a current timestamp
    const currTime = new Date()
    //closing and opening timestamp
    const opening_time = new Date(restaurant.opening_time)
    const closing_time = new Date(restaurant.closing_time)
    //find closeUntil
    const closeUntil = new Date(restaurant.close_until)
    console.log(closeUntil)
    const tempCurr = currTime.getHours() * 60 + currTime.getMinutes()
    const tempOpen = opening_time.getHours() * 60 + opening_time.getMinutes()
    const tempClose = closing_time.getHours() * 60 + closing_time.getMinutes()
    //variable to check whether the restaurant is open or not
    // Handle the case where closing time is midnight (0:00) or crosses midnight
    let isOpen
    if (tempClose === 0) {
      // When closing at midnight, check if current time is after opening time
      // and before midnight (1440 minutes = 24 hours)
      isOpen = tempCurr >= tempOpen && tempCurr < 1440
    } else if (tempClose < tempOpen) {
      // When closing time is before opening time (crosses midnight)
      isOpen = tempCurr >= tempOpen || tempCurr < tempClose
    } else {
      // Normal case (same day opening/closing)
      isOpen = tempCurr >= tempOpen && tempCurr < tempClose
    }

    // Also check if we're past any temporary closure time
    if (closeUntil) {
      const tempCloseUntil =
        closeUntil.getHours() * 60 + closeUntil.getMinutes()
      isOpen = isOpen && tempCurr >= tempCloseUntil
    }
    return (
      <>
        {!restaurant && <div>Loading</div>}
        {restaurant && (
          <>
            <Navbar />
            <div className="container-fluid m-2">
              <div className="row">
                <div className="col-3">
                  <img src={photo_url} width="250px" height="175px" alt="" />
                </div>
                <div className="col-7">
                  <h3>{restaurant.name}</h3>
                  <p>
                    Daily opening time:{" "}
                    {new Date(restaurant.opening_time).toLocaleTimeString([], {
                      hour: "2-digit",
                      minute: "2-digit",
                      hour12: true, // use true for AM/PM format
                    })}
                  </p>
                  <p>
                    Daily closing time:{" "}
                    {new Date(restaurant.closing_time).toLocaleTimeString([], {
                      hour: "2-digit",
                      minute: "2-digit",
                      hour12: true, // use true for AM/PM format
                    })}
                  </p>
                  {isOpen && <span className="fw-bold text-success">Open</span>}
                  {!isOpen && (
                    <span className="fw-bold text-danger">Closed</span>
                  )}
                </div>
                <div className="col-2 d-flex align-items-center justify-content-start gap-3">
                  <button
                    className="btn btn-info"
                    data-bs-toggle="modal"
                    data-bs-target={`#rest_details_${restaurant.rest_id}`}
                  >
                    Details
                  </button>
                  <Restaurant_Details restaurant={restaurant} />
                  <button
                    className="btn btn-info"
                    disabled={
                      !localStorage.getItem("yummy_user") ||
                      JSON.parse(localStorage.getItem("yummy_user"))
                        .user_type != "CUS"
                    }
                    onClick={() => {
                      navigate(`/restaurant_review/${restaurant.rest_id}`)
                    }}
                  >
                    Review
                  </button>
                </div>
              </div>
            </div>
            {/*Dish Seacrhing*/}
            <Dishes restaurant={restaurant} />
            {/*Dish Seacrhing*/}
          </>
        )}
      </>
    )
  }
}
export default Restaurant
