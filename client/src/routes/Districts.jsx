import React, { useContext, useEffect } from "react"
import Navbar from "../components/Navbar"
import { YummyContext } from "../contexts/YummyContextProvider"
import District_Card from "../components/District_Card"
import YummyDataFetch from "../Api/YummyDataFetch"
const Districts = () => {
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
      {districts == undefined || districts == null ? (
        <div>loading...</div>
      ) : (
        <div className="container-fluid p-3 mt-3">
          <div className="row d-flex justify-content-evenly">
            {districts.map((district) => {
              return <District_Card district={district} />
            })}
          </div>
        </div>
      )}
    </>
  )
}

export default Districts
