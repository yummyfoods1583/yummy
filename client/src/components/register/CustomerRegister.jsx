import { faCircleInfo } from "@fortawesome/free-solid-svg-icons"
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import { Tooltip } from "bootstrap"
import React, { useState } from "react"
import { useEffect, useContext } from "react"
import { YummyContext } from "../../contexts/YummyContextProvider"
import YummyDataFetch from "../../Api/YummyDataFetch"
import { useForm } from "react-hook-form"
import ImageFinder from "../../Api/ImageFinder"

const CustomerRegister = () => {
  //variables
  const {
    register,
    handleSubmit,
    setError,
    formState: { errors, isSubmitting },
  } = useForm()

  //trigger to start the tooltips
  useEffect(() => {
    const toolTipTriggerList = document.querySelectorAll(
      '[data-bs-toggle="tooltip"]'
    )
    for (let toolTip of toolTipTriggerList) {
      new Tooltip(toolTip)
    }
  }, [])

  //fetch all the districts
  const { districts, setDistricts } = useContext(YummyContext)
  useEffect(() => {
    const fetchDistricts = async () => {
      const response = await YummyDataFetch.get("/districts")
      setDistricts(response.data.data.districts)
    }
    fetchDistricts()
  }, [])

  //handler functions

  //handle submit button
  const onSubmit = async (data) => {
    console.log(data)
    //cancel submission if paswords don't match
    if (data.password !== data.password2) {
      setError("password2", {
        type: "manual",
        message: "Passwords don't match",
      })
      return // stop submission
    }

    //cancel submission on invalid email id
    const emailPattern = /^[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,}$/
    if (data.email !== null && !emailPattern.test(data.email)) {
      setError("email", {
        type: "manual",
        message: "Please insert a valid email...",
      })
      return
    }

    //proceed submission

    //first try to upload the image and get the url---
    let photo_url = null
    if (data.photo.length !== 0) {
      try {
        const sendData = new FormData()
        sendData.append("file", data.photo[0])
        sendData.append("upload_preset", "Yummy-Image-Cloud")
        sendData.append("folder", "Customer_Photos")
        const response = await ImageFinder.post(``, sendData)
        photo_url = response.data.url
        console.log(photo_url)
      } catch (error) {
        alert(
          "An Error Occurred while uploading photo... so the registration cancelled"
        )
        return
      }
    }

    const request = {
      user_id: data.user_id,
      password: data.password,
      name: data.name,
      mobile: data.mobile,
      email: data.email || null,
      photo_url: photo_url || null,
      details: data.details || null,
      sub_dist_id: data.sub_dist_id || null,
    }
    console.log(request)
    try {
      const response = await YummyDataFetch.post(`/customer`, request)
      if (response.data.data_length == 0) {
        alert("Username Aready Exists Please Choose Another Usrename")
      } else {
        localStorage.setItem(
          "user",
          JSON.stringify({
            user_id: request.user_id,
            user_type: "CUS",
          })
        )
      }
    } catch (error) {
      alert(
        "An Error Occurred while connecting to server... so the registration cancelled"
      )
    }
  }

  //find corresponding sub districts
  const [subdistricts, setSubDistricts] = useState([])
  const findSubDistricts = async (e) => {
    const response = await YummyDataFetch.get(`/subdistricts/${e.target.value}`)
    setSubDistricts(response.data.data.subdistricts)
  }

  return (
    <>
      <div className="conatiner-fluid mt-3">
        <div className="container d-flex justify-content-center">
          <h2>Customer Registration</h2>
        </div>
        <form onSubmit={handleSubmit(onSubmit)}>
          <div className="d-flex justify-content-between align-items-center p-2">
            <label className="form-label">Choose a unique username*</label>
            <FontAwesomeIcon
              icon={faCircleInfo}
              style={{ color: "#ff0000" }}
              data-bs-toggle="tooltip"
              data-bs-placement="top"
              data-bs-title="Your user name must be unique.can contain only small case letters (a-z), digits(0-9), special charcters(. - _). Must start with a letter and length between 5 and 30"
            />
          </div>
          <input
            type="text"
            className="form-control mb-3"
            placeholder="Your username will be used as login id"
            {...register("user_id", {
              required: { value: true, message: "Please fill the username" },
              maxLength: {
                value: 30,
                message: "Maximum 30 characters can be added",
              },
              minLength: {
                value: 5,
                message: "Minimum 5 characters are needed",
              },
              pattern: {
                value: /^[a-z][a-z0-9._-]*$/,
                message: "Please see the username constraints",
              },
            })}
          />
          {errors.user_id && (
            <div className="alert alert-danger" role="alert">
              {errors.user_id.message}
            </div>
          )}
          <div className="d-flex justify-content-between align-items-center p-2">
            <label className="form-label">Enter a password*</label>
            <FontAwesomeIcon
              icon={faCircleInfo}
              style={{ color: "#ff0000" }}
              data-bs-toggle="tooltip"
              data-bs-placement="top"
              data-bs-title="Must contain atleast 1 letter (a-z or A-Z) and a digit(0-9). Minimum length 8, Maximum length 50"
            />
          </div>
          <input
            type="password"
            className="form-control mb-3"
            placeholder="Choose a strong password"
            {...register("password", {
              required: { value: true, message: "Please fill the password" },
              maxLength: {
                value: 50,
                message: "Maximum 50 characters can be added",
              },
              minLength: {
                value: 8,
                message: "Minimum 8 characters are needed",
              },
              pattern: {
                value: /^(?=.*[A-Za-z])(?=.*\d).+$/,
                message: "Please see the password constraints",
              },
            })}
          />{" "}
          {errors.password && (
            <div className="alert alert-danger" role="alert">
              {errors.password.message}
            </div>
          )}
          <div className="d-flex justify-content-between align-items-center p-2">
            <label className="form-label">Re-enter the password*</label>
          </div>
          <input
            type="password"
            className="form-control mb-3"
            placeholder="Re-Enter your password"
            {...register("password2", {
              required: {
                value: true,
                message: "Please re-Enter the password",
              },
            })}
          />
          {errors.password2 && (
            <div className="alert alert-danger" role="alert">
              {errors.password2.message}
            </div>
          )}
          <div className="d-flex justify-content-between align-items-center p-2">
            <label className="form-label">Enter your name*</label>
          </div>
          <input
            type="text"
            className="form-control mb-3"
            placeholder="Enter your name"
            {...register("name", {
              required: { value: true, message: "Please enter your name" },
            })}
          />
          {errors.name && (
            <div className="alert alert-danger" role="alert">
              {errors.name.message}
            </div>
          )}
          <div className="d-flex justify-content-between align-items-center p-2">
            <label className="form-label">Mobile number*</label>
          </div>
          <input
            type="text"
            className="form-control mb-3"
            placeholder="Enter your mobile number"
            {...register("mobile", {
              required: {
                value: true,
                message: "Please enter your mobile number",
              },
              minLength: {
                value: 11,
                message: "Minimum length is 11.",
              },
              maxLength: {
                value: 15,
                message: "Maximum length is 15",
              },
            })}
          />{" "}
          {errors.mobile && (
            <div className="alert alert-danger" role="alert">
              {errors.mobile.message}
            </div>
          )}
          <div className="d-flex justify-content-between align-items-center p-2">
            <label className="form-label">Email</label>
          </div>
          <input
            type="email"
            className="form-control mb-3"
            placeholder="Enter your email id"
            {...register("email")}
          />
          {errors.email && (
            <div className="alert alert-danger" role="alert">
              {errors.email.message}
            </div>
          )}
          <div className="d-flex justify-content-between align-items-center p-2">
            <label className="form-label">Enter you photo</label>
          </div>
          <input
            className="form-control mb-3"
            type="file"
            {...register("photo")}
          />
          <div className="d-flex justify-content-between align-items-center p-2">
            <label className="form-label">Let's know more about you...</label>
          </div>
          <textarea
            className="form-control mb-3"
            type="file"
            {...register("details")}
          ></textarea>
          <div className="d-flex justify-content-between align-items-center p-2">
            <label className="form-label">
              You can select your adress from below. Your location will be a
              great help for us to suggest best foods for you
            </label>
          </div>
          <div className="container-fluid">
            <div className="row row-cols-2">
              <div className="col-6">
                <select
                  className="form-select mb-3"
                  {...register("dist_name")}
                  onChange={(e) => {
                    findSubDistricts(e)
                  }}
                >
                  <option value="" hidden>
                    select district
                  </option>
                  {districts.map((district) => {
                    return (
                      <option
                        value={district.dist_name}
                        key={district.dist_name}
                      >
                        {district.dist_name}
                      </option>
                    )
                  })}
                </select>
              </div>
              <div className="col-6">
                <select
                  className="form-select mb-3"
                  {...register("sub_dist_id")}
                >
                  <option value="" hidden>
                    select sub-district
                  </option>
                  {subdistricts.map((subdistrict) => {
                    return (
                      <option
                        value={subdistrict.sub_dist_id}
                        key={subdistrict.sub_dist_id}
                      >
                        {subdistrict.sub_dist_name}
                      </option>
                    )
                  })}
                </select>
              </div>
            </div>
          </div>
          <div className="container-fluid d-flex justify-content-center mt-3">
            <button
              type="submit"
              className="btn btn-primary"
              disabled={isSubmitting}
            >
              Submit
            </button>
          </div>
        </form>
        {isSubmitting && <div>Loading....</div>}
      </div>
    </>
  )
}

export default CustomerRegister
