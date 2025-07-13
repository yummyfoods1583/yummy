import React from "react"
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import { faStar as faStarSolid } from "@fortawesome/free-solid-svg-icons"
import { faStar as faStarRegualr } from "@fortawesome/free-regular-svg-icons"
import { faStarHalfStroke } from "@fortawesome/free-solid-svg-icons"
const Star_rating = ({ rating }) => {
  let stars = []
  for (let i = 1; i <= 5; i++) {
    if (i <= rating)
      stars.push(
        <FontAwesomeIcon
          icon={faStarSolid}
          style={{ color: "#FFD43B" }}
          key={i}
        />
      )
    else if (i == Math.ceil(rating)) {
      stars.push(
        <FontAwesomeIcon
          icon={faStarHalfStroke}
          style={{ color: "#FFD43B" }}
          key={i}
        />
      )
    } else
      stars.push(
        <FontAwesomeIcon
          icon={faStarRegualr}
          style={{ color: "#FFD43B" }}
          key={i}
        />
      )
  }
  return <>{stars}</>
}

export default Star_rating
