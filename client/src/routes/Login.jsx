import React from "react"
import { useForm } from "react-hook-form"
import YummyDataFetch from "../Api/YummyDataFetch"
import { useNavigate } from "react-router-dom"

const loginForm = () => {
  //variables
  const {
    register,
    handleSubmit,
    watch,
    formState: { errors, isSubmitting },
  } = useForm()

  const navigate = useNavigate()

  //handler functions
  const onSubmit = async (data) => {
    try {
      const respond = await YummyDataFetch.post("/login", {
        user_id: data.username,
        password: data.password,
      })
      alert("Login successful")
      localStorage.setItem(
        "yummy_user",
        JSON.stringify({
          user_id: respond.data.data.user.user_id,
          user_type: respond.data.data.user.user_type,
        })
      )
      navigate(`/`)
    } catch (error) {
      const message = error.response?.data.message || error.message
      alert(message)
    }
  }

  return (
    <>
      <div className=" container p-5">
        <form action="" onSubmit={handleSubmit(onSubmit)}>
          <label className="form-label">Username</label>
          <input
            type="text"
            className="form-control mb-3"
            placeholder="Enter your usename"
            {...register("username", {
              required: { value: true, message: "Please fill the username" },
            })}
          />
          {errors.username && (
            <>
              <div className="alert alert-danger" role="alert">
                {errors.username.message}
              </div>
            </>
          )}
          <label className="form-label">Password</label>
          <input
            type="password"
            className="form-control mb-3"
            placeholder="Enter your password"
            {...register("password", {
              required: { value: true, message: "Please fill the password" },
            })}
          />
          {errors.password && (
            <>
              <div className="alert alert-danger" role="alert">
                {errors.password.message}
              </div>
            </>
          )}
          <div className="container d-flex justify-content-center">
            <button
              disabled={isSubmitting}
              type="submit"
              className="btn btn-primary"
            >
              Log In
            </button>
          </div>
        </form>
        {isSubmitting && <div>Loading....</div>}
      </div>
    </>
  )
}

export default loginForm
