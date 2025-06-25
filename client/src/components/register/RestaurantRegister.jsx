import { faCircleInfo } from "@fortawesome/free-solid-svg-icons"
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import { Tooltip } from "bootstrap"
import React, { useState } from "react"
import { useEffect, useContext } from "react"
import { YummyContext } from "../../contexts/YummyContextProvider"
import YummyDataFetch from "../../Api/YummyDataFetch"
import { useForm, useWatch } from "react-hook-form"
import ImageFinder from "../../Api/ImageFinder"

const RestaurantRegister = () => {
  /***********Variables************/

  //raw useState for manual location input---
  const [manualInput, setManualInput] = useState(false)

  //react-hook-form variables
  const {
    register,
    handleSubmit,
    setError,
    setValue,
    control,
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
    //cancel submission if there is no valid address
    if (
      (!data.dist_name && !data.dist_name2) ||
      (!data.sub_dist_id && !data.sub_dist_name2)
    ) {
      setError("dist_name2", {
        type: "manual",
        message: "Please choose a valid address",
      })
      return // stop submission
    }

    //cancel submission on invalid email id
    const emailPattern = /^[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,}$/
    if (data.email && !emailPattern.test(data.email)) {
      setError("email", {
        type: "manual",
        message: "Please insert a valid email...",
      })
      return
    }

    //proceed submission

    //first try to upload the image and get the url---
    let photo_url = null
    if (data.photo.length) {
      try {
        const sendData = new FormData()
        sendData.append("file", data.photo[0])
        sendData.append("upload_preset", "Yummy-Image-Cloud")
        sendData.append("folder", "Restaurant_Photos")
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

    const opening_time = `2000-01-01 ${String(data.opening_hour).padStart(
      2,
      "0"
    )}:${String(data.opening_minute).padStart(2, "0")}:00`
    const closing_time = `2000-01-01 ${String(data.closing_hour).padStart(
      2,
      "0"
    )}:${String(data.closing_minute).padStart(2, "0")}:00`

    let closeUntil = null
    if (data.close_until) {
      const d = new Date(data.close_until)
      // Format to 'YYYY-MM-DD HH:mm:ss'
      closeUntil = `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(
        2,
        "0"
      )}-${String(d.getDate()).padStart(2, "0")} ${String(
        d.getHours()
      ).padStart(2, "0")}:${String(d.getMinutes()).padStart(2, "0")}:${String(
        d.getSeconds()
      ).padStart(2, "0")}`
    }

    const request = {
      user_type: "RES",
      user_id: data.user_id,
      password: data.password,
      name: data.name,
      mobile: data.mobile,
      email: data.email || null,
      photo_url: photo_url,
      details: data.details || null,
      dist_name: manualInput ? data.dist_name2 : data.dist_name,
      sub_dist_id: manualInput ? -1 : data.sub_dist_id,
      sub_dist_name: manualInput ? data.sub_dist_name2 : null,
      payment_method: data.payment_method,
      detailed_address: data.detailed_address,
      opening_time: opening_time,
      closing_time: closing_time,
      close_until: closeUntil,
      rating: 0,
      manager_name:"TOKY",
    }

    console.log(request)
    try {
      const response = await YummyDataFetch.post(`/restaurant`, request)
      if (response.data.data_length == 0) {
        alert("Username Aready Exists Please Choose Another Usrename")
      } else {
        localStorage.setItem(
          "user",
          JSON.stringify({
            user_id: request.user_id,
            user_type: "RES",
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

  //track dropdown selections...
  return (
    <>
      <div className="conatiner-fluid mt-3">
        <div className="container d-flex justify-content-center">
          <h2>Restaurant Registration</h2>
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
            <label className="form-label">Enter Restaurant name*</label>
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
            <label className="form-label">Enter Restauant Photo</label>
          </div>
          <input
            className="form-control mb-3"
            type="file"
            {...register("photo")}
          />
          <div className="d-flex justify-content-between align-items-center p-2">
            <label className="form-label">
              Put more information about the restaurant...
            </label>
          </div>
          <textarea
            className="form-control mb-3"
            type="file"
            {...register("details")}
          ></textarea>
          <div className="d-flex justify-content-between align-items-center p-2">
            <label className="form-label">
              Please select restaurant location from below. If your location is
              not present in the list then manually type it below it....
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
                  disabled={manualInput}
                >
                  <option value="" hidden>
                    select district*
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
                  disabled={manualInput}
                >
                  <option value="" hidden>
                    select sub-district*
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
            {errors.curr_sub_dist_id && (
              <div className="alert alert-danger" role="alert">
                {errors.sub_dist_id.message}
              </div>
            )}
            {/*toggle button between manual and dropdown input */}
            <div className="text-center mb-3">
              <button
                type="button"
                className="btn btn-secondary"
                onClick={() => {
                  setManualInput((prev) => !prev)
                  setValue("dist_name", null)
                  setValue("sub_dist_id", null)
                  setValue("dist_name2", null)
                  setValue("sub_dist_name2", null)
                  setSubDistricts([])
                }}
              >
                {manualInput
                  ? "Use Dropdown Instead"
                  : "Manually Input Location"}
              </button>
            </div>
            {/* Manual Input Fields */}
            <div className="row row-cols-2">
              <div className="col-6">
                <input
                  type="text"
                  className="form-control mb-3"
                  placeholder="Manually enter district"
                  {...register("dist_name2")}
                  disabled={!manualInput}
                />
              </div>
              <div className="col-6">
                <input
                  type="text"
                  className="form-control mb-3"
                  placeholder="Manually enter sub-district"
                  {...register("sub_dist_name2")}
                  disabled={!manualInput}
                />
              </div>
            </div>
            {errors.dist_name2 && (
              <div className="alert alert-danger" role="alert">
                {errors.dist_name2.message}
              </div>
            )}
          </div>
          <div className="conatiner-fluid mt-3">
            <label className="form-label">Enter the detailed address*</label>
            <input
              type="text"
              className="form-control mb-3"
              {...register("detailed_address", {
                required: {
                  value: true,
                  message: "Please enter the detailed address",
                },
              })}
            />
            {errors.detailed_address && (
              <div className="alert alert-danger" role="alert">
                {errors.detailed_address.message}
              </div>
            )}
          </div>
          <div className="conatiner-fluid">
            <div className="row">
              <div className="col-6">
                <div>
                  <label className="form-label">Payment Method*</label>
                  <select
                    className="form-select mb-3"
                    {...register("payment_method", {
                      required: {
                        value: true,
                        message: "Please select the payment method",
                      },
                    })}
                  >
                    <option value="" hidden>
                      Select the payment method
                    </option>
                    <option value="COD">Cash on delivery</option>
                    <option value="ONLINE">Online</option>
                    <option value="BOTH">Both</option>
                  </select>
                  {errors.payment_method && (
                    <div className="alert alert-danger" role="alert">
                      {errors.payment_method.message}
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
          {/*Opening time----*/}
          <div className="container-fluid mt-3">
            <label className="form-label">Daily Opening Time*</label>
            <div className="row row-cols-2">
              <div className="col-6">
                <input
                  type="text"
                  className="form-control mb-3"
                  placeholder="Hour (0–23)"
                  {...register("opening_hour", {
                    required: "Please enter opening hour",
                    pattern: {
                      value: /^(0?[0-9]|1[0-9]|2[0-3])$/,
                      message: "Hour must be between 0 and 23",
                    },
                  })}
                />
                {errors.opening_hour && (
                  <div className="alert alert-danger" role="alert">
                    {errors.opening_hour.message}
                  </div>
                )}
              </div>
              <div className="col-6">
                <input
                  type="text"
                  className="form-control mb-3"
                  placeholder="Minute (0–59)"
                  {...register("opening_minute", {
                    required: "Please enter opening minute",
                    pattern: {
                      value: /^[0-5]?[0-9]$/,
                      message: "Minute must be between 0 and 59",
                    },
                  })}
                />
                {errors.opening_minute && (
                  <div className="alert alert-danger" role="alert">
                    {errors.opening_minute.message}
                  </div>
                )}
              </div>
            </div>
          </div>
          {/*Closing time----*/}
          <div className="container-fluid mt-3">
            <label className="form-label">Daily Closing Time*</label>
            <div className="row row-cols-2">
              <div className="col-6">
                <input
                  type="text"
                  className="form-control mb-3"
                  placeholder="Hour (0–23)"
                  {...register("closing_hour", {
                    required: "Please enter closing hour",
                    pattern: {
                      value: /^(0?[0-9]|1[0-9]|2[0-3])$/,
                      message: "Hour must be between 0 and 23",
                    },
                  })}
                />
                {errors.closing_hour && (
                  <div className="alert alert-danger" role="alert">
                    {errors.closing_hour.message}
                  </div>
                )}
              </div>
              <div className="col-6">
                <input
                  type="text"
                  className="form-control mb-3"
                  placeholder="Minute (0-59)"
                  {...register("closing_minute", {
                    required: "Please enter closing minute",
                    pattern: {
                      value: /^[0-5]?[0-9]$/,
                      message: "Minute must be between 0 and 59",
                    },
                  })}
                />
                {errors.closing_minute && (
                  <div className="alert alert-danger" role="alert">
                    {errors.closing_minute.message}
                  </div>
                )}
              </div>
            </div>
          </div>
          <div className="conatiner-fluid mt-3">
            <label className="form-label">Closed Until (optional)</label>
            <input
              type="datetime-local"
              className="form-control mb-3"
              {...register("close_until")}
            />
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

export default RestaurantRegister
