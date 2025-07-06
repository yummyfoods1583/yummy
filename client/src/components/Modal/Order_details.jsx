import React, { useEffect, useState } from "react"
import YummyDataFetch from "../../Api/YummyDataFetch"

const Order_details = ({ order }) => {
  const [cart_item, setCart_item] = useState([])
  const [totalPrice, setTotalPrice] = useState(0)
  /*Fetching the cart items */
  const fetchCart_item = async () => {
    try {
      const response = await YummyDataFetch.get(`/cart_item/${order.order_id}`)
      const items = response.data.data.cart_item

      setCart_item(items)

      // Calculate total price
      let price = 0
      for (let x of items) {
        price += x.price * x.quantity * (1 - x.discount)
      }
      setTotalPrice(price)
    } catch (error) {
      // Axios-specific error handling
      if (error.response) {
        // Server responded with a status code outside 2xx
        console.error("Server Error:", error.response.data)
        console.error("Status Code:", error.response.status)
        alert(
          `Error ${error.response.status}: ${
            error.response.data.message || "Failed to fetch cart items"
          }`
        )
      } else if (error.request) {
        // Request was made, but no response received
        console.error("No response received:", error.request)
        alert("No response from server. Please try again later.")
      } else {
        // Something else went wrong
        console.error("Error:", error.message)
        alert("An unexpected error occurred.")
      }

      // Optional fallback
      setCart_item([])
      setTotalPrice(0)
    }
  }

  useEffect(() => {
    fetchCart_item()
  }, [])

  return (
    <div
      class="modal fade"
      id={`order_details${order.order_id}`}
      tabindex="-1"
      aria-hidden="true"
    >
      <div class="modal-dialog modal-dialog-centered modal-dialog-scrollable">
        <div class="modal-content">
          <div class="modal-header">
            <h1 class="modal-title fs-5" id="exampleModalLabel">
              Order Details
            </h1>
            <button
              type="button"
              class="btn-close"
              data-bs-dismiss="modal"
              aria-label="Close"
            ></button>
          </div>
          <div class="modal-body">
            <p>Customer's address: {order.detailed_address}</p>
          </div>
          <div class="modal-body">
            <p>
              Proposed Delivery Time:{" "}
              {new Date(order.proposed_delivery_time).toLocaleString()}
            </p>
          </div>
          <div class="modal-body">
            <p>Payment Status: need to work</p>
          </div>
          <p>
            <span className="fw-bold">Ordered Items:</span>
          </p>
          <ul>
            {cart_item.map((x) => {
              return (
                <li key={x.sub_cat_id + x.cart_id}>
                  {x.dish_name +
                    "->" +
                    x.sub_cat_name +
                    " (" +
                    x.price * (1 - x.discount) +
                    "TK )"}
                </li>
              )
            })}
          </ul>
          <div class="modal-footer">
            <button
              type="button"
              class="btn btn-danger"
              data-bs-dismiss="modal"
            >
              Close
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Order_details
