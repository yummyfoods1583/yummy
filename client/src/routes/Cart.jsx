import React, { useEffect, useState } from "react"
import Navbar from "../components/Navbar"

import YummyDataFetch from "../Api/YummyDataFetch"
import { Link } from "react-router-dom"
import Place_order from "../components/Modal/Place_order"

const Cart = () => {
  const [cart, setCart] = useState(null)
  const [cart_item, setCart_item] = useState([])
  const [totalPrice, setTotalPrice] = useState(0)
  //check whether there is a cart or not
  const fetchCart = async () => {
    const response = await YummyDataFetch.get(
      `/cart/${JSON.parse(localStorage.getItem("yummy_user")).user_id}`
    )
    setCart(response.data.data.cart[0])
  }
  useEffect(() => {
    fetchCart()
  }, [])

  //if a cart is available then fetch all its items
  let fetchCart_item
  if (cart) {
    fetchCart_item = async () => {
      const response = await YummyDataFetch.get(`/cart_item/${cart.cart_id}`)
      setCart_item(response.data.data.cart_item)

      //set the total price
      let price = 0
      for (let x of response.data.data.cart_item) {
        price += x.price * x.quantity * (1 - x.discount)
      }
      setTotalPrice(price)
    }
    fetchCart_item()
  }
  return (
    <>
      <Navbar />
      {!cart && (
        <>
          <h1>No cart is available. Please order something to create a cart</h1>
        </>
      )}
      {cart && (
        <>
          <div className="container-fluid text-center">
            <h1>Cart</h1>
          </div>
          <div className="container-fluid d-flex justify-content-between align-items-center row">
            <div className="conatiner col-8">
              <p>
                Cart id: <span className="fw-bold">{cart.cart_id}</span>
              </p>
              <p>
                Customer id: <span className="fw-bold">{cart.customer_id}</span>
              </p>
              <p>
                Restaurant name:{" "}
                <Link to={`/restaurant/${cart.rest_id}`} className="fw-bold">
                  {cart.name}
                </Link>
              </p>
              <p>
                Cart opening time:{" "}
                <span className="fw-bold">
                  {new Date(cart.create_time).toLocaleDateString("en-US", {
                    year: "numeric",
                    month: "short",
                    day: "numeric",
                    hour: "2-digit",
                    minute: "2-digit",
                  })}
                </span>
              </p>
              <p>
                Total price of the cart:
                <span className="fw-bold">{totalPrice} TK</span>
              </p>
            </div>
            <div className="container col-2">
              <button
                className="btn btn-success"
                data-bs-toggle="modal"
                data-bs-target={`#order${cart.cart_id}`}
                disabled={cart_item.length === 0}
              >
                Place Order
              </button>
              <Place_order cart={cart} />
            </div>
            <div className="container col-2">
              <button
                className="btn btn-danger"
                onClick={(e) => {
                  YummyDataFetch.delete(`/cart/${cart.cart_id}`)
                  setCart(null)
                }}
              >
                Delete Cart
              </button>
            </div>
          </div>
          <div className="conatainer-fluid">
            <h3 className="text-center text-primary">Cart Items</h3>
            <div className="container-fluid my-5">
              <table className="table table-responsive table-primary text-center">
                <thead>
                  <tr>
                    <th scope="col">Dish name</th>
                    <th scope="col">Sub Category</th>
                    <th scope="col">Quantity</th>
                    <th scope="col">Discount</th>
                    <th scope="col">Price with discount</th>
                    <th scope="col">order specification</th>
                    <th scope="col"></th>
                  </tr>
                </thead>
                <tbody>
                  {cart_item.map((x) => {
                    return (
                      <tr>
                        <td scope="col">{x.dish_name}</td>
                        <td scope="col">{x.sub_cat_name}</td>
                        <td scope="col">
                          <input
                            type="number"
                            defaultValue={x.quantity}
                            min={0}
                            style={{ width: "50px" }}
                            className="text-center"
                            onChange={(e) => {
                              x.quantity = e.target.value
                              YummyDataFetch.post(`/cart_item`, x)
                              fetchCart_item()
                            }}
                          />
                        </td>
                        <td scope="col">{x.discount * 100}%</td>
                        <td scope="col">
                          {x.price * x.quantity * (1 - x.discount)} TK
                        </td>
                        <td scope="col">
                          <input
                            type="text"
                            className="form-control"
                            defaultValue={x.order_specification}
                            onChange={(e) => {
                              x.order_specification = e.target.value
                              YummyDataFetch.post(`/cart_item`, x)
                              fetchCart_item()
                            }}
                          />
                        </td>
                        <td scope="col">
                          <button
                            className="btn btn-danger"
                            onClick={(e) => {
                              YummyDataFetch.delete(
                                `/cart_item/${cart.cart_id}/${x.sub_cat_id}`
                              )
                              fetchCart_item()
                            }}
                          >
                            Remove
                          </button>
                        </td>
                      </tr>
                    )
                  })}
                </tbody>
              </table>
            </div>
          </div>
        </>
      )}
    </>
  )
}

export default Cart
