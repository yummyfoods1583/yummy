/*test 
    <Dish_card
        dish={{
          dish_name: "Butter Chicken",
          rating: 4.6,
          review_count: 0,
          photo_url:
            "https://www.spiceroots.com/spiceroots/wp-content/uploads/2008/05/butterchicken-1024x682.jpg",
          available: true,
          categories: ["Chicken", "Desi and Traditional"],
          restaurant_name: "The Cuisine Hub",
          details: "Creamy spiced curry with tender chicken chunks.",
        }}
      />
*/

import { faStar } from "@fortawesome/free-solid-svg-icons"
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import React from "react"
import Dish_Details from "./Modal/Dish_Details"

const Dish_card = ({ dish }) => {
  const photo_url = dish.photo_url || "/Images/No_Image.jpg"
  let categories = ""
  if (dish.categories) {
    for (let i = 0; i < dish.categories.length - 1; i++) {
      categories += dish.categories[i] + " - "
    }
    categories += dish.categories[dish.categories.length - 1]
  }
  return (
    <>
      <div
        className="card shadow-lg transition-transform"
        style={{
          width: "400px",
          cursor: "pointer",
        }}
      >
        <img
          src={photo_url}
          className="card-img-top"
          width={"400px"}
          height={"225px"}
        />
        <div className="card-body">
          <div className="d-flex justify-content-between">
            <p className="card-title fs-5 fw-bold">{dish.dish_name}</p>
            <div>
              <FontAwesomeIcon icon={faStar} style={{ color: "#FFD43B" }} />
              <span className="ms-1 fw-bold">{dish.rating}</span>
              <span className="ms-1">({dish.review_count})</span>
            </div>
          </div>
          <hr />
          <p className="fs-5">{dish.restaurant_name}</p>
          <p>{categories}</p>
          {/*Order & Details Button */}
          <div className="container d-flex justify-content-between">
            <button
              className="btn btn-info mt-0 mb-1 "
              data-bs-toggle="modal"
              data-bs-target={`#details_modal_${dish.dish_id}`}
            >
              Details
            </button>
            <button className="btn btn-primary mt-0 mb-1">Add to Cart</button>
          </div>
        </div>
        {/*details modal */}
        <Dish_Details dish={dish} />
        {/*Display Availability */}
        {!dish.available && (
          <div
            className="Container-fluid bg-black position-absolute bg-opacity-75 d-flex justify-content-center align-items-center fw-bold fs-5"
            style={{ width: "400px", height: "225px" }}
          >
            <span className="text-white">Not Currently Available</span>
          </div>
        )}
      </div>
    </>
  )
}

export default Dish_card
