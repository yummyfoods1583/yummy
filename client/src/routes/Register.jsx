import React, { useState } from "react"
import { useForm } from "react-hook-form"
import RiderRegister from "../components/register/RiderRegister"
import CustomerRegister from "../components/register/CustomerRegister"
import RestaurantRegister from "../components/register/RestaurantRegister"


const Register = () => {
  //variables
  const [accountType, setAccountType] = useState("")

  const {
    register,
    handleSubmit,
    watch,
    formState: { errors },
  } = useForm()

  const onSubmit = (data) => console.log(data)

  return (
    <>
      <div className="position-fixed top-0 w-100 h-100 bg-gradient overflow-auto bg-warning-subtle">
        <h2 className="text-center m-3">Registration</h2>
        <div className="container p-4">
          <form onSubmit={handleSubmit(onSubmit)}>
            <label className="form-label">
              Choose how you want to register:
            </label>
            <select
              className="form-select"
              {...register("accountType", {
                onChange: (e) => {
                  setAccountType(e.target.value)
                },
              })}
            >
              <option value="" hidden>
                Choose an account type
              </option>
              <option value="CUS">Customer</option>
              <option value="RES">Restaurant</option>
              <option value="RID">Rider</option>
            </select>
          </form>
          {accountType === "RID" && <RiderRegister />}
          {accountType === "CUS" && <CustomerRegister />}
          {accountType === "RES" && <RestaurantRegister />}
        </div>
      </div>
    </>
  )
}

export default Register
