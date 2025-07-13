import React from "react"
import Star_rating from "./Star_rating"
const ReviewCard = ({ review }) => {
  return (
    <>
      <div className="card text-bg-primary mb-3">
        <div className="card-header  d-flex justify-content-between">
          {review.customer_id}
          <span>
            <Star_rating rating={review.rating} />
          </span>
        </div>
        <div className="px-3 d-flex justify-content-between">
          {new Date(review.review_time).toLocaleString("en-US", {
            dateStyle: "medium",
            timeStyle: "short",
          })}
        </div>

        <div className="card-body">
          <p className="card-text fs-5 fw-bold">{review.review_text}</p>
        </div>
      </div>
    </>
  )
}

export default ReviewCard
