import React, { useEffect, useState } from "react"
import YummyDataFetch from "../../Api/YummyDataFetch"
import { useForm } from "react-hook-form"
import { useNavigate } from "react-router-dom"
const Add_to_cart = ({ dish }) => {
  const [dish_sub_category, setDish_sub_category] = useState([])
  const [totalPrice, setTotalPrice] = useState(0)
  const navigate = useNavigate()

  const fetchDish_sub_category = async () => {
    try {
      const response = await YummyDataFetch.get(
        `/dish_sub_category/${dish.dish_id}`
      )
      setDish_sub_category(response.data.data.dish_sub_category)
      console.log(response.data.data.dish_sub_category)
    } catch (error) {
      if (error.response) {
        alert("Response Error: " + error.response.data)
        alert("Response Error Status: " + error.response.status)
      } else if (error.request) {
        alert("No response recieved: " + error.request)
      } else {
        alert("Axios error: " + error.message)
      }
    }
  }

  useEffect(() => {
    const modalId = `add_to_cart_modal_${dish.dish_id}`
    const modal = document.getElementById(modalId)

    // Only add listener if modal exists and hasn't been loaded yet
    if (modal && dish_sub_category.length === 0) {
      const handleModalShow = () => {
        fetchDish_sub_category()
      }

      modal.addEventListener("shown.bs.modal", handleModalShow)

      return () => {
        modal.removeEventListener("shown.bs.modal", handleModalShow)
      }
    }
  }, [dish.dish_id, dish_sub_category.length])

  //form control
  const {
    register,
    handleSubmit,
    watch,
    formState: { errors },
  } = useForm()
  const onSubmit = async (data) => {
    //first try to check whether a cart of the user already exists for the same restaurant\
    let cart_id
    let response = await YummyDataFetch.get(
      `/cart_check/${JSON.parse(localStorage.getItem("yummy_user")).user_id}/${
        dish.rest_id
      }`
    )
    //if the cart doesn't exist then a new cart will be created. Before creation ask for confirmation
    if (!response.data.data_length) {
      const proceed = confirm(
        "A new cart will be created and previously existing cart will be deleted. Are you sure you want to continue?...."
      )
      if (!proceed) return
      response = await YummyDataFetch.post("/cart", {
        customer_id: JSON.parse(localStorage.getItem("yummy_user")).user_id,
        rest_id: dish.rest_id,
      })
      //store the returned cart id
      cart_id = response.data.data.cart[0].cart_id
    } else {
      cart_id = response.data.data.cart[0].cart_id
    }

    //now send all the selected sub categories one by one as a cart_item
    for (let x of dish_sub_category) {
      const check = `check${x.sub_cat_id}`
      const quantity = `quantity${x.sub_cat_id}`
      const order_specification = `order_specification${x.sub_cat_id}`

      if (data[check]) {
        const reqbody = {
          sub_cat_id: x.sub_cat_id,
          cart_id: cart_id,
          quantity: data[quantity],
          order_specification: data[order_specification] || null,
        } //create the request body
        response = await YummyDataFetch.post("/cart_item", reqbody)
        console.log(response.data.data.cart_item)
      }
    }
  }

  //handling total price
  const [quantities, setQuantities] = useState({})

  const handleQuantityChange = (subCatId, value) => {
    const numericValue = Number(value) || 0
    // console.log(numericValue)
    // Update quantities state
    let newQuantities = {
      ...quantities,
      [subCatId]: numericValue,
    }
    setQuantities((prev) => {
      console.log(newQuantities) // This will show the updated value
      return newQuantities
    })
    // Calculate total price
    let total = 0
    dish_sub_category.forEach((item) => {
      const qty = newQuantities[item.sub_cat_id] || 0
      total += qty * item.price
    })

    setTotalPrice(total * (1 - dish.discount))
  }
  return (
    <>
      <form
        class="modal fade"
        id={`add_to_cart_modal_${dish.dish_id}`}
        tabindex="-1"
        aria-labelledby="exampleModalLabel"
        aria-hidden="true"
        onSubmit={handleSubmit(onSubmit)}
      >
        <div class="modal-dialog modal-dialog-centered modal-dialog-scrollable">
          <div class="modal-content">
            <div class="modal-header">
              <h1 class="modal-title fs-5" id="exampleModalLabel">
                {dish.dish_name}
              </h1>
              <button
                type="button"
                class="btn-close"
                data-bs-dismiss="modal"
                aria-label="Close"
              ></button>
            </div>
            <div class="modal-body">
              {/*dish sub categories */}

              {dish_sub_category.map((x) => {
                return (
                  <div class="form-check form-switch my-3" key={x.sub_cat_id}>
                    <input
                      className="form-check-input"
                      type="checkbox"
                      {...register(`check${x.sub_cat_id}`)}
                    />
                    <label
                      className="form-check-label d-flex justify-content-between row"
                      for="switchCheckDefault"
                    >
                      <span className="fw-bold text-primary col-6">
                        {x.sub_cat_name}
                      </span>
                      <span className="col-2">{x.price} TK</span>
                      <input
                        type="number"
                        min={0}
                        className="form-control-sm col-3"
                        {...register(`quantity${x.sub_cat_id}`, {
                          valueAsNumber: true, // Ensures value is treated as number
                          onChange: (e) =>
                            handleQuantityChange(x.sub_cat_id, e.target.value),
                        })}
                        disabled={!watch(`check${x.sub_cat_id}`)}
                        defaultValue={0}
                      />
                      <input
                        type="text"
                        className="form-text my-3"
                        placeholder="Order specification"
                        {...register(`order_specification${x.sub_cat_id}`)}
                        disabled={!watch(`check${x.sub_cat_id}`)}
                      />
                    </label>
                  </div>
                )
              })}

              {/*dish sub categories */}
              <div className="fw-bold d-flex justify-content-between">
                <span>Discount</span>
                <span>{dish.discount * 100}%</span>
              </div>
              <div className="fw-bold d-flex justify-content-between">
                <span>Total Price</span>
                <span>{totalPrice} TK</span>
              </div>
            </div>
            <div class="modal-footer">
              <button
                type="button"
                class="btn btn-secondary"
                data-bs-dismiss="modal"
              >
                Close
              </button>
              <button type="submit" class="btn btn-danger">
                Confirm
              </button>
            </div>
          </div>
        </div>
      </form>
    </>
  )
}

export default Add_to_cart
