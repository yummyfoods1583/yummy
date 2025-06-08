import React from "react"
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import { faStar } from "@fortawesome/free-solid-svg-icons"

const Restaurant_Card = ({ restaurant }) => {
  if (restaurant.photo_url === null) restaurant.photo_url = "/Images/Intro3.png"
  //fetch opening and closing time
  let temp = new Date(restaurant.opening_time)
  //calculate opening time as the minutes past midnigh
  const opening_time = temp.getHours() * 60 + temp.getMinutes()
  const opening_hr = temp.getHours()
  const opening_min = temp.getMinutes()
  temp = new Date(restaurant.closing_time)
  const closing_time = temp.getHours() * 60 + temp.getMinutes()
  temp = new Date()
  const current_time = temp.getHours() * 60 + temp.getMinutes()
  const close_until =
    restaurant.close_until === null ? null : new Date(restaurant.close_until)
  return (
    <>
      <div
        className="card shadow-lg"
        style={{ width: "400px", cursor: "pointer" }}
      >
        <img
          src={restaurant.photo_url}
          className="card-img-top"
          width={"400px"}
          height={"225px"}
        />
        <div className="card-body">
          <div className="d-flex justify-content-between">
            <p className="card-title fs-5">{restaurant.name}</p>
            <div>
              <FontAwesomeIcon icon={faStar} style={{ color: "#FFD43B" }} />
              <span className="ms-1 fw-bold">{restaurant.rating}</span>
              <span className="ms-1">({restaurant.review_count})</span>
            </div>
          </div>

          <hr />
          <p className="card-text">{restaurant.detailed_address}</p>
        </div>
        {/*Display Closing time*/}
        {close_until === null &&
          current_time < opening_time &&
          current_time > closing_time && (
            <div
              className="Container-fluid bg-black position-absolute bg-opacity-75 d-flex justify-content-center align-items-center fw-bold fs-5"
              style={{ width: "400px", height: "225px" }}
            >
              {
                <span className="text-white">
                  Close Until:{"\t"} {opening_hr.toString().padStart(2, "0")}:
                  {opening_min.toString().padStart(2, "0")}
                </span>
              }
            </div>
          )}

        {/*Display Close Until*/}
        {close_until !== null && (
          <div
            className="Container-fluid bg-black position-absolute bg-opacity-75 d-flex justify-content-center align-items-center fw-bold fs-5"
            style={{ width: "400px", height: "225px" }}
          >
            {
              <span className="text-white">
                Close Until:{"\t"}
                {close_until.getDate().toString().padStart(2, "0")}-
                {(close_until.getMonth() + 1).toString().padStart(2, "0")}-
                {close_until.getFullYear()}
                {"\t"}({close_until.getHours().toString().padStart(2, "0")}:
                {close_until.getMinutes().toString().padStart(2, "0")})
              </span>
            }
          </div>
        )}
      </div>
    </>
  )
}

export default Restaurant_Card
// {
//   close_until !== null && (
//     <span className="text-white">
//       Close Until:{"\t"}
//       {close_until.getDate()}-{close_until.getMonth()}-
//       {close_until.getFullYear()}
//       {"\t"}
//     </span>
//   )
// }
