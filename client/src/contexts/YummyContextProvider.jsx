import { createContext, useState } from "react"

// Create and export the context
export const YummyContext = createContext()

const YummyContextProvider = ({ children }) => {
  const [districts, setDistricts] = useState([])
  const [currentDistrict, setCurrentDistrict] = useState("")
  const [current_user, setCurrentUser] = useState(null)

  return (
    <YummyContext.Provider
      value={{
        districts,
        setDistricts,
        currentDistrict,
        setCurrentDistrict,
        current_user,
        setCurrentUser,
      }}
    >
      {children}
    </YummyContext.Provider>
  )
}

export default YummyContextProvider
