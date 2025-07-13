import React, { useEffect, useState } from "react"
import Navbar from "../components/Navbar"
import YummyDataFetch from "../Api/YummyDataFetch"
import { Link } from "react-router-dom"
import Order_details from "../components/Modal/Order_details"
const Restaurant_Orders = () => {const [available_orders, setAvailable_orders] = useState([])
  const [old_orders, setOld_orders] = useState([])

  const fetchAvailable_orders = async () => {
    try {
      const response = await YummyDataFetch.get(
        `restaurant_available_orders/${
          JSON.parse(localStorage.getItem("yummy_user")).user_id
        }`
      )
      setAvailable_orders(response.data.data.orders)
      console.log(response.data.data.orders)
    } catch (error) {}
  }
  //   const fetchOld_orders = async () => {
  //     try {
  //       const response = await YummyDataFetch.get(
  //         `cusOld_orders/${
  //           JSON.parse(localStorage.getItem("yummy_user")).user_id
  //         }`
  //       )
  //       setOld_orders(response.data.data.orders)
  //     } catch (error) {}
  //   }
  useEffect(() => {
    fetchAvailable_orders()
    // fetchOld_orders()
  }, [])
  return (
    <>
      <Navbar />
      <div className="conatiner-fluid text-center">
        <h3>Available Orders</h3>
        <table className="table table-responsive table-primary text-center">
          <thead>
            <tr>
              <th scope="col">Order Id</th>
              <th scope="col">Restaurant</th>
              <th scope="col">Status</th>
              <th scope="col"></th>
              <th scope="col"></th>
            </tr>
          </thead>
          <tbody>
            {available_orders.map((x) => {
              return (
                <tr key={x.order_id}>
                  <td scope="col">{x.order_id}</td>
                  <td scope="col">
                    <Link to={`/restaurant/${x.rest_id}`}>{x.name}</Link>
                  </td>
                  <td scope="col">{x.order_status}</td>
                  <td scope="col">
                    <button
                      className="btn btn-info"
                      data-bs-toggle="modal"
                      data-bs-target={`#order_details${x.order_id}`}
                    >
                      Details
                    </button>
                    <Order_details order={x} />
                  </td>
                  <td>
                    <button className="btn btn-success">Accept</button>
                  </td>
                </tr>
              )
            })}
          </tbody>
        </table>
      </div>
      <div className="conatiner-fluid text-center">
        <h3>Old Orders</h3>
        <table className="table table-responsive table-primary text-center">
          <thead>
            <tr>
              <th scope="col">Order Id</th>
              <th scope="col">Restaurant</th>
              <th scope="col">Delivery Method</th>
              <th scope="col">Rider</th>
              <th scope="col">Status</th>
              <th scope="col"></th>
            </tr>
          </thead>
          <tbody>
            {old_orders.map((x) => {
              return (
                <tr key={x.order_id}>
                  <td scope="col">{x.order_id}</td>
                  <td scope="col">
                    <Link to={`/restaurant/${x.rest_id}`}>{x.name}</Link>
                  </td>
                  <td scope="col">{x.delivery_method}</td>
                  <td scope="col">{x.rider}</td>
                  <td scope="col">{x.order_status}</td>
                  <td scope="col">
                    <button
                      className="btn btn-info"
                      data-bs-toggle="modal"
                      data-bs-target={`#order_details${x.order_id}`}
                    >
                      Details
                    </button>
                    <Order_details order={x} />
                  </td>
                </tr>
              )
            })}
          </tbody>
        </table>
      </div>
    </>
  )
}

export default Restaurant_Orders