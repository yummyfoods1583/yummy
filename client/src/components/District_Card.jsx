import React, { useContext } from "react"
import { NavLink, useNavigate } from "react-router-dom"
import { YummyContext } from "../contexts/YummyContextProvider"
/**
 *
 * @typedef {Object} DistrictObject
 * @property {string} dist_name
 * @property {string} dist_photo
 */
/**
 * @param {{district:DistrictObject}}
 * @returns {JSX.Element}
 */
const District_Card = ({ district }) => {
  if (district.dist_photo === null) district.dist_photo = "/Images/No_Image.jpg"

  //fetch the currentDistrict
  const { currentDistrict, setCurrentDistrict } = useContext(YummyContext)
  //create a naviagator
  const navigate = useNavigate()
  return (
    <>
      <div className="card py-3 mb-3" style={{ width: "18rem" }}>
        <img
          src={district.dist_photo}
          //   className="card-img"
          alt="..."
          width={"260px"}
          height={"200px"}
        />
        <div className="card-body">
          <h5 className="card-title text-center">{district.dist_name}</h5>
          <div className="d-flex justify-content-center">
            <button className="btn btn-primary" onClick={(e) => {
              setCurrentDistrict(district.dist_name)
              navigate('/restaurants')
            }}>
              Visit
            </button>
          </div>
        </div>
      </div>
    </>
  )
}

export default District_Card
