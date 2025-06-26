import React, { useContext, useEffect, useState } from "react"
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import { faMagnifyingGlass } from "@fortawesome/free-solid-svg-icons"
import Navbar from "../components/Navbar"
import YummyDataFetch from "../Api/YummyDataFetch"
import { useForm } from "react-hook-form"
import Dish_card from "../components/Dish_card"
import { YummyContext } from "../contexts/YummyContextProvider"

//if we are in a particular restaurant then we willpass the curr_restaurant
const Dishes = ({ restaurant }) => {
  {
    /*variables */
  }
  // const [restaurant, setRestaurant] = useState(restaurant)
  const [dishes, setDishes] = useState([])
  const [districts, setDistricts] = useState([])
  const [subdistricts, setSubdistricts] = useState([])
  const [categories, setCategories] = useState([])
  const { current_dish } = useContext(YummyContext)
  const {
    register,
    handleSubmit,
    watch,
    formState: { errors },
    setValue,
  } = useForm()

  // fetch all the districts
  useEffect(() => {
    const fetchDistricts = async () => {
      const response = await YummyDataFetch.get("/districts")
      setDistricts(response.data.data.districts)
    }
    fetchDistricts()
    fetchDishes()
    fetchSubdistricts()
    fetchCategories()
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

  //fetch all the categories
  const fetchCategories = async () => {
    const response = await YummyDataFetch.get("/categories")
    // console.log(response.data.data.categories)
    setCategories(response.data.data.categories)
  }

  //fetch all the dishes based on query selection
  const fetchDishes = async () => {
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
      params.push("dish_name")
      values.push(data.dish_name.toLowerCase())
    }
    params.push("rating_order")
    values.push(data.rating_order)
    params.push("available")
    values.push(data.available)

    if (data.category_name != "") {
      params.push("category_name")
      values.push(data.category_name)
    }
    if (restaurant) {
      params.push("rest_id")
      values.push(restaurant.rest_id)
    }
    //now create the address for get request
    let url = "/dishes?"
    for (let i = 0; i < params.length; i++) {
      url += params[i] + "=" + values[i] + "&"
    }
    console.log(restaurant)
    //now create the get request
    try {
      const response = await YummyDataFetch.get(url)
      console.log(response.data.data)
      setDishes(response.data.data.dishes)
    } catch (error) {
      if (error.response) {
        alert("Response error data: " + error.response.data)
        alert("Response error status: " + error.response.status)
      } else if (error.request) {
        alert("No response recieved: " + error.request)
      } else {
        alert("Axios error: " + error.message)
      }
    }
  }

  //fetch subdistricts whenever there is a change of dist_name
  const dist_name = watch("dist_name")

  useEffect(() => {
    setValue("sub_dist_id", "")
    fetchSubdistricts()
  }, [dist_name])

  //handleSubmit
  const onSubmit = async (data) => {
    fetchDishes()
  }

  return (
    <>
      {/*don't display the navbar when we are in a particular restaurant*/}
      {!restaurant && <Navbar />}

      <div className="container-fluid my-3">
        <form
          onSubmit={handleSubmit(onSubmit)}
          onChange={(e) => {
            fetchDishes()
          }}
        >
          <div className="row">
            {/*district --disabled if there is restaurant*/}
            <div className="col-5">
              <label className="form-label">Select a district</label>
              <select
                disabled={restaurant}
                className="form-select"
                {...register("dist_name")}
              >
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

            {/*subdistrict -- disabled if there is a restaurant*/}
            <div className="col-5">
              <label className="form-label">Select a sub district</label>
              <select
                disabled={restaurant}
                className="form-select"
                {...register("sub_dist_id")}
              >
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
                          fetchDishes()
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
                          fetchDishes()
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
              <label className="form-label">Search a particlar dish</label>
              <div className="d-flex justify-content-between gap-3">
                <input
                  type="text"
                  className="form-control"
                  placeholder="Type the dish name"
                  {...register("dish_name")}
                  defaultValue={current_dish ? current_dish.dish_name : ""}
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

          <div className="row mt-4 d-flex align-items-center">
            {/*categories */}
            <div className="col-5">
              <label className="form-label">Search by categories</label>
              <select className="form-select" {...register("category_name")}>
                <option value="" hidden>
                  Any
                </option>
                {categories.map((category_name) => {
                  return (
                    <option value={category_name} id={category_name}>
                      {category_name}
                    </option>
                  )
                })}
              </select>
            </div>
            {/*categories */}

            {/*available checkbox */}
            <div className="col-2">
              <input
                type="checkbox"
                className="form-check-input mx-2"
                {...register("available")}
              />
              <label className="form-label">Only Availables</label>
            </div>
          </div>
          {/*available checkbox */}
        </form>
      </div>
      <div className="container-fluid p-2">
        <div className="row d-flex justify-content-evenly">
          {dishes.map((dish) => {
            return (
              <div
                className="col-4 d-flex justify-content-center mb-4"
                key={dish.dish_id}
              >
                <Dish_card dish={dish} restaurant={restaurant} />
              </div>
            )
          })}
        </div>
      </div>
    </>
  )
}

export default Dishes
