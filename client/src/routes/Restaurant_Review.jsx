import React, { useState, useEffect } from "react"
import YummyDataFetch from "../Api/YummyDataFetch"
import { useParams } from "react-router-dom"
import { useForm } from "react-hook-form"
import Star_rating from "../components/Star_rating"
import ReviewCard from "../components/ReviewCard"
const Restaurant_Review = () => {
  //fetch the restaurant
  const [restaurant, setRestaurant] = useState(null)
  const param = useParams()
  const fetchRestaurant = async () => {
    try {
      const response = await YummyDataFetch.get(`/restaurant/${param.rest_id}`)
      setRestaurant(response.data.data.restaurant)
      fetchRating(response.data.data.restaurant.rest_id)
      fetchReviews(response.data.data.restaurant.rest_id)
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
  //fetch the rating
  const [rating, setRating] = useState(null)
  const fetchRating = async (rest_id) => {
    try {
      const response = await YummyDataFetch.get(`/rating/?rest_id=${rest_id}`)
      setRating(response.data.data)
    } catch (error) {
      alert("Failed to fetch rating:", error)

      // Optional: show a message to the user
      setRating(null) // or fallback to default value
      // You can also use toast or alert here if needed
    }
  }
  //fetch reviews
  const [reviews, setReviews] = useState([])
  const fetchReviews = async (rest_id) => {
    try {
      const response = await YummyDataFetch.get(`/reviews/?rest_id=${rest_id}`)
      setReviews(response.data.data.reviews)
    } catch (error) {
      alert("Failed to fetch rating:", error)

      // Optional: show a message to the user
      setRating(null) // or fallback to default value
      // You can also use toast or alert here if needed
    }
  }
  //form
  const {
    register,
    handleSubmit,
    watch,
    formState: { errors },
  } = useForm()
  //submit a new review
  const onSubmit = async (data) => {
    const body = {
      customer_id: JSON.parse(localStorage.getItem("yummy_user")).user_id,
      rest_id: restaurant.rest_id,
      rating: data.rating,
      review_text: data.review_text,
    }
    const response = await YummyDataFetch.post(`/restaurant_review`, body)
    fetchRestaurant()
  }
  return (
    <>
      {restaurant === null || restaurant === undefined ? (
        <div>Loading...</div>
      ) : (
        <>
          <div className="container-fluid text-center display-2 mb-2 text-danger">
            {`${restaurant.name}`}
          </div>
          <div className="container-fluid text-center fs-5 mb-2 fw-bold">
            {rating?.rating != null ? Number(rating.rating).toFixed(1) : "0.0"}
            (Total reviews:{" "}
            {rating?.review_count != null ? Number(rating.review_count) : "0"})
          </div>

          <div className="container-fluid d-flex justify-content-center mb-5">
            <Star_rating
              rating={rating?.rating != null ? Number(rating.rating) : 0}
            />
          </div>

          <div className="container-fluid m-1">
            <div className="container-fluid my-5">
              <form onSubmit={handleSubmit(onSubmit)}>
                <div className="row row-cols-2">
                  <div className="col-8">
                    <label className="form-label">Name</label>
                    <input
                      type="text"
                      defaultValue={
                        JSON.parse(localStorage.getItem("yummy_user")).user_id
                      }
                      disabled
                      className="form-control border border-dark border-1 mb-3"
                    />
                    {errors.name && (
                      <div
                        className="alert alert-danger p-1 text-center"
                        role="alert"
                      >
                        {errors.name.message}
                      </div>
                    )}
                  </div>
                  <div className="col-3">
                    <label className="form-label">Rating</label>
                    <select
                      {...register("rating", {
                        required: {
                          value: true,
                          message: "Please choose a rating",
                        },
                      })}
                      className="form-select border border-dark border-1 mb-3"
                    >
                      <option value="" hidden>
                        Select Rating
                      </option>
                      <option value="0">0</option>
                      <option value="1">1</option>
                      <option value="2">2</option>
                      <option value="3">3</option>
                      <option value="4">4</option>
                      <option value="5">5</option>
                    </select>
                    {errors.rating && (
                      <div
                        className="alert alert-danger p-1 text-center"
                        role="alert"
                      >
                        {errors.rating.message}
                      </div>
                    )}
                  </div>
                  <div className="col-11">
                    <label className="form-label ">Your Comment</label>
                    <textarea
                      {...register("review_text")}
                      className="form-control border border-dark border-1 mb-3"
                      placeholder="Enter your comment about the restautant"
                    />
                  </div>
                </div>
                <div className="d-flex justify-content-center">
                  <button type="submit" className="btn btn-warning">
                    Add Review
                  </button>
                </div>
              </form>
            </div>
          </div>
          <div className="container text-center my-4 fs-4 fw-bold">
            Other Reviews
          </div>
          {/*displaying reviews */}
          <div className="container-fluid row row-cols-3">
            {reviews.map((review) => {
              return (
                <div className="col-4" key={review.review_id}>
                  <ReviewCard review={review} />
                </div>
              )
            })}
          </div>
        </>
      )}
    </>
  )
}
export default Restaurant_Review
