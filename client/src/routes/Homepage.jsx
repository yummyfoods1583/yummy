import React, { useContext, useEffect, useState } from "react"
import Navbar from "../components/Navbar"
import Carousel from "../components/Carousel"
import District_Card from "../components/District_Card"
import YummyDataFetch from "../Api/YummyDataFetch"
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import { faArrowRight } from "@fortawesome/free-solid-svg-icons"
import { Link } from "react-router-dom"
import { YummyContext } from "../contexts/YummyContextProvider"

const Homepage = () => {
  //fetch all the districts
  const { districts, setDistricts } = useContext(YummyContext)
  useEffect(() => {
    const fetchDistricts = async () => {
      const response = await YummyDataFetch.get("/districts")
      setDistricts(response.data.data.districts)
    }
    fetchDistricts()
  }, [])

  return (
    <>
      <Navbar />
      <Carousel />
      {districts == undefined || districts == null ? (
        <div>loading...</div>
      ) : (
        <div className="container-fluid p-3 mt-3">
          <div className="row d-flex justify-content-evenly">
            {districts.slice(0, 20).map((district) => {
              return (
                <District_Card district={district} key={district.dist_name} />
              )
            })}
          </div>
          <div className="d-flex justify-content-center">
            <Link className="btn btn-outline-primary" to="/districts">
              View All The Districts{"  "}
              <FontAwesomeIcon
                icon={faArrowRight}
                style={{ color: "#63E6BE" }}
              />
            </Link>
          </div>
        </div>
      )}
    </>
  )
}

export default Homepage
