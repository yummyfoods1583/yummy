import React, { useEffect, useState } from "react"
import YummyDataFetch from "../../Api/YummyDataFetch"
import { text } from "@fortawesome/fontawesome-svg-core"
import { useForm } from "react-hook-form"

const Place_order = ({ cart }) => {
  const [districts, setDistricts] = useState([])
  const [subdistricts, setSubdistricts] = useState([])
  const [currentSubdistrict, setCurrentSubdistrict] = useState(null)
  const fetchDistricts = async () => {
    try {
      const response = await YummyDataFetch.get("/districts")
      setDistricts(response.data.data.districts)
    } catch (error) {}
  }
  const fetchSubdistricts = async (dist_name) => {
    try {
      const response = await YummyDataFetch.get(`/subdistricts/${dist_name}`)
      setSubdistricts(response.data.data.subdistricts)
    } catch (error) {}
  }
  useEffect(() => {
    fetchDistricts()
  }, [])
  const {
    register,
    handleSubmit,
    watch,
    formState: { errors },
  } = useForm()
  const onSubmit = async (data) => {
    try {
      const response = await YummyDataFetch.post("/place_order", {
        order_id: cart.cart_id,
        delivery_method: data.delivery_method,
        sub_dist_id: data.sub_dist_id,
        proposed_delivery_time: data.proposed_delivery_time
          ? new Date(data.proposed_delivery_time).toISOString()
          : new Date().toISOString(),

        detailed_address: data.detailed_address,
      })

      alert("Your Order Is Placed Successfully")
    } catch (error) {
      // Log full error for debugging
      console.error("Order placement error:", error)

      // Check if server responded with an error message
      if (
        error.response &&
        error.response.data &&
        error.response.data.message
      ) {
        alert(`Error: ${error.response.data.message}`)
      } else if (error.request) {
        // Request was made but no response received
        alert("No response from server. Please try again later.")
      } else {
        // Something else happened
        alert("An unexpected error occurred.")
      }
    }
  }

  return (
    <>
      <form onSubmit={handleSubmit(onSubmit)}>
        <div
          class="modal fade"
          id={`order${cart.cart_id}`}
          tabindex="-1"
          aria-labelledby="exampleModalLabel"
          aria-hidden="true"
        >
          <div class="modal-dialog modal-dialog-centered modal-dialog-scrollable modal-lg">
            <div class="modal-content">
              <div class="modal-header">
                <h1 class="modal-title fs-5" id="exampleModalLabel">
                  Place your order...
                </h1>
                <button
                  type="button"
                  class="btn-close"
                  data-bs-dismiss="modal"
                  aria-label="Close"
                ></button>
              </div>
              <div class="modal-body">
                <div className="container-fluid">
                  <div className="row">
                    <div className="col-6">
                      <label className="form-label">
                        Select Your Current District*:
                      </label>
                      <select
                        className="form-select"
                        onChange={(x) => {
                          fetchSubdistricts(x.target.value)
                          setCurrentSubdistrict(null)
                        }}
                      >
                        <option value="" hidden>
                          District
                        </option>
                        {districts.map((x) => {
                          return (
                            <option value={x.dist_name} key={x.dist_name}>
                              {x.dist_name}
                            </option>
                          )
                        })}
                      </select>
                    </div>
                    <div className="col-6">
                      <label className="form-label">
                        Select Your Current Sub-District*:
                      </label>
                      <select
                        className="form-select"
                        {...register("sub_dist_id", {
                          onChange: (x) => {
                            setCurrentSubdistrict(x.target.value)
                          },
                        })}
                      >
                        <option value="" hidden>
                          Sub District
                        </option>
                        {subdistricts.map((x) => {
                          return (
                            <option value={x.sub_dist_id} key={x.sub_dist_id}>
                              {x.sub_dist_name}
                            </option>
                          )
                        })}
                      </select>
                    </div>
                  </div>
                </div>
                {currentSubdistrict &&
                  currentSubdistrict !== cart.sub_dist_id && (
                    <div className="container text-danger">
                      Our system allows for food delivery only when both the
                      customer and restaurant are in same subdistrict...
                    </div>
                  )}
                <div className="container my-3">
                  <label className="form-label">
                    Choose Your Order Receiving Metod*:
                  </label>
                  <select
                    className="form-select"
                    disabled={!currentSubdistrict}
                    {...register("delivery_method")}
                  >
                    <option value="PICKUP">Pick From Restaurant</option>
                    <option
                      value="HOME-DELIVERY"
                      disabled={
                        currentSubdistrict &&
                        currentSubdistrict !== cart.sub_dist_id
                      }
                    >
                      Home Delivery
                    </option>
                  </select>
                </div>
                <div className="container my-3">
                  <label className="form-label">
                    Provide your detailed address*:
                  </label>
                  <input
                    type="text"
                    className="form-control"
                    placeholder="Please provide a valid address"
                    disabled={!currentSubdistrict}
                    {...register("detailed_address")}
                  ></input>
                </div>
                <div className="container my-3">
                  <label className="form-label">
                    Proposed Delivery Time:(Your proposed time should be atleast
                    30 min from order placement time)
                  </label>
                  <input
                    type="datetime-local"
                    className="form-control"
                    disabled={!currentSubdistrict}
                    {...register("proposed_delivery_time")}
                  />
                </div>
              </div>
              <div class="modal-footer">
                <button
                  type="submit"
                  class="btn btn-success"
                  disabled={!currentSubdistrict || !watch("detailed_address")}
                >
                  Place Order
                </button>
              </div>
            </div>
          </div>
        </div>
      </form>
    </>
  )
}

export default Place_order
