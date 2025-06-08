import { createContext, useState } from "react"

// Create and export the context
export const YummyContext = createContext()

const YummyContextProvider = ({ children }) => {
  const [districts, setDistricts] = useState([])
  const [currentDistrict, setCurrentDistrict]=useState("")

  return (
    <YummyContext.Provider
      value={{
        districts,
        setDistricts,
        currentDistrict,
        setCurrentDistrict
      }}
    >
      {children}
    </YummyContext.Provider>
  )
}

export default YummyContextProvider
