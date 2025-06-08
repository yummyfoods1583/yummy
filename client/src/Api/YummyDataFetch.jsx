import axios from "axios"
import React from "react"
const ServerPort = 3000

const YummyDataFetch = axios.create({
  baseURL: `http://localhost:${ServerPort}/api/v1`,
})

export default YummyDataFetch
