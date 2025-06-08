import React, { useContext, useEffect, useState } from "react"
import Restaurant_Card from "../components/Restaurant_Card"
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import { faMagnifyingGlass } from "@fortawesome/free-solid-svg-icons"
import Navbar from "../components/Navbar"
import YummyDataFetch from "../Api/YummyDataFetch"
import { useForm } from "react-hook-form"
import { useParams } from "react-router-dom"
import { YummyContext } from "../contexts/YummyContextProvider"

const Restaurants = () => {
  {
    /*variables */
  }
  const [restaurants, setRestaurants] = useState([])
  const [districts, setDistricts] = useState([])
  const [subdistricts, setSubdistricts] = useState([])
  const {
    register,
    handleSubmit,
    watch,
    formState: { errors },
    setValue,
  } = useForm()

  //fetch Current district
  const { currentDistrict, setCurrentDistrict } = useContext(YummyContext)

  // fetch all the districts
  // const params = useParams()
  useEffect(() => {
    const fetchDistricts = async () => {
      const response = await YummyDataFetch.get("/districts")
      setDistricts(response.data.data.districts)
    }
    fetchDistricts()
    fetchRestaurants()
    fetchSubdistricts()
  }, [])

  //fetch subdistricts under corresponding districts
  const fetchSubdistricts = async () => {
    const data = watch()
    if (data.dist_name !== "") {
      const response = await YummyDataFetch.get(
        `/subdistricts/${data.dist_name}`
      )
      setSubdistricts(response.data.data.subdistricts)
    }
  }

  //fetch all the restaurants based on query selection
  const fetchRestaurants = async () => {
    const data = watch()
    const params = [],
      values = []
    if (data.dist_name !== "") {
      params.push("dist_name")
      values.push(data.dist_name)
    }
    if (data.sub_dist_id !== "") {
      params.push("sub_dist_id")
      values.push(data.sub_dist_id)
    }
    if (data.rating_max !== "") {
      params.push("rating_max")
      values.push(data.rating_max)
    }
    if (data.rating_min !== "") {
      params.push("rating_min")
      values.push(data.rating_min)
    }
    if (data.name !== "") {
      params.push("name")
      values.push(data.name.toLowerCase())
    }
    params.push("rating_order")
    values.push(data.rating_order)

    //now create the address for get request
    let url = "/restaurants?"
    for (let i = 0; i < params.length; i++) {
      url += params[i] + "=" + values[i] + "&"
    }

    //now create the get request
    const response = await YummyDataFetch.get(url)
    setRestaurants(response.data.data.restaurants)
  }

  //fetch subdistricts whenever there is a change of dist_name
  const dist_name = watch("dist_name")

  useEffect(() => {
    setValue("sub_dist_id", "")
    fetchSubdistricts()
  }, [dist_name])

  useEffect(() => {
    setValue("dist_name", currentDistrict)
    fetchRestaurants()
  }, [districts])

  //handleSubmit
  const onSubmit = async (data) => {
    fetchRestaurants()
  }

  return (
    <>
      <Navbar />
      <div className="container-fluid my-3">
        <form
          onSubmit={handleSubmit(onSubmit)}
          onChange={(e) => {
            fetchRestaurants()
          }}
        >
          <div className="row">
            {/*district*/}
            <div className="col-5">
              <label className="form-label">Select a district</label>
              <select className="form-select" {...register("dist_name")}>
                <option value="">Any</option>
                {districts.map((district) => {
                  return (
                    <option value={district.dist_name} key={district.dist_name}>
                      {district.dist_name}
                    </option>
                  )
                })}
              </select>
            </div>
            {/*district*/}

            {/*subdistrict*/}
            <div className="col-5">
              <label className="form-label">Select a sub district</label>
              <select className="form-select" {...register("sub_dist_id")}>
                <option value="">Any</option>
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
            {/*subdistrict*/}

            {/*sorting radios*/}
            <div className="col-2">
              <label className="form-label">Sort by ratings</label>
              <div className="form-check">
                <input
                  className="form-check-input"
                  type="radio"
                  name="sort_radio"
                  value="DESC"
                  defaultChecked
                  {...register("rating_order")}
                />
                <label className="form-check-label">Descending</label>
              </div>
              <div className="form-check">
                <input
                  className="form-check-input"
                  type="radio"
                  name="sort_radio"
                  value="ASC"
                  {...register("rating_order")}
                />
                <label className="form-check-label">Ascending</label>
              </div>
            </div>
            {/*sorting radios*/}

            {/*rating range*/}
            <div className="col-5">
              <label className="form-label">Select a rating range</label>
              <div className="row">
                <div className="col-5">
                  <input
                    type="text"
                    inputMode="decimal"
                    className="form-control"
                    {...register("rating_min")}
                    onInput={(e) => {
                      const value = e.target.value

                      // Allow: empty, number with optional decimal point
                      if (/^\d*\.?\d*$/.test(value)) {
                        const num = parseFloat(value)
                        if (value === "" || (num >= 0 && num <= 5)) {
                          // Valid input, proceed
                          fetchRestaurants()
                        } else {
                          // Out of range: prevent update
                          e.target.value = value.slice(0, -1)
                        }
                      } else {
                        // Invalid character: remove last typed char
                        e.target.value = value.slice(0, -1)
                      }
                    }}
                  />
                </div>
                <div className="col-2 d-flex justify-content-center">
                  <span>to</span>
                </div>
                <div className="col-5">
                  <input
                    type="text"
                    inputMode="decimal"
                    className="form-control"
                    {...register("rating_max")}
                    onInput={(e) => {
                      const value = e.target.value

                      // Allow: empty, number with optional decimal point
                      if (/^\d*\.?\d*$/.test(value)) {
                        const num = parseFloat(value)
                        if (value === "" || (num >= 0 && num <= 5)) {
                          // Valid input, proceed
                          fetchRestaurants()
                        } else {
                          // Out of range: prevent update
                          e.target.value = value.slice(0, -1)
                        }
                      } else {
                        // Invalid character: remove last typed char
                        e.target.value = value.slice(0, -1)
                      }
                    }}
                  />
                </div>
              </div>
            </div>
            {/*rating range*/}

            {/*search by name*/}
            <div className="col-7">
              <label className="form-label">
                Search a particlar restaurant
              </label>
              <div className="d-flex justify-content-between gap-3">
                <input
                  type="text"
                  className="form-control"
                  placeholder="Type the restaurant name"
                  {...register("name")}
                />
                <button className="btn btn-outline-light" type="submit">
                  <FontAwesomeIcon
                    icon={faMagnifyingGlass}
                    style={{ color: "#000000" }}
                  />
                </button>
              </div>
            </div>
          </div>
          {/*search by name*/}
        </form>
      </div>
      <div className="container-fluid p-2">
        <div className="row d-flex justify-content-evenly">
          {restaurants.map((restaurant) => {
            return (
              <div
                className="col-4 d-flex justify-content-center mb-4"
                key={restaurant.rest_id}
              >
                <Restaurant_Card restaurant={restaurant} />
              </div>
            )
          })}
        </div>
      </div>
    </>
  )
}

export default Restaurants
